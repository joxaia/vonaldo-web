import proudct from "./proudct.js";

const carte = () => {
  /* ================= META PIXEL ================= */
  function sendAddToCartEvent(proudctid) {
    if (typeof window.fbq === "undefined") return;

    const prodIndex = proudct.findIndex((p) =>
      p.colors.some((c) => c.sizes.some((s) => s.id === proudctid))
    );

    if (prodIndex < 0) return;

    const prod = proudct[prodIndex];

    fbq("track", "AddToCart", {
      content_name: prod.name,
      content_ids: [proudctid],
      content_type: "product",
      value: prod.price,
      currency: "USD",
    });
  }

  /* ================= ELEMENTS ================= */
  const cartlist = document.querySelector(".cart");
  const carticons = document.querySelector(".cart-icons");
  const cartclose = document.getElementById("closecart");
  const menulist = document.querySelector(".menu-list");
  const menuopen = document.querySelector(".menu");
  const closemenu = document.getElementById("closemenu");
  const home = document.querySelector(".logo");
  const checkoutBtn = document.querySelector(".checkout-cart");

  /* ================= NAV ================= */
  home.addEventListener("click", () => {
    window.location.href = "./index.html";
  });

  carticons.addEventListener("click", () => {
    cartlist.classList.toggle("active");
    menulist.classList.remove("active");
  });

  cartclose.addEventListener("click", () => {
    cartlist.classList.remove("active");
  });

  menuopen.addEventListener("click", () => {
    menulist.classList.toggle("active");
    cartlist.classList.remove("active");
  });

  closemenu.addEventListener("click", () => {
    menulist.classList.remove("active");
  });

  /* ================= CART ================= */
  let cart = [];

  const setproincart = (position, proudctid, quantity) => {
    if (quantity > 0) {
      if (position < 0) {
        cart.push({ proudct_id: proudctid, quantity });
      } else {
        cart[position].quantity = quantity;
      }
    } else {
      cart.splice(position, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    refresh();
  };

  const refresh = () => {
    const listhtml = document.querySelector(".list");
    const quantityhtml = document.querySelector(".counter");
    const pricehtml = document.querySelector(".totalprice");

    let totalquantity = 0;
    let totalprice = 0;

    listhtml.innerHTML = "";

    cart.forEach((item) => {
      const position = proudct.findIndex((p) =>
        p.colors.some((c) => c.sizes.some((s) => s.id === item.proudct_id))
      );

      if (position < 0) return;

      const info = proudct[position];
      const variant = info.colors.find((c) =>
        c.sizes.some((s) => s.id === item.proudct_id)
      );
      const size = variant.sizes.find((s) => s.id === item.proudct_id);

      totalquantity += item.quantity;
      totalprice += item.quantity * info.price;

      const card = document.createElement("div");
      card.className = "cardcart";
      card.innerHTML = `
        <div class="imgcart">
          <img src="${variant.imgs[0]}" alt="Vonaldo Italian Shoes">
        </div>
        <div class="detailscart">
          <p>size: ${size.size}</p>
          <p>color: ${variant.color}</p>
          <p>price: ${info.price}$</p>
        </div>
        <div class="more-det">
          <span class="material-symbols-outlined removeprocart" data-id="${size.id}">
            close_small
          </span>
          <div class="quantitybox">
            <span class="minus" data-id="${size.id}">−</span>
            <span class="qua">${item.quantity}</span>
            <span class="plus" data-id="${size.id}">+</span>
          </div>
        </div>
      `;

      listhtml.appendChild(card);
    });

    quantityhtml.textContent = totalquantity;
    pricehtml.textContent = totalprice + "$";
  };

  /* ================= EVENTS ================= */
  document.addEventListener("click", (event) => {
    const btn = event.target.closest(
      ".addtocart, .addtocartmob, .plus, .minus, .removeprocart"
    );
    if (!btn) return;

    const proudctid = Number(btn.dataset.id);
    if (!proudctid) return;

    const position = cart.findIndex(
      (item) => item.proudct_id === proudctid
    );
    let quantity = position < 0 ? 0 : cart[position].quantity;

    if (btn.classList.contains("addtocart") || btn.classList.contains("addtocartmob")) {
      const qty = document.querySelector(".qn");
      quantity += qty ? parseInt(qty.textContent) : 1;
      cartlist.classList.add("active");
      setproincart(position, proudctid, quantity);
      sendAddToCartEvent(proudctid);
    }

    if (btn.classList.contains("plus")) {
      setproincart(position, proudctid, quantity + 1);
    }

    if (btn.classList.contains("minus")) {
      setproincart(position, proudctid, quantity - 1);
    }

    if (btn.classList.contains("removeprocart")) {
      cart = cart.filter((i) => i.proudct_id !== proudctid);
      localStorage.setItem("cart", JSON.stringify(cart));
      refresh();
    }
  });

  /* ================= INIT ================= */
  if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
  }
  refresh();

  /* ================= CHECKOUT ================= */
  async function createCheckout() {
    const lineItems = cart.map((item) => ({
      merchandiseId: `gid://shopify/ProductVariant/${item.proudct_id}`,
      quantity: item.quantity,
    }));

    const res = await fetch(
      "https://k6nv4p-xx.myshopify.com/api/2024-07/graphql.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token":
            "d2dddf0bfa85314f4768291633b95095",
        },
        body: JSON.stringify({
          query: `
            mutation cartCreate($input: CartInput!) {
              cartCreate(input: $input) {
                cart { checkoutUrl }
              }
            }
          `,
          variables: { input: { lines: lineItems } },
        }),
      }
    );

    const result = await res.json();
    return result.data.cartCreate.cart.checkoutUrl;
  }

  checkoutBtn.addEventListener("click", async () => {
    checkoutBtn.classList.add("loading");
    checkoutBtn.disabled = true;

    try {
      const url = await createCheckout();
      setTimeout(() => {
        window.location.href = url;
      }, 300);
    } catch (e) {
      checkoutBtn.classList.remove("loading");
      checkoutBtn.disabled = false;
      console.error(e);
    }
  });
};

export default carte;
