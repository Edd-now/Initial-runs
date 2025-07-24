const JournalEntry = require('../models/JournalEntry');

exports.createEntry = async (req, res) => {
  try {
    const { title, content, mood } = req.body;
    const newEntry = await JournalEntry.create({
      user: req.user.id,
      title,
      content,
      mood,
    });
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create journal entry', error: err.message });
  }
};

exports.getAllEntries = async (req, res) => {
    try {
      const entries = await JournalEntry.find({ user: req.user.id })
        .populate('mood')
        .sort({ createdAt: -1 });
      res.json(entries);
    } catch (err) {
      res.status(500).json({
        message: 'Failed to fetch journal entries',
        error: err.message
      });
    }
  };
  

exports.getUserEntries = async (req, res) => {
  try {
    const entries = await JournalEntry.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch journal entries', error: err.message });
  }
};

exports.getEntryById = async (req, res) => {
    try {
      const { id } = req.params;
      const entry = await JournalEntry.findOne({ _id: id, user: req.user.id }).populate('mood');
      if (!entry) return res.status(404).json({ message: 'Entry not found' });
      res.status(200).json(entry);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch journal entry', error: err.message });
    }
  };

exports.updateEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await JournalEntry.findOneAndUpdate(
      { _id: id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.status(200).json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update entry', error: err.message });
  }
};

exports.deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await JournalEntry.findOneAndDelete({ _id: id, user: req.user.id });
    if (!deleted) return res.status(404).json({ message: 'Entry not found' });
    res.status(200).json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete entry', error: err.message });
  }
};