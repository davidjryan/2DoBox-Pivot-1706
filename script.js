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
    4. filter Bar Event Listener
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
    const newArray = [];
    localStorage.setItem("globalArray", JSON.stringify(newArray));
  } else {
    const stateArray = pullGlobalArrayFromLocalStorage();
    const notCompleted = stateArray.filter(function(element){
      return !element.completed
  })
    for (var i = 0; i < notCompleted.length; i++) {
      createBox(notCompleted[i]);
      enableButton();
    }
  }
}

function todo(title, body) {
  this.id = generateID(),
  this.title = title,
  this.body = body,
  this.quality = 'None',
  this.completed = ""

}

function generateID() {
  return Math.random().toString(36).substr(2,16);
}
// http://www.frontcoded.com/javascript-create-unique-ids.html

/* -------------------
   - EVENT LISTENERS -
   ------------------- */

// INPUT FIELD EVENT LISTENER
  $(".todo-input-title, .todo-input-body").keyup(enableButton)

function enableButton(){
  if ($('.todo-input-title').val() !== '' &&
  $('.todo-input-body').val() !== '' ){
    $('.todo-input-save-button').attr('disabled', false)
   }else {$('.todo-input-save-button').attr('disabled', true)}
}

// SAVE BUTTON EVENT LISTENER
$('.todo-input-save-button').on('click',newtodo)
//creat full new todo and push to ls
function newtodo(e) {
  e.preventDefault();

  const newtodo = new todo($('.todo-input-title').val(), $('.todo-input-body').val());
  const currentArray = pullGlobalArrayFromLocalStorage();

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
  enableButton();
}

// SEARCH BAR EVENT LISTENER
$('.search-bar-input').on('keyup',searchFunction)
//filter for search
function searchFunction() {

  const currentInputField = $(this).val().toUpperCase();
  const globalArrayPulledFromLocalStorage = pullGlobalArrayFromLocalStorage()
  const matchingTodos = globalArrayPulledFromLocalStorage.filter(function(element){

  return element.title.toUpperCase().includes(currentInputField) ||
  element.body.toUpperCase().includes(currentInputField)||
  element.quality.toUpperCase().includes(currentInputField);
  })
  createfilterBoxes(matchingTodos)
}
//display filtered todos function
function createfilterBoxes(matchingTodos) {
  $('.todo-box').remove();
  matchingTodos.forEach(function(todo){
    console.log(todo)
    createBox(todo)
  })};

  //filter by inportance buttons
  $('.middle').on('click', '.critical-btn, .high-btn, .normal-btn, .low-btn, .none-btn', filterBtns)

function filterBtns (event){
  event.preventDefault()
  const parsedGlobalArray = pullGlobalArrayFromLocalStorage()
  const importance = $(event.target).text()
  console.log(importance)
  const matchingTodos = parsedGlobalArray.filter(function(element){
  return element.quality.includes(importance)
  });
    console.log(matchingTodos)

  createfilterBoxes(matchingTodos)
}

// DELETE BUTTON EVENT LISTENER

$('.bottom').on('click', '.todo-box-delete-button', todoDelete)
//find todo to delete and update local storage
function todoDelete(e){
  const globalArrayPulledFromLocalStorage = pullGlobalArrayFromLocalStorage()
  const key = $(this).closest('article').find('.todo-box-id-hidden').text();
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

$('.bottom').on('click','.todo-box-upvote-button', upVote)

function upVote() {
  const importanceInput = $(event.target).closest('.todo-box').find('.todo-box-quality-value');
  const importanceArray = ['None', 'Low', 'Normal', 'High', 'Critical']
  const currentIndex = importanceArray.indexOf(importanceInput.text())
  const newQuality = importanceArray[currentIndex + 1];
  importanceInput.text(newQuality);
  updateArray(newQuality)
}

$('.bottom').on('click','.todo-box-downvote-button', downVote)

function downVote() {
  const importanceInput = $(event.target).closest('.todo-box').find('.todo-box-quality-value');
  const importanceArray = ['None', 'Low', 'Normal', 'High', 'Critical']
  const  currentIndex = importanceArray.indexOf(importanceInput.text())
  const newQuality = importanceArray[currentIndex - 1];
  console.log(newQuality)
  importanceInput.text(newQuality);
  updateArray(newQuality)
}

function updateArray(newQuality){
  const storageArray = pullGlobalArrayFromLocalStorage()
  const id = $(event.target).closest('.todo-box')[0].id;
  storageArray.forEach(function(card){
    if ( id == card.id){
      card.quality = newQuality;
    }
  })
  pushGlobalArrayToLocalStorage(storageArray)
}



// $('.bottom').on('click','.todo-box-upvote-button', function() {
//
//   const parsedGlobalArray = pullGlobalArrayFromLocalStorage();
//   const key = $(this).closest('article').find('.todo-box-id-hidden').text();
//   const index = parsedGlobalArray.findIndex(function(object){
//
//     return object.id === key;
//   })
//
//   if (parsedGlobalArray[index].quality === 'None') {
//     parsedGlobalArray[index].quality = 'Normal';
//     $(this).closest('div').find('span').text('Critical');
//     pushGlobalArrayToLocalStorage(parsedGlobalArray);
//
//   } else if (parsedGlobalArray[index].quality === 'Normal'){
//       parsedGlobalArray[index].quality = 'Critical';
//       $(this).closest('div').find('span').text('Critical');
//       pushGlobalArrayToLocalStorage(parsedGlobalArray);
//   }
// })

// DOWNVOTE BUTTON EVENT LISTENER

// $('.bottom').on('click','.todo-box-downvote-button', function() {
//   const parsedGlobalArray = pullGlobalArrayFromLocalStorage();
//   const key = $(this).closest('article').find('.todo-box-id-hidden').text();
//   const index = parsedGlobalArray.findIndex(function(object){
//
//     return object.id === key;
//   })
//
//   if (parsedGlobalArray[index].quality === 'Critical') {
//     parsedGlobalArray[index].quality = 'Normal';
//     $(this).closest('div').find('span').text('Normal');
//     pushGlobalArrayToLocalStorage(parsedGlobalArray);
//   } else if (parsedGlobalArray[index].quality === 'Normal'){
//       parsedGlobalArray[index].quality = 'None';
//       $(this).closest('div').find('span').text('None');
//       pushGlobalArrayToLocalStorage(parsedGlobalArray);
//   }
// })


//el for todo updates
$('.bottom').on('keyup', '.todo-box-text, .todo-box-header', manageFields)
//function for event listener todo updates
// function todoUpdate (event){
//   retrunBtnBlur (event)
//   manageFields (event)
// }
//return button to blur, not working currently.
function retrunBtnBlur (event) {
  if (event.which === 13) {
    event.target.blur();
  }}
//logic for card input fields and push array back to storage
function manageFields (event) {
  const parsedGlobalArray = pullGlobalArrayFromLocalStorage()
  const id = $(event.target).closest('.todo-box')[0].id;
  const body = $(event.target).closest('.todo-box').find('.todo-box-text').text();
  const title = $(event.target).closest('.todo-box').find('.todo-box-header').text();
  retrunBtnBlur (event)
  parsedGlobalArray.forEach(function(card) {
    if (card.id == id) {
      card.body = body;
      card.title = title;
    }
pushGlobalArrayToLocalStorage(parsedGlobalArray)
  })
};


// function createBox (todo) {
//   $template = $('#hidden-template').clone()
//   console.log($template)
//   $template.attr('id', todo.id)
//   $template.find('.todo-box-id-hidden').text(todo.id)
//   $template.find('.todo-box-header').text(todo.title)
//   $template.find('.todo-box-text').text(todo.body)
//   $template.find('.todo-box-quality-value').text(todo.quality)
//   $('.bottom').prepend($template);
// }

function createBox (todo) {
$('.bottom').prepend(`
  <article id="${todo.id}" class="todo-box ${todo.completed}">
  <p class="todo-box-id-hidden">${todo.id}</p>
  <div class="todo-box-top-line">
    <h2 class="todo-box-header" contenteditable="true">${todo.title}</h2>
    <div class="todo-box-delete-button"></div>
  </div>
  <p class="todo-box-text" contenteditable="true">${todo.body}</p>
  <div class="todo-box-bottom-line">
    <div class="todo-box-upvote-button icon"></div>
    <div class="todo-box-downvote-button icon"></div>
    <p class="todo-box-quality">quality: <span class="todo-box-quality-value">${todo.quality}</span></p><button class="completed-text">Completed</button>
  </div>
</article>
  `);
}

function pushGlobalArrayToLocalStorage(array) {
  localStorage.setItem('globalArray', JSON.stringify(array));
};

function pullGlobalArrayFromLocalStorage() {
  const globalArrayPulledFromLocalStorage = JSON.parse(localStorage.getItem('globalArray'));
  return globalArrayPulledFromLocalStorage;
}

$('.bottom').on('click', '.completed-text', toggleCompleted)

function toggleCompleted() {
  $(this).closest('article').toggleClass('completed');
  const domID = $(this).closest('article').prop('id')
  const currentArray = pullGlobalArrayFromLocalStorage();

  const currentIndex = currentArray.findIndex(function(object) {
    return object.id === domID;
  })

  if (!currentArray[currentIndex].completed) {
    currentArray[currentIndex].completed = "completed"
  } else {
    currentArray[currentIndex].completed = ""
  }
  console.log(currentArray[currentIndex])
  pushGlobalArrayToLocalStorage(currentArray);

}

$('.showtodo').on('click', filterCompleted)

function filterCompleted() {
  event.preventDefault()
  const stateArray = pullGlobalArrayFromLocalStorage();
  const completed = stateArray.filter(function(element){
    return element.completed
})
  for (var i = 0; i < completed.length; i++) {
    createBox(completed[i]);
    enableButton();
  }
}
