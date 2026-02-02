# Agent Skills Research - gmickel/sheets-cli

**Source:** gmickel/sheets-cli  
**Link:** https://github.com/gmickel/sheets-cli  
**Type:** CLI Tool / Agent Skill  
**Language:** TypeScript (Bun runtime)  
**Research Date:** 2026-02-02

---

## Overview

A composable Google Sheets CLI designed for both humans and AI agents. Provides read, write, and update operations with JSON output, making it ideal for data export and integration workflows.

---

## Key Features

### 1. Core Operations

| Command      | Description                         |
| ------------ | ----------------------------------- |
| `read table` | Read entire sheet or specific range |
| `append`     | Add rows with JSON data             |
| `update key` | Update cells by key column value    |
| `batch`      | Multiple operations in one call     |

### 2. Agent Integration

- Installs as skill for Claude Code, Codex
- Auto-triggers when spreadsheets mentioned
- JSON output for programmatic use

### 3. Key-Based Updates

```bash
# Update by key (not fragile row indices)
sheets-cli update key \
  --sheet "Projects" \
  --key-col "Name" \
  --key "Acme" \
  --set '{"Status":"Done"}'
```

### 4. Authentication

- OAuth with Google Sheets/Drive APIs
- Secure credential storage
- Refresh token handling

---

## Evaluation

### Overall Assessment

**Q1: Primary workflow support?**

- [ ] NO - Data export is secondary workflow

**Q3: Meaningful improvement for common cases?**

- [x] YES - Users may want to export game data to sheets

### Category: 🟨 SHOULD HAVE

**Reason:** Enables exporting X4 game data (stations, fleets, trade routes) to Google Sheets for analysis or sharing.

---

## X4 Use Cases

### 1. Station Inventory Export

```bash
# Export station inventory to sheet
sheets-cli append \
  --sheet "Station Inventory" \
  --data '[{"Station":"Argon Prime Wharf","Wares":150,"Credits":500000}]'
```

### 2. Trade Route Tracking

```bash
# Update trade route status
sheets-cli update key \
  --sheet "Trade Routes" \
  --key-col "Route ID" \
  --key "TR-001" \
  --set '{"Profit":"1.2M","Status":"Active"}'
```

### 3. Fleet Overview

```bash
# Read fleet data
sheets-cli read table --sheet "Fleet Ships" --limit 50
```

### 4. Game Statistics Dashboard

- Export periodic snapshots
- Track progress over time
- Share with community

---

## Integration Patterns

### 1. MCP Tool Wrapper

```typescript
// MCP tool that exports to Google Sheets
const exportToSheetssTool = {
  name: 'export_to_sheets',
  description: 'Export X4 data to Google Sheets',
  inputSchema: {
    type: 'object',
    properties: {
      sheet: { type: 'string' },
      data: { type: 'array' },
    },
  },
  handler: async (params) => {
    // Call sheets-cli via subprocess
    return await execSheetsCLI('append', params);
  },
};
```

### 2. Scheduled Exports

```bash
# Cron job for periodic exports
0 * * * * sheets-cli append --sheet "Hourly Stats" --data "$(x4-stats)"
```

### 3. Agent-Initiated Export

User: "Export my fleet information to Google Sheets"
Agent: Uses sheets-cli skill to export data

---

## Technical Requirements

### Dependencies

- Bun runtime
- Google Cloud project
- OAuth credentials

### Setup Steps

1. Clone and build: `bun install && bun run build`
2. Configure Google OAuth
3. Authenticate: `sheets-cli auth login`
4. Set default spreadsheet ID

### Skill Installation

```bash
# For Claude Code
sheets-cli install-skill --global

# For Codex
sheets-cli install-skill --codex
```

---

## Summary

### Priority: 🟨 SHOULD HAVE

| Aspect                 | Assessment                        |
| ---------------------- | --------------------------------- |
| **X4 Relevance**       | Medium - Data export capability   |
| **Pattern Value**      | High - Agent skill integration    |
| **Integration Effort** | Medium - OAuth setup required     |
| **Recommendation**     | Phase 3+ for data export features |

### Key Takeaways

1. **Data Export:** Enables sharing X4 data externally
2. **Agent Integration:** Works as Claude/Codex skill
3. **JSON Output:** Easy to integrate with MCP tools
4. **Defer Setup:** OAuth complexity suggests Phase 3+

### Implementation Recommendations

1. **Phase 3:** Study integration patterns
2. **Phase 4:** Implement export-to-sheets MCP tool
3. **Consider:** CSV export as simpler alternative first

---

**Research Status:** 🟢 Complete  
**Last Updated:** 2026-02-02
