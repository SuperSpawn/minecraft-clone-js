
let inventory = [];
let creativeMode = false;


let classes = ["empty", "dirt", "grass", "cobblestone", "stone"
, "log", "leaf", "water", "lava"];


const blockGrid = document.querySelector('#block-grid');
const toolBar = document.querySelector('#tools-bar');
const hotbar = document.querySelector('#hotbar');


function loadEmptyTemplate(swidth, sheight) {
    let i, j;
    let width = Math.floor(swidth / 40);
    let height = Math.floor(sheight / 40);

    for(i = 0; i < height; ++i) {
        let children = document.createElement('div');
        for(j = 0; j < width; ++j) {
            let div = document.createElement('div');
            div.classList.add('block');
            div.classList.add('empty');
            div.setAttribute('block-type', 'empty');
            children.appendChild(div);
        }
        children.classList.add('row');
        blockGrid.appendChild(children);
    }
}

function loadInventory() {
    if(creativeMode === true) {
        let i;
        for(i = 0; i < classes.length; ++i) {
            inventory[i] = "inf";
        }           
    }
    else {
        let i;
        for(i = 0; i < classes.length; ++i) {
            inventory[i] = 0;
        }
    }
}




function addBlockButtons() {
    let children = blockGrid.children;
    let i, j;
    for(i = 0; i < children.length; ++i) {
        let grandchildren = children[i].children;
        for(j = 0; j < grandchildren.length; ++j) {
            grandchildren[j].addEventListener("click", function(e) {
                e.target.classList.add("dirt");
            });
        }
    }
}

loadEmptyTemplate(screen.width, screen.height);
addBlockButtons();

function updateScreen(); 



