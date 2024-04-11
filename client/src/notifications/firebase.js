// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAyXorlgWwWIkO_EaCZDgxIFBGU5gEPkKk",
  authDomain: "pushnotifications-36fd2.firebaseapp.com",
  projectId: "pushnotifications-36fd2",
  storageBucket: "pushnotifications-36fd2.appspot.com",
  messagingSenderId: "1082573399094",
  appId: "1:1082573399094:web:22dedbe732e3609e8b6497",
  measurementId: "G-PSK43JDYNE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_API_VAPID_KEY,
    });
    // Send the token to your server
    sendTokenToServer(token);
  }
};

const sendTokenToServer = async (token) => {
    // Send token to your server using fetch or any other HTTP library
    try {
        const response = await fetch("api/notification/fcmToken", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ fcmToken: token }),
        });
        if (!response.ok) {
            throw new Error("Failed to send token to server");
        }
        const data = await response.json();
        if (data.message === "User already has an FCM token") {
            // Handle the case where the user already has a token
        } else {
            console.log("Token sent to server successfully");
        }
    } catch (error) {
        console.error("Error sending token to server:", error);
    }
};