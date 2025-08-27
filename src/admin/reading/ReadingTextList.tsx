import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useNavigate } from "react-router-dom";

interface PropsType {
    id?: string;
    title?: string;
    reading_passage?: string;
    part?: string;
    reading_id?: string;
}
interface PropsTypes {
    readings: PropsType[];
    onedit?: (id: string) => void;
    ondelete?: (id: string) => void;
}

const ReadingTextList = ({ readings, onedit, ondelete }: PropsTypes) => {
    const navigate = useNavigate();

    const actionBodyTemplate = (rowData: PropsType) => {
        return (
            <div className="flex gap-2 my-2">
                <button
                    className="btn btn-primary btn-sm mx-2"
                    onClick={() => onedit && onedit(rowData.id!)}
                >
                    <i className="pi pi-pencil"></i>
                </button>
                <button
                    className="btn btn-danger btn-sm "
                    onClick={() => ondelete && ondelete(rowData.id!)}
                >
                    <i className="pi pi-trash"></i>
                </button>
            </div>
        );
    };


    return (
        <div className="mt-4">
            {readings.map((item, i) => {
                return <div className="row border border-primary m-2 align-items-end" key={i}>
                    <div className="col-11">
                        <p><b>TITLE: </b>{item.title}</p>
                        <p><b>PART: </b>{item.part}</p>
                        <hr />
                        <span dangerouslySetInnerHTML={{ __html: item.reading_passage || "" }} />
                    </div>
                    <div className="col-1">
                        {actionBodyTemplate(item)}
                    </div>
                </div>
            })}

        </div>
    );
};

export default ReadingTextList;
