# Security Specification - Karma3

## Data Invariants
1. Risks must have a valid ID and domain.
2. Services must have a valid status from the enum.
3. Dashboard config is a singleton at `/configs/dashboard`.
4. All timestamps must be server-generated.

## The Dirty Dozen Payloads (Rejection Tests)
1. **Unauthenticated Write**: Attempting to add a risk without login.
2. **Schema Bypass**: Adding a risk with a non-enum `crit` value.
3. **Shadow Field**: Adding `isAdmin: true` to a risk document.
4. **Invalid ID**: Using a 2KB string as a document ID.
5. **Type Poisoning**: Sending `claims: "47"` (string instead of number) in a zone.
6. **Immutable Field Attack**: Attempting to change `id` on a risk during update.
7. **Cross-User Deletion**: User A deleting User B's configuration (if we had users, currently shared).
8. **Resource Exhaustion**: Sending a 1MB string in `desc`.
9. **State Shortcut**: Setting a service efficiency to 200%.
10. **Orphaned Writes**: Creating a recommendation without an ID.
11. **Spoofed Timestamps**: Sending a manual `updatedAt` instead of `request.time`.
12. **Malicious Enum**: Sending `status: 'Hacked'` in a service.

## Test Runner (Logic verification)
- `it('should deny unauthenticated users to risks')`
- `it('should allow authenticated users to read dashboard')`
- `it('should reject invalid risk criticality')`
- `it('should reject updates with restricted fields')`
