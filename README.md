# GhostFrame

A small always-on-top overlay browser for Windows. Keep YouTube, a guide or any web page floating over your game, like picture-in-picture.

## Download

Get `GhostFrame.exe` from the [latest release](../../releases/latest). It is portable, so there is nothing to install. Just double-click it.

Windows SmartScreen may warn because the exe is unsigned. Click **More info**, then **Run anyway**.

## Use

- The controls (back, forward, reload, URL bar, opacity, click-through, minimize, quit) appear in a strip above the page only while the mouse is over the window.
- Drag the strip to move the window and drag the edges to resize it.
- Your logins are kept between runs.

| Hotkey | Action |
| --- | --- |
| `Ctrl+Alt+B` | Show or hide the overlay |
| `Ctrl+Alt+C` | Toggle click-through (mouse passes through to the game) |
| `Ctrl+Alt+↑` / `Ctrl+Alt+↓` | Increase or decrease opacity |
| `Ctrl+Alt+Q` | Quit |

## Games

The game must run in **Windowed Fullscreen (borderless)**. In exclusive fullscreen Windows does not draw other windows over the game. GhostFrame is a separate window and does not inject into or read any game.

## Build from source

```bash
npm install
npm start        # run in development
npm run build    # creates dist/GhostFrame.exe
```
