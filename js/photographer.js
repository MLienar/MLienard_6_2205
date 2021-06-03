const photographerName = document.getElementById("photographer-name")
const photographerCity = document.getElementById("photographer-city")
const photographerQuote = document.getElementById("photographer-quote")
const photographerTags = document.getElementById("photographer-tags")
const photographerPhoto = document.getElementById("photographer-photo")
const photographerGallery = document.querySelector(".gallery_container")

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
            for (const tag of photographer.tags) {
                    const photographerTag = document.createElement("p")
                    photographerTag.classList.add("tag")
                    // photographerTag.addEventListener("click", toggleTag)
                    photographerTag.innerText = `#${tag}`
                    photographerTags.appendChild(photographerTag)
                }
            }
        }
    }

function buildGallery(array, name) {
    // remove last name from src 
    const firstName = name.lastIndexOf(" ")
    name = name.substring(0, firstName)
    const sourceFolder = `src/images/${name}`
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

async function filterArray() {
    const json = await getJson() 
    for (const photographer of json.photographers) {
        if (photographer.name.replace(/\s+/g, '').toLowerCase() === currentPhotographer) {
            const photographerId = photographer.id
            const pictureArray = json.media.filter(obj => obj.photographerId == photographerId)
            console.log(pictureArray);
            buildGallery(pictureArray, photographer.name)
        }
    }
}



injectProfileInfo()
filterArray()




// FACTORY EXAMPLE
// function Factory() {
//     this.createEmployee = function (type) {
//         var employee;
 
//         if (type === "fulltime") {
//             employee = new FullTime();
//             console.log(employee);
//         } else if (type === "parttime") {
//             employee = new PartTime();
//             console.log(employee);
//         } else if (type === "temporary") {
//             employee = new Temporary();
//             console.log(employee);
//         } else if (type === "contractor") {
//             employee = new Contractor();
//             console.log(employee);
//         }
 
//         employee.type = type;
 
//         employee.say = function () {
//             log.add(this.type + ": rate " + this.hourly + "/hour");
//         }
 
//         return employee;
//     }
// }
 
// var FullTime = function () {
//     this.hourly = "$12";
// };
 
// var PartTime = function () {
//     this.hourly = "$11";
// };
 
// var Temporary = function () {
//     this.hourly = "$10";
// };
 
// var Contractor = function () {
//     this.hourly = "$15";
// };
 
// // log helper
// var log = (function () {
//     var log = "";
 
//     return {
//         add: function (msg) { log += msg + "\n"; },
//         show: function () { alert(log); log = ""; }
//     }
// })();
 
// function run() {
//     var employees = [];
//     var factory = new Factory();
 
//     employees.push(factory.createEmployee("fulltime"));
//     employees.push(factory.createEmployee("parttime"));
//     employees.push(factory.createEmployee("temporary"));
//     employees.push(factory.createEmployee("contractor"));
    
//     for (var i = 0, len = employees.length; i < len; i++) {
//         employees[i].say();
//     }
//     log.show();
// }

// run()

