const mongoose = require('../../database')

const TccSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    student: {
      type: String,
      required: true,
    },
    teacher: {
      type: String,
      required: true,
    },
    areas: [{ type: String, required: false }],
  },
  {
    timestamps: true,
  }
)

//definindo o model
const Tcc = mongoose.model('Tcc', TccSchema)

module.exports = Tcc
