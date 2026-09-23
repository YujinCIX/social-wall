const registerForm =
    document.getElementById("register-form");

const loginForm =
    document.getElementById("login-form");

const messageElement =
    document.getElementById("message");

document.addEventListener(
    "localizationReady",
    () => {
        setupAuthForms();
    }
);

function setupAuthForms() {

    if (registerForm) {
        registerForm.addEventListener(
            "submit",
            register
        );
    }

    if (loginForm) {
        loginForm.addEventListener(
            "submit",
            login
        );
    }
}

async function register(event) {

    event.preventDefault();

    const username =
        document
            .getElementById("username")
            .value
            .trim();

    const email =
        document
            .getElementById("email")
            .value
            .trim();

    const password =
        document
            .getElementById("password")
            .value;

    showMessage("", false);

    try {

        const response =
            await fetch(
                "/api/auth/register",
                {
                    method: "POST",
                    headers:
                        getLocalizedFetchHeaders({
                            "Content-Type":
                                "application/json"
                        }),
                    body: JSON.stringify({
                        username,
                        email,
                        password
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            showMessage(
                getErrorMessage(data),
                true
            );

            return;
        }

        showMessage(
            getTranslation(
                "auth.registrationSuccess"
            ),
            false
        );

        setTimeout(() => {
            window.location.href =
                "/login.html";
        }, 800);

    } catch (error) {

        showMessage(
            getTranslation("error.server"),
            true
        );
    }
}

async function login(event) {

    event.preventDefault();

    const username =
        document
            .getElementById("username")
            .value
            .trim();

    const password =
        document
            .getElementById("password")
            .value;

    showMessage("", false);

    try {

        const response =
            await fetch(
                "/api/auth/login",
                {
                    method: "POST",
                    headers:
                        getLocalizedFetchHeaders({
                            "Content-Type":
                                "application/json"
                        }),
                    body: JSON.stringify({
                        username,
                        password
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            showMessage(
                getErrorMessage(data),
                true
            );

            return;
        }

        window.location.href =
            "/index.html";

    } catch (error) {

        showMessage(
            getTranslation("error.server"),
            true
        );
    }
}

function showMessage(
    message,
    isError
) {

    if (!messageElement) {
        return;
    }

    messageElement.textContent =
        message;

    messageElement.className =
        "message";

    if (isError) {

        messageElement.classList.add(
            "error-message"
        );

    } else if (message) {

        messageElement.classList.add(
            "success-message"
        );
    }
}

function getErrorMessage(data) {

    if (data.message) {

        return translateBackendMessage(
            data.message
        );
    }

    const firstError =
        Object.values(data)[0];

    return firstError
        ? translateBackendMessage(firstError)
        : getTranslation(
            "error.requestFailed"
        );
}