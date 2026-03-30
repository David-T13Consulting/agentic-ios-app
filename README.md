# Agentic iOS App

An iPhone app built with **React Native + Expo** that features an agentic AI assistant powered by **Claude** (Anthropic API).

## Features

- **AI Agent Chat** — Conversational interface with Claude, including tool-use (agentic loop)
- **Secure API Key Storage** — Your Anthropic API key is stored on-device via Expo SecureStore
- **Modern UI** — Styled with NativeWind (Tailwind CSS for React Native)
- **File-based Routing** — Powered by Expo Router

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo SDK 52 |
| Language | TypeScript |
| Routing | Expo Router (file-based) |
| Styling | NativeWind (Tailwind CSS) |
| AI | Anthropic Claude API (tool use / agentic) |
| Storage | Expo SecureStore |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)
- An [Anthropic API key](https://console.anthropic.com/)
- **For iOS**: Xcode 15+ (or use Expo Go on your iPhone)

### Installation

```bash
cd agentic-ios-app
npm install
```

### Run the App

```bash
# Start Expo dev server
npx expo start

# Scan the QR code with Expo Go on your iPhone
# Or press 'i' to open iOS simulator (requires Xcode)
```

### Configure API Key

1. Open the app and go to **Settings**
2. Enter your Anthropic API key (`sk-ant-...`)
3. Tap **Save** — your key is stored securely on-device

## Project Structure

```
agentic-ios-app/
├── app/                  # Expo Router screens
│   ├── _layout.tsx       # Root layout with navigation
│   ├── index.tsx         # Home screen
│   ├── chat.tsx          # AI chat screen
│   └── settings.tsx      # API key settings
├── src/
│   ├── hooks/
│   │   └── useAgent.ts   # Chat state management hook
│   ├── services/
│   │   ├── agent.ts      # Claude API integration + agentic loop
│   │   └── storage.ts    # Secure key storage
│   └── types/
│       └── chat.ts       # TypeScript interfaces
├── app.json              # Expo config
├── tailwind.config.js    # NativeWind/Tailwind config
└── tsconfig.json         # TypeScript config
```

## Extending the Agent

To add new tools the agent can use, edit `src/services/agent.ts`:

1. Add the tool definition to the `TOOLS` array
2. Add the execution logic in `executeLocalTool()`

Example tools you could add:
- Web search
- Calendar access
- Device sensors (location, camera)
- Local file operations

## License

MIT
