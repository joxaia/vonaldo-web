import proudct from "./proudct.js";
import carte from "./cart.js";

/* ================= HELPERS (null-safe DOM setters) =================
   بتمنع كراش السكريبت كله لو أي عنصر مش موجود في الصفحة */
const setText = (sel, val) => {
  const el = document.querySelector(sel);
  if (el) el.textContent = val;
};

const setSrc = (sel, val) => {
  const el = document.querySelector(sel);
  if (el) el.src = val;
};

const setBg = (sel, val) => {
  const el = document.querySelector(sel);
  if (el) el.style.background = val;
};

/* ================= CART ================= */
const init = () => {
  const list = document.querySelector(".listcart");
  if (!list) return;

  fetch(`./cart.html`)
    .then(res => res.text())
    .then(html => {
      list.innerHTML = html;
      carte();
    })
    .catch(err => console.error("Cart failed to load:", err));
};
init();

const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
const getUrl = (slug) => isLocal ? `/details.html?name=${slug}` : `/${slug}`;
const getNameParam = () => new URLSearchParams(window.location.search).get('name') || window.location.pathname.replace('/', '');
const domCache = {
  nameDesc: document.querySelector(".name-desc"),
  decDet: document.querySelector(".dec-det"),
  smallDescH2: document.querySelector(".smalldesc div h2"),
  bigSlider: document.querySelector(".bigslider"),
  sliderImgsBig: document.querySelector(".slider-imgsbig"),
  listBull: document.querySelector(".list-bull"),
  listImgPc: document.querySelector(".list-imgpc"),
  colorsContainer: document.querySelector(".colors"),
  sliderMobile: document.querySelector(".slider-mobile"),
  sliderMobileLi: document.querySelector(".slider-mobile-li"),
  bulletMobile: document.querySelector(".bullet-mobileslider ul"),
  sliderMob: document.querySelector(".slider-mob"),
  bullSecMob: document.querySelector(".bull-secmob ul"),
  colorsImgsMob: document.querySelector(".colors-imgs"),
  secsizesMob: document.querySelector(".secsizes-mob"),
  listMoreCards: document.querySelector(".listmorecards"),
  addToCart: document.querySelector(".addtocart"),
  addToCartMob: document.querySelector(".addtocartmob"),
};

setTimeout(() => {
  domCache.nameDesc?.classList.add("active");
  domCache.decDet?.classList.add("active");
  domCache.smallDescH2?.classList.add("active");
}, 400);

const addTouchSwipe = (el, onNext, onPrev) => {
  if (!el) return;
  let startX = 0;
  let isSwiping = false;

  el.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
  }, { passive: true });

  el.addEventListener("touchmove", (e) => {
    if (!isSwiping) return;
    const diff = startX - e.touches[0].clientX;
    if (diff > 50) {
      onNext();
      startX = e.touches[0].clientX;
      isSwiping = false;
    } else if (diff < -50) {
      onPrev();
      startX = e.touches[0].clientX;
      isSwiping = false;
    }
  }, { passive: true });
};

const buildSizes = (sizes, activeBtn, selector = ".h4size", parentSelector = ".sizes") => {
  const parent = document.querySelector(parentSelector);
  if (!parent) return;

  const fragment = document.createDocumentFragment();

  sizes.forEach((v, i) => {
    const h4 = document.createElement("h4");
    h4.classList.add("h4size");
    h4.textContent = v.size;
    h4.dataset.id = v.id;
    h4.setAttribute("role", "button");
    h4.setAttribute("tabindex", "0");

    if (i === 0) {
      h4.classList.add("active");
      activeBtn?.setAttribute("data-id", v.id);
    }

    const selectSize = () => {
      parent.querySelectorAll(selector).forEach(el => el.classList.remove("active"));
      h4.classList.add("active");
      activeBtn?.setAttribute("data-id", v.id);
    };

    h4.addEventListener("click", selectSize);
    h4.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectSize();
      }
    });

    fragment.appendChild(h4);
  });

  parent.innerHTML = "";
  parent.appendChild(fragment);
};

const initPro = () => {
  const nameParam = getNameParam();
  const product = proudct.find(p =>
    p.name.toLowerCase().replace(/\s+/g, '-') === nameParam
  );

  if (!product) return;

  const info = product;
  if (typeof fbq !== "undefined") {
  fbq("track", "ViewContent", {
    content_name: info.name,
    content_type: "product",
    value: info.price,
    currency: "USD"
  });
}
  const varient = info.colors[0];
    document.getElementById("desclist").textContent = `$${info.oldprice}`

  const dataMap = [
    [".sec-decss", info.desc],
    [".name", info.name],
    [".nono", `$${info.price}`],
    [".dev", info.desc],
    [".nam-mobdesc", info.name],
    [".pr", `$${info.price}`],
    [".current", info.name]
  ];

  dataMap.forEach(([sel, val]) => setText(sel, val));

  setText(".matpc", info.material || "Premium Natural Leather");
  setText(".matmob", info.material || "Premium Natural Leather");
  setSrc(".list-imgstyle img", info.modelimg || info.mainimg);
  setText(".sylename", info.modelname);
  setText(".styledesc", info.modeldesc);
  setText(".techdesc1", info.techdesc1 || "");
  setText(".techdesc2", info.techdesc2 || "");
  setText(".upper", `Upper : ${info.Upper || ""}`);
  setText(".inner", `Inner : ${info.Inner || ""}`);
  setText(".insole", `Insole : ${info.Insole || ""}`);
  setText(".outsole", `Outsole : ${info.Outsole || ""}`);
  document.title = info.title;
  setText(".descount", `$${info.oldprice}`);

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", info.metadesc || info.desc || info.modeldesc || "");

  setText(".dec-det", info.desc);
  setText(".name-desc", info.name);
  setSrc(".listved .menmob", info.modelwearmob);
  setSrc(".listved .menpc", info.modelwearpc);
  setSrc(".bodey-sizeguide img", info.sizeguide);
  setBg(".sizeguide-list", info.listcolor);

  let currentVarient = varient;
  let bigCurent = 0;

  let bigBullslider = [];
  let bigSliderLength = 0;

  const bigChecker = () => {
    const slider = domCache.sliderImgsBig;
    if (!slider) return;
    bigBullslider.forEach(b => b.classList.remove("active"));
    slider.style.transition = "transform 0.6s ease";
    slider.style.transform = `translateX(-${bigCurent * 470}px)`;
    bigBullslider[bigCurent]?.classList.add("active");
    bigBullslider[bigCurent]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const bigSliderRender = (startIndex = 0, targetVarient = currentVarient) => {
    if (!domCache.sliderImgsBig || !domCache.listBull) return;

    const fragmentImgs = document.createDocumentFragment();
    const fragmentBull = document.createDocumentFragment();

    targetVarient.imgs.forEach((imgSrc, i) => {
      const img = document.createElement("img");
      img.src = imgSrc;
      img.alt = `${info.name} - image ${i + 1}`;
      img.loading = "lazy";
      fragmentImgs.appendChild(img);

      const bull = document.createElement("img");
      bull.src = imgSrc;
      bull.alt = `${info.name} thumbnail ${i + 1}`;
      bull.loading = "lazy";
      bull.setAttribute("role", "button");
      bull.setAttribute("tabindex", "0");
      bull.addEventListener("click", () => {
        bigCurent = i;
        bigChecker();
      });
      fragmentBull.appendChild(bull);
    });

    domCache.sliderImgsBig.innerHTML = "";
    domCache.listBull.innerHTML = "";
    domCache.sliderImgsBig.appendChild(fragmentImgs);
    domCache.listBull.appendChild(fragmentBull);

    bigBullslider = Array.from(domCache.listBull.querySelectorAll("img"));
    bigSliderLength = bigBullslider.length;
    bigCurent = Math.min(startIndex, bigSliderLength - 1);

    const slider = domCache.sliderImgsBig;
    slider.style.transition = "none";
    slider.style.transform = `translateX(-${bigCurent * 470}px)`;

    requestAnimationFrame(() => {
      slider.style.transition = "transform 0.6s ease";
      bigChecker();
    });
  };

  document.querySelector(".rigth-arrow")?.addEventListener("click", () => {
    bigCurent = (bigCurent + 1) % bigSliderLength;
    bigChecker();
  });

  document.querySelector(".left-arrow")?.addEventListener("click", () => {
    bigCurent = (bigCurent - 1 + bigSliderLength) % bigSliderLength;
    bigChecker();
  });

  document.querySelector(".close-arrow")?.addEventListener("click", () => {
    domCache.bigSlider?.classList.remove("active");
    document.body.classList.remove("no-scroll");
  });

  const initPcImgs = (targetVarient = currentVarient) => {
    const listImgPc = domCache.listImgPc;
    if (!listImgPc) return;

    listImgPc.style.opacity = "0";
    listImgPc.style.transform = "translateY(10px)";

    const fragment = document.createDocumentFragment();

    targetVarient.imgs.forEach((imgSrc, i) => {
      const img = document.createElement("img");
      img.src = imgSrc;
      img.alt = `${info.name} - view ${i + 1}`;
      img.loading = i === 0 ? "eager" : "lazy";
      img.setAttribute("role", "button");
      img.setAttribute("tabindex", "0");
      img.addEventListener("click", () => {
        domCache.bigSlider?.classList.add("active");
        document.body.classList.add("no-scroll");
        bigSliderRender(i, targetVarient);
      });
      fragment.appendChild(img);
    });

    listImgPc.innerHTML = "";
    listImgPc.appendChild(fragment);

    requestAnimationFrame(() => {
      listImgPc.style.transition = "all 0.3s ease";
      listImgPc.style.transform = "translateY(0)";
      listImgPc.style.opacity = "1";
    });
  };

  const initColors = () => {
    if (!domCache.colorsContainer || !domCache.colorsImgsMob) return;

    const pcFragment = document.createDocumentFragment();
    const mobFragment = document.createDocumentFragment();

    info.colors.forEach((color, index) => {
      const pcColor = document.createElement("div");
      pcColor.classList.add("cardcolor");
      pcColor.setAttribute("role", "button");
      pcColor.setAttribute("tabindex", "0");
      pcColor.setAttribute("aria-label", `Select color ${color.color}`);
      pcColor.innerHTML = `<h4>${color.color}</h4><img src="${color.colorimg}" alt="${color.color}" loading="lazy">`;
      if (index === 0) pcColor.classList.add("active");

      pcColor.addEventListener("click", () => {
        domCache.colorsContainer.querySelectorAll(".cardcolor").forEach(el => el.classList.remove("active"));
        pcColor.classList.add("active");
        currentVarient = color;

        const imgSection = domCache.listImgPc;
        if (imgSection) {
          window.scrollTo({
            top: imgSection.getBoundingClientRect().top + window.scrollY - 90,
            behavior: "smooth"
          });
        }

        bigSliderRender(0, color);
        initPcImgs(color);
        buildSizes(color.sizes, domCache.addToCart);
        initMobileSmallSlider(color);
        initMobileFullSlider(color);
      });

      pcFragment.appendChild(pcColor);

      const mobColor = document.createElement("div");
      mobColor.classList.add("colocard");
      mobColor.setAttribute("role", "button");
      mobColor.setAttribute("tabindex", "0");
      mobColor.setAttribute("aria-label", `Select color ${color.color}`);
      mobColor.innerHTML = `<h4>${color.color}</h4><img src="${color.colorimg}" alt="${color.color}" loading="lazy">`;
      if (index === 0) mobColor.classList.add("active");

      mobColor.addEventListener("click", () => {
        domCache.colorsImgsMob.querySelectorAll(".colocard").forEach(el => el.classList.remove("active"));
        mobColor.classList.add("active");
        currentVarient = color;

        initMobileSmallSlider(color);
        initMobileFullSlider(color);
        buildSizes(color.sizes, domCache.addToCartMob, ".secsizes-mob h4", ".secsizes-mob");

        if (domCache.addToCartMob && color.sizes[0]) {
          domCache.addToCartMob.setAttribute("data-id", color.sizes[0].id);
        }

        if (domCache.sliderMob) {
          window.scrollTo({
            top: domCache.sliderMob.getBoundingClientRect().top + window.scrollY - 120,
            behavior: "smooth"
          });
        }
      });

      mobFragment.appendChild(mobColor);
    });

    domCache.colorsContainer.innerHTML = "";
    domCache.colorsContainer.appendChild(pcFragment);
    domCache.colorsImgsMob.innerHTML = "";
    domCache.colorsImgsMob.appendChild(mobFragment);
  };

  let openMobileSliderFn = null;

  const initMobileFullSlider = (targetVarient) => {
    const listImg = domCache.sliderMobileLi;
    const bulletList = domCache.bulletMobile;
    if (!listImg || !bulletList) return;

    listImg.innerHTML = "";
    bulletList.innerHTML = "";

    let current = 0;
    const fragmentImg = document.createDocumentFragment();
    const fragmentBullet = document.createDocumentFragment();

    targetVarient.imgs.forEach((imgSrc, index) => {
      const image = document.createElement("img");
      image.src = imgSrc;
      image.alt = `${info.name} - full view ${index + 1}`;
      image.loading = "lazy";
      fragmentImg.appendChild(image);

      const li = document.createElement("li");
      li.setAttribute("role", "button");
      li.setAttribute("tabindex", "0");
      li.setAttribute("aria-label", `Go to image ${index + 1}`);
      li.addEventListener("click", () => {
        current = index;
        updateMobileFull();
      });
      fragmentBullet.appendChild(li);
    });

    listImg.appendChild(fragmentImg);
    bulletList.appendChild(fragmentBullet);

    const images = listImg.querySelectorAll("img");
    const bullets = bulletList.querySelectorAll("li");

    const updateMobileFull = () => {
      current = Math.max(0, Math.min(current, images.length - 1));
      listImg.style.transform = `translateX(calc(-${current * 100}% - ${current * 5}px))`;
      bullets.forEach((li, i) => li.classList.toggle("active", i === current));
    };

    requestAnimationFrame(updateMobileFull);

    addTouchSwipe(listImg,
      () => { current++; updateMobileFull(); },
      () => { current--; updateMobileFull(); }
    );

    openMobileSliderFn = (index) => {
      current = index;
      updateMobileFull();
      domCache.sliderMobile?.classList.add("active");
      document.body.classList.add("no-scroll");
    };
  };

  const initMobileSmallSlider = (targetVarient) => {
    const sliderList = domCache.sliderMob;
    const bulletList = domCache.bullSecMob;
    if (!sliderList || !bulletList) return;

    sliderList.style.opacity = "0";
    sliderList.style.transform = "translateY(10px)";

    sliderList.innerHTML = "";
    bulletList.innerHTML = "";

    let current = 0;
    const fragmentImg = document.createDocumentFragment();
    const fragmentBullet = document.createDocumentFragment();

    targetVarient.imgs.forEach((imgSrc, index) => {
      const image = document.createElement("img");
      image.src = imgSrc;
      image.alt = `${info.name} - thumbnail ${index + 1}`;
      image.loading = "lazy";
      image.setAttribute("role", "button");
      image.setAttribute("tabindex", "0");
      image.addEventListener("click", () => {
        if (openMobileSliderFn) openMobileSliderFn(index);
      });
      fragmentImg.appendChild(image);

      const li = document.createElement("li");
      li.setAttribute("role", "button");
      li.setAttribute("tabindex", "0");
      li.setAttribute("aria-label", `Go to image ${index + 1}`);
      li.addEventListener("click", () => {
        current = index;
        updateSmall();
      });
      fragmentBullet.appendChild(li);
    });

    sliderList.appendChild(fragmentImg);
    bulletList.appendChild(fragmentBullet);

    const images = sliderList.querySelectorAll("img");
    const bullets = bulletList.querySelectorAll("li");

    const VISIBLE_BULLETS = 4;

    const updateSmall = () => {
      current = Math.max(0, Math.min(current, images.length - 1));
      sliderList.style.transform = `translateX(-${current * 100}%)`;

      let windowStart = 0;

      if (images.length > VISIBLE_BULLETS) {
        windowStart = Math.min(
          Math.max(current - Math.floor(VISIBLE_BULLETS / 2), 0),
          images.length - VISIBLE_BULLETS
        );
      }

      bullets.forEach((li, i) => {
        li.classList.toggle("active", i === current);

        const inWindow = i >= windowStart && i < windowStart + VISIBLE_BULLETS;
        const isLast = i === windowStart + VISIBLE_BULLETS - 1;

        li.style.opacity = inWindow ? "1" : "0";
        li.style.width = inWindow ? "8px" : "0px";
        li.style.minWidth = inWindow ? "8px" : "0px";
        li.style.marginRight = (inWindow && !isLast) ? "8px" : "0px";
      });
    };

    requestAnimationFrame(updateSmall);

    addTouchSwipe(sliderList,
      () => { current++; updateSmall(); },
      () => { current--; updateSmall(); }
    );

    sliderList.style.transition = "all 0.3s ease";
    sliderList.style.opacity = "1";
    sliderList.style.transform = "translateY(0)";
  };

  initColors();
  initPcImgs();
  buildSizes(currentVarient.sizes, domCache.addToCart);
  buildSizes(currentVarient.sizes, domCache.addToCartMob, ".secsizes-mob h4", ".secsizes-mob");
  bigSliderRender(0);
  initMobileFullSlider(currentVarient);
  initMobileSmallSlider(currentVarient);

  if (domCache.addToCartMob && currentVarient.sizes[0]) {
    domCache.addToCartMob.setAttribute("data-id", currentVarient.sizes[0].id);
  }

  const initMore = () => {
    if (!domCache.listMoreCards) return;

    const fragment = document.createDocumentFragment();
    const currentSlug = getNameParam();

    const getIsMobile = () => window.innerWidth <= 676;

    proudct
      .filter(pro => pro.name.toLowerCase().replace(/\s+/g, '-') !== currentSlug)
      .sort(() => Math.random() - 0.5)
      .forEach((pro) => {
        const slug = pro.name.toLowerCase().replace(/\s+/g, '-');
        const url = getUrl(slug);

        const card = document.createElement("div");
        card.classList.add("card-more-pro");
        card.innerHTML = `
          <a href="${url}"><img src="${pro.mainimg}" alt="${pro.name}" loading="lazy"></a>
          <span class="es">${pro.vare}</span>
          <span class="de">${pro.shortdesc}</span>
          <span class="na">${pro.name}</span>
          <div class="t">
            <div>
              <span class="p">$${pro.price.toFixed(2)}</span>
              <span class="d">$${pro.oldprice.toFixed(2)}</span>
            </div>
            <span class="banry">25% OFF</span>
          </div>
        `;
        fragment.appendChild(card);
      });

    domCache.listMoreCards.innerHTML = "";
    domCache.listMoreCards.appendChild(fragment);

    let currentIndex = 0;
    const slideMore = document.querySelector(".slide-more");

    const getStep = () => {
      const card = domCache.listMoreCards.querySelector(".card-more-pro");
      return card ? card.getBoundingClientRect().width + (parseFloat(getComputedStyle(domCache.listMoreCards).gap) || 0) : 300;
    };

    const getMax = () => {
      const cards = domCache.listMoreCards.querySelectorAll(".card-more-pro");
      if (!slideMore) return 0;
      return getIsMobile()
        ? Math.max(0, cards.length - 1)
        : Math.max(0, cards.length - Math.floor(slideMore.offsetWidth / getStep()));
    };

    const slideTo = (i) => {
      domCache.listMoreCards.style.transform = `translateX(-${i * getStep()}px)`;
    };

    document.querySelector(".lei")?.addEventListener("click", () => {
      if (currentIndex < getMax()) slideTo(++currentIndex);
    });

    document.querySelector(".ne")?.addEventListener("click", () => {
      if (currentIndex > 0) slideTo(--currentIndex);
    });

    addTouchSwipe(domCache.listMoreCards,
      () => { if (currentIndex < getMax()) slideTo(++currentIndex); },
      () => { if (currentIndex > 0) slideTo(--currentIndex); }
    );
  };

  initMore();
};

initPro();

/* ================= SCROLL: listcart toggle (rAF بدل setTimeout) ================= */
let scrollTicking = false;
window.addEventListener("scroll", () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      document.querySelector(".listcart")?.classList.toggle("active", window.scrollY >= 280);
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

/* ================= ACCORDIONS (Technical characteristics) ================= */
document.addEventListener('DOMContentLoaded', () => {
  [['dial', 'dial-list'], ['gem', 'gem-list'], ['Upper', 'Upper-list'], ['Movement', 'Movement-list']].forEach(([title, list]) => {
    const titleEl = document.querySelector(`.title-${title}`);
    const listEl = document.querySelector(`.${list}`);
    const icon = titleEl?.querySelector('.arrow-icon');
    if (!titleEl || !listEl) return;

    titleEl.addEventListener('click', () => {
      const isOpen = listEl.classList.contains('active');
      listEl.classList.toggle('active', !isOpen);
      icon?.classList.toggle('rotate', !isOpen);
    });
  });
});

/* ================= QUANTITY BOX ================= */
let curent = 1;
const updateQuantity = () => {
  document.querySelectorAll(".qn").forEach(el => el.textContent = curent);
};

const setupBox = (plusSel, minusSel) => {
  document.querySelector(plusSel)?.addEventListener("click", () => { curent++; updateQuantity(); });
  document.querySelector(minusSel)?.addEventListener("click", () => { if (curent > 1) { curent--; updateQuantity(); } });
};

setupBox(".plss", ".minss");
setupBox(".ls", ".mn");
updateQuantity();

/* ================= STYLE SECTION REVEAL ================= */
const imgSection = document.querySelector(".list-imgstyle");
const textSection = document.querySelector(".text-style");

if (imgSection) {
  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        imgSection.classList.add("show");
        setTimeout(() => textSection?.classList.add("show"), 200);
      }
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -100px 0px" }).observe(imgSection);
}

/* ================= MODALS (delivery / return / size guide / mobile slider) =================
   استخدام requestIdleCallback بدل setTimeout(4000) الثابت — بيشتغل أول ما المتصفح يفضى
   من غير ما يعطل الـ main thread وقت التحميل الحرج، مع fallback لو المتصفح مش داعمه */
const eve = () => {
  const sldiermob = document.querySelector(".slider-mobile");
  const close = document.querySelector(".close-slidermobile");
  const opendel = document.querySelector(".open-lis");
  const closedel = document.querySelector(".close-del");
  const del = document.querySelector(".deleverylist");
  const openret = document.querySelector(".openret");
  const closeret = document.querySelector(".close-ref");
  const ret = document.querySelector(".returnlist");
  const opensizemob = document.querySelector(".guide-mob");
  const closesizemob = document.querySelector(".close-size");
  const sizelist = document.querySelector(".sizeguide-list");
  const opensizepc = document.querySelector(".guide");
  const opendelpc = document.querySelector(".check a");
  const openretpc = document.querySelector(".loc a");
  const twosize = document.querySelector(".size-gi");
  const cont = document.querySelector(".countainer");

  // aria-labels لأزرار الإغلاق (SVG بس من غير نص)
  close?.setAttribute("aria-label", "Close mobile slider");
  closedel?.setAttribute("aria-label", "Close delivery information");
  closeret?.setAttribute("aria-label", "Close return policy");
  closesizemob?.setAttribute("aria-label", "Close size guide");

  twosize?.addEventListener("click", () => sizelist?.classList.add("active"));

  opendelpc?.addEventListener("click", () => {
    del?.classList.add("active");
    cont?.classList.add("active");
  });

  openretpc?.addEventListener("click", () => {
    ret?.classList.add("active");
    cont?.classList.add("active");
  });

  opensizepc?.addEventListener("click", () => sizelist?.classList.add("active"));

  document.querySelector(".view-coll span")?.addEventListener("click", () => {
    window.location.href = `./collection.html`;
  });

  opensizemob?.addEventListener("click", () => sizelist?.classList.add("active"));
  closesizemob?.addEventListener("click", () => sizelist?.classList.remove("active"));

  openret?.addEventListener("click", () => ret?.classList.add("active"));
  closeret?.addEventListener("click", () => {
    ret?.classList.remove("active");
    cont?.classList.remove("active");
  });

  opendel?.addEventListener("click", () => del?.classList.add("active"));
  closedel?.addEventListener("click", () => {
    del?.classList.remove("active");
    cont?.classList.remove("active");
  });

  close?.addEventListener("click", () => sldiermob?.classList.remove("active"));
};

if ('requestIdleCallback' in window) {
  requestIdleCallback(eve, { timeout: 2000 });
} else {
  document.addEventListener('DOMContentLoaded', eve);
}

/* ================= FOOTER TITLE REVEAL ================= */
const spans = document.querySelectorAll(".tit-twofoot span");

const observerr = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const span = entry.target;
        const index = [...spans].indexOf(span);
        setTimeout(() => span.classList.add("visible"), index * 200);
        observerr.unobserve(span);
      }
    });
  },
  { threshold: 0.3 }
);

spans.forEach((span) => observerr.observe(span));

/* ================= FAQ ================= */
document.querySelectorAll(".faq-item").forEach(item => {
  item.querySelector(".faq-question")?.addEventListener("click", () => {
    item.classList.toggle("active");
  });
});

/* ================= NAVIGATION =================
   ملحوظة: الأفضل تحويل العناصر دي فعليًا لـ <a href="..."> في details.html
   عشان الـ SEO crawlers تقدر تلاقي وتفهم الروابط دي. الكود هنا بيفضل يشتغل
   كـ fallback لو العنصر لسه <h3>/<span> */
document.querySelector(".blogs")?.addEventListener("click", () => { window.location.href = `./blogs/index.html`; });
document.querySelector(".home")?.addEventListener("click", () => { window.location.href = `./index.html`; });
document.querySelector(".terms")?.addEventListener("click", () => { window.location.href = `Terms&Conditions.html`; });
document.querySelector(".privacy")?.addEventListener("click", () => { window.location.href = `privact-policy.html`; });

/* ================= BUY NOW / CHECKOUT ================= */

const checkBtn = document.getElementById("check");
const checkBtnMob = document.querySelector(".mobbt .Checkout");
const checkBtnOriginalText = checkBtn ? checkBtn.textContent : "";
const checkBtnMobOriginalText = checkBtnMob ? checkBtnMob.textContent : "";

const getSelectedVariantId = (isMobile = false) => {
  // بيدي الأولوية للـ id بتاع النسخة اللي فعلاً بتتفاعل معاها اليوزر
  if (isMobile) {
    return (
      domCache.addToCartMob?.getAttribute("data-id") ||
      domCache.addToCart?.getAttribute("data-id") ||
      null
    );
  }
  return (
    domCache.addToCart?.getAttribute("data-id") ||
    domCache.addToCartMob?.getAttribute("data-id") ||
    null
  );
};

const showBuyNowError = (btn, message) => {
  if (!btn || !btn.parentElement) return;
  let errorEl = btn.parentElement.querySelector(".buynow-error");
  if (!errorEl) {
    errorEl = document.createElement("p");
    errorEl.className = "buynow-error";
    errorEl.style.color = "#c0392b";
    errorEl.style.fontSize = "13px";
    errorEl.style.marginTop = "8px";
    errorEl.style.textAlign = "center";
    btn.insertAdjacentElement("afterend", errorEl);
  }
  errorEl.textContent = message;
};

const clearBuyNowError = (btn) => {
  const errorEl = btn?.parentElement?.querySelector(".buynow-error");
  if (errorEl) errorEl.remove();
};

async function createCheckout(variantId, quantity) {
  const res = await fetch(
    "https://vonaldo-4.myshopify.com/api/2024-07/graphql.json",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token":
          "025f253ecdd5a53b1df7c87cef056c00",
      },
      body: JSON.stringify({
        query: `
          mutation cartCreate($input: CartInput!) {
            cartCreate(input: $input) {
              cart { checkoutUrl }
              userErrors { field message }
            }
          }
        `,
        variables: {
          input: {
            lines: [
              {
                merchandiseId: `gid://shopify/ProductVariant/${variantId}`,
                quantity,
              },
            ],
          },
        },
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`Shopify request failed with status ${res.status}`);
  }

  const result = await res.json();

  if (result.errors && result.errors.length > 0) {
    throw new Error(result.errors.map((e) => e.message).join(", "));
  }

  const payload = result.data && result.data.cartCreate;

  if (!payload) {
    throw new Error("No cartCreate data returned from Shopify");
  }

  if (payload.userErrors && payload.userErrors.length > 0) {
    throw new Error(payload.userErrors.map((e) => e.message).join(", "));
  }

  if (!payload.cart || !payload.cart.checkoutUrl) {
    throw new Error("Shopify did not return a checkout URL");
  }

  return payload.cart.checkoutUrl;
}
const handleBuyNow = async (btn, originalText, isMobile = false) => {
  if (!btn) return;

  clearBuyNowError(btn);

  const variantId = getSelectedVariantId(isMobile);

  if (!variantId) {
    showBuyNowError(btn, "Please select a size first.");
    return;
  }

  btn.disabled = true;
  btn.innerHTML = `<span class="btn-spinner"></span>`;

  try {
    if (typeof window.fbq !== "undefined" && currentProductInfo) {
      fbq("track", "InitiateCheckout", {
        content_name: currentProductInfo.name,
        content_type: "product",
        value: currentProductInfo.price,
        currency: "USD",
      });
    }
  } catch (pixelErr) {
    console.error("fbq InitiateCheckout failed:", pixelErr);
  }

  try {
    const url = await createCheckout(variantId, curent);
    window.location.href = url;
  } catch (e) {
    console.error(e);
    btn.disabled = false;
    btn.textContent = originalText;
    showBuyNowError(btn, "Couldn't start checkout. Please try again.");
  }
};
