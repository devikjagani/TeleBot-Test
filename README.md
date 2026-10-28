# Telegram Notification Tester — GitHub Pages edition

A static, Telegram-blue glass UI frontend for testing a bot notification. No build step or npm install is required.

## Publish
1. Create a GitHub repository.
2. Upload the `docs/index.html` file.
3. In repository **Settings → Pages**, choose **Deploy from a branch**, select your default branch, and select `/docs` as the folder.
4. Save and open the published Pages URL.

## Use
1. Open your bot in Telegram and press Start; send it a message first.
2. Enter your BotFather token and Chat ID into the page.
3. Enter a message and click **Send test notification**.

## Important limitations and security
GitHub Pages only serves static files and cannot run the Node.js backend. This edition attempts to call Telegram's Bot API from the browser. Browser CORS/network policies may block the request; if so, a separate backend is required.

The token is used by the browser and can be inspected while testing. Never hard-code a real token into HTML or commit it to a public repository. The page does not save the token to localStorage or cookies. For a secure shared/public deployment, use GitHub Pages as the frontend and a separately hosted backend with authentication, HTTPS, and rate limiting.
