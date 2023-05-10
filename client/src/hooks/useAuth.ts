import { useState, createContext, useContext } from "react";
import {
  login as userLogin,
  signup,
  logOut as userLogout,
  getUser,
  LoginData,
} from "../context/utils";
import { EntityType } from "../api/schema";

function useAuth() {
  const [user, setUser] = useState<EntityType.User | {}>({});
  // Login updates the user data with a name parameter
  const login = async (loginForm: LoginData) => {
    const user = await userLogin(loginForm);
    setUser(user);
  };

  // Logout updates the user data to default
  const logout = () => {
    userLogout();
    setUser({});
  };
  const UserContext = createContext({ user, login, logout, getUser, signup });
  return useContext(UserContext);
}

export default useAuth;
