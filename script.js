const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarkConatiner = document.getElementById('bookmarks-container');

let bookmarks = [];

// Show Modal, Focus on Input
function showModal(){
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// Modal Event Listeners
modalShow.addEventListener('click',showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
// remove form by click out side of it
window.addEventListener('click',(e) => (e.target === modal ? modal.classList.remove('show-modal') : false));


// // validate form
function validate(nameValue, urlValue){
    const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);
    if(!nameValue || !urlValue){
        alert("Please fill all values");
    }
    if(urlValue.match(regex)){
        // alert("match");
    } else if(!urlValue.match(regex)){
        alert('Please provide a valid web address');
        return false;
    }
    return true;
}

// populate the DOM with bookmarks
function buildbookmarks (){
    // Remove all bookmarks elements  
    bookmarkConatiner.textContent = "";
     bookmarks.forEach((bookmark)=>{
        
        const {name, url} = bookmark;
        // Item
        const item = document.createElement('div');
        item.classList.add('item');
        // close icon
        const closeIcon= document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        
        // faicon / link container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        // favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://www.google.com/s2/u/0/favicons?domain=${url}`);
        favicon.setAttribute("alt", 'favicon');
        // link
        const link = document.createElement('a');
        link.setAttribute('href',`${url}`);
        link.setAttribute('target', "_blank");
        link.textContent = name;
        // append to bookmarks container
        linkInfo.append(favicon, link);
        item.append(closeIcon,linkInfo);
        bookmarkConatiner.appendChild(item);
    })
}

function fetchBookMarks(){
    // get booksmarks if availabe
    if(localStorage.getItem("bookmarks")){
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    }else{
        // Create Bookmarks array in localStorage
        bookmarks = [
            {
                name:'Google',
                url: 'https://google.com',
            },
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildbookmarks();
}


// delete Bookmar
function deleteBookmark(url){
    bookmarks.forEach((bookmark,i)=>{
        if(bookmark.url === url){
            bookmarks.splice(i, 1);
        }
    });
    // update bookmark array
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookMarks();

}

// handle data from Form
const storeBookMark=(event)=>{
    event.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if(!urlValue.includes('http://', 'https://')){
        urlValue = `https://${urlValue}`;
    }
    
    if(!validate(nameValue, urlValue)){
        return false;
    }

    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookMarks();
    bookmarkForm.reset();
    websiteNameEl.focus;
}


// Event listner
bookmarkForm.addEventListener("submit", storeBookMark);

// Onload 
fetchBookMarks();