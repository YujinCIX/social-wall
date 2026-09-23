let translations = {};
let currentLocale = "en";

const supportedLocales = ["en", "ru"];

document.addEventListener("DOMContentLoaded", async () => {
    await initializeLocalization();
});

async function initializeLocalization() {

    const savedLocale =
        localStorage.getItem("locale");

    const browserLocale =
        navigator.language
            .toLowerCase()
            .startsWith("ru")
            ? "ru"
            : "en";

    currentLocale =
        supportedLocales.includes(savedLocale)
            ? savedLocale
            : browserLocale;

    await loadTranslations(currentLocale);

    applyTranslations();
    createLanguageSwitcher();

    document.dispatchEvent(
        new CustomEvent("localizationReady")
    );
}

async function loadTranslations(locale) {

    const response =
        await fetch(`/locales/${locale}.json`);

    if (!response.ok) {
        throw new Error(
            `Failed to load ${locale} translations`
        );
    }

    translations =
        await response.json();
}

function applyTranslations() {

    document
        .querySelectorAll("[data-i18n]")
        .forEach(element => {

            const key =
                element.dataset.i18n;

            const translation =
                getTranslation(key);

            if (translation) {
                element.textContent =
                    translation;
            }
        });

    document
        .querySelectorAll("[data-i18n-placeholder]")
        .forEach(element => {

            const key =
                element.dataset.i18nPlaceholder;

            const translation =
                getTranslation(key);

            if (translation) {
                element.placeholder =
                    translation;
            }
        });

    document
        .querySelectorAll("[data-i18n-title]")
        .forEach(element => {

            const key =
                element.dataset.i18nTitle;

            const translation =
                getTranslation(key);

            if (translation) {
                element.title =
                    translation;
            }
        });

    document.documentElement.lang =
        currentLocale;
}

function getTranslation(key) {

    return key
        .split(".")
        .reduce(
            (value, part) =>
                value?.[part],
            translations
        );
}

function translateBackendMessage(message) {

    const messages = {
        "Username is required":
            "error.usernameRequired",

        "Имя пользователя обязательно":
            "error.usernameRequired",

        "Username must contain 3-50 characters":
            "error.usernameLength",

        "Имя пользователя должно содержать от 3 до 50 символов":
            "error.usernameLength",

        "Email is required":
            "error.emailRequired",

        "Email обязателен":
            "error.emailRequired",

        "Invalid email format":
            "error.emailFormat",

        "Некорректный формат email":
            "error.emailFormat",

        "Email is too long":
            "error.emailTooLong",

        "Email слишком длинный":
            "error.emailTooLong",

        "Password is required":
            "error.passwordRequired",

        "Пароль обязателен":
            "error.passwordRequired",

        "Password must contain 8-100 characters":
            "error.passwordLength",

        "Пароль должен содержать от 8 до 100 символов":
            "error.passwordLength",

        "Username already exists":
            "error.usernameExists",

        "Пользователь с таким именем уже существует":
            "error.usernameExists",

        "Email already exists":
            "error.emailExists",

        "Пользователь с таким email уже существует":
            "error.emailExists",

        "Invalid username or password":
            "error.invalidCredentials",

        "Неверное имя пользователя или пароль":
            "error.invalidCredentials",

        "Post must contain text or an image":
            "error.postContent",

        "Пост должен содержать текст или изображение":
            "error.postContent",

        "Image size must not exceed 5 MB":
            "error.imageSize",

        "Размер изображения не должен превышать 5 МБ":
            "error.imageSize",

        "Only JPEG, PNG, GIF and WebP images are allowed":
            "error.imageType",

        "Разрешены только изображения JPEG, PNG, GIF и WebP":
            "error.imageType",

        "User not found":
            "error.userNotFound",

        "Пользователь не найден":
            "error.userNotFound",

        "Failed to save uploaded file":
            "error.upload",

        "Не удалось сохранить загруженный файл":
            "error.upload",

        "Uploaded file is too large":
            "error.uploadTooLarge",

        "Размер загруженного файла слишком большой":
            "error.uploadTooLarge"
    };

    const key =
        messages[message];

    return key
        ? getTranslation(key)
        : message;
}

function getLocaleCode() {
    return currentLocale === "ru"
        ? "ru-RU"
        : "en-US";
}

function getLocalizedFetchHeaders(
    headers = {}
) {
    return {
        "Accept-Language": getLocaleCode(),
        ...headers
    };
}

async function setLocale(locale) {

    if (!supportedLocales.includes(locale)) {
        return;
    }

    currentLocale = locale;

    localStorage.setItem(
        "locale",
        locale
    );

    await loadTranslations(locale);

    applyTranslations();
    createLanguageSwitcher();

    document.dispatchEvent(
        new CustomEvent("localeChanged")
    );
}

function createLanguageSwitcher() {

    let switcher =
        document.getElementById(
            "language-switcher"
        );

    if (!switcher) {
        return;
    }

    switcher.innerHTML = "";

    const englishButton =
        document.createElement("button");

    englishButton.type = "button";
    englishButton.className =
        "language-button";

    englishButton.textContent = "EN";

    englishButton.classList.toggle(
        "active",
        currentLocale === "en"
    );

    englishButton.addEventListener(
        "click",
        () => setLocale("en")
    );

    const russianButton =
        document.createElement("button");

    russianButton.type = "button";
    russianButton.className =
        "language-button";

    russianButton.textContent = "RU";

    russianButton.classList.toggle(
        "active",
        currentLocale === "ru"
    );

    russianButton.addEventListener(
        "click",
        () => setLocale("ru")
    );

    switcher.appendChild(
        englishButton
    );

    switcher.appendChild(
        russianButton
    );
}