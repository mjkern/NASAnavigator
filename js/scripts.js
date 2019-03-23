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

// global vars
var numCriteria = 0;
var criterionIds = [];

// html templates
function criterionHtml(){
  return `
  <div class="row criterion z-depth-1" id="criterion-${numCriteria}">
    <div class="input-field col s3" id="domain-${numCriteria}">
      <select id="criterion-type-${numCriteria}">
        <option value="q" selected >Search All</option>
        <option value="location">Location</option>
        <option value="title">Title</title>
        <option value="description">Description</option>
        <option value="keywords">Keyword</option>
        <option value="year_start">Before Year</option>
        <option value="year_end">After Year</option>
      </select>
    </div>
    <div class="input-field col s8">
      <input placeholder="Search here..." id="search-${numCriteria}" type="text" class="validate" />
    </div>
    <div class="col s1">
      <a class="clear-criterion" id="clear-criterion-${numCriteria}"><i class="material-icons md-dark">close</i></a>
    </div>
  </div>
`;
}

// criterion clear decorator
function criterionClearer(i){
  return function(){
    if (criterionIds.length > 1) {
      criterionIds = criterionIds.filter(function(element){return i != element;});
      $(`#criterion-${i}`).remove();
    }
    else {
      $(`#search-${i}`).val("");
    }
  };
}

// add a seach criterion
function addCriterion(){
  $('#criteria').append(criterionHtml());
  $(`#criterion-type-${numCriteria}`).formSelect();
  $(`#clear-criterion-${numCriteria}`).click(criterionClearer(numCriteria));
  criterionIds.push(numCriteria);
  numCriteria++;
}

var myItems;

function displayResults(results) {
  $("#results").empty();
  var items = results.collection.items
  for (var i = 0; i < items.length; i++){
    myItems = items;
    $("#results").append("<p>" + items[i].data[0].title + "</p>");
    /*
    $.ajax({
      url: L[i].href,
      success: function ( photo ) {
        p = photo
        $("#results").append('<img src="' + p[0] + '" />');
      }
    });
    */
  }
}

// search the api with the form content
function search() {
  $('select').formSelect(); // I hate that this works
  var criteria = $("#criteria").children();
  var data = { media_type: "image" } // always restrict results to images
  criterionIds.forEach(function(i) {
    //console.log(M.FormSelect.getInstance(criteria[i].children[0].children[0].children[3]).getSelectedValues());
    var domain = M.FormSelect.getInstance($(`#criterion-type-${i}`)).getSelectedValues()[0];
    var value = $(`#search-${i}`).val();
    if (data[domain]) {
      data[domain] += (domain == 'keywords' ? ',' : ' ') + value;
    }
    else {
      data[domain] = value;
    }


    $.ajax({
      url: "https://images-api.nasa.gov/search",
      data: data,
      success: function(result) {
        displayResults(result);
      }
    });

  });
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

