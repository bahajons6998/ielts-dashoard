## O'zbekcha tushuntirish: CompletionQuestionForm komponenti

### Completion Question nima?

"Completion Question" (Bo'sh joylarni to'ldirish savollari) - bu IELTS Listening testida eng keng tarqalgan savol turlaridan biri. Ushbu turdagi savollarda o'quvchilar audiodagi ma'lumotlarni tinglashadi va berilgan matndagi bo'sh joylarni to'ldirishlari kerak.

### Komponenta qanday ishlaydi?

`CompletionQuestionForm` komponenti quyidagi imkoniyatlarni beradi:

1. **Sarlavha kiritish**: Savol guruhiga sarlavha berish imkoniyati.

2. **Ko'rsatmalar kiritish**: O'quvchilarga savol bo'yicha ko'rsatmalar berish (masalan: "Write ONE WORD ONLY for each answer").

3. **Savol matni yaratish**: Bu yerda siz matn kiritasiz va bo'sh joy qoldirilishi kerak bo'lgan joylarni `@@` belgisi bilan belgilaysiz.

### CKEditor haqida

Savol matnini va ko'rsatmalarni kiritish uchun CKEditor ishlatilmoqda:

- **CKEditor** - professional WYSIWYG (What You See Is What You Get) muharriri
- **Afzalliklari**:
  - Formatlangan matn yaratish (qalin, kursiv, ro'yxatlar)
  - HTML kod yaratish va tahrirlash
  - Bo'sh joylarni belgilash uchun maxsus tugma
  - Foydalanuvchi uchun qulay interfeys

### Misol:

Masalan, siz shunday matn kiritishingiz mumkin:

```
The meeting will be held on @@ at 3:00 PM in room @@.
```

Bu shuni anglatadiki, o'quvchilar audioda aytilgan sana va xona raqamini bo'sh joylarga kiritishlari kerak.

### Qanday foydalanish kerak?

1. **Sarlavha kiriting**: Savol guruhining umumiy mavzusini anglatuvchi sarlavha.

2. **Ko'rsatmalar kiriting**: O'quvchilarga qanday javob berish kerakligini tushuntiring.

3. **Savol matnini kiriting**: 
   - Matnni CKEditor yordamida kiriting
   - Bo'sh joy qoldirilishi kerak bo'lgan joylarni "Bo'sh joy qo'shish (@@)" tugmasi yordamida yoki to'g'ridan-to'g'ri `@@` belgisini kiritib belgilang
   - Matn formatini sozlash uchun CKEditor tugmalaridan foydalaning (qalin, kursiv va h.k.)

4. **Oldindan ko'rish**: Natijani oldindan ko'rish bo'limida tekshiring.

### IELTS Listening testida Completion Question misollari:

1. **Notes Completion**:
   ```
   The library is open from @@ AM to @@ PM on weekdays.
   ```

2. **Table Completion**:
   ```
   | Event | Date | Location |
   |------|------|----------|
   | Conference | @@ | London |
   | Workshop | July 15 | @@ |
   ```

3. **Summary Completion**:
   ```
   The speaker recommends studying for at least @@ hours per day and taking a @@ minute break every hour.
   ```

Bu komponenta IELTS Listening testlari yaratuvchilari uchun bo'sh joylarni to'ldirish savollarini qo'shish imkonini beradi.