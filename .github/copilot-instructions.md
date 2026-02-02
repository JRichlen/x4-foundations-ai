# GitHub Copilot Instructions

## X4 Foundations AI Assistant Development

This document provides guidance on leveraging GitHub Copilot Spaces and other AI-powered development tools for this project.

---

## Issue Tracking with Beads

This project uses **bd (beads)** for distributed, git-backed issue tracking optimized for AI agents.

### Quick Reference

| Command | Action |
|---------|--------|
| `bd ready` | List tasks with no open blockers |
| `bd create "Title" -p 0` | Create a P0 task |
| `bd show <id>` | View task details and audit trail |
| `bd close <id>` | Complete work |
| `bd sync` | Sync with git (run at session end) |
| `bd dep add <child> <parent>` | Link tasks |

### MCP Integration

With MCP configured (`.vscode/mcp.json`), you can use natural language in Copilot Chat:

| You say | Copilot does |
|---------|--------------|
| "What issues are ready to work on?" | Calls `beads_ready` |
| "Create a bug for the login timeout" | Calls `beads_create` with type=bug |
| "Show me issue bd-42" | Calls `beads_show` |
| "Mark bd-42 as complete" | Calls `beads_close` |

### Session Workflow

1. Start session: `bd ready` to find unblocked work
2. During work: Create sub-issues as needed with `bd create`
3. End session: `bd sync` to persist changes to git

For detailed instructions, see [Beads Documentation](https://github.com/steveyegge/beads).

---

## Available Spaces

### 1. X4 Foundations Space

**Purpose:** Access X4 game-specific documentation and community knowledge

**Use When:**

- Implementing X4 REST API integrations
- Understanding X4 game mechanics and data structures
- Querying station, ship, or fleet information
- Working with X4 extensions and mods
- Need game-specific terminology or concepts

**Example Queries:**

- "What are the available X4 REST API endpoints for station management?"
- "How does X4 handle faction relationships?"
- "What data structure does X4 use for ship loadouts?"
- "Explain X4 trade routes and commodity pricing"

**Tips:**

- Reference specific X4 game versions when relevant
- Ask about both vanilla and modded gameplay scenarios
- Verify API endpoint availability in X4 REST Server docs

---

### 2. MCP/Agent Development Space

**Purpose:** Access Model Context Protocol specifications and agent orchestration patterns

**Use When:**

- Implementing MCP server protocol handlers
- Designing MCP tools and resources
- Understanding agent communication patterns
- Working with multi-agent orchestration
- Implementing context management

**Example Queries:**

- "How do I implement an MCP tool with complex parameters?"
- "What's the proper way to handle MCP protocol errors?"
- "Best practices for MCP resource caching?"
- "How to structure an MCP server with multiple tool categories?"
- "Agent orchestration patterns for research and implementation"

**Tips:**

- Reference the MCP specification version (if specified)
- Ask about real-world implementation examples
- Consider error handling and edge cases early
- Follow the agent orchestration patterns defined in `AGENTS.md`

---

### 3. Vercel AI SDK Space

**Purpose:** Access Vercel AI SDK documentation and integration patterns

**Use When:**

- Building the browser overlay UI
- Integrating AI chat capabilities
- Working with streaming responses
- Implementing React hooks for AI interactions
- Handling AI model selection and configuration

**Example Queries:**

- "How to implement streaming chat with Vercel AI SDK in React?"
- "What's the best way to handle AI response errors?"
- "How to integrate custom UI components with useChat hook?"
- "Best practices for managing conversation history?"
- "How to implement tool calling in Vercel AI SDK?"

**Tips:**

- Check compatibility with React version used in project
- Consider streaming vs. non-streaming responses
- Plan for error states and loading indicators
- Think about mobile responsiveness

---

## Development Workflow with Copilot

### 1. Starting a New Feature

```typescript
// 1. Use Research Space to gather context
// @space X4 Foundations - "How does X4 station management API work?"
// @space MCP/Agent - "MCP tool implementation patterns"

// 2. Define your interfaces with Copilot assistance
interface StationInfo {
  // Let Copilot suggest fields based on X4 context
}

// 3. Implement with inline completions
async function getStationInfo(stationId: string): Promise<StationInfo> {
  // Copilot will suggest implementation based on context
}
```

### 2. Writing Tests

```typescript
// Describe test scenarios in comments, let Copilot generate
describe('StationInfo Tool', () => {
  // Test successful station retrieval
  // Test error handling for invalid station ID
  // Test caching behavior
});
```

### 3. Documentation

```markdown
# Let Copilot help generate documentation

## API Reference

### getStationInfo

<!-- Copilot can suggest parameter descriptions and examples -->
```

---

## Best Practices

### Do's ✅

1. **Use Spaces Proactively**
   - Query Spaces during research phase
   - Reference Space knowledge in code comments
   - Validate Space suggestions against official docs

2. **Provide Context**
   - Include relevant file context in your workspace
   - Reference related code in prompts
   - Use descriptive variable and function names

3. **Iterate with Copilot**
   - Accept suggestions that align with project patterns
   - Modify suggestions to fit codebase style
   - Use inline chat for complex refactoring

4. **Follow Project Standards**
   - Use Copilot to generate code that matches existing patterns
   - Let Copilot help with TypeScript types
   - Ask Copilot to follow ESLint rules

5. **Test Generation**
   - Use Copilot to generate test scaffolding
   - Let it suggest edge cases
   - Ask for both positive and negative test cases

### Don'ts ❌

1. **Don't Blindly Accept**
   - Review all Copilot suggestions
   - Verify against project architecture
   - Test generated code

2. **Don't Skip Type Safety**
   - Ensure TypeScript types are proper
   - Don't use `any` unnecessarily
   - Validate against `tsconfig.base.json`

3. **Don't Ignore Linting**
   - Fix ESLint warnings immediately
   - Don't disable rules without reason
   - Keep Prettier formatting consistent

4. **Don't Generate Insecure Code**
   - Review for security vulnerabilities
   - Validate input handling
   - Check for hardcoded secrets

5. **Don't Over-Complicate**
   - Keep solutions simple
   - Follow YAGNI (You Aren't Gonna Need It)
   - Prefer clarity over cleverness

---

## Common Patterns

### MCP Tool Implementation

```typescript
// Use @space MCP/Agent to get implementation patterns
import { MCPTool } from '@/types/mcp';

export const myTool: MCPTool = {
  name: 'tool_name',
  description: 'Tool description',
  inputSchema: {
    // Let Copilot suggest JSON schema
  },
  handler: async (params) => {
    // Implementation with error handling
  },
};
```

### X4 REST API Integration

```typescript
// Use @space X4 Foundations for API patterns
async function fetchX4Data(endpoint: string) {
  const baseUrl = process.env.X4_REST_URL;
  // Copilot will suggest proper error handling and types
}
```

### React Component with AI

```typescript
// Use @space Vercel AI SDK for integration patterns
import { useChat } from '@ai-sdk/react';

export function ChatInterface() {
  const { messages, input, handleSubmit } = useChat();
  // Copilot will suggest UI implementation
}
```

---

## Troubleshooting

### Copilot Not Providing Relevant Suggestions

**Solutions:**

1. Add more context in comments
2. Open related files in workspace
3. Use explicit Space queries
4. Describe expected behavior clearly
5. Check for syntax errors that might confuse Copilot

### Space Queries Not Working

**Solutions:**

1. Verify Space access in GitHub settings
2. Use correct Space name syntax
3. Rephrase query for clarity
4. Try breaking down complex queries
5. Check GitHub Copilot subscription status

### Generated Code Doesn't Match Project Style

**Solutions:**

1. Reference existing similar code
2. Use `.editorconfig` and Prettier
3. Provide style examples in comments
4. Set up ESLint properly
5. Use Copilot's refactoring suggestions

---

## Example Workflows

### Implementing a New MCP Tool

1. **Research** (Use X4 and MCP Spaces)

   ```
   @space X4 Foundations - "X4 REST API for faction information"
   @space MCP/Agent - "MCP tool schema for complex parameters"
   ```

2. **Design** (Let Copilot help with types)

   ```typescript
   // Define tool interface
   interface FactionInfoParams {
     // Copilot suggests based on research
   }
   ```

3. **Implement** (Use inline completions)

   ```typescript
   export const factionInfoTool = {
     // Copilot generates based on patterns
   };
   ```

4. **Test** (Generate test cases)
   ```typescript
   describe('factionInfoTool', () => {
     // Copilot suggests comprehensive tests
   });
   ```

### Building Overlay Component

1. **Research** (Use Vercel AI SDK Space)

   ```
   @space Vercel AI SDK - "React component with streaming chat"
   ```

2. **Component Structure**

   ```typescript
   // Copilot suggests based on SDK patterns
   export function GameOverlay() {
     // Implementation follows React best practices
   }
   ```

3. **Styling** (Use inline suggestions)
   ```typescript
   // Copilot can suggest Tailwind classes or styled-components
   ```

---

## Integration with Agent Orchestration

When working with the agent orchestration system (see `AGENTS.md`):

1. **Research Agent Phase:** Use Spaces to gather context
2. **Architect Agent Phase:** Use Copilot for design suggestions
3. **Implementation Agent Phase:** Use inline completions for code
4. **Validation Agent Phase:** Use Copilot for test generation
5. **Documentation Agent Phase:** Use Copilot for doc updates

---

## Tips for Maximum Productivity

1. **Keep Workspace Clean:** Open only relevant files
2. **Use Comments:** Write intent before implementation
3. **Iterate Quickly:** Accept → Test → Refine
4. **Learn Patterns:** Pay attention to suggestions
5. **Stay Updated:** Check for Copilot updates and new features
6. **Combine Tools:** Use Spaces + Inline + Chat together
7. **Trust but Verify:** Always review generated code
8. **Share Knowledge:** Document useful patterns discovered

---

## Resources

- [GitHub Copilot Documentation](https://docs.github.com/copilot)
- [MCP Specification](https://modelcontextprotocol.io/)
- [Vercel AI SDK Docs](https://sdk.vercel.ai/docs)
- [X4 REST Server](https://github.com/Alia5/X4-rest-server)
- Project PRD: `docs/PRD.md`
- Agent Orchestration: `AGENTS.md`

---

**Last Updated:** 2026-02-02  
**Next Review:** End of Phase 1
