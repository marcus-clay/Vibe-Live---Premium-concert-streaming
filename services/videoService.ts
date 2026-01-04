
import { GoogleGenAI, Type } from "@google/genai";

const STABLE_CONCERT_VIDEOS = [
  "https://assets.mixkit.co/videos/preview/mixkit-pop-singer-performing-on-stage-with-lights-and-smoke-41712-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-rock-band-performing-on-stage-with-lights-and-smoke-41711-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-crowd-cheering-at-a-concert-41708-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-hands-clapping-at-a-concert-41710-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-electronic-dance-music-festival-41714-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-rock-concert-stage-with-lights-and-fire-41713-large.mp4",
  "https://v.pexels.com/video-files/852424/852424-hd_1920_1080_24fps.mp4",
  "https://v.pexels.com/video-files/1191395/1191395-hd_1920_1080_25fps.mp4"
];

export interface VideoClip {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  duration: number;
  description: string;
}

export const VideoCatalogService = {
  async findVideoForEvent(eventTitle: string, artistName: string): Promise<VideoClip> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Find a matching high-quality video clip from the VIBE LIVE catalog for: "${eventTitle}" by ${artistName}.`,
        config: {
          systemInstruction: `You are the VIBE LIVE Video Catalog API. 
          Your job is to match a request to one of our available high-quality video streams.
          Available URLs: ${JSON.stringify(STABLE_CONCERT_VIDEOS)}
          Return a single JSON object matching the requested event. Pick the most appropriate URL from the list based on the vibe (rock, pop, crowd, etc.).`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              url: { type: Type.STRING },
              thumbnail: { type: Type.STRING },
              duration: { type: Type.NUMBER },
              description: { type: Type.STRING },
            },
            required: ["id", "title", "url", "duration"]
          },
        },
      });

      return JSON.parse(response.text || '{}');
    } catch (e) {
      console.warn("Catalog AI fetch failed, using fallback:", e);
      return {
        id: "fallback",
        title: eventTitle,
        url: STABLE_CONCERT_VIDEOS[0],
        thumbnail: "",
        duration: 300,
        description: "Premium VIBE stream"
      };
    }
  },

  async searchClips(query: string): Promise<VideoClip[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Search the catalog for: "${query}"`,
        config: {
          systemInstruction: `You are the VIBE LIVE Video Search API. 
          Return an array of 3-4 video clips that match the user's query.
          Available URLs: ${JSON.stringify(STABLE_CONCERT_VIDEOS)}
          Pick varied URLs. Make up creative titles and descriptions based on the query.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                url: { type: Type.STRING },
                thumbnail: { type: Type.STRING },
                duration: { type: Type.NUMBER },
                description: { type: Type.STRING },
              },
              required: ["id", "title", "url"]
            }
          },
        },
      });

      return JSON.parse(response.text || '[]');
    } catch (e) {
      console.warn("Catalog AI search failed:", e);
      return [];
    }
  }
};
