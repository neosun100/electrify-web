"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputOptionsToWindowOptions = outputOptionsToWindowOptions;
const crypto_1 = require("crypto");
function outputOptionsToWindowOptions(options, generateTabbingIdentifierIfMissing) {
    var _a, _b, _c;
    return {
        ...options,
        autoHideMenuBar: !options.showMenuBar,
        insecure: (_a = options.insecure) !== null && _a !== void 0 ? _a : false,
        tabbingIdentifier: generateTabbingIdentifierIfMissing
            ? (_b = options.tabbingIdentifier) !== null && _b !== void 0 ? _b : (0, crypto_1.randomUUID)()
            : options.tabbingIdentifier,
        zoom: (_c = options.zoom) !== null && _c !== void 0 ? _c : 1.0,
    };
}
//# sourceMappingURL=model.js.map