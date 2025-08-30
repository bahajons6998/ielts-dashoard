import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface CKEditorWrapperProps {
  initialContent: string;
  onContentChange: (content: string) => void;
  height?: string;
  placeholder?: string;
}

const CKEditorWrapper: React.FC<CKEditorWrapperProps> = ({
  initialContent,
  onContentChange,
  height = '300px',
  placeholder = 'Matningizni kiriting...'
}) => {
  return (
    <div className="ckeditor-wrapper" style={{ border: '1px solid #ddd', borderRadius: '4px' }}>
      <CKEditor
        editor={ClassicEditor}
        data={initialContent}
        config={{
          placeholder: placeholder,
          toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            'indent',
            'outdent',
            '|',
            'undo',
            'redo'
          ],
          heading: {
            options: [
              { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
              { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
              { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
              { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
            ]
          }
        }}
        onReady={(editor: any) => {
          // Kerak bo'lsa editor o'lchami sozlash
          editor.editing.view.change((writer: any) => {
            writer.setStyle('height', height, editor.editing.view.document.getRoot());
          });
        }}
        onChange={(_event: any, editor: any) => {
          const data = editor.getData();
          onContentChange(data);
        }}
      />
      
      {/* Bo'sh joy belgisi qo'shish uchun tugma */}
      <div className="ckeditor-custom-buttons" style={{ 
        padding: '8px', 
        borderTop: '1px solid #ddd',
        display: 'flex',
        gap: '8px'
      }}>
        <button
          type="button"
          onClick={() => {
            // Joriy editorni topish
            const editor = document.querySelector('.ck-editor__editable');
            if (!editor) return;
            
            // Aktiv editorga focus
            (editor as HTMLElement).focus();
            
            // Selection orqali '@@' qo'shish
            document.execCommand('insertText', false, '@@');
          }}
          style={{
            padding: '6px 12px',
            background: '#f0f0f0',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Bo'sh joy qo'shish (@@)
        </button>
      </div>
    </div>
  );
};

export default CKEditorWrapper;