const express = require('express');

const authMiddleware = require('../middlewares/auth');

const Teacher = require('../models/teacher');
const Student = require('../models/student');

const router = express.Router();

router.use(authMiddleware);

/* Dados com plementares do cadastro do ALUNO com um UPDATE */
router.put('/student/:id', async (req, res) => {
  const { id } = req.params;

  const data = req.body;

  try {
    const student = await Student.findByIdAndUpdate({ _id: id }, data, {
      new: true,
    });
    /**
     * new:true => no mongoose quando atualiza um objeto ele não retorna
     * o valor atualizado mas sim o antigo, então o new:true serve pra retornar o projeto todo atualizado
     */
    if (!student || student === null) {
      return res.status(404).json({ message: 'Sorry, information not found' });
    }
    return res.json(student);
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      error: 'Sorry, there was an error trying to perform this operation.',
    });
  }
});

/* Dados com plementares do cadastro do PROFESSOR com um UPDATE */
router.put('/teacher/:id', async (req, res) => {
  const { id } = req.params;

  const data = req.body;

  try {
    const teacher = await Teacher.findByIdAndUpdate({ _id: id }, data, {
      new: true,
    });
    /**
     * new:true => no mongoose quando atualiza um objeto ele não retorna
     * o valor atualizado mas sim o antigo, então o new:true serve pra retornar o projeto todo atualizado
     */

    if (!teacher || teacher === null) {
      return res.status(404).json({ message: 'Sorry, information not found' });
    }

    return res.json(teacher);
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      error: 'Sorry, there was an error trying to perform this operation.',
    });
  }
});

module.exports = (app) => app.use('/edit', router);
