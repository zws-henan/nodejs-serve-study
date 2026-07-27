import Sequelize from 'sequelize';

const sequelize = new Sequelize('myschooldb', 'root', '123456', {
  // logging:null,
  host: 'localhost',
  dialect: 'mysql', /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
});

export default sequelize;
