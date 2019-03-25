
//!!! delete the following function
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


// html templates
// stored in function to allow paramterization
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

function resultRowHtml() {
  return `
<li>
  <div class="collapsible-header">
    <div class="row img-row">
    </div>
  </div>
  <div class="collapsible-body">
  </div>
</li>
`;
}

function imgThumbHtml(src, id, alt) {
  return `
<div class="col s4 img-col">
  <img class="img-thumb" data-id="${id}" src="${src}" alt="${alt}">
</div>`
}

// this includes some template logic to ignore undefined data
// and to properly handle cases where the title and description
// are identical
function imgDetailsHtml(data) {
  console.log(data);
  return `
<div class="row img-details hide" data-id="${data['id']}">
  <div class="col s6">
    <img class="img-full" data-id="${data['id']}" src="${data['src']}" alt="${data['title']}">
  </div>
  <div class="col s6">
    <h3>${data['title'].length < 60 ? data['title'] : ""}</h3>
    ${ data['loc'] ? "<p><b>Location: </b>" + data['loc'] + "</p>" : "" }
    ${ data['date'] ? "<p><b>Date: </b>" + data['date'] + "</p>" : "" }
    <p>${data['title'] == data['description'] && data['title'].length < 60 ? "" : data['description']}</p>
  </div>
</div>`
}

function noResultsHtml(data) {
  return `
<div class="row center">
  <h3>No Results Found :'(</h3>
  <h5>Have you tried simplifying the search criteria?</h5>
</div>`
}

var myItem; //!!! delete this

/* functions for makeing the content work */

// adds content for all the image results
function displayResults(results) {
  resDiv = $("#results");
  resDiv.empty();
  var items = results.collection.items

  // only show content if there is content to show
  if (items.length > 0){

    // all the results will be displayed in a collapsible to show the details
    resDiv.append('<ul class="collapsible img-collapse"></ul>');
    var collapse = $('.img-collapse');

    // put 4 images in each row of the collabpsible
    for (var i = 0; i < items.length; i++){
      if (i % 4 == 0){
        collapse.append(resultRowHtml());
      }

      // extract some relevant data
      myItem=items[i];
      var item = items[i];
      var href = item.links[0].href;
      var data = item.data[0];
      var id = data.nasa_id;
      var title = data.title;

      // and add the image to the collapsible head
      $('.collapsible-header').last().append(imgThumbHtml(href, id, title));

      // make a more robust collection of the image details for the content
      details = {
        id: id,
        title: title,
        description: data.description,
        src: href,
        loc: data['location'], // location is a keyword
        date: data.date_created,
        keywords: data.keywords
      }

      // formate the date better
      if (details['date']){
        details['date'] = (new Date(details['date'])).toDateString();
      }

      // add the details fo the image to the collapsible for the content
      $('.collapsible-body').last().append(imgDetailsHtml(details));
    }

    // and make sure to initialize the new collapsible
    var instances = M.Collapsible.init($('.collapsible'));

    // and show the correct image details when the image is clicked
    $(".img-thumb").click(showImgDetails);
  }
  else {
    // display content if there really are no results
    resDiv.append(noResultsHtml());
  }
}

// show the details for a given image
function showImgDetails(e) {
  // find the unique id for the image that you want to show
  dataId = e.currentTarget.attributes["data-id"].value;

  // clear all the other details
  $('.img-details').addClass("hide");

  // show the details for the correct image
  $(`.img-details[data-id=${dataId}]`).removeClass("hide");
}


/* functions for making the search bar work */

// global vars to keep track of search fields
var numCriteria = 0;
var criterionIds = [];

// criterion clear decorator
// creates a callback to properly clear a specific criterion
function criterionClearer(i){
  return function(){
    // only delete it if there is more than one criteria
    if (criterionIds.length > 1) {
      criterionIds = criterionIds.filter(function(element){return i != element;});
      $(`#criterion-${i}`).remove(); // keep track of which one was deleted
    }
    else {
      // otherwise just clear the text inside it
      $(`#search-${i}`).val("");
    }
  };
}

// adds another input field to the search bar
function addCriterion(){
  // add the htm
  $('#criteria').append(criterionHtml());

  // initialize it properly
  $(`#criterion-type-${numCriteria}`).formSelect();
  $(`#clear-criterion-${numCriteria}`).click(criterionClearer(numCriteria));

  // keep track of the criteria so that we delete and search with the proper ones
  criterionIds.push(numCriteria);
  numCriteria++;
}

// search the api with the criteria in the form
function search() {

  // re-initialize the select menues to make sure they have the proper values
  $('select').formSelect();

  // collect all the criteria into a data object to dearch with
  var criteria = $("#criteria").children();
  var data = { media_type: "image" } // always restrict results to images
  // so find each criteria...
  criterionIds.forEach(function(i) {
    var domain = M.FormSelect.getInstance($(`#criterion-type-${i}`)).getSelectedValues()[0];
    // and append its value to the correct search item
    var value = $(`#search-${i}`).val();
    // if a criteria for this field has already been added then just add it to the existing field
    if (data[domain]) {
      // seperate with commas for keywords, and spaces otherwise
      data[domain] += (domain == 'keywords' ? ',' : ' ') + value;
    }
    else {
      // but if this is the first time for a field then just add it
      data[domain] = value;
    }

    // now actually perform the query and display the results
    $.ajax({
      url: "https://images-api.nasa.gov/search",
      data: data,
      success: displayResults
    });
  });

  // returning false means the form is not submitting anywhere
  // this prevents the page from refreshing and losing the content
  return false;
}


/* initialize everything properly */

// so jquery todos
$(document).ready(function(){
  // add html
  addCriterion();

  // events
  $("#add-criterion").click(addCriterion);
  $("#search-form").submit(search);

});

// and some materialize todos
// start tooltips
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.tooltipped');
  var instances = M.Tooltip.init(elems, {enterDelay: 400});
});

