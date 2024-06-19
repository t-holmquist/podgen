import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from 'openai'
import { SpeechCreateParams } from "openai/resources/audio/speech.mjs";


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export const generateAudioAction = action({
  args: { input: v.string(), voice: v.string() },
  handler: async (ctx, { input, voice }) => {
    // call openAI
    const mp3 = await openai.audio.speech.create({
        model: "tts-1-hd",
        voice: voice as SpeechCreateParams['voice'],
        input: input,
      });
    const buffer = await mp3.arrayBuffer();
    
    return buffer;
  },
});

export const generateThumbnailAction = action({
  args: { prompt: v.string() },
  handler: async (_, { prompt }) => {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      size: '1024x1024',
      quality: 'standard',
      n: 1,
    })
    // get URL where the generated file can be downloaded
    const url = response.data[0].url;
    if (!url) {
      throw new Error('Error generating thumbnail')
    }
    // fetch image from the url endpoint
    const imageResponse = await fetch(url)
    // format to buffer so its easier to work with
    const buffer = await imageResponse.arrayBuffer();
    return buffer;

  }
})