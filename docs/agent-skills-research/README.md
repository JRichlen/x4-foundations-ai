# Agent Skills Research

This directory contains research findings for evaluating agent skills from community sources.

## Structure

```
agent-skills-research/
├── README.md                    # This file
├── 00-source-filter.md          # Phase 1: Quick filtering results
├── [source-name].md             # Phase 2: Detailed research per source (30+ files)
└── FINAL-REPORT.md              # Phase 3: Synthesis and recommendations
```

## Research Process

### Phase 1: Source Filtering
Quick pass through all sources to identify viable ones.

**Status:** Not Started  
**Output:** `00-source-filter.md`

### Phase 2: Detailed Research
Deep dive into each viable source, evaluating individual skills.

**Status:** Not Started  
**Output:** One `[source-name].md` file per researched source

### Phase 3: Synthesis
Compile findings, identify overlaps, create prioritized recommendations.

**Status:** Not Started  
**Output:** `FINAL-REPORT.md`

## How to Use

1. **Start Research:** Begin with Phase 1 by reviewing `00-source-filter.md`
2. **Track Progress:** Update `../agent-skills-sources.md` as sources are completed
3. **Review Findings:** Each source gets its own markdown file with evaluation
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

## Related Documents

- `../AGENT_SKILLS_PRD.md` - Comprehensive research plan and methodology
- `../agent-skills-sources.md` - Master source index with status tracking

---

**Note:** Research is iterative and can be paused/resumed at any source.
