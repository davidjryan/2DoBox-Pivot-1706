/*  ------------------------------------------------------

  ---------------------
  - TABLE OF CONTENTS -
  ---------------------

  - On Page Load
  - Event Listeners
    1. Input Field Event Listener
    2. Button Hover Event Listener
      * Delete
      * Upvote
      * Downvote
    3. Save Button Event Listener
    4. Search Bar Event Listener
    5. Delete Button Event Listener
    6. Upvote Event Listener
    7. Downvote Event Listener
    8. Title Edit Event Listener
    9. Body Edit Event Listener

  - Functions
    * createBox()
    * pushGlobalArrayToLocalStorage()
    * pullGlobalArrayFromLocalStorage()
    * loadSavedIdeas()

*/

// ON PAGE LOAD
$(document).ready(loadEverything);

function loadEverything() {
  if(localStorage.getItem(globalArray) === null) {
    var newArray = [];
    localStorage.setItem(globalArray, JSON.stringify(newArray));
  } else {
    var stateArray = pullGlobalArrayFromLocalStorage();
    for var i = 0; i < stateArray.length; i++) {
      createBox(stateArray[i]);
    }
  }
}

// var globalArray = [];
// pullGlobalArrayFromLocalStorage();
//
// $(function () {
//   loadSavedIdeas();
// });

function Idea() {
  this.id = '',
  this.title = '',
  this.body = '',
  this.quality = 'swill',

  Idea.prototype.generateID = function() {
    this.id = '' + Math.random().toString(36).substr(2,16);
}

// http://www.frontcoded.com/javascript-create-unique-ids.html

/* -------------------
   - EVENT LISTENERS -
   ------------------- */

// INPUT FIELD EVENT LISTENER
  $(".idea-input-title, .idea-input-body").keyup(inputTitleDisabled)

    function inputTitleDisabled() {
  $(".idea-input-save-button").prop("disabled", !this.value);
};

//   $(".idea-input-body").keyup(
//
//     function() {
//   $(".idea-input-save-button").prop("disabled", !this.value);
// });

// BUTTON HOVER EVENT LISTENER

// delete
// $('.bottom').on('mouseover', '.idea-box-delete-button', function() {
//   $(this).prop("src", "images/delete-hover.svg");
// })
//
// $('.bottom').on('mouseleave', '.idea-box-delete-button', function() {
//   $(this).prop("src", "images/delete.svg");
// })

// upvote
// $('.bottom').on('mouseover', '.idea-box-upvote-button', function() {
//   $(this).prop("src", "images/upvote-hover.svg");
// })
//
// $('.bottom').on('mouseleave', '.idea-box-upvote-button', function() {
//   $(this).prop("src", "images/upvote.svg");
// })

// downvote
// $('.bottom').on('mouseover', '.idea-box-downvote-button', function() {
//   $(this).prop("src", "images/downvote-hover.svg");
// })
//
// $('.bottom').on('mouseleave', '.idea-box-downvote-button', function() {
//   $(this).prop("src", "images/downvote.svg");
// })

// SAVE BUTTON EVENT LISTENER
$('.idea-input-save-button').on('click', function(e) {
  e.preventDefault();

  var ideaInputTitle = $('.idea-input-title').val();
  var ideaInputBody = $('.idea-input-body').val();
  var newIdea = new Idea();

  newIdea.generateID();
  newIdea.title = ideaInputTitle;
  newIdea.body = ideaInputBody;

  createBox(newIdea);

  globalArray.push(newIdea);
  window.localStorage.setItem('globalArray', JSON.stringify(globalArray));

  $('.idea-input-title').val('');
  $('.idea-input-body').val('');

  $('.idea-input-title').focus();
});

// SEARCH BAR EVENT LISTENER
$('.search-bar-input').on('keyup',searchFunction)

function searchFunction() {
  var currentInputField = $(this).val().toUpperCase();
  var matchingIdeas = globalArray.filter(function(element){
  return element.title.toUpperCase().includes(currentInputField) ||
  element.body.toUpperCase().includes(currentInputField)||
  element.quality.toUpperCase().includes(currentInputField);
  })
  createSearchBoxes(matchingIdeas)
}

function createSearchBoxes(matchingIdeas) {  $('.idea-box').remove();
  matchingIdeas.forEach(function(idea){
    createBox(idea)});
  }





// DELETE BUTTON EVENT LISTENER
$('.bottom').on('click', '.idea-box-delete-button', function(){

  var globalArrayPulledFromLocalStorage = localStorage.getItem('globalArray');
  var parsedGlobalArray = JSON.parse(globalArrayPulledFromLocalStorage);
  var key = $(this).closest('article').find('.idea-box-id-hidden').text();
  var index = parsedGlobalArray.findIndex(function(element){
    return element.id === key;
  })

  parsedGlobalArray.splice(index, 1);
  globalArray = parsedGlobalArray;
  var stringifiedGlobalArray = JSON.stringify(globalArray);
  localStorage.setItem('globalArray', stringifiedGlobalArray);

  $(this).closest('article').remove();
});

// UPVOTE BUTTON EVENT LISTENER

$('.bottom').on('click','.idea-box-upvote-button', function() {
  var globalArrayPulledFromLocalStorage = localStorage.getItem('globalArray');
  var parsedGlobalArray = JSON.parse(globalArrayPulledFromLocalStorage);
  var key = $(this).closest('article').find('.idea-box-id-hidden').text();
  var index = parsedGlobalArray.findIndex(function(element){
    return element.id === key;
  })

  if (parsedGlobalArray[index].quality === 'swill') {
    parsedGlobalArray[index].quality = 'plausible';
    $(this).closest('div').find('span').text('plausible');
    globalArray = parsedGlobalArray;
    pushGlobalArrayToLocalStorage();

  } else if (parsedGlobalArray[index].quality === 'plausible'){
      parsedGlobalArray[index].quality = 'genius';
      $(this).closest('div').find('span').text('genius');
      globalArray = parsedGlobalArray;
      pushGlobalArrayToLocalStorage();
  }
})

// DOWNVOTE BUTTON EVENT LISTENER
$('.bottom').on('click','.idea-box-downvote-button', function() {
  var globalArrayPulledFromLocalStorage = localStorage.getItem('globalArray');
  var parsedGlobalArray = JSON.parse(globalArrayPulledFromLocalStorage);
  var key = $(this).closest('article').find('.idea-box-id-hidden').text();
  var index = parsedGlobalArray.findIndex(function(element){
    return element.id === key;
  })

  if (parsedGlobalArray[index].quality === 'genius') {
    parsedGlobalArray[index].quality = 'plausible';
    $(this).closest('div').find('span').text('plausible');
    globalArray = parsedGlobalArray;
    pushGlobalArrayToLocalStorage();
  } else if (parsedGlobalArray[index].quality === 'plausible'){
      parsedGlobalArray[index].quality = 'swill';
      $(this).closest('div').find('span').text('swill');
      globalArray = parsedGlobalArray;
      pushGlobalArrayToLocalStorage();
  }
})

// TITLE EDIT EVENT LISTENER
$('.bottom').on('click', '.idea-box-header', function() {
   $(this).prop("contenteditable") === true ? null : $(this).prop("contenteditable", true);

   $(this).on('blur', function() {
      var globalArrayPulledFromLocalStorage = localStorage.getItem('globalArray');
      var parsedGlobalArray = JSON.parse(globalArrayPulledFromLocalStorage);
      var key = $(this).closest('article').find('.idea-box-id-hidden').text();
      var index = parsedGlobalArray.findIndex(function(element){
        return element.id === key;
      })

    parsedGlobalArray[index].title = $(this).text();
    globalArray = parsedGlobalArray;
    pushGlobalArrayToLocalStorage();
  })
})

// BODY EDIT EVENT LISTENER
$('.bottom').on('click', '.idea-box-text', function() {
  ($(this).prop("contenteditable") === true) ? null: $(this).prop("contenteditable", true);

  $(this).on('blur', function() {
   var globalArrayPulledFromLocalStorage = localStorage.getItem('globalArray');
   var parsedGlobalArray = JSON.parse(globalArrayPulledFromLocalStorage);
   var key = $(this).closest('article').find('.idea-box-id-hidden').text();
   var index = parsedGlobalArray.findIndex(function(element){
     return element.id === key;
   })

   parsedGlobalArray[index].body = $(this).text();
   globalArray = parsedGlobalArray;
   pushGlobalArrayToLocalStorage();
 })
})

// FUNCTIONS

function createBox (idea) {
$('.bottom').prepend(`
  <article class="idea-box">
  <p class="idea-box-id-hidden">${idea.id}</p>
  <div class="idea-box-top-line">
    <h2 class="idea-box-header">${idea.title}</h2>
    <div class="idea-box-delete-button"></div>
  </div>
  <p class="idea-box-text">${idea.body}</p>
  <div class="idea-box-bottom-line">
    <div class="idea-box-upvote-button icon"></div>
    <div class="idea-box-downvote-button icon"></div>
    <p class="idea-box-quality">quality: <span class="idea-box-quality-value">${idea.quality}</span></p>
  </div>
</article>
  `);
}

function pushGlobalArrayToLocalStorage() {
  var stringifiedGlobalArray = JSON.stringify(globalArray);
  localStorage.setItem('globalArray', stringifiedGlobalArray);
};

function pullGlobalArrayFromLocalStorage() {
  var globalArrayPulledFromLocalStorage = JSON.parse(localStorage.getItem('globalArray'));
  return globalArrayPulledFromLocalStorage;
}

function loadSavedIdeas (){
  if (localStorage.getItem('globalArray') !== null){

    var globalArrayPulledFromLocalStorage = localStorage.getItem('globalArray');
    var parsedGlobalArray = JSON.parse(globalArrayPulledFromLocalStorage);

    for(var i = 0; i < parsedGlobalArray.length; i++) {
      createBox(parsedGlobalArray[i]);
    }
  }
}
