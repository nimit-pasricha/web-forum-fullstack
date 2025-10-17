import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export default function Logout(props) {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/v1/logout", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          toast.info("You have been logged out.");
          props.onLogoutSuccess();
          navigate("/");
        } else {
          toast.error("Failed to log out.");
          throw new Error("Failed to log out");
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <h1>Logout</h1>
      <p>You are being logged out...</p>
    </>
  );
}
