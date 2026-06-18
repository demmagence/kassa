@AGENTS.md

# Kassa

Financial dashboard: a Next.js 16 (App Router) frontend + a FastAPI/MongoDB backend. Tracks income/expense transactions, cash flow, and stats.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml`, `pnpm-workspace.yaml`).

Frontend (repo root):
- `pnpm dev` — dev server on http://localhost:3000
- `pnpm build` — production build
- `pnpm start` — serve the production build
- `pnpm lint` — ESLint (flat config in `eslint.config.mjs`, extends `eslint-config-next`)

Backend (`backend/`):
- `pip install -r requirements.txt` (a committed venv exists at `backend/venv`)
- `python main.py` or `uvicorn main:app --reload` — API on http://127.0.0.1:8000 (auto-reload, port 8000)

There is no test suite.

## Architecture

**Frontend is a single client-rendered page.** `app/page.tsx` (`"use client"`) is the central state container — there is no client-side routing. It switches between `dashboard | transactions | analytics | settings` via the `activeTab` state and `renderContent()`. `app/layout.tsx` only sets up Geist fonts and global CSS.

- `app/page.tsx` owns the config state (`accountName`, `corporateEmail`, `currency`, `language`), lazy-initialized from `localStorage` under `kassa_*` keys, and **prop-drills `currency` and `language` into every child component**. A `refreshKey` counter is incremented (`triggerRefresh`) to force data re-fetches across components.
- `components/dashboard/` — all UI, all `"use client"`: `sidebar`, `navbar` (also renders notifications derived from transactions), `stat-card` (exports `StatsGrid`), `cash-flow-chart` (recharts), `transaction-table`, `new-transaction-modal`, `custom-select`, `custom-datepicker`.
- `lib/currency.ts` — **amounts are stored in USD as the base currency.** `formatCurrency(amountUSD, targetCurrency)` converts via hardcoded `EXCHANGE_RATES` and formats locale-aware. Supported: USD, EUR, IDR, GBP. Use this for all money rendering.
- `lib/locales.ts` — i18n. `t(key, lang)` returns the Bahasa Indonesia translation when `lang === "ID"`, otherwise returns the key unchanged. **The English string IS the key** — wrap user-facing text in `t("English text", language)` and add the Indonesian entry to the `id` map. `getRelativeTime` for timestamps.
- `data/mock-data.ts` — shared TS interfaces (`Transaction`, `CashFlowDataPoint`, `DashboardStats`) plus mock data used as the offline fallback.
- `backend/` — FastAPI app. `main.py` (REST endpoints + CORS for localhost:3000/3001), `models.py` (Pydantic; `type` is `income|expense`, `amount > 0`), `database.py` (Motor async client + `transaction_helper` that stringifies `_id`).

## Data flow conventions

- Each data-fetching component fetches **directly from the hardcoded `http://127.0.0.1:8000`** backend inside a `useEffect` keyed on `refreshKey`, wrapped in try/catch that **falls back to mock data when the backend is offline**. There is no shared API client or env-based URL — follow the existing per-component pattern.
- Endpoints: `GET/POST/PUT/DELETE /api/transactions`, `GET /api/transactions/{id}`, `GET /api/transactions/stats/summary`, `GET /health`, `GET /api/status`.
- Display transaction IDs are derived from the Mongo `_id` via `formatTransactionId` (e.g. `TX-YYYYMMDD-XXXX`).

## Styling

Tailwind CSS **v4**, configured CSS-first in `app/globals.css` via the `@theme` block — **there is no `tailwind.config`**. Custom tokens use a `-custom` suffix (e.g. `border-custom`, `muted-foreground-custom`, `danger-custom`). Reusable utilities: `glass-card`, `glow-primary`, `ambient-glow`. Dark theme only.

## Gotchas

- The MongoDB connection string is read from `MONGO_URL` in `backend/.env` (git-ignored; copy `backend/.env.example`). Never hardcode credentials in source. Note: an old credential was committed in history (commit `14e5b8f`) and must be rotated before the repo goes public.
- New user-facing strings need an entry in `lib/locales.ts` (ID map) or they render in English.
- New monetary values must go through `lib/currency.ts`, not ad-hoc formatting.
