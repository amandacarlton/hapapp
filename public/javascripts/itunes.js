var button=document.getElementById('button');

button.addEventListener("click",function(){

var find=document.getElementById('music').value;
console.log(find);

var xhr= new XMLHttpRequest();
xhr.open('GET', 'https://itunes.apple.com/search?term=' + find);
xhr.addEventListener('load',function () {
var response= xhr.response;
var responseData= JSON.parse(response);
console.log(responseData);

 });
 xhr.send();

 });
