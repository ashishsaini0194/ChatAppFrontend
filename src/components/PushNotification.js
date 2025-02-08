export const showNotification = ({
  title = "Chat app",
  message = "New Notifcation",
  imageUrl = "../../public/Images/warningSign.jpg",
}) => {
  const options = {
    body: message,
    icon: imageUrl,
  };
  try {
    const notification = new Notification(title, options);
    setTimeout(() => {
      notification.close();
    }, 3000);
  } catch (e) {
    console.log("Notification Api not supported!", e);
  }
};
