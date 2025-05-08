const { Skill } = require('../models');

// @desc    Create new skill
// @route   POST /api/skills
// @access  Private (Providers only)
const createSkill = async (req, res) => {
  try {

    const { category, experience, workNature, hourlyRate } = req.body;

    const skill = await Skill.create({
      category,
      experience,
      workNature,
      hourlyRate,
      providerId: req.user.id
    });

    res.status(201).json({
      success: true,
      data: skill
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get all skills for a provider
// @route   GET /api/skills
// @access  Private (Providers only)
const getProviderSkills = async (req, res) => {
  try {
    const skills = await Skill.findAll({
      where: { providerId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private (Skill owner only)
const updateSkill = async (req, res) => {
  try {

    let skill = await Skill.findByPk(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    if (skill.providerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this skill'
      });
    }

    const { category, experience, workNature, hourlyRate } = req.body;

    skill = await skill.update({
      category: category || skill.category,
      experience: experience || skill.experience,
      workNature: workNature || skill.workNature,
      hourlyRate: hourlyRate || skill.hourlyRate
    });

    res.status(200).json({
      success: true,
      data: skill
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private (Skill owner only)
const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByPk(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    if (skill.providerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this skill'
      });
    }

    await skill.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
  createSkill,
  getProviderSkills,
  updateSkill,
  deleteSkill
};
