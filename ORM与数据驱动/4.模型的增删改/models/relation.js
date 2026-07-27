import Class from './Class.js'
import Student from './Student.js'

Class.hasMany(Student);
Student.belongsTo(Class);
