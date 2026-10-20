// HTTP fixture used by the real ApiHelper in the component tests.
const axios = {
    get: async () => ({status: 200, data: {message: 'ready'}}),
    post: async (url, body, options) => {
        const fixture = (globalThis as any).researchHttp;
        fixture.calls.push({url, body, options});
        if (url.endsWith('/webresearch')) {
            if (fixture.hold) {
                return new Promise((resolve, reject) => {
                    fixture.release = () => resolve({status: 200, data: {result: 'stale answer'}});
                    options.signal.addEventListener('abort', () => reject({code: 'ERR_CANCELED'}));
                });
            }
            if (fixture.error) {
                throw {response: {data: {detail: fixture.error}}};
            }
            return {status: 200, data: {result: '[Public docs](https://docs.python.org/3/)'}};
        }
        return {status: 200, data: {message: 'queued'}};
    },
};
export default axios;
