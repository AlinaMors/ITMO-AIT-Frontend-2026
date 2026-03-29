import {showModal} from "../core/modal.js";

function forgotPassword(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const forgotData = {};

    formData.forEach((value, label) => {
        forgotData[label] = value
    });

    const ADMIN_EMAIL = "admin@admin.com";

    if (forgotData.email !== ADMIN_EMAIL) {
        showModal("Ошибка", "Аккаунт с таким email не найден.");
        return;
    }

    showModal("Письмо отправлено", "Инструкции по восстановлению пароля отправлены на email.");

    setTimeout(() => {
        window.location.href = "index.html";
    }, 1500);
}

window.forgotPassword = forgotPassword;
