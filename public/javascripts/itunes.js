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

 //- div.fave
 //-  form(action="/opinion" method="post")
 //-    label(for="love")
 //-       img.love(src="https://tctechcrunch2011.files.wordpress.com/2011/05/thumbs.png" alt="like")
 //-    input(type="checkbox" id="love" name="love")
 //-    p
 //-    label(for="dislike")
 //-       img.dislike(src="http://i40.tinypic.com/jt43dy.jpg" alt="dislike")
 //-    input(type="checkbox" id="dislike" name="dislike")
 //-    p
 //-    input(type="hidden" name='barname' value=bar.name)
 //-    p
 //-    input(type="hidden" name="userid" value=user._id)
 //-    p
 //-    input(type="hidden" name="username" value=user.firstname)
 //-    p
 //-    input(type="submit" value="bar opinion")
