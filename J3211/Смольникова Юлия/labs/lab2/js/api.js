const API_URL = "http://localhost:3000";

async function apiRequest(path, options = {}, queryParams = {}) {
    const token = localStorage.getItem("learnify_token");

    const headers = {
        ...(options.body && !(options.body instanceof FormData) && { "Content-Type": "application/json" }),
        ...(token && { "Authorization": `Bearer ${token}` }),
        ...(options.headers || {})
    };

    const url = new URL(`${API_URL}${path}`);
    Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));

    try {
        const response = await fetch(url, {
            ...options,
            headers
        });

        if (response.status === 204) {
            return null;
        }

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem("learnify_token");
                localStorage.removeItem("learnify_user");
                window.location.href = "login.html";
            }
            throw new Error(data?.message || `Ошибка ${response.status}`);
        }

        return {
            data,
            totalCount: response.headers.get('x-total-count')
        };
    } catch (err) {
        console.error("API Error:", err);
        throw err;
    }
}

async function getCourses(page = 1, limit = 100) {
    const result = await apiRequest("/courses", {}, { _page: page, _limit: limit });
    return {
        courses: result.data,
        total: result.totalCount
    };
}

async function getCourseById(id) {
    const result = await apiRequest(`/courses/${id}`);
    return result.data;
}

async function loginUser(credentials) {
    const result = await apiRequest("/login", { method: "POST", body: JSON.stringify(credentials) });
    return result.data;
}

async function registerUser(userData) {
    const result = await apiRequest("/register", { method: "POST", body: JSON.stringify(userData) });
    return result.data;
}

async function getUserCourses(userId) {
    const result = await apiRequest(`/enrollments?userId=${userId}&_expand=course`);
    return result.data;
}

async function enrollCourse(enrollment) {
    const result = await apiRequest("/enrollments", { method: "POST", body: JSON.stringify(enrollment) });
    return result.data;
}

async function createCourse(courseData) {
    const result = await apiRequest("/courses", { method: "POST", body: JSON.stringify(courseData) });
    return result.data;
}

async function updateCourse(id, courseData) {
    const result = await apiRequest(`/courses/${id}`, { method: "PUT", body: JSON.stringify(courseData) });
    return result.data;
}

async function getEnrollments() {
    const result = await apiRequest("/enrollments");
    return result.data;
}

async function isAlreadyEnrolled(userId, courseId) {
    const result = await apiRequest(`/enrollments?userId=${userId}&courseId=${courseId}`);
    return result.data && result.data.length > 0;
}

function extractYouTubeId(url) {
    if (!url) return "";
    if (!url.includes("http") && !url.includes(".")) return url;

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
}

window.extractYouTubeId = extractYouTubeId;