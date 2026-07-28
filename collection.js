import carte from "./cart.js";
import proudct from "./proudct.js";

const innicart = () => {
  let list = document.querySelector(".listcarte")
  fetch(`./cart.html`)
    .then((Response) => Response.text())
    .then((html) => {
      list.innerHTML = html
      carte()
    });
}
innicart()

window.addEventListener("load", () => {
  document.body.style.transition = "opacity 1s ease";
  document.body.style.opacity = "1";
});

// ── State ──
let currentSort = "default";
let currentModel = "all";
let newArrivalActive = false;

// ── Keep original order for "default" sort ──
const originalProducts = [...proudct];

// ── Sort + Filter Logic ──
function getFilteredAndSorted() {
  let filtered = [...originalProducts];

  // Model filter — match modelname containing the selected model keyword
  if (currentModel !== "all") {
    filtered = filtered.filter((pro) => {
      const mn = (pro.modelname || "").toLowerCase();
      const keyword = currentModel.toLowerCase();
      // "Chelsea" matches "Chelsea", "Chunky Chelsea Boots", "Hybrid Chelsea Sneaker"
      // "Loafer" matches "Penny Loafer", "Chain Loafer", "Tassel Loafer", "Loafer"
      return mn.includes(keyword);
    });
  }

  // New Arrival filter
  if (newArrivalActive) {
    filtered = filtered.filter((pro) => {
      return (pro.vare || "").toLowerCase().includes("new");
    });
  }

  // Sort
  switch (currentSort) {
    case "price-low":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "name-az":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-za":
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "newest":
      filtered.reverse();
      break;
    default:
      break;
  }

  return filtered;
}

// ── Render Cards ──
function renderCards() {
  const list = document.querySelector(".list-cards");

  list.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  list.style.opacity = "0";
  list.style.transform = "translateY(8px)";

  setTimeout(() => {
    list.innerHTML = "";

    const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
    const products = getFilteredAndSorted();

    if (products.length === 0) {
      list.innerHTML = `<div class="no-results"><h3>No products found</h3></div>`;
    } else {
      products.forEach((pro) => {
        const slug = pro.name.toLowerCase().replace(/\s+/g, '-');
        const url = isLocal ? `/details.html?name=${slug}` : `/${slug}`;

        let card = document.createElement("div");
        card.classList.add("proudcts");
        card.innerHTML = `
          <div class="imgs">
            <a href="${url}">
              <img src="${pro.mainimg}">
            </a>
          </div>
          <div class="info-vare">
          <h4>${pro.vare}</h4>
          <h3 class="sho">${pro.shortdesc}</h3>
          <h3 class="lo">${pro.longdesc}</h3>
          </div>
          <div class="info-cardproslist">
          <h3>${pro.name}</h3>
          <div class="price-info">
          <div>
            <h3 class="price" id="pr">$${pro.price.toFixed(2)}</h3>
            <h4 class=""old>$${pro.oldprice.toFixed(2)}</h4>
          </div>
          <span>%25 OFF</span>
          </div>
        `;
        list.appendChild(card);
      });
    }

    requestAnimationFrame(() => {
      list.style.opacity = "1";
      list.style.transform = "translateY(0)";
    });
  }, 180);
}

// ── Smooth scroll to top of products list ──
function scrollToProductsTop() {
  const listCards = document.querySelector(".list-cards");
  if (!listCards) return;

  const offset = 100; // مسافة بسيطة فوق الشوزات
  const top = listCards.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({ top, behavior: "smooth" });
}

// ── Sort Dropdown Toggle ──
const sortContainer = document.querySelector(".sort-container");
const sortDropdown = document.querySelector(".sort-dropdown");
const sortArrow = document.querySelector(".sort-arrow");
const sortToggle = document.querySelector(".sort-toggle");

sortContainer.addEventListener("click", (e) => {
  e.stopPropagation();
  sortDropdown.classList.toggle("open");
  sortArrow.classList.toggle("open");
});

// ── Sort Option Click ──
document.querySelectorAll(".sort-option").forEach((opt) => {
  opt.addEventListener("click", (e) => {
    e.stopPropagation();
    currentSort = opt.dataset.sort;

    // Update active state
    document.querySelectorAll(".sort-option").forEach(o => o.classList.remove("active"));
    opt.classList.add("active");

    // Update label
    sortToggle.textContent = opt.textContent.toUpperCase();

    // Close dropdown
    sortDropdown.classList.remove("open");
    sortArrow.classList.remove("open");

    renderCards();
  });
});

// Close dropdown when clicking outside
document.addEventListener("click", () => {
  sortDropdown.classList.remove("open");
  sortArrow.classList.remove("open");
});

// ── Model Filter Buttons ──
document.querySelectorAll(".model-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentModel = btn.dataset.model;

    document.querySelectorAll(".model-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    renderCards();
    scrollToProductsTop();
  });
});

// ── New Arrival Button ──
const newArrivalBtn = document.querySelector(".new-arrival-btn");
newArrivalBtn.addEventListener("click", () => {
  newArrivalActive = !newArrivalActive;
  newArrivalBtn.classList.toggle("active", newArrivalActive);
  newArrivalBtn.dataset.active = newArrivalActive;
  renderCards();
});

// ── Initial Render ──
renderCards();

// ── Dynamic sticky stop before footer ──
function handleStickyFilter() {
  const filterWrapper = document.querySelector(".filter-wrapper");
  const footer = document.querySelector(".footer");
  if (!filterWrapper || !footer) return;

  const stickyTop = parseFloat(getComputedStyle(filterWrapper).top) || 0;
  const filterHeight = filterWrapper.offsetHeight;
  const footerTop = footer.getBoundingClientRect().top;

  // المسافة المفروض الفلتر يوصلها (لو فاضل لاصق) مقابل بداية الفوتر
  const overlap = (stickyTop + filterHeight) - footerTop;

  if (overlap > 0) {
    filterWrapper.style.transform = `translateY(-${overlap}px)`;
  } else {
    filterWrapper.style.transform = "translateY(0)";
  }
}

window.addEventListener("scroll", handleStickyFilter, { passive: true });
window.addEventListener("resize", handleStickyFilter);
handleStickyFilter();

// ── Footer Animations ──
const spans = document.querySelectorAll(".tit-twofoot span");

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
  {
    threshold: 0.3,
  }
);

spans.forEach((span) => observerr.observe(span));

// ── Footer Navigation ──
let blogs = document.querySelector(".blogs").addEventListener("click",()=>{
    window.location.href = `./blogs/index.html`
})

let home = document.querySelector(".home").addEventListener("click",()=>{
    window.location.href = `./index.html`
})

let terms = document.querySelector(".terms").addEventListener("click",()=>{
    window.location.href = `Terms&Conditions.html`
})
let privacy = document.querySelector(".privacy").addEventListener("click",()=>{
    window.location.href = `privact-policy.html`
})