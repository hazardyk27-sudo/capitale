# CAPITALE Runtime Prompts

Repository methodology files are source-of-truth documentation; they do not automatically become an agent's runtime instruction.

For every new role run, use the matching bootstrap prompt first:
- `prompts/analyst_start.md`
- `prompts/news_start.md`
- `prompts/poly_start.md`
- `prompts/sxf_start.md`
- `prompts/final_start.md`

Runtime order:
1. Start ANALYST, NEWS, POLY, and SXF independently with the same intended decision AS_OF and match list.
2. Do not expose one evidence department's report to another evidence department.
3. Wait until all four reports are complete.
4. Start FINAL with `prompts/final_start.md` and provide only the four completed department reports.
5. Preserve timestamps and versions; later information requires a new run/version rather than rewriting the old decision.

A role must not silently improvise if it cannot access a required source or repository file. Missing access/data must be reported explicitly.
