import { Image } from "primereact/image";
import { Writings } from "./Writing";

// interface Writings {
// 	id: string;
// 	question?: string;
// 	instruction?: string;
// 	image_url?: string;
// 	type: "task1" | "task2";
// 	test_id?: string;
// }

interface PropsTypes {
	writings?: Writings[];
	onEdit?: (id: string) => void;
	onDelete?: (id: string) => void;
}

const WritingList = ({ writings = [], onEdit, onDelete }: PropsTypes) => {



	const actionBodyTemplate = (id: string) => {
		return (
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
		);
	};

	return (
		<div className="mt-4">
			{writings.length === 0 ? (
				<h5 className="text-center text-muted">No writings found</h5>
			) : (
				writings.map((writing) => (
					<div key={writing.id} className="row border-primary border p-3 my-2">
						{/* LEFT SIDE - IMAGE (only for task1) */}
						<div className="col-6 pt-2 border  d-flex justify-content-center align-items-center">
							{writing.type === "task1" && writing.image_url ? (
								<Image
									src={writing.image_url}
									alt="Writing Task Image"
									style={{ objectFit: "contain" }}
									width="250"
									preview
								/>
							) : (
								<div
									style={{
										width: "250px",
										backgroundColor: "#e1e1e1",
										margin: "0 auto",
									}}
								>
									<h4 className="text-center p-5">No Image</h4>
								</div>
							)}
						</div>

						{/* RIGHT SIDE - TEXT */}
						<div className="col-6 border py-3">
							{/* <h5 className="fw-bold">Type: {writing.type.toUpperCase()}</h5> */}
							<div>
								<label className="fw-bold">Question:</label>
								<span style={{ whiteSpace: "pre-wrap" }}
									dangerouslySetInnerHTML={{ __html: writing.question || "" }}
								/>
							</div>
							<div className="mt-2">
								<label className="fw-bold">Instruction:</label>
								<p>{writing.instruction}</p>
							</div>

							<div>
								{actionBodyTemplate(writing.id)}
							</div>
						</div>
					</div>
				))
			)}
		</div>
	);
};

export default WritingList;
