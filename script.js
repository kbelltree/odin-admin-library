const newBookForm = document.getElementById("entry-form");
const bookContainer = document.querySelector(".container");
const bookTemplate = document.querySelector(".book-template");
const formPopUp = document.getElementById("form-popup");
    
// REMOVE: let myLibrary = [{title: "Abcd", author: "lego", pages: "300", read: true}, {title: "Ef Ghi", author: "PoPo", pages: "500", read: true}, {title: "XYZ", author: "Button Head", pages: "200", read: false}];

let myLibrary = [];

// EventListener for the add book button 
function openAddBookForm() {
    formPopUp.style.display = "block"; 
}

// Append the eventListener to add Book button 
document.getElementById("open-form").addEventListener("click", openAddBookForm);

// EventListener for cancel book button 
function closeAddBookForm() {
    formPopUp.style.display = "none"; 
    newBookForm.reset();
}

// Append the eventListener to cancel button 
document.getElementById("cancel").addEventListener("click", closeAddBookForm);


// Constructor function for making “Book” objects
function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;

    // IF pages passed without input, show "0"
    this.pages = pages === "" ? "0" : pages;  

    // IF checkbox is checked set boolean true, otherwise false
    this.read = read === "on" ? true : false;
}


// Add prototype that check read status and change style and text 
Book.prototype.updateStatus = function(element) {
    if (this.read) {
        element.classList.add("read");
        element.textContent = "Read";     
    } else {
        element.classList.add("unread");
        element.textContent = "Unread";
    }
}

// Function that pushes newly created Book object to myLibrary array
function addBookToLibrary(bookObj) {
    myLibrary.push(bookObj);
}

// Function that creates a book-card from new book object
function addBookToDisplay(bookObj) {
        // Create a copy of book template
        const clonedBookTemplate = bookTemplate.content.cloneNode(true);
        
        // Create access to all the copied book template elements
        const bookTitle = clonedBookTemplate.querySelector(".book-title");
        const bookAuthor = clonedBookTemplate.querySelector(".book-author");
        const bookPages = clonedBookTemplate.querySelector(".book-pages");
        const deleteBtn = clonedBookTemplate.querySelector(".delete-btn");
        const statusLabel = clonedBookTemplate.querySelector(".status-label");
        
        // Add content to each copied element
        bookTitle.textContent = bookObj.title;
        bookAuthor.textContent = `by ${bookObj.author}`;
        bookPages.textContent = `${bookObj.pages} pages`;
        
        // Call read status updates method 
        bookObj.updateStatus(statusLabel);
        
        //Add eventListener to read status label for status change later
        statusLabel.addEventListener("click", switchReadStatus);
        
        // Add data attribute matching to book title to delete button
        deleteBtn.dataset.title = bookTitle.textContent; 
        
        // Add eventListener that remove the book on click 
        deleteBtn.addEventListener("click", removeBook);
        
        // Append the filled book-card to book container
        bookContainer.appendChild(clonedBookTemplate);
}

// Append class containing grid layout and style


// Attach an eventListener that fires on submit to the form
newBookForm.addEventListener("submit", function(e){
    // Prevent from submitting the data to server & reload
    e.preventDefault();
    
    // Retrieve the input data from the form 
    const formData = new FormData(e.target);
    
    // REMOVE: console.log(formData);
    
    // Create a new book object from retrieved form data
    const newBook = new Book(formData.get("title"), formData.get("author"), formData.get("pages"), formData.get("read"));
    
    // Push the new book object to an array
    addBookToLibrary(newBook);   
   
    // REMOVE: console.log('newBook: ' + newBook + ' myLibrary: ' + myLibrary); 
    
    // Display the new book following with the currently displayed books 
    addBookToDisplay(newBook);
    
    // Clear the form 
    newBookForm.reset();
})

// EventListener for delete button that removes the book from display and myLibrary array 
function removeBook(e) {
    // Pull the title attribute attached to the button element
    const bookTitle = e.target.dataset.title; 
    const bookSelected = this.parentNode; 
    
    // Find the matching title in myLibrary array and remove it
    let indexOfBookToRemove = myLibrary.findIndex(bookObj => {
            return bookObj.title === bookTitle;
        });

    myLibrary.splice(indexOfBookToRemove, 1);
    
    // Remove the object that contains the button from display 
    bookSelected.remove();
}

// EventListener for read status change button 
function switchReadStatus() {
    // Choose 'this' over 'e.target' to assure the div element is referred
    if (this.textContent === "Read") { 
        this.classList.remove = "read";
        this.classList.add = "unread";
        this.textContent = "Unread";  
    } else {
        this.classList.remove = "unread";
        this.classList.add = "read";
        this.textContent = "Read";
    } 
}



