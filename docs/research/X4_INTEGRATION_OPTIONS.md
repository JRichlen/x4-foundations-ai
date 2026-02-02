# X4 Game Data Integration Options Research

## Executive Summary

This document compares two approaches for accessing X4 Foundations game data for the AI Assistant project:

1. **X4-rest-server** (Alia5) - Currently configured as a submodule
2. **X4-External-App** (mycumycu) - Alternative approach

**Recommendation:** Consider switching to **X4-External-App** for active maintenance and better community support, but be aware that **both approaches require in-game mods** - there is no mod-free option available.

---

## Comparison Summary

| Feature                | X4-rest-server (Alia5)                          | X4-External-App (mycumycu)                          |
| ---------------------- | ----------------------------------------------- | --------------------------------------------------- |
| **Last Commit**        | April 2023 (~3 years ago)                       | January 2026 (active)                               |
| **Last Release**       | May 2020 (v0.1.1 POC)                           | November 2025 (v3.5.0)                              |
| **Requires Mod**       | ✅ Yes (DLL injection)                          | ✅ Yes (Lua extension + x4_http mod)                |
| **API Type**           | REST HTTP Server                                | REST HTTP Server                                    |
| **Technology**         | C++/Rust (DLL/SO)                               | Node.js + Lua + Vue.js                              |
| **Platform Support**   | Windows & Linux                                 | Windows (native), Linux (via Proton)                |
| **Maintenance Status** | ⚠️ Appears stalled ("Project reboot" announced) | ✅ Actively maintained                              |
| **Community Activity** | Low                                             | High (regular releases, PRs merged)                 |
| **Documentation**      | Minimal (README says "Stay tuned")              | Comprehensive                                       |
| **Data Exposed**       | Game state via Lua hooks                        | Logbook, missions, player info, factions, inventory |

---

## Detailed Analysis

### 1. X4-rest-server (Current Submodule)

**Repository:** https://github.com/Alia5/X4-rest-server

#### How It Works

- Injects a shared library (DLL on Windows, SO on Linux) into the X4 game process
- Uses FFI (Foreign Function Interface) to hook into game's internal Lua functions
- Exposes hooked functions via a REST HTTP server (JSON responses)
- Port: 3002 (configurable)

#### Requirements

- **DOES require a mod** (DLL injection into game process)
- Must be placed in X4 game directory
- Triggers "modified" flag in X4
- Requires dynamic library loading support

#### Data Available

- Player information (money, current game time)
- Ships in sector
- Logbook entries
- Various game state data via Lua API exposure

#### Maintenance Status ⚠️

- **Last commit:** April 7, 2023 ("Improve / fix logbook query")
- **Last release:** May 2020 (v0.1.1 Linux POC) - nearly 6 years ago
- **README currently says:** "Project reboot - Stay tuned"
- **Status:** Appears to be in limbo; the "reboot" has been pending for years

#### Pros

- Direct access to game's Lua state (potentially more data access)
- No dependency on additional mods beyond itself
- Cross-platform (Windows & Linux native)

#### Cons

- **Appears unmaintained** - no significant updates since 2023
- DLL injection approach may be fragile with game updates
- Limited documentation
- Small community
- "Project reboot" announced but not delivered

---

### 2. X4-External-App (Alternative)

**Repository:** https://github.com/mycumycu/X4-External-App

#### How It Works

- **In-game component:** Lua/MD extension that collects game data
- **HTTP client:** Uses djfhe's x4_http mod to enable HTTP requests from Lua
- **Server:** Node.js server receives data pushed from the game
- **UI:** Vue.js SPA displays data in browser (designed for second screen/tablet)
- **Direction:** Game PUSHES data to server (vs. server PULLING from game)

#### Requirements

- **DOES require mods:**
  1. `djfhe_http` mod (HTTP client library for Lua)
  2. `mycu_external_app` mod (the actual data collector)
- Disable "Protected UI Mode" in game settings
- Node.js for the server component
- Windows required (Linux only via Steam Proton)

#### Data Available

- Logbook entries (with filtering)
- Mission offers
- Active mission details
- Player information
- Faction relations and licenses
- Player inventory (new in recent updates)
- Player goals (custom user-defined)

#### Maintenance Status ✅

- **Last commit:** January 17, 2026 (inventory widget merge)
- **Last release:** November 2025 (v3.5.0) with 278 downloads
- **Regular releases:** 5+ releases in 2025 alone
- **Active community:** PRs being merged, features being added
- **Contributors:** Multiple community contributors

#### Pros

- **Actively maintained** with regular releases
- Well-documented with clear setup instructions
- Proven stability (v3.5.0 - mature product)
- Active community with feature contributions
- Node.js-based server (easy to integrate with TypeScript MCP server)
- Widget-based architecture demonstrates extensibility

#### Cons

- Requires TWO mods to be installed (more complex setup)
- Push model (game sends data) vs. pull model (server requests data)
- May not expose all game data (focused on dashboard use case)
- Windows-focused (Linux only via Proton)

---

## Key Insight: Both Require Mods

**Important clarification:** The original concern about "building your own mod" is addressed - **both solutions require mod installation in the game**. There is currently no mod-free way to access X4 game data externally.

| Approach        | Mods Required                           |
| --------------- | --------------------------------------- |
| X4-rest-server  | 1 mod (itself - DLL/SO injection)       |
| X4-External-App | 2 mods (djfhe_http + mycu_external_app) |

The difference is:

- **X4-rest-server:** Uses low-level DLL injection (more invasive)
- **X4-External-App:** Uses X4's official extension system (less invasive)

---

## Integration with MCP Server

### X4-rest-server Integration Path

```
MCP Server (TypeScript) → HTTP GET requests → X4-rest-server (C++) → X4 Game
```

- Direct REST API calls
- Pull model (server requests data)
- Would need to understand/document available endpoints

### X4-External-App Integration Path

```
X4 Game → HTTP POST → X4-External-App Server (Node.js) → MCP Server (TypeScript)
```

- Could either:
  1. Wrap/extend the existing Node.js server
  2. Replace the server with MCP server functionality
  3. Have MCP server consume data from X4-External-App
- Push model (game sends data at intervals)
- Well-documented data structures in existing codebase

### Recommendation for MCP Integration

**X4-External-App** is more suitable for MCP integration because:

1. **Same tech stack** - Node.js/TypeScript, easier to integrate or extend
2. **Active maintenance** - bugs will be fixed, compatibility maintained
3. **Existing data structures** - can study Vue.js components for data models
4. **Community support** - help available if issues arise
5. **Proven stability** - mature 3.5.0 release

---

## Decision Points

### Choose X4-rest-server If:

- You need maximum data access beyond dashboard use cases
- You want a simpler mod installation (single DLL)
- You're willing to maintain/fix issues yourself
- The project actually reboots with active development

### Choose X4-External-App If:

- You prioritize project sustainability
- You want community support and regular updates
- The dashboard-focused data (logbook, missions, player, factions) meets your needs
- You prefer working with Node.js/TypeScript ecosystem

### Consider Custom Development If:

- Neither approach exposes the specific data you need
- You need a different data model (e.g., deep ship/station management)
- You have resources to maintain your own mod

---

## Recommended Action Plan

1. **Remove the X4-rest-server submodule** - It appears unmaintained with an uncertain future

2. **Evaluate X4-External-App** - Test if the data it exposes meets project requirements:
   - Logbook entries ✅
   - Mission offers ✅
   - Active missions ✅
   - Player info ✅
   - Faction relations ✅
   - Inventory ✅ (new)
   - Ships/Stations/Fleet? ❓ (may need extension)

3. **For MCP Server Integration:**
   - Option A: Create a separate adapter service between X4-External-App and MCP server
   - Option B: Fork X4-External-App and add MCP protocol support
   - Option C: Build on top of djfhe_http mod with custom MCP-focused data collection

4. **Update Documentation:**
   - Update README with correct integration approach
   - Document setup requirements (mods needed)
   - Update architecture diagrams

---

## Advanced Use Cases: Station Inventory & AI-Triggered Actions

Based on the requirement to access deeper game data (station inventories, stores) and trigger remote purchases via AI, here's an analysis of what's possible:

### What X4's Modding System Allows

#### Read Operations (Data Access)

- **Station inventories**: ✅ Accessible via Lua/MD scripts
- **Station stores/prices**: ✅ Accessible via Lua/MD scripts
- **Ship inventories**: ✅ Accessible via Lua/MD scripts
- **Trade offers/orders**: ✅ Accessible via Lua/MD scripts
- **Economy data**: ✅ Accessible via Lua/MD scripts

#### Write Operations (Game Modifications)

- **Direct inventory manipulation**: ⚠️ Limited - X4 expects all resource flow via trade orders
- **Create buy/sell orders**: ✅ Possible via MD scripts (trade offer manipulation)
- **Trigger trader behavior**: ✅ Possible by manipulating trade AI settings
- **Force inventory changes**: ⚠️ Only in mission/plot contexts, not general-purpose

### Recommended Architecture for AI-Triggered Actions

```
┌─────────────────────────────────────────────────────────────────────┐
│                         AI Agent (Claude/GPT)                        │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼ MCP Protocol
┌─────────────────────────────────────────────────────────────────────┐
│                    MCP Server (TypeScript/Node.js)                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐  │
│  │ Read Tools      │  │ Write Tools     │  │ Query Tools         │  │
│  │ - get_stations  │  │ - place_order   │  │ - find_best_price   │  │
│  │ - get_inventory │  │ - assign_trader │  │ - calculate_route   │  │
│  │ - get_prices    │  │ - set_trade_rule│  │ - analyze_economy   │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
        HTTP POST (commands)              HTTP GET (data requests)
                    │                               │
                    └───────────────┬───────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│              Custom X4 Extension (Lua + MD Scripts)                  │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ djfhe_http mod (HTTP client)                                 │    │
│  └─────────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Data Collector Module                                        │    │
│  │ - Polls game state                                           │    │
│  │ - Pushes updates to MCP server                               │    │
│  └─────────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Command Executor Module                                      │    │
│  │ - Receives commands from MCP server                          │    │
│  │ - Executes trade orders via MD scripts                       │    │
│  │ - Manipulates station trade rules                            │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       X4: Foundations Game                           │
└─────────────────────────────────────────────────────────────────────┘
```

### Implementation Approach Recommendation

**Do NOT create a custom DLL injection service.** Instead:

#### Phase 1: Build on Existing Foundation

1. **Use djfhe_http** as the network bridge (proven, maintained)
2. **Fork/extend X4-External-App's mod** for data collection
3. **Add command execution** via MD scripts for write operations

#### Phase 2: Custom Extension Development

Create a custom X4 extension that:

1. **Collects deep game data** (stations, inventories, prices, ships)
2. **Exposes REST endpoints** via the Node.js server
3. **Accepts commands** for trade operations

#### Why This Approach?

| Factor                | DLL Injection                        | Lua/MD Extension                  |
| --------------------- | ------------------------------------ | --------------------------------- |
| **Stability**         | Fragile with game updates            | Uses official extension system    |
| **Complexity**        | High (C++/Rust, reverse engineering) | Medium (Lua/XML, documented APIs) |
| **Maintenance**       | Must update with every game patch    | More resilient to updates         |
| **Community Support** | Limited                              | SirNukes APIs, djfhe_http, etc.   |
| **Write Operations**  | Would need game function hooks       | Uses game's intended scripting    |

### Key Resources for Custom Development

1. **SirNukes Mod Support APIs** - Essential for Lua scripting in X4
   - [Nexus Mods](https://www.nexusmods.com/x4foundations/mods/503)
   - [Steam Workshop](https://steamcommunity.com/workshop/filedetails/?id=2042901274)

2. **djfhe x4_http** - HTTP client for Lua
   - [GitHub](https://github.com/djfhe/x4_http)

3. **Automated Player Station Logistics** - Reference for trade automation patterns
   - [GitHub](https://github.com/tizubythefizo/X4-AutomatedPlayerStationLogistics)

4. **ioTools-X4Foundations** - Modding toolkit and documentation
   - [GitHub](https://github.com/iomatix/ioTools-X4Foundations)
   - [Nexus Mods](https://www.nexusmods.com/x4foundations/mods/1420)

### Example: AI-Triggered Remote Purchase Flow

```
1. User asks AI: "Buy 1000 energy cells for my station in Argon Prime"

2. AI queries MCP Server:
   - get_station_info(sector="Argon Prime")
   - get_best_price(ware="energycells", quantity=1000)
   - get_available_traders()

3. MCP Server retrieves data from X4 extension

4. AI decides optimal purchase strategy

5. AI sends command to MCP Server:
   - place_order(station_id, ware="energycells", quantity=1000, max_price=X)

6. MCP Server sends command to X4 extension

7. X4 extension executes via MD script:
   - Creates/modifies buy order on station
   - Optionally assigns available trader to fulfill

8. Extension reports back status to MCP Server → AI → User
```

### Limitations to Be Aware Of

1. **No instant transfers**: X4 requires commerce-based transactions; you can't teleport goods
2. **Trade AI behavior**: Traders follow their own logic; orders are suggestions
3. **Price-driven economy**: NPCs may outbid your orders if prices aren't competitive
4. **Protected UI Mode**: Must be disabled for HTTP mod to work

---

## References

- [X4-rest-server GitHub](https://github.com/Alia5/X4-rest-server)
- [X4-rest-server Forum Thread](https://forum.egosoft.com/viewtopic.php?t=426061)
- [X4-External-App GitHub](https://github.com/mycumycu/X4-External-App)
- [X4-External-App Nexus Mods](https://www.nexusmods.com/x4foundations/mods/818)
- [djfhe x4_http Library](https://github.com/djfhe/x4_http)
- [djfhe x4_http Forum Thread](https://forum.egosoft.com/viewtopic.php?t=470576)

---

**Document Created:** 2026-02-02  
**Author:** AI Research Agent  
**Status:** Research Complete - Pending Decision
