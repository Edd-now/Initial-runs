const Availability = require('../models/Availability');

exports.setAvailability = async (req, res) => {
  const therapistId = req.user.id;
  const { date, timeSlots } = req.body;

  try {
    let availability = await Availability.findOne({ therapist: therapistId, date });

    if (availability) {
      availability.timeSlots = timeSlots; // overwrite
    } else {
      availability = new Availability({ therapist: therapistId, date, timeSlots });
    }

    await availability.save();
    res.status(200).json({ msg: 'Availability saved', availability });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to set availability' });
  }
};

exports.getAvailability = async (req, res) => {
    const therapistId = req.params.therapistId;
  
    try {
      const availability = await Availability.find({ therapist: therapistId }).sort({ date: 1 });
  
      res.status(200).json(availability);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Failed to get availability' });
    }
  };