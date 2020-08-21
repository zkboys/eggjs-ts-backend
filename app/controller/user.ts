import { Controller } from 'egg';

export default class UserController extends Controller {
  // 退出登录接口
  async logout(ctx) {
    ctx.logout();
    ctx.success(true);
  }

  // 用户注册
  async register(ctx) {
    const User = ctx.model.User;
    const requestBody = ctx.request.body;

    ctx.validate({
      username: 'string',
      email: 'string',
      password: 'string',
    }, requestBody);

    const { password, username, email } = requestBody;

    const foundUser = await User.findOne({ where: { username } });
    if (foundUser) return ctx.fail('此用户名已存在');

    const foundEmail = await User.findOne({ where: { email } });
    if (foundEmail) return ctx.fail('此邮箱已注册');

    const ePassword = ctx.service.user.encryptPassword(password);

    const savedUser = await User.create({ username, password: ePassword, email });
    return ctx.success(savedUser);
  }

  // 登录验证回调
  async loginCallback() {
    const { ctx } = this;

    if (ctx.isAuthenticated()) return ctx.success(ctx.user);

    return ctx.fail('用户名或密码错误！');
  }

  // 获取所有用户
  async getAll(ctx) {
    const { User } = ctx.model;

    const results = await User.findAll();

    ctx.success(results);
  }

  // 获取用户详情
  async getById(ctx) {
    ctx.validate({
      id: 'string',
    }, ctx.params);

    const { id } = ctx.params;

    const { User } = ctx.model;

    const result = await User.findByPk(id);

    ctx.success(result);
  }

  // 更新用户
  async update(ctx) {
    const currentUser = ctx.user;

    if (currentUser.permission !== 'admin') return ctx.fail('您无权进行此操作！');

    ctx.validate({
      id: 'string',
    }, ctx.params);
    ctx.validate({
      username: 'string',
      password: 'string?',
      email: 'string',
      permission: 'string?',
    }, ctx.request.body);

    const { username, password, email, permission } = ctx.request.body;

    const { id } = ctx.params;

    const { User } = ctx.model;

    const user = await User.findByPk(id);
    if (!user) return ctx.fail('用户不存在或已删除！');

    const exitName = await User.findOne({ where: { username } });
    if (exitName && exitName.id !== +id) return ctx.fail('此用户名已被占用！');

    const exitEmail = await User.findOne({ where: { email } });
    if (exitEmail && exitEmail.id !== +id) return ctx.fail('此邮箱已被占用！');

    const userData = {
      username,
      email,
      permission,
      password: undefined,
    };
    if (password) {
      userData.password = ctx.service.user.encryptPassword(password);
    }

    const result = await user.update(userData);

    ctx.success(result);
  }

  // 删除用户
  async del(ctx) {
    const currentUser = ctx.user;

    if (currentUser.permission !== 'admin') return ctx.fail('您无权进行此操作！');

    ctx.validate({
      id: 'string',
    }, ctx.params);

    const { id } = ctx.params;

    const { User } = ctx.model;

    const result = await User.destroy({ where: { id } });

    ctx.success(result);
  }

  // 修改密码
  async updatePassword(ctx) {
    ctx.validate({
      oldPassword: 'string',
      password: 'string?',
    }, ctx.request.body);

    const { oldPassword, password } = ctx.request.body;

    const currentUser = ctx.user;

    const isSame = ctx.service.user.comparePassword(oldPassword, currentUser.password);

    if (!isSame) return ctx.fail('原密码输入错误！');

    const hashPassword = ctx.service.user.encryptPassword(password);

    await currentUser.update({ password: hashPassword });

    ctx.success(true);
  }
}
