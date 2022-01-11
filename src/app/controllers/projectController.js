const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Project = require('../models/project');
const Task = require('../models/task');

const router = express.Router();

router.use(authMiddleware);

/* listando TODOS os projetos */
router.get('/', async (req, res) => {
  try {
    /**
     * o .populate() vai dizer qual o nome do relacionamento no caso o user
     * assim, já vem os dados do usuário que criou o projeto na mesma resposta
     * */
    const projects = await Project.find().populate(['user', 'tasks']);

    return res.send({ projects });
  } catch (error) {
    return res.status(400).send({ error: 'Error loading projects' });
  }
});

/* listando SÓ UM projeto  */
router.get('/:projectId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate([
      'user',
      'tasks',
    ]);

    return res.send({ project });
  } catch (error) {
    return res.status(400).send({ error: 'Error loading project' });
  }
});

/* rota para CRIAÇÃO de projeto */
router.post('/', async (req, res) => {
  try {
    const { title, description, tasks } = req.body;

    const project = await Project.create({
      title,
      description,
      user: req.userId,
    });

    /* criando as tasks e atribuindo ao project */
    await Promise.all(
      tasks.map(async (task) => {
        const projectTask = new Task({ ...task, project: project._id });

        await projectTask.save();

        project.tasks.push(projectTask);
      })
    );

    await project.save();

    return res.send({ project });
  } catch (error) {
    return res.status(400).send({ error: 'Error creating new project' });
  }
});

/* ATUALIZAR */
router.put('/:projectId', async (req, res) => {
  try {
    const { title, description, tasks } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.projectId,
      {
        title,
        description,
      },
      {
        new: true,
      }
      /**
       * new:true => no mongoose quando atualiza um objeto ele não retorna
       * o valor atualizado mas sim o antigo, então o new:true serve pra retornar o projeto todo atualizado
       */
    );
    /**
     * deletando as tasks associadas ao projeto antes de criá-las novamente  no Promise.all() é mais prático deletar pois ficaria mais complicado
     * ir verificando task por task devido o mongo não ser propriamente relacional
     */
    project.tasks = [];
    await Task.deleteOne({ project: project._id });

    /* novamente, criando as tasks e atribuindo ao project */
    await Promise.all(
      tasks.map(async (task) => {
        const projectTask = new Task({ ...task, project: project._id });

        await projectTask.save();

        project.tasks.push(projectTask);
      })
    );

    await project.save();

    return res.send({ project });
  } catch (error) {
    return res.status(400).send({ error: 'Error updating project' });
  }
});

/* rota para DELETAR um projeto */
router.delete('/:projectId', async (req, res) => {
  try {
    await Project.findByIdAndRemove(req.params.projectId).populate(['tasks']);

    return res.send();
  } catch (error) {
    return res.status(400).send({ error: 'Error deleting project' });
  }
});

module.exports = (app) => app.use('/projects', router);
