// ✠ v4.0.0




function Get_Server_Config() {
    const Host = sessionStorage.getItem("server_host");
    const Port = sessionStorage.getItem("server_port");
    const Protocol = "wss://";
    return { Host, Port, Url: Protocol + Host + ":" + Port };
}




const Username = sessionStorage.getItem("username");
const Config = Get_Server_Config();
const Status_Display = document.getElementById("Status_Display");




if (!Username || !Config.Host) window.location.href = "../index.html";




function Admin_Action(Type) {

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
        Dispatch_Command(Payload);
    }

}




function Dispatch_Command(Payload) {

    Status_Display.innerText = "WAITING";
    Status_Display.style.color = "#00ffff";

    const Socket = new WebSocket(Config.Url);

    Socket.onopen = () => Socket.send(Payload);

    Socket.onmessage = (Event) => {

        const Response = Event.data;
        const Parts = Response.split("|");

        if (Parts[1] === "OK") {
            Status_Display.innerText = "COMMAND EXECUTED";
            Status_Display.style.color = "#00ff00";

            document.querySelectorAll(".Admin_Input").forEach(Input => Input.value = "");
        } else {
            Status_Display.innerText = "COMMAND " + (Parts[2] || "DENIED");
            Status_Display.style.color = "#ff1a1a";
        }

        Socket.close();

    };

    Socket.onerror = () => {
        Status_Display.innerText = "FAILURE";
        Status_Display.style.color = "#ff1a1a";
        Socket.close();
    };

}
