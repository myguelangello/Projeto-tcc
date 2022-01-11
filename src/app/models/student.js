const mongoose = require('../../database');
const bcrypt = require('bcryptjs');
/* Schema são mais ou menos os campos que vão ter dentro do bd */
const StudentSchema = new mongoose.Schema({
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
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },

  /* CADASTRO DE IDENTIFICAÇÃO */
  about: {
    type: String,
    required: false,
  },
  interests: [
    {
      type: String,
      required: false,
    },
  ],
  theme: {
    type: String,
    required: false,
  },
  modality: {
    type: String,
    required: false,
  },
  progress: {
    type: String,
    required: false,
  },
  pretension: {
    type: String,
    required: false,
  },

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
});

/* encriptando a senha antes de salvá-la */
StudentSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

//definindo o model
const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;
