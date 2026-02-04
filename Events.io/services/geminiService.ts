
import { GoogleGenAI, Type } from "@google/genai";
import { EventData, EventStatus } from "../types";

export const scrapeEvents = async (city: string): Promise<EventData[]> => {
  try {
    const apiKey = process.env.API_KEY;
    
    if (!apiKey || apiKey.includes("YOUR_")) {
      console.error("[Scraper] Missing API Key. Ensure VITE_API_KEY is set in your .env file.");
      return [];
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // We use gemini-3-flash-preview for fast, searchable event discovery
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Find 12 exciting upcoming public events in ${city}, Australia. 
      Include a mix of music, festivals, sports, and arts.
      Return strictly a JSON array of objects with: title, dateTime (human readable), isoDate, venueName, address, description (short), category, imageUrl, sourceWebsite, and originalUrl.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              dateTime: { type: Type.STRING },
              isoDate: { type: Type.STRING },
              venueName: { type: Type.STRING },
              address: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
              imageUrl: { type: Type.STRING },
              sourceWebsite: { type: Type.STRING },
              originalUrl: { type: Type.STRING },
            },
            required: ["title", "dateTime", "venueName", "originalUrl"]
          }
        }
      },
    });

    const textOutput = response.text;
    if (!textOutput) return [];

    const rawData = JSON.parse(textOutput);
    
    return rawData.map((item: any, index: number) => ({
      id: `evt-${Date.now()}-${index}`,
      title: item.title,
      dateTime: item.dateTime,
      isoDate: item.isoDate || new Date().toISOString(),
      venueName: item.venueName,
      address: item.address || 'Central Location',
      city: city,
      description: item.description || 'No description available.',
      category: item.category || 'General',
      imageUrl: item.imageUrl || `https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80`,
      sourceWebsite: item.sourceWebsite || 'Discovery Service',
      originalUrl: item.originalUrl,
      lastScrapedAt: new Date().toISOString(),
      status: EventStatus.NEW
    }));
  } catch (error) {
    console.error("[Scraper Error]:", error);
    return [];
  }
};
