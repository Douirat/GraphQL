export function save(key, value) {
    localStorage.setItem(key, value);
}

export function get(key) {
    return localStorage.getItem(key);
}

export function remove(key) {
    localStorage.removeItem(key);
}

export function clear_all() {
    localStorage.clear();
}
