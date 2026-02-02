# X4 Foundations AI Assistant

An AI-powered assistant for X4 Foundations that provides real-time game data access, intelligent automation, and interactive overlay capabilities through the Model Context Protocol (MCP).

## 🚀 Features

- **MCP Server Integration**: Access X4 game data through standard MCP protocol
- **Browser Overlay**: Interactive UI for AI-powered game assistance
- **Natural Language Queries**: Ask questions about your game in plain English
- **Real-time Data**: Live access to stations, ships, fleet, and player information
- **Extensible Architecture**: Plugin system for custom tools and automation

## 📋 Project Status

**Current Phase:** Phase 1 - Foundation (In Progress)

This project is in active development. See [PRD.md](docs/PRD.md) for detailed roadmap and phase information.

## 🛠️ Tech Stack

- **MCP Server**: TypeScript, Node.js
- **Overlay UI**: React, Vercel AI SDK
- **Build System**: pnpm workspaces
- **X4 Integration**: [X4 REST Server](https://github.com/Alia5/X4-rest-server) (Python)

## 📦 Monorepo Structure

- **packages/** - Application packages
  - **mcp-server/** - MCP Server implementation
  - **overlay/** - Browser overlay application
- **vendor/** - External dependencies
  - **x4-rest-server/** - X4 REST Server (submodule)
- **docs/** - Documentation
- **.github/** - CI/CD workflows
- **AGENTS.md** - Agent orchestration plan

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- X4 Foundations game installed
- Python 3.8+ (for X4 REST Server)

### Installation

```bash
# Clone the repository
git clone https://github.com/JRichlen/x4-foundations-ai.git
cd x4-foundations-ai

# Initialize submodules (important!)
git submodule update --init --recursive

# Install dependencies
pnpm install
```

See [docs/SETUP.md](docs/SETUP.md) for detailed setup instructions.

## 📚 Documentation

- **[PRD.md](docs/PRD.md)** - Product requirements and project roadmap
- **[AGENTS.md](AGENTS.md)** - Agent orchestration and development workflow
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System architecture and design
- **[API_REFERENCE.md](docs/API_REFERENCE.md)** - API documentation
- **[SETUP.md](docs/SETUP.md)** - Installation and setup guide
- **[Copilot Instructions](.github/copilot-instructions.md)** - GitHub Copilot usage guide

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines (coming soon) before submitting PRs.

### Development Workflow

This project follows an agent orchestration model for development. See [AGENTS.md](AGENTS.md) for details on:
- Research and planning phases
- Implementation workflow
- Quality checkpoints
- Testing requirements

## 📊 Development Phases

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1: Foundation | 🟡 In Progress | Monorepo scaffolding and documentation |
| Phase 2: MCP Server | ⚪ Not Started | Core MCP server implementation |
| Phase 3: Overlay | ⚪ Not Started | Browser overlay UI |
| Phase 4: Advanced | ⚪ Not Started | Advanced features and automation |
| Phase 5: Release | ⚪ Not Started | Polish and public release |

## 🔗 Related Projects

- [X4 REST Server](https://github.com/Alia5/X4-rest-server) - REST API for X4 game data
- [Model Context Protocol](https://modelcontextprotocol.io/) - MCP specification

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [Alia5](https://github.com/Alia5) for the X4 REST Server
- Anthropic for the Model Context Protocol
- The X4 Foundations community

---

**Note**: This project is not affiliated with Egosoft or X4 Foundations. It is a community-developed tool for enhancing gameplay experience.