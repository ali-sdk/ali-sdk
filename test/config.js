var env = process.env;

module.exports = {
  rds: {
    host: env.ALI_SDK_RDS_HOST || 'localhost',
    port: env.ALI_SDK_RDS_PORT || 3306,
    user: env.ALI_SDK_RDS_USER || 'root',
    password: env.ALI_SDK_RDS_PASSWORD || '',
    database: 'ali-sdk-test-user',
  }
};
