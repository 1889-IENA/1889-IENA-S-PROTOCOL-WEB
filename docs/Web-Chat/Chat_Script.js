// ✠ v4.0.0




function Get_Server_Config() {
    const Host = sessionStorage.getItem("server_host");
    const Port = sessionStorage.getItem("server_port");
    const Protocol = "wss://";
    return { Host, Port, Url: Protocol + Host + ":" + Port };
}




const Username = sessionStorage.getItem("username");
const Config = Get_Server_Config();


let Current_Target = null;
let Current_Target_Password = null;
let Pending_Target = null;
let Auto_Scroll = true;
let Global_Socket = null;
let Guide_Open = false;




const Welcome_Stage = document.getElementById("Welcome_Stage");
const Auth_Panel = document.getElementById("Auth_Panel");
const DM_Panel = document.getElementById("DM_Panel");
const Auth_Channel_Name = document.getElementById("Auth_Channel_Name");
const Password_Field = document.getElementById("Channel_Password_Field");
const DM_UID_Field = document.getElementById("DM_UID_Field");

const Chat_Header = document.getElementById("Chat_Header");
const Messages_Area = document.getElementById("Messages_Area");
const Input_Area = document.getElementById("Input_Area");
const Guide_Panel = document.getElementById("Guide_Panel");

const Message_Form = document.getElementById("Message_Form");
const Message_Input = document.getElementById("Message_Input");
const Target_Display = document.getElementById("Current_Target_Display");
const Scroll_Btn = document.getElementById("Auto_Scroll_Btn");




if (!Username || !Config.Host) { window.location.href = "../index.html"; }




Initialize_Persistent_Link();




function Initialize_Persistent_Link() {

    if (Global_Socket) Global_Socket.close();

    Global_Socket = new WebSocket(Config.Url);

    Global_Socket.onopen = () => {
        if (Current_Target) Synchronize_History();
    };

    Global_Socket.onmessage = (Event) => {

        const Raw_Data = Event.data;
        const Parts_Raw = Raw_Data.split("|");
        const Parts = Parts_Raw.length > 3 ? [Parts_Raw[0], Parts_Raw[1], Parts_Raw.slice(2).join("|")] : Parts_Raw;

        if (Parts[0] === "21" && Parts[1] === "OK") {

            try {
                const Message_Pool = JSON.parse(Parts[2]);
                Render_History(Message_Pool);
            } catch (Error_Object) {}

        } else if (Parts[0] === "20" && Parts[1] === "PUSH") {

            try {
                const Push_Packet = JSON.parse(Parts[2]);
                if (Push_Packet.Target === Current_Target) {
                    Append_Live_Message(Push_Packet.Data);
                }
            } catch (Error_Object) {}

        }

    };

    Global_Socket.onclose = () => {
        setTimeout(Initialize_Persistent_Link, 3000);
    };

}




function Synchronize_History() {

    if (!Global_Socket || Global_Socket.readyState !== WebSocket.OPEN) return;

    if (!Current_Target) return;

    const Sync_Payload = "21||" + Current_Target + "|" + (Current_Target_Password || "");

    Global_Socket.send(Sync_Payload);

}




function Render_History(Messages) {

    Messages_Area.innerHTML = "";
    Messages.forEach(Item => Append_Live_Message(Item, false));

    if (Auto_Scroll) Scroll_To_Bottom();

}




function Append_Live_Message(Item, Should_Scroll = true) {

    const Message_Element = document.createElement("div");

    Message_Element.className = "Message_Unit";

    const Header_Element = document.createElement("div");

    Header_Element.className = "Msg_Header";
    Header_Element.innerHTML = `
        <span class="Msg_Time">[${Item.Time}]</span>
        <span class="Msg_Sender">✠ ${Item.Sender}</span>
    `;

    const Content_Element = document.createElement("div");

    Content_Element.className = "Msg_Content";
    Content_Element.textContent = Item.Message;

    Message_Element.appendChild(Header_Element);
    Message_Element.appendChild(Content_Element);

    Messages_Area.appendChild(Message_Element);

    if (Auto_Scroll && Should_Scroll) Scroll_To_Bottom();

}




function Transmit_Message(Message) {

    if (!Global_Socket || Global_Socket.readyState !== WebSocket.OPEN) return;

    const Payload = "20||" + Current_Target + "|" + Message + "|" + (Current_Target_Password || "");

    Global_Socket.send(Payload);

}




function Scroll_To_Bottom() {
    Messages_Area.scrollTop = Messages_Area.scrollHeight;
}




Message_Form.addEventListener("submit", (Submit_Event) => {

    Submit_Event.preventDefault();

    const Content = Message_Input.value.trim();

    if (!Content) return;

    if (Content.startsWith("/")) {
        Process_Command(Content);
        Message_Input.value = "";
        return;
    }

    Transmit_Message(Content);
    Message_Input.value = "";

});




function Process_Command(Command) {

    if (Command.startsWith("/join ")) {

        const Target = Command.split(" ")[1].toUpperCase();

        if (Target.startsWith("#")) Select_Target(Target);

    } else if (Command.startsWith("/dm ")) {

        const Target = Command.split(" ")[1];

        if (Target && Target.startsWith("@")) {
            Pending_Target = Target;
            Open_Chat(Target, "");
        }

    }

}




function Hide_All_Stages() {
    Welcome_Stage.style.display = "none";
    Auth_Panel.style.display = "none";
    DM_Panel.style.display = "none";
    Chat_Header.style.display = "none";
    Messages_Area.style.display = "none";
    Input_Area.style.display = "none";
    Guide_Panel.style.display = "none";
    Guide_Open = false;
    Current_Target = null;
}




function Select_Target(Target) {

    document.querySelectorAll('.Channel_Btn').forEach(Btn => {
        Btn.classList.toggle('active', Btn.innerText === Target);
    });

    Hide_All_Stages();

    Auth_Panel.style.display = "flex";
    Auth_Channel_Name.innerText = Target;
    Password_Field.value = "";
    Password_Field.focus();

    Pending_Target = Target;

}




function Open_DM_Panel() {

    document.querySelectorAll('.Channel_Btn').forEach(Btn => Btn.classList.remove('active'));

    Hide_All_Stages();

    DM_Panel.style.display = "flex";
    DM_UID_Field.value = "";
    DM_UID_Field.focus();

}




function Cancel_To_Welcome() {

    Hide_All_Stages();

    Welcome_Stage.style.display = "flex";

}




function Handle_Auth_Key(Event) {
    if (Event.key === "Enter") Confirm_Password();
}




function Handle_DM_Key(Event) {
    if (Event.key === "Enter") Confirm_DM();
}




function Confirm_Password() {

    const Password = Password_Field.value;
    const Target = Pending_Target;

    Open_Chat(Target, Password);

}




function Confirm_DM() {

    const Target = DM_UID_Field.value.trim();

    if (!Target || !Target.startsWith("@")) return;

    Open_Chat(Target, "");

}




function Open_Chat(Target, Password) {

    Hide_All_Stages();

    Current_Target = Target;
    Current_Target_Password = Password;
    Target_Display.innerText = Target;

    Chat_Header.style.display = "flex";
    Messages_Area.style.display = "flex";
    Input_Area.style.display = "block";

    Synchronize_History();

}




function Toggle_Guide() {

    Guide_Open = !Guide_Open;
    Guide_Panel.style.display = Guide_Open ? "flex" : "none";

}




function Toggle_Auto_Scroll() {
    Auto_Scroll = !Auto_Scroll;
    Scroll_Btn.innerText = "AUTO SCROLL: " + (Auto_Scroll ? "ON" : "OFF");
}
