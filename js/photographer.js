const photographerName = document.getElementById("photographer-name")
const photographerCity = document.getElementById("photographer-city")
const photographerQuote = document.getElementById("photographer-quote")
const photographerTags = document.getElementById("photographer-tags")
const photographerPhoto = document.getElementById("photographer-photo")
const photographerGallery = document.querySelector(".gallery_container")
const sorterOption = document.querySelectorAll(".sorter-wrapper_option")
const statsLikes = document.querySelector('.stats_likes')
const statsPrice = document.querySelector('.stats_price')
let pictureArray = []
let sorter = "date"
let tabIndex = 7
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
                    photographerTag.innerText = `#${tag}`
                    photographerTag.setAttribute('tabindex', tabIndex) 
                    tabIndex ++
                    photographerTags.appendChild(photographerTag)
            }
        }
    }
    tabIndex = 15
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

function buildGallery(array, name) {
    while (photographerGallery.firstChild) {
        photographerGallery.removeChild(photographerGallery.lastChild)
    }
    for (const media of array) {
        const block = new  GalleryBlock(media, name)
        block.buildBlock(media)

        totalLikes += media.likes
    }
    tabIndex = 15
    updateLikeCounter()
}


function sorterUpdate(e) {
    totalLikes = 0;
    const clickedFilter = e.target.attributes.value.value

    sorter = clickedFilter
    // switch(clickedFilter) {
    //     case 'Popularité' :
    //         sorter = 'likes'
    //     break
    //     case 'Date' :
    //         sorter = 'date'
    //     break
    //     case 'Titre' :
    //         sorter = 'title'
    //     break
    // }
    createPhotoArray()
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