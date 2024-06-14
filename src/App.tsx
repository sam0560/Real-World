import { Outlet } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";

function App() {
  return (
    <>
      <div>
        <NavBar />
        <div className="main-content">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
