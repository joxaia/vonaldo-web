import carte from "./cart.js";
import proudct from "./proudct.js";
import newarr from "./newarriva.js";



const innit = ()=>{
    let list = document.querySelector(".listcart")
    fetch(`./cart.html`)
    .then((response)=>response.text())
    .then((html)=>{
        list.innerHTML = html
        carte()
    });
}

innit()


let box = document.querySelector(".box h4")
setTimeout(()=>{
    box.classList.add("active")
},400)

let box2 = document.querySelector(".box h3")

setTimeout(()=>{
    box2.classList.add("active")
},400)

let col = document.querySelector(".coll")
col.addEventListener("click",()=>{
    window.location.href = "./collection.html"
})

const innitnew = ()=>{
    let newlist = document.querySelector(".listnew")
    newarr.forEach((pro)=>{
        let card = document.createElement("div")
        card.classList.add("itemnew")
        card.innerHTML = `
        <a href="./details.html?id=${pro.id}">
        <img src="${pro.mainimg}">
        </a>
        <h3>${pro.name}</h3>
        <h4>${pro.price}$</h4>
        `
        let colorsic = document.createElement("div")
        let h4colors = document.createElement("h4")
        h4colors.textContent = "colors:"
        colorsic.appendChild(h4colors)
        let listcolors = document.createElement("ul")
        colorsic.appendChild(listcolors)
        colorsic.classList.add("siccolors")
        listcolors.classList.add("colorsnew")
        pro.colors.forEach((col)=>{
            let licolors = document.createElement("li")
            licolors.style.backgroundColor = col.color
            listcolors.appendChild(licolors)
            let firstimg = col.imgs[0]
            licolors.addEventListener("click",()=>{
                setTimeout(()=>{
                    card.querySelector("img").src = firstimg
                },200)
                
            })
        })
        let btndesc = document.createElement("button")
        btndesc.textContent = "Descover"
        btndesc.setAttribute("data-id",pro.id)
        btndesc.classList.add("descvoer")
        btndesc.addEventListener("click",()=>{
            window.location.href = `./details.html?id=${pro.id}`
        })
        newlist.appendChild(card)
        card.appendChild(colorsic)
        card.appendChild(btndesc)

    })
}
innitnew()


let heas = document.querySelector(".listcart");

window.addEventListener("scroll", () => {
  if (window.scrollY >= 100) {
    heas.classList.add("active");
  } else {
    heas.classList.remove("active");
  }
});


const innipros = ()=>{
    let listpros = document.querySelector(".list-sec")
    proudct.forEach((pro)=>{
        let card = document.createElement("div")
        card.classList.add("pross")
        card.innerHTML = `
        <a href="./details.html?id=${pro.id}">
        <img src ="${pro.mainimg}">
        </a>
        <h3>${pro.name}</h3>
        <h4>${pro.price}$</h4>
        <button class="descover" data-id="${pro.id}">Descover More </button>
        `
        listpros.appendChild(card)
        card.querySelector(".descover").addEventListener("click",()=>{
            window.location.href = `./details.html?id=${pro.id}`
        })
    })
}
innipros()

const innitslider = () => {
    const slider = document.querySelector(".list-sec");
    const slides = Array.from(slider.children);
    const nextBtn = document.getElementById("next-slide");
    const prevBtn = document.getElementById("prev-slide");

    if (!slider || slides.length === 0) return;

    let currentIndex = 0;
    let slidesPerView = getSlidesPerView();
    let isDragging = false;
    let startX = 0;
    let walk = 0;
    let autoPlayInterval;

    function getSlidesPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 5;
    }

    const updateSlider = (smooth = true) => {
        const gap = 30;
        const slideWidth = slides[0].offsetWidth + gap;
        const translateX = -currentIndex * slideWidth;

        slider.style.transition = smooth ? "transform 0.5s ease" : "none";
        slider.style.transform = `translateX(${translateX}px)`;

        // تحديث حالة الأزرار
        prevBtn?.classList.toggle("disabled", currentIndex === 0);
        nextBtn?.classList.toggle("disabled", currentIndex >= slides.length - slidesPerView);
    };

    const nextSlide = () => {
        if (currentIndex < slides.length - slidesPerView) {
            currentIndex++;
            updateSlider();
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    };

    // AutoPlay
    const startAutoPlay = () => {
        stopAutoPlay();
        autoPlayInterval = setInterval(() => {
            if (currentIndex >= slides.length - slidesPerView) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }
            updateSlider();
        }, 3000);
    };

    const stopAutoPlay = () => clearInterval(autoPlayInterval);

    // الأزرار
    nextBtn?.addEventListener("click", () => {
        stopAutoPlay();
        nextSlide();
        startAutoPlay();
    });

    prevBtn?.addEventListener("click", () => {
        stopAutoPlay();
        prevSlide();
        startAutoPlay();
    });

    // Responsive
    window.addEventListener("resize", () => {
        const newSlidesPerView = getSlidesPerView();
        if (newSlidesPerView !== slidesPerView) {
            slidesPerView = newSlidesPerView;
            currentIndex = Math.min(currentIndex, slides.length - slidesPerView);
            updateSlider(false);
        }
    });

    // ========== Touch / Drag (اللي كان مش شغال خالص) ==========
    slider.addEventListener("touchstart", handleStart, { passive: true });
    slider.addEventListener("touchmove", handleMove, { passive: false });
    slider.addEventListener("touchend", handleEnd);

    slider.addEventListener("mousedown", handleStart);
    slider.addEventListener("mousemove", handleMove);
    slider.addEventListener("mouseup", handleEnd);
    slider.addEventListener("mouseleave", handleEnd);

    function handleStart(e) {
        stopAutoPlay();
        isDragging = true;
        startX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
        walk = 0;
        slider.style.transition = "none";
    }

    function handleMove(e) {
        if (!isDragging) return;

        const currentX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
        walk = currentX - startX;

        // منع السحب الافتراضي في الموبايل
        if (e.type.includes("touch")) e.preventDefault();

        const gap = 30;
        const slideWidth = slides[0].offsetWidth + gap;
        const maxTranslate = -(slides.length - slidesPerView) * slideWidth;
        let newTranslate = -currentIndex * slideWidth + walk;

        // حدود السحب
        if (newTranslate > 0) newTranslate = 0;
        if (newTranslate < maxTranslate) newTranslate = maxTranslate;

        slider.style.transform = `translateX(${newTranslate}px)`;
    }

    function handleEnd() {
        if (!isDragging) return;
        isDragging = false;
        slider.style.transition = "transform 0.5s ease";

        const threshold = 50; // الحد الأدنى للسحب عشان يتحرك
        if (Math.abs(walk) > threshold) {
            if (walk < 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        } else {
            // إرجاع المكان لو السحب ضعيف
            updateSlider();
        }

        startAutoPlay();
    }

    // تشغيل أول مرة
    updateSlider(false);
    startAutoPlay();

    // إيقاف AutoPlay لما التبويب مش مرئي (تحسين أداء)
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) stopAutoPlay();
        else startAutoPlay();
    });
};

innitslider();





