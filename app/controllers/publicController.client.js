'use strict';

(function () {

   var location = document.querySelector('#loca');
   var term = document.querySelector('#term');
   var search = document.querySelector('#search');
   var sResult = document.querySelector('#sResult');
   var sResultProfile = document.querySelector('#sResultProfile');
   var apiUrl = appUrl + '/api/:id/search';

   function updateSearch (data) {
      //console.log(data);
      var myData = JSON.parse(data);
      sResult.innerHTML = '<h3>Select a place to go:</h3><br>';
      for(var a = 0; a < myData.businesses.length; a++){
         var category = '';
         for(var b = 0; b < myData.businesses[a].categories.length; b++) category = category + myData.businesses[a].categories[b].title + ', ';
         if(myData.businesses[a].is_closed == false) sResult.innerHTML = sResult.innerHTML + '<li><input type="radio" value="' +myData.businesses[a].id+'_'+myData.businesses[a].phone+ '" name="radioBusi" id="radioBusi'+a+'">'+myData.businesses[a].name+'<img src='+myData.businesses[a].image_url+' class = "miniimg"><h>'+category+' Price: '+myData.businesses[a].price+'<br>OPEN NOW! Reviews: '+myData.businesses[a].review_count+', Rating: '+myData.businesses[a].rating+', Phone: '+myData.businesses[a].display_phone+'</h><br><h>'+myData.businesses[a].location.address1+' '+myData.businesses[a].location.address2+' '+myData.businesses[a].location.address3+' '+myData.businesses[a].location.city+' '+myData.businesses[a].location.state+' '+myData.businesses[a].location.zip_code+'</h></li><br>';
      }
   }
   
   function updateIamgoing (data) {
      //console.log(data);
      var myData = JSON.parse(data);
      sResultProfile.innerHTML = '<h3>I am going to:</h3><br>';
      for(var a = 0; a < myData.businesses.length; a++){
         var category = '';
         for(var b = 0; b < myData.businesses[a].categories.length; b++) category = category + myData.businesses[a].categories[b].title + ', ';
         if(myData.businesses[a].is_closed == false) sResultProfile.innerHTML = sResultProfile.innerHTML + '<li>'+myData.businesses[a].name+'<img src='+myData.businesses[a].image_url+' class = "miniimg"><h>'+category+' Price: '+myData.businesses[a].price+'<br>OPEN NOW! Reviews: '+myData.businesses[a].review_count+', Rating: '+myData.businesses[a].rating+', Phone: '+myData.businesses[a].display_phone+'</h><br><h>'+myData.businesses[a].location.address1+' '+myData.businesses[a].location.address2+' '+myData.businesses[a].location.address3+' '+myData.businesses[a].location.city+' '+myData.businesses[a].location.state+' '+myData.businesses[a].location.zip_code+'</h></li><br>';
      }
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl+'get', updateSearch));

   search.addEventListener('click', function () {

      
      ajaxFunctions.ajaxRequest('GET', appUrl+'/api/:id/getsavetoken', function(){
         ajaxFunctions.ajaxRequest('GET', apiUrl+'/'+location.value+'_'+term.value, updateSearch);
      });
      
      

   }, false);

   sResult.addEventListener('click', function () {

      var idPhone = document.querySelector('input[name = "radioBusi"]:checked').value;
      
      ajaxFunctions.ajaxRequest('GET', apiUrl+'iamgoing/'+idPhone, function (){
         ajaxFunctions.ajaxRequest('GET', appUrl+'/api/:id/iamgoing', updateIamgoing);
         ajaxFunctions.ajaxRequest('GET', apiUrl+'get', updateSearch);
      });
      

   }, false);

})();
