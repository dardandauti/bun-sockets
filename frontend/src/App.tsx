import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./App.css";
import Home from "./components/Home";
import CanvasContextProvider from "./context/CanvasContextProvider";
import Canvas from "./pages/Canvas/Canvas";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <MantineProvider>
        <Routes>
          <Route path="/" index element={<Home />} />
          <Route
            path="canvas"
            element={
              <CanvasContextProvider>
                <Canvas />
              </CanvasContextProvider>
            }
          />
          {/* <Route path="*" element={<Error />} /> */}
        </Routes>
      </MantineProvider>
    </BrowserRouter>
  );
}

export default App;
