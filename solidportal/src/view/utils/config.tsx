const config = {
    ApiBaseUrl: "http://127.0.0.1:8000",
    CustomHeaders:  {
        'Content-Type': 'application/json', // Set the appropriate content type
    },
    Avatar: require("../static/img/solidgpt-1.svg"),
    UserAvatar: require("../static/img/useravatar.svg"),
    OpenaiKey: "",
    FontColor:'grey',
    ChatBoxColor: 'black',
    Font:"Arial"
};

export default config;
