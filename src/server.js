const express = require("express");
const { validateCredentials } = require("./validateCredentials");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// "Псевдо-БД" в памяти: занятые логины
const takenLogins = new Set(["admin", "taken_user", "user123"]);

// Адаптер БД под контракт из ЛР2
const db = {
    async isLoginTaken(login) {
        return takenLogins.has(login);
    },
};

// 1) Health-check для chaining
app.get("/api/status", (req, res) => {
    res.status(200).json({ status: "online", timestamp: new Date().toISOString() });
});

// 2) Вариант 9 — проверка доступности логина
app.get("/api/auth/check-login", async (req, res) => {
    const name = (req.query.name || "").toString().trim();

    if (!name) {
        return res.status(400).json({ status: "error", message: "Параметр name обязателен" });
    }

    const available = !takenLogins.has(name);
    return res.status(200).json({ status: "success", login: name, available });
});

// 3) Вариант 9 — регистрация
app.post("/api/auth/register", async (req, res) => {
    const { login, password } = req.body || {};

    // Используем твою функцию из ЛР2 (там уже есть все проверки)
    const result = await validateCredentials(login, password, db);

    if (!result.ok) {
        // Конфликт логина по требованию ЛР3 — 409
        if (result.error === "Логин уже занят") {
            return res.status(409).json({ status: "error", message: result.error });
        }
        // Остальные ошибки валидации — 400
        return res.status(400).json({ status: "error", message: result.error });
    }

    // Считаем, что зарегистрировали => логин становится занят
    takenLogins.add(login.trim());

    return res.status(201).json({ status: "success", login: login.trim() });
});

app.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`);
});