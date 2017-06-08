'use strict';

(function () {

   var login = document.querySelector("#login");
   var location = document.querySelector('#loca');
   var term = document.querySelector('#term');
   var search = document.querySelector('#search');
   var remove = document.querySelector('#remove');
   var sResult = document.querySelector('#sResult');
   var sResultProfile = document.querySelector('#sResultProfile');
   var apiUrl = appUrl + '/api/:id/search';

   function updateSearch (data) {
      //console.log(data);
      var myData = JSON.parse(data);
      if(myData.businesses.length > 0 && login !== null) login.innerHTML = 'YOU NEED TO LOGIN IN ORDER TO SELECT A PLACE!<br><a href="/auth/github">					<div class="btn" id="login-btn">						<img src="/public/img/github_32px.png" alt="github logo" />						<p>LOGIN WITH GITHUB</p>					</div>				</a>';
      sResult.innerHTML = '<h3>Select a place to go:</h3><br>';
      for(var a = 0; a < myData.businesses.length; a++){
         var category = '';
         for(var b = 0; b < myData.businesses[a].categories.length; b++) category = category + myData.businesses[a].categories[b].title + ', ';
         if(myData.businesses[a].is_closed == false) sResult.innerHTML = sResult.innerHTML + '<li class="list-group-item"><input type="radio" value="' +myData.businesses[a].id+'_'+myData.businesses[a].phone+ '" name="radioBusi" id="radioBusi'+a+'">'+myData.businesses[a].name+'<img src='+myData.businesses[a].image_url+' class = "miniimg img-rounded"><h>'+category+' Price: '+myData.businesses[a].price+'<br>OPEN NOW! Reviews: '+myData.businesses[a].review_count+', Rating: '+myData.businesses[a].rating+', Phone: '+myData.businesses[a].display_phone+'</h><br><h>'+myData.businesses[a].location.address1+' '+myData.businesses[a].location.address2+' '+myData.businesses[a].location.address3+' '+myData.businesses[a].location.city+' '+myData.businesses[a].location.state+' '+myData.businesses[a].location.zip_code+'</h></li><br>';
      }
   }
   
   function updateIamgoing (data) {
      //console.log(data);
      //
      var myData = JSON.parse(data);
      var urlDir = appUrl.toString().split('://')[1];
      sResultProfile.innerHTML = '<h3>I am going to:</h3><br>';
      for(var a = 0; a < myData.businesses.length; a++){
         var category = '';
         for(var b = 0; b < myData.businesses[a].categories.length; b++) category = category + myData.businesses[a].categories[b].title + ', ';
         if(myData.businesses[a].is_closed == false){
            sResultProfile.innerHTML = sResultProfile.innerHTML + '<li class="list-group-item">'+myData.businesses[a].name+'<img src='+myData.businesses[a].image_url+' class = "miniimg img-rounded"><h>'+category+' Price: '+myData.businesses[a].price+'<br>OPEN NOW! Reviews: '+myData.businesses[a].review_count+', Rating: '+myData.businesses[a].rating+', Phone: '+myData.businesses[a].display_phone+'</h><br><h>'+myData.businesses[a].location.address1+' '+myData.businesses[a].location.address2+' '+myData.businesses[a].location.address3+' '+myData.businesses[a].location.city+' '+myData.businesses[a].location.state+' '+myData.businesses[a].location.zip_code+'</h></li><br>';
            var messageText = "I%20Am%20going%20to:%20"+myData.businesses[a].name+"%20Address:%20"+myData.businesses[a].location.address1+' '+myData.businesses[a].location.address2+' '+myData.businesses[a].location.address3+' '+myData.businesses[a].location.city+' '+myData.businesses[a].location.state+' '+myData.businesses[a].location.zip_code+"%20and%20Phone:%20"+myData.businesses[a].display_phone+".";
            sResultProfile.innerHTML = sResultProfile.innerHTML + '<a href="https://twitter.com/intent/tweet?url=https%3A%2F%2F'+urlDir+'&amp;text='+messageText+'" class="btn btn-block shareit-twitter-colors tw-share"><i class="fa fa-twitter"></i> Twitter</a>';
            sResultProfile.innerHTML = sResultProfile.innerHTML + '<a href="https://plus.google.com/share?url=https%3A%2F%2F'+urlDir+'&amp;text='+messageText+'" class="btn btn-block shareit-google-plus-colors tw-share"><i class="fa fa-google-plus"></i> Google+</a>';
         } 
      }
         
      
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl+'get', updateSearch));

   search.addEventListener('click', function () {

      
      ajaxFunctions.ajaxRequest('GET', appUrl+'/api/:id/getsavetoken', function(){
         ajaxFunctions.ajaxRequest('GET', apiUrl+'/'+location.value+'_'+term.value, updateSearch);
      });
      
      

   }, false);
   
   remove.addEventListener('click', function () {

      ajaxFunctions.ajaxRequest('GET', apiUrl+'rmiamgoing', function(){
         ajaxFunctions.ajaxRequest('GET', appUrl+'/api/:id/iamgoing', updateIamgoing);
      });
 
   }, false);

   sResult.addEventListener('click', function () {

      var idPhone = document.querySelector('input[name = "radioBusi"]:checked').value;
      //document.querySelector("#login").innerHTML = 'YOU NEED TO LOGIN IN ORDER TO SELECT A PLACE!<br><a href="/auth/github">					<div class="btn" id="login-btn">						<img src="/public/img/github_32px.png" alt="github logo" />						<p>LOGIN WITH GITHUB</p>					</div>				</a>';
      ajaxFunctions.ajaxRequest('GET', apiUrl+'iamgoing/'+idPhone, function (){
         ajaxFunctions.ajaxRequest('GET', appUrl+'/api/:id/iamgoing', updateIamgoing);
         ajaxFunctions.ajaxRequest('GET', apiUrl+'get', updateSearch);
      });
      

   }, false);

})();
