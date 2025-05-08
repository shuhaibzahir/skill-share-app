const { Offer, Task, User, Sequelize } = require('../models');

// @desc    Create a new offer
// @route   POST /api/offers
// @access  Private (Providers only)
const createOffer = async (req, res) => {
  try {
    

    const { taskId, proposedRate, proposedHours, message } = req.body;

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (task.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Cannot make an offer on a task that is not open'
      });
    }

    const existingOffer = await Offer.findOne({
      where: {
        taskId,
        providerId: req.user.id
      }
    });

    if (existingOffer) {
      return res.status(400).json({
        success: false,
        message: 'You have already made an offer for this task'
      });
    }

    const offer = await Offer.create({
      taskId,
      providerId: req.user.id,
      proposedRate,
      proposedHours,
      message: message || null
    });

    res.status(201).json({
      success: true,
      data: offer
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get all offers for a task
// @route   GET /api/tasks/:taskId/offers
// @access  Private (Task owner only)
const getTaskOffers = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (task.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view offers for this task'
      });
    }

    const offers = await Offer.findAll({
      where: { taskId },
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'firstName', 'lastName', 'email', 'mobileNumber']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Accept/reject an offer
// @route   PUT /api/offers/:id/status
// @access  Private (Task owner only)
const updateOfferStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status (accepted/rejected)'
      });
    }

    const offer = await Offer.findByPk(req.params.id, {
      include: [{ model: Task, as: 'task' }]
    });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    if (offer.task.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this offer'
      });
    }

    if (offer.task.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update offer when task is not open'
      });
    }

    await offer.update({ status });

    if (status === 'accepted') {
      await offer.task.update({
        status: 'assigned',
        assignedProviderId: offer.providerId
      });

      await Offer.update(
        { status: 'rejected' },
        {
          where: {
            taskId: offer.taskId,
            id: { [Sequelize.Op.ne]: offer.id }
          }
        }
      );
    }

    res.status(200).json({
      success: true,
      data: offer
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get offers made by provider
// @route   GET /api/offers/provider
// @access  Private (Providers only)
const getProviderOffers = async (req, res) => {
  try {
    const offers = await Offer.findAll({
      where: { providerId: req.user.id },
      include: [
        {
          model: Task,
          as: 'task',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName', 'email']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers
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
  createOffer,
  getTaskOffers,
  updateOfferStatus,
  getProviderOffers
};
