const Sequelize = require('sequelize')

const sequelize = new Sequelize(`mysql://administrator:ErEsRaHc_194@dbcbrnddbold.cd9s9zos1ktw.ap-south-1.rds.amazonaws.com:3306/dbcb_pipeline`)

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  const db = {}
  db.sequelize = sequelize
  db.Sequelize = Sequelize

db.sequelize.sync({ alter: true })
  .then(() => {
  console.log(`Database & tables created!`)
})

// Models/tables
db.users = require('../models/User')(sequelize, Sequelize)
db.token = require('../models/Token')(sequelize, Sequelize)

module.exports = db