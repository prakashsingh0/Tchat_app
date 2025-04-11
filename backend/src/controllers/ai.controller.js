import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const AIChat = async (req, res) => {
  try {
    const { prompt } = req.body;
   

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });


   

    res.status(200).json({ message: response });

  } catch (error) {
    console.error("Error in AIChat:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export { AIChat };
