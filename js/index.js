
const normal = document.querySelector('#normal-button');
const creative = document.querySelector('#creative-button');


normal.addEventListener('click', function(e) {
    localStorage.setItem('creative', 'false');
    window.location = '../html/game.html';
});
creative.addEventListener('click', function(e) {
    localStorage.setItem('creative', 'true');
    window.location = '../html/game.html';
});