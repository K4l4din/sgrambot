const sequelize = require("sequelize");
const sequelizeInstance = new sequelize.Sequelize({
    host: "localhost",
    username: "root",
    password: "",
    database: "sendgram",
    port: 3306,
    dialect: 'mysql',
    define: {
        timestamps: true
    },
    logging: false,
    timezone: "+02:00",
    pool: {
        max: 50,
        min: 0,
        acquire: 30000,
        idle: 300000
    }
});

module.exports.sequelizeInstance = sequelizeInstance;
module.exports.Users = require('./Users').default;