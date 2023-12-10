const client = require("../../../../index");
console.log(client)
module.exports = {
  logging: {
    name: 'ready',
    run: (client) => {
      client.libs.log.print(`Logged in as %s`, 'Discord').success(client.user?.tag);
    }
  }
}