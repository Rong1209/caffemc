let cart = [];
let edition = "Java";

const BACKEND_URL = "https://caffemc-api.saknsjs36.workers.dev";
const SHOP_TYPE = "KIT";

function getDeviceId() {
  let id = localStorage.getItem("caffemc_device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("caffemc_device_id", id);
  }
  return id;
}

function addToCart(item, button) {
  const found = cart.find(i => i.name === item);

  if (found) found.qty += 1;
  else cart.push({ name: item, qty: 1 });

  if (button) {
    const card = button.closest(".kit-card");
    if (card) card.classList.add("in-cart");
  }

  updateCart();
}

function updateCart() {
  const cartCount = document.getElementById("cartCount");
  const cartList = document.getElementById("cartList");
  const checkoutTopBtn = document.getElementById("checkoutTopBtn");

  const totalItems = cart.reduce((a, b) => a + b.qty, 0);

  if (cartCount) cartCount.innerText = totalItems;

  if (checkoutTopBtn) {
    if (totalItems > 0) checkoutTopBtn.classList.add("show");
    else checkoutTopBtn.classList.remove("show");
  }

  if (!cartList) return;

  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.innerHTML = `
      <p style="text-align:center;opacity:.7;">
        Cart is empty
      </p>
    `;

    document.querySelectorAll(".kit-card").forEach(card => {
      card.classList.remove("in-cart");
    });

    return;
  }

  cart.forEach((item, index) => {
    cartList.innerHTML += `
      <div class="cart-item">
        <span>${item.name} x${item.qty}</span>
        <button class="remove-btn" onclick="removeItem(${index})">×</button>
      </div>
    `;
  });
}

function removeItem(index) {
  const removedItem = cart[index].name;
  cart.splice(index, 1);

  const stillExists = cart.find(i => i.name === removedItem);

  if (!stillExists) {
    document.querySelectorAll(".kit-card").forEach(card => {
      if (
        card.dataset.kit === removedItem ||
        removedItem.startsWith(card.dataset.kit)
      ) {
        card.classList.remove("in-cart");
      }
    });
  }

  updateCart();
}

function openOrder() {
  const popup = document.getElementById("orderPopup");
  if (popup) popup.style.display = "flex";
  updateCart();
}

function closeOrder() {
  const popup = document.getElementById("orderPopup");
  if (popup) popup.style.display = "none";
}

function selectEdition(type, element) {
  edition = type;

  document.querySelectorAll(".ed-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  element.classList.add("active");
}

function openImage(src) {
  const popup = document.getElementById("imgPopup");
  const image = document.getElementById("popupImage");

  if (!popup || !image) return;

  popup.style.display = "flex";
  image.src = src;
}

function closeImage() {
  const popup = document.getElementById("imgPopup");
  const image = document.getElementById("popupImage");

  if (!popup || !image) return;

  popup.style.display = "none";
  image.src = "";
}

function openVideo(src) {
  const popup = document.getElementById("imgPopup");
  const video = document.getElementById("popupVideo");
  const videoSrc = document.getElementById("videoSrc");

  if (!popup || !video || !videoSrc) return;

  popup.style.display = "flex";
  videoSrc.src = src;
  video.load();
  video.play();
}

function closeVideo() {
  const popup = document.getElementById("imgPopup");
  const video = document.getElementById("popupVideo");

  if (!popup || !video) return;

  popup.style.display = "none";
  video.pause();
  video.currentTime = 0;
}

function closeImg(event) {
  if (event.target.id === "imgPopup") {
    closeImage();
    closeVideo();
  }
}

async function submitOrder() {
  const usernameInput = document.getElementById("username");
  const fileInput = document.getElementById("proofUpload");
  const status = document.getElementById("status");

  const submitBtn =
    document.getElementById("submitBtn") ||
    document.querySelector(".submit-btn") ||
    document.querySelector(".checkout-btn");

  const username = usernameInput.value.trim();
  const file = fileInput.files[0];

  status.innerHTML = "";
  status.classList.remove("error", "success");

  if (submitBtn && submitBtn.disabled) return;

  if (!username) {
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
  formData.append("deviceId", getDeviceId());
  formData.append("file", file);

  try {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = "Sending...";
    }

    status.classList.add("success");
    status.innerHTML = "⏳ Sending order...";

    const response = await fetch(BACKEND_URL, {
      method: "POST",
      body: formData
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "Backend failed");
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
    status.innerHTML = `❌ ${error.message}`;

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerText = "Submit Order";
    }
  }
}

document.addEventListener("contextmenu", e => e.preventDefault());

document.addEventListener("keydown", function(e) {
  if (e.key === "F12") e.preventDefault();
  if (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(e.key.toLowerCase())) e.preventDefault();
  if (e.ctrlKey && ["u", "s"].includes(e.key.toLowerCase())) e.preventDefault();
});

document.addEventListener("DOMContentLoaded", updateCart);
