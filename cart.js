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
  const closemenu = document.querySelector(".close-men");
  const home = document.querySelector(".logo");
  const checkoutBtn = document.querySelector(".checkout-cart");
  let count = document.querySelector(".count")
  let collection = document.querySelector(".colection")
  let homepage = document.querySelector(".home")
  let manpage = document.querySelector(".manufac")
  let contshop = document.getElementById("to")

  contshop.addEventListener("click",()=>{
    cartlist.classList.remove("active")
  })
  manpage.addEventListener("click",()=>{
    window.location.href = `./Manufacture.html`
  })
  homepage.addEventListener("click",()=>{
    window.location.href = `../index.html`
  })

  collection.addEventListener("click",()=>{
    window.location.href = `./collection.html`
  })

  /* ================= NAV ================= */
  home.addEventListener("click", () => {
    window.location.href = "../index.html";
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
    const pricehtml2 = document.querySelector(".totalprice2");

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
          <p class="namecard">${info.name}</p>

          <p class="colorcard">${variant.color}</p>
                    <p class="sizecard">Size : ${size.size}</p>
          
          <p class="pricecard">$${info.price}</p>
        </div>
        <div class="more-det">
          <span class="removeprocart" data-id="${size.id}">
            remove
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
    pricehtml.textContent = "$"+totalprice ;
    pricehtml2.textContent = "$"+totalprice ;
let hed = document.querySelector(".empty")
    if (totalquantity === 0) {
  cartlist.classList.add("hidden-ui");
  hed.classList.remove("headen")
} else {
  cartlist.classList.remove("hidden-ui");
  hed.classList.add("headen")
}
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

    // شيل أي منتج مخزن قديم مبقاش موجود فعليًا (الـ id اتغير أو المنتج اتشال من شوبيفاي)
    const validCart = cart.filter((item) =>
      proudct.some((p) =>
        p.colors.some((c) => c.sizes.some((s) => s.id === item.proudct_id))
      )
    );

    if (validCart.length !== cart.length) {
      cart = validCart;
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }
  refresh();

  /* ================= CHECKOUT ================= */

  const showCheckoutError = (message) => {
    const wrapper = document.querySelector(".btns-cartlist");
    let errorEl = wrapper.querySelector(".checkout-error");

    if (!errorEl) {
      errorEl = document.createElement("p");
      errorEl.className = "checkout-error";
      wrapper.appendChild(errorEl);
    }

    errorEl.textContent = message;
  };

  const clearCheckoutError = () => {
    const errorEl = document.querySelector(".btns-cartlist .checkout-error");
    if (errorEl) errorEl.remove();
  };

  /* =================================================================
     FIX (bfcache) — نفس مشكلة زرار Buy Now بالظبط:
     لما تدوس Checkout بيتحط زرار .checkout-cart في حالة loading/disabled،
     وبعدين المتصفح بيروح لصفحة الـ checkout بتاعة Shopify. لو رجعت
     بزرار الـ back، المتصفح (خصوصًا على الموبايل) غالبًا بيرجّع الصفحة
     من الـ bfcache من غير reload ومن غير ما يعيد تشغيل السكريبت —
     يعني الزرار بيفضل واقف في حالة "loading" و disabled للأبد.

     الحل: دالة موحّدة resetCheckoutBtn بترجّع الزرار لحالته الطبيعية،
     بنستخدمها في الـ catch زي الأول، وكمان في مستمعين:
     - pageshow مع event.persisted (الحالة القياسية للـ bfcache)
     - visibilitychange كـ fallback لبعض متصفحات الموبايل
     ================================================================= */
  const resetCheckoutBtn = () => {
    if (!checkoutBtn) return;
    checkoutBtn.classList.remove("loading");
    checkoutBtn.disabled = false;
  };

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      resetCheckoutBtn();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && checkoutBtn?.disabled === true) {
      resetCheckoutBtn();
    }
  });

  async function createCheckout() {
    // فلترة أخيرة قبل الإرسال: منتشيلش منتجات مبقتش موجودة في proudct.js
    const validItems = cart.filter((item) =>
      proudct.some((p) =>
        p.colors.some((c) => c.sizes.some((s) => s.id === item.proudct_id))
      )
    );

    if (validItems.length !== cart.length) {
      cart = validItems;
      localStorage.setItem("cart", JSON.stringify(cart));
      refresh();
    }

    if (validItems.length === 0) {
      throw new Error("Your cart items are no longer available. Cart cleared.");
    }

    const lineItems = validItems.map((item) => ({
      merchandiseId: `gid://shopify/ProductVariant/${item.proudct_id}`,
      quantity: item.quantity,
    }));

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
          variables: { input: { lines: lineItems } },
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

checkoutBtn?.addEventListener("click", async () => {
  clearCheckoutError();
  checkoutBtn.classList.add("loading");
  checkoutBtn.disabled = true;

  try {

    if (typeof window.fbq !== "undefined") {
      fbq("track", "InitiateCheckout", {
        num_items: cart.reduce((sum, item) => sum + item.quantity, 0),
        value: cart.reduce((sum, item) => {
          const prod = proudct.find((p) =>
            p.colors.some((c) =>
              c.sizes.some((s) => s.id === item.proudct_id)
            )
          );

          return sum + (prod ? prod.price * item.quantity : 0);
        }, 0),
        currency: "USD",
      });
    }

    const url = await createCheckout();

    setTimeout(() => {
      window.location.href = url;
    }, 300);

  } catch (e) {
    resetCheckoutBtn();
    if (e.message && e.message.includes("no longer available")) {
      showCheckoutError("Some items in your cart are no longer available. Please review your cart.");
    } else {
      showCheckoutError("Couldn't start checkout. Please try again.");
    }
    console.error(e);
  }
});
}

export default carte;
