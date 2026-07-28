import carte from "./cart.js";
import proudct from "./proudct.js";

const innicart = () => {
  let list = document.querySelector(".list-cartfetch")
  fetch(`../cart.html`)
    .then((Response) => Response.text())
    .then((html) => {
      list.innerHTML = html
      carte()

      const logo = document.querySelector(".logo h4");
      if (logo) {
        logo.addEventListener("click", () => {
window.location.href = "/index.html";
        });
      }

    });
}
innicart()


let heas = document.querySelector(".list-cartfetch");

window.addEventListener("scroll", () => {
    if (!heas) return;
    heas.classList.toggle("active", window.scrollY >= 200);
});


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