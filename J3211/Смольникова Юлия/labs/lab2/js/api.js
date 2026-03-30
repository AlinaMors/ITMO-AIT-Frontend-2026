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
        const response = await fetch(url, { ...options, headers });
        if (response.status === 204) return null;
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
            totalCount: response.headers.get("x-total-count")
        };
    } catch (err) {
        console.error("API Error:", err);
        throw err;
    }
}

export async function loginUser(credentials) {
    const result = await apiRequest("/login", { method: "POST", body: JSON.stringify(credentials) });
    return result.data;
}

export async function registerUser(userData) {
    const result = await apiRequest("/register", { method: "POST", body: JSON.stringify(userData) });
    return result.data;
}

export async function getCourses(page = 1, limit = 6, filters = {}) {
    const queryParams = { _page: page, _limit: limit, ...filters };
    const result = await apiRequest("/courses", {}, queryParams);
    return { courses: result.data, total: result.totalCount };
}

export async function getCourseById(id) {
    const result = await apiRequest(`/courses/${id}`);
    return result.data;
}

export async function createCourse(courseData) {
    const result = await apiRequest("/courses", { method: "POST", body: JSON.stringify(courseData) });
    return result.data;
}

export async function updateCourse(id, courseData) {
    const result = await apiRequest(`/courses/${id}`, { method: "PUT", body: JSON.stringify(courseData) });
    return result.data;
}

export async function getUserCourses(userId) {
    const result = await apiRequest(`/enrollments?userId=${userId}&_expand=course`);
    return result.data;
}

export async function enrollCourse(enrollment) {
    const result = await apiRequest("/enrollments", { method: "POST", body: JSON.stringify(enrollment) });
    return result.data;
}

export async function isAlreadyEnrolled(userId, courseId) {
    const result = await apiRequest(`/enrollments?userId=${userId}&courseId=${courseId}`);
    return result.data && result.data.length > 0;
}