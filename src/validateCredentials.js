export function validateCredentials(loginRaw, passwordRaw) {
    const errors = {};

    const login = (loginRaw ?? "").trim();
    const password = (passwordRaw ?? "").trim();

    // Пустые/пробельные строки
    if (!login) {
        errors.login = "Логин не может быть пустым или состоять только из пробелов.";
    }
    if (!password) {
        errors.password = "Пароль не может быть пустым или состоять только из пробелов.";
    }

    // Логин: минимум 5
    if (!errors.login && login.length < 5) {
        errors.login = "Логин должен быть не короче 5 символов.";
    }

    // Пароль: минимум 8 + цифра + спецсимвол
    if (!errors.password) {
        if (password.length < 8) {
            errors.password = "Пароль должен быть не короче 8 символов.";
        } else {
            const hasDigit = /\d/.test(password);
            const hasSpecial = /[^\w\s]/.test(password);

            if (!hasDigit && !hasSpecial) {
                errors.password = "Пароль должен содержать хотя бы одну цифру и один спецсимвол.";
            } else if (!hasDigit) {
                errors.password = "Пароль должен содержать хотя бы одну цифру.";
            } else if (!hasSpecial) {
                errors.password = "Пароль должен содержать хотя бы один спецсимвол.";
            }
        }
    }

    return { ok: Object.keys(errors).length === 0, errors };
}