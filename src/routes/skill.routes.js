const express = require('express');
const { 
  createSkill,
  getProviderSkills,
  updateSkill,
  deleteSkill
} = require('../controllers/skill.controller.js');
const { authorize } = require('../middlewares/auth.js');

const router = express.Router();

router.route('/')
  .post(authorize('provider'), createSkill)
  .get(authorize('provider'), getProviderSkills);

router.route('/:id')
  .put(authorize('provider'), updateSkill)
  .delete(authorize('provider'), deleteSkill);

module.exports= router;