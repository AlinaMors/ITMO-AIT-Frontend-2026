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

        hideMessage(errorBox);

        if (!email || !password) {
            showMessage(errorBox, "Введите email и пароль");
            return;
        }

        try {
            const data = await loginUser({ email, password });

            if (data.accessToken) saveToken(data.accessToken);

            if (data.user) {
                const { password, ...safeUserData } = data.user;
                saveUser(safeUserData);
            }

            redirectByRole(data.user?.role);
        } catch (err) {
            showMessage(errorBox, err.message || "Неверный email или пароль");
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

        hideMessage(errorBox);
        hideMessage(successBox);

        if (!name || !email || !password) {
            showMessage(errorBox, "Заполните все поля");
            return;
        }

        try {
            const data = await registerUser({ name, email, password, role });

            if (data.accessToken) saveToken(data.accessToken);

            if (data.user) {
                const { password, ...safeUserData } = data.user;
                saveUser(safeUserData);
            }

            showMessage(successBox, "Регистрация успешна! Перенаправляем...");
            setTimeout(() => redirectByRole(data.user?.role || role), 800);
        } catch (err) {
            showMessage(errorBox, err.message || "Ошибка регистрации");
        }
    });
}

function redirectByRole(role) {
    window.location.href = role === "teacher" ? "teacher.html" : "dashboard.html";
}

function showMessage(container, message) {
    if (!container) return;
    container.textContent = message;
    container.style.display = "block";
}

function hideMessage(container) {
    if (!container) return;
    container.textContent = "";
    container.style.display = "none";
}