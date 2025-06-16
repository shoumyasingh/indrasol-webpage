# mcp/skill_loader.py
"""
Disk loader for skills.

• Reads every sub-folder in /skills
• Parses manifest.yaml  → basic metadata
• Imports handler.py    → match(), handle()
• Returns sorted list[Skill]
"""

from __future__ import annotations

import importlib.util
import logging
import sys
from pathlib import Path
from typing  import List, Dict, Any

import yaml

from mcp.schema import Skill

LOGGER = logging.getLogger("mcp.skill_loader")


class SkillLoader:
    def __init__(self, skills_root: Path):
        self.root: Path = skills_root

    # ------------------------------------------------------------------ #
    #  Public
    # ------------------------------------------------------------------ #
    def load_all(self) -> List[Skill]:
        skills: List[Skill] = []
        seen_names: set[str] = set() 

        for folder in sorted(self.root.iterdir()):
            if not folder.is_dir():
                continue
            try:
                skill = self._load_single_skill(folder)

                # ── duplicate-name guard ──────────────────────────────
                if skill.name in seen_names:
                    raise ValueError(f"Duplicate skill name «{skill.name}»")
                seen_names.add(skill.name)
                # ──────────────────────────────────────────────────────
                skills.append(skill)
            except Exception as exc:                       # pylint: disable=broad-except
                LOGGER.exception("Failed loading skill in %s: %s", folder.name, exc)

        # ------------------------------------------------------------------
        # Explicit, fool-proof ordering:
        #   1. lower `priority`   → earlier
        #   2. alphabetical name → deterministic tiebreaker
        # ------------------------------------------------------------------
        skills.sort(key=lambda s: (s.priority, s.name.lower()))

        LOGGER.info("Loaded %s skills: %s",
                    len(skills), [s.name for s in skills])
        return skills

    # ------------------------------------------------------------------ #
    #  Private
    # ------------------------------------------------------------------ #
    def _load_single_skill(self, folder: Path) -> Skill:
        manifest_path = folder / "manifest.yaml"
        handler_path  = folder / "handler.py"

        if not (manifest_path.exists() and handler_path.exists()):
            raise FileNotFoundError(f"{folder.name} missing manifest/handler")

        meta = _read_yaml(manifest_path)

        # --- dynamic import --------------------------------------------
        module_name = f"skills.{folder.name}.handler"
        spec        = importlib.util.spec_from_file_location(module_name, handler_path)
        if spec is None or spec.loader is None:
            raise ImportError(f"Cannot import handler for {folder.name}")
        module = importlib.util.module_from_spec(spec)
        sys.modules[module_name] = module
        spec.loader.exec_module(module)  # type: ignore

        # ── 1. Prefer a top-level `skill` object ───────────────────────
        if hasattr(module, "skill"):
            skill = module.skill
            # lightweight validation
            if not isinstance(skill, Skill):
                raise TypeError(f"{folder.name}/handler.py exports ‘skill’ but it's not an mcp.schema.Skill")

        # ── 2. Otherwise fall back to legacy match()/handle()  ─────────
        else:
            if not hasattr(module, "match") or not hasattr(module, "handle"):
                raise AttributeError(f"{folder.name}/handler.py must export either a ‘skill’ object **or** match() + handle()")

            skill = Skill(
                name     = meta["name"],
                kind     = meta.get("kind", "utility"),
                priority = int(meta.get("priority", 50)),
                timeout  = int(meta.get("timeout", 20)),
                match    = getattr(module, "match"),
                handle   = getattr(module, "handle"),
                metadata = {k: v for k, v in meta.items() if k not in {"name", "kind", "priority", "timeout"}}
            )


        LOGGER.debug("Skill loaded: %s (prio=%s)", skill.name, skill.priority)
        return skill


# ---------------------------------------------------------------------- #
#  Helpers
# ---------------------------------------------------------------------- #
def _read_yaml(path: Path) -> Dict[str, Any]:
    with path.open("r", encoding="utf-8") as fh:
        return yaml.safe_load(fh) or {}
