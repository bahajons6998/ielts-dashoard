import { Link, useNavigate } from "react-router-dom";
import { WifiOutlined } from "@ant-design/icons";
// import Secundomer from "../components/common/Secundomer";
import './Pages.scss'

export default function Navbar() {
  const navigate = useNavigate()
  return (
    <nav className="navbar">
      <div className="nav">
        <img
          src={
            "https://d2snzxottmona5.cloudfront.net/releases/3.46.0/images/logo/ielts.svg"
          }
          height={"60%"}
          alt="IELTS Logo"
          style={{ marginRight: "20px" }}
          onClick={() => navigate("/")}
        />
        <ul>
          <li>
            <Link to={"/"} style={{ textDecoration: "none", color: "#000" }}>
              Home
            </Link>
          </li>
          <li>
            <Link to={"/about"} style={{ textDecoration: "none", color: "#000" }}>
              About
            </Link>
          </li>
          <li>
            <Link to={"/reading/2/2"}
              style={{ textDecoration: "none", color: "#000" }}
            >
              Reading
            </Link>
          </li>
          <li>
            <Link
              to={"/writing"}
              style={{ textDecoration: "none", color: "#000" }}
            >
              Writing
            </Link>
          </li>
          <li>
            <Link to={"/listening"}
              style={{ textDecoration: "none", color: "#000" }}
            >
              Listening
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <button className="btn" onClick={() => navigate(-1)}><i className="pi pi-arrow-left"></i></button>
        <button className="btn" onClick={() => window.location.reload()}><i className="pi pi-refresh"></i></button>
        <button className="btn" onClick={() => navigate(+1)}><i className="pi pi-arrow-right"></i></button>
      </div>
      <div
        style={{
          display: "flex",
        }}
      >
        {/* <Secundomer /> */}
        <WifiOutlined
          style={{ marginRight: "8px", fontSize: "32px", fontWeight: "bold" }}
        />
        {localStorage.getItem("token") ? (
          <div style={{ cursor: "pointer", color: "#000" }}>Logout</div>
        ) : (
          <div>
            <Link
              to={"/api/login"}
              style={{ textDecoration: "none", color: "#000" }}
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
