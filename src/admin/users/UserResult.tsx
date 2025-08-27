import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { base_url } from "../../utils/base_url";
import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";

interface UserResultType {
	id: string;
	user_id: string;
	test_id: string;
	candidate_id: string;
	feedback: string;
	listening_result: string;
	reading_result: string;
	speaking_result: string;
	writing_result: string;
	isChecked: boolean;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}

const UserResult = () => {
	const { userId } = useParams();
	const navigate = useNavigate();
	const [userResult, setUserResult] = useState<UserResultType[]>([]);

	// 🔹 Update uchun modal state
	const [visible, setVisible] = useState(false);
	const [editData, setEditData] = useState<UserResultType | null>(null);

	// 🔹 Get results
	async function GetUserResult() {
		try {
			const res = await axios.get(`${base_url}/user-results/user/${userId}/stats`);
			setUserResult(res.data.results);
			console.log(res.data.results)
		} catch (err) {
			console.error("❌ Error fetching results:", err);
		}
	}

	// 🔹 Delete result
	async function Delete_result(id: string) {
		if (!window.confirm("Are you sure you want to delete this result?")) return;
		try {
			await axios.delete(`${base_url}/user-results/${id}`);
			setUserResult((prev) => prev.filter((r) => r.id !== id));
		} catch (err) {
			console.error("❌ Delete error:", err);
		}
	}
	console.log(editData)

	// 🔹 Edit (modal ochish)
	function OpenEditModal(res: UserResultType) {
		setEditData(res);
		setVisible(true);
	}

	// 🔹 Save update
	async function SaveUpdate() {
		if (!editData) return;
		try {
			await axios.patch(`${base_url}/user-results/${editData.id}`, {
				listening_result: Number(editData.listening_result),
				reading_result: Number(editData.reading_result),
				speaking_result: Number(editData.speaking_result),
				writing_result: Number(editData.writing_result),
				feedback: editData.feedback,
			});

			setUserResult((prev) =>
				prev.map((r) =>
					r.id === editData.id ? { ...editData, updatedAt: new Date().toISOString() } : r
				)
			);

			setVisible(false);
		} catch (err) {
			console.error("❌ Update error:", err);
		}
	}
	function IsChecked(id: string) {
		console.log(id)
	}

	useEffect(() => {
		GetUserResult();
	}, []);

	return (
		<div className="container-fluid">
			<h3 className="text-center my-4">User Result</h3>
			{userResult && userResult.length > 0 ? (
				<table className="table table-bordered">
					<thead>
						<tr>
							<th>#</th>
							<th>Listening</th>
							<th>Reading</th>
							<th>Speaking</th>
							<th>Writing</th>
							<th>Date</th>
							<th>Feedback</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{userResult.map((res, i) => (
							<tr key={res.id}>
								<td><b>{i + 1}</b></td>
								<td>{res.listening_result}</td>
								<td>{res.reading_result}</td>
								<td>{res.speaking_result}</td>
								<td>
									<button className="btn btn-sm btn-primary" onClick={() => navigate(`/admin/v1/users/result/writing/${res.test_id}/${res.user_id}`)} >{res.writing_result}</button>
								</td>
								<td>{formatDate(res.updatedAt)}</td>
								<td>{res.feedback}</td>
								<td>
									<button
										className="btn btn-sm btn-primary"
										onClick={() => OpenEditModal(res)}
									>
										<i className="pi pi-pencil"></i>
									</button>
									<button
										className="btn btn-sm btn-danger mx-1"
										onClick={() => Delete_result(res.id)}
									>
										<i className="pi pi-trash"></i>
									</button>
									<button
										className={`btn btn-sm ${res.isChecked ? 'btn-success' : 'btn-danger'} mx-1`}
										onClick={() => IsChecked(res.id)}
									>
										{res.isChecked ?
											<i className="pi pi-check-circle"></i> :
											<i className="pi pi-check"></i>
										}
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>No results available</p>
			)}

			{/* 🔹 Edit Modal */}
			<Dialog
				header="Edit User Result"
				visible={visible}
				style={{ width: "50vw" }}
				onHide={() => setVisible(false)}
			>
				{editData && (
					<div className="p-3">
						<div className="mb-3">
							<label>Listening</label>
							<input
								type="text"
								className="form-control"
								value={editData.listening_result}
								onChange={(e) =>
									setEditData({ ...editData, listening_result: e.target.value })
								}
							/>
						</div>
						<div className="mb-3">
							<label>Reading</label>
							<input
								type="text"
								className="form-control"
								value={editData.reading_result}
								onChange={(e) =>
									setEditData({ ...editData, reading_result: e.target.value })
								}
							/>
						</div>
						<div className="mb-3">
							<label>Speaking</label>
							<input
								type="text"
								className="form-control"
								value={editData.speaking_result}
								onChange={(e) =>
									setEditData({ ...editData, speaking_result: e.target.value })
								}
							/>
						</div>
						<div className="mb-3">
							<label>Writing</label>
							<input
								type="text"
								className="form-control"
								value={editData.writing_result}
								onChange={(e) =>
									setEditData({ ...editData, writing_result: e.target.value })
								}
							/>
						</div>
						<div className="mb-3">
							<label>Feedback</label>
							<textarea
								className="form-control"
								value={editData.feedback}
								onChange={(e) =>
									setEditData({ ...editData, feedback: e.target.value })
								}
							/>
						</div>

						<div className="d-flex justify-content-end gap-2">
							<button
								className="btn btn-secondary"
								onClick={() => setVisible(false)}
							>
								Cancel
							</button>
							<button className="btn btn-primary" onClick={SaveUpdate}>
								Save
							</button>
						</div>
					</div>
				)}
			</Dialog>
		</div>
	);
};

export default UserResult;

function formatDate(dateString: string): string {
	const date = new Date(dateString);
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	return `${day}.${month}.${year} ${hours}:${minutes}`;
}
