import { Image } from "primereact/image";
import { Listening } from "./Listening";
import { useNavigate } from "react-router-dom";

interface PropsTypes {
	listenings?: Listening[];
	listening_id?: String;
	onEdit?: (id: string) => void;
	onDelete?: (id: string) => void;
}

const ListeningList = ({ listenings = [], onEdit, listening_id, onDelete }: PropsTypes) => {
	const navigate = useNavigate();

	const actionBodyTemplate = (id: string) => {
		return (
			<div className="d-flex justify-content-between">
				<div className="flex gap-2 my-2">
					<button
						className="btn btn-primary btn-sm mx-2"
						onClick={() => onEdit && onEdit(id)}
					>
						<i className="pi pi-pencil"></i>
					</button>
					<button
						className="btn btn-danger btn-sm"
						onClick={() => onDelete && onDelete(id)}
					>
						<i className="pi pi-trash"></i>
					</button>
				</div>
				<button className="btn" onClick={() => navigate(`/admin/v1/ielts/${listening_id}/listening/${id}`)}><i className="pi pi-arrow-right"></i></button>
			</div>
		);
	};

	return (
		<div className="mt-4">
			{listenings.length === 0 ? (
				<h5 className="text-center text-muted">No listenings found</h5>
			) : (
				listenings.map((listening) => (
					<div key={listening.id} className="row border-primary border p-3 my-2">
						{/* LEFT SIDE - IMAGE */}
						<div className="col-4 pt-2 border d-flex justify-content-center align-items-center">
							{listening.image_url ? (
								<Image
									src={listening.image_url}
									alt="Listening Image"
									style={{ objectFit: "contain" }}
									width="200"
									preview
								/>
							) : (
								<div
									style={{
										width: "200px",
										backgroundColor: "#e1e1e1",
										margin: "0 auto",
									}}
								>
									<h6 className="text-center p-4">No Image</h6>
								</div>
							)}
						</div>

						{/* RIGHT SIDE - TEXT & AUDIO */}
						<div className="col-8 border py-3">
							<h5 className="fw-bold">{listening.title}</h5>
							<audio
								src={listening.audio_url}
								controls
								style={{ width: "100%", margin: "10px 0" }}
							/>
							<div>{actionBodyTemplate(listening.id)}</div>
						</div>
					</div>
				))
			)}
		</div>
	);
};

export default ListeningList;
