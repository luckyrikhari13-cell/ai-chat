# Terminal AI Chat — Groq + Gemini

A terminal-based chatbot built in Node.js that talks to **two different LLM providers** — Groq and Gemini — with automatic fallback between them. If the active model fails for any reason, the app silently retries the same prompt on the other model so the conversation never breaks.

Built as part of the **Pivot: Learn. Build. Launch.** program (mentored by Anish Kumar).

---

## ✨ Features

- 💬 Chat directly from your terminal
- ⚡ Real-time streaming responses (tokens print as they're generated)
- 🔄 Switch models on the fly with `/groq` and `/gemini`
- 🛡️ Automatic fallback — if the primary model's API call fails, the app retries on the secondary model without losing the conversation
- 🧹 `/clear` — clear the terminal screen
- ❓ `/help` — list all available commands
- 🚪 `/exit` — quit the chat
- ✅ Handles empty input, missing API keys, and network/API errors gracefully

---

## 📁 Project Structure

```
ai-chat/
├── Services/
│   ├── groq.js        # Groq API integration (streaming)
│   └── gemini.js       # Gemini API integration (streaming)
├── utilites/
│   └── fallback.js     # Tries the primary model, auto-retries on the secondary on failure
├── index.js              # Terminal chat loop — commands, model switching, I/O
├── .env                  # Real API keys (never committed)
├── .env.example           # Template showing required env vars
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Setup

**1. Clone the repo**
```bash
git clone https://github.com/luckyrikhari13-cell/ai-chat.git
cd ai-chat
```

**2. Install dependencies**
```bash
npm install
```

**3. Add your API keys**

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Then fill in your real keys:
```
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

- Get a Groq key → [console.groq.com](https://console.groq.com)
- Get a Gemini key → [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

**4. Run it**
```bash
node index.js
```

---

## 🎮 Usage

```
=== Terminal AI Chat (Groq + Gemini) ===
Starting model: groq

Commands:
  /groq    Switch primary model to Groq
  /gemini  Switch primary model to Gemini
  /clear   Clear the terminal screen
  /help    Show this help message
  /exit    Quit the chat

User: hello, who are you?
AI (groq): Hi! I'm an AI assistant running right here in your terminal...
```

| Command   | Action                          |
|-----------|----------------------------------|
| `/groq`   | Switch primary model to Groq     |
| `/gemini` | Switch primary model to Gemini   |
| `/clear`  | Clear the terminal screen        |
| `/help`   | Show available commands          |
| `/exit`   | Quit the chat                    |

---

## 🧠 How It Works

### API Calling
Each provider has its own service file (`Services/groq.js`, `Services/gemini.js`) using the official SDKs (`groq-sdk`, `@google/generative-ai`). Each file exposes a single async function — `aiGroq(message, onToken)` and `aiGemini(message, onToken)` — so `index.js` never needs to know how either provider's request/response format actually works.

### Groq Integration
`Services/groq.js` creates an authenticated Groq client using a key loaded from `.env`, then calls `chat.completions.create()` with `stream: true` against the `llama-3.3-70b-versatile` model. The response is an async-iterable stream, read chunk-by-chunk with `for await...of`, with each text fragment passed to an `onToken` callback for live printing.

### Gemini Integration
`Services/gemini.js` follows the same pattern using Google's SDK: `generateContentStream()` returns a stream that's read chunk-by-chunk, with each piece of text passed through the same `onToken` callback for consistent streaming behavior across both providers.

### Fallback Logic
`utilites/fallback.js` exports `getAIResponse(message, primaryModel, onToken)`. It:
1. Looks up the right function for the primary model from a `callers` map
2. Wraps the call in `try/catch`
3. If it fails — network error, invalid key, rate limit, downtime, anything — it logs the failure, then immediately retries the **same message** on the secondary model
4. Only if **both** models fail does it throw a combined error back up to `index.js`

This means a single provider's outage never interrupts the conversation — the user just gets an answer from whichever model actually works.

### Why Async/Await
Every API call here is a network request, so the result isn't available instantly. `async/await` lets the code pause at each `await` until that specific call resolves, without blocking the rest of the program and without nesting callbacks. It's especially necessary for streaming, where `for await (const chunk of stream)` reads each piece of the response as it arrives, rather than waiting for the entire reply to be generated.

### Model Switching
`index.js` keeps a single `currentModel` variable (`"groq"` or `"gemini"`). The `/groq` and `/gemini` commands simply reassign this variable; every subsequent chat message is routed using whatever value it currently holds, with `fallback.js` automatically deciding the backup model.

---

## 🛠️ Error Handling

- **Empty input** — ignored with a friendly message, never sent to either API
- **Missing API key** — each service checks `process.env` before calling and throws a clear, specific error
- **Network/API failure** — caught by the fallback system, triggers an automatic retry on the other model
- **Both models down** — a combined error message is shown; the chat session continues so you can retry or switch models manually

---

## 🧰 Tech Stack

- Node.js (ES Modules)
- [groq-sdk](https://www.npmjs.com/package/groq-sdk)
- [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai)
- [dotenv](https://www.npmjs.com/package/dotenv)
- Native `readline` for terminal I/O

---

## 📌 Learning Outcomes

This project was built to practice:
- LLM API integration (Groq + Gemini)
- Async JavaScript (`async/await`, streaming with `for await...of`)
- Environment variable management
- Runtime model switching
- Fallback/resilience architecture
- Git & GitHub workflow (incremental, descriptive commits)

---

## 👤 Author

**Lucky Rikhari**
B.Tech CSE, O.P. Jindal University
Built as part of the Pivot program — `#BuildInPublic`