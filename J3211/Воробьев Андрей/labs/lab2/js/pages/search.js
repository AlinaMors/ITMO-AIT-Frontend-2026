import { showModal } from "../core/modal.js";

function filterTransactions(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const filterData = {};

    formData.forEach((value, label) => {
        filterData[label] = value;
    });

    showModal(
        "Поиск",
        `Фильтрация в разработке. Период: ${filterData.period}, категория: ${filterData.category}, счёт: ${filterData.account}.`
    );
}

window.filterTransactions = filterTransactions;

document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addTransactionBtn");
    if (addBtn) {
        addBtn.addEventListener("click", () => {
            showModal("Уведомление", "Форма добавления транзакции в разработке.");
        });
    }

    const addRule = document.getElementById("addAccountRule");
    if (addRule) {
        addRule.addEventListener("click", () => {
            showModal("Уведомление", "Форма добавления правила в разработке.");
        });
    }

});