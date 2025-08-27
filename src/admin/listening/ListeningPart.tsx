import { useEffect, useState } from "react";
import axios from "axios";
import { base_url } from "../../utils/base_url";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import ListeningPartList from "./ListeningPartList";
import { useParams } from "react-router-dom";
import Editor from "../../utils/CKeditor";

interface ListeningPart {
	id: string;
	content: string;
	part: string;
	listening_id: string;
}

const ListeningPart = () => {
	const { listening_id } = useParams()
	const [parts, setParts] = useState<ListeningPart[]>([]);
	const [visible, setVisible] = useState(false);
	const [editId, setEditId] = useState<string | null>(null);

	// form state
	const [content, setContent] = useState("");
	const [part, setPart] = useState("part1");

	async function get_parts() {
		try {
			const res = await axios.get(`${base_url}/listening-parts/listening/${listening_id}`);
			setParts(res.data);
		} catch (err) {
			console.log(err);
		}
	}

	useEffect(() => {
		if (listening_id) {
			get_parts();
		}
	}, [listening_id]);

	const openCreateModal = () => {
		setEditId(null);
		setContent("");
		setPart("part1");
		setVisible(true);
	};

	const openEditModal = (id: string) => {
		const p = parts.find((r) => r.id === id);
		if (!p) return;

		setEditId(p.id);
		setContent(p.content || "");
		setPart(p.part || "part1");
		setVisible(true);
	};

	const handleSave = async () => {
		if (!content || !part) {
			alert("Please fill in required fields (content and part)");
			return;
		}

		try {
			if (editId) {
				// UPDATE
				await axios.patch(`${base_url}/listening-parts/${editId}`, {
					content,
					part,
					listening_id,
				});
				alert("Listening Part updated successfully!");
			} else {
				// CREATE
				await axios.post(`${base_url}/listening-parts`, {
					content,
					part,
					listening_id,
				});
				alert("Listening Part created successfully!");
			}

			get_parts();
			setVisible(false);
			setEditId(null);
			setContent("");
			setPart("part1");
		} catch (err) {
			console.log(err);
			alert("Failed to save Listening Part");
		}
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm("Are you sure you want to delete this part?")) return;
		try {
			await axios.delete(`${base_url}/listening-parts/${id}`);
			alert("Listening Part deleted successfully!");
			get_parts();
		} catch (err) {
			console.log(err);
			alert("Failed to delete Listening Part");
		}
	};

	return (
		<div className="container">
			<h4 className="text-center py-4">Listening Parts</h4>

			<div style={{ overflow: "hidden" }}>
				<Button
					label="Create Listening Part"
					className="btn btn-primary"
					style={{ float: "right" }}
					onClick={openCreateModal}
				/>
			</div>

			<Dialog
				draggable={false}
				header={editId ? "EDIT PART" : "CREATE PART"}
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
				<div className="create-part w-75 mx-auto">
					<label htmlFor="content">Content</label>
					<Editor value={content} onChange={(e) => setContent(e)} />
					<label htmlFor="part" className="mt-3">
						Part
					</label>
					<select
						className="form-control"
						id="part"
						value={part}
						onChange={(e) => setPart(e.target.value)}
					>
						<option value="part1">Part 1</option>
						<option value="part2">Part 2</option>
						<option value="part3">Part 3</option>
					</select>

					<button className="btn mt-4 btn-success" onClick={handleSave}>
						{editId ? "Update" : "Create"}
					</button>
				</div>
			</Dialog>

			<ListeningPartList
				parts={parts}
				onEdit={openEditModal}
				onDelete={handleDelete}
			/>
		</div>
	);
};

export default ListeningPart;
