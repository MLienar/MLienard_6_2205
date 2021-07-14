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
            let tabIndex = 6
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
            content: `${likes} ♥`,
        }
    }

    const mediaTitle = function(title) {
        return {
            elemToCreate: 'p',
            classList: "title",
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
            textContainer.appendChild(htmlBlock)
        }     

        galleryThumbnail.appendChild(textContainer)
        galleryThumbnail.addEventListener("click", lightBoxOpen)
        photographerGallery.appendChild(galleryThumbnail)
    }
}

function buildGallery(array, name) {
    while (photographerGallery.firstChild) {
        photographerGallery.removeChild(photographerGallery.lastChild)
    }
    let totalLikes = 0
    for (const media of array) {
        const block = new  GalleryBlock(media, name)
        block.buildBlock(media)

        totalLikes += media.likes
    }
    statsLikes.innerText = `${totalLikes} ♥`
}

function sorterUpdate(e) {
    const clickedFilter = e.target.textContent
    switch(clickedFilter) {
        case 'Popularité' :
            sorter = 'likes'
        break
        case 'Date' :
            sorter = 'date'
        break
        case 'Titre' :
            sorter = 'title'
        break
    }
    console.log('yo');
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

