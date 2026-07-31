# Secure Market API Adapter

This Worker template protects the provider API key and exposes `/api/markets`.

Do not publish API keys in GitHub.

Setup after choosing a provider:
1. Install Wrangler.
2. Run `wrangler secret put MARKET_API_KEY`.
3. Add the provider URL.
4. Normalize the provider response in `src/index.js`.
5. Deploy and route `/api/markets*` to the Worker.
