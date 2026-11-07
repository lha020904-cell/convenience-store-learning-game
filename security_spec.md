# Security Specification: Real-Time Leaderboard

## 1. Data Invariants
1. A leaderboard entry must have valid basic fields: `playerName` (1~30 chars), `score` (0~1,000,000 number), `stamps` (0~100 number), `level` ('seed' | 'sprout' | 'fruit'), and `createdAt` (server timestamp).
2. The document ID (`entryId`) must be alphanumeric plus hyphens/underscores, maximum 128 characters (`isValidId`).
3. Deletions are forbidden from client SDKs (`allow delete: if false`).
4. Updates are strictly constrained to peer cheers: only `cheersCount` can be updated, and it can only be incremented by 1 (`incoming().cheersCount == existing().cheersCount + 1`).
5. Immutable fields (`playerName`, `score`, `stamps`, `level`, `createdAt`) cannot be altered or hijacked after creation.
6. Public read operations (`get`, `list`) are allowed so all students and teachers in the classroom can view live rankings.

## 2. The "Dirty Dozen" Threat Payloads & Guard Results
1. **Ghost Field Injection**: Attempt to create entry with `isVip: true` or `admin: true` -> **REJECTED** by `hasOnly()` key blueprint check.
2. **Jumbo String DOS**: Attempt to inject 200KB payload into `playerName` -> **REJECTED** by `.size() <= 30` constraint.
3. **Negative Score Exploit**: Attempt to pass `score: -500` -> **REJECTED** by `score >= 0` validator.
4. **Invalid Level Tampering**: Attempt to pass `level: 'super-hacker'` -> **REJECTED** by enum validation `level in ['seed', 'sprout', 'fruit']`.
5. **Score Hijack on Update**: Attempt to update `score` from 100 to 999999 -> **REJECTED** because updates only allow `cheersCount`.
6. **Cheer Inflation**: Attempt to jump `cheersCount` from 0 to 1000 in one update -> **REJECTED** by `cheersCount == existing().cheersCount + 1`.
7. **Client Timestamp Forgery**: Attempt to pass client time in the past or future -> **REJECTED** by `incoming().createdAt == request.time`.
8. **Malicious Document ID Poisoning**: Attempt to use `entryId = '../../system/admin'` -> **REJECTED** by `isValidId(entryId)`.
9. **Delete Attack**: Attempt to delete another student's high score entry -> **REJECTED** by `allow delete: if false`.
10. **Type Poisoning**: Attempt to submit `score: "one million"` (string instead of number) -> **REJECTED** by `data.score is number`.
11. **Negative Stamp Injection**: Attempt to submit `stamps: -1` -> **REJECTED** by `data.stamps >= 0`.
12. **Comment Buffer Overflow**: Attempt to submit `comment` exceeding 100 characters -> **REJECTED** by `data.comment.size() <= 100`.
