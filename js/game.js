
let creativeMode = true;

let selectedObject = 0;
let selectedMode = 'tool';

let classes = ["empty", "dirt", "grass", "cobblestone", "stone"
, "log", "leaf", "water", "lava"];


const tools = {
    'pickaxe': ["cobblestone", "stone"],
    'shovel': ["dirt", "grass"],
    'axe': ["log"],
    'bucket': ["lava", "water"],
    'shears': ["leaf"]
};




const blockGrid = document.querySelector('#block-grid');
const toolBar = document.querySelector('#tools-bar');
const hotBar = document.querySelector('#hot-bar');

//init values
selectedObject = toolBar.querySelector('.pickaxe');;


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
            div.setAttribute('row', j);
            children.appendChild(div);
        }
        children.classList.add('row');
        blockGrid.appendChild(children);
    }

    let finalRow = document.createElement('div');
    for(i = 0; i < width; ++i) {
        let div = document.createElement('div');
        div.classList.add('block');
        div.classList.add('bedrock');
        div.setAttribute('block-type', 'bedrock');
        finalRow.appendChild(div);
    }
    finalRow.classList.add('row');
    blockGrid.appendChild(finalRow);
}



function getTypeFromInventory(type) {
    let i;
    let children = hotBar.children;
    for(i = 0; i < children.length; i++) {
        if(children[i].getAttribute('block-type') == type) {
            let value = children[i].innerHTML;
            value = Number.parseInt(value);
            return value;
        }
    }
}
function setTypeFromInventory(type, number) {
    let i;
    let children = hotBar.children;
    for(i = 0; i < children.length; i++) {
        if(children[i].getAttribute('block-type') == type) {
            children[i].innerHTML = number;
        }
    }
}


function interactWithTool(slot) {
    if(slot.getAttribute('block-type') == 'bedrock')
        return;
    let toolType = selectedObject.getAttribute('tool-type');
    let blockType = slot.getAttribute('block-type');

    //check if tool can be used on the slot
    if(tools[toolType].includes(blockType) === false) return;

    //add block to inventory
    if(creativeMode === true) {
        let i = getTypeFromInventory(blockType);
        ++i;
        setTypeFromInventory(blockType, i);
    }

    slot.classList.remove(slot.getAttribute('block-type'));
    slot.setAttribute('block-type', 'empty');
    slot.classList.add("empty");
}
function interactWithBlock(slot) {
    if(slot.getAttribute('block-type') == 'empty') {
        let blockType = selectedObject.getAttribute('block-type');
        let blockStock = getTypeFromInventory(blockType);
        
        if(creativeMode == true) {
            unsafeInteractWithBlock(slot);
            return; 
        }
        
        if(blockStock == 0){
            return;
        } 
        --blockStock;
        setTypeFromInventory(blockType, blockStock);
        unsafeInteractWithBlock(slot);
    }
}
function unsafeInteractWithBlock(slot) {
    slot.classList.remove('empty');
    slot.classList.add(selectedObject.getAttribute('block-type'));
    slot.setAttribute('block-type', selectedObject.getAttribute('block-type'));

    let bottom = getBlockBelow(slot);
    if(bottom.getAttribute('block-type') == 'grass') {
        bottom.classList.remove('grass');
        bottom.classList.add('dirt');
        bottom.setAttribute('block-type', 'dirt');
    }
}
function getBlockBelow(slot) {
    let column = slot.getAttribute('row');
    let cousins = slot.parentNode.nextSibling.children;
    let below = cousins[column];
    return below;
}

function interactWithSlot(slot) {
    
    if(selectedMode == 'tool') {
        interactWithTool(slot);        
    }
    else if(selectedMode == 'block') {
        interactWithBlock(slot);      
    }

}

function addBlockButtons() {
    let children = blockGrid.children;
    let i, j;
    for(i = 0; i < children.length; ++i) {
        let grandchildren = children[i].children;
        for(j = 0; j < grandchildren.length; ++j) {
            grandchildren[j].addEventListener("click", function(e) {
                interactWithSlot(e.target);            
            });
        }
    }
}

function addToolBarButtons() {
    let children = toolBar.children;
    for(i = 0; i < children.length; ++i) {
        children[i].addEventListener("click", function(e) {
            selectedMode = 'tool';
            selectedObject.classList.remove("selected");
            selectedObject.classList.add("unselected");
            selectedObject = e.target;
            selectedObject.classList.add("selected");
        });
    }
}
function addHotBarButtons() {
    let children = hotBar.children;
    for(i = 0; i < children.length; ++i) {
        children[i].addEventListener("click", function(e) {
            selectedMode = 'block';
            selectedObject.classList.remove("selected");
            selectedObject.classList.add("unselected");
            selectedObject = e.target;
            selectedObject.classList.add("selected");
        });
    }
}


loadEmptyTemplate(screen.width, screen.height);
addBlockButtons();
addHotBarButtons();
addToolBarButtons();

// function updateScreen()  

