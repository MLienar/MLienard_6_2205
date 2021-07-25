const photographersList = document.querySelector('.photographers-list')
const tags = document.querySelectorAll('.tag')
let tabIndex = 9

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

async function createProfiles() {
    const json = await getJson()
    for (const photographer of json.photographers) {
        // Create photographer container
        const photographerEl = document.createElement('div')
        photographerEl.classList.add("photographer-container")
        
        // Create photographer thumbnail
        const photographerThumbnail = document.createElement('div')
        photographerThumbnail.classList.add('photographer-thumb')

        // Create photographer link
        const photographerLink = document.createElement('a')
        photographerLink.classList.add("photographer-thumb_link")
        photographerLink.setAttribute('aria-label', photographer.name)
        photographerLink.href = `photographer.html?name=${photographer.name.replace(/\s+/g, '').toLowerCase()}`
        photographerLink.setAttribute("tabindex", tabIndex)
        tabIndex += 1
        // Add profile pic
        const photographerPicture = document.createElement('img')
        photographerPicture.classList.add("photographer-thumb_portrait")
        photographerPicture.src = `src/images/photographers/${photographer.name.replace(/\s+/g, '')}.jpg`
        photographerPicture.height = '500'
        photographerPicture.width = '500'
        photographerPicture.alt = photographer.name
        photographerLink.appendChild(photographerPicture)

        // Add name
        const photographerName = document.createElement("h2")
        photographerName.classList.add("photographer-thumb_name")
        photographerName.innerText = photographer.name

        photographerLink.appendChild(photographerName)
        photographerThumbnail.appendChild(photographerLink)

        // Add City
        const photographerCity = document.createElement("p")
        photographerCity.setAttribute("tabindex", tabIndex)
        tabIndex += 1
        photographerCity.setAttribute("aria-label", "city")
        photographerCity.classList.add("photographer-thumb_city")
        photographerCity.innerText = photographer.city
        photographerThumbnail.appendChild(photographerCity)

        // Add Quote
        const photographerQuote = document.createElement("p")
        photographerQuote.classList.add("photographer-thumb_quote")
        photographerQuote.setAttribute("tabindex", tabIndex)
        tabIndex += 1
        photographerQuote.setAttribute("aria-label", "quote")
        photographerQuote.innerText = photographer.tagline
        photographerThumbnail.appendChild(photographerQuote)

        // Add Price
        const photographerPrice = document.createElement("p")
        photographerPrice.classList.add("photographer-thumb_price")
        photographerPrice.setAttribute("tabindex", tabIndex)
        tabIndex += 1
        photographerPrice.setAttribute("aria-label", "price")
        photographerPrice.innerText = `${photographer.price}€/jour`
        photographerThumbnail.appendChild(photographerPrice)

        // Add Tags
        const photographerTagList = document.createElement("div")
        photographerTagList.classList.add("photographer-thumb_tags")
        for (const tag of photographer.tags) {
            const photographerTag = document.createElement("p")
            photographerTag.classList.add("tag")
            photographerTag.addEventListener("click", toggleTag)
            photographerTag.addEventListener('keydown', (e) => {
                if (e.keyCode === 32 || e.keyCode === 13) {
                    toggleTag(e)
                }
            })
            photographerTag.innerText = `#${tag}`
            photographerTag.setAttribute("tabindex", tabIndex)
            tabIndex += 1
            const tagLabel = document.createElement("span")
                    tagLabel.setAttribute('aria-label',  "tag")
                    tagLabel.textContent = tag
                    tagLabel.classList.add("reader-only")
            photographerTag.appendChild(tagLabel)
            photographerTagList.appendChild(photographerTag)
        }
        photographerThumbnail.appendChild(photographerTagList)
               
        photographerEl.appendChild(photographerThumbnail)
        // Add element to DOM
        photographersList.appendChild(photographerEl)
    }
}    

// Filter based on tags
let activeTags = []

function toggleTag(e) {
    const clickedTag = e.target.querySelector('.reader-only').innerText
    if (activeTags.includes(clickedTag)) {
        const index = activeTags.indexOf(clickedTag)
        if (index > -1) {
            activeTags.splice(index, 1)
        }
        e.target.classList.remove("active")
    } else {
        activeTags.push(clickedTag)
        e.target.classList.add("active")
    }
    tagFilter()
}

function tagFilter() {
    const photographerThumbs = document.querySelectorAll('.photographer-thumb')
    console.log(activeTags);
    for (const thumb of photographerThumbs) {
        if (!activeTags.length) {
            thumb.parentNode.style.display = "flex"
        } else {
            let thumbIsDisplayed = false
            for (const tag of thumb.children[4].children) {
                if (activeTags.includes(tag.querySelector('.reader-only').innerText)) {
                    thumbIsDisplayed = true
                }
            }
            if (thumbIsDisplayed) {
                thumb.parentNode.style.display = "flex"
            } else {
                thumb.parentNode.style.display = "none"
            }
        }
    }
}

tags.forEach((tag) => tag.addEventListener('click', toggleTag))
tags.forEach((tag) => tag.addEventListener('keydown', (e) => {
    if (e.keyCode === 32 || e.keyCode === 13) {
        toggleTag(e)
    }
}))

createProfiles()