
(() => {
  const demoMarkets = [
    {symbol:"NASDAQ 100", code:"NDX", price:23272.40, change:1.18, high:23340.10, low:22908.60, type:"index", region:"US"},
    {symbol:"S&P 500", code:"SPX", price:6389.77, change:0.72, high:6412.20, low:6338.45, type:"index", region:"US"},
    {symbol:"DOW JONES", code:"DJI", price:45113.56, change:0.31, high:45200.14, low:44790.33, type:"index", region:"US"},
    {symbol:"DAX", code:"DAX", price:24262.31, change:-0.42, high:24401.60, low:24176.21, type:"index", region:"EU"},
    {symbol:"GOLD", code:"XAU/USD", price:3377.84, change:0.86, high:3390.12, low:3342.77, type:"commodity", region:"GLOBAL"},
    {symbol:"EUR/USD", code:"EURUSD", price:1.1518, change:-0.14, high:1.1549, low:1.1488, type:"forex", region:"GLOBAL"},
    {symbol:"GBP/USD", code:"GBPUSD", price:1.3376, change:0.22, high:1.3408, low:1.3319, type:"forex", region:"GLOBAL"},
    {symbol:"USD/JPY", code:"USDJPY", price:149.32, change:0.38, high:149.88, low:148.51, type:"forex", region:"GLOBAL"},
    {symbol:"BITCOIN", code:"BTC/USD", price:118420.00, change:2.14, high:119860.00, low:115330.00, type:"crypto", region:"GLOBAL"},
    {symbol:"ETHEREUM", code:"ETH/USD", price:3814.20, change:1.61, high:3870.10, low:3698.40, type:"crypto", region:"GLOBAL"}
  ];

  const money = (m) => {
    if (m.code.includes("USD") && m.price < 10) return m.price.toFixed(4);
    if (m.price >= 1000) return m.price.toLocaleString("en-US", {maximumFractionDigits:2});
    return m.price.toLocaleString("en-US", {minimumFractionDigits:2, maximumFractionDigits:2});
  };
  const pct = v => `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
  const signClass = v => v >= 0 ? "up" : "down";

  function marketOpen(m) {
    if (m.type === "crypto") return true;
    const now = new Date();
    const day = now.getUTCDay();
    const hour = now.getUTCHours() + now.getUTCMinutes()/60;
    if (day === 0 || day === 6) return false;
    if (m.type === "forex" || m.type === "commodity") return true;
    if (m.region === "EU") return hour >= 7 && hour < 15.5;
    if (m.region === "US") return hour >= 13.5 && hour < 20;
    return false;
  }

  function renderTicker(markets) {
    const row = markets.map(m => `<span class="ticker-item"><b>${m.symbol}</b><span>${money(m)}</span><em class="${signClass(m.change)}">${pct(m.change)}</em></span>`).join("");
    document.querySelectorAll("[data-market-ticker]").forEach(el => el.innerHTML = row + row);
  }

  function renderCards(markets) {
    const container = document.querySelector("[data-market-grid]");
    if (!container) return;
    container.innerHTML = markets.map(m => {
      const open = marketOpen(m);
      return `<article class="market-card">
        <div class="market-card-top"><div><span class="market-code">${m.code}</span><h3>${m.symbol}</h3></div><span class="status ${open ? "open" : "closed"}">${open ? "OPEN" : "CLOSED"}</span></div>
        <div class="market-price">${money(m)}</div>
        <div class="market-change ${signClass(m.change)}">${m.change >= 0 ? "▲" : "▼"} ${pct(m.change)}</div>
        <div class="market-range"><span>Low <b>${money({...m,price:m.low})}</b></span><span>High <b>${money({...m,price:m.high})}</b></span></div>
        <div class="spark ${signClass(m.change)}"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
      </article>`;
    }).join("");
  }

  function renderMovers(markets) {
    const sorted = [...markets].sort((a,b) => b.change-a.change);
    const gain = document.querySelector("[data-gainers]");
    const lose = document.querySelector("[data-losers]");
    if (gain) gain.innerHTML = sorted.slice(0,3).map(m => `<li><span>${m.symbol}</span><b class="up">${pct(m.change)}</b></li>`).join("");
    if (lose) lose.innerHTML = sorted.slice(-3).reverse().map(m => `<li><span>${m.symbol}</span><b class="down">${pct(m.change)}</b></li>`).join("");
  }

  function stamp() {
    document.querySelectorAll("[data-market-time]").forEach(el => {
      el.textContent = new Date().toLocaleString("en-GB", {dateStyle:"medium", timeStyle:"short"});
    });
  }

  async function loadMarkets() {
    let markets = demoMarkets;
    let mode = "DEMO";
    try {
      const response = await fetch("/api/markets", {headers:{"accept":"application/json"}, cache:"no-store"});
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.markets) && data.markets.length) {
          markets = data.markets;
          mode = data.mode || "LIVE";
        }
      }
    } catch (_) {}
    document.querySelectorAll("[data-feed-mode]").forEach(el => {
      el.textContent = mode === "DEMO" ? "DEMO FEED" : "LIVE DATA";
      el.classList.toggle("live", mode !== "DEMO");
    });
    renderTicker(markets);
    renderCards(markets);
    renderMovers(markets);
    stamp();
  }

  loadMarkets();
  setInterval(loadMarkets, 60000);
})();
