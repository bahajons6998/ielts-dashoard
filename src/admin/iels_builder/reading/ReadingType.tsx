// Question turini belgilash
export type QuestionType = "single" | "multiple" | "fill-gap" | "description";

export interface Question {
  id: string;
  type: QuestionType;
  questionText?: string; // description bo'lsa optional
  options?: string[];    // single/multiple uchun
  correctAnswers?: string[]; // javoblar
  instruction?: string; // savol turi uchun ko'rsatma (1-9 savollarga javob bering kabi)
}

export interface Part {
  id: string;
  passage: string; // har bir partdagi text
  questions: Question[];
}

export interface ReadingTest {
  id: string;
  title: string;
  parts: Part[];
  timeLimit?: number; // Test uchun vaqt (minutlarda)
}

/**
 * Javob tekshiruvchi yordamchi.
 * - `userAnswer` single uchun string, multiple/fill-gap uchun string[].
 * - description uchun `correctAnswers` - kalit so'zlar yoki qabul qilinadigan javoblar sifatida ishlatiladi.
 */
export function checkAnswer(question: Question, userAnswer: string | string[]): boolean {
  const correct = question.correctAnswers ?? [];

  if (question.type === "single") {
    if (!correct.length) return false;
    const ua = Array.isArray(userAnswer) ? userAnswer[0] ?? "" : userAnswer ?? "";
    return normalize(ua) === normalize(correct[0]);
  }

  if (question.type === "multiple") {
    if (!correct.length) return false;
    if (!Array.isArray(userAnswer)) return false;
    const expected = new Set(correct.map(normalize));
    const provided = new Set(userAnswer.map(normalize));
    if (expected.size !== provided.size) return false;
    for (const v of expected) if (!provided.has(v)) return false;
    return true;
  }

  if (question.type === "fill-gap") {
    if (!correct.length) return false;
    if (!Array.isArray(userAnswer)) return false;
    if (userAnswer.length !== correct.length) return false;
    for (let i = 0; i < correct.length; i++) {
      if (normalize(userAnswer[i]) !== normalize(correct[i])) return false;
    }
    return true;
  }

  if (question.type === "description") {
    // Agar admin kalit so'zlar bergan bo'lsa, tekshiramiz:
    // foydalanuchi javobida barcha kalit so'zlar bo'lsa true.
    if (!correct.length) return false;
    const ua = Array.isArray(userAnswer) ? userAnswer.join(" ") : userAnswer ?? "";
    const lower = normalize(ua);
    return correct.every(k => lower.includes(normalize(k)));
  }

  return false;
}

function normalize(s: string) {
  return (s ?? "").toString().trim().toLowerCase();
}
