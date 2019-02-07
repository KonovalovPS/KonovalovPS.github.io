var puzzleArr = document.querySelectorAll('.puzzle');

var puzzleNumber = 0;
for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
        if (i==3 && j==3) break;
        puzzleArr[puzzleNumber].style.left = j * 100 % 400 + 'px';
        puzzleArr[puzzleNumber].style.top = i * 100 % 400 + 'px';
        puzzleNumber++;
    }
}


var base = document.getElementById('base');
document.body.style.overflow = 'hidden';

document.onmousedown = function(e) {
    e.target.style.transition = '0s'
    
    e.preventDefault();
     
    var dragElem = e.target;
    
    var direction = getAllowedDirection();
    if (!direction) return;  //клик на заблокированный пазл
    
    
    
    
    if(!dragElem.classList.contains('puzzle')) return;
    
    
    var startCoords = getCoords(dragElem);
    var shiftX = e.pageX - startCoords.left;
    var shiftY = e.pageY - startCoords.top;
    
    var clientLeftEdge = getCoords(base).left + base.clientLeft - getCoords(dragElem).left;
    var clientTopEdge = getCoords(base).top + base.clientTop - getCoords(dragElem).top;
    console.log(clientTopEdge);
    
    //блок на элементе "в полете"
    if (clientLeftEdge % 100 || clientTopEdge % 100) return; 
    
    dragElem.style.zIndex = 1000;
    
    document.body.appendChild(dragElem);
    moveAt(e);

    function moveAt(e) {
      dragElem.style.left = e.pageX - shiftX + 'px';
      // console.log(dragElem.style.left)
      dragElem.style.top = e.pageY - shiftY + 'px';
    }
    
    var newCoords = {
        left: startCoords.left,
        top: startCoords.top
    };
    

    var delta = {x: 0, y: 0};
    
    document.onmousemove = function(e) {
      if (direction.hasOwnProperty('right')) {
        newCoords.left = e.pageX - shiftX;
        if (newCoords.left - startCoords.left > 100) {
            newCoords.left = startCoords.left + 100;
        } else if (newCoords.left - startCoords.left < 0) {
            newCoords.left = startCoords.left;
        }
        
        delta.x = newCoords.left - startCoords.left;
      };
      
      if (direction.hasOwnProperty('left')) {
        newCoords.left = e.pageX - shiftX;
        if (newCoords.left - startCoords.left < -100) {
            newCoords.left = startCoords.left - 100;
        } else if (newCoords.left - startCoords.left > 0) {
            newCoords.left = startCoords.left;
        }   
        delta.x = newCoords.left - startCoords.left;
      };
      
      if (direction.hasOwnProperty('up')) {
        newCoords.top = e.pageY - shiftY;
        if (newCoords.top - startCoords.top < -100) {
            newCoords.top = startCoords.top - 100;
        } else if (newCoords.top - startCoords.top > 0) {
            newCoords.top = startCoords.top;
        }   
        delta.y = newCoords.top - startCoords.top;

      };
      
      if (direction.hasOwnProperty('down')) {
        newCoords.top = e.pageY - shiftY;
        if (newCoords.top - startCoords.top > 100) {
            newCoords.top = startCoords.top + 100;
        } else if (newCoords.top - startCoords.top < 0) {
            newCoords.top = startCoords.top;
        }
        delta.y = newCoords.top - startCoords.top;

      };
      
      dragElem.style.left = newCoords.left + 'px'
      dragElem.style.top = newCoords.top + 'px'
      
      
    };
    
    document.onmouseup = function(e) {
      document.onmousemove = null;
      dragElem.onmouseup = null;
      
      e.target.style.transition = '0.2s'
      
      /*   ай малаца
      if (Math.abs(newCoords.left - startCoords.left) < 50 &&
        Math.abs(newCoords.top - startCoords.top) < 50) {
          dragElem.style.left = startCoords.left + 'px'
          dragElem.style.top = startCoords.top + 'px'
        } else {
          dragElem.style.left = finishCoords.x + 'px'
          dragElem.style.top = finishCoords.y + 'px'
        }
        */
  
        dragElem.style.left = startCoords.left + Math.round(delta.x/100)*100 + 'px';
        dragElem.style.top = startCoords.top + Math.round(delta.y/100)*100 + 'px';
        
    };
    
    function getAllowedDirection() {
      var directions = {
        'left': {x:-100, y:0},
        'right': {x:100, y:0},
        'up': {x:0, y:-100},
        'down': {x:0, y:+100}
        };  
        
      for (var key in directions) {        
        var elem = document.elementFromPoint(e.clientX + directions[key].x, 
                                             e.clientY + directions[key].y);
        if (!elem) continue;
        if (elem.className == 'base') {
            var result = {};
            result[key] = directions[key];
            return result;
        }
      }
      return false;
}
}



function getCoords(elem) {   // кроме IE8-
  var box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };
}