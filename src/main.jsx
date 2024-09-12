import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

/* ВАЖНО: описание решения и  скрипты для создания контейнера на основе docker
файла, а так же скрипт для запуска контейнера находятся в файле README.md */

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
