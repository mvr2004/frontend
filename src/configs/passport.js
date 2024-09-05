const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const { findUserByEmail, registerUser } = require('../services/authService');

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "https://backend-9hij.onrender.com/auth/facebook/callback",
  profileFields: ['id', 'emails', 'name', 'picture.type(large)']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let user = await findUserByEmail(email);

    if (!user) {
      const password = Math.random().toString(36).slice(-8); // Gerar uma senha aleatória
      const photoUrl = profile.photos[0].value;
      const newUser = await registerUser(`${profile.name.givenName} ${profile.name.familyName}`, email, password, photoUrl);
      if (!newUser) {
        return done(new Error('Falha ao registrar usuário'));
      }
      user = await findUserByEmail(email);
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserByEmail(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
