import { handle_login } from "../controllers/auth.js";

export function render_login_form() {
    let container = document.getElementById("main_container");
    container.innerHTML = `
    <header class="app-header"><h1>GraphQL</h1></header>
          <div class="login-wrapper">
            <div class="login-container">
                <h2 class="login-title">Welcome Back</h2>
                <form id="login_form" class="login-form">
                    <div class="input-group">
                        <input 
                            id="identifier" 
                            type="text" 
                            placeholder="Enter your email or username..." 
                            required
                            class="form-input"
                        >
                    </div>
                    <div class="input-group">
                        <input 
                            id="password" 
                            type="password" 
                            placeholder="Enter your password" 
                            required
                            class="form-input"
                        >
                    </div>
                    <button type="submit" class="submit-btn">Sign In</button>
                </form>
            </div>
        </div>
    `;
    handle_login();
}
