import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { IContent } from './ListeningTypes';
import CKEditorWrapper from './CKEditorWrapper';

/**
 * CompletionQuestionForm - Bo'sh joylarni to'ldirish tipidagi savollar uchun forma
 * 
 * Bu komponenta IELTS Listening testida "gap-filling" yoki "bo'sh joylarni to'ldirish" 
 * tipidagi savollarni yaratish uchun ishlatiladi.
 * 
 * O'quvchilar audio tinglashgandan so'ng, matn ichidagi bo'sh joylarga mos so'zlarni 
 * yoki raqamlarni kiritishlari kerak bo'ladi.
 */
interface CompletionQuestionFormProps {
  content: IContent;
  onUpdate: (updatedContent: IContent) => void;
}

const CompletionQuestionForm: React.FC<CompletionQuestionFormProps> = ({ content, onUpdate }) => {
  const [completionData, setCompletionData] = useState<IContent>(content);
  
  // Faqat zarur bo'lgan holatdagina yuqoriga update qilish
  useEffect(() => {
    if (JSON.stringify(completionData) !== JSON.stringify(content)) {
      onUpdate(completionData);
    }
  }, [completionData, content, onUpdate]);

  // Forma maydonlaridagi o'zgarishlarni boshqaradi
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompletionData(prev => ({
      ...prev, 
      [name]: value
    }));
  }, []);

  // Savol matni o'zgarishini boshqaradi
  const handleContentChange = useCallback((htmlContent: string) => {
    setCompletionData(prev => ({
      ...prev, 
      content: htmlContent
    }));
  }, []);

  // Ko'rsatmalar o'zgarishini boshqaradi
  const handleConditionChange = useCallback((htmlContent: string) => {
    setCompletionData(prev => ({
      ...prev, 
      condition: htmlContent
    }));
  }, []);

  // Bo'sh joylar sonini hisoblash
  const gapCount = useMemo(() => {
    if (!completionData.content) return 0;
    
    // @@ belgilarini sanash
    const matches = completionData.content.match(/@@/g);
    return matches ? matches.length : 0;
  }, [completionData.content]);

  // To'g'ri javoblarni yangilash
  const handleCorrectAnswerChange = useCallback((index: number, value: string) => {
    setCompletionData(prev => {
      const correctAnswers = Array.isArray(prev.correctAnswers) ? [...prev.correctAnswers] : [];
      
      // Massivni kerakli o'lchamgacha kengaytirish
      while (correctAnswers.length < gapCount) {
        correctAnswers.push('');
      }
      
      correctAnswers[index] = value;
      
      return {
        ...prev,
        correctAnswers
      };
    });
  }, [gapCount]);

  return (
    <div className="completion-question-form">
      <div className="info-block" style={{ backgroundColor: '#f0f8ff', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #d0e3ff' }}>
        <h4>Bo'sh joylarni to'ldirish savollari (Completion Questions) haqida</h4>
        <p>Bu turdagi savollarda:</p>
        <ul>
          <li>O'quvchilar audio eshitib, ma'lumotni to'g'ri tushinib, bo'sh joylarga mos so'zlarni yozishlari kerak</li>
          <li>Bo'sh joylar @@ belgilari orqali belgilanadi</li>
          <li>Ko'pincha bitta so'z yoki raqam kiritilishi talab qilinadi</li>
          <li>Masalan: "The meeting starts at @@" (javob: "10" yoki "ten")</li>
        </ul>
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            window.open('/admin/iels_builder/listening/CompletionQuestion_UZ_Help.md', '_blank');
          }}
          style={{ color: 'blue', textDecoration: 'underline' }}
        >
          Batafsil ma'lumot (O'zbekcha)
        </a>
      </div>
      
      <div className="form-group">
        <label>Sarlavha (Title):</label>
        <input
          type="text"
          name="title"
          value={completionData.title || ''}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="form-group">
        <label>Ko'rsatmalar (Instructions):</label>
        <CKEditorWrapper
          initialContent={completionData.condition || ''}
          onContentChange={handleConditionChange}
          height="200px"
          placeholder="Savol ko'rsatmalarini kiriting..."
        />
      </div>
      
      <div className="form-group">
        <label>Savol matni (Question Content):</label>
        <p className="tip">Bo'sh joylarni belgilash uchun @@ belgisidan foydalaning</p>
        <CKEditorWrapper
          initialContent={completionData.content || ''}
          onContentChange={handleContentChange}
          height="250px"
          placeholder="Bo'sh joylarni belgilab savol matnini kiriting..."
        />
      </div>

      {gapCount > 0 && (
        <div className="form-group">
          <h5>To'g'ri javoblar:</h5>
          <div className="correct-answers-container">
            {Array.from({ length: gapCount }).map((_, index) => (
              <div key={`answer-${index}`} className="correct-answer-row">
                <label>Bo'sh joy {index + 1}:</label>
                <input 
                  type="text"
                  value={completionData.correctAnswers?.[index] || ''}
                  onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
                  placeholder={`To'g'ri javob ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletionQuestionForm;