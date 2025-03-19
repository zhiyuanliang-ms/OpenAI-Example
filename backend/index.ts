import express from "express";
import { AzureAppConfiguration, load }  from "@azure/app-configuration-provider";
import { DefaultAzureCredential } from "@azure/identity";
import { FeatureManager, ConfigurationMapFeatureFlagProvider } from "@microsoft/feature-management";

const server = express();
const credential = new DefaultAzureCredential();
let appConfig: AzureAppConfiguration = await load("https://appconfig-lzy.azconfig.io", credential, {
    selectors: [{ keyFilter: "AzureOpenAI:*"}],
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


// let featureManager: FeatureManager;
// async function initializeConfig() {
//     console.log("Loading configuration...");
//     appConfig = await load("https://appconfig-lzy.azconfig.io", credential, {
//         selectors: [{ keyFilter: "AzureOpenAI:*"}],
//         refreshOptions: {
//             enabled: true,
//         },
//         featureFlagOptions: {
//             enabled: true,
//             refresh: {
//                 enabled: true
//             }
//         },
//         keyVaultOptions: {
//             credential: credential
//         }
//     });

//     const featureFlagProvider = new ConfigurationMapFeatureFlagProvider(appConfig);
//     featureManager = new FeatureManager(featureFlagProvider);
// }

// function startServer() {
//     server.use((req, res, next) => {
//         appConfig.refresh();
//         next();
//     });
//     server.use(express.json());
//     server.use(express.static("public"));

//     server.get("/api/chat/model", (req, res) => {
//         res.send("gpt-3.5-turbo");
//     });

//     server.post("/api/chat", async (req, res) => {

//     });

//     const port = process.env.PORT || "8080";
//     server.listen(port, () => {
//         console.log(`Server is running at http://localhost:${port}`);
//     });
// }

// initializeConfig()
//     .then(() => {
//         console.log("Configuration loaded. Starting server...");
//         startServer();
//     })
//     .catch((error) => {
//         console.error("Failed to load configuration:", error);
//         process.exit(1);
//     });