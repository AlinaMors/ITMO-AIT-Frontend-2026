document.addEventListener("DOMContentLoaded", () => {
    const auth = localStorage.getItem("auth");

    if (auth === "true") {
        showUserUI();
    }
});

function showUserUI() {
    const user = JSON.parse(localStorage.getItem("user"));
    const block = document.getElementById("authButtons");

    block.innerHTML = `
        <span class="text-light mt-2 me-3">
            Hello, ${user.name}!
        </span>
        <a href="dashboard.html" class="btn btn-outline-light me-3">
            My Profile
        </a>
        <button class="btn btn-outline-warning" onclick="logout()">Logout</button>
    `;
}

function logout() {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    location.reload();
}