import useAuth from "@api/useAuth";
import useUser from "@store/useUser";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

function ProfileUser() {
  const { getUserById } = useAuth();
  const [user, setUser] = useState({});
  const { token, id } = useUser();
  const fetchDataUser = async () => {
    try {
      const decoded = jwtDecode(token);
      //   let id = decoded.user_id;
      const { success, data } = await getUserById({
        id: id,
      });
      if (data.status != "Error" && success) {
        setUser(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err);
    }
  };
  useEffect(() => {
    fetchDataUser();
  }, []);

  return (
    <>
      <span style={{ display: "flex", alignItems: "baseline" }}>
        <p>UserName</p>:{" "}
        <p style={{ fontWeight: "600", paddingLeft: "4px" }}>{user.userName}</p>
      </span>
      <span style={{ display: "flex", alignItems: "baseline" }}>
        <p>Email address</p>:{" "}
        <p style={{ fontWeight: "600", paddingLeft: "4px" }}>{user.email}</p>
      </span>
      <span style={{ display: "flex", alignItems: "baseline" }}>
        <p>Phone</p>:{" "}
        <p style={{ fontWeight: "600", paddingLeft: "4px" }}>
          {user.phoneNumber}
        </p>
      </span>
    </>
  );
}

export default ProfileUser;
