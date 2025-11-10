console.log("hello, im main.js");
const app = document.getElementById("app")
const now = new Date(Date.now());
app.textContent = "#app is available. " + now.toLocaleDateString();