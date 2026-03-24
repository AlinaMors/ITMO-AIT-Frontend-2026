document.addEventListener("DOMContentLoaded", () => {
    initLoginForm();
    initRegisterForm();
});

function initLoginForm() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    const errorBox = form.querySelector("#formError");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = form.querySelector('[name="email"]').value.trim().toLowerCase();
        const password = form.querySelector('[name="password"]').value.trim();

        clearError(errorBox);

        if (!email || !password) {
            showError(errorBox, "Введите email и пароль");
            return;
        }

        try {
            const data = await loginUser({ email, password });

            if (data.accessToken) saveToken(data.accessToken);
            if (data.user) saveUser(data.user);

            redirectByRole(data.user?.role);
        } catch (err) {
            showError(errorBox, err.message || "Неверный email или пароль");
        }
    });
}

function initRegisterForm() {
    const form = document.getElementById("registerForm");
    if (!form) return;

    const errorBox = form.querySelector("#formError");
    const successBox = form.querySelector("#formSuccess");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = form.querySelector('[name="name"]').value.trim();
        const email = form.querySelector('[name="email"]').value.trim().toLowerCase();
        const password = form.querySelector('[name="password"]').value.trim();
        const role = form.querySelector('[name="role"]')?.value || "student";

        clearError(errorBox);
        clearSuccess(successBox);

        if (!name || !email || !password) {
            showError(errorBox, "Заполните все поля");
            return;
        }

        try {
            const data = await registerUser({ name, email, password, role });

            if (data.accessToken) saveToken(data.accessToken);
            if (data.user) saveUser(data.user);

            showSuccess(successBox, "Регистрация успешна! Перенаправляем...");
            setTimeout(() => redirectByRole(data.user?.role || role), 800);
        } catch (err) {
            showError(errorBox, err.message || "Ошибка регистрации");
        }
    });
}

function redirectByRole(role) {
    window.location.href = role === "teacher" ? "teacher.html" : "dashboard.html";
}

function showError(container, message) {
    if (!container) return;
    container.textContent = message;
    container.style.display = "block";
}

function clearError(container) {
    if (!container) return;
    container.textContent = "";
    container.style.display = "none";
}

function showSuccess(container, message) {
    if (!container) return;
    container.textContent = message;
    container.style.display = "block";
}

function clearSuccess(container) {
    if (!container) return;
    container.textContent = "";
    container.style.display = "none";
}