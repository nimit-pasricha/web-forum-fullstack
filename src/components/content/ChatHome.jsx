import { memo } from "react";

function ChatHome() {
  return (
    <>
      <h1>Welcome to the forum!</h1>
      <p>Please be mindful about what you post, this is a shared space..</p>
      <p>Click on a link to get started.</p>
    </>
  );
}

export default memo(ChatHome);
