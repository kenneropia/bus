import React, { useState, useEffect } from "react";

import { EntityType } from "src/api/schema";
import API from "../../api";
import Loading from "../../components/Loading";
import SearchForm from "src/components/SearchForm";
import useAuth from "src/hooks/useAuth";
import { toast } from "react-hot-toast";

const UserList = () => {
  type TypedUser = EntityType.User;
  const [users, setUser] = useState<TypedUser[]>([]);
  const [search, setSearch] = useState<string>("");
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    API.get("/user", { params: { search } })
      .then((response) => {
        setUser(response.data.users);
      })
      .catch((error) => {
        console.log(error);
      });
    setIsLoading(false);
  }, [search]);

  const handleRejectUser = async (userId: string) => {
    try {
      const shouldReject = confirm(
        "Are you sure, you want to delete this person?"
      );
      console.log(shouldReject);
      if (shouldReject) {
        await API.delete<{ user: TypedUser }>(`/user/${userId}`);
        const updatedUser = users.filter((user) => user.id !== userId);
        toast("user has been deleted successfully");
        setUser(updatedUser);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleVerifyUser = async (userId: string) => {
    try {
      const {
        data: { user: newUser },
      } = await API.patch<{ user: TypedUser }>(`/user/${userId}/verify`);
      const updatedUser = users.map((user) => {
        if (user.id !== newUser.id) {
          return user;
        }
        return newUser;
      });
      toast("user has been verified successfully");
      setUser(updatedUser);
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) return <Loading />;
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <SearchForm searchQuery={search} setSearchQuery={setSearch} />
      <table className="w-full border-collapse">
        <thead className="bg-gray-200">
          <tr className="[&>*]:w-[14%]">
            <th className="p-2 text-left">S/N</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Account Type</th>
            <th className="p-2 text-left">Date Created</th>
            <th className="p-2 text-left">Licence</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr key={user.id} className="space-x-5 border-b border-gray-300">
              <td className="p-2">{1 + idx}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2">{user.createdAt as unknown as string}</td>
              <td className="w-10 p-2 ">
                {user.role == "driver" ? (
                  <img
                    className="active:scale-[2.9] hover:scale-[2.9] delay-500"
                    src={
                      ("https://bus-5htr.onrender.com" +
                        user.driverLicense) as string
                    }
                    alt=""
                  />
                ) : (
                  "none"
                )}
              </td>
              <td className="inline-flex flex-wrap p-2">
                <button
                  onClick={async () => await handleVerifyUser(user.id)}
                  disabled={user.verified ? true : false}
                  className={`${
                    user.verified && "disabled:bg-gray-400"
                  } px-4 py-2 text-white transition-colors bg-green-500 rounded-md md:mr-5 hover:bg-green-800`}
                >
                  {user.verified ? "Verified" : "Verify"}
                </button>

                <button
                  onClick={async () => await handleRejectUser(user.id)}
                  className="px-4 py-2 text-white bg-red-500 rounded-md md:mr-5 hover:bg-red-800"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
