--[[
  X4 AI Connector - Lua HTTP Client
  
  This Lua script handles HTTP communication with the X4 Game API server.
  It uses the djfhe_http library for making HTTP requests.
  
  Dependencies:
  - djfhe_http mod (https://github.com/djfhe/x4_http)
]]

local ffi = require("ffi")
local C = ffi.C

-- Configuration
local config = {
    serverUrl = "http://localhost:8080",
    enabled = true,
    debug = false
}

-- HTTP helper using djfhe_http
local http = nil

-- Try to load djfhe_http
local function initHttp()
    local success, httpLib = pcall(require, "extensions.djfhe_http.http")
    if success then
        http = httpLib
        if config.debug then
            DebugError("[X4 AI Connector] HTTP library loaded successfully")
        end
        return true
    else
        DebugError("[X4 AI Connector] Failed to load djfhe_http: " .. tostring(httpLib))
        return false
    end
end

-- JSON encode helper (simple implementation)
local function jsonEncode(tbl)
    if type(tbl) ~= "table" then
        if type(tbl) == "string" then
            return '"' .. tbl:gsub('"', '\\"') .. '"'
        elseif type(tbl) == "number" or type(tbl) == "boolean" then
            return tostring(tbl)
        elseif tbl == nil then
            return "null"
        end
        return '"' .. tostring(tbl) .. '"'
    end
    
    -- Check if array or object
    local isArray = true
    local maxIndex = 0
    for k, _ in pairs(tbl) do
        if type(k) ~= "number" or k < 1 or math.floor(k) ~= k then
            isArray = false
            break
        end
        maxIndex = math.max(maxIndex, k)
    end
    isArray = isArray and maxIndex == #tbl
    
    local parts = {}
    if isArray then
        for i, v in ipairs(tbl) do
            parts[i] = jsonEncode(v)
        end
        return "[" .. table.concat(parts, ",") .. "]"
    else
        local i = 1
        for k, v in pairs(tbl) do
            parts[i] = '"' .. tostring(k) .. '":' .. jsonEncode(v)
            i = i + 1
        end
        return "{" .. table.concat(parts, ",") .. "}"
    end
end

-- JSON decode helper (simple implementation for responses)
local function jsonDecode(str)
    -- Use game's built-in JSON parser if available, otherwise basic parsing
    -- Note: This is a simplified parser - in production, use a proper JSON library
    local success, result = pcall(function()
        -- Convert JSON null to Lua nil (true/false are valid in both)
        return loadstring("return " .. str:gsub('null', 'nil'))()
    end)
    if success then
        return result
    end
    return nil
end

-- Send HTTP POST request
local function httpPost(endpoint, data, callback)
    if not http then
        if not initHttp() then
            return false
        end
    end
    
    local url = config.serverUrl .. endpoint
    local body = jsonEncode(data)
    
    if config.debug then
        DebugError("[X4 AI Connector] POST " .. endpoint)
    end
    
    http.post(url, body, {
        ["Content-Type"] = "application/json"
    }, function(response)
        if callback then
            callback(response)
        end
    end)
    
    return true
end

-- Send HTTP GET request
local function httpGet(endpoint, callback)
    if not http then
        if not initHttp() then
            return false
        end
    end
    
    local url = config.serverUrl .. endpoint
    
    if config.debug then
        DebugError("[X4 AI Connector] GET " .. endpoint)
    end
    
    http.get(url, {}, function(response)
        if callback then
            callback(response)
        end
    end)
    
    return true
end

-- ============================================================================
-- Data Collection Functions
-- ============================================================================

-- Collect and send player info
local function sendPlayerInfo()
    local player = GetPlayerPrimaryShipID and GetPlayerPrimaryShipID() or nil
    local money = GetPlayerMoney and GetPlayerMoney() or 0
    local name = GetPlayerName and GetPlayerName() or "Unknown"
    
    local data = {
        id = tostring(player or "player"),
        name = name,
        money = money,
        gameTime = GetCurTime and GetCurTime() or 0,
        currentSector = {
            id = "sector_001",  -- Would get actual sector
            name = "Unknown"
        },
        faction = {
            id = "player",
            name = "Player"
        }
    }
    
    httpPost("/api/v1/player", data)
end

-- Collect and send game state
local function sendGameState()
    local data = {
        timestamp = os.time() * 1000,
        gameTime = GetCurTime and GetCurTime() or 0,
        isPaused = false,  -- Would check actual pause state
        player = {
            id = "player",
            name = GetPlayerName and GetPlayerName() or "Unknown",
            money = GetPlayerMoney and GetPlayerMoney() or 0,
            gameTime = GetCurTime and GetCurTime() or 0,
            currentSector = {
                id = "sector_001",
                name = "Unknown"
            },
            faction = {
                id = "player",
                name = "Player"
            }
        }
    }
    
    httpPost("/api/v1/game/state", data)
end

-- Collect and send faction relations
local function sendFactionRelations()
    -- Would iterate over factions and collect relations
    local relations = {}
    
    httpPost("/api/v1/factions/relations", relations)
end

-- Collect and send player stations
local function sendStations()
    -- Would iterate over player stations
    local stations = {}
    
    httpPost("/api/v1/stations", stations)
end

-- Collect and send player ships
local function sendShips()
    -- Would iterate over player ships
    local ships = {}
    
    httpPost("/api/v1/ships", ships)
end

-- ============================================================================
-- Command Handling
-- ============================================================================

-- Poll for pending commands
local function pollCommands()
    httpGet("/api/v1/commands/pending", function(response)
        if response and response.status == 200 then
            local commands = jsonDecode(response.body)
            if commands and #commands > 0 then
                for _, cmd in ipairs(commands) do
                    executeCommand(cmd)
                end
            end
        end
    end)
end

-- Execute a command
function executeCommand(command)
    if config.debug then
        DebugError("[X4 AI Connector] Executing command: " .. command.type)
    end
    
    local result = {
        commandId = command.id,
        success = false,
        timestamp = os.time() * 1000
    }
    
    if command.type == "create_trade_order" then
        result = executeCreateTradeOrder(command.params, result)
    elseif command.type == "assign_ship" then
        result = executeAssignShip(command.params, result)
    else
        result.error = "Unknown command type: " .. command.type
    end
    
    -- Send result back
    httpPost("/api/v1/commands/result", result)
end

-- Execute create trade order command
function executeCreateTradeOrder(params, result)
    -- Would use game API to create trade order
    result.success = true
    result.data = { message = "Trade order created" }
    return result
end

-- Execute assign ship command
function executeAssignShip(params, result)
    -- Would use game API to assign ship
    result.success = true
    result.data = { message = "Ship assigned" }
    return result
end

-- ============================================================================
-- Event Handlers
-- ============================================================================

-- Register for game events
local function registerEvents()
    -- Would register for various game events and send updates
    -- RegisterEvent("logbook", onLogbookEntry)
    -- RegisterEvent("mission_offered", onMissionOffered)
    -- etc.
end

-- ============================================================================
-- Initialization
-- ============================================================================

local function init()
    if config.debug then
        DebugError("[X4 AI Connector] Initializing...")
    end
    
    if initHttp() then
        registerEvents()
        if config.debug then
            DebugError("[X4 AI Connector] Initialized successfully")
        end
    end
end

-- ============================================================================
-- Public API (called from MD scripts via raise_lua_event)
-- ============================================================================

return {
    init = init,
    sendGameState = sendGameState,
    sendPlayerInfo = sendPlayerInfo,
    sendFactionRelations = sendFactionRelations,
    sendStations = sendStations,
    sendShips = sendShips,
    pollCommands = pollCommands,
    executeCommand = executeCommand,
    setServerUrl = function(url) config.serverUrl = url end,
    setEnabled = function(enabled) config.enabled = enabled end,
    setDebug = function(debug) config.debug = debug end
}
