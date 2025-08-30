import React, { useState, useEffect, useCallback } from 'react';
import { IQuestionData, IContent } from './ListeningTypes';
import CompletionQuestionForm from './CompletionQuestionForm';
import MultipleChoiceQuestionForm from './MultipleChoiceQuestionForm';
import DraggableSelectionForm from './DraggableSelectionForm';

interface ListeningQuestionFormProps {
  question: IQuestionData;
  onUpdate: (updatedQuestion: IQuestionData) => void;
}

const ListeningQuestionForm: React.FC<ListeningQuestionFormProps> = ({ question, onUpdate }) => {
  const [questionData, setQuestionData] = useState<IQuestionData>(question);
  
  // Faqat kerakli holatda yuqori komponentga o'zgartirishlarni yuborish
  useEffect(() => {
    if (JSON.stringify(questionData) !== JSON.stringify(question)) {
      onUpdate(questionData);
    }
  }, [questionData, question, onUpdate]);

  const handleNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setQuestionData(prev => ({
      ...prev,
      numberOfQuestions: value
    }));
  }, []);

  const handleAddContent = useCallback((type: IContent['type']) => {
    try {
      const newId = `content-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      // Yangi kontentni turi bo'yicha yaratish
      const newContent: IContent = {
        id: newId,
        type,
        title: type === 'multiple-choice' ? null : '',
        condition: '',
        content: type === 'completion' ? '' : undefined,
        questions: type === 'multiple-choice' ? [] : undefined,
        options: (type === 'multiple-choice' || type === 'draggable-selection') ? [] : undefined
      };

      // Eski ma'lumotlarga yangi ma'lumotni qo'shish
      setQuestionData(prev => ({
        ...prev,
        content: [...prev.content, newContent]
      }));
      
      console.log(`Yangi ${type} savol qo'shildi. ID: ${newId}`);
    } catch (error) {
      console.error("Savol qo'shishda xatolik yuz berdi:", error);
    }
  }, []);

  const handleContentUpdate = useCallback((updatedContent: IContent, index: number) => {
    setQuestionData(prev => {
      const newContents = [...prev.content];
      newContents[index] = updatedContent;
      
      return {
        ...prev,
        content: newContents
      };
    });
  }, []);

  const handleRemoveContent = useCallback((index: number) => {
    setQuestionData(prev => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index)
    }));
  }, []);

  const renderContentForm = (content: IContent, index: number) => {
    switch (content.type) {
      case 'completion':
        return (
          <CompletionQuestionForm
            content={content}
            onUpdate={(updatedContent) => handleContentUpdate(updatedContent, index)}
          />
        );
      case 'multiple-choice':
        return (
          <MultipleChoiceQuestionForm
            content={content}
            onUpdate={(updatedContent) => handleContentUpdate(updatedContent, index)}
          />
        );
      case 'draggable-selection':
        return (
          <DraggableSelectionForm
            content={content}
            onUpdate={(updatedContent) => handleContentUpdate(updatedContent, index)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="listening-question-form">
      <div className="form-group">
        <label>Number of Questions:</label>
        <input
          type="number"
          min="0"
          value={questionData.numberOfQuestions}
          onChange={handleNumberChange}
        />
      </div>

      <div className="content-forms">
        {questionData.content.map((content, index) => (
          <div key={content.id} className="content-form-container">
            <h5>{content.type === 'completion' ? 'Completion' : content.type === 'multiple-choice' ? 'Multiple Choice' : 'Draggable Selection'}</h5>
            {renderContentForm(content, index)}
            <button
              type="button"
              className="remove-content-btn"
              onClick={() => handleRemoveContent(index)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      
      <div className="content-type-buttons" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h4>Yangi savol qo'shish:</h4>
        <button
          type="button"
          onClick={() => handleAddContent('completion')}
          style={{ marginRight: '10px', marginBottom: '10px' }}
        >
          Add Completion Question
        </button>
        <button
          type="button"
          onClick={() => handleAddContent('multiple-choice')}
          style={{ marginRight: '10px', marginBottom: '10px' }}
        >
          Add Multiple Choice Question
        </button>
        <button
          type="button"
          onClick={() => handleAddContent('draggable-selection')}
          style={{ marginBottom: '10px' }}
        >
          Add Draggable Selection
        </button>
      </div>
    </div>
  );
};

export default ListeningQuestionForm;