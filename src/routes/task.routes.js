const express = require('express');
const { 
  createTask, 
  getTasks, 
  getTask, 
  updateTask, 
  updateTaskProgress,
  completeTask,
  handleTaskCompletion
} = require('../controllers/task.controller.js');
const { getTaskOffers } = require('../controllers/offer.controller.js');
const { authorize } = require('../middlewares/auth.js');

const router = express.Router();

router.route('/')
  .post(authorize('user'), createTask)
  .get(getTasks);

router.route('/:id')
  .get(getTask)
  .put(authorize('user'), updateTask);

router.route('/:taskId/offers')
  .get(authorize('user'), getTaskOffers);

module.exports = router;