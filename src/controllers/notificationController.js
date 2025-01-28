const { User, Notification } = require("../db/index.js");

// Create a notification
exports.createNotification = async (req, res) => {
  try {
    const { Content, UserId } = req.body; // Assuming userId is passed for the associated user
    
    const notification = await Notification.create({Content,UserId});// Set the associated user's ID

    res.status(201).json({message: 'Notification created successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating notification' });
  }
};

// Get all notifications with associated user data
exports.getAllNotifications = async (req, res) => {
  try {
    const notificationsList = await Notification.findAll({
      include: {
        model: User,
        attributes: ['UserId', 'Login', 'Email'], // Fetch associated user data
      },
    });

    res.status(200).json(notificationsList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving notifications' });
  }
};

// Get unread notifications with associated user data
exports.getUnreadNotifications = async (req, res) => {
  try {
    const unreadNotifications = await Notification.findAll({
      where: {
        IsRead: false,
      },
      include: {
        model: User,
        attributes: ['UserId', 'Login', 'Email'],
      },
    });

    res.status(200).json(unreadNotifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving unread notifications' });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { NotificationId } = req.params;

    const notification = await Notification.update(
      { IsRead: true },
      {
        where: {
          NotificationId
        },
      }
    );

    if (notification[0] === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({
      message: 'Notification marked as read',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error marking notification as read' });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const { NotificationId } = req.params;

    const deletedNotification = await Notification.destroy({
      where: {
        NotificationId
      },
    });

    if (deletedNotification === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting notification' });
  }
};
