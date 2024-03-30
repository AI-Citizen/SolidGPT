import Constants from "./Constants";

export type CommandOption = { value: string };
class DataMappingHelper {
    //outputs are formatted selected notionItems and codebaseItems.
    static mapData(selectedFile: string[], notionList: [string, string][], codebaseList: string[]): { notionItems: string[], codebaseItems: string[] } {
        const notionItems: string[] = [];
        const codebaseItems: string[] = [];

        selectedFile.forEach(item => {
            const notionItem = notionList.find(notion => notion[1] === this.extractFileName(item));
            const codebaseItem = codebaseList.find(code => code.includes(this.extractFileName(item)));

            if (notionItem) {
                notionItems.push(`notion/${notionItem[0]}`);
            } else if (codebaseItem) {
                codebaseItems.push(`codebase/${codebaseItem}`);
            }
        });

        return { notionItems, codebaseItems };
    }

    static removeBasePath(paths: string[]): string[] {
        let pathList = paths.map(path => path.replace(/\\\\/g, '\\').replace(/\\/g, '/'));
        const basePath = pathList.reduce((acc, curr) => {
            if (!acc) return curr;
            const basePathParts = acc.split("/");
            const currPathParts = curr.split("/");
            for (let i = 0; i < basePathParts.length; i++) {
                if (basePathParts[i] !== currPathParts[i]) {
                    return basePathParts.slice(0, i).join("/") + "/";
                }
            }
            return acc;
        }, "");
        return pathList.map(path => path.replace(new RegExp('^' + basePath), ''));
    }

    static getInputHintValue(searchText: string, optionsCommand: string[], type: string, topN): CommandOption[] {
        const foundCommands: CommandOption[] = [];
        const searchCommands: string[] = [];
        const prefix = type === Constants.onBoardProject.CodeBaseFileList ? "Codebase: " : "Notion: ";
        optionsCommand.forEach(option => {
            searchCommands.push(prefix + option );
        });
        searchCommands.forEach(option => {
            if (option.toLowerCase().replaceAll(" ", "").includes(searchText.toLowerCase().replaceAll(" ", ""))) {
                foundCommands.push({ value: option });
            }
            if (foundCommands.length >= topN) {
                return;
            }
        });
        // this.findClosestFiles(searchText,searchCommands,topN).forEach( result => {
            
        //     foundCommands.push({ value: result });
        // });
        return foundCommands;
    }

    static extractFileName(fullPath) {
        const parts = this.extractFileNameWithColon(fullPath).replace(/\\\\/g, '\\').replace(/\\/g, '/').split('/');
        return parts[parts.length - 1];
    }

    static extractFileNameWithColon(fullPath) {
        const index = fullPath.indexOf(':');
        if (index !== -1) {
            return fullPath.slice(index + 1).trim();
        } else {
            return fullPath.trim();
        }
    }

    static getCurrentTimeString(): string {
        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');

        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    }

    static extractLastFolder(filePath) {
        const parts = filePath.replace(/\\\\/g, '\\').replace(/\\/g, '/').split('/');
        return parts.slice(0, -1).join('/');
    }

    static findClosestFiles(inputString, fileNamesList, topN) {
        const charsInFileNames = new Set();
        fileNamesList.forEach(fileName => {
            fileName.split('').forEach(char => charsInFileNames.add(char.toLowerCase()));
        });

        let inputCharsInFileNames = true;
        inputString.split('').forEach(char => {
            if (!charsInFileNames.has(char.toLowerCase())) {
                inputCharsInFileNames = false;
            }
        });

        if (!inputCharsInFileNames) {
            return [];
        }

        const similarityScores = fileNamesList.map(fileName => ({
            fileName,
            similarity: this.similarText(inputString.toLowerCase(), fileName.toLowerCase())
        }));

        similarityScores.sort((a, b) => b.similarity - a.similarity);

        return similarityScores.slice(0, topN).map(score => score.fileName);
    }

    static similarText(first, second) {
        let pos1 = 0,
            pos2 = 0,
            max = 0,
            firstLength = first.length,
            secondLength = second.length,
            p, q, l, sum;

        for (p = 0; p < firstLength; p++) {
            for (q = 0; q < secondLength; q++) {
                for (l = 0;
                     (p + l < firstLength) && (q + l < secondLength) && (first.charAt(p + l) === second.charAt(q + l)); l++);
                if (l > max) {
                    max = l;
                    pos1 = p;
                    pos2 = q;
                }
            }
        }

        sum = max;

        if (sum) {
            if (pos1 && pos2) {
                sum += this.similarText(first.substr(0, pos2), second.substr(0, pos2));
            }

            if ((pos1 + max < firstLength) && (pos2 + max < secondLength)) {
                sum += this.similarText(first.substr(pos1 + max, firstLength - pos1 - max), second.substr(pos2 + max, secondLength - pos2 - max));
            }
        }

        return sum;
    }
}

export default DataMappingHelper;
