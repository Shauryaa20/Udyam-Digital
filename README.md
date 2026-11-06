# Udyam Digital

Udyam Digital is a demo-ready Airtel Business onboarding platform for Indian small and medium businesses. It covers AI-assisted recommendations, quote customisation, mock digital KYC and installation tracking in one mobile-first workspace.

## Run locally

```bash
npm install
copy .env.example .env
npm run dev
```

Open `http://localhost:5173`. The API runs on `http://localhost:4000`.

To build the frontend: `npm run build`. To type-check: `npm run typecheck`.

## Demo journey

1. Open **AI Business Advisor** and answer the three short steps.
2. Customise the recommendation in **Quotes & checkout** and generate a quote.
3. Use the demo GSTIN `27AABCU9603R1ZM`, business name `Udyam Foods & Retail`, select consent, and verify in **Smart KYC**.
4. Continue to **Installation tracker** and use the Demo control to advance the order through activation.

The API uses a rule-based recommendation fallback and an in-memory mock registry. No real government API, Aadhaar data, or OpenAI key is required. State is persisted in browser local storage so a refresh keeps the demo journey.
