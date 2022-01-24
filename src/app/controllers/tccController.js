const TCC = require('../models/tcc')
module.exports = {
  async register(req, res) {
    const { title, student, teacher, areas } = req.body

    if (!title || !student || !teacher || !areas) {
      return res
        .status(202)
        .json({ message: 'Por favor, preencha todos os campos.' })
    }

    try {
      if (await TCC.findOne({ title })) {
        return res.status(202).json({
          message: { failed: 'Já existe um TCC com este título cadastrado.' },
        })
      }

      tcc = await TCC.create(req.body)

      return res
        .status(201)
        .json({ message: { success: 'TCC cadastrado com sucesso!' }, TCC: tcc })
    } catch (error) {
      return res.status(202).json({
        error:
          'Infelizmente ocorreu um erro ao cadastrar o TCC, tente novamente.',
      })
    }
  },
}
