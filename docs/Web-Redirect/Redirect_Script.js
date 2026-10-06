// v4.0.0 ✠




function Get_Server_Config() {

    const Host = sessionStorage.getItem("server_host");
    const Port = sessionStorage.getItem("server_port");
    const Token = sessionStorage.getItem("session_token");

    const Protocol = "wss://";

    return {
        Host: Host,
        Port: Port,
        Url: Protocol + Host + ":" + Port + "?token=" + Token
    };

}




function Navigate(Target_Name) {

    const Webmap = {
        'Chat': '../Web-Chat/Chat.html',
        'Missions': '../Web-Missions/Missions.html',
        'Profile': '../Web-Profile/Profile.html',
        'Admin': '../Web-Admin/Admin.html'
    };


    const Target_Web = Webmap[Target_Name];


    if (Target_Web) {

        document.body.style.opacity = '0';

        setTimeout(() => {
            window.location.href = Target_Web;
        }, 200);

    }

}




function Clear_Session() {

    sessionStorage.removeItem("username");
    sessionStorage.removeItem("server_host");
    sessionStorage.removeItem("server_port");
    sessionStorage.removeItem("session_token");

    window.location.href = "../index.html";

}




function Logout() {

    const Username = sessionStorage.getItem("username");
    const Config = Get_Server_Config();


    if (Username && Config.Host) {

        const Socket = new WebSocket(Config.Url);

        Socket.onopen = () => {
            Socket.send("10|");
            Clear_Session();
        };

        Socket.onerror = () => {
            Clear_Session();
        };

    } else {
        Clear_Session();
    }

}




window.onload = () => {

    if (!sessionStorage.getItem("username")) {
        window.location.href = "../index.html";
    }

};
