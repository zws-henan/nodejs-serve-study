import sequelize from "./db.js";
import { DataTypes } from "sequelize";
import Student from "./Student.js";

const Class = sequelize.define("Class", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    openDate:{
        type:DataTypes.DATE,
        allowNull:false
    }
},{
    createdAt:false,
    updatedAt:false,
    paranoid:true // 开启软删除。记录删除的时间
});

// try {
//     await Class.sync({
//         alter:true
//     });
//     console.log('Class table has been synchronized successfully.');
// } catch (error) {
//     console.error('Unable to sync the database:', error);
// }

Class.hasMany(Student);

export default Class;


