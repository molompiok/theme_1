import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { GOOGLE_CLIENT_ID } from "../../api";

;

const GoogleOneTapLogin = ({ onSuccess }: { onSuccess: (token: string) => void }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    const handleGoogleCallback = (response: any) => {
      try {
        const decodedToken: any = jwtDecode(response.credential);
        console.log("Google One Tap Success:", decodedToken);
        onSuccess(response.credential);
      } catch (error) {
        console.error("JWT Decode Error:", error);
      }
    };

    script.onload = () => {
      console.log("accounts?.id One Tap Loaded" , (window as any).google?.accounts?.id);
      console.log("accounts One Tap Loaded" , (window as any).google?.accounts);
      console.log("Google One Tap Loaded" , (window as any).google);
      
      (window as any).google?.accounts?.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
        auto_select: true,
        cancel_on_tap_outside : false,
        itp_support: true,
      });
      (window as any).google?.accounts?.id.cancel(); 
      (window as any).google?.accounts?.id.prompt();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [onSuccess]);

  return null;
};

// export default GoogleOneTapLogin;
