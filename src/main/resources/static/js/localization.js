const SUPPORTED_LOCALES = ["en", "ru"];
const DEFAULT_LOCALE = "en";
const LOCALE_STORAGE_KEY = "social-wall-locale";

let currentLocale = DEFAULT_LOCALE;
let translations = {};

window.localizationReady =
    initializeLocalization();

async function initializeLocalization() {

    const savedLocale =
        localStorage.getItem(
            LOCALE_STORAGE_KEY
        );

    const browserLocale =
        navigator.language
            .toLowerCase()
            .startsWith("ru")
            ? "ru"
            : DEFAULT_LOCALE;

    currentLocale =
        SUPPORTED_LOCALES.includes(savedLocale)
            ? savedLocale
            : browserLocale;

    try {

        await loadTranslations(
            currentLocale
        );

    } catch (error) {

        console.error(
            "Failed to load selected language.",
            error
        );

        currentLocale =
            DEFAULT_LOCALE;

        await loadTranslations(
            DEFAULT_LOCALE
        );
    }

    document.documentElement.lang =
        currentLocale;

    applyTranslations();
    createLanguageSwitcher();

    return true;
}

async function loadTranslations(locale) {

    const response =
        await fetch(
            `/locales/${locale}.json`,
            {
                cache: "no-store",
                credentials: "same-origin"
            }
        );

    if (!response.ok) {

        throw new Error(
            `Failed to load translations: ${locale}`
        );
    }

    translations =
        await response.json();
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

function applyTranslations() {

    document
        .querySelectorAll("[data-i18n]")
        .forEach(element => {

            const translation =
                getTranslation(
                    element.dataset.i18n
                );

            if (translation !== undefined) {
                element.textContent =
                    translation;
            }
        });

    document
        .querySelectorAll(
            "[data-i18n-placeholder]"
        )
        .forEach(element => {

            const translation =
                getTranslation(
                    element.dataset
                        .i18nPlaceholder
                );

            if (translation !== undefined) {
                element.placeholder =
                    translation;
            }
        });

    document.documentElement.lang =
        currentLocale;
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
        "Accept-Language":
            getLocaleCode(),
        ...headers
    };
}

async function setLocale(locale) {

    if (
        !SUPPORTED_LOCALES.includes(
            locale
        )
    ) {
        return;
    }

    if (locale === currentLocale) {
        return;
    }

    try {

        await loadTranslations(locale);

        currentLocale =
            locale;

        localStorage.setItem(
            LOCALE_STORAGE_KEY,
            locale
        );

        document.documentElement.lang =
            currentLocale;

        applyTranslations();
        createLanguageSwitcher();

        document.dispatchEvent(
            new CustomEvent(
                "localeChanged"
            )
        );

    } catch (error) {

        console.error(
            "Failed to change language.",
            error
        );
    }
}

function createLanguageSwitcher() {

    const switcher =
        document.getElementById(
            "language-switcher"
        );

    if (!switcher) {
        return;
    }

    switcher.innerHTML = "";

    const englishButton =
        createLanguageButton(
            "EN",
            "en"
        );

    const russianButton =
        createLanguageButton(
            "RU",
            "ru"
        );

    switcher.appendChild(
        englishButton
    );

    switcher.appendChild(
        russianButton
    );
}

function createLanguageButton(
    text,
    locale
) {

    const button =
        document.createElement(
            "button"
        );

    button.type = "button";

    button.className =
        "language-button";

    button.textContent =
        text;

    if (
        locale === currentLocale
    ) {

        button.classList.add(
            "active"
        );
    }

    button.addEventListener(
        "click",
        () => setLocale(locale)
    );

    return button;
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

        "Публикация должна содержать текст или изображение":
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