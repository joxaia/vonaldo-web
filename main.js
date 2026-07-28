import carte from "./cart.js";
import proudct from "./proudct.js";
import newarr from "./newarriva.js";

/* =========================
   Helpers
========================= */
const isLocal =
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "localhost";

const buildUrl = (slug) => (isLocal ? `/details.html?name=${slug}` : `/${slug}`);

const goToDetails = (slug) => {
  window.location.href = buildUrl(slug);
};

/* =========================
   Load Cart
========================= */
const initCart = () => {
  const list = document.querySelector(".listcart");
  if (!list) return;

  fetch("./cart.html")
    .then((response) => response.text())
    .then((html) => {
      list.innerHTML = html;
      carte();
    })
    .catch((err) => console.error("Failed to load cart:", err));
};
initCart();

/* =========================
   Hero Slider (Opacity + Bullets)
========================= */
const initHeroSlider = () => {
  const slideSelectors = [
    ".card-one-slide",
    ".card-two-slide",
    ".card-three-slide",
    ".card-four-slide",
  ];
  const slides = slideSelectors.map((sel) => document.querySelector(sel));

  // لو الصفحة دي معندهاش الهيرو سلايدر خالص، منكملش عشان منكسرش باقي الكود
  if (slides.some((s) => !s)) return;

  const bullets = document.querySelectorAll(".slider-bullets .bullet");
  if (!bullets.length) return;

  const SLIDE_DURATION = 6000; // 6 ثواني

  const animations = [
    {
      container: ".card-one-slide",
      items: [
        { selector: ".list-text h2", delay: 300 },
        { selector: ".list-text .line-inner", delay: 550 },
      ],
    },
    {
      container: ".card-two-slide",
      items: [
        { selector: ".list-text-2 h2", delay: 300 },
        { selector: ".t-1 h1", delay: 650 },
        { selector: ".t-2 h1", delay: 850 },
      ],
    },
    {
      container: ".card-three-slide",
      items: [
        { selector: ".list-text-3 h2", delay: 500 },
        { selector: ".t-3 h1", delay: 650 },
        { selector: ".t-4 h1", delay: 850 },
      ],
    },
    {
      container: ".card-four-slide",
      items: [
        { selector: ".t-9 h2", delay: 300 },
        { selector: ".t-10 h2", delay: 500 },
        { selector: ".t-5 h1", delay: 600 },
        { selector: ".t-6 h1", delay: 800 },
      ],
    },
  ];

  // كاش لعناصر النص عشان منعملش querySelectorAll من جديد كل مرة نغير سلايد
  const animationElements = animations.map((config) =>
    config.items.map((item) => ({
      delay: item.delay,
      els: document.querySelectorAll(`${config.container} ${item.selector}`),
    }))
  );

  let current = 0;
  let autoplayTimer = null;
  let textTimeouts = [];

  const clearTextTimeouts = () => {
    textTimeouts.forEach((id) => clearTimeout(id));
    textTimeouts = [];
  };

  const resetSlideText = (index) => {
    animationElements[index].forEach(({ els }) => {
      els.forEach((el) => el.classList.remove("active"));
    });
  };

  const activateSlideText = (index) => {
    animationElements[index].forEach(({ els, delay }) => {
      const id = setTimeout(() => {
        els.forEach((el) => el.classList.add("active"));
      }, delay);
      textTimeouts.push(id);
    });
  };

  const restartBulletProgress = (index) => {
    bullets.forEach((b) => {
      b.classList.remove("active");
      const fill = b.querySelector(".bullet-fill");
      if (fill) fill.style.animation = "none";
    });

    const activeBullet = bullets[index];
    const fill = activeBullet?.querySelector(".bullet-fill");
    if (!fill) return;
    // إعادة تشغيل الأنيميشن من الصفر
    void fill.offsetWidth;
    fill.style.animation = "";
    activeBullet.classList.add("active");
  };

  const resetAutoplay = () => {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = setInterval(nextSlide, SLIDE_DURATION);
  };

  function goToSlide(index) {
    clearTextTimeouts();

    slides.forEach((slide) => slide.classList.remove("active"));
    animations.forEach((_, i) => resetSlideText(i));

    current = index;
    slides[current].classList.add("active");
    restartBulletProgress(current);
    activateSlideText(current);

    resetAutoplay();
  }

  function nextSlide() {
    const next = (current + 1) % slides.length;
    goToSlide(next);
  }

  bullets.forEach((bullet, i) => {
    bullet.addEventListener("click", () => goToSlide(i));
  });

  document.fonts.ready.then(() => {
    goToSlide(0);
  });
};
initHeroSlider();

/* =========================
   Navigation (single page links)
========================= */
document.querySelector(".coll")?.addEventListener("click", () => {
  window.location.href = "./collection.html";
});

document.querySelector(".know")?.addEventListener("click", () => {
  window.location.href = "./Manufacture.html";
});

document.querySelector(".showcoll")?.addEventListener("click", () => {
  window.location.href = "./collection.html";
});

document.querySelector(".collection")?.addEventListener("click", () => {
  window.location.href = "./collection.html";
});

document.querySelector(".butt button")?.addEventListener("click", () => {
  window.location.href = "./collection.html";
});

document.querySelector(".view-fit button")?.addEventListener("click", () => {
  window.location.href = "./collection.html";
});

document.querySelector(".cta-summer")?.addEventListener("click", () => {
  window.location.href = buildUrl("sereno");
});

/* =========================
   Scroll Effect
========================= */
const heas = document.querySelector(".listcart");
if (heas) {
  window.addEventListener(
    "scroll",
    () => {
      heas.classList.toggle("active", window.scrollY >= 200);
    },
    { passive: true }
  );
}

/* =========================
   Footer "type your story" reveal animation
========================= */
const spans = document.querySelectorAll(".tit-twofoot span");
if (spans.length) {
  const observerr = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const span = entry.target;
          const index = [...spans].indexOf(span);
          setTimeout(() => {
            span.classList.add("visible");
          }, index * 200);
          observerr.unobserve(span);
        }
      });
    },
    { threshold: 0.3 }
  );
  spans.forEach((span) => observerr.observe(span));
}

/* =========================
   FAQ Accordion
========================= */
document.querySelectorAll(".faq-item").forEach((item) => {
  const question = item.querySelector(".faq-question");
  question?.addEventListener("click", () => {
    item.classList.toggle("active");
  });
});

/* =========================
   Footer Navigation Links
   (event delegation بدل ما نعمل addEventListener لكل رابط لوحده،
   وده بيمنع أي crash لو رابط مش موجود في صفحة معينة)
========================= */
const footerRoutes = {
  blogs: "./blogs/index.html",
  home: "./index.html",
  terms: "Terms&Conditions.html",
  privacy: "privact-policy.html",
  ship: "shipping-and-return.html",
};

const footer = document.querySelector(".footer");
footer?.addEventListener("click", (e) => {
  const target = Object.keys(footerRoutes).find((cls) =>
    e.target.closest(`.${cls}`)
  );
  if (target) {
    window.location.href = footerRoutes[target];
  }
});

/* =========================
   New Arrivals (Home)
========================= */
const initNewArrivals = () => {
  const listpros = document.querySelector(".list-cards-new");
  if (!listpros) return;

  const fragment = document.createDocumentFragment();

  newarr.forEach((pro) => {
    const slug = pro.name.toLowerCase().replace(/\s+/g, "-");
    const url = buildUrl(slug);

    const card = document.createElement("div");
    card.classList.add("mpr");
    card.innerHTML = `
    <div class="img-li">
      <img src="${pro.mainimg}" alt="vonaldo leather shoes for men" loading="lazy" decoding="async">
    </div>
    <div class="va">
      <h3>${pro.vare}</h3>
    </div>
    <div class="title-m">
      <h3>${pro.desc}</h3>
      <h4>${pro.name}</h4>
    </div>
    <div class="mother">
      <div class="price-m">
        <h3>$${pro.price.toFixed(2)}</h3>
        <h4>$${pro.oldprice.toFixed(2)}</h4>
      </div>
      <div class="sale">
        <span><img src="./icons8-price-tag-50.png" loading="lazy">Enjoy 25%</span>
      </div>
    </div>
    `;

    card.addEventListener("click", () => {
      window.location.href = url;
    });

    fragment.appendChild(card);
  });

  listpros.appendChild(fragment);
};
initNewArrivals();

const shuffleArray = (arr) => {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

/* =========================
   Choose Your Fit / Collection Products
========================= */
const initCollectionCards = () => {
  const list = document.querySelector(".list-cards-fit");
  if (!list) return;

  const shuffledProducts = shuffleArray(proudct);
  const fragment = document.createDocumentFragment();

  shuffledProducts.forEach((pro) => {
    const slug = pro.name.toLowerCase().replace(/\s+/g, "-");
    const url = buildUrl(slug);

    const card = document.createElement("div");
    card.classList.add("ti");
    card.innerHTML = `
      <div class="y">
        <img src="${pro.mainimg}" alt="${pro.name}" loading="lazy" decoding="async">
      </div>
      <div class="collection-titel">
        <h3>${pro.vare}</h3>
        <h4>${pro.shortdesc}</h4>
      </div>
      <div class="collection-name">
        <h3>${pro.name}</h3>
      </div>
      <div class="coll-list-price">
        <div class="collection-price">
          <h3>$${pro.price.toFixed(2)}</h3>
          <h4>$${pro.oldprice.toFixed(2)}</h4>
        </div>     
        <div class="sale two-sale">
          <span><img src="./icons8-price-tag-50.png" loading="lazy">Enjoy 25%</span>
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      window.location.href = url;
    });

    fragment.appendChild(card);
  });

  list.appendChild(fragment);
};

/* =========================
   سلايدر "Choose Your Fit"
   (سكرول أفقي أصلي عن طريق scroll-snap + أزرار تتحرك كارت-كارت)
========================= */
const initSliderFit = () => {
  const wrapper = document.querySelector(".count-body-fit");
  const track = document.querySelector(".list-cards-fit");
  const leftBtn = document.querySelector(".left-fit");
  const rightBtn = document.querySelector(".right-fit");

  if (!wrapper || !track || !leftBtn || !rightBtn) return;

  wrapper.style.overflowX = "auto";
  wrapper.style.overflowY = "hidden";
  wrapper.style.webkitOverflowScrolling = "touch";
  wrapper.style.scrollBehavior = "smooth";
  wrapper.style.scrollSnapType = "x mandatory";
  wrapper.style.overscrollBehaviorX = "contain";

  const applyCardSnap = () => {
    track.querySelectorAll(".ti").forEach((card) => {
      card.style.scrollSnapAlign = "start";
      card.style.scrollSnapStop = "always";
    });
  };
  applyCardSnap();

  const getCardStep = () => {
    const card = track.querySelector(".ti");
    if (!card) return 300;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return card.getBoundingClientRect().width + gap;
  };

  const getMaxScroll = () => Math.max(0, wrapper.scrollWidth - wrapper.clientWidth);

  leftBtn.classList.add("disabled");
  leftBtn.classList.remove("active");

  const updateButtonsState = () => {
    const maxScroll = getMaxScroll() - 1;
    const atStart = wrapper.scrollLeft <= 1;
    const atEnd = wrapper.scrollLeft >= maxScroll;

    leftBtn.classList.toggle("disabled", atStart);
    leftBtn.classList.toggle("active", !atStart);

    rightBtn.classList.toggle("disabled", atEnd);
    rightBtn.classList.toggle("active", !atEnd);
  };

  let isLocked = false;
  const unlockAfter = (ms) => {
    setTimeout(() => {
      isLocked = false;
      updateButtonsState();
    }, ms);
  };

  const scrollByOneCard = (direction) => {
    if (isLocked) return;

    const step = getCardStep();
    const maxScroll = getMaxScroll();
    const target = Math.max(0, Math.min(wrapper.scrollLeft + direction * step, maxScroll));

    if (Math.abs(target - wrapper.scrollLeft) < 1) return;

    isLocked = true;
    wrapper.scrollTo({ left: target, behavior: "smooth" });
    unlockAfter(420);
  };

  leftBtn.addEventListener("click", () => {
    if (leftBtn.classList.contains("disabled") || isLocked) return;
    scrollByOneCard(-1);
  });

  rightBtn.addEventListener("click", () => {
    if (rightBtn.classList.contains("disabled") || isLocked) return;
    scrollByOneCard(1);
  });

  let ticking = false;
  wrapper.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateButtonsState();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const step = getCardStep();
      if (step) {
        const nearestIndex = Math.round(wrapper.scrollLeft / step);
        wrapper.scrollLeft = nearestIndex * step;
      }
      updateButtonsState();
    }, 150);
  });

  updateButtonsState();
  requestAnimationFrame(updateButtonsState);
  window.addEventListener("load", updateButtonsState, { once: true });

  const images = track.querySelectorAll("img");
  if (images.length === 0) {
    updateButtonsState();
  } else {
    let loadedCount = 0;
    const onImgSettled = () => {
      loadedCount++;
      if (loadedCount === images.length) updateButtonsState();
    };
    images.forEach((img) => {
      if (img.complete) {
        loadedCount++;
      } else {
        img.addEventListener("load", onImgSettled, { once: true });
        img.addEventListener("error", onImgSettled, { once: true });
      }
    });
    if (loadedCount === images.length) updateButtonsState();
  }
};

const initCollectionSection = () => {
  initCollectionCards();
  initSliderFit();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCollectionSection);
} else {
  initCollectionSection();
}

/* =========================
   New Arrivals Touch Slider (mobile swipe)
========================= */
const initProductSlider = () => {
  const slider = document.querySelector(".list-cards-new");
  if (!slider) return;

  const CARD_WIDTH = 235;
  const GAP = 25;
  const STEP = CARD_WIDTH + GAP;

  let startX = 0;
  let startY = 0;
  let scrollStart = 0;
  let isTouching = false;
  let isHorizontalSwipe = null;

  const getCurrentIndex = () => Math.round(slider.scrollLeft / STEP);

  const scrollToIndex = (index) => {
    const maxIndex = Math.round((slider.scrollWidth - slider.clientWidth) / STEP);
    const safeIndex = Math.max(0, Math.min(index, maxIndex));
    slider.scrollTo({ left: safeIndex * STEP, behavior: "smooth" });
  };

  const goToNext = () => scrollToIndex(getCurrentIndex() + 1);
  const goToPrev = () => scrollToIndex(getCurrentIndex() - 1);
  const snapToNearest = () => scrollToIndex(getCurrentIndex());

  slider.addEventListener(
    "touchstart",
    (e) => {
      isTouching = true;
      isHorizontalSwipe = null;
      startX = e.touches[0].pageX;
      startY = e.touches[0].pageY;
      scrollStart = slider.scrollLeft;
    },
    { passive: true }
  );

  slider.addEventListener(
    "touchmove",
    (e) => {
      if (!isTouching) return;

      const currentX = e.touches[0].pageX;
      const currentY = e.touches[0].pageY;
      const diffX = startX - currentX;
      const diffY = startY - currentY;

      if (isHorizontalSwipe === null) {
        isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);
      }

      if (isHorizontalSwipe) {
        e.preventDefault();
        slider.scrollLeft = scrollStart + diffX;
      }
    },
    { passive: false }
  );

  slider.addEventListener("touchend", (e) => {
    if (!isTouching) return;
    isTouching = false;

    if (!isHorizontalSwipe) return;

    const endX = e.changedTouches[0].pageX;
    const diff = startX - endX;

    if (Math.abs(diff) < 30) {
      snapToNearest();
      return;
    }

    if (diff > 0) {
      goToNext();
    } else {
      goToPrev();
    }
  });

  slider.addEventListener("touchcancel", () => {
    isTouching = false;
    isHorizontalSwipe = null;
  });
};

window.addEventListener("load", initProductSlider, { once: true });

/* =========================
   Why Vonaldo (Standard) - Mobile Bullets
========================= */
const initWhyVonaldo = () => {
  const grid = document.getElementById("whyGrid");
  const bulletsWrap = document.getElementById("whyBullets");
  if (!grid || !bulletsWrap) return;

  const items = Array.from(grid.querySelectorAll(".why-item"));
  const whyBullets = Array.from(bulletsWrap.querySelectorAll(".bullet"));

  const setActive = (index) => {
    whyBullets.forEach((b, i) => b.classList.toggle("active", i === index));
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          const idx = items.indexOf(entry.target);
          if (idx !== -1) setActive(idx);
        }
      });
    },
    { root: grid, threshold: [0.6] }
  );

  items.forEach((item) => observer.observe(item));

  whyBullets.forEach((bullet) => {
    bullet.addEventListener("click", () => {
      const idx = parseInt(bullet.dataset.index, 10);
      const item = items[idx];
      item?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    });
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initWhyVonaldo);
} else {
  initWhyVonaldo();
}

/* =========================
   Product Quick Links (Lifestyle Section)
========================= */
const productQuickLinks = {
  loafer: "velluto-brown",
  derby: "eclipse-garnet",
  monk: "montero-monk",
};

Object.entries(productQuickLinks).forEach(([id, slug]) => {
  document.getElementById(id)?.addEventListener("click", () => {
    goToDetails(slug);
  });
});