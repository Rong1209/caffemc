let cart = [];
let edition = "Java";

const BACKEND_URL = "https://caffemc-api.saknsjs36.workers.dev/";

function getDeviceId() {
  let id = localStorage.getItem("caffemc_device_id");

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("caffemc_device_id", id);
  }

  return id;
}

function addToCart(item) {
  let found = cart.find(i => i.name === item);

  if (found) {
    found.qty += 1;
  } else {
    cart.push({
      name: item,
      qty: 1
    });
  }

  updateCart();
}

function updateCart() {
  const cartCount = document.getElementById("cartCount");
  const list = document.getElementById("cartList");

  cartCount.innerText = cart.reduce((a, b) => a + b.qty, 0);
  list.innerHTML = "";

  if (cart.length === 0) {
    list.innerHTML = `
      <p style="text-align:center;opacity:.7;">
        Cart is empty
      </p>
    `;
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

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

function openOrder() {
  document.getElementById("orderPopup").style.display = "flex";
  updateCart();
}

function closeOrder() {
  document.getElementById("orderPopup").style.display = "none";
}

function selectEdition(type, element) {
  edition = type;

  document.querySelectorAll(".ed-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  element.classList.add("active");
}

function openVideo(src) {
  const popup = document.getElementById("imgPopup");
  const video = document.getElementById("popupVideo");
  const videoSrc = document.getElementById("videoSrc");

  popup.style.display = "flex";
  videoSrc.src = src;
  video.load();
  video.play();
}

function closeVideo() {
  const popup = document.getElementById("imgPopup");
  const video = document.getElementById("popupVideo");

  popup.style.display = "none";
  video.pause();
  video.currentTime = 0;
}

function closeImg(event) {
  if (event.target.id === "imgPopup") {
    closeVideo();
  }
}

async function submitOrder() {
  const usernameInput = document.getElementById("username");
  const fileInput = document.getElementById("proofUpload");
  const status = document.getElementById("status");

  const username = usernameInput.value.trim();
  const file = fileInput.files[0];

  status.innerHTML = "";
  status.classList.remove("error", "success");

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

  if (BACKEND_URL.includes("YOUR_SUBDOMAIN")) {
    status.classList.add("error");
    status.innerHTML = "❌ Backend URL missing!";
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
  formData.append("deviceId", getDeviceId());
  formData.append("file", file);

  try {
    status.classList.add("success");
    status.innerHTML = "⏳ Sending order...";

    const response = await fetch(BACKEND_URL, {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to send order.");
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
  }
}

document.addEventListener("contextmenu", function(e) {
  e.preventDefault();
});

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

setInterval(() => {
  const widthDiff = window.outerWidth - window.innerWidth;
  const heightDiff = window.outerHeight - window.innerHeight;

  if (widthDiff > 160 || heightDiff > 160) {
    document.body.innerHTML = `
      <div style="
        height:100vh;
        display:flex;
        justify-content:center;
        align-items:center;
        background:#020617;
        color:#ef4444;
        font-family:Arial,sans-serif;
        font-size:26px;
        text-align:center;
        padding:20px;">
        Inspect is disabled.
      </div>
    `;
  }
}, 1000);
