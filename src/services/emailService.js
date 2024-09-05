// src/services/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendConfirmationEmail = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Confirmation',
    text: `Your confirmation code is: ${code}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + email);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


exports.sendResetEmail = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Recuperação de Senha',
    text: `Seu código de confirmação é: ${code}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email de recuperação enviado: ' + email);
  } catch (error) {
    console.error('Erro ao enviar email de recuperação:', error);
  }
};


exports.sendNewPasswordEmail = async (email, newPassword) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Nova Senha',
    text: `Sua nova senha é: ${newPassword}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email com nova senha enviado: ' + email);
  } catch (error) {
    console.error('Erro ao enviar email com nova senha:', error);
  }
};