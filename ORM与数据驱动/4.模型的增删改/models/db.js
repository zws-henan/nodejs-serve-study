import Sequelize from 'sequelize';
import {sqlLogger} from "../testlog.js"

const sequelize = new Sequelize('myschooldb', 'root', '123456', {
  logging:(sql)=>{
    sqlLogger.debug(sql)
  },
  host: 'localhost',
  dialect: 'mysql', /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
});

export default sequelize;
