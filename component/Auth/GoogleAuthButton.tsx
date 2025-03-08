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
    console.log("Google Login Failed");
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      text="signin_with"
      useOneTap={true}
      shape='pill'
      ux_mode='popup'
      use_fedcm_for_prompt={true}
    />
  );
}
