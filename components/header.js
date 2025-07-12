import { logout_user } from "../controllers/auth.js";

export function render_header(parentId = "main_container") {
    const container = document.getElementById(parentId);

    const template = document.createElement("template");
    template.innerHTML = `
        <header class="app-header">
            <h1>GraphQL</h1>
            <button class="logout-button">Logout</button>
        </header>
    `.trim();

    const header = template.content.firstElementChild;
    const logoutBtn = header.querySelector(".logout-button");
    logoutBtn.addEventListener("click", logout_user);
    container.prepend(header);
}
