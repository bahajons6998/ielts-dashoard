import Editor from "../../utils/CKeditor";
import axios from "axios";
import { base_url } from "../../utils/base_url";
import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import WritingList from "./WritingList";

 export interface Writings {
  id: string;
  question?: string;
  test_id?: string;
  instruction?: string;
  image_url?: string;
  type: "task1" | "task2";
}

const Writing = ({ id }: { id?: string }) => {
  const [writings, setWritings] = useState<Writings[]>([]);
  const [visible, setVisible] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // form state
  const [question, setQuestion] = useState("");
  const [instruction, setInstruction] = useState("");
  const [image_url, setImage_url] = useState("");
  const [type, setType] = useState<"task1" | "task2">("task1");

  async function get_writings() {
    try {
      const res = await axios.get(`${base_url}/writing/test/${id}`);
      setWritings(res.data);
			console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    get_writings();
  }, [id]);

  const openCreateModal = () => {
    setEditId(null);
    setQuestion("");
    setInstruction("");
    setImage_url("");
    setType("task1");
    setVisible(true);
  };

  const openEditModal = (writingId: string) => {
    const writing = writings.find((r) => r.id === writingId);
    if (!writing) return;

    setEditId(writing.id || null);
    setQuestion(writing.question || "");
    setInstruction(writing.instruction || "");
    setImage_url(writing.image_url || "");
    setType(writing.type || "task1");
    setVisible(true);
  };

  const handleSave = async () => {
    if (!question || !instruction || !type) {
      alert("Please fill in all required fields");
      return;
    }
    if (type === "task1" && !image_url) {
      alert("Image URL is required for Task 1");
      return;
    }

    try {
      if (editId) {
        // UPDATE
        await axios.patch(`${base_url}/writing/${editId}`, {
          question,
          instruction,
          image_url: type === "task1" ? image_url : null,
          type,
          test_id: id,
        });
        alert("Writing updated successfully!");
      } else {
        // CREATE
        let data: any = {
          question,
          instruction,
          type,
          test_id: id,
        };
        if (type === "task1") {
          data.image_url = image_url;
        }

        await axios.post(`${base_url}/writing`, data);
        alert("Writing created successfully!");
      }

      get_writings();
      setVisible(false);
      setEditId(null);
      setQuestion("");
      setInstruction("");
      setImage_url("");
      setType("task1");
    } catch (err) {
      console.log(err);
      alert("Failed to save Writing");
    }
  };

  const handleDelete = async (writingId: string) => {
    if (!window.confirm("Are you sure you want to delete this writing?")) return;
    try {
      await axios.delete(`${base_url}/writing/${writingId}`);
      alert("Writing deleted successfully!");
      get_writings();
    } catch (err) {
      console.log(err);
      alert("Failed to delete Writing");
    }
  };

  return (
    <div className="container-fluid">
      <h4 className="text-center">Writing</h4>

      <div style={{ overflow: "hidden" }}>
        <Button
          label="Create Writing"
          className="btn btn-primary"
          style={{ float: "right" }}
          onClick={openCreateModal}
        />
      </div>

      <Dialog
        draggable={false}
        header={editId ? "EDIT WRITING" : "CREATE WRITING"}
        visible={visible}
        style={{
          width: "70vw",
          border: "1px solid #a1a1a1",
          padding: "20px",
          backgroundColor: "#fff",
        }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className="create-writing w-50 mx-auto">
          <label htmlFor="question">Question</label>
          <Editor
            value={question}
            onChange={(data: string) => setQuestion(data)}
          />

          <label htmlFor="instruction" className="mt-3">
            Instruction
          </label>
          <input
            className="form-control"
            id="instruction"
            type="text"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
          />

          {type === "task1" && (
            <>
              <label htmlFor="image_url" className="mt-3">
                Image URL
              </label>
              <input
                className="form-control"
                id="image_url"
                type="text"
                value={image_url}
                onChange={(e) => setImage_url(e.target.value)}
              />
            </>
          )}

          <label htmlFor="type" className="mt-3">
            Type
          </label>
          <select
            className="form-control"
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as "task1" | "task2")}
          >
            <option value="task1">Task 1</option>
            <option value="task2">Task 2</option>
          </select>

          <button className="btn mt-4 btn-success" onClick={handleSave}>
            {editId ? "Update" : "Create"}
          </button>
        </div>
      </Dialog>

       <WritingList
        writings={writings}
        onEdit={openEditModal}
        onDelete={handleDelete}
      /> 
    </div>
  );
};

export default Writing;
