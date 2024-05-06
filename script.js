const newBookForm = document.getElementById("entry-form");
const bookContainer = document.querySelector(".container");
const bookTemplate = document.querySelector(".book-template");
const formPopUp = document.getElementById("form-popup");
const addNewBookButton = document.getElementById("open-form");
const cancelButton = document.getElementById("cancel");
    
class Book {
    // Public variables 
    static myLibrary = [];
    static bookIdNumbering = 0; 

    constructor(title, author, pages, read) {
        this._title = title;
        this._author = author;
        this.pages = pages; 
        this.read = read; 
        this.id = ++Book.bookIdNumbering; 

        // Add instance to the library at the time instance created
        Book.myLibrary.push(this);
    }
    
    get title() {
        return this._title; 
    }

    get author() {
        return this._author; 
    }

    get pages() {
        return this._pages; 
    }

    get read() {
        return this._read; 
    }

    set pages(value) {
        this._pages = value === "" ? "0" : value; 
    }
    
    set read(value) {
        if (value === "on" || value === true) {
            this._read = true;
        } else if (value === null || value === false) {
            this._read = false;
        }
    }
}

function openAddBookForm() {
    formPopUp.style.display = "block"; 
}

function closeAddBookForm() {
    formPopUp.style.display = "none"; 
    newBookForm.reset();
}

function clearContainerDiv(containerDiv){
    while (containerDiv.firstChild){
        containerDiv.removeChild(containerDiv.firstChild);
    }
};

function reloadLibraryDisplay(){
    clearContainerDiv(bookContainer);
    Book.myLibrary.forEach(book => createBookCardFromBookObj(book));
}

// UI function get book id data on click 
function getClickedBookID(e) {
    const bookCard = e.target.closest('.book-card');
    if (bookCard){
        const bookID = bookCard.dataset.id;
        return parseInt(bookID, 10); 
    }
}

function deleteBookFromLibrary(bookID) {  
    const indexOfBookToRemove = Book.myLibrary.findIndex(bookObj => bookObj.id === bookID);
    if (indexOfBookToRemove !== -1){
        Book.myLibrary.splice(indexOfBookToRemove, 1);
    } else {
        console.warn(`No matching bookID found: ${bookID}`);
        return;
    }  
}

function handleDeleteClick(e){
   deleteBookFromLibrary(getClickedBookID(e));

   // Refresh browser with updated myLibrary
   reloadLibraryDisplay();
}

function toggleReadStatus(bookID) {
    // Find the matching object in myLibrary array 
    const selectedBookObj = Book.myLibrary.find(bookObj => bookObj.id === bookID);
    if (selectedBookObj) {
        selectedBookObj.read = !selectedBookObj.read
        return selectedBookObj.read; 
    } else {
        return null;
    }   
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

function handleReadStatusClick(e){
    const clickedBookID = getClickedBookID(e);
    const isRead = toggleReadStatus(clickedBookID);
    if (typeof isRead === 'boolean') {
        reloadLibraryDisplay();
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

addNewBookButton.addEventListener("click", openAddBookForm);

cancelButton.addEventListener("click", closeAddBookForm);

newBookForm.addEventListener("submit", function(e){
    // Prevent from submitting the data to server & reload
    e.preventDefault();
    
    // Retrieve the input data from the form 
    const formData = new FormData(e.target);
    
    // Create a new book object from retrieved form data
    new Book(formData.get("title"), formData.get("author"), formData.get("pages"), formData.get("read"));
    
    // Clear the form 
    closeAddBookForm();

    // Refresh browser with updated myLibrary
    reloadLibraryDisplay();
})