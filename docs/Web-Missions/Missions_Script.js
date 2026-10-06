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

const Mission_Block = document.getElementById("Mission_Container");
const Count_Display = document.getElementById("Count_Display");
const Header_Center_Block = document.getElementById("Header_Center_Block");
const Mission_Footer = document.getElementById("Mission_Footer");




window.onload = () => {
    Mission_Request();
};




function Mission_Request() {

    const Socket = new WebSocket(Config.Url);

    Socket.onopen = () => {
        Socket.send("30|");
    };

    Socket.onmessage = (Event) => {

        const Response = Event.data;
        const Parts = Response.split("|");

        if (Parts[0] === "30" && Parts[1] === "OK") {

            try {
                const Raw_Data = JSON.parse(Parts[2]);
                UI_Update(Raw_Data.Missions || []);
            
            } catch (Error) {
                IU_Hide();
            }

        } else {
            IU_Hide();
        }

        Socket.close();
        
    };

    Socket.onerror = () => {
        IU_Hide();
        Socket.close();
    }; 
    
}




function IU_Hide() {
    if (Mission_Block) Mission_Block.innerHTML = "";
    if (Count_Display) Count_Display.innerText = "";
    if (Mission_Footer) Mission_Footer.style.display = "none";
}




function UI_Update(Missions) {

    Mission_Block.innerHTML = "";

    if (!Missions || Missions.length === 0) {
        Count_Display.innerText = "";
        return;
    }

    Count_Display.innerText = Missions.length + " ACTIVE MISSIONS";

    Missions.forEach((Entry) => {

        const Mission_Class = Entry.Mission_Class || "Unknown";
        const Mission_Color = Entry.Mission_Color || "white";
        const Mission_Data = Entry.Mission || {};

        const Mission_Card = document.createElement("div");
        Mission_Card.className = "Mission_Entry";
        
        Mission_Card.innerHTML = `
            <div class="Entry_Class" style="color: ${Mission_Color}">${Mission_Class}</div>
            
            <div class="Entry_Data">
                
                <div class="Field_Item">
                    <span class="Field_Key" style="color: ${Mission_Color}">NAME</span>
                    <span class="Field_Value bold_white">${Mission_Data.Mission_Name || "N/A"}</span>
                </div>

                <div class="Field_Item">
                    <span class="Field_Key" style="color: ${Mission_Color}">CODE</span>
                    <span class="Field_Value bold_white">${Mission_Data.Mission_Code || "N/A"}</span>
                </div>

                <div class="Field_Item">
                    <span class="Field_Key" style="color: ${Mission_Color}">EARN</span>
                    <span class="Field_Value">
                        <span class="Earn_Text">${Mission_Data.Score_Earn || "0"} Score</span> 
                        <span style="color: ${Mission_Color}; opacity: 0.5;">/</span> 
                        <span class="Earn_Text">${Mission_Data.Money_Earn || "0"}</span>
                    </span>
                </div>

                <div class="Field_Item" style="border: none;">
                    <span class="Field_Key" style="color: ${Mission_Color}">INFO</span>
                    <span class="Field_Value Info_Text">${Mission_Data.Mission_Info || "N/A"}</span>
                </div>

            </div>
        `;

        Mission_Block.appendChild(Mission_Card);

    });

}
