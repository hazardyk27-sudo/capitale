# NEWS v1.3 — Validation Protocol

Status: EXPERIMENTAL AUDIT PLAN (not a replacement for canonical role)
Date: 2026-10-19
Version: 1.3

Preserve immutable pre-match records: match/selection IDs, kickoff and AS_OF, source URLs and publication timestamps, correct player/team identity, verification status, replacement and adaptation evidence, compensation, mechanism, preference effect, counterhypothesis and abstention reason.

Store post-match audit separately: source fact correct at AS_OF YES/NO/UNKNOWN, lineup/rotation expectation fulfilled YES/PARTIAL/NO/UNKNOWN, predicted on-field mechanism confirmed YES/PARTIAL/NO/UNKNOWN, selection HIT/MISS/VOID/UNKNOWN, process notes and failure tags. Outcome agreement alone does not establish NEWS mechanism accuracy.

Aggregate dependent selections per match; compare equivalent old v1.2 versus v1.3 using the same pre-match AS_OF. Report source error rate, mechanism confirmation, replacement misreads, false strong-negative rate, abstention/coverage and only secondary selection-result agreement. Use forward chronological untouched holdout. The October 17–18 reviews motivated this design and cannot act as the unbiased test set. No numeric score calibrated at this stage.
