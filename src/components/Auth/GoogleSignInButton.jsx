import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const GoogleSignInButton = ({ onSuccess, onError }) => {
  const { googleLogin } = useAuth();
  const googleButtonRef = useRef(null);

  useEffect(() => {
    if (window.google && googleButtonRef.current) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.renderButton(
        googleButtonRef.current,
        {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
        }
      );
    }
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      const result = await googleLogin(response.credential);
      if (result.success) {
        onSuccess && onSuccess(result);
      } else {
        onError && onError(result.error);
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
      onError && onError('Google Sign-In failed');
    }
  };

  return (
    <div className="w-full">
      <div ref={googleButtonRef} className="w-full"></div>
    </div>
  );
};

export default GoogleSignInButton;