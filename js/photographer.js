const photographerName = document.getElementById("photographer-name")
const photographerCity = document.getElementById("photographer-city")
const photographerQuote = document.getElementById("photographer-quote")
const photographerTags = document.getElementById("photographer-tags")
const photographerPhoto = document.getElementById("photographer-photo")
const photographerGallery = document.querySelector(".gallery_container")
const sorterOption = document.querySelectorAll(".sorter-wrapper_option")
const statsLikes = document.querySelector('.stats_likes')
const statsPrice = document.querySelector('.stats_price')
const mediaCount = document.getElementById('media-counter')
let pictureArray = []
let sorter = "date"
let tabIndex = 8
let totalLikes = 0


function getJson() {
    return fetch("src/json/data.json")
    .then(response => {
        if(!response.ok) {
            throw new Error("HTTP error" + response.status)
        }
        return response.json();
    })
    .then(json => {
        const data = json
        return data;
    })
    .catch(function () {
        this.dataError = true;
    })
}

// Find which photographer's page the user is on
const queryString = window.location.search

const urlParams = new URLSearchParams(queryString)

const currentPhotographer = urlParams.get("name")

// Populate profile info
async function injectProfileInfo(){
    const json = await getJson()
    for (const photographer of json.photographers) {
        if (photographer.name.replace(/\s+/g, '').toLowerCase() === currentPhotographer) {
            photographerName.innerText = photographer.name
            photographerCity.innerText = photographer.city + ' , ' + photographer.country
            photographerQuote.innerText = photographer.tagline
            photographerPhoto.src = `src/images/photographers/${photographer.name.replace(/\s+/g, '')}.jpg`
            photographerPhoto.alt = photographer.name
            statsPrice.innerText = `${photographer.price} € / jour`
            // Create tags for photographer
            for (const tag of photographer.tags) {
                    const photographerTag = document.createElement("p")
                    photographerTag.classList.add("tag")
                    const tagLabel = document.createElement("span")
                    tagLabel.setAttribute('aria-label',  "tag")
                    tagLabel.textContent = tag
                    tagLabel.classList.add("reader-only")
                    photographerTag.setAttribute('tabindex',  tabIndex)
                    photographerTag.innerText = `#${tag}`
                    photographerTag.appendChild(tagLabel)
                    tabIndex ++
                    photographerTags.appendChild(photographerTag)
            }
        }
    }
    tabIndex = 16               
}


    // Individual block factory
function GalleryBlock(media, name) {
    const firstName = name.lastIndexOf(' ')
    this.name = name.substring(0, firstName)
    this.mediaInfo = {} 
    this.htmlElems = []

    const mediaLikes = function(likes) {
        return {
            elemToCreate: 'p',
            classList: "counter",
            tabIndex: tabIndex + 2,
            content: `${likes} ♥`,
            ariaLabel: 'likes'
        }
    }

    const mediaTitle = function(title) {
        return {
            elemToCreate: 'p',
            classList: "title",
            tabIndex: tabIndex + 1,
            content: title
        }
    }
    
    this.updateMediaInfo = function(media) {
        if (media.image) {
            this.mediaInfo.type = "img"
            this.mediaInfo.src = `src/images/${this.name}/${media.image}`
        } else {
            this.mediaInfo.type = "video"
            this.mediaInfo.src = `src/images/${this.name}/${media.video}`
        }
    }
    
    this.createMediaBlock = function() {
        const mediaBlock = document.createElement(this.mediaInfo.type)
        mediaBlock.src = this.mediaInfo.src
        mediaBlock.tabIndex = tabIndex
        return mediaBlock
    }
    
    this.buildBlock = function(media) {
        const galleryThumbnail = document.createElement("div")
        galleryThumbnail.classList.add("gallery_thumbnail")
    
        this.updateMediaInfo(media)
        const mediaBlock = this.createMediaBlock()
        galleryThumbnail.appendChild(mediaBlock)
        
        const title = new mediaTitle(media.title)
        const likes = new mediaLikes(media.likes)
        this.htmlElems.push(title, likes)
        const textContainer = document.createElement("div")
        textContainer.classList.add("gallery_thumbnail--text-container")

        for (const elem of this.htmlElems) {
            const htmlBlock = document.createElement(elem.elemToCreate)
            htmlBlock.classList.add(`gallery_thumbnail--${elem.classList}`)
            htmlBlock.innerText = elem.content
            htmlBlock.tabIndex = elem.tabIndex
            if (elem.ariaLabel) {
                htmlBlock.setAttribute("aria-label", elem.ariaLabel)
            }
            textContainer.appendChild(htmlBlock)
        }     
        galleryThumbnail.appendChild(textContainer)
        galleryThumbnail.addEventListener("click", lightBoxOpen)
        galleryThumbnail.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                lightBoxOpen(e)
            }
        })
        photographerGallery.appendChild(galleryThumbnail)
        tabIndex += 3
    }
}

function updateLikeCounter() {
    statsLikes.innerText = `${totalLikes} ♥`
}

function toggleLike(e) {
    const currentLikes = parseInt(e.target.innerText.substring(0, e.target.innerText.length - 2))
    let newLikes = 0
    if (!e.target.attributes.isLiked) {
        e.target.attributes.isLiked = true
        newLikes = currentLikes + 1
        totalLikes += 1
    } else {
        e.target.attributes.isLiked = false
        newLikes = currentLikes - 1
        totalLikes -= 1
    }
    e.target.innerText = `${newLikes} ♥`
    updateLikeCounter()
}

let likesAreCounted = false

function buildGallery(array, name) {
    while (photographerGallery.firstChild) {
        photographerGallery.removeChild(photographerGallery.lastChild)
    }
    for (const media of array) {
        const block = new  GalleryBlock(media, name)
        block.buildBlock(media)
        if(!likesAreCounted) {
            totalLikes += media.likes
        }               
    }
    likesAreCounted = true
    tabIndex = 16
    mediaCount.innerText = array.length
    const likeButtons = document.querySelectorAll(".gallery_thumbnail--counter")
    likeButtons.forEach(button => {
        button.addEventListener("click", toggleLike)
        button.addEventListener("keypress", (e) => {
            if (e.keyCode === 32 || e.keyCode === 13) {
                e.preventDefault()
                toggleLike(e)
            } 
        })
    })
    updateLikeCounter()
}

// Sorter

function sorterUpdate(e) {
    if(e.target.classList.contains("sorter-wrapper_option")) {
    const clickedFilter = e.target.attributes.value.value
    sorter = clickedFilter
    createPhotoArray()
    } 
}

function filterEvents() {
    for (const option of sorterOption) {
        option.addEventListener('click', sorterUpdate)
    }
}

function sortArray(array) {
    function compare(a, b) {
        if(a[sorter] > b[sorter]) {
            return -1
        } if (a[sorter] < b[sorter]) {
            return 1
        }
        return 0
    }
    array.sort(compare)
    if (sorter === 'title') {
        array.reverse()
    }
    return array
}            

// Sorter accessiblity
const sorterWrapper = document.querySelector('.sorter-elem')

function closeDropdown() {
    sorterOption[0].parentElement.classList.remove("focus")
    sorterOption[0].removeEventListener("keydown", (e) => {
        if(e.shiftKey && e.keyCode == 9) {
            closeDropdown(e)
            e.target.blur()
            const tags = document.querySelectorAll('.tag')
            const lastTag = tags[tags.length - 1]
            lastTag.focus()
        }
    })
    sorterOption[2].removeEventListener("keydown", (e) => {
        if (e.key === "Tab" || e.keyCode === 27) {
            closeDropdown(e)
            e.target.blur()
        }
    })
}

function filterArrayWithKeyboard(e) {
    switch (e.keyCode) {
    // Enter or spacebar
    case 13:
    case 32:
        if (e.target.classList.contains("sorter-wrapper_option")) {
        e.preventDefault()
        sorterUpdate(e)
        }
    break;
    // Escape
    case 27 :
        closeDropdown(e)
    break;
    } 
}

function accessibleDropdown() {
    sorterOption[0].parentElement.classList.add('focus')
    sorterOption[0].focus()
    sorterOption[0].addEventListener("keydown", (e) => {
        if(e.shiftKey && e.keyCode == 9) {
            closeDropdown(e)
            e.target.blur()
            const tags = document.querySelectorAll('.tag')
            const lastTag = tags[tags.length - 1]
            lastTag.focus()
        }
    })
    sorterOption.forEach(option => {
        option.addEventListener("keydown", filterArrayWithKeyboard)
    })
    sorterOption[2].addEventListener("keydown", (e) => {
        if (e.key === "Tab" || e.keyCode === 27) {
            closeDropdown(e)
            e.target.blur()
        }
    })
    document.addEventListener('keydown', filterArrayWithKeyboard)
} 


sorterWrapper.addEventListener("focus", accessibleDropdown)


async function createPhotoArray(filter) {
    const json = await getJson() 
    for (const photographer of json.photographers) {
        if (photographer.name.replace(/\s+/g, '').toLowerCase() === currentPhotographer) {
            const photographerId = photographer.id
            pictureArray = json.media.filter(obj => obj.photographerId == photographerId)
            const sortedArray = sortArray(pictureArray)
            buildGallery(pictureArray, photographer.name)
        }
    }
}

injectProfileInfo()
createPhotoArray()
filterEvents()

// Modal 

const contactBtn = document.querySelector(".info-block_contact")
const modal = document.querySelector('.modal-background')
const form = document.querySelector('.modal-form')
const formInputs = document.querySelectorAll('.modal-form_input')
const modalCloseBtn = document.querySelector('.close')

function showModal() {
    modal.style.display = "flex"
    document.addEventListener("keydown", escToCloseModal)
}

function hideModal() {
    if (modal.style.display != "none") {
        modal.style.display = "none"
        document.removeEventListener("keydown", escToCloseModal)
    }
}

function escToCloseModal(e) {
    if (e.key === "Escape") {
        hideModal()
    }
}

// Handle form submit
function submitForm (event) {
    event.preventDefault()
    let userInputs = []
    for(const input of formInputs) {
        const key = input.id
        const value = input.value
        const obj  = {}
        obj[key] = value
        userInputs.push(obj)
    }
    console.log(userInputs);
}


contactBtn.addEventListener('click', showModal)
modalCloseBtn.addEventListener('click', hideModal)
form.addEventListener('submit', submitForm)