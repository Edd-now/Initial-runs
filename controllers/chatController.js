exports.getMessagesByRoom = async (req, res) => {
    const { roomId } = req.params;
    const page = parseInt(req.query.page) || 1;       // Default: page 1
    const limit = parseInt(req.query.limit) || 20;    // Default: 20 messages
  
    try {
      const totalMessages = await Message.countDocuments({ roomId });
      const messages = await Message.find({ roomId })
        .populate('sender', 'name email role')
        .sort({ createdAt: 1 })                        // Oldest first
        .skip((page - 1) * limit)
        .limit(limit);
  
      res.status(200).json({
        total: totalMessages,
        page,
        limit,
        messages,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Failed to retrieve messages' });
    }
  };