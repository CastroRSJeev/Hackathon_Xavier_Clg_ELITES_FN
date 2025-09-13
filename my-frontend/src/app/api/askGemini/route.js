import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyD8JTA5MM9M5LmFQRygj0fiA2cx255Z1Rc");

export async function POST(req) {
  try {
    const formData = await req.formData();
    const question = formData.get("question") || "";
    // (optional) Handle file later if you want

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an AI study assistant. 
      Help students by simplifying complex topics, 
      focusing only on the most important concepts, and 
      providing clear, concise explanations.
      
      Student asked: ${question}
    `;

    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { answer: "Error: Could not generate response." },
      { status: 500 }
    );
  }
}
