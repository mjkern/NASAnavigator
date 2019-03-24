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

function resultsHtml(){
  return `
<ul class="collapsible img-collapse">
  <li>
    <div class="collapsible-header">
      <div class="row img-row">
        <div class="col s4 img-col">
          <img class="img-thumb" data-id="1" src="https://materializecss.com/images/sample-1.jpg">
        </div>
        <div class="col s4 img-col">
          <img class="img-thumb" data-id="a" src="https://materializecss.com/images/sample-1.jpg">
        </div>
        <div class="col s4 img-col">
          <img class="img-thumb" data-id="302" src="https://materializecss.com/images/sample-1.jpg">
        </div>
      </div>
    </div>
    <div class="collapsible-body">
      <div class="row img-details hide" data-id="1">
        <p>First image info goes here</p>
      </div>
      <div class="row img-details hide" data-id="a">
        <p>Image a...</p>
      </div>
      <div class="row img-details hide" data-id="302">
        <p>302 image</p>
      </div>
    </div>
  </li>
</ul>`;
}

var resultRowHtml = `
<li>
  <div class="collapsible-header">
    <div class="row img-row">
    </div>
  </div>
  <div class="collapsible-body">
  </div>
</li>
`;

function imgThumbHtml(src, id, alt) {
  return `
<div class="col s4 img-col">
  <img class="img-thumb" data-id="${id}" src="${src}" alt="${alt}">
</div>`
}

function imgDetailsHtml(data) {
  return `
<div class="row img-details hide" data-id="${data['id']}">
  <div class="col s6">
    <img class="img-full" data-id="${data['id']}" src="${data['src']}" alt="${data['title']}">
  </div>
  <div class="col s6">
    <h3>${data['title'].length < 60 ? data['title'] : ""}</h3>
    <p><b>Location: </b>${data['location']}</p>
    <p><b>Date: </b>${data['date']}</p>
    <p><b>Keywords: </b>${data['keywords']}</p>
    <p>${data['description']}</p>
  </div>
</div>`
}

var myItem;
function displayResults(results) {
  resDiv = $("#results");
  resDiv.empty();
  var items = results.collection.items
  if (items.length > 0){
    resDiv.append('<ul class="collapsible img-collapse"></ul>');
    var collapse = $('.img-collapse');
    for (var i = 0; i < items.length; i++){
      if (i % 4 == 0){
        collapse.append(resultRowHtml);
      }

      myItem=items[i];
      var item = items[i];
      var href = item.links[0].href;
      var data = item.data[0];
      var id = data.nasa_id;
      var title = data.title;

      $('.collapsible-header').last().append(imgThumbHtml(href, id, title));
      details = {
        id: id,
        title: title,
        description: data.description,
        src: href,
        loc: data['location'], // location is a keyword
        date: data.date_created,
        keywords: data.keywords
      }
      $('.collapsible-body').last().append(imgDetailsHtml(details));
    }
    var instances = M.Collapsible.init($('.collapsible'));
    $(".img-thumb").click(showImgDetails);
  }
  else {
    resDiv.append("<p>No results for that :(</p>");
  }
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

var myAttribs;
// show the details for a given image
function showImgDetails(e) {
  myAtribs = e.currentTarget.attributes;
  dataId = e.currentTarget.attributes["data-id"].value;
  $('.img-details').addClass("hide");
  $(`.img-details[data-id=${dataId}]`).removeClass("hide");
}

// setup
$(document).ready(function(){
  // add html
  addCriterion();

  // events
  $("#add-criterion").click(addCriterion);
  $("#search-form").submit(search);

  // initializers
  $('.tabs').tabs();

});

// starts select options
/*
document.addEventListener('DOMContentLoaded',
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems, []);
});
*/

// start tooltips
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.tooltipped');
  var instances = M.Tooltip.init(elems, {enterDelay: 400});
});

/*
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.collapsible');
  var instances = M.Collapsible.init(elems);
});
*/

