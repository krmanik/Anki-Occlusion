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

var combineList = [];
var combineColor = "#2196F3";
document.addEventListener('click', function (e) {
    //console.log(e.target.id);
    selectedElement = e.target.id;

    if (clozeMode == "combine") {
        document.getElementById("addState").onclick = function () {
            if (document.getElementById("addState").value == "false") {
                document.getElementById("addState").value = true;
                document.getElementById("iconGroup").style.color = "#FF6F00";
            } else {
                document.getElementById("addState").value = false;
                document.getElementById("iconGroup").style.color = "#607d8b";

                if (svgGroup != "") {


                } else {
                    showSnackbar("Add rectangles to a group first");
                }
            }
        }

        if (document.getElementById("addState").value == "true") {

            document.getElementById("combine-done-btn").style.display = "none";
            document.getElementById("merge-rect-btn").style.pointerEvents = "none";
            document.getElementById("merge-rect-btn").style.color = "#e0e0e0";

            try {
                if ((document.getElementById(selectedElement).tagName == "rect" && document.getElementById(selectedElement).parentElement.tagName == "svg")
                    || document.getElementById(selectedElement).tagName == "ellipse" || document.getElementById(selectedElement).tagName == "polygon") {
                    svgGroup = "added";

                    var c = hexToRgb(originalColor);
                    var color = "rgb(" + c.r + ", " + c.g + ", " + c.b + ")";
                    if (document.getElementById(selectedElement).style.fill == "" || document.getElementById(selectedElement).style.fill == color) {
                        document.getElementById(selectedElement).style.fill = combineColor; //questionColor;
                        combineList.push(selectedElement);
                    } else {

                        // if again tap then remove from list
                        for (i = 0; i < combineList.length; i++) {
                            if (selectedElement == combineList[i]) {
                                document.getElementById(selectedElement).style.fill = originalColor;
                                combineList.splice(i, 1);
                                break;
                            }
                        }
                        if (combineList.length == 0) {
                            svgGroup = "";
                        }
                    }
                }

            } catch (e) {
                console.log(e);
            }
        } else {
            document.getElementById("group-done-btn").style.display = "none";

            document.getElementById("merge-rect-btn").style.pointerEvents = "unset";
            document.getElementById("merge-rect-btn").style.color = "#607d8b";

            if (document.getElementById("add-note").style.height == "100%" || document.getElementById("settingsSideNav").style.height == "100%"
                || document.getElementById("viewHelpSideNav").style.height == "100%" || document.getElementById("viewNoteSideNav").style.height == "100%") {
                document.getElementById("done-btn").style.display = "none";
                document.getElementById("combine-done-btn").style.display = "none";
            } else {
                document.getElementById("combine-done-btn").style.display = "block";
            }
        }
    } // combine cloze

}, false);


function changeRectFillInsideG(gChild) {
    var gHTML = "";
    //console.log(gChild);

    var children = gChild.childNodes;
    for (l = 0; l < children.length; l++) {
        var c = children[l].getAttribute("fill");

        children[l].setAttribute("fill", questionColor);

        gHTML += children[l].outerHTML;

        children[l].setAttribute("fill", c);

    }
    return gHTML;
}

// question & answer mask of <rect> tag 
var origFileName = "";
async function createCombineCloze() {

    //showSnackbar("Also download notes from side menu.");

    var child = document.getElementById("SVG101").childNodes;

    var oneTime = true;
    var csvLine = "";

    // get all group element for origSvg
    var gCombinedOrigTag = "";
    for (k = 0; k < child.length; k++) {
        if (child[k].tagName == "g" && child[k].getAttribute("data-type") == "combine") {
            gCombinedOrigTag += child[k].outerHTML;
        }
    }

    // get all rect for creating ques
    var rectOrigSvg = "";
    for (i = 0; i < child.length; i++) {
        // don't add svg with 0 width and 0 height
        if (child[i].getBBox().height != 0 && child[i].getBBox().width != 0) {
            if (child[i].tagName == "rect" || child[i].tagName == "ellipse" || child[i].tagName == "polygon") {
                rectOrigSvg += child[i].outerHTML;
            }
        }
    }

    for (i = 0; i < child.length; i++) {

        var origSVG = "";
        var svgQues = "";
        var svgAns = "";

        var groupSvgQues = "";
        var groupSvgAns = "";

        // don't add svg with 0 width and 0 height
        if (child[i].getBBox().height != 0 && child[i].getBBox().width != 0) {
            for (j = 0; j < child.length; j++) {

                if (child[j].tagName == "rect" || child[j].tagName == "ellipse" || child[j].tagName == "polygon") {

                    child[j].style.fill = originalColor;

                    origSVG += child[j].outerHTML;
                    origSVG += gCombinedOrigTag;
                    svgQues += gCombinedOrigTag;
                    svgAns += gCombinedOrigTag;

                    if (i == j) {

                        child[j].style.fill = questionColor;

                        svgQues += child[j].outerHTML;

                        child[j].style.fill = originalColor;

                    } else {

                        svgQues += child[j].outerHTML;
                        svgAns += child[j].outerHTML;
                    }
                } else if (child[j].tagName == "g" && child[j].getAttribute("data-type") == "combine") {
                    if (i == j) {
                        groupSvgQues += changeRectFillInsideG(child[j]);
                    } else {
                        groupSvgQues += child[j].outerHTML;
                        groupSvgAns += child[j].outerHTML;
                    }
                }
            }

            // add time stamp
            var timeStamp = new Date().getTime();

            if ((child[i].tagName == "rect" || child[i].tagName == "ellipse" || child[i].tagName == "polygon")
                || child[i].tagName == "g" && child[i].getAttribute("data-type") == "combine") {

                if (oneTime) {
                    // origin mask
                    //console.log("orig " + origSVG);
                    origFileName = "cordova-img-occ-orig-" + timeStamp;
                    saveSVG(origFileName, origSVG, imgHeight, imgWidth);
                    oneTime = false;
                }

                // Question Mask
                var quesFileName = "cordova-img-occ-ques-" + timeStamp;

                // Answer mask
                var ansFileName = "cordova-img-occ-ans-" + timeStamp;

                if (child[i].tagName == "rect") {
                    await saveSVG(quesFileName, svgQues, imgHeight, imgWidth);
                    await saveSVG(ansFileName, svgAns, imgHeight, imgWidth);
                } else if (child[i].tagName == "g" && child[i].getAttribute("data-type") == "combine") {
                    groupSvgQues += rectOrigSvg;
                    groupSvgAns += rectOrigSvg;

                    await saveSVG(quesFileName, groupSvgQues, imgHeight, imgWidth);
                    await saveSVG(ansFileName, groupSvgAns, imgHeight, imgWidth);
                }


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

                // var f = "output-note" + note_num + ".txt";
                // exportFile(csvLine, f);
                // note_num++;

                addCsvLineToViewNote(csvLine);
            }
        }
    }
}


function htmlExcludingThisG(gChild) {
    var html = "";
    var child = document.getElementById("SVG101").childNodes;
    for (k = 0; k < child.length; k++) {
        if (child[k].tagName == "g" && child[k].getAttribute("data-type") == "combine") {
            if (gChild.id == child[k].id) {
                html += child[k].outerHTML;
            }
        }
    }
    return html;
}

function createGroupWithNewRects() {

    if (combineList.length > 0) {

        var group = draw.group();

        for (i = 0; i < combineList.length; i++) {
            var svgEleRect = SVG.adopt(document.getElementById(combineList[i]));
            svgEleRect.selectize(false);

            var elemFigure = document.getElementById(combineList[i]);

            if (elemFigure.tagName == "rect") {

                var box = elemFigure.getBBox();
                var x = box.x;
                var y = box.y;
                var w = box.width;
                var h = box.height;
                var fColor = elemFigure.style.fill;
                group.add(draw.rect(w, h).move(x, y).fill(fColor));

            } else if (elemFigure.tagName == "ellipse") {

                var rx = parseInt(elemFigure.getAttribute("rx"));
                var ry = parseInt(elemFigure.getAttribute("ry"));
                var cx = Math.abs(rx - parseInt(elemFigure.getAttribute("cx")));
                var cy = Math.abs(ry - parseInt(elemFigure.getAttribute("cy")));
                rx = 2 * rx;
                ry = 2 * ry;
                var fColor = elemFigure.style.fill;
                group.add(draw.ellipse(rx, ry).move(cx, cy).fill(fColor));

            } else if (elemFigure.tagName == "polygon") {

                var points = elemFigure.getAttribute("points");
                var fColor = elemFigure.style.fill;
                group.add(draw.polygon(points).fill(fColor));

            }

            elemFigure.outerHTML = "";
	
            for (l=0; l<polygonStack.length; l++) {	
                if (combineList[i] == polygonStack[l]['node'].id) {	
                    polygonStack.splice(l, 1);	
                }	
            }
        }

        group.selectize(true);
        group.draggable(true);

        var e = document.getElementById(group.id());
        e.setAttribute("data-type", "combine");

        polygonStack.push(group);

        // reset
        combineList = [];
    } else {
        showSnackbar("Add rectangles to list first");
    }
}


function colorPalette() {
    if (document.getElementById("color-palette-header").style.display == "none") {
        document.getElementById("color-palette-header").style.display = "block";
    } else {
        document.getElementById("color-palette-header").style.display = "none";
    }
}

function changeColorPalette(e) {
    combineColor = e.getAttribute("color");
    colorPalette();
}
