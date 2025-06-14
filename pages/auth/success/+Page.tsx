import React, { useEffect, useState } from "react";
import { navigate } from "vike/client/router";
import { useAuthStore } from "../../../store/user";
import { useMergeCart } from "../../../hook/query/useMergeCart";
import { usePageContext } from "vike-react/usePageContext";

export default function Page() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState<string>("Processing your login...");

  const { apiUrl, serverUrl, api } = usePageContext()
  const { mutate } = useMergeCart(api)

  useEffect(() => {
    const processToken = async () => {
      setStatus("loading");
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get("token");
      console.log("🚀 ~ processToken ~ token:", token)
      // const expiresAt = searchParams.get('expires_at'); // Vous pouvez aussi récupérer expires_at si besoin

      if (!token) {
        setMessage("Authentication token not found in URL.");
        setStatus("error");
        // Optionnel: rediriger vers la page de login après un délai
        setTimeout(() => navigate("/"), 3000);
        return;
      }

      try {
        useAuthStore
          .getState()
          .fetchUser(api, { token })
          .then(() => {
            mutate()
            setStatus("success");
            setMessage("Successfully logged in! Redirecting...");
            setTimeout(() => navigate("/profile"), 1500);
          })
          .catch((error) => {
            console.error("Error processing token:", error);
            setMessage("An unexpected error occurred. Please try again.");
            setStatus("error");
            setTimeout(() => navigate("/"), 5000);
          });
      } catch (err) {
        console.error("Error processing token:", err);
        setMessage("An unexpected error occurred. Please try again.");
        setStatus("error");
        setTimeout(() => navigate("/"), 5000);
      }
    };

    processToken();
  }, [navigate]); // Dépendances de useEffect

  const getStatusStyles = () => {
    switch (status) {
      case "loading":
        return "text-blue-600";
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-700";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white  text-center">
        {status === "loading" && (
          <svg
            className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {status === "success" && (
          <svg
            className="h-12 w-12 text-green-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        )}
        {status === "error" && (
          <svg
            className="h-12 w-12 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        )}
        <h1 className={`text-3xl font-semibold mb-2 ${getStatusStyles()}`}>
          {status === "loading" && "Processing Login"}
          {status === "success" && "Login Successful"}
          {status === "error" && "Login Failed"}
        </h1>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
