# Agent Skills Research - lackeyjb/playwright-skill

**Source:** lackeyjb/playwright-skill  
**Link:** https://github.com/lackeyjb/playwright-skill  
**Type:** Claude Skill / Browser Automation  
**Language:** JavaScript  
**Research Date:** 2026-02-02

---

## Overview

A Claude Code skill that enables autonomous Playwright-based browser automation. Unlike template-based tools, this skill empowers Claude to dynamically generate and execute custom Playwright scripts based on natural language descriptions.

---

## Key Capabilities

### 1. Dynamic Script Generation

- Claude writes Playwright scripts on-the-fly
- No predefined templates or workflows
- Handles any web automation scenario
- Natural language to test code

### 2. Model-Invoked Execution

- Claude decides when to use the skill
- Autonomous tool selection
- Contextual invocation
- Results returned inline

### 3. Real-Time Visible Browser

- Non-headless by default
- Watch tests as they run
- Visual debugging support
- Immediate feedback

### 4. Zero Module Resolution Errors

- Universal executor (run.js)
- Proper Node module resolution
- Works globally or per-project
- Plugin system compatible

### 5. Progressive Documentation

- Split documentation approach
- Loads only necessary instructions
- Full API reference on demand
- Optimized for token efficiency

---

## Technical Details

### Requirements

- Node.js v18+
- Claude Code CLI
- Playwright (auto-resolved)

### Installation

```bash
# Via Claude Code plugin system
/plugin install playwright-skill

# Manual installation
git clone https://github.com/lackeyjb/playwright-skill.git
cp -r playwright-skill/playwright-skill ~/.claude/skills/
```

### Features

- Automatic dev server detection (ports 3000, 5173, 8080, etc.)
- Temp file management (scripts in /tmp)
- Clean artifact handling
- Helper utilities for common patterns

---

## Skill Evaluation

### Skill: playwright-skill

**Type:** Tool / Test Automation  
**Language:** JavaScript (Playwright)

#### Description
Enables Claude to autonomously create and execute browser automation tasks via Playwright, including functional testing, UI validation, form interactions, and authentication flows.

#### Evaluation

**Q1: Primary workflow support?**
- [x] YES - Testing is part of development workflow for overlay UI

**Q2: Hard failure or safety risk if missing?**
- [ ] NO - Manual testing possible, but automation improves quality

#### Category: 🟩 NEED TO HAVE

**Reason:** Critical for automated overlay UI testing and maintaining 80%+ coverage target.

#### Integration Notes

**For X4 Assistant:**
1. **Overlay Testing:** Automated component and integration tests
2. **Visual Validation:** Screenshot-based assertions
3. **User Flow Testing:** Multi-step interaction verification
4. **Regression Prevention:** Automated test suite

**Technical Considerations:**
- Playwright dependency already common in testing
- Works with React Testing Library patterns
- CI/CD integration straightforward

#### Estimated Effort: Small (< 1 day)

---

## Capabilities Comparison

### vs. dev-browser

| Feature | playwright-skill | dev-browser |
|---------|-----------------|-------------|
| **Focus** | Test automation | Full browser control |
| **Sessions** | Test-scoped | Persistent |
| **Scripts** | Dynamic generation | Batch or interactive |
| **DOM Access** | Standard Playwright | LLM-optimized |
| **Primary Use** | Testing | Automation + scraping |

**Recommendation:** Use playwright-skill for testing, dev-browser for automation workflows.

---

## Use Cases for X4 Assistant

### 1. Component Testing

```javascript
// Example: Testing station info display
test('displays station data correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/overlay');
  await page.click('[data-testid="station-search"]');
  await page.fill('input', 'Argon Prime');
  await expect(page.locator('.station-info')).toContainText('Argon Prime');
});
```

### 2. User Flow Testing

```javascript
// Example: Testing chat interaction
test('chat responds to game query', async ({ page }) => {
  await page.goto('http://localhost:3000/overlay');
  await page.fill('.chat-input', 'What ships are at my current station?');
  await page.click('.send-button');
  await expect(page.locator('.response')).toBeVisible();
});
```

### 3. Visual Regression

```javascript
// Example: Screenshot comparison
test('overlay matches design', async ({ page }) => {
  await page.goto('http://localhost:3000/overlay');
  await expect(page).toHaveScreenshot('overlay-baseline.png');
});
```

### 4. Integration Testing

```javascript
// Example: MCP tool integration
test('MCP tool returns data', async ({ page }) => {
  // Trigger tool via UI
  await page.click('[data-testid="refresh-data"]');
  // Verify data appears
  await expect(page.locator('.player-info')).not.toBeEmpty();
});
```

---

## Patterns to Adopt

### 1. Progressive Documentation

```markdown
# SKILL.md
## Quick Reference
[Minimal instructions for common tasks]

## Full API Reference
[Detailed docs, loaded on demand]
```

**Application:** Structure MCP tool documentation similarly

### 2. Auto-Detection

```javascript
// Detect dev server automatically
const servers = await detectLocalServers([3000, 5173, 8080, 8000]);
const targetUrl = servers[0] || 'http://localhost:3000';
```

**Application:** Auto-detect X4 REST server connection

### 3. Clean Artifact Management

```javascript
// Store test artifacts in temp directory
const scriptPath = path.join(os.tmpdir(), `test-${Date.now()}.js`);
// Cleanup after execution
fs.unlinkSync(scriptPath);
```

**Application:** Manage temporary files in MCP operations

### 4. Universal Module Resolution

```javascript
// Ensure modules resolve regardless of install location
const playwrightPath = require.resolve('playwright');
```

**Application:** Robust dependency handling in MCP server

---

## Summary

### Priority Assessment

| Aspect | Rating | Notes |
|--------|--------|-------|
| **X4 Relevance** | High | Essential for UI testing |
| **Complexity** | Low | Familiar Playwright patterns |
| **Dependencies** | Low | Standard testing tools |
| **Maintenance** | Low | Well-maintained project |

### Category: 🟩 NEED TO HAVE

### Key Takeaways

1. **Dynamic Generation:** Let AI write tests from descriptions
2. **Visible Execution:** Real-time debugging capability
3. **Clean Integration:** Works with existing test tooling
4. **Progressive Docs:** Efficient token usage pattern

### Implementation Recommendations

1. **Phase 2:** Study skill structure for MCP tool docs
2. **Phase 3:** Integrate for overlay component testing
3. **Ongoing:** Build automated test suite for regression prevention

### Complementary with dev-browser

- **playwright-skill:** Quick, dynamic test generation
- **dev-browser:** Complex automation and scraping
- **Together:** Complete browser interaction capability

---

**Research Status:** 🟢 Complete  
**Last Updated:** 2026-02-02
