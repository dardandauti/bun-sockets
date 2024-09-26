import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./App.css";
import Home from "./components/Home";

function App() {
  return (
    <MantineProvider>
      <Home />
    </MantineProvider>
  );
}

export default App;
