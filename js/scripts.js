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

// html templates
const criterionHtml = `
  <div class="row criterion z-depth-1" id="criterion-0">
    <div class="input-field col s3" id="domain-0">
      <select id="criterion-type-0">
        <option value="all" selected >Search All</option>
        <option value="location">Location</option>
        <option value="title">Title</title>
        <option value="description">Description</option>
        <option value="keyword">Keyword</option>
        <option value="before">Before Year</option>
        <option value="after">After Year</option>
        <option value="center">Research Center</option>
      </select>
    </div>
    <div class="input-field col s8">
      <input placeholder="Search here..." id="search-0" type="text" class="validate" />
    </div>
    <div class="col s1">
      <a class="clear-criterion"><i class="material-icons md-dark">close</i></a>
    </div>
  </div>
`

// add a seach criterion
function addCriterion(){
  $('#criteria').append(criterionHtml);
  $('select').formSelect();
}

// search the api with the form content
function search() {
  var criteria = $("#criteria").children();
  for (var i = 0; i < criteria.length; i++) {
    r=criteria[i];
  }

  var c = M.FormSelect.getInstance($("#criterion-type-0")).getSelectedValues();// only works with one bar for now
  p = c;

  console.log(criteria);
  L = criteria;
  return false;
}

// setup
$(document).ready(function(){
  // add html
  addCriterion();

  // initializers
  $("#add-criterion").click(addCriterion);
  $("#search-form").submit(search);
});

// starts select options
/*
document.addEventListener('DOMContentLoaded',
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems, []);
});
*/

