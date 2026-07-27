import sequelize from './db.js';
import { DataTypes } from 'sequelize';
const Admin = sequelize.define('Admin', {
    loginId:{
        type:DataTypes.STRING,
        allowNull:false
    },
    loginPwd:{
        type:DataTypes.STRING,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    createdAt:false,
    updatedAt:false,
    paranoid:true // 开启软删除。记录删除的时间
});

// try {
//     await Admin.sync({
//         alter:true
//     });
//     console.log('Admin table has been synchronized successfully.');
// } catch (error) {
//     console.error('Unable to sync the database:', error);
// }

export default Admin;
