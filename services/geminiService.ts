import { GoogleGenAI } from "@google/genai";
import { Transaction } from '../types';

export const analyzeDataWithGemini = async (
  query: string, 
  transactions: Transaction[]
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Optimize context: If too many transactions, summarize or truncate
  // For a simple ERP, we assume < 1000 rows, or we take the last 200 for context to fit context window safely.
  // Ideally, we would do RAG, but here we dump JSON.
  const recentTransactions = transactions.slice(0, 300); // Take top 300 for safety
  
  const dataContext = JSON.stringify(recentTransactions);

  const prompt = `
    Kamu adalah asisten ahli keuangan untuk aplikasi ERP.
    Berikut adalah data transaksi keuangan (format JSON):
    ${dataContext}

    Tugasmu:
    1. Jawab pertanyaan user berdasarkan data di atas.
    2. Gunakan Bahasa Indonesia yang profesional namun ramah.
    3. Jika user meminta ringkasan, berikan total income, expense, dan insight menarik.
    4. Jika user bertanya spesifik (misal: "transaksi terbesar"), cari dari data.
    5. Format jawaban menggunakan Markdown (bold, list, tabel jika perlu).
    6. Gunakan emoji yang relevan.

    Pertanyaan User: "${query}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Maaf, saya tidak dapat menghasilkan analisis saat ini.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Terjadi kesalahan saat menghubungi asisten AI. Silakan coba lagi.";
  }
};