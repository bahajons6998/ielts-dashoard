import React, { useState, useEffect } from 'react';

interface RichTextEditorProps {
  initialContent: string;
  onContentChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ initialContent, onContentChange }) => {
  const [content, setContent] = useState(initialContent);
  
  // You would typically use a library like CKEditor, TinyMCE, or Quill here
  // For this simplified example, we'll use a textarea with some basic formatting buttons
  
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    onContentChange(e.target.value);
  };

  const insertFormatting = (format: string) => {
    let formattedText = '';
    
    switch (format) {
      case 'bold':
        formattedText = `<strong>${getSelectedText()}</strong>`;
        break;
      case 'italic':
        formattedText = `<em>${getSelectedText()}</em>`;
        break;
      case 'blank':
        formattedText = '@@';
        break;
      case 'paragraph':
        formattedText = `<p>${getSelectedText()}</p>`;
        break;
      case 'heading':
        formattedText = `<h4>${getSelectedText()}</h4>`;
        break;
      case 'list':
        formattedText = `<ul><li>${getSelectedText()}</li></ul>`;
        break;
      default:
        formattedText = getSelectedText();
    }
    
    insertTextAtCursor(formattedText);
  };

  const getSelectedText = (): string => {
    const textarea = document.getElementById('rich-text-editor') as HTMLTextAreaElement;
    if (!textarea) return '';
    
    return textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
  };

  const insertTextAtCursor = (text: string) => {
    const textarea = document.getElementById('rich-text-editor') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    
    const newContent = 
      content.substring(0, startPos) + 
      text + 
      content.substring(endPos);
    
    setContent(newContent);
    onContentChange(newContent);
    
    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = startPos + text.length;
      textarea.selectionEnd = startPos + text.length;
    }, 0);
  };

  return (
    <div className="rich-text-editor">
      <div className="editor-toolbar">
        <button type="button" onClick={() => insertFormatting('bold')}>
          <strong>B</strong>
        </button>
        <button type="button" onClick={() => insertFormatting('italic')}>
          <em>I</em>
        </button>
        <button type="button" onClick={() => insertFormatting('paragraph')}>
          P
        </button>
        <button type="button" onClick={() => insertFormatting('heading')}>
          H
        </button>
        <button type="button" onClick={() => insertFormatting('list')}>
          List
        </button>
        <button type="button" onClick={() => insertFormatting('blank')}>
          Blank (@@)
        </button>
      </div>
      
      <textarea
        id="rich-text-editor"
        value={content}
        onChange={handleContentChange}
        rows={8}
        className="editor-textarea"
      />
      
      <div className="preview-section">
        <h6>HTML Preview</h6>
        <div
          className="html-preview"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;