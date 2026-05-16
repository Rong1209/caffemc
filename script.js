const SERVER_IP = "caffemc.xyz";
const API_URL = `https://api.mcsrvstat.us/3/${SERVER_IP}`;
// Bedrock use:
// const API_URL = `https://api.mcsrvstat.us/bedrock/3/${SERVER_IP}`;

function copyIP(){
  navigator.clipboard.writeText(SERVER_IP);

  const msg = document.getElementById("copied");
  msg.classList.add("show");

  setTimeout(()=>{
    msg.classList.remove("show");
  },2200);
}

function toggleMenu(){
  const menu = document.getElementById("menu");
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}

async function checkServer(){
  const playersEl = document.getElementById("players");

  try{
    const res = await fetch(API_URL);
    const data = await res.json();

    if(data.online){
      playersEl.textContent = data.players?.online ?? 0;
    }else{
      playersEl.textContent = "Offline";
    }
  }catch(err){
    playersEl.textContent = "Error";
  }
}

checkServer();
setInterval(checkServer, 30000);

/* Soft anti inspect / F12 only */
document.addEventListener("contextmenu", e => e.preventDefault());

document.addEventListener("keydown", e => {
  if(
    e.key === "F12" ||
    (e.ctrlKey && e.shiftKey && ["I","J","C"].includes(e.key.toUpperCase())) ||
    (e.ctrlKey && e.key.toUpperCase() === "U")
  ){
    e.preventDefault();
    alert("Inspect is disabled.");
  }
});