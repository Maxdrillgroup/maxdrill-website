
(() => {
  const cartKey = "maxdrill_demo_cart";
  const toast = msg => {
    let t = document.querySelector(".md-toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "md-toast";
      Object.assign(t.style,{position:"fixed",right:"20px",bottom:"20px",zIndex:"9999",padding:"14px 18px",borderRadius:"12px",background:"#102334",border:"1px solid rgba(255,255,255,.14)",color:"#fff",boxShadow:"0 20px 60px rgba(0,0,0,.45)"});
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = "1";
    setTimeout(()=>t.style.opacity="0",2500);
  };
  document.querySelectorAll("[data-add-product]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const product = {name:btn.dataset.addProduct, price:Number(btn.dataset.price||0)};
      localStorage.setItem(cartKey,JSON.stringify(product));
      toast(`${product.name} added to demo checkout`);
      setTimeout(()=>location.href="/checkout/",600);
    });
  });
  const cart = JSON.parse(localStorage.getItem(cartKey) || "null");
  document.querySelectorAll("[data-cart-name]").forEach(e=>e.textContent=cart?.name || "MAXDRILL Genesis Forex");
  document.querySelectorAll("[data-cart-price]").forEach(e=>e.textContent=`CHF ${(cart?.price || 499).toFixed(2)}`);
  document.querySelectorAll("[data-demo-login]").forEach(f=>{
    f.addEventListener("submit",e=>{e.preventDefault();location.href="/portal/dashboard/";});
  });
  document.querySelectorAll("[data-demo-checkout]").forEach(f=>{
    f.addEventListener("submit",e=>{e.preventDefault();toast("Demo checkout only — Stripe is not connected yet.");});
  });
})();
