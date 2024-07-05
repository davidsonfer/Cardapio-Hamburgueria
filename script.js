const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// Abrir o modal do carrinho

cartBtn.addEventListener("click", () => {
  updateCartModal();
  cartModal.style.display = "flex";
});

//Fechar o modal quando clicar fora

cartModal.addEventListener("click", (event) => {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

// Fechar o modal qunado clicar em "fechar"

closeModalBtn.addEventListener("click", (event) => {
  if (event.target === closeModalBtn) {
    cartModal.style.display = "none";
  }
});

//Adicionar um lanche

menu.addEventListener("click", (event) => {
  //console.log(event.target);

  let parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    addTocart(name, price);
  }
});

//função para add no carrinho

function addTocart(name, price) {
  const existingItem = cart.find((item) => item.name == name);

  if (existingItem) {
    existingItem.qtd += 1;
  } else {
    cart.push({
      name,
      price,
      qtd: 1,
    });
  }

  updateCartModal();
}

//Atualiza o carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );
    cartItemElement.innerHTML = `<div class="flex items-center justify-between">
            <div>
                <p class="font-medium">
                    ${item.name}
                </p>
                <p>
                    Qtd: ${item.qtd}
                </p>
                <p class="font-medium mt-2">
                    ${item.price.toFixed(2)}
                </p>
            </div>

                <button class="bg-red-500 text-white px-2 py-1 rounded-md remove-btn " data-name='${item.name}'>
                    remover
                </button>
        </div>`;

    total += item.price * item.qtd

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  cartCounter.innerHTML = cart.length;
}

//Função para remover um produto do carrinho
cartItemsContainer.addEventListener('click', (event) => {
  if(event.target.classList.contains("remove-btn")){
    const name = event.target.getAttribute('data-name')

    removeItemCart(name)
  }

})


function removeItemCart(name){
  const index = cart.findIndex(item => item.name === name)

  if(index !== -1){
    const item = cart[index]

    if(item.qtd > 1){
      item.qtd -= 1

      updateCartModal()
      return
    }

    cart.splice(index, 1)
    updateCartModal();

  }
}


addressInput.addEventListener('input', (event) => {
  let inputValue = event.target.value;

  if(inputValue !== ""){
    addressInput.classList.remove("border-red-500")
    addressWarn.classList.add('hidden')
  }
})

//Finalizar pedido
checkoutBtn.addEventListener("click", () => {
  const isOpen = checkRestaurantOpen();
  if(!isOpen){
    Toastify({
      text: "Opa! O restaurante está fechado no momento",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444",
      },
    }).showToast()

    return;
  }
  if(cart.length === 0) return;
  if(addressInput.value === ""){
    addressWarn.classList.remove("hidden")
    addressInput.classList.add("border-red-500")
    return;
  }

  //Enviar pedido para API whats

  const cartItems = cart.map((item) => {
    return(
      `${item.name} Quantidade (${item.qtd}) Preço: ${item.price} | `
    )
  }).join("")

  const message = encodeURIComponent(cartItems)
  const phone = "31993956707"


  window.open(`https://wa.me/${phone}?text=${message} Endereço: [ ${addressInput.value} ]`, "_blank")

  cart = []
  updateCartModal()
})

function checkRestaurantOpen(){
  const data = new Date();
  const hora = data.getHours()
  return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen()


if(isOpen){
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600")
}else{
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-500")
}