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
  if(localStorage.getItem("globalArray") === null) {
    var newArray = [];
    localStorage.setItem("globalArray", JSON.stringify(newArray));
  } else {
    var stateArray = pullGlobalArrayFromLocalStorage();
    for (var i = 0; i < stateArray.length; i++) {
      createBox(stateArray[i]);
    }
  }
}

function Idea(title, body) {
  this.id = generateID(),
  this.title = title,
  this.body = body,
  this.quality = 'swill';

}

function generateID() {
  return Math.random().toString(36).substr(2,16);
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

// SAVE BUTTON EVENT LISTENER
$('.idea-input-save-button').on('click',newIdea)
//creat full new idea and push to ls
function newIdea(e) {
  e.preventDefault();
  var newIdea = new Idea($('.idea-input-title').val(), $('.idea-input-body').val());
  var currentArray = pullGlobalArrayFromLocalStorage();

  createBox(newIdea);
  currentArray.push(newIdea);
  pushGlobalArrayToLocalStorage(currentArray);
  clearInputs();
};
//clear inputs
function clearInputs() {
  $('.idea-input-title').val('');
  $('.idea-input-body').val('');
  $('.idea-input-title').focus();
}

// SEARCH BAR EVENT LISTENER
$('.search-bar-input').on('keyup',searchFunction)
//filter for search
function searchFunction() {
  var currentInputField = $(this).val().toUpperCase();
  var globalArrayPulledFromLocalStorage = pullGlobalArrayFromLocalStorage()
  var matchingIdeas = globalArrayPulledFromLocalStorage.filter(function(element){
  return element.title.toUpperCase().includes(currentInputField) ||
  element.body.toUpperCase().includes(currentInputField)||
  element.quality.toUpperCase().includes(currentInputField);
  })
  createSearchBoxes(matchingIdeas)
}
//display searched ideas function
function createSearchBoxes(matchingIdeas) {
  $('.idea-box').remove();
  matchingIdeas.forEach(function(idea){
    createBox(idea)
  })};

// DELETE BUTTON EVENT LISTENER
$('.bottom').on('click', '.idea-box-delete-button', ideaDelete)
//find idea to delete and update local storage
function ideaDelete(e){
  var globalArrayPulledFromLocalStorage = pullGlobalArrayFromLocalStorage()
  var key = $(this).closest('article').find('.idea-box-id-hidden').text();
  globalArrayPulledFromLocalStorage.forEach(function(idea, index) {
    if (key == idea.id) {
      globalArrayPulledFromLocalStorage.splice(index, 1)
    }})
  pushGlobalArrayToLocalStorage(globalArrayPulledFromLocalStorage)
  remove (e)
};
// remove idea function
function remove (e){
  $(e.target).closest('article').remove();
};

// UPVOTE BUTTON EVENT LISTENER

$('.bottom').on('click','.idea-box-upvote-button', function() {

  var parsedGlobalArray = pullGlobalArrayFromLocalStorage();
  var key = $(this).closest('article').find('.idea-box-id-hidden').text();
  var index = parsedGlobalArray.findIndex(function(object){
    return object.id === key;
  })

  if (parsedGlobalArray[index].quality === 'swill') {
    parsedGlobalArray[index].quality = 'plausible';
    $(this).closest('div').find('span').text('plausible');
    pushGlobalArrayToLocalStorage(parsedGlobalArray);

  } else if (parsedGlobalArray[index].quality === 'plausible'){
      parsedGlobalArray[index].quality = 'genius';
      $(this).closest('div').find('span').text('genius');
      pushGlobalArrayToLocalStorage(parsedGlobalArray);
  }
})

// DOWNVOTE BUTTON EVENT LISTENER
$('.bottom').on('click','.idea-box-downvote-button', function() {
  var parsedGlobalArray = pullGlobalArrayFromLocalStorage();
  var key = $(this).closest('article').find('.idea-box-id-hidden').text();
  var index = parsedGlobalArray.findIndex(function(object){
    return object.id === key;
  })

  if (parsedGlobalArray[index].quality === 'genius') {
    parsedGlobalArray[index].quality = 'plausible';
    $(this).closest('div').find('span').text('plausible');
    pushGlobalArrayToLocalStorage(parsedGlobalArray);
  } else if (parsedGlobalArray[index].quality === 'plausible'){
      parsedGlobalArray[index].quality = 'swill';
      $(this).closest('div').find('span').text('swill');
      pushGlobalArrayToLocalStorage(parsedGlobalArray);
  }
})

//el for idea updates
$('.bottom').on('keyup', '.idea-box-text, .idea-box-header', ideaUpdate)
//function for event listener idea updates
function ideaUpdate (event){
  retrunBtnBlur (event)
  manageFields (event)
}
//return button to blur, not working currently.
function retrunBtnBlur (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    this.blur();
  }}
//logic for card input fields and push array back to storage
function manageFields (e) {
  var parsedGlobalArray = pullGlobalArrayFromLocalStorage()
  var id = $(event.target).closest('.idea-box')[0].id;
  var body = $(event.target).closest('.idea-box').find('.idea-box-text').text();
  var title = $(event.target).closest('.idea-box').find('.idea-box-header').text();
  parsedGlobalArray.forEach(function(card) {
    if (card.id == id) {
      card.body = body;
      card.title = title;
    }
pushGlobalArrayToLocalStorage(parsedGlobalArray)
  })
};
;
//need to change how this works. Can be put into the HTML from my understanding.
function createBox (idea) {
$('.bottom').prepend(`
  <article id="${idea.id}" class="idea-box">
  <p class="idea-box-id-hidden">${idea.id}</p>
  <div class="idea-box-top-line">
    <h2 class="idea-box-header" contenteditable="true">${idea.title}</h2>
    <div class="idea-box-delete-button"></div>
  </div>
  <p class="idea-box-text" contenteditable="true">${idea.body}</p>
  <div class="idea-box-bottom-line">
    <div class="idea-box-upvote-button icon"></div>
    <div class="idea-box-downvote-button icon"></div>
    <p class="idea-box-quality">quality: <span class="idea-box-quality-value">${idea.quality}</span></p>
  </div>
</article>
  `);
}

function pushGlobalArrayToLocalStorage(array) {
  localStorage.setItem('globalArray', JSON.stringify(array));
};

function pullGlobalArrayFromLocalStorage() {
  var globalArrayPulledFromLocalStorage = JSON.parse(localStorage.getItem('globalArray'));
  return globalArrayPulledFromLocalStorage;}
