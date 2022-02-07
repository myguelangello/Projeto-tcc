const express = require('express')
const authMiddleware = require('../middlewares/auth')

const AuthController = require('../controllers/authController')
const RegistrationController = require('../controllers/registrationController')
const TccController = require('../controllers/tccController')
const ListController = require('../controllers/listController')

module.exports = (app) => {
  const authRoutes = express.Router()
  const tccRoutes = express.Router()
  const routes = express.Router()

  //listagens
  routes.get('/user', authMiddleware, ListController.index)
  routes.get('/teachers_all', authMiddleware, ListController.getTeachersAll)
  routes.get('/teachers', authMiddleware, ListController.getTeachersArea)
  routes.get('/tcc_all', authMiddleware, ListController.getTccsAll)
  routes.get('/tcc', authMiddleware, ListController.getTccsArea)

  //listagens

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
    RegistrationController.registrationStudent
  )
  authRoutes.put(
    '/teacher/:id',
    authMiddleware,
    RegistrationController.registrationTeacher
  )
  /* configuração das rotas e diretórios */
  app.use('/auth', authRoutes)
  app.use('/tcc', tccRoutes)
  app.use('/', routes)
}
