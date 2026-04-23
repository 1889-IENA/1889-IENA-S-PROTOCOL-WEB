// ✠ v4.0.0




function Get_Server_Config() {
    const Host = sessionStorage.getItem("server_host");
    const Port = sessionStorage.getItem("server_port");
    const Protocol = "wss://";
    return { Host, Port, Url: Protocol + Host + ":" + Port };
}




const Username = sessionStorage.getItem("username");
const Config = Get_Server_Config();

const Normal_Data_Box = document.getElementById("Normal_Data");
const Service_Data_Box = document.getElementById("Service_Data");
const Perm_List = document.getElementById("Permissions_Body");
const Bio_Box = document.getElementById("Bio_Content");




if (!Username || !Config.Host) window.location.href = "../index.html";




window.onload = () => Pull_Profile_Data();




function Pull_Profile_Data() {

    const Socket = new WebSocket(Config.Url);

    Socket.onopen = () => {
        Socket.send("11|");
    };

    Socket.onmessage = (Event) => {
        const Response = Event.data;
        const Parts = Response.split("|");

        if (Parts[0] === "11" && Parts[1] === "OK") {
            const Data = JSON.parse(Parts[2]);
            Update_Profile_UI(Data);
        }
        Socket.close();
    };

    Socket.onerror = () => Socket.close();
}




function Update_Profile_UI(Data) {
    
    Normal_Data_Box.innerHTML = "";

    const Normal_Fields = [
        ["Username", "Username"],
        ["Role", "Role"],
        ["Account_State", "Account State"],
        ["Account_Created_At", "Registration"],
        ["Family", "Family"],
        ["Work_Style", "Work Style"],
        ["Status", "Status"],
        ["Locations_Within_Reach", "Locations Within Reach"],
        ["Communication", "Communication"]
    ];


    Normal_Fields.forEach(([Key, Label]) => {

        Normal_Data_Box.innerHTML += `
            <div class="Data_Item">
                <span class="Item_Key">${Label}</span>
                <span class="Item_Value">${Data.Normal[Key] || "N/A"}</span>
            </div>
        `;

    });


    Service_Data_Box.innerHTML = "";


    const Service_Fields = [
        ["1889_Class", "1889 Class"],
        ["1889_Completed_Mission_Number", "1889 Completed Mission Number"],
        ["1889_Mission_Success_Rates", "1889 Mission Success_Rates"],
        ["1889_Score", "1889 Score"],
        ["1889_Rank", "1889 Rank"],
        ["1889_Contract_Value", "1889 Contract Value"],
        ["1889_Anniversary", "1889 Anniversary"],
        ["1889_Suspension_Status", "1889 Suspension Status"],
        ["1889_Violation_Status", "1889 Violation Status"],
        ["1889_Right_Number", "1889 Right Number"]
    ];


    Service_Fields.forEach(([Key, Label]) => {

        Service_Data_Box.innerHTML += `
            <div class="Data_Item">
                <span class="Item_Key">${Label}</span>
                <span class="Item_Value">${Data[1889][Key] || "N/A"}</span>
            </div>
        `;

    });


    Perm_List.innerHTML = "";


    const Rights = Data.Look_Permissions || {};


    const Labels = [
        ["Ban_Authority", "Ban Authority"],
        ["Chat_Clear_Authority", "Clear Chat Authority"],
        ["Chat_Permission", "Chat Access"],
        ["View_Tasks", "Task View"]
    ];


    Labels.forEach(([Key, Label]) => {

        const Granted = Rights[Key] === true;

        Perm_List.innerHTML += `
            <tr>
                <td class="Perm_Type">${Label}</td>
                <td><span class="Status_Badge ${Granted ? 'granted' : 'denied'}">${Granted ? 'GRANTED' : 'DENIED'}</span></td>
            </tr>
        `;

    });

    Bio_Box.innerHTML = Data[1889]["1889_Bio"] || "No biography available.";
    
}
