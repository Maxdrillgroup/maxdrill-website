
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/api/markets") {
      return new Response("Not found", { status: 404 });
    }

    // Replace PROVIDER_URL and the normalization logic for the selected provider.
    // Store MARKET_API_KEY as a Cloudflare secret, never in GitHub.
    if (!env.MARKET_API_KEY || !env.PROVIDER_URL) {
      return Response.json({ mode: "DEMO", markets: [] }, {
        headers: { "Cache-Control": "public, max-age=60" }
      });
    }

    const upstream = await fetch(env.PROVIDER_URL, {
      headers: { "Authorization": `Bearer ${env.MARKET_API_KEY}` },
      cf: { cacheTtl: 60, cacheEverything: true }
    });

    if (!upstream.ok) {
      return Response.json({ error: "Market provider unavailable" }, { status: 502 });
    }

    const providerData = await upstream.json();

    // Normalize providerData into:
    // { mode: "LIVE", markets: [{symbol,code,price,change,high,low,type,region}] }
    const markets = [];

    return Response.json({ mode: "LIVE", markets }, {
      headers: {
        "Cache-Control": "public, max-age=60",
        "Access-Control-Allow-Origin": "https://maxdrilltech.com"
      }
    });
  }
};
