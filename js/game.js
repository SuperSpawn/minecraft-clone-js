
let creativeMode = false;

let selectedObject = 0;
let selectedMode = 'tool';

let classes = ["empty", "dirt", "grass", "cobblestone", "stone"
, "log", "leaf", "water", "lava"];


const tools = {
    'pickaxe': ["cobblestone", "stone"],
    'shovel': ["dirt", "grass"],
    'axe': ["log"],
    'bucket': ["water"],
    'shears': ["leaf"],
    'bucket-water': ["empty"],
    'bucket-lava': ["empty"]
};
const afterTools = {
    'bucket-water': 'water',
}
const toolAfterUse = {
    'bucket-water': 'bucket',
    'bucket': 'bucket-water'
}


//call function upon click


const blockGrid = document.querySelector('#block-grid');
const toolBar = document.querySelector('#tools-bar');
const hotBar = document.querySelector('#hot-bar');

//init values
selectedObject = toolBar.querySelector('.pickaxe');;


function loadEmptyTemplate(width, height) {
    let i, j;

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

function sineNoise(value, intensity) {
    return Math.sin(value) * intensity;
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function setSlotAt(x, y, type) {
    let children = blockGrid.children;
    let grandchildren = children[y].children;
    let slot = grandchildren[x];

    let oldType = slot.getAttribute('block-type');
    slot.setAttribute('block-type', type);
    slot.classList.remove(oldType);
    slot.classList.add(type);
}
function loadRandomWorld(width, height,
        maxGround, minGround,
        intensity,
        dirtMinDepth, dirtMaxDepth,
        levelLengthMin, levelLengthMax,
        levelDepthMin, levelDepthMax) {

    loadEmptyTemplate(width, height);

    let treePos = 4 + getRandomInt(width - 5);

    let startBlock = minGround + getRandomInt(maxGround - minGround);
    let i, j;

    for(i = 0; i < width; ++i) {
        let levelLength = levelLengthMin + getRandomInt(levelLengthMax - levelLengthMin); 
        levelLength += i;
        while((i < levelLength) && (i < width)) {
            setSlotAt(i, startBlock, 'grass');
            let dirtDepth = dirtMinDepth + getRandomInt(dirtMaxDepth - dirtMinDepth);
            for(j = 1; j < dirtDepth; ++j) {
                setSlotAt(i, startBlock + j, 'dirt');
            }
            while(startBlock + j < height) {
                setSlotAt(i, startBlock + j, 'stone');
                ++j;
            }
            ++i;
        }
        --i;


        startBlock += (getRandomInt(levelDepthMax) - levelDepthMin);
        startBlock -= (getRandomInt(levelDepthMax) - levelDepthMin);
        if(startBlock > maxGround){
            startBlock = maxGround - getRandomInt(levelDepthMin);;
        }
        if(startBlock < minGround) {
            startBlock = minGround + getRandomInt(levelDepthMin);
        }
    }










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

function updateTool(tool) {
    if(toolAfterUse[tool] == undefined) return;
    let newState = toolAfterUse[tool];
    selectedObject.classList.remove(tool);
    selectedObject.setAttribute('tool-type', newState);
    selectedObject.classList.add(newState);
}

function interactWithTool(slot) {
    if(slot.getAttribute('block-type') == 'bedrock')
        return;
    let toolType = selectedObject.getAttribute('tool-type');
    let blockType = slot.getAttribute('block-type');

    //check if tool can be used on the slot
    if(tools[toolType].includes(blockType) === false) return;

    //add block to inventory
    if(creativeMode === false) {
        let i = getTypeFromInventory(blockType);
        ++i;
        setTypeFromInventory(blockType, i);
    }

    let after = afterTools[toolType];
    if(after == undefined) {
        after = 'empty';  
    } 

    slot.classList.remove(slot.getAttribute('block-type'));
    slot.setAttribute('block-type', after);
    slot.classList.add(after);
    updateTool(toolType);
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
    let theClass = selectedObject.getAttribute('block-type');
    console.log(theClass);

    let bottom = getBlockBelow(slot);
    if(bottom.getAttribute('block-type') == 'grass') {
        bottom.classList.remove('grass');
        bottom.classList.add('dirt');
        bottom.setAttribute('block-type', 'dirt');
    }
    let top = getBlockAbove(slot);
    if(top.getAttribute('block-type') != 'empty') {
        if(selectedObject.getAttribute('block-type') == 'grass') {
            theClass = 'dirt';
        }
    }


    slot.classList.remove('empty');
    slot.classList.add(theClass);
    slot.setAttribute('block-type', theClass);
}
function getBlockBelow(slot) {
    let column = slot.getAttribute('row');
    let cousins = slot.parentNode.nextSibling.children;
    let below = cousins[column];
    return below;
}
function getBlockAbove(slot) {
    let column = slot.getAttribute('row');
    let cousins = slot.parentNode.previousSibling.children;
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


loadRandomWorld(100,100,
    12, 8,
    0.01,
    2, 5, 2, 4, 1, 2);


addBlockButtons();
addHotBarButtons();
addToolBarButtons();

// function updateScreen()  






