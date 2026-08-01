import { type } from "node:os";
import sequelize from "./db.js";
import { DataTypes } from "sequelize";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js"

dayjs.extend(utc);

const Student = sequelize.define("Student", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    birthDate:{
        type:DataTypes.DATE,
        allowNull:false,
        get(){
            const val = this.getDataValue("birthDate")
            return val ? val.getTime() : val
        }
    },
    sex:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    mobile:{
        type:DataTypes.STRING(11),
        allowNull:false
    },
    age:{
        type:DataTypes.VIRTUAL,
        get(){
            const now = dayjs.utc();
            const birth = dayjs.utc(this.birthDate);
            return now.diff(birth, "year");
        }
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
