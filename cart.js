
import proudct from "./proudct.js"

const carte = ()=>{
let cartlist = document.querySelector(".cart")
let carticons = document.querySelector(".cart-icons")
let cartclsoe = document.getElementById("closecart")
let body = document.querySelector("body")
let home = document.querySelector(".logo")
home.addEventListener("click",()=>{
    window.location.href = "./index.html"
})

carticons.addEventListener("click",()=>{
    cartlist.classList.toggle("active")
    menulist.classList.remove("active")
})

cartclsoe.addEventListener("click",()=>{
    cartlist.classList.toggle("active")
    menulist.classList.remove("active")
})
let langopen = document.getElementById("lange")
let lang = document.querySelector(".langues")
langopen.addEventListener("click",()=>{
    lang.classList.toggle("active")
    
})
let menulist = document.querySelector(".menu-list")
let closemenu = document.getElementById("closemenu")
let menuopen = document.querySelector(".menu")
menuopen.addEventListener("click",()=>{
    menulist.classList.toggle("active")
    cartlist.classList.remove("active")
})
closemenu.addEventListener("click",()=>{
    menulist.classList.toggle("active")
    cartlist.classList.remove("active")
})

let cart = []



const setproincart=(position,proudctid,quantity)=>{
    if(quantity > 0){
        if(position < 0 ){
            cart.push({
                proudct_id:proudctid,
                quantity:quantity
            })
        }else{
            cart[position].quantity = quantity
        }
    }else{
        cart.splice(position , 1)
    }
    localStorage.setItem("cart",JSON.stringify(cart))
    refresh()
}

const refresh = ()=>{
    let listhtml = document.querySelector(".list")
    let quantityhtml = document.querySelector(".counter")
    let pricehtml = document.querySelector(".totalprice")
    let totalquantity = 0
    let totalprice = 0
    listhtml.innerHTML = null
    cart.forEach((item)=>{
        let position = proudct.findIndex((value)=>value.colors.find((v)=>v.sizes.find((v)=>v.id === item.proudct_id)))
        let info = proudct[position]
        let varient = info.colors.find((value)=>value.sizes.find((v)=>v.id === item.proudct_id))
        let size = varient.sizes.find((v)=>v.id === item.proudct_id)
        totalquantity = totalquantity + item.quantity
        totalprice = totalprice + item.quantity * info.price
        let fisrtimg = varient.imgs[0]
        let cardcart = document.createElement("div")
        cardcart.classList.add("cardcart")
        cardcart.innerHTML = `
        <div class="imgcart">
        <img src="${fisrtimg}">
        </div>
        <div class="detailscart">
        <p>size:${size.size}</p>
        <p>color:${varient.color}</p>
        <p>price:${info.price}$</p>
        </div>
        <div class="quantitybox">
        <span class="minus" data-id="${size.id}"><span class="material-symbols-outlined">
check_indeterminate_small
</span></span>
        <span class="qua">${item.quantity}</span>
        <span class="plus" data-id="${size.id}"><span class="material-symbols-outlined">
add
</span></span>
        </div>
        <div class="remover">
        <span class="material-symbols-outlined removeprocart" id="remove" data-id="${size.id} ">
          close_small
        </span>
        </div>


        `
        cardcart.querySelector(".removeprocart").addEventListener("click",(e)=>{
            let idremove = e.target.getAttribute("data-id")
            cart = cart.filter(item=>item.proudct_id != idremove)
            localStorage.setItem("cart",JSON.stringify(cart))
            refresh()
        })
        listhtml.appendChild(cardcart)
        quantityhtml.textContent = totalquantity
        pricehtml.textContent = totalprice + `$`



    })
}


// add event
document.addEventListener("click",(event)=>{
let buttonclick = event.target.closest(".addtocart, .minus, .plus, #remove, .addtocartmob")
    let proudctid = Number(buttonclick.dataset.id)
    let position = cart.findIndex((value)=>value.proudct_id === proudctid)
    let quantity = position < 0 ? 0 : cart[position].quantity
    if(buttonclick.classList.contains("addtocart")||buttonclick.classList.contains("plus")||buttonclick.classList.contains("addtocartmob")){
        quantity ++
        cartlist.classList.add("active")
        setproincart(position,proudctid,quantity)
    }
    if(buttonclick.classList.contains("minus")){
        quantity --
        setproincart(position,proudctid,quantity)

    }
})

const innitlocal = ()=>{
    if(localStorage.getItem("cart")){
        try{
            cart = JSON.parse(localStorage.getItem("cart"))
        }catch(e){
            console.log("error")
        }
    }
    refresh()
}
innitlocal()






    async function createCheckout() {
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    const lineItems = cartData.map(item => ({
        merchandiseId: `gid://shopify/ProductVariant/${item.proudct_id}`,
        quantity: item.quantity
    }));

    try {
        const response = await fetch("https://k6nv4p-xx.myshopify.com/api/2024-07/graphql.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Storefront-Access-Token": "d2dddf0bfa85314f4768291633b95095"
            },
            body: JSON.stringify({
                query: `
                    mutation cartCreate($input: CartInput!) {
                        cartCreate(input: $input) {
                            cart {
                                checkoutUrl
                            }
                            errors: userErrors {
                                message
                            }
                        }
                    }
                `,
                variables: {
                    input: {
                        lines: lineItems
                    }
                }
            })
        });

        const result = await response.json();
        console.log(result);

        if (result.data?.cartCreate?.cart?.checkoutUrl) {
            window.location.href = result.data.cartCreate.cart.checkoutUrl;
        } else {
            const errors = result.data?.cartCreate?.errors || [];
            console.error("أخطاء:", errors);
        }
    } catch (error) {
        console.error("حدث خطأ:", error);
    }
    
}
let finihs = document.querySelector(".checkout-cart")
finihs.addEventListener("click",()=>{
createCheckout()
})


}

export default carte