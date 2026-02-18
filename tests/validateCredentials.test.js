import { validateCredentials } from "../src/validateCredentials";

describe("validateCredentials", () => {
    test("Позитивный сценарий: корректный логин и пароль", () => {
        const r = validateCredentials("admin1", "Passw0rd!");
        expect(r.ok).toBe(true);
        expect(r.errors).toEqual({});
    });

    test("Негативный: пароль без цифр", () => {
        const r = validateCredentials("admin1", "Password!");
        expect(r.ok).toBe(false);
        expect(r.errors.password).toBe("Пароль должен содержать хотя бы одну цифру.");
    });

    test("Негативный: пароль без спецсимволов", () => {
        const r = validateCredentials("admin1", "Password1");
        expect(r.ok).toBe(false);
        expect(r.errors.password).toBe("Пароль должен содержать хотя бы один спецсимвол.");
    });

    test("Негативный: слишком короткий логин", () => {
        const r = validateCredentials("adm", "Passw0rd!");
        expect(r.ok).toBe(false);
        expect(r.errors.login).toBe("Логин должен быть не короче 5 символов.");
    });

    test("Негативный: пустые строки", () => {
        const r = validateCredentials("", "");
        expect(r.ok).toBe(false);
        expect(r.errors.login).toBe("Логин не может быть пустым или состоять только из пробелов.");
        expect(r.errors.password).toBe("Пароль не может быть пустым или состоять только из пробелов.");
    });

    test("Негативный: строки из пробелов", () => {
        const r = validateCredentials("     ", "        ");
        expect(r.ok).toBe(false);
        expect(r.errors.login).toBe("Логин не может быть пустым или состоять только из пробелов.");
        expect(r.errors.password).toBe("Пароль не может быть пустым или состоять только из пробелов.");
    });

    test("Граничные значения: логин ровно 5, пароль ровно 8 и валидный", () => {
        const r = validateCredentials("abcde", "a1!bcdef"); // 8 символов
        expect(r.ok).toBe(true);
    });

    test("Граничные значения: пароль 7 символов (короткий)", () => {
        const r = validateCredentials("admin1", "a1!bcde"); // 7
        expect(r.ok).toBe(false);
        expect(r.errors.password).toBe("Пароль должен быть не короче 8 символов.");
    });

    test("Граничные значения: null/undefined как вход", () => {
        const r = validateCredentials(undefined, null);
        expect(r.ok).toBe(false);
        expect(r.errors.login).toBeTruthy();
        expect(r.errors.password).toBeTruthy();
    });
});