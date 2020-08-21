import bcrypt from 'bcryptjs';
import { Service } from 'egg';

/**
 * Test Service
 */
export default class Test extends Service {

  /**
   * sayHi to you
   * @param name - your name
   */
  public async sayHi(name: string) {
    return `hi, ${name}`;
  }

  /**
   * 对比密码
   * @param password
   * @param hashPassword
   */
  public comparePassword(password: string, hashPassword: string): boolean {
    return bcrypt.compareSync(password, hashPassword);
  }

  /**
   * 密码加密
   * @param password
   */
  public encryptPassword(password: string): string {
    return bcrypt.hashSync(password, 8);
  }
}
