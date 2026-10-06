// v4.0.0 ✠




function Get_Server_Config() {

    const Host = sessionStorage.getItem("server_host");
    const Port = sessionStorage.getItem("server_port");
    const Token = sessionStorage.getItem("session_token");

    const Protocol = "wss://";

    return { Host, Port, Url: Protocol + Host + ":" + Port + "?token=" + Token };

}




const Username = sessionStorage.getItem("username");
const Config = Get_Server_Config();

const Status_Display = document.getElementById("Status_Display");
const Admin_Dossier_Block = document.getElementById("Admin_Dossier_Block");
const Header_Center_Block = document.getElementById("Header_Center_Block");
const Admin_Footer_Block = document.getElementById("Admin_Footer_Block");




window.onload = () => {
    Connection_Check();
};




function Connection_Check() {

    const Socket = new WebSocket(Config.Url);
    let Opened = false;

    Socket.onopen = () => {
        Opened = true;
        Socket.close();
    };

    Socket.onerror = () => {
        UI_Hide();
    };

    Socket.onclose = () => {
        if (!Opened) UI_Hide();
    };

}




function UI_Hide() {
    if (Admin_Dossier_Block) Admin_Dossier_Block.style.display = "none";
    if (Status_Display) Status_Display.style.display = "none";
    if (Admin_Footer_Block) Admin_Footer_Block.style.display = "none";
}




function Action(Type) {

    let Payload = "";

    if (Type === "Ban") {

        const Target = document.getElementById("Ban_Username").value.trim();

        if (!Target) return;

        Payload = `40||${Target}`;

    }

    else if (Type === "UnBan") {

        const Target = document.getElementById("Ban_Username").value.trim();

        if (!Target) return;

        Payload = `41||${Target}`;

    }

    else if (Type === "Clear") {

        const Target = document.getElementById("Clear_Target").value.trim();
        const Password = document.getElementById("Clear_Password").value.trim();

        if (!Target) return;

        Payload = `42||${Target}|${Password}`;

    }

    if (Payload) {
        Dispatch(Payload);
    }

}




function Dispatch(Payload) {

    if (Status_Display) {
        Status_Display.innerText = "WAITING";
        Status_Display.style.color = "#ffffff";
    }

    const Socket = new WebSocket(Config.Url);

    Socket.onopen = () => Socket.send(Payload);

    Socket.onmessage = (Event) => {

        const Response = Event.data;
        const Parts = Response.split("|");

        if (Parts[1] === "OK") {

            if (Status_Display) {
                Status_Display.innerText = "COMMAND EXECUTED";
                Status_Display.style.color = "#00ff00";
            }

            document.querySelectorAll(".Admin_Input").forEach(Input => Input.value = "");

        } else {

            if (Status_Display) {
                Status_Display.innerText = "COMMAND " + (Parts[2] || "DENIED");
                Status_Display.style.color = "#ff1a1a";
            }

        }

        Socket.close();

    };

    Socket.onerror = () => {

        if (Status_Display) {
            Status_Display.innerText = "FAILURE";
            Status_Display.style.color = "#ff1a1a";
        }

        Socket.close();

    };

}
