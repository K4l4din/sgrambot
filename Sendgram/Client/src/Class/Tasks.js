const cron = require('node-cron');
const checkLicenses = async () => {
  const Client = require('../../index')
  const currentDate = new Date();
  console.log('Checked...');
  try {
    const total = await Client.database.sequelizeInstance.models.Users.findAll();

    total.forEach(async (license) => {
      const expirationDate = new Date(license.abonnement);

      if (currentDate >= expirationDate) {
        const channel = Client.channels.cache.get("1183199330035830794");

        if (channel) {
          channel.send(`La licence de ${license.user} (${license.username}) a expiré.`);
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des licences :', error);
  }
};

cron.schedule('* * * * *', checkLicenses);