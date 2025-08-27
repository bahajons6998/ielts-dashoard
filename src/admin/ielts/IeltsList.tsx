// IeltsList.tsx
import { useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import { base_url } from "../../utils/base_url";
import { useNavigate } from "react-router-dom";
import { Image } from "primereact/image";

interface IeltsTest {
	id: number;
	title: string;
	description: string;
	image_url: string;
	status: string;
	created_at: string;
	updated_at: string;
}

interface IeltsListProps {
	tests: IeltsTest[];
	onEdit: (test: IeltsTest) => void;
	onfetch: () => void;
}

const IeltsList = ({ tests, onEdit, onfetch }: IeltsListProps) => {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleDelete = async (id: number) => {
		if (!window.confirm("Are you sure you want to delete this IELTS test?")) {
			return;
		}
		const token = localStorage.getItem("token");
		try {
			setLoading(true);
			await axios.delete(`${base_url}/tests/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			alert("IELTS deleted successfully!");
			onfetch();
		} catch (error) {
			console.error("Error deleting IELTS:", error);
			alert("Failed to delete IELTS");
		} finally {
			setLoading(false);
		}
	};

	const actionBodyTemplate = (rowData: IeltsTest) => {
		return (
			<div className="flex gap-2 my-2">
				<button className="btn btn-primary btn-sm " onClick={() => onEdit(rowData)}><i className="pi pi-pencil"></i></button>
				<button className="btn btn-danger btn-sm mx-2" onClick={() => handleDelete(rowData.id)}><i className="pi pi-trash"></i></button>
				<button className="btn btn-success btn-sm" onClick={() => navigate(`/admin/v1/ielts/${rowData.id}`)}><i className="pi pi-arrow-circle-right"></i></button>
			</div>
		);
	};

	const imageBodyTemplate = (rowData: IeltsTest) => {
		return (
			<Image src={rowData.image_url} alt="Image" width={'100%'} style={{ objectFit: "cover" }} preview />
		);
	};
	const gosection = (rowData: IeltsTest) => {
		return (
			<button className="btn btn-outline-primary" onClick={() => navigate(`/admin/v1/ielts/${rowData.id}`)}><i className="pi pi-arrow-circle-right"></i></button>
		);
	};

	return (
		<div className="mt-4">
			<DataTable
				value={tests}
				paginator
				rows={10}
				style={{ display: 'none' }}
				stripedRows
				responsiveLayout="scroll"
				emptyMessage="No IELTS tests found."
			>
				{/* <Column field="id" header="ID" sortable /> */}
				<Column field="title" header="Title" sortable />
				<Column header="Image" body={imageBodyTemplate} />
				<Column field="status" header="Status" sortable />
				{/* <Column field="created_at" header="Created At" sortable /> */}
				{/* <Column field="updated_at" header="Updated At" sortable /> */}
				<Column header="Actions" body={actionBodyTemplate} />
				<Column field="updated_at" header="Sections" body={gosection} />
			</DataTable>
			<div className="row">
				{tests.map((item, i) => {
					return (<div className="col-4" key={i}>
						<div className="card border p-2">
							{imageBodyTemplate(item)}
							<h5>{item.title}</h5>
							<hr />
							<span dangerouslySetInnerHTML={{ __html: item.description }} />
							<hr />
							{actionBodyTemplate(item)}
						</div>
					</div>)
				})}
			</div>
		</div>
	);
};

export default IeltsList;
