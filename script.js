const newBookForm = document.getElementById("entry-form");
const bookContainer = document.querySelector(".container");
const bookTemplate = document.querySelector(".book-template");
const formPopUp = document.getElementById("form-popup");
    
let myLibrary = [];

let bookIdNumbering = 0; 

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;

    // IF pages passed without input, show "0"
    this.pages = pages === "" ? "0" : pages;  

    // IF checkbox is checked set boolean true, otherwise false
    this.read = read === "on" ? true : false;
    
    this.id = ++bookIdNumbering;
}

function openAddBookForm() {
    formPopUp.style.display = "block"; 
}

document.getElementById("open-form").addEventListener("click", openAddBookForm);

function closeAddBookForm() {
    formPopUp.style.display = "none"; 
    newBookForm.reset();
}

document.getElementById("cancel").addEventListener("click", closeAddBookForm);

function addBookToLibrary(bookObj) {
    myLibrary.push(bookObj);
}

newBookForm.addEventListener("submit", function(e){
    // Prevent from submitting the data to server & reload
    e.preventDefault();
    
    // Retrieve the input data from the form 
    const formData = new FormData(e.target);
    
    // Create a new book object from retrieved form data
    const newBook = new Book(formData.get("title"), formData.get("author"), formData.get("pages"), formData.get("read"));
    
    // Push the new book object to an array
    addBookToLibrary(newBook);   
   
    // Display the new book following with the currently displayed books 
    createBookCardFromBookObj(myLibrary[myLibrary.length - 1]);
    
    // Clear the form 
    closeAddBookForm();
})

// UI function get book id data on click 
function getClickedBookID(e) {
    const bookCard = e.target.closest('.book-card');
    if (bookCard){
        const bookID = bookCard.dataset.id;
        console.log('ID of book:', bookID);
        return parseInt(bookID, 10); 
    }
}

function deleteBookFromLibrary(bookID) {  
    // Find the matching title in myLibrary array and remove it
    const indexOfBookToRemove = myLibrary.findIndex(bookObj => bookObj.id === bookID);
    if (indexOfBookToRemove !== -1){
        myLibrary.splice(indexOfBookToRemove, 1);
    }    
}

function deleteBookFromDisplay(bookID){
    const bookCardID = document.querySelector(`.book-card[data-id="${bookID}"]`);
    bookCardID.remove();
}

function handleDeleteClick(e){
    const clickedBookID = getClickedBookID(e);
    deleteBookFromLibrary(clickedBookID);
    deleteBookFromDisplay(clickedBookID);
}

function setReadStatusLabel(isRead, element) {
    if (isRead) {
        element.classList.remove("unread");
        element.classList.add("read");
        element.textContent = "Read";     
    } else {
        element.classList.remove("read");
        element.classList.add("unread");
        element.textContent = "Not Read";
    }
}

function toggleReadStatus(bookID) {
    // Find the matching object in myLibrary array 
    const selectedBookObj = myLibrary.find(bookObj => bookObj.id === bookID);
    if (selectedBookObj) {
        selectedBookObj.read = !selectedBookObj.read;
        console.log(selectedBookObj.read);
        return selectedBookObj.read; 
    }
    return null;
}

function handleReadStatusClick(e){
    const clickedBookID = getClickedBookID(e);
    const isRead = toggleReadStatus(clickedBookID);
    if (typeof isRead === 'boolean') {
        const bookCardID = document.querySelector(`.book-card[data-id="${clickedBookID}"]`);
        const statusLabel = bookCardID.querySelector(".status-label");

        setReadStatusLabel(isRead, statusLabel);
    }
}

// Function that creates a book-card from new book object
function createBookCardFromBookObj(bookObj) {
    // Create a copy of book template
    const clonedBookTemplate = bookTemplate.content.cloneNode(true);
    
    // Create access to all the copied book template elements
    const bookCard = clonedBookTemplate.querySelector(".book-card");
    const bookTitle = clonedBookTemplate.querySelector(".book-title");
    const bookAuthor = clonedBookTemplate.querySelector(".book-author");
    const bookPages = clonedBookTemplate.querySelector(".book-pages");
    const deleteBtn = clonedBookTemplate.querySelector(".delete-btn");
    const statusLabel = clonedBookTemplate.querySelector(".status-label");
    
    // Add content to each copied element
    bookTitle.textContent = bookObj.title;
    bookAuthor.textContent = `by ${bookObj.author}`;
    bookPages.textContent = `${bookObj.pages} pages`;
    bookCard.dataset.id = bookObj.id; 
    
    // Add read status label
    setReadStatusLabel(bookObj.read, statusLabel);
    
    //Add eventListener to read status label for status change later
    statusLabel.addEventListener("click", handleReadStatusClick);

    // Add eventListener that remove the book on click 
    deleteBtn.addEventListener("click", handleDeleteClick);
    
    // Append the filled book-card to book container
    bookContainer.appendChild(clonedBookTemplate);
}