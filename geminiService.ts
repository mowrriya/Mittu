
import { GoogleGenAI, Type } from "@google/genai";
import { Alumnus } from "./types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAlumniAdvice = async (query: string, alumniContext: Alumnus[]) => {
  const contextText = alumniContext.map(a => 
    `${a.name} (Class of ${a.gradYear}, ${a.degree}) works at ${a.company} as a ${a.role} in ${a.location}. Skills: ${a.skills.join(', ')}.`
  ).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a helpful alumni career assistant. Use the following alumni database context to answer the user's career networking questions.
      
Context:
${contextText}

User Query: ${query}`,
      config: {
        systemInstruction: "You help students and alumni connect. Be professional, encouraging, and specific about which alumni might be good to talk to based on the database provided.",
        temperature: 0.7,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I'm having trouble accessing my networking database right now. Please try again later.";
  }
};

export const parseAlumniSearch = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Translate the following natural language search query into a structured JSON filter for an alumni database: "${query}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            gradYear: { type: Type.NUMBER, description: "Specific graduation year mentioned, or null" },
            industry: { type: Type.STRING, description: "Industry name mentioned, or null" },
            company: { type: Type.STRING, description: "Company name mentioned, or null" },
            location: { type: Type.STRING, description: "Location or city mentioned, or null" }
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Search Parsing Error:", error);
    return null;
  }
};
