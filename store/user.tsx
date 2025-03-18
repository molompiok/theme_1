import { create } from "zustand";
import { combine, createJSONStorage, persist } from "zustand/middleware";
import { api, BASE_URL } from "../api";
import { toast } from "react-hot-toast";
import { BsCheckCircle, BsXCircle } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";
import { Adresse, PhoneNumber } from "../pages/type";


interface AxiosError extends Error {
  response?: {
    status: number;
    data: any;
  };
}


type User = {
  id: string;
  email: string;
  full_name: string;
  photo: string[];
  addresses : Adresse[];
  phone_numbers : PhoneNumber[]
} | null;

interface AuthState {
  user: User;
  wasLoggedIn: boolean;
  fetchUser: () => Promise<void>;
  register_mdp: (info: {
    email: string;
    password: string;
    full_name: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}


const getModalAuth = () => {
  if (typeof useModalAuth === "undefined") {
    console.warn("useModalAuth is not initialized");
    return { getState: () => ({ close: () => {} }) };
  }
  return useModalAuth;
};


const toastOptions = {
  duration: 4000,
  style: {
    maxWidth: "400px",
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    combine(
      {
        user: null as User,
        wasLoggedIn: false,
        fetchUser: async () => {},
        register_mdp: async () => {},
        logout: async () => {},
      },
      (set) => ({
        fetchUser: async () => {
          try {
            const { data } = (await api.get("/me")) as { data: { user: User } };
            if (!data?.user) throw new Error("No user data received");

            set({ user: data.user, wasLoggedIn: true });
            getModalAuth().getState().close();

            if (!localStorage.getItem("hasShownWelcome")) {
              toast.custom(
                (t) => (
                  <div
                    className={`flex items-center gap-3 p-4 bg-white border-l-4 border-green-500 rounded-lg shadow-lg transition-all duration-500 ease-in-out ${
                      t.visible ? "opacity-100 scale-100 animate-bounce" : "opacity-0 scale-95"
                    }`}
                  >
                    <BsCheckCircle className="w-6 h-6 text-green-600" />
                    <div className="flex items-center gap-2 text-green-800 font-medium">
                      <img className="size-8 rounded-full" src={'https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ='} />
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
            set({ user: null });
            const err = error as AxiosError;
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
        }) => {
          try {
            if (!info.email || !info.password || !info.full_name) {
              throw new Error("Missing required fields");
            }

            const { data } = await api.post("/register", info);
            if (!data?.user) throw new Error("No user data received");

            set({ user: data.user, wasLoggedIn: true });
            getModalAuth().getState().close();

            toast.custom(
              (t) => (
                <div className="flex items-center animate-bounce gap-3 p-4 bg-blue-100 border-l-4 border-blue-500 rounded-lg shadow-lg">
                  <BsCheckCircle className="w-6 h-6 text-blue-600" />
                  <p className="text-blue-800 font-medium">
                    Inscription réussie 🎉 Bienvenue {data.user.full_name} !
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

        logout: async () => {
          try {
            await api.post("/logout");
            set({ user: null });
            localStorage.removeItem("hasShownWelcome");

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
                { ...toastOptions, id: "logout-success" ,duration: 6000 }
              );
              localStorage.setItem("hasShownLogout", "true");
            }
          } catch (error) {
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
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      partialize: (state) => ({
        user: state.user,
        wasLoggedIn: state.wasLoggedIn,
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
