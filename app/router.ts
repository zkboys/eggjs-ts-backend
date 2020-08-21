import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  const { home, user } = controller;

  router.get('/', home.index);

  // 退出登录
  router.post('/api/logout', user.logout);
  // 登录
  router.post('/api/login', app.passport.authenticate('local', { successRedirect: '/api/loginCallback', failureRedirect: '/api/loginCallback' }));
  // 登录回调
  router.get('/api/loginCallback', user.loginCallback);
};
