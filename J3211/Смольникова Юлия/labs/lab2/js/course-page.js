document.addEventListener("DOMContentLoaded", initCoursePage);

let currentCourseData = null;

async function initCoursePage() {
    const id = getCourseIdFromUrl();
    const titleEl = document.getElementById("courseTitlePage");

    titleEl.textContent = "Загрузка курса...";

    if (!id) {
        renderCourseNotFound();
        return;
    }

    try {
        currentCourseData = await getCourseById(id);
        if (!currentCourseData) {
            renderCourseNotFound();
            return;
        }
    } catch (err) {
        console.error(err);
        renderCourseNotFound();
        return;
    }

    fillCourseInfo(currentCourseData);
    renderLessons(currentCourseData.lessons || []);
    renderMaterials(currentCourseData.materials || []);
    renderTasks(currentCourseData.tasks || []);
    loadFirstLessonVideo(currentCourseData.lessons || []);
}

function getCourseIdFromUrl() {
    return Number(new URLSearchParams(window.location.search).get("id"));
}

function fillCourseInfo(course) {
    document.getElementById("courseTitlePage").textContent = course.title || "Без названия";
    document.getElementById("courseDescPage").textContent = course.desc || "";
    document.getElementById("courseLevelInfo").textContent = course.level || "—";
    document.getElementById("courseSubjectInfo").textContent = course.subject || "—";
    document.getElementById("coursePriceInfo").textContent = course.price > 0 ? `${course.price} ₽` : "Бесплатно";
    document.getElementById("courseLessonsCount").textContent = (course.lessons || []).length;
    document.title = `${course.title} — Learnify`;
}

function renderCourseNotFound() {
    document.getElementById("courseTitlePage").textContent = "Курс не найден";
    document.getElementById("courseDescPage").textContent = "Проверьте ссылку или попробуйте позже";
    renderEmptyLessons();
    renderEmptyMaterials();
    renderEmptyTasks();
}

function renderLessons(lessons) {
    const container = document.getElementById("lessonList");
    container.innerHTML = "";

    if (lessons.length === 0) {
        renderEmptyLessons();
        return;
    }

    lessons.forEach((lesson, i) => {
        container.insertAdjacentHTML("beforeend", `
            <li class="list-group-item lesson-item ${i === 0 ? 'active' : ''}" data-video-id="${lesson.videoId || ''}">
                <div class="d-flex justify-content-between align-items-center">
                    <span>${lesson.title || "Урок"}</span>
                    <small class="${i === 0 ? 'text-white' : 'text-muted'}">${lesson.duration || ""}</small>
                </div>
            </li>
        `);
    });

    document.querySelectorAll(".lesson-item").forEach(item => {
        item.addEventListener("click", () => {
            loadVideo(item.dataset.videoId, item);
        });
    });
}

function renderEmptyLessons() {
    document.getElementById("lessonList").innerHTML = `<li class="list-group-item text-muted">Уроки отсутствуют</li>`;
}

function renderMaterials(materials) {
    const container = document.getElementById("materialsList");
    container.innerHTML = "";

    if (materials.length === 0) {
        renderEmptyMaterials();
        return;
    }

    materials.forEach(m => {
        const hasLink = m.link && m.link !== "#";
        container.insertAdjacentHTML("beforeend", `
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <div class="fw-semibold">${m.title}</div>
                ${hasLink
                ? `<a href="${m.link}" target="_blank" class="btn btn-sm btn-outline-custom">Открыть</a>`
                : `<button class="btn btn-sm btn-outline-custom" disabled>Нет ссылки</button>`
            }
            </div>
        `);
    });
}

function renderEmptyMaterials() {
    document.getElementById("materialsList").innerHTML = `<div class="list-group-item text-muted">Материалы отсутствуют</div>`;
}

function renderTasks(tasks) {
    const container = document.getElementById("tasksList");
    container.innerHTML = "";

    if (tasks.length === 0) {
        renderEmptyTasks();
        return;
    }

    tasks.forEach((task, i) => {
        const title = typeof task === "string" ? task : task.title || "Задание";
        const deadline = typeof task === "object" && task.deadline ? task.deadline : "Без дедлайна";
        container.insertAdjacentHTML("beforeend", `
            <div class="card border-0 bg-light mb-3">
                <div class="card-body">
                    <h6 class="fw-bold">Задание ${i + 1}</h6>
                    <p class="mb-2">${title}</p>
                    <p class="text-muted small mb-0">Срок: ${deadline}</p>
                </div>
            </div>
        `);
    });
}

function renderEmptyTasks() {
    document.getElementById("tasksList").innerHTML = `<div class="text-muted">Задания отсутствуют</div>`;
}

function loadFirstLessonVideo(lessons) {
    if (!lessons || !lessons[0]?.videoId) return;
    loadVideo(lessons[0].videoId);
}

function loadVideo(videoId, activeItem = null) {
    const iframe = document.querySelector("#videoPlayer iframe");
    if (!iframe || !videoId) return;

    const cleanId = extractYouTubeId(videoId);
    iframe.src = `https://www.youtube.com/embed/${cleanId}?autoplay=1&rel=0`;

    if (activeItem) {
        document.querySelectorAll(".lesson-item").forEach(item => {
            item.classList.remove("active");
            const small = item.querySelector("small");
            if (small) {
                small.classList.remove("text-white");
                small.classList.add("text-muted");
            }
        });

        activeItem.classList.add("active");
        const small = activeItem.querySelector("small");
        if (small) {
            small.classList.remove("text-muted");
            small.classList.add("text-white");
        }
    }
}