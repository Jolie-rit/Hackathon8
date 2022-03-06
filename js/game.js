const wall_width = document.querySelector(".wall").offsetWidth;

document.querySelector(".back").style.transform = "translateZ(" + wall_width + "px)";
document.querySelector(".container_outer").style.perspective = wall_width / 2 + "px";
document.querySelector(".container").style.transformOrigin = "50% 50% " + wall_width / 2 + "px";
document.querySelector(".teacher").style.transform = "translateZ(" + wall_width / 4 + "px)";
document.querySelector(".teacher_desk").style.transform = "translateZ(" + wall_width / 7 + "px)";
document.querySelector(".student1").style.transform = "translateZ(" + wall_width / 2 + "px) rotateY(90deg)";
document.querySelector(".imessage").style.transform = "translateZ(" + wall_width / 1.45 + "px) rotateY(-90deg)";

const notes_obj = document.querySelector(".notes");
const board_vid = document.querySelector(".board_vid");
const teacher = document.querySelector(".teacher");
const student1 = document.querySelector(".student1");
const message = document.querySelector(".imessage");

notes_obj.style.display = "none";
board_vid.style.display = "none";
message.style.display = "none";

//Movement

// Constants for restraints
const minZ = -0.45 * wall_width;
const maxZ = 0.2 * wall_width;
const maxX = 0.2 * document.querySelector(".wall").offsetWidth;
const minX = -1 * 0.5 * document.querySelector(".wall").offsetWidth;

// Position variables
var z = 0;
var x = 0;
var y = 0;

var newX;
var newZ;
const move_step = 5;
const rotate_step = 1;

//Look Around
var rotateY = 0;
var rotateX = 0;

// controlling teacher movement
var rotateTeacher;

document.body.addEventListener('keydown', move);
document.body.addEventListener('keyup', jump);
document.body.addEventListener('keyup', board_vid_toggle);
teacher.addEventListener('mouseup', notes_toggle);
student1.addEventListener('click', message_toggle);

//Movement and looking around

function move(e) {
    document.querySelector(".container").style.transition = "0s"; // resetting the transition, in case it is changed by the jump()

    var rotate_val;

    if (document.querySelector(".container").style.transform == "") {
        rotate_val = 0;
    }
    else {
        rotate_val = 90 + parseInt(document.querySelector(".container").style.transform.split("rotateY(")[1].split("deg")[0]);
    }

    //w
    if (e.keyCode == 119 || e.keyCode == 87 ) {
        newX = x + move_step * Math.cos(rotate_val * Math.PI / 180);
        newZ = z + move_step * Math.sin(rotate_val * Math.PI / 180);

        if (newX <= maxX && newZ <= maxZ) {
            x = newX;
            z = newZ;
        }
    }
    //s
    else if (e.keyCode == 115 || e.keyCode == 83) {
        newX = x - move_step * Math.cos(rotate_val * Math.PI / 180);
        newZ = z - move_step * Math.sin(rotate_val * Math.PI / 180);

        if (newX >= minX && newZ >= minZ) {
            x = newX;
            z = newZ;
        }
    }
    //a
    else if (e.keyCode == 97 || e.keyCode == 65) {
        newX = x + move_step * Math.sin(rotate_val * Math.PI / 180);
        newZ = z - move_step * Math.cos(rotate_val * Math.PI / 180);

        if (newX <= maxX && newZ >= minZ) {
            x = newX;
            z = newZ;
        }
    }
    //d
    else if (e.keyCode == 100 || e.keyCode == 68) {
        newX = x - move_step * Math.sin(rotate_val * Math.PI / 180);
        newZ = z + move_step * Math.cos(rotate_val * Math.PI / 180);

        if (newX >= minX && newZ <= maxZ) {
            x = newX;
            z = newZ;
        }
    }

    // up arrow
    else if (e.keyCode == 38) {
        rotateX += rotate_step;
    }
    // down arrow
    else if (e.keyCode == 40) {
        rotateX -= rotate_step;
    }
    // left arrow
    else if (e.keyCode == 37) {
        rotateY -= rotate_step;
    }
    // right arrow
    else if (e.keyCode == 39) {
        rotateY += rotate_step;
    }
    
    // Restraints - for safety
    
    /*
    if (rotateY > 90) {
        rotateY = 90;
    }
    else if (rotateY < -90) {
        rotateY = -90;
    }
    */

    if (rotateX > 90) {
        rotateX = 90;
    }
    else if (rotateX < -90) {
        rotateX = -90;
    }

    if (z > maxZ) {
        z = maxZ;
    }
    else if (z < minZ) {
        z = minZ;
    }

    if (x > maxX) {
        x = maxX;
    }
    else if (x < minX) {
        x = minX;
    }

    // Make teacher rotate to follow you
    rotateTeacher = Math.atan((y + 0.15 * wall_width)/(wall_width / 2 - z - wall_width / 4)) * 180 / Math.PI;
    
    
    document.querySelector(".container").style.transformOrigin = innerWidth / 2 - x + "px " + "50% " + (1000 - z) + "px"; // changing anchor point to current position
    document.querySelector(".container").style.transform = "translateZ(" + z + "px) translateX(" + x + "px)" + "rotateX(" + rotateX + "deg) " + "rotateY(" + rotateY + "deg)";
    
    
    document.querySelector(".teacher").style.transform = "translateZ(" + wall_width / 4 + "px) rotateY(" + (-rotateTeacher) + "deg)";
}

function jump(e) {
    //spacebar              
    if (e.keyCode == 32) {
        //Jump
        y = 10;
        document.querySelector(".container").style.transition = "0.6s";
        document.querySelector(".container").style.transform = "translateZ(" + z + "px) translateX(" + x + "px)" + "rotateX(" + rotateX + "deg) " + "rotateY(" + rotateY + "deg)" + "translateY(" + y + "%)";
        setTimeout(() => {
            y = 0;
            document.querySelector(".container").style.transform = "translateZ(" + z + "px) translateX(" + x + "px)" + "rotateX(" + rotateX + "deg) " + "rotateY(" + rotateY + "deg)" + "translateY(" + y + "%)";
        }, 600);
    }
}

function notes_toggle(e){
    if (typeof e === 'object') {
        // right click
        if (e.button == 2) {
            if (notes_obj.style.display == "none") {
                notes_obj.style.display = "block";
                document.body.removeEventListener('keydown', move);
                document.body.removeEventListener('keyup', jump);
                document.body.removeEventListener('keyup', board_vid_toggle);
            }
            else {
                notes_obj.style.display = "none";
                document.body.addEventListener('keydown', move);
                document.body.addEventListener('keyup', jump);
                document.body.addEventListener('keyup', board_vid_toggle);
            }
        }
    }
}

function board_vid_toggle(e) {
    // v
    if(e.keyCode == 86 || e.keyCode == 118){
        if (board_vid.style.display == "none") {
            board_vid.style.display = "block";
        }
        else {
            board_vid.style.display = "none";
        }
    }
}

function message_toggle(e) {
    if (message.style.display == "none") {
        message.style.display = "block";
    }
    else {
        message.style.display = "none";
    }  
}