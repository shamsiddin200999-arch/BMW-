// ---------- Mashina sahifasi ----------
const params = new URLSearchParams(location.search);

function renderDetail() {
  const box = $("#detail");
  const p = find(params.get("id"));
  if (!p) { box.innerHTML = `<a class="back" href="index.html#products">${ic("left")} ${t("back")}</a><p class="empty">${t("notFound")}</p>`; return; }
  document.title = p.name + " · Bavaria Motors";

  const electric = p.fuel === "electric";
  const fuelKey = { petrol: "vPetrol", hybrid: "vHybrid", electric: "vElectric" }[p.fuel];
  const rows = [
    ["sYear", p.year],
    ["sBody", t(p.cat)],
    ["sEngine", p.engine === "EL" ? t("vElectric") : p.engine],
    ["sPower", `${p.hp} ${t("hp")}`],
    ["sTorque", `${p.nm} ${t("uNm")}`],
    ["sAccel", `${p.acc} ${t("uS")}`],
    ["sTop", `${p.top} ${t("uKmh")}`],
    ["sCons", `${p.cons} ${t(electric ? "uKwh" : "uL")}`],
    ["sFuel", t(fuelKey)],
    ["sDrive", t("d" + p.drive)],
    ["sSeats", p.seats]
  ];
  const minis = [["sPower", `${p.hp} ${t("hp")}`], ["sAccel", `${p.acc} ${t("uS")}`], ["sTop", `${p.top} ${t("uKmh")}`], ["sDrive", t("d" + p.drive)]];

  // O'xshash mashinalar: avval shu turdagilar, keyin boshqalar
  const similar = [...products.filter(x => x.id !== p.id && x.cat === p.cat), ...products.filter(x => x.id !== p.id && x.cat !== p.cat)].slice(0, 3);

  box.innerHTML = `
    <a class="back" href="index.html#products">${ic("left")} ${t("back")}</a>
    <div class="detail-grid">
      <div class="detail-photo"><div class="photo-box">${carImg(p)}</div></div>
      <div class="detail-info">
        <span class="tag t-${p.cat}">${tagIcon(p)}${t(p.cat)}</span>
        <h1>${p.name}</h1>
        <p class="specs">${spec(p.specs)}</p>
        <p class="sold">${ic("check")} ${t("soldN", { n: p.sold })}</p>
        <div class="price-box">
          <small>${t("price")}</small>
          <div class="price big">${money(p.price)}</div>
          <small>${t("monthly", { m: money(Math.round(p.price / 36)) })}</small>
        </div>
        <div class="mini-specs">${minis.map(m => `<div class="mini"><b>${m[1]}</b><span>${t(m[0])}</span></div>`).join("")}</div>
        ${buttons(p, false)}
        <a class="btn btn-amber calc-link" href="index.html?car=${p.id}#calc">${ic("card")} ${t("calcLink")}</a>
      </div>
    </div>
    <p class="desc">${t("desc_" + p.cat)}</p>
    <h2>${t("specsT")}</h2>
    <div class="spec-table">${rows.map(r => `<div class="spec-row"><span>${t(r[0])}</span><b>${r[1]}</b></div>`).join("")}</div>
    <p class="note">${t("approx")}</p>
    <h2>${t("similarT")}</h2>
    <div class="grid">${similar.map(cardHTML).join("")}</div>`;
}
window.onLang = renderDetail;
renderDetail();
window.scrollTo(0, 0);
