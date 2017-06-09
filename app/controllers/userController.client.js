'use strict';

(function () {

   var profileId = document.querySelector('#profile-id') || null;
   var profileUsername = document.querySelector('#profile-username') || null;
   //var profileRepos = document.querySelector('#profile-repos') || null;
   var displayName = document.querySelector('#display-name');
   var sResultProfile = document.querySelector('#sResultProfile');
   var others = document.querySelector('#others');
   var apiUrl = appUrl + '/api/:id';

   function updateHtmlElement (data, element, userProperty) {
      element.innerHTML = data[userProperty];
   }
   
   function updateIamgoing (data) {
      //console.log(data);
      var myData = JSON.parse(data);
      var urlDir = appUrl.toString().split('://')[1];
      if(myData.businesses.length > 0) sResultProfile.innerHTML = '<h3>I am going to:</h3><br>';
      else sResultProfile.innerHTML = '';
      for(var a = 0; a < myData.businesses.length; a++){
         var category = '';
         for(var b = 0; b < myData.businesses[a].categories.length; b++) category = category + myData.businesses[a].categories[b].title + ', ';
         if(myData.businesses[a].is_closed == false){
            //sResultProfile.innerHTML = sResultProfile.innerHTML + '<li class="list-group-item list-group-item-success">'+myData.businesses[a].name+'<img src='+myData.businesses[a].image_url+' class = "miniimg img-rounded"><h>'+category+' Price: '+myData.businesses[a].price+'<br>OPEN NOW! Reviews: '+myData.businesses[a].review_count+', Rating: '+myData.businesses[a].rating+', Phone: '+myData.businesses[a].display_phone+'</h><br><h>'+myData.businesses[a].location.address1+' '+myData.businesses[a].location.address2+' '+myData.businesses[a].location.address3+' '+myData.businesses[a].location.city+' '+myData.businesses[a].location.state+' '+myData.businesses[a].location.zip_code+'</h></li><br>';
            sResultProfile.innerHTML = sResultProfile.innerHTML + '<li class="list-group-item list-group-item-success"><div class = "textRadio">'+myData.businesses[a].name+'</div><div><img src='+myData.businesses[a].image_url+' class = "miniimg img-rounded"></div><div class = "textInfo"><h>'+category+' Price: '+myData.businesses[a].price+'<br>OPEN NOW! Reviews: '+myData.businesses[a].review_count+', Rating: '+myData.businesses[a].rating+', Phone: '+myData.businesses[a].display_phone+'</h><br><h>'+myData.businesses[a].location.address1+' '+myData.businesses[a].location.address2+' '+myData.businesses[a].location.address3+' '+myData.businesses[a].location.city+' '+myData.businesses[a].location.state+' '+myData.businesses[a].location.zip_code+'</h></div></li><br>';
            var messageText = "I%20Am%20going%20to:%20"+myData.businesses[a].name+"%20Address:%20"+myData.businesses[a].location.address1+' '+myData.businesses[a].location.address2+' '+myData.businesses[a].location.address3+' '+myData.businesses[a].location.city+' '+myData.businesses[a].location.state+' '+myData.businesses[a].location.zip_code+"%20and%20Phone:%20"+myData.businesses[a].display_phone+".";
            sResultProfile.innerHTML = sResultProfile.innerHTML + '<a href="https://twitter.com/intent/tweet?url=https%3A%2F%2F'+urlDir+'&amp;text='+messageText+'" class="btn btn-block shareit-twitter-colors tw-share"><i class="fa fa-twitter"></i> Twitter</a>';
            sResultProfile.innerHTML = sResultProfile.innerHTML + '<a href="https://plus.google.com/share?url=https%3A%2F%2F'+urlDir+'&amp;text='+messageText+'" class="btn btn-block shareit-google-plus-colors tw-share"><i class="fa fa-google-plus"></i> Google+</a>';
            
         } 
      }
   }
   
   function updateOthers (data) {
      console.log(data);
      var myData = JSON.parse(data);
      //var urlDir = appUrl.toString().split('://')[1];
      if(myData.length > 0) others.innerHTML = '<h5>'+(myData.length + 1)+' other persons are going to that place also.</h5><br>';
      else others.innerHTML = '<h5>It look you are the only person going to that place.</h5><br>';
      
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

      /*if (profileRepos !== null) {
         updateHtmlElement(userObject, profileRepos, 'publicRepos');   
      }*/
      
      ajaxFunctions.ajaxRequest('GET', apiUrl+'/iamgoing', updateIamgoing);
      ajaxFunctions.ajaxRequest('GET', apiUrl+'/iamgoingothers', updateOthers);

   }));
   
})();
