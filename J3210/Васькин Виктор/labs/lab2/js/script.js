document.addEventListener('DOMContentLoaded', () => {

    const coursesGrid = document.getElementById('coursesGrid');

    async function loadCourses() {
        try {
            const response = await fetch('http://localhost:3000/courses');
            
            if (!response.ok) {
                throw new Error('Сервер не отвечает');
            }

            const courses = await response.json();
            coursesGrid.innerHTML = '';

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
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <div>
                                        <span class="badge bg-neon rounded-pill">${course.categoryLabel}</span>
                                        <span class="badge bg-secondary rounded-pill">${course.levelLabel}</span>
                                    </div>
                                </div>
                                <h5 class="card-title fw-bold mb-1">${course.title}</h5>
                                <div class="text-warning small mb-2">
                                    ${stars} <span class="text-white-50 ms-1">(${course.reviews})</span>
                                </div>
                                <p class="card-text text-white-50 small flex-grow-1">${course.desc}</p>
                                
                                <div class="d-flex justify-content-between align-items-center mt-2 mb-3">
                                    <span class="fs-5 fw-bold ${priceClass}">${priceText}</span>
                                    <a href="course.html?id=${course.id}" class="btn btn-sm ${btnClass} rounded-pill px-3 fw-bold">Подробнее</a>
                                </div>

                                <div class="mt-auto pt-3 border-top border-secondary d-flex align-items-center">
                                    <img src="${course.teacherAvatar}" class="rounded-circle" width="32" height="32" alt="Препод">
                                    <div class="ms-2 lh-1">
                                        <div class="small fw-bold text-white">${course.teacherName}</div>
                                        <div class="text-white-50" style="font-size: 0.75rem;">${course.teacherRole}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                coursesGrid.innerHTML += cardHtml;
            });

        } catch (error) {
            console.error('Ошибка:', error);
            coursesGrid.innerHTML = '<div class="col-12"><p class="text-danger text-center mt-5 fs-5">Не удалось загрузить курсы. Проверьте, запущен ли JSON-сервер в терминале.</p></div>';
        }
    }

    if (coursesGrid) {
        loadCourses();
    }
});