# Skill: Beads (bd)

**Source:** [steveyegge/beads](https://github.com/steveyegge/beads)  
**Link:** https://github.com/steveyegge/beads  
**Type:** CLI Tool  
**Language:** Go

---

## Description

Beads (bd) is a distributed, git-backed graph issue tracker designed specifically for AI coding agents. It provides persistent, structured memory with dependency-aware task management, replacing messy markdown plans with a dependency graph that allows agents to handle long-horizon tasks without losing context.

### Key Features

- **Git as Database:** Issues stored as JSONL in `.beads/`. Versioned, branched, and merged like code.
- **Agent-Optimized:** JSON output (`--json` flag), dependency tracking, and auto-ready task detection.
- **Zero Conflict:** Hash-based IDs (`bd-a1b2`) prevent merge collisions in multi-agent/multi-branch workflows.
- **CLI-First:** Direct command-line interface, context-efficient (~1-2k tokens vs 10-50k for MCP).
- **Invisible Infrastructure:** SQLite local cache for speed; background daemon for auto-sync.
- **Compaction:** Semantic "memory decay" summarizes old closed tasks to save context window.

---

## Evaluation

**Q1: Primary workflow support?**

- [x] YES - Supports core AI agent development workflows
- [ ] NO - Not part of primary workflows

**Justification:** Beads directly supports AI agent development by providing task tracking, dependency management, and workflow context - all essential for the multi-agent orchestration defined in AGENTS.md.

**Q2: Hard failure or safety risk if missing?**

- [ ] YES - Critical for system operation or safety
- [x] NO - System can operate without it

**Justification:** The X4 Assistant can function without beads. It's a workflow enhancement, not a runtime dependency.

**Q3: Meaningful improvement for common cases?**

- [x] YES - Users will notice the quality/UX improvement
- [ ] NO - Edge case or rare scenario

**Justification:** Agent task tracking and workflow context significantly improve development velocity and coordination across sessions.

---

## Category

- [ ] ✅ MUST HAVE
- [x] 🟩 NEED TO HAVE
- [ ] 🟨 SHOULD HAVE
- [ ] 🟦 COULD HAVE
- [ ] 🚫 DROP (for now)

---

## Reason

Beads provides critical agent workflow infrastructure (task tracking, dependency graphs, session context) that aligns with the project's multi-agent orchestration strategy in AGENTS.md.

---

## Integration Notes

### Installation Methods

Choose one method to install the CLI:

```bash
# Homebrew (recommended for macOS/Linux)
brew install beads

# npm
npm install -g @beads/bd

# Go (requires Go 1.24+)
go install github.com/steveyegge/beads/cmd/bd@latest

# Install script (Linux/macOS/FreeBSD)
curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash
```

### Project Initialization

```bash
# Initialize beads in the project
cd x4-foundations-ai
bd init --quiet

# Verify installation
bd version
bd help
```

### Essential Commands

| Command | Action |
|---------|--------|
| `bd ready` | List tasks with no open blockers |
| `bd create "Title" -p 0` | Create a P0 task |
| `bd show <id>` | View task details and audit trail |
| `bd close <id>` | Complete work |
| `bd sync` | Sync with git (run at session end) |
| `bd list` | List all issues |
| `bd dep add <child> <parent>` | Link tasks with dependencies |

### JSON Output for Agents

All commands support `--json` flag for structured output:

```bash
bd ready --json
bd show <id> --json
bd create "Title" -p 1 --json
```

### Agent Session Workflow

1. **Start Session:** Run `bd ready` to find unblocked work
2. **During Work:** Create sub-issues as needed with `bd create`
3. **End Session:** Run `bd sync` to persist all changes to git

### Hierarchy Support

Beads supports hierarchical IDs for epics:

- `bd-a3f8` (Epic)
- `bd-a3f8.1` (Task)
- `bd-a3f8.1.1` (Sub-task)

---

## Dependencies

**Runtime:**
- Git (for sync)

**No other runtime dependencies** - single static binary.

---

## Compatibility

- ✅ Works with any environment with shell access
- ✅ Works with VS Code + GitHub Copilot (via CLI)
- ✅ Works with Claude Code
- ✅ Works with Cursor
- ✅ Works with terminal/scripts
- ✅ Git-based sync (no external services)
- ✅ Offline-first operation

---

## Estimated Effort

- [x] Small (< 1 day)
- [ ] Medium (1-3 days)
- [ ] Large (> 3 days)

**Breakdown:**
- CLI installation: 5 minutes
- Project initialization: 5 minutes
- Documentation updates: 30 minutes

---

## References

- [README](https://github.com/steveyegge/beads#readme)
- [Installation Guide](https://github.com/steveyegge/beads/blob/main/docs/INSTALLING.md)
- [Agent Instructions](https://github.com/steveyegge/beads/blob/main/AGENT_INSTRUCTIONS.md)
- [FAQ](https://github.com/steveyegge/beads/blob/main/docs/FAQ.md)

---

**Researched:** 2026-02-02  
**Researcher:** AI Agent
