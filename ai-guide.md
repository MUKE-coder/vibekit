# AI & RAG Guide — Vercel AI SDK + pgvector + Credit Packs

> Most new SaaS in 2026 ships at least one AI feature — chat, summarisation, semantic search, agentic workflows. Without locked patterns, every project re-invents streaming, RAG, model selection, cost control, and billing. This guide is the framework's canonical AI layer.
>
> **The stack:** Vercel AI SDK (provider-agnostic streaming) + pgvector inside Neon Postgres (no separate vector DB) + Upstash Ratelimit (per-user cost control) + Stripe credit packs (the indie-friendly billing model).

---

## The locked AI stack

| Layer | Tech | Why |
|---|---|---|
| Streaming + tool use | `ai` (Vercel AI SDK) | Provider-agnostic — swap models without rewriting |
| Anthropic models | `@ai-sdk/anthropic` | Claude Opus 4.7 (1M context), Sonnet 4.6, Haiku 4.5 |
| OpenAI models | `@ai-sdk/openai` | gpt-5, gpt-5-mini, o-series for reasoning |
| Embeddings | `@ai-sdk/openai` (text-embedding-3-small) OR Voyage | Cheap, fast, high quality |
| RAG store | pgvector inside Neon Postgres | No separate vector DB to operate, runs in the same `db.ts` connection pool |
| Rate limiting | `@upstash/ratelimit` | Per-user cost control before the LLM call |
| Billing | Stripe one-time payments (credit packs) | Beats subscriptions for AI-heavy apps in 2026 |

### Default model choices

- **Chat default:** Claude Sonnet 4.6 (cost / quality sweet spot)
- **Reasoning / agentic:** Claude Opus 4.7 (1M context for long tool chains)
- **Lightweight / classification:** Claude Haiku 4.5
- **Structured outputs:** `generateObject` with Zod schemas (any provider)
- **Embeddings:** `text-embedding-3-small` (1536 dims, $0.02 / M tokens)

Don't burn money on Opus for "what's the user's name". Default to the smaller models; reach for Opus when the task warrants it.

---

## Environment variables

```bash
# .env.local
ANTHROPIC_API_KEY="sk-ant-..."
OPENAI_API_KEY="sk-..."                # embeddings + GPT models
UPSTASH_REDIS_REST_URL="https://..."   # already in the framework
UPSTASH_REDIS_REST_TOKEN="..."         # already in the framework
```

Add to `.env.example` with comments explaining where to get each key.

---

## Package additions

```bash
pnpm add ai @ai-sdk/anthropic @ai-sdk/openai @upstash/ratelimit zod
```

Already in the framework: `@upstash/redis`, `zod`, `react-hook-form`.

---

## Streaming chat — the canonical pattern

### Server route: `src/app/api/chat/route.ts`

```ts
import { streamText, convertToCoreMessages } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { auth } from "@/lib/auth";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { spendCredits } from "@/lib/credits";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "1 h"), // 20 chat requests / user / hour
  analytics: true,
});

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  // Per-user rate limit (independent of cost — prevents abuse)
  const rl = await ratelimit.limit(`chat:${session.user.id}`);
  if (!rl.success) return new Response("Rate limit exceeded", { status: 429 });

  // Per-user credit check (cost control)
  const ok = await spendCredits(session.user.id, 1); // 1 credit per chat message
  if (!ok) return new Response("Insufficient credits", { status: 402 });

  const { messages } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-4-6"),
    system: "You are a helpful assistant. Be concise.",
    messages: convertToCoreMessages(messages),
    maxTokens: 1024, // hard cap — protects against runaway responses
  });

  return result.toDataStreamResponse();
}
```

### Client component: `src/components/chat.tsx`

```tsx
"use client";
import { useChat } from "ai/react";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
            <div className="inline-block max-w-[80%] rounded-lg px-3 py-2 bg-muted">
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-sm text-muted-foreground">Thinking…</div>}
      </div>
      <form onSubmit={handleSubmit} className="border-t p-4 flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask anything…"
          className="flex-1 rounded-md border px-3 py-2"
        />
        <button type="submit" disabled={isLoading} className="rounded-md bg-primary text-primary-foreground px-4 py-2">
          Send
        </button>
      </form>
    </div>
  );
}
```

---

## Structured outputs (the right way to call an LLM as an API)

When the LLM should return data (not prose), use `generateObject` with a Zod schema — never parse JSON from a chat response yourself.

```ts
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

const InvoiceSchema = z.object({
  customer: z.string(),
  date: z.string(),
  items: z.array(z.object({
    description: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
  })),
  total: z.number(),
});

export async function extractInvoice(imageUrl: string) {
  const { object } = await generateObject({
    model: anthropic("claude-sonnet-4-6"),
    schema: InvoiceSchema,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Extract the invoice fields from this image." },
          { type: "image", image: new URL(imageUrl) },
        ],
      },
    ],
  });
  return object; // typed as z.infer<typeof InvoiceSchema>
}
```

Zod validates the model's output — invalid responses throw, no try/catch JSON parsing.

---

## RAG with pgvector inside Neon

### 1. Enable the extension

In Neon dashboard SQL editor:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 2. Prisma schema

```prisma
model Document {
  id             String       @id @default(cuid())
  organizationId String
  source         String       // "upload", "url", "manual"
  title          String
  content        String       @db.Text
  /// 1536-dim embedding from text-embedding-3-small
  embedding      Unsupported("vector(1536)")?
  createdAt      DateTime     @default(now())

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@index([organizationId])
}
```

After `pnpm prisma db push`, add the index manually (Prisma doesn't yet support vector indexes):

```sql
CREATE INDEX ON "Document" USING hnsw (embedding vector_cosine_ops);
```

### 3. Indexing pipeline

```ts
// src/lib/rag.ts
import { embed } from "ai";
import { openai } from "@ai-sdk/openai";
import { db } from "@/lib/db";

const EMBEDDING_MODEL = openai.embedding("text-embedding-3-small");

export async function indexDocument(opts: {
  organizationId: string;
  title: string;
  content: string;
  source: string;
}) {
  // Chunk long content — embedding models have token limits.
  // Simple 1000-char chunks with 200-char overlap. Use a real chunker (e.g. langchain text splitter) for production.
  const chunks = chunkText(opts.content, 1000, 200);

  for (const chunk of chunks) {
    const { embedding } = await embed({ model: EMBEDDING_MODEL, value: chunk });
    // Prisma can't insert vector via the typed client (Unsupported field) — use raw SQL
    await db.$executeRaw`
      INSERT INTO "Document" (id, "organizationId", source, title, content, embedding, "createdAt")
      VALUES (
        ${cuid()},
        ${opts.organizationId},
        ${opts.source},
        ${opts.title},
        ${chunk},
        ${`[${embedding.join(",")}]`}::vector,
        NOW()
      )
    `;
  }
}

function chunkText(text: string, size: number, overlap: number): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + size));
    i += size - overlap;
  }
  return chunks;
}

function cuid(): string {
  // Use the same CUID generator Prisma uses, or import @paralleldrive/cuid2
  return crypto.randomUUID();
}
```

### 4. Retrieval

```ts
// src/lib/rag.ts (continued)
export async function searchDocuments(opts: {
  organizationId: string;
  query: string;
  limit?: number;
}) {
  const { embedding } = await embed({ model: EMBEDDING_MODEL, value: opts.query });

  // Cosine distance (<=>); lower = more similar
  const results = await db.$queryRaw<
    Array<{ id: string; title: string; content: string; distance: number }>
  >`
    SELECT id, title, content,
      embedding <=> ${`[${embedding.join(",")}]`}::vector AS distance
    FROM "Document"
    WHERE "organizationId" = ${opts.organizationId}
    ORDER BY distance ASC
    LIMIT ${opts.limit ?? 5}
  `;

  return results;
}
```

### 5. RAG chat endpoint

```ts
import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { searchDocuments } from "@/lib/rag";

export async function POST(req: Request) {
  // ... auth + ratelimit + credits (as in /api/chat above)
  const { messages, organizationId } = await req.json();
  const lastUserMessage = messages.findLast((m: any) => m.role === "user")?.content ?? "";

  // Retrieve top-5 relevant chunks
  const retrieved = await searchDocuments({
    organizationId,
    query: lastUserMessage,
    limit: 5,
  });

  const context = retrieved
    .map((r, i) => `[${i + 1}] ${r.title}\n${r.content}`)
    .join("\n\n");

  const result = streamText({
    model: anthropic("claude-sonnet-4-6"),
    system: `You answer questions using ONLY the provided context. If the answer isn't in the context, say so.\n\nContext:\n${context}`,
    messages,
    maxTokens: 1024,
  });

  return result.toDataStreamResponse();
}
```

---

## Rate limiting + credit packs

### Why credit packs over subscriptions for AI

In 2026, AI-app billing has shifted. Subscriptions ($20/month) hide cost from heavy users and over-charge light ones. **Credit packs** (one-time purchases — $5 for 100 credits, $20 for 500) align cost with usage and have eaten the AI-indie market.

Use one or the other depending on the project:

| Use subscriptions | Use credit packs |
|---|---|
| Predictable usage (chat agent that runs daily) | Spiky usage (occasional document analysis) |
| Team/org buyers ("Pro plan / $99/mo") | Indie / consumer buyers |
| Bundled with non-AI features | AI is the product |

### Credit packs schema

```prisma
model CreditWallet {
  id        String   @id @default(cuid())
  userId    String   @unique
  balance   Int      @default(0)
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model CreditTransaction {
  id        String   @id @default(cuid())
  userId    String
  delta     Int      // positive for purchase, negative for spend
  reason    String   // "purchase:pack-100", "spend:chat", "spend:rag", ...
  stripeId  String?  // checkout session id for purchases
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, createdAt])
}
```

### Spend helper

```ts
// src/lib/credits.ts
import { db } from "@/lib/db";

export async function spendCredits(userId: string, amount: number): Promise<boolean> {
  // Single-statement guard against race conditions
  const result = await db.creditWallet.updateMany({
    where: { userId, balance: { gte: amount } },
    data: { balance: { decrement: amount } },
  });
  if (result.count === 0) return false;

  await db.creditTransaction.create({
    data: { userId, delta: -amount, reason: "spend:llm" },
  });
  return true;
}
```

### Purchase flow (Stripe one-time)

```ts
// src/app/api/credits/purchase/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PACKS = {
  "pack-100": { credits: 100, priceCents: 500 },
  "pack-500": { credits: 500, priceCents: 2000 },
  "pack-2000": { credits: 2000, priceCents: 6000 },
} as const;

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { packId } = await req.json();
  const pack = PACKS[packId as keyof typeof PACKS];
  if (!pack) return NextResponse.json({ error: "Invalid pack" }, { status: 400 });

  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: `${pack.credits} credits` },
          unit_amount: pack.priceCents,
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: session.user.id,
      credits: pack.credits.toString(),
      packId,
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?credits=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?credits=cancelled`,
  });

  return NextResponse.json({ url: checkout.url });
}
```

### Webhook fulfillment

```ts
// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const credits = parseInt(session.metadata?.credits ?? "0", 10);
    const packId = session.metadata?.packId;

    if (userId && credits > 0) {
      // Idempotency — don't double-credit on webhook retries
      const existing = await db.creditTransaction.findFirst({
        where: { stripeId: session.id },
      });
      if (existing) return NextResponse.json({ ok: true });

      await db.$transaction([
        db.creditWallet.upsert({
          where: { userId },
          create: { userId, balance: credits },
          update: { balance: { increment: credits } },
        }),
        db.creditTransaction.create({
          data: { userId, delta: credits, reason: `purchase:${packId}`, stripeId: session.id },
        }),
      ]);
    }
  }

  return NextResponse.json({ ok: true });
}
```

---

## Cost-control checklist

Before shipping any AI feature, confirm:

- [ ] Per-user rate limit (e.g. 20 req / hour) via `@upstash/ratelimit`
- [ ] Per-user credit balance check before every LLM call
- [ ] `maxTokens` capped on every `streamText` / `generateText` call
- [ ] System prompt + retrieved context capped (don't blow up on a 10MB document)
- [ ] Embedding job throttled (don't index 100k chunks in one request)
- [ ] Webhook handler is idempotent (Stripe retries on 5xx)
- [ ] You're using the smallest model that produces acceptable quality — verify with eval before defaulting to Opus

---

## What NOT to do

- **Don't roll your own streaming.** Use Vercel AI SDK's `streamText` + `useChat`. SSE parsing is fiddly and error-prone.
- **Don't run your own vector DB.** pgvector inside Neon is enough for most apps up to ~10M chunks. Save Pinecone / Qdrant for when you outgrow it.
- **Don't trust LLM JSON output without a schema.** Use `generateObject` + Zod every time.
- **Don't bill subscriptions for spiky AI workloads.** Credit packs better match user expectations and pricing math.
- **Don't expose API keys in the browser.** All LLM calls go through `/api/*` server routes.

---

## Reference

- **Vercel AI SDK docs:** [sdk.vercel.ai/docs](https://sdk.vercel.ai/docs)
- **Anthropic SDK info:** Use the `claude-api` skill from your coding agent if available
- **pgvector:** [github.com/pgvector/pgvector](https://github.com/pgvector/pgvector)
- **Neon + pgvector guide:** [neon.tech/docs/extensions/pgvector](https://neon.tech/docs/extensions/pgvector)
- **Stripe credit packs blog:** Search "AI app credit packs Stripe pattern"

---

_Last updated: 2026-05-14_
