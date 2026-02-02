# Agent Skills Research

This directory contains research findings for evaluating agent skills from community sources.

## Structure

```
agent-skills-research/
├── README.md                      # This file
├── 00-source-filter.md            # Phase 1: Quick filtering results ✅
├── 01-anthropics-skills.md        # anthropics/skills research ✅
├── 02-openai-skills.md            # openai/skills research ✅
├── 03-context-engineering.md      # Context Engineering research ✅
├── 04-skillcreatorai.md           # Ai-Agent-Skills research ✅
├── 05-dev-browser.md              # dev-browser research ✅
├── 06-playwright-skill.md         # playwright-skill research ✅
├── [additional-sources].md        # Phase 2: Remaining sources (in progress)
└── FINAL-REPORT.md                # Phase 3: Synthesis and recommendations
```

## Research Process

### Phase 1: Source Filtering

Quick pass through all sources to identify viable ones.

**Status:** ✅ Complete  
**Output:** `00-source-filter.md`  
**Results:** 16 viable sources identified, 19 filtered out

### Phase 2: Detailed Research

Deep dive into each viable source, evaluating individual skills.

**Status:** 🟡 In Progress (6/16 complete)  
**Output:** One `[source-name].md` file per researched source

**High Priority Sources (✅ ALL COMPLETE):**
1. ✅ anthropics/skills - [Report](./01-anthropics-skills.md)
2. ✅ openai/skills - [Report](./02-openai-skills.md)
3. ✅ muratcankoylan/Agent-Skills-for-Context-Engineering - [Report](./03-context-engineering.md)
4. ✅ skillcreatorai/Ai-Agent-Skills - [Report](./04-skillcreatorai.md)
5. ✅ SawyerHood/dev-browser - [Report](./05-dev-browser.md)
6. ✅ lackeyjb/playwright-skill - [Report](./06-playwright-skill.md)

**Medium Priority Sources (Pending):**
7. huggingface/skills
8. karanb192/awesome-claude-skills
9. DougTrajano/pydantic-ai-skills
10. fractalmind-ai/agent-manager-skill
11. gmickel/sheets-cli

### Phase 3: Synthesis

Compile findings, identify overlaps, create prioritized recommendations.

**Status:** ⚪ Not Started  
**Output:** `FINAL-REPORT.md`

## Preliminary Findings from High-Priority Sources

### Skills by Priority Category

| Category | Skills Identified |
|----------|------------------|
| ✅ **MUST HAVE** | mcp-builder, context-fundamentals, tool-design |
| 🟩 **NEED TO HAVE** | webapp-testing, memory-systems, context-compression, context-degradation, dev-browser, playwright-skill, backend-development, testing-patterns |
| 🟨 **SHOULD HAVE** | xlsx/docx/pdf, skill-creator, skill-installer, create-plan, multi-agent-patterns, evaluation, frontend-design, react-best-practices |
| 🟦 **COULD HAVE** | algorithmic-art, canvas-design, gh-address-comments, gh-fix-ci |
| 🚫 **DROP** | slack-gif-creator, brand-guidelines, notion-integration, etc. |

### Key Patterns Discovered

1. **SKILL.md Structure:** YAML frontmatter + markdown instructions
2. **Progressive Disclosure:** Load detailed docs only when needed
3. **Tiered Organization:** System → Curated → Experimental
4. **Context Engineering:** Fundamentals, compression, optimization
5. **LLM-Friendly Output:** Design responses for AI consumption

## How to Use

1. **Review Filtering:** Start with `00-source-filter.md` for the complete source analysis
2. **Read Reports:** Each completed source has a detailed research report
3. **Track Progress:** See `../agent-skills-sources.md` for status on each source
4. **Final Decision:** Review `FINAL-REPORT.md` (when complete) for implementation recommendations

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

## Related Documents

- `../AGENT_SKILLS_PRD.md` - Comprehensive research plan and methodology
- `../agent-skills-sources.md` - Master source index with status tracking

---

**Last Updated:** 2026-02-02  
**Phase 1 Completed:** 2026-02-02  
**Phase 2 Progress:** 6/16 high-priority sources complete
