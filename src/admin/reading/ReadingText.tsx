// Reading.tsx
import { useParams } from "react-router-dom";
import Editor from "../../utils/CKeditor";
import axios from "axios";
import { base_url } from "../../utils/base_url";
import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import ReadingTextList from "./ReadingTextList";

interface Readings {
	id: string;
	title: string;
	reading_passage: string;
	part: string;
	reading_id?: string;
}

const ReadingText = () => {
	const { reading_id, id } = useParams();
	const [readings, setReadings] = useState<Readings[]>([]);
	const [visible, setVisible] = useState(false);
	const [editId, setEditId] = useState<string | null>(null);

	// form state
	const [title, setTitle] = useState("");
	const [reading_passage, setReading_passage] = useState("");
	const [part, setPart] = useState("");

	async function get_readings() {
		try {
			const res = await axios.get(`${base_url}/reading-texts/paginated`);
			// adjust depending on API response shape
			console.log(res.data.data)
			setReadings(res.data.data || res.data);
		} catch (err) {
			console.log(err);
		}
	}

	useEffect(() => {
		get_readings();
	}, [id]);

	const openCreateModal = () => {
		setEditId(null);
		setTitle("");
		setReading_passage("");
		setPart("");
		setVisible(true);
	};

	const openEditModal = (readingId: string) => {
		const reading = readings.find((r) => r.id === readingId);
		if (!reading) return;

		setEditId(reading.id);
		setTitle(reading.title);
		setReading_passage(reading.reading_passage);
		setPart(reading.part);
		setVisible(true);
	};

	const handleSave = async () => {
		if (!title || !reading_passage || !part) {
			alert("Please fill in all fields");
			return;
		}

		try {
			if (editId) {
				// UPDATE
				await axios.patch(`${base_url}/reading-texts/${editId}`, {
					title,
					reading_passage,
					part,
				});
				alert("Reading updated successfully!");
			} else {
				// CREATE
				await axios.post(`${base_url}/reading-texts`, {
					title,
					reading_passage,
					part,
					reading_id: reading_id,
				});
				alert("Reading created successfully!");
			}

			get_readings();
			setVisible(false);
			setTitle("");
			setReading_passage("");
			setPart("");
			setEditId(null);
		} catch (err) {
			console.log(err);
			alert("Failed to save Reading");
		}
	};

	const handleDelete = async (readingId: string) => {
		if (!window.confirm("Are you sure you want to delete this reading?")) return;
		try {
			await axios.delete(`${base_url}/reading-texts/${readingId}`);
			alert("Reading deleted successfully!");
			get_readings();
		} catch (err) {
			console.log(err);
			alert("Failed to delete Reading");
		}
	};

	return (
		<div className="container-fluid">
			<h4 className="text-center py-3">Reading Text</h4>

			<div style={{ overflow: "hidden" }}>
				<Button
					label="Create Reading Text"
					className="btn btn-primary"
					style={{ float: "right" }}
					onClick={openCreateModal}
				/>
			</div>

			<Dialog
				draggable={false}
				header={editId ? "EDIT READING" : "CREATE READING"}
				visible={visible}
				style={{
					width: "90vw",
					height: "100vh",
					border: "1px solid #a1a1a1",
					padding: "20px 100px",
					backgroundColor: "#fff",
				}}
				onHide={() => {
					if (!visible) return;
					setVisible(false);
				}}
			>
				<div className="create-reading w-100 mx-auto">
					<label htmlFor="title">Title</label>
					<input
						className="form-control"
						id="title"
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>

					<label htmlFor="descr" className="mt-3">Reading passage</label>
					<Editor value={reading_passage} onChange={(data: string) => setReading_passage(data)} />

					<label className="mt-2" htmlFor="part">Select part</label>
					<select
						className="form-control"
						id="part"
						value={part}
						onChange={(e) => setPart(e.target.value)}
					>
						<option value="">-- Select Part --</option>
						<option value="part1">Part1</option>
						<option value="part2">Part2</option>
						<option value="part3">Part3</option>
					</select>

					<button
						className="btn mt-4 btn-success"
						onClick={handleSave}
					>
						{editId ? "Update" : "Create"}
					</button>
				</div>
			</Dialog>

			<ReadingTextList
				readings={readings}
				onedit={openEditModal}
				ondelete={handleDelete}
			/>
		</div>
	);
};

export default ReadingText;
