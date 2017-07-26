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
    * loadSavedtodos()

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

function todo(title, body) {
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
  $(".todo-input-title, .todo-input-body").keyup(inputTitleDisabled)

    function inputTitleDisabled() {
  $(".todo-input-save-button").prop("disabled", !this.value);
};

// SAVE BUTTON EVENT LISTENER
$('.todo-input-save-button').on('click',newtodo)
//creat full new todo and push to ls
function newtodo(e) {
  e.preventDefault();
  var newtodo = new todo($('.todo-input-title').val(), $('.todo-input-body').val());
  var currentArray = pullGlobalArrayFromLocalStorage();

  createBox(newtodo);
  currentArray.push(newtodo);
  pushGlobalArrayToLocalStorage(currentArray);
  clearInputs();
};
//clear inputs
function clearInputs() {
  $('.todo-input-title').val('');
  $('.todo-input-body').val('');
  $('.todo-input-title').focus();
}

// SEARCH BAR EVENT LISTENER
$('.search-bar-input').on('keyup',searchFunction)
//filter for search
function searchFunction() {
  var currentInputField = $(this).val().toUpperCase();
  var globalArrayPulledFromLocalStorage = pullGlobalArrayFromLocalStorage()
  var matchingtodos = globalArrayPulledFromLocalStorage.filter(function(element){
  return element.title.toUpperCase().includes(currentInputField) ||
  element.body.toUpperCase().includes(currentInputField)||
  element.quality.toUpperCase().includes(currentInputField);
  })
  createSearchBoxes(matchingtodos)
}
//display searched todos function
function createSearchBoxes(matchingtodos) {
  $('.todo-box').remove();
  matchingtodos.forEach(function(todo){
    createBox(todo)
  })};

// DELETE BUTTON EVENT LISTENER
$('.bottom').on('click', '.todo-box-delete-button', todoDelete)
//find todo to delete and update local storage
function todoDelete(e){
  var globalArrayPulledFromLocalStorage = pullGlobalArrayFromLocalStorage()
  var key = $(this).closest('article').find('.todo-box-id-hidden').text();
  globalArrayPulledFromLocalStorage.forEach(function(todo, index) {
    if (key == todo.id) {
      globalArrayPulledFromLocalStorage.splice(index, 1)
    }})
  pushGlobalArrayToLocalStorage(globalArrayPulledFromLocalStorage)
  remove (e)
};
// remove todo function
function remove (e){
  $(e.target).closest('article').remove();
};

// UPVOTE BUTTON EVENT LISTENER

$('.bottom').on('click','.todo-box-upvote-button', function() {

  var parsedGlobalArray = pullGlobalArrayFromLocalStorage();
  var key = $(this).closest('article').find('.todo-box-id-hidden').text();
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
$('.bottom').on('click','.todo-box-downvote-button', function() {
  var parsedGlobalArray = pullGlobalArrayFromLocalStorage();
  var key = $(this).closest('article').find('.todo-box-id-hidden').text();
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

//el for todo updates
$('.bottom').on('keyup', '.todo-box-text, .todo-box-header', todoUpdate)
//function for event listener todo updates
function todoUpdate (event){
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
  var id = $(event.target).closest('.todo-box')[0].id;
  var body = $(event.target).closest('.todo-box').find('.todo-box-text').text();
  var title = $(event.target).closest('.todo-box').find('.todo-box-header').text();
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
function createBox (todo) {
$('.bottom').prepend(`
  <article id="${todo.id}" class="todo-box">
  <p class="todo-box-id-hidden">${todo.id}</p>
  <div class="todo-box-top-line">
    <h2 class="todo-box-header" contenteditable="true">${todo.title}</h2>
    <div class="todo-box-delete-button"></div>
  </div>
  <p class="todo-box-text" contenteditable="true">${todo.body}</p>
  <div class="todo-box-bottom-line">
    <div class="todo-box-upvote-button icon"></div>
    <div class="todo-box-downvote-button icon"></div>
    <p class="todo-box-quality">quality: <span class="todo-box-quality-value">${todo.quality}</span></p>
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
