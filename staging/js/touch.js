var myElement = document.getElementById("game");

myElement.addEventListener("touchstart", startTouch, false);
myElement.addEventListener("touchmove", moveTouch, false);
 
// Swipe Up / Down / Left / Right
var initialX = null;
var initialY = null;
 
function startTouch(e) {
  initialX = e.touches[0].clientX;
  initialY = e.touches[0].clientY;
};
 
function moveTouch(e) {
  if (initialX === null) {
    return;
  }
 
  if (initialY === null) {
    return;
  }
 
  var currentX = e.touches[0].clientX;
  var currentY = e.touches[0].clientY;
 
  var diffX = initialX - currentX;
  var diffY = initialY - currentY;
 
  if (Math.abs(diffX) > Math.abs(diffY)) {
    // sliding horizontally
    if (diffX > 0) {
      // swiped left
      handle_user_interaction({keyCode: 37});
      console.log("swiped left");
    } else {
      // swiped right
      handle_user_interaction({keyCode: 39});
      console.log("swiped right");
    }  
  } else {
    // sliding vertically
    if (diffY > 0) {
      // swiped up
      handle_user_interaction({keyCode: 38});
      console.log("swiped up");
    } else {
      // swiped down
      console.log("swiped down");
      handle_user_interaction({keyCode: 40});
    }  
  }
 
  initialX = null;
  initialY = null;
   
  e.preventDefault();
};
