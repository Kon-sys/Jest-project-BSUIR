async function validateCredentials(login, password, db) {

    // Проверка типов
    if (typeof login !== "string" || typeof password !== "string") {
        return { ok: false, error: "Логин и пароль должны быть строками" };
    }

    const l = login.trim();
    const p = password.trim();

    // Пустые строки
    if (!l || !p) {
        return { ok: false, error: "Логин и пароль не должны быть пустыми" };
    }

    // Логин: минимум 5 символов
    if (l.length < 5) {
        return { ok: false, error: "Логин слишком короткий" };
    }

    // Пароль: минимум 8 символов
    if (p.length < 8) {
        return { ok: false, error: "Пароль слишком короткий" };
    }

    // Пароль должен содержать цифру
    if (!/\d/.test(p)) {
        return { ok: false, error: "Пароль должен содержать хотя бы одну цифру" };
    }

    // Пароль должен содержать спецсимвол
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p)) {
        return { ok: false, error: "Пароль должен содержать хотя бы один спецсимвол" };
    }

    // Проверяем уникальность логина через БД.
    if (!db || typeof db.isLoginTaken !== "function") {
        return { ok: false, error: "Не передан корректный адаптер БД" };
    }

    const taken = await db.isLoginTaken(l);
    if (taken) {
        return { ok: false, error: "Логин уже занят" };
    }

    return { ok: true };
}

module.exports = { validateCredentials };
