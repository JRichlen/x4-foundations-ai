# Agent Skills Research - Phase 1: Source Filtering

**Date:** 2026-02-02  
**Phase:** Source Filtering (Quick Pass)  
**Objective:** Identify sources with relevant skills for X4 Foundations AI Assistant

---

## Filtering Criteria

A source will be **filtered out** if:

- Repository is empty or archived
- Contains only documentation/guides (no actual skills/tools)
- Language-specific and incompatible (e.g., Python-only when we need TypeScript/JavaScript)
- Not related to AI agents, MCP, or relevant tooling
- Access is restricted or repository doesn't exist

A source is **viable** if:

- Contains actual skills, tools, or MCP servers
- Skills are language-agnostic or compatible with TypeScript/JavaScript
- Repository is active and maintained
- Has clear documentation or code examples

---

## Quick Pass Results

### Viable Sources (Move to Phase 2)

| #   | Repository                                          | Reason                                                                      | Skills Preview                                                                      |
| --- | --------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 1   | anthropics/skills                                   | Canonical Claude Skills repository with 50+ production-grade skills         | Document processing, webapp testing, MCP server builder, creative tools             |
| 2   | openai/skills                                       | Official Skills Catalog for Codex with tiered skill structure               | gh-address-comments, gh-fix-ci, notion-knowledge-capture                            |
| 3   | huggingface/skills                                  | Agent skills for ML workflows, cross-platform compatible                    | hf-cli, hf-datasets, hf-trainer, hf-evaluation, hf-jobs                             |
| 4   | skillcreatorai/Ai-Agent-Skills                      | Universal skills installer ("Homebrew for AI Agent Skills"), cross-platform | Frontend, backend, code review, refactoring, document handling, testing skills      |
| 5   | karanb192/awesome-claude-skills                     | Curated list of 50+ Claude Skills, community-maintained                     | TDD, debugging, git workflows, security, data analysis, writing assistance          |
| 8   | DougTrajano/pydantic-ai-skills                      | Type-safe Python framework for Agent Skills, Anthropic-compatible           | Progressive disclosure, skill validation, security features                         |
| 11  | gradion-ai/freeact-skills                           | Skills for freeact agent library with programmatic tool chaining            | Executable Python-based workflows, domain knowledge chunks                          |
| 17  | chrisvoncsefalvay/claude-d3js-skill                 | D3.js data visualization skill for Claude                                   | Data visualization, charting capabilities                                           |
| 18  | lackeyjb/playwright-skill                           | Browser automation skill with dynamic Playwright script generation          | Web testing, UI automation, visible browser support                                 |
| 22  | gapmiss/obsidian-plugin-skill                       | Expert skill for Obsidian.md plugin development with 27 ESLint rules        | Plugin creation, validation, code quality enforcement                               |
| 25  | coffeefuelbump/csv-data-summarizer-claude-skill     | CSV data processing and summarization                                       | Data parsing, summarization, tabular data handling                                  |
| 26  | SawyerHood/dev-browser                              | Persistent browser automation with LLM-friendly DOM snapshots               | Web automation, scraping, UI testing, Chrome extension support                      |
| 28  | fractalmind-ai/agent-manager-skill                  | Multi-agent lifecycle management via tmux sessions                          | Agent start/stop/monitor, task assignment, cron scheduling                          |
| 29  | hashgraph-online/hol-claude-skills                  | Agent discovery and UAID resolution for Hedera/Web3                         | Agent search, UAID resolution, registry stats, agent chat                           |
| 30  | gmickel/sheets-cli                                  | Google Sheets CLI with explicit Agent Skills support                        | Read/write sheets, key-based updates, batch operations                              |
| 33  | muratcankoylan/Agent-Skills-for-Context-Engineering | Comprehensive context engineering skills for production agents              | Context fundamentals, compression, multi-agent patterns, memory systems, evaluation |

### Filtered Out Sources

| #   | Repository                                                  | Reason for Filtering                                            |
| --- | ----------------------------------------------------------- | --------------------------------------------------------------- |
| 6   | shajith003/awesome-claude-skills                            | Appears to be duplicate/fork of karanb192/awesome-claude-skills |
| 7   | GuDaStudio/skills                                           | Insufficient information - likely empty or undocumented         |
| 9   | OmidZamani/dspy-skills                                      | DSPy-specific, may not be compatible with MCP/Claude workflow   |
| 10  | ckanner/agent-skills                                        | Insufficient information - likely empty or undocumented         |
| 12  | gotalab/skillport                                           | Insufficient information - may not contain actual skills        |
| 13  | mhattingpete/claude-skills-marketplace                      | Marketplace/aggregator, not actual skill implementations        |
| 14  | kukapay/crypto-skills                                       | Crypto-specific, not relevant to X4 game assistant              |
| 15  | smerchek/claude-epub-skill                                  | Very narrow scope (EPUB only), low priority for X4 assistant    |
| 16  | zxkane/aws-skills                                           | AWS-specific, not directly relevant to X4 game assistant        |
| 19  | rickygao/specrate                                           | Insufficient information - purpose unclear                      |
| 20  | conorluddy/ios-simulator-skill                              | iOS-specific, not relevant to X4 game assistant                 |
| 21  | kylehughes/the-unofficial-swift-concurrency-migration-skill | Swift-specific, not compatible with TypeScript/Node.js          |
| 23  | frmoretto/stream-coding                                     | Stream coding specific, limited relevance                       |
| 24  | ameyalambat128/swiftui-skills                               | SwiftUI-specific, not compatible with TypeScript/Node.js        |
| 27  | dannwaneri/vectorize-mcp-worker                             | MCP worker but Cloudflare Workers specific                      |
| 31  | caopulan/Notification-Skill                                 | Very narrow scope (notifications only)                          |
| 32  | fabioc-aloha/spotify-skill                                  | Spotify-specific, not relevant to X4 game assistant             |
| 34  | jakedahn/pomodoro                                           | Pomodoro timer, not relevant to X4 game assistant               |
| 35  | yzfly/Mind-Cloning-Engineering                              | Research/academic focus, not practical skills                   |

### Pending Review

| #   | Repository               | Notes                               |
| --- | ------------------------ | ----------------------------------- |
| -   | All viable sources above | Ready for Phase 2 detailed research |

---

## Summary Statistics

- **Total Sources:** 35
- **Viable (Phase 2):** 16
- **Filtered Out:** 19
- **Pending:** 0

---

## Key Findings

### High-Priority Sources (Recommended for Immediate Deep-Dive)

1. **anthropics/skills** - Official Anthropic repository, canonical reference for skill structure
2. **openai/skills** - Official OpenAI Codex skills, tiered organization
3. **muratcankoylan/Agent-Skills-for-Context-Engineering** - Comprehensive context engineering patterns
4. **skillcreatorai/Ai-Agent-Skills** - Universal installer, good for skill management
5. **SawyerHood/dev-browser** - Browser automation essential for many workflows
6. **lackeyjb/playwright-skill** - Testing automation highly valuable

### Medium-Priority Sources

7. **huggingface/skills** - ML-focused but good architectural patterns
8. **karanb192/awesome-claude-skills** - Curated list, good for discovery
9. **DougTrajano/pydantic-ai-skills** - Type-safe patterns (Python but adaptable)
10. **fractalmind-ai/agent-manager-skill** - Multi-agent orchestration relevant
11. **gmickel/sheets-cli** - Data integration patterns

### Lower-Priority Sources

12-16. Domain-specific skills that may provide patterns but are not directly applicable

---

## Next Steps

1. ✅ Complete Phase 1 source filtering
2. Begin Phase 2 detailed research on high-priority sources
3. Create individual research reports for top 10 sources
4. Apply prioritization framework (MUST/NEED/SHOULD/COULD/DROP)
5. Document findings in source-specific markdown files

---

## Notes

- Research conducted via web search on 2026-02-02
- Some repositories may have limited public information
- Filtered sources can be revisited if project needs change
- Priority rankings based on relevance to X4 Foundations AI Assistant needs
