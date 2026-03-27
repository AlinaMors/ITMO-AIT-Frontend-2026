const API_URL = "http://localhost:3000"; // адрес сервера

document.addEventListener('DOMContentLoaded', () => {
    console.log("🏵️ AIBloom: Оранжерея готова к работе!");

    // Логика формы входа (с fetch)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                // запрос к json-серверу
                const response = await fetch(`${API_URL}/users?email=${email}&password=${password}`);
                const users = await response.json();

                if (users.length > 0) {
                    // если пользователь найден, сохраняем его в память браузера
                    localStorage.setItem("currentUser", JSON.stringify(users[0]));
                    alert(`Добро пожаловать в сад, ${users[0].name}!`);
                    window.location.href = 'profile.html';
                } else {
                    alert("Ошибка: Неверный email или пароль!");
                }
            } catch (error) {
                alert("Ошибка: Нужно запустить json-server!");
            }
        });
    }

    // Логика формы регистрации
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Аккаунт создан! Теперь можно войти.');
            window.location.href = 'login.html';
        });
    }

    // Логика модального окна загрузки
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            const originalText = btn.innerHTML;

            btn.innerHTML = "🌱 Посев...";
            btn.disabled = true;

            setTimeout(() => {
                alert('Модель успешно посажена и скоро появится в вашем саду!');
                btn.innerHTML = originalText;
                btn.disabled = false;
                // Закрываем через Bootstrap API
                const modal = bootstrap.Modal.getInstance(document.getElementById('uploadModal'));
                modal.hide();
            }, 2000);
        });
    }

    // Логика звезд
    const starBtn = document.getElementById('starBtn');
    if (starBtn) {
        const countSpan = starBtn.querySelector('.count');
        let count = parseInt(countSpan.innerText.replace(' ', ''));

        // Проверяем, ставил ли пользователь звезду ранее (в localStorage)
        let isStarred = localStorage.getItem('modelStarred') === 'true';

        if (isStarred) {
            starBtn.classList.replace('btn-outline-primary', 'btn-primary');
        }

        starBtn.addEventListener('click', () => {
            isStarred = !isStarred;
            localStorage.setItem('modelStarred', isStarred);

            if (isStarred) {
                starBtn.classList.replace('btn-outline-primary', 'btn-primary');
                count++;
            } else {
                starBtn.classList.replace('btn-primary', 'btn-outline-primary');
                count--;
            }
            countSpan.innerText = count.toLocaleString();
        });
    }

    // Логика обсуждений (добавление сообщений)
    const commentForm = document.getElementById('commentForm');
    const commentList = document.getElementById('commentList');
    const commentInput = document.getElementById('commentInput');

    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = commentInput.value.trim();

            if (text) {
                // новый элемент комментария
                const newComment = document.createElement('div');
                newComment.className = 'd-flex mb-3 pb-3 border-bottom animate-fade-in';
                newComment.innerHTML = `
                    <img src="https://ui-avatars.com/api/?name=Guest&background=F4A261&color=fff" class="rounded-circle me-3" width="40" height="40">
                    <div>
                        <h6 class="mb-0 fw-bold">Вы (Гость) <span class="badge bg-light text-muted fw-normal ms-2">Только что</span></h6>
                        <p class="mb-0 small text-muted">${text}</p>
                    </div>
                `;

                // в начало списка
                commentList.prepend(newComment);
                commentInput.value = '';
            }
        });
    }

    // Логика форков
    const forkBtn = document.getElementById('forkBtn');
    if (forkBtn) {
        forkBtn.addEventListener('click', () => {
            alert('Модель успешно скопирована (форкнута) в ваш сад!');
            const forkCount = forkBtn.querySelector('.count');
            forkCount.innerText = parseInt(forkCount.innerText) + 1;
        });
    }
});