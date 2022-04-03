var cropper;
var isCropping = false;
function cropImage() {

    if (document.getElementById('uploadPreview') == undefined) {
        showSnackbar("Add image first");
        return;
    }
        
    if (document.getElementById('uploadPreview').src == "") {
        showSnackbar("Add image first");
        return;
    }

    isCropping = !isCropping; 
    if (isCropping) {
        document.getElementById("cropImageBtnIcon").style.color = "#fdd835";
        var image = document.getElementById('uploadPreview');
        cropper = new Cropper(image, {
        }); 
    } else {
        document.getElementById("cropImageBtnIcon").style.color = "#039be5";
        if (cropper != undefined) {
            performCrop();
        }
    }
}

function performCrop() {
    scaleVar = 1.0;
    var timeStamp = new Date().getTime();
    var imageCaptureName = "image-occlusion-capture-" + timeStamp + ".jpg"

    croppedImgSrc = cropper.getCroppedCanvas({
    }).toDataURL();

    var cropImg = new Image();
    cropImg.src = croppedImgSrc;

    cropImg.title = imageCaptureName;
    cropImg.type = "image/jpeg";
    cropImg.id = "uploadPreview";
    cropImg.style.webkitTransformOriginX = "0%";
    cropImg.style.webkitTransformOriginY = "0%";
    originalImageName = cropImg.title;

    cropImg.height = cropper.getData().height;
    cropImg.width = cropper.getData().width;

    imgWidth = cropImg.width;
    imgHeight = cropImg.height;

    cropper.destroy();

    document.getElementById('drawing').innerHTML = cropImg.outerHTML;
  
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
}