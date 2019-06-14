"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var subproviders_1 = require("@0x/subproviders");
/**
 * This class implements the [web3-provider-engine](https://github.com/MetaMask/provider-engine)
 * subprovider interface.
 * It passes remaining requests down to the injected provider i.e. MetaMask or a mobile wallet provider.
 */
var PassthroughSubprovider = /** @class */ (function (_super) {
    __extends(PassthroughSubprovider, _super);
    /**
     * Instantiates a new PassthroughSubprovider
     * @param provider Web3 provider that should handle all remaining requests, i.e. MetaMask
     */
    function PassthroughSubprovider(provider) {
        var _this = _super.call(this) || this;
        if (!('sendAsync' in provider)) {
            provider.sendAsync = function () {
                return this.send.apply(provider, arguments);
            };
        }
        _this._provider = provider;
        return _this;
    }
    /**
     * This method conforms to the web3-provider-engine interface.
     * It is called internally by the ProviderEngine when it is this subproviders
     * turn to handle a JSON RPC request.
     * @param payload JSON RPC payload
     * @param next Callback to call if this subprovider decides not to handle the request
     * @param end Callback to call if subprovider handled the request and wants to pass back the request.
     */
    // tslint:disable-next-line:prefer-function-over-method async-suffix
    PassthroughSubprovider.prototype.handleRequest = function (payload, next, end) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    this._provider.sendAsync(payload, function (error, result) {
                        if (error) {
                            return end(error, null);
                        }
                        if (result && result.error) {
                            if ('message' in result.error) {
                                return end(new Error(result.error.message), null);
                            }
                            return end(new Error(result.error), null);
                        }
                        if (!result || !result.result) {
                            return end(new Error('Error performing ' + payload.method), null);
                        }
                        end(null, result.result);
                    });
                }
                catch (err) {
                    end(err);
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * This method conforms to the provider sendAsync interface.
     * Allowing the PassthroughSubprovider to be used as a generic provider (outside of Web3ProviderEngine)
     * @param payload JSON RPC payload
     * @return The contents nested under the result key of the response body
     */
    PassthroughSubprovider.prototype.sendAsync = function (payload, callback) {
        var _this = this;
        void this.handleRequest(payload, 
        // handleRequest has decided to not handle this, so fall through to the provider
        function () {
            var sendAsync = _this._provider.sendAsync.bind(_this._provider);
            sendAsync(payload, callback);
        }, 
        // handleRequest has called end and will handle this
        function (err, data) {
            err ? callback(err) : callback(null, __assign({}, payload, { result: data }));
        });
    };
    return PassthroughSubprovider;
}(subproviders_1.Subprovider));
exports.PassthroughSubprovider = PassthroughSubprovider;
//# sourceMappingURL=passthrough_subprovider.js.map