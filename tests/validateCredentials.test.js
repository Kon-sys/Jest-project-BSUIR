const { validateCredentials } = require("../src/validateCredentials");

describe("validateCredentials (вариант 9: проверка уникальности логина)", () => {
    let db;

    beforeEach(() => {
        db = {
            isLoginTaken: jest.fn()
        };
    });

    test("Позитивный сценарий: корректный логин и пароль + логин не занят", async () => {
        db.isLoginTaken.mockResolvedValue(false);

        const result = await validateCredentials("alex_user", "Passw0rd!", db);

        expect(result).toEqual({ ok: true });
        expect(db.isLoginTaken).toHaveBeenCalledTimes(1);
        expect(db.isLoginTaken).toHaveBeenCalledWith("alex_user");
    });

    test("Сложный: валидный пароль, но логин уже занят", async () => {
        db.isLoginTaken.mockResolvedValue(true);

        const result = await validateCredentials("taken_user", "Passw0rd!", db);

        expect(result.ok).toBe(false);
        expect(result.error).toBe("Логин уже занят");
        expect(db.isLoginTaken).toHaveBeenCalledTimes(1);
    });

    test("Негативный: пароль без цифр (БД не вызываем)", async () => {
        const result = await validateCredentials("validLogin", "Password!", db);

        expect(result.ok).toBe(false);
        expect(result.error).toBe("Пароль должен содержать хотя бы одну цифру");
        expect(db.isLoginTaken).not.toHaveBeenCalled();
    });

    test("Негативный: пароль без спецсимволов (БД не вызываем)", async () => {
        const result = await validateCredentials("validLogin", "Password1", db);

        expect(result.ok).toBe(false);
        expect(result.error).toBe("Пароль должен содержать хотя бы один спецсимвол");
        expect(db.isLoginTaken).not.toHaveBeenCalled();
    });

    test("Негативный: слишком короткий логин (БД не вызываем)", async () => {
        const result = await validateCredentials("a12", "Passw0rd!", db);

        expect(result.ok).toBe(false);
        expect(result.error).toBe("Логин слишком короткий");
        expect(db.isLoginTaken).not.toHaveBeenCalled();
    });

    test("Негативный: пустые строки (БД не вызываем)", async () => {
        const result = await validateCredentials("", "", db);

        expect(result.ok).toBe(false);
        expect(result.error).toBe("Логин и пароль не должны быть пустыми");
        expect(db.isLoginTaken).not.toHaveBeenCalled();
    });

    test("Негативный: строки из пробелов (БД не вызываем)", async () => {
        const result = await validateCredentials("     ", "        ", db);

        expect(result.ok).toBe(false);
        expect(result.error).toBe("Логин и пароль не должны быть пустыми");
        expect(db.isLoginTaken).not.toHaveBeenCalled();
    });

    test("Граничные значения: логин ровно 5, пароль ровно 8 и валидный + логин не занят", async () => {
        db.isLoginTaken.mockResolvedValue(false);

        // login length = 5
        // password length = 8, includes digit and special char
        const result = await validateCredentials("abcde", "a1b2c3!@", db);

        expect(result).toEqual({ ok: true });
        expect(db.isLoginTaken).toHaveBeenCalledTimes(1);
        expect(db.isLoginTaken).toHaveBeenCalledWith("abcde");
    });

    test("Граничные значения: пароль 7 символов (короткий) — БД не вызываем", async () => {
        const result = await validateCredentials("validLogin", "a1b!c2d", db);

        expect(result.ok).toBe(false);
        expect(result.error).toBe("Пароль слишком короткий");
        expect(db.isLoginTaken).not.toHaveBeenCalled();
    });

    test("Граничные значения: null/undefined как вход — БД не вызываем", async () => {
        const r1 = await validateCredentials(null, "Passw0rd!", db);
        const r2 = await validateCredentials("validLogin", undefined, db);

        expect(r1.ok).toBe(false);
        expect(r2.ok).toBe(false);
        expect(db.isLoginTaken).not.toHaveBeenCalled();
    });
});
