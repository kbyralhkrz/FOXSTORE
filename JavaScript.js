async function registerUser() {
    const username = document.getElementById("reg-username").value;
    const password = document.getElementById("reg-password").value;

    const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    const message = document.getElementById("reg-message");
    message.innerText = data.message || data.error;
}

async function loginUser() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    const message = document.getElementById("login-message");

    if (data.token) {
        localStorage.setItem("token", data.token);
        message.innerText = `مرحباً ${data.username}, رصيدك: ${data.balance} ريال.`;
        message.style.color = "green";
    } else {
        message.innerText = data.error;
        message.style.color = "red";
    }
}