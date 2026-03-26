document.addEventListener('DOMContentLoaded', () => {

    const coursesGrid = document.getElementById('coursesGrid');

    async function loadCourses(filters = '') {
        try {
            const url = `http://localhost:4000/courses${filters}`;
            const response = await fetch(url);
            
            if (!response.ok) throw new Error('Сервер не отвечает');

            const courses = await response.json();
            coursesGrid.innerHTML = '';

            if (courses.length === 0) {
                coursesGrid.innerHTML = '<div class="col-12"><p class="text-white-50 text-center mt-5 fs-5">По вашему запросу ничего не найдено</p></div>';
                return;
            }

            courses.forEach(course => {
                const priceText = course.price === 0 ? 'Бесплатно' : `${course.price} ₽`;
                const priceClass = course.price === 0 ? 'text-white' : 'neon-text';
                const btnClass = course.price === 0 ? 'btn-outline-light' : 'btn-neon';
                const stars = '★'.repeat(course.rating) + '☆'.repeat(5 - course.rating);

                const cardHtml = `
                    <div class="col">
                        <div class="card course-card h-100 bg-dark text-white border-secondary rounded-4 overflow-hidden d-flex flex-column">
                            <img src="${course.image}" class="card-img-top image-placeholder" alt="${course.title}">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title fw-bold mb-1">${course.title}</h5>
                                <div class="text-warning small mb-2">
                                    ${stars} <span class="text-white-50 ms-1">(${course.reviews})</span>
                                </div>
                                <p class="card-text text-white-50 small flex-grow-1">${course.desc}</p>
                                <div class="d-flex justify-content-between align-items-center mt-auto pt-3">
                                    <span class="fs-5 fw-bold ${priceClass}">${priceText}</span>
                                    <a href="course.html?id=${course.id}" class="btn btn-sm ${btnClass} rounded-pill px-3 fw-bold">Подробнее</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                coursesGrid.innerHTML += cardHtml;
            });
        } catch (error) {
            console.error('Ошибка:', error);
            coursesGrid.innerHTML = '<div class="col-12"><p class="text-danger text-center mt-5 fs-5">Не удалось загрузить курсы. Сервер работает?</p></div>';
        }
    }

    if (coursesGrid) {
        loadCourses();

        const priceRange = document.getElementById('priceRange');
        const priceLabel = document.getElementById('priceLabel');
        if (priceRange && priceLabel) {
            priceRange.addEventListener('input', (e) => {
                priceLabel.textContent = `${e.target.value} ₽`;
            });
        }

        const applyBtn = document.getElementById('applyFiltersBtn');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                const search = document.getElementById('searchInput').value;
                const category = document.getElementById('categorySelect').value;
                const level = document.getElementById('levelSelect').value;
                const price = document.getElementById('priceRange').value;

                const params = new URLSearchParams();

                if (search) {
                    params.append('q', search);
                }
                if (category !== 'all') {
                    params.append('category', category);
                }
                if (level !== 'all') {
                    params.append('level', level);
                }

                params.append('price_lte', price);

                loadCourses(`?${params.toString()}`);
            });
        }
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('http://localhost:4000/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error('Такой email уже существует или произошла ошибка');
                }

                const result = await response.json();
                
                localStorage.setItem('accessToken', result.accessToken);
                localStorage.setItem('user', JSON.stringify(result.user));

                window.location.href = 'profile.html';
            } catch (error) {
                alert(error.message);
            }
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(loginForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('http://localhost:4000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error('Неверный email или пароль');
                }

                const result = await response.json();
                
                localStorage.setItem('accessToken', result.accessToken);
                localStorage.setItem('user', JSON.stringify(result.user));

                window.location.href = 'profile.html';
            } catch (error) {
                alert(error.message);
            }
        });
    }

    const userJson = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    const navButtonsBlock = document.querySelector('.navbar-collapse .d-flex');
    const navList = document.querySelector('.navbar-nav');

    if (userJson && token) {
        const user = JSON.parse(userJson);
        const shortName = user.name.split(' ')[0];
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=a855f7&color=fff`;

        if (navButtonsBlock) {
            navButtonsBlock.innerHTML = `
                <div class="dropdown mt-3 mt-lg-0">
                    <a class="text-decoration-none d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="${avatarUrl}" class="rounded-circle border border-secondary" width="40" height="40" alt="Аватар">
                        <span class="text-white ms-2 d-none d-md-inline fw-bold">${shortName}</span>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark mt-2 border-secondary shadow-lg">
                        <li><a class="dropdown-item" href="profile.html">Личный кабинет</a></li>
                        <li><hr class="dropdown-divider border-secondary"></li>
                        <li><a class="dropdown-item text-danger fw-bold" href="#" id="logoutBtn">Выйти</a></li>
                    </ul>
                </div>
            `;

            document.getElementById('logoutBtn').addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                window.location.href = 'index.html';
            });
        }

        if (navList && !document.querySelector('a[href="profile.html"].nav-link')) {
            navList.innerHTML += `
                <li class="nav-item">
                    <a class="nav-link text-white-50" href="profile.html">Мой прогресс</a>
                </li>
            `;
        }
    }

    if (window.location.pathname.includes('profile.html')) {
        if (!userJson || !token) {
            window.location.href = 'login.html';
        } else {
            const user = JSON.parse(userJson);

            const profileName = document.querySelector('.card h2');
            const profileEmail = document.querySelector('.card .text-white-50.mb-2');
            const profileAvatar = document.querySelector('.card img.rounded-circle.border-3');

            if (profileName) profileName.textContent = user.name;
            if (profileEmail) profileEmail.textContent = user.email;
            if (profileAvatar) profileAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=a855f7&color=fff&size=128`;

            const studentTabBtn = document.querySelector('[data-bs-target="#student-panel"]');
            const teacherTabBtn = document.querySelector('[data-bs-target="#teacher-panel"]');

            if (user.role === 'student') {
                teacherTabBtn.parentElement.style.display = 'none';
                studentTabBtn.click();
            } else if (user.role === 'teacher') {
                studentTabBtn.parentElement.style.display = 'none';
                teacherTabBtn.click();
            }
        }
    }

    if (window.location.pathname.includes('course.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const courseId = urlParams.get('id');

        if (courseId) {

            fetch(`http://localhost:4000/courses/${courseId}`)
                .then(res => res.json())
                .then(course => {

                    document.getElementById('bcTitle').textContent = course.title;
                    document.getElementById('courseTitle').textContent = course.title;
                    document.getElementById('courseDesc').textContent = course.desc;
                    document.getElementById('courseFullDesc').textContent = course.desc;
                    document.getElementById('courseImg').src = course.image;
                    
                    const priceText = course.price === 0 ? 'Бесплатно' : `${course.price} ₽`;
                    document.getElementById('coursePrice').textContent = priceText;
                    document.getElementById('coursePrice').className = course.price === 0 ? 'text-white fw-bold mb-3' : 'neon-text fw-bold mb-3';

                    document.getElementById('teacherName').textContent = course.teacherName;
                    document.getElementById('teacherRole').textContent = course.teacherRole;
                    document.getElementById('teacherAvatar').src = course.teacherAvatar;
                })
                .catch(err => console.error("Курс не найден", err));
        } else {
            document.getElementById('courseTitle').textContent = "Курс не выбран";
        }
    }


    if (window.location.pathname.includes('profile.html') && userJson) {
        const user = JSON.parse(userJson);
        if (user.role === 'student') {
            const statNumbers = document.querySelectorAll('.fs-3.fw-bold');
            if (statNumbers.length >= 3) {
                statNumbers[0].textContent = '0';
                statNumbers[1].textContent = '0';
                statNumbers[2].textContent = '0.0';
            }

            const studentCoursesContainer = document.querySelector('#student-panel .row');
            if (studentCoursesContainer) {
                studentCoursesContainer.innerHTML = '<div class="col-12"><p class="text-white-50 fs-5">Вы пока не записались ни на один курс. Самое время перейти в <a href="index.html" class="text-neon">каталог</a>!</p></div>';
            }
        }
    }
});

