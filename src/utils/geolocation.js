"use client"
import Cookies from "js-cookie";

export const getGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          Cookies.set('geolocation', JSON.stringify({ latitude, longitude }), { expires: 1 }); // Expires in 1 day
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };