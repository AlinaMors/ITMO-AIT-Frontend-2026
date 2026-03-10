document.getElementById("loginForm").addEventListener("submit", function(e){
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    // load all users
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // find user
    const foundUser = users.find(user => user.email === email);

    if (!foundUser) {
        alert("User not found");
        return;
    }

    if (password === foundUser.password) {
        localStorage.setItem("user", JSON.stringify(foundUser));
        localStorage.setItem("auth", "true");
        window.location.href = "index.html";
    } else {
        alert("Wrong email or password");
    }
});