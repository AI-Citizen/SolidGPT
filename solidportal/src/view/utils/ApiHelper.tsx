import axios from "axios";
import config from "./config";


export class ApiHelper {
    static async postRequest(endPoint: any, requestBody: any) {
        try {
            return await axios.post(this.joinAndNormalizeUrl(config.ApiBaseUrl, endPoint), requestBody, {
                headers: config.CustomHeaders,
            });
        } catch (error) {
            throw error;
        }
    }

    static async getRequest(endPoint) {
        try {
            return await axios.get(this.joinAndNormalizeUrl(config.ApiBaseUrl, endPoint), {
                headers: config.CustomHeaders,
            });
        } catch (error) {
            throw error;
        }
    }

    static joinAndNormalizeUrl(base: any, ...parts: any[]) {
        return [base, ...parts]
            .map(part => part.trim().replace(/(^\/+|\/+$)/g, ''))
            .filter(part => part.length > 0)
            .join('/');
    }

    static generateUUID = (): string => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    };
}
