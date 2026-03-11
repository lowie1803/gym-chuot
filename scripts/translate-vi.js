/**
 * gymchuot — Translate exercise names to Vietnamese
 *
 * Dùng Anthropic Claude API để dịch tên bài tập hàng loạt.
 * Chạy SAU khi đã có data/exercises.json từ import-exercises.js
 *
 * Chạy: ANTHROPIC_API_KEY=sk-... node scripts/translate-vi.js
 * Output: data/exercises.json (cập nhật field nameVi trực tiếp)
 */

const fs = require("fs");
const path = require("path");

const EXERCISES_PATH = path.join(__dirname, "../data/exercises.json");
const BATCH_SIZE = 50; // Dịch 50 bài/lần gọi API

async function translateBatch(names) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `Dịch tên các bài tập gym sau sang tiếng Việt. 
Giữ tên kỹ thuật quen thuộc (VD: "Deadlift" → "Deadlift" hoặc "Kéo đất").
Trả về JSON object: {"<english_name>": "<vietnamese_name>"}
Không có text nào khác ngoài JSON.

${names.map((n, i) => `${i + 1}. ${n}`).join("\n")}`,
        },
      ],
    }),
  });

  const data = await response.json();
  const text = data.content[0].text.trim();
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌ Thiếu ANTHROPIC_API_KEY");
    process.exit(1);
  }

  const exercises = JSON.parse(fs.readFileSync(EXERCISES_PATH, "utf8"));
  const needTranslation = exercises.filter((e) => !e.nameVi);
  console.log(`🌐 Cần dịch: ${needTranslation.length} bài tập`);

  let translated = 0;
  for (let i = 0; i < needTranslation.length; i += BATCH_SIZE) {
    const batch = needTranslation.slice(i, i + BATCH_SIZE);
    const names = batch.map((e) => e.name);

    try {
      process.stdout.write(`  Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(needTranslation.length / BATCH_SIZE)}... `);
      const translations = await translateBatch(names);

      // Apply to exercises array
      for (const ex of exercises) {
        if (translations[ex.name]) {
          ex.nameVi = translations[ex.name];
          translated++;
        }
      }
      console.log(`✅ (${translated} xong)`);

      // Small delay to avoid rate limit
      if (i + BATCH_SIZE < needTranslation.length) {
        await new Promise((r) => setTimeout(r, 500));
      }
    } catch (err) {
      console.error(`\n❌ Batch lỗi:`, err.message);
    }
  }

  fs.writeFileSync(EXERCISES_PATH, JSON.stringify(exercises, null, 2));
  console.log(`\n✅ Hoàn tất! ${translated}/${needTranslation.length} bài được dịch.`);
}

main().catch(console.error);
