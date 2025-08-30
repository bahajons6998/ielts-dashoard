import React, { useState } from 'react';
import ListeningTestForm from './ListeningTestForm';
import { IListeningTest } from './ListeningTypes';
import './ListeningBuilder.css';

interface ListeningBuilderProps {
  initialData?: IListeningTest;
  onSave?: (data: IListeningTest) => void;
}

const ListeningBuilder: React.FC<ListeningBuilderProps> = ({ initialData, onSave }) => {
  const [testData, setTestData] = useState<IListeningTest | null>(initialData || null);
  const [previewMode, setPreviewMode] = useState(false);
  
  const handleSave = (data: IListeningTest) => {
    setTestData(data);
    if (onSave) {
      onSave(data);
    }
  };
  
  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };
  
  // Sample JSON data for testing (can be removed in production)
  const loadSampleData = () => {
    // This could fetch from an API or use sample data
    const sampleData: IListeningTest = {
      id: 2,
      title: "TEST 2",
      description: "test 2 bu",
      createdAt: "2025-07-23T00:09:19.938681",
      updatedAt: "2025-08-22T10:46:11.818577",
      createdBy: 2,
      updatedBy: 1,
      forCdi: true,
      listening: {
        id: 6,
        title: "LISTENING TEST 2 ",
        description: "WOW",
        createdAt: "2025-06-11T13:22:36.593774",
        updatedAt: "2025-07-11T10:34:37.439641",
        createdBy: 8,
        updatedBy: 8,
        forCdi: true,
        parts: [
          {
            id: 23,
            part: "PART_1",
            question: {
              id: 76,
              content: [
                {
                  id: "fc5ee5ff-2d5a-4c01-889c-903e1ee86d8a",
                  type: "completion",
                  content: "<p><strong>Presents for Peter:</strong></p><p style=\"line-height: 150%\">·<span style=\"font-size: 7pt\"> </span>A wooden @@ (a model)</p><p style=\"line-height: 150%\">·<span style=\"font-size: 7pt\"> </span>Includes a sheet of stickers</p><p style=\"line-height: 150%\">·<span style=\"font-size: 7pt\"> </span>Helps children to understand basic @@</p><p style=\"line-height: 150%\">·<span style=\"font-size: 7pt\"> </span>Price: £17.50</p><p style=\"line-height: 115%\">&nbsp;</p><p style=\"line-height: 150%\">·<span style=\"font-size: 7pt\"> </span>A @@<strong> </strong>feeder</p><p style=\"line-height: 150%\">·<span style=\"font-size: 7pt\"> </span>Includes paints and brush</p><p style=\"line-height: 150%\">·<span style=\"font-size: 7pt\"> </span>Price: £<strong> </strong>@@</p><p style=\"line-height: 115%\">&nbsp;</p><p style=\"line-height: 115%\"><strong>Present for Natalie:</strong></p><p style=\"line-height: 150%\">·<span style=\"font-size: 7pt\"> </span>A chocolate pack</p><p style=\"line-height: 150%\">·<span style=\"font-size: 7pt\"> </span>Kit includes chocolate, moulds, and some small @@</p><p style=\"line-height: 150%\">·<span style=\"font-size: 7pt\"> </span>Helps children to understand effects of @@</p><p style=\"line-height: 150%\">·<span style=\"font-size: 7pt\"> </span>Price: £6.00</p><p style=\"line-height: 150%\">&nbsp;</p><p style=\"line-height: 115%\"><strong>Ordering toys:</strong></p><p style=\"line-height: 150%\">·<span style=\"font-size: 7pt\"> </span>Web address – www. @@ com</p><p style=\"line-height: 150%\">·<span style=\"font-size: 7pt\"> </span>Order before Friday to get free @@</p><p style=\"line-height: 150%\">·<span style=\"font-size: 7pt\"> </span>Can be wrapped and sent straight to children</p><p style=\"line-height: 150%\">·<span style=\"font-size: 7pt\"> </span>Under 'Packaging options' choose @@</p><p>&nbsp; <span style=\"font-size: 16px\">Possible to include a @@</span></p>",
                  title: "Family presents Company speacialists in education toys ",
                  condition: "<p><strong>PART 1 </strong><br><em> Complete the notes below. Write </em><strong><em>ONE WORD AND/OR A NUMBER </em></strong><em>for each answer.</em></p>"
                }
              ],
              numberOfQuestions: 10
            },
            audio: {
              id: 110,
              url: "https://example.com/audio1.mp3",
              fileName: "test 2 part 1.mp3"
            },
            answers: {}
          }
        ]
      }
    };
    
    setTestData(sampleData);
  };
  
  const renderPreview = () => {
    if (!testData) return null;
    
    return (
      <div className="preview-container">
        <h2>{testData.title}</h2>
        <p>{testData.description}</p>
        
        <h3>{testData.listening.title}</h3>
        <p>{testData.listening.description}</p>
        
        {testData.listening.parts.map((part, index) => (
          <div key={part.id} className="preview-part">
            <h4>Part {index + 1}</h4>
            
            <div className="preview-audio">
              <audio controls src={part.audio.url} />
              <p>{part.audio.fileName}</p>
            </div>
            
            <div className="preview-questions">
              {part.question.content.map(content => (
                <div key={content.id} className="preview-content">
                  {content.condition && (
                    <div 
                      className="condition" 
                      dangerouslySetInnerHTML={{ __html: content.condition }}
                    />
                  )}
                  
                  {content.title && <h5>{content.title}</h5>}
                  
                  {content.type === 'completion' && content.content && (
                    <div 
                      className="completion-content"
                      dangerouslySetInnerHTML={{ __html: content.content }}
                    />
                  )}
                  
                  {content.type === 'multiple-choice' && content.questions && (
                    <div className="multiple-choice-content">
                      {content.questions.map((question, qIndex) => (
                        <div key={question.id} className="question">
                          <p>{qIndex + 1}. {question.question}</p>
                          <div className="options">
                            {question.options.map(option => (
                              <div key={option.id} className="option">
                                <input 
                                  type="radio" 
                                  name={`question-${question.id}`} 
                                  id={`option-${option.id}`}
                                  value={option.value}
                                />
                                <label htmlFor={`option-${option.id}`}>
                                  {option.value}. {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {content.type === 'draggable-selection' && (
                    <div className="draggable-selection-content">
                      {content.content && (
                        <div 
                          dangerouslySetInnerHTML={{ __html: content.content }}
                        />
                      )}
                      
                      {content.options && (
                        <div className="options-container">
                          <h6>{content.optionsTitle || 'Options'}</h6>
                          <div className="options-list">
                            {content.options.map(option => (
                              <div key={option.id} className="option-item">
                                {option.value}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="listening-builder">
      <div className="builder-actions">
        <button 
          type="button" 
          className="toggle-preview-btn"
          onClick={togglePreview}
        >
          {previewMode ? 'Edit Mode' : 'Preview Mode'}
        </button>
        
        <button 
          type="button" 
          className="load-sample-btn"
          onClick={loadSampleData}
        >
          Load Sample Data
        </button>
      </div>
      
      {previewMode ? (
        renderPreview()
      ) : (
        <ListeningTestForm 
          initialData={testData || undefined}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ListeningBuilder;