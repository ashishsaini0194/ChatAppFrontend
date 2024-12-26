export const showNotification = ({
  title = "Chat app",
  message = "New Notifcation",
  imageUrl = "https://www.vkf-renzel.com/out/pictures/generated/product/1/356_356_75/r12044336-01/general-warning-sign-10836-1.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500",
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
