const { verifyLogin, verifyGoogleToken, findUserByEmail, registerUser } = require('../services/authService');

exports.login = async (req, res) => {
  const { email, password, deviceToken } = req.body;  // Capturar o deviceToken enviado no corpo da requisição

  try {
    const user = await verifyLogin(email, password);
    console.log(`Utilizador ${user.email} autenticado com sucesso.`);

    // Atualizar o deviceToken
    await user.update({ deviceToken });

    if (user.firstLogin) {
      console.log(`Usuário ${user.email} precisa atualizar a senha.`);
      res.json({ message: 'Login bem-sucedido', user, firstLogin: true });
    } else {
      console.log(`Login bem-sucedido para o utilizador ${user.email}.`);
      res.json({ message: 'Login bem-sucedido', user, firstLogin: false });
    }
  } catch (err) {
    console.error(`Erro ao fazer login: ${err.message}`);
    if (err.message === 'Utilizador não encontrado') {
      res.status(404).json({ message: 'Utilizador não encontrado' });
    } else if (err.message === 'Palavra passe inválida') {
      res.status(401).json({ message: 'Palavra passe inválida' });
    } else {
      res.status(400).json({ message: `Erro ao fazer login: ${err.message}` });
    }
  }
};


exports.googleLogin = async (req, res) => {
  const { token, deviceToken } = req.body;  // Capturar o deviceToken enviado no corpo da requisição
  console.log('Token recebido:', token);

  try {
    const googleUser = await verifyGoogleToken(token);
    let user = await findUserByEmail(googleUser.email);

    if (user && !user.Ativo) throw new Error('Utilizador inativo');

    if (!user) {
      const password = Math.random().toString(36).slice(-8); // Gerar uma senha aleatória
      const newUser = await registerUser(googleUser.name, googleUser.email, password, googleUser.photoUrl);
      if (!newUser) {
        throw new Error('Falha ao registrar utilizador');
      }
      user = await findUserByEmail(googleUser.email);
    }

    // Atualizar o deviceToken
    await user.update({ deviceToken });

    res.json({ message: 'Login bem-sucedido', user });
  } catch (err) {
    res.status(400).json({ message: `Erro ao fazer login com Google: ${err.message}` });
  }
};

exports.facebookLogin = async (req, res) => {
  const { accessToken, userData, deviceToken } = req.body;  // Capturar o deviceToken enviado no corpo da requisição
  console.log('Token recebido:', accessToken);

  try {
    const user = await findOrCreateUserWithFacebook(accessToken, userData);

    if (user && !user.Ativo) throw new Error('Utilizador inativo');

    // Atualizar o deviceToken
    await user.update({ deviceToken });

    res.json({ message: 'Login bem-sucedido', user });
  } catch (err) {
    res.status(400).json({ message: `Erro ao fazer login com Facebook: ${err.message}` });
  }
};


const findOrCreateUserWithFacebook = async (accessToken, userData) => {
  const email = userData.email;
  let user = await findUserByEmail(email);

  if (!user) {
    const password = Math.random().toString(36).slice(-8); // Gerar uma senha aleatória
    const photoUrl = userData.picture?.data?.url || ''; // Verificar a presença do campo foto
    const name = userData.name || '';
    const newUser = await registerUser(name, email, password, photoUrl);
    if (!newUser) {
      throw new Error('Falha ao registrar utilizador');
    }
    user = await findUserByEmail(email);
  }

  return user;
};
