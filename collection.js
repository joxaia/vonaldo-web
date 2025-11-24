import carte from "./cart.js";
import proudct from "./proudct.js";


const innicart = ()=>{
    let list = document.querySelector(".listcarte")
    fetch(`./cart.html`)
    .then((Response)=>Response.text())
    .then((html)=>{
        list.innerHTML = html
        carte()
    });
}
innicart()

const innitpros = () => {
  const listpro = document.querySelector(".listcards");

  proudct.forEach((pro, index) => {
    const card = document.createElement("div");
    card.classList.add("cardlist");

    // تناوب الاتجاه يمين/شمال
    if (index % 2 !== 0) {
      card.classList.add("reverse");
    }

    card.innerHTML = `
      <div class="imglist">
        <img src="${pro.mainimg}" alt="${pro.name}">
      </div>
      <div class="desclist">
        <div class="mindec">
          <h4>${pro.desc}</h4>
          <h2>${pro.name}</h2>
          <h2 id="pricelistt">${pro.price}$</h2>
        </div>
        <div>
        <a href="./details.html?id=${pro.id}">
          <button class="showmore">Discover More</button>
        </a>  
        </div>
      </div>
    `;

    listpro.appendChild(card);
  });
};

innitpros();
window.addEventListener("scroll", () => {
  document.querySelector(".listcarte")?.classList.toggle("active", scrollY >= 100);
});