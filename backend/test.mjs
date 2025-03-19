import { load }  from "@azure/app-configuration-provider";
import { AzureCliCredential, DefaultAzureCredential } from "@azure/identity";

const appConfig = await load("https://appconfig-lzy.azconfig.io", new AzureCliCredential(), {
    selectors: [{ keyFilter: "AzureOpenAI:*"}],
    featureFlagOptions: {
        enabled: true,
        refresh: {
            enabled: true,
            refreshIntervalInMs: 10_000
        }
    },
    keyVaultOptions: {
        credential: new DefaultAzureCredential()
    }
});

console.log(appConfig.get("AzureOpenAI:ApiKey"));