const { Client, Collection, Routes } = require('discord.js');
const database = require('../../../../Datagram');
const path = require('path');
const fetch = require('node-fetch');
const fs = require('fs');
const log = require('../Libs/logs');
//require('../Class/Tasks')
class ExtendedClient extends Client {
  static modulesPath = path.join(__dirname, '../Modules');
  constructor(options) {
    super(options);
    this.Commands = new Collection();
    this.aliases = new Collection();
    this.database = database;
    this.Vars = {
      Client: {
        token: process.argv[2]
      },
      debugCMD: true
    }
    this.libs = { log };
    this.init();
  }

  async init() {
    this.database.sequelizeInstance.authenticate().then(() => {
      this.libs.log.print('Connected.', 'Database').success();
    }).catch(error => {
      this.libs.log.print('Error: %s', 'Database', true).error(error);
    });

    this.database.sequelizeInstance.sync().then(() => {
      this.libs.log.print('Synchronized.', 'Database').success();
    }).catch(error => {
      this.libs.log.print('Error: %s', 'Database', true).error(error);
    });

    await this.loadModules();
    await this.login(this.Vars.Client.token).catch(error => {
      this.libs.log.print('Error: %s', 'Discord', true).error(error);
    });
  }

  async loadModules() {
    for (const m of fs.readdirSync(ExtendedClient.modulesPath)) {
      const t1 = Date.now();
      const module = require(path.join(ExtendedClient.modulesPath, m));
      var eventCount = 0,
        cmdCount = 0

      for (const Event of Object.keys(module.Events)) {
        const event = module.Events[Event];
        if (event.name) {
          this.on(event.name, (...args) => event.run(...args));
          eventCount++;
          continue;
        } else {
          for (const Event of Object.keys(event)) {
            const e = event[Event];
            if (e.name) this.on(e.name, (...args) => e.run(...args));
            eventCount++;
            continue;
          }
        }
      }
      for (const Command of Object.keys(module.Commands)) {
        const command = module.Commands[Command];
        this.Commands.set(command.options.default.name, command);
        cmdCount++;
      }

      this.libs.log
        .print(`Load %s, %s commands, %s events, in %s ms.`, 'Modules')
        .log(m, cmdCount, eventCount, Date.now() - t1);
    }
  }
  async fetchCommands() {
    for (const m of fs.readdirSync(ExtendedClient.modulesPath)) {
      const module = require(path.join(ExtendedClient.modulesPath, m));

      for (const command of Object.keys(module.Commands)) {
        const cmd = new Commands(module.Commands[command]);
        this.Commands.set(cmd.options.name, cmd);
      }
    }
  }
  async pushCommandGuild(guild) {
    try {
      const data = Array.from(this.Commands.values()).map((c) => c.options.default);
      await this.rest.put(
        Routes.applicationGuildCommands(this.user?.id.toString(), guild),
        { body: data }
      );

      log.print('Commands registered on %s', 'Discord').log(guild);
      return true;
    } catch (error) {
      console.error(`Error pushing commands to guild ${guild}: ${error.message}`);
      return false;
    }
  }

  async deleteGlobalCommands() {
    return new Promise(async (resolve, reject) => {
      try {
        await this.rest.put(
          Routes.applicationCommands(this.user?.id.toString()),
          { body: [] },
        );

        log.print('Commands removed', 'Discord').warn();
        resolve(true);        
      } catch(error) {
        return reject(error);
      }
    })  
  }
}

module.exports = ExtendedClient;