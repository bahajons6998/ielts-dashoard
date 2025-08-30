import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { IContent, IOption } from './ListeningTypes';
import CKEditorWrapper from './CKEditorWrapper';

interface DraggableSelectionFormProps {
  content: IContent;
  onUpdate: (updatedContent: IContent) => void;
}

const DraggableSelectionForm: React.FC<DraggableSelectionFormProps> = ({ content, onUpdate }) => {
  const [draggableData, setDraggableData] = useState<IContent>(content);

  // Faqat kerakli holatda yuqoriga update qilish
  useEffect(() => {
    if (JSON.stringify(draggableData) !== JSON.stringify(content)) {
      onUpdate(draggableData);
    }
  }, [draggableData, content, onUpdate]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDraggableData(prev => ({
      ...prev, 
      [name]: value
    }));
  }, []);

  const handleContentChange = useCallback((htmlContent: string) => {
    setDraggableData(prev => ({
      ...prev, 
      content: htmlContent
    }));
  }, []);

  const handleConditionChange = useCallback((htmlContent: string) => {
    setDraggableData(prev => ({
      ...prev, 
      condition: htmlContent
    }));
  }, []);

  const handleAddOption = useCallback(() => {
    const newOption: IOption = {
      id: `option-${Date.now()}`,
      value: ''
    };

    setDraggableData(prev => {
      const options = prev.options || [];
      return {
        ...prev,
        options: [...options, newOption]
      };
    });
  }, []);

  const handleOptionChange = useCallback((index: number, value: string) => {
    if (!draggableData.options) return;
    
    setDraggableData(prev => {
      if (!prev.options) return prev;
      
      const updatedOptions = [...prev.options];
      updatedOptions[index] = {
        ...updatedOptions[index],
        value
      };
      
      return { ...prev, options: updatedOptions };
    });
  }, [draggableData.options]);

  const handleRemoveOption = useCallback((index: number) => {
    if (!draggableData.options) return;
    
    setDraggableData(prev => {
      const options = prev.options || [];
      return {
        ...prev,
        options: options.filter((_, i) => i !== index)
      };
    });
  }, [draggableData.options]);
  
  const handleOptionsTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setDraggableData(prev => ({
      ...prev, 
      optionsTitle: value
    }));
  }, []);

  // Bo'sh joylar sonini hisoblash
  const gapCount = useMemo(() => {
    if (!draggableData.content) return 0;
    
    // @@ belgilarini sanash
    const matches = draggableData.content.match(/@@/g);
    return matches ? matches.length : 0;
  }, [draggableData.content]);

  // To'g'ri javoblarni yangilash
  const handleCorrectAnswerChange = useCallback((gapIndex: number, optionId: string) => {
    setDraggableData(prev => {
      const correctAnswers = prev.correctDraggableAnswers || {};
      const gapKey = `gap-${gapIndex}`;
      
      return {
        ...prev,
        correctDraggableAnswers: {
          ...correctAnswers,
          [gapKey]: optionId
        }
      };
    });
  }, []);

  return (
    <div className="draggable-selection-form">
      <div className="form-group">
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={draggableData.title || ''}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="form-group">
        <label>Condition (Instructions):</label>
        <CKEditorWrapper
          initialContent={draggableData.condition || ''}
          onContentChange={handleConditionChange}
          height="200px"
          placeholder="Sudraladigan elementlar savoli uchun ko'rsatmalarni kiriting..."
        />
      </div>
      
      <div className="form-group">
        <label>Content:</label>
        <p className="tip">Use @@ to mark spaces where options should be dragged.</p>
        <CKEditorWrapper
          initialContent={draggableData.content || ''}
          onContentChange={handleContentChange}
          height="250px"
          placeholder="Elementlar joylashtiriladigan joylarni @@ belgisi bilan belgilab matn kiriting..."
        />
      </div>
      
      <div className="form-group">
        <label>Options Title:</label>
        <input
          type="text"
          value={draggableData.optionsTitle || ''}
          onChange={handleOptionsTitleChange}
          placeholder="Options"
        />
      </div>
      
      <div className="options-section">
        <h5>Options</h5>
        {draggableData.options?.map((option, index) => (
          <div key={option.id} className="option-row">
            <input
              type="text"
              value={option.value}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
            />
            <button
              type="button"
              className="remove-option-btn"
              onClick={() => handleRemoveOption(index)}
            >
              Remove
            </button>
          </div>
        ))}
        
        <button
          type="button"
          className="add-option-btn"
          onClick={handleAddOption}
        >
          Add Option
        </button>
      </div>

      {gapCount > 0 && draggableData.options && draggableData.options.length > 0 && (
        <div className="correct-answers-section">
          <h5>To'g'ri javoblar</h5>
          <p className="tip">Har bir bo'sh joy uchun to'g'ri javobni tanlang</p>
          
          {Array.from({ length: gapCount }).map((_, gapIndex) => (
            <div key={`gap-${gapIndex}`} className="correct-answer-row">
              <label>Bo'sh joy {gapIndex + 1}:</label>
              <select
                value={(draggableData.correctDraggableAnswers && draggableData.correctDraggableAnswers[`gap-${gapIndex}`]) || ''}
                onChange={(e) => handleCorrectAnswerChange(gapIndex, e.target.value)}
              >
                <option value="">-- Javobni tanlang --</option>
                {draggableData.options?.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.value}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DraggableSelectionForm;