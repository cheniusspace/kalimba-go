"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = Button;
var react_1 = require("react");
function Button(_a) {
    var children = _a.children, onClick = _a.onClick, _b = _a.variant, variant = _b === void 0 ? 'primary' : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    var baseClasses = 'px-4 py-2 rounded font-medium transition-colors';
    var variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300'
    };
    return (<button className={"".concat(baseClasses, " ").concat(variantClasses[variant], " ").concat(className)} onClick={onClick}>
      {children}
    </button>);
}
