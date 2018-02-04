// All code written below is the intellectual property of Ruxandra Maria Mindru
// unless stated otherwise.

//obtaining random integers
function myRandom(max){
  return Math.floor(Math.random()*max);
}

//CODE WRITTEN AND PROVIDED BY DR. STEVE MADDOCK
function getMouseXY(e) {
  var canvas = document.getElementById('canvas_example');
  var boundingRect = canvas.getBoundingClientRect();
  var offsetX = boundingRect.left;
  var offsetY = boundingRect.top;
  var w = (boundingRect.width-canvas.width)/2;
  var h = (boundingRect.height-canvas.height)/2;
  offsetX += w;
  offsetY += h;
  // use clientX and clientY as getBoundingClientRect is used above
  var mx = Math.round(e.clientX-offsetX);
  var my = Math.round(e.clientY-offsetY);
  return {x: mx, y: my};
}

//CODE WRITTEN AND PROVIDED BY DR. STEVE MADDOCK
function getImgMargins(x, y){
  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x >= CANVAS_WIDTH) 
    x = CANVAS_WIDTH-1;
  if (y >= CANVAS_HEIGHT) 
    y = CANVAS_HEIGHT-1;

  var gx = Math.floor(x/SIZE);
  var gy = Math.floor(y/SIZE);
  
  return {j: gx, i: gy};
}

//creates the randomized display of our pairs
//the validation with the word "stuff" was implemented to prevent 
//the same picture from being displayed more than twice
function makeArrayOfImg(x){
  do{var iMatch1 = myRandom(ROWS);
      var jMatch1 = myRandom(COLS);
  }while(arrayOfImg[iMatch1][jMatch1] != "stuff");
  arrayOfImg[iMatch1][jMatch1] = x;

  do{
    var iMatch2 = myRandom(ROWS);
    var jMatch2 = myRandom(COLS);
  }while(arrayOfImg[iMatch2][jMatch2] != "stuff");
  arrayOfImg[iMatch2][jMatch2] = x;
}

//loads the randomized array of pictures at the beginning of a game 
function loadImg(context, images, files, callback){
  var imageCount = 0;
  for (var i=0; i<files.length; i++){
    images[i] = new Image();
    callback(i);
    images[i].onload = function(){
    }
    images[i].src = files[i];
    }
    
}

//start of the picture load
function initAndStart(context, images){
  loadImg(context, images, pictures, makeArrayOfImg);
}

//loads the fox logo
function loadFox(context){
   var img = new Image();
   img.onload = function() {
      drawFoxes(context, img);
      }
   img.src = "../match/Fox.jpg";
   foxes = img;
}

//displays the initial grid of 16 cover pictures
function drawFoxes(context, img){
  var i, j;
  for(i = 0; i < ROWS; i++)
    for(j = 0; j < COLS; j++)
      context.drawImage(img, i*SIZE, j*SIZE, SIZE-1, SIZE-1);
}

//initially fills the array with a different type of data, 
//that will at no point coincide with the content I actually want to use
function fillArrayOfImg(){
    for(var i = 0; i < ROWS; i++)
      for(var j = 0; j < COLS; j++)
         arrayOfImg[i][j] = "stuff";
}

//saves the useful parameters of the first picture clicked in a sequence of 2
function positionPerClick(x, y, i){
  xPictureCompare = x;
  yPictureCompare = y;
  iPictureCompare = i;
}

//checks if the src saved in images coincides for the two pictures
//also checks if the pairs had been found before
function pairCheck (images, i){
  var comp = arrayOfImg[xPictureCompare][yPictureCompare];
  if(images[i] == images[comp] && images[i] != 0 && images[comp] != 0)
    return true;
  else return false;
}

// first is a global variable, in which the number of clicks is calculated
// click_check is a global variable, ensuring that only two new pictures will be displayed
  // the absence of click_check would have allowed a quick user to display 
  // three pictures and only two would have disappeared, 
  // leaving one on the canvas. 
  // This is due to the timeout I set.
  // click_check forbids the user from clicking beyond two pictures at a time

function draw(context, images, x, y){
  var i = arrayOfImg[x][y];
  var img = images[i];
  context.drawImage(img, x*SIZE, y*SIZE, SIZE-2, SIZE-2);
  first++;
  if(xPictureCompare==x&&yPictureCompare==y){
    //prevents double clicks affecting the program
    first--;

    if(first==0)
      // A bug I discovered. If I clicked the same two pictures twice in a row,
      // they would remain displayed on the page, as if they were a pair. 
      // This is a preventive method and the bug is now gone.
      first++;
  }

  //if the coordinates of the two pictures are different and there are only two pictures displayed
  if(xPictureCompare!=x || yPictureCompare!=y && click_check==false){
    if(first==1)
      positionPerClick(x, y, i);

    // As a prevention method, I have added the check that first == 2
    else if (first == 2){
      	click_check = true;
        if(pairCheck(images, i) == false && images[i] != "0" && images[iPictureCompare] != "0"){
          first = 0;
          setTimeout(function(){
            //draws over the pictures that don't match
          context.drawImage(foxes, x*SIZE, y*SIZE, SIZE-1, SIZE-1);
          context.drawImage(foxes, xPictureCompare*SIZE, yPictureCompare*SIZE, SIZE-1, SIZE-1);
          click_check = false;
          }, 300);  
        }

        else{ 
          pairs++;
          first = 0;
          images[i] = 0; 
          click_check = false;

          // this forces the program to ignore pictures already paired
           if(pairs == images.length){
              pairs = 0;
              // Allows all the pairs to be displayed and viewed before
              // the animation.
              setTimeout(function(){
                 winAnimation(context);
               }, 300);
            }
        }
      }
    }  
  }

//initializes the animation
function winAnimation(context){
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.drawImage(foxes, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  startAnimation();
}

function startAnimation(){
  //any clicks on the canvas during the animation would have displayed the pictures
  //to prevent any accidental clicks, I removed the Event Listener
  canvas.removeEventListener('click',clickEvent, false)
  drawText();
  nextFrame(); 
}

// makes the text "bounce" off the edges of the canvas
// the values I subtract from CANVAS_WIDTH and CANVAS_HEIGHT
// only exist to prevent the text from going beyond the visible field
// of the canvas and weren't worth saving separately as constants
function update(){
  if (animX + dx > CANVAS_WIDTH-60 || animX + dx < 0)
    dx = -dx;
  if (animY + dy > CANVAS_HEIGHT-30 || animY + dy < 0)
    dy = -dy;
  animX += dx;
  animY += dy;
}

// the animation text
function drawText(){
  context.clearRect(0, 0, CANVAS_WIDTH-1, CANVAS_HEIGHT-1);
  context.drawImage(foxes,0, 0, CANVAS_WIDTH-1, CANVAS_HEIGHT-1);
  context.fillStyle = "rgb(234, 234, 130)";
  context.font = "50px sans-serif";
  context.fillText("Congratulations!", animX, animY);
}

//creates the animation effect
function nextFrame(){
  requestId = requestAnimationFrame(nextFrame);
  update();
  drawText();
}

function stopAnimation(){
    cancelAnimationFrame(requestId);
    context.clearRect(0, 0, CANVAS_WIDTH-1, CANVAS_HEIGHT-1);
}

// on click, the pictures are drawn
function clickEvent(evt){
  var pos = getMouseXY(evt);
  var imgMargins = getImgMargins(pos.x, pos.y);
  if(click_check ==  false)  
 	  draw(context, images, imgMargins.j, imgMargins.i); 
}

// on click, a new puzzle is randomly created and the user can play it
function newPuzzle(){
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  stopAnimation();
  animX = 0;
  animY = 0;
  pairs = 0;
  first = 0;
  click_check = false;
  canvas.addEventListener('click',clickEvent, false)
  fillArrayOfImg(arrayOfImg);
  drawFoxes(context, foxes);
  initAndStart(context, images);
}

var attempts = 0;
var canvas = document.getElementById("canvas_example");
var context = canvas.getContext("2d");
var animX=0, animY=0;
var first = 0;
var xPictureCompare=0, yPictureCompare=0, iPictureCompare=0;
var pairs = 0;
var dx=5, dy=2;
var requestId;
var click_check=false;

const ROWS = 4, COLS = 4;
const SIZE = 100;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const NUM_CELLS = 4;
const CELL_WIDTH = CANVAS_WIDTH/NUM_CELLS;
const CELL_HEIGHT = CANVAS_HEIGHT/NUM_CELLS;

//I have declared the source array for all pictures outside a function, 
//to insure its global scope
/*Sources of the pictures used:
Fox Logo: http://www.freepik.com/free-photos-vectors/fox
Fox&Owl: http://www.zulily.co.uk/p/fox-owl-little-friends-decal-199167-22599462.html?cc=GB|GBP
Tribal Fox: http://sazyou7.tumblr.com/post/131633927059/fox-gazing-up-at-the-galaxy-fox-foxes
Sleeping Fox: http://amydover.tumblr.com/post/81419786058/christmas-present-commission-of-a-peeping-fox
Horse: http://www.auryanne.com/gallery/view_photo.php?set_albumName=Digital&id=temppalo
Butterfly: http://www.drawinghowtodraw.com/stepbystepdrawinglessons/2013/04/how-to-draw-cartoon-butterflies-drawing-tutorial-for-preschoolers-and-children/
Owl: http://khaidu.deviantart.com/art/Snowy-Owl-526632416
Tree: http://www.lfwa.org/event/happy-birthday-lfwa-adventures-sycamore-island-food-and-music
SMART logo: https://www.shutterstock.com/search/smart+goals
*/

var pictures = ["../match/image1.jpg", "../match/image2.png","../match/image3.jpg",
  "../match/image4.jpg", "../match/image5.jpg","../match/image6.jpg","../match/image7.jpg",
  "../match/image8.jpg"];
var arrayOfImg = new Array(ROWS);
var foxes;
//creates the two global arrays with changeable values
for(var j=0; j<COLS; j++)
    arrayOfImg[j] = new Array(COLS);
var images = new Array(pictures.length);

//starts the first version of the game
fillArrayOfImg(arrayOfImg);
loadFox(context);
initAndStart(context, images);

canvas.addEventListener('click',clickEvent, false)

var b = document.getElementById("new");
b.addEventListener('click', newPuzzle, false);

