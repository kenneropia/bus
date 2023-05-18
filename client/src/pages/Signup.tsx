import { ChangeEventHandler, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { SignedUser } from "../context/utils";

import API from "src/api";
import { z } from "zod";
import { destinations as allDestinations } from "src/utils/helpers";

enum Role {
  student,
  driver,
  admin,
}
const role = ["student", "driver"];

export default function Signup() {
  const [destinations, setDestinations] = useState<Array<string>>([]);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    role: "student",
    destination: "",
  });
  const [image, setImage] = useState<File | null>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinations = async () => {
      const fetchedDestinations = await API.get("/destination/generate-slots");

      setDestinations(fetchedDestinations.data.destinations);
    };
    fetchDestinations();
  }, []);
  useEffect(() => {
    if (auth.getUser()) {
      navigate("/");
    }
  }, []);

  const handleClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const signupSchema = z
        .object({
          email: z.string().email(),
          password: z.string().min(8),

          name: z.string().min(3),
        })
        .required();

      try {
        const result = signupSchema.parse(form, { path: [] });
        console.log(result);
      } catch (err: any) {
        console.log(err.issues);
        setErrorMessage(err.issues[0].path[0] + ": " + err.issues[0].message);
        return;
      }
      const formData = new FormData();
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("role", form.role);
      formData.append("name", form.name);
      if (image) formData.append("licence", image);
      formData.append("destination", form.destination);

      await auth.signup(formData as unknown as SignedUser);
      toast.success("Signup successful");
      setErrorMessage("");
      navigate("/login");
    } catch (err: any) {
      setErrorMessage(err.response.data.message);
    }
  };

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    if (event.target.files) {
      setImage(event.target.files[0]);
    }
  }

  return (
    <div className="flex items-center justify-center w-full p-4 bg-white">
      <div className="flex-col items-center w-full max-w-screen-md p-3 pt-5 m-4 mx-auto my-10 mt-20 bg-white border-2 shadow-md md:w-6/12">
        <p className="inline-flex w-full text-lg ">Sign into your account.</p>
        <form
          onSubmit={handleClick}
          className="flex flex-col items-start w-full mt-2 space-y-5"
        >
          <div className="w-full">
            <label className="block w-full" htmlFor="email">
              Email
            </label>
            <input
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
              required={true}
              placeholder="Email"
            />
          </div>
          <div className="w-full">
            <label className="block w-full" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded outline-2"
              onChange={(e) =>
                setForm((prev) => {
                  return { ...prev, name: e.target.value.trim() };
                })
              }
              value={form.name}
              id="name"
              name="name"
              required={true}
              placeholder="Name"
            />
          </div>
          <div className="w-full">
            <label className="block w-full" htmlFor="password">
              Password
            </label>
            <input
              className="w-full p-2 border rounded outline-2 "
              onChange={(e) =>
                setForm((prev) => {
                  return { ...prev, password: e.target.value.trim() };
                })
              }
              required={true}
              type="text"
              minLength={8}
              value={form.password}
              id="password"
              placeholder="password"
              name="password"
            />
          </div>
          <div className="w-full">
            <label className="block w-full" htmlFor="role">
              Account Type
            </label>
            <select
              className="w-full p-2 border rounded outline-2"
              onChange={(e) =>
                setForm((prev) => {
                  return { ...prev, role: e.target.value };
                })
              }
              value={form.role}
              id="role"
              name="role"
            >
              {role.map((item) => {
                return (
                  <option key={item} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
          </div>

          {form.role == "driver" && (
            <div className="w-full">
              <label className="block w-full" htmlFor="role">
                Destinations
              </label>
              <select
                defaultValue={destinations[0]}
                className="w-full p-2 border rounded outline-2"
                onChange={(e) =>
                  setForm((prev) => {
                    return { ...prev, destination: e.target.value };
                  })
                }
                required={true}
                id="role"
                name="role"
              >
                {destinations.map((item) => {
                  return (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
          {form.role == "driver" && (
            <div className="w-full">
              <label className="block w-full ">Driver Licence</label>
              <input
                required={true}
                width="48"
                height="48"
                type="file"
                accept="image/*"
                name="image"
                onChange={handleImageChange}
              />
            </div>
          )}
          {errorMessage && (
            <p className="text-sm font-medium text-red-500">{errorMessage}</p>
          )}
          <button
            className="px-4 py-2 text-white bg-blue-700 border rounded disabled:bg-gray-400"
            disabled={
              (!form.email && true) ||
              (!form.password && true) ||
              (!form.role && true) ||
              (!image && form.role == "driver" && true)
            }
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
