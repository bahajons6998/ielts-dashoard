export interface IContent {
  id: string;
  type: 'completion' | 'multiple-choice' | 'draggable-selection';
  content?: string;
  title?: string | null;
  condition?: string;
  questions?: IQuestion[];
  options?: IOption[];
  optionsTitle?: string;
  correctAnswers?: string[]; // Completion questions uchun to'g'ri javoblar massivi
  correctDraggableAnswers?: Record<string, string>; // Draggable questions uchun to'g'ri javoblar
}

export interface IQuestion {
  id: string;
  question: string;
  options: IOption[];
  correctAnswer?: string; // Multiple choice questions uchun to'g'ri javob
}

export interface IOption {
  id: string;
  value: string;
  label?: string;
  isCorrect?: boolean; // Option to'g'ri javob ekanligini ko'rsatadi
}

export interface IQuestionData {
  id: number;
  content: IContent[];
  numberOfQuestions: number;
}

export interface IAudio {
  id: number;
  url: string;
  fileName: string;
}

export interface IPart {
  id: number;
  part: string;
  question: IQuestionData;
  audio: IAudio;
  answers: Record<string, any>;
}

export interface IListening {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  forCdi: boolean;
  parts: IPart[];
}

export interface IListeningTest {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  forCdi: boolean;
  listening: IListening;
}

/**
 * Javob tekshiruvchi yordamchi funktsiya.
 * @param content - Tekshirish uchun content obyekti
 * @param userAnswers - Foydalanuvchi javoblari
 * @returns {boolean} - Javob to'g'ri yoki noto'g'ri ekanligi
 */
export function checkListeningAnswer(content: IContent, userAnswers: any): boolean {
  // Content turiga qarab tekshirish
  if (content.type === 'multiple-choice') {
    if (!content.questions) return false;
    
    // Har bir savolni tekshirish
    for (const question of content.questions) {
      const userAnswer = userAnswers[question.id];
      if (!userAnswer || userAnswer !== question.correctAnswer) {
        return false;
      }
    }
    return true;
  }
  
  if (content.type === 'completion') {
    if (!content.correctAnswers || content.correctAnswers.length === 0) return false;
    
    const userAnswerArray = Array.isArray(userAnswers) ? userAnswers : Object.values(userAnswers);
    if (userAnswerArray.length !== content.correctAnswers.length) return false;
    
    // Har bir javobni tekshirish
    for (let i = 0; i < content.correctAnswers.length; i++) {
      const correct = content.correctAnswers[i].toLowerCase().trim();
      const user = String(userAnswerArray[i]).toLowerCase().trim();
      if (user !== correct) {
        return false;
      }
    }
    return true;
  }
  
  if (content.type === 'draggable-selection') {
    if (!content.correctDraggableAnswers) return false;
    
    // Har bir gap uchun to'g'ri javobni tekshirish
    for (const [gapKey, correctOptionId] of Object.entries(content.correctDraggableAnswers)) {
      const userOptionId = userAnswers[gapKey];
      if (!userOptionId || userOptionId !== correctOptionId) {
        return false;
      }
    }
    return true;
  }
  
  return false;
}