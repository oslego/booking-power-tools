/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _presets = __webpack_require__(1);

var _presets2 = _interopRequireDefault(_presets);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.addEventListener('beforeunload', async function (e) {
  chrome.runtime.sendMessage({ task: "restart" });
});

document.querySelector('#host').innerHTML = '<bpt-presets>hello</bpt-presets>';

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Create a class for the element
var BPTPresets = function (_HTMLElement) {
  _inherits(BPTPresets, _HTMLElement);

  function BPTPresets() {
    _classCallCheck(this, BPTPresets);

    var _this = _possibleConstructorReturn(this, (BPTPresets.__proto__ || Object.getPrototypeOf(BPTPresets)).call(this));
    // Always call super first in constructor


    var css = '\n      :host{\n        font-family: -apple-system, BlinkMacSystemFont, \u201CSegoe UI\u201D, Roboto, Helvetica, Arial, sans-serif;\n      }\n\n      * {\n        box-sizing: border-box;\n      }\n\n      .presets {\n        outline: 1px solid blue;\n        padding: 7px;\n      }\n\n      label {\n        display: block;\n        margin-bottom: 5px;\n        padding: 3px 0 2px;\n        font-size: 0.9em;\n        color: #003580;\n        font-weight: bold;\n      }\n\n      .button {\n        border: none;\n        padding: 7px 10px;\n        color: white;\n        font-weight: 500;\n        text-transform: uppercase;\n        border-radius: 2px;\n        cursor: pointer;\n      }\n\n      .button--positive {\n        background: #43A047;\n      }\n\n      .button--danger {\n        background: #D32F2F;\n      }\n\n      select {\n        width: 100%;\n        font-size: 14px;\n        margin-bottom: 10px;\n      }\n\n      input {\n        width: 100%;\n        font-size: 14px;\n        margin: 0;\n      }\n\n      .link {\n        color: #07c;\n        font-size: 13px;\n      }\n\n      .link:hover {\n        text-decoration: none;\n      }\n\n      .link--quiet,\n      .quiet {\n        color: #838383;\n      }\n\n      .u-center {\n        text-align: center;\n      }\n\n      .u-hidden {\n        display: none;\n      }\n\n      .link--quiet:hover{\n        color: #444;\n      }\n\n      .actionlist {\n        display: flex;\n        align-items: baseline;\n      }\n\n      .actionlist--packed-end {\n        justify-content: flex-end;\n      }\n\n      .actionlist--spaced {\n        justify-content: space-between;\n      }\n\n      #or-separator {\n        margin: 10px 0;\n      }\n\n    ';

    var template = '\n      <div class="presets">\n\n        <div id="container-use-preset">\n          <label for="use-preset">\n            Use saved filters preset:\n          </label>\n          <select name="preset" id="use-preset" class="preset__dropdown">\n            <option value="p0">Budget getaway</option>\n            <option value="p1">Road trip</option>\n            <option value="p2">Business trip</option>\n            <option value="p3">Romantic city break</option>\n          </select>\n        </div>\n\n        <a href="#" class="link" id="action-show-preset-form">\n          Save selected filters as preset\n        </a>\n\n        <form id="container-new-preset" class="u-hidden">\n          <label for="new-preset">\n            Create new preset:\n          </label>\n\n          <input type="text" name="new-preset" id="new-preset" placeholder="Name" />\n\n          <div class="quiet u-center" id="or-separator"> - OR - </div>\n\n          <label for="replace-preset">\n            Replace existing preset:\n          </label>\n\n          <select name="preset" id="replace-preset" class="preset__dropdown">\n            <option value="p0">Budget getaway</option>\n            <option value="p1">Road trip</option>\n            <option value="p2">Business trip</option>\n            <option value="p3">Romantic city break</option>\n          </select>\n\n          <div class="actionlist actionlist--spaced">\n            <a href="#" class="link link--quiet" id="action-cancel-save-preset">\n              Cancel\n            </a>\n\n            <button class="button button--positive" id="action-save-preset">\n              Save\n            </button>\n          </div>\n\n        </form>\n\n      </div>\n    ';

    // Create a shadow root
    var shadow = _this.attachShadow({ mode: 'open' });

    var style = document.createRange().createContextualFragment('<style>' + css + '</style>');
    var doc = document.createRange().createContextualFragment(template);

    var $ = doc.querySelector.bind(doc);
    var $$ = doc.querySelectorAll.bind(doc);

    var containerNewPreset = $('#container-new-preset');
    var containerUsePreset = $('#container-use-preset');

    var inputNewPreset = $('#new-preset');

    var actionShowPresetForm = $('#action-show-preset-form');
    var actionSavePreset = $('#action-save-preset');
    var actionCancelSavePreset = $('#action-cancel-save-preset');

    actionShowPresetForm.addEventListener('click', function (e) {
      e.preventDefault();
      // Hide prompt to trigger 'new preset' form; hide 'use preset' container
      // Show 'new preset' form.
      [actionShowPresetForm, containerNewPreset, containerUsePreset].map(function (el) {
        return el.classList.toggle('u-hidden');
      });
      inputNewPreset.focus();
    });

    actionCancelSavePreset.addEventListener('click', function (e) {
      e.preventDefault();
      [actionShowPresetForm, containerNewPreset, containerUsePreset].map(function (el) {
        return el.classList.toggle('u-hidden');
      });
    });

    actionSavePreset.addEventListener('click', function (e) {
      e.preventDefault();
      [actionShowPresetForm, containerNewPreset, containerUsePreset].map(function (el) {
        return el.classList.toggle('u-hidden');
      });
    });

    // Add the link to the shadow root.
    shadow.appendChild(style);
    shadow.appendChild(doc);
    return _this;
  }

  return BPTPresets;
}(HTMLElement);

// Define the new element


customElements.define('bpt-presets', BPTPresets);

exports.default = BPTPresets;

/***/ })
/******/ ]);