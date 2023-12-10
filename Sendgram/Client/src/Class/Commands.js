const { ApplicationCommandData, ChatInputCommandInteraction, Colors, PermissionResolvable, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } = require('discord.js');

class Commands {
  constructor(options, requiredPermissions) {
    this.options = options;
    this.requiredPermissions = requiredPermissions || [];
    this.handlers = [];
  }
  setHandler(options, handler) {
    this.handlers.push({
      options: options,
      function: handler
    });
  }

  getHandler(search) {
    return this.handlers.find(handler => {
      if (search.subGroup) {
        if (handler.options.subGroup && handler.options.sub) {
          return handler.options.subGroup == search.subGroup && handler.options.sub == search.sub;
        }
      } else if (search.sub) {
        if (handler.options.sub) {
          return handler.options.sub == search.sub;
        }
      } else {
        return !handler.options.sub && !handler.options.subGroup;
      }
    });
  }

  static Error(interaction, cmdName, description, string) {
    interaction.reply({
      embeds: [{
        color: Colors.RED,
        description: description,
      }],
      ephemeral: true
    });

    interaction.client.libs.log.print(`%s as trying to execute %s - %s`, "Command").warn(interaction.user.tag, cmdName, string);
  }

  
  async run(interaction) {
    const name = interaction.commandName;
    const sub = interaction.options?.getSubcommand(false);
    const subGroup = interaction.options?.getSubcommandGroup(false);

    const member = await interaction.guild.members.fetch(interaction.user.id);

    if (this.requiredPermissions.length > 0) {
      const missingPermissions = member.permissions.missing(this.requiredPermissions);
      if (missingPermissions.length > 0) {
        Commands.Error(interaction, name, `You are missing the following permissions: ${missingPermissions.join(", ")}`, "Missing Permissions");
        return;
      }
    }

    var handler = this.getHandler({ sub: sub, subGroup: subGroup });
    if (!handler) return Commands.Error(interaction, name, 'Command as any handler !', 'Command as any handler !');

    const result = await handler.function(interaction);
    interaction.client.libs.log.print(`%s as executing %s.`, "Command").log(interaction.user.tag, name + (sub ? ` ${sub}` : "") + (subGroup ? ` ${subGroup}` : ""));
    return result;
  }
}

module.exports = Commands;