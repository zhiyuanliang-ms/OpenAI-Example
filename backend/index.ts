import { load }  from "@azure/app-configuration-provider";
import { DefaultAzureCredential } from "@azure/identity";
import { FeatureManager, ConfigurationMapFeatureFlagProvider } from "@microsoft/feature-management";
import { ChatService } from './chatService.js';
import { ChatRequest, ChatResponse, LLMConfiguraion } from './types.js';
import { ChatbotLLMFeatureName, ChatLLMConfigurationName, ChatLLM2ConfigurationName } from './features.js';

const credential = new DefaultAzureCredential();
const config = await load(process.env.APPCONFIG_ENDPOINT!, credential, {
    refreshOptions: {
        enabled: true,
    },
    featureFlagOptions: {
        enabled: true,
        refresh: {
            enabled: true
        }
    },
    keyVaultOptions: {
        credential: credential
    }
});

const featureFlagProvider = new ConfigurationMapFeatureFlagProvider(config);
const featureManager = new FeatureManager(featureFlagProvider);

const chatService = new ChatService({
    apiKey: config.get("AzureOpenAI:ApiKey"),
    endpoint: config.get("AzureOpenAI:Endpoint")
});

import express from "express";

const server = express();
server.use(express.json());
server.use(express.static("public"));
server.use((req, res, next) => {
    config.refresh();
    next();
});

server.post('/api/chat', async (req, res) => {
    const chatRequest = req.body as ChatRequest;
    const llmConfiguraion = await getLLMConfiguration();
    if (llmConfiguraion === undefined) {
        res.status(500).send("LLM configuration not found");
    }
    const history = chatRequest.history ?? [];
    history.push({ role: "user", content: chatRequest.message, timestamp: new Date() });
    const messages = [...(llmConfiguraion?.messages ?? []), ...history.map(item => ({ role: item.role, content: item.content }))];
    const responseContent = await chatService.getChatCompletion(messages, llmConfiguraion!);
    history.push({ role: "assistant", content: responseContent!, timestamp: new Date() });
    res.json({
        message: responseContent,
        history: history
    } as ChatResponse);
});

server.get('/api/chat/model', async (req, res) => {
    const llmConfiguraion = await getLLMConfiguration();
    if (llmConfiguraion === undefined) {
        res.status(500).send("LLM configuration not found");
    }
    res.send(llmConfiguraion?.model);
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

async function getLLMConfiguration(): Promise<LLMConfiguraion | undefined> {
    if (await featureManager.isEnabled(ChatbotLLMFeatureName)) {
        return config.get(ChatLLM2ConfigurationName);
    }
    return config.get(ChatLLMConfigurationName);
}