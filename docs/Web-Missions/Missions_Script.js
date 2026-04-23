// ✠ v4.0.0




function Get_Server_Config() {
    const Host = sessionStorage.getItem("server_host");
    const Port = sessionStorage.getItem("server_port");
    const Protocol = "wss://";
    return { Host, Port, Url: Protocol + Host + ":" + Port };
}




const Username = sessionStorage.getItem("username");
const Config = Get_Server_Config();

const Mission_Container = document.getElementById("Mission_Container");
const Count_Display = document.getElementById("Count_Display");




if (!Username || !Config.Host) window.location.href = "../index.html";




window.onload = () => Pull_Missions_Protocol();




function Pull_Missions_Protocol() {

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
                Update_Mission_Dossier(Raw_Data.Missions || []);
            } catch (Error_Object) {
                Mission_Container.innerHTML = `<p style="color: #ff1a1a; letter-spacing: 2px;">PROTOCOL_DATA_ERROR</p>`;
            }
        } else {
            Count_Display.innerText = "ACCESS DENIED";
            Mission_Container.innerHTML = `<p style="color: #ff1a1a; letter-spacing: 2px;">AUTHORIZATION_REQUIRED</p>`;
        }

        Socket.close();
        
    };

    Socket.onerror = () => Socket.close();
}




function Update_Mission_Dossier(Missions) {
    
    Mission_Container.innerHTML = "";
    
    if (Missions.length === 0) {
        Count_Display.innerText = "0 ACTIVE MISSIONS";
        Mission_Container.innerHTML = `<p style="color: var(--Text_Gray); letter-spacing: 1px;">No operational tasks assigned</p>`;
        return;
    }

    Count_Display.innerText = Missions.length + " ACTIVE MISSIONS";

    Missions.forEach((Entry) => {

        const M_Class = Entry.Mission_Class || "N/A";
        const M_Color = Entry.Mission_Color || "white";
        const M_Data = Entry.Mission || {};

        const Card = document.createElement("div");
        Card.className = "Mission_Entry";
        
        Card.innerHTML = `
            <div class="Entry_Class" style="color: ${M_Color}">${M_Class}</div>
            
            <div class="Entry_Data">
                
                <div class="Field_Item">
                    <span class="Field_Key" style="color: ${M_Color}">NAME</span>
                    <span class="Field_Value bold_white">${M_Data.Mission_Name || "N/A"}</span>
                </div>

                <div class="Field_Item">
                    <span class="Field_Key" style="color: ${M_Color}">CODE</span>
                    <span class="Field_Value bold_white">${M_Data.Mission_Code || "Unverified mission"}</span>
                </div>

                <div class="Field_Item">
                    <span class="Field_Key" style="color: ${M_Color}">EARN</span>
                    <span class="Field_Value">
                        <span class="Earn_Text">${M_Data.Score_Earn || "0"} Score</span> 
                        <span style="color: ${M_Color}; opacity: 0.5;">/</span> 
                        <span class="Earn_Text">${M_Data.Money_Earn || "0"}</span>
                    </span>
                </div>

                <div class="Field_Item" style="border: none;">
                    <span class="Field_Key" style="color: ${M_Color}">INFO</span>
                    <span class="Field_Value Info_Text">${M_Data.Mission_Info || "No information provided"}</span>
                </div>

            </div>
        `;

        Mission_Container.appendChild(Card);

    });

}
