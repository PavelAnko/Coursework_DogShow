const db = require('../models/DataBase');
const bcrypt = require('bcrypt');

const AuthService = {
  authenticateOwner:  async ({ name, phone_number, password }) => {
    const result = await db.query(
      `SELECT id, name, surname, password FROM owners WHERE phone_number = $1`,
      [phone_number]
    );

    if (result.rows.length === 0) {
      throw new Error('Користувача з таким номером не знайдено');
    }

    const owner = result.rows[0];

    if (owner.name !== name) {
      throw new Error('Неправильне ім’я');
    }

    const isPasswordValid = await bcrypt.compare(password, owner.password);
    if (!isPasswordValid) {
      throw new Error('Невірний пароль');
    }

    return {
      id: owner.id,
      name: owner.name,
      surname: owner.surname
    };
  }
};

module.exports = AuthService;