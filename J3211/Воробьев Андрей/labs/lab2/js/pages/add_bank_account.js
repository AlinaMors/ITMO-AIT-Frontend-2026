import { showModal } from "../core/modal.js";

function submitManualAccount(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const accountData = {};

    formData.forEach((value, label) => {
        accountData[label] = value
    });

    showModal("Уведомление", `Счёт ${accountData.accountName} будет создан в ручном режиме.`);
}

function submitApiAccount(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const accountData = {};

    formData.forEach((value, label) => {
        accountData[label] = value
    });

    showModal("Уведомление", `Счёт ${accountData.accountName} будет подключен по API.`);
}

window.submitManualAccount = submitManualAccount;
window.submitApiAccount = submitApiAccount;
