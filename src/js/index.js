document.addEventListener("DOMContentLoaded",function(){
    
    let socket = io();
    let Name = "Anonymous";
    let quote;

    //get DOM elements
    let nameButton = document.getElementById("nameButton");
    let name =  document.getElementById("name");
    let msg = document.getElementById("msg");
    let msgBox = document.getElementById("msgBox");
    let send = document.getElementById("send");
    let rq = document.getElementById("rq");

    //Get quotes
    $.getJSON("book_quotes.json",function(quote){
      quotes = quote;     
    });
    
    //Show modal onload, modal is not closed by keyboard or mouse
    $("#nameModal").modal({backdrop: 'static', keyboard: false});

    //when enter is clicked
    nameButton.addEventListener("click",function(){
        if(name.value != ""){
            Name = name.value;
        }
        $("#nameModal").modal("hide");
    });
    
    function sendMessage(){
        if(msg.value == ""){
            return;
        }
        let container = document.createElement("div");
        let text = document.createElement("span");
        container.classList.add("mt-2","text-right");
        text.innerHTML = msg.value;
        text.classList.add("bg-dark","text-light","px-1","py-1","rounded");
        container.appendChild(text);
        msgBox.appendChild(container);
        socket.emit("message",msg.value,Name);
        msg.value = "";
        setTimeout(function(){
            container.remove();
        },60000);
    }
    
    
    //send button clicked
    send.addEventListener("click",sendMessage);
    msg.addEventListener("keypress",function(e){
        let key = e.keyCode || e.which;
        if(key == 13){
            sendMessage();
        }
    });

    //When RQ (random quote) button is clicked.
    rq.addEventListener("click",function(){
        let rand = Math.floor(Math.random()*100);
        let rquote = quotes[rand].quote+" -"+quotes[rand].author;
        let container = document.createElement("div");
        let text = document.createElement("span");
        container.classList.add("mt-2","text-right");
        text.innerHTML = rquote;
        text.classList.add("bg-dark","text-light","px-1","py-1","rounded");
        container.appendChild(text);
        msgBox.appendChild(container);
        socket.emit("message",rquote,Name);
        setTimeout(function(){
            container.remove();
        },60000); 
    });

    function recievedMessage(rmsg,rname){
        let container = document.createElement("div");
        let rtext = document.createElement("span");
        rtext.innerHTML = "<strong>"+rname+"</strong>"+": "+rmsg;
        rtext.classList.add("bg-dark","text-light","px-1","py-1","rounded");
        container.classList.add("text-left","mt-2");
        container.appendChild(rtext);
        msgBox.appendChild(container);
        setTimeout(function(){
            container.remove();
        },60000);
    }

    //When message arrives from server.js call recievedMessage()
    socket.on("recieve_message",recievedMessage);
})