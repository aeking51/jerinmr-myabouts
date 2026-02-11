

# Add WebSocket Proxy Connection Form to SSH Terminal

## Overview
Upgrade the SSH terminal to support real SSH connections via a user-provided WebSocket proxy (e.g., WebSSH2, ttyd, or Apache Guacamole). The terminal will have two modes: the existing **Demo Mode** (simulation) and a new **Live Mode** that connects to a real WebSocket proxy URL.

## What Changes

### 1. Upgrade SSHTerminal.tsx with Dual Modes

**Connection Form (Live Mode):**
- Input fields: WebSocket Proxy URL (e.g., `wss://your-proxy.example.com/ssh`), Host/IP, Port (default 22), Username
- A "Connect" button that establishes a WebSocket connection to the proxy
- Connection status indicator (connecting, connected, disconnected, error)
- A toggle/tabs to switch between "Demo" and "Live" modes

**WebSocket Integration:**
- Use the browser's native `WebSocket` API to connect to the user-provided proxy URL
- Send keystrokes over the WebSocket and display received output in the terminal
- Handle connection lifecycle (open, message, close, error)
- Auto-reconnect option on disconnect

**Security Info Banner:**
- Display a brief note explaining the architecture: Browser connects to your proxy server via WebSocket (wss://), and the proxy connects to the target SSH server
- Recommend using `wss://` (TLS) and list compatible proxy software (WebSSH2, ttyd, Wetty)

### 2. Keep Demo Mode Intact
- The existing simulated terminal remains as the default "Demo" tab
- Users can try the simulation without any setup

### 3. Update UtilityToolsSection.tsx
- Update the SSH tab description to mention both demo and live connection modes

## Technical Details

### Files to modify:
- `src/components/SSHTerminal.tsx` -- Add connection form, WebSocket client logic, and mode switching (Demo vs Live)
- `src/components/sections/UtilityToolsSection.tsx` -- Update description text

### WebSocket message protocol:
The component will support a simple text-based protocol (compatible with WebSSH2/ttyd):
- Send: raw terminal input (keystrokes)
- Receive: raw terminal output (displayed in the terminal)

### No new dependencies needed
- Uses native `WebSocket` API
- Uses existing UI components (Input, Button, Tabs, Card)

## Limitations (communicated to users in the UI)
- The user must run their own WebSocket-to-SSH proxy server (e.g., WebSSH2, Wetty, or ttyd)
- The browser cannot connect directly to SSH servers -- it always needs the proxy middleman
- Links to setup guides for popular proxy solutions will be included

