import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};

  // 数据库配置
  config.sequelize = {
    dialect: 'mysql',
    host: '172.16.60.247',
    port: 3306,
    username: 'fd',
    password: '123456',
    database: 'eggjs-ts-demo',
    timezone: '+08:00',
  };

  return config;
};
