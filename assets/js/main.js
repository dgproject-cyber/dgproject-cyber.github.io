/* ==========================================================================
   Francesco Cavaliere — interazioni del sito
   Tutto ciò che va personalizzato sta in CONFIG, qui sotto.
   ========================================================================== */

const CONFIG = {
  // MODIFICA: numero WhatsApp con prefisso, solo cifre (es. "393331234567"). Vuoto = non ancora disponibile.
  whatsapp: "",
  // MODIFICA: nome utente Instagram senza @ (es. "francescocavaliere.pt").
  instagram: "",
  // MODIFICA: messaggio già scritto quando si apre WhatsApp.
  messaggioWhatsapp: "Ciao Francesco, vorrei informazioni per iniziare un percorso.",
  // MODIFICA: indirizzo del servizio che riceve il modulo (es. Formspree). Vuoto = modulo in anteprima.
  moduloEndpoint: "",
  // MODIFICA: scheda Google di Francesco (Google Business Profile), quando è verificata.
  google: {
    profilo: "",          // link alla scheda, es. https://g.page/r/XXXX
    scriviRecensione: "", // link "Chiedi recensioni" dalla scheda, es. https://g.page/r/XXXX/review
    media: null,          // voto medio reale, es. 4.9
    totale: null,         // numero reale di recensioni, es. 37
    // Copia qui recensioni vere dalla scheda (testo identico, nome come appare su Google).
    recensioni: [
      // { autore: "Nome C.", stelle: 5, testo: "…", quando: "2 settimane fa" }
    ]
  },
  // MODIFICA: link esatto della palestra su Google Maps ("Condividi" → "Incorpora una mappa" per embed).
  mappa: {
    link: "https://www.google.com/maps/search/?api=1&query=39.355816%2C16.239244",
    embed: "https://www.google.com/maps?q=39.355816,16.239244&z=16&output=embed"
  },
  // MODIFICA: una voce per ogni trasformazione reale. Le foto vanno in assets/img.
  trasformazioni: [
    { titolo: "Trasformazione 1", dettagli: "", prima: "assets/img/prima-1.jpg", dopo: "assets/img/dopo-1.jpg" },
    { titolo: "Trasformazione 2", dettagli: "", prima: "assets/img/prima-2.jpg", dopo: "assets/img/dopo-2.jpg" },
    { titolo: "Trasformazione 3", dettagli: "", prima: "assets/img/prima-3.jpg", dopo: "assets/img/dopo-3.jpg" }
  ]
};

const calma = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- foto e video: compaiono da soli se il file esiste ---------- */
function caricaMedia(box, src) {
  if (!src) return;
  const img = new Image();
  img.decoding = "async";
  img.alt = "";
  img.onload = () => {
    $$("img", box).forEach(v => v.remove());
    box.appendChild(img);
    box.classList.add("caricata");
  };
  img.src = src;
}
function caricaVideo(box, src) {
  if (!src || calma) return;
  const v = document.createElement("video");
  Object.assign(v, { muted: true, loop: true, playsInline: true, autoplay: true, preload: "metadata" });
  v.setAttribute("muted", "");
  v.addEventListener("loadeddata", () => {
    box.appendChild(v);
    box.classList.add("caricata");
    document.body.classList.add("hero-con-video");
    v.play().catch(() => {});
  }, { once: true });
  v.src = src;
}
$$(".media[data-foto]").forEach(box => {
  const lazy = !box.classList.contains("media--hero");
  if (lazy && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((voci, oss) => {
      voci.forEach(v => { if (v.isIntersecting) { caricaMedia(box, box.dataset.foto); oss.disconnect(); } });
    }, { rootMargin: "300px" });
    io.observe(box);
  } else {
    caricaMedia(box, box.dataset.foto);
  }
  if (box.dataset.video) caricaVideo(box, box.dataset.video);
});

/* ---------- luce cinematografica nel hero (si nasconde se c'è il video) ---------- */
(function luceHero() {
  const cv = $("#hero-luce");
  if (!cv) return;
  const ctx = cv.getContext("2d");
  const hero = cv.closest(".hero");
  let W, H, dpr, polvere = [], tx = 0, mx = 0, visibile = true;

  function misura() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = hero.clientWidth; H = hero.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(160, W * H / 9000));
    polvere = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H, r: .4 + Math.random() * 1.6,
      vx: (Math.random() - .5) * .15, vy: -.05 - Math.random() * .25, f: Math.random() * 6.28
    }));
  }

  function fascio(t, ox, ang, larg, alfa, colore) {
    // cono di luce che scende dall'alto
    const lung = H * 1.4;
    const ex = ox + Math.sin(ang) * lung, ey = Math.cos(ang) * lung;
    const g = ctx.createLinearGradient(ox, 0, ex, ey);
    g.addColorStop(0, `rgba(${colore},${alfa})`);
    g.addColorStop(.55, `rgba(${colore},${alfa * .35})`);
    g.addColorStop(1, `rgba(${colore},0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(ox - 20, -10);
    ctx.lineTo(ox + 20, -10);
    ctx.lineTo(ex + larg, ey);
    ctx.lineTo(ex - larg, ey);
    ctx.closePath();
    ctx.fill();
  }

  function disegna(t) {
    if (document.body.classList.contains("hero-con-video")) { cv.style.display = "none"; return; }
    mx += (tx - mx) * .03;
    ctx.clearRect(0, 0, W, H);

    // pavimento: bagliore arancione basso, come una luce di scena
    const pav = ctx.createRadialGradient(W * .72, H * 1.05, 10, W * .72, H * 1.05, Math.max(W, H) * .7);
    pav.addColorStop(0, "rgba(255,140,0,.22)");
    pav.addColorStop(1, "rgba(255,140,0,0)");
    ctx.fillStyle = pav; ctx.fillRect(0, 0, W, H);

    ctx.globalCompositeOperation = "lighter";
    const sfarfallio = .92 + Math.sin(t * .0021) * .04 + Math.sin(t * .0137) * .02;
    const ox = W * .72 + mx * 40;
    fascio(t, ox, -.18 + mx * .03, W * .34, .11 * sfarfallio, "255,250,240");
    fascio(t, ox + 40, -.05 + mx * .02, W * .12, .07 * sfarfallio, "255,255,255");
    fascio(t, W * .18, .32, W * .22, .035, "255,140,0");

    // polvere sospesa: più luminosa dentro il fascio
    for (const p of polvere) {
      p.x += p.vx; p.y += p.vy; p.f += .01;
      if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
      if (p.x < -5) p.x = W + 5; if (p.x > W + 5) p.x = -5;
      const asse = ox + (p.y) * Math.tan(-.18 + mx * .03);
      const dentro = Math.max(0, 1 - Math.abs(p.x - asse) / (W * .28 * (p.y / H + .2)));
      const a = (.08 + dentro * .55) * (.6 + Math.sin(p.f) * .4);
      ctx.fillStyle = `rgba(255,236,210,${a})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
    if (!calma && visibile) requestAnimationFrame(disegna);
  }

  misura();
  addEventListener("resize", () => { misura(); if (calma) disegna(0); });
  hero.addEventListener("pointermove", e => { tx = e.clientX / innerWidth - .5; });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([v]) => {
      const prima = visibile; visibile = v.isIntersecting;
      if (visibile && !prima && !calma) requestAnimationFrame(disegna);
    }).observe(hero);
  }
  calma ? disegna(0) : requestAnimationFrame(disegna);
})();

/* ---------- navigazione ---------- */
const nav = $("#nav");
const barra = $("#barra-mobile");
const fab = $(".whatsapp-fisso");
const hero = $(".hero");
function suScroll() {
  const y = scrollY;
  nav.classList.toggle("nav--solida", y > 40);
  const oltreHero = y > hero.offsetHeight * .7;
  const aiContatti = $("#contatti").getBoundingClientRect().top < innerHeight * .6;
  const mostra = oltreHero && !aiContatti;
  barra.classList.toggle("visibile", mostra);
  fab.classList.toggle("nella-barra", mostra && innerWidth <= 900);
}
addEventListener("scroll", suScroll, { passive: true });
addEventListener("resize", suScroll);
suScroll();

// link attivo in base alla sezione visibile
if ("IntersectionObserver" in window) {
  const link = $$(".nav__link a");
  const osserva = new IntersectionObserver(voci => {
    voci.forEach(v => {
      if (v.isIntersecting) link.forEach(a => a.classList.toggle("attivo", a.getAttribute("href") === "#" + v.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach(s => osserva.observe(s));
}

/* ---------- menu mobile ---------- */
const burger = $("#burger");
const menu = $("#menu-mobile");
function apriMenu(apri) {
  burger.setAttribute("aria-expanded", String(apri));
  burger.setAttribute("aria-label", apri ? "Chiudi il menu" : "Apri il menu");
  document.documentElement.style.overflow = apri ? "hidden" : "";
  if (apri) {
    menu.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add("aperto")));
    $("a", menu).focus({ preventScroll: true });
  } else {
    menu.classList.remove("aperto");
    setTimeout(() => { if (!menu.classList.contains("aperto")) menu.hidden = true; }, calma ? 0 : 650);
  }
}
burger.addEventListener("click", () => apriMenu(burger.getAttribute("aria-expanded") !== "true"));
$$("a", menu).forEach(a => a.addEventListener("click", () => apriMenu(false)));
addEventListener("keydown", e => { if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") { apriMenu(false); burger.focus(); } });

/* ---------- comparsa durante lo scroll (solo per ciò che è sotto la piega) ---------- */
if (!calma && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(voci => {
    voci.forEach(v => {
      if (v.isIntersecting) { v.target.classList.add("visto"); v.target.classList.remove("attesa"); io.unobserve(v.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  $$(".rivela").forEach((el, i) => {
    if (el.getBoundingClientRect().top > innerHeight) {
      el.classList.add("attesa");
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      io.observe(el);
    }
  });
}

/* ---------- parallax leggero sulle foto ---------- */
const parallax = $$("[data-parallax]");
if (!calma && parallax.length) {
  let inCorso = false;
  const muovi = () => {
    parallax.forEach(el => {
      const r = el.getBoundingClientRect();
      const k = parseFloat(el.dataset.parallax) || .08;
      const sposta = (r.top + r.height / 2 - innerHeight / 2) * -k;
      const img = $("img", el);
      if (img) img.style.transform = `translate3d(0,${sposta.toFixed(1)}px,0)`;
    });
    inCorso = false;
  };
  addEventListener("scroll", () => { if (!inCorso) { inCorso = true; requestAnimationFrame(muovi); } }, { passive: true });
}

/* ---------- contatori: partono solo con numeri reali ---------- */
const contatori = $$("[data-count]").filter(el => el.dataset.count.trim() !== "");
if (contatori.length) {
  const anima = el => {
    const fine = parseFloat(el.dataset.count), suff = el.dataset.suffisso || "";
    if (calma) { el.textContent = fine + suff; return; }
    const t0 = performance.now(), durata = 1600;
    const passo = t => {
      const k = Math.min(1, (t - t0) / durata), e = 1 - Math.pow(1 - k, 4);
      el.textContent = Math.round(fine * e) + suff;
      if (k < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  };
  const io = new IntersectionObserver(voci => voci.forEach(v => { if (v.isIntersecting) { anima(v.target); io.unobserve(v.target); } }), { threshold: .6 });
  contatori.forEach(el => io.observe(el));
}

/* ---------- prima / dopo ---------- */
(function confronto() {
  const box = $("#confronto");
  if (!box) return;
  const range = $("#confronto-range");
  const imposta = v => { box.style.setProperty("--pos", v + "%"); range.value = v; };
  range.addEventListener("input", () => imposta(range.value));

  let trascina = false;
  const daPuntatore = e => {
    const r = box.getBoundingClientRect();
    imposta(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)).toFixed(1));
  };
  box.addEventListener("pointerdown", e => { trascina = true; box.setPointerCapture(e.pointerId); daPuntatore(e); });
  box.addEventListener("pointermove", e => { if (trascina) daPuntatore(e); });
  box.addEventListener("pointerup", () => { trascina = false; });
  box.addEventListener("pointercancel", () => { trascina = false; });

  // piccolo invito al primo passaggio
  if (!calma && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(([v]) => {
      if (!v.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const onda = t => {
        const k = (t - t0) / 1400;
        if (k >= 1 || trascina) { if (!trascina) imposta(50); return; }
        imposta((50 + Math.sin(k * Math.PI * 2) * 18).toFixed(1));
        requestAnimationFrame(onda);
      };
      requestAnimationFrame(onda);
    }, { threshold: .6 });
    io.observe(box);
  }

  // cambio trasformazione
  const lista = CONFIG.trasformazioni;
  let i = 0;
  const prima = $(".confronto__prima", box), dopo = $(".confronto__dopo", box);
  const info = $("#trasf-info"), conta = $("#trasf-conta");
  function mostra(n) {
    i = (n + lista.length) % lista.length;
    const t = lista[i];
    [prima, dopo].forEach(m => { m.classList.remove("caricata"); $$("img", m).forEach(x => x.remove()); });
    caricaMedia(prima, t.prima);
    caricaMedia(dopo, t.dopo);
    $("strong", info).textContent = t.titolo;
    const det = $("span", info);
    det.textContent = t.dettagli || "Qui mettiamo durata, obiettivo e risultato.";
    det.classList.toggle("slot", !t.dettagli);
    conta.textContent = `${i + 1} / ${lista.length}`;
    box.classList.remove("cambia"); void box.offsetWidth; box.classList.add("cambia");
    imposta(50);
  }
  $("#trasf-prev").addEventListener("click", () => mostra(i - 1));
  $("#trasf-next").addEventListener("click", () => mostra(i + 1));
  conta.textContent = `1 / ${lista.length}`;
})();

/* ---------- link WhatsApp e Instagram ---------- */
(function contatti() {
  const wa = CONFIG.whatsapp.replace(/\D/g, "");
  const ig = CONFIG.instagram.replace(/^@/, "");
  $$('[data-link="whatsapp"]').forEach(a => {
    if (!wa) return;
    a.href = `https://wa.me/${wa}?text=${encodeURIComponent(CONFIG.messaggioWhatsapp)}`;
    a.target = "_blank"; a.rel = "noopener";
  });
  $$('[data-link="instagram"]').forEach(a => {
    if (!ig) return;
    a.href = `https://www.instagram.com/${ig}/`;
    a.target = "_blank"; a.rel = "noopener";
  });
  const tWa = $('[data-testo="whatsapp"]'), tIg = $('[data-testo="instagram"]');
  if (wa && tWa) tWa.textContent = "+" + wa.replace(/^(\d{2})(\d{3})(\d+)/, "$1 $2 $3");
  if (ig && tIg) tIg.textContent = "@" + ig;
})();

/* ---------- recensioni Google ---------- */
(function recensioni() {
  const g = CONFIG.google, lista = $("#google-lista");
  if (!lista) return;
  const stelle = (n, el) => $$("i", el).forEach((s, k) => s.classList.toggle("piena", k < Math.round(n)));
  if (g.media) {
    $("#google-media").textContent = String(g.media).replace(".", ",");
    stelle(g.media, $("#google-stelle"));
    $("#google-stelle").setAttribute("aria-label", `${g.media} su 5`);
    $("#google-stelle").removeAttribute("aria-hidden");
  }
  if (g.totale) $("#google-totale").textContent = `${g.totale} recensioni su Google`;

  if (g.recensioni.length) {
    g.recensioni.forEach(r => {
      const f = document.createElement("figure");
      f.className = "recensione";
      f.innerHTML = `<span class="stelle" aria-label="${r.stelle} su 5"><i></i><i></i><i></i><i></i><i></i></span><blockquote></blockquote><figcaption><b></b><span></span></figcaption>`;
      $("blockquote", f).textContent = r.testo;
      $("b", f).textContent = r.autore;
      $("figcaption span", f).textContent = r.quando ? `${r.quando} · Google` : "Google";
      stelle(r.stelle, $(".stelle", f));
      lista.appendChild(f);
    });
  } else {
    lista.innerHTML = `<figure class="recensione recensione--vuota"><blockquote class="slot" data-slot="Recensioni Google">Qui mettiamo le recensioni vere della tua scheda Google.</blockquote></figure>`;
  }

  const collega = (sel, url) => {
    const a = $(sel);
    if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
    else { a.setAttribute("aria-disabled", "true"); a.tabIndex = -1; }
  };
  collega("#google-leggi", g.profilo);
  collega("#google-scrivi", g.scriviRecensione);
})();

/* ---------- mappa: si carica solo al clic (più veloce e rispettosa della privacy) ---------- */
(function mappa() {
  const area = $("#mappa-area"), btn = $("#mappa-carica");
  if (!area) return;
  $("#mappa-link").href = CONFIG.mappa.link;
  btn.addEventListener("click", () => {
    const f = document.createElement("iframe");
    f.src = CONFIG.mappa.embed;
    f.title = "Mappa della palestra Elite Fitness a Rende";
    f.loading = "lazy";
    f.referrerPolicy = "no-referrer-when-downgrade";
    area.appendChild(f);
    btn.remove();
  });
})();

/* ---------- modulo ---------- */
(function modulo() {
  const form = $("#modulo");
  const esito = $("#modulo-esito");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const nome = $("#f-nome").value.trim(), email = $("#f-email").value.trim();
    if (!nome) { esito.textContent = "Scrivi il tuo nome."; $("#f-nome").focus(); return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { esito.textContent = "Controlla l'indirizzo email."; $("#f-email").focus(); return; }
    if (!$("#f-privacy").checked) { esito.textContent = "Serve il consenso per poterti ricontattare."; return; }

    if (!CONFIG.moduloEndpoint) {
      esito.textContent = "Anteprima: il modulo funziona ma non è ancora collegato, quindi la richiesta non è partita.";
      return;
    }
    const bottone = $(".modulo__invia", form);
    bottone.disabled = true;
    esito.textContent = "Invio in corso…";
    try {
      const r = await fetch(CONFIG.moduloEndpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      if (!r.ok) throw new Error();
      form.reset();
      esito.textContent = "Richiesta inviata. Ti ricontatto al più presto.";
    } catch {
      esito.textContent = "Invio non riuscito. Riprova o scrivimi su WhatsApp.";
    } finally {
      bottone.disabled = false;
    }
  });
})();
