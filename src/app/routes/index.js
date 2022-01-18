const express = require('express')
const authMiddleware = require('../middlewares/auth')

const AuthController = require('../controllers/authController')
const EditController = require('../controllers/editController')

module.exports = (app) => {
  /* ROTAS DE AUTENTICAÇÃO */

  const authRoutes = express.Router()

  /* SIGN UP */
  authRoutes.post('/signup', AuthController.signup)

  /* AUTHENTICATE/LOGIN */
  authRoutes.post('/authenticate', AuthController.authenticate)
  /* FORGOT PASSWORD */
  authRoutes.post('/forgot_password', AuthController.forgotPassword)
  /* RESET PASSWORD */
  authRoutes.post('/reset_password', AuthController.resetPassword)

  //exemplo de rota logout
  authRoutes.post('/logout', authMiddleware, function (req, res) {
    res.json({ auth: false, token: null })
  })

  /* ROTAS IDENTIFICAÇÃO DOS USUÁRIOS*/
  authRoutes.put(
    '/student/:id',
    authMiddleware,
    EditController.identificationStudent
  )
  authRoutes.put(
    '/teacher/:id',
    authMiddleware,
    EditController.identificationTeacher
  )
  /* configuração da rota de authenticação */
  app.use('/auth', authRoutes)
}
