const Notification = require('../models/Notification');

exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Could not fetch notifications' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id);
    if (!notif || notif.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Notification not found or unauthorized' });
    }

    notif.read = true;
    await notif.save();
    res.status(200).json({ msg: 'Marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to mark as read' });
  }
};