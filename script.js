const SERVER_IP = "185.207.166.16";
const SERVER_PORT = "12009";

const COPY_IP = `${SERVER_IP}:${SERVER_PORT}`;
let checking = false;

function copyIP() {
  navigator.clipboard.writeText(COPY_IP);

  const msg = document.getElementById("copied");
  if (!msg) return;

  msg.classList.add("show");

  setTimeout(() => {
    msg.classList.remove("show");
  }, 2200);
}

function toggleMenu() {
  const menu = document.getElementById("menu");
  if (!menu) return;

  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}

async function checkServer() {
  if (checking) return;
  checking = true;

  const playersEl = document.getElementById("players");
  if (!playersEl) {
    checking = false;
    return;
  }

  playersEl.textContent = "...";

  try {
    const url = `https://api.mcsrvstat.us/bedrock/3/${SERVER_IP}:${SERVER_PORT}?t=${Date.now()}`;

    const res = await fetch(url, {
      method: "GET",
      cache: "no-store"
    });

    const data = await res.json();

    console.log(data);

    if (data && data.online === true) {
      const online = data.players?.online ?? 0;
      const max = data.players?.max ?? 0;

      playersEl.textContent = `${online}/${max}`;
    } else {
      playersEl.textContent = "Offline";
    }
  } catch (err) {
    console.error("Server check failed:", err);
    playersEl.textContent = "Error";
  }

  checking = false;
}

checkServer();
setInterval(checkServer, 30000);

/* Soft anti inspect */
document.addEventListener("contextmenu", e => e.preventDefault());

document.addEventListener("keydown", e => {
  const key = e.key.toUpperCase();

  if (
    e.key === "F12" ||
    (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(key)) ||
    (e.ctrlKey && key === "U")
  ) {
    e.preventDefault();
    alert("Inspect is disabled.");
  }
});