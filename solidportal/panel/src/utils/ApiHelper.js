import config from "../config/config";
import axios from "axios";

export class ApiHelper {
    static async postRequest(endPoint, requestBody) {
        try {
            return await axios.post(this.joinAndNormalizeUrl(config.ApiBaseUrl, endPoint), requestBody, {
                headers: config.CustomHeaders,
            });
        } catch (error) {
            throw error;
        }
    }

    static joinAndNormalizeUrl(base, ...parts) {
        return [base, ...parts]
            .map(part => part.trim().replace(/(^\/+|\/+$)/g, ''))
            .filter(part => part.length > 0)
            .join('/');
    }
}