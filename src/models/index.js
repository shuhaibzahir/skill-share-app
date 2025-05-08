const User = require('./User');
const Task = require('./Task');
const Skill = require('./Skill');
const Offer = require('./Offer');
const TaskProgress = require('./TaskProgress');

//  User - Task (One-to-Many: users create tasks)
User.hasMany(Task, { foreignKey: 'userId', as: 'tasks' });
Task.belongsTo(User, { foreignKey: 'userId', as: 'user' });

//  User - Skill (One-to-Many: only providers)
User.hasMany(Skill, { foreignKey: 'providerId', as: 'skills' });
Skill.belongsTo(User, { foreignKey: 'providerId', as: 'provider' });

//  User - Offer (One-to-Many: only providers)
User.hasMany(Offer, { foreignKey: 'providerId', as: 'offers' });
Offer.belongsTo(User, { foreignKey: 'providerId', as: 'provider' });

//  Task - Offer (One-to-Many)
Task.hasMany(Offer, { foreignKey: 'taskId', as: 'offers' });
Offer.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

//  Task - TaskProgress (One-to-Many)
Task.hasMany(TaskProgress, { foreignKey: 'taskId', as: 'progressLogs' });
TaskProgress.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

//  User (provider) - TaskProgress (One-to-Many)
User.hasMany(TaskProgress, { foreignKey: 'providerId', as: 'taskProgressUpdates' });
TaskProgress.belongsTo(User, { foreignKey: 'providerId', as: 'provider' });

module.exports = {
  User,
  Task,
  Skill,
  Offer,
  TaskProgress
};
