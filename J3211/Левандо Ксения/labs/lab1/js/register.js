const form = document.getElementById("registerForm");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const repeatPassword = document.getElementById("repeatPassword").value;
    const terms = document.getElementById("terms").checked;

    // Checks
    if (!name || !email || !password || !repeatPassword) {
        alert("Please fill all fields");
        return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        alert("Enter a valid email");
        return;
    }

    // Password length validation
    if (password.length < 8) {
      alert("Password cannot be shorted than 8 characters");
      return;
    }

    // Passwords matching
    if (password !== repeatPassword) {
        alert("Passwords do not match");
        return;
    }

    // Terms
    if (!terms) {
        alert("You must accept the terms");
        return;
    }

    // Create a user
    const user = {
        name,
        email,
        password
    };

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // check email unoccupied
    const userExists = users.find(u => u.email === email);

    if (userExists) {
        alert("User with this email already exists");
        return;
    }
    // add user
    users.push(user);

    // Save in localStorage
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful!");

    // Switch to login page
    window.location.href = "login.html";
});