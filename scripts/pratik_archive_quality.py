"""Shared quality rules for PRATIK market checkpoint rows."""
from __future__ import annotations

import math
import re
from datetime import datetime, timezone
from decimal import Decimal

QUALITY_VERSION = "market-field-quality-v3"

MARKET_FIELDS = {
    "1X2": {
        "odds": ("odds1", "oddsx", "odds2"),
        "money": ("pct1", "amt1", "pctx", "amtx", "pct2", "amt2"),
        "volume": ("volume",),
    },
    "OU25": {
        "odds": ("over", "under"),
        "money": ("pctover", "amtover", "pctunder", "amtunder"),
        "volume": ("volume",),
    },
    "BTTS": {
        "odds": ("yes", "no"),
        "money": ("pctyes", "amtyes", "pctno", "amtno"),
        "volume": ("volume",),
    },
}

_EMPTY_MARKERS = {"", "-", "—", "–", "null", "none", "n/a", "na"}
SNAPSHOT_SELECTIONS = {
    "1X2": {"1": "1", "X": "X", "2": "2"},
    "OU25": {"O": "over", "U": "under"},
    "BTTS": {"Y": "yes", "N": "no"},
}


def _iso_utc(value: datetime) -> str:
    if value.tzinfo is None:
        raise ValueError("Snapshot timestamp is missing timezone")
    return value.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


def _time(value):
    if isinstance(value, datetime):
        if value.tzinfo is None:
            return None
        return value
    if isinstance(value, str) and value:
        try:
            parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
        except ValueError:
            return None
        return parsed if parsed.tzinfo is not None else None
    return None


def _text_number(value) -> str:
    if value is None:
        return ""
    if isinstance(value, Decimal):
        return format(value, "f")
    return str(value).strip()


def _money_text(value) -> str:
    number = _number(value)
    return f"£ {number:g}" if number is not None and number > 0 else ""


def _share_text(value) -> str:
    number = _number(value)
    return f"{number:g}%" if number is not None and 0 <= number <= 100 else ""


def build_snapshot_fallback(
    market: str,
    grouped_rows: dict[str, list[tuple[datetime, str, dict]]],
    fixture: dict,
    target: datetime,
) -> tuple[dict | None, datetime | None, dict]:
    """Build an explicitly labelled market row from actual per-selection snapshots."""
    selections = SNAPSHOT_SELECTIONS.get(market)
    if not selections:
        raise ValueError(f"Unknown market: {market}")
    data = {
        "fixture_uid": fixture.get("fixture_uid"),
        "match_id_hash": fixture.get("match_id_hash"),
        "home": fixture.get("home", ""),
        "away": fixture.get("away", ""),
        "league": fixture.get("league", ""),
        "date": fixture.get("kickoff_utc", ""),
        "source_table": "public.moneyway_snapshots",
    }
    source_rows = []
    selected_ids = {}
    selected_times = []
    total_volume = Decimal("0")
    for selection, prefix in selections.items():
        eligible = [item for item in grouped_rows.get(selection, []) if item[0] <= target]
        if not eligible:
            continue
        latest_at = max(item[0] for item in eligible)
        observed, row_id, source = min(
            (item for item in eligible if item[0] == latest_at),
            key=lambda item: item[1],
        )
        selected_times.append(observed)
        selected_ids[selection] = source.get("id")
        odds_field = (
            {"1": "odds1", "X": "oddsx", "2": "odds2"}.get(selection)
            if market == "1X2" else
            {"O": "over", "U": "under"}.get(selection)
            if market == "OU25" else
            {"Y": "yes", "N": "no"}.get(selection)
        )
        if odds_field:
            data[odds_field] = _text_number(source.get("odds"))
        if market == "1X2":
            pct_field = {"1": "pct1", "X": "pctx", "2": "pct2"}[selection]
            amt_field = {"1": "amt1", "X": "amtx", "2": "amt2"}[selection]
        elif market == "OU25":
            pct_field = {"O": "pctover", "U": "pctunder"}[selection]
            amt_field = {"O": "amtover", "U": "amtunder"}[selection]
        else:
            pct_field = {"Y": "pctyes", "N": "pctno"}[selection]
            amt_field = {"Y": "amtyes", "N": "amtno"}[selection]
        data[pct_field] = _share_text(source.get("share"))
        data[amt_field] = _money_text(source.get("volume"))
        volume = _number(source.get("volume"))
        if volume is not None and volume > 0:
            total_volume += Decimal(str(volume))
        source_rows.append({
            "id": source.get("id"),
            "selection": selection,
            "odds": _text_number(source.get("odds")),
            "volume": _text_number(source.get("volume")),
            "share": _text_number(source.get("share")),
            "actual_at_utc": _iso_utc(observed),
        })

    if not source_rows:
        return None, None, {}
    if market == "OU25":
        data["line"] = "2.5"
    data["volume"] = _money_text(total_volume)
    data["source_selection_rows"] = source_rows
    return data, max(selected_times), selected_ids


def quality_score(market: str, row: dict) -> int:
    _, quality = classify_market_data(market, row)
    return quality["odds_fields_present"] + quality["money_fields_present"]



def _number(value) -> float | None:
    if value is None:
        return None
    text = str(value).strip().replace(",", "")
    text = text.replace("£", "").replace("%", "").strip()
    text = re.sub(r"\s+", "", text)
    if not text or text.casefold() in _EMPTY_MARKERS:
        return None
    try:
        result = float(text)
    except (TypeError, ValueError):
        return None
    return result if math.isfinite(result) else None


def _field_is_valid(field: str, value) -> bool:
    if value is None:
        return False
    text = str(value).strip()
    if text.casefold() in _EMPTY_MARKERS:
        return False
    number = _number(value)
    if field in MARKET_FIELDS["1X2"]["odds"] + MARKET_FIELDS["OU25"]["odds"] + MARKET_FIELDS["BTTS"]["odds"]:
        return number is not None and number > 1.0
    if field.startswith("pct"):
        return number is not None and 0.0 <= number <= 100.0
    if field.startswith("amt") or field == "volume":
        return number is not None and number > 0.0
    return bool(text)


def classify_market_data(market: str, row) -> tuple[str, dict]:
    """Classify source data as complete, partial, or empty for this market."""
    fields = MARKET_FIELDS.get(market)
    if not fields or not isinstance(row, dict):
        raise ValueError(f"Unknown market or invalid source row: {market}")
    odds = fields["odds"]
    money = fields["money"]
    volume = fields["volume"]
    odds_count = sum(_field_is_valid(name, row.get(name)) for name in odds)
    money_count = sum(_field_is_valid(name, row.get(name)) for name in money)
    volume_count = sum(_field_is_valid(name, row.get(name)) for name in volume)

    if odds_count == len(odds) and money_count == len(money):
        status = "PRESENT"
    elif odds_count or money_count or volume_count:
        status = "PARTIAL"
    else:
        status = "EMPTY"

    quality = {
        "odds_fields_present": odds_count,
        "odds_fields_total": len(odds),
        "money_fields_present": money_count,
        "money_fields_total": len(money),
        "volume_present": volume_count > 0,
    }
    return status, quality
