import carte from "./cart.js";


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


  /* ── Navbar scroll state ─────────────────────────────────── */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY >= 60) {
        navbar.classList.add('scrolled');
      }
    }, { passive: true });

    /* ── Intersection Observer: scroll reveals ───────────────── */
    const revealEls = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => observer.observe(el));