const notificationController = require("../controllers/notificationController");

module.exports = (app) => {

app.post('/api/AddNotif', notificationController.createNotification);

app.get('/api/AllNotifications', notificationController.getAllNotifications);

app.get('/api/UnreadNotif', notificationController.getUnreadNotifications);

app.put('/api/readNotif/:NotificationId', notificationController.markAsRead);

app.delete('/api/DeleteNotif/:NotificationId', notificationController.deleteNotification);

};
