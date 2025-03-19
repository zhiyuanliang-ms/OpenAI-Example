export interface ChatMessage {
    role: string;
    content: string;
    timestamp: Date;
}
  
export interface ChatRequest {
    message: string;
    history?: ChatMessage[];
}
  
export interface ChatResponse {
    message: string;
    history: ChatMessage[];
}

export interface AzureOpenAiConnectionInfo {
    apiKey?: string;
    endpoint?: string;
}

export interface LLMConfiguraion {
    model: string; 
    temperature?: number;
    messages?: MessageConfiguration[];
}

export interface MessageConfiguration {
    role: string;
    content: string;
}