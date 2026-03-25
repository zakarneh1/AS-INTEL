import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { Layout } from "./components/Layout";
import { Toaster } from "./components/ui/sonner";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Insights from "./pages/Insights";
import Architecture from "./pages/Architecture";
import About from "./pages/About";

function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/architecture" element={<Architecture />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Layout>
        <Toaster />
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
