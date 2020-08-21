import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;

    ctx.logger.error('测试日志 error');
    ctx.logger.info('测试日志 info');

    console.log('console.log 日志');
    // throw Error('throw error');

    ctx.body = await ctx.service.test.sayHi('egg');
  }
}
