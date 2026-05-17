let cart = [];
let edition = "Java";

/* KEY BACKEND */
const BACKEND_URL = "https://caffemc-api.saknsjs36.workers.dev";
const SHOP_TYPE = "KEY";

/* ADD TO CART */
function addToCart(item, button) {
  let found = cart.find(i => i.name === item);

  if (found) {
    found.qty += 1;
  } else {
    cart.push({
      name: item,
      qty: 1
    });
  }

  if (button) {
    const card = button.closest(".key-card");

    if (card) {
      card.classList.add("in-cart");
    }
  }

  updateCart();
}

/* UPDATE CART */
function updateCart() {
  const cartCount = document.getElementById("cartCount");
  const list = document.getElementById("cartList");
  const checkoutTopBtn = document.getElementById("checkoutTopBtn");

  if (cartCount) {
    cartCount.innerText = cart.reduce((a, b) => a + b.qty, 0);
  }

  if (checkoutTopBtn) {
    if (cart.length > 0) {
      checkoutTopBtn.classList.add("show");
    } else {
      checkoutTopBtn.classList.remove("show");
    }
  }

  if (!list) return;

  list.innerHTML = "";

  if (cart.length === 0) {
    list.innerHTML = `
      <p style="text-align:center;opacity:.7;">
        Cart is empty
      </p>
    `;

    document.querySelectorAll(".key-card").forEach(card => {
      card.classList.remove("in-cart");
    });

    return;
  }

  cart.forEach((item, index) => {
    list.innerHTML += `
      <div class="cart-item">
        <span>${item.name} x${item.qty}</span>

        <button
          class="remove-btn"
          onclick="removeItem(${index})">
          ×
        </button>
      </div>
    `;
  });
}

/* REMOVE ITEM */
function removeItem(index) {
  const removedItem = cart[index].name;

  cart.splice(index, 1);

  const stillExist = cart.find(i => i.name === removedItem);

  if (!stillExist) {
    document.querySelectorAll(".key-card").forEach(card => {
      if (
        card.dataset.key === removedItem ||
        removedItem.startsWith(card.dataset.key)
      ) {
        card.classList.remove("in-cart");
      }
    });
  }

  updateCart();
}

/* OPEN ORDER */
function openOrder() {
  const popup = document.getElementById("orderPopup");

  if (popup) {
    popup.style.display = "flex";
  }

  updateCart();
}

/* CLOSE ORDER */
function closeOrder() {
  const popup = document.getElementById("orderPopup");

  if (popup) {
    popup.style.display = "none";
  }
}

/* SELECT JAVA / BEDROCK */
function selectEdition(type, element) {
  edition = type;

  document.querySelectorAll(".ed-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  element.classList.add("active");
}

/* OPEN IMAGE */
function openImage(src) {
  const popup = document.getElementById("imgPopup");
  const image = document.getElementById("popupImage");

  if (!popup || !image) return;

  popup.style.display = "flex";
  image.src = src;
}

/* CLOSE IMAGE */
function closeImage() {
  const popup = document.getElementById("imgPopup");
  const image = document.getElementById("popupImage");

  if (!popup || !image) return;

  popup.style.display = "none";
  image.src = "";
}

/* CLICK BACKGROUND CLOSE */
function closeImg(event) {
  if (event.target.id === "imgPopup") {
    closeImage();
  }
}

/* SUBMIT KEY ORDER */
async function submitOrder() {
  const usernameInput = document.getElementById("username");
  const fileInput = document.getElementById("proofUpload");
  const status = document.getElementById("status");

  const username = usernameInput.value.trim();
  const file = fileInput.files[0];

  status.innerHTML = "";
  status.classList.remove("error", "success");

  if (username === "") {
    status.classList.add("error");
    status.innerHTML = "❌ Username is required!";
    usernameInput.focus();
    return;
  }

  if (cart.length === 0) {
    status.classList.add("error");
    status.innerHTML = "❌ Your cart is empty!";
    return;
  }

  if (!file) {
    status.classList.add("error");
    status.innerHTML = "❌ Upload payment proof!";
    return;
  }

  const receipt = "CAFFE-" + Math.floor(100000 + Math.random() * 900000);

  let cartText = "";

  cart.forEach(item => {
    cartText += `• ${item.name} x${item.qty}\n`;
  });

  const formData = new FormData();

  formData.append("username", username);
  formData.append("edition", edition);
  formData.append("cart", cartText);
  formData.append("receipt", receipt);
  formData.append("shopType", SHOP_TYPE);
  formData.append("file", file);

  try {
    status.classList.add("success");
    status.innerHTML = "⏳ Sending order...";

    const response = await fetch(BACKEND_URL, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Backend failed");
    }

    status.innerHTML = `
      ✅ Order Sent Successfully
      <br>
      Receipt: ${receipt}
    `;

    cart = [];
    updateCart();

    usernameInput.value = "";
    fileInput.value = "";

    setTimeout(() => {
      window.location.href = "../index.html";
    }, 3000);

  } catch (error) {
    console.error(error);

    status.classList.remove("success");
    status.classList.add("error");
    status.innerHTML = "❌ Failed to send order!";
  }
}

/* DISABLE RIGHT CLICK */
document.addEventListener("contextmenu", function(e) {
  e.preventDefault();
});

/* DISABLE COMMON INSPECT KEYS */
document.addEventListener("keydown", function(e) {
  if (e.key === "F12") {
    e.preventDefault();
    return false;
  }

  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") {
    e.preventDefault();
    return false;
  }

  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "j") {
    e.preventDefault();
    return false;
  }

  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c") {
    e.preventDefault();
    return false;
  }

  if (e.ctrlKey && e.key.toLowerCase() === "u") {
    e.preventDefault();
    return false;
  }

  if (e.ctrlKey && e.key.toLowerCase() === "s") {
    e.preventDefault();
    return false;
  }
});
