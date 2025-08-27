import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";


interface EditorProps {
    value?: string;
    onChange?: (value: any) => void;
}

const Editor = ({ value, onChange }: EditorProps) => {
    // const [data, setData] = useState<string>("");

    return (
        <CKEditor
            editor={ClassicEditor}
            data={value || ''}
            config={{
                licenseKey: "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3ODY2NjU1OTksImp0aSI6IjliZTZhMmU2LTBlMDEtNGMzNS05NTY2LTQ4ZjkzM2RlMzg3MCIsImxpY2Vuc2VkSG9zdHMiOlsiMTI3LjAuMC4xIiwibG9jYWxob3N0IiwiMTkyLjE2OC4qLioiLCIxMC4qLiouKiIsIjE3Mi4qLiouKiIsIioudGVzdCIsIioubG9jYWxob3N0IiwiKi5sb2NhbCJdLCJ1c2FnZUVuZHBvaW50IjoiaHR0cHM6Ly9wcm94eS1ldmVudC5ja2VkaXRvci5jb20iLCJkaXN0cmlidXRpb25DaGFubmVsIjpbImNsb3VkIiwiZHJ1cGFsIl0sImxpY2Vuc2VUeXBlIjoiZGV2ZWxvcG1lbnQiLCJmZWF0dXJlcyI6WyJEUlVQIiwiRTJQIiwiRTJXIl0sInZjIjoiMGNkNTAyYzcifQ.5onEveYfrKu2gxC8vk0XR9jbrr4FdajY06FRwWLXDN7kgSpPBQtAthWGLINUfCN42QeaMfOlNwviLwsT4A5xOwyYzcifQ.5onEveYfrKu2gxC8vk0XR9jbrr4FdajY06FRwWLXDN7kgSpPBQtAthWGLINUfCN42QeaMfOlNwviLwsT4A5xOw",
                toolbar: [
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "link",
                    "bulletedList",
                    "numberedList",
                    "|",
                    "insertTable",
                    "blockQuote",
                    "undo",
                    "redo",
                    "imageUpload"
                ],
                simpleUpload: {
                    uploadUrl: "http://localhost:5000/api/v1/ielts/", // Backend manzilingiz
                    withCredentials: false,
                    headers: {
                        // Agar kerak bo‘lsa token qo‘shasiz
                        // Authorization: "Bearer <token>"
                    }
                }
            }}
            style={{ heigh: '150px' }}
            onChange={(_: any, editor: any) => {
                const newData = editor.getData();
                // setData(newData);
                if (onChange) onChange(newData);
            }}
            onError={(error: any) => {
                console.error("CKEditor xatosi:", error);
            }}
        />
    );
};

export default Editor;
