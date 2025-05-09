const { Task, Offer, User, TaskProgress } = require('../models/index.js');

module.exports = {
  // @desc    Create new task
  // @route   POST /api/tasks
  // @access  Private (Users only)
  createTask: async (req, res) => {
    try {
      const { 
        category, name, description, expectedStartDate, 
        expectedWorkingHours, hourlyRate, currency 
      } = req.body;

      // Create task
      const task = await Task.create({
        category,
        name,
        description,
        expectedStartDate,
        expectedWorkingHours,
        hourlyRate,
        currency,
        userId: req.user.id
      });

      res.status(201).json({
        success: true,
        data: task
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'Server Error'
      });
    }
  },

  // @desc    Get all tasks
  // @route   GET /api/tasks
  // @access  Private
  getTasks: async (req, res) => {
    try {
      let tasks;
      const isUser = req.user.role === 'user';
      const whereCondition = isUser ?{ userId: req.user.id }: { status: 'open' };
      tasks = await Task.findAll({
        where: whereCondition,
        order: [['createdAt', 'DESC']]
      });
      res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'Server Error'
      });
    }
  },

  // @desc    Get task by ID
  // @route   GET /api/tasks/:id
  // @access  Private
  getTask: async (req, res) => {
    try {
      const isUser = req.user.role === 'user';
      const includeCondition = []
      if(!isUser){
        includeCondition.push({
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        })
      }
      const task = await Task.findByPk(req.params.id, {
        include: includeCondition
      });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      
      // Check if user is authorized to view this task
      const isTaskOwner = task.userId === req.user.id;
      
      if (isUser && !isTaskOwner) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this task'
        });
      }

      res.status(200).json({
        success: true,
        data: task
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'Server Error'
      });
    }
  },

  // @desc    Update task
  // @route   PUT /api/tasks/:id
  // @access  Private (Task owner only)
  updateTask: async (req, res) => {
    try {
      let task = await Task.findByPk(req.params.id);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      // Make sure user is task owner
      if (task.userId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this task'
        });
      }

      const { 
        category, name, description, expectedStartDate, 
        expectedHours, hourlyRate, rateCurrency,status
      } = req.body;

      task = await task.update({
        category: category || task.category,
        name: name || task.name,
        description: description || task.description,
        expectedStartDate: expectedStartDate || task.expectedStartDate,
        expectedHours: expectedHours || task.expectedHours,
        hourlyRate: hourlyRate || task.hourlyRate,
        rateCurrency: rateCurrency || task.rateCurrency,
        status: status || task.status
      });

      res.status(200).json({
        success: true,
        data: task
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'Server Error'
      });
    }
  },

  // @desc    Update task progress
  // @route   POST /api/tasks/:id/progress
  // @access  Private (Assigned provider only)
  updateTaskProgress: async (req, res) => {
    try {
      const { description } = req.body;
      
      if (!description) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a progress description'
        });
      }

      const task = await Task.findByPk(req.params.id);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      // Make sure user is the assigned provider
      if (task.assignedProviderId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this task progress'
        });
      }

      // Make sure task is in progress
      if (task.status !== 'in_progress' && task.status !== 'assigned') {
        return res.status(400).json({
          success: false,
          message: 'Task must be in progress to update'
        });
      }

      // If task is assigned but not yet in progress, update it
      if (task.status === 'assigned') {
        await task.update({ status: 'in_progress' });
      }

      // Create progress update
      const progress = await TaskProgress.create({
        taskId: task.id,
        description,
        providerId: req.user.id
      });

      res.status(201).json({
        success: true,
        data: progress
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'Server Error'
      });
    }
  },

  // @desc    Mark task as completed
  // @route   PUT /api/tasks/:id/complete
  // @access  Private (Assigned provider only)
  completeTask: async (req, res) => {
    try {
      const task = await Task.findByPk(req.params.id);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      // Make sure user is the assigned provider
      if (task.assignedProviderId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to complete this task'
        });
      }

      // Make sure task is in progress
      if (task.status !== 'in_progress') {
        return res.status(400).json({
          success: false,
          message: 'Task must be in progress to mark as completed'
        });
      }

      // Update task status
      await task.update({ status: 'completed' });

      // Add a final progress update if description is provided
      const { description } = req.body;
      if (description) {
        await TaskProgress.create({
          taskId: task.id,
          description,
          providerId: req.user.id
        });
      }

      res.status(200).json({
        success: true,
        data: task
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'Server Error'
      });
    }
  },

  // @desc    Accept/reject task completion
  // @route   PUT /api/tasks/:id/acceptance
  // @access  Private (Task owner only)
  handleTaskCompletion: async (req, res) => {
    try {
      const { status } = req.body;
      
      if (!status || !['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid status (accepted/rejected)'
        });
      }

      const task = await Task.findByPk(req.params.id);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      // Make sure user is task owner
      if (task.userId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to accept/reject this task'
        });
      }

      // Make sure task is completed
      if (task.status !== 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Task must be completed to accept/reject'
        });
      }

      // Update task status
      await task.update({ status });

      res.status(200).json({
        success: true,
        data: task
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'Server Error'
      });
    }
  }
};