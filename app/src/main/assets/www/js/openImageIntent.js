document.addEventListener('deviceready', setupOpenwith, false);

function setupOpenwith() {

    // Increase verbosity if you need more logs
    //cordova.openwith.setVerbosity(cordova.openwith.DEBUG);

    // Initialize the plugin
    cordova.openwith.init(initSuccess, initError);

    function initSuccess() { console.log('init success!'); }
    function initError(err) { console.log('init failed: ' + err); }

    // Define your file handler
    cordova.openwith.addHandler(myHandler);

    function myHandler(intent) {
        console.log('intent received');

        // console.log('  action: ' + intent.action); // type of action requested by the user
        // console.log('  exit: ' + intent.exit); // if true, you should exit the app after processing


        if (intent.items.length > 0) {
            cordova.openwith.load(intent.items[0], function (data, item) {

                // data is a long base64 string with the content of the file
                // console.log("data " + data + " bytes");

                addImageFromIntent(data);

                // "exit" when done.
                // Note that there is no need to wait for the upload to finish,
                // the app can continue while in background.
                if (intent.exit) { cordova.openwith.exit(); }
            });
        }
        else {
            if (intent.exit) { cordova.openwith.exit(); }
        }
    }
}


function addImageFromIntent(data) {
    scaleVar = 1.0;

    polygonStack = [];
    undoStack = [];

    var timeStamp = new Date().getTime();
    var imageCaptureName = "image-occlusion-from-intent-" + timeStamp + ".jpg"
    document.getElementById("drawing").innerHTML = "<img id='uploadPreview' style='-webkit-transform-origin-x: 0%; -webkit-transform-origin-y: 0%;'/>";

    var imgtag = document.getElementById("uploadPreview");
    imgtag.src = "data:image/jpeg;base64," + data;
    imgtag.title = imageCaptureName;
    imgtag.type = "image/jpeg";
    originalImageName = imgtag.title;

    const img = new Image();
    img.src = "data:image/jpeg;base64," + data;
    img.onload = function () {
        imgWidth = img.naturalWidth;
        imgHeight = img.naturalHeight;

        console.log('imgWidth: ', imgWidth);
        console.log('imgHeight: ', imgHeight);
        saveSelectedImageToAnkiDroid();

        draw = SVG('drawing')
            .height(imgHeight)
            .width(imgWidth)
            .id("SVG101")

        document.getElementById("SVG101").style.webkitTransformOriginX = "0%";
        document.getElementById("SVG101").style.webkitTransformOriginY = "0%";

        resetZoom();
    };
}


