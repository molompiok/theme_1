import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { api } from "../../api";
import { useAuthStore } from "../../store/user";

export default function GoogleAuthButton() {
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      await api.post("/google_callback", { token: credentialResponse.credential });
      useAuthStore.getState().fetchUser();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleError = () => {
    console.info("Google Login Failed");
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      cancel_on_tap_outside={false}
      text="signin_with"
      size="large"
      useOneTap={true}
      shape='pill'
      ux_mode='popup'
      use_fedcm_for_prompt={true}
    />
  );
}
