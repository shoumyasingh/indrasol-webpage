# Memory Skill

Single read / write gateway for the `conversation_memory` table.

## Why?

* Keeps DB logic out of every agent  
* Guarantees one consistent merge-strategy  
* Makes unit-testing easy (mock this skill)

## Contract

```yaml
input:
  user_id: UUID string (required)
  patch:   object (optional)  # partial memory dict

output:
  status:  "ok" | "error"
  memory:  full memory row (object)
  error:   string – only on failure
