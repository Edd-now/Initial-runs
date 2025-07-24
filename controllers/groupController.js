const Group = require('../models/Group');

exports.createGroup = async (req, res) => {
  const { name, description, isPrivate } = req.body;
  const userId = req.user.id;

  try {
    const group = new Group({
      name,
      description,
      isPrivate,
      members: [userId],
      createdBy: userId,
    });
    await group.save();

    res.status(201).json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Could not create group' });
  }
};

exports.joinGroup = async (req, res) => {
  const groupId = req.params.id;
  const userId = req.user.id;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ msg: 'Group not found' });

    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
    }

    res.status(200).json({ msg: 'Joined group', group });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Could not join group' });
  }
};

exports.leaveGroup = async (req, res) => {
    const groupId = req.params.id;
    const userId = req.user.id;
  
    try {
      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ msg: 'Group not found' });
  
      if (!group.members.includes(userId)) {
        return res.status(400).json({ msg: 'You are not a member of this group' });
      }
  
      group.members = group.members.filter((memberId) => memberId.toString() !== userId);
      await group.save();
  
      res.status(200).json({ msg: 'You left the group' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Failed to leave group' });
    }
  };

  exports.kickUser = async (req, res) => {
    const groupId = req.params.id;
    const targetUserId = req.body.userId;
    const requesterId = req.user.id;
  
    try {
      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ msg: 'Group not found' });
  
      // Only the creator can kick
      if (group.createdBy.toString() !== requesterId) {
        return res.status(403).json({ msg: 'Only the group creator can kick users' });
      }
  
      if (!group.members.includes(targetUserId)) {
        return res.status(400).json({ msg: 'User is not in the group' });
      }
  
      group.members = group.members.filter((memberId) => memberId.toString() !== targetUserId);
      await group.save();
  
      res.status(200).json({ msg: 'User removed from group' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Failed to remove user' });
    }
  };

  exports.getMyGroups = async (req, res) => {
    const userId = req.user.id;
  
    try {
      const groups = await Group.find({ members: userId }).populate('createdBy', 'name email');
  
      res.status(200).json(groups);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Failed to get your groups' });
    }
  };

  exports.getPublicGroups = async (req, res) => {
    try {
      const groups = await Group.find({ isPrivate: false }).populate('createdBy', 'name email');
  
      res.status(200).json(groups);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Failed to get public groups' });
    }
  };

  exports.editGroup = async (req, res) => {
    const groupId = req.params.id;
    const userId = req.user.id;
    const { name, description, isPrivate } = req.body;
  
    try {
      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ msg: 'Group not found' });
  
      // Only creator can edit
      if (group.createdBy.toString() !== userId) {
        return res.status(403).json({ msg: 'Only the group creator can edit this group' });
      }
  
      if (name) group.name = name;
      if (description !== undefined) group.description = description;
      if (isPrivate !== undefined) group.isPrivate = isPrivate;
  
      await group.save();
      res.status(200).json({ msg: 'Group updated', group });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Failed to edit group' });
    }
  };

  exports.deleteGroup = async (req, res) => {
    const groupId = req.params.id;
    const userId = req.user.id;
  
    try {
      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ msg: 'Group not found' });
  
      if (group.createdBy.toString() !== userId) {
        return res.status(403).json({ msg: 'Only the group creator can delete this group' });
      }
  
      await group.deleteOne();
      res.status(200).json({ msg: 'Group deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Failed to delete group' });
    }
  };

  exports.addAdmin = async (req, res) => {
    const groupId = req.params.id;
    const { userId } = req.body; // ID of user to promote
    const requesterId = req.user.id;
  
    try {
      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ msg: 'Group not found' });
  
      const isRequesterAdmin =
        group.createdBy.toString() === requesterId ||
        group.admins.map(String).includes(requesterId);
  
      if (!isRequesterAdmin) {
        return res.status(403).json({ msg: 'Only admins can promote users' });
      }
  
      const isMember = group.members.map(String).includes(userId);
      if (!isMember) {
        return res.status(400).json({ msg: 'User must be a group member' });
      }
  
      if (!group.admins.map(String).includes(userId)) {
        group.admins.push(userId);
        await group.save();
      }
  
      res.status(200).json({ msg: 'User promoted to admin', group });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Failed to promote user' });
    }
  };
  
  exports.removeAdmin = async (req, res) => {
    const groupId = req.params.id;
    const { userId } = req.body; // The ID of the admin to be removed
    const requesterId = req.user.id;
  
    try {
      const group = await require('../models/Group').findById(groupId);
      if (!group) return res.status(404).json({ msg: 'Group not found' });
  
      // Only the creator or existing admins can remove admin privileges.
      const isRequesterAdmin =
        group.createdBy.toString() === requesterId ||
        group.admins.map(String).includes(requesterId);
  
      if (!isRequesterAdmin) {
        return res.status(403).json({ msg: 'Only admins can remove admin privileges' });
      }
  
      // Prevent removing the group creator’s privileges.
      if (group.createdBy.toString() === userId) {
        return res.status(400).json({ msg: 'Cannot remove admin privileges from the group creator' });
      }
  
      // Check if the target user is currently an admin.
      if (!group.admins.map(String).includes(userId)) {
        return res.status(400).json({ msg: 'User is not an admin' });
      }
  
      group.admins = group.admins.filter((memberId) => memberId.toString() !== userId);
      await group.save();
  
      res.status(200).json({ msg: 'Admin privileges removed', group });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Failed to remove admin privileges' });
    }
  };

  exports.getGroupAdmins = async (req, res) => {
    const groupId = req.params.id;
  
    try {
      const group = await require('../models/Group')
        .findById(groupId)
        .populate('admins', 'name email');
      if (!group) return res.status(404).json({ msg: 'Group not found' });
  
      res.status(200).json({ admins: group.admins });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Failed to retrieve group admins' });
    }
  };