// ReadingTestForm.tsx
import { useState, useEffect } from "react";
import { PartForm } from "./ReadingPartForm";
import { ReadingTest, Part } from "./ReadingType";
import { v4 as uuid } from "uuid";

interface Props {
  test?: ReadingTest;
  onChange?: (t: ReadingTest) => void;
}

export const ReadingTestForm = ({ test: propTest, onChange }: Props) => {
  const [test, setTest] = useState<ReadingTest>(
    propTest ?? { id: uuid(), title: "", parts: [] }
  );

  // Sync with prop if parent passes `test` later
  useEffect(() => {
    if (propTest) setTest(propTest);
  }, [propTest]);

  // Helper to update local state and optionally notify parent
  const propagate = (next: ReadingTest) => {
    setTest(next);
    if (typeof onChange === "function") onChange(next);
  };

  const update = (changes: Partial<ReadingTest>) => {
    propagate({ ...test, ...changes });
  };

  const addPart = () => {
    const p: Part = { id: uuid(), passage: "", questions: [] };
    update({ parts: [...(test.parts || []), p] });
  };

  const updatePart = (idx: number, p: Part) => {
    const next = [...(test.parts || [])];
    next[idx] = p;
    update({ parts: next });
  };

  const removePart = (idx: number) => {
    const next = (test.parts || []).filter((_, i) => i !== idx);
    update({ parts: next });
  };

  const saveTest = () => {
    console.log("Saqlanmoqda:", test);
    // axios.post("/api/tests", test);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-4 items-center">
        <textarea
          className="border p-2 w-50 flex-grow"
          placeholder="Reading title"
          value={test.title}
          onChange={(e) => update({ title: e.target.value })}
        />
        
        <div className="flex items-center">
          <label className="mr-2">Vaqt:</label>
          <input
            type="number"
            className="border p-2 my-2 w-16"
            placeholder="min"
            value={test.timeLimit || ""}
            onChange={(e) => update({ timeLimit: parseInt(e.target.value) || undefined })}
            min="1"
          />
          <span className="ml-1">minut</span>
        </div>
      </div>

      <div>
        {(test.parts || []).map((p, idx) => (
          <PartForm
            key={p.id}
            part={p}
            onChange={(np) => updatePart(idx, np)}
            onRemove={() => removePart(idx)}
          />
        ))}

        <button className="btn btn-primary" onClick={addPart}>
          Add Part
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <strong>Preview:</strong>
        <div
          style={{
            marginTop: 8,
            background: "#fafafa",
            padding: 8,
            borderRadius: 6,
          }}
        >
          {test.timeLimit && (
            <div style={{ marginBottom: 8, color: "#555", fontWeight: "bold" }}>
              Vaqt: {test.timeLimit} minut
            </div>
          )}
          
          {test.parts && test.parts.length ? (
            test.parts.map((p) => (
              <div key={p.id}>
                <h4>Part</h4>
                <div style={{ whiteSpace: "pre-wrap" }}>{p.passage}</div>
              </div>
            ))
          ) : (
            <div>No parts yet</div>
          )}
        </div>
      </div>

      <button className="btn btn-success" onClick={saveTest}>
        Save Test
      </button>
    </div>
  );
};
