setTimeout(() => {
    if (db) {

        // videos retieval
        let videoDBTransaction = db.transaction("video", "readonly");
        let videoStore = videoDBTransaction.objectStore("video");
        let videoRequest = videoStore.getAll();  //Event driven

        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;

            let galleryCont = document.querySelector(".gallery-cont");
            videoResult.forEach((videoObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class", "media-cont");
                mediaElem.setAttribute("id", videoObj.id);

                let url = URL.createObjectURL(videoObj.blobData);

                mediaElem.innerHTML = `
                <div class="media">
                    <video autoplay loop src="${url}"></video>
                </div>
                <div class="delete action-btn">DELETE</div>
                <div class="download action-btn">DOWNLOAD</div>
                `;

                galleryCont.appendChild(mediaElem);

                // Listeners
                let deleteBtn = mediaElem.querySelector(".delete");
                deleteBtn.addEventListener("click", deleteListener);
                let downloadBtn = mediaElem.querySelector(".download");
                downloadBtn.addEventListener("click", downloadListener);
            })
        }

        // images retrieval
        let imageDBTransaction = db.transaction("image", "readonly");
        let imageStore = imageDBTransaction.objectStore("image");
        let imageRequest = imageStore.getAll();  //Event driven
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;
            let galleryCont = document.querySelector(".gallery-cont");
            imageResult.forEach((imageObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class", "media-cont");
                mediaElem.setAttribute("id", imageObj.id);

                let url = imageObj.url;

                mediaElem.innerHTML = `
                <div class="media">
                    <img src="${url}" />
                </div>
                <div class="delete action-btn">DELETE</div>
                <div class="download action-btn">DOWNLOAD</div>
                `;
                galleryCont.appendChild(mediaElem);

                // Listeners
                let deleteBtn = mediaElem.querySelector(".delete");
                deleteBtn.addEventListener("click", deleteListener);
                let downloadBtn = mediaElem.querySelector(".download");
                downloadBtn.addEventListener("click", downloadListener);
            })
        }
    }
}, 100)

// UI remove, DB remove
function deleteListener(e) {
    // DB removal

    //here with e.target we are accessing delete button from above delete button parent is mediaElem because delete button is under that function so we can access that like this e.target.parentElement
    let id = e.target.parentElement.getAttribute("id");


    //0 to 3 beacuse in script.js file we gave image name as img and video as vid to it will slice and in if condition below it will check (slice will give us value not cut keep in mind this)
    let type = id.slice(0, 3);
    if (type === "vid") {
        let videoDBTransaction = db.transaction("video", "readwrite");
        let videoStore = videoDBTransaction.objectStore("video");
        videoStore.delete(id);
    }
    else if (type === "img") {
        let imageDBTransaction = db.transaction("image", "readwrite");
        let imageStore = imageDBTransaction.objectStore("image");
        imageStore.delete(id);
    }

    // UI removal
    e.target.parentElement.remove();

}
function downloadListener(e) {
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0, 3);
    if (type === "vid") {
        let videoDBTransaction = db.transaction("video", "readwrite");
        let videoStore = videoDBTransaction.objectStore("video");
        let videoRequest = videoStore.get(id);
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;

            let videoURL = URL.createObjectURL(videoResult.blobData);

            let a = document.createElement("a");
            a.href = videoURL;
            a.download = "stream.mp4";
            a.click();
        }
    }
    else if (type === "img") {
        let imageDBTransaction = db.transaction("image", "readwrite");
        let imageStore = imageDBTransaction.objectStore("image");
        let imageRequest = imageStore.get(id);
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;

            let a = document.createElement("a");
            a.href = imageResult.url;
            a.download = "image.jpg";
            a.click();
        }
    }
}

