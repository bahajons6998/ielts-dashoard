import React, { useState, useEffect } from 'react';
import { IPart } from './ListeningTypes';
import ListeningQuestionForm from './ListeningQuestionForm';
import AudioUploader from './AudioUploader';

interface ListeningPartFormProps {
  part: IPart;
  onUpdate: (updatedPart: IPart) => void;
  onRemove: () => void;
}

const ListeningPartForm: React.FC<ListeningPartFormProps> = ({ part, onUpdate, onRemove }) => {
  const [partData, setPartData] = useState<IPart>(part);
  
  // Faqat kerakli holatda yuqori komponentga o'zgartirishlarni yuborish
  useEffect(() => {
    if (JSON.stringify(partData) !== JSON.stringify(part)) {
      onUpdate(partData);
    }
  }, [partData, part, onUpdate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPartData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAudioUpdate = (audioData: { url: string; fileName: string }) => {
    setPartData(prev => ({
      ...prev,
      audio: {
        ...prev.audio,
        url: audioData.url,
        fileName: audioData.fileName
      }
    }));
  };

  const handleQuestionUpdate = (updatedQuestion: any) => {
    setPartData(prev => ({
      ...prev,
      question: updatedQuestion
    }));
  };

  return (
    <div className="listening-part-form">
      <div className="form-group">
        <label>Part Type:</label>
        <select
          name="part"
          value={partData.part}
          onChange={handleInputChange}
        >
          <option value="PART_1">Part 1</option>
          <option value="PART_2">Part 2</option>
          <option value="PART_3">Part 3</option>
          <option value="PART_4">Part 4</option>
        </select>
      </div>
      
      <div className="audio-section">
        <h4>Audio</h4>
        <AudioUploader 
          initialAudio={partData.audio}
          onAudioChange={handleAudioUpdate}
        />
      </div>
      
      <div className="question-section">
        <h4>Questions</h4>
        <ListeningQuestionForm 
          question={partData.question}
          onUpdate={handleQuestionUpdate}
        />
      </div>
      
      <button 
        type="button" 
        className="remove-part-btn"
        onClick={onRemove}
      >
        Remove Part
      </button>
    </div>
  );
};

export default ListeningPartForm;