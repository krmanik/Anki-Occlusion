/* Do not remove
GPL 3.0 License

Copyright (c) 2020 Mani

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

function createGroupCloze() {
    createGroup(addedList);
}

var origSVG = "";
function createOrigSvg() {
    var child = document.getElementById("SVG101").childNodes;

    for (j = 0; j < child.length; j++) {

        if (child[j].tagName == "rect" || child[j].tagName == "polygon" || child[j].tagName == "ellipse") {
            origSVG += child[j].outerHTML;
        }
    }
}

var svgQues = "";
function createQuesSvg() {
    var child = document.getElementById("SVG101").childNodes;

    for (j = 0; j < child.length; j++) {
        if (child[j].tagName == "rect" || child[j].tagName == "polygon" || child[j].tagName == "ellipse") {
            svgQues += child[j].outerHTML;
        }
    }
}

/* Download */
async function createGroup(list) {

    var child = document.getElementById("SVG101").childNodes;

    var csvLine = "";
    var svgAns = "";

    // remove selection
    for (i = 0; i < child.length; i++) {
        try {
            if (child[i].tagName == "rect" || child[i].tagName == "polygon" || child[i].tagName == "ellipse") {
                var svgEle = SVG.adopt(document.getElementById(child[i].id))
                svgEle.selectize(false);
            }
        } catch (e) {
            console.log("error");
        }
    }

    var removedSvgList = [];
    // remove selected rect to create answer mask
    for (j = 0; j < list.length; j++) {
        document.getElementById(list[j]).style.fill = originalColor;
        removedSvgList.push(document.getElementById(list[j]).outerHTML);
        document.getElementById(list[j]).outerHTML = "";
    }

    // add remaining to answer mask
    for (j = 0; j < child.length; j++) {
        if (child[j].tagName == "rect" || child[j].tagName == "polygon" || child[j].tagName == "ellipse") {
            svgAns += child[j].outerHTML;
        }
    }

    // add removed svg again to svg main
    for (i = 0; i < removedSvgList.length; i++) {
        document.getElementById("SVG101").innerHTML += removedSvgList[i];
    }

    removedSvgList = [];

    // again allow selection
    for (i = 0; i < child.length; i++) {
        try {
            if (child[i].tagName == "rect" || child[i].tagName == "polygon" || child[i].tagName == "ellipse") {
                var svgEle = SVG.adopt(document.getElementById(child[i].id))
                svgEle.selectize(true);
                svgEle.draggable(true);
                svgEle.resize(true);
            }
        } catch (e) {
            console.log("error");
        }
    }

    // add time stamp
    var timeStamp = new Date().getTime();

    // origin mask
    //console.log("orig " + origSVG);
    var origFileName = "cordova-img-occ-orig-" + timeStamp;
    await saveSVG(origFileName, origSVG, imgHeight, imgWidth);
    oneTime = false;
    origSVG = "";

    // Question Mask
    var quesFileName = "cordova-img-occ-ques-" + timeStamp;
    //console.log("Ques " + svgQues);

    await saveSVG(quesFileName, svgQues, imgHeight, imgWidth);
    svgQues = "";

    // Answer mask
    var ansFileName = "cordova-img-occ-ans-" + timeStamp;
    //console.log("ans " + svgAns);

    await saveSVG(ansFileName, svgAns, imgHeight, imgWidth);

    // get all input note from form
    getNoteFromForm();

    var noteId = "cordova-img-occ-note-" + timeStamp;

    csvLine = noteId +
        "\t" + noteHeader +
        "\t" + "<img src='" + originalImageName + "'></img>" +
        "\t" + "<img src='" + quesFileName + ".svg'></img>" +
        "\t" + noteFooter +
        "\t" + noteRemarks +
        "\t" + noteSources +
        "\t" + noteExtra1 +
        "\t" + noteExtra2 +
        "\t" + "<img src='" + ansFileName + ".svg'></img>" +
        "\t" + "<img src='" + origFileName + ".svg'></img>" + "\n";
        
    addCsvLineToViewNote(csvLine);

    var origImgSVG = "<img src='" + originalImageName + "'></img>";
    var quesImgSVG = "<img src='" + quesFileName + ".svg'></img>";
    var ansImgSVG = "<img src='" + ansFileName + ".svg'></img>";
    var origFile = "<img src='" + origFileName + ".svg'></img>";

    var cardData = [noteId, noteHeader, origImgSVG, quesImgSVG, noteFooter, noteRemarks, noteSources, noteExtra1, noteExtra2, ansImgSVG, origFile];

    if (storageSvg == "AnkiDroid/collection.media/") {
        addCardToAnkiDroid(cardData);
        document.getElementById("more-tools").style.display = "none";
    } else {
        showSnackbar("Storage location is not set to AnkiDroid.")
    }

    //reset all
    svgGroup = "";
    addedList = [];
}