function buildGalleryBlock(media, name) {
  const firstName = name.lastIdexOf(' ')
  this.name = name.substring(0, firstName)
  this.mediaInfo = {
    type: "",
    src: ``
  } 

  const updateMediaInfo = function(media) {
    if (media.image) {
      this.mediaInfo.type = "img"
      this.mediaInfo.src = `src/images/${this.name}/${media.image}`
    } else {
        this.mediaInfo.type = "video"
        this.mediaInfo.src = `src/images/${this.name}/${media.video}`
    }
  }

  const createMediaBlock = function() {
    const mediaBlock = document.createElement(this.mediaInfo.type)
    mediaBlock.src = this.mediaInfo.src
    return mediaBlock
  }

  this.buildBlock = function(media) {
    const galleryThumbnail = document.createElement("div")
    galleryThumbnail.classList.add("gallery_thumbnail")

    updateMediaInfo(media)
    createMediaBlock()
    galleryThumbnail.appendChild(mediaBlock)
  }
} 


function buildGallery(array, name) {
  // remove last name from src 
  const firstName = name.lastIndexOf(" ")
  name = name.substring(0, firstName)
  const sourceFolder = `src/images/${name}`
  console.log(firstName);

  for (const media of array) {
      const galleryThumbnail = document.createElement("div")
      galleryThumbnail.classList.add("gallery_thumbnail")
      let elemToCreate = ""
      let src = ""
      // Choose if video or image block
      if (media.image) {
          elemToCreate = "img"
          src = `${sourceFolder}/${media.image}`
      } else {
          elemToCreate = "video"
          src = `${sourceFolder}/${media.video}`
      }
  
      const mediaBlock = document.createElement(`${elemToCreate}`)
      mediaBlock.src = src
  
      const textContainer = document.createElement("div")
      textContainer.classList.add("gallery_thumbnail--text-container")
  
      const mediaTitle = document.createElement("p")
      mediaTitle.classList.add("gallery_thumnail--photo-title")
      mediaTitle.innerText = media.title
      textContainer.appendChild(mediaTitle)
  
      const mediaLikes = document.createElement("p")
      mediaLikes.classList.add("gallery_thumbnail--counter")
      mediaLikes.innerText = `${media.likes} ♥`
      textContainer.appendChild(mediaLikes)
  
  
      galleryThumbnail.appendChild(mediaBlock)
      galleryThumbnail.appendChild(textContainer)
      photographerGallery.appendChild(galleryThumbnail)
  }
}
