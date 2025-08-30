import React, { useState } from 'react';
import { IListeningTest } from './ListeningTypes';
import ListeningPartForm from './ListeningPartForm';

interface ListeningTestFormProps {
  initialData?: IListeningTest;
  onSave: (data: IListeningTest) => void;
}

const ListeningTestForm: React.FC<ListeningTestFormProps> = ({ initialData, onSave }) => {
  const [testData, setTestData] = useState<IListeningTest>(
    initialData || {
      id: 0,
      title: '',
      description: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 0,
      updatedBy: 0,
      forCdi: true,
      listening: {
        id: 0,
        title: '',
        description: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 0,
        updatedBy: 0,
        forCdi: true,
        parts: []
      }
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTestData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleListeningInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTestData(prev => ({
      ...prev,
      listening: {
        ...prev.listening,
        [name]: value
      }
    }));
  };

  const handleSaveClick = () => {
    onSave(testData);
  };

  const handleAddPart = () => {
    setTestData(prev => ({
      ...prev,
      listening: {
        ...prev.listening,
        parts: [
          ...prev.listening.parts,
          {
            id: Date.now(),
            part: `PART_${prev.listening.parts.length + 1}`,
            question: {
              id: Date.now(),
              content: [],
              numberOfQuestions: 0
            },
            audio: {
              id: 0,
              url: '',
              fileName: ''
            },
            answers: {}
          }
        ]
      }
    }));
  };

  const handlePartUpdate = (updatedPart: any, index: number) => {
    const updatedParts = [...testData.listening.parts];
    updatedParts[index] = updatedPart;
    
    setTestData(prev => ({
      ...prev,
      listening: {
        ...prev.listening,
        parts: updatedParts
      }
    }));
  };

  const handleRemovePart = (index: number) => {
    const updatedParts = testData.listening.parts.filter((_, i) => i !== index);
    
    setTestData(prev => ({
      ...prev,
      listening: {
        ...prev.listening,
        parts: updatedParts
      }
    }));
  };

  return (
    <div className="listening-test-form">
      <h2>Listening Test Builder</h2>
      
      <div className="test-info-section">
        <h3>Test Information</h3>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={testData.title}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={testData.description}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="listening-section">
        <h3>Listening Section</h3>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={testData.listening.title}
            onChange={handleListeningInputChange}
          />
        </div>
        
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={testData.listening.description}
            onChange={handleListeningInputChange}
          />
        </div>
      </div>

      <div className="parts-section">
        <h3>Listening Parts</h3>
        {testData.listening.parts.map((part, index) => (
          <div key={part.id} className="part-container">
            <h4>Part {index + 1}</h4>
            <ListeningPartForm 
              part={part} 
              onUpdate={(updatedPart) => handlePartUpdate(updatedPart, index)} 
              onRemove={() => handleRemovePart(index)}
            />
          </div>
        ))}
        
        <button 
          type="button" 
          className="add-part-btn"
          onClick={handleAddPart}
        >
          Add Part
        </button>
      </div>
      
      <div className="form-actions">
        <button 
          type="button" 
          className="save-btn"
          onClick={handleSaveClick}
        >
          Save Test
        </button>
      </div>
    </div>
  );
};

export default ListeningTestForm;