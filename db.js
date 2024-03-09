
//open a database step 1 
//create objectStore step 2 
// make transactions 
let db;
let openRequest = indexedDB.open("myDataBase");
openRequest.addEventListener("success",(e)=>{
    console.log(" DB success");
    db = openRequest.result;//setting value

})

openRequest.addEventListener("error" , (e)=>{
    console.log(" DB error");
})
openRequest.addEventListener("upgradeneeded" , (e)=>{
    console.log(" DB upgraded");
    db = openRequest.result;


    //creating store for image and video
    db.createObjectStore("video" , {keyPath: "id"});
    db.createObjectStore("image", {keyPath:"id"})
})

