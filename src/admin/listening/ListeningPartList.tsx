interface PropsTypes {
	parts?: ListeningPart[];
	onEdit?: (id: string) => void;
	onDelete?: (id: string) => void;
}

export interface ListeningPart {
	id: string;
	content: string;
	part: string;
	listening_id: string;
}

const ListeningPartList = ({ parts = [], onEdit, onDelete }: PropsTypes) => {
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
			</div>
		);
	};

	return (
		<div className="mt-4">
			{parts.length === 0 ? (
				<h5 className="text-center text-muted">No parts found</h5>
			) : (
				parts.map((part) => (
					<div key={part.id} className="row border p-3 my-2">
						<div className="col-12 py-2">
							<h6 className="fw-bold">{part.part}</h6>
							<hr />
							<span dangerouslySetInnerHTML={{ __html: part.content }} />
							<div>{actionBodyTemplate(part.id)}</div>
						</div>
					</div>
				))
			)}
		</div>
	);
};

export default ListeningPartList;
