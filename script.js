
$(".todo-input-title, .todo-input-body").keyup(enableButton)
$('.todo-input-save-button').on('click',newtodo)
$('.search-bar-input').on('keyup',searchFunction)
$('.middle').on('click', '.critical-btn, .high-btn, .normal-btn, .low-btn, .none-btn', filterBtns)
$('.bottom').on('click', '.todo-box-delete-button', todoDelete)
$('.bottom').on('click','.todo-box-upvote-button', upVote)
$('.bottom').on('click','.todo-box-downvote-button', downVote)
$('.bottom').on('keyup', '.todo-box-text, .todo-box-header', manageFields)
$('.bottom').on('click', '.completed-text', toggleCompleted)
$('.showtodo').on('click', filterCompleted)

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
    for (var i = notCompleted.length - 1; i > notCompleted.length - 10; i--) {
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


function enableButton(){
  if ($('.todo-input-title').val() !== '' &&
  $('.todo-input-body').val() !== '' ){
    $('.todo-input-save-button').attr('disabled', false)
   }else {$('.todo-input-save-button').attr('disabled', true)}
}

// SAVE BUTTON EVENT LISTENER

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
    createBox(todo)
  })};

  //filter by inportance buttons

function filterBtns (event){
  event.preventDefault()
  const parsedGlobalArray = pullGlobalArrayFromLocalStorage()
  const importance = $(event.target).text()
  const matchingTodos = parsedGlobalArray.filter(function(element){
  return element.quality.includes(importance)
});

  createfilterBoxes(matchingTodos)
}

// DELETE BUTTON EVENT LISTENER
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

function upVote() {
  const importanceInput = $(event.target).closest('.todo-box').find('.todo-box-quality-value');
  const importanceArray = ['None', 'Low', 'Normal', 'High', 'Critical']
  const currentIndex = importanceArray.indexOf(importanceInput.text())
  const newQuality = importanceArray[currentIndex + 1];
  importanceInput.text(newQuality);
  updateArray(newQuality)
}

function downVote() {
  const importanceInput = $(event.target).closest('.todo-box').find('.todo-box-quality-value');
  const importanceArray = ['None', 'Low', 'Normal', 'High', 'Critical']
  const  currentIndex = importanceArray.indexOf(importanceInput.text())
  const newQuality = importanceArray[currentIndex - 1];
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

function createBox (todo) {
  $('.bottom').prepend(`
  <article id="${todo.id}" class="todo-box ${todo.completed}">
    <p class="todo-box-id-hidden">${todo.id}</p>
    <div class="todo-box-top-line">
      <h2 class="todo-box-header" tabindex="0" contenteditable="true">${todo.title}</h2>
      <div class="todo-box-delete-button" tabindex="0"></div>
    </div>
    <p class="todo-box-text" tabindex="0" contenteditable="true">${todo.body}</p>
    <div class="todo-box-bottom-line">
      <div class="todo-box-upvote-button icon" tabindex="0"></div>
      <div class="todo-box-downvote-button icon" tabindex="0"></div>
      <p class="todo-box-quality">quality: <span class="todo-box-quality-value">${todo.quality}</span></p><button class="completed-text" tabindex="0">Completed</button>
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
  pushGlobalArrayToLocalStorage(currentArray);
}

function filterCompleted() {
  event.preventDefault()
  const stateArray = pullGlobalArrayFromLocalStorage();
  const completed = stateArray.filter(function(element){
    return element.completed
})
  for (var i = 0; i < 10; i++) {
    createBox(completed[i]);
    enableButton();
  }
}

$('.bottom').on('click', '.show-more',showAll)

function showAll (e) {
  e.preventDefault()
  const array = pullGlobalArrayFromLocalStorage()
  $('.todo-box').remove();
  array.forEach(function (todo) {
  createBoxBottom (todo)
  hidden (e)
  })
}

function hidden (e){
  $(e.target).toggleClass('visability', true)
}

function createBoxBottom (todo) {
$('.bottom').append(`
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
