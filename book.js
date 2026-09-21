const url = "https://jsonplaceholder.typicode.com/posts";

const bookForm = document.getElementById("bookForm");

const bookList = document.getElementById("bookList");

let books = [];

let editingBookId = null;


// ========================================
// READ - GET BOOKS
// ========================================

function getBooks() {

    fetch(url)

        .then((response) => {

            return response.json();

        })

        .then((data) => {

            const realBooks = [

                {
                    title: "The Alchemist",
                    author: "Paulo Coelho",
                    price: 450,
                    category: "Novel"
                },

                {
                    title: "Atomic Habits",
                    author: "James Clear",
                    price: 550,
                    category: "Self Help"
                },

                {
                    title: "Harry Potter and the Philosopher's Stone",
                    author: "J.K. Rowling",
                    price: 600,
                    category: "Fantasy"
                },

                {
                    title: "The Psychology of Money",
                    author: "Morgan Housel",
                    price: 400,
                    category: "Finance"
                },

                {
                    title: "Ikigai",
                    author: "Héctor García and Francesc Miralles",
                    price: 350,
                    category: "Self Help"
                }

            ];


            books = realBooks.map((book, index) => {

                return {

                    id: data[index].id,

                    title: book.title,

                    author: book.author,

                    price: book.price,

                    category: book.category

                };

            });


            displayBooks();

        })


        .catch((error) => {

            console.log("Error:", error);

        });

}


// ========================================
// DISPLAY BOOKS
// ========================================

function displayBooks() {

    bookList.innerHTML = "";


    books.forEach((book) => {

        const row = document.createElement("tr");


        row.innerHTML = `

            <td>${book.id}</td>

            <td>${book.title}</td>

            <td>${book.author}</td>

            <td>₹${book.price}</td>

            <td>${book.category}</td>

            <td>

                <button onclick="editBook(${book.id})">
                    Edit
                </button>

                <button onclick="deleteBook(${book.id})">
                    Delete
                </button>

            </td>

        `;


        bookList.appendChild(row);

    });

}


// ========================================
// CREATE + UPDATE
// ========================================

bookForm.addEventListener("submit", function (event) {

    event.preventDefault();


    // Get form values

    const title =
        document.getElementById("title").value.trim();

    const author =
        document.getElementById("author").value.trim();

    const price =
        document.getElementById("price").value.trim();

    const category =
        document.getElementById("category").value;


    // ========================================
    // VALIDATION
    // ========================================

    if (title === "") {

        alert("Please enter the book title");

        return;

    }


    if (author === "") {

        alert("Please enter the author name");

        return;

    }


    if (price === "") {

        alert("Please enter the price");

        return;

    }


    if (category === "") {

        alert("Please select a category");

        return;

    }


    // ========================================
    // UPDATE BOOK
    // ========================================

    if (editingBookId !== null) {


        const book = books.find((book) => {

            return book.id === editingBookId;

        });


        const updatedBook = {

            title: title,

            body: author,

            price: price,

            category: category

        };


        fetch(`${url}/${editingBookId}`, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(updatedBook)

        })


            .then((response) => {

                return response.json();

            })


            .then((data) => {


                // Update local book

                book.title = title;

                book.author = author;

                book.price = price;

                book.category = category;


                // Display updated books

                displayBooks();


                // Clear form

                bookForm.reset();


                // Exit edit mode

                editingBookId = null;


                // Change button back

                document.getElementById(
                    "submitButton"
                ).textContent = "Add Book";


                // Change heading back

                document.querySelector(
                    ".form-container h2"
                ).textContent = "Add Book";


                alert("Book updated successfully!");

            })


            .catch((error) => {

                console.log("Error:", error);

            });


        return;

    }


    // ========================================
    // CREATE - POST
    // ========================================

    const newBook = {

        title: title,

        body: author,

        price: price,

        category: category

    };


    fetch(url, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(newBook)

    })


        .then((response) => {

            return response.json();

        })


        .then((data) => {


            // Create our own continuous ID

            const newId =

                books.length > 0

                    ? Math.max(
                        ...books.map(
                            (book) => book.id
                        )
                    ) + 1

                    : 1;


            const book = {

                id: newId,

                title: title,

                author: author,

                price: price,

                category: category

            };


            // Add book to array

            books.push(book);


            // Display books

            displayBooks();


            // Clear form

            bookForm.reset();


            alert("Book added successfully!");

        })


        .catch((error) => {

            console.log("Error:", error);

        });

});


// ========================================
// EDIT BOOK
// ========================================

function editBook(id) {


    const book = books.find((book) => {

        return book.id === id;

    });


    if (!book) {

        return;

    }


    // Put existing details into form

    document.getElementById("title").value =
        book.title;


    document.getElementById("author").value =
        book.author;


    document.getElementById("price").value =
        book.price;


    document.getElementById("category").value =
        book.category;


    // Remember which book we are editing

    editingBookId = id;


    // Change button

    document.getElementById(
        "submitButton"
    ).textContent = "Update Book";


    // Change heading

    document.querySelector(
        ".form-container h2"
    ).textContent = "Edit Book";


    // Scroll to form

    document.querySelector(
        ".form-container"
    ).scrollIntoView({
        behavior: "smooth"
    });

}


// ========================================
// DELETE BOOK
// ========================================

function deleteBook(id) {


    fetch(`${url}/${id}`, {

        method: "DELETE"

    })


        .then((response) => {


            if (response.ok) {


                books = books.filter((book) => {

                    return book.id !== id;

                });


                displayBooks();


                alert("Book deleted successfully!");

            }

        })


        .catch((error) => {

            console.log("Error:", error);

        });

}

// ========================================
// SEARCH BOOK BY TITLE
// ========================================

function searchBook() {

    const searchTitle =
        document.getElementById("searchTitle").value.trim();

    const searchResult =
        document.getElementById("searchResult");


    // Empty search
    if (searchTitle === "") {

        searchResult.innerHTML =
            "<p>Please enter a book title</p>";

        return;
    }


    // Find book
    const book = books.find((book) => {

        return book.title.toLowerCase() === searchTitle.toLowerCase();

    });


    // Book not found
    if (!book) {

        searchResult.innerHTML =
            "<p>Book not found</p>";

        return;
    }


    // Display full details
    searchResult.innerHTML = `

        <h3>Book Details</h3>

        <p><strong>ID:</strong> ${book.id}</p>

        <p><strong>Title:</strong> ${book.title}</p>

        <p><strong>Author:</strong> ${book.author}</p>

        <p><strong>Price:</strong> ₹${book.price}</p>

        <p><strong>Category:</strong> ${book.category}</p>

    `;
}


// ========================================
// START APPLICATION
// ========================================

getBooks();
