import {showModal} from "../core/modal.js";

function login(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const loginData = {};

    formData.forEach((value, label) => {
        loginData[label] = value
    });

    const ADMIN_EMAIL = "admin@admin.com";
    const ADMIN_PASSWORD = "admin";

    if (loginData.email !== ADMIN_EMAIL) {
        showModal("Ошибка входа", "Аккаунт с таким email не найден.");
        return;
    }

    if (loginData.password !== ADMIN_PASSWORD) {
        showModal("Ошибка входа", "Неверный пароль.");
        return;
    }

    showModal("Добро пожаловать", "Вы успешно вошли в систему.");

    localStorage.accessToken = "mock_token_" + Date.now();
    localStorage.user = JSON.stringify({ email: loginData.email });

    setTimeout(() => {
        window.location.href = "account.html";
    }, 1500);
}

window.login = login;
