// Helpers

const random = (length = 15) => {
    return Math.random().toString(16).substr(2, length);
};

/*
let log2 = console.log;
let log3 = console.error;
const log = (data, data2, data3) => {
    if (typeof(data) == "object") { data = JSON.stringify(data) }
    if (typeof(data2) == "object") { data2 = JSON.stringify(data2) }
    if (typeof(data3) == "object") { data3 = JSON.stringify(data3) }
    if (!data2) { data2 = "" } 
    if (!data3) { data3 = "" }
    $("#log").append($("<li>" + data + "," + data2 + "," + data3 + "</li>"));	
    log2(data, data2, data3);
    document.getElementById("log").scrollTop = document.getElementById("log").scrollHeight

};
console.log = log;
console.error  = log;
*/
(function() {
    var canvas = document.getElementById('game'),
            context = canvas.getContext('2d');

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight/1.5;

            /**
             * Your drawings need to be inside this function otherwise they will be reset when 
             * you resize the browser window and the canvas goes will be cleared.
             */
            drawStuff(); 
    }
    resizeCanvas();

    function drawStuff() {
            // do your drawing stuff here
    }
})();
