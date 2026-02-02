# Setup Guide

## X4 Foundations AI Assistant

**Version:** 1.0.0  
**Last Updated:** 2026-02-02

---

## Prerequisites

### Required Software

- **Node.js:** v18.x or higher ([Download](https://nodejs.org/))
- **pnpm:** v8.x or higher ([Installation Guide](https://pnpm.io/installation))
- **Git:** v2.x or higher ([Download](https://git-scm.com/))
- **X4 Foundations:** Game installed with required extensions

### Optional Software

- **Visual Studio Code:** Recommended IDE ([Download](https://code.visualstudio.com/))
- **Docker:** For containerized X4 REST Server (optional)
- **Beads (bd):** Git-backed issue tracking for AI agents ([Installation](#beads-setup-optional))

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/JRichlen/x4-foundations-ai.git
cd x4-foundations-ai
```

### 2. Initialize Git Submodules

**Important:** This project uses a Git submodule for the X4 REST Server. You must initialize it before proceeding.

```bash
# Initialize and fetch the submodule
git submodule init
git submodule update

# Alternatively, use this single command
git submodule update --init --recursive
```

This will clone the X4 REST Server into `vendor/x4-rest-server/`.

**Verify Submodule:**

```bash
# Check that the submodule directory is populated
ls -la vendor/x4-rest-server/
```

You should see the X4 REST Server files. If the directory is empty, the submodule was not initialized correctly.

### 3. Install Dependencies

```bash
# Install all workspace dependencies
pnpm install
```

This will install dependencies for:

- Root workspace
- `packages/mcp-server/`
- `packages/overlay/`

---

## X4 REST Server Setup

The X4 REST Server is required to access X4 game data. It runs as a separate Python service.

### Installation

1. Navigate to the submodule directory:

   ```bash
   cd vendor/x4-rest-server
   ```

2. Follow the setup instructions in the X4 REST Server repository:
   - See `vendor/x4-rest-server/README.md` for detailed instructions
   - Install Python dependencies
   - Configure X4 extensions
   - Start the server

3. Verify the server is running:
   ```bash
   curl http://localhost:8080/health
   ```

### Configuration

Create a `.env` file in the project root:

```env
# X4 REST Server connection
X4_REST_URL=http://localhost:8080
X4_REST_API_KEY=your_api_key_here  # If authentication is enabled

# MCP Server configuration (Phase 2)
MCP_SERVER_PORT=3000

# Overlay configuration (Phase 3)
OVERLAY_PORT=5173
```

---

## Beads Setup (Optional)

Beads (bd) is a distributed, git-backed issue tracker for AI agents. It provides persistent task tracking with dependency management across sessions.

### Why Beads?

- **Agent-optimized:** JSON output, dependency tracking, and auto-ready task detection
- **Git-backed:** Issues sync via git, work offline, branch-scoped
- **Zero conflict:** Hash-based IDs prevent merge collisions
- **CLI-first:** Direct command-line usage, context-efficient (~1-2k tokens)

### Installation

#### 1. Install the CLI (choose one method)

```bash
# Homebrew (recommended for macOS/Linux)
brew install beads

# npm (planned / optional)
# NOTE: The npm package name for Beads may change. Check the official repo
#       at https://github.com/steveyegge/beads for the latest npm install
#       instructions and package name before using this method.
# Example (update with the actual package name from the Beads docs):
# npm install -g <beads-npm-package-name>

# Go (requires Go 1.24+)
go install github.com/steveyegge/beads/cmd/bd@latest

# Install script (Linux/macOS/FreeBSD)
curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash
```

#### 2. Initialize Beads in the Project

The project is already initialized with beads. For new clones:

```bash
cd x4-foundations-ai
bd init --quiet
```

This creates a `.beads/` directory with the issue database.

#### 3. Verify Installation

```bash
bd version
bd help
bd ready  # List available tasks
```

### Usage

| Command                       | Action                              |
| ----------------------------- | ----------------------------------- |
| `bd ready`                    | List tasks with no open blockers    |
| `bd create "Title" -p 0`      | Create a P0 (highest priority) task |
| `bd show <id>`                | View task details                   |
| `bd close <id>`               | Complete work                       |
| `bd sync`                     | Sync with git (run at session end)  |
| `bd list`                     | List all issues                     |
| `bd dep add <child> <parent>` | Link tasks with dependencies        |

### Session Workflow

1. **Start:** `bd ready` to find unblocked work
2. **Work:** Create sub-issues with `bd create` as needed
3. **End:** `bd sync` to persist changes to git

### Documentation

- [Beads Repository](https://github.com/steveyegge/beads)
- [Installation Guide](https://github.com/steveyegge/beads/blob/main/docs/INSTALLING.md)
- [Skill Research Report](./agent-skills-research/steveyegge-beads.md)

---

## Development Setup

### 1. Verify Installation

```bash
# Run from project root
pnpm run typecheck
pnpm run lint
```

All checks should pass (once implemented in Phase 2+).

### 2. IDE Configuration (VS Code)

Install recommended extensions:

- ESLint
- Prettier
- TypeScript and JavaScript Language Features

VS Code should automatically detect the workspace configuration.

### 3. Git Hooks (Future)

Git hooks for linting and testing will be added in later phases.

---

## Updating Submodules

To update the X4 REST Server to the latest version:

```bash
# Update submodule to latest commit
git submodule update --remote vendor/x4-rest-server

# Commit the submodule update
git add vendor/x4-rest-server
git commit -m "Update X4 REST Server submodule"
```

---

## Workspace Structure

- **.github/** - GitHub configuration
  - **workflows/** - GitHub Actions CI/CD
  - **copilot-instructions.md** - Copilot guidance
- **docs/** - Documentation
  - **PRD.md** - Product Requirements Document
  - **ARCHITECTURE.md** - Architecture documentation
  - **API_REFERENCE.md** - API reference
  - **SETUP.md** - This file
- **packages/** - Application packages
  - **mcp-server/** - MCP Server package (Phase 2)
  - **overlay/** - Browser Overlay package (Phase 3)
- **vendor/** - External dependencies
  - **x4-rest-server/** - X4 REST Server submodule
- **AGENTS.md** - Agent orchestration plan
- **package.json** - Root package.json
- **pnpm-workspace.yaml** - Workspace configuration
- **tsconfig.base.json** - Base TypeScript config
- **.eslintrc.cjs** - ESLint configuration
- **.prettierrc** - Prettier configuration
- **README.md** - Project overview

---

## Common Issues

### Submodule Directory is Empty

**Problem:** The `vendor/x4-rest-server/` directory exists but is empty.

**Solution:**

```bash
git submodule update --init --recursive
```

### X4 REST Server Won't Start

**Problem:** Python server fails to start.

**Solution:**

1. Check Python version (3.8+ required)
2. Install Python dependencies
3. Verify X4 game extensions are installed
4. Check X4 REST Server logs for errors

### Dependencies Won't Install

**Problem:** `pnpm install` fails.

**Solution:**

1. Verify Node.js version: `node --version` (18+ required)
2. Verify pnpm version: `pnpm --version` (8+ required)
3. Clear pnpm cache: `pnpm store prune`
4. Try again: `pnpm install`

### TypeScript Errors

**Problem:** TypeScript shows errors in IDE.

**Solution:**

1. Ensure TypeScript language service is running in VS Code
2. Restart TypeScript server: Cmd/Ctrl + Shift + P → "Restart TS Server"
3. Check `tsconfig.base.json` is present
4. Run `pnpm run typecheck` to verify

---

## Next Steps

### Phase 1 (Current)

- ✅ Repository cloned
- ✅ Submodules initialized
- ✅ Dependencies installed
- ✅ X4 REST Server setup

### Phase 2 (MCP Server Development)

- [ ] Implement MCP server
- [ ] Create X4 REST client
- [ ] Add MCP tools
- [ ] Write tests

### Phase 3 (Overlay Development)

- [ ] Create React overlay
- [ ] Add WebSocket connection
- [ ] Implement chat interface
- [ ] Style UI components

---

## Getting Help

### Documentation

- [PRD Document](./PRD.md) - Project overview and phases
- [Agent Orchestration](../AGENTS.md) - Development workflow
- [Architecture](./ARCHITECTURE.md) - System design
- [API Reference](./API_REFERENCE.md) - API documentation

### External Resources

- [X4 REST Server Docs](https://github.com/Alia5/X4-rest-server)
- [MCP Specification](https://modelcontextprotocol.io/)
- [pnpm Documentation](https://pnpm.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Community

- GitHub Issues: Report bugs or request features
- GitHub Discussions: Ask questions or share ideas

---

## Contributing

See `CONTRIBUTING.md` (to be created) for contribution guidelines.

---

**Last Updated:** 2026-02-02  
**Next Review:** End of Phase 1
