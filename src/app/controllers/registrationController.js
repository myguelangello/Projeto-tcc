const Student = require('../models/student')
const Teacher = require('../models/teacher')

module.exports = {
  async registrationStudent(req, res) {
    const { id } = req.params

    const data = req.body

    try {
      const student = await Student.findByIdAndUpdate({ _id: id }, data, {
        new: true,
      })
      /**
       * new:true => no mongoose quando atualiza um objeto ele não retorna
       * o valor atualizado mas sim o antigo, então o new:true serve pra retornar o projeto todo atualizado
       */
      if (!student || student === null) {
        return res.status(404).json({ message: 'Sorry, information not found' })
      }

      return res.json({ student })
    } catch (error) {
      console.log(error)
      return res.status(400).send({
        error: 'Sorry, there was an error trying to perform this operation.',
      })
    }
  },

  async registrationTeacher(req, res) {
    const { id } = req.params

    const data = req.body

    try {
      const teacher = await Teacher.findByIdAndUpdate({ _id: id }, data, {
        new: true,
      })
      /**
       * new:true => no mongoose quando atualiza um objeto ele não retorna
       * o valor atualizado mas sim o antigo, então o new:true serve pra retornar o projeto todo atualizado
       */

      if (!teacher || teacher === null) {
        return res.status(404).json({ message: 'Sorry, information not found' })
      }

      return res.json(teacher)
    } catch (error) {
      console.log(error)
      return res.status(400).send({
        error: 'Sorry, there was an error trying to perform this operation.',
      })
    }
  },
}
