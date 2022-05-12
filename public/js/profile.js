let action = "Create";
function setAction(actionParam) {
  action = actionParam;
}

function uploadSuccess(data) {

  if (action == "Create")
  {
    if (data.error)
    {
      alert(data.message);
      return;
    }
          $.ajax({
            url: "/create",
            type: "POST",
            data: {filename2:data.filename2, username:$("#username").val(), password:$("#password").val()},
            success: function(data2){
                if (data2.error)
                  alert(data2.message);
                else {
                  alert("account created");
                  display.src = "images/" + data2.filename2;
                }
              } ,
            dataType: "json"
          });

  }
  else if (action == "Update")
  {
          $.ajax({
            url: "/update",
            type: "PUT",
            data: {filename2:data.filename2, username:$("#username").val(), password:$("#password").val()},
            success: function(data2){
                if (data2.error)
                  alert(data2.message);
                else {
                  alert("account updated");
                  display.src = "images/" + data2.filename2;
                }
              } ,
            dataType: "json"
          });
  }

}
function showPassword() {
  var input = document.getElementById("password");
  if (input.type === "password") {
    input.type = "text";
  }
  else {
    input.type = "password";
  }
}

$(document).ready(function(){
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
