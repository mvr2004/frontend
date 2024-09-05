const admin = require('firebase-admin');

// Inicialize o app com as credenciais FCM
admin.initializeApp({
  credential: admin.credential.applicationDefault(), // Substitua pelo seu método de inicialização
});

const sendNotification = async (registrationTokens, title, body) => {
  const message = {
    notification: {
      title: title,
      body: body
    },
    tokens: registrationTokens
  };

  try {
    const response = await admin.messaging().sendMulticast(message);
    console.log('Notificações enviadas:', response);
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
  }
};

module.exports = { sendNotification };
