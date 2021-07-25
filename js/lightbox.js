const lightboxBackground = document.querySelector(".lightbox-background")
let gallery = []
let lightBoxIsOpen = false
let mediaIndex = 0;

function lightBoxOpen(e) {
    // Don't open if like button was clicked
    if (!lightBoxIsOpen && !e.target.classList.contains("gallery_thumbnail--counter") ) {
    lightBoxIsOpen = true
    lightboxBackground.style.display = "flex"
        // Select media to show
    const currentMedia = currentMediaSelector(e.path)  
        // Create controls
    const rightArrow = createNavArrows("right")
    const leftArrow = createNavArrows("left")

    const closeBtn = document.createElement("div")
    closeBtn.classList.add('close')
    closeBtn.addEventListener('click', lightBoxClose)
    const crossOffsetTop = crossPosition(currentMedia)
    closeBtn.style.top = crossOffsetTop
        // Append created elements to lightbox
    lightboxBackground.appendChild(closeBtn)
    lightboxBackground.appendChild(leftArrow)
    lightboxBackground.appendChild(currentMedia)
    lightboxBackground.appendChild(rightArrow)
    }
}

function crossPosition(media) {
    const position = media.getBoundingClientRect()
    console.log( position )
}   


function currentMediaSelector(array) {
    for (let i = 0 ; i < array.length ; i ++) {
        if (array[i].classList.contains('gallery_thumbnail')) {
            const media = array[i].cloneNode(true)
            const mediaSrc = media.firstChild.src
            gallery = [...document.querySelectorAll('.gallery_thumbnail')]
            for (let i = 0; i < gallery.length ; i ++) {
                if (gallery[i].firstChild.src === mediaSrc) {
                    mediaIndex = i 
                }
            }
            media.classList.add('lightbox')
            // Add autoplay to video
            if (media.firstChild.nodeName === "VIDEO") {
                media.firstChild.autoplay = true
            }
            return media
        }
    }
}

function updateLightBox() {
    const currentLightBoxEl = document.querySelector('.lightbox') 
    const newLightBoxEl = gallery[mediaIndex].cloneNode(true)
    if (newLightBoxEl.firstChild.nodeName === "VIDEO") {
        newLightBoxEl.firstChild.autoplay = true
    }
    newLightBoxEl.classList.add("lightbox")
    lightboxBackground.replaceChild(newLightBoxEl, currentLightBoxEl)
}

function scrollLightBoxMedia(side) {
    switch(side) {
        case 'left': 
        mediaIndex -= 1;
        break;

        case 'right':
        mediaIndex += 1;
        break;
    }
    if (mediaIndex > gallery.length - 1) {
        mediaIndex = 0
    }
    if (mediaIndex < 0) {
        mediaIndex = gallery.length - 1
    }
    updateLightBox()
}

function lightBoxClose() {
    lightBoxIsOpen = false
    lightboxBackground.style.display = "none"
    while (lightboxBackground.firstChild) {
        lightboxBackground.removeChild(lightboxBackground.lastChild)
    }
}

function handleKeyPresses(e) {
    if (lightboxBackground.style.display === "flex") {
        switch(e.key) {
            case "Escape" : 
            lightBoxClose()
            break
            case "ArrowRight":
            scrollLightBoxMedia("right")
            break
            case "ArrowLeft" :
            scrollLightBoxMedia("left")
            break
        }
    }
}

document.addEventListener("keydown", handleKeyPresses)

function createNavArrows(side) {
    const arrow = document.createElement('i')
    arrow.classList.add("arrow", `${side}-arrow`)
    arrow.setAttribute("side", side)
    arrow.addEventListener("click", () => {
        scrollLightBoxMedia(side)
    })
    return arrow
}
