# Demo-BSF AI Chatbot

AI-powered chatbot interface for Beta Space Finans with streaming responses and animated background effects.

## Tech Stack

- **Framework**: Next.js 15.5.4 (App Router, Turbopack)
- **Runtime**: Edge Runtime
- **AI Integration**: Vercel AI SDK v5.0.59 with `streamObject`
- **AI Model**: Claude Haiku 4.5 via OpenRouter (Anthropic)
- **UI Components**: shadcn/ui
- **Charts**: Recharts for fund performance visualization
- **Animation**: Framer Motion + TextGenerateEffect
- **Styling**: Tailwind CSS v3.4.1 with OKLCH color format
- **Typography**: Google Sans Flex (17px, weight 300)
- **Language**: TypeScript

## Project Structure

```
/app
  /api/chat/route.ts    # AI streaming endpoint with stream throttling
  globals.css           # Theme variables, custom colors, scrollbar
  layout.tsx            # Root layout with Google Sans Flex
  page.tsx              # Main page with Chat component

/components
  /ui
    badge.tsx           # shadcn Badge component
    button.tsx          # shadcn Button component
    textarea.tsx        # shadcn Textarea component
    card.tsx            # shadcn Card components
    chart.tsx           # shadcn Chart components (Recharts wrapper)
    text-generate-effect.tsx # Word-by-word reveal animation
    shooting-stars.tsx  # Animated shooting stars background
    stars-background.tsx # Twinkling stars canvas background
  bot-icon.tsx          # Static glassmorphic avatar
  bot-icon-animated.tsx # Animated glassmorphic avatar (thinking state)
  chat.tsx              # Main chat interface with risk profiling
  onboarding-form.tsx   # 6-question risk assessment form
  fund-chart.tsx        # Mock fund performance charts (6 patterns)

/lib
  utils.ts              # Utility functions (cn helper)
  schemas.ts            # Zod schemas for conversation structure
  mock-funds.ts         # Mock fund data for recommendations
```

## Key Features

### Chat Interface
- NDJSON streaming with `streamObject` for structured responses
- Stream throttling (250ms intervals) for smooth UX
- TextGenerateEffect for word-by-word reveal animation
- Auto-expanding textarea (1 line → max 200px)
- Enter to send, Shift+Enter for new line
- Stop generation with abort controller
- New conversation button (Plus icon, top-right)
- Glassmorphic bot avatars with animation states (static/thinking)

### Risk Profiling Flow
- Interactive 5-step conversation flow
- 6-question risk assessment form (vade, ürün, nitelikli yatırımcı, likidite, karakter, ilgi)
- Dynamic risk calculation (Düşük/Orta/Yüksek)
- Personalized fund recommendations (3 funds)
- Fund performance charts with 6 different patterns
- Real-time form validation with React Hook Form + Zod

### UI/UX
- 920px centered content container with full viewport background
- Shooting stars and twinkling stars background effects
- Dark mode with slate base color (OKLCH format)
- Hierarchical spacing system (4px increments: 4px, 8px, 12px, 16px, 24px)
- Custom form button colors (#7d4e57 → #a6405d on hover)
- shadcn typography styles for markdown rendering
- Custom scrollbar styling
- Markdown support with syntax highlighting
- Auto-scroll to latest message

### Colors
- **Base Theme**: Slate dark mode (OKLCH)
- **Avatar Glassmorphic**:
  - Cyan: #00E5FF → #00B8D4
  - Blue: #40C4FF → #0091EA
  - Light Blue: #80DEEA → #00ACC1
  - Pink/Red: #FF6B9D → #C2185B
  - Background: rgba(251, 251, 242, 0.05)
- **Form Button**: #7d4e57 (normal) → #a6405d (hover), text: #CFD2CD
- **User Message Gradient**: #cfd2cd → #c6c5c1 → #bcb9b6 → #b2adac → #a6a2a2
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

### AI SDK + Stream Optimization
- Using AI SDK v5.0.59 with `streamObject` for structured data streaming
- `experimental_transform` with custom `smoothObjectStream` for throttling (250ms intervals)
- NDJSON stream parsing with `partialObjectStream`
- Custom ReadableStream for NDJSON → client delivery
- AbortController for stopping generation
- **Why throttling?** AI sends updates every ~5-10ms, causing React re-renders before TextGenerateEffect can animate. 250ms throttling allows smooth word-by-word reveal.

### Conversation Flow
Located in `/app/api/chat/route.ts`:
- **Step 0**: Name collection (free text)
- **Step 1**: Readiness confirmation (buttons)
- **Step 2**: Show 6-question form (showForm: true)
- **Step 3**: Process form data → calculate risk profile
- **Step 4**: Display results with fund recommendations
- Structured output via Zod schema (`conversationSchema`)
- Turkish language, natural, friendly tone

### TextGenerateEffect Animation
Located in `/components/ui/text-generate-effect.tsx`:
- Word-by-word reveal with stagger animation (0.2s delay between words)
- Used for completed assistant messages (`isComplete: true`)
- Streaming messages still use ReactMarkdown for real-time updates
- Configured with: `duration={0.3}`, `filter={false}`
- Prevents "text hitting user's face" effect by smoothing appearance

### Fund Performance Charts
Located in `/components/fund-chart.tsx`:
- 6 different mock data patterns: volatile, stable growth, dramatic rise, high volatility, recovery, flat
- Uses `fundIndex` as seed to ensure variety across cards
- Light blue gradient (#60A5FA) with area chart
- 6-month mock data (Oca → Haz)
- Height: 120px per chart
- Integration with Recharts and shadcn Chart components

### Glassmorphic Avatar Design
Located in `/components/bot-icon.tsx` and `/components/bot-icon-animated.tsx`:
- 4 animated glass circles with radial gradients
- Blur filter (stdDeviation: 1.2) for glass effect
- Different animation speeds: 5s, 6.5s, 7s, 5.8s
- Circular clip mask (r="12")
- Size: 30x30px
- Separate gradient IDs for animated version to prevent conflicts

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

https://github.com/onatvural/Demo-BSF

## Notes

- No chat history persistence (POC only)
- Messages cleared on page refresh
- Claude Haiku 4.5 via OpenRouter (Anthropic)
- Edge runtime for optimal streaming performance
- Mock fund data - production should use real API
- Risk profiling algorithm is simplified for demo purposes
- Stream throttling essential for TextGenerateEffect to work properly with `streamObject`
