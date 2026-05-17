const SERVER_IP = "185.207.166.16";
const SERVER_PORT = "12009";

const COPY_IP = `${SERVER_IP}:${SERVER_PORT}`;

let checking = false;

/* =========================
   COPY SERVER IP
========================= */

function copyIP(){

  navigator.clipboard.writeText(COPY_IP);

  const msg = document.getElementById("copied");

  if(!msg) return;

  msg.classList.add("show");

  setTimeout(() => {
    msg.classList.remove("show");
  }, 2200);

}

/* =========================
   TOGGLE MENU
========================= */

function toggleMenu(){

  const menu = document.getElementById("menu");

  if(!menu) return;

  menu.classList.toggle("show");

}

/* =========================
   CHECK SERVER STATUS
========================= */

async function checkServer(){

  if(checking) return;

  checking = true;

  const playersEl = document.getElementById("players");

  if(!playersEl){
    checking = false;
    return;
  }

  playersEl.textContent = "Checking...";

  try{

    const url =
    `https://api.mcsrvstat.us/bedrock/3/${SERVER_IP}:${SERVER_PORT}?t=${Date.now()}`;

    const res = await fetch(url,{
      method:"GET",
      cache:"no-store"
    });

    if(!res.ok){
      throw new Error("API Error");
    }

    const data = await res.json();

    console.log(data);

    if(data.online === true){

      const online =
      data.players?.online ?? 0;

      const max =
      data.players?.max ?? 0;

      playersEl.textContent =
      `${online}/${max}`;

    }else{

      playersEl.textContent = "Offline";

    }

  }catch(err){

    console.error("Server check failed:", err);

    playersEl.textContent = "Offline";

  }finally{

    checking = false;

  }

}

checkServer();

setInterval(checkServer, 30000);

/* =========================
   CLOSE MENU OUTSIDE CLICK
========================= */

document.addEventListener("click", function(e){

  const menu = document.getElementById("menu");
  const button = document.querySelector(".menu-btn");

  if(!menu || !button) return;

  if(
    !menu.contains(e.target) &&
    !button.contains(e.target)
  ){
    menu.classList.remove("show");
  }

});

/* =========================
   SOFT ANTI INSPECT
========================= */

(function(){

  // Disable right click
  document.addEventListener("contextmenu", function(e){
    e.preventDefault();
  });

  // Block inspect shortcuts
  document.addEventListener("keydown", function(e){

    const key = e.key.toLowerCase();

    // F12
    if(key === "f12"){
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+I/J/C
    if(
      e.ctrlKey &&
      e.shiftKey &&
      ["i","j","c"].includes(key)
    ){
      e.preventDefault();
      return false;
    }

    // Ctrl+U
    if(
      e.ctrlKey &&
      key === "u"
    ){
      e.preventDefault();
      return false;
    }

    // Ctrl+S
    if(
      e.ctrlKey &&
      key === "s"
    ){
      e.preventDefault();
      return false;
    }

  });

})();
