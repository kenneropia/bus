import { AxiosResponse } from "axios";
import { add, getTime } from "date-fns";
import API from "../api";
import { z } from "zod";
import { EntityType } from "../../../server/src/db";

export type LoginedUser = EntityType.User & {
  token: string;
  jwt_created_at: number;
  jwt_expired_at: number;
};

export type LoginData = Pick<LoginedUser, "email" | "password">;

export const getUser = () => {
  const user = JSON.parse(
    localStorage.getItem("user") as string
  ) as LoginedUser;
  if (!user || Date.now() > user.jwt_expired_at) {
    return null;
  } else if (user) {
    return user;
  }
};

const makeLoginAPIRequest = async (loginData: LoginData) => {
  const {
    data: { name, id, email, token, role,verified },
  } = await API.post("/user/login", loginData);
console.log(verified);

  let user = {
    name: name,
    id,
    email,
    role,
    token: token,
    verified,
    jwt_created_at: Date.now(),
    jwt_expired_at: getTime(add(Date.now(), { days: 29 })),
  };

  localStorage.setItem("user", JSON.stringify(user));
  return user;
};
export interface SignedUser {
  email: string | Blob;
  role: string | Blob;
  password: string | Blob;
  destination?: string | Blob;
  licence?: null | File;
}
export const signup = async (signinData: SignedUser) => {
  console.log(signinData);
  let { data } = await API.post<EntityType.User>("/user/signup", signinData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const login = async (loginData: LoginData) => {
  let user = await makeLoginAPIRequest(loginData);
  return user;
};

export const logOut = () => localStorage.removeItem("user");
