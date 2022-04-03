package cordova.plugin.ankiaddcard.AnkiDroidCardAdd;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

/** Some fields to store configuration details for AnkiDroid **/
final class AnkiDroidConfig {
    public static final String DECK_NAME = "Anki Image Occlusion";
    public static final String MODEL_NAME = "anki-image-occlusion";
    public static final Set<String> TAGS = new HashSet<>(Collections.singletonList("Img-occlusion"));
    public static final String[] FIELDS = {"id","Header","Image","Question Mask","Footer","Remarks",
            "Sources","Extra 1", "Extra 2", "Answer Mask", "Original Image"};
    public static final String[] CARD_NAMES = {"Question>Answer"};
    public static final String CSS = "/* GENERAL CARD STYLE */\n" +
            ".card {\n" +
            "font-family: \"Helvetica LT Std\", Helvetica, Arial, Sans;\n" +
            "font-size: 150%;\n" +
            "text-align: center;\n" +
            "color: black;\n" +
            "background-color: white;\n" +
            "}\n" +
            "\n" +
            "/* OCCLUSION CSS START - don't edit this */\n" +
            "#io-overlay {\n" +
            "position:absolute;\n" +
            "top:0;\n" +
            "width:100%;\n" +
            "z-index:3\n" +
            "}\n" +
            "\n" +
            "#io-original {\n" +
            "position:relative;\n" +
            "top:0;\n" +
            "width:100%;\n" +
            "z-index:2;\n" +
            "visibility: hidden;\n" +
            "}\n" +
            "\n" +
            "#io-wrapper {\n" +
            "position:relative;\n" +
            "width: 100%;\n" +
            "}\n" +
            "/* OCCLUSION CSS END */\n" +
            "\n" +
            "/* OTHER STYLES */\n" +
            "#io-header{\n" +
            "font-size: 1.1em;\n" +
            "margin-bottom: 0.2em;\n" +
            "}\n" +
            "\n" +
            "#io-footer{\n" +
            "max-width: 80%;\n" +
            "margin-left: auto;\n" +
            "margin-right: auto;\n" +
            "margin-top: 0.8em;\n" +
            "font-style: italic;\n" +
            "}\n" +
            "\n" +
            "#io-extra-wrapper{\n" +
            "/* the wrapper is needed to center the\n" +
            "left-aligned blocks below it */\n" +
            "width: 80%;\n" +
            "margin-left: auto;\n" +
            "margin-right: auto;\n" +
            "margin-top: 0.5em;\n" +
            "}\n" +
            "\n" +
            "#io-extra{\n" +
            "text-align:center;\n" +
            "display: inline-block;\n" +
            "}\n" +
            "\n" +
            ".io-extra-entry{\n" +
            "margin-top: 0.8em;\n" +
            "font-size: 0.9em;\n" +
            "text-align:left;\n" +
            "}\n" +
            "\n" +
            ".io-field-descr{\n" +
            "margin-bottom: 0.2em;\n" +
            "font-weight: bold;\n" +
            "font-size: 1em;\n" +
            "}\n" +
            "\n" +
            "#io-revl-btn {\n" +
            "font-size: 0.5em;\n" +
            "}\n" +
            "\n" +
            "/* ADJUSTMENTS FOR MOBILE DEVICES */\n" +
            "\n" +
            ".mobile .card, .mobile #content {\n" +
            "font-size: 120%;\n" +
            "margin: 0;\n" +
            "}\n" +
            "\n" +
            ".mobile #io-extra-wrapper {\n" +
            "width: 95%;\n" +
            "}\n" +
            "\n" +
            ".mobile #io-revl-btn {\n" +
            "font-size: 0.8em;\n" +
            "}";
    // Template for the question of each card
    static final String QFMT1 = "{{#Image}}\n" +
            "<div id=\"io-header\">{{Header}}</div>\n" +
            "<div id=\"io-wrapper\">\n" +
            "<div id=\"io-overlay\">{{Question Mask}}</div>\n" +
            "<div id=\"io-original\">{{Image}}</div>\n" +
            "</div>\n" +
            "<div id=\"io-footer\">{{Footer}}</div>\n" +
            "\n" +
            "<script>\n" +
            "// Prevent original image from loading before mask\n" +
            "aFade = 50, qFade = 0;\n" +
            "var mask = document.querySelector('#io-overlay>img');\n" +
            "function loaded() {\n" +
            "var original = document.querySelector('#io-original');\n" +
            "original.style.visibility = \"visible\";\n" +
            "}\n" +
            "if (mask === null || mask.complete) {\n" +
            "loaded();\n" +
            "} else {\n" +
            "mask.addEventListener('load', loaded);\n" +
            "}\n" +
            "</script>\n" +
            "{{/Image}}";

    public static final String[] QFMT = {QFMT1};
    // Template for the answer (use identical for both sides)
    static final String AFMT1 = "{{#Image}}\n" +
            "<div id=\"io-header\">{{Header}}</div>\n" +
            "<div id=\"io-wrapper\">\n" +
            "<div id=\"io-overlay\">{{Answer Mask}}</div>\n" +
            "<div id=\"io-original\">{{Image}}</div>\n" +
            "</div>\n" +
            "{{#Footer}}<div id=\"io-footer\">{{Footer}}</div>{{/Footer}}\n" +
            "<button id=\"io-revl-btn\" onclick=\"toggle();\">Toggle Masks</button>\n" +
            "<div id=\"io-extra-wrapper\">\n" +
            "<div id=\"io-extra\">\n" +
            "{{#Remarks}}\n" +
            "<div class=\"io-extra-entry\">\n" +
            "<div class=\"io-field-descr\">Remarks</div>{{Remarks}}\n" +
            "</div>\n" +
            "{{/Remarks}}\n" +
            "{{#Sources}}\n" +
            "<div class=\"io-extra-entry\">\n" +
            "<div class=\"io-field-descr\">Sources</div>{{Sources}}\n" +
            "</div>\n" +
            "{{/Sources}}\n" +
            "{{#Extra 1}}\n" +
            "<div class=\"io-extra-entry\">\n" +
            "<div class=\"io-field-descr\">Extra 1</div>{{Extra 1}}\n" +
            "</div>\n" +
            "{{/Extra 1}}\n" +
            "{{#Extra 2}}\n" +
            "<div class=\"io-extra-entry\">\n" +
            "<div class=\"io-field-descr\">Extra 2</div>{{Extra 2}}\n" +
            "</div>\n" +
            "{{/Extra 2}}\n" +
            "</div>\n" +
            "</div>\n" +
            "\n" +
            "<script>\n" +
            "// Toggle answer mask on clicking the image\n" +
            "var toggle = function() {\n" +
            "var amask = document.getElementById('io-overlay');\n" +
            "if (amask.style.display === 'block' || amask.style.display === '')\n" +
            "amask.style.display = 'none';\n" +
            "else\n" +
            "amask.style.display = 'block'\n" +
            "}\n" +
            "\n" +
            "// Prevent original image from loading before mask\n" +
            "aFade = 50, qFade = 0;\n" +
            "var mask = document.querySelector('#io-overlay>img');\n" +
            "function loaded() {\n" +
            "var original = document.querySelector('#io-original');\n" +
            "original.style.visibility = \"visible\";\n" +
            "}\n" +
            "if (mask === null || mask.complete) {\n" +
            "loaded();\n" +
            "} else {\n" +
            "mask.addEventListener('load', loaded);\n" +
            "}\n" +
            "</script>\n" +
            "{{/Image}}";
    public static final String[] AFMT = {AFMT1};
}