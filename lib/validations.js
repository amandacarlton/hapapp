module.exports= {

  create: function (firstname, lastname, newemail, password, data) {

  var output=[];

  for(var i=0; i < data.length; i++){
    if(data[i].email.trim().toLowerCase() === newemail.trim().toLowerCase()){
      output.push("Email already exists");
    }
  };


  if(firstname.trim().length === 0){
    output.push("First name cannot be blank");
  }

  if(lastname.trim().length === 0){
    output.push("Last name cannot be blank");
  }

  if(password.trim().length === 0){
    output.push("Password cannot be blank");
  }

  if(password.trim().length < 7){
    output.push("Password must be longer than 6 characters");
  }

  return output;
},


 };
