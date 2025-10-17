import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Logout(props) {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/v1/logout", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          alert("You have been logged out");
          props.onLogoutSuccess();
          navigate("/");
        } else {
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
