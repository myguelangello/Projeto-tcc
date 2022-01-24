const mongoose = require('../../database')
const bcrypt = require('bcryptjs')
/* Schema são mais ou menos os campos que vão ter dentro do bd */
const TeacherSchema = new mongoose.Schema({
  /* CADASTRO BÁSICO */
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  role: {
    type: String,
    lowercase: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },

  /* CADASTRO DE IDENTIFICAÇÃO */
  description: {
    type: String,
    required: false,
  },
  availability: {
    type: String,
    required: false,
  },
  preferredModalities: [
    {
      type: String,
      required: false,
    },
  ],
  researchAreas: [
    {
      type: String,
      required: false,
    },
  ],
  researchProjects: [
    {
      title: String,
      startDate: String,
      endDate: String,
      description: String,
      active: Boolean,
      required: false,
    },
  ],
  extensionProjects: [
    {
      title: String,
      startDate: String,
      endDate: String,
      description: String,
      active: Boolean /* verificar se está ativo primeiro */,
      required: false,
    },
  ],
  subjects: [
    {
      title: String,
      active: Boolean,
      semester: {
        type: String,
        required: true,
      },
    },
  ],
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: false,
    },
  ],

  /* INFORMAÇÕES ADICIONAIS */
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

/* encriptando a senha antes de salvá-la */
TeacherSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 10)
  this.password = hash
  next()
})

//definindo o model
const Teacher = mongoose.model('Teacher', TeacherSchema)

module.exports = Teacher
