import {showModal} from "../core/modal.js";

function register(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const registerData = {};

    formData.forEach((value, label) => {
        registerData[label] = value
    });

    if ((registerData.password || "").length < 6) {
        showModal("Ошибка", "Пароль должен содержать минимум 6 символов.");
        return;
    }

    if (registerData.password !== registerData.confirmPassword) {
        showModal("Ошибка", "Пароли не совпадают.");
        return;
    }

    showModal("Регистрация успешна", `Аккаунт ${registerData.email} был бы создан.`);

    setTimeout(() => {
        window.location.href = "index.html";
    }, 1500);
}

window.register = register;
