let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let marker = L.marker([53.430127, 14.564802]).addTo(map);
marker.bindPopup("<strong>ZUT WI</strong>");

let mapImage;
let mapHeight;
let mapWidth;
let dragged = null;
let puzzlesArray = []; //TABLICA PUZZLI

function getLocation(){
    if (! navigator.geolocation) {
        alert("Nie można pobrać geolokalizacji.");
    }
    else{
            navigator.geolocation.getCurrentPosition((position) => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            map.setView([lat, lon]);
            document.getElementById("latitude").innerText = lat;
            document.getElementById("longitude").innerText = lon;

        }, (positionError) => {
            console.error(positionError);
        }, {
            enableHighAccuracy: false
        });
    }
}

function toPuzzle(){
   
    leafletImage(map, function (err, canvas) {
        mapWidth = 300;
        mapHeight = 150;
        let rasterMap = document.getElementById("rasterMap");
        let rasterContext = rasterMap.getContext("2d");
        rasterContext.drawImage(canvas, 0, 0, mapWidth, mapHeight); 
        mapImage = canvas;
        createPuzzles();
    });
   
   
}

function check(){
let puzzlePlaces = document.querySelectorAll(".puzzlePlace");
for(let i = 0;i<puzzlePlaces.length;i++){
    if(puzzlePlaces[i].firstChild !== null) {
        if (puzzlePlaces[i].firstChild.id != i) {
            console.log("Zły puzzel!");
            return;
        }
    }
    }
   //console.log("Puzzle ułożone poprawnie!");

   const notification = new Notification("Brawo udało Ci się ułożyć puzzle!");

}



function calculatePuzzle(number = 16){
    let canvasHeight = document.getElementById("map").getAttribute("height");
    let canvasWidth = document.getElementById("map").getAttribute("width");
    let puzzlesInRow = Math.sqrt(number);
    let puzzleWidth = Math.round(canvasWidth/puzzlesInRow);
    let puzzleHeight = Math.round(canvasHeight/puzzlesInRow);
    return [puzzleWidth, puzzleHeight];

}
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    while (currentIndex > 0) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}
function createPuzzles(number = 16, image = mapImage){

    
    let [width, height] = calculatePuzzle();
    let puzzlediv = document.getElementById("puzzle");
    let sqr = Math.sqrt(number);
    console.log(width, height);

    for(let i = 0; i<sqr;i++){
        for( let j = 0; j< sqr; j++){
        puzzlesArray[i*sqr+j] = document.createElement("canvas");
        puzzlesArray[i*sqr+j].id=(i*sqr+j).toString();
        puzzlesArray[i*sqr+j].width = width;
        puzzlesArray[i*sqr+j].height = height;
        puzzlesArray[i*sqr+j].className = "puzzle";
        puzzlesArray[i*sqr+j].draggable="true";
        let rasterContext = puzzlesArray[i*sqr+j].getContext("2d");
        rasterContext.drawImage(image, j *width, i* height, width, height, 0, 0, width,height); 

        }
    }
    puzzlesArray = shuffle(puzzlesArray);
    for(let i = 0;i<puzzlesArray.length;i++) {
        puzzlediv.appendChild(puzzlesArray[i]);

    }

    addListeners();
}

function addListeners(){
let targets = document.querySelectorAll(".puzzlePlace");

for (let target of targets) {
   
    target.addEventListener("dragover", function (event) {
        event.preventDefault();
    });
    target.addEventListener("drop", function (event) {
        event.preventDefault();
        event.preventDefault();
            let data = event.dataTransfer.getData("puzzle");
            event.target.appendChild(document.getElementById(data));
        check();
    }, false);
}

let items = document.querySelectorAll(".puzzle");
for (let item of items) {
    item.addEventListener("dragstart", function(event) {
        dragged = event.target;
        event.dataTransfer.setData("puzzle", event.target.id);

    });

    item.addEventListener("dragend", function(event) {
     
    });
}

}

