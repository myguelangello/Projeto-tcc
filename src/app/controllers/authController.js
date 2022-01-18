const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const mailer = require('../../modules/mailer')

const authConfig = require('../../config/auth')

const Student = require('../models/student')
const Teacher = require('../models/teacher')

function generateToken(payload = {}) {
  return jwt.sign(payload, authConfig.secret, {
    expiresIn: 86400,
  })
}

module.exports = {
  async signup(req, res) {
    const { firstName, lastName, email, password, role } = req.body
    if (!firstName || !lastName || !password || !role || !email) {
      return res
        .status(202)
        .json({ message: 'Por favor, preencha todos os campos.' })
    }

    try {
      /* verificar se o email já existe no banco */
      if (
        (await Student.findOne({ email })) ||
        (await Teacher.findOne({ email }))
      ) {
        console.log('Email já existe no banco')
        return res.status(202).json({ message: 'Esse usuário já existe.' })
      }

      /* verificar o tipo do usuário */
      if (role === 'student') {
        const student = await Student.create(req.body)

        student.password = undefined

        return res.status(201).json({
          student,
          token: generateToken({ id: student.id, role: student.role }),
        })
      } else if (role === 'teacher') {
        const teacher = await Teacher.create(req.body)

        teacher.password = undefined

        return res.status(201).json({
          teacher,
          token: generateToken({ id: teacher.id, role: teacher.role }),
        })
      } else {
        console.log(role)
        return res.status(202).json({ message: 'Perfil inválido' })
      }
    } catch (error) {
      consle.log(error)
      return res.status(202).json({ error: 'Falha no cadastro' })
    }
  },

  async authenticate(req, res) {
    const { email, password } = req.body
    if (!email || !password) {
      return res
        .status(202)
        .json({ message: 'Por favor, preencha todos os campos.' })
    }

    try {
      let user
      /* buscando o email e a senha no banco nas respectivas collections */
      let student = await Student.findOne({ email }).select('+password')
      let teacher = await Teacher.findOne({ email }).select('+password')

      /* verificar se o email é existe e qual o seu perfil */
      if (student) {
        user = student
      } else if (teacher) {
        user = teacher
      } else {
        /* se não achar o email o usuário não está cadastrado ou errou o email */
        return res.status(404).json({ message: 'User not found' })
      }

      /* estou comparando a senha digitada e a senha no banco estou usando o bcrypt.compare pq a senha foi encriptada, lá no model */
      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(202).json({ message: 'Invalid password' })
      }

      user.password = undefined

      res
        .status(200)
        .json({
          user,
          token: generateToken({ id: teacher.id, role: teacher.role }),
        })
    } catch (error) {
      return res.status(400).json({ error: 'Authentication error' })
    }
  },

  async forgotPassword(req, res) {
    const { email } = req.body

    if (!email) {
      return res.status(404).json({ error: 'Email is required' })
    }

    try {
      let user
      let student = await Student.findOne({ email })
      let teacher = await Teacher.findOne({ email })

      /* verificar se o email é existe e qual o seu perfil */
      if (student) {
        user = student
      }
      if (teacher) {
        user = teacher
      }
      if (!user) {
        /* se não achar o email o usuário não está cadastrado ou errou o email */
        return res.status(404).json({ error: 'Email not found in application' })
      }

      //passando um token com o crypto do node
      const token = crypto.randomBytes(20).toString('hex')

      //tempo de expiração
      const now = new Date()
      now.setHours(now.getHours() + 1)

      if (user.role === 'student') {
        await Student.findByIdAndUpdate(user.id, {
          $set: {
            passwordResetToken: token,
            passwordResetExpires: now,
          },
        })
      } else if (user.role === 'teacher') {
        await Teacher.findByIdAndUpdate(user.id, {
          $set: {
            passwordResetToken: token,
            passwordResetExpires: now,
          },
        })
      }

      mailer.sendMail(
        {
          to: email,
          from: 'spaceship.suport@gmail.com',
          /* template: 'auth/forgot_password', */
          /* context: { token }, */
          subject: 'Recupere sua senha',
          html: `<p>Você esqueceu sua senha? Não tem problema, utilize esse token: ${token}</p>`,
        },
        (err) => {
          if (err) {
            return res
              .status(400)
              .json({ error: 'Cannot send forgot password email' })
          }
          return res.send()
        }
      )
    } catch (error) {
      console.log(error)
      res.status(400).json({ error: 'Forgot password error, try again' })
    }
  },

  async resetPassword(req, res) {
    const { email, token, password, confirm_password } = req.body

    if (password !== confirm_password) {
      return res
        .status(400)
        .json({ error: 'The password and its confirmation must be the same' })
    }

    try {
      let user
      let student = await Student.findOne({ email }).select(
        '+passwordResetToken passwordResetExpires'
      )
      let teacher = await Teacher.findOne({ email }).select(
        '+passwordResetToken passwordResetExpires'
      )

      if (student) {
        user = student
      }
      if (teacher) {
        user = teacher
      }

      if (!user) {
        return res.status(400).json({ error: 'User not found' })
      }

      if (token !== user.passwordResetToken) {
        return res.status(400).json({ error: 'Invalid token' })
      }

      const now = new Date()

      if (now > user.passwordResetExpires) {
        return res
          .status(400)
          .json({ error: 'Token expired, generate a new one' })
      }

      user.password = password

      await user.save()

      res.send()
    } catch (error) {
      res.status(400).json({ error: 'Cannot reset password, try again' })
    }
  },
}
