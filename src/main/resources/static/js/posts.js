const postsContainer =
    document.getElementById("posts-container");

const postForm =
    document.getElementById("post-form");

const logoutButton =
    document.getElementById("logout-button");

const postMessage =
    document.getElementById("post-message");

const isMyWall =
    window.location.pathname === "/my-wall.html";

document.addEventListener("DOMContentLoaded", () => {

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
});

async function loadPosts() {

    try {

        const endpoint =
            isMyWall
                ? "/api/posts/my"
                : "/api/posts";

        const response =
            await fetch(endpoint);

        if (response.status === 401) {
            window.location.href = "/login.html";
            return;
        }

        if (!response.ok) {
            throw new Error(
                "Failed to load posts"
            );
        }

        const posts =
            await response.json();

        renderPosts(posts);

    } catch (error) {

        if (postsContainer) {
            postsContainer.innerHTML =
                '<p class="error-message">Unable to load posts.</p>';
        }
    }
}

async function createPost(event) {

    event.preventDefault();

    const content =
        document.getElementById(
            "post-content"
        ).value.trim();

    const image =
        document.getElementById(
            "post-image"
        ).files[0];

    if (!content && !image) {
        showPostMessage(
            "Post must contain text or an image.",
            true
        );
        return;
    }

    if (image && image.size > 5 * 1024 * 1024) {
        showPostMessage(
            "Image size must not exceed 5 MB.",
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
                    body: formData
                }
            );

        const data =
            await response.json();

        if (response.status === 401) {
            window.location.href =
                "/login.html";
            return;
        }

        if (!response.ok) {
            showPostMessage(
                data.message ||
                "Failed to create post.",
                true
            );
            return;
        }

        postForm.reset();

        showPostMessage(
            "Post published.",
            false
        );

        await loadPosts();

    } catch (error) {

        showPostMessage(
            "Unable to connect to the server.",
            true
        );
    }
}

async function logout() {

    try {

        const response =
            await fetch(
                "/api/auth/logout",
                {
                    method: "POST"
                }
            );

        if (
            response.ok ||
            response.status === 204
        ) {
            window.location.href =
                "/login.html";
        }

    } catch (error) {

        window.location.href =
            "/login.html";
    }
}

function renderPosts(posts) {

    if (!postsContainer) {
        return;
    }

    postsContainer.innerHTML = "";

    if (posts.length === 0) {

        postsContainer.innerHTML =
            '<p class="empty-message">No posts yet.</p>';

        return;
    }

    posts.forEach(post => {

        const card =
            document.createElement("article");

        card.className = "post-card";

        const header =
            document.createElement("div");

        header.className = "post-header";

        const author =
            document.createElement("span");

        author.className = "post-author";
        author.textContent =
            post.author;

        const date =
            document.createElement("span");

        date.className = "post-date";
        date.textContent =
            formatDate(post.createdAt);

        header.appendChild(author);
        header.appendChild(date);

        card.appendChild(header);

        if (post.content) {

            const content =
                document.createElement("div");

            content.className =
                "post-content";

            content.textContent =
                post.content;

            card.appendChild(content);
        }

        if (post.imageUrl) {

            const image =
                document.createElement("img");

            image.className =
                "post-image";

            image.src =
                post.imageUrl;

            image.alt =
                "Post image";

            image.loading =
                "lazy";

            card.appendChild(image);
        }

        postsContainer.appendChild(card);
    });
}

function formatDate(dateString) {

    const date =
        new Date(dateString);

    return date.toLocaleString();
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