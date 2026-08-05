document.querySelectorAll('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());
document.addEventListener("DOMContentLoaded",()=>{
  const banner=document.querySelector("[data-cookie-banner]");
  const key="maxdrill_cookie_notice_v1";
  if(banner && !localStorage.getItem(key)) banner.style.display="grid";
  document.querySelectorAll("[data-cookie-accept]").forEach(btn=>btn.addEventListener("click",()=>{
    localStorage.setItem(key,"accepted");
    if(banner) banner.style.display="none";
  }));
  document.querySelectorAll("[data-cookie-close]").forEach(btn=>btn.addEventListener("click",()=>{
    localStorage.setItem(key,"closed");
    if(banner) banner.style.display="none";
  }));
  document.querySelectorAll("[data-newsletter]").forEach(form=>form.addEventListener("submit",e=>{
    e.preventDefault();
    const email=form.querySelector("input[type=email]")?.value||"";
    window.location.href=`mailto:contact@maxdrilltech.com?subject=MAXDRILL%20Intelligence%20Updates&body=Please%20add%20${encodeURIComponent(email)}%20to%20the%20MAXDRILL%20updates%20list.`;
  }));
});
