const lightboxBackground = document.querySelector(".lightbox-background")
let gallery = []
let lightBoxIsOpen = false
let mediaIndex = 0;

function lightBoxOpen(e) {
    if (!lightBoxIsOpen) {
    lightBoxIsOpen = true
    lightboxBackground.style.display = "flex"
    const currentMedia = currentMediaSelector(e.path)
    currentMedia.classList.add('lightbox')
    
    const rightArrow = createNavArrows("right")
    const leftArrow = createNavArrows("left")
    
    lightboxBackground.appendChild(leftArrow)
    lightboxBackground.appendChild(currentMedia)
    lightboxBackground.appendChild(rightArrow)
    }
}


function currentMediaSelector(array) {
    for (let i = 0 ; i < array.length ; i ++) {
        if (array[i].classList.contains('gallery_thumbnail')) {
            const media = array[i].cloneNode(true)
            gallery = [...document.querySelectorAll('.gallery_thumbnail')]
            mediaIndex = gallery.indexOf(media)
            return media
        }
    }
}

function updateLightBox() {
    
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
