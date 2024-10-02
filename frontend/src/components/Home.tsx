import { Button } from "@mantine/core";
import "@mantine/core/styles.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Button onClick={() => navigate("canvas")}>Join canvas!</Button>
    </>
  );
}

export default Home;
