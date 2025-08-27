import { useEffect, useState } from "react";
import axios from "axios";
import { base_url } from "../../utils/base_url";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import ListeningList from "./ListeningList";

export interface Listening {
  id: string;
  title: string;
  audio_url: string;
  image_url?: string;
  test_id: string;
}

const Listening = ({ id }: { id?: string }) => {
  const [listenings, setListenings] = useState<Listening[]>([]);
  const [visible, setVisible] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // form state
  const [title, setTitle] = useState("");
  const [audio_url, setAudio_url] = useState("");
  const [image_url, setImage_url] = useState("");

  async function get_listenings() {
    try {
      const res = await axios.get(`${base_url}/listening/test/${id}`);
      setListenings(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    get_listenings();
  }, [id]);

  const openCreateModal = () => {
    setEditId(null);
    setTitle("");
    setAudio_url("");
    setImage_url("");
    setVisible(true);
  };

  const openEditModal = (listeningId: string) => {
    const listening = listenings.find((r) => r.id === listeningId);
    if (!listening) return;

    setEditId(listening.id || null);
    setTitle(listening.title || "");
    setAudio_url(listening.audio_url || "");
    setImage_url(listening.image_url || "");
    setVisible(true);
  };

  const handleSave = async () => {
    if (!title || !audio_url) {
      alert("Please fill in required fields (title and audio_url)");
      return;
    }

    try {
      if (editId) {
        // UPDATE
        await axios.patch(`${base_url}/listening/${editId}`, {
          title,
          audio_url,
          image_url,
          test_id: id,
        });
        alert("Listening updated successfully!");
      } else {
        // CREATE
        await axios.post(`${base_url}/listening`, {
          title,
          audio_url,
          image_url,
          test_id: id,
        });
        alert("Listening created successfully!");
      }

      get_listenings();
      setVisible(false);
      setEditId(null);
      setTitle("");
      setAudio_url("");
      setImage_url("");
    } catch (err) {
      console.log(err);
      alert("Failed to save Listening");
    }
  };

  const handleDelete = async (listeningId: string) => {
    if (!window.confirm("Are you sure you want to delete this listening?")) return;
    try {
      await axios.delete(`${base_url}/listening/${listeningId}`);
      alert("Listening deleted successfully!");
      get_listenings();
    } catch (err) {
      console.log(err);
      alert("Failed to delete Listening");
    }
  };

  return (
    <div className="container-fluid">
      <h4 className="text-center">Listening</h4>

      <div style={{ overflow: "hidden" }}>
        <Button
          label="Create Listening"
          className="btn btn-primary"
          style={{ float: "right" }}
          onClick={openCreateModal}
        />
      </div>

      <Dialog
        draggable={false}
        header={editId ? "EDIT LISTENING" : "CREATE LISTENING"}
        visible={visible}
        style={{
          width: "50vw",
          border: "1px solid #a1a1a1",
          padding: "20px",
          backgroundColor: "#fff",
        }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className="create-listening w-75 mx-auto">
          <label htmlFor="title">Title</label>
          <input
            className="form-control"
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label htmlFor="audio_url" className="mt-3">
            Audio URL
          </label>
          <input
            className="form-control"
            id="audio_url"
            type="text"
            value={audio_url}
            onChange={(e) => setAudio_url(e.target.value)}
          />

          <label htmlFor="image_url" className="mt-3">
            Image URL (optional)
          </label>
          <input
            className="form-control"
            id="image_url"
            type="text"
            value={image_url}
            onChange={(e) => setImage_url(e.target.value)}
          />

          <button className="btn mt-4 btn-success" onClick={handleSave}>
            {editId ? "Update" : "Create"}
          </button>
        </div>
      </Dialog>

      <ListeningList
        listenings={listenings}
        onEdit={openEditModal}
        onDelete={handleDelete}
        listening_id={id}
      />
    </div>
  );
};

export default Listening;
