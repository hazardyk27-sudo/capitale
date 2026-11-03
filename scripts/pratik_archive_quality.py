"""Shared quality rules for PRATIK market checkpoint rows."""
from __future__ import annotations

import math
import re

QUALITY_VERSION = "market-field-quality-v2"

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
