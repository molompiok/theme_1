import { create } from "zustand";
import { combine, createJSONStorage, persist } from "zustand/middleware";
import { toast } from "react-hot-toast";
import { BsCheckCircle, BsXCircle } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";
import { Adresse, PhoneNumber, User } from "../pages/type";
import { ProductMedia } from "../component/ProductMedia";
import { AxiosInstance } from "axios";
import Cookies from "js-cookie";
interface AxiosError extends Error {
  response?: {
    status: number;
    data: any;
  };
}

const getModalAuth = () => {
  if (typeof useModalAuth === "undefined") {
    console.warn("useModalAuth is not initialized");
    return { getState: () => ({ close: () => { } }) };
  }
  return useModalAuth;
};

const toastOptions = {
  duration: 4000,
  style: {
    maxWidth: "400px",
  },
};

export const useAuthStore = create(
  persist(
    combine(
      {
        user: null as User | null,
        token: null as string | null,
        wasLoggedIn: false,
      },
      (set, get) => ({
        fetchUser: async (api: AxiosInstance, data?: { token?: string }) => {
          if (typeof window === "undefined") return;
          const { token } = data || {};

          const tk = token || get().token;
          try {
            const { data } = (await api.get("/v1/auth/me", {
              ...(tk
                ? { headers: { Authorization: `Bearer ${tk}` } }
                : {}),
            })) as {
              data: { user: User; token: string | null };
            };

            if (data.token) {
              Cookies.set('auth-token', data.token, { expires: 7, secure: true, sameSite: 'strict' });
            }
            if (!data?.user) throw new Error("No user data received");

            set({ user: data.user, wasLoggedIn: true, token: token });
            getModalAuth().getState().close();

            if (!localStorage.getItem("hasShownWelcome")) {
              toast.custom(
                (t) => (
                  <div
                    className={`flex items-center gap-3 p-4 bg-white border-l-4 border-green-500 rounded-lg shadow-lg transition-all duration-500 ease-in-out ${t.visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                      }`}
                  >
                    <BsCheckCircle className="w-6 h-6 text-green-600" />
                    <div className="flex items-center gap-2 text-green-800 font-medium">
                      <ProductMedia
                        mediaList={data?.user?.photo || []}
                        productName={data?.user?.full_name || ""}
                        className="size-8 rounded-full"
                        fallbackImage=""
                      />
                      Bienvenue {data?.user?.full_name} 👋
                    </div>
                  </div>
                ),
                { ...toastOptions, id: "auth-success" }
              );
              localStorage.setItem("hasShownWelcome", "true");
              localStorage.removeItem("hasShownLogout");
            }
          } catch (error) {
            set({ user: null, token: null });
            const err = error as AxiosError;
            Cookies.remove('auth-token');
            const message =
              err.response?.status === 401
                ? "Session invalide"
                : "Erreur de connexion ❌";

            toast.custom(
              (t) => (
                <div className="flex items-center animate-bounce gap-3 p-4 bg-red-100 border-l-4 border-red-500 rounded-lg shadow-lg">
                  <BsXCircle className="w-6 h-6 text-red-600" />
                  <p className="text-red-800 font-medium">{message}</p>
                </div>
              ),
              { ...toastOptions, id: "auth-error" }
            );
          }
        },

        register_mdp: async (info: {
          email: string;
          password: string;
          full_name: string;
        }, api: AxiosInstance) => {
          if (typeof window === "undefined") return;
          try {
            if (!info.email || !info.password || !info.full_name) {
              throw new Error("Missing required fields");
            }

            const response = await api.post("/v1/auth/register", info);
            if (!response?.data?.user) throw new Error("No user data received");
            if (response.data.token) {
              Cookies.set('auth-token', response.data.token, { expires: 7, secure: true, sameSite: 'strict' });
            }
            set({
              user: response.data.user,
              wasLoggedIn: true,
              token: response.data.token,
            });
            getModalAuth().getState().close();

            toast.custom(
              (t) => (
                <div className="flex items-center animate-bounce gap-3 p-4 bg-blue-100 border-l-4 border-blue-500 rounded-lg shadow-lg">
                  <BsCheckCircle className="w-6 h-6 text-blue-600" />
                  <p className="text-blue-800 font-medium">
                    Inscription réussie 🎉 Bienvenue{" "}
                    {response?.data.user.full_name} !
                  </p>
                </div>
              ),
              { ...toastOptions, id: "register-success" }
            );
          } catch (error) {
            const err = error as AxiosError;
            const message =
              err.response?.data?.message ||
              "L'inscription a échoué ❌ Vérifiez vos informations";

            toast.custom(
              (t) => (
                <div className="flex items-center gap-3 p-4 animate-bounce bg-red-100 border-l-4 border-red-500 rounded-lg shadow-lg">
                  <BsXCircle className="w-6 h-6 text-red-600" />
                  <p className="text-red-800 font-medium">{message}</p>
                </div>
              ),
              { ...toastOptions, id: "register-error" }
            );
          }
        },

        logout: async (api: AxiosInstance) => {
          try {
            set({ user: null, token: null, wasLoggedIn: false });
            localStorage.removeItem("hasShownWelcome");
            Cookies.remove('auth-token');
            if (!localStorage.getItem("hasShownLogout")) {
              toast.custom(
                (t) => (
                  <div className="flex items-center gap-3 p-4 animate-bounce bg-gray-100 border-l-4 border-gray-500 rounded-lg shadow-lg">
                    <BiLogOut className="w-6 h-6 text-gray-600" />
                    <p className="text-gray-800 font-medium">
                      Déconnexion réussie. À bientôt ! 👋
                    </p>
                  </div>
                ),
                { ...toastOptions, id: "logout-success", duration: 6000 }
              );
              localStorage.setItem("hasShownLogout", "true");
            }
          } catch (error) {
            console.log("🚀 ~ logout: ~ error:", error);
            const err = error as AxiosError;
            toast.custom(
              (t) => (
                <div className="flex items-center gap-3 p-4 animate-bounce bg-red-100 border-l-4 border-red-500 rounded-lg shadow-lg">
                  <BsXCircle className="w-6 h-6 text-red-600" />
                  <p className="text-red-800 font-medium">
                    Erreur lors de la déconnexion ❌
                  </p>
                </div>
              ),
              { ...toastOptions, id: "logout-error" }
            );
            throw err;
          }
        },
      })
    ),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => { },
            removeItem: () => { },
          };
        }
        return localStorage;
      }),
      partialize: (state) => ({
        user: state.user,
        wasLoggedIn: state.wasLoggedIn,
        token: state.token, // Include token in persisted state
      }),
    }
  )
);

interface ModalAuthState {
  isOpen: boolean;
  type: "login" | "register";
  message: string | null;
  open: (type: "login" | "register", message?: string) => void;
  close: () => void;
}

export const useModalAuth = create<ModalAuthState>()(
  combine(
    {
      isOpen: false,
      type: "login" as "login" | "register",
      message: null as string | null,
    },
    (set) => ({
      open: (type: "login" | "register", message?: string) =>
        set({ isOpen: true, type, message: message ?? null }),
      close: () => set({ isOpen: false, type: "login", message: null }),
    })
  )
);
