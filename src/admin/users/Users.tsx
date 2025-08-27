// import { useEffect, useState } from "react";
// import UserList from "./UserList";
// import axios from "axios";
// import { Dialog } from 'primereact/dialog';
// import { base_url } from "../../utils/base_url";

// interface UserResultType {
// 	id: string;
// 	user_id: string;
// 	test_id: string;
// 	candidate_id: string;
// 	feedback: string;
// 	listening_result: string;
// 	reading_result: string;
// 	speaking_result: string;
// 	writing_result: string;
// 	isChecked: boolean;
// 	createdAt: string;
// 	updatedAt: string;
// 	deletedAt: string | null;
// }

// interface UserType {
// 	id?: string;
// 	full_name?: string;
// 	phone?: string;
// 	email?: string;
// 	password?: string;
// 	isActive?: boolean | null;
// 	candidate_id?: string;
// 	status?: string | null;
// 	access?: string | null;
// 	createdAt?: string;
// 	updatedAt?: string;
// 	deletedAt?: string | null;
// 	results?: UserResultType[];
// }

// const Users = () => {
// 	const [visible, setVisible] = useState(false);
// 	const [users, setUsers] = useState<UserType[]>([]);
// 	const [editId, setEditId] = useState<string | null>(null);

// 	const [selecteduser, setSelecteduser] = useState<UserType>({
// 		full_name: "",
// 		phone: "",
// 		email: "",
// 		password: "",
// 		isActive: false,
// 		candidate_id: "",
// 		status: "",
// 		access: "",
// 	});

// 	const handleSave = async () => {
// 		try {
// 			if (editId) {
// 				const result = await axios.patch(`${base_url}/users/${editId}`, selecteduser);
// 				console.log("Updated:", result.data);
// 			} else {
// 				const result = await axios.post(`${base_url}/users`, selecteduser);
// 				console.log("Created:", result.data);
// 			}
// 			setVisible(false);
// 			setEditId(null);
// 			// 🔹 Yangilashdan keyin ham pattern_user chaqiramiz
// 			pattern_user();
// 		} catch (err) {
// 			console.error("Save error:", err);
// 		}
// 	};

// 	async function edit_user(id: string) {
// 		setVisible(true);
// 		setEditId(id);
// 		try {
// 			const res = await axios.get(`${base_url}/users/${id}`);
// 			setSelecteduser(res.data);
// 		} catch (err) {
// 			console.error(err);
// 		}
// 	}

// 	async function delete_user(id: string) {
// 		try {
// 			const confirmed = window.confirm("Rostdan ham ushbu foydalanuvchini o‘chirmoqchimisiz?");
// 			if (!confirmed) return;

// 			await axios.delete(`${base_url}/users/${id}`);
// 			pattern_user(); // 🔹 qayta yuklab kelamiz
// 		} catch (err) {
// 			console.error(err);
// 		}
// 	}

// 	function change_status(id: string, status: string) {
// 		axios
// 			.patch(`${base_url}/users/${id}/toggle-status`)
// 			.then(() => {
// 				pattern_user(); // 🔹 status o‘zgarganda ham qayta yuklash
// 			})
// 			.catch((err) => {
// 				console.error(err);
// 			});
// 	}

// 	useEffect(() => {
// 		pattern_user(); // 🔹 sahifa ochilganda yuklab kelamiz
// 	}, []);

// 	return (
// 		<div className="container-fluid">
// 			<div className="my-3 w-100">
// 				<h3 className="text-center">Users</h3>
// 				<button
// 					className="btn btn-outline-primary my-2"
// 					style={{ float: "right" }}
// 					onClick={() => {
// 						setSelecteduser({
// 							full_name: "",
// 							phone: "",
// 							email: "",
// 							password: "",
// 							isActive: false,
// 							candidate_id: "",
// 							status: "",
// 							access: "",
// 						});
// 						setEditId(null);
// 						setVisible(true);
// 					}}
// 				>
// 					Create User
// 				</button>
// 			</div>

// 			<Dialog
// 				draggable={false}
// 				header={editId ? "EDIT USER" : "CREATE USER"}
// 				visible={visible}
// 				style={{
// 					width: "50vw",
// 					border: "1px solid #a1a1a1",
// 					padding: "20px",
// 					backgroundColor: "#fff",
// 				}}
// 				onHide={() => setVisible(false)}
// 			>
// 				<div className="w-75 mx-auto">
// 					{/* form inputs ... */}
// 					<button className="btn mt-3 btn-success" onClick={handleSave}>
// 						{editId ? "Update" : "Create"}
// 					</button>
// 				</div>
// 			</Dialog>

// 			{/* 🔹 Endi UserList doim pattern_user natijasini oladi */}
// 			<UserList users={users} edit_user={edit_user} delete_user={delete_user} change_status={change_status} />
// 		</div>
// 	);
// };

// export default Users;
import { useEffect, useState } from "react";
import UserList from "./UserList";
import axios from "axios";
import { Dialog } from 'primereact/dialog';

import { base_url } from "../../utils/base_url";

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

interface UserType {
	id?: string;
	full_name?: string;
	phone?: string;
	email?: string;
	password?: string;
	isActive?: boolean | null;
	candidate_id?: string;
	status?: string | null;
	access?: string | null;
	createdAt?: string;
	updatedAt?: string;
	deletedAt?: string | null;
	results?: UserResultType[];
}


const Users = () => {
	const [visible, setVisible] = useState(false);
	const [users, setUsers] = useState<UserType[]>([]);
	const [editId, setEditId] = useState<string | null>(null);

	const [selecteduser, setSelecteduser] = useState<UserType>({
		full_name: "",
		phone: "",
		email: "",
		password: "",
		isActive: false,
		candidate_id: "",
		status: "",
		access: "",
	});

	async function GetUsers() {
		try {
			const result = await axios.get(`${base_url}/users`);
			setUsers(result.data);
		} catch (err) {
			console.error(err);
		}
	}


	// 🔹 Userlarni va ularning resultlarini bitta funksiya orqali olish
	async function pattern_user() {
		try {
			// Avval foydalanuvchilarni olamiz
			const { data: allUsers } = await axios.get<UserType[]>(`${base_url}/users`);

			// Har bir user uchun result olib qo‘shamiz
			const mergedUsers = await Promise.all(
				allUsers.map(async (user) => {
					if (!user.id) return user;

					try {
						const { data: result } = await axios.get<UserResultType[]>(
							`${base_url}/user-results/user/${user.id}/stats`
						);
						return {
							...user,
							result,
						};
					} catch (err) {
						console.error(`Error fetching results for user ${user.id}`, err);
						return {
							...user,
							results: [],
						};
					}
				})
			);

			// 🔹 Endi bitta joyda setUsers qilamiz
			setUsers(mergedUsers);
		} catch (err) {
			console.error("Pattern user error:", err);
		}
	}
	const handleSave = async () => {
		try {
			if (editId) {
				const result = await axios.patch(`${base_url}/users/${editId}`, selecteduser);
				console.log("Updated:", result.data);
			} else {
				const result = await axios.post(`${base_url}/users`, selecteduser);
				console.log("Created:", result.data);
			}
			setVisible(false);
			setEditId(null);
			GetUsers();
		} catch (err) {
			console.error("Save error:", err);
		}
	};

	async function edit_user(id: string) {
		setVisible(true);
		setEditId(id);
		try {
			const res = await axios.get(`${base_url}/users/${id}`);
			setSelecteduser(res.data);
		} catch (err) {
			console.error(err);
		}
	}

	async function delete_user(id: string) {
		try {
			const confirmed = window.confirm("Rostdan ham ushbu foydalanuvchini o‘chirmoqchimisiz?");
			if (!confirmed) return;

			await axios.delete(`${base_url}/users/${id}`);
			GetUsers();
		} catch (err) {
			console.error(err);
		}
	}


	function change_status(id: string, status: string) {
		console.log(id, status);

		axios({
			method: "PATCH",
			url: `${base_url}/users/${id}/toggle-status`,
		})
			.then((res) => {
				GetUsers();
				console.log(res.data);
			})
			.catch((err) => {
				console.error(err);
			});
	}

	useEffect(() => {
		pattern_user();
	}, []);

	return (
		<div className="container-fluid">
			<div className="my-3 w-100">
				<h3 className="text-center">Users</h3>
				<button
					className="btn btn-outline-primary my-2"
					style={{ float: "right" }}
					onClick={() => {
						setSelecteduser({
							full_name: "",
							phone: "",
							email: "",
							password: "",
							isActive: false,
							candidate_id: "",
							status: "",
							access: "",
						});
						setEditId(null);
						setVisible(true);
					}}
				>
					Create User
				</button>
			</div>

			<Dialog
				draggable={false}
				header={editId ? "EDIT USER" : "CREATE USER"}
				visible={visible}
				style={{
					width: "50vw",
					border: "1px solid #a1a1a1",
					padding: "20px",
					backgroundColor: "#fff",
				}}
				onHide={() => setVisible(false)}
			>
				<div className="w-75 mx-auto">
					<label>Full name</label>
					<input
						className="form-control"
						name="full_name"
						type="text"
						value={selecteduser.full_name || ""}
						onChange={(e) =>
							setSelecteduser({ ...selecteduser, full_name: e.target.value })
						}
					/>

					<label className="mt-2">Phone</label>
					<input
						className="form-control"
						name="phone"
						type="text"
						value={selecteduser.phone || ""}
						onChange={(e) =>
							setSelecteduser({ ...selecteduser, phone: e.target.value })
						}
					/>

					<label className="mt-2">Email</label>
					<input
						className="form-control"
						name="email"
						type="text"
						value={selecteduser.email || ""}
						onChange={(e) =>
							setSelecteduser({ ...selecteduser, email: e.target.value })
						}
					/>

					<label className="mt-2">Password</label>
					<input
						className="form-control"
						name="password"
						type="text"
						value={selecteduser.password || ""}
						onChange={(e) =>
							setSelecteduser({ ...selecteduser, password: e.target.value })
						}
					/>

					<label className="mt-2">Is Active</label>
					<select
						className="form-select"
						value={String(selecteduser.isActive)}
						onChange={(e) =>
							setSelecteduser({
								...selecteduser,
								isActive: e.target.value === "true" ? true : false,
							})
						}
					>
						<option value="true">Active</option>
						<option value="false">Inactive</option>
					</select>

					<label className="mt-2">Status</label>
					<select
						className="form-select"
						value={selecteduser.status || ""}
						onChange={(e) =>
							setSelecteduser({ ...selecteduser, status: e.target.value })
						}
					>
						<option value="">Select</option>
						<option value="basic">Basic</option>
						<option value="pro">Pro</option>
					</select>

					<label className="mt-2">Access</label>
					<select
						className="form-select"
						value={selecteduser.access || ""}
						onChange={(e) =>
							setSelecteduser({ ...selecteduser, access: e.target.value })
						}
					>
						<option value="">Select</option>
						<option value="online">Online</option>
						<option value="offline">Offline</option>
					</select>

					<button className="btn mt-3 btn-success" onClick={handleSave}>
						{editId ? "Update" : "Create"}
					</button>
				</div>
			</Dialog>

			<UserList users={users} edit_user={edit_user} delete_user={delete_user} change_status={change_status} />
		</div>
	);
};

export default Users;