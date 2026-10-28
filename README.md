# TeleBot Test — Telegram Notification Tester

A modern Apple-inspired glassmorphism web UI with dark/light themes. Enter a Telegram bot token, chat ID, and message, then click **Send test notification**. The interface contains only the working test flow; chat ID discovery has been removed. The backend calls Telegram's official `sendMessage` API and displays the actual success/error response.

## Run on your Mac

Requirements: Node.js 18+ and internet access.

```bash
cd telegram-notification-tester
npm start
```

Open http://127.0.0.1:7313

Optional port override:

```bash
PORT=9000 npm start
```

## How to get the required values

1. Create a bot or copy its token from [@BotFather](https://t.me/BotFather).
2. Open your bot in Telegram and press **Start**.
3. Obtain your chat ID (for example, using a trusted bot/chat-ID tool or your own bot update handler).
4. Paste token and chat ID into this page and click **Send test notification**.

For a group or channel, use the correct chat ID and ensure the bot has permission to post. Channel IDs are often negative numbers, commonly starting with `-100`.

## Security notes

- The app binds to `127.0.0.1` by default; it is meant for local testing.
- The token is submitted to this app's Node.js backend, then used server-side to call Telegram. It is not placed in a browser URL or saved to disk by this app.
- Do not expose this unauthenticated app to the public internet. If you need LAN or public access, add authentication, HTTPS, rate limiting, and request protections first.
- A success response means Telegram accepted the message, not that the recipient has read it.
- If a token is exposed, revoke/regenerate it with @BotFather.
