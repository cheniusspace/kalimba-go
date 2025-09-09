"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = Card;
var react_1 = require("react");
function Card(_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b, title = _a.title;
    return (<div className={"bg-white rounded-lg shadow-md p-6 ".concat(className)}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      {children}
    </div>);
}
