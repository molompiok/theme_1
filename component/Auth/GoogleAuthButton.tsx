// import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
// import { api } from "../../api";
// import { useAuthStore } from "../../store/user";

// export default function GoogleAuthButton() {
//   const handleSuccess = async (credentialResponse: CredentialResponse) => {
//     try {
//       await api.api?.post("/v1/auth/google_callback", { token: credentialResponse.credential });
//       useAuthStore.getState().fetchUser();
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   const handleError = () => {
//     console.info("Google Login Failed");
//   };

//   return (
//     <GoogleLogin
//       onSuccess={handleSuccess}
//       onError={handleError}
//       cancel_on_tap_outside={false}
//       text="signin_with"
//       size="large"
//       useOneTap={true}
//       shape='pill'
//       ux_mode='popup'
//       use_fedcm_for_prompt={true}
//     />
//   );
// }


// http://server.sublymus-server.com/auth/store/google/redirect?store_id=70b321f3-0eab-49da-8f09-5a4f1afe505b&client_success=http://localhost:3000/auth/success&client_error=http://localhost:3000/auth/error
