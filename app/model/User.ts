import { Application } from 'egg';

export default (app: Application) => {
  const { STRING, INTEGER } = app.Sequelize;

  const User = app.model.define('user', {
    id: { type: INTEGER, unique: true, primaryKey: true, autoIncrement: true },
    username: STRING(20),
    password: STRING(100),
    email: STRING(100),
    permission: STRING(100),
  });

  // User.sync({ force: true });

  return User;
};
