/**
 * Пример "адаптера" БД (в unit-тестах мокается).
 * В реальном проекте тут может быть запрос к SQL/NoSQL.
 */
async function isLoginTaken(login) {
  // Заглушка: по умолчанию ничего не занято
  return false;
}

module.exports = { isLoginTaken };
