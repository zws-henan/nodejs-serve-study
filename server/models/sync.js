import './admin.js'
import './Class.js'
import './Student.js'
import './Book.js'
import sequelize from './db.js'
import './relation.js'

// 同步所有模型
try {
    await sequelize.sync({
        alter:true
    });
    console.log('All models have been synchronized successfully.');
} catch (error) {
    console.error('Unable to sync the database:', error);
}
