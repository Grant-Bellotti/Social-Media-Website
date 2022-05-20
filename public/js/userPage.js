let ident;
let messageid;
let socket = io();
//socket.emit('updateComments', {'text': text,'messageID':id,'user': user});

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
      let color = getRandomColor()


function commentit(id){
  let text = $("#commentBox").val();
  if(text != "") {
    $.get("/checkAuthenticated",function(info){
      if(info.error) {
        alert(info.message);
        return false;
      } else {
        let user = info.user;
         $.ajax({
              url: "/getData",
              type: "GET",
             data: {messageID:messageid},
              success: function(data){

                let oldComment = data.comments;
                console.log(oldComment);
                           $.ajax({
                        url: "/storeComment",
                        type: "POST",
                       data: {text: text,messageID:messageid,user:user,oldComment:oldComment},
                        success: function(data2){


                        } ,
                        dataType: "json"
                      });
              } ,
              dataType: "json"
            });
       socket.emit("updateComments",{"text":text,"messageID":messageid,"user":user})
       $("#commentBox").val("");
      }
    });
  }

}

  
  $(document).ready(function(){ 
    $.ajax({
      url: "/getPostID",
      type: "GET",
      data: {},
      success: function(data){
        messageid = data.ID
        socket.on('welcome',function(){
          console.log('welcome func');
          $.ajax({
            url: "/getData",
            type: "GET",
           data: {messageID:messageid},
            success: function(data){
              console.log(data);
              $("#messages").append(
                `<div class="userBlock" style="background-color:${data.color}">
                <h1>
                ${data.message}
                </h1>
                <p>
                ${data.realMessage}
                </p>
                <div>
                `)              } ,
            dataType: "json"
          });
        })
      } ,
      dataType: "json"
    });


      
    
//Get message from server.

    
    socket.on('updateComments', function(data) {
      let color = getRandomColor()
        if(messageid==data.messageID)
        $.ajax({
          url: "/getData",
          type: "GET",
         data: {messageID:messageid},
          success: function(data){
            $("#messages").append(
              `<div>
              
              <p class="commentBlock" style="background-color:${color}">
              ${data.user}: 
              ${data.text}
              </p>
              <div>
              `)              } ,
          dataType: "json"
        });

/*
        $("#messages").append(
          `<div>

          <p class="commentBlock" style="background-color:${data.color}">
          ${data.user}: 
          ${data.text}
          </p>
          <div>
          `)    
        */
        
        });
  });