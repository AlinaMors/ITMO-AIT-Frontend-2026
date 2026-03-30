document.addEventListener("DOMContentLoaded", initDashboardPage);

async function initDashboardPage() {
    if (!requireAuth()) return;

    const user = getUser();
    fillUserInfo(user);

    const coursesContainer = document.getElementById("myCoursesList");
    coursesContainer.innerHTML = `
        <div class="col-12 text-center my-5 py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;"></div>
            <p class="mt-3 text-muted">Загрузка ваших курсов...</p>
        </div>`;

    try {
        const enrollments = await getUserCourses(user.id);
        const courses = enrollments.map(e => e.course).filter(Boolean);

        fillStats(courses, enrollments);
        renderMyCourses(courses);
        renderCertificates([]);
    } catch (err) {
        console.error("Dashboard error:", err);
        renderDashboardError(err.message);
    }
}

function fillUserInfo(user) {
    const name = user?.name || "Пользователь";
    const role = user?.role === "teacher" ? "Преподаватель" : "Студент";
    const avatar = name.charAt(0).toUpperCase();

    document.getElementById("profileUserName").textContent = name;
    document.getElementById("topbarUserName").textContent = name;
    document.getElementById("topbarUserRole").textContent = role;
    document.getElementById("topbarUserAvatar").textContent = avatar;
}

function fillStats(courses, enrollments) {
    const finishedCount = enrollments ? enrollments.filter(e => e.completed).length : 0;
    
    document.getElementById("profileCoursesCount").textContent = courses.length;
    document.getElementById("profileFinishedCount").textContent = finishedCount;
    document.getElementById("profileCertificatesCount").textContent = "0";
}

function renderMyCourses(courses) {
    const container = document.getElementById("myCoursesList");
    container.innerHTML = "";

    if (courses.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="card p-5 text-center border-0 shadow-sm">
                    <div class="empty-state-icon mb-3">📚</div>
                    <h5>У вас пока нет курсов</h5>
                    <p class="text-muted">Запишитесь на интересующие курсы в каталоге</p>
                    <a href="index.html" class="btn btn-primary-custom mt-3">
                        Перейти в каталог
                    </a>
                </div>
            </div>`;
        return;
    }

    courses.forEach(course => {
        container.insertAdjacentHTML("beforeend", `
            <div class="col-md-6 col-xl-4">
                <div class="card dashboard-course-card h-100 shadow-sm">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between mb-3">
                            <span class="badge badge-subject">${course.subject || "Без категории"}</span>
                            <span class="badge bg-light text-dark">${course.level || "—"}</span>
                        </div>
                        <h5 class="card-title mb-2">${course.title}</h5>
                        <p class="dashboard-course-description flex-grow-1">
                            ${course.desc || "Описание отсутствует"}
                        </p>
                        <div class="mt-auto">
                            <a href="course.html?id=${course.id}" 
                               class="btn btn-primary-custom w-100">
                                Продолжить обучение →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `);
    });
}

function renderCertificates(certificates) {
    const container = document.getElementById("certificatesList");
    container.innerHTML = "";

    if (certificates.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="card p-5 text-center border-0 shadow-sm">
                    <div class="certificate-icon mb-3">🏆</div>
                    <h5>Сертификатов пока нет</h5>
                    <p class="text-muted">Завершите хотя бы один курс, и сертификат появится здесь</p>
                </div>
            </div>`;
        return;
    }
}

function renderDashboardError(errorMsg = "") {
    document.getElementById("profileCoursesCount").textContent = "0";
    document.getElementById("profileFinishedCount").textContent = "0";
    document.getElementById("profileCertificatesCount").textContent = "0";

    const container = document.getElementById("myCoursesList");
    container.innerHTML = `
        <div class="col-12">
            <div class="alert alert-danger text-center p-4">
                <h5>Не удалось загрузить данные</h5>
                <p class="mb-3">${errorMsg || "Проверьте подключение к серверу"}</p>
                <button onclick="location.reload()" class="btn btn-outline-primary">
                    Попробовать снова
                </button>
            </div>
        </div>`;
}