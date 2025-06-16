# mcp/schema.py
"""
Lightweight data-layer objects shared across the MCP runtime.
Uses `dataclasses` for speed + static type hints.
"""

from __future__ import annotations

import time
from dataclasses import dataclass, field
from typing      import Callable, Awaitable, List, Dict, Any, Optional


# ╭───────────────────────────╮
# │  I.  Conversation objects │
# ╰───────────────────────────╯
@dataclass(slots=True)
class Turn:
    """A single end-user utterance."""
    id:   str
    text: str
    ts:   float = field(default_factory=time.time)     # seconds since epoch
    meta: Dict[str, Any] = field(default_factory=dict)

    @property
    def is_user(self) -> bool:
        """True for visitor messages, False for bot messages."""
        # we tag bot turns with meta={"role": "bot"} in the router
        return self.meta.get("role") != "bot"


@dataclass(slots=True)
class Conversation:
    """Full chat transcript plus any arbitrary metadata."""
    user_id: str
    turns:   List[Turn] = field(default_factory=list)
    memory:  Dict[str, Any] = field(default_factory=dict)

    # --- helpers --------------------------------------------------------
    def add_turn(self, turn: Turn) -> None:
        self.turns.append(turn)

    @property
    def num_user_turns(self) -> int:
        return sum(1 for t in self.turns if t.is_user)

    @property
    def last_user_turn(self) -> Optional[Turn]:
        return next((t for t in reversed(self.turns)), None)
    # Legacy-skill aliases
    # --------------------
    @property
    def messages(self) -> List[Turn]:      # summariser expects .messages
        return self.turns

    @property
    def state(self) -> Dict[str, Any]:     # follow-up skill expects .state
        return self.memory

    @property
    def extras(self) -> Dict[str, Any]:    # summariser stores 'summary' here
        # lazily create a nested dict so we don’t pollute top-level memory
        if "_extras" not in self.memory:
            self.memory["_extras"] = {}
        return self.memory["_extras"]
    
    @property
    def turn_index(self) -> int:
        """0-based index of the **current** turn (len-1)."""
        return len(self.turns) - 1            # == -1 until first add_turn()

    @property
    def extra(self) -> Dict[str, Any]:
        """
        Historical alias some old skills expect on **Turn**.  
        We expose the shared `extras` dict here so references like
        `turn.extra[...]` keep working.
        """
        return self.extras


# ╭───────────────────────────╮
# │ II.  Result object        │
# ╰───────────────────────────╯
@dataclass(slots=True)
class Result:
    """
    Returned by every skill.  Unifies the schema the dispatcher passes
    back to FastAPI (or any other entry-point).
    """
    turn_id:      str
    text:         str
    routed_skill: str
    finished:     bool

    # optional / informative
    suggested:  List[str]        = field(default_factory=list)
    meta:       Dict[str, Any]   = field(default_factory=dict)   #  ← NEW
    latency_ms: int             = 0
    error:      Optional[str]    = None

    # ----- factory helpers ---------------------------------------------
    @classmethod
    def make_error(cls, *, turn_id: str, err_msg: str) -> "Result":
        return cls(
            turn_id      = turn_id,
            text         = err_msg,
            routed_skill = "error",
            finished     = True,
            latency_ms   = 0,
            error        = err_msg,
        )

    # FastAPI “jsonable” version
    def to_dict(self) -> Dict[str, Any]:
        return {
            "turn_id":      self.turn_id,
            "text":         self.text,
            "routed_skill": self.routed_skill,
            "finished":     self.finished,
            "suggested":    self.suggested,
            "latency_ms":   self.latency_ms,
            "error":        self.error,
        }


# ╭───────────────────────────╮
# │ III.  Skill wrapper       │
# ╰───────────────────────────╯
MatchFn  = Callable[[Turn, Conversation], bool]
HandleFn = Callable[[Turn, Conversation], Awaitable[Result]]

@dataclass(slots=True)
class Skill:
    """
    Thin wrapper around a pair of callables + manifest data.  Created by
    `SkillLoader`; never instantiate directly in business logic.
    """
    name:      str
    kind:      str
    match:     MatchFn         # sync  / fast predicate
    handle:    HandleFn        # async / heavy work
    priority:  int      = 50
    timeout:   int      = 20   # seconds
    metadata:  Dict[str, Any] = field(default_factory=dict)

    # sort-order support
    def __lt__(self, other: "Skill") -> bool:
        return self.priority < other.priority
