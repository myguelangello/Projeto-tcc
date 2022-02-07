const Student = require('../models/student')
const Teacher = require('../models/teacher')
const Tcc = require('../models/tcc')

module.exports = {
  async index(req, res) {
    try {
      if (!req.userId) {
        console.log('não tem id')
      }
      let id = req.userId
      let student
      let teacher

      if (
        !(student = await Student.findById(id)) &&
        !(teacher = await Teacher.findById(id))
      ) {
        return res.status(202).json({
          failed: 'Desculpe, dados não encontrados',
        })
      }

      if (student) {
        const {
          firstName,
          lastName,
          email,
          about,
          interests,
          modality,
          pretension,
          progress,
          role,
          theme,
        } = student
        return res.status(200).json({
          user: {
            firstName,
            lastName,
            email,
            about,
            interests,
            modality,
            pretension,
            progress,
            role,
            theme,
          },
        })
      } else if (teacher) {
        return res.status(200).json({ user: teacher })
      }
    } catch (error) {
      1
      console.log(error)
      return res.status(400).send({
        error: 'Sorry, there was an error trying to perform this operation.',
      })
    }
  },

  async getTccsAll(req, res) {
    let tccs = await Tcc.find()

    console.log(tccs)

    return res.json({ tccs })
  },

  async getTccsArea(req, res) {
    const { interesse } = req.query
    console.log('interesse', interesse)
    let tccs = await Tcc.find({ areas: interesse })

    return res.json({ tccs })
  },

  async getTeachersArea(req, res) {
    const { interesse } = req.query
    console.log('interesse de área', interesse)
    let teachers = await Teacher.find({ researchAreas: interesse })

    return res.json({ teachers })
  },

  async getTeachersAll(req, res) {
    const teachers = await Teacher.find()

    return res.json({ teachers })
  },
}

/*
async getTccs(req, res) {
    let tccs = await Tcc.find()


    let aluno = null
    let professor = null
    let id = null
    let title = null
    let areas = null

    tccs.map((tcc) => {
      aluno = tcc.student
      professor = tcc.teacher
      id = tcc._id
      title = tcc.title
      areas = tcc.areas
      console.log(id, title, aluno, professor, areas)
    })

    return res.json({ tccs: { id, title, aluno, professor, areas } })
  },
*/
