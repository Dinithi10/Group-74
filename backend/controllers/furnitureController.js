const Furniture = require('../models/Furniture');

exports.getFurnitureByRoom = async (req, res) => {
  try {
    const furniture = await Furniture.find({ roomId: req.params.roomId });
    res.json(furniture);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addFurniture = async (req, res) => {
  try {
    const furniture = new Furniture(req.body);
    const newFurniture = await furniture.save();
    res.status(201).json(newFurniture);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateFurniture = async (req, res) => {
  try {
    const updated = await Furniture.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.removeFurniture = async (req, res) => {
  try {
    await Furniture.findByIdAndDelete(req.params.id);
    res.json({ message: 'Furniture removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
