import { useNavigate } from "react-router-dom";

interface PropsType {
	title: string;
	description: string;
	test_id: string;
	id: string;
	created_at: string;
	updated_at: string;
}
interface PropsTypes {
	readings: PropsType[];
	onedit?: (id: string) => void;
	ondelete?: (id: string) => void;
}
const ReadingList = ({ readings, onedit, ondelete }: PropsTypes) => {
	const navigate = useNavigate();

	const actionBodyTemplate = (rowData: PropsType) => {
		return (
			<div className="d-flex my-2">
				<button className="btn btn-primary btn-sm" onClick={() => onedit && onedit(rowData.id)}><i className="pi pi-pencil"></i></button>
				<button className="btn btn-danger btn-sm mx-2" onClick={() => ondelete && ondelete(rowData.id)}><i className="pi pi-trash"></i></button>
				<button className="btn btn-primary btn-sm" onClick={() => navigate(`/admin/v1/ielts/${rowData.test_id}/reading/${rowData.id}`)}><i className="pi pi-arrow-circle-right"></i></button>
			</div>
		);
	};

	return (
		<div className="mt-4">
			{readings.map((item, i) => {
				return (
					<div key={i} className="row align-items-end border m-2 p-2 border-primary">
						<div className="col-10 border">
							<p>{item.title}</p>
							<hr />
							<span dangerouslySetInnerHTML={{ __html: item.description }} />
						</div>
						<div className="col-2 border">
							{actionBodyTemplate(item)}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default ReadingList;