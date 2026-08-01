import sequelize from "./db.js";
import { DataTypes } from "sequelize";
const Book = sequelize.define("Book", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imgUrl:{
        type:DataTypes.STRING,
    },
    publicDate:{
        type:DataTypes.DATE,
        allowNull:false
    },
    author:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
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


export default Book;


