import Editor from "../../utils/CKeditor.tsx";
import { useEffect, useState } from "react";
import IeltsList from "./IeltsList.tsx";
import axios from "axios";
import { base_url } from "../../utils/base_url.tsx";

interface IeltsTest {
  id: number;
  title: string;
  description: string;
  image_url: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const IeltsContent = () => {
  const [visible, setVisible] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [tests, setTests] = useState<IeltsTest[]>([]);
  const [loading, setLoading] = useState(false);

  // form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("published");

  const openCreateModal = () => {
    setEditId(null);
    setTitle("");
    setDescription("");
    setImageUrl("");
    setStatus("published");
    setVisible(true);
  };

  const openEditModal = (test: IeltsTest) => {
    setEditId(test.id);
    setTitle(test.title);
    setDescription(test.description);
    setImageUrl(test.image_url);
    setStatus(test.status);
    setVisible(true);
  };

  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}/tests`);
      setTests(response?.data || []);
    } catch (error) {
      console.error('Error fetching IELTS tests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleSave = async () => {
    if (!title || !description || !imageUrl || !status) {
      alert("Please fill in all fields");
      return;
    }

    const payload = { title, description, image_url: imageUrl, status };

    try {
      if (editId) {
        await axios.patch(`${base_url}/tests/${editId}`, payload);
        alert("IELTS updated successfully!");
      } else {
        await axios.post(`${base_url}/tests`, payload);
        alert("IELTS created successfully!");
      }
      fetchTests();
      setVisible(false);
      setTitle("");
      setDescription("");
      setImageUrl("");
      setStatus("published");
      setEditId(null);
    } catch (error) {
      console.error("Error saving IELTS:", error);
      alert("Failed to save IELTS");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">📋 IELTS Tests</h2>
        <button className="btn btn-primary" onClick={openCreateModal}>
          ➕ Create IELTS
        </button>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">Loading tests...</p>
        </div>
      ) : (
        <IeltsList onEdit={openEditModal} tests={tests} onfetch={fetchTests} />
      )}

      {/* Bootstrap Modal */}
      {visible && (
        <div className="modal show fade d-block" tabIndex={-1}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editId ? "✏️ Edit IELTS" : "➕ Create IELTS"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label fw-semibold">Title</label>
                  <input
                    id="title"
                    type="text"
                    className="form-control"
                    placeholder="Enter IELTS title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Description</label>
                  <Editor onChange={(data: string) => setDescription(data)} value={description} />
                </div>

                <div className="mb-3">
                  <label htmlFor="image" className="form-label fw-semibold">Image URL</label>
                  <input
                    id="image"
                    type="text"
                    className="form-control"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="status" className="form-label fw-semibold">Status</label>
                  <select
                    id="status"
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="published">Published ✅</option>
                    <option value="unpublished">Unpublished ❌</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setVisible(false)}>
                  ❎ Cancel
                </button>
                <button className="btn btn-success" onClick={handleSave}>
                  {editId ? "💾 Update" : "✅ Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IeltsContent;
