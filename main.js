// Do your work here...
console.log('Hello, world!');

const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "STORAGE_KEY";

function generateId() {
    return +new Date();
};

function generateBookObject(id, title, author, bookYear, isCompleted) {
    return {
        id,
        title,
        author,
        bookYear,
        isCompleted
    };
};

/**
 * Fungsi ini digunakan untuk memeriksa apakah localStorage didukung oleh browser atau tidak
 */
function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
  };


/**
 * Fungsi ini digunakan untuk menyimpan data ke localStorage
 * berdasarkan KEY yang sudah ditetapkan sebelumnya.
 */
function saveData() {
    if (isStorageExist()) {
      const parsed /* string */ = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  };


  /**
 * Fungsi ini digunakan untuk memuat data dari localStorage
 * Dan memasukkan data hasil parsing ke variabel
 */
function loadDataFromStorage() {
    const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
  
    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }
  
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function makeBook(bookObject) {

    const {id, task, timestamp, isCompleted} = bookObject;
  
    const textTitle = document.createElement('h2');
    textTitle.innerText = task;
  
    const textTimestamp = document.createElement('p');
    textTimestamp.innerText = timestamp;
  
    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textTimestamp);
  
    const container = document.createElement('div');
    container.classList.add('item', 'shadow')
    container.append(textContainer);
    container.setAttribute('id', `todo-${id}`);
  
    if (isCompleted) {
  
      const undoButton = document.createElement('button');
      undoButton.classList.add('undo-button');
      undoButton.addEventListener('click', function () {
        undoTaskFromCompleted(id);
      });
  
      const trashButton = document.createElement('button');
      trashButton.classList.add('trash-button');
      trashButton.addEventListener('click', function () {
        removeTaskFromCompleted(id);
      });
  
      container.append(undoButton, trashButton);
    } else {
  
      const checkButton = document.createElement('button');
      checkButton.classList.add('check-button');
      checkButton.addEventListener('click', function () {
        addTaskToCompleted(id);
      });
  
      container.append(checkButton);
    }
  
    return container;
  }


  function addBook() {
    const textTodo = document.getElementById('title').value;
    const timestamp = document.getElementById('date').value;
  
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, textTodo, timestamp, false);
    todos.push(bookObject);
  
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
  
  function addTaskToCompleted(todoId /* HTMLELement */) {
    const todoTarget = findTodo(todoId);
  
    if (todoTarget == null) return;
  
    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
  
  function removeTaskFromCompleted(todoId /* HTMLELement */) {
    const todoTarget = findTodoIndex(todoId);
  
    if (todoTarget === -1) return;
  
    todos.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
  
  function undoTaskFromCompleted(todoId /* HTMLELement */) {
  
    const todoTarget = findTodo(todoId);
    if (todoTarget == null) return;
  
    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
  
  document.addEventListener('DOMContentLoaded', function () {
  
    const submitForm /* HTMLFormElement */ = document.getElementById('form');
  
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    });
  
    if (isStorageExist()) {
      loadDataFromStorage();
    }
  });
  
  document.addEventListener(SAVED_EVENT, () => {
    console.log('Data berhasil di simpan.');
  });
  
  document.addEventListener(RENDER_EVENT, function () {
    const uncompletedTODOList = document.getElementById('todos');
    const listCompleted = document.getElementById('completed-todos');
  
    // clearing list item
    uncompletedTODOList.innerHTML = '';
    listCompleted.innerHTML = '';
  
    for (const todoItem of todos) {
      const todoElement = makeBook(todoItem);
      if (todoItem.isCompleted) {
        listCompleted.append(todoElement);
      } else {
        uncompletedTODOList.append(todoElement);
      }
    }
  });


// ================================================

// console.log("Hello, world!");

// let books = [];
// const STORAGE_KEY = "STORAGE_KEY";

// function loadDataFromStorage() {
//   const serializedData = localStorage.getItem(STORAGE_KEY);
//   let data = JSON.parse(serializedData);

//   if (data !== null) {
//     books = data.map((book) => ({ 
//       year: parseInt(book.year),
//     }));
//   }

//   document.dispatchEvent(new Event("load"));
//   document.addEventListener("DOMContentLoaded", function () { 
//     if (isStorageExist()) {
//       loadDataFromStorage();
//     }
//   });
// }

// function saveToLocalStorage() {
//   localStorage.setItem("STORAGE_KEY", JSON.stringify(books));
// }

// function renderBooks() {
//   incompleteBookList.innerHTML = "";
//   completeBookList.innerHTML = "";

//   books.forEach((book) => {
//     const bookElement = document.createElement("div");
//     bookElement.setAttribute("data-bookid", book.id);
//     bookElement.setAttribute("data-testid", "bookItem");

//     bookElement.innerHTML = `
//         <h3 data-testid="bookItemTitle">${book.title}</h3>
//         <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
//         <p data-testid="bookItemYear">Tahun: ${book.year}</p>
//         <div>
//         <button data-testid="bookItemIsCompleteButton">${
//             book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"
//             }</button>
//         <button data-testid="bookItemDeleteButton">Hapus Buku</button>
//         <button data-testid="bookItemEditButton">Edit Buku</button>
//         </div>
//     `;

//     bookElement
//       .querySelector("[data-testid='bookItemIsCompleteButton']")
//       .addEventListener("click", () => {
//         book.isComplete = !book.isComplete;
//         saveToLocalStorage();
//         renderBooks();
//       });
//     bookElement
//       .querySelector("[data-testid='bookItemDeleteButton']")
//       .addEventListener("click", () => {
//         books = books.filter((b) => b.id !== book.id);
//         saveToLocalStorage();
//         loadDataFromStorage();
//       });
//     bookElement
//       .querySelector("[data-testid='bookItemEditButton']")
//       .addEventListener("click", () => {
//         const newTitle = prompt("Edit Judul Buku:", book.title) || book.title;
//         const newAuthor =
//           prompt("Edit Penulis Buku:", book.author) || book.author;
//         const newYear = prompt("Edit Tahun Buku:", book.year) || book.year;

//         books = books.map((b) => {
//           if (b.id === book.id) {
//             return {
//               ...b,
//               title: newTitle,
//               author: newAuthor,
//               year: newYear,
//             };
//           }
//           return b;
//         });

//         saveToLocalStorage();
//         loadDataFromStorage();
//       });

//     if (book.isComplete) {
//       completeBookList.appendChild(bookElement);
//     } else {
//       incompleteBookList.appendChild(bookElement);
//     }
//   });
// }

// document.addEventListener("DOMContentLoaded", () => {
//   loadDataFromStorage();
//   const bookForm = document.getElementById("bookForm");
//   const incompleteBookList = document.getElementById("incompleteBookList");
//   const completeBookList = document.getElementById("completeBookList");
//   const searchForm = document.getElementById("searchBook");
//   const searchTitleInput = document.getElementById("searchBookTitle");

//   document.addEventListener("load", () => {
//     renderBooks();
//   });

//   document
//     .getElementById("bookForm")
//     .addEventListener("submit", function (event) {
//       event.preventDefault();

//       const title = document.getElementById("bookFormTitle").value;
//       const author = document.getElementById("bookFormAuthor").value;
//       const year = parseInt(document.getElementById("bookFormYear").value);
//       const isComplete = document.getElementById("bookFormIsComplete").checked;

//       if (isNaN(year)) {
//         alert("Year harus berupa angka!");
//         return;
//       }

//       const book = {
//         id: +new Date(),
//         title: title,
//         author: author,
//         year: parseInt(year),
//         isComplete: isComplete,
//       };

//       saveBookToLocalStorage(book);
//       loadDataFromStorage();
//     });

//   function saveBookToLocalStorage(book) {
//     books.push(book);
//     localStorage.setItem("books", JSON.stringify(books));
//   }

//   searchForm.addEventListener("submit", (e) => {
//     e.preventDefault();
//     const searchQuery = searchTitleInput.value.trim().toLowerCase();

//     const allBooks = document.querySelectorAll("[data-testid='bookItem']");
//     allBooks.forEach((bookElement) => {
//       const bookTitle = bookElement
//         .querySelector("[data-testid='bookItemTitle']")
//         .textContent.toLowerCase();
//       if (bookTitle.includes(searchQuery)) {
//         bookElement.style.display = "block";
//       } else {
//         bookElement.style.display = "none";
//       }
//     });
//   });

//   loadDataFromStorage();
// });