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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var hyperHTML = function (globalDocument) {
  'use strict';

  /*! (c) 2017 Andrea Giammarchi @WebReflection, (MIT) */

  // ---------------------------------------------
  // hyperHTML Public API
  // ---------------------------------------------

  // The document must be swap-able at runtime.
  // Needed by both basicHTML and nativeHTML

  hyperHTML.document = globalDocument;

  // hyperHTML.bind(el) ⚡️
  function hyperHTML(template) {
    var hyper = hypers.get(this);
    if (!hyper || hyper.template !== (FF ? unique(template) : template)) {
      hyper = upgrade.apply(this, arguments);
      hypers.set(this, hyper);
    }
    update.apply(hyper.updates, arguments);
    return this;
  }

  // hyperHTML.adopt(el) 🐣
  hyperHTML.adopt = function adopt(node) {
    return function () {
      notAdopting = false;
      hyperHTML.apply(node, arguments);
      notAdopting = true;
      return node;
    };
  };

  // hyperHTML.escape('<html>') => '&lt;text&gt;'
  hyperHTML.escape = function escape(html) {
    return html.replace(reEscape, fnEscape);
  };

  // hyperHTML.wire(obj, 'type:ID') ➰
  hyperHTML.wire = function wire(obj, type) {
    return arguments.length < 1 ? wireContent('html') : obj == null ? wireContent(type || 'html') : wireWeakly(obj, type || 'html');
  };

  // - - - - - - - - - - - - - - - - - - - - - - -

  // ---------------------------------------------
  // Constants
  // ---------------------------------------------

  // Node.CONSTANTS
  // without assuming Node is globally available
  // since this project is used on the backend too
  var ELEMENT_NODE = 1;
  var ATTRIBUTE_NODE = 2;
  var TEXT_NODE = 3;
  var COMMENT_NODE = 8;
  var DOCUMENT_FRAGMENT_NODE = 11;

  // SVG related
  var OWNER_SVG_ELEMENT = 'ownerSVGElement';
  var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

  var SHOULD_USE_ATTRIBUTE = /^style$/i;
  var EXPANDO = '_hyper_html: ';
  var UID = EXPANDO + (Math.random() * new Date() | 0) + ';';
  var UIDC = '<!--' + UID + '-->';

  // ---------------------------------------------
  // DOM Manipulation
  // ---------------------------------------------

  // return -1 if no differences are found
  // the index where differences starts otherwise
  function indexOfDifferences(a, b) {
    var i = 0,
        aLength = a.length,
        bLength = b.length;
    while (i < aLength) {
      if (i < bLength && a[i] === b[i]) i++;else return i;
    }
    return i === bLength ? -1 : i;
  }

  // accordingly with the content type
  // it replace the content of a node
  // with the give child
  function populateNode(parent, child) {
    switch (child.nodeType) {
      case ELEMENT_NODE:
        var childNodes = parent.childNodes;
        if (childNodes[0] === child) {
          removeNodeList(childNodes, 1);
          break;
        }
        resetAndPopulate(parent, child);
        break;
      case DOCUMENT_FRAGMENT_NODE:
        if (indexOfDifferences(parent.childNodes, child.childNodes) !== -1) {
          resetAndPopulate(parent, child);
        }
        break;
      case TEXT_NODE:
        parent.textContent = child.textContent;
        break;
    }
  }

  // remove a list of nodes from startIndex to list.length
  function removeNodeList(list, startIndex) {
    var length = list.length,
        child;
    while (startIndex < length--) {
      child = list[length];
      child.parentNode.removeChild(child);
    }
  }

  // erase a node content and populate it
  function resetAndPopulate(parent, child) {
    parent.textContent = '';
    parent.appendChild(child);
  }

  // append childNodes to a node from a specific index
  function updateViaArray(node, childNodes, i) {
    var fragment = emptyFragment(node);
    if (i !== 0) {
      removeNodeList(node.childNodes, i);
      appendNodes(fragment, childNodes.slice(i));
      node.appendChild(fragment);
    } else {
      appendNodes(fragment, childNodes);
      resetAndPopulate(node, fragment);
    }
  }

  // ---------------------------------------------
  // hyperHTML Operations
  // ---------------------------------------------

  // `<div>${'any'}</div>`
  function setAnyContent(node) {
    return function any(value) {
      switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
        case 'string':
        case 'number':
        case 'boolean':
          node.innerHTML = value;
          break;
        case 'function':
          any(value(node, node.children, 0));
          break;
        default:
          if (isArray(value)) {
            var i,
                length = value.length;
            if (length === 1) {
              any(value[0]);
            } else {
              switch (length === 0 ? '' : _typeof(value[0])) {
                case 'string':
                case 'number':
                case 'boolean':
                  any(value.join(''));
                  break;
                case 'function':
                  var children = slice.call(node.children);
                  for (i = 0, length = value.length; i < length; i++) {
                    value[i] = value[i](node, children, i);
                  }
                  removeNodeList(children, i);
                  any(value.concat.apply([], value));
                  break;
                case 'object':
                  if (isArray(value[0])) {
                    value = value.concat.apply([], value);
                  }
                  if (isPromise_ish(value[0])) {
                    Promise.all(value).then(any);
                    break;
                  }
                default:
                  i = indexOfDifferences(node.childNodes, value);
                  if (i !== -1) updateViaArray(node, value, i);
                  break;
              }
            }
          } else if (isPromise_ish(value)) {
            value.then(any);
          } else {
            populateNode(node, value);
          }
          break;
      }
    };
  }

  // `<div class="${'attr'}"></div>`
  // `<div onclick="${function () {... }}"></div>`
  // `<div onclick="${{handleEvent(){ ... }}}"></div>`
  // `<div contenteditable="${true}"></div>`
  function setAttribute(attribute, removeAttributes) {
    var name = attribute.name,
        node = attribute.ownerElement,
        isEvent = /^on/.test(name),
        isSpecial = name in node && !(
    // always use set attribute with SVGs
    OWNER_SVG_ELEMENT in node || SHOULD_USE_ATTRIBUTE.test(name)),
        type = isEvent ? name.slice(2) : '',
        oldValue;
    if (isSpecial || isEvent) removeAttributes.push(node, name);
    return isEvent ? function eventAttr(newValue) {
      if (oldValue !== newValue) {
        if (oldValue) node.removeEventListener(type, oldValue, false);
        oldValue = newValue;
        if (newValue) node.addEventListener(type, newValue, false);
      }
    } : isSpecial ? function specialAttr(newValue) {
      if (oldValue !== newValue) {
        oldValue = newValue;
        // WebKit moves the cursor if input.value
        // is set again, even if same value
        if (node[name] !== newValue) {
          node[name] = newValue;
        }
      }
    } : function normalAttr(newValue) {
      if (oldValue !== newValue) {
        oldValue = newValue;
        // WebKit moves the cursor if input.value
        // is set again, even if same value
        if (attribute.value !== newValue) {
          attribute.value = newValue;
        }
      }
    };
  }

  // `<div> ${'text'} </div>`
  function setTextContent(node) {
    var oldValue;
    return function text(newValue) {
      if (oldValue !== newValue) {
        oldValue = newValue;
        node.textContent = newValue;
      }
    };
  }

  // `<li>a</li>${'virtual'}<li>c</li>`
  function setVirtualContent(node, childNodes) {
    return function anyVirtual(value) {
      switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
        case 'string':
        case 'number':
        case 'boolean':
          removeNodeList(childNodes, 0);
          var fragment = createFragment(node, value);
          childNodes = slice.call(fragment.childNodes);
          node.parentNode.insertBefore(fragment, node);
          break;
        case 'function':
          anyVirtual(value(node.parentNode, childNodes, 0));
          break;
        default:
          if (isArray(value)) {
            if (value.length === 0) {
              removeNodeList(childNodes, 0);
              childNodes = [];
            } else {
              switch (_typeof(value[0])) {
                case 'string':
                case 'number':
                case 'boolean':
                  anyVirtual(value.join(''));
                  break;
                case 'function':
                  var parentNode = node.parentNode;
                  for (var i = 0, length = value.length; i < length; i++) {
                    value[i] = value[i](parentNode, childNodes, i);
                  }
                  anyVirtual(value.concat.apply([], value));
                  break;
                case 'object':
                  if (isArray(value[0])) {
                    value = value.concat.apply([], value);
                  }
                  if (isPromise_ish(value[0])) {
                    Promise.all(value).then(anyVirtual);
                    break;
                  }
                default:
                  updateVirtualNodes(node, childNodes, value);
                  break;
              }
            }
          } else if (isPromise_ish(value)) {
            value.then(anyVirtual);
          } else {
            updateVirtualNodes(node, childNodes, value.nodeType === DOCUMENT_FRAGMENT_NODE ? slice.call(value.childNodes) : [value]);
          }
          break;
      }
    };
  }

  // ---------------------------------------------
  // DOM Traversing
  // ---------------------------------------------

  // look for attributes that contains the comment text
  function attributesSeeker(node, paths) {
    for (var attribute, value = IE ? UID : UIDC, attributes = node.attributes, i = 0, length = attributes.length; i < length; i++) {
      attribute = attributes[i];
      if (attribute.value === value) {
        paths.push(Path('attr',
        // with IE the order doesn't really matter
        // as long as the right attribute is addressed
        IE ? node.attributes[IEAttributes.shift()] : attribute));
      }
    }
  }

  // walk the fragment tree in search of comments
  function commentsSeeker(node, paths) {
    for (var child, text, childNodes = node.childNodes, length = childNodes.length, i = 0; i < length; i++) {
      child = childNodes[i];
      switch (child.nodeType) {
        case ELEMENT_NODE:
          attributesSeeker(child, paths);
          commentsSeeker(child, paths);
          break;
        case COMMENT_NODE:
          if (child.textContent === UID) {
            if (length === 1) {
              paths.push(Path('any', node));
            } else if ((i < 1 || childNodes[i - 1].nodeType === ELEMENT_NODE) && (i + 1 === length || childNodes[i + 1].nodeType === ELEMENT_NODE)) {
              paths.push(Path('virtual', child));
            } else {
              text = createText(child, '');
              child.parentNode.replaceChild(text, child);
              paths.push(Path('text', text));
            }
          }
          break;
        case TEXT_NODE:
          if (SHOULD_USE_ATTRIBUTE.test(node.nodeName) && child.textContent === UIDC) {
            paths.push(Path('text', node));
          }
          break;
      }
    }
  }

  // ---------------------------------------------
  // Features detection / ugly UA sniffs
  // ---------------------------------------------
  var featureFragment = createDocumentFragment(globalDocument);

  // Firefox < 55 has non standard template literals.
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1108941
  // TODO: is there any better way to feature detect this ?
  var FF = (typeof navigator === 'undefined' ? 'undefined' : _typeof(navigator)) === 'object' && /Firefox\/(\d+)/.test(navigator.userAgent) && parseFloat(RegExp.$1) < 55;

  // If attributes order is shuffled, threat the browser differently
  // Usually this is a well known IE only limitation but some older FF does the same.
  var IE = function () {
    var p = globalDocument.createElement('p');
    p.innerHTML = '<i data-i="" class=""></i>';
    return (/class/i.test(p.firstChild.attributes[0].name)
    );
  }();

  // beside IE, old WebKit browsers don't have `children` in DocumentFragment
  var WK = !('children' in featureFragment);

  // ---------------------------------------------
  // Helpers
  // ---------------------------------------------

  // used to convert childNodes to Array
  var slice = [].slice;

  // used to sanitize html
  var reEscape = /[&<>'"]/g;
  var oEscape = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  };
  function fnEscape(m) {
    return oEscape[m];
  }

  // return a single node or an Array or nodes
  function createContent(node) {
    for (var child, content = [], childNodes = node.childNodes, i = 0, length = childNodes.length; i < length; i++) {
      child = childNodes[i];
      if (child.nodeType === ELEMENT_NODE || trim.call(child.textContent).length !== 0) {
        content.push(child);
      }
    }
    return content.length === 1 ? content[0] : content;
  }

  // just a minifier friendly indirection
  function createDocumentFragment(document) {
    return document.createDocumentFragment();
  }

  // given a node, inject some html and return
  // the resulting template document fragment
  function createFragment(node, html) {
    return (OWNER_SVG_ELEMENT in node ? createSVGFragment : createHTMLFragment)(node, html);
  }

  // create fragment for HTML
  function createHTMLFragment(node, html) {
    var fragment;
    var document = node.ownerDocument;
    var container = document.createElement('template');
    var hasContent = 'content' in container;
    var needsTableWrap = false;
    if (!hasContent) {
      // DO NOT MOVE THE FOLLOWING LINE ELSEWHERE
      fragment = createDocumentFragment(document);
      // (a jsdom + nodejs tests coverage gotcha)

      // el.innerHTML = '<td></td>'; is not possible
      // if the content is a partial internal table content
      // it needs to be wrapped around once injected.
      // HTMLTemplateElement does not suffer this issue.
      needsTableWrap = /^[^\S]*?<(t(?:head|body|foot|r|d|h))/i.test(html);
    }
    if (needsTableWrap) {
      // secure the RegExp.$1 result ASAP to avoid issues
      // in case a non-browser DOM library uses RegExp internally
      // when HTML content is injected (basicHTML / jsdom / others...)
      var selector = RegExp.$1;
      container.innerHTML = '<table>' + html + '</table>';
      appendNodes(fragment, slice.call(container.querySelectorAll(selector)));
    } else {
      container.innerHTML = html;
      if (hasContent) {
        fragment = container.content;
      } else {
        appendNodes(fragment, slice.call(container.childNodes));
      }
    }
    return fragment;
  }

  // create a fragment for SVG
  function createSVGFragment(node, html) {
    var document = node.ownerDocument;
    var fragment = createDocumentFragment(document);
    var container = document.createElementNS(SVG_NAMESPACE, 'svg');
    container.innerHTML = html;
    appendNodes(fragment, slice.call(container.childNodes));
    return fragment;
  }

  // given a node, it does what is says
  function createText(node, text) {
    return node.ownerDocument.createTextNode(text);
  }

  // given an info, tries to find out the best option
  // to replace or update the content
  function discoverNode(parentNode, virtual, info, childNodes) {
    for (var target = parentNode, document = parentNode.ownerDocument, path = info.path, virtualNode = getNode(virtual, path), i = 0, length = path.length; i < length; i++) {
      switch (path[i++]) {
        case 'attributes':
          var name = virtualNode.name;
          if (!parentNode.hasAttribute(name)) {
            parentNode.setAttribute(name, '');
          }
          target = parentNode.attributes[name];
          break;
        case 'childNodes':
          switch (info.type) {
            // TODO: supports multiple text per element ?
            case 'text':
              var before = getTextContent(virtualNode, 'previous');
              var after = getTextContent(virtualNode, 'next');
              do {
                target = parentNode.firstChild;
                if (target && target.nodeType === TEXT_NODE) {
                  parentNode.removeChild(target);
                } else {
                  break;
                }
              } while (target);
              var fragment = createDocumentFragment(document);
              if (before.length) {
                fragment.appendChild(createText(parentNode, before));
              }
              target = fragment.appendChild(createText(parentNode, ''));
              if (after.length) {
                fragment.appendChild(createText(parentNode, after));
              }
              parentNode.insertBefore(fragment, parentNode.firstChild);
              break;
            // TODO: supports multiple virtual content per element ?
            case 'virtual':
              var children = getChildren(parentNode);
              var virtualChildren = getChildren(virtualNode.parentNode);
              target = previousElementSibling(virtualNode);
              var before = target ? path.indexOf.call(virtualChildren, target) + 1 : -1;
              target = nextElementSibling(virtualNode);
              var after = target ? path.indexOf.call(virtualChildren, target) : -1;
              target = document.createComment(UID);
              switch (true) {
                // `${'virtual'}` is actually resolved as `${'any'}`
                // case before < 0 && after < 0: before = 0;

                // `</a>${'virtual'}`
                case after < 0:
                  after = children.length;
                  break;
                // `${'virtual'}<b>`
                case before < 0:
                  before = 0;
                // `</a>${'virtual'}<b>`
                default:
                  after = -(virtualChildren.length - after);
                  break;
              }
              childNodes.push.apply(childNodes, slice.call(children, before, after));
              parentNode.insertBefore(target, childNodes.length ? nextElementSibling(childNodes[childNodes.length - 1]) : slice.call(children, after)[0]);
              if (childNodes.length === 0) {
                removePreviousText(parentNode, target);
              }
              break;
          }
          break;
        default:
          // if the node is not there, create it
          target = getChildren(parentNode)[path[i]] || parentNode.appendChild(parentNode.ownerDocument.createElement(getNode(virtual, path.slice(0, i + 1)).nodeName));
          parentNode = target;
          break;
      }
    }
    return target;
  }

  // create an empty fragment from a generic node
  function emptyFragment(node) {
    return createDocumentFragment(node.ownerDocument);
  }

  // given a node, returns text content before it or after it
  function getTextContent(node, direction) {
    var content = [];
    var method = direction === 'next' ? content.push : content.unshift;
    do {
      node = node[direction + 'Sibling'];
      if (node && node.nodeType === TEXT_NODE) {
        method.call(content, node.textContent);
      } else {
        return content.join('');
      }
    } while (true);
  }

  // quick and dirty Promise check
  function isPromise_ish(value) {
    return value != null && 'then' in value;
  }

  // remove a list of [node, attribute]
  function removeAttributeList(list) {
    for (var i = 0, length = list.length; i < length; i++) {
      list[i++].removeAttribute(list[i]);
    }
  }

  // remove all text nodes from a virtual space
  function removePreviousText(parentNode, node) {
    var previousSibling = node.previousSibling;
    if (previousSibling && previousSibling.nodeType === TEXT_NODE) {
      parentNode.removeChild(previousSibling);
      removePreviousText(parentNode, node);
    }
  }

  // specify the content to update
  function setContent(type, target, removeAttributes, childNodes) {
    var update;
    switch (type) {
      case 'any':
        update = setAnyContent(target);
        break;
      case 'attr':
        update = setAttribute(target, removeAttributes);
        break;
      case 'text':
        update = setTextContent(target);
        break;
      case 'virtual':
        update = setVirtualContent(target, childNodes);
        break;
    }
    return update;
  }

  // update partially or fully the list of virtual nodes
  // it modifies in place the childNodes list if necessary
  function updateVirtualNodes(node, childNodes, value) {
    var i = indexOfDifferences(childNodes, value);
    if (i !== -1) {
      var fragment = emptyFragment(node);
      removeNodeList(childNodes, i);
      childNodes.splice(i);
      value = value.slice(i);
      appendNodes(fragment, value);
      node.parentNode.insertBefore(fragment, node);
      childNodes.push.apply(childNodes, value);
    }
  }

  // used for common path creation.
  function Path(type, node) {
    return { type: type, path: createPath(node) };
  }

  // ---------------------------------------------
  // Hybrid Shims
  // ---------------------------------------------

  // WeakMap with partial EXPANDO fallback
  var $WeakMap = (typeof WeakMap === 'undefined' ? 'undefined' : _typeof(WeakMap)) === (typeof $WeakMap === 'undefined' ? 'undefined' : _typeof($WeakMap)) ? function () {
    return {
      get: function get(obj) {
        return obj[EXPANDO];
      },
      set: function set(obj, value) {
        Object.defineProperty(obj, EXPANDO, {
          configurable: true,
          value: value
        });
      }
    };
  } : WeakMap;

  // Map with partial double Array fallback
  var $Map = (typeof Map === 'undefined' ? 'undefined' : _typeof(Map)) === (typeof $Map === 'undefined' ? 'undefined' : _typeof($Map)) ? function () {
    var k = [],
        v = [];
    return {
      get: function get(obj) {
        return v[k.indexOf(obj)];
      },
      // being used with unique template literals
      // there is never a case when a value is overwritten
      // no need to check upfront for the indexOf
      set: function set(obj, value) {
        v[k.push(obj) - 1] = value;
      }
    };
  } : Map;

  // TODO: which browser needs these partial polyfills here?

  // BB7 and webOS need this
  var isArray = Array.isArray || function () {
    var toString = {}.toString;
    // I once had an engine returning [array Array]
    // and I've got scared since!
    var s = toString.call([]);
    return function (a) {
      return toString.call(a) === s;
    };
  }();

  // older WebKit need this
  var trim = EXPANDO.trim || function () {
    return this.replace(/^\s+|\s+$/g, '');
  };

  // ---------------------------------------------
  // Shared variables
  // ---------------------------------------------

  // normalize Firefox issue with template literals
  var templateObjects, unique;
  if (FF) {
    templateObjects = Object.create(null);
    unique = function unique(template) {
      var key = template.join(UID);
      return templateObjects[key] || (templateObjects[key] = template);
    };
  }

  // use native .append(...childNodes) where available
  var appendNodes = 'append' in featureFragment ? function (node, childNodes) {
    node.append.apply(node, childNodes);
  } : function appendNodes(node, childNodes) {
    for (var i = 0, length = childNodes.length; i < length; i++) {
      node.appendChild(childNodes[i]);
    }
  };

  // traps function bind once (useful in destructuring)
  var bind = hyperHTML.bind;
  hyperHTML.bind = function () {
    return bind.apply(hyperHTML, arguments);
  };

  // returns children or retrieve them in IE/Edge
  var getChildren = WK ? function (node) {
    for (var child, children = [], childNodes = node.childNodes, j = 0, i = 0, length = childNodes.length; i < length; i++) {
      child = childNodes[i];
      if (child.nodeType === ELEMENT_NODE) children[j++] = child;
    }
    return children;
  } : function (node) {
    return node.children;
  };

  // return the correct node walking through a path
  // fixes IE/Edge issues with attributes and children (fixes old WebKit too)
  var getNode = IE || WK ? function (parentNode, path) {
    for (var name, i = 0, length = path.length; i < length; i++) {
      name = path[i++];
      switch (name) {
        case 'children':
          parentNode = getChildren(parentNode)[path[i]];
          break;
        default:
          parentNode = parentNode[name][path[i]];
          break;
      }
    }
    return parentNode;
  } : function (parentNode, path) {
    for (var i = 0, length = path.length; i < length; i++) {
      parentNode = parentNode[path[i++]][path[i]];
    }
    return parentNode;
  };

  // fixes IE problems with comments
  if (IE) {
    var IEAttributes;
    var no = new RegExp('([^\\S][a-z]+[a-z0-9_-]*=)([\'"])' + UIDC + '\\2', 'g');
    var comments = function comments($0, $1, $2) {
      IEAttributes.push($1.slice(1, -1));
      return $1 + $2 + UID + $2;
    };
  }

  // IE/Edge gotcha with comment nodes
  var nextElementSibling = IE ? function (node) {
    node = node.nextSibling;
    return node && node.nodeType === ELEMENT_NODE ? node : undefined;
  } : function (node) {
    return node.nextElementSibling;
  };

  var previousElementSibling = IE ? function (node) {
    node = node.previousSibling;
    return node && node.nodeType === ELEMENT_NODE ? node : undefined;
  } : function (node) {
    return node.previousElementSibling;
  };

  // [element] = {template, updates};
  var hypers = new $WeakMap();

  // [element] = {template, updates};
  var wires = new $WeakMap();

  // [template] = {fragment, paths};
  var templates = new $Map();

  // internal signal to switch adoption
  var notAdopting = true;

  // IE 11 has problems with cloning templates too
  // it "forgets" empty childNodes
  var cloneNode = function () {
    featureFragment.appendChild(createText(featureFragment, 'g'));
    featureFragment.appendChild(createText(featureFragment, ''));
    return featureFragment.cloneNode(true).childNodes.length === 1 ? function (node) {
      for (var clone = node.cloneNode(), childNodes = node.childNodes || [], i = 0, length = childNodes.length; i < length; i++) {
        clone.appendChild(cloneNode(childNodes[i]));
      }
      return clone;
    } : function (fragment) {
      return fragment.cloneNode(true);
    };
  }();

  // ---------------------------------------------
  // Template related utilities
  // ---------------------------------------------

  // given a unique template object
  // create, parse, and store retrieved info
  function createTemplate(template) {
    var paths = [];
    var html = template.join(UIDC);
    if (IE) {
      IEAttributes = [];
      html = html.replace(no, comments);
    }
    var fragment = createFragment(this, html);
    var info = { fragment: fragment, paths: paths };
    commentsSeeker(fragment, paths);
    templates.set(template, info);
    return info;
  }

  // given a generic node, returns a path capable
  // of retrieving such path back again.
  // TODO: worth passing the index when available ?
  function createPath(node) {
    var path = [];
    var parentNode;
    switch (node.nodeType) {
      case ELEMENT_NODE:
      case DOCUMENT_FRAGMENT_NODE:
        parentNode = node;
        break;
      case TEXT_NODE:
      case COMMENT_NODE:
        parentNode = node.parentNode;
        path.unshift('childNodes', path.indexOf.call(parentNode.childNodes, node));
        break;
      case ATTRIBUTE_NODE:
      default:
        // jsdom here does not provide a nodeType 2 ...
        parentNode = node.ownerElement;
        path.unshift('attributes', node.name);
        break;
    }
    for (node = parentNode; parentNode = parentNode.parentNode; node = parentNode) {
      path.unshift('children', path.indexOf.call(getChildren(parentNode), node));
    }
    return path;
  }

  // given a root node and a list of paths
  // creates an array of updates to invoke
  // whenever the next interpolation happens
  function createUpdates(fragment, paths) {
    for (var info, target, updates = [], removeAttributes = [], i = 0, length = paths.length; i < length; i++) {
      info = paths[i];
      target = getNode(fragment, info.path);
      if (target.nodeType === DOCUMENT_FRAGMENT_NODE) {
        removeNodeList(target.childNodes, 0);
        target = this;
      }
      updates[i] = setContent(info.type, target, removeAttributes, []);
    }
    removeAttributeList(removeAttributes);
    return updates;
  }

  // like createUpdates but for nodes with already a content
  function discoverUpdates(fragment, paths) {
    for (var info, childNodes, updates = [], removeAttributes = [], i = 0, length = paths.length; i < length; i++) {
      childNodes = [];
      info = paths[i];
      updates[i] = setContent(info.type, discoverNode(this, fragment, info, childNodes), removeAttributes, childNodes);
    }
    removeAttributeList(removeAttributes);
    return updates;
  }

  // invokes each update function passing interpolated value
  function update() {
    for (var i = 1, length = arguments.length; i < length; i++) {
      this[i - 1](arguments[i]);
    }
  }

  // create a template, if unknown
  // upgrade a node to use such template for future updates
  function upgrade(template) {
    if (FF) template = unique(template);
    var updates;
    var info = templates.get(template) || createTemplate.call(this, template);
    if (notAdopting) {
      var fragment = cloneNode(info.fragment);
      updates = createUpdates.call(this, fragment, info.paths);
      resetAndPopulate(this, fragment);
    } else {
      updates = discoverUpdates.call(this, info.fragment, info.paths);
    }
    return { template: template, updates: updates };
  }

  // ---------------------------------------------
  // Wires
  // ---------------------------------------------

  // create a new wire for generic DOM content
  function wireContent(type) {
    var adopter, content, container, fragment, render, setup, template;

    function before(document) {
      fragment = createDocumentFragment(document);
      container = type === 'svg' ? document.createElementNS(SVG_NAMESPACE, 'svg') : fragment;
      render = hyperHTML.bind(container);
    }

    function after() {
      if (setup) {
        setup = false;
        if (type === 'svg') {
          appendNodes(fragment, slice.call(container.childNodes));
        }
        content = createContent(fragment);
      }
      return content;
    }

    return type === 'adopt' ? function adopt(statics) {
      var args = arguments;
      if (FF) statics = unique(statics);
      if (template !== statics) {
        setup = true;
        template = statics;
        adopter = function adopter(parentNode, children, i) {
          if (setup) {
            if (i < children.length) {
              container = children[i];
              fragment = {
                ownerDocument: container.ownerDocument,
                childNodes: [container],
                children: [container]
              };
              render = hyperHTML.adopt(fragment);
            } else {
              if (OWNER_SVG_ELEMENT in parentNode) type = 'svg';
              before(parentNode.ownerDocument);
            }
          }
          render.apply(null, args);
          return after();
        };
      }
      return adopter;
    } : function update(statics) {
      if (FF) statics = unique(statics);
      if (template !== statics) {
        setup = true;
        template = statics;
        before(hyperHTML.document);
      }
      render.apply(null, arguments);
      return after();
    };
  }

  // setup a weak reference if needed and return a wire by ID
  function wireWeakly(obj, type) {
    var wire = wires.get(obj);
    var i = type.indexOf(':');
    var id = type;
    if (-1 < i) {
      id = type.slice(i + 1);
      type = type.slice(0, i) || 'html';
    }
    if (!wire) {
      wire = {};
      wires.set(obj, wire);
    }
    return wire[id] || (wire[id] = wireContent(type));
  }

  // ---------------------------------------------
  // ⚡️ ️️The End ➰
  // ---------------------------------------------
  return hyperHTML;
}(document);

// umd.KISS
try {
  module.exports = hyperHTML;
} catch (o_O) {}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _presets = __webpack_require__(2);

var _presets2 = _interopRequireDefault(_presets);

var _booking = __webpack_require__(4);

var _booking2 = _interopRequireDefault(_booking);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var host = document.querySelector(_booking2.default.config.filterContainerSelector);

  if (!host) {
    console.warn('Did not find host: ' + _booking2.default.config.filterContainerSelector);
    return;
  }

  function onRuntimeMessage(message, sender, callback) {
    var handlers = {
      "tabupdated": onURLChange
    };

    try {
      handlers[message.name].call(this, message);
    } catch (err) {
      // message unhandled
      // console.warn(message, err)
    }
  }

  function onURLChange(data) {
    var url = new URL(data.tab.url);
    presets.setAttribute('value', _booking2.default.getFiltersFromURL(url.search));
  }

  var port = chrome.runtime.connect(chrome.runtime.id);
  port.onMessage.addListener(onRuntimeMessage);

  var presetsData = [{
    name: 'Road trip',
    value: 'review_score=80;hotelfacility=2;'
  }, {
    name: 'Business trip',
    value: 'review_score=80;hotelfacility=107;hr_24=8;'
  }];

  var presets = new _presets2.default({ presets: presetsData });

  presets.addEventListener('presetchanged', function (e) {
    var url = _booking2.default.extendURLWithFilters(window.location.toString(), e.detail);
    window.location = url;
  });

  presets.addEventListener('presetcreated', function (e) {});
  presets.addEventListener('presetdeleted', function (e) {});

  // presets.setIntialState({presets: presetsData});
  presets.setAttribute('value', _booking2.default.getFiltersFromURL(window.location.search.toString()));

  host.prepend(presets);

  // Dev mode only. REMOVE BEFORE FLIGHT
  window.addEventListener('beforeunload', function (e) {
    chrome.runtime.sendMessage({ task: "restart" });
  });
})();

// chrome.storage.sync.set({'foo': 'hello', 'bar': 'hi'}, function() {
//   console.log('Settings saved');
// });

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['<style>', '</style><div class="presets">\n       <h3>Filter presets</h3>\n\n       <div>', '</div>\n\n       <div>', '</div>\n\n       <form id="container-new-preset" class="', '" onsubmit="', '">\n         <label for="new-preset">\n           Create new preset:\n         </label>\n\n         <input type="text" name="new-preset"\n           id="new-preset"\n           placeholder="Name"\n           value="', '"\n           oninput="', '" />\n\n         <div>', '</div>\n\n         <div class="actionlist actionlist--spaced">\n           <a href="#" class="link link--quiet" id="action-cancel-save-preset">\n             Cancel\n           </a>\n\n           <button class="button button--positive" id="action-save-preset" disabled="', '">\n             Save\n           </button>\n         </div>\n\n       </form>\n     </div>\n   '], ['<style>', '</style><div class="presets">\n       <h3>Filter presets</h3>\n\n       <div>', '</div>\n\n       <div>', '</div>\n\n       <form id="container-new-preset" class="', '" onsubmit="', '">\n         <label for="new-preset">\n           Create new preset:\n         </label>\n\n         <input type="text" name="new-preset"\n           id="new-preset"\n           placeholder="Name"\n           value="', '"\n           oninput="', '" />\n\n         <div>', '</div>\n\n         <div class="actionlist actionlist--spaced">\n           <a href="#" class="link link--quiet" id="action-cancel-save-preset">\n             Cancel\n           </a>\n\n           <button class="button button--positive" id="action-save-preset" disabled="', '">\n             Save\n           </button>\n         </div>\n\n       </form>\n     </div>\n   ']),
    _templateObject2 = _taggedTemplateLiteral(['\n     <p class="', '">You do not have any saved filter presets yet.</p>\n   '], ['\n     <p class="', '">You do not have any saved filter presets yet.</p>\n   ']),
    _templateObject3 = _taggedTemplateLiteral(['<span class="quiet">Select some filters to create a new preset.</span>'], ['<span class="quiet">Select some filters to create a new preset.</span>']),
    _templateObject4 = _taggedTemplateLiteral(['<a href="#" class="', '" id="action-show-preset-form">\n     Save selected filters as preset\n   </a>'], ['<a href="#" class="', '" id="action-show-preset-form">\n     Save selected filters as preset\n   </a>']),
    _templateObject5 = _taggedTemplateLiteral(['<div id="container-use-preset" class="', '">\n    <label for="use-preset">\n      Use preset:\n    </label>\n    <select name="preset" id="use-preset">\n      <option value="">None</option>', '</select>\n  </div>'], ['<div id="container-use-preset" class="', '">\n    <label for="use-preset">\n      Use preset:\n    </label>\n    <select name="preset" id="use-preset">\n      <option value="">None</option>', '</select>\n  </div>']),
    _templateObject6 = _taggedTemplateLiteral(['\n  <div class="quiet u-center" id="or-separator"> - OR - </div>\n    <label for="replace-preset">\n      Replace existing preset:\n    </label>\n\n    <select name="preset" id="replace-preset">\n      <option value="">None</option>', '</select>\n  '], ['\n  <div class="quiet u-center" id="or-separator"> - OR - </div>\n    <label for="replace-preset">\n      Replace existing preset:\n    </label>\n\n    <select name="preset" id="replace-preset">\n      <option value="">None</option>', '</select>\n  ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var hyperHTML = __webpack_require__(0);
var HyperHTMLElement = __webpack_require__(3);

// Create a class for the element

var Presets = function (_HyperHTMLElement) {
  _inherits(Presets, _HyperHTMLElement);

  function Presets() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Presets);

    var _this = _possibleConstructorReturn(this, (Presets.__proto__ || Object.getPrototypeOf(Presets)).call(this));
    // Always call super first in constructor


    var defaultState = {
      isFormVisible: false,
      isFormValid: false,
      filter: '',
      presetName: '',
      presets: []
    };

    _this.state = Object.assign({}, defaultState, state);

    console.log(_this.state);

    // Create a shadow root
    _this.shadow = _this.attachShadow({ mode: 'open' });

    // Delegate events to handleEvent()
    _this.shadowRoot.addEventListener('change', _this);
    _this.shadowRoot.addEventListener('click', _this);
    return _this;
  }

  _createClass(Presets, [{
    key: 'render',
    value: function render() {
      var css = '\n     :host{\n       font-family: -apple-system, BlinkMacSystemFont, \u201CSegoe UI\u201D, Roboto, Helvetica, Arial, sans-serif;\n     }\n\n     * {\n       box-sizing: border-box;\n     }\n\n     .presets {\n      //  padding: 7px;\n       margin-bottom: 20px;\n       font-size: 13px;\n     }\n\n     label {\n       display: block;\n       margin-bottom: 5px;\n       padding: 3px 0 2px;\n       font-size: 14px;\n       color: #003580;\n       font-weight: bold;\n     }\n\n     .button {\n       border: none;\n       padding: 7px 10px;\n       color: white;\n       font-weight: 500;\n       text-transform: uppercase;\n       border-radius: 2px;\n       cursor: pointer;\n     }\n\n     .button[disabled] {\n       cursor: default;\n       background: silver;\n       color: white;\n     }\n\n     .button--positive {\n       background: #43A047;\n     }\n\n     .button--danger {\n       background: #D32F2F;\n     }\n\n     select {\n       width: 100%;\n       font-size: 14px;\n       margin-bottom: 10px;\n     }\n\n     input {\n       width: 100%;\n       font-size: 14px;\n       margin: 0;\n       margin-bottom: 10px\n     }\n\n     .info {\n       background: #eaeaea;\n       padding: 5px;\n     }\n\n     .link {\n       color: #07c;\n       font-size: 13px;\n     }\n\n     .link:hover {\n       text-decoration: none;\n     }\n\n     .link--quiet,\n     .quiet {\n       color: #838383;\n     }\n\n     .u-center {\n       text-align: center;\n     }\n\n     .u-hidden {\n       display: none;\n     }\n\n     .link--quiet:hover{\n       color: #444;\n     }\n\n     .actionlist {\n       display: flex;\n       align-items: baseline;\n     }\n\n     .actionlist--packed-end {\n       justify-content: flex-end;\n     }\n\n     .actionlist--spaced {\n       justify-content: space-between;\n     }\n\n     #or-separator {\n       margin-bottm: 0;\n     }\n\n     h3 {\n       color: #003580;\n       padding: 0 0 0 2px;\n       margin: 0;\n       margin-bottom: 13px;\n       font-size: 20px;\n       line-height: 28px;\n       font-weight: 500\n     }\n   ';

      return this.html(_templateObject, css, this.state.presets.length === 0 ? this.NoPresetsTemplate() : this.UsePresetTemplate(), this.NewPresetPromptTemplate(), this.state.isFormVisible ? '' : 'u-hidden', this.onSaveNewPreset.bind(this), this.state.presetName, this.definePreset.bind(this), this.ReplacePresetTemplate(), this.state.isFormValid ? '' : 'disabled');
    }
  }, {
    key: 'NoPresetsTemplate',
    value: function NoPresetsTemplate() {
      return hyperHTML.wire()(_templateObject2, this.state.isFormVisible ? 'u-hidden info quiet' : 'info quiet');
    }
  }, {
    key: 'NewPresetPromptTemplate',
    value: function NewPresetPromptTemplate() {
      if (!this.state.filter) {
        return hyperHTML.wire()(_templateObject3);
      }

      return hyperHTML.wire()(_templateObject4, this.state.isFormVisible ? 'u-hidden link' : 'link');
    }
  }, {
    key: 'UsePresetTemplate',
    value: function UsePresetTemplate() {
      if (this.state.presets.length === 0) {
        return '';
      }

      return hyperHTML.wire()(_templateObject5, this.state.isFormVisible ? 'u-hidden' : '',
      // this.state.presets.map(preset => return OptionElement(preset))
      this.state.presets.map(function (preset) {
        return '<option value="' + preset.value + '" ' + (preset.selected ? 'selected' : '') + '>' + preset.name + '</option>';
      }));
    }
  }, {
    key: 'ReplacePresetTemplate',
    value: function ReplacePresetTemplate() {
      if (this.state.presets.length === 0) {
        return '';
      }

      return hyperHTML.wire()(_templateObject6, this.state.presets.map(function (preset) {
        return '<option value="' + preset.value + '" ' + (preset.selected ? 'selected' : '') + '>' + preset.name + '</option>';
      }));
    }

    // Monitor the attributes for changes.

  }, {
    key: 'attributeChangedCallback',


    // Respond to attribute changes.
    value: function attributeChangedCallback(attr, oldValue, newValue) {

      // Cast falsy values to explicit null
      newValue = newValue === "" ? null : newValue;
      newValue = newValue === "null" ? null : newValue;
      newValue = newValue === "undefined" ? null : newValue;

      if (attr == 'value') {
        // console.warn('value:', newValue, typeof newValue)

        var clone = Object.assign({}, this.state);
        // Define the current filter as the `value` attribute value.
        clone.filter = newValue;
        // Mark as selected any preset whose value matches the `value` attribute value.
        clone.presets = this.markSelectedPreset(clone.presets, newValue);

        this.setState(clone);
        return;
      }
    }
  }, {
    key: 'setState',
    value: function setState(state) {
      this.state = state;
      // console.info('State changed:', state)
      this.render();
    }

    /*
      Handler wrapper for UI events originating in this Custom Element.
    */

  }, {
    key: 'handleEvent',
    value: function handleEvent(e) {
      var _this2 = this;

      // console.log(e.type, e.target)

      // Group events by type and map them by target element ID to handler functions
      var handlers = {
        "change": {
          "use-preset": this.changePreset,
          "replace-preset": this.definePreset
        },
        "click": {
          "action-show-preset-form": this.togglePresetForm,
          "action-cancel-save-preset": [this.togglePresetForm, this.resetSelectedPreset]
        }

        // Get any callbacks associated with the event type and element ID
      };var cb = handlers[e.type][e.target.id];

      // Wrap single callback to array; empty array if no callback found;
      var cbArr = cb ? Array.isArray(cb) ? cb : [cb] : [];

      // Run all callbacks for given event type and element ID
      cbArr.map(function (cb) {
        return cb.call(_this2, e);
      });
    }
  }, {
    key: 'markSelectedPreset',
    value: function markSelectedPreset(presets, value) {
      return presets.map(function (preset) {
        preset.selected = preset.value === value;
        return preset;
      });
    }
  }, {
    key: 'changePreset',
    value: function changePreset(e) {
      var detail = e.target.value;
      this.dispatchEvent(new CustomEvent('presetchanged', { detail: detail }));
    }
  }, {
    key: 'resetSelectedPreset',
    value: function resetSelectedPreset() {
      var clone = Object.assign({}, this.state);
      // Mark the selected preset so the right `<option>` element gets selected on render.
      clone.presets = this.markSelectedPreset(clone.presets, this.state.filter);
      this.setState(clone);
    }
  }, {
    key: 'togglePresetForm',
    value: function togglePresetForm(e) {
      e.preventDefault();

      var clone = Object.assign({}, this.state);
      clone.isFormVisible = !clone.isFormVisible;
      this.setState(clone);
    }
  }, {
    key: 'definePreset',
    value: function definePreset(e) {
      var clone = Object.assign({}, this.state);
      var presetValue = '';

      // If picking a preset from the dropdown, reset the text input
      if (e.target.id === "replace-preset") {
        clone.presetName = '';
        presetValue = e.target.value;
      }

      // If defining a new preset name in the input, reset the dropdown
      if (e.target.id === "new-preset") {
        clone.presetName = e.target.value.trim();
        presetValue = '';
      }

      // Mark the selected preset so the right `<option>` element gets selected on render.
      clone.presets = this.markSelectedPreset(clone.presets, presetValue);

      // If input is empty or the "None" preset is selected, the form can't be submitted.
      clone.isFormValid = e.target.value.trim().length ? true : false;
      this.setState(clone);
    }
  }, {
    key: 'onSaveNewPreset',
    value: function onSaveNewPreset(e) {
      e.preventDefault();

      // Prevent submit if somehow reached here with invalid form.
      if (!this.state.isFormValid) {
        return;
      }

      var clone = Object.assign({}, this.state);

      // Create new preset with value of `this.state.filter`
      if (this.state.presetName.length !== 0) {
        clone.presets.push({
          name: this.state.presetName,
          value: this.state.filter
        });
      } else {
        var index = clone.presets.findIndex(function (preset) {
          return preset.selected === true;
        });

        if (index !== -1) {
          clone.presets[index].value = this.state.filter;
        }
      }

      // Mark the newly created or replaced filter as selected.
      clone.presets = this.markSelectedPreset(clone.presets, this.state.filter);

      clone.presetName = '';
      clone.isFormValid = false;
      clone.isFormVisible = false;

      this.setState(clone);
    }
  }, {
    key: 'connectedCallback',
    value: function connectedCallback() {
      this.render();
    }
  }], [{
    key: 'observedAttributes',
    get: function get() {
      return ['value'];
    }
  }]);

  return Presets;
}(HyperHTMLElement);

// Define the new element


customElements.define('bpt-presets', Presets);

exports.default = Presets;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HyperHTMLElement = function (defineProperty) {
  /*! (C) 2017 Andrea Giammarchi - ISC Style License */
  return function (_HTMLElement) {
    _inherits(HyperHTMLElement, _HTMLElement);

    function HyperHTMLElement() {
      _classCallCheck(this, HyperHTMLElement);

      return _possibleConstructorReturn(this, (HyperHTMLElement.__proto__ || Object.getPrototypeOf(HyperHTMLElement)).apply(this, arguments));
    }

    _createClass(HyperHTMLElement, [{
      key: 'html',


      // lazily bind once hyperHTML logic
      // to either the shadowRoot, if present and open,
      // the _shadowRoot property, if set due closed shadow root,
      // or the custom-element itself if no Shadow DOM is used.
      get: function get() {
        // ⚠️ defineProperty(this, 'html', {...}) would be the intent
        //    then you have to deal with IE11 and broken ES5 implementations
        //    where a getter in the prototype curses forever instances
        //    properties definition.
        return this.__hyperHTML || defineProperty(this, '__hyperHTML', {
          configurable: true,
          value: hyperHTML.bind(
          // in case of Shadow DOM {mode: "open"}, use it
          this.shadowRoot ||
          // in case of Shadow DOM {mode: "close"}, use it
          // this needs the following reference created upfront
          // this._shadowRoot = this.attachShadow({mode: "close"});
          this._shadowRoot ||
          // if no Shadow DOM is used, simply use the component
          // as container for its own content (it just works too)
          this)
        }).__hyperHTML;
      }
    }], [{
      key: 'define',


      // define a custom-element in the CustomElementsRegistry
      // class MyEl extends HyperHTMLElement {}
      // MyEl.define('my-el');
      value: function define(name) {
        var Class = this;
        var proto = Class.prototype;

        // if observedAttributes contains attributes to observe
        // HyperHTMLElement will directly reflect get/setAttribute
        // operation once these attributes are used, example:
        // el.observed = 123;
        // will automatically do
        // el.setAttribute('observed', 123);
        // triggering also the attributeChangedCallback
        (Class.observedAttributes || []).forEach(function (name) {
          if (!(name in proto)) defineProperty(proto, name.replace(/-([a-z])/g, function ($0, $1) {
            return $1.toUpperCase();
          }), {
            configurable: true,
            get: function get() {
              return this.getAttribute(name);
            },
            set: function set(value) {
              this.setAttribute(name, value);
            }
          });
        });

        var onChanged = proto.attributeChangedCallback;
        var hasChange = !!onChanged;

        // created() {} is the entry point to do whatever you want.
        // Once the node is live and upgraded as Custom Element.
        // This method grants to be triggered at the right time,
        // which is always once, and right before either
        // attributeChangedCallback or connectedCallback
        if ('created' in proto) {
          var created = proto.created;
          // used to ensure create() is called once and once only
          defineProperty(proto, '__init', {
            writable: true,
            value: true
          });

          // ⚠️ if you need to overwrite/change attributeChangedCallback method
          //    at runtime after class definition, be sure you do so
          //    via Object.defineProperty to preserve its non-enumerable nature.
          defineProperty(proto, 'attributeChangedCallback', {
            configurable: true,
            value: function value(name, prev, curr) {
              if (this.__init) {
                this.__init = false;
                created.call(this);
              }
              // ensure setting same value twice
              // won't trigger twice attributeChangedCallback
              if (hasChange && prev !== curr) {
                onChanged.apply(this, arguments);
              }
            }
          });

          // ⚠️ if you need to overwrite/change connectedCallback method
          //    at runtime after class definition, be sure you do so
          //    via Object.defineProperty to preserve its non-enumerable nature.
          var onConnected = proto.connectedCallback;
          var hasConnect = !!onConnected;
          defineProperty(proto, 'connectedCallback', {
            configurable: true,
            value: function value() {
              if (this.__init) {
                this.__init = false;
                this.created();
              }
              if (hasConnect) {
                onConnected.apply(this, arguments);
              }
            }
          });
        } else if (hasChange) {
          // ⚠️ if you need to overwrite/change attributeChangedCallback method
          //    at runtime after class definition, be sure you do so
          //    via Object.defineProperty to preserve its non-enumerable nature.
          defineProperty(proto, 'attributeChangedCallback', {
            configurable: true,
            value: function value(name, prev, curr) {
              // ensure setting same value twice
              // won't trigger twice attributeChangedCallback
              if (prev !== curr) {
                onChanged.apply(this, arguments);
              }
            }
          });
        }

        // whenever you want to directly use the component itself
        // as EventListener, you can pass it directly.
        // https://medium.com/@WebReflection/dom-handleevent-a-cross-platform-standard-since-year-2000-5bf17287fd38
        //  class Reactive extends HyperHTMLElement {
        //    oninput(e) { console.log(this, 'changed', e.target.value); }
        //    render() { this.html`<input oninput="${this}">`; }
        //  }
        if (!('handleEvent' in proto)) {
          // ⚠️ if you need to overwrite/change handleEvent method
          //    at runtime after class definition, be sure you do so
          //    via Object.defineProperty to preserve its non-enumerable nature.
          defineProperty(proto, 'handleEvent', {
            configurable: true,
            value: function value(event) {
              this['on' + event.type](event);
            }
          });
        }
        customElements.define(name, Class);
        return Class;
      }
    }]);

    return HyperHTMLElement;
  }(HTMLElement);
}(Object.defineProperty);

try {
  // try to export HyperHTMLElement as module
  module.exports = HyperHTMLElement;
  // if possible, also eventually require hyperHTML
  // and hoist it on the current scope
  var hyperHTML = hyperHTML || __webpack_require__(0);
} catch (o_O) {}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Booking = function () {
  function Booking() {
    _classCallCheck(this, Booking);
  }

  _createClass(Booking, null, [{
    key: 'getFiltersFromURL',
    value: function getFiltersFromURL(url) {
      var params = new URLSearchParams(url);
      return params.get(this.config.filterParamName);
    }
  }, {
    key: 'extendURLWithFilters',
    value: function extendURLWithFilters(url, filters) {
      var urlObj = new URL(url);
      urlObj.searchParams.set(this.config.filterParamName, filters);

      return '' + urlObj.origin + urlObj.pathname + '?' + urlObj.searchParams.toString();
    }
  }, {
    key: 'config',
    get: function get() {
      return {
        filterParamName: 'nflt', // name of search param for filters
        filterContainerSelector: '#filterbox_wrap' // container for filters on search page
      };
    }
  }]);

  return Booking;
}();

exports.default = Booking;

/***/ })
/******/ ]);