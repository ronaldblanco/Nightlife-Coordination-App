'use strict';

(function () {

   var location = document.querySelector('#loca');
   var term = document.querySelector('#term');
   var search = document.querySelector('#search');
   var apiUrl = appUrl + '/api/:id/search';

   function updateSearch (data) {
      console.log(data);
      //var clicksObject = JSON.parse(data);
      //clickNbr.innerHTML = clicksObject.clicks;
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updateSearch));

   search.addEventListener('click', function () {

      ajaxFunctions.ajaxRequest('POST', apiUrl+'/'+location.value+'_'+term.value, function () {
         ajaxFunctions.ajaxRequest('GET', apiUrl, updateSearch);
      });

   }, false);

   /*deleteButton.addEventListener('click', function () {

      ajaxFunctions.ajaxRequest('DELETE', apiUrl, function () {
         ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
      });

   }, false);*/

})();
