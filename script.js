let video = document.querySelector('video');
let recordBtnCont = document.querySelector(".record-btn-cont")
let captureBtnCont = document.querySelector(".capture-btn-cont")
let recordBtn = document.querySelector(".record-btn")
let captureBtn = document.querySelector(".capture-btn")

let recorder;

let recordFlag = false; //Toggles the recording flag (recordFlag) and starts or stops recording based on the flag's value.

let chunks = [];// Array to store media data in chunks.

let transparentColor = "transparent";

let constraints = {
video:true,
audio:true
}



//navigator provides information about browser it is a global object 
//mediadevices is also a api provided by webbrowser
//The MediaDevices  API provides access to connected media input devices like cameras and microphones, as well as screen sharing. In essence, it lets you obtain access to any hardware source of media data



navigator.mediaDevices.getUserMedia(constraints).then((stream)=>{
video.srcObject = stream;

recorder = new MediaRecorder(stream);   //here in recorder we are storing mediarecorder so we can use eventlistners etc on this


//below making functions for recording video after clicking on button and automatically downloading it...

//appliying eventlistner to button 
recorder.addEventListener("start",(e)=>{
chunks=[];//here emptiying chunks before starting recording 

})

recorder.addEventListener("dataavailable",(e)=>{
    chunks.push(e.data) //here pushing chunks data 
})

//now below ccreating function after clicking on stop recording button and for downloading video

recorder.addEventListener("stop",(e)=>{

    //conversion of media chunks  data to video
let blob = new Blob(chunks , {type: "video/mp4"});
let videoURL = URL.createObjectURL(blob)

if(db){
let videoID = shortid();
let dbTransaction = db.transaction("video" , "readwrite");

let videoStore = dbTransaction.objectStore("video");
let videoEntry = {
    id: `vid-${videoID}`,
    blobData: blob
}
videoStore.add(videoEntry);
}




// let a = document.createElement("a")
// a.href = videoURL;
// a.download = "stream.mp4";
// a.click();
})

})

// below are functions to make buttons work
recordBtnCont.addEventListener("click" , (e)=>{
    if(!recorder) return;
    
    recordFlag = !recordFlag;
    
    if(recordFlag){
    //start recording function
    //start() and stop() is a inbuild method
    recorder.start()
    recordBtn.classList.add("scale-record")
    startTimer();
    }else{
    //stop 
    recorder.stop()
    recordBtn.classList.remove("scale-record")
    stopTimer();
    }
    })





//now here below writing code for capture button to capture photo

captureBtnCont.addEventListener("click",(e)=>{
    captureBtn.classList.add("scale-capture");

    let canvas = document.createElement("canvas")
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    let tool = canvas.getContext('2d')
    tool.drawImage(video,0,0,canvas.width,canvas.height);

//filtering option
tool.fillStyle = transparentColor;
//fillRect(x,y,width,height)
tool.fillRect(0,0,canvas.width,canvas.height);
let imageURL = canvas.toDataURL();


    //storing image and video here in database db
    if (db) {
        let imageID = shortid();
        let dbTransaction = db.transaction("image", "readwrite");
        let imageStore = dbTransaction.objectStore("image");
        let imageEntry = {
            id: `img-${imageID}`,
            url: imageURL
        }
        imageStore.add(imageEntry);
    }

    setTimeout(() => {
        captureBtn.classList.remove("scale-capture");
    }, 500)


    



    // let imageURL = canvas.toDataURL();
    // let a = document.createElement('a');
    // a.href = imageURL;
    // a.download = 'image.jpg'
    // a.click();
    
    
    })










//filtering logic
let filterLayer = document.querySelector(".filter-layer")
let allFilters = document.querySelectorAll(".filter");

allFilters.forEach((filterElement)=>{
filterElement.addEventListener("click",(e)=>{

    //get style
transparentColor  = getComputedStyle(filterElement).getPropertyValue("background-color");
filterLayer.style.backgroundColor = transparentColor;
})


})



//timer
let timerID;
let counter = 0; // Represents total seconds
let timer = document.querySelector(".timer");
function startTimer() {
    timer.style.display = "block";
    function displayTimer() {
        let totalSeconds = counter;

        let hours = Number.parseInt(totalSeconds / 3600);
        totalSeconds = totalSeconds % 3600; // remaining value

        let minutes = Number.parseInt(totalSeconds / 60);
        totalSeconds = totalSeconds % 60; // remaining value

        let seconds = totalSeconds;

        hours = (hours < 10) ? `0${hours}` : hours;
        minutes = (minutes < 10) ? `0${minutes}` : minutes;
        seconds = (seconds < 10) ? `0${seconds}` : seconds;

        timer.innerText = `${hours}:${minutes}:${seconds}`;

        counter++;
    }

    timerID = setInterval(displayTimer, 1000);
}
function stopTimer() {
    clearInterval(timerID);
    timer.innerText = "00:00:00";
    timer.style.display = "none";
}
 

// let video = document.querySelector("video");
// let recordBtnCont = document.querySelector(".record-btn-cont");
// let recordBtn = document.querySelector(".record-btn");
// let captureBtnCont = document.querySelector(".capture-btn-cont");
// let captureBtn = document.querySelector(".capture-btn");
// let recordFlag = false;
// let transparentColor = "transparent";

// let recorder;
// let chunks = []; // Media data in chunks

// let constraints = {
//     video: true,
//     audio: true
// }

// // navigator -> global, browser info
// navigator.mediaDevices.getUserMedia(constraints)
//     .then((stream) => {
//         video.srcObject = stream;

//         recorder = new MediaRecorder(stream);
//         recorder.addEventListener("start", (e) => {
//             chunks = [];
//         })
//         recorder.addEventListener("dataavailable", (e) => {
//             chunks.push(e.data);
//         })
//         recorder.addEventListener("stop", (e) => {
//             // Conversion of media chunks data to video
//             let blob = new Blob(chunks, { type: "video/mp4" });

//             if (db) {
//                 let videoID = shortid();
//                 let dbTransaction = db.transaction("video", "readwrite");
//                 let videoStore = dbTransaction.objectStore("video");
//                 let videoEntry = {
//                     id: `vid-${videoID}`,
//                     blobData: blob
//                 }
//                 videoStore.add(videoEntry);
//             }

//             // let a = document.createElement("a");
//             // a.href = videoURL;
//             // a.download = "stream.mp4";
//             // a.click();
//         })
//     })

// recordBtnCont.addEventListener("click", (e) => {
//     if (!recorder) return;

//     recordFlag = !recordFlag;

//     if (recordFlag) { // start
//         recorder.start();
//         recordBtn.classList.add("scale-record");
//         startTimer();
//     }
//     else { // stop
//         recorder.stop();
//         recordBtn.classList.remove("scale-record");
//         stopTimer();
//     }
// })

// captureBtnCont.addEventListener("click", (e) => {
//     captureBtn.classList.add("scale-capture");

//     let canvas = document.createElement("canvas");
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;

//     let tool = canvas.getContext("2d");
//     tool.drawImage(video, 0, 0, canvas.width, canvas.height);
//     // Filtering 
//     tool.fillStyle = transparentColor;
//     tool.fillRect(0, 0, canvas.width, canvas.height);

//     let imageURL = canvas.toDataURL();

//     if (db) {
//         let imageID = shortid();
//         let dbTransaction = db.transaction("image", "readwrite");
//         let imageStore = dbTransaction.objectStore("image");
//         let imageEntry = {
//             id: `img-${imageID}`,
//             url: imageURL
//         }
//         imageStore.add(imageEntry);
//     }

//     setTimeout(() => {
//         captureBtn.classList.remove("scale-capture");
//     }, 500)
// })

// let timerID;
// let counter = 0; // Represents total seconds
// let timer = document.querySelector(".timer");
// function startTimer() {
//     timer.style.display = "block";
//     function displayTimer() {
//         let totalSeconds = counter;

//         let hours = Number.parseInt(totalSeconds / 3600);
//         totalSeconds = totalSeconds % 3600; // remaining value

//         let minutes = Number.parseInt(totalSeconds / 60);
//         totalSeconds = totalSeconds % 60; // remaining value

//         let seconds = totalSeconds;

//         hours = (hours < 10) ? `0${hours}` : hours;
//         minutes = (minutes < 10) ? `0${minutes}` : minutes;
//         seconds = (seconds < 10) ? `0${seconds}` : seconds;

//         timer.innerText = `${hours}:${minutes}:${seconds}`;

//         counter++;
//     }

//     timerID = setInterval(displayTimer, 1000);
// }
// function stopTimer() {
//     clearInterval(timerID);
//     timer.innerText = "00:00:00";
//     timer.style.display = "none";
// }


// // Filtering logic
// let filterLayer = document.querySelector(".filter-layer");
// let allFilters = document.querySelectorAll(".filter");
// allFilters.forEach((filterElem) => {
//     filterElem.addEventListener("click", (e) => {
//         // Get style
//         transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color");
//         filterLayer.style.backgroundColor = transparentColor;
//     })
// })




  


