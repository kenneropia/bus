import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ZodError, z } from "zod";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.getUser()) {
      navigate("/");
    }
  }, []);

  const handleClick = async (e: any) => {
    e.preventDefault();

    const loginSchema = z
      .object({
        email: z.string().email().max(35),
        password: z.string().min(8).max(15),
      })
      .required();

    try {
      const result = loginSchema.parse(form, { path: [] });
      console.log(result);
    } catch (err: any) {
      console.log(err.issues);
      setErrorMessage(err.issues[0].path[0] + ": " + err.issues[0].message);
      return;
    }

    try {
      await auth.login(form);
      toast.success("Login successful");
      setErrorMessage("");
      navigate("/");
    } catch (err: any) {
      setErrorMessage(err.response.data.message);
      console.log(err.response.data.message);
    }
  };
  return (
    <div className="flex items-center justify-center w-full p-4 bg-white">
      <div className="flex-col items-center w-full max-w-screen-md p-3 pt-5 m-4 mx-auto my-10 mt-20 bg-white border-2 shadow-md md:w-6/12">
        <p className="inline-flex w-full text-lg ">Log into your account.</p>
        <form className="flex flex-col items-start w-full mt-2 space-y-5">
          <div className="w-full">
            <label className="block w-full" htmlFor="email">
              Email
            </label>
            <input
              required={true}
              type="email"
              className="w-full p-2 border rounded outline-2"
              onChange={(e) =>
                setForm((prev) => {
                  return { ...prev, email: e.target.value.trim() };
                })
              }
              value={form.email}
              id="Email"
              name="email"
              placeholder="Email"
            />
          </div>
          <div className="w-full">
            <label className="block w-full" htmlFor="password">
              Password
            </label>
            <input
              required={true}
              className="w-full p-2 border rounded outline-2 "
              onChange={(e) =>
                setForm((prev) => {
                  return { ...prev, password: e.target.value.trim() };
                })
              }
              type="password"
              minLength={8}
              value={form.password}
              id="password"
              placeholder="password"
              name="password"
            />
          </div>

          {errorMessage && (
            <p className="text-sm font-medium text-red-500">{errorMessage}</p>
          )}

          <button
            onClick={handleClick}
            className="px-4 py-2 text-white bg-blue-700 border rounded"
            disabled={(!form.email && true) || (!form.password && true)}
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
