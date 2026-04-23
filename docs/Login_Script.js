// ✠ v4.0.0




const Login_Form = document.getElementById("LoginForm");

const Host_Input = document.getElementById("server_host");
const Port_Input = document.getElementById("server_port");

const Username_Input = document.getElementById("username");
const Password_Input = document.getElementById("password");




const Cards = document.querySelectorAll(".Service_Card");
const Next_Btn = document.getElementById("NextBtn");
const Prev_Btn = document.getElementById("PrevBtn");

const Card_Slider = document.getElementById("CardSlider");

let Current_Card_Index = 0;




function Update_Carousel(New_Index) {

    Cards[Current_Card_Index].classList.remove("Active");

    Current_Card_Index = (New_Index + Cards.length) % Cards.length;

    Cards[Current_Card_Index].classList.add("Active");

    Card_Slider.style.setProperty("--current-index", Current_Card_Index);

}




Next_Btn.addEventListener("click", () => Update_Carousel(Current_Card_Index + 1));
Prev_Btn.addEventListener("click", () => Update_Carousel(Current_Card_Index - 1));




Login_Form.addEventListener("submit", (Event_Object) => {

    Event_Object.preventDefault();

    const Host = Host_Input.value.trim() || "";
    const Port = Port_Input.value.trim() || "";

    const Username = Username_Input.value.trim();
    const Password = Password_Input.value.trim();

    if (!Username || !Password) return;

    Authorize_User(Host, Port, Username, Password);

});




function Authorize_User(Host, Port, Username, Password) {

    const Login_Url = `https://${Host}:${Port}/login`;

    fetch(Login_Url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ username: Username, password: Password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                sessionStorage.setItem("username", Username);
                sessionStorage.setItem("server_host", Host);
                sessionStorage.setItem("server_port", Port);

                window.location.href = "Web-Redirect/Redirect.html";
            } else {
                Host_Input.style.borderColor = "#ff1a1a";
                Port_Input.style.borderColor = "#ff1a1a";
                Username_Input.style.borderColor = "#ff1a1a";
                Password_Input.style.borderColor = "#ff1a1a";
            }
        })
        .catch(error => {
            console.error("Connection Failed ", error);
            Host_Input.style.borderColor = "#ff1a1a";
            Port_Input.style.borderColor = "#ff1a1a";
        });

}
