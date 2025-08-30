// PartForm.tsx
import { QuestionForm } from "./ReadingQuestionForm";
import { Part, Question } from "./ReadingType";
import { v4 as uuid } from "uuid";

interface Props {
  part: Part;
  onChange: (part: Part) => void;
  onRemove?: () => void;
}

export const PartForm = ({ part, onChange, onRemove }: Props) => {
  function update(changes: Partial<Part>) {
    onChange({ ...part, ...changes });
  }

  const addQuestion = () => {
    const newId = uuid();
    const q: Question = {
      id: newId,
      type: "single",
      questionText: "",
      options: ["Option 1", "Option 2"],
      correctAnswers: [],
      instruction: "Berilgan variantlardan to'g'ri javobni tanlang", // Default instruction
    };
    
    // Yangi array yaratish va reference o'zgartirish uchun
    const updatedQuestions = [...part.questions, q];
    update({ questions: updatedQuestions });
  };

  function updateQuestion(idx: number, q: Question) {
    const next = [...part.questions];
    next[idx] = q;
    update({ questions: next });
  }

  function removeQuestion(idx: number) {
    const next = part.questions.filter((_, i) => i !== idx);
    update({ questions: next });
  }

  return (
    <div style={{ border: "1px solid #dfe6e9", padding: 12, borderRadius: 10, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <strong>Part ID: {part.id}</strong>
        {onRemove && <button className="btn btn-danger btn-sm" onClick={onRemove}>O'chirish</button>}
      </div>

      <div style={{ marginBottom: 8 }}>
        <textarea
          style={{ width: "100%", minHeight: 100, padding: 8 }}
          value={part.passage}
          onChange={(e) => update({ passage: e.target.value })}
          placeholder="Passage matnini shu yerga yozing..."
          key={`part-${part.id}-passage`}
        />
      </div>

      <div>
        <div style={{ marginBottom: 8, fontWeight: 700 }}>Questions</div>
        {part.questions.map((q, idx) => (
          <QuestionForm
            key={q.id}
            question={q}
            onChange={(newQ) => updateQuestion(idx, newQ)}
            onRemove={() => removeQuestion(idx)}
          />
        ))}
        <button className="btn btn-primary btn-sm" onClick={addQuestion}>+ New Question</button>
      </div>
    </div>
  );
};
