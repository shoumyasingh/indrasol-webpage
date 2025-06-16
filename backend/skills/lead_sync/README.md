# Lead-Sync Skill

Central “single source of truth” for inserting lead records.

## Features

* ✅ Duplicate-guard (24 h by email + channel)  
* ✅ Mirrors **qualified** leads to the legacy `qualified_leads` CRM table  
* ✅ Simple JSON contract (status + optional error)  
* ✅ No hard dependency on other skills – call it from anywhere

## Contract

### Input

| field      | type        | req. | notes                                   |
| ---------- | ----------- | ---- | --------------------------------------- |
| `user_id`  | string (UUID) | ✓  | Visitor key                             |
| `name`     | string      | ✓    |                                          |
| `email`    | string      | ✓    | lower-cased internally                  |
| `company`  | string      |      | nullable                                |
| `message`  | string      |      | nullable                                |
| `channel`  | string[]    | ✓    | Values: `email`, `indrabot`, `teams`…   |
| `qualified`| boolean     |      | default **false**                       |

### Output

```json
# on success
{ "status": "ok" }

# duplicate lead (within 24 h)
{ "status": "duplicate" }

# unexpected failure
{ "status": "error", "error": "trace / message" }
