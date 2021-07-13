function lightBoxOpen(e) {
    const currentGallery = document.querySelector('.gallery_container')
    const currentMedia = currentMediaSelector(e)
    console.log(currentMedia);
    currentMedia.classList.add('lightbox')
}

function currentMediaSelector(e) {
    for (let i = 0 ; i < e.path.length ; i ++) {
        if (e.path[i].classList.contains('gallery_thumbnail')) {
            const media = e.path[i]
            return media
        }
    }
}