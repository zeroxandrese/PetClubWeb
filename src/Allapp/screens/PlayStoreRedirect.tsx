// src/PlayStoreRedirect.jsx
import React, { useEffect } from 'react';

const PlayStoreRedirect = () => {
  useEffect(() => {
    // Define the deep link URL and fallback URL
    const deepLink = 'petclubcompe://profile/667775c915a3540ca1c760aa';
    const fallbackURL = 'https://petclub.com.pe';

    // Function to handle the redirection
    const handleRedirect = () => {
      // Try to open the app using the deep link
      window.location.href = deepLink;

      // If the app is not installed, redirect to the fallback URL
      setTimeout(() => {
        window.location.href = fallbackURL;
      }, 2000); // Adjust the timeout as needed
    };

    // Call the function to handle deep link redirection
    handleRedirect();
  }, []);

  return (
    <div>
      <h1>Redirigiendo...</h1>
      <p>Si no eres redirigido automáticamente, haz clic en <a href="https://petclub.com.pe">este enlace</a>.</p>
    </div>
  );
};

export { PlayStoreRedirect };