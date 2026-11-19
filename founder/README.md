# CAPITALE Founder Consumer — original Claude Code skill setup

The original upstream `founder-consumer` skill (MIT) is vendored unchanged at `.claude/skills/founder-consumer/`. Source: https://github.com/Jakeschincariol/founder-skill

`founder/customer.json` and `founder/pitch.md` are CAPITALE-specific **working assumptions**, not survey results. They should be reviewed before a run. The pitch quotes the Instagram bio last shared by the project owner; update it when the live profile changes.

## Requirements

Claude Code running inside this Git repository, with access to its **Agent** subagent tool and Python >= 3.8. The upstream skill is free and needs no Python pip packages. Running 20 or 100 separate model subagents may consume Claude usage or incur service fees depending on the account.

## Example: start

```bash
git clone https://github.com/hazardyk27-sudo/capitale.git
cd capitale
claude
```

Then in Claude Code:

```text
/founder-consumer --quick
```

or for the full run:

```text
/founder-consumer --n 100
```

The skill instructs Claude to call `panel.py init`, generate briefs and dispatch one subagent per persona in batches, then `check` and `tally`. Outputs are generated locally under `founder/panel/`. **Those results are not automatically committed to GitHub.** Review before deciding whether to commit generated reports, especially if private customer input is added.

## Important interpretation limitations

1. `panel.py` is unchanged from its upstream and models buyers; it names the binary outcome `buys`. Here the actual entry offer is free Instagram follow / Telegram access, **not a sale**. Do NOT publish `buy_rate` as expected follower or Telegram conversion rates.
2. Upstream buyer briefs display annual income with a $ marker; amounts in our starter customer profile are rough synthetic variation parameters, not verified real Italian incomes or Italian market estimates.
3. The upstream skill asks four price-acceptance questions, which are not meaningful for a zero-cost Instagram follow. Ignore those fields for this use case.
4. Simulated user output cannot predict Instagram recommendation eligibility, Italy reach, legal permissibility of gambling promotion, or real conversions. Do not use simulated testimonials.
5. Instagram and Telegram content related to football betting require separate compliance review for Italy.
