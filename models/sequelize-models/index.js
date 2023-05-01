const db = require('./database');
const Sequelize = require('sequelize');

// Make sure you have `postgres` running!
//---------VVVV---------  your code below  ---------VVV----------

const Task = db.define('Task', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  complete: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  due: Sequelize.DATE,
});

Task.clearCompleted = async function() {
  await this.destroy({ where: { complete: true } });
};

Task.completeAll = async function() {
  await this.update({ complete: true }, { where: { complete: false } });
};

Task.prototype.getTimeRemaining = function() {
  if (!this.due) {
    return Infinity;
  }
  else {
    return this.due - Date.now();
  }
};

Task.prototype.isOverdue = function() {
  if (this.complete) {
    return false;
  }
  return this.due < new Date();
};

Task.prototype.assignOwner = function(owner) {
  return this.setOwner(owner);
};

const Owner = db.define('Owner', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

Owner.getOwnersAndTasks = async function() {
  const OAndT = await Owner.findAll({include: [{model: Task}]})
  return OAndT;
};

Owner.prototype.getIncompleteTasks = async function() {
  const tasks = await this.getTasks({where: {complete: false}});
  return tasks;
};

Owner.beforeDestroy(owner => {
  if (owner.name == 'Grace Hopper') {
    throw new Error("You can't destroy owners named 'Grace Hopper'");
  }
});

Task.belongsTo(Owner);
Owner.hasMany(Task);


//---------^^^---------  your code above  ---------^^^----------

module.exports = {
  Task,
  Owner,
};
