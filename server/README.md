<div align="center">

# 🤖 Botbyte CLI

<p align="center">
  <img src="https://img.shields.io/npm/v/botbyte-cli?style=for-the-badge&logo=npm&color=CB3837" alt="npm version" />
  <img src="https://img.shields.io/npm/dt/botbyte-cli?style=for-the-badge&logo=npm&color=CB3837" alt="npm downloads" />
  <img src="https://img.shields.io/github/license/sanketbagad/bobyte-cli?style=for-the-badge&color=blue" alt="license" />
  <img src="https://img.shields.io/github/stars/sanketbagad/bobyte-cli?style=for-the-badge&logo=github&color=yellow" alt="stars" />
</p>

<p align="center">
  <strong>Your Intelligent CLI Companion powered by Google Gemini</strong>
</p>

<p align="center">
  A powerful, feature-rich AI assistant directly in your terminal with web dashboard support
</p>

</div>

---

## ✨ Features

- 🚀 **Lightning Fast** - Built with performance in mind
- 🎨 **Beautiful UI** - Stylish terminal interface with markdown rendering
- 🔐 **Secure Authentication** - GitHub OAuth integration with device flow
- 💬 **Multiple Chat Modes**
  - 💭 **Chat Mode** - Conversational AI assistance
  - 🛠️ **Tool Mode** - AI with function calling capabilities
  - 🤖 **Agent Mode** - Autonomous AI agent for complex tasks
- 🌐 **Web Dashboard** - Modern React-based web interface
- 📝 **Conversation History** - Persistent chat sessions
- 🎯 **Smart Streaming** - Real-time AI responses
- 🎨 **Syntax Highlighting** - Code blocks with beautiful formatting
- 🔄 **Session Management** - Seamless authentication across devices

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g botbyte-cli
```

### Install from Source

```bash
git clone https://github.com/sanketbagad/bobyte-cli.git
cd bobyte-cli/server
npm install
npm link
```

## 🚀 Quick Start

### 1. Login to Botbyte

```bash
botbyte login
```

Follow the device authorization flow to authenticate with GitHub.

### 2. Start Chatting

```bash
# Start a basic chat session
botbyte chat

# Use tool mode with function calling
botbyte tool

# Use autonomous agent mode
botbyte agent
```

### 3. Check Your Session

```bash
# See who's logged in
botbyte whoami

# Logout
botbyte logout
```

## 📚 Commands

### Authentication

| Command | Description |
|---------|-------------|
| `botbyte login` | Login using GitHub OAuth device flow |
| `botbyte logout` | Logout and clear session |
| `botbyte whoami` | Display current user information |

### Chat Modes

| Command | Description |
|---------|-------------|
| `botbyte chat` | Start a conversational chat session |
| `botbyte tool` | Start chat with tool calling capabilities |
| `botbyte agent` | Start autonomous agent mode |

### Utility

| Command | Description |
|---------|-------------|
| `botbyte --help` | Display help information |
| `botbyte --version` | Show version number |

## 💻 Chat Interface

### Terminal Commands

While in a chat session, you can use these commands:

- `exit` or `quit` - End the chat session
- `clear` or `cls` - Clear the terminal screen
- `help` - Show available commands
- Press `Ctrl+C` - Quit anytime

### Example Session

```bash
$ botbyte chat

🤖 BOTBYTE AI
Your Intelligent CLI Companion

🚀 Starting Botbyte AI Chat...

💬 You: What is TypeScript?

🤖 Assistant:
TypeScript is a strongly typed programming language that builds on JavaScript...

💬 You: Show me an example

🤖 Assistant:
```typescript
interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "John",
  age: 30
};
```
```

## 🌐 Web Dashboard

Access the beautiful web interface at `http://localhost:3000/chat` after starting the server:

```bash
# Start the web server
cd client
npm run dev

# Visit http://localhost:3000
# Login with GitHub
# Navigate to /chat for the AI dashboard
```

### Web Features

- 🎨 Modern, responsive UI
- 💬 Real-time chat with streaming responses
- 📝 Conversation management
- 🔍 Markdown rendering with syntax highlighting
- 📱 Mobile-friendly design

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the server directory:

```env
# Required
GOOGLE_API_KEY=your_google_gemini_api_key
DATABASE_URL=your_postgresql_database_url

# GitHub OAuth (for authentication)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Optional
PORT=3001
NODE_ENV=development
```

### Get API Keys

1. **Google Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key

2. **GitHub OAuth App**
   - Go to GitHub Settings → Developer Settings → OAuth Apps
   - Create a new OAuth App
   - Set callback URL to `http://localhost:3000/api/auth/callback/github`

## 🛠️ Development

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL database
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/sanketbagad/bobyte-cli.git
cd bobyte-cli

# Install dependencies
npm install

# Setup server
cd server
npm install
cp .env.example .env
# Edit .env with your credentials

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev

# Setup client (in another terminal)
cd client
npm install
npm run dev
```

### Project Structure

```
orbital-cli-ai/
├── client/              # Next.js web application
│   ├── app/            # App router pages
│   ├── components/     # React components
│   └── lib/            # Utilities
├── server/             # CLI and API server
│   ├── src/
│   │   ├── cli/       # CLI commands
│   │   ├── routes/    # Express routes
│   │   ├── services/  # Business logic
│   │   └── lib/       # Utilities
│   └── prisma/        # Database schema
└── package.json       # Workspace root
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run client tests
npm run test:client

# Run server tests
npm run test:server

# Run with coverage
npm run test:coverage
```

## 📄 License

MIT © [Sanket Bagad](https://github.com/sanketbagad)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Powered by [Google Gemini](https://deepmind.google/technologies/gemini/)
- Built with [Next.js](https://nextjs.org/)
- CLI framework by [Commander.js](https://github.com/tj/commander.js)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

- 📧 Email: sanketbagad@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/sanketbagad/bobyte-cli/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/sanketbagad/bobyte-cli/discussions)

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/sanketbagad">Sanket Bagad</a></p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
