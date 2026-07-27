import sequelize from "./db.js";
import { DataTypes } from "sequelize";
const Student = sequelize.define("Student", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    birthDate:{
        type:DataTypes.DATE,
        allowNull:false
    },
    sex:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    mobile:{
        type:DataTypes.STRING(11),
        allowNull:false
    }
},{
    createdAt:false,
    updatedAt:false,
    paranoid:true // 开启软删除。记录删除的时间
});

// try {
//     await Student.sync({
//         alter:true
//     });
//     console.log('Student table has been synchronized successfully.');
// } catch (error) {
//     console.error('Unable to sync the database:', error);
// }


export default Student;
