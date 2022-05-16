let action = "Update";
function setAction(actionParam) {
  action = actionParam;
}

function logoutClicked(){
  $.get("/logout",function(data){
    window.location = data.redirect;
  });
  return false;
}

function uploadSuccess(data) {
  if (action == "Update") {
    $.get("/getInfo",function(info){
      $.ajax({
        url: "/update",
        type: "PUT",
        data: {picture:data.filename2,yeescore:info.yeescore},
        success: function(data2){
          if (data2.error)
            alert(data2.message);
          else {
            alert("account updated");
            display.src = "images/" + data.filename2;
          }
        } ,
      dataType: "json"
      });
    });
  }
}

$(document).ready(function(){
  $.get("/getInfo",function(data){
    $("#session").html("Edit Profile: " + data.name);
    display.src = "images/" + data.picture;

  });

  $("form").submit(function(event) {
    let data = new FormData($(this)[0]);
    $.ajax({
      url: '/fileupload',
      type: 'POST',
      data: data,
      processData: false, // These two are needed to prevent JQuery from processing the form data
      contentType: false,
      mimeType: 'multipart/form-data',
      dataType: 'json', // Without this, the server's response will be a string instead of a JSON object
      success: uploadSuccess
    });
    return false;
  });

});
