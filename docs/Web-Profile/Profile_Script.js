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

const Profile_Grid = document.getElementById("Profile_Content");
const Profile_Footer = document.getElementById("Profile_Footer");

const Normal_Data_Block = document.getElementById("Normal_Data");
const Service_Data_Block = document.getElementById("Service_Data");
const Permission_List = document.getElementById("Permissions_Body");
const Biography_Block = document.getElementById("Bio_Content");




window.onload = () => {
    Profile_Request();
};




function Profile_Request() {

    const Socket = new WebSocket(Config.Url);

    Socket.onopen = () => {
        Socket.send("11|");
    };

    Socket.onmessage = (Event) => {

        const Response = Event.data;
        const Parts = Response.split("|");

        if (Parts[0] === "11" && Parts[1] === "OK") {

            try {
                const Data = JSON.parse(Parts[2]);
                UI_Update(Data);
            
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
    if (Profile_Grid) Profile_Grid.style.display = "none";
    if (Profile_Footer) Profile_Footer.style.display = "none";
}




function UI_Update(Data) {
    
    if (!Data || !Data.Normal || !Data[1889]) {
        IU_Hide();
        return;
    }



    Normal_Data_Block.innerHTML = "";

    const Normal_Data = [
        ["Username",                             "Username"],
        ["Role",                                     "Role"],
        ["Account_State",                   "Account State"],
        ["Account_Created_At",         "Account Created At"],
        ["Family",                                 "Family"],
        ["Work_Style",                         "Work Style"],
        ["Status",                                 "Status"],
        ["Locations_Within_Reach", "Locations Within Reach"],
        ["Communication",                   "Communication"]
    ];


    Normal_Data.forEach(([Key, Label]) => {

        Normal_Data_Block.innerHTML += `
            <div class="Data_Item">
                <span class="Item_Key">${Label}</span>
                <span class="Item_Value">${Data.Normal[Key] || "N/A"}</span>
            </div>
        `;

    });



    Service_Data_Block.innerHTML = "";

    const Service_Data = [
        ["Class",                                       "Class"],
        ["Completed_Mission_Number", "Completed Mission Number"],
        ["Mission_Success_Rates",       "Mission Success Rates"],
        ["Score",                                       "Score"],
        ["Rank",                                         "Rank"],
        ["Contract_Value",                     "Contract Value"],
        ["Anniversary",                           "Anniversary"],
        ["Suspension_Status",               "Suspension Status"],
        ["Violation_Status",                 "Violation Status"],
        ["Right_Number",                         "Right Number"]
    ];


    Service_Data.forEach(([Key, Label]) => {

        Service_Data_Block.innerHTML += `
            <div class="Data_Item">
                <span class="Item_Key">${Label}</span>
                <span class="Item_Value">${Data[1889][Key] || "N/A"}</span>
            </div>
        `;

    });



    Permission_List.innerHTML = "";

    const Permissions = Data.Look_Permissions || {};

    const Permission_Data = [
        ["Ban_Authority",               "Ban Authority"],
        ["Chat_Clear_Authority", "Clear Chat Authority"],
        ["Chat_Permission",           "Chat Permission"],
        ["View_Tasks",                      "View Task"]
    ];


    Permission_Data.forEach(([Key, Label]) => {

        const Granted = Permissions[Key] === true;

        Permission_List.innerHTML += `
            <tr>
                <td class="Perm_Type">${Label}</td>
                <td><span class="Status_Badge ${Granted ? 'granted' : 'denied'}">${Granted ? 'GRANTED' : 'DENIED'}</span></td>
            </tr>
        `;

    });



    Biography_Block.innerHTML = Data[1889]["Bio"] || "N/A";

}
