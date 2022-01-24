const express = require('express')
const authMiddleware = require('../middlewares/auth')

const AuthController = require('../controllers/authController')
const EditController = require('../controllers/editController')
const TccController = require('../controllers/tccController')

module.exports = (app) => {
  const authRoutes = express.Router()
  const tccRoutes = express.Router()

  /* rotas de tcc */
  tccRoutes.post('/register', authMiddleware, TccController.register)

  /* Rotas de /auth */
  /* Signup */
  authRoutes.post('/signup', AuthController.signup)
  /* Autenticação */
  authRoutes.post('/authenticate', AuthController.authenticate)
  /* Esqueceu senha */
  authRoutes.post('/forgot_password', AuthController.forgotPassword)
  /* Resetar senha */
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
  /* configuração das rotas e diretórios */
  app.use('/auth', authRoutes)
  app.use('/tcc', tccRoutes)
}
