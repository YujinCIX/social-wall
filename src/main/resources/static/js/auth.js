const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const messageElement = document.getElementById("message");

if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username =
            document.getElementById("username").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        showMessage("", false);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                showMessage(
                    getErrorMessage(data),
                    true
                );
                return;
            }

            showMessage(
                "Registration successful. Redirecting to login...",
                false
            );

            setTimeout(() => {
                window.location.href = "/login.html";
            }, 800);

        } catch (error) {
            showMessage(
                "Unable to connect to the server.",
                true
            );
        }
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username =
            document.getElementById("username").value.trim();

        const password =
            document.getElementById("password").value;

        showMessage("", false);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                showMessage(
                    getErrorMessage(data),
                    true
                );
                return;
            }

            window.location.href = "/index.html";

        } catch (error) {
            showMessage(
                "Unable to connect to the server.",
                true
            );
        }
    });
}

function showMessage(message, isError) {

    if (!messageElement) {
        return;
    }

    messageElement.textContent = message;

    messageElement.className = "message";

    if (isError) {
        messageElement.classList.add("error-message");
    } else if (message) {
        messageElement.classList.add("success-message");
    }
}

function getErrorMessage(data) {

    if (data.message) {
        return data.message;
    }

    const firstError = Object.values(data)[0];

    return firstError || "Request failed.";
}