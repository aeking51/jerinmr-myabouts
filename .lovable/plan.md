

# Remove Demo Terminal and Add Safety Guidelines

## Overview
Remove the demo/simulated terminal tab entirely and replace it with a single-view SSH client launcher that includes clear guidelines and safety warnings before users can access the third-party SSH services.

## Changes

### File: `src/components/SSHTerminal.tsx`
- **Remove all demo terminal code**: Delete the `TerminalLine`, `SSHSession` interfaces, `FAKE_FILES`, `FILE_CONTENTS`, `ASCII_BANNER` constants, and all simulated command processing logic (lines 8-503).
- **Remove the Tabs wrapper**: No more Demo/Live tabs -- the component will show a single view.
- **Add a Guidelines and Safety section** before the "Launch SSH Client" button:
  - **What this does**: Brief explanation that this connects to a third-party web SSH client.
  - **Safety Concerns** (with warning styling):
    - Your credentials (username, password, SSH keys) are transmitted through a third-party service -- never enter sensitive production credentials.
    - These services are not controlled by this website -- use at your own risk.
    - Avoid connecting to critical infrastructure from public/shared computers.
    - Always verify the SSH host fingerprint before authenticating.
    - Use key-based authentication over passwords when possible.
  - **Recommended Use**: For learning, testing, or connecting to non-critical/sandbox servers.
- **Keep the service selector** (ShellNGN, Sshwifty) and the "Open in new tab" link.
- **Add a checkbox/acknowledgment** ("I understand the risks") that must be checked before the Launch button becomes active.
- **Remove unused imports**: `ScrollArea`, `Input`, `Tabs`/`TabsList`/`TabsTrigger`/`TabsContent`, and state/hooks no longer needed.

## Technical Details

### Removed code
- ~490 lines of demo terminal simulation (interfaces, fake filesystem, command processing, ASCII art, key handlers, line rendering)
- Tab components and related imports

### Resulting component structure
```text
SSHTerminal
  +-- Header bar (service selector + external link)
  +-- Guidelines panel (what this is, safety warnings)
  +-- Risk acknowledgment checkbox
  +-- Launch button (disabled until acknowledged)
  +-- iframe (shown after launch)
```

### Dependencies removed from imports
- `ScrollArea`, `Input` -- no longer used
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` -- no tabs needed
- `useState` items for demo state (`lines`, `session`, `commandHistory`, etc.)

### Dependencies kept
- `useState` (for `selectedService`, `showLiveSSH`, and new `acknowledged` state)
- `Button`, `Globe`, `ExternalLink`, `Terminal`, `Play` from existing imports
- `ShieldAlert` or `AlertTriangle` icon added for the warning section

