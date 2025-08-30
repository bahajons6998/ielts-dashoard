// QuestionForm.tsx
import { useState, useEffect } from "react";
import { Question, QuestionType, checkAnswer } from "./ReadingType";

interface Props {
	question: Question;
	onChange: (q: Question) => void;
	onRemove?: () => void;
}

export const QuestionForm = ({ question, onChange, onRemove }: Props) => {
	const [local, setLocal] = useState<Question>(question);
	const [sampleAnswer, setSampleAnswer] = useState<string | string[]>("");

	// Bug fix: added question as dependency to update local state when question prop changes
	useEffect(() => {
		setLocal(question);
	}, [question]);

	// Debounce the onChange calls to prevent too many renders and console logs
	useEffect(() => {
		// Compare local with question to prevent unnecessary updates
		if (JSON.stringify(local) === JSON.stringify(question)) {
			return; // Skip update if nothing changed
		}
		
		const timer = setTimeout(() => {
			onChange(local);
		}, 500); // 500ms debounce
		
		return () => clearTimeout(timer);
	}, [local, onChange, question]);

	function update(changes: Partial<Question>) {
		setLocal((prev) => ({ ...prev, ...changes }));
	}

	function addOption() {
		const next = [...(local.options ?? []), "Yangi variant"];
		update({ options: next });
	}

	function removeOption(idx: number) {
		const next = (local.options ?? []).filter((_, i) => i !== idx);
		const nextCorrect = (local.correctAnswers ?? []).filter((a) => next.includes(a));
		update({ options: next, correctAnswers: nextCorrect });
	}

	function setOptionText(idx: number, text: string) {
		const next = [...(local.options ?? [])];
		next[idx] = text;
		update({ options: next });
	}

	function toggleCorrectOption(idx: number) {
		const opt = (local.options ?? [])[idx];
		if (!opt) return;

		if (local.type === "single") {
			// Single choice - only one correct answer
			update({ correctAnswers: [opt] });
		} else {
			// Multiple choice - add/remove from array
			const correct = [...(local.correctAnswers ?? [])];
			const exists = correct.includes(opt);

			if (exists) {
				// Remove if already exists
				update({ correctAnswers: correct.filter(a => a !== opt) });
			} else {
				// Add if doesn't exist
				update({ correctAnswers: [...correct, opt] });
			}
		}
	}

	function addFillGap() {
		const next = [...(local.correctAnswers ?? []), ""];
		update({ correctAnswers: next });
	}

	function setFillGapAnswer(idx: number, val: string) {
		const next = [...(local.correctAnswers ?? [])];
		next[idx] = val;
		update({ correctAnswers: next });
	}

	function setDescriptionKeywords(val: string) {
		const arr = val.split(",").map((s) => s.trim()).filter(Boolean);
		update({ correctAnswers: arr });
	}

	function previewIsCorrect() {
		// Debug output
		console.log("DEBUG - Question:", local.id);
		console.log("Correct answers:", local.correctAnswers);
		console.log("Sample answer:", sampleAnswer);
		console.log("Question type:", local.type);

		if (local.type === "single") return checkAnswer(local, typeof sampleAnswer === "string" ? sampleAnswer : (sampleAnswer[0] ?? ""));
		if (local.type === "multiple") return checkAnswer(local, Array.isArray(sampleAnswer) ? sampleAnswer : (sampleAnswer ? [sampleAnswer as string] : []));
		if (local.type === "fill-gap") return checkAnswer(local, Array.isArray(sampleAnswer) ? sampleAnswer : [sampleAnswer as string]);
		if (local.type === "description") return checkAnswer(local, typeof sampleAnswer === "string" ? sampleAnswer : (sampleAnswer).toString());
		return false;
	}

	return (
		<div className="rf-question-card" style={{ border: "1px solid #e0e0e0", padding: 12, borderRadius: 8, marginBottom: 12 }}>
			<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
				<strong>Question ID: {local.id}</strong>
				<div>
					<select 
						value={local.type} 
						onChange={(e) => {
							const newType = e.target.value as QuestionType;
							let defaultInstruction = "";
							
							// Set default instruction based on type
							switch(newType) {
								case "single":
									defaultInstruction = "Quyidagi variantlardan birini tanlang.";
									break;
								case "multiple":
									defaultInstruction = "Quyidagi variantlardan to'g'ri javoblarni tanlang.";
									break;
								case "fill-gap":
									defaultInstruction = "Bo'sh joylarni to'ldiring (har bir bo'sh joyga faqat bir so'z yoki raqam).";
									break;
								case "description":
									defaultInstruction = "Berilgan savol bo'yicha o'z fikringizni bayon qiling.";
									break;
							}
							
							update({ 
								type: newType, 
								options: [], 
								correctAnswers: [],
								instruction: defaultInstruction
							});
						}}
					>
						<option value="single">Single choice</option>
						<option value="multiple">Multiple choice</option>
						<option value="fill-gap">Fill gaps</option>
						<option value="description">Description (long answer)</option>
					</select>
					{onRemove && <button className="btn btn-danger btn-sm" style={{ marginLeft: 8 }} onClick={onRemove}>O'chirish</button>}
				</div>
			</div>

			<div style={{ marginBottom: 8 }}>
				<input
					style={{ width: "100%", padding: 8 }}
					placeholder="Savol matni (questionText)"
					value={local.questionText ?? ""}
					onChange={(e) => update({ questionText: e.target.value })}
					key={`question-text-${local.id}`}
				/>
			</div>

			<div style={{ marginBottom: 8 }}>
				<input
					style={{ width: "100%", padding: 8 }}
					placeholder="Ko'rsatma (masalan: 1-9 savollarga javob bering)"
					value={local.instruction ?? ""}
					onChange={(e) => update({ instruction: e.target.value })}
					key={`instruction-${local.id}`}
				/>
				<div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
					Bu ko'rsatma savol turi uchun qo'shimcha ma'lumot (masalan: "1-9 savollarga javob bering", "Berilgan variantlardan birini tanlang", etc.)
				</div>
			</div>

			{(local.type === "single" || local.type === "multiple") && (
				<div>
					<div style={{ marginBottom: 8, fontWeight: 600 }}>Options</div>
					{(local.options ?? []).map((opt, idx) => (
						<div key={`${local.id}-option-${idx}`} style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
							{local.type === "single" ? (
								<input type="radio" checked={local.correctAnswers?.[0] === opt} onChange={() => toggleCorrectOption(idx)} />
							) : (
								<input type="checkbox" checked={(local.correctAnswers ?? []).includes(opt)} onChange={() => toggleCorrectOption(idx)} />
							)}
							<input 
								style={{ marginLeft: 8, flex: 1 }} 
								value={opt} 
								onChange={(e) => setOptionText(idx, e.target.value)} 
								key={`${local.id}-option-input-${idx}`}
							/>
							<button  className="btn btn-danger btn-sm" style={{ marginLeft: 8 }} onClick={() => removeOption(idx)}>X</button>
						</div>
					))}
					<button className="btn btn-primary btn-sm" onClick={addOption}>+ Option qo'shish</button>
				</div>
			)}

			{local.type === "fill-gap" && (
				<div>
					<div style={{ marginBottom: 8, fontWeight: 600 }}>Fill gaps - to'liq javoblar (har gap uchun)</div>
					{(local.correctAnswers ?? []).map((ans, idx) => (
						<div key={`${local.id}-gap-${idx}`} style={{ display: "flex", marginBottom: 6 }}>
							<input 
								style={{ flex: 1 }} 
								value={ans} 
								onChange={(e) => setFillGapAnswer(idx, e.target.value)} 
								placeholder={`Gap #${idx + 1} correct`} 
								key={`${local.id}-gap-input-${idx}`}
							/>
							<button className="btn btn-danger btn-sm" style={{ marginLeft: 8 }} onClick={() => update({ correctAnswers: (local.correctAnswers ?? []).filter((_, i) => i !== idx) })}>X</button>
						</div>
					))}
					<button className="btn btn-success btn-sm" onClick={addFillGap}>+ Gap qo'shish</button>
				</div>
			)}

			{local.type === "description" && (
				<div>
					<div style={{ marginBottom: 8, fontWeight: 600 }}>Description - keyword(s) (comma separated)</div>
					<input
						style={{ width: "100%", padding: 8 }}
						placeholder="keyword1, keyword2"
						value={(local.correctAnswers ?? []).join(", ")}
						onChange={(e) => setDescriptionKeywords(e.target.value)}
						key={`${local.id}-keywords-input`}
					/>
					<div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>Agar barcha keywords foydalanuvchi javobida bo'lsa, javob to'g'ri deb hisoblanadi.</div>
				</div>
			)}

			<div style={{ marginTop: 12, borderTop: "1px solid #f0f0f0", paddingTop: 8 }}>
				<div style={{ fontWeight: 600, marginBottom: 6 }}>Test preview</div>
				
				{local.instruction && (
					<div style={{marginBottom: 10, padding: 8, background: "#f5f5f5", borderRadius: 4, fontStyle: "italic"}}>
						{local.instruction}
					</div>
				)}

				{local.type === "single" && (
					<div>
						<select 
							value={typeof sampleAnswer === "string" ? sampleAnswer : (sampleAnswer as string[])[0] ?? ""} 
							onChange={(e) => setSampleAnswer(e.target.value)}
							key={`${local.id}-preview-select`}
						>
							<option value="">-- sample choose --</option>
							{(local.options ?? []).map((o, i) => <option value={o} key={`${local.id}-preview-option-${i}`}>{o}</option>)}
						</select>
					</div>
				)}

				{local.type === "multiple" && (
					<div>
						{(local.options ?? []).map((o, i) =>
							<label key={`${local.id}-preview-checkbox-${i}`} style={{ display: "inline-block", marginRight: 8 }}>
								<input
									type="checkbox"
									checked={Array.isArray(sampleAnswer) && sampleAnswer.includes(o)}
									onChange={(e) => {
										const cur = Array.isArray(sampleAnswer) ? [...sampleAnswer] : [];
										if (e.target.checked) {
											// Add to array if checked
											setSampleAnswer([...cur, o]);
										} else {
											// Remove from array if unchecked
											setSampleAnswer(cur.filter(a => a !== o));
										}
									}}
								/> {o}
							</label>
						)}
					</div>
				)}

				{local.type === "fill-gap" && (
					<div>
						{(local.correctAnswers ?? []).map((_, i) =>
							<input 
								key={`${local.id}-preview-gap-${i}`} 
								style={{ display: "block", marginBottom: 6, padding: 6, width: "100%" }} 
								placeholder={`Gap #${i + 1}`} 
								onChange={(e) => {
									const cur = Array.isArray(sampleAnswer) ? [...sampleAnswer] : [];
									cur[i] = e.target.value;
									setSampleAnswer(cur);
								}} 
							/>
						)}
					</div>
				)}

				{local.type === "description" && (
					<div>
						<textarea 
							style={{ width: "100%", minHeight: 80 }} 
							placeholder="Sample long answer to test keywords" 
							onChange={(e) => setSampleAnswer(e.target.value)}
							key={`${local.id}-preview-textarea`}
						/>
					</div>
				)}

				<div style={{ marginTop: 8 }}>
					<strong>Result:</strong>{" "}
					<span style={{ color: previewIsCorrect() ? "green" : "crimson" }}>{previewIsCorrect() ? "Correct" : "Incorrect"}</span>

					<div style={{ fontSize: 12, marginTop: 4, color: "#666" }}>
						<div>Correct answers: {JSON.stringify(local.correctAnswers)}</div>
						<div>Sample answer: {JSON.stringify(sampleAnswer)}</div>
					</div>
				</div>
			</div>
		</div>
	);
}
