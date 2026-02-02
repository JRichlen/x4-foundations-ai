# Agent Skills Research

This directory contains research findings for evaluating agent skills from community sources.

## Structure

```
agent-skills-research/
├── README.md                    # This file
├── 00-source-filter.md          # Phase 1: Quick filtering results ✅
├── [source-name].md             # Phase 2: Detailed research per source (16 files)
└── FINAL-REPORT.md              # Phase 3: Synthesis and recommendations
```

## Research Process

### Phase 1: Source Filtering

Quick pass through all sources to identify viable ones.

**Status:** ✅ Complete  
**Output:** `00-source-filter.md`  
**Results:** 16 viable sources identified, 19 filtered out

### Phase 2: Detailed Research

Deep dive into each viable source, evaluating individual skills.

**Status:** 🟡 In Progress  
**Output:** One `[source-name].md` file per researched source

**High Priority Sources:**
1. anthropics/skills
2. openai/skills
3. muratcankoylan/Agent-Skills-for-Context-Engineering
4. skillcreatorai/Ai-Agent-Skills
5. SawyerHood/dev-browser
6. lackeyjb/playwright-skill

### Phase 3: Synthesis

Compile findings, identify overlaps, create prioritized recommendations.

**Status:** ⚪ Not Started  
**Output:** `FINAL-REPORT.md`

## How to Use

1. **Review Filtering:** Start with `00-source-filter.md` for the complete source analysis
2. **Track Progress:** See `../agent-skills-sources.md` for status on each source
3. **Deep Dive:** Each viable source will get its own markdown file with detailed evaluation
4. **Final Decision:** Review `FINAL-REPORT.md` for implementation recommendations

## Prioritization Framework

Each skill is evaluated using a 4-question framework:

1. **Primary workflow support?** → YES/NO
2. **Hard failure or safety risk if missing?** → YES/NO (if Q1=YES)
3. **Meaningful improvement for common cases?** → YES/NO (if Q1=NO)
4. **Cheap + low-risk?** → YES/NO (if Q3=NO)

Results in 5 categories:

- ✅ **MUST HAVE** - Critical for core functionality
- 🟩 **NEED TO HAVE** - Important but not critical
- 🟨 **SHOULD HAVE** - Valuable quality improvements
- 🟦 **COULD HAVE** - Nice-to-have polish
- 🚫 **DROP** - Not worth the effort now

## Key Findings from Phase 1

### Top Sources Identified

| Source | Type | Key Value |
|--------|------|-----------|
| anthropics/skills | Canonical Reference | 50+ production skills, official patterns |
| openai/skills | Official Catalog | Tiered skill organization, Codex integration |
| muratcankoylan/Agent-Skills-for-Context-Engineering | Patterns Library | Context engineering, multi-agent patterns |
| SawyerHood/dev-browser | Browser Tool | Persistent sessions, LLM-friendly DOM |
| lackeyjb/playwright-skill | Testing Tool | Dynamic test generation, visible browser |

### Skills Categories Found

- **Core Infrastructure:** MCP server building, skill management, context handling
- **Automation:** Browser control, testing, CI/CD integration
- **Data Processing:** CSV handling, sheet integration, document processing
- **Development:** Code review, refactoring, debugging assistance
- **Integration:** Multi-agent orchestration, tool chaining

## Related Documents

- `../AGENT_SKILLS_PRD.md` - Comprehensive research plan and methodology
- `../agent-skills-sources.md` - Master source index with status tracking

---

**Last Updated:** 2026-02-02  
**Phase 1 Completed:** 2026-02-02
