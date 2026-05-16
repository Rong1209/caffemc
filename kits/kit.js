let cart = [];
let edition = "Java";

/* WEBHOOK - split style */
const w1 = "https://discord.com/api/webhooks/";
const w2 = "1504813557068595242";
const w3 = "8LB5JqWmNehXL2yz4DraccAdrJBCM8OqFo4WZISdA_ashqLzQxGO8ZqV46fKCr2dm2kT";
const DISCORD_WEBHOOK_URL = w1 + w2 + "/" + w3;
const DISCORD_USER_ID = "1253190870971322371";


/* ADD TO CART */
function addToCart(item){

let found = cart.find(i => i.name === item);

if(found){
found.qty += 1;
}else{
cart.push({
name:item,
qty:1
});
}

updateCart();

}

/* UPDATE CART */
function updateCart(){

const cartCount = document.getElementById("cartCount");
const list = document.getElementById("cartList");

cartCount.innerText =
cart.reduce((a,b)=>a+b.qty,0);

list.innerHTML = "";

if(cart.length === 0){

list.innerHTML =
`<p style="text-align:center;opacity:.7;">
Cart is empty
</p>`;

return;

}

cart.forEach((item,index)=>{

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
function removeItem(index){

cart.splice(index,1);

updateCart();

}

/* OPEN ORDER */
function openOrder(){

document.getElementById("orderPopup").style.display = "flex";

updateCart();

}

/* CLOSE ORDER */
function closeOrder(){

document.getElementById("orderPopup").style.display = "none";

}

/* SELECT JAVA / BEDROCK */
function selectEdition(type, element){

edition = type;

document.querySelectorAll(".ed-btn").forEach(btn=>{
btn.classList.remove("active");
});

element.classList.add("active");

}

/* OPEN VIDEO */
function openVideo(src){

const popup = document.getElementById("imgPopup");
const video = document.getElementById("popupVideo");
const videoSrc = document.getElementById("videoSrc");

popup.style.display = "flex";

videoSrc.src = src;

video.load();
video.play();

}

/* CLOSE VIDEO */
function closeVideo(){

const popup = document.getElementById("imgPopup");
const video = document.getElementById("popupVideo");

popup.style.display = "none";

video.pause();
video.currentTime = 0;

}

/* CLICK BACKGROUND CLOSE VIDEO */
function closeImg(event){

if(event.target.id === "imgPopup"){
closeVideo();
}

}

/* SUBMIT ORDER */
async function submitOrder(){

const usernameInput = document.getElementById("username");
const fileInput = document.getElementById("proofUpload");
const status = document.getElementById("status");

const username = usernameInput.value.trim();
const file = fileInput.files[0];

status.innerHTML = "";
status.classList.remove("error","success");

if(username === ""){

status.classList.add("error");
status.innerHTML = "❌ Username is required!";

usernameInput.focus();

return;

}

if(cart.length === 0){

status.classList.add("error");
status.innerHTML = "❌ Your cart is empty!";

return;

}

if(!file){

status.classList.add("error");
status.innerHTML = "❌ Upload payment proof!";

return;

}

if(w2 === "PASTE_WEBHOOK_ID_HERE" || w3 === "PASTE_WEBHOOK_TOKEN_HERE"){

status.classList.add("error");
status.innerHTML = "❌ Discord webhook missing!";

return;

}

const receipt =
"CAFFE-" + Math.floor(Math.random()*999999);

let cartText = "";

cart.forEach(item=>{
cartText += `${item.name} x${item.qty}\n`;
});

  const formData = new FormData();

  formData.append(
    "content",
    `<@${DISCORD_USER_ID}>

🛒 NEW CAFFE MC ORDER

👤 Username: ${username}
🎮 Edition: ${edition}

📦 Cart:
${cartText}
 Dak rank bong 
🧾 Receipt:
${receipt}

✅ Please check payment proof below.`
  );

formData.append("file", file);

try{

status.classList.add("success");
status.innerHTML = "⏳ Sending order...";

await fetch(DISCORD_WEBHOOK_URL,{
method:"POST",
body:formData
});

status.innerHTML =
`✅ Order Sent Successfully
<br>
Receipt: ${receipt}`;

cart = [];

updateCart();

setTimeout(()=>{

window.location.href = "../index.html";

},3000);

}catch(error){

console.error(error);

status.classList.remove("success");
status.classList.add("error");

status.innerHTML =
"❌ Failed to send order!";

}

}


document.addEventListener("contextmenu", function(e){
e.preventDefault();
});

// disable common inspect keys
document.addEventListener("keydown", function(e){

if(e.key === "F12"){
e.preventDefault();
return false;
}

if(e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i"){
e.preventDefault();
return false;
}

if(e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "j"){
e.preventDefault();
return false;
}

if(e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c"){
e.preventDefault();
return false;
}

if(e.ctrlKey && e.key.toLowerCase() === "u"){
e.preventDefault();
return false;
}

if(e.ctrlKey && e.key.toLowerCase() === "s"){
e.preventDefault();
return false;
}

});

// basic devtools detection
setInterval(()=>{

const widthDiff =
window.outerWidth - window.innerWidth;

const heightDiff =
window.outerHeight - window.innerHeight;

if(widthDiff > 160 || heightDiff > 160){

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

},1000);