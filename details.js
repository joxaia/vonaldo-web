import proudct from "./proudct.js";
import carte from "./cart.js";

// تحميل السلة
const innit = () => {
  const list = document.querySelector(".listcart");
  fetch(`./cart.html`)
    .then(res => res.text())
    .then(html => {
      list.innerHTML = html;
      carte();
    });
};
innit();

// الفيديو
const video = document.getElementById("myVideo");
video.addEventListener("timeupdate", () => {
  if (video.currentTime >= 7) video.currentTime = 1;
});

// ظهور النصوص
setTimeout(() => {
  document.querySelector(".name-desc")?.classList.add("active");
  document.querySelector(".dec-det")?.classList.add("active");
}, 400);

// ================ السلايدر البسيط والشغال 100% ================
let currentSlide = 0;

const updateSliders = () => {
  const smallImgs = document.querySelectorAll(".small-slider img");
  const bigImgs   = document.querySelectorAll(".big-slider img");
  const smallBulls = document.querySelectorAll(".small-bull span");
  const bigBulls   = document.querySelectorAll(".big-bull span");

  // تحديث السلايدر الصغير
  smallImgs.forEach((img, i) => {
    img.style.transform = `translateX(${-currentSlide * 100}%)`;
  });
  smallBulls.forEach((b, i) => b.classList.toggle("active", i === currentSlide));

  // تحديث السلايدر الكبير
  bigImgs.forEach((img, i) => {
    img.style.transform = `translateX(${-currentSlide * 100}%)`;
  });
  bigBulls.forEach((b, i) => b.classList.toggle("active", i === currentSlide));
};

// الذهاب لصورة معينة
const goToSlide = (index) => {
  const total = document.querySelectorAll(".small-slider img").length;
  currentSlide = (index + total) % total;
  updateSliders();
};

// الأزرار
document.getElementById("right-pc")?.addEventListener("click", () => goToSlide(currentSlide + 1));
document.getElementById("left-pc")?.addEventListener("click", () => goToSlide(currentSlide - 1));
document.getElementById("right-big")?.addEventListener("click", () => goToSlide(currentSlide + 1));
document.getElementById("left-big")?.addEventListener("click", () => goToSlide(currentSlide - 1));

// النقاط
document.querySelectorAll(".small-bull span, .big-bull span").forEach((bull, i) => {
  bull.addEventListener("click", () => goToSlide(i));
});

// السحب باللمس
let startX = 0;
document.querySelector(".small-slider")?.addEventListener("touchstart", e => startX = e.touches[0].clientX);
document.querySelector(".small-slider")?.addEventListener("touchend", e => {
  const diff = startX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) goToSlide(currentSlide + (diff > 0 ? 1 : -1));
});

// تحديث السلايدر بعد أي تغيير في الصور (مهم جدًا)
const refreshSliderEvents = () => {
  // إزالة كل الأحداث القديمة من النقاط
  document.querySelectorAll(".small-bull span, .big-bull span").forEach(span => {
    span.replaceWith(span.cloneNode(true));
  });

  // إعادة ربط النقاط من جديد
  document.querySelectorAll(".small-bull span, .big-bull span").forEach((bull, i) => {
    bull.addEventListener("click", () => goToSlide(i));
  });

  // تحديث العرض
  updateSliders();
};
// ================ تحميل الصور الجديدة + إضافة كليك على الصور الصغيرة ================
const loadColorImages = (imgs) => {
  const smallSlider = document.querySelector(".small-slider");
  const bigSlider   = document.querySelector(".big-slider");
  const listimgpc   = document.querySelector(".listimgspc");  // الصور الصغيرة تحت
  const smallBull   = document.querySelector(".small-bull");
  const bigBull     = document.querySelector(".big-bull");

  // تفريغ القديم
  smallSlider.innerHTML = "";
  bigSlider.innerHTML   = "";
  listimgpc.innerHTML   = "";
  smallBull.innerHTML   = "";
  bigBull.innerHTML     = "";

  imgs.forEach((src, index) => {
    // === إضافة الصور في السلايدر الكبير والصغير ===
    [smallSlider, bigSlider].forEach(container => {
      const img = document.createElement("img");
      img.src = src;
      img.style.transform = `translateX(-${currentSlide * 100}%)`; // عشان يحافظ على الموقع
      container.appendChild(img);
    });

    // === الصور الصغيرة تحت (الـ thumbnails) ===
    const thumb = document.createElement("img");
    thumb.src = src;
    thumb.dataset.index = index; // مهم جدًا
    thumb.classList.add("thumb-img");
    if (index === currentSlide) thumb.classList.add("active-thumb"); // تحديد الصورة الحالية
    listimgpc.appendChild(thumb);

    // === النقاط (bullets) ===
    [smallBull, bigBull].forEach(bullContainer => {
      const span = document.createElement("span");
      span.className = "boll";
      if (index === currentSlide) span.classList.add("active");
      bullContainer.appendChild(span);
    });

    // === أهم حاجة: كليك على الصورة الصغيرة يغيّر الصورة في السلايدر ===
    thumb.addEventListener("click", () => {
      goToSlide(index); // نروح للصورة اللي ضغطنا عليها

      // نحدّث كل الصور الصغيرة (نضيف active للي اتضغطت)
      document.querySelectorAll(".listimgspc img").forEach((t, i) => {
        t.classList.toggle("active-thumb", i === index);
      });
    });
  });

  // تحديث العرض بعد التحميل
  updateSliders();
};

// ================ تهيئة المنتج ================
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const product = proudct.find(p => p.colors.some(c => c.sizes.some(s => s.id == id)));
  
  if (!product) return console.error("Product not found");

  // عرض البيانات
  document.querySelectorAll(".nam-mobdesc, .name, .name-desc, .name-pack").forEach(el => el.textContent = product.name);
  document.querySelectorAll(".dev, .dec-det, .sec-decss").forEach(el => el.textContent = product.desc);
  document.querySelectorAll(".pr, .nono").forEach(el => el.textContent = product.price + "$");

  // المنتجات المشابهة
  const similar = proudct.filter(p => !p.colors.some(c => c.sizes.some(s => s.id == id)));
  const listmore = document.querySelector(".listmorecards");
  similar.forEach(p => {
    listmore.innerHTML += `
      <div class="prosmore">
        <div class="rek"><a href="./details.html?id=${p.id}"><img src="${p.mainimg}"></a></div>
        <div class="list-pros-jav">
          <h2>${p.name}</h2><h4>${p.desc}</h4><h3>${p.price}$</h3>
        </div>
      </div>`;
  });

  // تحديث data-id
  const updateId = (newId) => {
    document.querySelectorAll(".addtocartmob, .addtocart, .Checkout").forEach(btn => {
      btn?.setAttribute("data-id", newId);
    });
  };

  // الألوان (موبايل + كمبيوتر)
  const applyColor = (color) => {
    loadColorImages(color.imgs);
    updateId(color.sizes[0].id);

    // تحديث المقاسات
    document.querySelectorAll(".secsizes-mob, .sizes").forEach(container => {
      container.innerHTML = "";
      color.sizes.forEach((size, i) => {
        const h4 = document.createElement("h4");
        h4.textContent = size.size;
        h4.dataset.id = size.id;
        if (i === 0) h4.classList.add("active");
        h4.onclick = () => {
          container.querySelectorAll("h4").forEach(h => h.classList.remove("active"));
          h4.classList.add("active");
          updateId(size.id);
        };
        container.appendChild(h4);
      });
    });
  };

  // إنشاء ألوان الموبايل
  const mobColors = document.querySelector(".seccolour-mob ul");
  product.colors.forEach((col, i) => {
    const li = document.createElement("li");
    li.style.backgroundColor = col.color;
    if (i === 0) li.classList.add("active");
    li.onclick = () => {
      mobColors.querySelectorAll("li").forEach(l => l.classList.remove("active"));
      li.classList.add("active");
      applyColor(col);
    };
    mobColors.appendChild(li);
  });

  // إنشاء ألوان الكمبيوتر
  const pcColors = document.querySelector(".colors");
  const ul = document.createElement("ul");
  ul.className = "colorss";
  product.colors.forEach((col, i) => {
    const li = document.createElement("li");
    li.style.backgroundColor = col.color;
    if (i === 0) li.classList.add("active");
    li.onclick = () => {
      ul.querySelectorAll("li").forEach(l => l.classList.remove("active"));
      li.classList.add("active");
      applyColor(col);
    };
    ul.appendChild(li);
  });
  pcColors.appendChild(ul);

  // تشغيل أول لون
  applyColor(product.colors[0]);
});

// باقي الوظائف (الكمية، الزوم، الأكورديون، إلخ)
document.querySelector(".iconszoom")?.addEventListener("click", () => document.querySelector(".bigslider").classList.add("active"));
document.getElementById("closeslide")?.addEventListener("click", () => document.querySelector(".bigslider").classList.remove("active"));
document.querySelector(".imgsec .cont")?.addEventListener("click", () => document.querySelector(".bigslider").classList.add("active"));

// الكمية
[".plss", ".ls"].forEach(btn => document.querySelector(btn)?.addEventListener("click", () => {
  const display = btn === ".plss" ? ".quan" : ".qn";
  let val = +document.querySelector(display).textContent;
  document.querySelector(display).textContent = ++val;
}));
[".minss", ".mn"].forEach(btn => document.querySelector(btn)?.addEventListener("click", () => {
  const display = btn === ".minss" ? ".quan" : ".qn";
  let val = +document.querySelector(display).textContent;
  if (val > 1) document.querySelector(display).textContent = --val;
}));

// الأكورديون
document.querySelectorAll(".title-dial, .title-Upper, .title-gem, .title-Movement").forEach(title => {
  title.addEventListener("click", () => title.nextElementSibling.classList.toggle("active"));
});





// ======== إضافة خاصية السحب باللمس داخل الـ Big Slider الكبير عندما يكون مفتوحًا ========
let bigTouchStartX = 0;

const bigSliderContainer = document.querySelector(".bigslider"); // الـ div اللي فيه class="bigslider"

const handleBigSliderTouch = (e) => {
  if (!bigSliderContainer.classList.contains("active")) return; // لو الـ bigslider مش مفتوح متعملش حاجة

  const touch = e.touches[0];
  const diff = bigTouchStartX - touch.clientX;

  // لو السحب أكتر من 50 بكسل → نغيّر الصورة
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      // سحب للشمال → الصورة التالية
      goToSlide(currentSlide + 1);
    } else {
      // سحب لليمين → الصورة السابقة
      goToSlide(currentSlide - 1);
    }
    // إنهاء الحدث عشان متكررش
    bigSliderContainer.removeEventListener("touchmove", handleBigSliderTouch);
  }
};

bigSliderContainer.addEventListener("touchstart", (e) => {
  if (!bigSliderContainer.classList.contains("active")) return;
  bigTouchStartX = e.touches[0].clientX;

  // نضيف حدث التحرك
  bigSliderContainer.addEventListener("touchmove", handleBigSliderTouch);
});

bigSliderContainer.addEventListener("touchend", () => {
  // نرجع نضيف الحدث تاني للمرة الجاية
  bigSliderContainer.removeEventListener("touchmove", handleBigSliderTouch);
});

// ====== اختياري: إغلاق الـ Big Slider لما تسحب للأسفل بقوة (زي التطبيقات الحقيقية) ======
bigSliderContainer.addEventListener("touchstart", (e) => {
  if (!bigSliderContainer.classList.contains("active")) return;
  const startY = e.touches[0].clientY;

  const handleSwipeDown = (e) => {
    const currentY = e.touches[0].clientY;
    const diffY = currentY - startY;

    if (diffY > 150) { // لو سحبت لتحت أكتر من 150 بكسل
      bigSliderContainer.classList.remove("active");
      bigSliderContainer.removeEventListener("touchmove", handleSwipeDown);
    }
  };

  bigSliderContainer.addEventListener("touchmove", handleSwipeDown);
});


// تثبيت السلة
window.addEventListener("scroll", () => {
  document.querySelector(".listcart")?.classList.toggle("active", scrollY >= 100);
});




