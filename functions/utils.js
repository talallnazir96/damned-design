import { NotificationManager } from "react-notifications";
export const createNotification = (type, message, title) => {
  switch (type) {
    case "info":
      NotificationManager?.info(message, title, 3000, () => {
        // alert('callback')
      });
      break;
    case "success":
      NotificationManager?.success(message, title, 1000, () => {
        // alert('callback')
      });
      break;
    case "warning":
      NotificationManager?.warning(message, title, 3000, () => {
        // alert('callback')
      });
      break;
    case "error":
      NotificationManager?.error(message, title, 3000, () => {
        // alert('callback')
      });
      break;
  }
};
export const accessCookie = (cookieName) => {
  if (typeof window !== "undefined") {
    // browser code

    var name = cookieName + "=";
    var allCookieArray = document.cookie.split(";");
    for (var i = 0; i < allCookieArray.length; i++) {
      var temp = allCookieArray[i].trim();
      if (temp.indexOf(name) == 0)
        return temp.substring(name.length, temp.length);
    }
    return "";
  }
};

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
