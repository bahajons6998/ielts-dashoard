// Reading.tsx
import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import axios from "axios";
import { base_url } from "../../utils/base_url";
import ReadingList from "./ReadingList";

interface Readings {
  id: string;
  title: string;
  description: string;
  test_id: string;
  created_at: string;
  updated_at: string;
}

const Reading = ({ id }: { id?: string }) => {
  const [readings, setReadings] = useState<Readings[]>([]);
  const [visible, setVisible] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // 🔹 GET readings
  const get_readings = async () => {
    try {
      const res = await axios.get(`${base_url}/readings/test/${id}`);
      setReadings(res.data);
    } catch (err) {
      console.error("❌ Fetch error:", err);
    }
  };

  useEffect(() => {
    if (id) get_readings();
  }, [id]);

  // 🔹 CREATE modal
  const openCreateModal = () => {
    resetForm();
    setVisible(true);
  };

  // 🔹 EDIT modal
  const openEditModal = (readingId: string) => {
    const reading = readings.find((r) => r.id === readingId);
    if (!reading) return;

    setEditId(reading.id);
    setTitle(reading.title);
    setDescription(reading.description);
    setVisible(true);
  };

  // 🔹 RESET form
  const resetForm = () => {
    setEditId(null);
    setTitle("");
    setDescription("");
  };

  // 🔹 SAVE (create or update)
  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      if (editId) {
        await axios.patch(`${base_url}/readings/${editId}`, {
          title,
          description,
          test_id: id,
        });
        alert("✅ Reading updated successfully!");
      } else {
        await axios.post(`${base_url}/readings`, {
          title,
          description,
          test_id: id,
        });
        alert("✅ Reading created successfully!");
      }

      get_readings();
      setVisible(false);
      resetForm();
    } catch (err) {
      console.error("❌ Save error:", err);
      alert("Failed to save Reading");
    }
  };

  // 🔹 DELETE
  const handleDelete = async (readingId: string) => {
    if (!window.confirm("Are you sure you want to delete this reading?")) return;
    try {
      await axios.delete(`${base_url}/readings/${readingId}`);
      alert("🗑️ Reading deleted successfully!");
      get_readings();
    } catch (err) {
      console.error("❌ Delete error:", err);
      alert("Failed to delete Reading");
    }
  };

  return (
    <div>
      <h4 className="text-center">📖 Reading</h4>

      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary" onClick={openCreateModal} >➕ Create Reading</button>
      </div>

      {/* 🔹 Dialog */}
      <Dialog
        draggable={false}
        header={editId ? "✏️ Edit Reading" : "➕ Create Reading"}
        visible={visible}
        style={{ width: "70vw" }}
        onHide={() => setVisible(false)}
      >
        <div className="w-75 mx-auto">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            className="form-control"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label htmlFor="descr" className="mt-3">Description</label>
          <textarea className="form-control" name="" id="descr" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>

          <div className="d-flex justify-content-end mt-4">
            <Button
              label="Cancel"
              className="p-button-text me-2"
              onClick={() => setVisible(false)}
            />
            <Button
              label={editId ? "Update" : "Create"}
              className="p-button-success"
              onClick={handleSave}
            />
          </div>
        </div>
      </Dialog>

      {/* 🔹 List */}
      <ReadingList readings={readings} onedit={openEditModal} ondelete={handleDelete} />
    </div >
  );
};

export default Reading;
