class Constants {
    static constants = {
        waitHint: "Wait, solidgpt is generating!",
        error: "An error occurred. Please ensure you've correctly index to Notion/Codebase and configured the settings properly in **Settings Paage** . 👉. Please check https://github.com/AI-Citizen/SolidGPT for more details.",
        onBoardError:"OnBoard error, please make sure you have correct absolute path and open AI API key.",
        waitHintStringify: "{\"isUser\":false,\"message\":\"Wait, solidgpt is generating!\"}",
        errorHint: "Please open setting and click Index Notion/Index Codebase to onboard Notion/Codebase."
    };
    static settingConstants = {
        APIToken: 'API Token',
        Path:'Path',
        NotionToken: 'Notion Workspace Token',
        NotionPageId: 'Notion Page Id',
        AWSCred: 'AWS Cred',
        NotionSyncTime: 'Notion Sync Time',
        CodebaseSyncTime: 'Codebase Sync Time',
        NotionChecked: 'Notion Checked',
        CodebaseChecked: 'Codebase Checked',
    };
    static onBoardProject = {
        GraphId: "Graph Id",
        CodeBaseFileList: "CodeBase File List",
        NotionFileList: "Notion File List"
    };
    static maxID: number = 12;
}

export default Constants;
