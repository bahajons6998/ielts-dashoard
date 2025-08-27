import React from "react";
import { useNavigate } from "react-router-dom";

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

interface UserResultWrapper {
	results: UserResultType[];
}

interface UserType {
	id?: string;
	full_name?: string;
	phone?: string;
	password?: string;
	email?: string;
	isActive?: boolean | null;
	candidate_id?: string;
	status?: string | null;
	access?: string | null;
	createdAt?: string;
	updatedAt?: string;
	deletedAt?: string | null;
	result?: UserResultWrapper;
}

interface UserListProps {
	users: UserType[];
	edit_user: (id: string) => void;
	delete_user: (id: string) => void;
	change_status: (id: string, status: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, edit_user, delete_user, change_status }) => {
	const navigate=useNavigate()
	

	return (
		<div>
			<table className="table table-striped table-bordered">
				<thead>
					<tr>
						<th>#</th>
						<th>Candidate ID</th>
						<th>Full name</th>
						<th>Email</th>
						<th>Phone</th>
						<th>Password</th>
						<th>Status</th>
						<th>Exam</th>
						<th>Access</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{users?.map((item, i) => (
						<tr key={item.id || i} className="align-items-center">
							<td>{i + 1}</td>
							<td>{item.candidate_id}</td>
							<td>{item.full_name}</td>
							<td>{item.email}</td>
							<td>{item.phone}</td>
							<td>{item.password ? "••••••••" : ""}</td>
							<td
								style={{ cursor: "pointer", color: "blue" }}
								onClick={() => item.id && change_status(item.id, item.status || "")}
							>
								{item.status || "—"}
							</td>

							<td>
								<button
									className="btn btn-primary btn-sm"
									onClick={() => navigate(`/admin/v1/users/result/${item.id}`)}
									// onClick={() => handleShowResults(item.result?.results)}
								>
									Show result
								</button>
							</td>

							<td>{item.access}</td>
							<td className="d-flex gap-2">
								<button
									className="btn btn-sm btn-primary"
									onClick={() => item.id && edit_user(item.id)}
								>
									Edit
								</button>
								<button
									className="btn btn-sm btn-danger"
									onClick={() => item.id && delete_user(item.id)}
								>
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default UserList;

