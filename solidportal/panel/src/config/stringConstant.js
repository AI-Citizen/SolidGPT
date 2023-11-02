export const stringConstant = {
    UploadStatus: "Upload Status: ",
    Current: "Current:",
    Total: "Total:",
    Status: " Status:",
    APIFail: "API call fail, please retry",
    FileSizeAlert: "File size too large. Please upload a repository under 50MB.",
    OpenAIKeyAlert: "Please insert openAIKey to continue!",
    UploadHint: "Upload repository...",
    WaitHint: "# Wait....",
    OnboardFinishHint: "## Onboard Finished, here are the files, please try other actions",
    Step1: "Step 1",
    Step2: "Step 2",
    OnboardRepoGraph: "Onboard Repo Graph",
    PRDGraph: "PRD Graph",
    TechSolutionGraph: "Tech Solution Graph",
    AcceptTermsCondition: "acceptTermsCondition",
    TermsCondition:"**Terms of Service for SolidGPT**\n" +
        "\n" +
        "By accessing or using SolidGPT's services, you acknowledge that you have read, understood, and agree to be bound by these terms. If you do not agree with these terms, you should refrain from using our services.\n" +
        "\n" +
        "1. **Data Usage & Retention:** \n" +
        "   - Users may upload content, including but not limited to code, to our service. For the purpose of enhancing and improving our product, we may retain this content for a specified period.\n" +
        "   - All uploaded content will be kept confidential. SolidGPT commits not to share, distribute, or display this content to any third parties, including other companies or partners.\n" +
        "   - The uploaded content will solely be used to improve our product and for no other purposes.\n" +
        "\n" +
        "2. **OpenAI API Key & Terms:** \n" +
        "   - Users may be required to input their OpenAI API key for certain functionalities within SolidGPT.\n" +
        "   - SolidGPT does not store, misuse, or otherwise handle your OpenAI API key beyond its intended use within the platform.\n" +
        "   - By using our services, users implicitly agree to the terms of service of the OpenAI API.\n" +
        "\n" +
        "3. **Legal Responsibility:** \n" +
        "   - Users are responsible for ensuring that the content they upload complies with all applicable laws and regulations.\n" +
        "   - SolidGPT does not assume any legal responsibility or liability for the content uploaded by users, nor for any actions taken by users within our platform.\n" +
        "\n" +
        "4. **Personal Information:** \n" +
        "   - SolidGPT does not collect users' personal information beyond the content and data which users willingly upload or input into the service.\n" +
        "\n" +
        "5. **Final Interpretation Rights:** \n" +
        "   - SolidGPT reserves the exclusive right to interpret and revise these terms as deemed necessary.\n" +
        "\n" +
        "6. **User Behavior and Liability:** \n" +
        "   - SolidGPT is not legally responsible or liable for any actions taken by users, nor for any content inputted, uploaded, or outputted by users.\n" +
        "\n" +
        "7. **Disclaimer:** \n" +
        "   - Users explicitly agree that the use of SolidGPT services is at their sole risk. The SolidGPT team disclaims all liability for any direct, indirect, incidental, special, or consequential damages resulting from the use or the inability to use our services.\n" +
        "   - SolidGPT does not guarantee that the service will be uninterrupted or error-free, nor does it guarantee that the results obtained from the use of the service will be accurate or reliable.\n" +
        "\n" +
        "For questions, concerns, or further clarifications, please contact us at **aict@ai-citi.com**.\n" +
        "\n" +
        "By using SolidGPT, you acknowledge and accept these terms of service.\n" +
        "\n" +
        "---\n" +
        "\n" +
        "Always remember to consult with a legal expert when finalizing terms of service to ensure compliance with all applicable laws and regulations.",
    MdEditorStartText: "# 🧱 SolidGPT Cloud Service\n" +
        "\n" +
        "[![Twitter Follow](https://img.shields.io/twitter/follow/SolidGPT?style=social)](https://twitter.com/SolidGPT)\n" +
        "[![Static Badge](https://img.shields.io/badge/Github-SolidGPT-blue)](https://github.com/AI-Citizen/SolidGPT)  \n" +
        "\n" +
        "[![Static Badge](https://img.shields.io/badge/ThisDoc-English-green)](https://github.com/AI-Citizen/SolidGPT/blob/main/docs/cloudserviceintro.md)\n" +
        "[![Static Badge](https://img.shields.io/badge/介绍-中文版-geen)](https://github.com/AI-Citizen/SolidGPT/blob/main/docs/cloudserviceintro_CN.md)\n" +
        "\n" +
        "\n" +
        "\n" +
        "# 🚀 What’s this\n" +
        "Generate a Product Requirement Document and Code Solution that deeply integrates with your private project.\n" +
        "\n" +
        "Appreciate Star 🌟 us on our [SolidGPT Github](https://github.com/AI-Citizen/SolidGPT)  \n" +
        "\n" +
        "# 🏁 Quick Start\n" +
        "- SolidGPT first learns from your repository in the `Onboard Project` phase. \n" +
        "\n" +
        "- After this, choose Generate PRD or Get Tech Solution for customized solutions based on the onboarded project.\n" +
        "\n" +
        "## ❗️❗️ Onborading your project(Required)\n" +
        "1. Choose `Onboard Project` from the top left dropdown.\n" +
        "1. Enter your OpenAI API key.\n" +
        "1. Upload your project folder.\n" +
        "1. ❗️Note: After completing the Onboard Project, an Onboard ID will be generated. If you remain in the same browser session, it will be automatically applied to subsequent actions. Alternatively, you can save it and manually input it in the future to bypass onboarding.\n" +
        "\n" +
        "\n" +
        "## 🤖️ Chat with Your Code Repo\n" +
        "1. Choose `Chat with Your Repo(Beta)` from the top left dropdown.\n" +
        "1. Enter your OpenAI API key.\n" +
        "1. Input your problem/Requirement and start any topic with your codebase \n" +
        "\n" +
        "## 🧠 AutoGen Analysis\n" +
        "1. Choose `AutoGen Analysis(Beta)` from the top left dropdown.\n" +
        "1. Enter your OpenAI API key.\n" +
        "1. Input your problem/Requirement and start the issue focused chat sessions\n" +
        "\n" +
        "## 🧮 Get Technical Solution\n" +
        "1. Choose `Get Tech Solution` from the top left dropdown.\n" +
        "1. Enter your OpenAI API key.\n" +
        "1. Input your problem/Requirement.\n" +
        "\n" +
        "Note: We currently support Python, JavaScript, and TypeScript projects. Support for more languages is on the way.\n" +
        "## 📁 Generate Product Requirement Document\n" +
        "1. Choose `Generate RPD` from the top left dropdown.\n" +
        "1. input your requirement (suggest short and clear)\n" +
        "1. input additional info or your project, SolidGPT will use both summary from repository and additional info you provided (optinoal)\n" +
        "\n" +
        "## 📣 Feedback!!\n" +
        "If you have any questions or feedback about our project, please don't hesitate to reach out to us. We greatly appreciate your suggestions!\n" +
        "- Email: aict@ai-citi.com\n" +
        "- GitHub Issues: For more technical inquiries, you can also create a new issue in our [GitHub repository](https://github.com/AI-Citizen/SolidGPT/issues).\n" +
        "We will respond to all questions within 2-3 business days."
};

export default stringConstant;
