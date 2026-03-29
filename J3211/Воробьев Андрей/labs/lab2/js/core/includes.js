async function includeHTML(selector, url) {
    const element = document.querySelector(selector);
    if (!element) return;

    try {
        const response = await fetch(url);
        element.innerHTML = await response.text();
    } catch (error) {
        console.warn("Include error:", error);
    }
}

function setupPostLoginNavbar() {
    const user = JSON.parse(localStorage.user);
    const emailSpan = document.querySelector("#userEmail");
    if (emailSpan) emailSpan.textContent = user.email;

    const currentPage = window.location.pathname.split("/").pop().replace(".html", "");

    document.querySelectorAll("[data-page]").forEach(link => {
        link.classList.toggle("active", link.getAttribute("data-page") === currentPage);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.accessToken) { // Убрал переменную isLoggedIn
        includeHTML("#postlogin-site-navbar", "fragments/postlogin_navbar.html").then(() => {
            setupPostLoginNavbar();
        });
    } else {
        includeHTML("#prelogin-site-navbar", "fragments/prelogin_navbar.html");
    }

    includeHTML("#site-footer", "fragments/footer.html");
});
