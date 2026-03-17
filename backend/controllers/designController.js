const Design = require('../models/Design');
const User = require('../models/User');

exports.getDesigns = async (req, res) => {
  try {
    const designs = await Design.find().populate('roomId');
    res.json(designs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createDesign = async (req, res) => {
  try {
    const design = new Design(req.body);
    const newDesign = await design.save();
    
    // Update user design count
    if (newDesign.userId) {
      await User.findByIdAndUpdate(newDesign.userId, { $inc: { designCount: 1 } });
    }
    
    res.status(201).json(newDesign);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) return res.status(404).json({ message: 'Design not found' });
    
    const userId = design.userId;
    await Design.findByIdAndDelete(req.params.id);
    
    // Update user design count
    if (userId) {
      await User.findByIdAndUpdate(userId, { $inc: { designCount: -1 } });
    }
    
    res.json({ message: 'Design deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
