import { AzureOpenAI } from "openai";
import { AzureOpenAiConnectionInfo, LLMConfiguraion } from "./types.js";

const API_VERSION = "2024-10-21";

export class ChatService {
    #client: AzureOpenAI;
    constructor(connectionInfo: AzureOpenAiConnectionInfo) {
        this.#client = new AzureOpenAI({
            apiKey: connectionInfo.apiKey,
            endpoint: connectionInfo.endpoint,
            apiVersion: API_VERSION
        });
    }

    async getChatCompletion(messages: any[], llmConfiguraion: LLMConfiguraion) {
        const result = await this.#client.chat.completions.create({
            messages: messages,
            model: llmConfiguraion.model,
            temperature: llmConfiguraion?.temperature
        });
        return result.choices[0].message.content;
    }
}