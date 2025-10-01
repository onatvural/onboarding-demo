# Demo-YKP AI Chatbot

AI-powered chatbot interface for Yapı Kredi Portföy with streaming responses and animated background effects.

## Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Runtime**: Edge Runtime
- **AI Integration**: Vercel AI SDK v5.0.59 with AI Gateway
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS v3.4.1 with OKLCH color format
- **Typography**: Geist Sans font family
- **Language**: TypeScript
- **Model**: GPT-4o-mini via AI Gateway

## Project Structure

```
/app
  /api/chat/route.ts    # AI streaming endpoint (Edge runtime)
  globals.css           # Theme variables, custom colors, scrollbar
  layout.tsx            # Root layout with Geist font
  page.tsx              # Main page with Chat component

/components
  /ui
    badge.tsx           # shadcn Badge component
    button.tsx          # shadcn Button component
    textarea.tsx        # shadcn Textarea component
    shooting-stars.tsx  # Animated shooting stars background
    stars-background.tsx # Twinkling stars canvas background
  bot-icon.tsx          # Static bot avatar (circle with eyes)
  bot-icon-animated.tsx # Animated bot avatar (rolling eyes)
  chat.tsx              # Main chat interface component

/lib
  utils.ts              # Utility functions (cn helper)
```

## Key Features

### Chat Interface
- Streaming AI responses with manual fetch/TextDecoder implementation
- Auto-expanding textarea (1 line → max 200px)
- Enter to send, Shift+Enter for new line
- Stop generation with abort controller
- New conversation button (Plus icon, top-right)
- Custom bot icons with animation states (static/thinking)

### UI/UX
- 920px centered content container with full viewport background
- Shooting stars and twinkling stars background effects
- Dark mode with slate base color (OKLCH format)
- shadcn typography styles for markdown rendering
- Custom scrollbar styling
- Markdown support with syntax highlighting
- Auto-scroll to latest message

### Colors
- **Base Theme**: Slate dark mode (OKLCH)
- **Orange Palette**: 50-950 scale defined
- **Warning Colors**: Light/dark variants
- **Border Radius**: 0.625rem default

## Environment Variables

Create `.env.local` with:

```bash
AI_GATEWAY_API_KEY=your_api_key_here
```

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env.local
# Add your AI Gateway API key
```

3. Run development server:
```bash
npm run dev
```

4. Open http://localhost:3000

## Important Implementation Details

### AI SDK Compatibility
- Using AI SDK v5.0.59 which doesn't export React hooks
- Manual streaming implementation using `streamText().textStream`
- Custom ReadableStream with TextEncoder for response streaming
- AbortController for stopping generation

### System Prompt
Located in `/app/api/chat/route.ts`:
- Includes current date/time (Istanbul timezone)
- Turkish language assistant persona
- Professional, courteous tone for Yapı Kredi Portföy

### Markdown Rendering
Using `react-markdown` with `remark-gfm` and shadcn typography:
- Code blocks with `<pre>` wrapper and muted background
- Headings with `scroll-m-20` and proper tracking
- Lists with `my-6 ml-6` spacing
- Links with `underline-offset-4`
- Blockquotes with border-left styling

### Auto-expanding Textarea
- Starts at 1 row, expands based on content
- Max height: 200px (scrollable after)
- Uses `useEffect` watching input changes
- Resets height on empty input

## Development Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Git Repository

https://github.com/onatvural/Demo-YKP

## Notes

- No chat history persistence (POC only)
- Messages cleared on page refresh
- AI Gateway handles model routing and API keys
- Edge runtime for optimal streaming performance
