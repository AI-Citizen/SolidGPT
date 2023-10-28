const config = {
    ApiBaseUrl: "http://127.0.0.1:8000",
    UploadId: "UPLOAD_ID",
    GraphId: "GRAPH_ID",
    CurrentGraphId: "CURRENT_GRAPH_ID",
    CustomHeaders:  {
        'Content-Type': 'application/json', // Set the appropriate content type
    },
    UploadFilesSizeLimit: 1024 * 1024 * 50 //50MB
};

export default config;