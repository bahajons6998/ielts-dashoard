import React, { useState, useEffect, useCallback } from 'react';
import { IContent, IQuestion } from './ListeningTypes';
import CKEditorWrapper from './CKEditorWrapper';

interface MultipleChoiceQuestionFormProps {
  content: IContent;
  onUpdate: (updatedContent: IContent) => void;
}

const MultipleChoiceQuestionForm: React.FC<MultipleChoiceQuestionFormProps> = ({ content, onUpdate }) => {
  const [multipleChoiceData, setMultipleChoiceData] = useState<IContent>(content);

  // useEffect orqali onUpdate ni chaqirish - bu render jarayonida emas, render tugagandan keyin ishlaydi
  useEffect(() => {
    // Faqat zarur bo'lgan holatdagina update qilish
    if (JSON.stringify(multipleChoiceData) !== JSON.stringify(content)) {
      onUpdate(multipleChoiceData);
    }
  }, [multipleChoiceData, onUpdate, content]);

  const handleConditionChange = useCallback((htmlContent: string) => {
    setMultipleChoiceData(prev => ({
      ...prev,
      condition: htmlContent
    }));
  }, []);

  const handleAddQuestion = useCallback(() => {
    const newQuestion: IQuestion = {
      id: `question-${Date.now()}`,
      question: '',
      options: [
        { id: `option-A-${Date.now()}`, value: 'A', label: '', isCorrect: false },
        { id: `option-B-${Date.now()}`, value: 'B', label: '', isCorrect: false },
        { id: `option-C-${Date.now()}`, value: 'C', label: '', isCorrect: false }
      ],
      correctAnswer: '' // Boshlang'ich holatda to'g'ri javob yo'q
    };

    setMultipleChoiceData(prev => {
      const questions = prev.questions || [];
      return {
        ...prev,
        questions: [...questions, newQuestion]
      };
    });
  }, []);

  const handleQuestionTextChange = useCallback((index: number, text: string) => {
    if (!multipleChoiceData.questions) return;

    setMultipleChoiceData(prev => {
      if (!prev.questions) return prev;

      const updatedQuestions = [...prev.questions];
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        question: text
      };

      return { ...prev, questions: updatedQuestions };
    });
  }, [multipleChoiceData.questions]);

  const handleOptionChange = useCallback((questionIndex: number, optionIndex: number, label: string) => {
    if (!multipleChoiceData.questions) return;

    setMultipleChoiceData(prev => {
      if (!prev.questions) return prev;

      const updatedQuestions = [...prev.questions];
      const updatedOptions = [...updatedQuestions[questionIndex].options];

      updatedOptions[optionIndex] = {
        ...updatedOptions[optionIndex],
        label
      };

      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        options: updatedOptions
      };

      return { ...prev, questions: updatedQuestions };
    });
  }, [multipleChoiceData.questions]);

  const handleRemoveQuestion = useCallback((index: number) => {
    if (!multipleChoiceData.questions) return;

    setMultipleChoiceData(prev => {
      if (!prev.questions) return prev;

      return {
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index)
      };
    });
  }, [multipleChoiceData.questions]);

  const handleAddOption = useCallback((questionIndex: number) => {
    if (!multipleChoiceData.questions) return;

    setMultipleChoiceData(prev => {
      if (!prev.questions) return prev;

      const updatedQuestions = [...prev.questions];
      const options = updatedQuestions[questionIndex].options;
      const newOptionValue = String.fromCharCode(65 + options.length); // A, B, C, D, etc.

      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        options: [
          ...options,
          { id: `option-${newOptionValue}-${Date.now()}`, value: newOptionValue, label: '', isCorrect: false }
        ]
      };

      return { ...prev, questions: updatedQuestions };
    });
  }, [multipleChoiceData.questions]);

  const handleRemoveOption = useCallback((questionIndex: number, optionIndex: number) => {
    if (!multipleChoiceData.questions) return;

    setMultipleChoiceData(prev => {
      if (!prev.questions) return prev;

      const updatedQuestions = [...prev.questions];
      const updatedOptions = updatedQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);

      // Variantlarni qayta raqamlash (A, B, C, etc.)
      const renumberedOptions = updatedOptions.map((opt, i) => ({
        ...opt,
        value: String.fromCharCode(65 + i) // A, B, C, D, etc.
      }));

      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        options: renumberedOptions
      };

      // Agar o'chirilgan option to'g'ri javob bo'lsa, to'g'ri javobni ham qayta ko'rib chiqish kerak
      if (updatedQuestions[questionIndex].correctAnswer === String.fromCharCode(65 + optionIndex)) {
        updatedQuestions[questionIndex].correctAnswer = '';
      }

      return { ...prev, questions: updatedQuestions };
    });
  }, [multipleChoiceData.questions]);

  const handleCorrectAnswerChange = useCallback((questionIndex: number, optionValue: string) => {
    if (!multipleChoiceData.questions) return;

    setMultipleChoiceData(prev => {
      if (!prev.questions) return prev;

      const updatedQuestions = [...prev.questions];
      const currentQuestion = updatedQuestions[questionIndex];

      // Oldingi to'g'ri javobni o'chirib, yangi to'g'ri javobni belgilash
      const updatedOptions = currentQuestion.options.map(opt => ({
        ...opt,
        isCorrect: opt.value === optionValue
      }));

      updatedQuestions[questionIndex] = {
        ...currentQuestion,
        correctAnswer: optionValue,
        options: updatedOptions
      };

      return { ...prev, questions: updatedQuestions };
    });
  }, [multipleChoiceData.questions]);

  return (
    <div className="multiple-choice-form">
      <div className="form-group">
        <label>Condition (Instructions):</label>
        <CKEditorWrapper
          initialContent={multipleChoiceData.condition || ''}
          onContentChange={handleConditionChange}
          height="200px"
          placeholder="Ko'p tanlovli savol uchun ko'rsatmalarni kiriting..."
        />
      </div>

      <div className="questions-section">
        <h5>Questions</h5>
        {multipleChoiceData.questions?.map((question, qIndex) => (
          <div key={question.id} className="question-container">
            <div className="form-group">
              <label>Question {qIndex + 1}:</label>
              <input
                type="text"
                value={question.question}
                onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
              />
            </div>

            <div className="options-container">
              <h6>Options</h6>
              {question.options.map((option, oIndex) => (
                <div key={option.id} className="option-row">
                  <div className="option-label">{option.value}</div>
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    placeholder={`Option ${option.value}`}
                  />
                  <div className="correct-answer-selector">
                    <input
                      type="radio"
                      name={`correct-answer-${question.id}`}
                      checked={question.correctAnswer === option.value}
                      onChange={() => handleCorrectAnswerChange(qIndex, option.value)}
                    />
                    <label>To'g'ri javob</label>
                  </div>
                  <button
                    type="button"
                    className="remove-option-btn"
                    onClick={() => handleRemoveOption(qIndex, oIndex)}
                    disabled={question.options.length <= 2}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="add-option-btn"
                onClick={() => handleAddOption(qIndex)}
              >
                Add Option
              </button>
            </div>

            <button
              type="button"
              className="remove-question-btn"
              onClick={() => handleRemoveQuestion(qIndex)}
            >
              Remove Question
            </button>
          </div>
        ))}

        <button
          type="button"
          className="add-question-btn"
          onClick={handleAddQuestion}
        >
          Add Question
        </button>
      </div>
    </div>
  );
};

export default MultipleChoiceQuestionForm;