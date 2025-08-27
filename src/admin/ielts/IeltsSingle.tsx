import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Reading from "../reading/Reading";
import Writing from "../writing/Writing";
import Listening from "../listening/Listening";
import { base_url } from "../../utils/base_url";

const IeltsSingle = () => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const { id } = useParams();

  // ✅ localStorage dan active ni olish
  const [active, setActive] = useState<"reading" | "writing" | "listening">(
    () => (localStorage.getItem("ielts_active_tab") as "reading" | "writing" | "listening") || "writing"
  );

  const fetchOneTests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}/tests/${id}`);
      setTitle(response.data?.result?.title || "");
    } catch (error) {
      console.error("Error fetching IELTS tests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOneTests();
  }, [id]);

  // ✅ active o‘zgarsa localStorage ga yozamiz
  useEffect(() => {
    localStorage.setItem("ielts_active_tab", active);
  }, [active]);

  let content;
  switch (active) {
    case "reading":
      content = <Reading id={id} />;
      break;
    case "writing":
      content = <Writing id={id} />;
      break;
    case "listening":
      content = <Listening id={id} />;
      break;
    default:
      content = null;
  }

  return (
    <div className="container py-4">
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">Loading IELTS Test...</p>
        </div>
      ) : (
        <>
          {/* Title */}
          <h3 className="text-center mb-4 fw-bold text-primary">
            {title || "IELTS Test"}
          </h3>

          {/* Tabs */}
          <ul className="nav nav-pills justify-content-center mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${active === "reading" ? "active" : ""}`}
                onClick={() => setActive("reading")}
              >
                📖 Reading
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${active === "writing" ? "active" : ""}`}
                onClick={() => setActive("writing")}
              >
                ✍️ Writing
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${active === "listening" ? "active" : ""}`}
                onClick={() => setActive("listening")}
              >
                🎧 Listening
              </button>
            </li>
          </ul>

          {/* Content */}
          <div className="mt-3">{content}</div>
        </>
      )}
    </div>
  );
};

export default IeltsSingle;
