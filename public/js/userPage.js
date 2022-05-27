let ident;
let messageid;
let socket = io();
//socket.emit('updateComments', {'text': text,'messageID':id,'user': user});
let postColor;

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
                 postColor = data.color
                      $.ajax({
                        url: "/storeComment",
                        type: "POST",
                       data: {text:text,messageID:messageid,user:user,oldComment:oldComment,color:data.color},
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
          $.ajax({
            url: "/getData",
            type: "GET",
            data: {messageID:messageid},
            success: function(data2){
              postColor = data2.color
              console.log(data2);
              let newComment =""
              if(data2.type == 'Text'){
                newComment = 
                `
                <div>
                <img src="images/${data2.propic}" height=100px width=100px>
                </div>
                `+
                `<div class="userBlock" style="background-color:${postColor}">
                <h1>
                ${data2.message}
                </h1>
                <p>
                ${data2.realMessage}
                </p>
                </div>
                <div>
                Comments
                
                ${data2.comments}
                </div>
                `
              }
              else if (data2.type == 'Image'){
                newComment = 
                `
                <div>
                <img src="images/${data2.propic}" height=100px width=100px>
                </div>
                `+
                `<div class="userBlock" style="background-color:${postColor}">
                User:${data2.user}
                <img
                style="background-color:${postColor}"
                src="images/${data2.message}"
                >
                </div>
                <div>
                Comments
                
                ${data2.comments}
                </div>
                `
              }
              else {
                newComment = 
                `
                <div>
                <img src="images/${data2.propic}" height=100px width=100px>
                </div>
                `+
                `<div class="userBlock" style="background-color:${postColor}">
                User:${data2.user}
                <video width="auto" height="auto" controls>
                <source src="videos/${data2.message}">
                </video>
                </div>
                <div>
                Comments
                
                ${data2.comments}
                </div>
                `
              }

              $("#messages").append(
                newComment
                )              
              } ,
            dataType: "json"
          });
        })
      } ,
      dataType: "json"
    });
      
    
//Get message from server.

    
    socket.on('updateComments', function(data) {
      console.log(data,"updateComments");
        if(messageid==data.messageID){
          console.log(data,'true message check');
          $("#messages").append(
            `<div>
            <p class="commentBlock" style="background-color:${postColor}">
            ${data.user}: 
            ${data.text}
            </p>
            <div>
            `)
        }
      });
  });