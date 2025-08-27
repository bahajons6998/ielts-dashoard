import axios from "axios";
import { useParams } from "react-router-dom";
import { base_url } from "../../utils/base_url";
import { useEffect, useState } from "react";

interface UserResultType {
	id: string;
	user_id: string;
	test_id: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
	writing_response: string[];
	isChecked?: boolean;
	feedback?: string;
	listening_result?: number;
	reading_result?: number;
	speaking_result?: number;
	writing_result?: number;
}

const UserWritingResult = () => {
	const { test_id, user_id } = useParams();
	const [userResult, setUserResult] = useState<UserResultType[]>([]);
	const [loadingId, setLoadingId] = useState<string | null>(null);

	// Modal state
	const [showModal, setShowModal] = useState(false);
	const [editingResult, setEditingResult] = useState<UserResultType | null>(null);

	// 🔹 GET results
	async function GetUserWritingResult() {
		try {
			const res = await axios.get(
				`${base_url}/user-responses/user/${user_id}/test/${test_id}`
			);
			console.log(res.data);
			setUserResult(res.data);
		} catch (err) {
			console.log(err);
		}
	}

	// 🔹 PATCH Checked
	async function ToggleChecked(id: string, current: boolean | undefined) {
		try {
			setLoadingId(id);
			await axios.patch(`${base_url}/user-responses/${id}/checked`, {
				isChecked: !current,
			});
			setUserResult((prev) =>
				prev.map((r) => (r.id === id ? { ...r, isChecked: !current } : r))
			);
		} catch (err) {
			console.error("❌ Patch error:", err);
		} finally {
			setLoadingId(null);
		}
	}

	// 🔹 DELETE
	async function DeleteResult(id: string) {
		if (!window.confirm("Are you sure you want to delete this result?")) return;

		try {
			await axios.delete(`${base_url}/user-responses/${id}`);
			setUserResult((prev) => prev.filter((r) => r.id !== id));
		} catch (err) {
			console.error("❌ Delete error:", err);
		}
	}

	// 🔹 OPEN EDIT MODAL
	function openEditModal(result: UserResultType) {
		setEditingResult({ ...result });
		setShowModal(true);
	}

	// 🔹 HANDLE INPUT CHANGE
	function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		if (!editingResult) return;
		const { name, value } = e.target;
		setEditingResult((prev) => (prev ? { ...prev, [name]: value } : null));
	}

	// 🔹 SAVE EDIT
	async function saveEdit() {
		if (!editingResult) return;
		try {
			await axios.patch(`${base_url}/user-responses/${editingResult.id}`, editingResult);
			setUserResult((prev) =>
				prev.map((r) => (r.id === editingResult.id ? editingResult : r))
			);
			setShowModal(false);
		} catch (err) {
			console.error("❌ Update error:", err);
		}
	}

	useEffect(() => {
		GetUserWritingResult();
	}, []);

	return (
		<div className="container my-4">
			<h3 className="text-center mb-4">✍️ User Writing Result</h3>

			{userResult.map((item, index) => (
				<div className="card shadow-sm mb-4" key={item.id}>
					<div className="card-header d-flex justify-content-between align-items-center">
						<div>
							<b>Attempt {index + 1}</b>{" "}
							<small className="text-muted">
								({new Date(item.createdAt).toLocaleString()})
							</small>
						</div>
						<div>
							<span
								className={`badge me-2 ${
									item.isChecked ? "bg-success" : "bg-warning text-dark"
								}`}
							>
								{item.isChecked ? "Checked" : "Not Checked"}
							</span>
							<button
								className="btn btn-sm btn-outline-primary me-2"
								onClick={() => openEditModal(item)}
							>
								<i className="pi pi-pencil"></i> Edit
							</button>
							<button
								className="btn btn-sm btn-outline-danger me-2"
								onClick={() => DeleteResult(item.id)}
							>
								<i className="pi pi-trash"></i> Delete
							</button>
							<button
								className="btn btn-sm btn-outline-success"
								disabled={loadingId === item.id}
								onClick={() => ToggleChecked(item.id, item.isChecked)}
							>
								{loadingId === item.id ? "Saving..." : "Toggle Check"}
							</button>
						</div>
					</div>

					<div className="card-body">
						{item.writing_response.map((resp, i) => (
							<div key={i} className="mb-3 pb-3 border-bottom">
								<div className="d-flex align-items-start">
									<span className="badge bg-success me-3">Part {i + 1}</span>
									<div className="flex-grow-1">
										<div
											className="p-2 bg-light rounded"
											style={{ whiteSpace: "pre-wrap" }}
											dangerouslySetInnerHTML={{ __html: resp }}
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			))}

			{userResult.length === 0 && (
				<p className="text-center text-muted">No writing responses found</p>
			)}

			{/* 🔹 EDIT MODAL */}
			{showModal && editingResult && (
				<div className="modal show fade d-block" tabIndex={-1}>
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Edit Result</h5>
								<button
									type="button"
									className="btn-close"
									onClick={() => setShowModal(false)}
								></button>
							</div>
							<div className="modal-body">
								<div className="mb-3">
									<label className="form-label">Feedback</label>
									<textarea
										className="form-control"
										name="feedback"
										value={editingResult.feedback || ""}
										onChange={handleChange}
									/>
								</div>
								<div className="row">
									<div className="col-md-6 mb-3">
										<label className="form-label">Listening</label>
										<input
											type="number"
											className="form-control"
											name="listening_result"
											value={editingResult.listening_result || ""}
											onChange={handleChange}
										/>
									</div>
									<div className="col-md-6 mb-3">
										<label className="form-label">Reading</label>
										<input
											type="number"
											className="form-control"
											name="reading_result"
											value={editingResult.reading_result || ""}
											onChange={handleChange}
										/>
									</div>
									<div className="col-md-6 mb-3">
										<label className="form-label">Speaking</label>
										<input
											type="number"
											className="form-control"
											name="speaking_result"
											value={editingResult.speaking_result || ""}
											onChange={handleChange}
										/>
									</div>
									<div className="col-md-6 mb-3">
										<label className="form-label">Writing</label>
										<input
											type="number"
											className="form-control"
											name="writing_result"
											value={editingResult.writing_result || ""}
											onChange={handleChange}
										/>
									</div>
								</div>
							</div>
							<div className="modal-footer">
								<button
									className="btn btn-secondary"
									onClick={() => setShowModal(false)}
								>
									Close
								</button>
								<button className="btn btn-primary" onClick={saveEdit}>
									Save Changes
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default UserWritingResult;
