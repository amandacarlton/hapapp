alert("hi");
//var h1=document.createElement("h1");
// h1.innerHTML = "OMBD Movies About ";
// document.body.appendChild(h1);
var button=document.getElementById('musicsearch');

button.addEventListener("click",function(){
var find=document.getElementById('music').value;
//h1.innerHTML = "OMBD Movies About "+ find.charAt(0).toUpperCase()+find.slice(1);
var xhr= new XMLHttpRequest();
xhr.open('GET', 'https://itunes.apple.com/search?term=' + find);
xhr.addEventListener('load',function () {
var response= xhr.response;
var responseData= JSON.parse(response);
console.log(responseData);


//<p><a href='/show.html?">Mystic</a></p>

// for (var i = 0; i < responseData.Search.length; i++) {
//   var respondseid=responseData.Search[i].imdbID;
//   var a = document.createElement('a');
//   a.innerHTML= responseData.Search[i].Title;
//   a.href='/show.html?i='+ respondseid;
//
//   var p=document.createElement("p");
//   p.appendChild(a);
//
//   document.body.appendChild(p);
//   console.log(a.href);
//
// }
//
// });

xhr.send();
});
