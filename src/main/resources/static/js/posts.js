const postsContainer =
    document.getElementById(
        "posts-container"
    );

const postForm =
    document.getElementById(
        "post-form"
    );

const logoutButton =
    document.getElementById(
        "logout-button"
    );

const postMessage =
    document.getElementById(
        "post-message"
    );

const isMyWall =
    window.location.pathname ===
    "/my-wall.html";

window.localizationReady.then(
    () => {

        loadPosts();

        if (logoutButton) {
            logoutButton.addEventListener(
                "click",
                logout
            );
        }

        if (postForm) {
            postForm.addEventListener(
                "submit",
                createPost
            );
        }
    }
);

document.addEventListener(
    "localeChanged",
    () => {

        if (postsContainer) {
            loadPosts();
        }
    }
);

async function loadPosts() {

    try {

        const endpoint =
            isMyWall
                ? "/api/posts/my"
                : "/api/posts";

        const response =
            await fetch(
                endpoint,
                {
                    method: "GET",
                    credentials: "same-origin",
                    headers:
                        getLocalizedFetchHeaders()
                }
            );

        if (response.status === 401) {

            window.location.replace(
                "/login.html"
            );

            return;
        }

        if (!response.ok) {

            throw new Error(
                `Failed to load posts: ${response.status}`
            );
        }

        const posts =
            await response.json();

        renderPosts(posts);

    } catch (error) {

        console.error(
            "Failed to load posts.",
            error
        );

        if (!postsContainer) {
            return;
        }

        postsContainer.innerHTML =
            "";

        const message =
            document.createElement(
                "p"
            );

        message.className =
            "error-message";

        message.textContent =
            getTranslation(
                "error.loadPosts"
            );

        postsContainer.appendChild(
            message
        );
    }
}

async function createPost(event) {

    event.preventDefault();

    const content =
        document
            .getElementById(
                "post-content"
            )
            .value
            .trim();

    const image =
        document
            .getElementById(
                "post-image"
            )
            .files[0];

    if (!content && !image) {

        showPostMessage(
            getTranslation(
                "error.postContent"
            ),
            true
        );

        return;
    }

    if (
        image &&
        image.size >
        5 * 1024 * 1024
    ) {

        showPostMessage(
            getTranslation(
                "error.imageSize"
            ),
            true
        );

        return;
    }

    const formData =
        new FormData();

    if (content) {
        formData.append(
            "content",
            content
        );
    }

    if (image) {
        formData.append(
            "image",
            image
        );
    }

    showPostMessage("", false);

    try {

        const response =
            await fetch(
                "/api/posts",
                {
                    method: "POST",
                    credentials: "same-origin",
                    headers:
                        getLocalizedFetchHeaders(),
                    body: formData
                }
            );

        if (response.status === 401) {

            window.location.replace(
                "/login.html"
            );

            return;
        }

        const data =
            await response.json();

        if (!response.ok) {

            showPostMessage(
                data.message
                    ? translateBackendMessage(
                        data.message
                    )
                    : getTranslation(
                        "error.createPost"
                    ),
                true
            );

            return;
        }

        postForm.reset();

        showPostMessage(
            getTranslation(
                "post.published"
            ),
            false
        );

        await loadPosts();

    } catch (error) {

        console.error(error);

        showPostMessage(
            getTranslation(
                "error.server"
            ),
            true
        );
    }
}

async function logout() {

    if (!logoutButton) {
        return;
    }

    logoutButton.disabled = true;

    try {

        const response =
            await fetch(
                "/api/auth/logout",
                {
                    method: "POST",
                    credentials: "same-origin",
                    headers:
                        getLocalizedFetchHeaders()
                }
            );

        if (
            response.ok ||
            response.status === 204 ||
            response.status === 401
        ) {

            window.location.replace(
                "/login.html"
            );

            return;
        }

        console.error(
            "Logout failed:",
            response.status
        );

        window.location.replace(
            "/login.html"
        );

    } catch (error) {

        console.error(
            "Logout request failed.",
            error
        );

        window.location.replace(
            "/login.html"
        );
    }
}

function renderPosts(posts) {

    if (!postsContainer) {
        return;
    }

    postsContainer.innerHTML =
        "";

    if (posts.length === 0) {

        const message =
            document.createElement(
                "p"
            );

        message.className =
            "empty-message";

        message.textContent =
            getTranslation(
                "post.empty"
            );

        postsContainer.appendChild(
            message
        );

        return;
    }

    posts.forEach(post => {

        const card =
            document.createElement(
                "article"
            );

        card.className =
            "post-card";

        const header =
            document.createElement(
                "div"
            );

        header.className =
            "post-header";

        const author =
            document.createElement(
                "span"
            );

        author.className =
            "post-author";

        author.textContent =
            post.author;

        const date =
            document.createElement(
                "span"
            );

        date.className =
            "post-date";

        date.textContent =
            formatDate(
                post.createdAt
            );

        header.appendChild(
            author
        );

        header.appendChild(
            date
        );

        card.appendChild(
            header
        );

        if (post.content) {

            const content =
                document.createElement(
                    "div"
                );

            content.className =
                "post-content";

            content.textContent =
                post.content;

            card.appendChild(
                content
            );
        }

        if (post.imageUrl) {

            const image =
                document.createElement(
                    "img"
                );

            image.className =
                "post-image";

            image.src =
                post.imageUrl;

            image.alt =
                getTranslation(
                    "post.postImage"
                );

            image.loading =
                "lazy";

            card.appendChild(
                image
            );
        }

        postsContainer.appendChild(
            card
        );
    });
}

function formatDate(dateString) {

    const date =
        new Date(dateString);

    return new Intl.DateTimeFormat(
        getLocaleCode(),
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12:
                getLocaleCode() ===
                "en-US"
        }
    ).format(date);
}

function showPostMessage(
    message,
    isError
) {

    if (!postMessage) {
        return;
    }

    postMessage.textContent =
        message;

    postMessage.className =
        "message";

    if (isError) {

        postMessage.classList.add(
            "error-message"
        );

    } else if (message) {

        postMessage.classList.add(
            "success-message"
        );
    }
}