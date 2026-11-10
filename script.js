// ---------- Yordamchilar ----------
const $ = (s) => document.querySelector(s);
const money = (n) => "$" + n.toLocaleString("en-US");
const fmt = (n) => n.toLocaleString("en-US").replace(/,/g, " ");
const ic = (n) => `<svg class="ic"><use href="#i-${n}"/></svg>`;
const find = (id) => products.find(p => p.id == id);
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
const store = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

// ---------- Til ----------
let lang = load("bmwLang", "uz");
if (!dict[lang]) lang = "uz";
function t(key, vars) {
  let s = (dict[lang] && dict[lang][key]) || dict.uz[key] || key;
  if (vars) for (const k in vars) s = s.split("{" + k + "}").join(vars[k]);
  return s;
}
const spec = (s) => s.replace(/\{(\w+)\}/g, (m, k) => t(k));
const city = (i) => cityNames[lang][i];

function applyI18n() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n, { n: branches.length }); });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  document.querySelectorAll("[data-i18n-aria]").forEach(el => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
  $("#lang").value = lang;
  renderHero(); renderProducts(); renderCalc(); renderBranches(); renderCarousel(); renderCart(); renderHistory();
  if (window.onLang) onLang();
}
$("#lang").addEventListener("change", e => { lang = e.target.value; store("bmwLang", lang); applyI18n(); });

// ---------- Kun / tun rejimi ----------
function setTheme(th) {
  document.documentElement.setAttribute("data-theme", th);
  $("#themeIcon use").setAttribute("href", th === "dark" ? "#i-sun" : "#i-moon");
  try { localStorage.setItem("bmwTheme", th); } catch (e) {}
}
$("#themeBtn").onclick = () => setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
setTheme(document.documentElement.getAttribute("data-theme") || "dark");

// ---------- Mashina rasmi (SVG) ----------
const shapes = {
  sedan: { body: "M30 108 L36 88 Q40 78 56 74 L116 66 Q142 36 176 32 L244 32 Q282 34 308 64 L352 72 Q372 76 372 94 L372 110 Q372 118 362 118 L38 118 Q30 118 30 108 Z",
           w1: "M132 64 Q152 42 180 40 L204 40 L204 66 Z", w2: "M212 40 L244 40 Q272 42 292 64 L212 66 Z" },
  suv:   { body: "M30 108 L34 80 Q38 68 56 66 L120 62 Q132 28 170 24 L290 24 Q318 30 330 62 L356 68 Q374 72 374 92 L374 110 Q374 118 364 118 L38 118 Q30 118 30 108 Z",
           w1: "M138 58 Q150 34 176 32 L204 32 L204 60 Z", w2: "M212 32 L284 32 Q304 38 316 60 L212 60 Z" },
  sport: { body: "M30 110 L38 94 Q44 86 60 82 L130 76 Q160 52 196 48 L250 48 Q286 52 306 74 L350 80 Q372 84 372 98 L372 112 Q372 118 362 118 L38 118 Q30 118 30 110 Z",
           w1: "M150 74 Q170 56 198 54 L210 54 L210 76 Z", w2: "M218 54 L248 54 Q272 58 290 76 L218 76 Z" }
};
const wheel = (cx) => `<g class="wheel"><circle cx="${cx}" cy="118" r="26" fill="#14171c"/><circle cx="${cx}" cy="118" r="15" fill="#c9d0da"/><path d="M${cx} 105v26M${cx - 13} 118h26" stroke="#14171c" stroke-width="3"/><circle cx="${cx}" cy="118" r="4" fill="#14171c"/></g>`;
function carSVG(color, shape = "sedan") {
  const s = shapes[shape];
  return `<svg class="car-svg" viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="BMW">
    <ellipse cx="200" cy="142" rx="170" ry="9" fill="rgba(0,0,0,.25)"/>
    <path d="${s.body}" fill="${color}"/>
    <path d="${s.w1}" fill="#cfe2f7" opacity=".92"/><path d="${s.w2}" fill="#cfe2f7" opacity=".92"/>
    <rect x="340" y="90" width="26" height="8" rx="3" fill="#fff6c9"/>
    <rect x="34" y="92" width="16" height="8" rx="3" fill="#e0332b"/>
    ${wheel(108)}${wheel(302)}
  </svg>`;
}


// ---------- Holat ----------
let cart = load("bmwCart", []);
let history = load("bmwHistory", []);
let currentTab = "mine";
let currentFilter = "all";

// ---------- Mahsulotlar ----------
let query = "";
// Haqiqiy rasm: 1) images/ papkasidagi fayl, 2) Wikimedia Commons'dan qidiruv, 3) chizilgan mashina
const photos = load("bmwPhotos2", {});
const pending = {};
const BAD = /interior|engine|dashboard|cockpit|logo|badge|emblem|wheel|seat|steering|trunk|console|display|brochure|drawing|diagram/i;
function fetchPhoto(p) {
  if (photos[p.id]) return Promise.resolve(photos[p.id]);
  if (pending[p.id]) return pending[p.id];
  const url = "https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=20" +
    "&gsrsearch=" + encodeURIComponent(p.q + " filetype:bitmap") + "&prop=imageinfo&iiprop=url|mime|size&iiurlwidth=1400";
  pending[p.id] = fetch(url).then(r => r.json()).then(d => {
    const pages = Object.values((d.query && d.query.pages) || {}).sort((a, b) => a.index - b.index);
    const good = pages.filter(pg => { const ii = pg.imageinfo && pg.imageinfo[0]; return ii && /jpeg/.test(ii.mime) && ii.thumburl && !BAD.test(pg.title); });
    // Avval katta va yotiq (landscape) rasmlar tanlanadi
    const pick = good.find(pg => { const ii = pg.imageinfo[0]; return ii.width >= 1400 && ii.width > ii.height * 1.3; }) || good[0];
    if (!pick) return null;
    photos[p.id] = pick.imageinfo[0].thumburl;
    store("bmwPhotos2", photos);
    return photos[p.id];
  }).catch(() => null);
  return pending[p.id];
}
const imgAttrs = (p) => `alt="${p.name}" data-id="${p.id}" data-color="${p.color}" data-shape="${p.shape}"`;
const carImg = (p) => `<img class="car-photo" src="images/${p.file}" loading="lazy" ${imgAttrs(p)}>`;
const carThumb = (p) => `<img class="thumb" src="images/${p.file}" ${imgAttrs(p)}>`;
const carLink = (p) => `car.html?id=${p.id}`;
const tagIcon = (p) => p.cat === "Elektr" ? ic("zap") : ic("car");
const buttons = (p, withDetails = true) => `<div class="card-actions">
  ${withDetails ? `<a class="btn btn-primary details" href="${carLink(p)}">${t("details")} ${ic("right")}</a>` : ""}
  <button class="btn btn-red" data-buy="${p.id}">${ic("card")} ${t("buy")}</button>
  <button class="btn btn-green" data-add="${p.id}">${ic("cart")} ${t("addCart")}</button></div>`;

// ---------- Bosh sahifa: 3 ta mashina (X7, M5 Competition, i8) ----------
const heroIds = [8, 13, 14];
function renderHero() {
  const box = $("#heroCars");
  if (!box) return;
  box.innerHTML = heroIds.map((id, i) => {
    const p = find(id);
    return `<a class="hero-car-card c${i + 1}" href="${carLink(p)}" aria-label="${p.name}">
      <div class="photo-box">${carImg(p)}</div>
      <div class="hc-label"><b>${p.name}</b><span>${money(p.price)}</span></div></a>`;
  }).join("");
}

function cardHTML(p) {
  return `<article class="card" data-id="${p.id}">
    <span class="tag t-${p.cat}">${tagIcon(p)}${t(p.cat)}</span>
    <a class="photo-box" href="${carLink(p)}" aria-label="${p.name}">${carImg(p)}</a>
    <div class="card-body">
      <h3><a href="${carLink(p)}">${p.name}</a></h3>
      <p class="specs">${spec(p.specs)}</p>
      <p class="sold">${ic("check")} ${t("soldN", { n: p.sold })}</p>
      <div class="price">${money(p.price)}</div>
      ${buttons(p)}
    </div>
  </article>`;
}
function renderProducts() {
  if (!$("#grid")) return;
  const q = query.trim().toLowerCase();
  const list = products.filter(p =>
    (currentFilter === "all" || p.cat === currentFilter) &&
    (!q || (p.name + " " + t(p.cat) + " " + p.price).toLowerCase().includes(q)));
  $("#grid").innerHTML = list.length ? list.map(cardHTML).join("") : `<p class="empty full-row">${t("noResults")}</p>`;
}
if ($("#filters")) {
  $("#filters").addEventListener("click", e => {
    const b = e.target.closest(".chip");
    if (!b) return;
    currentFilter = b.dataset.filter;
    document.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c === b));
    renderProducts();
  });
  $("#search").addEventListener("input", e => { query = e.target.value; renderProducts(); });
}
// Rasm yuklanmasa: avval Commons'dan qidiriladi, bo'lmasa chizilgan mashina chiqadi
document.addEventListener("error", e => {
  const i = e.target;
  if (!i || i.tagName !== "IMG" || !i.dataset.color) return;
  const fallback = () => { i.outerHTML = carSVG(i.dataset.color, i.dataset.shape); };
  if (i.dataset.stage === "remote" || !i.dataset.id) { fallback(); return; }
  i.dataset.stage = "remote";
  fetchPhoto(find(i.dataset.id)).then(u => { if (u) i.src = u; else fallback(); });
}, true);

// ---------- Kredit kalkulyatori ----------
function initCalc() {
  const sel = $("#calcCar");
  if (!sel) return;
  sel.innerHTML = products.map(p => `<option value="${p.id}">${p.name} - ${money(p.price)}</option>`).join("");
  const pre = new URLSearchParams(location.search).get("car");
  if (pre && find(pre)) sel.value = pre;
  ["#calcCar", "#calcDown", "#calcTerm", "#calcRate"].forEach(id => $(id).addEventListener("input", renderCalc));
}
function renderCalc() {
  if (!$("#calcCar")) return;
  const p = find($("#calcCar").value);
  const dp = +$("#calcDown").value, n = +$("#calcTerm").value, r = +$("#calcRate").value;
  const down = Math.round(p.price * dp / 100), loan = p.price - down;
  const mr = r / 100 / 12;
  const monthly = loan === 0 ? 0 : (mr === 0 ? loan / n : loan * mr / (1 - Math.pow(1 + mr, -n)));
  const total = monthly * n, over = Math.max(total - loan, 0);
  $("#vDown").textContent = dp + "% · " + money(down);
  $("#vTerm").textContent = t("cMonths", { n });
  $("#vRate").textContent = r + "%";
  $("#rMonthly").textContent = money(Math.round(monthly));
  const sum = down + loan + over, bar = $("#calcBar").children;
  bar[0].style.width = (down / sum * 100) + "%";
  bar[1].style.width = (loan / sum * 100) + "%";
  bar[2].style.width = (over / sum * 100) + "%";
  $("#calcLegend").innerHTML = `<li><i style="background:var(--green)"></i>${t("cBarDown")}</li><li><i style="background:var(--blue)"></i>${t("cBarLoan")}</li><li><i style="background:var(--amber)"></i>${t("cBarInt")}</li>`;
  const row = (k, v) => `<div class="crow"><span>${t(k)}</span><b>${money(Math.round(v))}</b></div>`;
  $("#calcRows").innerHTML = row("cPrice", p.price) + row("cDownAmt", down) + row("cLoan", loan) + row("cTotal", total) + row("cOver", over);
  $("#calcBuy").dataset.buy = p.id;
  $("#calcAdd").dataset.add = p.id;
}
initCalc();

// ---------- Filiallar ----------
function renderBranches() {
  if (!$("#branchGrid")) return;
  $("#branchGrid").innerHTML = branches.map(b => `
    <div class="branch">
      <h3>${ic("pin")} ${city(b.c)}</h3>
      <p>${ic("home")} ${b.street}, ${b.no}</p>
      <p>${ic("phone")} ${b.tel}</p>
      <span class="open">${t("open")}</span>
    </div>`).join("");
}

// ---------- Statistika ----------
const targets = { sold: TOTAL_SOLD, branches: branches.length };
function countUp(el) {
  const end = targets[el.dataset.count] ?? +el.dataset.count;
  const start = performance.now();
  (function tick(now) {
    const k = Math.min((now - start) / 1500, 1);
    el.textContent = fmt(Math.round(end * (1 - Math.pow(1 - k, 3))));
    if (k < 1) requestAnimationFrame(tick);
  })(start);
}
const counters = document.querySelectorAll("[data-count]");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { countUp(en.target); io.unobserve(en.target); }
  }), { threshold: .4 });
  counters.forEach(c => io.observe(c));
} else counters.forEach(countUp);

// ---------- Karusel ----------
let slideIndex = 0, autoTimer;
function renderCarousel() {
  if (!$("#track")) return;
  $("#track").innerHTML = featuredIds.map(id => {
    const p = find(id);
    return `<div class="slide">
      <a class="photo-box slide-img" href="${carLink(p)}" aria-label="${p.name}">${carImg(p)}</a>
      <div class="slide-info">
        <span class="tag t-${p.cat}">${tagIcon(p)}${t(p.cat)}</span>
        <h3><a href="${carLink(p)}">${p.name}</a></h3>
        <p class="specs">${spec(p.specs)}</p>
        <p class="sold">${ic("check")} ${t("soldN", { n: p.sold })}</p>
        <div class="price">${money(p.price)}</div>
        ${buttons(p)}
      </div></div>`;
  }).join("");
  $("#dots").innerHTML = featuredIds.map((_, i) => `<button data-go="${i}" aria-label="${i + 1}"></button>`).join("");
  goTo(slideIndex);
}
function runBar() {
  const bar = $("#progressBar");
  if (!bar) return;
  bar.classList.remove("run");
  void bar.offsetWidth;
  bar.classList.add("run");
}
function goTo(i) {
  const n = featuredIds.length;
  slideIndex = (i + n) % n;
  runBar();
  $("#track").style.transform = `translateX(-${slideIndex * 100}%)`;
  document.querySelectorAll(".slide").forEach((s, k) => s.classList.toggle("active", k === slideIndex));
  document.querySelectorAll("#dots button").forEach((d, k) => d.classList.toggle("active", k === slideIndex));
}
function autoplay() {
  clearInterval(autoTimer);
  runBar();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  autoTimer = setInterval(() => goTo(slideIndex + 1), 5000);
}
const car = $("#carousel");
if (car) {
$("#prev").onclick = () => { goTo(slideIndex - 1); autoplay(); };
$("#next").onclick = () => { goTo(slideIndex + 1); autoplay(); };
$("#dots").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { goTo(+b.dataset.go); autoplay(); } });
car.addEventListener("mouseenter", () => clearInterval(autoTimer));
car.addEventListener("mouseleave", autoplay);
let touchX = null;
car.addEventListener("touchstart", e => { touchX = e.touches[0].clientX; clearInterval(autoTimer); }, { passive: true });
car.addEventListener("touchend", e => {
  if (touchX !== null) {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) goTo(slideIndex + (dx < 0 ? 1 : -1));
  }
  touchX = null; autoplay();
});
autoplay();
}

// ---------- Xabarlar ----------
let toastTimer;
function toast(text) {
  const el = $("#toast");
  el.textContent = text;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}
const showModal = (title, text) => { $("#modalTitle").textContent = title; $("#modalText").textContent = text; $("#modal").classList.add("show"); };
$("#modalClose").onclick = () => $("#modal").classList.remove("show");
$("#modal").addEventListener("click", e => { if (e.target.id === "modal") $("#modal").classList.remove("show"); });

// ---------- Tarix ----------
function addHistory(p, qty, via) {
  history.unshift({ id: p.id, name: p.name, price: p.price, qty, via, date: new Date().toLocaleString("ru-RU") });
  store("bmwHistory", history);
  renderHistory();
}
function renderHistory() {
  $("#historyCount").textContent = history.length;
  const body = $("#historyBody"), foot = $("#historyFoot");
  if (currentTab === "mine") {
    body.innerHTML = history.length ? history.map(h => `
      <div class="hrow"><span class="h-ic">${ic("car")}</span>
        <div><b>${h.name}${h.qty > 1 ? " x" + h.qty : ""}</b><small>${h.date} · ${t(h.via)}</small></div>
        <span class="hp">${money(h.price * h.qty)}</span></div>`).join("")
      : `<p class="empty">${t("histEmpty")}</p>`;
    const sum = history.reduce((s, h) => s + h.price * h.qty, 0);
    foot.innerHTML = history.length
      ? `<b>${t("histTotal", { sum: money(sum) })}</b><button class="btn btn-red" id="clearHistory">${ic("trash")} ${t("clearHist")}</button>` : "";
  } else {
    body.innerHTML = recentSales.map(r => { const p = find(r.id); return `
      <div class="hrow"><span class="h-ic">${ic("check")}</span>
        <div><b>${p.name}</b><small>${t("recentMeta", { city: city(r.c), date: r.date })}</small></div>
        <span class="hp">${money(p.price)}</span></div>`; }).join("");
    foot.innerHTML = `<b>${t("soldTotal", { n: fmt(TOTAL_SOLD) })}</b>`;
  }
}
$("#historyOpen").onclick = () => { renderHistory(); $("#history").classList.add("show"); };
$("#historyClose").onclick = () => $("#history").classList.remove("show");
$("#history").addEventListener("click", e => {
  if (e.target.id === "history") $("#history").classList.remove("show");
  const tab = e.target.closest(".tab");
  if (tab) {
    currentTab = tab.dataset.tab;
    document.querySelectorAll(".tab").forEach(x => x.classList.toggle("active", x === tab));
    renderHistory();
  }
  if (e.target.closest("#clearHistory")) { history = []; store("bmwHistory", history); renderHistory(); }
});

// ---------- Savat ----------
function addToCart(id) {
  const found = cart.find(i => i.id === id);
  if (found) found.qty++; else cart.push({ id, qty: 1 });
  store("bmwCart", cart); renderCart();
  toast(t("added", { name: find(id).name }));
}
const cartTotal = () => cart.reduce((s, i) => s + i.qty * find(i.id).price, 0);
function renderCart() {
  $("#cartCount").textContent = cart.reduce((s, i) => s + i.qty, 0);
  $("#cartTotal").textContent = money(cartTotal());
  $("#cartItems").innerHTML = cart.length ? cart.map(i => {
    const p = find(i.id);
    return `<div class="item">
      ${carThumb(p)}
      <div><h4>${p.name}</h4><small>${money(p.price)}</small>
        <div class="qty"><button data-minus="${p.id}">-</button><span>${i.qty}</span><button data-plus="${p.id}">+</button></div>
      </div>
      <button class="remove" data-remove="${p.id}" aria-label="Remove">&times;</button>
    </div>`;
  }).join("") : `<p class="empty">${t("cartEmpty")}</p>`;
}
const openCart = () => { $("#drawer").classList.add("open"); $("#overlay").classList.add("show"); $("#drawer").setAttribute("aria-hidden", "false"); };
const closeCart = () => { $("#drawer").classList.remove("open"); $("#overlay").classList.remove("show"); $("#drawer").setAttribute("aria-hidden", "true"); };
$("#cartOpen").onclick = openCart;
$("#cartClose").onclick = closeCart;
$("#overlay").onclick = closeCart;
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { closeCart(); $("#modal").classList.remove("show"); $("#history").classList.remove("show"); $("#chat").classList.remove("open"); }
});

document.addEventListener("click", e => {
  const card = e.target.closest(".card[data-id]");
  if (card && !e.target.closest("button, a")) { location.href = "car.html?id=" + card.dataset.id; return; }
  const b = e.target.closest("button");
  if (!b) return;
  const d = b.dataset;
  if (d.buy) {
    const p = find(d.buy);
    addHistory(p, 1, "viaDirect");
    showModal(t("bought"), t("boughtText", { name: p.name, price: money(p.price) }));
  }
  if (d.add)    addToCart(+d.add);
  if (d.plus)   { cart.find(i => i.id == d.plus).qty++; store("bmwCart", cart); renderCart(); }
  if (d.minus)  {
    const it = cart.find(i => i.id == d.minus);
    it.qty--; if (it.qty <= 0) cart = cart.filter(i => i !== it);
    store("bmwCart", cart); renderCart();
  }
  if (d.remove) { cart = cart.filter(i => i.id != d.remove); store("bmwCart", cart); renderCart(); }
});
$("#clearCart").onclick = () => { cart = []; store("bmwCart", cart); renderCart(); };
$("#checkout").onclick = () => {
  if (!cart.length) { toast(t("cartEmptyToast")); return; }
  const total = cartTotal();
  cart.forEach(i => addHistory(find(i.id), i.qty, "viaCart"));
  cart = []; store("bmwCart", cart); renderCart(); closeCart();
  showModal(t("bought"), t("boughtCart", { total: money(total) }));
};

// ---------- Jonli chat ----------
const chat = $("#chat"), chatBody = $("#chatBody");
let greeted = false;
function addMsg(text, who) {
  const m = document.createElement("div");
  m.className = "msg " + who;
  m.textContent = text;
  chatBody.appendChild(m);
  chatBody.scrollTop = chatBody.scrollHeight;
  return m;
}
function botReply(q) {
  const prices = products.map(p => p.price);
  let text = t("rDefault");
  if (/salom|hello|\bhi\b|привет|здравств/i.test(q)) text = t("rHi");
  if (/narx|price|цен|стоим|qancha|сколько|how much/i.test(q)) text = t("rPrice", { min: money(Math.min(...prices)), max: money(Math.max(...prices)) });
  if (/kafolat|warranty|гарант/i.test(q)) text = t("rWarranty");
  if (/filial|manzil|address|адрес|филиал|branch/i.test(q)) text = t("rBranch", { n: branches.length });
  if (/test|drayv|drive|тест|драйв/i.test(q)) text = t("rTest");
  const typing = addMsg("...", "bot typing");
  setTimeout(() => { typing.remove(); addMsg(text, "bot"); }, 900);
}
$("#chatFab").onclick = () => {
  chat.classList.toggle("open");
  if (chat.classList.contains("open") && !greeted) { greeted = true; addMsg(t("chatHello"), "bot"); }
  if (chat.classList.contains("open")) $("#chatInput").focus();
};
$("#chatClose").onclick = () => chat.classList.remove("open");
$("#chatForm").addEventListener("submit", e => {
  e.preventDefault();
  const v = $("#chatInput").value.trim();
  if (!v) return;
  addMsg(v, "user");
  $("#chatInput").value = "";
  botReply(v);
});

// ---------- Menyu ----------
const nav = $("#nav");
$("#burger").onclick = () => nav.classList.toggle("open");
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
const links = [...nav.querySelectorAll("a")];
const sections = links.map(a => { try { return document.querySelector(a.getAttribute("href")); } catch (err) { return null; } });
function setActive() {
  if (!$("#home")) return;
  const y = window.scrollY + 140;
  let current = 0;
  sections.forEach((s, i) => { if (s && s.offsetTop <= y) current = i; });
  links.forEach((a, i) => a.classList.toggle("active", i === current));
}
window.addEventListener("scroll", setActive);

// ---------- Aloqa formasi ----------
if ($("#contactForm")) $("#contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("#cName").value.trim();
  e.target.reset();
  showModal(t("msgSent"), t("msgThanks", { name }));
});

// ---------- Navbar: aylantirilganda soya kuchayadi ----------
const headerEl = $("#header");
const onScroll = () => headerEl.classList.toggle("scrolled", window.scrollY > 30);
window.addEventListener("scroll", onScroll);
onScroll();

// ---------- Reklama videosi (YouTube) ----------
const vbox = $("#videoBox");
if (vbox) {
  const id = PROMO_VIDEO_ID, poster = $("#videoPoster");
  poster.src = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  poster.onerror = () => { poster.onerror = () => { poster.style.display = "none"; }; poster.src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`; };
  $("#ytLink").href = `https://www.youtube.com/watch?v=${id}`;
  const play = () => {
    if (vbox.classList.contains("playing")) return;
    vbox.classList.add("playing");
    vbox.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1" title="BMW" allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
  };
  vbox.addEventListener("click", play);
  vbox.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); } });
}

applyI18n();
setActive();
