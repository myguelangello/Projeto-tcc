const express = require('express');

const AuthController = require('../controllers/authController');

module.exports = (app) => {
  /* ROTAS DE AUTENTICAÇÃO */

  const authRoutes = express.Router();

  /* SIGN UP */
  authRoutes.post('/signup', AuthController.signup);
  /* AUTHENTICATE/LOGIN */
  authRoutes.post('/authenticate', AuthController.authenticate);
  /* FORGOT PASSWORD */
  authRoutes.post('/forgot_password', AuthController.forgotPassword);
  /* RESET PASSWORD */
  authRoutes.post('/reset_password', AuthController.resetPassword);

  /* configuração da rota de authenticação */
  app.use('/auth', authRoutes);
};
