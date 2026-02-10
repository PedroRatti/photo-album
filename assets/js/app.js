// ====== ELEMENTOS ======
const viewCover = document.getElementById("viewCover");
const viewAlbum = document.getElementById("viewAlbum");

const btnOpenAlbum = document.getElementById("btnOpenAlbum");
const btnBack = document.getElementById("btnBack");
const btnNext = document.getElementById("btnNext");

const pageLeft = document.getElementById("pageLeft");
const pageRight = document.getElementById("pageRight");

// ====== ESTADO ======
// agora controlamos "pares de páginas" (esq+dir)
let currentPairIndex = 0;

// ====== HELPERS ======
function thumbPath(n) {
    const id = String(n).padStart(4, "0");
    return `assets/thumbs/${id}_thumb.jpg`;
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (m) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
    }[m]));
}

// Bloco de linha (foto + legenda) com alternância esquerda/direita
function fullPathFromThumb(src) {
    // tenta trocar assets/thumbs/0001_thumb.jpg -> assets/photos/0001.jpg
    // se não existir, você pode manter como thumb mesmo
    return src
        .replace("assets/thumbs/", "assets/photos/")
        .replace("_thumb.jpg", ".jpg");
}

function photoRow({ src, caption }, side) {
    const reverseClass = side === "img-right" ? "reverse" : "";
    const fullSrc = fullPathFromThumb(src);

    return `
    <div class="photo-row ${reverseClass}">
      <div class="photo-box">
        <img
          src="${src}"
          data-full="${fullSrc}"
          alt="${escapeHtml(caption ?? "")}"
          loading="lazy"
        >
      </div>
      <div class="photo-caption">
        <strong>${escapeHtml(caption ?? "")}</strong>
        <span></span>
      </div>
    </div>
  `;
}

// Renderiza 3 fotos na página: 1 img-left, 2 img-right, 3 img-left
function renderPhotosPage(el, items) {
    const sides = ["img-left", "img-right", "img-left"];
    const safeItems = Array.from({ length: 3 }).map((_, i) => items?.[i] ?? null);

    el.innerHTML = safeItems
        .map((it, i) => {
            if (!it) {
                return `
          <div class="photo-row empty ${i === 1 ? "reverse" : ""}">
            <div class="photo-box"></div>
            <div class="photo-caption">
              <strong>(vazio)</strong>
              <span></span>
            </div>
          </div>
        `;
            }
            return photoRow(it, sides[i] ?? "img-left");
        })
        .join("");
}

function renderTextPage(el, { title, paragraphs }) {
    el.innerHTML = `
    <div class="page-text">
      <h2 class="page-text-title">${escapeHtml(title)}</h2>
      <div class="page-text-body">
        ${paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join("")}
      </div>
    </div>
  `;
}

// ====== DADOS (SPREADS) ======
const spreads = [
    {
        left: [
            { src: thumbPath(1), caption: "Primeira foto nossa juntos, no senhorita!" },
            { src: thumbPath(2), caption: "Beijão(de língua) na Heaven" },
            { src: thumbPath(3), caption: "Vídeo icônico da Peqado" },
        ],
        right: [
            { src: thumbPath(4), caption: "Um dos primeiros Sem Classes ido!" },
            { src: thumbPath(5), caption: "Dia em que a guapa morreu" },
            { src: thumbPath(6), caption: "Dia em que saiu do shopping pra ir na casa do Jordão comigo" },
        ],
    },
    {
        left: [
            { src: thumbPath(7), caption: "Primeira vez que a guapa inventou de comermos o pote de sorbet" },
            { src: thumbPath(8), caption: "Degustando" },
            { src: thumbPath(9), caption: "World Cookies!" },
        ],
        right: [
            { src: thumbPath(10), caption: "Besito" },
            { src: thumbPath(11), caption: "Pose padrão, só que reversa" },
            { src: thumbPath(12), caption: "Novos integrantes da família" },
        ],
    },
    {
        left: [
            { src: thumbPath(13), caption: "Choppada!" },
            { src: thumbPath(14), caption: "Aniversário da Luiza" },
            { src: thumbPath(15), caption: "Quando fomos experimentar o Sushi +Art" },
        ],
        right: [
            { src: thumbPath(16), caption: "Que desconfida hein guapa!" },
            { src: thumbPath(17), caption: "Comendo no restaurante natureba que tinha larva!" },
            { src: thumbPath(18), caption: "Careta!" },
        ],
    },
    {
        left: [
            { src: thumbPath(19), caption: "Confraternização da Chiave!" },
            { src: thumbPath(20), caption: "Rolê" },
            { src: thumbPath(21), caption: "Experimentando o Deep Sushi!" },
        ],
        right: [
            { src: thumbPath(22), caption: "Novo ângulo" },
            { src: thumbPath(23), caption: "Rolêzin no Rosa, dia de show do Meno K" },
            { src: thumbPath(24), caption: "Mostrando que além de bonitos, somos engraçados!" },
        ],
    },
    {
        left: [
            { src: thumbPath(25), caption: "Visitando o Vista Nipô" },
            { src: thumbPath(26), caption: "Descansando!" },
            null,
        ],
        right: [null, null, null],
    },
];

// ====== INTRO / OUTRO ======
const introPage = {
    type: "text",
    title: "Querida guapa,",
    paragraphs: [
        "Quando tivemos essa idéia a primeira coisa que pensei foi em fazer um álbum nosso, mas como garoto de programa pensei em me desafiar um pouco e ir um pouco além! Espero que possamos continuar preenchendo este álbum e continuarmos nossa historinha. Feliz cumple guapita, te quiero mucho!",
        "Sei que a ideia de fazer um presente feito a mão poderia não ser enquadrada nesse quesito, ou que pode perder a graça, mas eu achei justo porque de fato estou fazendo a mão, hehe.",
    ],
};

const outroPage = {
    type: "text",
    title: "Em construção...",
    paragraphs: [
        "Este não é um fim, é apenas uma espera de novas histórias que construiremos ao longo do tempo!",
        "Com amor, Guapo!"
    ],
};

// ====== TRANSFORMA "SPREADS" EM "PÁGINAS" SEQUENCIAIS ======
function normalizePhotos(items) {
    // garante array de 3 slots
    return Array.from({ length: 3 }).map((_, i) => items?.[i] ?? null);
}

function buildPagesFromSpreads() {
    // ordem real de páginas:
    // [intro], [spread0.left], [spread0.right], [spread1.left], [spread1.right], ...
    const pages = [];

    pages.push({ type: "text", ...introPage });

    for (const sp of spreads) {
        const left = normalizePhotos(sp.left);
        const right = normalizePhotos(sp.right); // se não existir, vira 3 nulls

        pages.push({ type: "photos", items: left });
        pages.push({ type: "photos", items: right });
    }

    pages.push({ type: "text", ...outroPage });

    // garante quantidade par de páginas (pra formar pares esq+dir)
    if (pages.length % 2 !== 0) {
        pages.push({ type: "photos", items: [null, null, null] });
    }

    return pages;
}

let pages = buildPagesFromSpreads();

// ====== RENDER DE PAR (ESQ+DIR) ======
function renderPageSlot(el, pageDef) {
    if (!pageDef) {
        renderPhotosPage(el, [null, null, null]);
        return;
    }

    if (pageDef.type === "text") {
        renderTextPage(el, pageDef);
        return;
    }

    // photos
    renderPhotosPage(el, pageDef.items);
}

function renderPair(pairIndex) {
    const maxPair = Math.floor(pages.length / 2) - 1;
    currentPairIndex = Math.max(0, Math.min(pairIndex, maxPair));

    const leftPage = pages[currentPairIndex * 2];
    const rightPage = pages[currentPairIndex * 2 + 1];

    renderPageSlot(pageLeft, leftPage);
    renderPageSlot(pageRight, rightPage);

    // botões
    btnBack.disabled = false;
    btnNext.disabled = currentPairIndex >= maxPair;
}

// ====== TROCA DE VIEWS ======
function openAlbum() {
    // rebuild (caso você edite spreads e recarregue sem refresh)
    pages = buildPagesFromSpreads();

    viewCover.classList.add("is-hidden");
    viewAlbum.classList.remove("is-hidden");

    // abre SEMPRE no par 0: contra-capa + primeira página de fotos (1..3)
    renderPair(0);
}

function closeAlbum() {
    viewAlbum.classList.add("is-hidden");
    viewCover.classList.remove("is-hidden");
}

// ====== EVENTOS ======
btnOpenAlbum.addEventListener("click", openAlbum);

btnBack.addEventListener("click", () => {
    // se estiver no primeiro par -> fecha pra capa
    if (currentPairIndex === 0) {
        closeAlbum();
        return;
    }
    renderPair(currentPairIndex - 1);
});

btnNext.addEventListener("click", () => {
    const maxPair = Math.floor(pages.length / 2) - 1;
    if (currentPairIndex >= maxPair) return;
    renderPair(currentPairIndex + 1);
});

// ====== LIGHTBOX (ABRIR FOTO GRANDE) ======
let lightboxEl = null;

function ensureLightbox() {
    if (lightboxEl) return;

    lightboxEl = document.createElement("div");
    lightboxEl.className = "lightbox is-hidden";
    lightboxEl.innerHTML = `
    <div class="lightbox__backdrop" data-close="1"></div>
    <div class="lightbox__dialog" role="dialog" aria-modal="true" aria-label="Visualização da foto">
      <button class="lightbox__close" type="button" aria-label="Fechar" data-close="1">✕</button>
      <img class="lightbox__img" alt="">
      <div class="lightbox__caption"></div>
    </div>
  `;
    document.body.appendChild(lightboxEl);

    // fechar clicando fora / no X
    lightboxEl.addEventListener("click", (e) => {
        const target = e.target;
        if (target && target.dataset && target.dataset.close) closeLightbox();
    });

    // fechar com ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeLightbox();
    });
}

function openLightbox({ src, caption }) {
    ensureLightbox();

    const img = lightboxEl.querySelector(".lightbox__img");
    const cap = lightboxEl.querySelector(".lightbox__caption");

    img.src = src;
    img.alt = caption || "";
    cap.textContent = caption || "";

    lightboxEl.classList.remove("is-hidden");
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    if (!lightboxEl) return;

    lightboxEl.classList.add("is-hidden");
    document.body.style.overflow = "";

    const img = lightboxEl.querySelector(".lightbox__img");
    if (img) img.src = "";
}

// Delegation: qualquer clique em img dentro do álbum abre
viewAlbum.addEventListener("click", (e) => {
    const img = e.target.closest(".photo-box img");
    if (!img) return;

    const full = img.getAttribute("data-full") || img.src;
    const caption = img.alt || "";
    openLightbox({ src: full, caption });
});

