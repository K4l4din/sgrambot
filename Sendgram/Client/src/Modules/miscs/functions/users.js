const { ButtonBuilder, EmbedBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
   paginacion
}



async function paginacion(client, interaction, texto, titulo = "Page", test = "Page", elementos_por_pagina = 5) {

  /* DIVIDIMOS EL TEXTO PARA CREAR LAS PAGINAS Y EMPUJARLO EN LOS EMBEDS */

  var embeds = [];
  var dividido = elementos_por_pagina;
  for(let i = 0; i < texto.length; i+= dividido) {
      let desc = texto.slice(i, elementos_por_pagina);
      elementos_por_pagina+= dividido;
      //creamos un embed por cada pagina de los datos divididos
      let embed = new EmbedBuilder()
      .setTitle(titulo.toString())
      .setDescription(`${test} ${desc.join(" ")}`)
      .setColor('Green')
      embeds.push(embed)
  }
  let paginaActual = 0;
  //Si la cantidad de embeds es solo 1, envíamos el mensaje tal cual sin botones
  if (embeds.length === 1) return interaction.editReply({ embeds: [embeds[0]] }).catch(() => { });
  //Si el numero de embeds es mayor 1, hacemos el resto || definimos los botones.
  let boton_atras = new ButtonBuilder().setStyle('Success').setCustomId('Atrás').setEmoji('⬅')
  let boton_inicio = new ButtonBuilder().setStyle('Danger').setCustomId('Inicio').setEmoji('🏠')
  let boton_avanzar = new ButtonBuilder().setStyle('Success').setCustomId('Avanzar').setEmoji('➡')
  //Enviamos el mensaje embed con los botones
  let embedpaginas = await interaction.editReply({
      embeds: [embeds[0].setFooter({ text: `Page ${paginaActual + 1} / ${embeds.length}` })],
      components: [new ActionRowBuilder().addComponents([boton_atras, boton_inicio, boton_avanzar])]
  });
  //Creamos un collector y filtramos que la persona que haga click al botón, sea la misma que ha puesto el comando, y que el autor del mensaje de las páginas, sea el cliente
  const filter = i => i?.isButton() && i?.user && i?.user.id == interaction.user.id
  const collector = interaction.channel.createMessageComponentCollector({filter, time: 180e3})

  collector.on("collect", async b => {
      //Si el usuario que hace clic a el botón no es el mismo que ha escrito el comando, le respondemos que solo la persona que ha escrito >>queue puede cambiar de páginas

      switch (b?.customId) {
          case "Atrás": {
              //Resetemamos el tiempo del collector
              collector.resetTimer();
              //Si la pagina a retroceder no es igual a la primera pagina entonces retrocedemos
              if (paginaActual !== 0) {
                  //Resetemamos el valor de pagina actual -1
                  paginaActual -= 1
                  //Editamos el embeds
                  await interaction.editReply({ embeds: [embeds[paginaActual].setFooter({ text: `Page ${paginaActual + 1} / ${embeds.length}` })] }).catch(() => { });
                  await b?.deferUpdate();
              } else {
                  //Reseteamos al cantidad de embeds - 1
                  paginaActual = embeds.length - 1
                  //Editamos el embeds
                  await interaction.editReply({ embeds: [embeds[paginaActual].setFooter({ text: `Page ${paginaActual + 1} / ${embeds.length}` })] }).catch(() => { });
                  await b?.deferUpdate();
              }
          }
              break;

          case "Inicio": {
              //Resetemamos el tiempo del collector
              collector.resetTimer();
              //Si la pagina a retroceder no es igual a la primera pagina entonces retrocedemos
              paginaActual = 0;
              await interaction.editReply({ embeds: [embeds[paginaActual].setFooter({ text: `Page ${paginaActual + 1} / ${embeds.length}` })] }).catch(() => { });
              await b?.deferUpdate();
          }
              break;

          case "Avanzar": {
              //Resetemamos el tiempo del collector
              collector.resetTimer();
              //Si la pagina a avanzar no es la ultima, entonces avanzamos una página
              if (paginaActual < embeds.length - 1) {
                  //Aumentamos el valor de pagina actual +1
                  paginaActual++
                  //Editamos el embeds
                  await interaction.editReply({ embeds: [embeds[paginaActual].setFooter({ text: `Page ${paginaActual + 1} / ${embeds.length}` })]}).catch(() => { });
                  await b?.deferUpdate();
                  //En caso de que sea la ultima, volvemos a la primera
              } else {
                  //Reseteamos al cantidad de embeds - 1
                  paginaActual = 0
                  //Editamos el embeds
                  await interaction.editReply({ embeds: [embeds[paginaActual].setFooter({ text: `Page ${paginaActual + 1} / ${embeds.length}` })] }).catch(() => { });
                  await b?.deferUpdate();
              }
          }
              break;

          default:
              break;
      }
  });
  collector.on("end", () => {
      
  });
}