//window.onload = function(){alert("js is working")};


// the following code from http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

function searchapi(){
  //let y = document.forms['search-form']["search"].value;
  let y = $('#search').val();
  //let x = document.forms["search-form"]["search"].value;
  console.log("the value is:");
  console.log(y);
  //colsole.log(x);
  return false;
}
/*
function validateContact() {
  // make sure sip code is a five digit number
  var code = $("#zip-code").val();
  if (code.length != 0 && (code.length != 5 || isNaN(code))){
    alert("Zip Code must be a five digit number. Please change and resubmit.")
    return false;
  }

  return true;
}*/

var r;
var L;
var p;

function test() {
  var query = $("#search").val();
  console.log("you just searched for");
  console.log(query);

  $.ajax({
    url: "https://images-api.nasa.gov/search",
    data: {
      q: query,
      media_type: "image"
    },
    success: function( result ) {
      r = result;
      L = r.valueOf().collection.items
      for (var i = 0; i < L.length; i++){
        $("#results").append("<p>" + L[i].data[0].title + "</p>");
        $.ajax({
          url: L[i].href,
          success: function ( photo ) {
            p = photo
            $("#results").append('<img src="' + p[0] + '" />');
          }
        });
      }
      $("#results").append("<p>out of loop</p>");
    }
  });

  return false;
}

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems, []);
});

/*
$(document).ready(function(){
  $('select').formSelect();
});
*/
