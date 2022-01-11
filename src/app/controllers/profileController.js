const express = require('express');
const authMiddleware = require('../middlewares/auth');
const multerMiddleware = require('../middlewares/multer');

const multer = require('multer');

const Student = require('../models/student');
const User = require('../models/student');

const router = express.Router();

router.use(authMiddleware);

/* rota virificação de profile */
router.get('/teste', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.userId });

    if (!profile) {
      console.log('não tem foto de perfil');
      return res.send(req.userId);
    }
    if (profile) {
      console.log('Tem foto');
      return res.send(profile);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: 'Errrrou' });
  }
});

/* adicionando foto de perfil */
router.post(
  '/picture',
  multer(multerMiddleware).single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send({ error: 'You need choose a file' });
      }

      const { originalname: name, size, filename: key } = req.file;

      const checkExists = await Profile.findOne({ user: req.userId });

      if (checkExists) {
        return res
          .status(400)
          .send({ error: 'You already have a profile picture' });
      }

      profile = await Profile.create({
        name,
        size,
        key,
        url: '',
        user: req.userId,
      });
      let id = req.userId;

      const user = await User.findOne({ id });

      return res.send({ profile, user });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ error: 'Error saving image' });
    }
  }
);

/* listando TODOS os alunos */
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();

    res.send({ students });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: 'Error loading users' });
  }
});

module.exports = (app) => app.use('/profile', router);
