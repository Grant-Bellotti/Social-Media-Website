function submitClicked(){
  username = $('#tempUser').val();
  password = $('#password').val();
  $.ajax({
    url: "/check",
    type: "GET",
    data: {username:username,password:password},
    success: function(data){
      if (data.error){
        alert(data.message);
      }
      else {
        let surveyNum =(parseInt($("input:radio[name='q1']:checked").val()) + parseInt($("input:radio[name='q2']:checked").val()) +
                        parseInt($("input:radio[name='q3']:checked").val()) + parseInt($("input:radio[name='q4']:checked").val()) +
                        parseInt($("input:radio[name='q5']:checked").val()) + parseInt($("input:radio[name='q6']:checked").val()) +
                        parseInt($("input:radio[name='q7']:checked").val()) + parseInt($("input:radio[name='q8']:checked").val()) +
                        parseInt($("input:radio[name='q9']:checked").val()) + parseInt($("input:radio[name='q10']:checked").val()));
        if(!surveyNum) {
          alert("all questions must be answered");
          return
        }
        $.ajax({
          url: "/surveySubmit",
          type: "POST",
          data: {surveyNumber:surveyNum,
                 password:password,
                 username:username},
          success: function(data){
            if(data.error)
              alert(data.message);
            else {
              console.log(data.num);
              alert("your survey number is "+data.num);
            }
          },
          dataType: "json"
        });
        return false;
      }
    } ,
    dataType: "json"
  });
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
  $("#submitButton").click(submitClicked);


});
