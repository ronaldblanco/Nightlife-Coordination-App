'use strict';

(function () {

   var profileId = document.querySelector('#profile-id') || null;
   var profileUsername = document.querySelector('#profile-username') || null;
   var profileRepos = document.querySelector('#profile-repos') || null;
   var displayName = document.querySelector('#display-name');
   var sResult = document.querySelector('#sResultProfile');
   var apiUrl = appUrl + '/api/:id';

   function updateHtmlElement (data, element, userProperty) {
      element.innerHTML = data[userProperty];
   }
   
   function updateIamgoing (data) {
      //console.log(data);
      var myData = JSON.parse(data);
      sResult.innerHTML = '';
      for(var a = 0; a < myData.businesses.length; a++){
         var category = '';
         for(var b = 0; b < myData.businesses[a].categories.length; b++) category = category + myData.businesses[a].categories[b].title + ', ';
         if(myData.businesses[a].is_closed == false) sResult.innerHTML = sResult.innerHTML + '<li>'+myData.businesses[a].name+'<img src='+myData.businesses[a].image_url+' class = "miniimg"><h>'+category+' Price: '+myData.businesses[a].price+'<br>OPEN NOW! Reviews: '+myData.businesses[a].review_count+', Rating: '+myData.businesses[a].rating+', Phone: '+myData.businesses[a].display_phone+'</h><br><h>'+myData.businesses[a].location.address1+' '+myData.businesses[a].location.address2+' '+myData.businesses[a].location.address3+' '+myData.businesses[a].location.city+' '+myData.businesses[a].location.state+' '+myData.businesses[a].location.zip_code+'</h></li><br>';
      }
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
      var userObject = JSON.parse(data);

      if (userObject.displayName !== null) {
         updateHtmlElement(userObject, displayName, 'displayName');
      } else {
         updateHtmlElement(userObject, displayName, 'username');
      }

      if (profileId !== null) {
         updateHtmlElement(userObject, profileId, 'id');   
      }

      if (profileUsername !== null) {
         updateHtmlElement(userObject, profileUsername, 'username');   
      }

      if (profileRepos !== null) {
         updateHtmlElement(userObject, profileRepos, 'publicRepos');   
      }
      
      ajaxFunctions.ajaxRequest('GET', apiUrl+'/iamgoing', updateIamgoing);

   }));
   
})();
