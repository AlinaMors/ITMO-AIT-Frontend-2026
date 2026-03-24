document.addEventListener("DOMContentLoaded", initTeacherPage);

async function initTeacherPage() {
    if (!requireTeacher()) return;

    const user = getUser();
    initForms();

    document.getElementById("teacherCoursesList").innerHTML = `
        <tr><td colspan="4" class="text-center py-4">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 mb-0">Загрузка курсов...</p>
        </td></tr>`;

    try {
        const [allCourses, allEnrollments] = await Promise.all([
            getCourses(),
            getEnrollments()
        ]);

        const userIdStr = String(user.id);
        const myCourses = allCourses.filter(c => String(c.teacherId) === userIdStr);

        fillTeacherStats(myCourses, allEnrollments);
        renderTeacherCourses(myCourses, allEnrollments);
        fillCourseSelects(myCourses);
    } catch (err) {
        console.error(err);
        renderTeacherError();
    }
}

function fillTeacherStats(courses, enrollments) {
    const courseIds = courses.map(c => c.id);
    const studentIds = new Set();
    enrollments.forEach(e => {
        if (courseIds.includes(e.courseId)) studentIds.add(e.userId);
    });

    document.getElementById("teacherCoursesCount").textContent = courses.length;
    document.getElementById("teacherStudentsCount").textContent = studentIds.size;
    document.getElementById("teacherActiveCoursesCount").textContent = courses.length;
}

function renderTeacherCourses(courses, enrollments) {
    const container = document.getElementById("teacherCoursesList");
    container.innerHTML = "";

    if (courses.length === 0) {
        container.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">У вас пока нет курсов</td></tr>`;
        return;
    }

    courses.forEach(course => {
        const studentsCount = enrollments.filter(e => e.courseId === course.id).length;
        container.insertAdjacentHTML("beforeend", `
            <tr>
                <td>
                    <div class="fw-semibold">${course.title}</div>
                    <div class="small text-muted">${course.subject || "—"}</div>
                </td>
                <td>${studentsCount}</td>
                <td><span class="badge text-bg-success">Активный</span></td>
                <td>
                    <button onclick="openEditModal(${course.id})" class="btn btn-sm btn-outline-custom me-2">Изменить</button>
                    <a href="course.html?id=${course.id}" class="btn btn-sm btn-outline-custom">Открыть</a>
                </td>
            </tr>
        `);
    });
}

function fillCourseSelects(courses) {
    fillSelect(document.getElementById("materialCourseSelect"), courses);
    fillSelect(document.getElementById("lessonCourseSelect"), courses);
}

function fillSelect(select, courses) {
    if (!select) return;
    select.innerHTML = `<option value="">Выберите курс</option>`;
    courses.forEach(c => {
        select.insertAdjacentHTML("beforeend", `<option value="${c.id}">${c.title}</option>`);
    });
}

function renderTeacherError() {
    document.getElementById("teacherCoursesCount").textContent = "0";
    document.getElementById("teacherStudentsCount").textContent = "0";
    document.getElementById("teacherActiveCoursesCount").textContent = "0";

    const container = document.getElementById("teacherCoursesList");
    container.innerHTML = `
        <tr><td colspan="4" class="text-center text-danger py-4">
            Не удалось загрузить данные<br>
            <button onclick="location.reload()" class="btn btn-sm btn-outline-primary mt-2">Повторить</button>
        </td></tr>`;
}

function initForms() {
    const courseForm = document.getElementById("createCourseForm");
    courseForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const title = document.getElementById("newCourseTitle").value.trim();
        const subject = document.getElementById("newCourseSubject").value.trim();
        const desc = document.getElementById("newCourseDesc").value.trim();

        if (title.length < 5) return alert("Название курса должно быть не короче 5 символов");
        if (!subject) return alert("Укажите предмет");
        if (desc.length < 15) return alert("Описание должно быть не короче 15 символов");

        const user = getUser();
        const courseData = {
            title, subject, level: document.getElementById("newCourseLevel").value,
            price: Number(document.getElementById("newCoursePrice").value) || 0,
            desc, teacherId: user.id, userId: user.id,
            lessons: [], materials: [], tasks: []
        };

        try {
            await createCourse(courseData);
            alert("✅ Курс успешно создан!");
            location.reload();
        } catch (err) {
            alert("Ошибка создания: " + err.message);
        }
    });

    const editForm = document.getElementById("editCourseForm");
    editForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const title = document.getElementById("editCourseTitle").value.trim();
        const desc = document.getElementById("editCourseDesc").value.trim();

        if (title.length < 5) return alert("Название должно быть не короче 5 символов");
        if (desc.length < 15) return alert("Описание должно быть не короче 15 символов");

        const courseId = document.getElementById("editCourseId").value;
        const original = JSON.parse(editForm.dataset.originalData || "{}");

        const courseData = {
            ...original,
            id: Number(courseId),
            title,
            subject: document.getElementById("editCourseSubject").value,
            level: document.getElementById("editCourseLevel").value,
            price: Number(document.getElementById("editCoursePrice").value) || 0,
            desc
        };

        try {
            await updateCourse(courseId, courseData);
            alert("✅ Курс обновлён!");
            location.reload();
        } catch (err) {
            alert("Ошибка обновления: " + err.message);
        }
    });

    // === Добавление урока ===
    const lessonForm = document.getElementById("addLessonForm");
    lessonForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const courseId = document.getElementById("lessonCourseSelect").value;
        if (!courseId) return alert("Выберите курс");

        const title = document.getElementById("lessonTitle").value.trim();
        const duration = document.getElementById("lessonDuration").value.trim();
        const videoInput = document.getElementById("lessonVideoId").value.trim();

        if (!title || title.length < 3) return alert("Введите название урока");
        if (!duration) return alert("Укажите длительность");
        if (!videoInput) return alert("Укажите YouTube ссылку или ID");

        const finalVideoId = extractYouTubeId(videoInput);

        try {
            const course = await getCourseById(courseId);
            const newLesson = { title, duration, videoId: finalVideoId };

            const updated = { ...course, lessons: [...(course.lessons || []), newLesson] };
            await updateCourse(courseId, updated);

            alert("✅ Урок добавлен!");
            lessonForm.reset();
            location.reload();
        } catch (err) {
            alert("Ошибка: " + err.message);
        }
    });

    const materialForm = document.getElementById("uploadMaterialForm");
    materialForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const courseId = document.getElementById("materialCourseSelect").value;
        if (!courseId) return alert("Выберите курс");

        const title = document.getElementById("materialTitle").value.trim();
        const link = document.getElementById("materialLink").value.trim();

        if (!title) return alert("Введите название материала");
        if (!link) return alert("Введите ссылку");

        try {
            const course = await getCourseById(courseId);
            const newMaterial = { title, link };

            const updated = { ...course, materials: [...(course.materials || []), newMaterial] };
            await updateCourse(courseId, updated);

            alert("✅ Материал добавлен!");
            materialForm.reset();
            location.reload();
        } catch (err) {
            alert("Ошибка: " + err.message);
        }
    });
}

async function openEditModal(courseId) {
    try {
        const course = await getCourseById(courseId);
        document.getElementById("editCourseId").value = course.id;
        document.getElementById("editCourseTitle").value = course.title;
        document.getElementById("editCourseSubject").value = course.subject || "";
        document.getElementById("editCourseLevel").value = course.level || "";
        document.getElementById("editCoursePrice").value = course.price || 0;
        document.getElementById("editCourseDesc").value = course.desc || "";

        document.getElementById("editCourseForm").dataset.originalData = JSON.stringify({
            teacherId: course.teacherId,
            lessons: course.lessons || [],
            materials: course.materials || [],
            tasks: course.tasks || []
        });

        new bootstrap.Modal(document.getElementById('editCourseModal')).show();
    } catch (err) {
        alert("Ошибка загрузки курса: " + err.message);
    }
}