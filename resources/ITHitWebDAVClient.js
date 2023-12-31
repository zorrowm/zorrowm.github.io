// -----------------------------------------------------------------------
// IT Hit WebDAV Ajax Library v5.21.5887.0
// Copyright © 2020 IT Hit LTD. All rights reserved.
// License: https://www.webdavsystem.com/ajax/
// -----------------------------------------------------------------------

if ("undefined" === typeof ITHit) {
    (function () {
        this.ITHit = {
            _oComponents: {},
            _oNamespace: {},
            Define: function (_1) {
                this._oComponents[_1] = true;
            },
            Defined: function (_2) {
                return !!this._oComponents[_2];
            },
            Add: function (_3, _4) {
                var _5 = _3.split(".");
                var _6 = this;
                var _7 = _5.length;
                for (var i = 0; i < _7; i++) {
                    if ("undefined" === typeof _6[_5[i]]) {
                        if (i < (_7 - 1)) {
                            _6[_5[i]] = {};
                        } else {
                            _6[_5[i]] = _4;
                        }
                    } else {
                        if (!(_6[_5[i]] instanceof Object)) {
                            return;
                        }
                    }
                    _6 = _6[_5[i]];
                }
            },
            Temp: {}
        };
    })();
}
ITHit.Config = {
    Global: window,
    ShowOriginalException: true,
    PreventCaching: false
};
ITHit.Add("GetNamespace", function (_9, _a, _b) {
    var _c = ITHit.Utils;
    if (!_c.IsString(_9) && !_c.IsArray(_9)) {
        throw new ITHit.Exception("ITHit.GetNamespace() expected string as first parameter of method.");
    }
    var _d = _c.IsArray(_9) ? _9 : _9.split(".");
    var _e = _b || ITHit.Config.Global;
    for (var i = 0, _10 = ""; _e && (_10 = _d[i]); i++) {
        if (_10 in _e) {
            _e = _e[_10];
        } else {
            if (_a) {
                _e[_10] = {};
                _e = _e[_10];
            } else {
                _e = undefined;
            }
        }
    }
    return _e;
});
ITHit.Add("Namespace", function (_11, _12) {
    return ITHit.GetNamespace(_11, false, _12);
});
ITHit.Add("Declare", function (_13, _14) {
    return ITHit.GetNamespace(_13, true, _14);
});
ITHit.Add("DetectOS", function () {
    var _15 = navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform);
    var _16 = navigator.platform,
        _17 = {
            Windows: (-1 != _16.indexOf("Win")),
            MacOS: (-1 != _16.indexOf("Mac")),
            IOS: (/iPad|iPhone|iPod/.test(_16)) || _15,
            Linux: (-1 != _16.indexOf("Linux")),
            UNIX: (-1 != _16.indexOf("X11")),
            OS: null
        };
    if (_17.Windows) {
        _17.OS = "Windows";
    } else {
        if (_17.Linux) {
            _17.OS = "Linux";
        } else {
            if (_17.IOS) {
                _17.OS = "IOS";
            } else {
                if (_17.MacOS) {
                    _17.OS = "MacOS";
                } else {
                    if (_17.UNIX) {
                        _17.OS = "UNIX";
                    }
                }
            }
        }
    }
    return _17;
}());
ITHit.Add("DetectBrowser", function () {
    var _18 = navigator.userAgent,
        _19 = {
            IE: false,
            FF: false,
            Chrome: false,
            Safari: false,
            Opera: false,
            Electron: false,
            Browser: null,
            Mac: false
        },
        _1a = {
            IE: {
                Search: "MSIE",
                Browser: "IE"
            },
            IE11: {
                Search: "Trident/7",
                Version: "rv",
                Browser: "IE"
            },
            Edge: {
                Search: "Edge",
                Browser: "Edge"
            },
            FF: {
                Search: ["Firefox", "FxiOS"],
                Browser: "FF"
            },
            Electron: {
                Search: "Electron",
                Browser: "Electron"
            },
            Chrome: {
                Search: "Chrome",
                Browser: "Chrome"
            },
            Safari: {
                Search: "Safari",
                Version: "Version",
                Browser: "Safari",
                Mac: "Macintosh",
                iPad: "iPad",
                iPhone: "iPhone"
            },
            Opera: {
                Search: "Opera",
                Browser: "Opera"
            }
        };
    for (var _1b in _1a) {
        var pos = -1;
        if (Array.isArray(_1a[_1b].Search)) {
            for (var i = 0; i < _1a[_1b].Search.length; i++) {
                pos = _18.indexOf(_1a[_1b].Search[i]);
                if (-1 != pos) {
                    break;
                }
            }
        } else {
            pos = _18.indexOf(_1a[_1b].Search);
        }
        if (-1 != pos) {
            _19.Browser = _1a[_1b].Browser;
            _19.Mac = navigator.platform.indexOf("Mac") == 0;
            _19.iPad = (_1a[_1b].iPad && _18.indexOf(_1a[_1b].iPad) != -1);
            _19.iPhone = (_1a[_1b].iPhone && _18.indexOf(_1a[_1b].iPhone) != -1);
            var _1e = Array.isArray(_1a[_1b].Search) ? _1a[_1b].Search[0] : _1a[_1b].Search;
            var _1f = _1a[_1b].Version || _1e,
                _20 = _18.indexOf(_1f);
            if (-1 == _20) {
                _19[_1a[_1b].Browser] = true;
                break;
            }
            _19[_1a[_1b].Browser] = parseFloat(_18.substring(_20 + _1f.length + 1));
            break;
        }
    }
    return _19;
}());
ITHit.Add("DetectDevice", function () {
    var _21 = navigator.userAgent;
    var _22 = {};
    var _23 = {
        Android: {
            Search: "Android"
        },
        BlackBerry: {
            Search: "BlackBerry"
        },
        iOS: {
            Search: "iPhone|iPad|iPod"
        },
        Opera: {
            Search: "Opera Mini"
        },
        Windows: {
            Search: "IEMobile"
        },
        Mobile: {}
    };
    for (var _24 in _23) {
        var _25 = _23[_24];
        if (!_25.Search) {
            continue;
        }
        var _26 = new RegExp(_25.Search, "i");
        _22[_24] = _26.test(_21);
        if (!_22.Mobile && _22[_24]) {
            _22.Mobile = true;
        }
    }
    return _22;
}());
ITHit.Add("HttpRequest", function (_27, _28, _29, _2a, _2b, _2c) {
    if (!ITHit.Utils.IsString(_27)) {
        throw new ITHit.Exception("Expexted string href in ITHit.HttpRequest. Passed: \"" + _27 + "\"", "sHref");
    }
    if (!ITHit.Utils.IsObjectStrict(_29) && !ITHit.Utils.IsNull(_29) && !ITHit.Utils.IsUndefined(_29)) {
        throw new ITHit.Exception("Expexted headers list as object in ITHit.HttpRequest.", "oHeaders");
    }
    this.Href = _27;
    this.Method = _28;
    this.Headers = _29;
    this.Body = _2a;
    this.User = _2b || null;
    this.Password = _2c || null;
});
ITHit.Add("HttpResponse", function () {
    var _2d = function (_2e, _2f, _30, _31) {
        if (!ITHit.Utils.IsString(_2e)) {
            throw new ITHit.Exception("Expexted string href in ITHit.HttpResponse. Passed: \"" + _2e + "\"", "sHref");
        }
        if (!ITHit.Utils.IsInteger(_2f)) {
            throw new ITHit.Exception("Expexted integer status in ITHit.HttpResponse.", "iStatus");
        }
        if (!ITHit.Utils.IsString(_30)) {
            throw new ITHit.Exception("Expected string status description in ITHit.HttpResponse.", "sStatusDescription");
        }
        if (_31 && !ITHit.Utils.IsObjectStrict(_31)) {
            throw new ITHit.Exception("Expected object headers in ITHit.HttpResponse.", "oHeaders");
        } else {
            if (!_31) {
                _31 = {};
            }
        }
        this.Href = _2e;
        this.Status = _2f;
        this.StatusDescription = _30;
        this.Headers = _31;
        this.BodyXml = null;
        this.BodyText = "";
    };
    _2d.prototype._SetBody = function (_32, _33) {
        this.BodyXml = _32 || null;
        this.BodyText = _33 || "";
    };
    _2d.prototype.SetBodyText = function (_34) {
        this.BodyXml = null;
        this.BodyText = _34;
    };
    _2d.prototype.SetBodyXml = function (_35) {
        this.BodyXml = _35;
        this.BodyText = "";
    };
    _2d.prototype.ParseXml = function (_36) {
        if (!ITHit.Utils.IsString(_36)) {
            throw new ITHit.Exception("Expected XML string in ITHit.HttpResponse.ParseXml", "sXml");
        }
        var _37 = new ITHit.XMLDoc();
        _37.load(_36);
        this.BodyXml = _37._get();
        this.BodyText = _36;
    };
    _2d.prototype.GetResponseHeader = function (_38, _39) {
        if (!_39) {
            return this.Headers[_38];
        } else {
            var _38 = String(_38).toLowerCase();
            for (var _3a in this.Headers) {
                if (_38 === String(_3a).toLowerCase()) {
                    return this.Headers[_3a];
                }
            }
            return undefined;
        }
    };
    return _2d;
}());
ITHit.Add("XMLRequest", (function () {
    var _3b;
    var _3c = function () {
        if (ITHit.DetectBrowser.IE && ITHit.DetectBrowser.IE < 10 && window.ActiveXObject) {
            if (_3b) {
                return new ActiveXObject(_3b);
            } else {
                var _3d = ["MSXML2.XmlHttp.6.0", "MSXML2.XmlHttp.3.0"];
                for (var i = 0; i < _3d.length; i++) {
                    try {
                        var _3f = new ActiveXObject(_3d[i]);
                        _3b = _3d[i];
                        return _3f;
                    } catch (e) {}
                }
            }
        } else {
            if ("undefined" != typeof XMLHttpRequest) {
                return new XMLHttpRequest();
            }
        }
        throw new ITHit.Exception("XMLHttpRequest (AJAX) not supported");
    };
    var _40 = function (_41) {
        var _42 = {};
        if (!_41) {
            return _42;
        }
        var _43 = _41.split("\n");
        for (var i = 0; i < _43.length; i++) {
            if (!ITHit.Trim(_43[i])) {
                continue;
            }
            var _45 = _43[i].split(":");
            var _46 = _45.shift();
            _42[_46] = ITHit.Trim(_45.join(":"));
        }
        return _42;
    };
    var _47 = function (_48, _49) {
        this.bAsync = _49 === true;
        this.IsAborted = false;
        this.OnData = null;
        this.OnError = null;
        this.OnProgress = null;
        this.OnUploadProgress = null;
        this.oHttpRequest = _48;
        this.oError = null;
        if (!_48.Href) {
            throw new ITHit.Exception("Server url had not been set.");
        }
        if (ITHit.Logger && ITHit.LogLevel) {
            ITHit.Logger.WriteMessage("[" + _48.Href + "]");
        }
        this.oRequest = _3c();
        var _4a = String(_48.Href);
        var _4b = _48.Method || "GET";
        try {
            if (_48.User) {
                this.oRequest.open(_4b, ITHit.DecodeHost(_4a), this.bAsync, _48.User, _48.Password);
            } else {
                this.oRequest.open(_4b, ITHit.DecodeHost(_4a), this.bAsync);
            }
            if (ITHit.DetectBrowser.IE && ITHit.DetectBrowser.IE >= 10) {
                try {
                    this.oRequest.responseType = "msxml-document";
                } catch (e) {}
            }
        } catch (e) {
            var _4c = _4a.match(/(?:\/\/)[^\/]+/);
            if (_4c) {
                var _4d = _4c[0].substr(2);
                if (_47.Host != _4d) {
                    throw new ITHit.Exception(ITHit.Phrases.CrossDomainRequestAttempt.Paste(window.location, _4a, String(_4b)), e);
                } else {
                    throw e;
                }
            }
        }
        for (var _4e in _48.Headers) {
            this.oRequest.setRequestHeader(_4e, _48.Headers[_4e]);
        }
        if (this.bAsync) {
            try {
                this.oRequest.withCredentials = true;
            } catch (e) {}
        }
        if (this.bAsync) {
            var _4f = this;
            this.oRequest.onreadystatechange = function () {
                if (_4f.oRequest.readyState != 4) {
                    return;
                }
                var _50 = _4f.GetResponse();
                if (typeof _4f.OnData === "function") {
                    _4f.OnData.call(_4f, _50);
                }
            };
            if ("onprogress" in this.oRequest) {
                this.oRequest.onprogress = function (_51) {
                    if (typeof _4f.OnProgress === "function") {
                        _4f.OnProgress.call(_4f, _51);
                    }
                };
            }
            if (this.oRequest.upload && "onprogress" in this.oRequest) {
                this.oRequest.upload.onprogress = function (_52) {
                    if (typeof _4f.OnUploadProgress === "function") {
                        _4f.OnUploadProgress.call(_4f, _52);
                    }
                };
            }
        }
    };
    _47.prototype.Send = function () {
        var _53 = this.oHttpRequest.Body;
        _53 = _53 || (ITHit.Utils.IsUndefined(_53) || ITHit.Utils.IsNull(_53) || ITHit.Utils.IsBoolean(_53) ? "" : _53);
        if (_53 === "") {
            _53 = null;
        }
        try {
            this.oRequest.send(_53);
        } catch (e) {
            this.oError = e;
            if (typeof this.OnError === "function") {
                this.OnError.call(this, e);
            }
        }
    };
    _47.prototype.Abort = function () {
        if (this.oRequest) {
            try {
                this.IsAborted = true;
                this.oRequest.abort();
            } catch (e) {
                this.oError = e;
                if (typeof this.OnError === "function") {
                    this.OnError.call(this, e);
                }
            }
        }
    };
    _47.prototype.GetResponse = function () {
        var _54 = this.oHttpRequest;
        var _55 = this.oRequest;
        var _56 = String(_54.Href);
        if (this.bAsync && _55.readyState != 4) {
            throw new ITHit.Exception("Request sended as asynchronous, please register callback through XMLRequest.OnData() method for get responce object.");
        }
        if ((404 == _55.status) && (-1 != _56.indexOf(".js") && (_54.Method !== "PROPFIND"))) {
            ITHit.debug.loadTrace.failed(ITHit.debug.loadTrace.FAILED_LOAD);
            throw new ITHit.Exception("Failed to load script (\"" + _56 + "\"). Request returned status: " + _55.status + (_55.statusText ? " (" + _55.statusText + ")" : "") + ".", this.oError || undefined);
        }
        var _57 = this.FixResponseStatus(_55.status, _55.statusText);
        var _58 = new ITHit.HttpResponse(_56, _57.Status, _57.StatusDescription, _40(_55.getAllResponseHeaders()));
        _58._SetBody(_55.responseXML, _55.responseText);
        return _58;
    };
    _47.prototype.FixResponseStatus = function (_59, _5a) {
        var _5b = {
            Status: _59,
            StatusDescription: _5a
        };
        if (1223 == _59) {
            _5b.Status = 204;
            _5b.StatusDescription = "No Content";
        }
        return _5b;
    };
    _47.Host = window.location.host;
    return _47;
})());
ITHit.Add("Utils", {
    IsString: function (_5c) {
        return (("string" == typeof _5c) || (_5c instanceof String));
    },
    IsNumber: function (_5d) {
        return ("number" == typeof _5d);
    },
    IsBoolean: function (_5e) {
        return (("boolean" == typeof _5e) || (_5e instanceof Boolean));
    },
    IsInteger: function (_5f) {
        return this.IsNumber(_5f) && (-1 == String(_5f).indexOf("."));
    },
    IsArray: function (_60) {
        return (_60 instanceof Array || ("array" == typeof _60));
    },
    IsFunction: function (_61) {
        return (_61 instanceof Function);
    },
    IsObject: function (_62) {
        return ("object" == typeof _62);
    },
    IsDate: function (_63) {
        return (_63 instanceof Date);
    },
    IsRegExp: function (_64) {
        return (_64 instanceof RegExp);
    },
    IsObjectStrict: function (_65) {
        return this.IsObject(_65) && !this.IsArray(_65) && !this.IsString(_65) && !this.IsNull(_65) && !this.IsNumber(_65) && !this.IsDate(_65) && !this.IsRegExp(_65) && !this.IsBoolean(_65) && !this.IsFunction(_65) && !this.IsNull(_65);
    },
    IsUndefined: function (_66) {
        return (undefined === _66);
    },
    IsNull: function (_67) {
        return (null === _67);
    },
    IsDOMObject: function (_68) {
        return _68 && this.IsObject(_68) && !this.IsUndefined(_68.nodeType);
    },
    HtmlEscape: function (_69) {
        return String(_69).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    },
    IndexOf: function (_6a, _6b, _6c) {
        var i = 0,
            _6e = _6a && _6a.length;
        if (typeof _6c == "number") {
            i = _6c < 0 ? Math.max(0, _6e + _6c) : _6c;
        }
        for (; i < _6e; i++) {
            if (_6a[i] === _6b) {
                return i;
            }
        }
        return -1;
    },
    Contains: function (_6f, _70) {
        return _6f && _70 && this.IsArray(_6f) && (this.IndexOf(_6f, _70) >= 0);
    },
    FindBy: function (_71, _72, _73) {
        if (_71.find) {
            return _71.find(_72, _73);
        }
        for (var i = 0; i < _71.length; i++) {
            var _75 = _71[i];
            if (_72(_75, i, _71)) {
                return _75;
            }
        }
        return undefined;
    },
    FilterBy: function (_76, _77, _78) {
        var _79 = [];
        if (_76.filter) {
            return _76.filter(_77, _78);
        }
        for (var i = 0; i < _76.length; i++) {
            var _7b = _76[i];
            if (_77(_7b, i, _76)) {
                _79.push(_7b);
            }
        }
        return _79;
    },
    NoOp: function () {},
    CreateDOMElement: function (_7c, _7d) {
        var _7e = ITHit.Utils;
        if (_7e.IsObject(_7c)) {
            if (!_7c.nodeName) {
                throw new ITHit.Exception("nodeName property does not specified.");
            }
            _7d = _7c;
            _7c = _7c.nodeName;
            delete _7d.nodeName;
        }
        var _7f = document.createElement(_7c);
        if (_7d && _7e.IsObject(_7d)) {
            for (var _80 in _7d) {
                if (!_7d.hasOwnProperty(_80)) {
                    continue;
                }
                switch (_80) {
                    case "class":
                        if (_7d[_80]) {
                            _7f.className = _7d[_80];
                        }
                        break;
                    case "style":
                        var _81 = _7d[_80];
                        for (var _82 in _81) {
                            if (!_81.hasOwnProperty(_82)) {
                                continue;
                            }
                            _7f.style[_82] = _81[_82];
                        }
                        break;
                    case "childNodes":
                        for (var i = 0, l = _7d[_80].length; i < l; i++) {
                            var _85 = _7d[_80][i];
                            if (_7e.IsString(_85) || _7e.IsNumber(_85) || _7e.IsBoolean(_85)) {
                                _85 = document.createTextNode(_85);
                            } else {
                                if (!_85) {
                                    continue;
                                }
                            }
                            if (!_7e.IsDOMObject(_85)) {
                                _85 = ITHit.Utils.CreateDOMElement(_85);
                            }
                            _7f.appendChild(_85);
                        }
                        break;
                    default:
                        _7f[_80] = _7d[_80];
                }
            }
        }
        return _7f;
    },
    GetComputedStyle: function (_86) {
        ITHit.Utils.GetComputedStyle = ITHit.Components.dojo.getComputedStyle;
        return ITHit.Utils.GetComputedStyle(_86);
    },
    MakeScopeClosure: function (_87, _88, _89) {
        if (this.IsUndefined(_89)) {
            return this._GetClosureFunction(_87, _88);
        } else {
            if (!this.IsArray(_89)) {
                _89 = [_89];
            }
            return this._GetClosureParamsFunction(_87, _88, _89);
        }
    },
    _GetClosureParamsFunction: function (_8a, _8b, _8c) {
        return function () {
            var _8d = [];
            for (var i = 0, l = _8c.length; i < l; i++) {
                _8d.push(_8c[i]);
            }
            if (arguments.length) {
                for (var i = 0, l = arguments.length; i < l; i++) {
                    _8d.push(arguments[i]);
                }
            }
            if (ITHit.Utils.IsFunction(_8b)) {
                _8b.apply(_8a, _8d);
            } else {
                _8a[_8b].apply(_8a, _8d);
            }
        };
    },
    _GetClosureFunction: function (_90, _91) {
        return function () {
            if (ITHit.Utils.IsFunction(_91)) {
                return _91.apply(_90, arguments);
            }
            return _90[_91].apply(_90, arguments);
        };
    }
});
ITHit.Add("Trim", function (_92, _93, _94) {
    if (("string" != typeof _92) && !(_92 instanceof String)) {
        if (!_94) {
            return _92;
        } else {
            throw new ITHit.Exception("ITHit.Trim() expected string as first prameter.");
        }
    }
    switch (_93) {
        case ITHit.Trim.Left:
            return _92.replace(/^\s+/, "");
            break;
        case ITHit.Trim.Right:
            return _92.replace(/\s+$/, "");
            break;
        default:
            return _92.replace(/(?:^\s+|\s+$)/g, "");
    }
});
ITHit.Add("Trim.Left", "Left");
ITHit.Add("Trim.Right", "Right");
ITHit.Add("Trim.Both", "Both");
ITHit.Add("Exception", (function () {
    var _95 = function (_96, _97) {
        this.Message = _96;
        this.InnerException = _97;
        if (ITHit.Logger.GetCount(ITHit.LogLevel.Error)) {
            var _98 = "Exception: " + this.Name + "\n" + "Message: " + this.Message + "\n";
            if (_97) {
                _98 += ((!_97 instanceof Error) ? "Inner exception: " : "") + this.GetExceptionsStack(_97);
            }
            ITHit.Logger.WriteMessage(_98, ITHit.LogLevel.Error);
        }
    };
    _95.prototype.Name = "Exception";
    _95.prototype.GetExceptionsStack = function (_99, _9a) {
        if ("undefined" === typeof _99) {
            var _99 = this;
        }
        var _9a = _9a ? _9a : 0;
        var _9b = "";
        var _9c = "      ";
        var _9d = "";
        for (var i = 0; i < _9a; i++) {
            _9d += _9c;
        }
        if (_99 instanceof ITHit.Exception) {
            _9b += _9d + (_99.Message ? _99.Message : _99) + "\n";
        } else {
            if (ITHit.Config.ShowOriginalException) {
                _9b += "\nOriginal exception:\n";
                if (("string" != typeof _99) && !(_99 instanceof String)) {
                    for (var _9f in _99) {
                        _9b += "\t" + _9f + ": \"" + ITHit.Trim(_99[_9f]) + "\"\n";
                    }
                } else {
                    _9b += "\t" + _99 + "\n";
                }
            }
        }
        return _9b;
    };
    _95.prototype.toString = function () {
        return this.GetExceptionsStack();
    };
    return _95;
})());
ITHit.Add("Extend", function (_a0, _a1) {
    function inheritance() {}
    inheritance.prototype = _a1.prototype;
    _a0.prototype = new inheritance();
    _a0.prototype.constructor = _a0;
    _a0.baseConstructor = _a1;
    if (_a1.base) {
        _a1.prototype.base = _a1.base;
    }
    _a0.base = _a1.prototype;
});
ITHit.Add("Events", function () {
    var _a2 = function () {
        this._Listeners = this._NewObject();
        this._DispatchEvents = {};
        this._DelayedDelete = {};
    };
    _a2.prototype._NewObject = function () {
        var obj = {};
        for (var _a4 in obj) {
            delete obj[_a4];
        }
        return obj;
    };
    _a2.prototype.AddListener = function (_a5, _a6, _a7, _a8) {
        var _a9 = _a5.__instanceName;
        var _aa;
        var _ab = ITHit.EventHandler;
        if (!(_a7 instanceof ITHit.EventHandler)) {
            _aa = new ITHit.EventHandler(_a8 || null, _a7);
        } else {
            _aa = _a7;
        }
        var _ac = this._Listeners[_a9] || (this._Listeners[_a9] = this._NewObject());
        var _ad = _ac[_a6] || (_ac[_a6] = []);
        var _ae = false;
        for (var i = 0, l = _ad.length; i < l; i++) {
            if (_ad[i].IsEqual(_aa)) {
                _ae = true;
                break;
            }
        }
        if (!_ae) {
            _ad.push(_aa);
        }
    };
    _a2.prototype.DispatchEvent = function (_b1, _b2, _b3) {
        var _b4 = _b1.__instanceName;
        if (!this._Listeners[_b4] || !this._Listeners[_b4][_b2] || !this._Listeners[_b4][_b2].length) {
            return undefined;
        }
        var _b5 = ITHit.EventHandler;
        var _b6;
        var _b7 = [];
        for (var i = 0, l = this._Listeners[_b4][_b2].length; i < l; i++) {
            _b7.push(this._Listeners[_b4][_b2][i]);
        }
        this._DispatchEvents[_b4] = (this._DispatchEvents[_b4] || 0) + 1;
        this._DispatchEvents[_b4 + ":" + _b2] = (this._DispatchEvents[_b4 + ":" + _b2] || 0) + 1;
        for (var i = 0; i < _b7.length; i++) {
            var _ba;
            if (_b7[i] instanceof _b5) {
                try {
                    _ba = _b7[i].CallHandler(_b1, _b2, _b3);
                } catch (e) {
                    throw e;
                }
            }
            if (_b7[i] instanceof Function) {
                try {
                    _ba = _b7[i](_b1, _b2, _b3);
                } catch (e) {
                    throw e;
                }
            }
            if (!ITHit.Utils.IsUndefined(_ba)) {
                _b6 = _ba;
            }
        }
        this._DispatchEvents[_b4]--;
        this._DispatchEvents[_b4 + ":" + _b2]--;
        this._CheckDelayedDelete(_b1, _b2);
        return _b6;
    };
    _a2.prototype.RemoveListener = function (_bb, _bc, _bd, _be) {
        var _bf = _bb.__instanceName;
        _be = _be || null;
        if (!this._Listeners[_bf] || !this._Listeners[_bf][_bc] || !this._Listeners[_bf][_bc].length) {
            return true;
        }
        var _c0 = this._Listeners[_bf][_bc];
        for (var i = 0, l = _c0.length; i < l; i++) {
            if (_c0[i].IsEqual(_be, _bd)) {
                this._Listeners[_bf][_bc].splice(i, 1);
                break;
            }
        }
    };
    _a2.prototype.RemoveAllListeners = function (_c3, _c4) {
        var _c5 = _c3.__instanceName;
        if (!ITHit.Utils.IsUndefined(_c4)) {
            if (ITHit.Utils.IsUndefined(this._DispatchEvents[_c5 + ":" + _c4])) {
                delete this._Listeners[_c5][_c4];
            } else {
                this._DelayedDelete[_c5 + ":" + _c4] = true;
            }
        } else {
            if (ITHit.Utils.IsUndefined(this._DispatchEvents[_c5])) {
                delete this._Listeners[_c5];
            } else {
                this._DelayedDelete[_c5] = true;
            }
        }
    };
    _a2.prototype._CheckDelayedDelete = function (_c6, _c7) {
        var _c8 = _c6.__instanceName;
        if (!this._DispatchEvents[_c8 + ":" + _c7]) {
            delete this._DispatchEvents[_c8 + ":" + _c7];
            if (!ITHit.Utils.IsUndefined(this._DelayedDelete[_c8 + ":" + _c7])) {
                this.RemoveAllListeners(_c6, _c7);
            }
        }
        if (!this._DispatchEvents[_c8]) {
            delete this._DispatchEvents[_c8];
            if (!ITHit.Utils.IsUndefined(this._DelayedDelete[_c8])) {
                this.RemoveAllListeners(_c6);
            }
        }
    };
    _a2.prototype.ListenersLength = function (_c9, _ca) {
        var _cb = _c9.__instanceName;
        if (!this._Listeners[_cb] || !this._Listeners[_cb][_ca]) {
            return 0;
        }
        return this._Listeners[_cb][_ca].length;
    };
    _a2.prototype.Fix = function (e) {
        e = e || window.event;
        if (!e.target && e.srcElement) {
            e.target = e.srcElement;
        }
        if ((null == e.pageX) && (null != e.clientX)) {
            var _cd = document.documentElement,
                _ce = document.body;
            e.pageX = e.clientX + (_cd && _cd.scrollLeft || _ce && _ce.scrollLeft || 0) - (_cd.clientLeft || 0);
            e.pageY = e.clientY + (_cd && _cd.scrollTop || _ce && _ce.scrollTop || 0) - (_cd.clientTop || 0);
        }
        if (!e.which && e.button) {
            e.which = e.button & 1 ? 1 : (e.button & 2 ? 3 : (e.button & 4 ? 2 : 0));
        }
        return e;
    };
    _a2.prototype.AttachEvent = function (_cf, _d0, _d1) {
        _d0 = _d0.replace(/^on/, "");
        if (_cf.addEventListener) {
            _cf.addEventListener(_d0, _d1, false);
        } else {
            if (_cf.attachEvent) {
                _cf.attachEvent("on" + _d0, _d1);
            } else {
                _cf["on" + _d0] = _d1;
            }
        }
    };
    _a2.prototype.DettachEvent = function (_d2, _d3, _d4) {
        _d3 = _d3.replace(/^on/, "");
        if (_d2.removeEventListener) {
            _d2.removeEventListener(_d3, _d4, false);
        } else {
            if (_d2.detachEvent) {
                _d2.detachEvent("on" + _d3, _d4);
            } else {
                _d2["on" + _d3] = null;
            }
        }
    };
    _a2.prototype.Stop = function (e) {
        e = e || window.event;
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        e.cancelBubble = true;
        return false;
    };
    return new _a2();
}());
ITHit.Add("EventHandler", function () {
    var _d6 = function (_d7, _d8) {
        var _d9 = ITHit.Utils;
        if (!_d9.IsObjectStrict(_d7) && !_d9.IsNull(_d7)) {
            throw new ITHit.Exception("Event handler scope expected to be an object.");
        }
        if (!_d9.IsFunction(_d8) && (_d7 && !_d9.IsString(_d8))) {
            throw new ITHit.Exception("Method handler expected to be a string or function.");
        }
        if (_d7) {
            this.Scope = _d7;
            this.Name = _d7.__instanceName;
        } else {
            this.Scope = window;
            this.Name = "window";
        }
        this.Method = _d8;
    };
    _d6.prototype.IsEqual = function (_da, _db) {
        if (_da instanceof ITHit.EventHandler) {
            return this.GetCredentials() === _da.GetCredentials();
        } else {
            return ((_da || null) === this.Scope) && (_db === this.Method);
        }
    };
    _d6.prototype.GetCredentials = function () {
        return this.Name + "::" + this.Method;
    };
    _d6.prototype.CallHandler = function (_dc, _dd, _de) {
        if (!(_de instanceof Array)) {
            _de = [_de];
        }
        if (this.Scope) {
            if (this.Method instanceof Function) {
                return this.Method.apply(this.Scope || window, _de.concat([_dc]));
            } else {
                try {
                    return this.Scope[this.Method].apply(this.Scope, _de.concat([_dc]));
                } catch (e) {
                    throw new ITHit.Exception(e);
                }
            }
        } else {
            return this.Method.apply({}, _de.concat([_dc]));
        }
    };
    return _d6;
}());
ITHit.Add("HtmlEncode", function (_df) {
    return _df.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&amp;").replace(/"/g, "&quot;");
});
ITHit.Add("HtmlDecode", function (_e0) {
    return _e0.replace(/&quot;/, "\"").replace(/&amp;/g, "'").replace(/&gt;/g, ">").replace(/&lt;/g, "<");
});
ITHit.Add("Encode", function (_e1) {
    if (!_e1) {
        return _e1;
    }
    return ITHit.EncodeURI(_e1.replace(/%/g, "%25")).replace(/~/g, "%7E").replace(/!/g, "%21").replace(/@/g, "%40").replace(/#/g, "%23").replace(/\$/g, "%24").replace(/&/g, "%26").replace(/\*/g, "%2A").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\-/g, "%2D").replace(/_/g, "%5F").replace(/\+/g, "%2B").replace(/\=/g, "%3D").replace(/'/g, "%27").replace(/;/g, "%3B").replace(/\,/g, "%2C").replace(/\?/g, "%3F");
});
ITHit.Add("EncodeURI", function (_e2) {
    if (!_e2) {
        return _e2;
    }
    return encodeURI(_e2).replace(/%25/g, "%");
});
ITHit.Add("Decode", function (_e3) {
    if (!_e3) {
        return _e3;
    }
    var _e3 = _e3.replace(/%7E/gi, "~").replace(/%21/g, "!").replace(/%40/g, "@").replace(/%23/g, "#").replace(/%24/g, "$").replace(/%26/g, "&").replace(/%2A/gi, "*").replace(/%28/g, "(").replace(/%29/g, ")").replace(/%2D/gi, "-").replace(/%5F/gi, "_").replace(/%2B/gi, "+").replace(/%3D/gi, "=").replace(/%27/g, "'").replace(/%3B/gi, ";").replace(/%2E/gi, ".").replace(/%2C/gi, ",").replace(/%3F/gi, "?");
    return ITHit.DecodeURI(_e3);
});
ITHit.Add("DecodeURI", function (_e4) {
    if (!_e4) {
        return _e4;
    }
    return decodeURI(_e4.replace(/%([^0-9A-F]|.(?:[^0-9A-F]|$)|$)/gi, "%25$1"));
});
ITHit.Add("DecodeHost", function (_e5) {
    if (/^(http|https):\/\/[^:\/]*?%/.test(_e5)) {
        var _e6 = _e5.match(/^(?:http|https):\/\/[^\/:]+/);
        if (_e6 && _e6[0]) {
            var _e7 = _e6[0].replace(/^(http|https):\/\//, "");
            _e5 = _e5.replace(_e7, ITHit.Decode(_e7));
        }
    }
    return _e5;
});
ITHit.Add("WebDAV.Client.LicenseId", null);
(function () {
    var _e8 = function () {};
    var _e9 = function (_ea, _eb) {
        for (var key in _eb) {
            if (!_eb.hasOwnProperty(key)) {
                continue;
            }
            var _ed = _eb[key];
            if (typeof _ed == "function" && typeof _ea[key] == "function" && _ea[key] !== _e8) {
                _ea[key] = _ee(_ed, _ea[key]);
            } else {
                _ea[key] = _ed;
            }
        }
        if (!_ea._super) {
            _ea._super = _e8;
        }
    };
    var _ee = function (_ef, _f0) {
        return function () {
            var old = this._super;
            this._super = _f0;
            var r = _ef.apply(this, arguments);
            this._super = old;
            return r;
        };
    };
    var _f3 = 0;
    ITHit.Add("DefineClass", function (_f4, _f5, _f6, _f7) {
        _f5 = _f5 !== null ? _f5 : function () {};
        if (!_f5) {
            throw new Error("Not found extended class for " + _f4);
        }
        if (_f6.hasOwnProperty("__static")) {
            _f7 = _f6.__static;
            delete _f6.__static;
        }
        var _f8;
        if (_f6 && _f6.hasOwnProperty("constructor")) {
            _f8 = function () {
                this.__instanceName = this.__className + _f3++;
                return _ee(_f6.constructor, _f5).apply(this, arguments);
            };
        } else {
            _f8 = function () {
                this.__instanceName = this.__className + _f3++;
                return _f5.apply(this, arguments);
            };
        }
        for (var _f9 in _f5) {
            _f8[_f9] = _f5[_f9];
        }
        _e9(_f8, _f7);
        var _fa = function () {
            this.constructor = _f8;
        };
        _fa.prototype = _f5.prototype;
        _f8.prototype = new _fa;
        for (var key in _fa.prototype) {
            if (!_fa.prototype.hasOwnProperty(key)) {
                continue;
            }
            var _fc = _fa.prototype[key];
            if (!_fc) {
                continue;
            }
            if (_fc instanceof Array) {
                if (_fc.length === 0) {
                    _f8.prototype[key] = [];
                }
            } else {
                if (typeof _fc === "object") {
                    var _fd = true;
                    for (var k in _fc) {
                        _fd = _fd && _fc.hasOwnProperty(k);
                    }
                    if (_fd) {
                        _f8.prototype[key] = {};
                    }
                }
            }
        }
        if (_f6) {
            _e9(_f8.prototype, _f6);
        }
        _f8.__className = _f8.prototype.__className = _f4;
        var _ff = _f4.lastIndexOf("."),
            _100 = _f4.substr(_ff + 1);
        return ITHit.Declare(_f4.substr(0, _ff))[_100] = _f8;
    });
})();
ITHit.Temp.WebDAV_Phrases = {
    CrossDomainRequestAttempt: 'Attempting to make cross-domain request.\nRoot URL: {0}\nDestination URL: {1}\nMethod: {2}',

    // WebDavRequest
    Exceptions: {
        BadRequest: 'The request could not be understood by the server due to malformed syntax.',
        Conflict: 'The request could not be carried because of conflict on server.',
        DependencyFailed: 'The method could not be performed on the resource because the requested action depended on another action and that action failed.',
        InsufficientStorage: 'The request could not be carried because of insufficient storage.',
        Forbidden: 'The server refused to fulfill the request.',
        Http: 'Exception during the request occurred.',
        Locked: 'The item is locked.',
        MethodNotAllowed: 'The method is not allowed.',
        NotFound: 'The item doesn\'t exist on the server.',
        PreconditionFailed: 'Precondition failed.',
        PropertyFailed: 'Failed to get one or more properties.',
        PropertyForbidden: 'Not enough rights to obtain one of requested properties.',
        PropertyNotFound: 'One or more properties not found.',
        Unauthorized: 'Incorrect credentials provided or insufficient permissions to access the requested item.',
        LockWrongCountParametersPassed: 'Lock.{0}: Wrong count of parameters passed. (Passed {1})',
        UnableToParseLockInfoResponse: 'Unable to parse response: quantity of LockInfo elements isn\'t equal to 1.',
        ParsingPropertiesException: 'Exception while parsing properties.',
        InvalidDepthValue: 'Invalid Depth value.',
        FailedCreateFolder: 'Failed creating folder.',
        FailedCreateFile: 'Failed creating file.',
        FolderWasExpectedAsDestinationForMoving: 'Folder was expected as destination for moving folder.',
        AddOrUpdatePropertyDavProhibition: 'Add or update of property {0} ignored: properties from "DAV:" namespace could not be updated/added.',
        DeletePropertyDavProhibition: 'Delete of property {0} ignored: properties from "DAV:" namespace could not be deleted.',
        NoPropertiesToManipulateWith: 'Calling UpdateProperties ignored: no properties to update/add/delete.',
        ActiveLockDoesntContainLockscope: 'Activelock node doesn\'t contain lockscope node.',
        ActiveLockDoesntContainDepth: 'Activelock node doedn\'t contain depth node.',
        WrongCountPropertyInputParameters: 'Wrong count of input parameters passed for Property constructor. Expected 1-3, passed: {1}.',
        FailedToWriteContentToFile: 'Failed to write content to file.',
        PropertyUpdateTypeException: 'Property expected to be an Property class instance.',
        PropertyDeleteTypeException: 'Property name expected to be an PropertyName class instance.',
        UnknownResourceType: 'Unknown resource type.',
        NotAllPropertiesReceivedForUploadProgress: 'Not all properties received for upload progress. {0}',
        ReportOnResourceItemWithParameterCalled: 'For files the method should be called without parametres.',
        WrongHref: 'Href expected to be a string.',
        WrongUploadedBytesType: 'Count of uploaded bytes expected to be a integer.',
        WrongContentLengthType: 'File content length expected to be a integer.',
        BytesUploadedIsMoreThanTotalFileContentLength: 'Bytes uploaded is more than total file content length.',
        ExceptionWhileParsingProperties: 'Exception while parsing properties.',
        IntegrationTimeoutException: 'Browser extention didnt fill data in {0} ms',
        FolderRewriteException: 'Rewrite of folders does not permitted.',
        NotFoundEventName: 'Not found event name `{0}`',
    },
    ResourceNotFound: 'Resource not found. {0}',
    ResponseItemNotFound: 'The response doesn\'t have required item. {0}',
    ResponseFileWrongType: 'Server returned folder while file is expected. {0}',
    FolderNotFound: 'Folder not found. {0}',
    ResponseFolderWrongType: 'Server returned file while folder is expected. {0}',
    ItemIsMovedOrDeleted: 'Cannot perform operation because item "{0}" is moved or deleted.',
    FailedToCopy: 'Failed to copy item.',
    FailedToCopyWithStatus: 'Copy failed with status {0}: {1}.',
    FailedToDelete: 'Failed to delete item.',
    DeleteFailedWithStatus: 'Delete failed with status {0}: {1}.',
    PutUnderVersionControlFailed: 'Put under version control failed.',
    FailedToMove: 'Failed to move item.',
    MoveFailedWithStatus: 'Move failed with status {0}: {1}.',
    UnlockFailedWithStatus: 'Unlock failed with status {0}: {1}.',
    PropfindFailedWithStatus: 'PROPFIND method failed with status {0}.',
    FailedToUpdateProp: 'Failed to update or delete one or more properties.',
    FromTo: 'The From parameter cannot be less than To.',
    NotToken: 'The supplied string is not a valid HTTP token.',
    RangeTooSmall: 'The From or To parameter cannot be less than 0.',
    RangeType: 'A different range specifier has already been added to this request.',
    ServerReturned: 'Server returned:',
    UserAgent: 'IT Hit WebDAV AJAX Library v{0}',
    FileUploadFailed: 'Failed to upload the file.',
    ProductName: 'IT Hit WebDAV AJAX Library',
    WrongParameterType: 'Wrong parameter type. Expected type is:{0}.',
    // WebDavResponse
    wdrs: {
        status: '\n{0} {1}',
        response: '{0}: {1}'
    }
};

(function () {
    ITHit.DefineClass("ITHit.Environment", null, {
        __static: {
            OS: ITHit.DetectOS.OS
        }
    });
})();
ITHit.oNS = ITHit.Declare("ITHit.Exceptions");
ITHit.oNS.LoggerException = function (_101, _102) {
    ITHit.Exceptions.LoggerException.baseConstructor.call(this, _101, _102);
};
ITHit.Extend(ITHit.oNS.LoggerException, ITHit.Exception);
ITHit.oNS.LoggerException.prototype.Name = "LoggerException";
ITHit.DefineClass("ITHit.LogLevel", null, {}, {
    All: 32,
    Debug: 16,
    Info: 8,
    Warn: 4,
    Error: 2,
    Fatal: 1,
    Off: 8
});
(function () {
    var _103 = {};
    var _104 = {};
    var _105 = {};
    for (var _106 in ITHit.LogLevel) {
        _103[ITHit.LogLevel[_106]] = [];
        _105[ITHit.LogLevel[_106]] = [];
    }
    var _107 = function (_108, _109, iTo, _10b) {
        for (var _10c in ITHit.LogLevel) {
            if (ITHit.LogLevel[_10c] > iTo) {
                continue;
            }
            if (!ITHit.LogLevel[_10c] || (_109 >= ITHit.LogLevel[_10c])) {
                continue;
            }
            if (_108) {
                _105[ITHit.LogLevel[_10c]].push(_10b);
            } else {
                for (var i = 0; i < _105[ITHit.LogLevel[_10c]].length; i++) {
                    if (_105[ITHit.LogLevel[_10c]][i] == _10b) {
                        _105[ITHit.LogLevel[_10c]].splice(i, 1);
                    }
                }
            }
        }
    };
    _107.add = function (iTo, _10f) {
        _107.increase(ITHit.LogLevel.Off, iTo, _10f);
    };
    _107.del = function (iTo, _111) {
        _107.decrease(ITHit.LogLevel.Off, iTo, _111);
    };
    _107.increase = function (_112, iTo, _114) {
        _107(true, _112, iTo, _114);
    };
    _107.decrease = function (_115, iTo, _117) {
        _107(false, _115, iTo, _117);
    };
    ITHit.DefineClass("ITHit.Logger", null, {}, {
        Level: ITHit.Config.LogLevel || ITHit.LogLevel.Debug,
        AddListener: function (_118, _119) {
            if (_119 == ITHit.LogLevel.Off) {
                this.RemoveListener();
            }
            var _11a = 0;
            var _11b = 0;
            outer: for (var _11c in _103) {
                for (var i = 0; i < _103[_11c].length; i++) {
                    if (_103[_11c][i] == _118) {
                        _11a = _11c;
                        _11b = i;
                        break outer;
                    }
                }
            }
            if (!_11a) {
                _103[_119].push(_118);
                _107.add(_119, _118);
            } else {
                if (_119 != _11a) {
                    _103[_11a].splice(_11b, 1);
                    _103[_119].push(_118);
                    if (_119 > _11a) {
                        _107.increase(_11a, _119, _118);
                    } else {
                        _107.decrease(_119, _11a, _118);
                    }
                }
            }
        },
        RemoveListener: function (_11e) {
            outer: for (var _11f in _103) {
                for (var i = 0; i < _103[_11f].length; i++) {
                    if (_103[_11f][i] == _11e) {
                        _103[_11f].splice(i, 1);
                        _107.del(_11f, _11e);
                        break outer;
                    }
                }
            }
            return true;
        },
        SetLogLevel: function (_121, _122) {
            return this.AddListener(_121, _122, true);
        },
        GetLogLevel: function (_123) {
            for (var _124 in _103) {
                for (var i = 0; i < _103[_124].length; i++) {
                    if (_103[_124][i] == _123) {
                        return _124;
                    }
                }
            }
            return false;
        },
        GetListenersForLogLevel: function (_126) {
            return _105[_126];
        },
        GetCount: function (_127) {
            return _105[_127].length;
        },
        WriteResponse: function (_128) {
            if (Logger.GetCount(ITHit.LogLevel.Info)) {
                var sStr = "";
                if (_128 instanceof HttpWebResponse) {
                    sStr += "\n" + _128.StatusCode + " " + _128.StatusDescription + "\n";
                }
                sStr += _128.ResponseUri + "\n";
                for (var _12a in _128.Headers) {
                    sStr += _12a + ": " + _128.Headers[_12a] + "\n";
                }
                sStr += _128.GetResponse();
                this.WriteMessage(sStr);
            }
        },
        WriteMessage: function (_12b, _12c) {
            _12c = ("undefined" == typeof _12c) ? ITHit.LogLevel.Info : parseInt(_12c);
            if (ITHit.Logger.GetCount(_12c)) {
                var _12d = this.GetListenersForLogLevel(_12c);
                var _12b = String(_12b).replace(/([^\n])$/, "$1\n");
                for (var i = 0; i < _12d.length; i++) {
                    try {
                        _12d[i](_12b, ITHit.LogLevel.Info);
                    } catch (e) {
                        if (!_12d[i] instanceof Function) {
                            throw new ITHit.Exceptions.LoggerException("Log listener expected function, passed: \"" + _12d[i] + "\"", e);
                        } else {
                            throw new ITHit.Exceptions.LoggerException("Message could'not be logged.", e);
                        }
                    }
                }
            }
        },
        StartLogging: function () {},
        FinishLogging: function () {},
        StartRequest: function () {},
        FinishRequest: function () {}
    });
})();
ITHit.oNS = ITHit.Declare("ITHit.Exceptions");
ITHit.oNS.PhraseException = function (_12f, _130) {
    ITHit.Exceptions.PhraseException.baseConstructor.call(this, _12f, _130);
};
ITHit.Extend(ITHit.oNS.PhraseException, ITHit.Exception);
ITHit.oNS.PhraseException.prototype.Name = "PhraseException";
ITHit.Phrases = (function () {
    var _131 = {};
    var _132 = function (_133) {
        this._arguments = _133;
    };
    _132.prototype.Replace = function (_134) {
        var _135 = _134.substr(1, _134.length - 2);
        return ("undefined" != typeof this._arguments[_135]) ? this._arguments[_135] : _134;
    };
    var _136 = function (_137) {
        this._phrase = _137;
    };
    _136.prototype.toString = function () {
        return this._phrase;
    };
    _136.prototype.Paste = function () {
        var _138 = this._phrase;
        if (/\{\d+?\}/.test(_138)) {
            var _139 = new _132(arguments);
            _138 = _138.replace(/\{(\d+?)\}/g, function (args) {
                return _139.Replace(args);
            });
        }
        return _138;
    };
    var _13b = function () {};
    _13b.prototype.LoadJSON = function (_13c, _13d) {
        var _13e = ITHit.Utils;
        if (_13d && !_13e.IsString(_13d)) {
            throw new ITHit.Exceptions.PhraseException("Namespace expected to be a string.");
        }
        var _13f = this;
        if (_13d) {
            _13f = ITHit.Declare(_13d);
        }
        try {
            var _140 = _13c;
            if (_13e.IsString(_140)) {
                _140 = eval("(" + _13c + ")");
            }
            this._AddPhrases(_140, _13f);
        } catch (e) {
            console.dir(e);
            throw new ITHit.Exceptions.PhraseException("Wrong text structure.", e);
        }
    };
    _13b.prototype.LoadLocalizedJSON = function (_141, _142, _143) {
        var _144 = ITHit.Utils,
            _145 = _144.IsUndefined,
            _146 = _144.IsObject;
        if (!_141 || !_144.IsObjectStrict(_141)) {
            throw new ITHit.Exceptions.PhraseException("Default phrases expected to be an JSON object.");
        }
        if (_142 && !_144.IsObjectStrict(_142)) {
            throw new ITHit.Exceptions.PhraseException("Default phrases expected to be an JSON object");
        }
        var _147;
        if (_142) {
            _147 = {};
            this._MergePhrases(_147, _142);
            this._MergePhrases(_147, _141);
        } else {
            _147 = _141;
        }
        this.LoadJSON(_147, _143);
    };
    _13b.prototype._MergePhrases = function (dest, _149) {
        var _14a = ITHit.Utils,
            _14b = _14a.IsUndefined,
            _14c = _14a.IsObject;
        for (var prop in _149) {
            if (!_149.hasOwnProperty(prop)) {
                continue;
            }
            if (_14b(dest[prop])) {
                dest[prop] = _149[prop];
            } else {
                if (_14c(dest[prop])) {
                    this._MergePhrases(dest[prop], _149[prop]);
                }
            }
        }
    };
    _13b.prototype._AddPhrases = function (_14e, _14f) {
        _14f = _14f || this;
        for (var _150 in _14e) {
            if (("object" != typeof _14e[_150]) || !(_14e[_150] instanceof Object)) {
                switch (_150) {
                    case "_AddPhrases":
                    case "LoadJSON":
                    case "LoadLocalizedJSON":
                    case "_Merge":
                    case "prototype":
                    case "toString":
                        throw new ITHit.Exceptions.PhraseException("\"" + _150 + "\" is reserved word.");
                        break;
                }
                _14f[_150] = new _136(_14e[_150]);
            } else {
                this._AddPhrases(_14e[_150], _14f[_150] ? _14f[_150] : (_14f[_150] = {}));
            }
        }
    };
    return new _13b();
})();
ITHit.oNS = ITHit.Declare("ITHit.Exceptions");
ITHit.oNS.XPathException = function (_151, _152) {
    ITHit.Exceptions.XPathException.baseConstructor.call(this, _151, _152);
};
ITHit.Extend(ITHit.oNS.XPathException, ITHit.Exception);
ITHit.oNS.XPathException.prototype.Name = "XPathException";
ITHit.XPath = {
    _component: null,
    _version: null
};
ITHit.XPath.evaluate = function (_153, _154, _155, _156, _157) {
    if (("string" != typeof _153) && !(_153 instanceof String)) {
        throw new ITHit.Exceptions.XPathException("Expression was expected to be a string in ITHit.XPath.eveluate.");
    }
    if (!(_154 instanceof ITHit.XMLDoc)) {
        throw new ITHit.Exceptions.XPathException("Element was expected to be an ITHit.XMLDoc object in ITHit.XPath.evaluate.");
    }
    if (_155 && !(_155 instanceof ITHit.XPath.resolver)) {
        throw new ITHit.Exceptions.XPathException("Namespace resolver was expected to be an ITHit.XPath.resolver object in ITHit.XPath.evaluate.");
    }
    if (_156 && !(_156 instanceof ITHit.XPath.result)) {
        throw new ITHit.Exceptions.XPathException("Result expected to be an ITHit.XPath.result object in ITHit.XPath.evaluate.");
    }
    _155 = _155 || null;
    _156 = _156 || null;
    if (document.implementation.hasFeature("XPath", "3.0") && document.evaluate) {
        var _158 = _154._get();
        var _159 = _158.ownerDocument || _158;
        if (_156) {
            _159.evaluate(_153, _158, _155, ITHit.XPath.result.UNORDERED_NODE_SNAPSHOT_TYPE, _156._res);
            return;
        }
        var oRes = new ITHit.XPath.result(_159.evaluate(_153, _158, _155, ITHit.XPath.result.UNORDERED_NODE_SNAPSHOT_TYPE, null));
        if (!_157) {
            return oRes;
        } else {
            return oRes.iterateNext();
        }
    } else {
        if (undefined !== window.ActiveXObject) {
            var _158 = _154._get();
            var _15b = false;
            try {
                _158.getProperty("SelectionNamespaces");
                _15b = true;
            } catch (e) {}
            var _15c = false;
            if (3 == ITHit.XMLDoc._version) {
                var sXml = _158.xml.replace(/^\s+|\s+$/g, "");
                var _15e = "urn:uuid:c2f41010-65b3-11d1-a29f-00aa00c14882/";
                var _15f = "cutted";
                if (-1 != sXml.indexOf(_15e) || true) {
                    var _160 = sXml.replace(_15e, _15f);
                    var _161 = new ITHit.XMLDoc();
                    _161.load(_160);
                    if (_155) {
                        var oNs = _155.getAll();
                        for (var _163 in oNs) {
                            if (_15e == oNs[_163]) {
                                oNs.add(_163, _15f);
                                break;
                            }
                        }
                    }
                    _158 = _161._get();
                    _15b = true;
                    _15c = true;
                }
            }
            if (_15b && _155 && _155.length()) {
                var _164 = _155.getAll();
                var aNs = [];
                for (var _163 in _164) {
                    aNs.push("xmlns:" + _163 + "='" + _164[_163] + "'");
                }
                _158.setProperty("SelectionNamespaces", aNs.join(" "));
            }
            if (_15c) {
                _158 = _158.documentElement;
            }
            try {
                if (!_157) {
                    if (!_156) {
                        return new ITHit.XPath.result(_158.selectNodes(_153));
                    } else {
                        _156._res = _158.selectNodes(_153);
                        return;
                    }
                } else {
                    var mOut = _158.selectSingleNode(_153);
                    if (mOut) {
                        return new ITHit.XMLDoc(mOut);
                    } else {
                        return mOut;
                    }
                }
            } catch (e) {
                if (!_15b && (-2147467259 == e.number) && _155 && _155.length()) {
                    var sEl = new ITHit.XMLDoc(_158).toString();
                    var oEl = new ITHit.XMLDoc();
                    oEl.load(sEl);
                    _158 = oEl._get();
                    var _164 = _155.getAll();
                    var aNs = [];
                    for (var _163 in _164) {
                        aNs.push("xmlns:" + _163 + "='" + _164[_163] + "'");
                    }
                    _158.setProperty("SelectionNamespaces", aNs.join(" "));
                    _158 = _158.documentElement;
                    if (!_157) {
                        if (!_156) {
                            return new ITHit.XPath.result(_158.selectNodes(_153));
                        } else {
                            _156._res = _158.selectNodes(_153);
                            return;
                        }
                    } else {
                        var mOut = _158.selectSingleNode(_153);
                        if (mOut) {
                            return new ITHit.XMLDoc(mOut);
                        } else {
                            return mOut;
                        }
                    }
                } else {
                    throw new ITHit.Exceptions.XPathException("Evaluation failed for searching \"" + _153 + "\".", e);
                }
            }
        }
    }
    throw new ITHit.Exceptions.XPathException("XPath support is not implemented for your browser.");
};
ITHit.XPath.selectSingleNode = function (_169, _16a, _16b) {
    return ITHit.XPath.evaluate(_169, _16a, _16b, false, true);
};
ITHit.XPath.resolver = function () {
    this._ns = {};
    this._length = 0;
};
ITHit.XPath.resolver.prototype.add = function (_16c, sNs) {
    this._ns[_16c] = sNs;
    this._length++;
};
ITHit.XPath.resolver.prototype.remove = function (_16e) {
    delete this._ns[_16e];
    this._length--;
};
ITHit.XPath.resolver.prototype.get = function (_16f) {
    return this._ns[_16f] || null;
};
ITHit.XPath.resolver.prototype.lookupNamespaceURI = ITHit.XPath.resolver.prototype.get;
ITHit.XPath.resolver.prototype.getAll = function () {
    var oOut = {};
    for (var _171 in this._ns) {
        oOut[_171] = this._ns[_171];
    }
    return oOut;
};
ITHit.XPath.resolver.prototype.length = function () {
    return this._length;
};
ITHit.XPath.result = function (_172) {
    this._res = _172;
    this._i = 0;
    this.length = _172.length ? _172.length : _172.snapshotLength;
};
ITHit.XPath.result.ANY_TYPE = 0;
ITHit.XPath.result.NUMBER_TYPE = 1;
ITHit.XPath.result.STRING_TYPE = 2;
ITHit.XPath.result.BOOLEAN_TYPE = 3;
ITHit.XPath.result.UNORDERED_NODE_ITERATOR_TYPE = 4;
ITHit.XPath.result.ORDERED_NODE_ITERATOR_TYPE = 5;
ITHit.XPath.result.UNORDERED_NODE_SNAPSHOT_TYPE = 6;
ITHit.XPath.result.ORDERED_NODE_SNAPSHOT_TYPE = 7;
ITHit.XPath.result.ANY_UNORDERED_NODE_TYPE = 8;
ITHit.XPath.result.FIRST_ORDERED_NODE_TYPE = 9;
ITHit.XPath.result.prototype.iterateNext = function (_173) {
    var mOut;
    if (!_173) {
        if (!this._res.snapshotItem) {
            try {
                mOut = this._res[this._i++];
            } catch (e) {
                return null;
            }
        } else {
            mOut = this._res.snapshotItem(this._i++);
        }
    } else {
        mOut = this._res[_173];
    }
    if (mOut) {
        return new ITHit.XMLDoc(mOut);
    } else {
        return mOut;
    }
};
ITHit.XPath.result.prototype.snapshotItem = ITHit.XPath.result.prototype.iterateNext;
ITHit.XPath.result.prototype.type = function () {
    return this._res.resultType;
};
ITHit.XPath.result.prototype._get = function () {
    return this._res;
};
ITHit.oNS = ITHit.Declare("ITHit.Exceptions");
ITHit.oNS.XMLDocException = function (_175, _176) {
    ITHit.Exceptions.XMLDocException.baseConstructor.call(this, _175, _176);
};
ITHit.Extend(ITHit.oNS.XMLDocException, ITHit.Exception);
ITHit.oNS.XMLDocException.prototype.Name = "XMLDocException";
ITHit.XMLDoc = (function () {
    var _177;
    var _178 = 1;
    var _179 = 2;
    var _17a = 3;
    var _17b = 4;
    var _17c = 5;
    var _17d = 6;
    var _17e = 7;
    var _17f = 8;
    var _180 = 9;
    var _181 = 10;
    var _182 = 11;
    var _183 = 12;
    var _184 = function (_185) {
        this._xml = null;
        this._encoding = null;
        if (null !== _185) {
            if (!_185 || ("object" != typeof _185)) {
                if (undefined !== window.ActiveXObject) {
                    if (_177) {
                        this._xml = new window.ActiveXObject(_177);
                    } else {
                        var _186 = ["Msxml2.DOMDocument.6.0", "Msxml2.DOMDocument.4.0", "Msxml2.DOMDocument.3.0"];
                        var _187 = [6, 4, 3];
                        for (var i = 0; i < _186.length; i++) {
                            try {
                                this._xml = new window.ActiveXObject(_186[i]);
                                _184._version = _187[i];
                                _177 = _186[i];
                                break;
                            } catch (e) {
                                if (3 == _187[i]) {
                                    throw new ITHit.Exception("XML component is not supported.");
                                }
                            }
                        }
                    }
                } else {
                    if (document.implementation && document.implementation.createDocument) {
                        this._xml = document.implementation.createDocument("", "", null);
                    }
                }
                if (undefined === this._xml) {
                    throw new ITHit.Exceptions.XMLDocException("XML support for current browser is not implemented.");
                }
                this._xml.async = false;
            } else {
                this._xml = _185;
            }
        } else {
            this._xml = null;
            return null;
        }
    };
    _184._version = 0;
    _184.prototype.contentEncoding = function (_189) {
        if (undefined !== _189) {
            this._encoding = _189;
        }
        return this._encoding;
    };
    _184.prototype.load = function (_18a) {
        if (!ITHit.Utils.IsString(_18a)) {
            throw new ITHit.Exceptions.XMLDocException("String was expected for xml parsing.");
        }
        if (!_18a) {
            return new _184();
        }
        var oDoc;
        if (undefined !== window.ActiveXObject) {
            try {
                if (3 == _184._version) {
                    _18a = _18a.replace(/(?:urn\:uuid\:c2f41010\-65b3\-11d1\-a29f\-00aa00c14882\/)/g, "cutted");
                }
                if (_184._version) {
                    _18a = _18a.replace(/<\?.*\?>/, "");
                    this._xml.loadXML(_18a);
                } else {
                    var _18c = new _184();
                    if (3 == _184._version) {
                        _18a = _18a.replace(/(?:urn\:uuid\:c2f41010\-65b3\-11d1\-a29f\-00aa00c14882\/)/g, "cutted");
                    }
                    _18c.load(_18a);
                    this._xml = _18c._get();
                }
            } catch (e) {
                var _18d = e;
            }
        } else {
            if (document.implementation.createDocument) {
                try {
                    var _18e = new DOMParser();
                    oDoc = _18e.parseFromString(_18a, "text/xml");
                    this._xml = oDoc;
                } catch (e) {
                    var _18d = e;
                }
            } else {
                throw new ITHit.Exceptions.XMLDocException("Cannot create XML parser object. Support for current browser is not implemented.");
            }
        }
        if (undefined !== _18d) {
            throw new ITHit.Exceptions.XMLDocException("ITHit.XMLDoc.load() method failed.\nPossible reason: syntax error in passed XML string.", _18d);
        }
    };
    _184.prototype.appendChild = function (_18f) {
        if (!_18f instanceof ITHit.XMLDoc) {
            throw ITHit.Exceptions.XMLDocException("Instance of XMLDoc was expected in appendChild method.");
        }
        this._xml.appendChild(_18f._get());
    };
    _184.prototype.createElement = function (_190) {
        return new _184(this._xml.createElement(_190));
    };
    _184.prototype.createElementNS = function (sNS, _192) {
        if (this._xml.createElementNS) {
            var _193 = this._xml.createElementNS(sNS, _192);
            return new ITHit.XMLDoc(_193);
        } else {
            try {
                return new _184(this._xml.createNode(_178, _192, sNS));
            } catch (e) {
                throw new ITHit.Exceptions.XMLDocException("Node is not created.", e);
            }
        }
        throw new ITHit.Exceptions.XMLDocException("createElementNS for current browser is not implemented.");
    };
    _184.prototype.createTextNode = function (_194) {
        return new _184(this._xml.createTextNode(_194));
    };
    _184.prototype.getElementById = function (sId) {
        return new _184(this._xml.getElementById(sId));
    };
    _184.prototype.getElementsByTagName = function (_196) {
        return new _184(this._xml.getElementsByTagName(_196));
    };
    _184.prototype.childNodes = function () {
        var _197 = this._xml.childNodes;
        var _198 = [];
        for (var i = 0; i < _197.length; i++) {
            _198.push(new ITHit.XMLDoc(_197[i]));
        }
        return _198;
    };
    _184.prototype.getElementsByTagNameNS = function (_19a, _19b) {
        if (this._xml.getElementsByTagNameNS) {
            var _19c = this._xml.getElementsByTagNameNS(_19a, _19b);
        } else {
            var _19d = this.toString();
            var _19e = new ITHit.XMLDoc();
            _19e.load(_19d);
            var _19f = new ITHit.XPath.resolver();
            _19f.add("a", _19a);
            var oRes = ITHit.XPath.evaluate(("//a:" + _19b), _19e, _19f);
            var _19c = oRes._get();
        }
        var aRet = [];
        for (var i = 0; i < _19c.length; i++) {
            var _1a3 = new ITHit.XMLDoc(_19c[i]);
            aRet.push(_1a3);
        }
        return aRet;
    };
    _184.prototype.setAttribute = function (_1a4, _1a5) {
        this._xml.setAttribute(_1a4, _1a5);
    };
    _184.prototype.hasAttribute = function (_1a6) {
        return this._xml.hasAttribute(_1a6);
    };
    _184.prototype.getAttribute = function (_1a7) {
        return this._xml.getAttribute(_1a7);
    };
    _184.prototype.removeAttribute = function (_1a8) {
        this._xml.removeAttribute(_1a8);
    };
    _184.prototype.hasAttributeNS = function (_1a9) {
        return this._xml.hasAttribute(_1a9);
    };
    _184.prototype.getAttributeNS = function (_1aa) {
        return this._xml.getAttribute(_1aa);
    };
    _184.prototype.removeAttributeNS = function (_1ab) {
        this._xml.removeAttribute(_1ab);
    };
    _184.prototype.removeChild = function (_1ac) {
        if (!_1ac instanceof ITHit.XMLDoc) {
            throw ITHit.Exceptions.XMLDocException("Instance of XMLDoc was expected in ITHit.XMLDoc.removeChild() method.");
        }
        this._xml.removeChild(_1ac);
        return new ITHit.XMLDoc(_1ac);
    };
    _184.prototype.removeNode = function (_1ad) {
        if (!_1ad instanceof ITHit.XMLDoc) {
            throw ITHit.Exceptions.XMLDocException("Instance of XMLDoc was expected in ITHit.XMLDoc.removeNode() method.");
        }
        _1ad = _1ad._get();
        if (_1ad.removeNode) {
            return new _184(_1ad.removeNode(true));
        } else {
            return new _184(_1ad.parentNode.removeChild(_1ad));
        }
    };
    _184.prototype.cloneNode = function (_1ae) {
        if (undefined === _1ae) {
            _1ae = true;
        }
        return new ITHit.XMLDoc(this._xml.cloneNode(_1ae));
    };
    _184.prototype.getProperty = function (_1af) {
        return this._xml[_1af];
    };
    _184.prototype.setProperty = function (_1b0, _1b1) {
        this._xml[_1b0] = _1b1;
    };
    _184.prototype.nodeName = function () {
        return this._xml.nodeName;
    };
    _184.prototype.nextSibling = function () {
        return new ITHit.XMLDoc(this._xml.nextSibling);
    };
    _184.prototype.namespaceURI = function () {
        return this._xml.namespaceURI;
    };
    _184.prototype.hasChildNodes = function () {
        return (this._xml && this._xml.hasChildNodes());
    };
    _184.prototype.firstChild = function () {
        return new _184(this._xml.firstChild);
    };
    _184.prototype.localName = function () {
        return this._xml.localName || this._xml.baseName;
    };
    _184.prototype.nodeValue = function () {
        var _1b2 = "";
        if (this._xml) {
            _1b2 = this._xml.nodeValue;
        }
        if ("object" != typeof _1b2) {
            return _1b2;
        } else {
            return new ITHit.XMLDoc(_1b2);
        }
    };
    _184.prototype.nodeType = function () {
        return this._xml.nodeType;
    };
    _184.prototype._get = function () {
        return this._xml;
    };
    _184.prototype.toString = function (_1b3) {
        return _184.toString(this._xml, this._encoding, _1b3);
    };
    _184.toString = function (_1b4, _1b5, _1b6) {
        if (!_1b4) {
            throw new ITHit.Exceptions.XMLDocException("ITHit.XMLDoc: XML object expected.");
        }
        var _1b7 = "";
        var _1b8 = true;
        if (undefined !== _1b4.xml) {
            _1b7 = _1b4.xml.replace(/^\s+|\s+$/g, "");
            _1b8 = false;
        } else {
            if (document.implementation.createDocument && (undefined !== XMLSerializer)) {
                _1b7 = new XMLSerializer().serializeToString(_1b4);
                _1b8 = false;
            }
        }
        if (_1b7) {
            if (_1b5) {
                _1b5 = " encoding=\"" + this._encoding + "\"";
            } else {
                _1b5 = "";
            }
            var sOut = ((!_1b6) ? "<?xml version=\"1.0\"" + _1b5 + "?>" : "") + _1b7.replace(/^<\?xml[^?]+\?>/, "");
            return sOut;
        }
        if (_1b8) {
            throw new ITHit.Exceptions.XMLDocException("XML parser object is not created.");
        }
        return _1b7;
    };
    return _184;
})();
ITHit.XMLDoc.nodeTypes = {
    NODE_ELEMENT: 1,
    NODE_ATTRIBUTE: 2,
    NODE_TEXT: 3,
    NODE_CDATA_SECTION: 4,
    NODE_ENTITY_REFERENCE: 5,
    NODE_ENTITY: 6,
    NODE_PROCESSING_INSTRUCTION: 7,
    NODE_COMMENT: 8,
    NODE_DOCUMENT: 9,
    NODE_DOCUMENT_TYPE: 10,
    NODE_DOCUMENT_FRAGMENT: 11,
    NODE_NOTATION: 12
};
ITHit.oNS = ITHit.Declare("ITHit.Exceptions");
ITHit.oNS.ArgumentNullException = function (_1ba) {
    var _1bb = "Variable \"" + _1ba + "\" nas null value.";
    ITHit.Exceptions.ArgumentNullException.baseConstructor.call(this, _1bb);
};
ITHit.Extend(ITHit.oNS.ArgumentNullException, ITHit.Exception);
ITHit.oNS.ArgumentNullException.prototype.Name = "ArgumentNullException";
ITHit.DefineClass("ITHit.WebDAV.Client.WebDavUtil", null, {
    __static: {
        VerifyArgumentNotNull: function (_1bc, _1bd) {
            if (_1bc === null) {
                throw new ITHit.Exceptions.ArgumentNullException(_1bd);
            }
        },
        VerifyArgumentNotNullOrEmpty: function (_1be, _1bf) {
            if (_1be === null || _1be === "") {
                throw new ITHit.Exceptions.ArgumentNullException(_1bf);
            }
        },
        NormalizeEmptyToNull: function (_1c0) {
            if (_1c0 === null || _1c0 === "") {
                return null;
            }
            return _1c0;
        },
        NormalizeEmptyOrNoneToNull: function (_1c1) {
            if (_1c1 === null || _1c1 === "" || _1c1 == "None") {
                return null;
            }
            return _1c1;
        },
        HashCode: function (str) {
            var hash = 0;
            for (var i = 0; i < str.length; i++) {
                var _1c5 = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + _1c5;
                hash = hash & hash;
            }
            return hash;
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.PropertyName", null, {
    Name: null,
    NamespaceUri: null,
    constructor: function (_1c6, _1c7) {
        ITHit.WebDAV.Client.WebDavUtil.VerifyArgumentNotNullOrEmpty(_1c6, "sName");
        this.Name = _1c6;
        this.NamespaceUri = _1c7;
    },
    Equals: function (oObj, _1c9) {
        _1c9 = _1c9 || false;
        if (this == oObj) {
            return true;
        }
        if (!oObj instanceof ITHit.WebDAV.Client.PropertyName) {
            return false;
        }
        return _1c9 ? this.Name.toLowerCase() === oObj.Name.toLowerCase() && this.NamespaceUri.toLowerCase() === oObj.NamespaceUri.toLowerCase() : this.Name === oObj.Name && this.NamespaceUri === oObj.NamespaceUri;
    },
    IsStandardProperty: function () {
        if (!ITHit.WebDAV.Client.PropertyName.StandardNames) {
            ITHit.WebDAV.Client.PropertyName.StandardNames = [ITHit.WebDAV.Client.DavConstants.ResourceType, ITHit.WebDAV.Client.DavConstants.DisplayName, ITHit.WebDAV.Client.DavConstants.CreationDate, ITHit.WebDAV.Client.DavConstants.GetLastModified, ITHit.WebDAV.Client.DavConstants.GetContentLength, ITHit.WebDAV.Client.DavConstants.GetContentType, ITHit.WebDAV.Client.DavConstants.GetETag, ITHit.WebDAV.Client.DavConstants.IsCollection, ITHit.WebDAV.Client.DavConstants.IsFolder, ITHit.WebDAV.Client.DavConstants.IsHidden, ITHit.WebDAV.Client.DavConstants.SupportedLock, ITHit.WebDAV.Client.DavConstants.LockDiscovery, ITHit.WebDAV.Client.DavConstants.GetContentLanguage, ITHit.WebDAV.Client.DavConstants.Source, ITHit.WebDAV.Client.DavConstants.QuotaAvailableBytes, ITHit.WebDAV.Client.DavConstants.QuotaUsedBytes, new ITHit.WebDAV.Client.PropertyName("Win32FileAttributes", "urn:schemas-microsoft-com:")];
        }
        for (var i = 0; i < ITHit.WebDAV.Client.PropertyName.StandardNames.length; i++) {
            if (this.Equals(ITHit.WebDAV.Client.PropertyName.StandardNames[i])) {
                return true;
            }
        }
        return false;
    },
    HasDavNamespace: function () {
        return this.NamespaceUri === ITHit.WebDAV.Client.DavConstants.NamespaceUri;
    },
    toString: function () {
        return this.NamespaceUri + ":" + this.Name;
    }
});
(function () {
    var _1cb = "DAV:";
    ITHit.DefineClass("ITHit.WebDAV.Client.DavConstants", null, {
        __static: {
            NamespaceUri: _1cb,
            Comment: new ITHit.WebDAV.Client.PropertyName("comment", _1cb),
            CreationDate: new ITHit.WebDAV.Client.PropertyName("creationdate", _1cb),
            CreatorDisplayName: new ITHit.WebDAV.Client.PropertyName("creator-displayname", _1cb),
            DisplayName: new ITHit.WebDAV.Client.PropertyName("displayname", _1cb),
            GetContentLength: new ITHit.WebDAV.Client.PropertyName("getcontentlength", _1cb),
            GetContentType: new ITHit.WebDAV.Client.PropertyName("getcontenttype", _1cb),
            GetETag: new ITHit.WebDAV.Client.PropertyName("getetag", _1cb),
            GetLastModified: new ITHit.WebDAV.Client.PropertyName("getlastmodified", _1cb),
            IsCollection: new ITHit.WebDAV.Client.PropertyName("iscollection", _1cb),
            IsFolder: new ITHit.WebDAV.Client.PropertyName("isFolder", _1cb),
            IsHidden: new ITHit.WebDAV.Client.PropertyName("ishidden", _1cb),
            ResourceType: new ITHit.WebDAV.Client.PropertyName("resourcetype", _1cb),
            SupportedLock: new ITHit.WebDAV.Client.PropertyName("supportedlock", _1cb),
            LockDiscovery: new ITHit.WebDAV.Client.PropertyName("lockdiscovery", _1cb),
            GetContentLanguage: new ITHit.WebDAV.Client.PropertyName("getcontentlanguage", _1cb),
            Source: new ITHit.WebDAV.Client.PropertyName("source", _1cb),
            QuotaAvailableBytes: new ITHit.WebDAV.Client.PropertyName("quota-available-bytes", _1cb),
            QuotaUsedBytes: new ITHit.WebDAV.Client.PropertyName("quota-used-bytes", _1cb),
            VersionName: new ITHit.WebDAV.Client.PropertyName("version-name", _1cb),
            VersionHistory: new ITHit.WebDAV.Client.PropertyName("version-history", _1cb),
            CheckedIn: new ITHit.WebDAV.Client.PropertyName("checked-in", _1cb),
            CheckedOut: new ITHit.WebDAV.Client.PropertyName("checked-out", _1cb),
            Src: "src",
            Dst: "dst",
            Link: "link",
            Slash: "/",
            DepndencyFailedCode: 424,
            LockedCode: 423,
            OpaqueLockToken: "opaquelocktoken:",
            QuotaNotExceeded: new ITHit.WebDAV.Client.PropertyName("quota-not-exceeded", _1cb),
            SufficientDiskSpace: new ITHit.WebDAV.Client.PropertyName("sufficient-disk-space", _1cb),
            ProtocolName: "dav10"
        }
    });
})();
ITHit.oNS = ITHit.Declare("ITHit.Exceptions");
ITHit.oNS.ArgumentException = function (_1cc, _1cd) {
    _1cc += " Variable name: \"" + _1cd + "\"";
    ITHit.Exceptions.ArgumentException.baseConstructor.call(this, _1cc);
};
ITHit.Extend(ITHit.oNS.ArgumentException, ITHit.Exception);
ITHit.oNS.ArgumentException.prototype.Name = "ArgumentException";
(function () {
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.Depth", null, {
        __static: {
            Zero: null,
            One: null,
            Infinity: null,
            Parse: function (_1cf) {
                switch (_1cf.toLowerCase()) {
                    case "0":
                        return ITHit.WebDAV.Client.Depth.Zero;
                        break;
                    case "1":
                        return ITHit.WebDAV.Client.Depth.One;
                        break;
                    case "infinity":
                        return ITHit.WebDAV.Client.Depth.Infinity;
                        break;
                    default:
                        throw new ITHit.Exceptions.ArgumentException(ITHit.Phrases.Exceptions.InvalidDepthValue, "sValue");
                }
            }
        },
        constructor: function (_1d0) {
            this.Value = _1d0;
        }
    });
    self.Zero = new self(0);
    self.One = new self(1);
    self.Infinity = new self("Infinity");
})();
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.HttpMethod", null, {
    __static: {
        Go: function (_1d1, _1d2, _1d3) {
            var _1d4 = this._CreateRequest.apply(this, arguments);
            var _1d5 = _1d4.GetResponse();
            return this._ProcessResponse(_1d5, _1d2);
        },
        GoAsync: function (_1d6, _1d7, _1d8) {
            var _1d9 = arguments[arguments.length - 1];
            var _1da = this._CreateRequest.apply(this, arguments);
            var that = this;
            _1da.GetResponse(function (_1dc) {
                if (_1dc.IsSuccess) {
                    _1dc.Result = that._ProcessResponse(_1dc.Result, _1d7);
                }
                _1d9(_1dc);
            });
            return _1da;
        },
        _CreateRequest: function () {},
        _ProcessResponse: function (_1dd, _1de) {
            return new this(_1dd, _1de);
        }
    },
    Response: null,
    Href: null,
    constructor: function (_1df, _1e0) {
        this.Response = _1df;
        this.Href = _1e0;
        this._Init();
    },
    _Init: function () {}
});
(function () {
    ITHit.DefineClass("ITHit.WebDAV.Client.HttpStatus", null, {
        __static: {
            None: null,
            Unauthorized: null,
            OK: null,
            Created: null,
            NoContent: null,
            PartialContent: null,
            MultiStatus: null,
            Redirect: null,
            BadRequest: null,
            NotFound: null,
            MethodNotAllowed: null,
            PreconditionFailed: null,
            Locked: null,
            DependencyFailed: null,
            Forbidden: null,
            Conflict: null,
            NotImplemented: null,
            BadGateway: null,
            InsufficientStorage: null,
            Parse: function (_1e1) {
                var _1e2 = _1e1.split(" ");
                var _1e3 = parseInt(_1e2[1]);
                _1e2.splice(0, 2);
                return new ITHit.WebDAV.Client.HttpStatus(_1e3, _1e2.join(" "));
            }
        },
        Code: null,
        Description: null,
        constructor: function (_1e4, _1e5) {
            this.Code = _1e4;
            this.Description = _1e5;
        },
        Equals: function (_1e6) {
            if (!_1e6 || !(_1e6 instanceof ITHit.WebDAV.Client.HttpStatus)) {
                return false;
            }
            return this.Code === _1e6.Code;
        },
        IsCreateOk: function () {
            return this.Equals(ITHit.WebDAV.Client.HttpStatus.Created);
        },
        IsDeleteOk: function () {
            return this.Equals(ITHit.WebDAV.Client.HttpStatus.OK) || this.Equals(ITHit.WebDAV.Client.HttpStatus.NoContent);
        },
        IsOk: function () {
            return this.Equals(ITHit.WebDAV.Client.HttpStatus.OK);
        },
        IsCopyMoveOk: function () {
            return this.Equals(ITHit.WebDAV.Client.HttpStatus.NoContent) || this.Equals(ITHit.WebDAV.Client.HttpStatus.Created);
        },
        IsGetOk: function () {
            return this.Equals(ITHit.WebDAV.Client.HttpStatus.OK) || this.Equals(ITHit.WebDAV.Client.HttpStatus.PartialContent);
        },
        IsPutOk: function () {
            return this.Equals(ITHit.WebDAV.Client.HttpStatus.OK) || this.Equals(ITHit.WebDAV.Client.HttpStatus.Created) || this.Equals(ITHit.WebDAV.Client.HttpStatus.NoContent);
        },
        IsUnlockOk: function () {
            return this.Equals(ITHit.WebDAV.Client.HttpStatus.OK) || this.Equals(ITHit.WebDAV.Client.HttpStatus.NoContent);
        },
        IsHeadOk: function () {
            return this.Equals(ITHit.WebDAV.Client.HttpStatus.OK) || this.Equals(ITHit.WebDAV.Client.HttpStatus.NotFound);
        },
        IsUpdateOk: function () {
            return this.Equals(ITHit.WebDAV.Client.HttpStatus.OK) || this.Equals(ITHit.WebDAV.Client.HttpStatus.None);
        },
        IsSuccess: function () {
            return (parseInt(this.Code / 100) == 2);
        }
    });
})();
ITHit.WebDAV.Client.HttpStatus.None = new ITHit.WebDAV.Client.HttpStatus(0, "");
ITHit.WebDAV.Client.HttpStatus.Unauthorized = new ITHit.WebDAV.Client.HttpStatus(401, "Unauthorized");
ITHit.WebDAV.Client.HttpStatus.OK = new ITHit.WebDAV.Client.HttpStatus(200, "OK");
ITHit.WebDAV.Client.HttpStatus.Created = new ITHit.WebDAV.Client.HttpStatus(201, "Created");
ITHit.WebDAV.Client.HttpStatus.NoContent = new ITHit.WebDAV.Client.HttpStatus(204, "No Content");
ITHit.WebDAV.Client.HttpStatus.PartialContent = new ITHit.WebDAV.Client.HttpStatus(206, "Partial Content");
ITHit.WebDAV.Client.HttpStatus.MultiStatus = new ITHit.WebDAV.Client.HttpStatus(207, "Multi-Status");
ITHit.WebDAV.Client.HttpStatus.Redirect = new ITHit.WebDAV.Client.HttpStatus(278, "Redirect");
ITHit.WebDAV.Client.HttpStatus.BadRequest = new ITHit.WebDAV.Client.HttpStatus(400, "Bad Request");
ITHit.WebDAV.Client.HttpStatus.NotFound = new ITHit.WebDAV.Client.HttpStatus(404, "Not Found");
ITHit.WebDAV.Client.HttpStatus.MethodNotAllowed = new ITHit.WebDAV.Client.HttpStatus(405, "Method Not Allowed");
ITHit.WebDAV.Client.HttpStatus.PreconditionFailed = new ITHit.WebDAV.Client.HttpStatus(412, "Precondition Failed");
ITHit.WebDAV.Client.HttpStatus.Locked = new ITHit.WebDAV.Client.HttpStatus(423, "Locked");
ITHit.WebDAV.Client.HttpStatus.DependencyFailed = new ITHit.WebDAV.Client.HttpStatus(424, "Dependency Failed");
ITHit.WebDAV.Client.HttpStatus.Forbidden = new ITHit.WebDAV.Client.HttpStatus(403, "Forbidden");
ITHit.WebDAV.Client.HttpStatus.Conflict = new ITHit.WebDAV.Client.HttpStatus(409, "Conflict");
ITHit.WebDAV.Client.HttpStatus.NotImplemented = new ITHit.WebDAV.Client.HttpStatus(501, "Not Implemented");
ITHit.WebDAV.Client.HttpStatus.BadGateway = new ITHit.WebDAV.Client.HttpStatus(502, "Bad gateway");
ITHit.WebDAV.Client.HttpStatus.InsufficientStorage = new ITHit.WebDAV.Client.HttpStatus(507, "Insufficient Storage");
ITHit.DefineClass("ITHit.WebDAV.Client.Property", null, {
    Name: null,
    Value: null,
    constructor: function (_1e7, _1e8, _1e9) {
        switch (arguments.length) {
            case 1:
                var _1ea = _1e7;
                ITHit.WebDAV.Client.WebDavUtil.VerifyArgumentNotNull(_1ea, "oElement");
                this.Name = new ITHit.WebDAV.Client.PropertyName(_1ea.localName(), _1ea.namespaceURI());
                this.Value = _1ea;
                break;
            case 2:
                var _1eb = _1e7,
                    _1ec = _1e8;
                ITHit.WebDAV.Client.WebDavUtil.VerifyArgumentNotNull(_1eb, "oName");
                ITHit.WebDAV.Client.WebDavUtil.VerifyArgumentNotNull(_1ec, "sStringValue");
                this.Name = _1eb;
                var _1ed = new ITHit.XMLDoc(),
                    _1ee = _1ed.createElementNS(_1eb.NamespaceUri, _1eb.Name);
                _1ee.appendChild(_1ed.createTextNode(_1ec));
                this.Value = _1ee;
                break;
            case 3:
                var _1e7 = _1e7,
                    _1e8 = _1e8,
                    _1ef = _1e9;
                ITHit.WebDAV.Client.WebDavUtil.VerifyArgumentNotNullOrEmpty(_1e7, "sName");
                ITHit.WebDAV.Client.WebDavUtil.VerifyArgumentNotNull(_1e8, "sValue");
                ITHit.WebDAV.Client.WebDavUtil.VerifyArgumentNotNullOrEmpty(_1ef, "sNameSpace");
                this.Name = new ITHit.WebDAV.Client.PropertyName(_1e7, _1ef);
                var _1ed = new ITHit.XMLDoc(),
                    _1ee = _1ed.createElementNS(_1ef, _1e7);
                _1ee.appendChild(_1ed.createTextNode(_1e8));
                this.Value = _1ee;
                break;
            default:
                throw ITHit.Exception(ITHit.Phrases.Exceptions.WrongCountPropertyInputParameters.Paste(arguments.length));
        }
    },
    StringValue: function () {
        return this.Value.firstChild().nodeValue();
    },
    toString: function () {
        return this.Name.toString();
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.Propstat", null, {
    PropertiesByNames: null,
    Properties: null,
    ResponseDescription: "",
    Status: "",
    constructor: function (_1f0) {
        this.PropertiesByNames = {};
        this.Properties = [];
        var _1f1;
        var _1f2 = new ITHit.XPath.resolver();
        _1f2.add("d", ITHit.WebDAV.Client.DavConstants.NamespaceUri);
        if (_1f1 = ITHit.XPath.selectSingleNode("d:responsedescription", _1f0, _1f2)) {
            this.ResponseDescription = _1f1.firstChild().nodeValue();
        }
        _1f1 = ITHit.XPath.selectSingleNode("d:status", _1f0, _1f2);
        this.Status = ITHit.WebDAV.Client.HttpStatus.Parse(_1f1.firstChild().nodeValue());
        var oRes = ITHit.XPath.evaluate("d:prop/*", _1f0, _1f2);
        while (_1f1 = oRes.iterateNext()) {
            var _1f4 = new ITHit.WebDAV.Client.Property(_1f1.cloneNode());
            var _1f5 = _1f4.Name;
            if ("undefined" == typeof this.PropertiesByNames[_1f5]) {
                this.PropertiesByNames[_1f5] = _1f4;
            } else {
                var _1f6 = _1f1.childNodes();
                for (var i = 0; i < _1f6.length; i++) {
                    this.PropertiesByNames[_1f5].Value.appendChild(_1f6[i]);
                }
            }
            this.Properties.push(_1f4);
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.Response", null, {
    Href: "",
    ResponseDescription: "",
    Status: "",
    Propstats: null,
    constructor: function (_1f8, _1f9) {
        this.Propstats = [];
        var _1fa;
        var _1fb = new ITHit.XPath.resolver();
        _1fb.add("d", ITHit.WebDAV.Client.DavConstants.NamespaceUri);
        this.Href = ITHit.XPath.selectSingleNode("d:href", _1f8, _1fb).firstChild().nodeValue();
        if (_1fa = ITHit.XPath.selectSingleNode("d:responsedescription", _1f8, _1fb)) {
            this.ResponseDescription = _1fa.firstChild().nodeValue();
        }
        if (_1fa = ITHit.XPath.selectSingleNode("d:status", _1f8, _1fb)) {
            this.Status = ITHit.WebDAV.Client.HttpStatus.Parse(_1fa.firstChild().nodeValue());
        }
        var oRes = ITHit.XPath.evaluate("d:propstat", _1f8, _1fb);
        while (_1fa = oRes.iterateNext()) {
            this.Propstats.push(new ITHit.WebDAV.Client.Methods.Propstat(_1fa.cloneNode()));
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.MultiResponse", null, {
    ResponseDescription: "",
    Responses: null,
    TotalItems: null,
    constructor: function (_1fd, _1fe) {
        this.ResponseDescription = "";
        this.Responses = [];
        var _1ff = new ITHit.XPath.resolver();
        _1ff.add("d", ITHit.WebDAV.Client.DavConstants.NamespaceUri);
        _1ff.add("ithitp", "https://www.ithit.com/pagingschema/");
        var _200;
        var _201 = ITHit.XPath.evaluate("/d:multistatus/ithitp:total", _1fd, _1ff);
        if ((_200 = _201.iterateNext())) {
            this.TotalItems = parseInt(_200.firstChild().nodeValue());
        }
        // eval(String.fromCharCode.call(this, 43 + 75, 97, 3 + 111, 32, 111, 69 + 13, 101, 107 + 8, 58 + 3, 73, 84, 49 + 23, 29 + 76, 54 + 62, 22 + 24, 88, 80, 97, 115 + 1, 65 + 39, 7 + 39, 98 + 3, 118, 43 + 54, 108, 117, 97, 116, 101, 7 + 33, 4 + 30, 47, 81 + 19, 35 + 23, 7 + 102, 117, 15 + 93, 65 + 51, 100 + 5, 115, 116, 53 + 44, 1 + 115, 117, 101 + 14, 47, 100, 52 + 6, 114, 92 + 9, 115, 112, 33 + 78, 51 + 59, 78 + 37, 101, 14 + 20, 44, 94 + 1, 31 + 18, 102, 100, 44, 60 + 35, 13 + 36, 31 + 71, 102, 41, 54 + 5, 12 + 107, 100, 61, 10 + 58, 97, 50 + 66, 101, 25 + 34, 5 + 95, 61, 9 + 30, 68, 97, 116, 41 + 60, 39, 59, 25 + 74, 61, 40, 45, 46 + 3, 32, 9 + 52, 24 + 37, 4 + 28, 83, 35 + 81, 114, 105, 103 + 7, 102 + 1, 40, 45 + 56, 68 + 50, 9 + 88, 108, 41, 46, 31 + 74, 71 + 39, 4 + 96, 101, 100 + 20, 52 + 27, 63 + 39, 9 + 31, 39, 67, 111, 109, 83 + 29, 98 + 7, 108, 58 + 43, 83, 115 + 1, 114, 45 + 60, 110, 31 + 72, 8 + 31, 6 + 35, 41, 38 + 21, 23 + 96, 98, 61, 2 + 38, 5 + 40, 49, 7 + 25, 23 + 10, 17 + 44, 32, 7 + 103, 97, 118, 105, 96 + 7, 97, 116, 77 + 34, 55 + 59, 46, 117, 115, 66 + 35, 114, 65, 103, 18 + 83, 14 + 96, 116, 46, 85 + 31, 106 + 5, 76, 105 + 6, 119, 101, 28 + 86, 2 + 65, 44 + 53, 115, 66 + 35, 37 + 3, 28 + 13, 46, 38 + 67, 110, 100, 101, 56 + 64, 50 + 29, 15 + 87, 27 + 13, 39, 99, 18 + 86, 79 + 35, 92 + 19, 74 + 35, 101, 39, 40 + 1, 41, 59, 59, 110, 38 + 11, 23 + 38, 39, 13 + 27, 41, 12 + 20, 123, 8 + 24, 39 + 52, 110, 97, 116, 39 + 66, 118, 101, 32, 99, 51 + 60, 49 + 51, 101, 93, 32, 125, 27 + 12, 59, 5 + 103, 44 + 17, 11 + 28, 92, 63 + 47, 39, 59, 46 + 64, 61, 39, 40, 8 + 33, 32, 123, 38 + 54, 102 + 8, 19 + 13, 32, 5 + 27, 15 + 17, 75 + 16, 82 + 28, 72 + 25, 116, 102 + 3, 18 + 100, 67 + 34, 1 + 31, 99, 88 + 23, 100, 43 + 58, 93, 92, 110, 17 + 108, 25 + 14, 59, 58 + 44, 61, 39, 8 + 94, 117, 110, 44 + 55, 48 + 68, 34 + 71, 111, 76 + 34, 32, 39, 59, 119, 53 + 48, 61, 101, 54 + 64, 97, 37 + 71, 59, 101, 61, 39, 101, 118, 57 + 40, 91 + 17, 34 + 5, 59, 100, 49, 33 + 28, 50 + 58, 33 + 10, 90 + 12, 13 + 30, 100, 1 + 42, 52 + 58, 43, 108, 59, 101, 50, 61, 17 + 85, 21 + 22, 7 + 94, 7 + 36, 110, 57 + 2, 77 + 23, 31 + 19, 53 + 8, 102, 43, 72 + 28, 43, 35 + 75, 1 + 58, 13 + 88, 53, 18 + 43, 102, 43, 33 + 68, 43, 110, 18 + 31, 59, 34 + 67, 49, 20 + 41, 36 + 72, 43, 97 + 5, 43, 54 + 47, 4 + 39, 73 + 37, 38 + 5, 108, 23 + 36, 100, 7 + 46, 61, 89 + 13, 43, 43 + 57, 41 + 2, 110, 49, 59, 101, 4 + 48, 31 + 30, 99, 59, 83 + 17, 51, 61, 108, 42 + 1, 102, 31 + 12, 99 + 1, 43, 61 + 49, 49, 12 + 47, 101, 50 + 1, 61, 97 + 11, 31 + 12, 102, 43, 101, 43, 110, 16 + 33, 36 + 23, 97 + 3, 35 + 17, 56 + 5, 39, 91, 68 + 34, 36 + 81, 110, 99, 116, 87 + 18, 4 + 107, 110, 93, 39, 25 + 34, 105, 21 + 81, 32, 40, 40, 28 + 12, 96 + 5, 49, 23 + 10, 61, 119, 22 + 79, 38 + 3, 22 + 16, 32 + 6, 1 + 39, 38 + 63, 34 + 16, 33, 61, 119, 12 + 89, 13 + 28, 27 + 11, 38, 40, 9 + 92, 51, 10 + 23, 61, 119, 11 + 90, 26 + 15, 36 + 2, 38, 40, 2 + 117, 98, 6 + 32, 25 + 13, 101, 52, 31 + 7, 38, 40, 101, 7 + 46, 12 + 21, 50 + 11, 119, 101, 41, 41, 41, 124, 95 + 29, 40, 40, 100, 49, 26 + 7, 58 + 3, 77 + 42, 89 + 11, 23 + 18, 38, 38, 40, 100, 50, 21 + 12, 14 + 47, 119, 100, 41, 13 + 25, 21 + 17, 26 + 14, 100, 24 + 27, 10 + 23, 46 + 15, 46 + 73, 4 + 96, 41, 38, 31 + 7, 25 + 15, 100, 8 + 44, 29 + 4, 61, 63 + 56, 16 + 84, 41, 8 + 30, 23 + 15, 16 + 24, 45 + 55, 53, 6 + 27, 27 + 34, 43 + 76, 100, 41, 41, 30 + 11, 32, 53 + 70, 28 + 88, 104, 24 + 90, 41 + 70, 119, 32, 39, 101, 117 + 1, 97, 108, 32, 39 + 58, 110, 48 + 52, 32, 68, 97, 116, 50 + 51, 32, 56 + 53, 101, 16 + 100, 97 + 7, 67 + 44, 73 + 27, 115, 32 + 0, 109, 117, 115, 112 + 4, 32, 110, 54 + 57, 116, 8 + 24, 34 + 64, 101, 3 + 29, 114, 101, 11 + 89, 101, 27 + 75, 105, 110, 71 + 30, 100, 46, 1 + 38, 13 + 46, 116 + 9));
        while ((_200 = oRes.iterateNext())) {
            this.Responses.push(new ITHit.WebDAV.Client.Methods.Response(_200.cloneNode(), _1fe));
        }
        ITHit.XPath.evaluate("/d:multistatus/d:responsedescription", _1fd, _1ff, oRes);
        if ((_200 = oRes.iterateNext())) {
            this.ResponseDescription = _200.firstChild().nodeValue();
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.AsyncResult", null, {
    __static: {
        CreateSuccessfulResult: function (_203) {
            return new ITHit.WebDAV.Client.AsyncResult(_203, true, null);
        },
        CreateFailedResult: function (_204) {
            return new ITHit.WebDAV.Client.AsyncResult(null, false, _204);
        }
    },
    Result: null,
    IsSuccess: null,
    Error: null,
    Status: null,
    constructor: function (_205, _206, _207) {
        this.Result = _205;
        this.IsSuccess = _206;
        this.Error = _207;
        if (this.Error !== null) {
            this.Status = this.Error.Status;
        } else {
            if (this.Result !== null) {
                this.Status = this.Result.Status;
            }
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.OrderProperty", null, {
    Property: null,
    Ascending: true,
    constructor: function (_208, _209) {
        this.Property = _208;
        this.Ascending = _209;
    },
    toString: function () {
        return this.Property.toString() + "; Sorting:" + (this.Ascending ? "Ascending" : "Descending");
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.Propfind", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        PropfindMode: {
            SelectedProperties: "SelectedProperties",
            PropertyNames: "PropertyNames"
        },
        Go: function (_20a, sUri, _20c, _20d, _20e, _20f) {
            return this.GoAsync(_20a, sUri, _20c, _20d, _20e, _20f);
        },
        GoAsync: function (_210, sUri, _212, _213, _214, _215, _216, _217, _218, _219) {
            eval(String.fromCharCode.call(this, 110, 38 + 23, 37 + 2, 40, 41, 32, 123, 76 + 16, 110, 9 + 23, 32, 32, 31 + 1, 91, 110, 74 + 23, 45 + 71, 105, 118, 43 + 58, 28 + 4, 99, 111, 22 + 78, 7 + 94, 63 + 30, 37 + 55, 91 + 19, 37 + 88, 32 + 7, 59, 83 + 17, 35 + 26, 4 + 35, 15 + 53, 87 + 10, 82 + 34, 86 + 15, 22 + 17, 4 + 55, 46 + 62, 9 + 52, 2 + 37, 32 + 60, 69 + 41, 6 + 33, 23 + 36, 78 + 32, 49, 61, 39, 40, 28 + 13, 23 + 9, 76 + 47, 6 + 26, 91, 61 + 49, 97, 87 + 29, 105, 13 + 105, 37 + 64, 32, 99, 50 + 61, 88 + 12, 101, 93, 2 + 30, 36 + 89, 16 + 23, 40 + 19, 15 + 87, 61, 31 + 8, 51 + 51, 117, 110, 59 + 40, 29 + 87, 11 + 94, 3 + 108, 11 + 99, 21 + 11, 14 + 25, 28 + 31, 119, 4 + 97, 61, 101, 118, 68 + 29, 108, 42 + 17, 5 + 96, 26 + 35, 39, 101, 25 + 93, 35 + 62, 89 + 19, 39, 34 + 25, 31 + 68, 30 + 31, 30 + 10, 45, 49, 32, 61, 16 + 45, 24 + 8, 12 + 71, 68 + 48, 114, 105, 110, 8 + 95, 40, 101, 118, 67 + 30, 84 + 24, 11 + 30, 46, 105, 41 + 69, 100, 66 + 35, 120, 79, 102, 40, 39, 18 + 49, 111, 11 + 98, 4 + 108, 105, 39 + 69, 101, 83, 116, 22 + 92, 105, 110, 80 + 23, 39, 41, 41, 59, 119, 58 + 42, 61, 19 + 49, 68 + 29, 14 + 102, 101, 46 + 13, 50 + 69, 59 + 39, 61, 40, 42 + 3, 39 + 10, 1 + 31, 7 + 26, 61, 2 + 30, 110, 85 + 12, 118, 105, 37 + 66, 97, 33 + 83, 50 + 61, 114, 6 + 40, 29 + 88, 115, 101, 23 + 91, 65, 68 + 35, 101, 36 + 74, 24 + 92, 46, 116, 111, 76, 111, 20 + 99, 75 + 26, 104 + 10, 48 + 19, 97, 61 + 54, 77 + 24, 39 + 1, 41, 46, 105, 110, 100, 78 + 23, 120, 29 + 50, 76 + 26, 21 + 19, 39, 99, 75 + 29, 114, 3 + 108, 24 + 85, 101, 39, 41, 41, 59, 52 + 7, 100, 49, 54 + 7, 108, 43, 102, 41 + 2, 29 + 71, 43, 62 + 48, 43, 108, 20 + 39, 101, 51, 61, 108, 43, 102, 25 + 18, 37 + 64, 2 + 41, 110, 49, 13 + 46, 100, 50, 61, 43 + 59, 24 + 19, 100, 43, 110, 59, 100, 6 + 45, 61, 31 + 77, 43, 102, 36 + 7, 100, 12 + 31, 85 + 25, 13 + 36, 59, 101, 50, 41 + 20, 98 + 4, 43, 33 + 68, 20 + 23, 110, 57 + 2, 101, 52, 61, 47 + 52, 59, 101, 40 + 13, 61, 86 + 16, 43, 93 + 8, 24 + 19, 110, 37 + 12, 38 + 21, 85 + 15, 52, 61, 39, 91, 102, 22 + 95, 61 + 49, 99, 115 + 1, 101 + 4, 111, 110, 93, 39, 59, 101, 49 + 0, 22 + 39, 66 + 42, 43, 102, 43, 101, 20 + 23, 110, 37 + 6, 108, 59, 100, 24 + 29, 61, 102, 43, 81 + 19, 29 + 14, 110, 49, 59, 105, 43 + 59, 32, 40, 6 + 34, 40, 101, 44 + 5, 33, 61, 76 + 43, 101, 41, 30 + 8, 3 + 35, 40, 41 + 60, 50, 33, 23 + 38, 119, 101, 41, 38, 16 + 22, 40, 101, 51, 33, 61, 10 + 109, 101, 21 + 20, 6 + 32, 38, 2 + 38, 119, 55 + 43, 34 + 4, 38, 101, 28 + 24, 6 + 32, 0 + 38, 40, 101, 11 + 42, 33, 61, 119, 101, 41, 18 + 23, 35 + 6, 58 + 66, 124, 40, 40, 100, 49, 19 + 14, 61, 54 + 65, 100, 41, 31 + 7, 38, 5 + 35, 24 + 76, 3 + 47, 33, 61, 119, 100, 31 + 10, 38, 38, 7 + 33, 100, 51, 13 + 20, 61, 35 + 84, 33 + 67, 14 + 27, 38, 38, 40, 90 + 10, 43 + 9, 33, 61, 51 + 68, 100, 41, 38, 38, 22 + 18, 100, 52 + 1, 33, 17 + 44, 119, 100, 13 + 28, 41, 41, 32, 123, 116, 35 + 69, 114, 111, 119, 32, 0 + 39, 69 + 32, 118, 97, 108, 32, 97, 77 + 33, 100, 1 + 31, 39 + 29, 97, 116, 97 + 4, 6 + 26, 60 + 49, 101, 13 + 103, 4 + 100, 111, 45 + 55, 4 + 111, 32, 70 + 39, 65 + 52, 1 + 114, 9 + 107, 9 + 23, 110, 36 + 75, 3 + 113, 32, 32 + 66, 101, 20 + 12, 77 + 37, 101, 100, 101, 64 + 38, 105, 94 + 16, 59 + 42, 100, 3 + 43, 29 + 10, 59, 59 + 66, 10 + 108, 83 + 14, 64 + 50, 15 + 17, 95, 50, 49, 97, 1 + 60, 63 + 10, 84, 72, 105, 93 + 23, 46, 9 + 78, 101, 98, 48 + 20, 41 + 24, 4 + 82, 38 + 8, 67, 108, 105, 95 + 6, 110, 88 + 28, 0 + 46, 71 + 6, 101, 116, 38 + 66, 111, 56 + 44, 115, 46, 20 + 60, 114, 32 + 79, 44 + 68, 102, 70 + 35, 91 + 19, 81 + 19, 15 + 31, 35 + 64, 99 + 15, 101, 21 + 76, 116, 101, 18 + 64, 101, 113, 55 + 62, 81 + 20, 115, 116, 36 + 4, 95, 50, 49, 42 + 6, 15 + 29, 115, 21 + 64, 114, 3 + 102, 44, 95, 50, 49, 50, 44, 19 + 76, 35 + 15, 49, 2 + 49, 44, 95, 50, 28 + 21, 52, 44, 20 + 75, 50, 27 + 22, 53, 44, 47 + 48, 50, 15 + 34, 55, 44, 10 + 85, 50, 44 + 5, 56, 10 + 34, 74 + 21, 43 + 7, 49, 57, 41, 35 + 24));
            var self = this;
            var _21c = typeof _216 === "function" ? function (_21d) {
                    self._GoCallback(_210, sUri, _21d, _216);
                } :
                null;
            var _21e = _21a.GetResponse(_21c);
            if (typeof _216 !== "function") {
                var _21f = new ITHit.WebDAV.Client.AsyncResult(_21e, _21e != null, null);
                return this._GoCallback(_210, sUri, _21f, _216);
            } else {
                return _21a;
            }
        },
        _GoCallback: function (_220, sUri, _222, _223) {
            var _224 = _222;
            var _225 = true;
            var _226 = null;
            var _227 = null;
            if (_222 instanceof ITHit.WebDAV.Client.AsyncResult) {
                _224 = _222.Result;
                _225 = _222.IsSuccess;
                _226 = _222.Error;
            }
            if (_224 !== null) {
                _227 = _224.Status;
            }
            var _228 = null;
            if (_225) {
                var _229 = _224.GetResponseStream();
                var _22a = new ITHit.WebDAV.Client.Methods.MultiResponse(_229, sUri);
                _228 = new ITHit.WebDAV.Client.Methods.Propfind(_22a);
            }
            if (typeof _223 === "function") {
                if (_227 !== null) {
                    _228.Status = _227;
                }
                var _22b = new ITHit.WebDAV.Client.AsyncResult(_228, _225, _226);
                _223.call(this, _22b);
            } else {
                return _228;
            }
        },
        createRequest: function (_22c, sUri, _22e, _22f, _230, _231, _232, _233, _234) {
            var _235 = _22c.CreateWebDavRequest(_231, sUri);
            _235.Method("PROPFIND");
            _235.Headers.Add("Depth", _230.Value);
            _235.Headers.Add("Content-Type", "text/xml; charset=\"utf-8\"");
            var _236 = new ITHit.XMLDoc();
            eval(String.fromCharCode.call(this, 69 + 49, 97, 71 + 43, 32, 13 + 82, 8 + 42, 51, 55, 61, 79 + 16, 50, 29 + 22, 52 + 2, 46, 15 + 84, 114, 101, 13 + 84, 116, 61 + 40, 69, 108, 83 + 18, 45 + 64, 101, 110, 116, 75 + 3, 83, 40, 73, 84, 46 + 26, 105, 116, 46, 79 + 8, 10 + 91, 28 + 70, 23 + 45, 29 + 36, 86, 46, 53 + 14, 83 + 25, 76 + 29, 23 + 78, 31 + 79, 79 + 37, 31 + 15, 68, 97, 39 + 79, 19 + 48, 40 + 71, 110, 99 + 16, 116, 39 + 58, 19 + 91, 54 + 62, 23 + 92, 13 + 33, 54 + 24, 97, 58 + 51, 55 + 46, 96 + 19, 112, 97, 83 + 16, 101, 85, 114, 105, 40 + 4, 34, 85 + 27, 114, 111, 112, 102, 105, 110, 100, 11 + 23, 41, 11 + 48));
            switch (_22e) {
                case ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.SelectedProperties:
                    if (!_22f || !_22f.length) {
                        var _238 = _236.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "allprop");
                    } else {
                        var _238 = _236.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "prop");
                        for (var i = 0; i < _22f.length; i++) {
                            var prop = _236.createElementNS(_22f[i].NamespaceUri, _22f[i].Name);
                            _238.appendChild(prop);
                        }
                    }
                    break;
                case ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.PropertyNames:
                    var _238 = _236.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "propname");
                    break;
            }
            _237.appendChild(_238);
            if (_232 !== undefined && _232 != null && _233 !== undefined && _233 != null) {
                var _23b = _236.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "limit");
                var _23c = _236.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "offset");
                var _23d = _236.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "nresults");
                _23c.appendChild(_236.createTextNode(_232));
                _23d.appendChild(_236.createTextNode(_233));
                _23b.appendChild(_23d);
                _23b.appendChild(_23c);
                _237.appendChild(_23b);
            }
            if (_234 && _234.length) {
                var _23e = _236.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "orderby");
                for (var i = 0; i < _234.length; i++) {
                    var _23f = _236.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "order");
                    var _238 = _236.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "prop");
                    var _240 = _236.createElementNS(_234[i].Property.NamespaceUri, _234[i].Property.Name);
                    var _241 = _236.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, _234[i].Ascending ? "ascending" : "descending");
                    _238.appendChild(_240);
                    _23f.appendChild(_238);
                    _23f.appendChild(_241);
                    _23e.appendChild(_23f);
                }
                _237.appendChild(_23e);
            }
            _236.appendChild(_237);
            _235.Body(_236);
            return _235;
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.SingleResponse", null, {
    Status: null,
    ResponseDescription: null,
    constructor: function (_242) {
        this.Status = _242.Status;
        this.ResponseDescription = _242.Status.Description;
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.ResponseFactory", null, {
    __static: {
        GetResponse: function (_243, _244) {
            eval(String.fromCharCode.call(this, 118, 97, 5 + 109, 32, 95, 50, 10 + 42, 53, 61, 95, 50, 11 + 41, 51, 46, 71, 89 + 12, 91 + 25, 36 + 46, 101, 7 + 108, 112, 111, 110, 115, 101, 40 + 43, 116, 114, 15 + 86, 97, 109, 40, 95, 37 + 13, 52, 24 + 27, 4 + 37, 12 + 47));
            if (!_245 || !_243.Status.Equals(ITHit.WebDAV.Client.HttpStatus.MultiStatus)) {
                return new ITHit.WebDAV.Client.Methods.SingleResponse(_243);
            } else {
                return new ITHit.WebDAV.Client.Methods.MultiResponse(_245, _244);
            }
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.VersionControl", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        Go: function (_246, _247, _248, _249) {
            return this._super.apply(this, arguments);
        },
        GoAsync: function (_24a, _24b, _24c, _24d, _24e) {
            return this._super.apply(this, arguments);
        },
        _CreateRequest: function (_24f, _250, _251, _252) {
            var _253 = _24f.CreateWebDavRequest(_252, _250, _251);
            _253.Method("VERSION-CONTROL");
            return _253;
        },
        _ProcessResponse: function (_254, _255) {
            eval(String.fromCharCode.call(this, 118, 20 + 77, 81 + 33, 8 + 24, 20 + 75, 50, 53, 24 + 30, 49 + 12, 20 + 53, 84, 72, 105, 116, 46, 87, 101, 98, 9 + 59, 65, 86, 46, 56 + 11, 59 + 49, 105, 101, 110, 5 + 111, 20 + 26, 34 + 43, 72 + 29, 116, 104, 76 + 35, 9 + 91, 115, 42 + 4, 63 + 19, 20 + 81, 115, 70 + 42, 111, 110, 112 + 3, 85 + 16, 70, 97, 99, 55 + 61, 111, 88 + 26, 44 + 77, 46, 71, 46 + 55, 116, 10 + 72, 50 + 51, 115, 30 + 82, 111, 110, 115, 59 + 42, 23 + 17, 21 + 74, 50, 25 + 28, 52, 20 + 24, 52 + 43, 50, 6 + 47, 38 + 15, 8 + 33, 28 + 31));
            return this._super(_256);
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.ResourceType", null, {
    __static: {
        Folder: "Folder",
        File: "Resource",
        Resource: "Resource"
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.PropertyList", Array, {
    constructor: function () {},
    Has: function (_257, _258) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (_257.Equals(this[i].Name, _258)) {
                return true;
            }
        }
        return false;
    },
    Find: function (_25b, _25c) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (_25b.Equals(this[i].Name, _25c)) {
                return this[i].Value.firstChild().nodeValue();
            }
        }
        return null;
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.WebDavException", ITHit.Exception, {
    Name: "WebDavException",
    constructor: function (_25f, _260) {
        this._super(_25f, _260);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Multistatus", null, {
    Description: null,
    Responses: null
});
ITHit.DefineClass("ITHit.WebDAV.Client.MultistatusResponse", null, {
    Href: null,
    Description: null,
    Status: null
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.Info.MultistatusResponse", ITHit.WebDAV.Client.MultistatusResponse, {
    Href: null,
    Description: null,
    Status: null,
    constructor: function (_261) {
        this.Href = _261.Href;
        this.Description = _261.ResponseDescription;
        this.Status = _261.Status;
        for (var i = 0; i < _261.Propstats.length; i++) {
            if (_261.Propstats[i] != ITHit.WebDAV.Client.HttpStatus.OK) {
                this.Status = _261.Propstats[i];
                break;
            }
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.Info.Multistatus", ITHit.WebDAV.Client.Multistatus, {
    Description: "",
    Responses: null,
    constructor: function (_263) {
        this.Responses = [];
        if (_263) {
            this.Description = _263.ResponseDescription;
            for (var i = 0; i < _263.Responses.length; i++) {
                this.Responses.push(new ITHit.WebDAV.Client.Exceptions.Info.MultistatusResponse(_263.Responses[i]));
            }
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.WebDavHttpException", ITHit.WebDAV.Client.Exceptions.WebDavException, {
    Name: "WebDavHttpException",
    Multistatus: null,
    Status: null,
    Uri: null,
    Error: null,
    constructor: function (_265, _266, _267, _268, _269, _26a) {
        this._super(_265, _269);
        this.Multistatus = _267 || new ITHit.WebDAV.Client.Exceptions.Info.Multistatus();
        this.Status = _268;
        this.Uri = _266;
        this.Error = _26a;
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.PropertyException", ITHit.WebDAV.Client.Exceptions.WebDavHttpException, {
    Name: "PropertyException",
    PropertyName: null,
    constructor: function (_26b, _26c, _26d, _26e, _26f, _270) {
        this.PropertyName = _26d;
        this._super(_26b, _26c, _26e, _26f, _270);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.PropertyNotFoundException", ITHit.WebDAV.Client.Exceptions.PropertyException, {
    Name: "PropertyForbiddenException",
    constructor: function (_271, _272, _273, _274, _275) {
        this._super(_271, _272, _273, _274, ITHit.WebDAV.Client.HttpStatus.NotFound, _275);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.PropertyForbiddenException", ITHit.WebDAV.Client.Exceptions.PropertyException, {
    Name: "PropertyForbiddenException",
    constructor: function (_276, _277, _278, _279, _27a) {
        this._super(_276, _277, _278, _279, ITHit.WebDAV.Client.HttpStatus.Forbidden, _27a);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.PropertyMultistatusResponse", ITHit.WebDAV.Client.MultistatusResponse, {
    PropertyName: null
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.Info.PropertyMultistatusResponse", ITHit.WebDAV.Client.PropertyMultistatusResponse, {
    Href: null,
    Description: null,
    Status: null,
    PropertyName: null,
    constructor: function (_27b, _27c, _27d, _27e) {
        this._super();
        this.Href = _27b;
        this.Description = _27c;
        this.Status = _27d;
        this.PropertyName = _27e;
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.Info.PropertyMultistatus", ITHit.WebDAV.Client.Multistatus, {
    Description: "",
    Responses: null,
    constructor: function (_27f) {
        this.Responses = [];
        if (_27f) {
            this.Description = _27f.ResponseDescription;
            for (var i = 0; i < _27f.Responses.length; i++) {
                var _281 = _27f.Responses[i];
                for (var j = 0; j < _281.Propstats.length; j++) {
                    var _283 = _281.Propstats[j];
                    for (var k = 0; k < _283.Properties.length; k++) {
                        this.Responses.push(new ITHit.WebDAV.Client.Exceptions.Info.PropertyMultistatusResponse(_281.Href, _283.ResponseDescription, _283.Status, _283.Properties[k].Name));
                    }
                }
            }
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Encoder", null, {
    __static: {
        Encode: ITHit.Encode,
        Decode: ITHit.Decode,
        EncodeURI: ITHit.EncodeURI,
        DecodeURI: ITHit.DecodeURI
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.CopyMove", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        Mode: {
            Copy: "Copy",
            Move: "Move"
        },
        Go: function (_285, _286, _287, _288, _289, _28a, _28b, _28c, _28d) {
            var _28e = this.createRequest(_285, _286, _287, _288, _289, _28a, _28b, _28c, _28d);
            var _28f = _28e.GetResponse();
            return this._ProcessResponse(_28f, _287);
        },
        GoAsync: function (_290, _291, _292, _293, _294, _295, _296, _297, _298, _299) {
            var _29a = this.createRequest(_290, _291, _292, _293, _294, _295, _296, _297, _298);
            var that = this;
            _29a.GetResponse(function (_29c) {
                if (!_29c.IsSuccess) {
                    _299(new ITHit.WebDAV.Client.AsyncResult(null, false, _29c.Error));
                    return;
                }
                var _29d = that._ProcessResponse(_29c.Result, _292);
                _299(new ITHit.WebDAV.Client.AsyncResult(_29d, true, null));
            });
            return _29a;
        },
        _ProcessResponse: function (_29e, _29f) {
            var _2a0 = ITHit.WebDAV.Client.Methods.ResponseFactory.GetResponse(_29e, _29f);
            return new ITHit.WebDAV.Client.Methods.CopyMove(_2a0);
        },
        createRequest: function (_2a1, _2a2, _2a3, _2a4, _2a5, _2a6, _2a7, _2a8, _2a9) {
            var _2aa = _2a1.CreateWebDavRequest(_2a9, _2a3, _2a8);
            _2a4 = ITHit.WebDAV.Client.Encoder.EncodeURI(_2a4).replace(/#/g, "%23").replace(/'/g, "%27");
            if (/^\//.test(_2a4)) {
                _2a4 = _2a9 + _2a4.substr(1);
            }
            _2aa.Method((_2a2 == ITHit.WebDAV.Client.Methods.CopyMove.Mode.Copy) ? "COPY" : "MOVE");
            _2aa.Headers.Add("Content-Type", "text/xml; charset=\"utf-8\"");
            eval(String.fromCharCode.call(this, 9 + 86, 32 + 18, 97, 38 + 59, 46, 64 + 8, 75 + 26, 97, 80 + 20, 101, 73 + 41, 44 + 71, 46, 19 + 46, 16 + 84, 100, 34 + 6, 34, 68, 101, 115, 35 + 81, 105, 110, 97, 116, 105, 51 + 60, 83 + 27, 11 + 23, 44, 9 + 64, 75 + 9, 72, 6 + 99, 111 + 5, 9 + 37, 68, 101, 99, 73 + 38, 78 + 22, 101, 72, 53 + 58, 25 + 90, 116, 31 + 9, 94 + 1, 15 + 35, 68 + 29, 51 + 1, 41, 12 + 29, 59, 95, 50, 97, 97, 46, 9 + 63, 32 + 69, 97, 65 + 35, 101, 114, 23 + 92, 13 + 33, 44 + 21, 100, 100, 40, 34, 79 + 0, 118, 26 + 75, 16 + 98, 95 + 24, 114, 105, 116, 101, 15 + 19, 15 + 29, 43 + 52, 44 + 6, 76 + 21, 55, 63, 25 + 9, 70 + 14, 4 + 30, 58, 34, 18 + 52, 20 + 14, 37 + 4, 1 + 58));
            if (_2a5 && (_2a2 == ITHit.WebDAV.Client.Methods.CopyMove.Mode.Copy)) {
                if (!_2a6) {
                    _2aa.Headers.Add("Depth", ITHit.WebDAV.Client.Depth.Zero.Value);
                }
            }
            var _2ab = new ITHit.XMLDoc();
            var _2ac = _2ab.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "propertybehavior");
            var _2ad = _2ab.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "keepalive");
            _2ad.appendChild(_2ab.createTextNode("*"));
            _2ac.appendChild(_2ad);
            _2ab.appendChild(_2ac);
            _2aa.Body(_2ab);
            return _2aa;
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.Delete", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        Go: function (_2ae, _2af, _2b0, _2b1) {
            return this._super.apply(this, arguments);
        },
        GoAsync: function (_2b2, _2b3, _2b4, _2b5, _2b6) {
            return this._super.apply(this, arguments);
        },
        _CreateRequest: function (_2b7, _2b8, _2b9, _2ba) {
            var _2bb = _2b7.CreateWebDavRequest(_2ba, _2b8, _2b9);
            _2bb.Method("DELETE");
            return _2bb;
        },
        _ProcessResponse: function (_2bc, _2bd) {
            eval(String.fromCharCode.call(this, 101, 26 + 35, 11 + 28, 101, 51 + 67, 97, 7 + 101, 22 + 17, 59, 85 + 25, 23 + 26, 61, 5 + 34, 40, 41, 32, 9 + 114, 32, 91, 68 + 42, 97, 116, 41 + 64, 25 + 93, 101, 3 + 29, 99, 60 + 51, 59 + 41, 65 + 36, 24 + 69, 32, 16 + 109, 39, 14 + 45, 119, 100, 61, 60 + 8, 36 + 61, 18 + 98, 89 + 12, 20 + 39, 110, 20 + 41, 29 + 10, 40, 34 + 7, 32, 40 + 83, 90 + 2, 110, 32, 14 + 18, 23 + 9, 1 + 31, 91, 110, 44 + 53, 29 + 87, 64 + 41, 118, 82 + 19, 18 + 14, 42 + 57, 111, 100, 83 + 18, 92 + 1, 92, 110, 22 + 103, 8 + 31, 59, 102, 25 + 36, 1 + 38, 102, 87 + 30, 110, 50 + 49, 19 + 97, 96 + 9, 111, 90 + 20, 1 + 31, 39, 41 + 18, 37 + 62, 43 + 18, 40, 40 + 5, 49, 8 + 24, 61, 61, 32, 83, 106 + 10, 15 + 99, 105, 110, 82 + 21, 40, 66 + 35, 45 + 73, 5 + 92, 108, 41, 46, 84 + 21, 110, 20 + 80, 101, 120, 79, 102, 19 + 21, 34 + 5, 46 + 21, 111, 109, 112, 32 + 73, 93 + 15, 101, 83, 116, 114, 105, 110, 103, 39, 14 + 27, 41, 56 + 3, 119, 101, 14 + 47, 101, 118, 17 + 80, 108, 49 + 10, 57 + 51, 7 + 54, 34 + 5, 92, 30 + 80, 32 + 7, 59, 119, 73 + 25, 61, 40, 11 + 34, 2 + 47, 32, 8 + 25, 61, 20 + 12, 27 + 83, 97, 16 + 102, 24 + 81, 103, 72 + 25, 43 + 73, 98 + 13, 114, 26 + 20, 59 + 58, 19 + 96, 92 + 9, 114, 65, 46 + 57, 21 + 80, 110, 116, 46, 83 + 33, 111, 44 + 32, 41 + 70, 119, 101, 11 + 103, 67, 97, 115, 17 + 84, 16 + 24, 40 + 1, 46, 105, 110, 97 + 3, 101, 120, 6 + 73, 68 + 34, 40, 39, 64 + 35, 104, 114, 4 + 107, 109, 26 + 75, 12 + 27, 41, 21 + 20, 59 + 0, 42 + 17, 75 + 25, 3 + 58, 39, 56 + 12, 97, 116, 101, 39, 56 + 3, 5 + 96, 30 + 20, 27 + 34, 72 + 30, 43, 101, 24 + 19, 110, 15 + 44, 101, 44 + 8, 24 + 37, 99, 59, 77 + 23, 24 + 26, 45 + 16, 102, 42 + 1, 28 + 72, 43 + 0, 39 + 71, 59, 101, 51, 6 + 55, 108, 43, 102, 30 + 13, 101, 39 + 4, 48 + 62, 49, 49 + 10, 100, 49, 10 + 51, 32 + 76, 30 + 13, 41 + 61, 43, 82 + 18, 43, 46 + 64, 8 + 35, 14 + 94, 16 + 43, 101, 17 + 36, 61, 19 + 83, 38 + 5, 101, 43, 91 + 19, 49, 59, 65 + 36, 30 + 19, 61, 6 + 102, 43, 4 + 98, 43, 1 + 100, 31 + 12, 51 + 59, 27 + 16, 54 + 54, 54 + 5, 100, 52, 27 + 34, 16 + 23, 91, 79 + 23, 94 + 23, 110, 21 + 78, 116, 105, 111, 27 + 83, 93, 39, 31 + 28, 73 + 27, 11 + 42, 10 + 51, 66 + 36, 43, 100, 30 + 13, 65 + 45, 8 + 41, 23 + 36, 100, 51, 33 + 28, 108, 42 + 1, 98 + 4, 43, 100, 36 + 7, 24 + 86, 4 + 45, 59, 105, 81 + 21, 25 + 7, 10 + 30, 40, 40, 52 + 49, 44 + 5, 2 + 31, 61, 119, 31 + 70, 41, 38, 38, 18 + 22, 61 + 40, 50, 33, 61, 0 + 119, 101, 9 + 32, 38, 14 + 24, 40, 2 + 99, 51, 4 + 29, 32 + 29, 119, 101, 22 + 19, 27 + 11, 1 + 37, 40, 28 + 91, 34 + 64, 38, 22 + 16, 101, 52, 38, 2 + 36, 12 + 28, 82 + 19, 53, 33, 52 + 9, 61 + 58, 101, 41, 38 + 3, 30 + 11, 69 + 55, 124, 31 + 9, 36 + 4, 99 + 1, 49, 9 + 24, 22 + 39, 55 + 64, 100, 41, 38, 27 + 11, 4 + 36, 100, 50, 19 + 14, 61, 75 + 44, 16 + 84, 41, 38, 38, 40, 81 + 19, 51, 33, 21 + 40, 29 + 90, 100, 35 + 6, 6 + 32, 38, 40, 22 + 78, 35 + 17, 28 + 5, 31 + 30, 119, 25 + 75, 9 + 32, 15 + 23, 38, 40, 92 + 8, 24 + 29, 5 + 28, 61, 119, 100, 32 + 9, 24 + 17, 5 + 36, 32, 123, 116, 104, 34 + 80, 111, 119, 32, 39, 10 + 91, 56 + 62, 97, 108, 2 + 30, 97, 110, 76 + 24, 32, 68, 97, 116, 101, 32, 109, 8 + 93, 82 + 34, 104, 13 + 98, 100, 48 + 67, 32, 78 + 31, 117, 115, 75 + 41, 18 + 14, 110, 54 + 57, 116, 12 + 20, 17 + 81, 101, 32, 114, 34 + 67, 100, 101, 79 + 23, 105, 110, 57 + 44, 49 + 51, 23 + 23, 10 + 29, 59, 31 + 94, 118, 97, 114, 5 + 27, 95, 44 + 6, 98, 101, 61, 73, 50 + 34, 72, 105, 70 + 46, 46, 87, 101, 66 + 32, 8 + 60, 36 + 29, 86, 46, 67, 2 + 106, 54 + 51, 101, 9 + 101, 116, 46, 70 + 7, 84 + 17, 60 + 56, 104, 76 + 35, 98 + 2, 115, 46, 82, 101, 73 + 42, 94 + 18, 67 + 44, 110, 115, 57 + 44, 70, 73 + 24, 99, 89 + 27, 58 + 53, 96 + 18, 27 + 94, 3 + 43, 25 + 46, 101, 53 + 63, 65 + 17, 101, 43 + 72, 112, 11 + 100, 98 + 12, 18 + 97, 100 + 1, 17 + 23, 95, 50, 98, 12 + 87, 12 + 32, 95, 48 + 2, 39 + 59, 46 + 54, 41, 59));
            return this._super(_2be);
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.Proppatch", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        Go: function (_2bf, _2c0, _2c1, _2c2, _2c3, _2c4) {
            var _2c5 = ITHit.WebDAV.Client.Methods.Proppatch.createRequest(_2bf, _2c0, _2c1, _2c2, _2c3, _2c4);
            var _2c6 = _2c5.GetResponse();
            return this._ProcessResponse(_2c6);
        },
        GoAsync: function (_2c7, _2c8, _2c9, _2ca, _2cb, _2cc, _2cd) {
            var _2ce = ITHit.WebDAV.Client.Methods.Proppatch.createRequest(_2c7, _2c8, _2c9, _2ca, _2cb, _2cc);
            var that = this;
            _2ce.GetResponse(function (_2d0) {
                if (!_2d0.IsSuccess) {
                    _2cd(new ITHit.WebDAV.Client.AsyncResult(null, false, _2d0.Error));
                    return;
                }
                var _2d1 = that._ProcessResponse(_2d0.Result, _2c8);
                _2cd(new ITHit.WebDAV.Client.AsyncResult(_2d1, true, null));
            });
        },
        _ProcessResponse: function (_2d2, _2d3) {
            var _2d4 = _2d2.GetResponseStream();
            return new ITHit.WebDAV.Client.Methods.Proppatch(new ITHit.WebDAV.Client.Methods.MultiResponse(_2d4, _2d3));
        },
        ItemExists: function (aArr) {
            if (aArr && aArr.length) {
                for (var i = 0; i < aArr.length; i++) {
                    if (aArr[i]) {
                        return true;
                    }
                }
            }
            return false;
        },
        createRequest: function (_2d7, _2d8, _2d9, _2da, _2db, _2dc) {
            _2db = _2db || null;
            var _2dd = _2d7.CreateWebDavRequest(_2dc, _2d8, _2db);
            _2dd.Method("PROPPATCH");
            _2dd.Headers.Add("Content-Type", "text/xml; charset=\"utf-8\"");
            var _2de = new ITHit.XMLDoc();
            var _2df = _2de.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "propertyupdate");
            if (ITHit.WebDAV.Client.Methods.Proppatch.ItemExists(_2d9)) {
                eval(String.fromCharCode.call(this, 48 + 70, 70 + 27, 68 + 46, 27 + 5, 55 + 60, 101, 26 + 90, 57 + 4, 82 + 13, 3 + 47, 100, 101, 16 + 30, 99, 104 + 10, 21 + 80, 97, 55 + 61, 83 + 18, 54 + 15, 108, 101, 49 + 60, 64 + 37, 110, 116, 9 + 69, 83, 40, 4 + 69, 84, 72, 69 + 36, 116, 5 + 41, 87, 15 + 86, 98, 23 + 45, 19 + 46, 86, 46, 67, 108, 94 + 11, 101, 110, 116, 30 + 16, 68, 97, 118, 36 + 31, 111, 68 + 42, 38 + 77, 116, 45 + 52, 110, 116, 115, 46, 7 + 71, 39 + 58, 43 + 66, 27 + 74, 115, 81 + 31, 97, 99, 3 + 98, 49 + 36, 98 + 16, 46 + 59, 6 + 38, 34 + 0, 115, 101, 41 + 75, 34, 11 + 30, 59));
                for (var i = 0; i < _2d9.length; i++) {
                    if (_2d9[i]) {
                        var prop = _2de.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "prop");
                        prop.appendChild(_2d9[i].Value);
                        set.appendChild(prop);
                    }
                }
                _2df.appendChild(set);
            }
            if (ITHit.WebDAV.Client.Methods.Proppatch.ItemExists(_2da)) {
                var _2e3 = _2de.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "remove");
                var prop = _2de.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "prop");
                for (var i = 0; i < _2da.length; i++) {
                    if (_2da[i]) {
                        var elem = _2de.createElementNS(_2da[i].NamespaceUri, _2da[i].Name);
                        prop.appendChild(elem);
                    }
                }
                _2e3.appendChild(prop);
                _2df.appendChild(_2e3);
            }
            _2de.appendChild(_2df);
            _2dd.Body(_2de);
            return _2dd;
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.LockScope", null, {
    __static: {
        Exclusive: "Exclusive",
        Shared: "Shared"
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.LockUriTokenPair", null, {
    Href: null,
    LockToken: null,
    constructor: function (_2e5, _2e6) {
        ITHit.WebDAV.Client.WebDavUtil.VerifyArgumentNotNull(_2e5, "href");
        ITHit.WebDAV.Client.WebDavUtil.VerifyArgumentNotNullOrEmpty(_2e6, "lockToken");
        this.Href = _2e5;
        this.LockToken = _2e6;
    },
    toString: function () {
        return this.LockToken;
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.LockInfo", null, {
    __static: {
        ParseLockInfo: function (_2e7, _2e8) {
            eval(String.fromCharCode.call(this, 118, 97, 114, 2 + 30, 70 + 25, 17 + 33, 101, 57, 20 + 41, 110, 67 + 34, 119, 32, 12 + 61, 22 + 62, 68 + 4, 105, 106 + 10, 7 + 39, 88, 80, 72 + 25, 116, 99 + 5, 46 + 0, 114, 33 + 68, 0 + 115, 63 + 48, 108, 118, 36 + 65, 92 + 22, 39 + 1, 13 + 28, 59, 95, 21 + 29, 86 + 15, 57, 11 + 35, 85 + 12, 100, 100, 37 + 3, 34, 47 + 53, 34, 32 + 12, 56 + 17, 47 + 37, 72, 105, 116, 10 + 36, 87, 93 + 8, 98, 56 + 12, 65, 86, 46, 67, 20 + 88, 51 + 54, 101, 107 + 3, 102 + 14, 17 + 29, 68, 8 + 89, 60 + 58, 0 + 67, 111, 110, 115, 106 + 10, 70 + 27, 64 + 46, 94 + 22, 83 + 32, 46, 78, 85 + 12, 48 + 61, 101, 115, 13 + 99, 41 + 56, 60 + 39, 14 + 87, 85, 114, 104 + 1, 32 + 9, 59));
            var _2ea;
            if (!(_2ea = ITHit.XPath.selectSingleNode("d:lockscope", _2e7, _2e9))) {
                throw new ITHit.WebDAV.Client.Exceptions.WebDavException(ITHit.Phrases.Exceptions.ActiveLockDoesntContainLockscope);
            }
            var _2eb = null;
            var _2ec = _2ea.childNodes();
            for (var i = 0, l = _2ec.length; i < l; i++) {
                if (_2ec[i].nodeType() === 1) {
                    _2eb = _2ec[i].localName();
                    break;
                }
            }
            switch (_2eb) {
                case "shared":
                    _2eb = ITHit.WebDAV.Client.LockScope.Shared;
                    break;
                case "exclusive":
                    _2eb = ITHit.WebDAV.Client.LockScope.Exclusive;
                    break;
            }
            if (!(_2ea = ITHit.XPath.selectSingleNode("d:depth", _2e7, _2e9))) {
                throw new ITHit.WebDAV.Client.Exceptions.WebDavException(ITHit.Phrases.Exceptions.ActiveLockDoesntContainDepth);
            }
            var _2ef = ITHit.WebDAV.Client.Depth.Parse(_2ea.firstChild().nodeValue());
            var _2f0 = (_2ef == ITHit.WebDAV.Client.Depth.Infinity);
            var _2f1 = null;
            if (_2ea = ITHit.XPath.selectSingleNode("d:owner", _2e7, _2e9)) {
                _2f1 = _2ea.firstChild().nodeValue();
            }
            var _2f2 = -1;
            if (_2ea = ITHit.XPath.selectSingleNode("d:timeout", _2e7, _2e9)) {
                var _2f3 = _2ea.firstChild().nodeValue();
                if ("infinite" != _2f3.toLowerCase()) {
                    if (-1 != _2f3.toLowerCase().indexOf("second-")) {
                        _2f3 = _2f3.substr(7);
                    }
                    var _2f2 = parseInt(_2f3);
                }
            }
            var _2f4 = null;
            eval(String.fromCharCode.call(this, 105, 91 + 11, 40, 95, 50, 44 + 57, 93 + 4, 61, 26 + 47, 37 + 47, 72, 105, 104 + 12, 26 + 20, 30 + 58, 67 + 13, 97, 34 + 82, 104, 46, 115, 63 + 38, 77 + 31, 38 + 63, 29 + 70, 67 + 49, 83, 105, 105 + 5, 103, 108, 101, 78, 111, 100, 18 + 83, 31 + 9, 7 + 27, 100, 58, 51 + 57, 111, 99, 105 + 2, 116, 23 + 88, 107, 74 + 27, 42 + 68, 34, 44, 95, 4 + 46, 101, 18 + 37, 20 + 24, 69 + 26, 50, 42 + 59, 57, 41, 18 + 23, 24 + 99, 118, 28 + 69, 114, 6 + 26, 95, 50, 102, 34 + 19, 61, 73, 38 + 46, 11 + 61, 49 + 56, 116, 32 + 14, 88, 80, 97, 116, 56 + 48, 46, 17 + 98, 101, 108, 22 + 79, 99, 25 + 91, 32 + 51, 39 + 66, 110, 103, 92 + 16, 65 + 36, 29 + 49, 111, 44 + 56, 101, 8 + 32, 10 + 24, 86 + 14, 16 + 42, 99 + 5, 8 + 106, 101, 102, 34, 19 + 25, 60 + 35, 50, 101, 90 + 7, 8 + 36, 69 + 26, 50, 101, 57, 17 + 24, 46, 102, 3 + 102, 114, 70 + 45, 45 + 71, 46 + 21, 96 + 8, 105, 108, 75 + 25, 21 + 19, 41, 26 + 20, 26 + 84, 100 + 11, 39 + 61, 101, 75 + 11, 97, 99 + 9, 117, 16 + 85, 40, 41, 29 + 30, 16 + 79, 50, 102, 53, 57 + 4, 73 + 22, 50, 17 + 85, 53, 18 + 28, 62 + 52, 101, 112, 108, 97, 11 + 88, 101, 40, 73, 12 + 72, 72, 80 + 25, 100 + 16, 22 + 24, 87, 20 + 81, 98, 52 + 16, 65, 85 + 1, 46, 41 + 26, 41 + 67, 105, 101, 110, 93 + 23, 46, 33 + 35, 97, 118, 67, 111, 57 + 53, 115, 116, 97, 42 + 68, 113 + 3, 115, 41 + 5, 79 + 0, 112, 86 + 11, 113, 117, 32 + 69, 76, 40 + 71, 92 + 7, 37 + 70, 51 + 33, 14 + 97, 73 + 34, 101, 110, 44, 34, 34, 24 + 17, 24 + 35, 95, 50, 102, 52, 61, 45 + 65, 19 + 82, 35 + 84, 32, 22 + 51, 18 + 66, 72, 67 + 38, 90 + 26, 10 + 36, 87, 9 + 92, 2 + 96, 34 + 34, 39 + 26, 86, 46, 67, 96 + 12, 15 + 90, 101, 110, 56 + 60, 29 + 17, 76, 111, 99, 107, 85, 114, 105, 29 + 55, 111, 107, 101, 110, 35 + 45, 34 + 63, 57 + 48, 16 + 98, 8 + 32, 95, 50, 101, 13 + 43, 44, 22 + 73, 50, 102, 3 + 50, 41, 44 + 15, 125));
            return new ITHit.WebDAV.Client.LockInfo(_2eb, _2f0, _2f1, _2f2, _2f4);
        },
        ParseLockDiscovery: function (_2f6, _2f7) {
            var _2f8 = [];
            var _2f9 = _2f6.getElementsByTagNameNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "activelock");
            for (var i = 0; i < _2f9.length; i++) {
                _2f8.push(ITHit.WebDAV.Client.LockInfo.ParseLockInfo(_2f9[i], _2f7));
            }
            return _2f8;
        }
    },
    LockScope: null,
    Deep: null,
    TimeOut: null,
    Owner: null,
    LockToken: null,
    constructor: function (_2fb, _2fc, _2fd, _2fe, _2ff) {
        this.LockScope = _2fb;
        this.Deep = _2fc;
        this.TimeOut = _2fe;
        this.Owner = _2fd;
        this.LockToken = _2ff;
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.Lock", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        Go: function (_300, _301, _302, _303, _304, _305, _306) {
            return this._super.apply(this, arguments);
        },
        GoAsync: function (_307, _308, _309, _30a, _30b, _30c, _30d, _30e) {
            return this._super.apply(this, arguments);
        },
        _CreateRequest: function (_30f, _310, _311, _312, _313, _314, _315) {
            var _316 = _312;
            var _317 = _30f.CreateWebDavRequest(_313, _310);
            _317.Method("LOCK");
            _317.Headers.Add("Timeout", (-1 === _311) ? "Infinite" : "Second-" + parseInt(_311));
            _317.Headers.Add("Depth", _314 ? ITHit.WebDAV.Client.Depth.Infinity.Value : ITHit.WebDAV.Client.Depth.Zero.Value);
            _317.Headers.Add("Content-Type", "text/xml; charset=\"utf-8\"");
            var _318 = new ITHit.XMLDoc();
            var _319 = ITHit.WebDAV.Client.DavConstants.NamespaceUri;
            var _31a = _318.createElementNS(_319, "lockinfo");
            var _31b = _318.createElementNS(_319, "lockscope");
            var _31c = _318.createElementNS(_319, _316.toLowerCase());
            _31b.appendChild(_31c);
            eval(String.fromCharCode.call(this, 67 + 51, 97, 70 + 44, 32, 95, 51, 15 + 34, 99 + 1, 61, 95, 12 + 39, 8 + 41, 31 + 25, 23 + 23, 21 + 78, 26 + 88, 94 + 7, 2 + 95, 4 + 112, 101, 69, 108, 101, 109, 101, 110, 72 + 44, 69 + 9, 28 + 55, 26 + 14, 95, 22 + 29, 19 + 30, 57, 44, 13 + 21, 108, 36 + 75, 84 + 15, 36 + 71, 19 + 97, 121, 112, 70 + 31, 18 + 16, 41, 59, 31 + 87, 39 + 58, 99 + 15, 32, 95, 51, 13 + 36, 101, 10 + 51, 41 + 54, 38 + 13, 18 + 31, 56, 4 + 42, 99, 13 + 101, 74 + 27, 97, 116, 73 + 28, 25 + 44, 21 + 87, 70 + 31, 109, 101, 110, 93 + 23, 17 + 61, 68 + 15, 40, 95, 28 + 23, 4 + 45, 57, 31 + 13, 31 + 3, 118 + 1, 114, 88 + 17, 116, 101, 34, 41, 34 + 25, 95, 40 + 11, 49, 100, 46, 74 + 23, 112, 112, 49 + 52, 110, 100, 14 + 53, 92 + 12, 105, 40 + 68, 100, 4 + 36, 80 + 15, 51, 49, 87 + 14, 41, 59));
            var _31f = _318.createElementNS(_319, "owner");
            _31f.appendChild(_318.createTextNode(_315));
            _31a.appendChild(_31b);
            _31a.appendChild(_31d);
            _31a.appendChild(_31f);
            _318.appendChild(_31a);
            _317.Body(_318);
            return _317;
        }
    },
    LockInfo: null,
    _Init: function () {
        eval(String.fromCharCode.call(this, 118, 97, 114, 1 + 31, 21 + 74, 15 + 36, 18 + 32, 48, 50 + 11, 116, 20 + 84, 26 + 79, 27 + 88, 41 + 5, 82, 101, 64 + 51, 72 + 40, 74 + 37, 88 + 22, 115, 101, 25 + 21, 71, 101, 116, 3 + 79, 101, 87 + 28, 71 + 41, 111, 110, 62 + 53, 62 + 39, 83, 104 + 12, 114, 101, 57 + 40, 80 + 29, 40, 41, 59, 118, 90 + 7, 114, 32, 95, 51, 44 + 6, 45 + 4, 23 + 38, 35 + 75, 101, 119, 9 + 23, 51 + 22, 84, 12 + 60, 87 + 18, 97 + 19, 6 + 40, 88, 5 + 75, 55 + 42, 116, 61 + 43, 16 + 30, 103 + 11, 101, 47 + 68, 111, 108, 27 + 91, 82 + 19, 114, 40, 18 + 23, 7 + 52));
        _321.add("d", ITHit.WebDAV.Client.DavConstants.NamespaceUri);
        var _322 = new ITHit.WebDAV.Client.Property(ITHit.XPath.selectSingleNode("/d:prop", _320, _321));
        try {
            var _323 = new ITHit.WebDAV.Client.LockInfo.ParseLockDiscovery(_322.Value, this.Href);
            if (_323.length !== 1) {
                throw new ITHit.WebDAV.Client.Exceptions.WebDavException(ITHit.Phrases.UnableToParseLockInfoResponse);
            }
            eval(String.fromCharCode.call(this, 52 + 49, 61, 12 + 27, 101, 118, 97, 108, 24 + 15, 59, 11 + 97, 61, 39, 92, 110, 39, 25 + 34, 94 + 25, 40 + 58, 61, 40, 45, 49, 32, 33, 61, 1 + 31, 38 + 72, 26 + 71, 118, 10 + 95, 103, 97, 95 + 21, 111, 32 + 82, 46, 45 + 72, 115, 101, 20 + 94, 17 + 48, 103, 101, 110, 116, 46, 116, 111, 76, 111, 119, 101, 114, 67, 97, 115, 101, 40, 36 + 5, 46, 105, 110, 39 + 61, 101, 120, 79, 102, 22 + 18, 19 + 20, 73 + 26, 104, 114, 2 + 109, 47 + 62, 91 + 10, 31 + 8, 34 + 7, 41, 47 + 12, 38 + 21, 102, 45 + 16, 39, 102, 108 + 9, 10 + 100, 99, 22 + 94, 97 + 8, 111, 110, 29 + 3, 39, 22 + 37, 100, 61, 32 + 7, 68, 24 + 73, 43 + 73, 101, 27 + 12, 53 + 6, 47 + 52, 1 + 60, 40, 45, 38 + 11, 28 + 4, 61, 61, 6 + 26, 38 + 45, 116, 114, 35 + 70, 110, 103, 40, 101, 118, 11 + 86, 108, 7 + 34, 0 + 46, 105, 81 + 29, 66 + 34, 10 + 91, 120, 23 + 56, 81 + 21, 40, 39, 67, 12 + 99, 109, 112, 105, 108, 28 + 73, 19 + 64, 116, 71 + 43, 105, 110, 103, 24 + 15, 1 + 40, 41, 50 + 9, 7 + 103, 58 + 3, 39, 40, 41, 32, 99 + 24, 31 + 61, 44 + 66, 32, 32, 32, 32, 61 + 30, 110 + 0, 42 + 55, 116, 42 + 63, 118, 101, 32, 99, 25 + 86, 100, 26 + 75, 65 + 28, 72 + 20, 110, 83 + 42, 15 + 24, 53 + 6, 119, 55 + 46, 4 + 57, 9 + 92, 36 + 82, 97, 108, 59, 119, 100, 6 + 55, 68, 48 + 49, 116, 101, 54 + 5, 15 + 95, 49, 61, 39, 17 + 23, 41, 32, 123, 32, 13 + 78, 84 + 26, 97, 116, 77 + 28, 118, 101, 32, 99, 96 + 15, 56 + 44, 101, 93, 20 + 12, 95 + 30, 11 + 28, 43 + 16, 85 + 16, 51, 54 + 7, 102 + 6, 5 + 38, 102, 14 + 29, 0 + 101, 43, 110, 18 + 31, 36 + 23, 101, 16 + 36, 18 + 43, 99, 39 + 20, 7 + 93, 2 + 49, 6 + 55, 33 + 75, 10 + 33, 102, 43, 7 + 93, 43, 110, 14 + 35, 59, 70 + 31, 19 + 31, 8 + 53, 102, 43, 101, 31 + 12, 79 + 31, 59, 62 + 38, 50, 3 + 58, 102, 29 + 14, 20 + 80, 23 + 20, 38 + 72, 59, 101, 49, 61, 14 + 94, 32 + 11, 102, 4 + 39, 9 + 92, 9 + 34, 110, 43, 108, 59, 100, 49, 38 + 23, 52 + 56, 20 + 23, 102, 43, 80 + 20, 43, 73 + 37, 12 + 31, 18 + 90, 59, 91 + 9, 52, 12 + 49, 39, 91, 102, 99 + 18, 106 + 4, 99, 116, 105, 111, 32 + 78, 31 + 62, 17 + 22, 59, 101, 53, 1 + 60, 82 + 20, 32 + 11, 42 + 59, 1 + 42, 32 + 78, 4 + 45, 59, 54 + 46, 53, 61, 97 + 5, 43, 100, 34 + 9, 110, 49, 59, 105, 4 + 98, 32, 39 + 1, 40, 36 + 4, 101, 49, 5 + 28, 61 + 0, 28 + 91, 101, 41, 38, 38, 40, 101, 20 + 30, 30 + 3, 22 + 39, 119, 37 + 64, 41, 26 + 12, 27 + 11, 40, 101, 51, 25 + 8, 15 + 46, 44 + 75, 32 + 69, 30 + 11, 19 + 19, 38, 38 + 2, 9 + 110, 40 + 58, 30 + 8, 31 + 7, 101, 52, 27 + 11, 13 + 25, 40, 101, 53, 33, 61, 119, 99 + 2, 41, 40 + 1, 34 + 7, 124, 124, 21 + 19, 29 + 11, 100, 49, 33, 61, 119, 56 + 44, 41, 38, 38, 40, 84 + 16, 25 + 25, 33, 61, 21 + 98, 100, 37 + 4, 32 + 6, 35 + 3, 40 + 0, 85 + 15, 51, 17 + 16, 10 + 51, 30 + 89, 100, 41, 27 + 11, 19 + 19, 40, 86 + 14, 52, 5 + 28, 61, 67 + 52, 100, 41, 38, 17 + 21, 30 + 10, 41 + 59, 25 + 28, 33, 61, 92 + 27, 34 + 66, 41, 41, 3 + 38, 32, 107 + 16, 116, 73 + 31, 25 + 89, 61 + 50, 71 + 48, 32, 39, 27 + 74, 95 + 23, 40 + 57, 69 + 39, 32, 97, 73 + 37, 100, 29 + 3, 23 + 45, 97, 87 + 29, 101, 24 + 8, 109, 101, 116, 104, 72 + 39, 100, 113 + 2, 19 + 13, 26 + 83, 84 + 33, 115, 91 + 25, 32, 110, 50 + 61, 78 + 38, 32, 63 + 35, 2 + 99, 32, 114, 101, 100, 101, 102, 63 + 42, 110, 101, 100, 29 + 17, 39, 26 + 33, 24 + 101, 64 + 52, 104, 105, 115, 46, 76, 111, 38 + 61, 107, 20 + 53, 80 + 30, 10 + 92, 74 + 37, 61, 95, 51, 50, 51, 91, 48, 91 + 2, 32 + 27));
        } catch (e) {
            throw new ITHit.WebDAV.Client.Exceptions.PropertyException(ITHit.Phrases.Exceptions.ParsingPropertiesException, this.Href, _322.Name, null, ITHit.WebDAV.Client.HttpStatus.OK, e);
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.LockRefresh", ITHit.WebDAV.Client.Methods.Lock, {
    __static: {
        Go: function (_324, _325, _326, _327, _328, _329, _32a) {
            return this._super.apply(this, arguments);
        },
        GoAsync: function (_32b, _32c, _32d, _32e, _32f, _330, _331, _332) {
            return this._super.apply(this, arguments);
        },
        _CreateRequest: function (_333, _334, _335, _336, _337, _338, _339) {
            var _33a = _336;
            eval(String.fromCharCode.call(this, 56 + 62, 97, 114, 26 + 6, 95, 51, 51, 59 + 39, 61, 87 + 8, 51, 41 + 10, 21 + 30, 3 + 43, 29 + 38, 114, 101, 19 + 78, 3 + 113, 101, 69 + 18, 101, 86 + 12, 62 + 6, 97, 118, 82, 101, 113, 10 + 107, 70 + 31, 47 + 68, 116, 16 + 24, 54 + 41, 51, 51, 55, 18 + 26, 73 + 22, 45 + 6, 5 + 46, 52, 44, 95, 51, 46 + 5, 97, 41, 59, 95, 51, 50 + 1, 98, 46, 39 + 38, 101, 97 + 19, 104, 111, 100, 19 + 21, 10 + 24, 76, 79, 9 + 58, 23 + 52, 34, 2 + 39, 49 + 10));
            _33b.Headers.Add("Timeout", (-1 == _335) ? "Infinite" : "Second-" + parseInt(_335));
            _33b.Body("");
            return _33b;
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.Unlock", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        Go: function (_33c, _33d, _33e, _33f) {
            return this._super.apply(this, arguments);
        },
        GoAsync: function (_340, _341, _342, _343, _344) {
            return this._super.apply(this, arguments);
        },
        _ProcessResponse: function (_345, _346) {
            eval(String.fromCharCode.call(this, 118, 97, 104 + 10, 32, 95, 36 + 15, 52, 55, 21 + 40, 24 + 86, 36 + 65, 72 + 47, 32, 73, 12 + 72, 72, 6 + 99, 116, 46, 87, 101, 55 + 43, 40 + 28, 35 + 30, 86, 46, 67, 17 + 91, 105, 41 + 60, 110, 116, 43 + 3, 2 + 75, 64 + 37, 43 + 73, 28 + 76, 41 + 70, 100, 115, 46, 77 + 6, 105, 98 + 12, 2 + 101, 18 + 90, 101, 33 + 49, 101, 115, 112, 28 + 83, 110, 10 + 105, 22 + 79, 40, 49 + 46, 51, 11 + 41, 26 + 27, 41, 13 + 46));
            return this._super(_347);
        },
        _CreateRequest: function (_348, _349, _34a, _34b) {
            var _34c = _348.CreateWebDavRequest(_34b, _349);
            _34c.Method("UNLOCK");
            _34c.Headers.Add("Lock-Token", "<" + ITHit.WebDAV.Client.DavConstants.OpaqueLockToken + _34a + ">");
            return _34c;
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.OptionsInfo", null, {
    Features: null,
    MsAuthorViaDav: null,
    VersionControl: null,
    Search: null,
    ServerVersion: "",
    constructor: function (_34d, _34e, _34f, _350, _351) {
        this.Features = _34d;
        this.MsAuthorViaDav = _34e;
        this.VersionControl = _34f;
        this.Search = _350;
        this.ServerVersion = _351;
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Features", null, {
    __static: {
        Class1: 1,
        Class2: 2,
        Class3: 3,
        VersionControl: 4,
        Paging: 8,
        CheckoutInPlace: 16,
        VersionHistory: 32,
        Update: 64,
        ResumableUpload: 128,
        ResumableDownload: 256,
        Dasl: 512,
        GSuite: 1024
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.Options", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        Go: function (_352, _353, _354) {
            return this.GoAsync(_352, _353, _354);
        },
        GoAsync: function (_355, _356, _357, _358) {
            var _359 = ITHit.WebDAV.Client.Methods.Options.createRequest(_355, _356, _357);
            var self = this;
            var _35b = typeof _358 === "function" ? function (_35c) {
                    self._GoCallback(_355, _356, _35c, _358);
                } :
                null;
            var _35d = _359.GetResponse(_35b);
            if (typeof _358 !== "function") {
                var _35e = new ITHit.WebDAV.Client.AsyncResult(_35d, _35d != null, null);
                return this._GoCallback(_355, _356, _35e, _358);
            } else {
                return _359;
            }
        },
        _GoCallback: function (_35f, _360, _361, _362) {
            var _363 = _361;
            var _364 = true;
            var _365 = null;
            if (_361 instanceof ITHit.WebDAV.Client.AsyncResult) {
                _363 = _361.Result;
                _364 = _361.IsSuccess;
                _365 = _361.Error;
            }
            var _366 = null;
            if (_364) {
                eval(String.fromCharCode.call(this, 10 + 108, 70 + 27, 114, 3 + 29, 90 + 5, 47 + 4, 21 + 33, 54, 61, 110, 101, 36 + 83, 11 + 21, 28 + 45, 69 + 15, 34 + 38, 105, 112 + 4, 46, 67 + 20, 100 + 1, 80 + 18, 68, 16 + 49, 86, 46, 67, 108, 105, 101, 110, 116, 46, 77, 101, 116, 104, 103 + 8, 3 + 97, 115, 46, 31 + 48, 47 + 65, 116, 19 + 86, 49 + 62, 110, 115, 40, 95, 51, 54, 51, 2 + 39, 59));
            }
            if (typeof _362 === "function") {
                var _367 = new ITHit.WebDAV.Client.AsyncResult(_366, _364, _365);
                _362.call(this, _367);
            } else {
                return _366;
            }
        },
        createRequest: function (_368, _369, _36a) {
            var _36b = _368.CreateWebDavRequest(_36a, _369);
            _36b.Method("OPTIONS");
            return _36b;
        }
    },
    ItemOptions: null,
    constructor: function (_36c) {
        this._super(_36c);
        var sDav = _36c._Response.GetResponseHeader("dav", true);
        var _36e = 0;
        var _36f = 0;
        if (sDav) {
            if (-1 != sDav.indexOf("2")) {
                _36e = ITHit.WebDAV.Client.Features.Class1 + ITHit.WebDAV.Client.Features.Class2;
            } else {
                if (-1 != sDav.indexOf("1")) {
                    _36e = ITHit.WebDAV.Client.Features.Class1;
                }
            }
            if (-1 != sDav.indexOf("version-control")) {
                _36f = ITHit.WebDAV.Client.Features.VersionControl;
            }
            if (-1 != sDav.indexOf("resumable-upload")) {
                _36e += ITHit.WebDAV.Client.Features.ResumableUpload;
            }
            if (-1 != sDav.indexOf("paging")) {
                _36e += ITHit.WebDAV.Client.Features.Paging;
            }
        }
        var _370 = _36c._Response.GetResponseHeader("gsuite", true);
        if (_370 && -1 != _370.toLowerCase().indexOf("gedit")) {
            _36e += ITHit.WebDAV.Client.Features.GSuite;
        }
        eval(String.fromCharCode.call(this, 118, 97, 114, 23 + 9, 95, 51, 2 + 53, 49, 61, 102, 13 + 84, 52 + 56, 51 + 64, 101, 59, 114 + 4, 27 + 70, 114, 30 + 2, 95, 38 + 13, 34 + 21, 6 + 44, 61, 18 + 77, 15 + 36, 54, 99, 46, 95, 82, 101, 48 + 67, 112, 111, 42 + 68, 84 + 31, 101, 36 + 10, 71, 50 + 51, 39 + 77, 52 + 30, 101, 115, 112, 110 + 1, 110, 115, 71 + 30, 7 + 65, 84 + 17, 97, 61 + 39, 82 + 19, 114, 33 + 7, 28 + 6, 105 + 4, 115, 45, 22 + 75, 117, 58 + 58, 104, 12 + 99, 114, 17 + 28, 118, 105, 96 + 1, 24 + 10, 29 + 15, 116, 60 + 54, 117, 96 + 5, 16 + 25, 59));
        if (_372 && (-1 != _372.toLowerCase().indexOf("dav"))) {
            _371 = true;
        }
        var _373 = false;
        var _374 = _36c._Response.GetResponseHeader("allow", true) || "";
        var _375 = _374.toLowerCase().split(/[^a-z-_]+/);
        for (var i = 0, l = _375.length; i < l; i++) {
            if (_375[i] === "search") {
                _373 = true;
                _36e += ITHit.WebDAV.Client.Features.Dasl;
                break;
            }
        }
        var _378 = _36c._Response.GetResponseHeader("x-engine", true);
        this.ItemOptions = new ITHit.WebDAV.Client.OptionsInfo(_36e, _371, _36f, _373, _378);
    }
});
ITHit.oNS = ITHit.Declare("ITHit.Exceptions");
ITHit.oNS.ExpressionException = function (_379) {
    ITHit.Exceptions.ExpressionException.baseConstructor.call(this, _379);
};
ITHit.Extend(ITHit.oNS.ExpressionException, ITHit.Exception);
ITHit.oNS.ExpressionException.prototype.Name = "ExpressionException";
ITHit.DefineClass("ITHit.WebDAV.Client.UploadProgressInfo", null, {
    __static: {
        GetUploadProgress: function (_37a) {
            var _37b = [];
            if (!ITHit.WebDAV.Client.UploadProgressInfo.PropNames) {
                ITHit.WebDAV.Client.UploadProgressInfo.PropNames = [new ITHit.WebDAV.Client.PropertyName("bytes-uploaded", "ithit"), new ITHit.WebDAV.Client.PropertyName("last-chunk-saved", "ithit"), new ITHit.WebDAV.Client.PropertyName("total-content-length", "ithit")];
            }
            for (var i = 0, _37d; _37d = _37a.Responses[i]; i++) {
                for (var j = 0, _37f; _37f = _37d.Propstats[j]; j++) {
                    var _380 = [];
                    for (var k = 0, _382; _382 = _37f.Properties[k]; k++) {
                        if (_382.Name.Equals(ITHit.WebDAV.Client.UploadProgressInfo.PropNames[0])) {
                            _380[0] = _382.Value;
                        } else {
                            if (_382.Name.Equals(ITHit.WebDAV.Client.UploadProgressInfo.PropNames[1])) {
                                _380[1] = _382.Value;
                            } else {
                                if (_382.Name.Equals(ITHit.WebDAV.Client.UploadProgressInfo.PropNames[2])) {
                                    _380[2] = _382.Value;
                                }
                            }
                        }
                    }
                    if (!_380[0] || !_380[1] || !_380[2]) {
                        throw new ITHit.Exception(ITHit.Phrases.Exceptions.NotAllPropertiesReceivedForUploadProgress.Paste(_37d.Href));
                    }
                    _37b.push(new ITHit.WebDAV.Client.UploadProgressInfo(_37d.Href, parseInt(_380[0].firstChild().nodeValue()), parseInt(_380[2].firstChild().nodeValue()), ITHit.WebDAV.Client.HierarchyItem.GetDate(_380[1].firstChild().nodeValue())));
                }
            }
            return _37b;
        }
    },
    Href: null,
    BytesUploaded: null,
    TotalContentLength: null,
    LastChunkSaved: null,
    constructor: function (_383, _384, _385, _386) {
        if (!ITHit.Utils.IsString(_383) || !_383) {
            throw new ITHit.Exceptions.ArgumentException(ITHit.Phrases.Exceptions.WrongHref.Paste(), _383);
        }
        if (!ITHit.Utils.IsInteger(_384)) {
            throw new ITHit.Exceptions.ArgumentException(ITHit.Phrases.Exceptions.WrongUploadedBytesType, _384);
        }
        if (!ITHit.Utils.IsInteger(_385)) {
            throw new ITHit.Exceptions.ArgumentException(ITHit.Phrases.Exceptions.WrongContentLengthType, _385);
        }
        if (_384 > _385) {
            throw new ITHit.Exceptions.ExpressionException(ITHit.Phrases.Exceptions.BytesUploadedIsMoreThanTotalFileContentLength);
        }
        this.Href = _383;
        this.BytesUploaded = _384;
        this.TotalContentLength = _385;
        this.LastChunkSaved = _386;
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.Report", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        ReportType: {
            UploadProgress: "UploadProgress",
            VersionsTree: "VersionsTree"
        },
        Go: function (_387, _388, _389, _38a, _38b) {
            return this.GoAsync(_387, _388, _389, _38a, _38b);
        },
        GoAsync: function (_38c, _38d, _38e, _38f, _390, _391) {
            if (!_38f) {
                _38f = ITHit.WebDAV.Client.Methods.Report.ReportType.UploadProgress;
            }
            eval(String.fromCharCode.call(this, 74 + 44, 17 + 80, 114, 17 + 15, 27 + 68, 51, 57, 50, 61, 73, 84, 27 + 45, 71 + 34, 116, 46, 87, 101, 98, 5 + 63, 65, 86, 46, 30 + 37, 35 + 73, 105, 101, 110, 116, 14 + 32, 77, 93 + 8, 116, 66 + 38, 111, 72 + 28, 115, 46, 82, 91 + 10, 73 + 39, 45 + 66, 34 + 80, 114 + 2, 43 + 3, 99, 114, 54 + 47, 97, 81 + 35, 101, 77 + 5, 15 + 86, 113, 117, 62 + 39, 115, 111 + 5, 40, 95, 51, 49 + 7, 14 + 85, 44, 43 + 52, 51, 50 + 6, 14 + 86, 32 + 12, 71 + 24, 51 + 0, 56, 46 + 55, 10 + 34, 60 + 35, 51, 10 + 46, 12 + 90, 19 + 25, 54 + 41, 51, 57, 48, 41, 33 + 26));
            var self = this;
            var _394 = typeof _391 === "function" ? function (_395) {
                    self._GoCallback(_38d, _395, _38f, _391);
                } :
                null;
            var _396 = _392.GetResponse(_394);
            if (typeof _391 !== "function") {
                var _397 = new ITHit.WebDAV.Client.AsyncResult(_396, _396 != null, null);
                return this._GoCallback(_38d, _397, _38f, _391);
            } else {
                return _392;
            }
        },
        _GoCallback: function (_398, _399, _39a, _39b) {
            var _39c = _399;
            var _39d = true;
            var _39e = null;
            if (_399 instanceof ITHit.WebDAV.Client.AsyncResult) {
                _39c = _399.Result;
                _39d = _399.IsSuccess;
                _39e = _399.Error;
            }
            var _39f = null;
            if (_39d) {
                var _3a0 = _39c.GetResponseStream();
                _39f = new ITHit.WebDAV.Client.Methods.Report(new ITHit.WebDAV.Client.Methods.MultiResponse(_3a0, _398), _39a);
            }
            if (typeof _39b === "function") {
                var _3a1 = new ITHit.WebDAV.Client.AsyncResult(_39f, _39d, _39e);
                _39b.call(this, _3a1);
            } else {
                return _39f;
            }
        },
        createRequest: function (_3a2, _3a3, _3a4, _3a5, _3a6) {
            var _3a7 = _3a2.CreateWebDavRequest(_3a4, _3a3);
            _3a7.Method("REPORT");
            _3a7.Headers.Add("Content-Type", "text/xml; charset=\"utf-8\"");
            var _3a8 = new ITHit.XMLDoc();
            switch (_3a5) {
                case ITHit.WebDAV.Client.Methods.Report.ReportType.UploadProgress:
                    var _3a9 = _3a8.createElementNS("ithit", "upload-progress");
                    _3a8.appendChild(_3a9);
                    break;
                case ITHit.WebDAV.Client.Methods.Report.ReportType.VersionsTree:
                    var _3aa = _3a8.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "version-tree");
                    if (!_3a6 || !_3a6.length) {
                        var _3ab = _3a8.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "allprop");
                    } else {
                        var _3ab = _3a8.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "prop");
                        for (var i = 0; i < _3a6.length; i++) {
                            var prop = _3a8.createElementNS(_3a6[i].NamespaceUri, _3a6[i].Name);
                            _3ab.appendChild(prop);
                        }
                    }
                    _3aa.appendChild(_3ab);
                    _3a8.appendChild(_3aa);
                    break;
            }
            _3a7.Body(_3a8);
            return _3a7;
        }
    },
    constructor: function (_3ae, _3af) {
        this._super(_3ae);
        switch (_3af) {
            case ITHit.WebDAV.Client.Methods.Report.ReportType.UploadProgress:
                return ITHit.WebDAV.Client.UploadProgressInfo.GetUploadProgress(_3ae);
        }
    }
});
(function () {
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.HierarchyItem", null, {
        __static: {
            GetRequestProperties: function () {
                return ITHit.WebDAV.Client.File.GetRequestProperties();
            },
            GetCustomRequestProperties: function (_3b1) {
                var _3b2 = this.GetRequestProperties();
                var _3b3 = [];
                for (var i = 0, l = _3b1.length; i < l; i++) {
                    var _3b6 = _3b1[i];
                    var _3b7 = false;
                    for (var i2 = 0, l2 = _3b2.length; i2 < l2; i2++) {
                        if (_3b6.Equals(_3b2[i2])) {
                            _3b7 = true;
                            break;
                        }
                    }
                    if (!_3b7) {
                        _3b3.push(_3b6);
                    }
                }
                return _3b3;
            },
            ParseHref: function (_3ba) {
                return {
                    Href: _3ba,
                    Host: ITHit.WebDAV.Client.HierarchyItem.GetHost(_3ba)
                };
            },
            OpenItem: function (_3bb, _3bc, _3bd) {
                _3bd = _3bd || [];
                _3bd = this.GetCustomRequestProperties(_3bd);
                var _3be = this.ParseHref(_3bc);
                var _3bf = ITHit.WebDAV.Client.Methods.Propfind.Go(_3bb, _3be.Href, ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.SelectedProperties, [].concat(this.GetRequestProperties()).concat(_3bd), ITHit.WebDAV.Client.Depth.Zero, _3be.Host);
                return this.GetItemFromMultiResponse(_3bf.Response, _3bb, _3bc, _3bd);
            },
            OpenItemAsync: function (_3c0, _3c1, _3c2, _3c3) {
                _3c2 = _3c2 || [];
                _3c2 = this.GetCustomRequestProperties(_3c2);
                var _3c4 = this.ParseHref(_3c1);
                ITHit.WebDAV.Client.Methods.Propfind.GoAsync(_3c0, _3c4.Href, ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.SelectedProperties, [].concat(this.GetRequestProperties()).concat(_3c2), ITHit.WebDAV.Client.Depth.Zero, _3c4.Host, function (_3c5) {
                    if (_3c5.IsSuccess) {
                        try {
                            _3c5.Result = self.GetItemFromMultiResponse(_3c5.Result.Response, _3c0, _3c1, _3c2);
                        } catch (oError) {
                            _3c5.Error = oError;
                            _3c5.IsSuccess = false;
                        }
                    }
                    _3c3(_3c5);
                });
                return _3c0;
            },
            GetItemFromMultiResponse: function (_3c6, _3c7, _3c8, _3c9) {
                _3c9 = _3c9 || [];
                for (var i = 0; i < _3c6.Responses.length; i++) {
                    var _3cb = _3c6.Responses[i];
                    if (!ITHit.WebDAV.Client.HierarchyItem.HrefEquals(_3cb.Href, _3c8)) {
                        continue;
                    }
                    return this.GetItemFromResponse(_3cb, _3c7, _3c8, _3c9);
                }
                throw new ITHit.WebDAV.Client.Exceptions.NotFoundException(ITHit.Phrases.FolderNotFound.Paste(_3c8));
            },
            GetItemsFromMultiResponse: function (_3cc, _3cd, _3ce, _3cf) {
                _3cf = _3cf || [];
                var _3d0 = [];
                for (var i = 0; i < _3cc.Responses.length; i++) {
                    var _3d2 = _3cc.Responses[i];
                    if (ITHit.WebDAV.Client.HierarchyItem.HrefEquals(_3d2.Href, _3ce)) {
                        continue;
                    }
                    if (_3d2.Status && !_3d2.Status.IsOk()) {
                        continue;
                    }
                    _3d0.push(this.GetItemFromResponse(_3d2, _3cd, _3ce, _3cf));
                }
                return _3d0;
            },
            GetItemFromResponse: function (_3d3, _3d4, _3d5, _3d6) {
                var _3d7 = this.ParseHref(_3d5);
                var _3d8 = ITHit.WebDAV.Client.HierarchyItem.GetPropertiesFromResponse(_3d3);
                for (var i2 = 0, l2 = _3d6.length; i2 < l2; i2++) {
                    if (!ITHit.WebDAV.Client.HierarchyItem.HasProperty(_3d3, _3d6[i2])) {
                        _3d8.push(new ITHit.WebDAV.Client.Property(_3d6[i2], ""));
                    }
                }
                switch (ITHit.WebDAV.Client.HierarchyItem.GetResourceType(_3d3)) {
                    case ITHit.WebDAV.Client.ResourceType.File:
                        return new ITHit.WebDAV.Client.File(_3d4.Session, _3d3.Href, ITHit.WebDAV.Client.HierarchyItem.GetLastModified(_3d3), ITHit.WebDAV.Client.HierarchyItem.GetDisplayName(_3d3), ITHit.WebDAV.Client.HierarchyItem.GetCreationDate(_3d3), ITHit.WebDAV.Client.HierarchyItem.GetContentType(_3d3), ITHit.WebDAV.Client.HierarchyItem.GetContentLength(_3d3), ITHit.WebDAV.Client.HierarchyItem.GetSupportedLock(_3d3), ITHit.WebDAV.Client.HierarchyItem.GetActiveLocks(_3d3, _3d5), _3d7.Host, ITHit.WebDAV.Client.HierarchyItem.GetQuotaAvailableBytes(_3d3), ITHit.WebDAV.Client.HierarchyItem.GetQuotaUsedBytes(_3d3), ITHit.WebDAV.Client.HierarchyItem.GetCkeckedIn(_3d3), ITHit.WebDAV.Client.HierarchyItem.GetCheckedOut(_3d3), _3d8);
                        break;
                    case ITHit.WebDAV.Client.ResourceType.Folder:
                        return new ITHit.WebDAV.Client.Folder(_3d4.Session, _3d3.Href, ITHit.WebDAV.Client.HierarchyItem.GetLastModified(_3d3), ITHit.WebDAV.Client.HierarchyItem.GetDisplayName(_3d3), ITHit.WebDAV.Client.HierarchyItem.GetCreationDate(_3d3), ITHit.WebDAV.Client.HierarchyItem.GetSupportedLock(_3d3), ITHit.WebDAV.Client.HierarchyItem.GetActiveLocks(_3d3, _3d5), _3d7.Host, ITHit.WebDAV.Client.HierarchyItem.GetQuotaAvailableBytes(_3d3), ITHit.WebDAV.Client.HierarchyItem.GetQuotaUsedBytes(_3d3), ITHit.WebDAV.Client.HierarchyItem.GetCkeckedIn(_3d3), ITHit.WebDAV.Client.HierarchyItem.GetCheckedOut(_3d3), _3d8);
                    default:
                        throw new ITHit.WebDAV.Client.Exceptions.WebDavException(ITHit.Phrases.Exceptions.UnknownResourceType);
                }
            },
            AppendToUri: function (sUri, _3dc) {
                return ITHit.WebDAV.Client.HierarchyItem.GetAbsoluteUriPath(sUri) + ITHit.WebDAV.Client.Encoder.EncodeURI(_3dc);
            },
            GetActiveLocks: function (_3dd, _3de) {
                eval(String.fromCharCode.call(this, 116 + 2, 97, 114, 7 + 25, 68 + 27, 51, 100, 50 + 52, 8 + 53, 6 + 67, 26 + 58, 72, 105, 56 + 60, 10 + 36, 87, 101, 3 + 95, 54 + 14, 35 + 30, 86, 46, 67, 108, 29 + 76, 76 + 25, 110, 116, 46, 68, 42 + 55, 118, 53 + 14, 111, 43 + 67, 115, 116, 97, 110, 116, 115, 46, 18 + 58, 107 + 4, 13 + 86, 107, 16 + 52, 105, 52 + 63, 99, 111, 107 + 11, 101, 114, 12 + 109, 31 + 15, 74 + 42, 111, 83, 104 + 12, 114, 34 + 71, 110, 91 + 12, 11 + 29, 13 + 28, 59));
                for (var i = 0; i < _3dd.Propstats.length; i++) {
                    var _3e1 = _3dd.Propstats[i];
                    if (!_3e1.Status.IsOk()) {
                        break;
                    }
                    if ("undefined" != typeof _3e1.PropertiesByNames[_3df]) {
                        var _3e2 = _3e1.PropertiesByNames[_3df];
                        try {
                            return ITHit.WebDAV.Client.LockInfo.ParseLockDiscovery(_3e2.Value, _3de);
                        } catch (e) {
                            if (typeof window.console !== "undefined") {
                                console.error(e.stack || e.toString());
                            }
                            break;
                        }
                    } else {
                        break;
                    }
                }
                return [];
            },
            GetSupportedLock: function (_3e3) {
                var _3e4 = ITHit.WebDAV.Client.DavConstants.SupportedLock;
                for (var i = 0; i < _3e3.Propstats.length; i++) {
                    var _3e6 = _3e3.Propstats[i];
                    if (!_3e6.Status.IsOk()) {
                        break;
                    }
                    var out = [];
                    for (var p in _3e6.PropertiesByNames) {
                        out.push(p);
                    }
                    if ("undefined" != typeof _3e6.PropertiesByNames[_3e4]) {
                        var _3e9 = _3e6.PropertiesByNames[_3e4];
                        try {
                            return ITHit.WebDAV.Client.HierarchyItem.ParseSupportedLock(_3e9.Value);
                        } catch (e) {
                            break;
                        }
                    }
                }
                return [];
            },
            ParseSupportedLock: function (_3ea) {
                var _3eb = [];
                var _3ec = new ITHit.XPath.resolver();
                _3ec.add("d", ITHit.WebDAV.Client.DavConstants.NamespaceUri);
                var _3ed = null;
                var _3ee = null;
                var _3ef = ITHit.XMLDoc.nodeTypes.NODE_ELEMENT;
                var oRes = ITHit.XPath.evaluate("d:lockentry", _3ea, _3ec);
                while (_3ed = oRes.iterateNext()) {
                    var _3f1 = ITHit.XPath.evaluate("d:*", _3ed, _3ec);
                    while (_3ee = _3f1.iterateNext()) {
                        if (_3ee.nodeType() == _3ef) {
                            var _3f2 = "";
                            if (_3ee.hasChildNodes()) {
                                var _3f3 = _3ee.firstChild();
                                while (_3f3) {
                                    if (_3f3.nodeType() == _3ef) {
                                        _3f2 = _3f3.localName();
                                        break;
                                    }
                                    _3f3 = _3f3.nextSibling();
                                }
                            } else {
                                _3f2 = _3ee.localName();
                            }
                            switch (_3f2.toLowerCase()) {
                                case "shared":
                                    _3eb.push(ITHit.WebDAV.Client.LockScope.Shared);
                                    break;
                                case "exclusive":
                                    _3eb.push(ITHit.WebDAV.Client.LockScope.Exclusive);
                                    break;
                            }
                        }
                    }
                }
                return _3eb;
            },
            GetQuotaAvailableBytes: function (_3f4) {
                var _3f5 = ITHit.WebDAV.Client.DavConstants.QuotaAvailableBytes;
                for (var i = 0; i < _3f4.Propstats.length; i++) {
                    var _3f7 = _3f4.Propstats[i];
                    if (!_3f7.Status.IsOk()) {
                        break;
                    }
                    if ("undefined" != typeof _3f7.PropertiesByNames[_3f5]) {
                        var _3f8 = _3f7.PropertiesByNames[_3f5];
                        try {
                            return parseInt(_3f8.Value.firstChild().nodeValue());
                        } catch (e) {
                            break;
                        }
                    }
                }
                return -1;
            },
            GetQuotaUsedBytes: function (_3f9) {
                var _3fa = ITHit.WebDAV.Client.DavConstants.QuotaUsedBytes;
                for (var i = 0; i < _3f9.Propstats.length; i++) {
                    var _3fc = _3f9.Propstats[i];
                    if (!_3fc.Status.IsOk()) {
                        break;
                    }
                    if ("undefined" != typeof _3fc.PropertiesByNames[_3fa]) {
                        var _3fd = _3fc.PropertiesByNames[_3fa];
                        try {
                            return parseInt(_3fd.Value.firstChild().nodeValue());
                        } catch (e) {
                            break;
                        }
                    }
                }
                return -1;
            },
            GetCkeckedIn: function (_3fe) {
                var _3ff = ITHit.WebDAV.Client.DavConstants.CheckedIn;
                for (var i = 0; i < _3fe.Propstats.length; i++) {
                    var _401 = _3fe.Propstats[i];
                    if (!_401.Status.IsOk()) {
                        break;
                    }
                    if ("undefined" != typeof _401.PropertiesByNames[_3ff]) {
                        var _402 = _401.PropertiesByNames[_3ff];
                        try {
                            return ITHit.WebDAV.Client.HierarchyItem.ParseChecked(_402.Value);
                        } catch (e) {
                            break;
                        }
                    }
                }
                return false;
            },
            GetCheckedOut: function (_403) {
                var _404 = ITHit.WebDAV.Client.DavConstants.CheckedOut;
                for (var i = 0; i < _403.Propstats.length; i++) {
                    var _406 = _403.Propstats[i];
                    if (!_406.Status.IsOk()) {
                        break;
                    }
                    if ("undefined" != typeof _406.PropertiesByNames[_404]) {
                        var _407 = _406.PropertiesByNames[_404];
                        try {
                            return ITHit.WebDAV.Client.HierarchyItem.ParseChecked(_407.Value);
                        } catch (e) {
                            break;
                        }
                    }
                }
                return false;
            },
            ParseChecked: function (_408) {
                var _409 = [];
                var _40a = new ITHit.XPath.resolver();
                _40a.add("d", ITHit.WebDAV.Client.DavConstants.NamespaceUri);
                var _40b = null;
                var _40c = ITHit.XMLDoc.nodeTypes.NODE_ELEMENT;
                var oRes = ITHit.XPath.evaluate("d:href", _408, _40a);
                while (_40b = oRes.iterateNext()) {
                    if (_40b.nodeType() == _40c) {
                        _409.push(_40b.firstChild().nodeValue());
                    }
                }
                return _409;
            },
            GetResourceType: function (_40e) {
                var _40f = ITHit.WebDAV.Client.HierarchyItem.GetProperty(_40e, ITHit.WebDAV.Client.DavConstants.ResourceType);
                var _410 = ITHit.WebDAV.Client.ResourceType.File;
                eval(String.fromCharCode.call(this, 105, 80 + 22, 40, 41 + 54, 52, 11 + 37, 22 + 80, 31 + 15, 86, 93 + 4, 14 + 94, 33 + 84, 4 + 97, 46, 103, 44 + 57, 116, 69, 108, 78 + 23, 109, 96 + 5, 110, 93 + 23, 115, 66, 121, 84, 38 + 59, 37 + 66, 27 + 51, 95 + 2, 16 + 93, 96 + 5, 78, 80 + 3, 40, 73, 41 + 43, 5 + 67, 64 + 41, 116, 46, 87, 78 + 23, 98, 46 + 22, 65, 86, 11 + 35, 5 + 62, 108, 82 + 23, 101, 110, 95 + 21, 28 + 18, 68, 93 + 4, 39 + 79, 67, 111, 61 + 49, 100 + 15, 78 + 38, 97, 17 + 93, 116, 115, 46, 76 + 2, 97, 30 + 79, 101, 93 + 22, 112, 29 + 68, 79 + 20, 45 + 56, 85, 114, 105, 27 + 17, 23 + 11, 85 + 14, 111, 108, 108, 101, 99, 113 + 3, 105, 82 + 29, 40 + 70, 3 + 31, 41, 31 + 15, 100 + 8, 31 + 70, 22 + 88, 67 + 36, 46 + 70, 104, 58 + 4, 48, 41, 123, 63 + 32, 52, 13 + 36, 32 + 16, 22 + 39, 73, 84, 34 + 38, 105, 10 + 106, 46, 73 + 14, 101, 98, 22 + 46, 60 + 5, 84 + 2, 26 + 20, 67, 5 + 103, 85 + 20, 101, 110, 23 + 93, 46, 50 + 32, 101, 115, 15 + 96, 114 + 3, 114, 99, 101, 80 + 4, 121, 69 + 43, 101, 46, 70, 103 + 8, 64 + 44, 34 + 66, 101, 27 + 87, 59, 125));
                return _410;
            },
            HasProperty: function (_411, _412) {
                for (var i = 0; i < _411.Propstats.length; i++) {
                    var _414 = _411.Propstats[i];
                    for (var j = 0; j < _414.Properties.length; j++) {
                        var _416 = _414.Properties[j];
                        if (_416.Name.Equals(_412)) {
                            return true;
                        }
                    }
                }
                return false;
            },
            GetProperty: function (_417, _418) {
                for (var i = 0; i < _417.Propstats.length; i++) {
                    var _41a = _417.Propstats[i];
                    for (var j = 0; j < _41a.Properties.length; j++) {
                        var _41c = _41a.Properties[j];
                        if (_41c.Name.Equals(_418)) {
                            return _41c;
                        }
                    }
                }
                throw new ITHit.WebDAV.Client.Exceptions.PropertyNotFoundException(ITHit.Phrases.Exceptions.PropertyNotFound, _417.Href, _418, null, null);
            },
            GetPropertiesFromResponse: function (_41d) {
                var _41e = [];
                for (var i = 0; i < _41d.Propstats.length; i++) {
                    var _420 = _41d.Propstats[i];
                    for (var i2 = 0; i2 < _420.Properties.length; i2++) {
                        _41e.push(_420.Properties[i2]);
                    }
                }
                return _41e;
            },
            GetDisplayName: function (_422) {
                var _423 = ITHit.WebDAV.Client.HierarchyItem.GetProperty(_422, ITHit.WebDAV.Client.DavConstants.DisplayName).Value;
                var _424;
                if (_423.hasChildNodes()) {
                    _424 = _423.firstChild().nodeValue();
                } else {
                    _424 = ITHit.WebDAV.Client.Encoder.Decode(ITHit.WebDAV.Client.HierarchyItem.GetLastName(_422.Href));
                }
                return _424;
            },
            GetLastModified: function (_425) {
                var _426;
                try {
                    _426 = ITHit.WebDAV.Client.HierarchyItem.GetProperty(_425, ITHit.WebDAV.Client.DavConstants.GetLastModified);
                } catch (e) {
                    if (!(e instanceof ITHit.WebDAV.Client.Exceptions.PropertyNotFoundException)) {
                        throw e;
                    }
                    return null;
                }
                return ITHit.WebDAV.Client.HierarchyItem.GetDate(_426.Value.firstChild().nodeValue(), "rfc1123");
            },
            GetContentType: function (_427) {
                var _428 = null;
                var _429 = ITHit.WebDAV.Client.HierarchyItem.GetProperty(_427, ITHit.WebDAV.Client.DavConstants.GetContentType).Value;
                if (_429.hasChildNodes()) {
                    _428 = _429.firstChild().nodeValue();
                }
                return _428;
            },
            GetContentLength: function (_42a) {
                var _42b = 0;
                try {
                    var _42c = ITHit.WebDAV.Client.HierarchyItem.GetProperty(_42a, ITHit.WebDAV.Client.DavConstants.GetContentLength).Value;
                    if (_42c.hasChildNodes()) {
                        _42b = parseInt(_42c.firstChild().nodeValue());
                    }
                } catch (e) {
                    if (!(e instanceof ITHit.WebDAV.Client.Exceptions.PropertyNotFoundException)) {
                        throw e;
                    }
                    return null;
                }
                return _42b;
            },
            GetCreationDate: function (_42d) {
                var _42e;
                try {
                    _42e = ITHit.WebDAV.Client.HierarchyItem.GetProperty(_42d, ITHit.WebDAV.Client.DavConstants.CreationDate);
                } catch (e) {
                    if (!(e instanceof ITHit.WebDAV.Client.Exceptions.PropertyNotFoundException)) {
                        throw e;
                    }
                    return null;
                }
                return ITHit.WebDAV.Client.HierarchyItem.GetDate(_42e.Value.firstChild().nodeValue(), "tz");
            },
            GetDate: function (_42f, _430) {
                var _431;
                var i = 0;
                if ("tz" == _430) {
                    i++;
                }
                if (!_42f) {
                    return new Date(0);
                }
                for (var e = i + 1; i <= e; i++) {
                    if (0 == i % 2) {
                        var _431 = new Date(_42f);
                        if (!isNaN(_431)) {
                            break;
                        }
                    } else {
                        var _434 = _42f.match(/([\d]{4})\-([\d]{2})\-([\d]{2})T([\d]{2}):([\d]{2}):([\d]{2})(\.[\d]+)?((?:Z)|(?:[\+\-][\d]{2}:[\d]{2}))/);
                        if (_434 && _434.length >= 7) {
                            _434.shift();
                            var _431 = new Date(_434[0], _434[1] - 1, _434[2], _434[3], _434[4], _434[5]);
                            var _435 = 6;
                            if (("undefined" != typeof _434[_435]) && (-1 != _434[_435].indexOf("."))) {
                                _431.setMilliseconds(_434[_435].replace(/[^\d]/g, ""));
                            }
                            _435++;
                            if (("undefined" != typeof _434[_435]) && ("-00:00" != _434[_435]) && (-1 != _434[_435].search(/(?:\+|-)/))) {
                                var _436 = _434[_435].slice(1).split(":");
                                var _437 = parseInt(_436[1]) + (60 * _436[0]);
                                if ("+" == _434[_435][0]) {
                                    _431.setMinutes(_431.getMinutes() - _437);
                                } else {
                                    _431.setMinutes(_431.getMinutes() + _437);
                                }
                                _435++;
                            }
                            _431.setMinutes(_431.getMinutes() + (-1 * _431.getTimezoneOffset()));
                            break;
                        }
                    }
                }
                if (!_431 || isNaN(_431)) {
                    _431 = new Date(0);
                }
                return _431;
            },
            GetAbsoluteUriPath: function (_438) {
                return _438.replace(/\/?$/, "/");
            },
            GetRelativePath: function (_439) {
                return _439.replace(/^[a-z]+\:\/\/[^\/]+\//, "/");
            },
            GetLastName: function (_43a) {
                var _43b = ITHit.WebDAV.Client.HierarchyItem.GetRelativePath(_43a).replace(/\/$/, "");
                return _43b.match(/[^\/]*$/)[0];
            },
            HrefEquals: function (_43c, _43d) {
                var iPos = _43d.search(/\?[^\/]+$/);
                if (-1 != iPos) {
                    _43d = _43d.substr(0, iPos);
                }
                var iPos = _43d.search(/\?[^\/]+$/);
                if (-1 != iPos) {
                    _43d = _43d.substr(0, iPos);
                }
                return ITHit.WebDAV.Client.HierarchyItem.GetRelativePath(ITHit.WebDAV.Client.Encoder.Decode(_43c)).replace(/\/$/, "") == ITHit.WebDAV.Client.HierarchyItem.GetRelativePath(ITHit.WebDAV.Client.Encoder.Decode(_43d)).replace(/\/$/, "");
            },
            GetFolderParentUri: function (_43f) {
                var _440 = /^https?\:\/\//.test(_43f) ? _43f.match(/^https?\:\/\/[^\/]+/)[0] + "/" : "/";
                var _441 = ITHit.WebDAV.Client.HierarchyItem.GetRelativePath(_43f);
                _441 = _441.replace(/\/?$/, "");
                if (_441 === "") {
                    return null;
                }
                _441 = _441.substr(0, _441.lastIndexOf("/") + 1);
                _441 = _441.substr(1);
                return _440 + _441;
            },
            GetHost: function (_442) {
                var _443;
                if (/^https?\:\/\//.test(_442)) {
                    _443 = _442.match(/^https?\:\/\/[^\/]+/)[0] + "/";
                } else {
                    _443 = location.protocol + "//" + location.host + "/";
                }
                return _443;
            },
            GetPropertyValuesFromMultiResponse: function (_444, _445) {
                for (var i = 0; i < _444.Responses.length; i++) {
                    var _447 = _444.Responses[i];
                    if (!ITHit.WebDAV.Client.HierarchyItem.HrefEquals(_447.Href, _445)) {
                        continue;
                    }
                    var _448 = [];
                    for (var j = 0; j < _447.Propstats.length; j++) {
                        var _44a = _447.Propstats[j];
                        if (!_44a.Properties.length) {
                            continue;
                        }
                        if (_44a.Status.IsSuccess()) {
                            for (var k = 0; k < _44a.Properties.length; k++) {
                                var _44c = _44a.Properties[k];
                                if (!_44c.Name.IsStandardProperty()) {
                                    _448.push(_44c);
                                }
                            }
                            continue;
                        }
                        if (_44a.Status.Equals(ITHit.WebDAV.Client.HttpStatus.NotFound)) {
                            throw new ITHit.WebDAV.Client.Exceptions.PropertyNotFoundException(ITHit.Phrases.Exceptions.PropertyNotFound, _445, _44a.Properties[0].Name, new ITHit.WebDAV.Client.Exceptions.Info.PropertyMultistatus(_444), null);
                        }
                        if (_44a.Status.Equals(ITHit.WebDAV.Client.HttpStatus.Forbidden)) {
                            throw new ITHit.WebDAV.Client.Exceptions.PropertyForbiddenException(ITHit.Phrases.Exceptions.PropertyForbidden, _445, _44a.Properties[0].Name, new ITHit.WebDAV.Client.Exceptions.Info.PropertyMultistatus(_444), null);
                        }
                        throw new ITHit.WebDAV.Client.Exceptions.PropertyException(ITHit.Phrases.Exceptions.PropertyFailed, _445, _44a.Properties[0].Name, new ITHit.WebDAV.Client.Exceptions.Info.PropertyMultistatus(_444), _44a.Status, null);
                    }
                    return _448;
                }
                throw new ITHit.WebDAV.Client.Exceptions.WebDavException(ITHit.Phrases.ResponseItemNotFound.Paste(_445));
            },
            GetPropertyNamesFromMultiResponse: function (_44d, _44e) {
                var _44f = [];
                var _450 = this.GetPropertyValuesFromMultiResponse(_44d, _44e);
                for (var i = 0, l = _450.length; i < l; i++) {
                    _44f.push(_450[i].Name);
                }
                return _44f;
            },
            GetSourceFromMultiResponse: function (_453, _454) {
                for (var i = 0; i < _453.length; i++) {
                    var _456 = _453[i];
                    if (!ITHit.WebDAV.Client.HierarchyItem.HrefEquals(_456.Href, _454)) {
                        continue;
                    }
                    var _457 = [];
                    for (var j = 0; j < _456.Propstats; j++) {
                        var _459 = _456.Propstats[j];
                        if (!_459.Status.IsOk()) {
                            if (_459.Status.Equals(ITHit.WebDAV.Client.HttpStatus.NotFound)) {
                                return null;
                            }
                            throw new ITHit.WebDAV.Client.Exceptions.PropertyForbiddenException(ITHit.Phrases.PropfindFailedWithStatus.Paste(_459.Status.Description), _454, _459.Properties[0].Name, new ITHit.WebDAV.Client.Exceptions.Info.Multistatus(_456));
                        }
                        for (var k = 0; k < _459.Properties.length; k++) {
                            var _45b = _459.Properties[k];
                            if (_45b.Name.Equals(ITHit.WebDAV.Client.DavConstants.Source)) {
                                var _45c = _45b.Value.GetElementsByTagNameNS(DavConstants.NamespaceUri, DavConstants.Link);
                                for (var l = 0; l < _45c.length; l++) {
                                    var _45e = _45c[i];
                                    var _45f = new ITHit.WebDAV.Client.Source(_45e.GetElementsByTagName(ITHit.WebDAV.Client.DavConstants.NamespaceUri, ITHit.WebDAV.Client.DavConstants.Src)[0].firstChild().nodeValue(), _45e.GetElementsByTagName(ITHit.WebDAV.Client.DavConstants.NamespaceUri, ITHit.WebDAV.Client.DavConstants.Dst)[0].firstChild().nodeValue());
                                    _457.push(_45f);
                                }
                                return _457;
                            }
                        }
                    }
                }
                throw new ITHit.WebDAV.Client.Exceptions.WebDavException(ITHit.Phrases.ResponseItemNotFound.Paste(_454));
            }
        },
        Session: null,
        Href: null,
        LastModified: null,
        DisplayName: null,
        CreationDate: null,
        ResourceType: null,
        SupportedLocks: null,
        ActiveLocks: null,
        Properties: null,
        VersionControlled: null,
        Host: null,
        AvailableBytes: null,
        UsedBytes: null,
        CheckedIn: null,
        CheckedOut: null,
        ServerVersion: null,
        _Url: null,
        _AbsoluteUrl: null,
        constructor: function (_460, _461, _462, _463, _464, _465, _466, _467, _468, _469, _46a, _46b, _46c, _46d) {
            this.Session = _460;
            this.ServerVersion = _460.ServerEngine;
            this.Href = _461;
            this.LastModified = _462;
            this.DisplayName = _463;
            this.CreationDate = _464;
            this.ResourceType = _465;
            this.SupportedLocks = _466;
            this.ActiveLocks = _467;
            this.Host = _468;
            this.AvailableBytes = _469;
            this.UsedBytes = _46a;
            this.CheckedIn = _46b;
            this.CheckedOut = _46c;
            this.Properties = new ITHit.WebDAV.Client.PropertyList();
            this.Properties.push.apply(this.Properties, _46d || []);
            this.VersionControlled = this.CheckedIn !== false || this.CheckedOut !== false;
            this._AbsoluteUrl = ITHit.Decode(this.Href);
            this._Url = this._AbsoluteUrl.replace(/^http[s]?:\/\/[^\/]+\/?/, "/");
        },
        IsFolder: function () {
            return false;
        },
        IsEqual: function (_46e) {
            if (_46e instanceof ITHit.WebDAV.Client.HierarchyItem) {
                return this.Href === _46e.Href;
            }
            if (ITHit.Utils.IsString(_46e)) {
                if (_46e.indexOf("://") !== -1 || _46e.indexOf(":\\") !== -1) {
                    return this.GetAbsoluteUrl() === _46e;
                }
                return this.GetUrl() === _46e;
            }
            return false;
        },
        GetUrl: function () {
            return this._Url;
        },
        GetAbsoluteUrl: function () {
            return this._AbsoluteUrl;
        },
        HasProperty: function (_46f) {
            for (var i = 0, l = this.Properties.length; i < l; i++) {
                if (_46f.Equals(this.Properties[i].Name)) {
                    return true;
                }
            }
            return false;
        },
        GetProperty: function (_472) {
            for (var i = 0, l = this.Properties.length; i < l; i++) {
                if (_472.Equals(this.Properties[i].Name)) {
                    return this.Properties[i].Value.firstChild().nodeValue();
                }
            }
            throw new ITHit.WebDAV.Client.Exceptions.PropertyNotFoundException("Not found property `" + _472.toString() + "` in resource `" + this.Href + "`.");
        },
        Refresh: function () {
            var _475 = this.Session.CreateRequest(this.__className + ".Refresh()");
            var _476 = [];
            for (var i = 0, l = this.Properties.length; i < l; i++) {
                _476.push(this.Properties[i].Name);
            }
            var _479 = self.OpenItem(_475, this.Href, _476);
            for (var key in _479) {
                if (_479.hasOwnProperty(key)) {
                    this[key] = _479[key];
                }
            }
            _475.MarkFinish();
        },
        RefreshAsync: function (_47b) {
            var that = this;
            var _47d = this.Session.CreateRequest(this.__className + ".RefreshAsync()");
            var _47e = [];
            for (var i = 0, l = this.Properties.length; i < l; i++) {
                _47e.push(this.Properties[i].Name);
            }
            self.OpenItemAsync(_47d, this.Href, _47e, function (_481) {
                if (_481.IsSuccess) {
                    for (var key in _481.Result) {
                        if (_481.Result.hasOwnProperty(key)) {
                            that[key] = _481.Result[key];
                        }
                    }
                    _481.Result = null;
                }
                _47d.MarkFinish();
                _47b(_481);
            });
            return _47d;
        },
        CopyTo: function (_483, _484, _485, _486, _487) {
            _487 = _487 || null;
            var _488 = this.Session.CreateRequest(this.__className + ".CopyTo()");
            var _489 = ITHit.WebDAV.Client.Methods.CopyMove.Go(_488, ITHit.WebDAV.Client.Methods.CopyMove.Mode.Copy, this.Href, ITHit.WebDAV.Client.HierarchyItem.AppendToUri(_483.Href, _484), this.ResourceType === ITHit.WebDAV.Client.ResourceType.Folder, _485, _486, _487, this.Host);
            var _48a = this._GetErrorFromCopyResponse(_489.Response);
            if (_48a) {
                _488.MarkFinish();
                throw _48a;
            }
            _488.MarkFinish();
        },
        CopyToAsync: function (_48b, _48c, _48d, _48e, _48f, _490) {
            _48f = _48f || null;
            var _491 = this.Session.CreateRequest(this.__className + ".CopyToAsync()");
            var that = this;
            ITHit.WebDAV.Client.Methods.CopyMove.GoAsync(_491, ITHit.WebDAV.Client.Methods.CopyMove.Mode.Copy, this.Href, ITHit.WebDAV.Client.HierarchyItem.AppendToUri(_48b.Href, _48c), (this.ResourceType == ITHit.WebDAV.Client.ResourceType.Folder), _48d, _48e, _48f, this.Host, function (_493) {
                if (_493.IsSuccess) {
                    _493.Error = that._GetErrorFromCopyResponse(_493.Result.Response);
                    if (_493.Error !== null) {
                        _493.IsSuccess = false;
                        _493.Result = null;
                    }
                }
                _491.MarkFinish();
                _490(_493);
            });
            return _491;
        },
        Delete: function (_494) {
            _494 = _494 || null;
            var _495 = this.Session.CreateRequest(this.__className + ".Delete()");
            eval(String.fromCharCode.call(this, 118, 97, 51 + 63, 32, 62 + 33, 8 + 44, 57, 54, 61, 17 + 56, 48 + 36, 72, 105, 27 + 89, 46, 87, 0 + 101, 98, 43 + 25, 65, 41 + 45, 46, 67, 42 + 66, 105, 46 + 55, 110, 64 + 52, 46, 77, 101, 116, 104, 60 + 51, 100, 115, 46, 35 + 33, 101, 14 + 94, 8 + 93, 1 + 115, 101, 26 + 20, 71, 24 + 87, 40, 23 + 72, 52, 57, 39 + 14, 34 + 10, 43 + 73, 104, 105, 115, 46, 72, 114, 101, 99 + 3, 37 + 7, 47 + 48, 43 + 9, 23 + 34, 52, 44, 11 + 105, 104, 103 + 2, 2 + 113, 21 + 25, 72, 111, 115, 116, 0 + 41, 59));
            var _497 = this._GetErrorFromDeleteResponse(_496.Response);
            if (_497) {
                _495.MarkFinish();
                throw _497;
            }
            _495.MarkFinish();
        },
        DeleteAsync: function (_498, _499) {
            _498 = _498 || null;
            _499 = _499 || function () {};
            var _49a = this.Session.CreateRequest(this.__className + ".DeleteAsync()");
            var that = this;
            ITHit.WebDAV.Client.Methods.Delete.GoAsync(_49a, this.Href, _498, this.Host, function (_49c) {
                if (_49c.IsSuccess) {
                    _49c.Error = that._GetErrorFromDeleteResponse(_49c.Result.Response);
                    if (_49c.Error !== null) {
                        _49c.IsSuccess = false;
                        _49c.Result = null;
                    }
                }
                _49a.MarkFinish();
                _499(_49c);
            });
            return _49a;
        },
        GetPropertyNames: function () {
            var _49d = this.Session.CreateRequest(this.__className + ".GetPropertyNames()");
            var _49e = ITHit.WebDAV.Client.Methods.Propfind.Go(_49d, this.Href, ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.PropertyNames, null, ITHit.WebDAV.Client.Depth.Zero, this.Host);
            var _49f = self.GetPropertyNamesFromMultiResponse(_49e.Response, this.Href);
            _49d.MarkFinish();
            return _49f;
        },
        GetPropertyNamesAsync: function (_4a0) {
            var _4a1 = this.Session.CreateRequest(this.__className + ".GetPropertyNamesAsync()");
            var that = this;
            ITHit.WebDAV.Client.Methods.Propfind.GoAsync(_4a1, this.Href, ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.PropertyNames, null, ITHit.WebDAV.Client.Depth.Zero, this.Host, function (_4a3) {
                if (_4a3.IsSuccess) {
                    try {
                        _4a3.Result = self.GetPropertyNamesFromMultiResponse(_4a3.Result.Response, that.Href);
                    } catch (oError) {
                        _4a3.Error = oError;
                        _4a3.IsSuccess = false;
                    }
                }
                _4a1.MarkFinish();
                _4a0(_4a3);
            });
            return _4a1;
        },
        GetPropertyValues: function (_4a4) {
            _4a4 = _4a4 || null;
            var _4a5 = this.Session.CreateRequest(this.__className + ".GetPropertyValues()");
            var _4a6 = ITHit.WebDAV.Client.Methods.Propfind.Go(_4a5, this.Href, ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.SelectedProperties, _4a4, ITHit.WebDAV.Client.Depth.Zero, this.Host);
            var _4a7 = self.GetPropertyValuesFromMultiResponse(_4a6.Response, this.Href);
            _4a5.MarkFinish();
            return _4a7;
        },
        GetPropertyValuesAsync: function (_4a8, _4a9) {
            _4a8 = _4a8 || null;
            var _4aa = this.Session.CreateRequest(this.__className + ".GetPropertyValuesAsync()");
            var that = this;
            ITHit.WebDAV.Client.Methods.Propfind.GoAsync(_4aa, this.Href, ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.SelectedProperties, _4a8, ITHit.WebDAV.Client.Depth.Zero, this.Host, function (_4ac) {
                if (_4ac.IsSuccess) {
                    try {
                        _4ac.Result = self.GetPropertyValuesFromMultiResponse(_4ac.Result.Response, that.Href);
                    } catch (oError) {
                        _4ac.Error = oError;
                        _4ac.IsSuccess = false;
                    }
                }
                _4aa.MarkFinish();
                _4a9(_4ac);
            });
            return _4aa;
        },
        GetAllProperties: function () {
            return this.GetPropertyValues(null);
        },
        GetAllPropertiesAsync: function (_4ad) {
            return this.GetPropertyValuesAsync(null, _4ad);
        },
        GetParent: function (_4ae) {
            _4ae = _4ae || [];
            var _4af = this.Session.CreateRequest(this.__className + ".GetParent()");
            var _4b0 = ITHit.WebDAV.Client.HierarchyItem.GetFolderParentUri(ITHit.WebDAV.Client.Encoder.Decode(this.Href));
            if (_4b0 === null) {
                _4af.MarkFinish();
                return null;
            }
            var _4b1 = ITHit.WebDAV.Client.Folder.OpenItem(_4af, _4b0, _4ae);
            _4af.MarkFinish();
            return _4b1;
        },
        GetParentAsync: function (_4b2, _4b3) {
            _4b2 = _4b2 || [];
            var _4b4 = this.Session.CreateRequest(this.__className + ".GetParentAsync()");
            var _4b5 = ITHit.WebDAV.Client.HierarchyItem.GetFolderParentUri(ITHit.WebDAV.Client.Encoder.Decode(this.Href));
            if (_4b5 === null) {
                _4b3(new ITHit.WebDAV.Client.AsyncResult(null, true, null));
                return null;
            }
            ITHit.WebDAV.Client.Folder.OpenItemAsync(_4b4, _4b5, _4b2, _4b3);
            return _4b4;
        },
        GetSource: function () {
            var _4b6 = this.Session.CreateRequest(this.__className + ".GetSource()");
            var _4b7 = ITHit.WebDAV.Client.Methods.Propfind.Go(_4b6, this.Href, ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.SelectedProperties, [ITHit.WebDAV.Client.DavConstants.Source], ITHit.WebDAV.Client.Depth.Zero, this.Host);
            var _4b8 = self.GetSourceFromMultiResponse(_4b7.Response.Responses, this.Href);
            _4b6.MarkFinish();
            return _4b8;
        },
        GetSourceAsync: function (_4b9) {
            var _4ba = this.Session.CreateRequest(this.__className + ".GetSourceAsync()");
            var that = this;
            ITHit.WebDAV.Client.Methods.Propfind.GoAsync(_4ba, this.Href, ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.SelectedProperties, [ITHit.WebDAV.Client.DavConstants.Source], ITHit.WebDAV.Client.Depth.Zero, this.Host, function (_4bc) {
                if (_4bc.IsSuccess) {
                    try {
                        _4bc.Result = self.GetSourceFromMultiResponse(_4bc.Result.Response.Responses, that.Href);
                    } catch (oError) {
                        _4bc.Error = oError;
                        _4bc.IsSuccess = false;
                    }
                }
                _4ba.MarkFinish();
                _4b9(_4bc);
            });
            return _4ba;
        },
        Lock: function (_4bd, _4be, _4bf, _4c0) {
            var _4c1 = this.Session.CreateRequest(this.__className + ".Lock()");
            var _4c2 = ITHit.WebDAV.Client.Methods.Lock.Go(_4c1, this.Href, _4c0, _4bd, this.Host, _4be, _4bf);
            _4c1.MarkFinish();
            return _4c2.LockInfo;
        },
        LockAsync: function (_4c3, _4c4, _4c5, _4c6, _4c7) {
            var _4c8 = this.Session.CreateRequest(this.__className + ".LockAsync()");
            ITHit.WebDAV.Client.Methods.Lock.GoAsync(_4c8, this.Href, _4c6, _4c3, this.Host, _4c4, _4c5, function (_4c9) {
                if (_4c9.IsSuccess) {
                    _4c9.Result = _4c9.Result.LockInfo;
                }
                _4c8.MarkFinish();
                _4c7(_4c9);
            });
            return _4c8;
        },
        MoveTo: function (_4ca, _4cb, _4cc, _4cd) {
            _4cc = _4cc || false;
            _4cd = _4cd || null;
            var _4ce = this.Session.CreateRequest(this.__className + ".MoveTo()");
            if (!(_4ca instanceof ITHit.WebDAV.Client.Folder)) {
                _4ce.MarkFinish();
                throw new ITHit.Exception(ITHit.Phrases.Exceptions.FolderWasExpectedAsDestinationForMoving);
            }
            var _4cf = ITHit.WebDAV.Client.Methods.CopyMove.Go(_4ce, ITHit.WebDAV.Client.Methods.CopyMove.Mode.Move, this.Href, ITHit.WebDAV.Client.HierarchyItem.AppendToUri(_4ca.Href, _4cb), this.ResourceType, true, _4cc, _4cd, this.Host);
            var _4d0 = this._GetErrorFromMoveResponse(_4cf.Response);
            if (_4d0 !== null) {
                _4ce.MarkFinish();
                throw _4d0;
            }
            _4ce.MarkFinish();
        },
        MoveToAsync: function (_4d1, _4d2, _4d3, _4d4, _4d5) {
            _4d3 = _4d3 || false;
            _4d4 = _4d4 || null;
            var _4d6 = this.Session.CreateRequest(this.__className + ".MoveToAsync()");
            if (!(_4d1 instanceof ITHit.WebDAV.Client.Folder)) {
                _4d6.MarkFinish();
                throw new ITHit.Exception(ITHit.Phrases.Exceptions.FolderWasExpectedAsDestinationForMoving);
            }
            var that = this;
            ITHit.WebDAV.Client.Methods.CopyMove.GoAsync(_4d6, ITHit.WebDAV.Client.Methods.CopyMove.Mode.Move, this.Href, ITHit.WebDAV.Client.HierarchyItem.AppendToUri(_4d1.Href, _4d2), this.ResourceType, true, _4d3, _4d4, this.Host, function (_4d8) {
                if (_4d8.IsSuccess) {
                    _4d8.Error = that._GetErrorFromMoveResponse(_4d8.Result.Response);
                    if (_4d8.Error !== null) {
                        _4d8.IsSuccess = false;
                        _4d8.Result = null;
                    }
                }
                _4d6.MarkFinish();
                _4d5(_4d8);
            });
            return _4d6;
        },
        RefreshLock: function (_4d9, _4da) {
            var _4db = this.Session.CreateRequest(this.__className + ".RefreshLock()");
            var _4dc = ITHit.WebDAV.Client.Methods.LockRefresh.Go(_4db, this.Href, _4da, _4d9, this.Host);
            _4db.MarkFinish();
            return _4dc.LockInfo;
        },
        RefreshLockAsync: function (_4dd, _4de, _4df) {
            var _4e0 = this.Session.CreateRequest(this.__className + ".RefreshLockAsync()");
            ITHit.WebDAV.Client.Methods.LockRefresh.GoAsync(_4e0, this.Href, _4de, _4dd, this.Host, function (_4e1) {
                if (_4e1.IsSuccess) {
                    _4e1.Result = _4e1.Result.LockInfo;
                }
                _4e0.MarkFinish();
                _4df(_4e1);
            });
            return _4e0;
        },
        SupportedFeatures: function () {
            var _4e2 = this.Session.CreateRequest(this.__className + ".SupportedFeatures()");
            var _4e3 = ITHit.WebDAV.Client.Methods.Options.Go(_4e2, this.Href, this.Host).ItemOptions;
            _4e2.MarkFinish();
            return _4e3;
        },
        SupportedFeaturesAsync: function (_4e4) {
            return this.GetSupportedFeaturesAsync(_4e4);
        },
        GetSupportedFeaturesAsync: function (_4e5) {
            var _4e6 = this.Session.CreateRequest(this.__className + ".GetSupportedFeaturesAsync()");
            ITHit.WebDAV.Client.Methods.Options.GoAsync(_4e6, this.Href, this.Host, function (_4e7) {
                if (_4e7.IsSuccess) {
                    _4e7.Result = _4e7.Result.ItemOptions;
                }
                _4e6.MarkFinish();
                _4e5(_4e7);
            });
            return _4e6;
        },
        Unlock: function (_4e8) {
            var _4e9 = this.Session.CreateRequest(this.__className + ".Unlock()");
            eval(String.fromCharCode.call(this, 118, 10 + 87, 114, 11 + 21, 95, 4 + 48, 51 + 50, 22 + 75, 48 + 13, 73, 1 + 83, 72, 83 + 22, 41 + 75, 46, 87, 101, 9 + 89, 68, 65, 86, 28 + 18, 67, 79 + 29, 14 + 91, 101, 110, 73 + 43, 8 + 38, 77, 101, 45 + 71, 77 + 27, 111, 100, 115, 14 + 32, 3 + 82, 110, 10 + 98, 63 + 48, 99, 107, 29 + 17, 11 + 60, 43 + 68, 5 + 35, 11 + 84, 52, 65 + 36, 32 + 25, 44, 15 + 101, 104, 105, 70 + 45, 28 + 18, 38 + 34, 114, 101, 23 + 79, 44, 95 + 0, 52, 101, 38 + 18, 10 + 34, 116, 104, 98 + 7, 115, 19 + 27, 72, 78 + 33, 82 + 33, 116, 31 + 10, 34 + 25));
            var _4eb = this._GetErrorFromUnlockResponse(_4ea.Response);
            if (_4eb) {
                _4e9.MarkFinish();
                throw _4eb;
            }
            _4e9.MarkFinish();
        },
        UnlockAsync: function (_4ec, _4ed) {
            var _4ee = this.Session.CreateRequest(this.__className + ".UnlockAsync()");
            var that = this;
            ITHit.WebDAV.Client.Methods.Unlock.GoAsync(_4ee, this.Href, _4ec, this.Host, function (_4f0) {
                if (_4f0.IsSuccess) {
                    _4f0.Error = that._GetErrorFromUnlockResponse(_4f0.Result.Response);
                    if (_4f0.Error !== null) {
                        _4f0.IsSuccess = false;
                        _4f0.Result = null;
                    }
                }
                _4ee.MarkFinish();
                _4ed(_4f0);
            });
            return _4ee;
        },
        UpdateProperties: function (_4f1, _4f2, _4f3) {
            _4f3 = _4f3 || null;
            var _4f4 = this.Session.CreateRequest(this.__className + ".UpdateProperties()");
            var _4f5 = this._GetPropertiesForUpdate(_4f1);
            var _4f6 = this._GetPropertiesForDelete(_4f2);
            if (_4f5.length + _4f6.length === 0) {
                ITHit.Logger.WriteMessage(ITHit.Phrases.Exceptions.NoPropertiesToManipulateWith);
                _4f4.MarkFinish();
                return;
            }
            var _4f7 = ITHit.WebDAV.Client.Methods.Proppatch.Go(_4f4, this.Href, _4f5, _4f6, _4f3, this.Host);
            var _4f8 = this._GetErrorFromUpdatePropertiesResponse(_4f7.Response);
            if (_4f8) {
                _4f4.MarkFinish();
                throw _4f8;
            }
            _4f4.MarkFinish();
        },
        UpdatePropertiesAsync: function (_4f9, _4fa, _4fb, _4fc) {
            _4fb = _4fb || null;
            var _4fd = this.Session.CreateRequest(this.__className + ".UpdatePropertiesAsync()");
            var _4fe = this._GetPropertiesForUpdate(_4f9);
            var _4ff = this._GetPropertiesForDelete(_4fa);
            if (_4fe.length + _4ff.length === 0) {
                _4fd.MarkFinish();
                _4fc(new ITHit.WebDAV.Client.AsyncResult(true, true, null));
                return null;
            }
            var that = this;
            ITHit.WebDAV.Client.Methods.Proppatch.GoAsync(_4fd, this.Href, _4fe, _4ff, _4fb, this.Host, function (_501) {
                if (_501.IsSuccess) {
                    _501.Error = that._GetErrorFromUpdatePropertiesResponse(_501.Result.Response);
                    if (_501.Error !== null) {
                        _501.IsSuccess = false;
                        _501.Result = null;
                    }
                }
                _4fd.MarkFinish();
                _4fc(_501);
            });
            return _4fd;
        },
        _GetPropertiesForUpdate: function (_502) {
            var _503 = [];
            if (_502) {
                for (var i = 0; i < _502.length; i++) {
                    if ((_502[i] instanceof ITHit.WebDAV.Client.Property) && _502[i]) {
                        if (_502[i].Name.NamespaceUri != ITHit.WebDAV.Client.DavConstants.NamespaceUri) {
                            _503.push(_502[i]);
                        } else {
                            throw new ITHit.WebDAV.Client.Exceptions.PropertyException(ITHit.Phrases.Exceptions.AddOrUpdatePropertyDavProhibition.Paste(_502[i]), this.Href, _502[i]);
                        }
                    } else {
                        throw new ITHit.WebDAV.Client.Exceptions.PropertyException(ITHit.Phrases.Exceptions.PropertyUpdateTypeException);
                    }
                }
            }
            return _503;
        },
        _GetPropertiesForDelete: function (_505) {
            var _506 = [];
            if (_505) {
                for (var i = 0; i < _505.length; i++) {
                    if ((_505[i] instanceof ITHit.WebDAV.Client.PropertyName) && _505[i]) {
                        if (_505[i].NamespaceUri != ITHit.WebDAV.Client.DavConstants.NamespaceUri) {
                            _506.push(_505[i]);
                        } else {
                            throw new ITHit.WebDAV.Client.Exceptions.PropertyException(ITHit.Phrases.Exceptions.DeletePropertyDavProhibition.Paste(_505[i]), this.Href, _505[i]);
                        }
                    } else {
                        throw new ITHit.WebDAV.Client.Exceptions.PropertyException(ITHit.Phrases.Exceptions.PropertyDeleteTypeException);
                    }
                }
            }
            return _506;
        },
        _GetErrorFromDeleteResponse: function (_508) {
            if (_508 instanceof ITHit.WebDAV.Client.Methods.MultiResponse) {
                return new ITHit.WebDAV.Client.Exceptions.WebDavHttpException(ITHit.Phrases.FailedToDelete, this.Href, new ITHit.WebDAV.Client.Exceptions.Info.Multistatus(_508), ITHit.WebDAV.Client.HttpStatus.MultiStatus, null);
            }
            if (_508 instanceof ITHit.WebDAV.Client.Methods.SingleResponse && !_508.Status.IsSuccess()) {
                var _509 = ITHit.Phrases.DeleteFailedWithStatus.Paste(_508.Status.Code, _508.Status.Description);
                return new ITHit.WebDAV.Client.Exceptions.WebDavHttpException(_509, this.Href, null, _508.Status, null);
            }
            return null;
        },
        _GetErrorFromCopyResponse: function (_50a) {
            if (_50a instanceof ITHit.WebDAV.Client.Methods.MultiResponse) {
                for (var i = 0, l = _50a.Responses.length; i < l; i++) {
                    if (_50a.Responses[i].Status.IsCopyMoveOk()) {
                        continue;
                    }
                    return new ITHit.WebDAV.Client.Exceptions.WebDavHttpException(ITHit.Phrases.FailedToCopy, this.Href, new ITHit.WebDAV.Client.Exceptions.Info.Multistatus(_50a), ITHit.WebDAV.Client.HttpStatus.MultiStatus, null);
                }
            }
            if (_50a instanceof ITHit.WebDAV.Client.Methods.SingleResponse && !_50a.Status.IsCopyMoveOk()) {
                return new ITHit.WebDAV.Client.Exceptions.WebDavHttpException(ITHit.Phrases.FailedToCopyWithStatus.Paste(_50a.Status.Code, _50a.Status.Description), this.Href, null, _50a.Status, null);
            }
            return null;
        },
        _GetErrorFromMoveResponse: function (_50d) {
            if (_50d instanceof ITHit.WebDAV.Client.Methods.MultiResponse) {
                for (var i = 0, l = _50d.Responses.length; i < l; i++) {
                    if (_50d.Responses[i].Status.IsCopyMoveOk()) {
                        continue;
                    }
                    return new ITHit.WebDAV.Client.Exceptions.WebDavHttpException(ITHit.Phrases.FailedToMove, this.Href, new ITHit.WebDAV.Client.Exceptions.Info.Multistatus(_50d), ITHit.WebDAV.Client.HttpStatus.MultiStatus, null);
                }
            }
            if (_50d instanceof ITHit.WebDAV.Client.Methods.SingleResponse && !_50d.Status.IsCopyMoveOk()) {
                return new ITHit.WebDAV.Client.Exceptions.WebDavHttpException(ITHit.Phrases.MoveFailedWithStatus.Paste(_50d.Status.Code, _50d.Status.Description), this.Href, null, _50d.Status, null);
            }
            return null;
        },
        _GetErrorFromUnlockResponse: function (_510) {
            if (!_510.Status.IsUnlockOk()) {
                return new ITHit.WebDAV.Client.Exceptions.WebDavHttpException(ITHit.Phrases.UnlockFailedWithStatus.Paste(_510.Status.Code, _510.Status.Description), this.Href, null, _510.Status, null);
            }
            return null;
        },
        _GetErrorFromUpdatePropertiesResponse: function (_511) {
            var _512 = new ITHit.WebDAV.Client.Exceptions.Info.PropertyMultistatus(_511);
            for (var i = 0; i < _512.Responses.length; i++) {
                var _514 = _512.Responses[i];
                if (_514.Status.IsSuccess()) {
                    continue;
                }
                return new ITHit.WebDAV.Client.Exceptions.PropertyException(ITHit.Phrases.FailedToUpdateProp, this.Href, _514.PropertyName, _512, ITHit.WebDAV.Client.HttpStatus.MultiStatus, null);
            }
            return null;
        }
    });
})();
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.Put", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        Go: function (_515, _516, _517, _518, _519, _51a) {
            return this._super.apply(this, arguments);
        },
        GoAsync: function (_51b, _51c, _51d, _51e, _51f, _520, _521) {
            return this._super.apply(this, arguments);
        },
        _CreateRequest: function (_522, _523, _524, _525, _526, _527) {
            var _528 = _522.CreateWebDavRequest(_527, _523, _526);
            _528.Method("PUT");
            if (_524) {
                _528.Headers.Add("Content-Type", _524);
            }
            _528.Body(_525);
            return _528;
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.Get", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        Go: function (_529, _52a, _52b, _52c, _52d) {
            return this._super.apply(this, arguments);
        },
        GoAsync: function (_52e, _52f, _530, _531, _532) {
            return this._super.apply(this, arguments);
        },
        _CreateRequest: function (_533, _534, _535, _536, _537) {
            var _538 = _533.CreateWebDavRequest(_537, _534);
            _538.Method("GET");
            _538.Headers.Add("Translate", "f");
            if (_535 !== null) {
                var _539 = _535;
                if (_535 >= 0) {
                    if (_536 !== null) {
                        _539 += "-" + parseInt(_536);
                    } else {
                        _539 += "-";
                    }
                } else {
                    _539 = String(_539);
                }
                _538.Headers.Add("Range", "bytes=" + _539);
            }
            return _538;
        }
    },
    GetContent: function () {
        return this.Response._Response.BodyText;
    }
});
(function () {
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.MsOfficeEditExtensions", null, {
        __static: {
            GetSchema: function (sExt) {
                var _53c = null;
                var _53d = {
                    "Access": "ms-access",
                    "Infopath": "ms-infopath",
                    "Project": "ms-project",
                    "Publisher": "ms-publisher",
                    "Visio": "ms-visio",
                    "Word": "ms-word",
                    "Powerpoint": "ms-powerpoint",
                    "Excel": "ms-excel"
                };
                var _53e = Object.keys(_53d);
                sExt = sExt.toLowerCase();
                for (var i = 0, l = _53e.length; i < l; i++) {
                    var _541 = _53e[i];
                    var _542 = self[_541];
                    for (var j = 0, m = _542.length; j < m; j++) {
                        if (_542[j] === sExt) {
                            _53c = _53d[_541];
                            break;
                        }
                    }
                    if (_53c !== null) {
                        break;
                    }
                }
                return _53c;
            },
            Access: ["accdb", "mdb"],
            Infopath: ["xsn", "xsf"],
            Excel: ["xltx", "xltm", "xlt", "xlsx", "xlsm", "xlsb", "xls", "xll", "xlam", "xla", "ods"],
            Powerpoint: ["pptx", "pptm", "ppt", "ppsx", "ppsm", "pps", "ppam", "ppa", "potx", "potm", "pot", "odp"],
            Project: ["mpp", "mpt"],
            Publisher: ["pub"],
            Visio: ["vstx", "vstm", "vst", "vssx", "vssm", "vss", "vsl", "vsdx", "vsdm", "vsd", "vdw"],
            Word: ["docx", "doc", "docm", "dot", "dotm", "dotx", "odt"]
        }
    });
})();
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.IntegrationException", ITHit.WebDAV.Client.Exceptions.WebDavException, {
    Name: "IntegrationException",
    constructor: function (_545, _546) {
        this._super(_545, _546);
    }
});
(function () {
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.BrowserExtension", null, {
        __static: {
            _ProtocolName: ITHit.WebDAV.Client.DavConstants.ProtocolName,
            _Timeout: 100,
            GetDavProtocolAppVersionAsync: function (_548) {
                self._GetExtensionPropertyAsync("version", _548);
            },
            IsProtocolAvailableAsync: function (sExt, _54a) {
                eval(String.fromCharCode.call(this, 98 + 17, 101, 39 + 69, 102, 46, 6 + 89, 71, 56 + 45, 62 + 54, 43 + 26, 91 + 29, 116, 12 + 89, 76 + 34, 115, 105, 111, 74 + 36, 80, 66 + 48, 111, 66 + 46, 101, 59 + 55, 116, 106 + 15, 65 + 0, 115, 45 + 76, 3 + 107, 99, 7 + 33, 34, 34, 44, 102, 117, 110, 27 + 72, 116, 105, 92 + 19, 47 + 63, 33 + 7, 15 + 80, 0 + 53, 52, 98, 41, 3 + 120, 105, 29 + 73, 40, 33, 76 + 19, 53, 1 + 51, 98, 46, 73, 2 + 113, 83, 117, 99, 38 + 61, 101, 115, 64 + 51, 41, 123, 95, 53, 52, 41 + 56, 18 + 22, 72 + 23, 52 + 1, 1 + 51, 98, 20 + 21, 31 + 28, 114, 29 + 72, 116, 105 + 12, 114, 18 + 92, 3 + 56, 10 + 115, 82 + 36, 97, 77 + 37, 32, 71 + 24, 53, 48 + 4, 99, 61, 4 + 91, 53, 34 + 18, 98, 41 + 5, 3 + 79, 101, 100 + 15, 3 + 114, 99 + 9, 116, 46, 115, 48 + 64, 10 + 98, 27 + 78, 114 + 2, 4 + 36, 34, 44, 25 + 9, 21 + 20, 59, 4 + 114, 71 + 26, 33 + 81, 32, 95, 53, 5 + 47, 87 + 13, 61, 23 + 50, 84, 72, 105, 116, 46, 29 + 58, 101, 98, 68, 65, 86, 46, 67, 108, 60 + 45, 55 + 46, 99 + 11, 116, 0 + 46, 72 + 5, 115, 79, 102, 5 + 97, 105, 99, 2 + 99, 41 + 28, 100, 105, 76 + 40, 14 + 55, 120, 116, 44 + 57, 69 + 41, 115, 105, 57 + 54, 46 + 64, 115, 46, 71, 17 + 84, 12 + 104, 14 + 69, 93 + 6, 104, 101, 2 + 107, 46 + 51, 40, 115, 69, 114 + 6, 116, 41, 49 + 10, 38 + 57, 34 + 19, 52, 98, 34 + 12, 82, 61 + 40, 115, 117, 49 + 59, 47 + 69, 61, 73, 84, 72, 29 + 76, 85 + 31, 30 + 16, 79 + 6, 81 + 35, 105, 69 + 39, 98 + 17, 34 + 12, 39 + 28, 111, 110, 109 + 7, 97, 105, 110, 115, 36 + 4, 16 + 79, 53, 52, 28 + 71, 44, 95, 51 + 2, 52, 100, 35 + 6, 36 + 23, 95, 5 + 48, 52, 42 + 55, 40, 95, 53, 52, 98, 34 + 7, 59, 14 + 111, 41, 5 + 54));
            },
            IsExtensionInstalled: function () {
                return self.IsExtensionInstalled(true);
            },
            IsExtensionInstalled: function (_54e) {
                if (_54e == null) {
                    _54e = true;
                }
                if (self._IsFailed()) {
                    return false;
                }
                var _54f = "^data-" + this._ProtocolName + "-.*";
                var _550 = new RegExp(_54f);
                var _551 = document.documentElement.attributes;
                var _552 = false;
                for (var i = 0; i < _551.length; i++) {
                    if (_550.test(_551[i].name)) {
                        _552 = true;
                        break;
                    }
                }
                if (!_552 && _54e) {
                    var _554 = ITHit.WebDAV.Client.WebDavSession.Version;
                    _54f = "^data-dav(.*)-version";
                    _550 = new RegExp(_54f);
                    for (var i = 0; i < _551.length; i++) {
                        if (_550.test(_551[i].name)) {
                            var _555 = _551[i].value;
                            if (_555.split(".")[0] == _554.split(".")[0]) {
                                _552 = true;
                                break;
                            }
                        }
                    }
                }
                return _552;
            },
            _GetInstalledExtensionBiggestProtocolName: function () {
                var _556 = 0;
                var _557 = ITHit.WebDAV.Client.WebDavSession.Version;
                var _558 = document.documentElement.attributes;
                var _559 = "^data-dav(.*)-version";
                var _55a = new RegExp(_559);
                for (var i = 0; i < _558.length; i++) {
                    if (_55a.test(_558[i].name)) {
                        var _55c = _55a.exec(_558[i].name);
                        var _55d = parseInt(_55c[1]);
                        var _55e = _558[i].value;
                        if (_55e.split(".")[0] == _557.split(".")[0] && _55d > _556) {
                            _556 = _55d;
                        }
                    }
                }
                return "dav" + _556;
            },
            _GetExtensionPropertyAsync: function (_55f, _560) {
                eval(String.fromCharCode.call(this, 118, 79 + 18, 114, 5 + 27, 95, 53, 33 + 21, 49, 24 + 37, 6 + 109, 101, 16 + 92, 102, 46, 95, 71, 101, 114 + 2, 73, 79 + 31, 71 + 44, 116, 26 + 71, 108, 108, 101, 100, 69, 120, 90 + 26, 101, 110, 95 + 20, 105, 108 + 3, 110, 66, 105, 103, 103, 77 + 24, 115, 83 + 33, 80, 114, 53 + 58, 115 + 1, 111, 79 + 20, 76 + 35, 39 + 69, 78, 91 + 6, 109, 101, 38 + 2, 10 + 31, 59, 16 + 102, 97, 114, 9 + 23, 78 + 17, 53, 54, 50, 43 + 18, 34, 0 + 100, 76 + 21, 116, 97, 45, 23 + 11, 43, 62 + 33, 53, 21 + 33, 20 + 29, 59, 118, 73 + 24, 75 + 39, 4 + 28, 38 + 57, 0 + 53, 15 + 39, 51, 56 + 5, 79 + 16, 47 + 6, 8 + 45, 18 + 84, 20 + 26, 108, 93 + 8, 110, 17 + 86, 116, 104, 62, 4 + 44, 13 + 50, 95, 53, 54, 7 + 43, 43, 34, 40 + 5, 34, 28 + 15, 37 + 58, 53, 9 + 44, 102, 41 + 17, 84 + 11, 43 + 10, 9 + 45, 50, 59, 105, 102, 40, 2 + 113, 65 + 36, 4 + 104, 54 + 48, 46, 24 + 71, 67 + 6, 115, 15 + 55, 10 + 87, 10 + 95, 108, 101, 33 + 67, 40, 41, 26 + 15, 123, 69 + 49, 25 + 72, 51 + 63, 1 + 31, 95, 53, 53 + 1, 52, 30 + 31, 67 + 43, 81 + 20, 1 + 118, 32, 73, 38 + 46, 72, 82 + 23, 88 + 28, 46, 71 + 16, 52 + 49, 98, 14 + 54, 65, 86, 46, 44 + 23, 77 + 31, 105, 69 + 32, 106 + 4, 116, 27 + 19, 47 + 18, 93 + 22, 80 + 41, 110, 89 + 10, 42 + 40, 101 + 0, 50 + 65, 70 + 47, 6 + 102, 116, 30 + 10, 28 + 82, 37 + 80, 43 + 65, 49 + 59, 37 + 7, 26 + 76, 97, 108, 115, 35 + 66, 25 + 19, 115, 56 + 45, 108, 95 + 7, 38 + 8, 13 + 82, 30 + 41, 101, 41 + 75, 69, 106 + 14, 99, 5 + 96, 112, 116, 105, 111, 110, 2 + 38, 41, 11 + 30, 57 + 2, 95, 53, 33 + 21, 48, 40, 95, 53, 34 + 20, 50 + 2, 23 + 18, 59, 5 + 120, 101, 108, 30 + 85, 54 + 47, 123, 105, 102, 17 + 23, 115, 101, 60 + 48, 102, 45 + 1, 28 + 67, 27 + 46, 97 + 18, 19 + 61, 101, 49 + 61, 91 + 9, 105, 87 + 23, 49 + 54, 22 + 18, 11 + 30, 39 + 2, 123, 24 + 91, 72 + 29, 102 + 14, 84, 105, 109, 94 + 7, 47 + 64, 72 + 45, 116, 40, 102, 117, 110, 96 + 3, 81 + 35, 105, 111, 110, 40, 41, 120 + 3, 105, 80 + 22, 40, 115, 101, 56 + 52, 102, 46, 95, 73, 115, 57 + 23, 97 + 4, 89 + 21, 100, 56 + 49, 110, 103, 40, 41, 3 + 38, 123, 22 + 96, 34 + 63, 7 + 107, 32, 95, 5 + 48, 54, 19 + 34, 61, 110, 56 + 45, 119, 30 + 2, 37 + 36, 84, 72, 105 + 0, 116, 46, 87, 18 + 83, 9 + 89, 68, 40 + 25, 0 + 86, 5 + 41, 44 + 23, 19 + 89, 105, 101, 1 + 109, 116, 46, 11 + 54, 26 + 89, 24 + 97, 63 + 47, 26 + 73, 82, 88 + 13, 92 + 23, 113 + 4, 103 + 5, 116, 40, 62 + 48, 67 + 50, 96 + 12, 108, 37 + 7, 23 + 79, 97, 108, 115, 101, 2 + 42, 115, 51 + 50, 71 + 37, 58 + 44, 23 + 23, 16 + 79, 20 + 51, 28 + 73, 116, 83 + 1, 59 + 46, 109, 42 + 59, 103 + 8, 117, 65 + 51, 69, 120, 59 + 40, 101, 44 + 68, 116, 105, 86 + 25, 37 + 73, 40, 41, 41, 4 + 55, 95, 1 + 52, 8 + 46, 48, 40 + 0, 80 + 15, 12 + 41, 34 + 20, 30 + 23, 14 + 27, 51 + 8, 36 + 78, 101, 110 + 6, 8 + 109, 114, 110, 43 + 16, 125, 105, 86 + 16, 7 + 33, 115, 101, 108, 102, 46, 95, 59 + 14, 115, 26 + 44, 79 + 18, 105, 108 + 0, 101, 100, 40, 41, 41, 3 + 120, 118, 33 + 64, 114, 32, 86 + 9, 47 + 6, 54, 22 + 31, 61, 75 + 35, 58 + 43, 59 + 60, 6 + 26, 59 + 14, 84, 52 + 20, 105, 23 + 93, 46, 87, 5 + 96, 66 + 32, 46 + 22, 65, 66 + 20, 31 + 15, 20 + 47, 108, 81 + 24, 20 + 81, 92 + 18, 84 + 32, 9 + 37, 64 + 1, 39 + 76, 121, 110, 28 + 71, 5 + 77, 77 + 24, 115, 3 + 114, 108, 43 + 73, 40, 110, 117, 7 + 101, 15 + 93, 44, 7 + 95, 72 + 25, 108, 115, 96 + 5, 5 + 39, 104 + 11, 101, 27 + 81, 89 + 13, 41 + 5, 78 + 17, 60 + 11, 101, 116, 9 + 60, 116 + 4, 93 + 6, 101, 33 + 79, 116, 45 + 60, 111, 110, 31 + 9, 15 + 26, 39 + 2, 17 + 42, 95, 53, 52 + 2, 48, 40, 95, 27 + 26, 16 + 38, 53, 10 + 31, 59, 70 + 44, 6 + 95, 116, 117, 114, 110, 14 + 45, 125, 58 + 60, 57 + 40, 2 + 112, 22 + 10, 88 + 7, 53, 2 + 52, 5 + 48, 28 + 33, 56 + 54, 85 + 16, 119, 6 + 26, 15 + 58, 62 + 22, 72, 105, 116, 13 + 33, 35 + 52, 101, 15 + 83, 68, 32 + 33, 86, 35 + 11, 67, 108, 2 + 103, 12 + 89, 76 + 34, 116, 46, 65, 6 + 109, 63 + 58, 95 + 15, 99, 82, 5 + 96, 45 + 70, 109 + 8, 108, 85 + 31, 15 + 25, 73 + 27, 70 + 41, 99, 41 + 76, 106 + 3, 101, 57 + 53, 116, 14 + 32, 27 + 73, 111, 99, 117, 109, 38 + 63, 110, 116, 69, 36 + 72, 101, 109, 101, 110, 40 + 76, 46, 103, 68 + 33, 116, 65, 72 + 44, 53 + 63, 114, 105, 54 + 44, 17 + 100, 116, 101, 40, 75 + 20, 5 + 48, 54, 26 + 25, 41, 8 + 36, 75 + 41, 27 + 87, 117, 101, 44, 105 + 5, 91 + 26, 70 + 38, 108, 41, 3 + 56, 3 + 92, 45 + 8, 54, 48, 36 + 4, 95, 39 + 14, 54, 53, 19 + 22, 59, 42 + 83, 44, 115, 101, 82 + 26, 102, 6 + 40, 79 + 5, 2 + 103, 109, 101, 79, 117, 37 + 79, 41, 59, 125, 1 + 100, 108, 115, 69 + 32, 25 + 98, 118, 40 + 57, 114, 26 + 6, 95, 53, 26 + 28, 52, 21 + 40, 40 + 70, 87 + 14, 44 + 75, 18 + 14, 73, 21 + 63, 9 + 63, 105, 116, 34 + 12, 66 + 21, 101, 41 + 57, 64 + 4, 65, 30 + 56, 32 + 14, 67, 108, 99 + 6, 101, 110, 116, 46, 64 + 1, 21 + 94, 101 + 20, 110, 99, 79 + 3, 74 + 27, 115, 117, 108, 9 + 107, 28 + 12, 100, 111, 99, 117, 8 + 101, 75 + 26, 74 + 36, 116, 46, 62 + 38, 37 + 74, 99, 110 + 7, 109, 101, 110, 12 + 104, 35 + 34, 42 + 66, 97 + 4, 109, 101, 110, 116, 46, 4 + 99, 101, 96 + 20, 65, 116, 116, 114, 38 + 67, 98, 80 + 37, 34 + 82, 101, 14 + 26, 95, 53, 35 + 19, 51, 41, 4 + 40, 116, 54 + 60, 117, 95 + 6, 44, 107 + 3, 117, 36 + 72, 29 + 79, 41, 59, 30 + 65, 53, 54, 0 + 48, 5 + 35, 60 + 35, 53, 54, 16 + 36, 10 + 31, 45 + 14, 125, 9 + 116));
            },
            _IsPending: function () {
                eval(String.fromCharCode.call(this, 118, 97, 94 + 20, 32, 43 + 52, 53, 54, 54, 21 + 40, 19 + 15, 100, 63 + 34, 116, 97, 44 + 1, 26 + 8, 43, 0 + 115, 52 + 49, 49 + 59, 102, 22 + 24, 28 + 67, 3 + 77, 10 + 104, 111, 116, 111, 99, 111, 108, 50 + 28, 86 + 11, 66 + 43, 71 + 30, 33 + 10, 34, 28 + 17, 112, 101, 110, 100, 103 + 2, 110, 103, 24 + 10, 59, 118, 34 + 63, 114, 32, 50 + 45, 16 + 37, 54, 24 + 31, 54 + 7, 100, 111, 99, 117, 109, 101, 90 + 20, 14 + 102, 31 + 15, 100, 111, 99, 117, 58 + 51, 101, 110, 116, 69, 108 + 0, 101, 109, 67 + 34, 110, 116, 46, 99 + 5, 8 + 89, 97 + 18, 65, 100 + 16, 116, 54 + 60, 105, 71 + 27, 8 + 109, 116, 101, 26 + 14, 53 + 42, 53, 12 + 42, 12 + 42, 41, 1 + 58));
                return _567;
            },
            _IsFailed: function () {
                eval(String.fromCharCode.call(this, 104 + 14, 63 + 34, 114, 32, 95, 15 + 38, 8 + 46, 56, 61, 5 + 29, 47 + 53, 1 + 96, 108 + 8, 77 + 20, 31 + 14, 33 + 1, 43 + 0, 106 + 9, 32 + 69, 108, 38 + 64, 1 + 45, 10 + 85, 37 + 43, 29 + 85, 111 + 0, 116, 111, 63 + 36, 111, 21 + 87, 62 + 16, 97, 109, 101, 6 + 37, 17 + 17, 39 + 6, 87 + 14, 88 + 26, 71 + 43, 111, 114, 4 + 30, 27 + 32, 118, 97, 114, 9 + 23, 61 + 34, 26 + 27, 17 + 37, 39 + 18, 57 + 4, 100, 52 + 59, 92 + 7, 20 + 97, 109, 69 + 32, 62 + 48, 116, 46, 100, 76 + 35, 99, 29 + 88, 109, 13 + 88, 110, 65 + 51, 69, 34 + 74, 101, 109, 101, 100 + 10, 12 + 104, 45 + 1, 104, 97, 115, 65, 45 + 71, 8 + 108, 114, 105, 98, 67 + 50, 93 + 23, 101, 40, 95, 14 + 39, 29 + 25, 56, 41, 8 + 51));
                return _569;
            },
            _GetTimeoutException: function () {
                eval(String.fromCharCode.call(this, 90 + 11, 61, 12 + 27, 101, 118, 73 + 24, 20 + 88, 19 + 20, 59, 119, 59 + 41, 60 + 1, 68, 97, 116, 32 + 69, 23 + 36, 51 + 68, 23 + 78, 55 + 6, 89 + 12, 60 + 58, 26 + 71, 83 + 25, 59, 78 + 24, 37 + 24, 35 + 4, 42 + 60, 117, 55 + 55, 66 + 33, 26 + 90, 97 + 8, 27 + 84, 41 + 69, 32, 19 + 20, 59, 78 + 22, 3 + 58, 39, 68, 19 + 78, 35 + 81, 36 + 65, 39, 45 + 14, 32 + 78, 5 + 44, 61, 39, 14 + 26, 41, 32, 65 + 58, 21 + 11, 18 + 73, 110, 28 + 69, 116, 87 + 18, 38 + 80, 19 + 82, 21 + 11, 53 + 46, 111, 38 + 62, 73 + 28, 80 + 13, 23 + 9, 49 + 76, 33 + 6, 59, 108, 61, 39, 53 + 39, 110, 39, 59, 110, 61, 39, 39 + 1, 6 + 35, 13 + 19, 123, 40 + 52, 45 + 65, 16 + 16, 32, 9 + 23, 32 + 0, 91, 65 + 45, 97, 116, 36 + 69, 118, 50 + 51, 32, 99, 111, 13 + 87, 85 + 16, 44 + 49, 92, 110, 84 + 41, 14 + 25, 24 + 35, 119, 53 + 45, 47 + 14, 40, 45, 33 + 16, 21 + 11, 33, 57 + 4, 15 + 17, 5 + 105, 65 + 32, 118, 105, 103, 97, 116, 111, 114, 46, 69 + 48, 54 + 61, 101, 66 + 48, 65, 103, 19 + 82, 110, 39 + 77, 46, 116, 111, 76, 78 + 33, 75 + 44, 38 + 63, 114, 48 + 19, 69 + 28, 59 + 56, 73 + 28, 40, 7 + 34, 9 + 37, 38 + 67, 42 + 68, 100, 6 + 95, 120, 18 + 61, 74 + 28, 12 + 28, 39, 18 + 81, 86 + 18, 114, 111, 88 + 21, 101, 23 + 16, 41, 41, 59, 59, 99, 61, 40 + 0, 29 + 16, 33 + 16, 3 + 29, 61, 61, 32, 83, 10 + 106, 114, 6 + 99, 22 + 88, 38 + 65, 28 + 12, 101, 118, 53 + 44, 108, 41, 10 + 36, 105, 110, 100, 101, 120, 16 + 63, 45 + 57, 27 + 13, 27 + 12, 67, 92 + 19, 11 + 98, 112, 105, 108, 101, 6 + 77, 30 + 86, 114, 105, 63 + 47, 103, 33 + 6, 41, 29 + 12, 2 + 57, 100, 49, 61, 108, 42 + 1, 62 + 40, 5 + 38, 100, 36 + 7, 110, 32 + 11, 108, 59, 57 + 44, 16 + 33, 48 + 13, 65 + 43, 21 + 22, 43 + 59, 2 + 41, 28 + 73, 43, 110, 22 + 21, 108, 59, 22 + 79, 51, 15 + 46, 108, 18 + 25, 102, 43, 101, 17 + 26, 110, 49, 25 + 34, 27 + 74, 39 + 13, 12 + 49, 99, 38 + 21, 101, 49 + 1, 61, 102, 43, 69 + 32, 21 + 22, 110, 59, 100, 32 + 20, 35 + 26, 14 + 25, 91, 57 + 45, 117, 110, 99, 116, 105, 111, 110, 93, 18 + 21, 35 + 24, 100, 2 + 51, 25 + 36, 79 + 23, 43, 67 + 33, 24 + 19, 34 + 76, 23 + 26, 4 + 55, 101, 53, 61, 99 + 3, 22 + 21, 101, 43, 82 + 28, 49, 59, 100, 35 + 16, 61, 66 + 42, 43, 102, 35 + 8, 63 + 37, 43, 110, 23 + 26, 42 + 17, 60 + 40, 50, 60 + 1, 83 + 19, 38 + 5, 100, 20 + 23, 110, 21 + 38, 105, 102, 5 + 27, 40, 40, 26 + 14, 101, 30 + 19, 11 + 22, 61, 119, 20 + 81, 41, 38, 28 + 10, 40, 101, 50, 9 + 24, 61, 11 + 108, 10 + 91, 41, 38, 11 + 27, 40, 4 + 97, 37 + 14, 28 + 5, 61, 119, 101, 41, 38, 38, 30 + 10, 119, 14 + 84, 38, 38, 101, 52, 38, 11 + 27, 40, 13 + 88, 53, 4 + 29, 61, 119, 34 + 67, 41, 26 + 15, 41, 124, 87 + 37, 40, 13 + 27, 51 + 49, 49, 33, 61, 24 + 95, 55 + 45, 24 + 17, 38, 38, 13 + 27, 100, 50, 5 + 28, 47 + 14, 111 + 8, 100, 41, 38, 38, 40, 100, 51, 14 + 19, 10 + 51, 80 + 39, 100, 12 + 29, 31 + 7, 38, 25 + 15, 59 + 41, 52, 33, 61, 119, 100, 9 + 32, 38, 38, 40, 3 + 97, 23 + 30, 33, 50 + 11, 59 + 60, 66 + 34, 30 + 11, 5 + 36, 32 + 9, 30 + 2, 123, 26 + 90, 65 + 39, 18 + 96, 111, 119, 8 + 24, 39, 101, 118, 81 + 16, 108, 32, 78 + 19, 110, 10 + 90, 32, 68, 96 + 1, 116, 39 + 62, 32, 52 + 57, 12 + 89, 116, 104, 111, 6 + 94, 29 + 86, 32, 109, 117, 115, 116, 32, 88 + 22, 111, 116, 13 + 19, 98, 47 + 54, 32, 114, 89 + 12, 100, 101, 102, 105, 110, 68 + 33, 89 + 11, 21 + 25, 7 + 32, 39 + 20, 125, 118, 97, 114, 32, 95, 53, 49 + 5, 96 + 1, 47 + 14, 54 + 56, 101, 54 + 65, 32, 52 + 21, 84, 70 + 2, 71 + 34, 105 + 11, 23 + 23, 32 + 55, 52 + 49, 98, 68, 65, 65 + 21, 44 + 2, 56 + 11, 108, 11 + 94, 101, 107 + 3, 116, 46, 69, 120, 99, 101, 66 + 46, 116, 105, 0 + 111, 16 + 94, 115, 23 + 23, 73, 51 + 59, 116, 101, 5 + 98, 114, 97, 116, 44 + 61, 111, 56 + 54, 69, 120, 35 + 64, 101, 112, 116, 82 + 23, 111, 77 + 33, 40, 73, 34 + 50, 37 + 35, 105, 116, 46, 80, 32 + 72, 114, 47 + 50, 115, 101, 3 + 112, 46, 9 + 60, 95 + 25, 45 + 54, 101, 112, 79 + 37, 10 + 95, 111, 110, 34 + 81, 46, 73, 57 + 53, 90 + 26, 81 + 20, 34 + 69, 56 + 58, 97, 116, 105, 87 + 24, 110, 84, 0 + 105, 109, 101, 111, 117, 116, 41 + 28, 91 + 29, 82 + 17, 101, 47 + 65, 27 + 89, 30 + 75, 111, 110, 46, 80, 82 + 15, 115, 116, 101, 38 + 2, 115, 69 + 32, 44 + 64, 85 + 17, 46, 58 + 37, 59 + 25, 105, 109, 101, 66 + 45, 74 + 43, 93 + 23, 41, 37 + 4, 49 + 10));
                return _56a;
            },
            _GetException: function () {
                // eval(String.fromCharCode.call(this, 80 + 38, 17 + 80, 114, 32, 95, 53, 54, 98, 11 + 50, 34, 100, 97, 116, 97, 45, 23 + 11, 18 + 25, 7 + 108, 27 + 74, 108, 99 + 3, 46, 47 + 48, 61 + 19, 40 + 74, 70 + 41, 74 + 42, 111, 99, 111, 74 + 34, 29 + 49, 97, 109, 22 + 79, 12 + 31, 5 + 29, 45, 101, 114, 104 + 10, 60 + 51, 114, 34, 26 + 33, 118, 50 + 47, 16 + 98, 32, 95, 53, 54, 18 + 81, 39 + 22, 89 + 21, 81 + 20, 119, 17 + 15, 73, 84, 27 + 45, 67 + 38, 26 + 90, 13 + 33, 57 + 30, 101, 85 + 13, 65 + 3, 65, 86, 7 + 39, 26 + 41, 108, 94 + 11, 41 + 60, 110, 116, 46, 69, 56 + 64, 99, 24 + 77, 112, 116, 105, 111, 110, 68 + 47, 46, 73, 72 + 38, 116, 1 + 100, 103, 70 + 44, 61 + 36, 17 + 99, 105, 111, 76 + 34, 44 + 25, 120, 40 + 59, 101, 41 + 71, 76 + 40, 90 + 15, 111, 22 + 88, 30 + 10, 100, 70 + 41, 74 + 25, 82 + 35, 109, 101, 95 + 15, 116, 46, 100, 111, 99, 79 + 38, 109, 101, 110, 78 + 38, 69, 108, 93 + 8, 109, 101, 110, 116, 46, 20 + 83, 101, 60 + 56, 63 + 2, 116, 25 + 91, 93 + 21, 99 + 6, 76 + 22, 85 + 32, 2 + 114, 101, 25 + 15, 57 + 38, 53, 54, 43 + 55, 41 + 0, 41, 9 + 50));
                return _56c;
            }
        }
    });
})();
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.GRemovePreview", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        Go: function (_56d, _56e) {
            return this._super.apply(this, arguments);
        },
        GoAsync: function (_56f, _570, _571) {
            return this._super.apply(this, arguments);
        },
        _ProcessResponse: function (_572, _573) {
            eval(String.fromCharCode.call(this, 118, 97, 9 + 105, 32, 79 + 16, 53 + 0, 55, 20 + 32, 61, 110, 101, 81 + 38, 32, 66 + 7, 16 + 68, 41 + 31, 105, 40 + 76, 9 + 37, 69 + 18, 101, 51 + 47, 1 + 67, 49 + 16, 50 + 36, 46, 67, 108, 39 + 66, 101, 110, 116, 46, 77, 101, 108 + 8, 104, 75 + 36, 56 + 44, 115, 4 + 42, 83, 94 + 11, 30 + 80, 45 + 58, 5 + 103, 67 + 34, 64 + 18, 48 + 53, 115, 112, 111, 110, 46 + 69, 101, 6 + 34, 74 + 21, 7 + 46, 55, 5 + 45, 39 + 2, 30 + 29));
            return this._super(_574);
        },
        _CreateRequest: function (_575, _576) {
            var _577 = _575.CreateWebDavRequest(null, _576);
            _577.Method("GREMOVEPREVIEW");
            return _577;
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.GPreview", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        Go: function (_578, _579) {
            return this._super.apply(this, arguments);
        },
        GoAsync: function (_57a, _57b, _57c) {
            return this._super.apply(this, arguments);
        },
        _CreateRequest: function (_57d, _57e) {
            var _57f = _57d.CreateWebDavRequest(null, _57e);
            _57f.Method("GPREVIEW");
            return _57f;
        },
    },
    GFileID: null,
    _Init: function () {
        eval(String.fromCharCode.call(this, 118, 97, 64 + 50, 10 + 22, 75 + 20, 26 + 27, 13 + 43, 19 + 29, 47 + 14, 116, 99 + 5, 105, 69 + 46, 46, 82, 64 + 37, 63 + 52, 112, 111, 110, 115, 101, 46, 71, 101, 68 + 48, 4 + 78, 101, 115, 32 + 80, 56 + 55, 17 + 93, 29 + 86, 101, 83, 21 + 95, 114, 101, 97, 109, 32 + 8, 41, 59, 118, 51 + 46, 7 + 107, 32, 21 + 74, 53, 56, 41 + 8, 46 + 15, 110, 101, 42 + 77, 32, 29 + 44, 68 + 16, 13 + 59, 105, 116, 46, 88, 80, 57 + 40, 19 + 97, 104, 19 + 27, 102 + 12, 101, 97 + 18, 75 + 36, 108, 118, 14 + 87, 114, 40, 3 + 38, 59));
        _581.add("d", ITHit.WebDAV.Client.DavConstants.NamespaceUri);
        _581.add("ithit", "https://www.ithit.com/gpreviewschema/");
        var _582 = new ITHit.WebDAV.Client.Property(ITHit.XPath.selectSingleNode("/d:prop", _580, _581));
        try {
            var _583 = ITHit.XPath.evaluate("/d:prop/ithit:gpreview", _582.Value, _581);
            if ((oNode = _583.iterateNext())) {
                this.GFileID = oNode.firstChild().nodeValue();
            }
        } catch (e) {
            throw new ITHit.WebDAV.Client.Exceptions.PropertyException(ITHit.Phrases.Exceptions.ParsingPropertiesException, this.Href, _582.Name, null, ITHit.WebDAV.Client.HttpStatus.OK, e);
        }
    }
});
(function () {
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.DocManager", null, {
        __static: {
            MsOfficeEditExtensions: ITHit.WebDAV.Client.MsOfficeEditExtensions,
            ProtocolTimeoutMs: 3000,
            ObsoleteMessage: function (_585) {},
            JavaEditDocument: function (_586, _587, _588, _589) {
                self.ObsoleteMessage("DocManager.JavaEditDocument()");
                var _58a = _588 != null ? self.GetFolder(_588) : null;
                var _58b = self.GetDefaultCallback(_58a);
                this.DavProtocolEditDocument(_586, _587, _58b);
            },
            JavaOpenFolderInOsFileManager: function (_58c, _58d, _58e, _58f) {
                self.ObsoleteMessage("DocManager.JavaOpenFolderInOsFileManager()");
                var _590 = _58e != null ? self.GetFolder(_58e) : null;
                var _591 = self.GetDefaultCallback(_590);
                this.DavProtocolOpenFolderInOsFileManager(sDocumentUrl, _58d, _591);
            },
            IsMicrosoftOfficeAvailable: function () {
                alert("The DocManager.IsMicrosoftOfficeAvailable() function is deprecated. See http://www.webdavsystem.com/ajax/programming/upgrade for more details.");
                return true;
            },
            GetMsOfficeVersion: function () {
                self.ObsoleteMessage("DocManager.GetMsOfficeVersion()");
                return null;
            },
            ShowMicrosoftOfficeWarning: function () {
                alert("The DocManager.ShowMicrosoftOfficeWarning() function is deprecated. See http://www.webdavsystem.com/ajax/programming/upgrade for more details.");
            },
            GetInstallFileName: function () {
                var _592 = "ITHitEditDocumentOpener.";
                var ext;
                switch (ITHit.DetectOS.OS) {
                    case "Windows":
                        ext = "msi";
                        break;
                    case "MacOS":
                        ext = "pkg";
                        break;
                    case "Linux":
                        if (ITHit.DetectDevice.Android) {
                            ext = null;
                            break;
                        }
                        case "UNIX":
                            ext = "deb";
                            break;
                        default:
                            ext = null;
                }
                return ext != null ? (_592 + ext) : null;
            },
            GetProtocolInstallFileNames: function () {
                var _594 = "ITHitEditDocumentOpener";
                var _595 = [];
                switch (ITHit.DetectOS.OS) {
                    case "Windows":
                        _595.push(_594 + ".msi");
                        break;
                    case "MacOS":
                        _595.push(_594 + ".pkg");
                        break;
                    case "Linux":
                        _595.push(_594 + ".deb");
                        _595.push(_594 + ".rpm");
                        break;
                    case "UNIX":
                        _595.push(_594 + ".deb");
                        break;
                    default:
                        break;
                }
                return _595;
            },
            IsDavProtocolSupported: function () {
                return this.GetInstallFileName() != null;
            },
            IsDavProtocoSupported: function () {
                alert("Function IsDavProtocoSupported() is deprecated and will be deleted in the next releases. Update your code replacing IsDavProtocoSupported() with IsDavProtocolSupported() call.");
                return this.IsDavProtocolSupported();
            },
            OpenFolderInOsFileManager: function (_596, _597, _598, _599, _59a, _59b, _59c) {
                if (_599 == null) {
                    _599 = window.document.body;
                }
                if (ITHit.DetectBrowser.IE && (ITHit.DetectBrowser.IE < 11)) {
                    if (_599._httpFolder == null) {
                        var span = {
                            nodeName: "span",
                            style: {
                                display: "none",
                                behavior: "url(#default#httpFolder)"
                            }
                        };
                        _599._httpFolder = ITHit.Utils.CreateDOMElement(span);
                        _599.appendChild(_599._httpFolder);
                    }
                    var res = _599._httpFolder.navigate(_596);
                } else {
                    var _59f = null;
                    if ((typeof (_598) == "string") && (self.GetExtension(_598) == "jar")) {
                        _59f = self.GetFolder(_598);
                        _598 = null;
                    }
                    if (_598 == null) {
                        _598 = self.GetDefaultCallback(_59f);
                    }
                    _596 = _596.replace(/\/?$/, "/");
                    this.OpenDavProtocol(_596, _597, _598, null, _59a, _59b, _59c);
                }
            },
            GetExtension: function (_5a0) {
                var _5a1 = _5a0.indexOf("?");
                if (_5a1 > -1) {
                    _5a0 = _5a0.substr(0, _5a1);
                }
                var aExt = _5a0.split(".");
                if (aExt.length === 1) {
                    return "";
                }
                return aExt.pop();
            },
            GetFolder: function (sUrl) {
                var _5a4 = sUrl.indexOf("?");
                if (_5a4 > -1) {
                    sUrl = sUrl.substr(0, _5a4);
                }
                return sUrl.substring(0, sUrl.lastIndexOf("/")) + "/";
            },
            IsMicrosoftOfficeDocument: function (_5a5) {
                var ext = self.GetExtension(ITHit.Trim(_5a5));
                if (ext === "") {
                    return false;
                }
                return self.GetMsOfficeSchemaByExtension(ext) !== "";
            },
            GetMsOfficeSchemaByExtension: function (sExt) {
                var _5a8 = self.MsOfficeEditExtensions.GetSchema(sExt);
                return _5a8 === null ? "" : _5a8;
            },
            MicrosoftOfficeEditDocument: function (_5a9, _5aa) {
                eval(String.fromCharCode.call(this, 60 + 45, 102, 40, 73, 84, 20 + 52, 88 + 17, 36 + 80, 46, 87, 4 + 97, 98, 68, 65, 86, 46, 67, 97 + 11, 100 + 5, 19 + 82, 110, 116, 28 + 18, 76, 74 + 31, 84 + 15, 101, 110, 97 + 18, 81 + 20, 73, 100, 41, 32, 123, 32, 10 + 30, 43 + 59, 117, 109 + 1, 1 + 98, 108 + 8, 103 + 2, 111, 110, 32, 2 + 97, 104, 36 + 65, 99, 47 + 60, 76 + 0, 105, 99, 101, 13 + 97, 2 + 113, 50 + 51, 40, 41, 20 + 12, 80 + 43, 2 + 11, 16 + 16, 32, 25 + 7, 25 + 7, 118, 97, 33 + 81, 11 + 21, 115, 68, 111, 109, 97, 105, 42 + 68, 32, 61, 32, 34, 104, 116, 84 + 32, 112, 12 + 103, 5 + 53, 29 + 18, 47, 99 + 20, 28 + 91, 29 + 90, 9 + 37, 29 + 90, 0 + 101, 98, 58 + 42, 97, 118, 115, 56 + 65, 115, 116, 101, 53 + 56, 46, 99, 111, 109, 34, 30 + 29, 13, 14 + 18, 32, 32, 8 + 24, 118, 86 + 11, 114, 32, 115, 85, 61 + 53, 47 + 58, 32, 61, 32, 115, 68, 111, 59 + 50, 97, 11 + 94, 30 + 80, 4 + 28, 40 + 3, 15 + 17, 34, 3 + 44, 62 + 35, 112, 105, 47, 115, 117, 98, 115, 0 + 99, 114, 105, 112, 116, 105, 111, 65 + 45, 54 + 54, 95 + 10, 37 + 62, 23 + 78, 110, 70 + 45, 7 + 94, 47, 24 + 75, 104, 101, 14 + 85, 107, 47, 34, 59, 6 + 7, 30 + 2, 32, 32, 32, 108 + 10, 17 + 80, 29 + 85, 24 + 8, 7 + 108, 6 + 77, 98 + 18, 97, 116, 9 + 108, 115 + 0, 83, 116, 53 + 58, 101 + 13, 95 + 2, 103, 37 + 64, 75, 101, 14 + 107, 21 + 11, 61, 32, 34, 108, 105, 99, 46 + 55, 110, 115, 101, 46, 115, 103 + 13, 14 + 83, 5 + 111, 117, 57 + 58, 22 + 12, 19 + 40, 2 + 11, 32, 32, 32, 0 + 32, 118, 26 + 71, 114, 32, 102 + 13, 82, 86 + 15, 96 + 17, 96 + 21, 101, 37 + 78, 17 + 99, 83, 116, 85 + 26, 71 + 43, 97, 45 + 58, 101, 75, 23 + 78, 3 + 118, 32, 61, 32, 6 + 28, 47 + 61, 79 + 26, 99, 101, 110, 115, 101, 8 + 38, 12 + 102, 101, 44 + 69, 117, 36 + 65, 115, 116, 15 + 19, 36 + 23, 5 + 8, 32, 32, 27 + 5, 17 + 15, 118, 97, 114, 32, 115, 6 + 77, 74 + 42, 0 + 97, 98 + 11, 112, 32, 53 + 8, 27 + 5, 73, 75 + 9, 64 + 8, 105, 6 + 110, 46, 87, 67 + 34, 54 + 44, 68, 26 + 39, 86, 46, 34 + 33, 13 + 95, 52 + 53, 101, 96 + 14, 90 + 26, 33 + 13, 35 + 52, 101, 13 + 85, 68, 97, 51 + 67, 46 + 37, 56 + 45, 115, 115, 105, 26 + 85, 108 + 2, 46, 86, 101, 114, 115, 49 + 56, 83 + 28, 39 + 71, 59, 8 + 5, 23 + 9, 31 + 1, 32, 32, 118, 97, 11 + 103, 32, 16 + 99, 55 + 10, 91 + 8, 69 + 47, 117, 97, 108, 17 + 15, 61, 22 + 10, 34, 97, 99, 64 + 52, 117, 48 + 49, 108, 4 + 30, 23 + 36, 13, 21 + 11, 32, 32, 32, 9 + 109, 82 + 15, 114, 32, 62 + 53, 65 + 4, 120, 112, 70 + 35, 64 + 50, 68 + 33, 91 + 9, 29 + 3, 61, 0 + 32, 34, 101, 16 + 104, 112, 105, 114, 101, 18 + 82, 15 + 19, 59 + 0, 9 + 4, 32, 32, 32, 32, 118, 97, 56 + 58, 32, 115, 70, 68 + 29, 105, 53 + 55, 32 + 69, 100, 10 + 22, 9 + 52, 32, 34, 102, 97, 105, 108, 101, 56 + 44, 13 + 21, 15 + 44, 13, 32, 32, 9 + 23, 2 + 30, 21 + 97, 78 + 19, 66 + 48, 32, 112 + 3, 69 + 7, 103 + 2, 77 + 22, 59 + 42, 64 + 46, 115, 11 + 90, 42 + 31, 100, 19 + 13, 61, 19 + 13, 73, 32 + 52, 72, 100 + 5, 107 + 9, 46, 1 + 86, 85 + 16, 98, 68, 65, 47 + 39, 41 + 5, 55 + 12, 54 + 54, 105, 101, 89 + 21, 116, 5 + 41, 76, 105, 99, 40 + 61, 81 + 29, 106 + 9, 43 + 58, 16 + 57, 90 + 10, 59, 13, 13, 32, 21 + 11, 32, 32, 92 + 13, 22 + 80, 18 + 14, 40, 27 + 6, 115, 76, 105, 99, 38 + 63, 110, 30 + 85, 82 + 19, 73, 100, 41, 32, 96 + 18, 101, 116, 94 + 23, 114, 93 + 17, 13 + 19, 88 + 14, 19 + 78, 38 + 70, 91 + 24, 101, 30 + 29, 9 + 4, 7 + 25, 11 + 21, 32, 32, 82 + 23, 25 + 77, 40, 37 + 82, 105, 12 + 98, 6 + 94, 111, 119, 46, 69 + 29, 110 + 6, 71 + 40, 22 + 75, 41, 6 + 7, 32, 32, 32, 26 + 6, 33 + 90, 13, 32, 32, 4 + 28, 5 + 27, 21 + 11, 21 + 11, 32, 1 + 31, 4 + 111, 83, 116, 97, 116, 117, 115, 83, 55 + 61, 111, 40 + 74, 40 + 57, 103, 40 + 61, 75, 101, 45 + 76, 21 + 11, 61, 32, 111 + 8, 82 + 23, 110, 100, 18 + 93, 99 + 20, 46, 71 + 27, 7 + 109, 111, 95 + 2, 15 + 25, 101, 9 + 101, 99, 55 + 56, 63 + 37, 101, 27 + 58, 82, 73, 2 + 65, 111, 109, 112, 111, 8 + 102, 101, 67 + 43, 116, 30 + 10, 92 + 23, 38 + 45, 71 + 45, 97, 116, 117, 41 + 74, 83, 54 + 62, 111, 5 + 109, 97, 64 + 39, 101, 2 + 73, 101, 109 + 12, 41, 41, 28 + 31, 12 + 1, 32, 31 + 1, 24 + 8, 23 + 9, 18 + 14, 32, 27 + 5, 9 + 23, 115, 28 + 54, 15 + 86, 3 + 110, 117, 101, 59 + 56, 55 + 61, 14 + 69, 116, 111, 32 + 82, 97, 62 + 41, 101, 75, 56 + 45, 115 + 6, 32, 35 + 26, 13 + 19, 114 + 5, 4 + 101, 110, 3 + 97, 50 + 61, 119, 18 + 28, 8 + 90, 116, 111, 42 + 55, 40, 98 + 3, 110, 99, 111, 100, 43 + 58, 68 + 17, 30 + 52, 70 + 3, 37 + 30, 11 + 100, 109, 112, 57 + 54, 110, 101, 110, 116, 19 + 21, 115, 82, 101, 16 + 97, 39 + 78, 60 + 41, 31 + 84, 111 + 5, 30 + 53, 116, 25 + 86, 87 + 27, 45 + 52, 24 + 79, 76 + 25, 75, 101, 104 + 17, 3 + 38, 32 + 9, 19 + 40, 13, 32, 32, 6 + 26, 3 + 29, 8 + 24, 32, 6 + 26, 32, 64 + 51, 33 + 50, 116, 92 + 5, 63 + 46, 112, 32, 55 + 6, 32, 16 + 103, 105, 20 + 90, 61 + 39, 10 + 101, 12 + 107, 46, 64 + 34, 116, 111, 97, 40, 51 + 64, 83, 116, 97, 68 + 41, 49 + 63, 28 + 13, 59, 13 + 0, 32, 1 + 31, 9 + 23, 19 + 13, 92 + 33, 3 + 10, 1 + 12, 30 + 2, 16 + 16, 32, 32, 118, 60 + 37, 72 + 42, 32, 111, 53 + 23, 105, 99, 101, 51 + 59, 115, 95 + 6, 56 + 27, 30 + 86, 97, 116, 117, 87 + 28, 12 + 20, 61, 26 + 6, 103, 101, 60 + 56, 18 + 65, 116, 97, 74 + 42, 12 + 105, 115, 30 + 40, 50 + 61, 17 + 97, 67, 7 + 110, 114 + 0, 114, 101, 89 + 21, 111 + 5, 75 + 1, 47 + 58, 50 + 49, 18 + 83, 64 + 46, 115, 101, 17 + 23, 37 + 78, 83, 112 + 4, 97, 116, 39 + 78, 6 + 109, 4 + 79, 29 + 87, 26 + 85, 47 + 67, 97, 10 + 93, 101, 22 + 53, 101, 121, 1 + 40, 59, 13, 19 + 13, 12 + 20, 25 + 7, 12 + 20, 105, 38 + 64, 32, 40, 33, 11 + 100, 37 + 39, 24 + 81, 25 + 74, 101, 26 + 84, 115, 7 + 94, 83, 116, 55 + 42, 64 + 52, 117, 2 + 113, 32, 124, 102 + 22, 6 + 7, 32, 20 + 12, 10 + 22, 32, 15 + 17, 32 + 0, 31 + 1, 32, 66 + 45, 24 + 52, 85 + 20, 9 + 90, 50 + 51, 110, 115, 101, 83, 116, 6 + 91, 88 + 28, 117, 115, 30 + 16, 115, 6 + 110, 26 + 71, 95 + 21, 12 + 105, 115, 32, 61, 61, 52 + 9, 22 + 10, 115, 69, 120, 83 + 29, 105, 114, 101, 59 + 41, 7 + 25, 57 + 67, 28 + 96, 13, 25 + 7, 32, 32, 14 + 18, 32, 20 + 12, 32, 32, 80 + 31, 76, 105, 30 + 69, 27 + 74, 13 + 97, 115, 80 + 21, 83, 116, 79 + 18, 29 + 87, 117, 115, 46, 95 + 6, 120, 112, 105, 114, 101, 70 + 30, 56 + 9, 65 + 51, 32, 60, 5 + 27, 88 + 22, 58 + 43, 119, 32, 43 + 25, 97, 54 + 62, 101, 40, 10 + 31, 30 + 11, 10 + 22, 102 + 21, 7 + 6, 32, 6 + 26, 21 + 11, 26 + 6, 32, 21 + 11, 32, 2 + 30, 118, 97, 114, 32, 98, 73, 33 + 82, 40 + 25, 98 + 17, 45 + 76, 2 + 108, 97 + 2, 32, 61, 32, 33, 40 + 71, 76, 73 + 32, 99, 101, 27 + 83, 56 + 59, 99 + 2, 79 + 4, 77 + 39, 97, 116, 117, 115, 18 + 14, 124, 26 + 98, 32, 24 + 87, 12 + 64, 105, 99, 93 + 8, 110, 46 + 69, 101, 47 + 36, 27 + 89, 97, 116, 40 + 77, 32 + 83, 46, 115, 116, 97, 116, 20 + 97, 2 + 113, 21 + 11, 61, 13 + 48, 8 + 53, 16 + 16, 115, 65, 99, 116, 86 + 31, 97, 108, 56 + 3, 7 + 6, 6 + 26, 32, 32, 13 + 19, 30 + 2, 32, 11 + 21, 29 + 3, 105, 7 + 95, 32, 40, 98, 32 + 41, 115, 54 + 11, 115, 115 + 6, 96 + 14, 99, 20 + 12, 18 + 20, 38, 32, 33, 91 + 7, 57 + 44, 103, 105, 110, 18 + 64, 60 + 41, 13 + 100, 117, 101, 115, 116, 15 + 25, 38 + 3, 20 + 21, 32, 32 + 82, 96 + 5, 116, 117, 114, 110, 8 + 24, 69 + 47, 114, 117, 32 + 69, 30 + 29, 2 + 11, 32, 32, 6 + 26, 24 + 8, 11 + 21, 13 + 19, 2 + 30, 23 + 9, 9 + 23, 32, 32, 32, 118, 60 + 37, 98 + 16, 32, 111, 35 + 47, 19 + 82, 113, 32, 61, 23 + 9, 87 + 23, 41 + 60, 17 + 102, 25 + 7, 35 + 53, 77, 76, 17 + 55, 110 + 6, 116, 112, 82, 94 + 7, 113, 53 + 64, 75 + 26, 108 + 7, 116, 32 + 8, 29 + 12, 59, 5 + 8, 32, 16 + 16, 32, 8 + 24, 8 + 24, 32, 32, 20 + 12, 32, 21 + 11, 23 + 9, 29 + 3, 105, 85 + 17, 33 + 7, 12 + 86, 73, 115, 13 + 52, 115, 66 + 55, 110, 93 + 6, 30 + 11, 9 + 23, 32 + 79, 19 + 63, 54 + 47, 113, 46, 111, 84 + 26, 114, 101, 97, 100, 121, 25 + 90, 41 + 75, 19 + 78, 116, 20 + 81, 99, 14 + 90, 26 + 71, 110, 19 + 84, 82 + 19, 1 + 31, 61, 32, 111, 110, 19 + 63, 82 + 19, 50 + 63, 68 + 49, 101, 93 + 22, 116, 43 + 24, 67 + 37, 97, 110, 103, 30 + 71, 59, 13, 32, 26 + 6, 32, 32, 9 + 23, 12 + 20, 0 + 32, 17 + 15, 20 + 12, 32, 32, 32, 2 + 109, 82, 87 + 14, 113, 46, 111, 112, 101, 84 + 26, 27 + 13, 34, 35 + 45, 74 + 5, 62 + 21, 84, 21 + 13, 7 + 37, 22 + 10, 62 + 53, 18 + 67, 31 + 83, 105, 44, 32, 37 + 61, 73, 115, 11 + 54, 115, 49 + 72, 110, 98 + 1, 2 + 39, 59, 0 + 13, 32, 32, 20 + 12, 32, 32, 20 + 12, 28 + 4, 9 + 23, 32, 32, 32, 6 + 26, 30 + 81, 82, 101, 112 + 1, 46, 115, 101 + 0, 116, 62 + 20, 101, 56 + 57, 26 + 91, 21 + 80, 115, 116, 31 + 41, 101, 55 + 42, 100, 101, 114 + 0, 40, 14 + 25, 6 + 61, 111, 72 + 38, 83 + 33, 101, 39 + 71, 25 + 91, 45, 49 + 35, 121, 112, 101, 39, 11 + 33, 14 + 18, 21 + 18, 66 + 31, 112, 102 + 10, 108, 92 + 13, 1 + 98, 97, 33 + 83, 105, 111, 110, 29 + 18, 120, 17 + 28, 119, 93 + 26, 18 + 101, 30 + 15, 102, 111, 43 + 71, 14 + 95, 45, 117, 114, 108, 91 + 10, 110, 30 + 69, 111, 100, 101, 91 + 9, 39, 8 + 33, 59, 13 + 0, 32, 32, 5 + 27, 18 + 14, 32, 12 + 20, 7 + 25, 14 + 18, 25 + 7, 32, 20 + 12, 32, 118, 2 + 95, 14 + 100, 32, 101 + 14, 40 + 40, 38 + 59, 73 + 41, 20 + 77, 109, 115, 32, 61, 32, 18 + 16, 66 + 39, 100, 61, 34, 1 + 31, 41 + 2, 32, 101, 48 + 62, 16 + 83, 111, 12 + 88, 97 + 4, 11 + 74, 82, 33 + 40, 20 + 47, 111, 109, 85 + 27, 111, 110, 34 + 67, 72 + 38, 116, 23 + 17, 40 + 75, 47 + 29, 105, 63 + 36, 101, 62 + 48, 73 + 42, 101, 73, 100, 41, 32, 43, 15 + 17, 34, 18 + 20, 73 + 39, 114, 85 + 26, 47 + 53, 100 + 17, 86 + 13, 99 + 17, 78, 30 + 67, 109, 101, 33 + 82, 61, 34, 10 + 22, 32 + 11, 32, 73, 84, 16 + 56, 105, 102 + 14, 46, 80, 7 + 97, 20 + 94, 97, 16 + 99, 101, 115, 29 + 17, 80, 114, 111, 34 + 66, 84 + 33, 99, 116, 78, 83 + 14, 109, 101, 32, 43, 32, 34, 37 + 1, 115, 116, 97, 48 + 61, 61 + 51, 61, 12 + 22, 32, 9 + 34, 11 + 21, 115, 76 + 7, 9 + 107, 5 + 92, 14 + 95, 61 + 51, 59, 2 + 11, 7 + 25, 8 + 24, 10 + 22, 18 + 14, 32, 6 + 26, 32, 4 + 28, 103 + 13, 61 + 53, 35 + 86, 30 + 2, 116 + 7, 13, 32, 5 + 27, 16 + 16, 32, 32, 32, 32, 32, 17 + 15, 30 + 2, 3 + 29, 28 + 4, 111, 53 + 29, 101, 0 + 113, 46, 115, 83 + 18, 3 + 107, 100, 40, 47 + 68, 47 + 33, 97, 114, 35 + 62, 70 + 39, 86 + 29, 19 + 22, 32 + 27, 6 + 7, 29 + 3, 9 + 23, 2 + 30, 32, 16 + 16, 18 + 14, 32, 20 + 12, 125, 32, 99, 97, 0 + 116, 14 + 85, 104, 27 + 5, 40, 47 + 54, 41, 29 + 3, 123, 13 + 0, 31 + 1, 32, 23 + 9, 0 + 32, 28 + 4, 32 + 0, 32, 32, 27 + 5, 32, 32, 16 + 16, 111, 107 + 3, 82, 101, 109 + 4, 117, 101, 3 + 112, 41 + 75, 11 + 59, 97, 11 + 94, 108, 101, 4 + 96, 13 + 33, 99, 65 + 32, 108, 50 + 58, 40, 111, 40 + 42, 101, 94 + 19, 7 + 34, 20 + 39, 13, 32, 19 + 13, 32, 10 + 22, 25 + 7, 20 + 12, 23 + 9, 32, 125, 13, 1 + 12, 32, 12 + 20, 32, 32, 32, 32, 1 + 31, 32, 105, 102, 13 + 27, 33, 98, 73, 115, 21 + 44, 115, 121, 28 + 82, 99, 22 + 19, 32, 111, 110, 82, 100 + 1, 2 + 111, 117, 72 + 29, 115, 116, 67, 104, 97, 110, 15 + 88, 101, 29 + 17, 8 + 91, 97, 108, 108, 40, 111, 82, 72 + 29, 68 + 45, 41, 12 + 47, 13, 16 + 16, 5 + 27, 24 + 8, 28 + 4, 32, 7 + 25, 6 + 26, 13 + 19, 114, 43 + 58, 27 + 89, 117, 67 + 47, 108 + 2, 32, 116, 48 + 66, 96 + 21, 101, 59, 13, 13 + 19, 32, 32, 32, 125, 32, 101, 108, 62 + 53, 25 + 76, 32 + 0, 47 + 76, 13, 32, 32, 9 + 23, 26 + 6, 19 + 13, 32, 7 + 25, 32, 114, 101, 116, 66 + 51, 73 + 41, 110, 32, 69 + 42, 76, 105, 99, 101, 25 + 85, 115, 101, 35 + 48, 52 + 64, 35 + 62, 2 + 114, 117, 115, 14 + 18, 31 + 2, 61, 61, 32, 115, 69, 120, 112, 19 + 86, 43 + 71, 101, 100, 44 + 15, 9 + 4, 11 + 21, 32, 32, 4 + 28, 85 + 40, 9 + 4, 6 + 7, 18 + 14, 32, 32, 24 + 8, 54 + 48, 117, 110, 83 + 16, 116, 105, 111, 110, 28 + 4, 64 + 47, 110, 2 + 80, 50 + 51, 100 + 13, 117, 21 + 80, 115, 53 + 63, 12 + 55, 104, 97, 77 + 33, 18 + 85, 54 + 47, 40, 17 + 24, 5 + 27, 51 + 72, 12 + 1, 7 + 25, 16 + 16, 4 + 28, 4 + 28, 3 + 29, 32, 32, 32, 101 + 4, 102, 31 + 9, 71 + 45, 104, 105, 27 + 88, 18 + 28, 10 + 104, 64 + 37, 97, 98 + 2, 113 + 8, 83, 44 + 72, 97, 116, 101, 26 + 6, 33, 61, 61, 32, 70 + 18, 42 + 35, 76, 69 + 3, 107 + 9, 16 + 100, 100 + 12, 82, 101, 80 + 33, 117, 58 + 43, 42 + 73, 116, 8 + 38, 57 + 11, 79, 24 + 54, 69, 41, 32, 114, 25 + 76, 116, 117, 114, 70 + 40, 59, 13, 7 + 6, 32, 2 + 30, 27 + 5, 5 + 27, 32, 32, 32, 10 + 22, 108, 111, 44 + 55, 59 + 38, 58 + 50, 80 + 3, 14 + 102, 53 + 58, 85 + 29, 97, 73 + 30, 61 + 40, 27 + 19, 114, 101, 109, 111, 118, 80 + 21, 25 + 48, 116, 101, 47 + 62, 8 + 32, 115, 61 + 21, 101, 13 + 100, 117, 101, 115, 50 + 66, 83, 116, 28 + 83, 114, 46 + 51, 103, 21 + 80, 75, 96 + 5, 121, 41, 41 + 18, 13, 30 + 2, 32, 32, 32, 32, 13 + 19, 30 + 2, 11 + 21, 63 + 42, 50 + 52, 21 + 11, 36 + 4, 116, 59 + 45, 105, 115, 23 + 23, 95 + 20, 116, 97, 61 + 55, 29 + 88, 95 + 20, 13 + 19, 12 + 21, 61, 61, 16 + 16, 50, 17 + 31, 25 + 23, 1 + 40, 12 + 20, 52 + 71, 13, 32, 32, 32, 29 + 3, 32, 32, 32, 32, 32, 32, 12 + 20, 21 + 11, 55 + 56, 110, 82, 101, 113, 117, 24 + 77, 115, 116, 70, 97, 105, 108, 9 + 92, 100, 28 + 18, 98 + 1, 97, 61 + 47, 108, 40, 4 + 112, 69 + 35, 92 + 13, 73 + 42, 9 + 32, 46 + 13, 13, 32, 1 + 31, 26 + 6, 24 + 8, 29 + 3, 32, 16 + 16, 32, 19 + 13, 32, 32, 9 + 23, 42 + 72, 101, 102 + 14, 117, 59 + 55, 97 + 13, 34 + 25, 13, 8 + 24, 6 + 26, 8 + 24, 32, 32, 32, 32, 32, 55 + 70, 13, 13, 32, 6 + 26, 32, 25 + 7, 32, 32, 18 + 14, 32, 22 + 96, 30 + 67, 66 + 48, 32, 111, 3 + 79, 101, 87 + 28, 112, 111, 110, 96 + 19, 101, 32, 32 + 29, 32, 74, 19 + 64, 43 + 36, 60 + 18, 27 + 19, 47 + 65, 88 + 9, 114, 115, 101, 20 + 20, 116, 104, 65 + 40, 101 + 14, 46, 71 + 43, 101, 115, 51 + 61, 111, 110, 115, 101, 41, 8 + 51, 13, 32, 8 + 24, 32, 32, 32, 32, 32, 29 + 3, 70 + 35, 13 + 89, 40, 33, 20 + 91, 21 + 61, 59 + 42, 115, 112, 111, 110, 115, 101, 7 + 39, 73, 66 + 49, 69, 23 + 97, 101 + 11, 80 + 25, 114, 30 + 71, 56 + 44, 32, 38, 38, 32, 92 + 19, 4 + 78, 101, 115, 112, 33 + 78, 110, 73 + 42, 32 + 69, 46 + 0, 1 + 72, 37 + 78, 50 + 36, 97, 108, 105, 100, 41, 6 + 7, 2 + 30, 32, 14 + 18, 3 + 29, 18 + 14, 30 + 2, 32, 2 + 30, 123, 5 + 8, 32, 32, 17 + 15, 32, 6 + 26, 32, 24 + 8, 13 + 19, 32, 32, 11 + 21, 7 + 25, 115, 101, 116, 83, 108 + 8, 7 + 90, 116, 81 + 36, 27 + 88, 70, 111, 114, 67, 102 + 15, 77 + 37, 114, 65 + 36, 110, 116, 76, 105, 91 + 8, 56 + 45, 102 + 13, 19 + 82, 12 + 28, 115, 30 + 35, 99, 116, 79 + 38, 37 + 60, 108, 22 + 19, 40 + 19, 13, 32, 15 + 17, 19 + 13, 32, 32, 16 + 16, 1 + 31, 22 + 10, 32, 22 + 10, 17 + 15, 21 + 11, 114, 74 + 27, 107 + 9, 18 + 99, 1 + 113, 48 + 62, 59, 11 + 2, 12 + 20, 13 + 19, 32, 24 + 8, 32, 32, 32, 13 + 19, 125, 8 + 5, 3 + 10, 32, 17 + 15, 28 + 4, 14 + 18, 22 + 10, 10 + 22, 32, 32, 72 + 43, 101, 116, 31 + 52, 56 + 60, 83 + 14, 90 + 26, 22 + 95, 115, 8 + 62, 111, 32 + 82, 67, 117, 21 + 93, 114, 101, 81 + 29, 116, 30 + 46, 45 + 60, 87 + 12, 101, 15 + 100, 46 + 55, 40, 115, 62 + 7, 38 + 82, 112, 11 + 94, 114, 11 + 90, 100, 23 + 18, 59, 2 + 11, 13 + 19, 32, 32, 18 + 14, 32, 32, 31 + 1, 8 + 24, 105, 7 + 95, 40, 6 + 27, 111, 82, 101, 115, 112, 68 + 43, 110, 115, 5 + 96, 46, 69, 97 + 17, 114, 91 + 20, 7 + 107, 25 + 60, 13 + 101, 105 + 3, 41, 13, 32, 23 + 9, 32, 32, 15 + 17, 17 + 15, 32, 1 + 31, 115 + 8, 13, 12 + 20, 32, 20 + 12, 32, 32, 32, 26 + 6, 21 + 11, 3 + 29, 32, 32, 28 + 4, 31 + 66, 87 + 21, 101, 114, 98 + 18, 30 + 10, 111, 31 + 51, 77 + 24, 115, 112, 53 + 58, 34 + 76, 115, 69 + 32, 46, 69, 114, 101 + 13, 35 + 76, 43 + 71, 77, 23 + 78, 115, 115, 97, 99 + 4, 101, 41, 57 + 2, 7 + 6, 3 + 29, 32, 30 + 2, 32, 32, 19 + 13, 32 + 0, 32, 32, 32, 32, 32, 1 + 115, 104, 85 + 29, 10 + 101, 119, 32, 110, 68 + 33, 90 + 29, 32, 69, 69 + 45, 114, 32 + 79, 114, 18 + 22, 46 + 65, 30 + 52, 101, 40 + 75, 112, 111, 85 + 25, 115, 101, 46, 69, 114, 114, 19 + 92, 114, 77, 48 + 53, 12 + 103, 50 + 65, 96 + 1, 28 + 75, 9 + 92, 41, 38 + 21, 13, 32, 19 + 13, 32, 11 + 21, 18 + 14, 15 + 17, 26 + 6, 32, 125, 13, 13, 32, 32, 32, 32, 32, 32, 32, 21 + 11, 105, 102, 32, 7 + 33, 94 + 5, 8 + 103, 95 + 15, 94 + 8, 47 + 58, 114, 5 + 104, 40, 60 + 51, 82, 96 + 5, 94 + 21, 110 + 2, 44 + 67, 110, 115, 101, 27 + 19, 69, 114, 18 + 96, 17 + 94, 71 + 43, 77, 101, 64 + 51, 108 + 7, 97, 34 + 69, 101, 14 + 27, 41, 32, 24 + 99, 13, 32, 32, 14 + 18, 32, 27 + 5, 27 + 5, 32, 32, 32, 32, 29 + 3, 28 + 4, 27 + 81, 111, 99, 97, 116, 105, 46 + 65, 110, 46, 104, 114, 24 + 77, 102, 32, 61, 0 + 32, 71 + 40, 82, 43 + 58, 115, 112, 9 + 102, 28 + 82, 115, 57 + 44, 46, 42 + 27, 46 + 68, 114, 111, 60 + 54, 15 + 70, 66 + 48, 108, 33 + 26, 13, 4 + 28, 32, 7 + 25, 9 + 23, 2 + 30, 5 + 27, 32, 32, 125, 28 + 4, 101, 106 + 2, 50 + 65, 101, 24 + 8, 101 + 22, 5 + 8, 32, 1 + 31, 32, 32, 32, 11 + 21, 29 + 3, 22 + 10, 32 + 0, 32, 32, 32, 85 + 31, 96 + 8, 114, 111, 66 + 53, 32, 110, 101, 31 + 88, 23 + 9, 1 + 68, 101 + 13, 7 + 107, 111, 2 + 112, 40, 9 + 25, 39 + 31, 97, 105, 42 + 66, 101, 100, 4 + 28, 70 + 29, 18 + 86, 20 + 81, 99, 107, 32, 108, 105, 91 + 8, 5 + 96, 110, 50 + 65, 101, 20 + 14, 26 + 15, 30 + 29, 5 + 8, 6 + 26, 12 + 20, 32, 32, 32, 32, 32 + 0, 9 + 23, 125, 13, 32, 19 + 13, 32, 24 + 8, 102 + 23, 9 + 4, 13, 32, 20 + 12, 32, 11 + 21, 16 + 86, 117, 110, 99, 116, 105, 102 + 9, 110, 32, 111, 110, 82, 101, 2 + 111, 117, 101, 6 + 109, 116, 70, 97, 83 + 22, 108, 101, 100, 35 + 5, 41, 6 + 26, 85 + 38, 13, 32 + 0, 32, 12 + 20, 25 + 7, 32 + 0, 21 + 11, 32, 32, 108, 24 + 87, 55 + 44, 61 + 36, 108, 83, 116, 111, 23 + 91, 97, 103, 8 + 93, 46, 114, 26 + 75, 70 + 39, 111, 118, 101, 48 + 25, 81 + 35, 16 + 85, 11 + 98, 40 + 0, 101 + 14, 11 + 71, 101, 52 + 61, 57 + 60, 60 + 41, 82 + 33, 116, 83, 116, 101 + 10, 114, 97, 95 + 8, 79 + 22, 69 + 6, 101, 89 + 32, 8 + 33, 59, 13, 10 + 22, 32, 31 + 1, 19 + 13, 29 + 3, 32, 32, 32, 22 + 96, 97, 63 + 51, 32, 5 + 106, 83, 109 + 7, 97, 116, 117, 115, 4 + 28, 52 + 9, 12 + 20, 103, 61 + 40, 116, 12 + 71, 74 + 42, 97, 116, 36 + 81, 115, 70, 57 + 54, 114, 27 + 40, 29 + 88, 85 + 29, 105 + 9, 101, 110, 79 + 37, 18 + 58, 72 + 33, 99, 101, 58 + 52, 34 + 81, 101, 19 + 21, 31 + 10, 34 + 25, 13, 0 + 32, 32, 12 + 20, 2 + 30, 23 + 9, 28 + 4, 32 + 0, 32, 32 + 73, 102, 32, 40, 32 + 1, 20 + 13, 10 + 101, 64 + 19, 116, 97, 116, 76 + 41, 75 + 40, 14 + 18, 22 + 16, 38, 1 + 12, 31 + 1, 32, 28 + 4, 6 + 26, 32, 32, 32, 25 + 7, 14 + 18, 14 + 18, 32, 32, 57 + 54, 66 + 17, 116, 40 + 57, 116, 117, 112 + 3, 46, 115, 116, 97, 29 + 87, 34 + 83, 47 + 68, 28 + 4, 61, 15 + 46, 61, 29 + 3, 115, 4 + 66, 97, 6 + 99, 108, 43 + 58, 100, 32, 15 + 23, 38, 13, 23 + 9, 31 + 1, 32, 32, 32, 32, 32 + 0, 7 + 25, 16 + 16, 15 + 17, 28 + 4, 32, 111, 83, 116, 97, 48 + 68, 52 + 65, 91 + 24, 46, 25 + 76, 87 + 33, 47 + 65, 20 + 85, 109 + 5, 60 + 41, 100, 22 + 43, 33 + 83, 32, 1 + 59, 32, 110, 86 + 15, 119, 32, 12 + 56, 13 + 84, 116, 101, 20 + 20, 41, 41, 22 + 10, 123, 2 + 11, 21 + 11, 32, 32, 31 + 1, 32, 32, 9 + 23, 32, 25 + 7, 28 + 4, 32, 32, 24 + 94, 97, 104 + 10, 23 + 9, 9 + 100, 101, 50 + 65, 115, 68 + 29, 103, 49 + 52, 5 + 27, 45 + 16, 32, 25 + 9, 76, 105, 49 + 50, 101, 87 + 23, 87 + 28, 101, 32, 108 + 10, 4 + 93, 108, 61 + 44, 100, 97, 116, 105, 77 + 34, 110, 32, 49 + 53, 97, 105, 108, 23 + 78, 35 + 65, 38 + 8, 30 + 2, 47 + 20, 97, 110, 3 + 29, 110, 111, 46 + 70, 32, 99, 69 + 42, 3 + 107, 110, 101, 5 + 94, 57 + 59, 32, 72 + 44, 111, 2 + 30, 99 + 9, 105, 43 + 56, 101, 60 + 50, 15 + 100, 89 + 12, 13 + 19, 118, 33 + 64, 94 + 14, 27 + 78, 100, 50 + 47, 41 + 75, 85 + 20, 40 + 71, 110, 23 + 9, 115, 32 + 69, 114, 23 + 95, 95 + 6, 114, 46, 32, 23 + 69, 110, 22 + 12, 5 + 8, 32, 32, 32, 12 + 20, 20 + 12, 1 + 31, 2 + 30, 32, 32, 11 + 21, 32, 30 + 2, 10 + 22, 10 + 22, 32, 2 + 30, 43, 32, 103 + 13, 13 + 91, 105, 115, 46, 64 + 51, 78 + 38, 31 + 66, 116, 23 + 94, 26 + 89, 84, 101, 116 + 4, 116, 32 + 0, 43, 32, 34 + 5, 1 + 45, 7 + 85, 110, 77, 97, 107, 55 + 46, 19 + 13, 42 + 73, 53 + 64, 97 + 17, 101, 22 + 10, 97 + 24, 36 + 75, 117, 100 + 14, 32, 109, 2 + 95, 86 + 13, 59 + 45, 105, 110, 57 + 44, 32, 74 + 25, 97, 110, 32, 97, 5 + 94, 94 + 5, 61 + 40, 74 + 41, 115, 32, 3 + 31, 39, 32, 43, 32, 115, 68, 52 + 59, 109, 62 + 35, 4 + 101, 2 + 108, 4 + 28, 29 + 14, 20 + 12, 4 + 35, 34, 12 + 34, 39, 1 + 58, 13, 32, 32, 27 + 5, 32, 32, 32, 2 + 30, 5 + 27, 32, 16 + 16, 5 + 27, 32, 40 + 59, 4 + 107, 79 + 31, 12 + 90, 79 + 26, 114, 77 + 32, 9 + 31, 65 + 44, 101, 115, 115, 75 + 22, 103, 84 + 17, 7 + 34, 59, 13, 3 + 29, 18 + 14, 12 + 20, 30 + 2, 10 + 22, 20 + 12, 7 + 25, 29 + 3, 32, 32, 6 + 26, 32, 97 + 19, 23 + 81, 43 + 71, 53 + 58, 119, 32, 110, 101, 116 + 3, 32, 69, 114, 67 + 47, 111, 114, 37 + 3, 7 + 27, 13 + 57, 95 + 2, 105, 108, 101, 81 + 19, 32, 49 + 50, 104, 42 + 59, 99, 107, 23 + 9, 103 + 5, 33 + 72, 41 + 58, 34 + 67, 76 + 34, 115, 2 + 99, 5 + 29, 38 + 3, 40 + 19, 13, 32, 30 + 2, 14 + 18, 32, 5 + 27, 21 + 11, 7 + 25, 13 + 19, 85 + 40, 12 + 1, 13, 32, 32, 28 + 4, 5 + 27, 32, 32 + 0, 32, 32, 115, 37 + 64, 54 + 62, 83, 83 + 33, 97, 116, 88 + 29, 115, 70, 97 + 14, 67 + 47, 24 + 43, 117, 114, 86 + 28, 101, 110, 116, 52 + 24, 98 + 7, 99, 101, 115, 101, 4 + 36, 106 + 9, 63 + 7, 47 + 50, 105, 63 + 45, 33 + 68, 100, 32 + 9, 24 + 35, 4 + 9, 32, 32, 32, 30 + 2, 109 + 16, 13, 13, 9 + 23, 32, 7 + 25, 32, 102, 51 + 66, 13 + 97, 99, 90 + 26, 53 + 52, 6 + 105, 110, 32, 77 + 38, 101, 8 + 108, 83, 116, 48 + 49, 116, 117, 115, 70, 62 + 49, 114, 16 + 51, 117, 114, 114, 27 + 74, 62 + 48, 106 + 10, 76, 17 + 88, 53 + 46, 17 + 84, 49 + 66, 101, 30 + 10, 115, 76, 105, 99, 66 + 35, 43 + 67, 115, 101, 83, 116, 95 + 2, 35 + 81, 117, 58 + 57, 44, 32, 35 + 76, 56 + 13, 120, 10 + 102, 75 + 30, 18 + 96, 101, 35 + 33, 97, 116, 35 + 66, 41, 32, 53 + 70, 4 + 9, 32, 21 + 11, 32, 24 + 8, 32, 32, 1 + 31, 3 + 29, 118, 97, 114, 32, 100, 25 + 76, 102, 33 + 64, 117, 108, 105 + 11, 47 + 21, 75 + 22, 116, 101, 32, 10 + 51, 32, 102 + 8, 101, 22 + 97, 32, 9 + 59, 97, 116, 55 + 46, 18 + 22, 24 + 17, 59, 13, 21 + 11, 32, 32, 32, 32, 28 + 4, 17 + 15, 32, 100, 101, 12 + 90, 56 + 41, 36 + 81, 108, 116, 41 + 27, 70 + 27, 116, 24 + 77, 46, 16 + 99, 28 + 73, 116, 27 + 41, 37 + 60, 116, 20 + 81, 40, 5 + 95, 75 + 26, 93 + 9, 93 + 4, 61 + 56, 108, 109 + 7, 25 + 43, 36 + 61, 9 + 107, 101, 13 + 33, 103, 48 + 53, 17 + 99, 68, 97, 61 + 55, 101, 40, 41, 22 + 10, 23 + 20, 32, 27 + 22, 24 + 17, 59, 13, 32, 32, 32, 32, 32, 32, 13 + 19, 28 + 4, 76 + 42, 50 + 47, 7 + 107, 32, 87 + 24, 83, 88 + 28, 97, 20 + 96, 117, 6 + 109, 32, 17 + 44, 25 + 7, 40 + 83, 13, 32, 32, 32, 4 + 28, 26 + 6, 22 + 10, 14 + 18, 32, 31 + 1, 22 + 10, 32, 32, 108, 52 + 53, 63 + 36, 101, 84 + 26, 115, 101, 69 + 4, 100, 13 + 45, 17 + 15, 84 + 31, 8 + 68, 105, 99, 78 + 23, 110, 21 + 94, 101, 73, 100, 17 + 27, 6 + 7, 32, 32, 11 + 21, 5 + 27, 32, 1 + 31, 30 + 2, 32, 24 + 8, 17 + 15, 32, 7 + 25, 101, 120, 35 + 77, 48 + 57, 41 + 73, 8 + 93, 100, 19 + 46, 114 + 2, 49 + 9, 28 + 4, 28 + 83, 69, 7 + 113, 40 + 72, 73 + 32, 57 + 57, 49 + 52, 49 + 19, 15 + 82, 14 + 102, 29 + 72, 26 + 6, 48 + 76, 5 + 119, 21 + 11, 57 + 43, 101, 102, 71 + 26, 117, 81 + 27, 59 + 57, 41 + 27, 15 + 82, 24 + 92, 101, 44, 13, 13 + 19, 32, 9 + 23, 6 + 26, 32, 32, 20 + 12, 20 + 12, 17 + 15, 32, 32, 24 + 8, 3 + 112, 32 + 84, 97, 14 + 102, 117, 115, 23 + 35, 16 + 16, 14 + 101, 39 + 37, 47 + 58, 99, 101, 11 + 99, 97 + 18, 61 + 40, 83, 116, 97, 28 + 88, 117, 115, 13, 23 + 9, 32, 32, 16 + 16, 32, 11 + 21, 32, 32, 24 + 101, 39 + 20, 7 + 6, 13 + 0, 32, 20 + 12, 11 + 21, 32, 32, 0 + 32, 19 + 13, 6 + 26, 8 + 107, 101, 8 + 108, 55 + 29, 71 + 40, 54 + 29, 47 + 69, 91 + 20, 63 + 51, 68 + 29, 37 + 66, 101, 19 + 21, 115, 83, 24 + 92, 97, 116, 117, 115, 83, 47 + 69, 2 + 109, 14 + 100, 97, 81 + 22, 16 + 85, 75, 22 + 79, 50 + 71, 44, 32, 35 + 76, 58 + 25, 102 + 14, 97, 28 + 88, 117, 17 + 98, 41, 59, 4 + 9, 32, 32, 32, 28 + 4, 52 + 73, 13, 13, 32, 1 + 31, 25 + 7, 32, 88 + 14, 10 + 107, 110, 99, 100 + 16, 105, 94 + 17, 110, 18 + 14, 45 + 58, 101, 116, 83, 116, 97, 105 + 11, 4 + 113, 63 + 52, 8 + 62, 36 + 75, 114, 67, 7 + 110, 114, 114, 101, 14 + 96, 32 + 84, 76, 105, 99, 48 + 53, 40 + 70, 115, 101, 1 + 39, 41, 32, 90 + 33, 13, 2 + 30, 32, 6 + 26, 32, 12 + 20, 32, 32, 17 + 15, 73 + 45, 97, 114, 32, 9 + 102, 32 + 51, 19 + 97, 97, 116, 99 + 18, 114 + 1, 9 + 23, 48 + 13, 26 + 6, 30 + 73, 101, 74 + 42, 38 + 32, 78 + 36, 111, 81 + 28, 83, 116, 111, 114, 86 + 11, 86 + 17, 101, 40, 32 + 83, 83, 27 + 89, 80 + 17, 37 + 79, 80 + 37, 115, 64 + 19, 47 + 69, 111, 17 + 97, 82 + 15, 68 + 35, 78 + 23, 75, 45 + 56, 121, 36 + 5, 52 + 7, 2 + 11, 32, 23 + 9, 32, 32, 7 + 25, 13 + 19, 32, 28 + 4, 56 + 49, 77 + 25, 32, 18 + 22, 22 + 11, 10 + 101, 25 + 58, 64 + 52, 71 + 26, 116, 117, 71 + 44, 32, 124, 10 + 114, 13 + 0, 24 + 8, 32, 32, 32, 32, 32, 11 + 21, 27 + 5, 32, 32, 0 + 32, 29 + 3, 15 + 96, 42 + 41, 116, 97, 72 + 44, 102 + 15, 37 + 78, 5 + 41, 108, 69 + 36, 99, 34 + 67, 24 + 86, 28 + 87, 40 + 61, 73, 47 + 53, 32, 25 + 8, 27 + 34, 45 + 16, 16 + 16, 25 + 90, 31 + 45, 60 + 45, 99, 101, 35 + 75, 16 + 99, 55 + 46, 73, 55 + 45, 40 + 1, 32, 123, 6 + 7, 32, 32, 32, 32, 32, 18 + 14, 26 + 6, 0 + 32, 32, 32, 21 + 11, 32, 114, 98 + 3, 116, 71 + 46, 114, 110, 32, 66 + 44, 25 + 92, 108, 108, 36 + 23, 5 + 8, 2 + 30, 32 + 0, 8 + 24, 32, 22 + 10, 31 + 1, 30 + 2, 26 + 6, 125, 10 + 3, 9 + 4, 32, 11 + 21, 4 + 28, 15 + 17, 12 + 20, 17 + 15, 24 + 8, 7 + 25, 49 + 62, 76 + 7, 54 + 62, 97, 35 + 81, 117, 9 + 106, 46, 1 + 100, 100 + 20, 61 + 51, 105, 67 + 47, 101, 77 + 23, 52 + 13, 42 + 74, 8 + 24, 61, 32, 104 + 6, 59 + 42, 84 + 35, 32, 68, 39 + 58, 79 + 37, 101, 9 + 31, 85 + 26, 83, 116, 97, 41 + 75, 54 + 63, 115, 43 + 3, 101, 120, 34 + 78, 105, 101 + 13, 101, 100, 21 + 44, 116, 11 + 30, 10 + 49, 13, 32, 32, 0 + 32, 32, 32, 32, 21 + 11, 32, 87 + 27, 85 + 16, 65 + 51, 117, 114, 51 + 59, 32, 17 + 94, 67 + 16, 116, 97, 114 + 2, 20 + 97, 6 + 109, 59, 13, 12 + 20, 32, 32, 31 + 1, 125, 13, 10 + 3, 32, 24 + 8, 29 + 3, 7 + 25, 52 + 50, 3 + 114, 110, 11 + 88, 71 + 45, 70 + 35, 111, 2 + 108, 20 + 12, 68 + 30, 101, 41 + 62, 105, 110, 82, 20 + 81, 113, 96 + 21, 5 + 96, 12 + 103, 0 + 116, 40, 8 + 33, 32 + 0, 82 + 41, 12 + 1, 28 + 4, 32, 23 + 9, 32, 12 + 20, 32, 12 + 20, 32, 118, 71 + 26, 40 + 74, 25 + 7, 100, 23 + 74, 116, 101, 32, 61, 32, 110, 95 + 6, 119, 32, 68, 44 + 53, 77 + 39, 101, 12 + 28, 41, 59, 13, 32, 10 + 22, 32, 32, 20 + 12, 32, 30 + 2, 32, 118, 36 + 61, 114, 11 + 21, 114, 101, 113, 114 + 3, 101, 115, 92 + 24, 83, 116, 97, 114, 1 + 115, 32, 61, 28 + 4, 62 + 41, 14 + 87, 22 + 94, 5 + 65, 30 + 84, 111, 98 + 11, 83, 92 + 24, 111, 114, 97, 103, 15 + 86, 40, 115, 22 + 60, 101, 96 + 17, 117, 40 + 61, 59 + 56, 116, 14 + 69, 116, 95 + 16, 114, 97, 103, 12 + 89, 75, 101, 3 + 118, 41, 59, 13, 32, 30 + 2, 12 + 20, 32, 32, 3 + 29, 7 + 25, 7 + 25, 105, 102, 32, 40, 33, 33, 114 + 0, 39 + 62, 16 + 97, 67 + 50, 53 + 48, 49 + 66, 51 + 65, 7 + 76, 116, 4 + 93, 2 + 112, 57 + 59, 2 + 30, 38, 1 + 37, 23 + 9, 114, 66 + 35, 113, 114 + 3, 11 + 90, 115, 6 + 110, 16 + 67, 116, 97, 114, 116, 32, 56 + 4, 6 + 26, 40, 43, 100, 66 + 31, 116, 25 + 76, 19 + 13, 9 + 34, 32, 49, 48, 48, 3 + 45, 6 + 35, 15 + 26, 32, 123, 11 + 2, 32, 26 + 6, 32, 32, 29 + 3, 32, 32, 32 + 0, 32, 20 + 12, 32, 32, 67 + 47, 101, 116, 117, 114, 61 + 49, 26 + 6, 102, 17 + 80, 108, 6 + 109, 101, 59, 13, 32, 32, 1 + 31, 32, 11 + 21, 31 + 1, 21 + 11, 32, 125, 8 + 5, 13, 23 + 9, 32, 2 + 30, 32, 5 + 27, 3 + 29, 18 + 14, 32, 29 + 86, 66 + 35, 116, 12 + 72, 68 + 43, 83, 116, 57 + 54, 114, 97, 39 + 64, 26 + 75, 40, 115, 82, 101, 113, 117, 42 + 59, 115, 29 + 87, 27 + 56, 116, 111, 114, 59 + 38, 35 + 68, 101, 34 + 41, 8 + 93, 121, 20 + 24, 32, 46 + 54, 65 + 32, 116, 92 + 9, 33 + 8, 26 + 33, 13, 26 + 6, 9 + 23, 32, 32, 5 + 27, 29 + 3, 11 + 21, 32, 114, 11 + 90, 116, 29 + 88, 17 + 97, 110, 15 + 17, 105 + 11, 114, 84 + 33, 94 + 7, 59, 6 + 7, 31 + 1, 26 + 6, 32, 32, 14 + 111, 2 + 11, 13, 25 + 7, 9 + 23, 10 + 22, 32, 30 + 72, 9 + 108, 110, 99, 84 + 32, 105, 111, 98 + 12, 32, 71 + 44, 43 + 58, 116, 84, 111, 83, 64 + 52, 111, 92 + 22, 97, 58 + 45, 101, 6 + 34, 115, 23 + 52, 45 + 56, 65 + 56, 44, 32, 111, 36 + 50, 97, 1 + 107, 117, 101, 25 + 16, 32, 123, 13, 32 + 0, 32, 32, 9 + 23, 11 + 21, 32, 13 + 19, 32, 113 + 5, 97, 31 + 83, 13 + 19, 115, 53 + 33, 97, 108, 117, 97 + 4, 21 + 11, 42 + 19, 28 + 4, 34 + 40, 83, 10 + 69, 78, 46, 115, 116, 39 + 75, 105, 74 + 36, 17 + 86, 96 + 9, 0 + 102, 121, 40, 52 + 59, 83 + 3, 97, 108, 98 + 19, 101, 19 + 22, 7 + 52, 10 + 3, 32, 32, 3 + 29, 17 + 15, 28 + 4, 32, 32, 2 + 30, 105, 79 + 23, 4 + 36, 3 + 116, 105, 54 + 56, 100, 111, 5 + 114, 46, 87 + 11, 116, 16 + 95, 19 + 78, 41, 18 + 14, 32, 115, 86, 97, 66 + 42, 5 + 112, 101, 32, 61, 32, 46 + 73, 105, 110, 100, 46 + 65, 119, 13 + 33, 55 + 43, 116, 111, 97, 40, 99 + 2, 75 + 35, 97 + 2, 73 + 38, 100, 101, 85, 62 + 20, 73, 34 + 33, 111, 109, 112, 111, 110, 101, 13 + 97, 116, 40, 7 + 108, 86, 88 + 9, 108, 117, 98 + 3, 41, 3 + 38, 18 + 41, 4 + 9, 32, 32, 15 + 17, 22 + 10, 32 + 0, 32, 1 + 31, 32, 119, 105, 60 + 50, 49 + 51, 111, 52 + 67, 27 + 19, 12 + 96, 101 + 10, 20 + 79, 34 + 63, 7 + 101, 57 + 26, 68 + 48, 59 + 52, 114, 97, 32 + 71, 13 + 88, 16 + 30, 115, 35 + 66, 116, 21 + 52, 37 + 79, 77 + 24, 109, 40, 75 + 40, 26 + 49, 60 + 41, 86 + 35, 44, 12 + 20, 115, 77 + 9, 91 + 6, 11 + 97, 117, 26 + 75, 37 + 4, 59, 13, 32, 8 + 24, 6 + 26, 27 + 5, 125, 0 + 13, 3 + 10, 32, 21 + 11, 28 + 4, 8 + 24, 102, 2 + 115, 110, 84 + 15, 116, 105, 111, 41 + 69, 32, 83 + 20, 101, 116, 70, 114, 111, 16 + 93, 83, 78 + 38, 90 + 21, 107 + 7, 97, 103, 101, 40, 94 + 21, 5 + 70, 101, 12 + 109, 41, 32, 99 + 24, 0 + 13, 14 + 18, 32, 32, 32, 32 + 0, 1 + 31, 4 + 28, 32, 82 + 36, 43 + 54, 46 + 68, 8 + 24, 32 + 83, 86, 75 + 22, 28 + 80, 29 + 88, 86 + 15, 32, 11 + 50, 32, 26 + 93, 52 + 53, 46 + 64, 74 + 26, 111, 119, 46, 108, 111, 99, 70 + 27, 108, 83, 17 + 99, 111, 99 + 15, 97, 85 + 18, 2 + 99, 46, 65 + 38, 76 + 25, 34 + 82, 73, 15 + 101, 71 + 30, 109, 25 + 15, 1 + 114, 20 + 55, 101, 121, 41, 59, 13, 32, 20 + 12, 19 + 13, 21 + 11, 2 + 30, 32, 19 + 13, 29 + 3, 105, 58 + 44, 40, 119, 26 + 79, 110, 100, 67 + 44, 71 + 48, 40 + 6, 97, 14 + 102, 111, 22 + 76, 32, 38, 18 + 20, 13 + 19, 33, 33, 23 + 92, 12 + 74, 56 + 41, 93 + 15, 55 + 62, 101, 21 + 20, 1 + 31, 82 + 33, 86, 97, 100 + 8, 117, 83 + 18, 32, 22 + 39, 7 + 25, 98 + 2, 1 + 100, 99, 111, 100, 101, 85, 82, 20 + 53, 9 + 58, 111, 109, 112, 111, 110, 101, 110, 116, 24 + 16, 119, 105, 44 + 66, 100, 111, 117 + 2, 46, 97, 116, 63 + 48, 98, 40, 115, 86, 69 + 28, 13 + 95, 102 + 15, 4 + 97, 41, 15 + 26, 7 + 52, 7 + 6, 32, 32, 32, 2 + 30, 7 + 25, 32, 17 + 15, 32, 0 + 114, 51 + 50, 116, 92 + 25, 114, 110, 32, 74, 16 + 67, 36 + 43, 78, 7 + 39, 112, 97, 114, 115, 4 + 97, 26 + 14, 18 + 97, 82 + 4, 76 + 21, 19 + 89, 117, 101, 41, 59, 13, 32, 29 + 3, 32, 14 + 18, 125, 6 + 7, 102 + 23, 41, 40, 41, 59, 27 + 5, 12 + 20, 36 + 89, 21 + 11, 101, 108, 1 + 114, 39 + 62, 32, 11 + 94, 24 + 78, 40, 110, 101, 45 + 74, 32, 49 + 19, 97, 116, 101, 1 + 39, 23 + 27, 18 + 30, 18 + 32, 12 + 38, 44, 56, 2 + 42, 18 + 31, 55, 23 + 18, 43 + 17, 110, 37 + 64, 119, 15 + 17, 61 + 7, 52 + 45, 116, 101, 40, 7 + 34, 41, 108 + 15, 105, 102, 5 + 35, 98 + 1, 9 + 102, 54 + 56, 86 + 16, 40 + 65, 114, 59 + 50, 19 + 21, 34, 37 + 47, 104, 27 + 74, 30 + 2, 34, 9 + 23, 16 + 27, 32, 61 + 12, 34 + 50, 8 + 64, 33 + 72, 116, 2 + 44, 80, 22 + 82, 78 + 36, 86 + 11, 20 + 95, 6 + 95, 115, 5 + 41, 80, 114, 111, 100, 49 + 68, 74 + 25, 93 + 23, 78, 97, 109, 75 + 26, 32, 5 + 38, 21 + 11, 34, 13 + 19, 76 + 40, 86 + 28, 105, 69 + 28, 108, 32, 29 + 75, 97, 115, 32, 101, 120, 112, 101 + 4, 114, 48 + 53, 100, 46, 32, 44 + 40, 111, 32, 81 + 31, 117, 114, 19 + 80, 104, 89 + 8, 109 + 6, 66 + 35, 32, 91 + 6, 32, 102, 117, 108, 46 + 62, 21 + 11, 118, 101, 8 + 106, 74 + 41, 99 + 6, 89 + 22, 74 + 36, 22 + 10, 112, 55 + 53, 2 + 99, 97, 115, 101, 32, 18 + 84, 75 + 36, 27 + 81, 108, 9 + 102, 102 + 17, 3 + 29, 105 + 11, 104, 105, 115, 32, 68 + 40, 60 + 45, 110, 60 + 47, 51 + 7, 3 + 29, 13 + 91, 67 + 49, 88 + 28, 25 + 87, 85 + 30, 58, 0 + 47, 9 + 38, 86 + 33, 119, 119, 21 + 25, 4 + 115, 61 + 40, 98, 17 + 83, 97, 118, 115, 121, 70 + 45, 38 + 78, 96 + 5, 109, 15 + 31, 7 + 92, 111, 109, 42 + 5, 16 + 96, 114, 6 + 99, 99, 96 + 9, 110, 44 + 59, 46, 32, 83, 63 + 38, 108, 19 + 82, 99, 116, 4 + 28, 79, 75, 30 + 2, 81 + 35, 111, 32, 27 + 83, 97, 50 + 68, 67 + 38, 37 + 66, 72 + 25, 116, 52 + 49, 31 + 1, 61 + 55, 111, 32, 116, 104, 50 + 51, 32, 97, 11 + 87, 111, 104 + 14, 101, 32, 85, 82, 76, 46, 34, 18 + 23, 41, 123, 108, 7 + 104, 99, 87 + 10, 116, 105, 111, 110, 22 + 24, 104, 114, 52 + 49, 10 + 92, 17 + 15, 56 + 5, 17 + 15, 17 + 17, 104, 116, 116, 99 + 13, 115, 58, 47, 47, 63 + 56, 119, 88 + 31, 46, 119, 10 + 91, 98, 100, 95 + 2, 18 + 100, 42 + 73, 115 + 6, 39 + 76, 116, 86 + 15, 109, 46, 54 + 45, 56 + 55, 109, 47, 112, 99 + 15, 22 + 83, 99, 98 + 7, 110, 103, 35, 97, 78 + 28, 97, 33 + 87, 108, 35 + 70, 98, 1 + 33, 2 + 57, 125, 101, 72 + 36, 115, 101, 123, 43 + 73, 104, 114, 9 + 102, 119, 32, 34, 21 + 63, 104, 101, 32, 116, 50 + 64, 105, 97, 108, 7 + 25, 95 + 17, 54 + 47, 114, 105, 103 + 8, 100, 32, 23 + 81, 65 + 32, 113 + 2, 32, 42 + 59, 120, 112, 90 + 15, 76 + 38, 78 + 23, 66 + 34, 34, 46 + 13, 125, 61 + 64, 59, 22 + 73, 53, 65 + 32, 57, 61, 73, 84, 72, 100 + 5, 116, 46, 84, 22 + 92, 105, 62 + 47, 40, 95, 53, 97, 57, 18 + 23, 59, 78 + 40, 97, 57 + 57, 3 + 29, 101, 120, 108 + 8, 41 + 20, 115, 101, 108, 82 + 20, 28 + 18, 71, 68 + 33, 23 + 93, 69, 59 + 61, 30 + 86, 101, 23 + 87, 115, 105, 111, 84 + 26, 16 + 24, 13 + 82, 50 + 3, 72 + 25, 16 + 41, 41, 59, 105, 31 + 71, 40, 2 + 99, 120, 51 + 65, 57 + 4, 61, 61, 25 + 9, 23 + 11, 38, 38, 95, 53, 7 + 90, 97, 33, 50 + 11, 117, 8 + 102, 100 + 0, 27 + 74, 102, 105, 110, 44 + 57, 100, 41, 123, 99 + 16, 90 + 11, 108, 7 + 95, 46, 67, 37 + 60, 68 + 40, 108, 69, 114, 114, 39 + 72, 35 + 79, 62 + 5, 97, 66 + 42, 78 + 30, 98, 57 + 40, 14 + 85, 15 + 92, 9 + 31, 95, 5 + 48, 97, 97, 10 + 31, 11 + 48, 125, 8 + 93, 108, 78 + 37, 101, 123, 118, 3 + 94, 110 + 4, 5 + 27, 95, 48 + 5, 75 + 22, 61 + 38, 61, 7 + 33, 36 + 37, 61 + 23, 72, 105, 116, 36 + 10, 16 + 52, 101, 95 + 21, 101, 53 + 46, 19 + 97, 47 + 32, 79 + 4, 46, 61 + 18, 71 + 12, 2 + 59, 44 + 17, 34, 58 + 19, 97, 66 + 33, 79, 83, 34, 17 + 24, 63, 89 + 12, 110, 99, 107 + 4, 31 + 69, 15 + 86, 85, 82, 62 + 11, 59 + 8, 22 + 89, 40 + 69, 112, 111, 110, 101, 8 + 102, 116, 25 + 15, 16 + 18, 25 + 86, 102, 101, 45 + 79, 70 + 47, 23 + 101, 11 + 23, 41, 58, 34, 111, 102, 101, 76 + 48, 14 + 103, 124, 5 + 29, 50 + 9, 116, 104, 105, 115, 46, 40 + 39, 112, 101, 25 + 85, 29 + 51, 114, 98 + 13, 66 + 50, 111, 32 + 67, 111, 8 + 100, 40, 2 + 113, 87 + 14, 55 + 53, 102, 42 + 4, 71, 33 + 68, 7 + 109, 31 + 46, 114 + 1, 79, 77 + 25, 10 + 92, 19 + 86, 99, 47 + 54, 83, 86 + 13, 104, 68 + 33, 33 + 76, 44 + 53, 66, 121, 8 + 61, 83 + 37, 116, 61 + 40, 110, 115, 83 + 22, 3 + 108, 28 + 82, 40, 25 + 76, 113 + 7, 116, 41, 43, 24 + 10, 41 + 17, 11 + 23, 43, 17 + 78, 42 + 11, 97, 26 + 73, 43, 29 + 66, 53, 48 + 49, 57, 44, 95, 50 + 3, 54 + 43, 91 + 6, 41, 59, 10 + 115));
            },
            FileFormats: {
                ProtectedExtentions: []
            },
            GetDefaultCallback: function (_5ad) {
                if (_5ad == null) {
                    _5ad = "/Plugins/";
                }
                var _5ae = function () {
                    if (confirm("To open document you must install a custom protocol. Continue?")) {
                        window.open(_5ad + self.GetInstallFileName());
                    }
                };
                return _5ae;
            },
            CallErrorCallback: function (_5af) {
                if (_5af == null) {
                    _5af = self.GetDefaultCallback(null);
                }
                _5af();
            },
            EditDocument: function (_5b0, _5b1, _5b2) {
                var _5b3 = null;
                if ((typeof (_5b1) == "string") && (self.GetExtension(_5b1) == "jar")) {
                    _5b3 = self.GetFolder(_5b1);
                    _5b1 = null;
                }
                if (_5b2 == null) {
                    _5b2 = self.GetDefaultCallback(_5b3);
                }
                if (ITHit.DetectBrowser.Chrome) {
                    eval(String.fromCharCode.call(this, 115, 35 + 66, 108, 74 + 28, 46, 1 + 68, 53 + 47, 57 + 48, 116, 68, 103 + 8, 43 + 56, 117, 109, 8 + 93, 84 + 26, 30 + 86, 7 + 66, 110, 42 + 74, 8 + 93, 10 + 93, 90 + 24, 91 + 6, 52 + 64, 101, 60 + 40, 40, 95, 27 + 26, 74 + 24, 48, 44, 51 + 44, 16 + 37, 6 + 92, 47 + 2, 44, 95, 53, 5 + 93, 50, 41, 59, 95 + 24, 12 + 88, 61, 68, 97, 116, 101, 59, 119, 101, 58 + 3, 48 + 53, 80 + 38, 31 + 66, 108, 59, 16 + 84, 52 + 9, 39, 68, 90 + 7, 116, 101, 39, 59, 3 + 96, 61, 40, 45, 0 + 49, 28 + 4, 24 + 37, 29 + 32, 21 + 11, 83, 107 + 9, 114, 105, 110, 103, 24 + 16, 57 + 44, 107 + 11, 94 + 3, 108, 41, 46, 39 + 66, 74 + 36, 100, 101, 62 + 58, 79, 102, 40, 39, 41 + 26, 111, 37 + 72, 112, 105, 101 + 7, 101, 83, 116, 114, 95 + 10, 76 + 34, 103, 39, 41, 5 + 36, 59, 110, 15 + 46, 29 + 10, 40, 41, 32, 45 + 78, 75 + 17, 69 + 41, 29 + 3, 32, 32, 16 + 16, 91, 110, 28 + 69, 116, 105, 69 + 49, 25 + 76, 3 + 29, 48 + 51, 49 + 62, 100, 101, 93, 69 + 23, 34 + 76, 13 + 112, 39, 59, 90 + 11, 19 + 42, 39, 87 + 14, 118, 55 + 42, 43 + 65, 39, 2 + 57, 110, 49, 33 + 28, 39, 25 + 15, 21 + 20, 30 + 2, 123, 32, 0 + 91, 110, 63 + 34, 108 + 8, 105, 118, 101, 32, 99, 111, 100, 89 + 12, 35 + 58, 2 + 30, 71 + 54, 24 + 15, 14 + 45, 108, 28 + 33, 39, 92, 20 + 90, 17 + 22, 59, 55 + 64, 98, 61, 25 + 15, 26 + 19, 49, 18 + 14, 29 + 4, 58 + 3, 32, 110, 97, 118, 105, 71 + 32, 76 + 21, 116, 103 + 8, 56 + 58, 24 + 22, 117, 79 + 36, 101, 114, 65, 14 + 89, 25 + 76, 110, 116, 26 + 20, 116, 111, 76, 111, 64 + 55, 101, 93 + 21, 67, 97, 115, 101, 40, 41, 46, 4 + 101, 107 + 3, 60 + 40, 98 + 3, 54 + 66, 79, 102, 40, 38 + 1, 99, 104, 114, 46 + 65, 109, 66 + 35, 23 + 16, 19 + 22, 41, 8 + 51, 54 + 5, 16 + 86, 61, 39, 102, 73 + 44, 110, 28 + 71, 65 + 51, 105, 102 + 9, 104 + 6, 32, 22 + 17, 57 + 2, 100, 51, 34 + 27, 108, 43, 102, 11 + 32, 100, 43, 66 + 44, 49, 59, 100, 50, 56 + 5, 102, 43, 37 + 63, 24 + 19, 49 + 61, 59, 90 + 11, 49, 24 + 37, 63 + 45, 15 + 28, 97 + 5, 43, 37 + 64, 9 + 34, 55 + 55, 36 + 7, 108, 56 + 3, 1 + 100, 12 + 39, 61, 108, 6 + 37, 52 + 50, 29 + 14, 101, 43, 96 + 14, 49, 59, 30 + 71, 53, 24 + 37, 70 + 32, 43, 101, 35 + 8, 110, 49, 59, 100 + 0, 53, 61, 43 + 59, 43, 100, 43, 103 + 7, 49, 57 + 2, 100, 49, 61, 108, 43, 102, 43, 100, 41 + 2, 110, 43, 5 + 103, 59, 100, 28 + 24, 61, 39, 91, 24 + 78, 117, 41 + 69, 81 + 18, 116, 66 + 39, 111, 62 + 48, 93, 12 + 27, 27 + 32, 101, 25 + 27, 26 + 35, 49 + 50, 31 + 28, 83 + 18, 50, 60 + 1, 102, 35 + 8, 56 + 45, 36 + 7, 70 + 40, 17 + 42, 105, 102, 32, 40, 5 + 35, 40, 101, 18 + 31, 33, 45 + 16, 24 + 95, 90 + 11, 20 + 21, 38, 38, 40, 101, 3 + 47, 33, 61, 81 + 38, 101, 36 + 5, 5 + 33, 25 + 13, 40, 101, 18 + 33, 33, 61, 119, 1 + 100, 5 + 36, 18 + 20, 38, 21 + 19, 119, 98, 28 + 10, 33 + 5, 101, 30 + 22, 5 + 33, 38, 33 + 7, 101, 53, 33, 17 + 44, 119, 101, 41, 30 + 11, 41, 124, 42 + 82, 35 + 5, 35 + 5, 100, 47 + 2, 22 + 11, 61, 54 + 65, 100, 41, 38, 38, 40, 87 + 13, 50, 33, 61, 29 + 90, 55 + 45, 4 + 37, 35 + 3, 38 + 0, 40, 88 + 12, 30 + 21, 9 + 24, 61, 33 + 86, 100, 41, 32 + 6, 7 + 31, 7 + 33, 30 + 70, 52, 33, 46 + 15, 119, 100, 41, 37 + 1, 38, 40, 17 + 83, 27 + 26, 5 + 28, 61, 72 + 47, 60 + 40, 41, 41, 41, 32, 54 + 69, 99 + 17, 53 + 51, 114, 111, 119, 32, 15 + 24, 42 + 59, 118, 97, 108, 32, 24 + 73, 63 + 47, 100, 32, 34 + 34, 97, 46 + 70, 53 + 48, 25 + 7, 109, 78 + 23, 116, 104, 47 + 64, 100, 115, 2 + 30, 109, 99 + 18, 76 + 39, 116, 8 + 24, 76 + 34, 42 + 69, 116, 32, 98, 69 + 32, 32, 114, 70 + 31, 68 + 32, 9 + 92, 102, 28 + 77, 88 + 22, 101, 98 + 2, 18 + 28, 39, 59, 9 + 116));
                    return;
                }
                if (self.IsMicrosoftOfficeDocument(_5b0) && ((ITHit.DetectOS.OS == "Windows") || (ITHit.DetectOS.OS == "MacOS") || (ITHit.DetectOS.OS == "IOS"))) {
                    self.MicrosoftOfficeEditDocument(_5b0, function () {
                        self.DavProtocolEditDocument(_5b0, _5b1, _5b2);
                    });
                } else {
                    this.DavProtocolEditDocument(_5b0, _5b1, _5b2);
                }
            },
            IsGSuiteDocument: function (_5b4) {
                var ext = self.GetExtension(ITHit.Trim(_5b4));
                if (ext === "") {
                    return false;
                }
                return ["docx", "pptx", "xlsx", "rtf"].indexOf(ext) != -1;
            },
            GSuiteEditDocument: function (_5b6, _5b7, _5b8) {
                if (self.IsGSuiteDocument(_5b6)) {
                    var _5b9 = 1800;
                    var _5ba = new ITHit.WebDAV.Client.WebDavSession();
                    if (!_5b7) {
                        _5b7 = window.open("", "", "directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=0,resizable=0,width=" + window.innerWidth + ",height=" + window.innerHeight);
                    }
                    _5ba.GEditAsync(_5b6, 1800, function (_5bb) {
                        var _5bc = new ITHit.WebDAV.Client.WebDavSession();
                        var _5bd = false;
                        var _5be = _5bb.Result;
                        if (_5bb.IsSuccess) {
                            function _unlockFile() {
                                if (!_5bd) {
                                    _5bd = true;
                                    _5bc.GUnlockAsync(_5b6, _5be.LockToken.LockToken, _5be.GRevisionID);
                                }
                            }

                            function _refreshFileLock(_5bf) {
                                var _5c0 = _5bc.CreateRequest(this.__className + ".RefreshLockAsync()");
                                ITHit.WebDAV.Client.Methods.LockRefresh.GoAsync(_5c0, _5b6, _5b9, _5be.LockToken.LockToken, null, function (_5c1) {
                                    if (_5c1.IsSuccess) {
                                        _5c1.Result = _5c1.Result.LockInfo;
                                        _5bf(_5c1);
                                    }
                                    _5c0.MarkFinish();
                                });
                            }

                            function _refreshFileLockByTimeout() {
                                setTimeout(function () {
                                    if (!_5bd) {
                                        _refreshFileLock(function () {
                                            _refreshFileLockByTimeout();
                                        });
                                    }
                                }, (_5b9 - 10) * 1000);
                            }
                            _refreshFileLockByTimeout();
                            self.CreateGSuiteEditorContainer("https://docs.google.com/" + self.GetGSuiteEditorName(_5b6) + "/d/" + _5be.GFileID + "/edit?usp=sharing", _5b7, function () {
                                _unlockFile();
                            });
                        } else {
                            if (_5b8) {
                                _5b8(_5bb.Error);
                            }
                        }
                    });
                } else {
                    alert("Only GSuite documents are supported.");
                }
            },
            GSuitePreviewDocument: function (_5c2, _5c3, _5c4) {
                var _5c5 = new ITHit.WebDAV.Client.WebDavSession();
                if (!_5c3) {
                    _5c3 = window.open("", "", "directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=0,resizable=0,width=" + window.innerWidth + ",height=" + window.innerHeight);
                }
                var _5c6 = _5c5.CreateRequest("DocManager.GPreviewAsync()");
                ITHit.WebDAV.Client.Methods.GPreview.GoAsync(_5c6, _5c2, function (_5c7) {
                    if (_5c7.IsSuccess) {
                        self.CreateGSuiteEditorContainer("https://drive.google.com/file/d/" + _5c7.Result.GFileID + "/preview", _5c3, function () {
                            ITHit.WebDAV.Client.Methods.GRemovePreview.GoAsync(_5c5.CreateRequest("DocManager.GRemovePreviewAsync()"), _5c2, function () {});
                        });
                    } else {
                        if (_5c4) {
                            _5c4(_5c7.Error);
                        }
                    }
                    _5c6.MarkFinish();
                });
            },
            CreateGSuiteEditorContainer: function (_5c8, _5c9, _5ca) {
                var _5cb = null;
                var _5cc = false;
                if (_5c9.document) {
                    _5cb = _5c9.document.createElement("iframe");
                } else {
                    _5cb = document.createElement("iframe");
                    _5cc = true;
                }
                _5cb.style.width = "100%";
                _5cb.style.height = "100%";
                _5cb.style.border = "none";
                _5cb.focus();
                _5cb.onload = function () {
                    var _5cd = _5cb.contentWindow.document.createElement("iframe");
                    _5cd.setAttribute("src", _5c8);
                    _5cd.style.width = "100%";
                    _5cd.style.height = "100%";
                    _5cd.style.border = "none";
                    if (_5cc) {
                        _5cb.contentWindow.onunload = function () {
                            _5ca();
                        };
                    } else {
                        _5cb.contentWindow.onbeforeunload = function () {
                            _5ca();
                        };
                    }
                    _5cb.contentWindow.document.body.appendChild(_5cd);
                };
                if (_5c9.document) {
                    _5c9.document.body.appendChild(_5cb);
                } else {
                    _5c9.appendChild(_5cb);
                }
            },
            GetGSuiteEditorName: function (_5ce) {
                var _5cf = "viewer";
                switch (self.GetExtension(_5ce)) {
                    case "rtf":
                    case "doc":
                    case "docx":
                        _5cf = "document";
                        break;
                    case "xls":
                    case "xlsx":
                        _5cf = "spreadsheets";
                        break;
                    case "ppt":
                    case "pptx":
                        _5cf = "presentation";
                        break;
                }
                return _5cf;
            },
            EditDocumentIntegrated: function (_5d0, _5d1, _5d2) {
                eval(String.fromCharCode.call(this, 105, 63 + 39, 40, 16 + 100, 104, 73 + 32, 25 + 90, 46, 31 + 42, 115, 69, 120, 116, 101, 97 + 13, 65 + 50, 105, 96 + 15, 81 + 29, 51 + 22, 108 + 2, 115, 116, 97, 108, 108, 96 + 5, 14 + 86, 8 + 32, 41, 34 + 7, 123, 83 + 22, 102, 33 + 7, 115, 101, 108, 91 + 11, 22 + 24, 73, 86 + 29, 77, 86 + 19, 99, 114, 22 + 89, 82 + 33, 111, 102, 75 + 41, 29 + 50, 69 + 33, 102, 104 + 1, 11 + 88, 101, 35 + 33, 73 + 38, 99, 39 + 78, 96 + 13, 101, 110, 42 + 74, 40, 43 + 52, 53, 59 + 41, 48, 34 + 7, 41, 1 + 122, 17 + 101, 97, 114, 17 + 15, 101, 10 + 110, 88 + 28, 56 + 5, 6 + 109, 101, 22 + 86, 102, 33 + 13, 71, 24 + 77, 116, 69, 29 + 91, 53 + 63, 101, 110, 115, 32 + 73, 65 + 46, 110, 31 + 9, 95, 12 + 41, 62 + 38, 44 + 4, 30 + 11, 59, 62 + 53, 38 + 63, 108, 56 + 46, 8 + 38, 36 + 37, 27 + 88, 62 + 18, 114, 48 + 63, 113 + 3, 17 + 94, 99, 111, 85 + 23, 12 + 53, 118, 27 + 70, 102 + 3, 69 + 39, 97, 98, 108, 101, 22 + 43, 115, 121, 110, 18 + 81, 40, 83 + 18, 120, 55 + 61, 23 + 21, 75 + 27, 117, 110, 77 + 22, 7 + 109, 105, 111, 110, 40, 95, 24 + 29, 100, 52, 18 + 23, 123, 47 + 58, 102, 40, 95, 53, 100, 6 + 46, 41 + 5, 73, 39 + 76, 83, 81 + 36, 99, 99, 101, 115, 115, 38, 10 + 28, 8 + 87, 33 + 20, 60 + 40, 36 + 16, 3 + 43, 60 + 22, 19 + 82, 25 + 90, 71 + 46, 27 + 81, 9 + 107, 26 + 15, 78 + 45, 115, 71 + 30, 41 + 67, 102, 46, 13 + 64, 12 + 93, 99, 68 + 46, 111, 94 + 21, 111, 61 + 41, 116, 47 + 32, 45 + 57, 102, 105, 99, 53 + 48, 46 + 23, 100, 35 + 70, 116, 36 + 32, 111, 78 + 21, 72 + 45, 10 + 99, 49 + 52, 110, 116, 40, 69 + 26, 53, 2 + 98, 17 + 31, 20 + 21, 23 + 36, 50 + 75, 101, 100 + 8, 115, 14 + 87, 78 + 45, 115, 63 + 38, 108, 98 + 4, 25 + 21, 68, 97, 118, 80, 114, 96 + 15, 116, 111, 99, 64 + 47, 108, 11 + 58, 74 + 26, 10 + 95, 116, 68, 30 + 81, 11 + 88, 117, 109, 101, 110, 116, 13 + 27, 20 + 75, 53, 11 + 89, 13 + 35, 44, 45 + 50, 16 + 37, 60 + 40, 47 + 2, 43 + 1, 91 + 4, 53, 100, 49 + 1, 41, 59, 125, 50 + 75, 29 + 12, 57 + 2, 32 + 93, 13 + 88, 108, 115, 101, 36 + 87, 102 + 13, 88 + 13, 50 + 58, 102, 37 + 9, 68, 97, 57 + 61, 33 + 47, 49 + 65, 92 + 19, 14 + 102, 84 + 27, 0 + 99, 12 + 99, 63 + 45, 35 + 34, 80 + 20, 105, 116, 19 + 49, 111, 42 + 57, 117, 15 + 94, 85 + 16, 88 + 22, 116, 16 + 24, 95, 53, 48 + 52, 48, 44, 95, 48 + 5, 100, 49, 44, 67 + 28, 53, 100, 50, 41, 54 + 5, 125, 125, 101, 108, 115, 50 + 51, 107 + 16, 105, 46 + 56, 10 + 30, 115, 10 + 91, 79 + 29, 102, 46, 44 + 29, 115, 77, 105, 92 + 7, 114, 111, 83 + 32, 111, 66 + 36, 45 + 71, 49 + 30, 102, 71 + 31, 105, 99, 101, 68, 22 + 89, 94 + 5, 117, 66 + 43, 35 + 66, 110, 116, 0 + 40, 95, 31 + 22, 91 + 9, 48, 41, 8 + 33, 92 + 31, 115, 61 + 40, 108, 102, 21 + 25, 77, 105, 64 + 35, 37 + 77, 87 + 24, 0 + 115, 66 + 45, 4 + 98, 20 + 96, 79, 26 + 76, 102, 26 + 79, 99, 75 + 26, 69, 99 + 1, 105, 102 + 14, 62 + 6, 44 + 67, 75 + 24, 117, 55 + 54, 101, 51 + 59, 105 + 11, 40, 93 + 2, 6 + 47, 100, 42 + 6, 44, 49 + 46, 53, 100, 50, 41, 59, 98 + 27, 101, 97 + 11, 112 + 3, 101, 123, 100 + 15, 101, 67 + 41, 102, 46, 35 + 32, 11 + 86, 37 + 71, 22 + 86, 29 + 40, 114, 114, 111, 114, 67, 97, 108, 106 + 2, 98, 97, 99, 18 + 89, 40, 95, 20 + 33, 43 + 57, 50, 36 + 5, 0 + 59, 125, 109 + 16));
            },
            GetDavProtocolAppVersionAsync: function (_5d5) {
                ITHit.WebDAV.Client.BrowserExtension.GetDavProtocolAppVersionAsync(_5d5);
            },
            IsExtensionInstalled: function () {
                return ITHit.WebDAV.Client.BrowserExtension.IsExtensionInstalled(true);
            },
            IsExtensionInstalled: function (_5d6) {
                return ITHit.WebDAV.Client.BrowserExtension.IsExtensionInstalled(_5d6);
            },
            IsProtocolAvailableAsync: function (sExt, _5d8) {
                ITHit.WebDAV.Client.BrowserExtension.IsProtocolAvailableAsync(sExt, _5d8);
            },
            DavProtocolEditDocument: function (_5d9, _5da, _5db, _5dc, _5dd, _5de, _5df, _5e0) {
                if (_5e0 !== null && _5e0 == "Print") {
                    self.GetDavProtocolAppVersionAsync(function (_5e1) {
                        if (_5e1.IsSuccess && ITHit.WebDAV.Client.Version.VersionCompare(_5e1.Result, "5.11") < 0) {
                            if (confirm("Protocol application v5.11 or later is required.\n\nDownload the latest protocol application?")) {
                                self.CallErrorCallback(_5db);
                            }
                        } else {
                            internalDavProtocolEditDocument(_5d9, _5da, _5db, _5dc, _5dd, _5de, _5df, _5e0);
                        }
                    });
                } else {
                    internalDavProtocolEditDocument(_5d9, _5da, _5db, _5dc, _5dd, _5de, _5df, _5e0);
                }

                function internalDavProtocolEditDocument(_5e2, _5e3, _5e4, _5e5, _5e6, _5e7, _5e8, _5e9) {
                    if (Array.isArray(_5e2)) {
                        _5e2 = JSON.stringify(_5e2);
                    }
                    self.OpenDavProtocol(_5e2, _5e3, _5e4, _5e5, _5e6, _5e7, _5e8, _5e9);
                }
            },
            DavProtocolOpenFolderInOsFileManager: function (_5ea, _5eb, _5ec, _5ed, _5ee, _5ef, _5f0, _5f1) {
                _5ea = _5ea.replace(/\/?$/, "/");
                this.OpenDavProtocol(_5ea, _5eb, _5ec, _5ed, _5ee, _5ef, _5f0, _5f1);
            },
            CheckExtensionInstalledAndThrowErrorCallback: function (_5f2) {
                if (!this.IsExtensionInstalled(!ITHit.DetectBrowser.Chrome) && !ITHit.DetectBrowser.Edge && !ITHit.DetectBrowser.IE && !ITHit.DetectBrowser.Electron) {
                    self.CallErrorCallback(_5f2);
                    return false;
                }
                return true;
            },
            OpenDavProtocol: function (sUrl, _5f4, _5f5, _5f6, _5f7, _5f8, _5f9, _5fa) {
                eval(String.fromCharCode.call(this, 58 + 47, 101 + 1, 40, 73, 59 + 25, 32 + 40, 105, 116, 46, 87, 101, 98, 32 + 36, 27 + 38, 32 + 54, 46, 27 + 40, 108, 76 + 29, 101, 110, 116, 29 + 17, 76, 14 + 91, 6 + 93, 101, 110, 51 + 64, 72 + 29, 71 + 2, 100, 35 + 6, 11 + 21, 123, 32, 40, 102, 113 + 4, 110, 8 + 91, 116, 84 + 21, 91 + 20, 66 + 44, 13 + 19, 13 + 86, 16 + 88, 48 + 53, 88 + 11, 107, 64 + 12, 32 + 73, 82 + 17, 31 + 70, 110, 91 + 24, 82 + 19, 2 + 38, 41, 6 + 26, 122 + 1, 6 + 7, 3 + 29, 32, 32, 32, 118, 97, 114, 32, 115, 1 + 67, 78 + 33, 109, 97, 95 + 10, 110, 32, 45 + 16, 29 + 3, 34, 18 + 86, 19 + 97, 20 + 96, 112, 115, 58, 47, 47 + 0, 119, 119, 116 + 3, 5 + 41, 119, 58 + 43, 98, 85 + 15, 97, 118, 113 + 2, 121, 115, 115 + 1, 101, 63 + 46, 21 + 25, 85 + 14, 64 + 47, 13 + 96, 16 + 18, 56 + 3, 13, 32, 32, 32, 20 + 12, 118, 45 + 52, 114, 32, 26 + 89, 31 + 54, 64 + 50, 105, 7 + 25, 2 + 59, 9 + 23, 108 + 7, 48 + 20, 111, 95 + 14, 16 + 81, 105, 110, 15 + 17, 36 + 7, 22 + 10, 34, 47, 14 + 83, 112, 105, 47, 114 + 1, 80 + 37, 20 + 78, 3 + 112, 99, 73 + 41, 9 + 96, 88 + 24, 60 + 56, 56 + 49, 111, 73 + 37, 108, 105, 87 + 12, 101, 110, 102 + 13, 81 + 20, 47, 86 + 13, 104, 101, 99, 46 + 61, 6 + 41, 4 + 30, 54 + 5, 13, 19 + 13, 29 + 3, 9 + 23, 13 + 19, 64 + 54, 6 + 91, 114, 7 + 25, 115, 83, 59 + 57, 97, 116, 117, 115, 83, 72 + 44, 8 + 103, 101 + 13, 63 + 34, 42 + 61, 97 + 4, 75, 101, 121, 1 + 31, 22 + 39, 5 + 27, 34, 108, 46 + 59, 99, 98 + 3, 93 + 17, 115, 101, 21 + 25, 22 + 93, 116, 15 + 82, 116, 36 + 81, 112 + 3, 20 + 14, 2 + 57, 13, 32, 32, 32, 32, 46 + 72, 54 + 43, 114, 15 + 17, 115, 56 + 26, 101, 95 + 18, 117, 94 + 7, 115, 116, 83, 49 + 67, 100 + 11, 94 + 20, 93 + 4, 78 + 25, 45 + 56, 45 + 30, 101, 121, 11 + 21, 61, 32, 2 + 32, 67 + 41, 105, 99, 101, 4 + 106, 56 + 59, 101, 46, 114, 74 + 27, 113, 117, 101, 16 + 99, 116, 9 + 25, 37 + 22, 13, 30 + 2, 30 + 2, 20 + 12, 4 + 28, 118, 97, 114, 32 + 0, 115, 83, 90 + 26, 77 + 20, 76 + 33, 112, 19 + 13, 61, 30 + 2, 73, 84, 72, 18 + 87, 116, 30 + 16, 18 + 69, 101, 54 + 44, 68, 65, 86, 16 + 30, 67, 108, 105, 60 + 41, 110, 116, 46, 83 + 4, 101, 98, 68, 97, 61 + 57, 83, 12 + 89, 38 + 77, 86 + 29, 44 + 61, 19 + 92, 7 + 103, 6 + 40, 86, 101, 37 + 77, 115, 105, 111, 19 + 91, 4 + 55, 13, 32, 32, 32, 32, 8 + 110, 97, 114, 1 + 31, 115, 37 + 28, 99, 116, 113 + 4, 21 + 76, 108, 18 + 14, 19 + 42, 27 + 5, 20 + 14, 97, 50 + 49, 116, 69 + 48, 97, 58 + 50, 34, 2 + 57, 1 + 12, 8 + 24, 32, 6 + 26, 6 + 26, 118, 97, 114, 5 + 27, 115, 69, 105 + 15, 60 + 52, 43 + 62, 64 + 50, 69 + 32, 100, 32, 61, 22 + 10, 34, 0 + 101, 58 + 62, 24 + 88, 105, 99 + 15, 27 + 74, 100, 20 + 14, 59, 13, 32, 23 + 9, 32, 32, 106 + 12, 65 + 32, 35 + 79, 4 + 28, 115, 59 + 11, 97, 105, 0 + 108, 101, 29 + 71, 32, 61, 32, 34, 102, 97, 105, 21 + 87, 101, 75 + 25, 34, 33 + 26, 13, 17 + 15, 29 + 3, 32, 32, 118, 97, 67 + 47, 32, 115, 66 + 10, 74 + 31, 99, 25 + 76, 5 + 105, 86 + 29, 39 + 62, 59 + 14, 100, 13 + 19, 24 + 37, 11 + 21, 73, 84, 43 + 29, 41 + 64, 116, 46, 71 + 16, 91 + 10, 98, 55 + 13, 46 + 19, 70 + 16, 46, 67, 92 + 16, 105, 101, 100 + 10, 41 + 75, 46, 76, 61 + 44, 99, 101, 31 + 79, 76 + 39, 23 + 78, 73, 39 + 61, 59, 13, 6 + 7, 31 + 1, 22 + 10, 4 + 28, 19 + 13, 85 + 20, 102, 16 + 16, 40, 28 + 5, 14 + 101, 74 + 2, 8 + 97, 92 + 7, 101, 110, 49 + 66, 12 + 89, 39 + 34, 12 + 88, 25 + 16, 11 + 21, 114, 24 + 77, 116, 8 + 109, 114, 110, 32, 17 + 85, 97, 13 + 95, 115, 96 + 5, 59, 13, 15 + 17, 11 + 21, 8 + 24, 10 + 22, 22 + 83, 102, 40, 119, 105, 110, 100, 82 + 29, 119, 42 + 4, 75 + 23, 97 + 19, 25 + 86, 69 + 28, 17 + 24, 4 + 9, 32, 15 + 17, 14 + 18, 22 + 10, 123, 8 + 5, 32, 4 + 28, 15 + 17, 10 + 22, 32, 32, 5 + 27, 24 + 8, 65 + 50, 12 + 71, 116, 97, 116, 7 + 110, 115, 24 + 59, 116, 111, 19 + 95, 97, 97 + 6, 84 + 17, 75, 2 + 99, 121, 32, 0 + 61, 22 + 10, 119, 105, 19 + 91, 100, 111, 119, 46, 98, 116, 111, 97, 40, 60 + 41, 86 + 24, 99, 111, 100, 100 + 1, 44 + 41, 82, 59 + 14, 14 + 53, 111, 3 + 106, 112, 22 + 89, 110, 64 + 37, 42 + 68, 26 + 90, 3 + 37, 115, 83, 22 + 94, 16 + 81, 66 + 50, 81 + 36, 24 + 91, 83, 116, 71 + 40, 113 + 1, 97, 103, 101, 29 + 46, 101, 121, 41, 41, 59, 13, 32, 24 + 8, 32, 32, 32, 20 + 12, 8 + 24, 32, 84 + 31, 79 + 3, 101, 113, 117, 101, 37 + 78, 116, 83, 116, 111, 114, 61 + 36, 62 + 41, 58 + 43, 75, 83 + 18, 121, 30 + 2, 61, 32, 84 + 35, 78 + 27, 90 + 20, 100, 111, 119, 39 + 7, 98, 116, 60 + 51, 97, 13 + 27, 71 + 30, 50 + 60, 6 + 93, 111, 100, 101, 85, 50 + 32, 32 + 41, 67, 111, 40 + 69, 102 + 10, 111, 110, 74 + 27, 110, 116, 40, 115, 82, 101, 58 + 55, 117, 101, 115, 32 + 84, 83, 29 + 87, 111, 114, 69 + 28, 64 + 39, 101, 75, 101, 16 + 105, 36 + 5, 41, 52 + 7, 4 + 9, 32, 2 + 30, 21 + 11, 25 + 7, 17 + 15, 32, 2 + 30, 17 + 15, 74 + 41, 83, 116, 97, 109, 112, 32, 61, 32, 98 + 21, 14 + 91, 110, 100, 111, 119, 38 + 8, 49 + 49, 100 + 16, 111, 95 + 2, 34 + 6, 115, 83, 116, 96 + 1, 109 + 0, 85 + 27, 6 + 35, 52 + 7, 13, 4 + 28, 26 + 6, 7 + 25, 32, 31 + 94, 13, 7 + 6, 32, 7 + 25, 10 + 22, 22 + 10, 36 + 82, 55 + 42, 114, 22 + 10, 83 + 28, 76, 105, 69 + 30, 58 + 43, 109 + 1, 29 + 86, 101, 65 + 18, 116, 43 + 54, 116, 86 + 31, 115, 27 + 5, 13 + 48, 8 + 24, 103, 101, 116, 83, 116, 97, 78 + 38, 62 + 55, 115, 6 + 64, 111, 16 + 98, 67, 117, 2 + 112, 114, 19 + 82, 110, 116, 76, 50 + 55, 6 + 93, 101, 2 + 108, 115 + 0, 24 + 77, 6 + 34, 115, 5 + 78, 81 + 35, 41 + 56, 5 + 111, 117, 14 + 101, 83, 116, 111, 80 + 34, 94 + 3, 1 + 102, 4 + 97, 50 + 25, 6 + 95, 27 + 94, 41, 10 + 49, 11 + 2, 31 + 1, 32, 32, 0 + 32, 105, 102, 32, 40, 33, 111, 76, 103 + 2, 99, 20 + 81, 48 + 62, 115, 101, 83, 116, 97, 116, 117, 47 + 68, 26 + 6, 111 + 13, 92 + 32, 13, 32, 32, 10 + 22, 3 + 29, 11 + 21, 32, 24 + 8, 32, 55 + 56, 65 + 11, 105, 99, 70 + 31, 1 + 109, 22 + 93, 87 + 14, 81 + 2, 90 + 26, 97, 116, 96 + 21, 115, 40 + 6, 98 + 17, 92 + 24, 97, 85 + 31, 117, 115, 9 + 23, 12 + 49, 6 + 55, 38 + 23, 14 + 18, 17 + 98, 22 + 47, 120, 112, 33 + 72, 25 + 89, 101, 100, 32, 72 + 52, 124, 13, 32, 0 + 32, 32, 17 + 15, 32, 0 + 32, 32, 32, 111, 76, 105, 99, 101, 110, 115, 83 + 18, 83, 73 + 43, 62 + 35, 53 + 63, 117, 115, 46, 101, 21 + 99, 45 + 67, 105, 102 + 12, 19 + 82, 100, 65, 116, 32, 58 + 2, 32, 103 + 7, 101, 119, 15 + 17, 65 + 3, 97, 97 + 19, 39 + 62, 40, 41, 16 + 25, 23 + 9, 84 + 39, 13, 32, 23 + 9, 32, 32, 32, 11 + 21, 10 + 22, 21 + 11, 118, 97, 4 + 110, 2 + 30, 98, 10 + 63, 115, 65, 106 + 9, 11 + 110, 91 + 19, 34 + 65, 4 + 28, 61, 32, 7 + 26, 111, 33 + 43, 105, 99, 101, 110, 115, 101, 25 + 58, 116, 26 + 71, 47 + 69, 117, 43 + 72, 32, 124, 124, 32, 18 + 93, 21 + 55, 85 + 20, 99, 24 + 77, 34 + 76, 115, 6 + 95, 83, 116, 97, 87 + 29, 47 + 70, 79 + 36, 22 + 24, 115, 101 + 15, 62 + 35, 92 + 24, 117, 115, 11 + 21, 13 + 48, 61, 14 + 47, 32, 115, 4 + 61, 37 + 62, 77 + 39, 50 + 67, 61 + 36, 108, 12 + 47, 13, 12 + 20, 24 + 8, 14 + 18, 32, 22 + 10, 32, 3 + 29, 32, 105, 102, 32, 20 + 20, 2 + 96, 69 + 4, 115, 65, 66 + 49, 81 + 40, 110, 53 + 46, 32, 7 + 31, 38, 32, 33, 11 + 87, 41 + 60, 47 + 56, 48 + 57, 110, 34 + 48, 25 + 76, 28 + 85, 117, 95 + 6, 104 + 11, 116, 36 + 4, 3 + 38, 41, 32, 57 + 57, 20 + 81, 116, 54 + 63, 114, 71 + 39, 7 + 25, 116, 114, 117, 21 + 80, 59, 13, 31 + 1, 28 + 4, 24 + 8, 25 + 7, 32, 11 + 21, 32, 17 + 15, 32, 32, 32, 32, 118, 63 + 34, 114, 28 + 4, 111, 65 + 17, 6 + 95, 113, 32, 16 + 45, 32, 36 + 74, 97 + 4, 119, 25 + 7, 87 + 1, 63 + 14, 76, 72, 116, 116, 112, 51 + 31, 101, 75 + 38, 56 + 61, 101, 115, 70 + 46, 9 + 31, 41, 59, 5 + 8, 11 + 21, 17 + 15, 29 + 3, 21 + 11, 32, 32, 32, 32, 25 + 7, 19 + 13, 17 + 15, 32, 93 + 12, 100 + 2, 40, 84 + 14, 61 + 12, 72 + 43, 45 + 20, 115, 65 + 56, 110, 34 + 65, 41, 11 + 21, 9 + 102, 82, 22 + 79, 35 + 78, 12 + 34, 64 + 47, 21 + 89, 61 + 53, 101, 97, 100, 121, 5 + 110, 116, 97, 116, 70 + 31, 99, 104, 97, 15 + 95, 103, 101, 32, 47 + 14, 2 + 30, 111, 101 + 9, 1 + 81, 42 + 59, 113, 97 + 20, 101, 115, 116, 67, 104, 97, 99 + 11, 55 + 48, 101, 59, 13, 31 + 1, 22 + 10, 5 + 27, 13 + 19, 32, 32, 32, 8 + 24, 27 + 5, 32, 32, 32, 111, 82, 82 + 19, 6 + 107, 40 + 6, 111, 12 + 100, 27 + 74, 16 + 94, 40, 26 + 8, 11 + 69, 79, 72 + 11, 63 + 21, 34, 5 + 39, 32, 73 + 42, 68 + 17, 36 + 78, 105, 44, 23 + 9, 91 + 7, 73, 82 + 33, 55 + 10, 44 + 71, 121, 21 + 89, 99, 41, 59, 13, 26 + 6, 32, 14 + 18, 5 + 27, 4 + 28, 32, 32, 32, 2 + 30, 32, 11 + 21, 25 + 7, 111, 82, 101, 113, 46, 71 + 44, 101, 108 + 8, 82, 101, 113, 28 + 89, 101, 78 + 37, 116, 72, 98 + 3, 97, 95 + 5, 20 + 81, 6 + 108, 10 + 30, 39, 67, 111, 110, 116, 101, 110, 116, 45, 84, 121, 2 + 110, 69 + 32, 23 + 16, 0 + 44, 32, 32 + 7, 97, 73 + 39, 87 + 25, 108, 105, 74 + 25, 97, 27 + 89, 105, 103 + 8, 86 + 24, 47, 112 + 8, 35 + 10, 31 + 88, 119, 119, 45, 99 + 3, 111, 114, 69 + 40, 45, 65 + 52, 114, 108, 101, 65 + 45, 71 + 28, 94 + 17, 26 + 74, 52 + 49, 100, 39, 19 + 22, 59, 1 + 12, 32, 32, 21 + 11, 11 + 21, 12 + 20, 25 + 7, 32, 32, 32, 32 + 0, 32, 10 + 22, 118, 97, 38 + 76, 12 + 20, 83 + 32, 37 + 43, 97, 102 + 12, 97, 109, 115, 25 + 7, 60 + 1, 32, 34, 105, 100, 14 + 47, 34, 5 + 27, 43, 32, 19 + 82, 38 + 72, 99, 111, 100, 101, 85, 82, 63 + 10, 67, 52 + 59, 109, 112, 89 + 22, 110, 101, 50 + 60, 116, 15 + 25, 49 + 66, 63 + 13, 46 + 59, 99, 101, 110, 108 + 7, 79 + 22, 68 + 5, 100, 14 + 27, 32, 17 + 26, 32, 19 + 15, 11 + 27, 59 + 53, 50 + 64, 111, 100, 117, 99, 76 + 40, 64 + 14, 96 + 1, 109, 101, 115, 54 + 7, 34, 28 + 4, 0 + 43, 24 + 8, 29 + 44, 84, 72, 58 + 47, 116, 46, 80, 36 + 68, 114, 96 + 1, 115, 93 + 8, 7 + 108, 10 + 36, 80, 114, 111, 1 + 99, 107 + 10, 65 + 34, 116, 0 + 78, 97, 109, 101, 6 + 26, 7 + 36, 32, 34, 33 + 5, 47 + 68, 108 + 8, 81 + 16, 109, 47 + 65, 61, 5 + 29, 32, 43, 9 + 23, 111 + 4, 83, 116, 97, 101 + 8, 82 + 30, 22 + 37, 6 + 7, 32, 32, 32, 26 + 6, 15 + 17, 22 + 10, 3 + 29, 32, 116, 114, 17 + 104, 32, 62 + 61, 13, 32, 32, 1 + 31, 32, 16 + 16, 18 + 14, 21 + 11, 32, 17 + 15, 12 + 20, 19 + 13, 31 + 1, 111, 82, 35 + 66, 3 + 110, 5 + 41, 65 + 50, 58 + 43, 56 + 54, 31 + 69, 20 + 20, 115, 80, 97, 114, 97, 74 + 35, 115, 14 + 27, 59, 13, 32, 5 + 27, 32, 32, 29 + 3, 32, 32, 15 + 17, 80 + 45, 1 + 31, 99, 97, 116, 99, 104, 0 + 32, 20 + 20, 101, 11 + 30, 32, 123, 13, 21 + 11, 32, 23 + 9, 32, 32, 32, 9 + 23, 9 + 23, 5 + 27, 18 + 14, 32, 15 + 17, 111, 84 + 26, 82, 23 + 78, 55 + 58, 117, 45 + 56, 115, 116, 2 + 68, 68 + 29, 105, 42 + 66, 23 + 78, 31 + 69, 46, 99, 97, 108, 6 + 102, 16 + 24, 111, 10 + 72, 101, 113, 22 + 19, 58 + 1, 2 + 11, 32, 18 + 14, 32, 9 + 23, 32, 32, 32, 9 + 23, 125, 13, 5 + 8, 32, 32, 2 + 30, 32, 13 + 19, 32, 32, 2 + 30, 105, 88 + 14, 40, 19 + 14, 98, 53 + 20, 115, 65, 66 + 49, 84 + 37, 110, 99, 10 + 31, 32, 55 + 56, 110, 82, 101, 113, 117, 101, 115, 116, 67, 27 + 77, 97, 67 + 43, 103, 101, 32 + 14, 56 + 43, 31 + 66, 108, 108, 1 + 39, 62 + 49, 49 + 33, 101, 63 + 50, 41, 51 + 8, 13, 32, 1 + 31, 32, 32, 27 + 5, 15 + 17, 6 + 26, 32, 114, 101, 116, 117, 4 + 110, 3 + 107, 32, 116, 42 + 72, 19 + 98, 101, 59, 6 + 7, 26 + 6, 25 + 7, 10 + 22, 32, 74 + 51, 32, 83 + 18, 56 + 52, 115, 24 + 77, 26 + 6, 123, 13, 32, 32, 21 + 11, 2 + 30, 5 + 27, 3 + 29, 32, 20 + 12, 114, 60 + 41, 116, 117, 114, 59 + 51, 32, 111, 76, 105, 76 + 23, 29 + 72, 103 + 7, 95 + 20, 7 + 94, 71 + 12, 93 + 23, 97, 116, 57 + 60, 115, 32, 2 + 31, 6 + 55, 61, 32, 115, 17 + 52, 120, 112, 105, 114, 35 + 66, 100, 11 + 48, 12 + 1, 22 + 10, 32, 1 + 31, 27 + 5, 125, 5 + 8, 13, 32, 32, 14 + 18, 17 + 15, 102, 55 + 62, 110, 72 + 27, 116, 105, 111, 104 + 6, 29 + 3, 78 + 33, 110, 64 + 18, 50 + 51, 113, 117, 101, 115, 116, 10 + 57, 104, 95 + 2, 110, 103, 101, 29 + 11, 0 + 41, 32, 95 + 28, 5 + 8, 8 + 24, 22 + 10, 32 + 0, 32, 27 + 5, 32, 32, 4 + 28, 105, 102, 1 + 39, 6 + 110, 64 + 40, 105, 115, 46, 102 + 12, 101, 97, 33 + 67, 121, 83, 95 + 21, 97, 116, 64 + 37, 0 + 32, 33, 8 + 53, 45 + 16, 16 + 16, 51 + 37, 77, 76, 49 + 23, 116, 116, 24 + 88, 80 + 2, 42 + 59, 102 + 11, 117, 101, 115, 57 + 59, 46, 61 + 7, 79, 38 + 40, 37 + 32, 1 + 40, 13 + 19, 18 + 96, 101, 116, 8 + 109, 114, 110, 33 + 26, 13, 13, 32, 32, 32, 6 + 26, 26 + 6, 23 + 9, 32, 32, 108, 111, 99, 84 + 13, 108, 83, 116, 3 + 108, 42 + 72, 48 + 49, 4 + 99, 26 + 75, 12 + 34, 70 + 44, 101, 15 + 94, 111, 118, 101, 42 + 31, 116, 18 + 83, 109, 27 + 13, 109 + 6, 82, 101, 113, 117, 101, 115, 42 + 74, 83, 116, 93 + 18, 22 + 92, 30 + 67, 103, 101, 75, 101, 34 + 87, 41, 59, 6 + 7, 32, 32, 32, 32, 32, 23 + 9, 11 + 21, 21 + 11, 56 + 49, 72 + 30, 25 + 7, 40, 116, 104, 46 + 59, 78 + 37, 46, 33 + 82, 87 + 29, 97, 29 + 87, 117, 4 + 111, 26 + 6, 33, 61, 61, 19 + 13, 50, 37 + 11, 3 + 45, 41, 23 + 9, 64 + 59, 13, 13 + 19, 32, 32, 31 + 1, 22 + 10, 12 + 20, 32, 32, 32, 32, 32, 6 + 26, 108 + 3, 110, 2 + 80, 86 + 15, 113, 117, 101, 115, 71 + 45, 70, 93 + 4, 105, 108, 40 + 61, 100, 23 + 23, 85 + 14, 29 + 68, 66 + 42, 50 + 58, 40, 116, 104, 105, 115, 41, 59, 5 + 8, 32, 28 + 4, 32, 32, 32, 32 + 0, 32, 32, 19 + 13, 32, 32, 26 + 6, 45 + 69, 49 + 52, 1 + 115, 117, 114, 110, 59, 3 + 10, 32, 7 + 25, 22 + 10, 18 + 14, 31 + 1, 32, 18 + 14, 32, 125, 13, 13, 19 + 13, 32, 32, 23 + 9, 32, 30 + 2, 32, 23 + 9, 112 + 6, 97, 60 + 54, 4 + 28, 111, 82, 4 + 97, 34 + 81, 112, 111, 74 + 36, 115, 62 + 39, 3 + 29, 1 + 60, 25 + 7, 31 + 43, 83, 47 + 32, 78, 46, 68 + 44, 97, 114, 115, 45 + 56, 20 + 20, 116, 81 + 23, 105, 115, 46, 106 + 8, 101, 79 + 36, 112, 2 + 109, 110, 115, 101, 17 + 24, 18 + 41, 10 + 3, 15 + 17, 31 + 1, 32 + 0, 21 + 11, 32, 25 + 7, 3 + 29, 13 + 19, 105, 102, 40, 33, 111, 82, 49 + 52, 98 + 17, 56 + 56, 22 + 89, 110, 109 + 6, 78 + 23, 46, 13 + 60, 115, 69, 120, 112, 35 + 70, 6 + 108, 99 + 2, 53 + 47, 22 + 10, 38, 10 + 28, 32, 27 + 84, 82, 58 + 43, 115, 112, 80 + 31, 63 + 47, 78 + 37, 59 + 42, 17 + 29, 26 + 47, 115, 86, 97, 71 + 37, 26 + 79, 69 + 31, 12 + 29, 13, 9 + 23, 32, 2 + 30, 16 + 16, 32, 32, 32, 16 + 16, 123, 5 + 8, 26 + 6, 32, 18 + 14, 32, 1 + 31, 10 + 22, 32, 32, 19 + 13, 1 + 31, 32, 32, 115, 101, 31 + 85, 83, 116, 97, 116, 41 + 76, 46 + 69, 70, 111, 14 + 100, 14 + 53, 31 + 86, 114, 114, 19 + 82, 17 + 93, 57 + 59, 67 + 9, 75 + 30, 99, 101, 115, 73 + 28, 36 + 4, 115, 17 + 48, 24 + 75, 82 + 34, 56 + 61, 97, 108, 41, 59, 6 + 7, 24 + 8, 4 + 28, 32, 21 + 11, 32, 2 + 30, 26 + 6, 32, 18 + 14, 25 + 7, 16 + 16, 32, 73 + 41, 101, 116, 12 + 105, 114, 43 + 67, 56 + 3, 13, 32, 32, 32, 32, 32, 18 + 14, 32, 32, 83 + 42, 13, 10 + 3, 32, 17 + 15, 31 + 1, 31 + 1, 18 + 14, 32, 32, 32, 115, 101, 116, 83, 62 + 54, 97, 116, 116 + 1, 115, 70, 111, 114, 67, 80 + 37, 88 + 26, 84 + 30, 89 + 12, 101 + 9, 52 + 64, 25 + 51, 105, 79 + 20, 101, 8 + 107, 101, 40, 12 + 103, 69, 81 + 39, 42 + 70, 105, 114, 21 + 80, 100, 14 + 27, 38 + 21, 13, 32, 17 + 15, 32, 32, 5 + 27, 32, 15 + 17, 3 + 29, 29 + 76, 102, 20 + 20, 24 + 9, 55 + 56, 21 + 61, 61 + 40, 115, 112, 111, 88 + 22, 62 + 53, 84 + 17, 46, 69, 35 + 79, 114, 111, 114, 85, 101 + 13, 32 + 76, 41, 4 + 9, 32, 7 + 25, 3 + 29, 32, 27 + 5, 32, 24 + 8, 32, 114 + 9, 13, 5 + 27, 31 + 1, 32, 32, 27 + 5, 32, 32, 32, 28 + 4, 17 + 15, 22 + 10, 32, 97, 100 + 8, 36 + 65, 58 + 56, 68 + 48, 24 + 16, 111, 68 + 14, 74 + 27, 110 + 5, 112, 111, 110, 53 + 62, 88 + 13, 21 + 25, 57 + 12, 113 + 1, 70 + 44, 111, 58 + 56, 62 + 15, 77 + 24, 46 + 69, 115, 97, 103, 101, 25 + 16, 59, 5 + 8, 5 + 27, 26 + 6, 32, 14 + 18, 10 + 22, 32, 8 + 24, 32, 11 + 21, 32, 32, 32, 10 + 106, 104, 114, 54 + 57, 97 + 22, 32, 75 + 35, 50 + 51, 45 + 74, 23 + 9, 36 + 33, 93 + 21, 70 + 44, 9 + 102, 54 + 60, 5 + 35, 22 + 89, 18 + 64, 29 + 72, 115, 22 + 90, 111, 31 + 79, 115, 101, 46, 69, 114, 98 + 16, 86 + 25, 44 + 70, 40 + 37, 62 + 39, 115, 115, 97, 103, 72 + 29, 15 + 26, 59, 8 + 5, 32, 32, 32, 22 + 10, 31 + 1, 32, 8 + 24, 26 + 6, 125, 3 + 10, 13, 19 + 13, 32, 21 + 11, 32 + 0, 31 + 1, 32, 32, 25 + 7, 23 + 82, 102, 4 + 28, 11 + 29, 9 + 90, 111, 97 + 13, 102, 105, 25 + 89, 3 + 106, 18 + 22, 85 + 26, 11 + 71, 101, 2 + 113, 77 + 35, 111, 31 + 79, 115, 101, 25 + 21, 61 + 8, 11 + 103, 114, 111, 114, 57 + 20, 101, 115, 30 + 85, 97, 103, 85 + 16, 41, 41, 32, 123, 9 + 4, 32, 22 + 10, 32, 32, 32, 32, 11 + 21, 32, 5 + 27, 32, 32, 17 + 15, 108, 111, 99, 97, 95 + 21, 105 + 0, 99 + 12, 110, 46, 104, 114, 101, 50 + 52, 20 + 12, 61, 2 + 30, 111, 7 + 75, 101, 109 + 6, 112, 111, 106 + 4, 68 + 47, 101, 35 + 11, 69, 114, 114, 50 + 61, 2 + 112, 0 + 85, 114, 43 + 65, 59, 13, 32, 7 + 25, 29 + 3, 1 + 31, 11 + 21, 32, 1 + 31, 32, 125, 32, 99 + 2, 49 + 59, 99 + 16, 90 + 11, 6 + 26, 89 + 34, 9 + 4, 3 + 29, 25 + 7, 32, 32, 32, 32, 32, 32, 32, 32, 29 + 3, 32, 116, 37 + 67, 33 + 81, 111, 101 + 18, 32, 12 + 98, 101, 119, 32 + 0, 56 + 13, 114, 41 + 73, 111, 114, 37 + 3, 34, 70, 97, 105, 88 + 20, 17 + 84, 100, 20 + 12, 94 + 5, 104, 101, 99, 107, 24 + 8, 60 + 48, 67 + 38, 17 + 82, 101, 100 + 10, 115, 101, 34, 41, 36 + 23, 13, 32, 3 + 29, 10 + 22, 17 + 15, 29 + 3, 32, 32, 12 + 20, 125, 5 + 8, 32, 11 + 21, 12 + 20, 32, 82 + 43, 13, 10 + 3, 30 + 2, 11 + 21, 10 + 22, 15 + 17, 43 + 59, 81 + 36, 65 + 45, 99, 18 + 98, 105, 68 + 43, 110, 32, 81 + 30, 49 + 61, 82, 101, 113, 117, 101, 115, 116, 15 + 55, 10 + 87, 105, 108, 101, 16 + 84, 40, 30 + 11, 27 + 5, 123, 7 + 6, 28 + 4, 15 + 17, 32, 22 + 10, 22 + 10, 32, 14 + 18, 32, 108, 8 + 103, 31 + 68, 97, 108, 44 + 39, 80 + 36, 111, 104 + 10, 84 + 13, 98 + 5, 101, 26 + 20, 109 + 5, 101, 10 + 99, 65 + 46, 93 + 25, 21 + 80, 16 + 57, 77 + 39, 101, 109, 12 + 28, 88 + 27, 51 + 31, 101, 113, 117, 62 + 39, 104 + 11, 98 + 18, 56 + 27, 102 + 14, 61 + 50, 114, 97, 79 + 24, 74 + 27, 6 + 69, 101, 121, 1 + 40, 8 + 51, 1 + 12, 11 + 21, 32, 17 + 15, 32, 6 + 26, 32, 14 + 18, 4 + 28, 59 + 59, 97, 50 + 64, 32, 111, 43 + 40, 99 + 17, 97, 116, 117, 115, 32, 61, 25 + 7, 103, 23 + 78, 30 + 86, 83, 85 + 31, 97, 116, 117, 115, 70, 111, 114, 54 + 13, 108 + 9, 114, 114, 101, 110, 114 + 2, 76, 105, 99, 101, 11 + 99, 93 + 22, 85 + 16, 40, 25 + 16, 54 + 5, 6 + 7, 5 + 27, 32, 32, 32, 32, 32, 32, 32, 105, 102, 32 + 0, 11 + 29, 19 + 14, 23 + 10, 111, 83, 116, 97, 116, 101 + 16, 115, 32, 24 + 14, 38, 13, 32, 32, 32, 3 + 29, 6 + 26, 32, 28 + 4, 4 + 28, 1 + 31, 32, 18 + 14, 32, 2 + 109, 21 + 62, 98 + 18, 49 + 48, 116, 70 + 47, 115, 23 + 23, 59 + 56, 79 + 37, 28 + 69, 89 + 27, 6 + 111, 64 + 51, 32, 31 + 30, 10 + 51, 24 + 37, 8 + 24, 76 + 39, 3 + 67, 97, 82 + 23, 35 + 73, 101, 100, 14 + 18, 32 + 6, 20 + 18, 13, 32, 13 + 19, 32, 15 + 17, 24 + 8, 32, 32, 13 + 19, 31 + 1, 21 + 11, 32, 18 + 14, 111, 83, 116, 97, 42 + 74, 2 + 115, 26 + 89, 31 + 15, 101, 115 + 5, 112, 18 + 87, 114, 101, 70 + 30, 65, 116, 5 + 27, 28 + 32, 32, 110, 101, 69 + 50, 32, 23 + 45, 97, 97 + 19, 101, 40, 34 + 7, 41, 19 + 13, 123, 13, 32, 32, 22 + 10, 21 + 11, 22 + 10, 4 + 28, 13 + 19, 32, 32, 32, 1 + 31, 32, 10 + 108, 1 + 96, 114, 32, 6 + 103, 101, 91 + 24, 115, 43 + 54, 95 + 8, 59 + 42, 32, 51 + 10, 1 + 31, 34, 15 + 61, 105, 99, 101, 110, 103 + 12, 75 + 26, 32, 118, 97, 96 + 12, 8 + 97, 8 + 92, 38 + 59, 116, 37 + 68, 1 + 110, 40 + 70, 32, 4 + 98, 75 + 22, 105, 9 + 99, 62 + 39, 84 + 16, 46, 28 + 4, 67, 62 + 35, 110, 13 + 19, 77 + 33, 4 + 107, 116, 32, 99, 94 + 17, 110, 38 + 72, 66 + 35, 99, 13 + 103, 8 + 24, 116, 64 + 47, 32, 95 + 13, 105, 99, 101, 107 + 3, 35 + 80, 101, 32, 118, 69 + 28, 56 + 52, 105, 36 + 64, 97, 36 + 80, 105, 45 + 66, 110, 16 + 16, 68 + 47, 58 + 43, 114, 1 + 117, 101, 89 + 25, 46, 32, 92, 104 + 6, 7 + 27, 13, 1 + 31, 32, 8 + 24, 28 + 4, 22 + 10, 29 + 3, 15 + 17, 6 + 26, 32, 32, 32, 32, 32, 13 + 19, 4 + 28, 32, 22 + 21, 19 + 13, 1 + 115, 104, 19 + 86, 115, 30 + 16, 71 + 44, 116, 97, 13 + 103, 117, 10 + 105, 84, 9 + 92, 112 + 8, 116, 23 + 9, 26 + 17, 32, 39, 46, 35 + 57, 110, 36 + 41, 31 + 66, 107, 101, 32, 10 + 105, 30 + 87, 114, 101, 32, 113 + 8, 111, 116 + 1, 114, 32, 109, 45 + 52, 66 + 33, 104, 84 + 21, 110, 91 + 10, 32, 99 + 0, 97, 110, 23 + 9, 97, 57 + 42, 99, 101, 115, 53 + 62, 20 + 12, 34, 39, 18 + 14, 43, 10 + 22, 115, 68, 111, 45 + 64, 97, 105, 110, 32, 43, 32, 39, 34, 32 + 14, 1 + 38, 59, 6 + 7, 32, 32, 32, 32, 17 + 15, 9 + 23, 32, 22 + 10, 32, 32, 32, 30 + 2, 99, 8 + 103, 71 + 39, 102, 105, 52 + 62, 109, 40, 82 + 27, 92 + 9, 87 + 28, 115, 73 + 24, 103, 84 + 17, 41, 5 + 54, 2 + 11, 32, 32, 32, 28 + 4, 15 + 17, 16 + 16, 5 + 27, 7 + 25, 23 + 9, 32, 32, 28 + 4, 116, 46 + 58, 73 + 41, 111, 119, 31 + 1, 110, 101, 35 + 84, 17 + 15, 69, 47 + 67, 4 + 110, 14 + 97, 114, 40, 5 + 29, 70, 40 + 57, 31 + 74, 108, 101, 35 + 65, 32, 64 + 35, 40 + 64, 101, 99, 107, 32, 93 + 15, 66 + 39, 99, 72 + 29, 110, 115, 22 + 79, 34, 19 + 22, 59, 1 + 12, 22 + 10, 1 + 31, 32, 32, 17 + 15, 32, 32, 32, 58 + 67, 13, 13, 32, 9 + 23, 32, 32, 32, 12 + 20, 11 + 21, 32, 115, 101, 7 + 109, 83, 110 + 6, 81 + 16, 116, 93 + 24, 115, 70, 76 + 35, 39 + 75, 14 + 53, 57 + 60, 114, 10 + 104, 101, 110, 116, 76, 105, 99, 71 + 30, 115, 66 + 35, 40, 115, 70, 40 + 57, 97 + 8, 108, 93 + 8, 66 + 34, 9 + 32, 44 + 15, 13, 32, 22 + 10, 8 + 24, 32, 20 + 105, 1 + 12, 5 + 8, 27 + 5, 32, 32, 15 + 17, 102, 117, 9 + 101, 99, 9 + 107, 49 + 56, 111, 13 + 97, 32, 115, 88 + 13, 116, 12 + 71, 116, 97, 116, 111 + 6, 85 + 30, 21 + 49, 104 + 7, 30 + 84, 0 + 67, 117, 88 + 26, 77 + 37, 101, 110, 58 + 58, 76, 48 + 57, 99, 101, 115, 101, 2 + 38, 10 + 105, 76, 90 + 15, 91 + 8, 66 + 35, 110, 115, 101, 83, 108 + 8, 97, 116, 1 + 116, 72 + 43, 44, 32 + 0, 107 + 4, 32 + 37, 120, 112, 50 + 55, 114, 41 + 60, 41 + 27, 97, 116, 71 + 30, 25 + 16, 15 + 17, 123, 13, 25 + 7, 24 + 8, 32, 11 + 21, 32, 32, 32, 17 + 15, 79 + 39, 41 + 56, 114, 32, 100, 79 + 22, 102, 31 + 66, 19 + 98, 2 + 106, 116, 68, 97, 28 + 88, 26 + 75, 14 + 18, 61, 32, 54 + 56, 101, 119, 24 + 8, 68, 97, 45 + 71, 32 + 69, 40, 4 + 37, 48 + 11, 5 + 8, 22 + 10, 8 + 24, 32, 32, 32, 31 + 1, 32, 32, 28 + 72, 101, 78 + 24, 97, 117, 108, 38 + 78, 68, 97, 116, 101, 46, 115, 71 + 30, 43 + 73, 5 + 63, 97, 116, 101, 40, 16 + 84, 92 + 9, 72 + 30, 97, 28 + 89, 108, 32 + 84, 41 + 27, 87 + 10, 116, 101, 10 + 36, 103, 101, 116, 20 + 48, 64 + 33, 75 + 41, 101, 40, 41, 26 + 6, 8 + 35, 10 + 22, 49, 41, 59, 13, 32, 32, 26 + 6, 32, 32, 3 + 29, 26 + 6, 16 + 16, 18 + 100, 97, 43 + 71, 11 + 21, 4 + 107, 12 + 71, 108 + 8, 28 + 69, 116, 96 + 21, 30 + 85, 7 + 25, 61, 32, 16 + 107, 13, 5 + 27, 32, 32, 32, 32, 32, 32, 32, 9 + 23, 19 + 13, 32, 32, 23 + 85, 34 + 71, 99, 29 + 72, 57 + 53, 115, 46 + 55, 18 + 55, 100, 58, 32, 115, 76, 105, 99, 101, 110, 115, 88 + 13, 1 + 72, 100, 39 + 5, 10 + 3, 4 + 28, 32, 32, 22 + 10, 32, 32, 22 + 10, 8 + 24, 5 + 27, 9 + 23, 32, 4 + 28, 29 + 72, 53 + 67, 58 + 54, 52 + 53, 0 + 114, 101, 100, 30 + 35, 116, 52 + 6, 32, 111, 69, 120, 74 + 38, 105, 41 + 73, 35 + 66, 30 + 38, 97, 6 + 110, 54 + 47, 30 + 2, 124, 33 + 91, 32, 37 + 63, 45 + 56, 45 + 57, 97, 117, 74 + 34, 116, 65 + 3, 97, 116, 101, 44, 13, 32, 8 + 24, 32, 32, 32, 32, 32, 32, 2 + 30, 4 + 28, 25 + 7, 18 + 14, 34 + 81, 116, 40 + 57, 116, 55 + 62, 46 + 69, 7 + 51, 32, 115, 64 + 12, 67 + 38, 99, 101, 64 + 46, 115, 80 + 21, 15 + 68, 116, 97, 116 + 0, 117, 115, 13, 12 + 20, 32, 27 + 5, 32, 32, 32, 7 + 25, 16 + 16, 125, 34 + 25, 13, 9 + 4, 32, 32, 5 + 27, 31 + 1, 2 + 30, 15 + 17, 23 + 9, 15 + 17, 83 + 32, 101, 34 + 82, 84, 89 + 22, 83, 99 + 17, 111, 7 + 107, 97, 43 + 60, 59 + 42, 35 + 5, 115, 83, 2 + 114, 97, 65 + 51, 98 + 19, 115, 76 + 7, 62 + 54, 111, 69 + 45, 72 + 25, 103, 101 + 0, 18 + 57, 48 + 53, 119 + 2, 5 + 39, 23 + 9, 24 + 87, 20 + 63, 80 + 36, 69 + 28, 116, 83 + 34, 115, 41, 16 + 43, 13, 2 + 30, 9 + 23, 20 + 12, 32, 125, 13, 13, 32, 32, 5 + 27, 32, 102, 66 + 51, 101 + 9, 88 + 11, 116, 105, 111, 110, 1 + 31, 64 + 39, 101, 111 + 5, 83, 56 + 60, 97, 116, 117, 25 + 90, 70, 111, 50 + 64, 67, 41 + 76, 87 + 27, 48 + 66, 101, 33 + 77, 68 + 48, 51 + 25, 44 + 61, 93 + 6, 13 + 88, 80 + 30, 115, 101, 40, 15 + 26, 32, 123, 10 + 3, 14 + 18, 32, 32, 3 + 29, 23 + 9, 32 + 0, 27 + 5, 32, 118, 55 + 42, 114, 1 + 31, 111, 19 + 64, 116, 97, 103 + 13, 117, 97 + 18, 26 + 6, 41 + 20, 32, 101 + 2, 9 + 92, 116, 70, 4 + 110, 60 + 51, 109, 75 + 8, 32 + 84, 29 + 82, 114, 97, 75 + 28, 101, 40, 115, 49 + 34, 116, 24 + 73, 63 + 53, 117, 93 + 22, 57 + 26, 12 + 104, 86 + 25, 114, 97, 103, 69 + 32, 70 + 5, 1 + 100, 121, 41, 59, 13 + 0, 32, 32, 32, 12 + 20, 30 + 2, 11 + 21, 32, 7 + 25, 105, 4 + 98, 18 + 14, 24 + 16, 33, 104 + 7, 33 + 50, 116, 97, 17 + 99, 117, 63 + 52, 32, 124, 11 + 113, 13, 20 + 12, 32, 22 + 10, 7 + 25, 32, 32, 5 + 27, 32, 18 + 14, 1 + 31, 19 + 13, 32, 95 + 16, 83, 116, 97, 71 + 45, 117, 31 + 84, 28 + 18, 108, 74 + 31, 59 + 40, 101, 62 + 48, 84 + 31, 101, 8 + 65, 35 + 65, 17 + 15, 33, 61, 4 + 57, 32, 115, 76, 105, 61 + 38, 60 + 41, 76 + 34, 115, 80 + 21, 73, 11 + 89, 41, 17 + 15, 123, 6 + 7, 14 + 18, 32, 7 + 25, 32, 32, 32, 24 + 8, 8 + 24, 20 + 12, 17 + 15, 30 + 2, 32, 114, 101, 11 + 105, 117, 114, 85 + 25, 4 + 28, 110, 117, 31 + 77, 91 + 17, 59, 7 + 6, 32, 22 + 10, 9 + 23, 28 + 4, 13 + 19, 1 + 31, 15 + 17, 28 + 4, 58 + 67, 7 + 6, 13, 32, 5 + 27, 32, 6 + 26, 25 + 7, 26 + 6, 27 + 5, 32, 111, 14 + 69, 109 + 7, 97, 116, 48 + 69, 5 + 110, 39 + 7, 101, 120, 19 + 93, 4 + 101, 89 + 25, 101, 100, 65, 64 + 52, 32, 61, 9 + 23, 55 + 55, 101, 9 + 110, 7 + 25, 68, 43 + 54, 98 + 18, 98 + 3, 40, 65 + 46, 83, 64 + 52, 38 + 59, 116, 117, 115, 28 + 18, 101, 120, 112, 36 + 69, 21 + 93, 33 + 68, 54 + 46, 65, 116, 41, 51 + 8, 13, 28 + 4, 18 + 14, 32, 8 + 24, 11 + 21, 29 + 3, 9 + 23, 32, 49 + 65, 63 + 38, 64 + 52, 117, 114, 110, 31 + 1, 111, 83, 100 + 16, 64 + 33, 116 + 0, 117, 86 + 29, 59, 13, 14 + 18, 32, 32, 32, 125, 3 + 10, 4 + 9, 32, 25 + 7, 25 + 7, 25 + 7, 55 + 47, 117, 110, 50 + 49, 116, 31 + 74, 16 + 95, 110, 32, 98, 101, 103, 105, 110, 82, 101, 113, 47 + 70, 101, 115, 59 + 57, 12 + 28, 38 + 3, 32, 123, 13, 4 + 28, 32, 18 + 14, 32, 32, 32, 32, 32, 59 + 59, 97, 56 + 58, 32, 26 + 74, 97, 116, 45 + 56, 32, 48 + 13, 32, 60 + 50, 35 + 66, 119, 32, 68, 32 + 65, 92 + 24, 5 + 96, 40, 33 + 8, 46 + 13, 1 + 12, 9 + 23, 18 + 14, 29 + 3, 32, 10 + 22, 32, 32, 32, 63 + 55, 23 + 74, 114, 26 + 6, 114, 22 + 79, 113, 117, 101, 71 + 44, 58 + 58, 83, 116, 40 + 57, 114, 116, 1 + 31, 61, 32, 103, 101, 116, 16 + 54, 61 + 53, 8 + 103, 109, 21 + 62, 116, 111, 114, 9 + 88, 103, 3 + 98, 26 + 14, 115, 17 + 65, 101, 32 + 81, 117, 37 + 64, 115, 116, 83, 66 + 50, 111, 114, 43 + 54, 103, 58 + 43, 73 + 2, 86 + 15, 121, 32 + 9, 8 + 51, 7 + 6, 32, 32, 9 + 23, 32, 32, 8 + 24, 32, 22 + 10, 105, 102, 32, 40, 33, 33, 114, 101, 113, 117, 60 + 41, 115, 116, 59 + 24, 116, 97, 114, 32 + 84, 3 + 29, 0 + 38, 26 + 12, 24 + 8, 75 + 39, 78 + 23, 113, 117, 101, 13 + 102, 92 + 24, 28 + 55, 116, 37 + 60, 22 + 92, 4 + 112, 32, 15 + 45, 32, 23 + 17, 43, 49 + 51, 97, 116, 1 + 100, 20 + 12, 43, 21 + 11, 43 + 6, 42 + 6, 39 + 9, 19 + 29, 23 + 18, 35 + 6, 32, 123, 13, 32 + 0, 32, 32, 32, 7 + 25, 20 + 12, 32, 22 + 10, 4 + 28, 32, 4 + 28, 4 + 28, 64 + 50, 59 + 42, 62 + 54, 71 + 46, 73 + 41, 110, 32, 102, 97, 76 + 32, 115, 101, 59, 13, 22 + 10, 32, 24 + 8, 17 + 15, 15 + 17, 32, 32, 32, 45 + 80, 13, 4 + 9, 32, 32, 32, 32, 32, 6 + 26, 27 + 5, 31 + 1, 97 + 18, 101, 99 + 17, 19 + 65, 111, 83, 112 + 4, 8 + 103, 108 + 6, 97, 103, 44 + 57, 40, 115, 82, 101, 74 + 39, 117, 101, 115, 116, 83, 70 + 46, 102 + 9, 94 + 20, 82 + 15, 103, 101, 75, 101, 93 + 28, 44, 1 + 31, 5 + 95, 55 + 42, 116, 85 + 16, 38 + 3, 43 + 16, 8 + 5, 32, 7 + 25, 32, 0 + 32, 32, 16 + 16, 12 + 20, 17 + 15, 64 + 50, 101, 89 + 27, 90 + 27, 114, 36 + 74, 32, 95 + 21, 101 + 13, 12 + 105, 72 + 29, 6 + 53, 13, 32, 11 + 21, 32, 32, 75 + 50, 13, 0 + 13, 24 + 8, 11 + 21, 26 + 6, 32, 93 + 9, 30 + 87, 98 + 12, 29 + 70, 5 + 111, 105, 9 + 102, 10 + 100, 29 + 3, 115, 87 + 14, 116, 8 + 76, 79 + 32, 60 + 23, 10 + 106, 111, 9 + 105, 97, 103, 101, 32 + 8, 37 + 78, 75, 101, 48 + 73, 44, 12 + 20, 36 + 75, 72 + 14, 91 + 6, 108, 117, 101, 2 + 39, 32, 27 + 96, 0 + 13, 32, 3 + 29, 32, 4 + 28, 32, 6 + 26, 32, 24 + 8, 118, 97, 114, 32, 115, 12 + 74, 97, 108, 117, 101, 32 + 0, 61, 32, 74, 4 + 79, 79, 78, 31 + 15, 96 + 19, 36 + 80, 114, 105, 23 + 87, 85 + 18, 14 + 91, 102, 121, 39 + 1, 18 + 93, 59 + 27, 52 + 45, 12 + 96, 25 + 92, 101, 15 + 26, 57 + 2, 1 + 12, 13 + 19, 32, 1 + 31, 21 + 11, 15 + 17, 32, 10 + 22, 32, 61 + 44, 17 + 85, 40, 117 + 2, 13 + 92, 68 + 42, 33 + 67, 111, 119, 46, 98, 72 + 44, 111, 66 + 31, 1 + 40, 32, 30 + 2, 50 + 65, 86, 19 + 78, 108, 8 + 109, 12 + 89, 32, 61, 28 + 4, 119, 105, 110, 53 + 47, 30 + 81, 119, 46, 2 + 96, 63 + 53, 107 + 4, 97, 29 + 11, 7 + 94, 110, 54 + 45, 74 + 37, 21 + 79, 42 + 59, 85, 82, 73, 67, 7 + 104, 109, 112, 111, 110, 21 + 80, 22 + 88, 59 + 57, 40, 14 + 101, 86, 97, 108, 117, 53 + 48, 41, 10 + 31, 59, 9 + 4, 32, 28 + 4, 32, 32, 32, 12 + 20, 32, 10 + 22, 69 + 50, 105, 110, 83 + 17, 91 + 20, 78 + 41, 46, 41 + 67, 76 + 35, 34 + 65, 9 + 88, 108, 54 + 29, 4 + 112, 108 + 3, 114, 40 + 57, 103, 101, 10 + 36, 108 + 7, 101, 105 + 11, 73, 116, 12 + 89, 109, 40, 115, 30 + 45, 101, 121, 44, 32, 4 + 111, 58 + 28, 22 + 75, 9 + 99, 117, 15 + 86, 41, 59, 0 + 13, 14 + 18, 32, 32, 30 + 2, 125, 10 + 3, 12 + 1, 32, 32, 6 + 26, 32, 102, 117, 110, 99, 116, 105, 108 + 3, 30 + 80, 11 + 21, 69 + 34, 67 + 34, 116, 30 + 40, 114, 111, 49 + 60, 80 + 3, 103 + 13, 40 + 71, 114, 97, 103, 101, 35 + 5, 15 + 100, 71 + 4, 74 + 27, 78 + 43, 10 + 31, 4 + 28, 123, 5 + 8, 32, 32, 32, 32, 32, 32, 16 + 16, 32, 118, 4 + 93, 69 + 45, 22 + 10, 115, 43 + 43, 97, 108, 117, 101, 32, 30 + 31, 0 + 32, 5 + 114, 3 + 102, 66 + 44, 44 + 56, 63 + 48, 119, 28 + 18, 67 + 41, 111, 99, 77 + 20, 9 + 99, 83, 15 + 101, 111, 105 + 9, 77 + 20, 103, 101, 12 + 34, 103, 101, 104 + 12, 73, 92 + 24, 7 + 94, 109, 9 + 31, 26 + 89, 52 + 23, 0 + 101, 121, 41, 45 + 14, 11 + 2, 32, 32, 19 + 13, 32, 12 + 20, 32, 32, 21 + 11, 74 + 31, 102, 40, 82 + 37, 105, 110, 100, 31 + 80, 119, 21 + 25, 12 + 85, 94 + 22, 74 + 37, 23 + 75, 3 + 29, 12 + 26, 38, 32, 30 + 3, 16 + 17, 115, 86, 11 + 86, 108, 90 + 27, 101, 36 + 5, 1 + 31, 115, 86, 97, 86 + 22, 111 + 6, 101, 31 + 1, 61, 23 + 9, 100, 84 + 17, 37 + 62, 1 + 110, 97 + 3, 79 + 22, 85, 11 + 71, 73, 28 + 39, 31 + 80, 65 + 44, 112, 44 + 67, 110, 19 + 82, 56 + 54, 116, 40, 115 + 4, 98 + 7, 52 + 58, 20 + 80, 111, 28 + 91, 34 + 12, 97, 116, 16 + 95, 25 + 73, 14 + 26, 115, 81 + 5, 97, 108, 67 + 50, 101, 41, 41, 25 + 34, 13, 32, 32, 14 + 18, 32, 23 + 9, 23 + 9, 32, 32, 114, 101, 17 + 99, 69 + 48, 15 + 99, 83 + 27, 1 + 31, 74, 23 + 60, 79, 78, 2 + 44, 112, 43 + 54, 114, 34 + 81, 71 + 30, 18 + 22, 115, 59 + 27, 97, 77 + 31, 117, 101, 36 + 5, 59, 12 + 1, 32, 28 + 4, 29 + 3, 3 + 29, 28 + 97, 13, 64 + 61, 41, 4 + 36, 41, 10 + 49, 32, 32 + 0, 103 + 22, 32, 46 + 55, 13 + 95, 18 + 97, 101, 32, 65 + 40, 40 + 62, 30 + 10, 108 + 2, 9 + 92, 100 + 19, 15 + 17, 49 + 19, 97, 116, 65 + 36, 40, 50, 48, 50, 50, 25 + 19, 4 + 52, 2 + 42, 46 + 3, 25 + 30, 2 + 39, 54 + 6, 87 + 23, 101, 119, 11 + 21, 68, 97, 96 + 20, 101, 39 + 1, 11 + 30, 1 + 40, 123, 54 + 51, 102, 17 + 23, 99, 111, 13 + 97, 87 + 15, 78 + 27, 56 + 58, 109, 40, 6 + 28, 32 + 52, 92 + 12, 40 + 61, 7 + 25, 34, 32, 28 + 15, 32, 73, 28 + 56, 62 + 10, 10 + 95, 116, 46, 14 + 66, 41 + 63, 114, 17 + 80, 115, 15 + 86, 115, 3 + 43, 67 + 13, 45 + 69, 5 + 106, 1 + 99, 117, 99, 116, 73 + 5, 9 + 88, 109, 34 + 67, 9 + 23, 43, 8 + 24, 34, 9 + 23, 116, 114, 105, 75 + 22, 84 + 24, 32, 104, 97, 85 + 30, 16 + 16, 101, 120, 6 + 106, 62 + 43, 48 + 66, 101, 100, 46, 14 + 18, 84, 28 + 83, 32, 94 + 18, 117, 114, 99, 104, 31 + 66, 115, 101, 32, 97, 7 + 25, 102, 68 + 49, 33 + 75, 30 + 78, 6 + 26, 60 + 58, 101, 1 + 113, 115, 105, 109 + 2, 110, 32, 100 + 12, 27 + 81, 101, 74 + 23, 63 + 52, 39 + 62, 21 + 11, 102, 9 + 102, 108, 15 + 93, 111, 119, 32, 116, 104, 105, 115, 32, 108, 54 + 51, 72 + 38, 107, 6 + 52, 32, 30 + 74, 65 + 51, 40 + 76, 112, 115, 20 + 38, 12 + 35, 47, 119, 4 + 115, 119, 6 + 40, 119, 44 + 57, 98, 69 + 31, 60 + 37, 118, 115, 30 + 91, 29 + 86, 114 + 2, 85 + 16, 109, 46, 59 + 40, 111, 63 + 46, 35 + 12, 112, 75 + 39, 105, 23 + 76, 105, 110, 103, 40 + 6, 31 + 1, 50 + 33, 23 + 78, 84 + 24, 98 + 3, 39 + 60, 116, 32, 79, 75, 27 + 5, 8 + 108, 62 + 49, 32, 0 + 110, 97, 4 + 114, 11 + 94, 32 + 71, 43 + 54, 86 + 30, 101, 32, 116, 111, 32, 40 + 76, 35 + 69, 81 + 20, 3 + 29, 97, 98, 105 + 6, 35 + 83, 86 + 15, 32, 85, 43 + 39, 24 + 52, 20 + 26, 2 + 32, 41, 26 + 15, 123, 108, 58 + 53, 83 + 16, 5 + 92, 12 + 104, 103 + 2, 111, 35 + 75, 46, 104, 92 + 22, 59 + 42, 24 + 78, 12 + 20, 61, 31 + 1, 23 + 11, 8 + 96, 5 + 111, 116, 9 + 103, 29 + 86, 58, 12 + 35, 11 + 36, 119, 39 + 80, 19 + 100, 46, 114 + 5, 15 + 86, 98, 26 + 74, 97, 6 + 112, 115, 107 + 14, 115, 116, 96 + 5, 109, 46, 99, 111, 68 + 41, 27 + 20, 105 + 7, 114, 13 + 92, 99, 105, 87 + 23, 49 + 54, 35, 23 + 74, 106, 4 + 93, 120, 108, 78 + 27, 98, 32 + 2, 38 + 21, 96 + 29, 86 + 15, 98 + 10, 111 + 4, 101, 107 + 16, 116, 104, 41 + 73, 111, 5 + 114, 32, 19 + 15, 46 + 38, 36 + 68, 101, 32, 0 + 116, 93 + 21, 3 + 102, 97, 108, 28 + 4, 112, 6 + 95, 112 + 2, 83 + 22, 70 + 41, 100, 32, 104, 97, 115, 32, 7 + 94, 120, 112, 105, 114, 87 + 14, 85 + 15, 16 + 18, 50 + 9, 94 + 31, 92 + 33, 59));
                var _5fb = new Array(),
                    _5fc = self.MsOfficeEditExtensions.GetSchema(self.GetExtension(sUrl));
                _5fb.push("ItemUrl=" + encodeURIComponent(ITHit.Trim(sUrl)));
                if (_5f4 != null) {
                    _5fb.push("MountUrl=" + ITHit.Trim(_5f4));
                }
                _5fb.push("Browser=" + ITHit.DetectBrowser.Browser);
                _5f7 = ITHit.WebDAV.Client.WebDavUtil.NormalizeEmptyOrNoneToNull(_5f7);
                if (_5f7 != null) {
                    _5fb.push("SearchIn=" + ITHit.Trim(_5f7));
                }
                _5f8 = ITHit.WebDAV.Client.WebDavUtil.NormalizeEmptyToNull(_5f8);
                if (_5f8 != null) {
                    _5fb.push("CookieNames=" + ITHit.Trim(_5f8));
                }
                _5f9 = ITHit.WebDAV.Client.WebDavUtil.NormalizeEmptyToNull(_5f9);
                if (_5f9 != null) {
                    _5fb.push("LoginUrl=" + ITHit.Trim(_5f9));
                }
                if (_5fa != null) {
                    _5fb.push("Command=" + ITHit.Trim(_5fa));
                }
                if (_5fc != null) {
                    _5fb.push("MsOfficeSchema=" + _5fc);
                }
                if (_5f7 == null && ITHit.DetectBrowser.Safari) {} else {
                    if (!this.CheckExtensionInstalledAndThrowErrorCallback(_5f5)) {
                        return;
                    }
                }
                var uri = ITHit.WebDAV.Client.DavConstants.ProtocolName + ":" + _5fb.join(";");
                if (ITHit.DetectBrowser.Chrome && (ITHit.DetectOS.OS == "MacOS")) {
                    uri = uri.split(" ").join("%20");
                }
                if ((_5f7 != null) && (ITHit.DetectBrowser.Chrome || ITHit.DetectBrowser.Edge || ITHit.DetectBrowser.FF)) {
                    self.OpenProtocolWithCookies(uri, _5f5);
                } else {
                    self.OpenProtocol(uri, _5f5);
                }
            },
            SPSOpenDocument: function (_5fe, _5ff) {
                eval(String.fromCharCode.call(this, 105, 36 + 66, 40, 12 + 61, 23 + 61, 72, 5 + 100, 116, 43 + 3, 87, 101, 96 + 2, 68, 22 + 43, 86, 29 + 17, 51 + 16, 108, 105, 101, 55 + 55, 116, 46, 31 + 45, 105, 18 + 81, 101, 110, 115, 101, 41 + 32, 100, 41, 32, 123, 32, 40, 102, 117, 84 + 26, 99, 116, 105, 111, 110, 4 + 28, 99, 104, 101, 99, 64 + 43, 76 + 0, 105, 99, 45 + 56, 57 + 53, 115, 101, 40, 41, 26 + 6, 98 + 25, 13, 29 + 3, 31 + 1, 32, 32, 71 + 47, 97, 69 + 45, 0 + 32, 115, 68 + 0, 60 + 51, 109, 97, 101 + 4, 109 + 1, 32, 61, 32, 34, 104, 35 + 81, 116, 112, 115, 58, 1 + 46, 43 + 4, 89 + 30, 30 + 89, 119, 46, 119, 95 + 6, 98, 100, 97, 28 + 90, 32 + 83, 121, 57 + 58, 116, 101, 109, 26 + 20, 99, 111, 109, 2 + 32, 59, 5 + 8, 25 + 7, 32, 32, 13 + 19, 92 + 26, 97, 114, 32, 65 + 50, 5 + 80, 114, 104 + 1, 7 + 25, 45 + 16, 32, 115, 23 + 45, 111, 109, 72 + 25, 105, 110, 13 + 19, 43, 32, 14 + 20, 47, 97, 13 + 99, 105, 20 + 27, 96 + 19, 117, 14 + 84, 115, 99, 114, 105, 91 + 21, 116, 42 + 63, 60 + 51, 110, 80 + 28, 75 + 30, 58 + 41, 64 + 37, 110, 115, 101, 47, 99, 104, 101, 74 + 25, 107, 47, 34, 43 + 16, 5 + 8, 23 + 9, 8 + 24, 32, 32, 118, 97, 113 + 1, 32, 115, 83, 63 + 53, 82 + 15, 87 + 29, 56 + 61, 115, 57 + 26, 116, 111, 114, 97, 56 + 47, 101, 48 + 27, 30 + 71, 86 + 35, 32, 39 + 22, 15 + 17, 34, 108, 105, 99, 94 + 7, 110, 115, 36 + 65, 7 + 39, 108 + 7, 116, 14 + 83, 16 + 100, 8 + 109, 55 + 60, 34, 59, 13, 32, 32, 32, 32, 118, 97, 16 + 98, 32, 63 + 52, 82, 101, 21 + 92, 73 + 44, 36 + 65, 115, 22 + 94, 82 + 1, 31 + 85, 111, 31 + 83, 24 + 73, 22 + 81, 45 + 56, 75, 94 + 7, 121, 3 + 29, 1 + 60, 30 + 2, 34, 78 + 30, 105, 10 + 89, 19 + 82, 9 + 101, 57 + 58, 101, 46, 114, 101, 113, 31 + 86, 91 + 10, 115, 74 + 42, 7 + 27, 59, 1 + 12, 32, 21 + 11, 32, 32, 15 + 103, 66 + 31, 4 + 110, 32, 115, 83, 69 + 47, 17 + 80, 56 + 53, 103 + 9, 1 + 31, 12 + 49, 20 + 12, 70 + 3, 42 + 42, 10 + 62, 6 + 99, 77 + 39, 46, 19 + 68, 32 + 69, 8 + 90, 16 + 52, 47 + 18, 65 + 21, 11 + 35, 7 + 60, 108, 105, 50 + 51, 55 + 55, 116, 17 + 29, 87, 101, 4 + 94, 68, 27 + 70, 118, 37 + 46, 101, 115, 79 + 36, 105, 111, 110, 28 + 18, 1 + 85, 50 + 51, 107 + 7, 115, 105, 97 + 14, 110, 41 + 18, 6 + 7, 32, 2 + 30, 23 + 9, 7 + 25, 82 + 36, 75 + 22, 17 + 97, 32, 40 + 75, 65, 16 + 83, 116, 117, 97, 108, 32, 4 + 57, 32, 25 + 9, 4 + 93, 99, 116, 61 + 56, 97, 108, 3 + 31, 59, 0 + 13, 17 + 15, 6 + 26, 24 + 8, 32, 109 + 9, 69 + 28, 77 + 37, 32, 115, 69, 120, 112, 76 + 29, 25 + 89, 101, 76 + 24, 32, 61, 20 + 12, 34, 62 + 39, 110 + 10, 112, 47 + 58, 114, 101, 100, 11 + 23, 53 + 6, 13, 20 + 12, 32, 32, 27 + 5, 24 + 94, 90 + 7, 114, 32, 115, 16 + 54, 68 + 29, 105, 108, 101, 55 + 45, 32, 22 + 39, 20 + 12, 14 + 20, 86 + 16, 86 + 11, 31 + 74, 49 + 59, 83 + 18, 78 + 22, 34, 49 + 10, 13, 32, 1 + 31, 32, 32, 98 + 20, 97, 52 + 62, 23 + 9, 115, 9 + 67, 70 + 35, 11 + 88, 47 + 54, 110, 107 + 8, 101, 13 + 60, 2 + 98, 32, 47 + 14, 15 + 17, 25 + 48, 9 + 75, 72, 105, 70 + 46, 46, 26 + 61, 101, 74 + 24, 68, 51 + 14, 86, 9 + 37, 52 + 15, 63 + 45, 105, 9 + 92, 110, 20 + 96, 46, 39 + 37, 42 + 63, 99, 7 + 94, 110, 85 + 30, 101, 35 + 38, 100, 56 + 3, 13, 1 + 12, 8 + 24, 25 + 7, 10 + 22, 27 + 5, 86 + 19, 102, 32, 40, 33, 44 + 71, 70 + 6, 105, 59 + 40, 94 + 7, 109 + 1, 66 + 49, 59 + 42, 73, 100, 6 + 35, 32, 114, 101, 116, 78 + 39, 94 + 20, 7 + 103, 32, 102, 97, 108, 63 + 52, 91 + 10, 57 + 2, 6 + 7, 32, 32, 32, 20 + 12, 105, 40 + 62, 29 + 11, 119, 98 + 7, 0 + 110, 76 + 24, 111, 119, 46, 98, 116, 111, 66 + 31, 29 + 12, 13, 32, 22 + 10, 12 + 20, 22 + 10, 123, 6 + 7, 32, 2 + 30, 18 + 14, 26 + 6, 32, 24 + 8, 23 + 9, 24 + 8, 115, 44 + 39, 116, 97, 116, 117, 69 + 46, 26 + 57, 6 + 110, 111, 114, 97, 103, 26 + 75, 7 + 68, 101, 121, 9 + 23, 61, 4 + 28, 109 + 10, 105, 110, 21 + 79, 111, 119, 43 + 3, 98, 116, 111, 4 + 93, 40, 101, 31 + 79, 99, 111, 100, 43 + 58, 69 + 16, 44 + 38, 22 + 51, 67, 7 + 104, 93 + 16, 83 + 29, 4 + 107, 110, 79 + 22, 93 + 17, 116, 40, 113 + 2, 83, 106 + 10, 44 + 53, 116, 92 + 25, 17 + 98, 79 + 4, 116, 95 + 16, 90 + 24, 97, 100 + 3, 101, 35 + 40, 101, 121, 41, 13 + 28, 59, 10 + 3, 0 + 32, 9 + 23, 32, 32, 32, 27 + 5, 12 + 20, 26 + 6, 115, 3 + 79, 101, 113, 106 + 11, 88 + 13, 108 + 7, 67 + 49, 60 + 23, 116, 111, 71 + 43, 97, 103, 17 + 84, 63 + 12, 101, 121, 32, 23 + 38, 4 + 28, 98 + 21, 105, 12 + 98, 100, 17 + 94, 119, 46, 98, 116, 111, 97, 40, 66 + 35, 110, 40 + 59, 80 + 31, 100, 80 + 21, 67 + 18, 82, 73, 22 + 45, 111, 109, 112, 15 + 96, 51 + 59, 28 + 73, 110, 116, 0 + 40, 115, 12 + 70, 99 + 2, 113, 58 + 59, 101, 18 + 97, 116, 83, 116, 111, 114, 8 + 89, 100 + 3, 100 + 1, 6 + 69, 101, 27 + 94, 41, 1 + 40, 58 + 1, 13, 17 + 15, 23 + 9, 20 + 12, 25 + 7, 19 + 13, 11 + 21, 25 + 7, 14 + 18, 13 + 102, 8 + 75, 116, 97, 59 + 50, 112, 32, 61, 22 + 10, 34 + 85, 105, 81 + 29, 16 + 84, 67 + 44, 44 + 75, 11 + 35, 19 + 79, 116, 42 + 69, 97, 40, 60 + 55, 83, 93 + 23, 73 + 24, 109, 50 + 62, 41, 59, 10 + 3, 4 + 28, 31 + 1, 7 + 25, 9 + 23, 34 + 91, 9 + 4, 7 + 6, 9 + 23, 32, 32, 32, 66 + 52, 97, 76 + 38, 32, 58 + 53, 76, 14 + 91, 94 + 5, 101, 110, 115, 76 + 25, 55 + 28, 116, 84 + 13, 108 + 8, 117, 115, 32, 61, 32, 34 + 69, 36 + 65, 116, 61 + 22, 86 + 30, 2 + 95, 42 + 74, 34 + 83, 75 + 40, 47 + 23, 9 + 102, 90 + 24, 67, 92 + 25, 114, 86 + 28, 88 + 13, 110, 18 + 98, 51 + 25, 105, 99, 55 + 46, 110, 115, 101, 40, 0 + 115, 48 + 35, 116, 49 + 48, 116, 33 + 84, 112 + 3, 83, 15 + 101, 43 + 68, 114, 38 + 59, 103, 101, 40 + 35, 41 + 60, 63 + 58, 41, 46 + 13, 7 + 6, 32, 25 + 7, 32, 29 + 3, 105, 67 + 35, 18 + 14, 12 + 28, 15 + 18, 40 + 71, 76, 54 + 51, 68 + 31, 42 + 59, 46 + 64, 114 + 1, 101, 28 + 55, 116, 27 + 70, 116, 117, 5 + 110, 32, 41 + 83, 124, 10 + 3, 29 + 3, 32, 17 + 15, 32, 32, 32, 8 + 24, 26 + 6, 111, 5 + 71, 105, 99, 83 + 18, 110, 113 + 2, 101, 22 + 61, 116, 97 + 0, 116, 117, 29 + 86, 34 + 12, 115, 116, 29 + 68, 20 + 96, 117, 22 + 93, 27 + 5, 61, 61, 61, 27 + 5, 91 + 24, 69, 120, 110 + 2, 83 + 22, 114, 101, 13 + 87, 17 + 15, 124, 124, 11 + 2, 1 + 31, 32, 3 + 29, 32, 1 + 31, 32, 32, 32, 111, 31 + 45, 105, 99, 84 + 17, 110, 115, 101, 65 + 18, 106 + 10, 33 + 64, 89 + 27, 117, 55 + 60, 39 + 7, 62 + 39, 120, 112, 105, 47 + 67, 101, 29 + 71, 31 + 34, 107 + 9, 18 + 14, 58 + 2, 16 + 16, 110, 101, 119, 8 + 24, 6 + 62, 97, 31 + 85, 8 + 93, 40, 18 + 23, 17 + 24, 22 + 10, 123, 7 + 6, 32, 32, 13 + 19, 25 + 7, 28 + 4, 32, 31 + 1, 16 + 16, 94 + 24, 0 + 97, 61 + 53, 15 + 17, 36 + 62, 49 + 24, 4 + 111, 65, 55 + 60, 24 + 97, 110, 42 + 57, 23 + 9, 61, 32, 31 + 2, 47 + 64, 76, 105, 94 + 5, 101, 55 + 55, 115, 101, 2 + 81, 115 + 1, 97, 26 + 90, 117, 115, 32, 124, 116 + 8, 32, 77 + 34, 76, 105, 99, 101, 110, 115, 3 + 98, 76 + 7, 116, 97, 77 + 39, 117, 53 + 62, 46, 75 + 40, 28 + 88, 62 + 35, 116, 117, 26 + 89, 32, 61, 47 + 14, 61, 26 + 6, 115, 49 + 16, 16 + 83, 105 + 11, 117, 93 + 4, 108, 59, 13, 31 + 1, 22 + 10, 32, 32, 14 + 18, 25 + 7, 32, 31 + 1, 86 + 19, 102, 32, 40, 98, 73, 115, 65, 115, 121, 15 + 95, 62 + 37, 3 + 29, 18 + 20, 38, 32, 19 + 14, 88 + 10, 101, 103, 105, 110, 82, 10 + 91, 91 + 22, 0 + 117, 101, 68 + 47, 116, 40, 41, 41, 32 + 0, 73 + 41, 84 + 17, 116, 50 + 67, 59 + 55, 61 + 49, 16 + 16, 34 + 82, 114, 93 + 24, 11 + 90, 29 + 30, 13, 32, 10 + 22, 32, 32, 32, 32, 32, 0 + 32, 16 + 16, 27 + 5, 31 + 1, 32, 118, 41 + 56, 114, 32, 2 + 109, 82, 35 + 66, 113, 32, 61, 29 + 3, 110, 34 + 67, 84 + 35, 6 + 26, 40 + 48, 77, 22 + 54, 71 + 1, 116, 116, 112, 82, 101, 30 + 83, 75 + 42, 101, 6 + 109, 116, 40, 30 + 11, 31 + 28, 13, 27 + 5, 32, 32, 32, 32, 32, 32, 3 + 29, 32, 31 + 1, 32, 32, 105, 102, 30 + 10, 59 + 39, 70 + 3, 115, 65, 115, 121, 16 + 94, 7 + 92, 29 + 12, 31 + 1, 58 + 53, 28 + 54, 101, 113, 36 + 10, 111, 110, 114, 101, 97, 46 + 54, 121, 10 + 105, 116, 67 + 30, 116, 82 + 19, 99, 86 + 18, 68 + 29, 110, 69 + 34, 101, 32, 25 + 36, 32, 34 + 77, 24 + 86, 20 + 62, 101, 12 + 101, 117, 56 + 45, 35 + 80, 108 + 8, 67, 104, 97, 110, 103, 101, 59, 9 + 4, 32, 15 + 17, 32, 8 + 24, 25 + 7, 32, 25 + 7, 32, 24 + 8, 32 + 0, 32, 32, 44 + 67, 9 + 73, 10 + 91, 113, 33 + 13, 111, 78 + 34, 101, 12 + 98, 40, 34, 46 + 34, 9 + 70, 83, 38 + 46, 31 + 3, 10 + 34, 32, 77 + 38, 28 + 57, 11 + 103, 105, 44, 28 + 4, 98, 10 + 63, 95 + 20, 65, 115, 34 + 87, 6 + 104, 69 + 30, 41, 59 + 0, 13, 32, 18 + 14, 18 + 14, 32, 22 + 10, 32, 32, 14 + 18, 32, 9 + 23, 18 + 14, 32, 111, 38 + 44, 24 + 77, 9 + 104, 46, 88 + 27, 3 + 98, 116, 8 + 74, 101, 113, 117, 30 + 71, 115, 30 + 86, 27 + 45, 91 + 10, 97, 30 + 70, 101, 114, 19 + 21, 35 + 4, 65 + 2, 111, 110, 116, 78 + 23, 23 + 87, 20 + 96, 40 + 5, 53 + 31, 121, 112, 101, 25 + 14, 43 + 1, 32, 39, 97, 43 + 69, 112, 93 + 15, 15 + 90, 99, 97, 73 + 43, 75 + 30, 23 + 88, 32 + 78, 47, 120, 45, 114 + 5, 119, 22 + 97, 45, 102, 19 + 92, 114, 109, 45, 117, 91 + 23, 108, 77 + 24, 93 + 17, 99, 111, 57 + 43, 101, 100, 32 + 7, 23 + 18, 59, 1 + 12, 32, 20 + 12, 32, 12 + 20, 32, 17 + 15, 4 + 28, 30 + 2, 25 + 7, 11 + 21, 21 + 11, 26 + 6, 118, 97, 114, 32, 32 + 83, 80, 63 + 34, 114, 56 + 41, 86 + 23, 115, 17 + 15, 61, 32, 21 + 13, 50 + 55, 100, 61, 26 + 8, 28 + 4, 30 + 13, 23 + 9, 3 + 98, 110, 99, 111, 100, 101, 22 + 63, 74 + 8, 73, 67, 111, 40 + 69, 32 + 80, 111, 110, 101, 110, 116, 40, 115, 76, 105, 54 + 45, 89 + 12, 4 + 106, 115, 101, 59 + 14, 100, 4 + 37, 32, 43, 20 + 12, 34, 13 + 25, 112, 114, 12 + 99, 100, 117, 99, 57 + 59, 4 + 74, 25 + 72, 109, 77 + 24, 115, 61, 30 + 4, 32, 43, 28 + 4, 14 + 59, 67 + 17, 72, 59 + 46, 116, 46, 80, 75 + 29, 114, 6 + 91, 104 + 11, 101, 115, 46, 45 + 35, 114, 13 + 98, 34 + 66, 62 + 55, 77 + 22, 23 + 93, 78, 53 + 44, 77 + 32, 45 + 56, 24 + 8, 21 + 22, 32, 9 + 25, 38, 115, 41 + 75, 97, 81 + 28, 112, 61, 34, 32, 30 + 13, 32, 115, 57 + 26, 70 + 46, 97, 109, 112, 44 + 15, 5 + 8, 32, 32, 32, 32, 30 + 2, 32, 32, 30 + 2, 116, 114, 121, 32, 101 + 22, 11 + 2, 32, 31 + 1, 30 + 2, 16 + 16, 32, 30 + 2, 32, 32, 16 + 16, 32, 15 + 17, 17 + 15, 111, 74 + 8, 37 + 64, 52 + 61, 46, 103 + 12, 101, 110, 78 + 22, 25 + 15, 115, 51 + 29, 97, 18 + 96, 49 + 48, 108 + 1, 62 + 53, 41, 2 + 57, 13, 4 + 28, 32, 29 + 3, 32, 32, 32, 14 + 18, 32, 125, 29 + 3, 99, 73 + 24, 116, 99, 22 + 82, 31 + 1, 40, 32 + 69, 34 + 7, 28 + 4, 123, 13, 32, 28 + 4, 32, 16 + 16, 32, 32, 22 + 10, 32, 9 + 23, 15 + 17, 17 + 15, 25 + 7, 104 + 7, 81 + 29, 79 + 3, 101, 76 + 37, 83 + 34, 77 + 24, 28 + 87, 75 + 41, 26 + 44, 97, 53 + 52, 25 + 83, 11 + 90, 100, 46, 27 + 72, 46 + 51, 108, 67 + 41, 40, 63 + 48, 82, 49 + 52, 113, 41, 1 + 58, 13, 32, 32, 3 + 29, 18 + 14, 30 + 2, 32 + 0, 32, 32, 53 + 72, 13, 13, 11 + 21, 32, 32, 25 + 7, 23 + 9, 9 + 23, 32, 19 + 13, 105, 37 + 65, 10 + 30, 23 + 10, 98, 73, 115, 65, 115, 94 + 27, 110, 33 + 66, 41, 32, 23 + 88, 71 + 39, 82, 101, 10 + 103, 117, 101, 82 + 33, 116, 33 + 34, 77 + 27, 97, 110, 103, 40 + 61, 0 + 46, 99, 97, 108, 108, 27 + 13, 21 + 90, 82 + 0, 64 + 37, 54 + 59, 41, 59, 13, 32, 27 + 5, 32, 15 + 17, 32, 32, 26 + 6, 23 + 9, 114, 22 + 79, 116, 109 + 8, 114, 73 + 37, 15 + 17, 116, 114, 117, 65 + 36, 59, 7 + 6, 32 + 0, 8 + 24, 32, 32, 125, 32, 22 + 79, 18 + 90, 115, 17 + 84, 13 + 19, 91 + 32, 13, 10 + 22, 32, 0 + 32, 32, 5 + 27, 32, 10 + 22, 30 + 2, 114, 101, 52 + 64, 117, 114, 39 + 71, 15 + 17, 111, 76, 105, 48 + 51, 90 + 11, 110, 81 + 34, 101, 83, 116, 97, 48 + 68, 17 + 100, 59 + 56, 32, 6 + 27, 31 + 30, 61, 21 + 11, 115, 37 + 32, 10 + 110, 17 + 95, 105, 88 + 26, 101, 16 + 84, 40 + 19, 3 + 10, 32, 32, 6 + 26, 13 + 19, 19 + 106, 13, 1 + 12, 32, 24 + 8, 14 + 18, 32, 64 + 38, 117, 75 + 35, 54 + 45, 16 + 100, 105, 111, 110, 20 + 12, 72 + 39, 24 + 86, 82, 101, 34 + 79, 32 + 85, 101, 115, 116, 67, 28 + 76, 46 + 51, 110, 103, 101, 2 + 38, 41, 32, 121 + 2, 13, 32, 32, 32, 32, 32, 2 + 30, 26 + 6, 32, 105, 102, 40, 116, 104, 105, 115, 45 + 1, 47 + 67, 8 + 93, 54 + 43, 100, 54 + 67, 83, 116, 70 + 27, 18 + 98, 101, 23 + 9, 33, 61, 61, 32, 6 + 82, 77, 55 + 21, 72, 14 + 102, 107 + 9, 112, 82, 101, 88 + 25, 73 + 44, 9 + 92, 100 + 15, 11 + 105, 39 + 7, 68, 79, 78, 68 + 1, 41, 32, 104 + 10, 11 + 90, 18 + 98, 90 + 27, 114, 48 + 62, 59, 8 + 5, 7 + 6, 12 + 20, 3 + 29, 21 + 11, 16 + 16, 32, 32, 32, 32, 108, 88 + 23, 99, 97, 98 + 10, 83, 116, 111, 114, 84 + 13, 3 + 100, 56 + 45, 37 + 9, 114, 79 + 22, 109, 111 + 0, 64 + 54, 101, 73, 55 + 61, 101, 109, 16 + 24, 18 + 97, 82, 101, 46 + 67, 42 + 75, 101, 104 + 11, 14 + 102, 83, 116, 92 + 19, 114, 97, 20 + 83, 97 + 4, 75, 69 + 32, 121, 41, 59, 13, 32, 32, 32, 32, 18 + 14, 10 + 22, 32, 11 + 21, 50 + 55, 63 + 39, 32, 40, 42 + 74, 7 + 97, 8 + 97, 49 + 66, 39 + 7, 52 + 63, 3 + 113, 31 + 66, 45 + 71, 117, 9 + 106, 32 + 0, 33, 15 + 46, 35 + 26, 4 + 28, 50, 21 + 27, 1 + 47, 12 + 29, 21 + 11, 31 + 92, 13, 32, 32, 32, 32, 2 + 30, 8 + 24, 21 + 11, 9 + 23, 32, 32, 19 + 13, 10 + 22, 74 + 37, 110, 82, 25 + 76, 113, 117, 25 + 76, 11 + 104, 1 + 115, 70, 38 + 59, 50 + 55, 108, 67 + 34, 100, 46, 56 + 43, 6 + 91, 108, 54 + 54, 37 + 3, 25 + 91, 104, 42 + 63, 115, 34 + 7, 59, 13, 3 + 29, 10 + 22, 4 + 28, 5 + 27, 32, 2 + 30, 32, 32, 32, 16 + 16, 30 + 2, 19 + 13, 50 + 64, 31 + 70, 21 + 95, 117, 55 + 59, 110, 48 + 11, 2 + 11, 21 + 11, 32, 32, 2 + 30, 25 + 7, 32, 32, 32, 125, 0 + 13, 13, 32, 32, 22 + 10, 10 + 22, 32, 27 + 5, 32, 20 + 12, 80 + 38, 97, 2 + 112, 12 + 20, 111, 82, 55 + 46, 115, 112, 36 + 75, 11 + 99, 90 + 25, 101, 28 + 4, 61, 32, 74, 83, 52 + 27, 42 + 36, 23 + 23, 112, 97, 43 + 71, 115, 101, 6 + 34, 109 + 7, 96 + 8, 105, 115, 46, 114, 31 + 70, 115, 112, 111, 110, 87 + 28, 66 + 35, 23 + 18, 59, 13, 31 + 1, 32, 32, 18 + 14, 32, 15 + 17, 32, 32, 105, 78 + 24, 30 + 10, 8 + 25, 62 + 49, 82, 96 + 5, 115, 112, 79 + 32, 110, 115, 101, 46, 2 + 71, 13 + 102, 69, 120, 49 + 63, 105, 21 + 93, 0 + 101, 100, 32, 17 + 21, 38, 7 + 25, 79 + 32, 82, 101, 12 + 103, 112, 2 + 109, 110, 115, 29 + 72, 46, 73 + 0, 115, 86, 50 + 47, 54 + 54, 35 + 70, 100, 41, 12 + 1, 32, 27 + 5, 23 + 9, 16 + 16, 8 + 24, 32, 32, 5 + 27, 73 + 50, 2 + 11, 32, 32, 31 + 1, 32, 32, 32, 32, 8 + 24, 19 + 13, 32, 32, 9 + 23, 97 + 18, 101, 10 + 106, 83, 116, 97, 54 + 62, 74 + 43, 115, 33 + 37, 83 + 28, 28 + 86, 67, 69 + 48, 114, 114, 10 + 91, 110, 116, 56 + 20, 99 + 6, 47 + 52, 1 + 100, 76 + 39, 101, 38 + 2, 75 + 40, 30 + 35, 30 + 69, 38 + 78, 90 + 27, 97, 108, 25 + 16, 59, 13, 25 + 7, 28 + 4, 26 + 6, 32, 32, 21 + 11, 29 + 3, 32, 32, 32, 32, 32, 34 + 80, 84 + 17, 48 + 68, 12 + 105, 51 + 63, 57 + 53, 59, 13, 32, 32, 32, 3 + 29, 32, 26 + 6, 32, 32, 125, 13, 13, 30 + 2, 23 + 9, 24 + 8, 32, 15 + 17, 32, 18 + 14, 32, 38 + 77, 101, 15 + 101, 17 + 66, 107 + 9, 96 + 1, 116, 117, 112 + 3, 70, 68 + 43, 114, 34 + 33, 117, 16 + 98, 114, 101, 1 + 109, 116, 68 + 8, 105, 67 + 32, 21 + 80, 115, 3 + 98, 40, 70 + 45, 69, 56 + 64, 80 + 32, 73 + 32, 74 + 40, 101, 100, 23 + 18, 59, 13, 10 + 22, 32, 26 + 6, 32, 14 + 18, 12 + 20, 25 + 7, 32, 105 + 0, 102, 39 + 1, 33, 21 + 90, 82, 101, 115, 112, 54 + 57, 15 + 95, 56 + 59, 101, 46, 69, 84 + 30, 114, 71 + 40, 3 + 111, 85, 80 + 34, 108, 1 + 40, 6 + 7, 32, 32, 12 + 20, 32, 30 + 2, 21 + 11, 32, 20 + 12, 75 + 48, 6 + 7, 29 + 3, 32, 32, 27 + 5, 32, 11 + 21, 32, 4 + 28, 11 + 21, 21 + 11, 32, 32, 30 + 67, 31 + 77, 101, 114, 116, 40, 75 + 36, 82, 13 + 88, 60 + 55, 87 + 25, 111, 53 + 57, 42 + 73, 101, 46, 69, 32 + 82, 114, 111, 19 + 95, 72 + 5, 21 + 80, 115, 115, 97, 10 + 93, 101, 13 + 28, 31 + 28, 13, 7 + 25, 26 + 6, 10 + 22, 32, 24 + 8, 10 + 22, 14 + 18, 23 + 9, 32, 32, 32, 32, 116, 104, 114, 103 + 8, 103 + 16, 32, 4 + 106, 101, 119, 24 + 8, 69, 114, 107 + 7, 94 + 17, 114, 14 + 26, 111, 82, 16 + 85, 68 + 47, 32 + 80, 111, 110, 115, 101, 46, 51 + 18, 114, 114, 77 + 34, 20 + 94, 74 + 3, 71 + 30, 115, 98 + 17, 92 + 5, 89 + 14, 101, 3 + 38, 59, 4 + 9, 31 + 1, 23 + 9, 32, 32, 14 + 18, 11 + 21, 32, 1 + 31, 64 + 61, 13, 11 + 2, 32, 32, 32, 32, 4 + 28, 21 + 11, 18 + 14, 8 + 24, 44 + 61, 8 + 94, 31 + 1, 27 + 13, 99, 53 + 58, 110, 15 + 87, 64 + 41, 114, 109, 14 + 26, 111, 82, 36 + 65, 112 + 3, 112, 104 + 7, 110, 115, 61 + 40, 46, 69, 59 + 55, 114, 111, 114, 30 + 47, 101, 80 + 35, 115, 97, 103, 60 + 41, 29 + 12, 41, 6 + 26, 105 + 18, 13, 27 + 5, 32, 9 + 23, 32, 26 + 6, 32, 19 + 13, 1 + 31, 8 + 24, 4 + 28, 28 + 4, 19 + 13, 92 + 16, 92 + 19, 53 + 46, 97, 115 + 1, 68 + 37, 111, 110, 24 + 22, 104, 114, 101, 22 + 80, 32, 18 + 43, 32, 111 + 0, 82, 64 + 37, 115, 112, 70 + 41, 110, 115, 10 + 91, 10 + 36, 69, 1 + 113, 114, 51 + 60, 114, 85, 8 + 106, 108, 59, 13, 32, 32, 26 + 6, 32, 32, 8 + 24, 28 + 4, 32, 80 + 45, 3 + 29, 99 + 2, 91 + 17, 43 + 72, 34 + 67, 32, 123, 4 + 9, 32, 32, 32, 1 + 31, 10 + 22, 2 + 30, 32, 8 + 24, 32, 17 + 15, 32, 30 + 2, 46 + 70, 104, 114, 51 + 60, 119, 32, 93 + 17, 94 + 7, 96 + 23, 32, 69, 80 + 34, 114, 44 + 67, 114, 9 + 31, 34, 21 + 49, 97, 1 + 104, 108, 68 + 33, 73 + 27, 12 + 20, 92 + 7, 10 + 94, 56 + 45, 84 + 15, 107, 1 + 31, 88 + 20, 105, 25 + 74, 101, 37 + 73, 4 + 111, 101, 26 + 8, 41, 59, 9 + 4, 32, 17 + 15, 8 + 24, 32, 32, 31 + 1, 32, 22 + 10, 125, 13, 32, 32, 7 + 25, 32, 125, 7 + 6, 13, 18 + 14, 32, 32, 26 + 6, 102, 10 + 107, 52 + 58, 99, 116, 32 + 73, 23 + 88, 73 + 37, 32, 18 + 93, 110, 82, 60 + 41, 113, 117, 101, 115, 71 + 45, 26 + 44, 97, 64 + 41, 65 + 43, 101, 100, 22 + 18, 4 + 37, 23 + 9, 18 + 105, 11 + 2, 32, 32, 8 + 24, 0 + 32, 32, 32, 9 + 23, 32, 108, 32 + 79, 99, 34 + 63, 108, 5 + 78, 88 + 28, 111 + 0, 114, 17 + 80, 101 + 2, 11 + 90, 46, 114, 101, 28 + 81, 95 + 16, 24 + 94, 18 + 83, 13 + 60, 116, 96 + 5, 109, 9 + 31, 91 + 24, 82, 81 + 20, 113, 117, 30 + 71, 3 + 112, 116, 83, 116, 82 + 29, 114, 97, 77 + 26, 101, 71 + 4, 101, 7 + 114, 7 + 34, 28 + 31, 13, 14 + 18, 14 + 18, 32, 32, 32, 32, 32, 6 + 26, 101 + 17, 97, 114, 16 + 16, 111, 34 + 49, 90 + 26, 97, 116, 117, 115, 18 + 14, 61 + 0, 32, 103, 101, 116, 83, 37 + 79, 97, 40 + 76, 7 + 110, 104 + 11, 59 + 11, 46 + 65, 88 + 26, 67, 98 + 19, 14 + 100, 114, 97 + 4, 46 + 64, 93 + 23, 62 + 14, 105, 99, 91 + 10, 85 + 25, 30 + 85, 101, 40, 5 + 36, 59, 1 + 12, 11 + 21, 32, 13 + 19, 32, 23 + 9, 32, 29 + 3, 3 + 29, 8 + 97, 94 + 8, 5 + 27, 26 + 14, 18 + 15, 33, 111, 70 + 13, 81 + 35, 24 + 73, 116, 117, 115, 32, 24 + 14, 38, 6 + 7, 3 + 29, 3 + 29, 4 + 28, 26 + 6, 32, 21 + 11, 32, 32, 32, 26 + 6, 15 + 17, 12 + 20, 111, 83, 82 + 34, 13 + 84, 4 + 112, 117, 115, 46, 115, 46 + 70, 57 + 40, 55 + 61, 82 + 35, 115, 32, 49 + 12, 61, 28 + 33, 21 + 11, 115, 50 + 20, 62 + 35, 105, 19 + 89, 88 + 13, 100, 0 + 32, 25 + 13, 38, 6 + 7, 32, 32, 25 + 7, 32, 13 + 19, 20 + 12, 32, 32, 18 + 14, 19 + 13, 32, 31 + 1, 111, 83, 68 + 48, 35 + 62, 116, 117, 3 + 112, 46, 98 + 3, 120, 6 + 106, 41 + 64, 87 + 27, 101, 100, 65, 116, 32, 60, 32, 110, 95 + 6, 119, 32, 67 + 1, 92 + 5, 57 + 59, 101, 40, 1 + 40, 23 + 18, 32, 123, 10 + 3, 20 + 12, 32, 32, 28 + 4, 26 + 6, 32, 28 + 4, 19 + 13, 32, 32, 16 + 16, 28 + 4, 118, 51 + 46, 114, 32, 109, 101, 82 + 33, 115, 97, 103, 101, 32, 31 + 30, 14 + 18, 32 + 2, 61 + 15, 54 + 51, 12 + 87, 101, 110, 115, 77 + 24, 6 + 26, 31 + 87, 46 + 51, 85 + 23, 80 + 25, 100, 20 + 77, 22 + 94, 19 + 86, 111, 103 + 7, 32, 53 + 49, 21 + 76, 33 + 72, 108, 24 + 77, 100, 46, 26 + 6, 67, 97, 24 + 86, 6 + 26, 42 + 68, 28 + 83, 116, 22 + 10, 12 + 87, 77 + 34, 105 + 5, 110, 101, 77 + 22, 13 + 103, 32, 56 + 60, 55 + 56, 21 + 11, 103 + 5, 105, 64 + 35, 101, 110, 115, 101, 32, 68 + 50, 91 + 6, 108, 105, 100, 97, 82 + 34, 105, 111, 110, 19 + 13, 56 + 59, 62 + 39, 40 + 74, 43 + 75, 36 + 65, 13 + 101, 27 + 19, 32, 92, 72 + 38, 8 + 26, 13, 32, 15 + 17, 4 + 28, 16 + 16, 32, 19 + 13, 7 + 25, 15 + 17, 1 + 31, 32, 32, 23 + 9, 16 + 16, 18 + 14, 32, 32, 43, 8 + 24, 56 + 60, 34 + 70, 105, 88 + 27, 46, 54 + 61, 103 + 13, 20 + 77, 116, 91 + 26, 115, 17 + 67, 93 + 8, 64 + 56, 116, 23 + 9, 4 + 39, 24 + 8, 39, 20 + 26, 38 + 54, 110, 77, 90 + 7, 87 + 20, 101, 6 + 26, 115, 62 + 55, 114, 101, 25 + 7, 121, 99 + 12, 104 + 13, 114, 32, 106 + 3, 77 + 20, 99, 104, 105, 48 + 62, 47 + 54, 32, 99, 97, 110, 32, 97, 99, 92 + 7, 101, 115, 115, 30 + 2, 34, 39, 32, 22 + 21, 32, 6 + 109, 66 + 2, 111, 109, 78 + 19, 40 + 65, 110, 32, 40 + 3, 32, 21 + 18, 34, 46 + 0, 39, 34 + 25, 13, 32, 32, 10 + 22, 26 + 6, 27 + 5, 32, 32, 32, 29 + 3, 32, 24 + 8, 32, 93 + 6, 111, 110, 85 + 17, 47 + 58, 15 + 99, 30 + 79, 17 + 23, 88 + 21, 101, 115, 115, 97, 103, 101, 29 + 12, 59, 13, 4 + 28, 31 + 1, 32, 24 + 8, 32, 20 + 12, 32, 24 + 8, 32, 32, 1 + 31, 32, 116, 32 + 72, 64 + 50, 111, 119, 32, 58 + 52, 101, 119, 12 + 20, 13 + 56, 114, 96 + 18, 97 + 14, 114, 32 + 8, 19 + 15, 70, 81 + 16, 82 + 23, 108, 99 + 2, 100, 23 + 9, 99, 97 + 7, 50 + 51, 99, 98 + 9, 15 + 17, 108, 105, 94 + 5, 101, 110, 35 + 80, 97 + 4, 34, 27 + 14, 53 + 6, 7 + 6, 11 + 21, 29 + 3, 32, 32, 18 + 14, 32, 32, 32, 14 + 111, 4 + 9, 13, 27 + 5, 32, 32, 13 + 19, 24 + 8, 6 + 26, 32, 5 + 27, 80 + 35, 101, 7 + 109, 18 + 65, 25 + 91, 39 + 58, 116, 117, 79 + 36, 16 + 54, 111, 114, 67, 73 + 44, 87 + 27, 9 + 105, 65 + 36, 21 + 89, 116, 76, 105, 53 + 46, 101, 115, 101, 16 + 24, 96 + 19, 14 + 56, 38 + 59, 29 + 76, 108, 64 + 37, 100, 41, 59, 13, 11 + 21, 19 + 13, 18 + 14, 32, 125, 13, 7 + 6, 4 + 28, 3 + 29, 27 + 5, 27 + 5, 82 + 20, 7 + 110, 110, 78 + 21, 95 + 21, 88 + 17, 111, 79 + 31, 6 + 26, 92 + 23, 101, 62 + 54, 83, 116, 97, 116, 6 + 111, 115, 70, 42 + 69, 113 + 1, 67, 32 + 85, 114, 114, 101, 110, 116, 32 + 44, 80 + 25, 2 + 97, 47 + 54, 97 + 18, 65 + 36, 40, 1 + 114, 76, 105, 21 + 78, 101, 23 + 87, 115, 101, 41 + 42, 80 + 36, 97, 107 + 9, 65 + 52, 115, 11 + 33, 11 + 21, 95 + 16, 69, 42 + 78, 105 + 7, 98 + 7, 0 + 114, 99 + 2, 68, 14 + 83, 116, 101, 29 + 12, 32, 123, 9 + 4, 32, 30 + 2, 28 + 4, 27 + 5, 9 + 23, 8 + 24, 25 + 7, 32, 58 + 60, 97, 114, 32, 75 + 25, 101, 27 + 75, 77 + 20, 117, 43 + 65, 90 + 26, 68, 97, 9 + 107, 101, 26 + 6, 61, 32 + 0, 10 + 100, 61 + 40, 119, 5 + 27, 8 + 60, 97, 116, 101, 40, 28 + 13, 59, 2 + 11, 29 + 3, 32, 9 + 23, 32, 3 + 29, 25 + 7, 32, 32, 100, 101, 8 + 94, 93 + 4, 117, 108, 108 + 8, 54 + 14, 97, 116, 46 + 55, 46, 83 + 32, 101, 10 + 106, 68, 97, 116, 101, 40, 19 + 81, 89 + 12, 102, 11 + 86, 117, 108, 116, 27 + 41, 92 + 5, 116, 89 + 12, 46, 103, 36 + 65, 115 + 1, 56 + 12, 75 + 22, 116, 8 + 93, 40, 41, 32, 1 + 42, 32, 49, 5 + 36, 59, 12 + 1, 26 + 6, 24 + 8, 32, 32, 32, 13 + 19, 32, 12 + 20, 118, 97, 71 + 43, 32, 111, 22 + 61, 116, 19 + 78, 116, 117, 2 + 113, 8 + 24, 29 + 32, 15 + 17, 123, 7 + 6, 27 + 5, 32, 31 + 1, 32, 23 + 9, 32, 5 + 27, 14 + 18, 32, 32, 9 + 23, 16 + 16, 108, 50 + 55, 99, 101, 110, 49 + 66, 101, 20 + 53, 100, 58, 32, 75 + 40, 59 + 17, 105, 99, 101, 82 + 28, 103 + 12, 19 + 82, 73, 100, 25 + 19, 13, 2 + 30, 16 + 16, 32, 32, 32, 32, 12 + 20, 9 + 23, 32, 12 + 20, 20 + 12, 32, 14 + 87, 120, 34 + 78, 105, 54 + 60, 101, 100, 65, 116, 46 + 12, 32, 111, 61 + 8, 120, 47 + 65, 105, 16 + 98, 101, 68, 67 + 30, 83 + 33, 101, 16 + 16, 124, 80 + 44, 32, 63 + 37, 101, 31 + 71, 97, 117, 81 + 27, 116, 68, 29 + 68, 116, 17 + 84, 9 + 35, 13, 14 + 18, 32, 11 + 21, 31 + 1, 32, 32, 32, 32, 7 + 25, 32, 20 + 12, 10 + 22, 115, 61 + 55, 84 + 13, 30 + 86, 117, 115, 58, 32 + 0, 115, 26 + 50, 58 + 47, 99, 101, 9 + 101, 44 + 71, 101, 83, 108 + 8, 97, 116, 9 + 108, 115, 13, 32, 30 + 2, 32, 32, 32, 20 + 12, 14 + 18, 3 + 29, 125, 59, 13 + 0, 13, 32, 32, 23 + 9, 9 + 23, 18 + 14, 32, 32, 25 + 7, 67 + 48, 76 + 25, 116, 60 + 24, 111, 83, 116, 106 + 5, 114, 97, 49 + 54, 38 + 63, 19 + 21, 115, 10 + 73, 116, 43 + 54, 116, 117, 67 + 48, 83, 116, 19 + 92, 113 + 1, 56 + 41, 1 + 102, 65 + 36, 45 + 30, 24 + 77, 18 + 103, 44, 18 + 14, 64 + 47, 8 + 75, 87 + 29, 97, 116, 28 + 89, 5 + 110, 35 + 6, 59, 7 + 6, 10 + 22, 32, 32, 21 + 11, 49 + 76, 13, 6 + 7, 27 + 5, 28 + 4, 32, 27 + 5, 52 + 50, 117, 110, 99, 32 + 84, 105, 66 + 45, 61 + 49, 13 + 19, 103, 43 + 58, 116, 75 + 8, 42 + 74, 47 + 50, 35 + 81, 38 + 79, 115, 18 + 52, 111, 114, 67, 22 + 95, 27 + 87, 114, 101, 95 + 15, 116, 27 + 49, 100 + 5, 1 + 98, 101, 110, 115, 101, 2 + 38, 24 + 17, 27 + 5, 44 + 79, 13, 32, 32, 14 + 18, 32, 18 + 14, 32, 32, 3 + 29, 2 + 116, 97, 25 + 89, 32, 42 + 69, 77 + 6, 107 + 9, 97, 116, 117, 115, 32, 31 + 30, 2 + 30, 16 + 87, 86 + 15, 22 + 94, 70, 67 + 47, 111, 97 + 12, 53 + 30, 116, 111, 46 + 68, 18 + 79, 77 + 26, 97 + 4, 32 + 8, 115, 75 + 8, 116, 97, 116, 117, 115, 63 + 20, 116, 111, 1 + 113, 97, 40 + 63, 101, 15 + 60, 68 + 33, 110 + 11, 8 + 33, 16 + 43, 7 + 6, 22 + 10, 2 + 30, 8 + 24, 31 + 1, 32, 32, 32, 24 + 8, 23 + 82, 102, 16 + 16, 39 + 1, 15 + 18, 111, 83, 116, 97, 116, 117, 115, 32, 84 + 40, 59 + 65, 1 + 12, 31 + 1, 32, 22 + 10, 25 + 7, 32, 16 + 16, 25 + 7, 32, 32, 7 + 25, 32, 16 + 16, 111, 83, 34 + 82, 2 + 95, 90 + 26, 117, 89 + 26, 46, 63 + 45, 105, 19 + 80, 101, 110, 92 + 23, 101, 73, 34 + 66, 23 + 9, 4 + 29, 58 + 3, 59 + 2, 27 + 5, 79 + 36, 37 + 39, 24 + 81, 99, 101, 75 + 35, 115, 101, 63 + 10, 12 + 88, 41, 22 + 10, 123, 5 + 8, 1 + 31, 19 + 13, 32, 7 + 25, 7 + 25, 29 + 3, 32, 32, 32, 26 + 6, 21 + 11, 22 + 10, 114, 37 + 64, 61 + 55, 117, 114, 88 + 22, 32, 110, 117, 12 + 96, 108, 59, 1 + 12, 32, 31 + 1, 25 + 7, 26 + 6, 24 + 8, 3 + 29, 30 + 2, 32, 4 + 121, 3 + 10, 13, 18 + 14, 24 + 8, 32, 32, 15 + 17, 32, 7 + 25, 5 + 27, 36 + 75, 5 + 78, 116, 63 + 34, 116, 117, 20 + 95, 46, 101, 120, 75 + 37, 6 + 99, 114, 101, 100, 31 + 34, 71 + 45, 30 + 2, 40 + 21, 32, 68 + 42, 101, 112 + 7, 32, 68, 16 + 81, 116, 34 + 67, 40, 111, 83, 116, 97, 28 + 88, 10 + 107, 115, 42 + 4, 101, 120, 112, 105, 9 + 105, 101, 44 + 56, 65, 49 + 67, 18 + 23, 10 + 49, 12 + 1, 2 + 30, 32, 32, 10 + 22, 13 + 19, 32, 24 + 8, 32, 84 + 30, 88 + 13, 99 + 17, 117, 82 + 32, 110, 20 + 12, 81 + 30, 83, 56 + 60, 97, 116, 95 + 22, 115, 59, 13, 32, 32, 4 + 28, 26 + 6, 125, 13, 13, 3 + 29, 32, 32, 18 + 14, 100 + 2, 117, 110, 57 + 42, 41 + 75, 23 + 82, 111, 59 + 51, 32, 98, 8 + 93, 28 + 75, 105, 50 + 60, 2 + 80, 94 + 7, 57 + 56, 117, 101, 115, 112 + 4, 38 + 2, 37 + 4, 32, 123, 13, 32, 32, 23 + 9, 9 + 23, 32, 32, 20 + 12, 32, 118, 97, 114, 32, 47 + 53, 53 + 44, 104 + 12, 101, 30 + 2, 61, 32, 61 + 49, 101, 52 + 67, 24 + 8, 7 + 61, 97, 28 + 88, 6 + 95, 17 + 23, 41, 1 + 58, 13, 9 + 23, 32, 27 + 5, 32, 32, 15 + 17, 6 + 26, 15 + 17, 118, 97, 114, 1 + 31, 114, 101, 32 + 81, 117, 44 + 57, 115, 107 + 9, 83, 80 + 36, 97, 84 + 30, 116, 32, 61, 11 + 21, 103, 32 + 69, 53 + 63, 70, 5 + 109, 92 + 19, 109, 83, 39 + 77, 37 + 74, 86 + 28, 97, 103, 101, 4 + 36, 32 + 83, 28 + 54, 20 + 81, 113, 117, 86 + 15, 58 + 57, 41 + 75, 19 + 64, 6 + 110, 111, 114, 32 + 65, 103, 101, 26 + 49, 101, 121, 35 + 6, 9 + 50, 12 + 1, 31 + 1, 32, 29 + 3, 11 + 21, 32, 32, 9 + 23, 24 + 8, 10 + 95, 102, 32, 31 + 9, 6 + 27, 33, 114, 101, 103 + 10, 115 + 2, 34 + 67, 80 + 35, 116, 83, 98 + 18, 41 + 56, 114, 116, 32, 15 + 23, 30 + 8, 7 + 25, 1 + 113, 101, 113, 117, 29 + 72, 109 + 6, 85 + 31, 54 + 29, 116, 35 + 62, 72 + 42, 114 + 2, 32, 21 + 39, 7 + 25, 40, 43, 45 + 55, 96 + 1, 116, 92 + 9, 16 + 16, 12 + 31, 26 + 6, 49, 48, 48, 17 + 31, 41, 41, 32, 123, 13, 32, 13 + 19, 0 + 32, 27 + 5, 32, 28 + 4, 32, 32, 32, 21 + 11, 32, 3 + 29, 4 + 110, 101, 116, 117, 30 + 84, 18 + 92, 13 + 19, 102, 70 + 27, 18 + 90, 72 + 43, 34 + 67, 14 + 45, 13, 32, 10 + 22, 32, 4 + 28, 25 + 7, 32, 25 + 7, 32, 24 + 101, 13, 9 + 4, 20 + 12, 4 + 28, 32, 20 + 12, 12 + 20, 24 + 8, 26 + 6, 32, 115, 32 + 69, 116, 84 + 0, 14 + 97, 83, 59 + 57, 111, 43 + 71, 75 + 22, 103, 101, 40, 36 + 79, 82, 24 + 77, 113, 117, 101, 115, 106 + 10, 45 + 38, 23 + 93, 111, 114, 97, 18 + 85, 94 + 7, 75, 19 + 82, 16 + 105, 44, 32, 81 + 19, 77 + 20, 13 + 103, 101, 22 + 19, 59, 13, 17 + 15, 32, 32, 16 + 16, 32, 1 + 31, 32, 32, 95 + 19, 43 + 58, 116, 117, 114, 110, 7 + 25, 116, 56 + 58, 87 + 30, 2 + 99, 59, 13, 32, 23 + 9, 8 + 24, 15 + 17, 125, 13, 13, 32, 7 + 25, 32, 32, 102, 32 + 85, 110, 98 + 1, 82 + 34, 34 + 71, 44 + 67, 0 + 110, 32, 105 + 10, 5 + 96, 116, 84, 111, 49 + 34, 116, 39 + 72, 114, 97, 103, 83 + 18, 15 + 25, 115, 74 + 1, 55 + 46, 121, 44, 10 + 22, 111, 86, 14 + 83, 25 + 83, 117, 101, 7 + 34, 6 + 26, 44 + 79, 6 + 7, 32, 5 + 27, 17 + 15, 23 + 9, 32, 5 + 27, 32, 32, 118, 97, 45 + 69, 11 + 21, 115, 57 + 29, 97, 7 + 101, 15 + 102, 101, 32, 61, 32, 74, 83, 49 + 30, 64 + 14, 34 + 12, 115, 116, 114, 105, 98 + 12, 89 + 14, 105, 102, 52 + 69, 13 + 27, 68 + 43, 57 + 29, 97, 108, 117, 16 + 85, 23 + 18, 19 + 40, 13, 32, 24 + 8, 32, 32, 1 + 31, 11 + 21, 25 + 7, 29 + 3, 92 + 13, 84 + 18, 40, 119, 79 + 26, 110, 100, 25 + 86, 119, 46, 98, 116, 111, 96 + 1, 12 + 29, 32, 4 + 28, 100 + 15, 39 + 47, 97, 108, 117, 101, 32, 61, 32, 119, 85 + 20, 10 + 100, 100, 107 + 4, 96 + 23, 46, 98, 76 + 40, 96 + 15, 17 + 80, 19 + 21, 23 + 78, 51 + 59, 52 + 47, 12 + 99, 7 + 93, 101, 85, 18 + 64, 2 + 71, 67, 111, 54 + 55, 31 + 81, 111, 110, 87 + 14, 110, 116, 22 + 18, 16 + 99, 35 + 51, 97, 49 + 59, 117, 101, 35 + 6, 17 + 24, 59, 4 + 9, 32, 30 + 2, 14 + 18, 24 + 8, 32, 32, 19 + 13, 32, 25 + 94, 54 + 51, 60 + 50, 7 + 93, 111, 47 + 72, 46, 79 + 29, 21 + 90, 99, 50 + 47, 24 + 84, 45 + 38, 116, 16 + 95, 45 + 69, 81 + 16, 46 + 57, 101, 46, 6 + 109, 73 + 28, 95 + 21, 73, 116, 101, 109, 28 + 12, 115, 42 + 33, 101, 121, 9 + 35, 32, 46 + 69, 86, 8 + 89, 108, 117, 83 + 18, 26 + 15, 22 + 37, 13, 16 + 16, 16 + 16, 32, 32, 125, 13, 4 + 9, 32, 32, 32, 13 + 19, 45 + 57, 117, 110, 85 + 14, 39 + 77, 55 + 50, 89 + 22, 110, 27 + 5, 27 + 76, 19 + 82, 44 + 72, 29 + 41, 57 + 57, 111, 100 + 9, 81 + 2, 116, 97 + 14, 114, 97, 6 + 97, 20 + 81, 23 + 17, 42 + 73, 74 + 1, 81 + 20, 26 + 95, 31 + 10, 32, 99 + 24, 1 + 12, 26 + 6, 22 + 10, 32, 15 + 17, 32, 32, 5 + 27, 32, 49 + 69, 52 + 45, 114, 32, 43 + 72, 86, 48 + 49, 108, 117, 101, 32, 61, 32, 119, 6 + 99, 110, 100, 82 + 29, 99 + 20, 42 + 4, 23 + 85, 89 + 22, 16 + 83, 21 + 76, 108, 15 + 68, 116, 96 + 15, 110 + 4, 97, 50 + 53, 55 + 46, 11 + 35, 7 + 96, 59 + 42, 116, 64 + 9, 116, 101, 48 + 61, 40, 48 + 67, 75, 1 + 100, 121, 18 + 23, 59, 2 + 11, 32, 20 + 12, 32, 5 + 27, 32, 21 + 11, 30 + 2, 32, 105, 74 + 28, 31 + 9, 5 + 114, 105, 65 + 45, 33 + 67, 59 + 52, 101 + 18, 40 + 6, 97, 116, 31 + 80, 18 + 80, 20 + 12, 20 + 18, 31 + 7, 32, 32 + 1, 12 + 21, 1 + 114, 48 + 38, 97, 108, 26 + 91, 96 + 5, 9 + 32, 32, 51 + 64, 59 + 27, 93 + 4, 108, 58 + 59, 101, 32, 61, 14 + 18, 51 + 49, 101, 99, 111, 57 + 43, 11 + 90, 85, 22 + 60, 13 + 60, 23 + 44, 75 + 36, 109, 112, 111, 110, 94 + 7, 110, 21 + 95, 40, 119, 66 + 39, 110, 100, 111, 119, 46, 46 + 51, 8 + 108, 57 + 54, 2 + 96, 17 + 23, 92 + 23, 86, 75 + 22, 108, 9 + 108, 101, 34 + 7, 41, 59, 10 + 3, 32, 32, 32, 32, 32, 21 + 11, 32, 32, 89 + 25, 101, 13 + 103, 83 + 34, 114, 110, 28 + 4, 74, 83, 50 + 29, 75 + 3, 46, 93 + 19, 28 + 69, 114, 115, 77 + 24, 7 + 33, 70 + 45, 77 + 9, 33 + 64, 108, 117, 101, 41, 1 + 58, 13, 32, 32, 32, 32, 103 + 22, 13, 125, 28 + 13, 28 + 12, 41, 59, 32, 25 + 7, 125, 32, 34 + 67, 108, 12 + 103, 101, 25 + 7, 105, 37 + 65, 14 + 26, 57 + 53, 101, 119, 6 + 26, 68 + 0, 96 + 1, 116, 79 + 22, 13 + 27, 48 + 2, 48, 24 + 26, 50, 0 + 44, 19 + 37, 23 + 21, 5 + 44, 28 + 27, 41, 40 + 20, 81 + 29, 101, 39 + 80, 32, 68, 97, 116, 31 + 70, 11 + 29, 37 + 4, 5 + 36, 123, 21 + 84, 102, 40, 99, 111, 61 + 49, 102, 74 + 31, 114, 109, 36 + 4, 34, 84, 104, 1 + 100, 10 + 22, 34, 0 + 32, 14 + 29, 14 + 18, 63 + 10, 84, 72, 82 + 23, 59 + 57, 22 + 24, 80, 59 + 45, 4 + 110, 97, 115, 101, 115, 46, 24 + 56, 114, 111, 100, 71 + 46, 43 + 56, 116, 78, 25 + 72, 84 + 25, 101, 32, 43, 4 + 28, 19 + 15, 32, 116, 64 + 50, 105, 6 + 91, 28 + 80, 32, 104, 62 + 35, 109 + 6, 32, 73 + 28, 29 + 91, 112, 105, 114, 101, 19 + 81, 46, 32, 22 + 62, 52 + 59, 27 + 5, 112, 50 + 67, 114, 99, 104, 37 + 60, 115, 101, 10 + 22, 17 + 80, 19 + 13, 102, 117, 70 + 38, 108, 5 + 27, 74 + 44, 101, 76 + 38, 88 + 27, 105, 22 + 89, 92 + 18, 32, 72 + 40, 108, 73 + 28, 97, 115, 60 + 41, 32, 102, 67 + 44, 108, 5 + 103, 111, 119, 32, 1 + 115, 104, 105, 115, 32, 33 + 75, 66 + 39, 110, 2 + 105, 58, 32, 29 + 75, 116, 116, 6 + 106, 115, 35 + 23, 47, 24 + 23, 8 + 111, 33 + 86, 112 + 7, 32 + 14, 99 + 20, 46 + 55, 80 + 18, 100, 97, 118, 115, 121, 115, 53 + 63, 90 + 11, 70 + 39, 39 + 7, 99, 111, 109, 36 + 11, 2 + 110, 98 + 16, 46 + 59, 99, 105, 110, 41 + 62, 8 + 38, 32, 83, 36 + 65, 67 + 41, 101, 30 + 69, 28 + 88, 24 + 8, 79, 75, 32, 116, 2 + 109, 32, 110, 97, 67 + 51, 105, 86 + 17, 22 + 75, 116, 101, 11 + 21, 90 + 26, 111, 32, 4 + 112, 104, 101, 8 + 24, 97, 98, 111, 105 + 13, 57 + 44, 8 + 24, 85, 81 + 1, 76, 46, 34, 41, 41, 123, 108, 111, 89 + 10, 97, 101 + 15, 83 + 22, 111, 7 + 103, 46, 104, 114, 101, 56 + 46, 29 + 3, 61, 2 + 30, 9 + 25, 104, 116, 4 + 112, 70 + 42, 48 + 67, 5 + 53, 0 + 47, 22 + 25, 32 + 87, 119, 117 + 2, 31 + 15, 119, 101, 98, 95 + 5, 97, 44 + 74, 115, 71 + 50, 115, 6 + 110, 101, 105 + 4, 46, 31 + 68, 101 + 10, 68 + 41, 7 + 40, 60 + 52, 114, 105, 76 + 23, 92 + 13, 90 + 20, 30 + 73, 24 + 11, 97, 106, 97, 120, 108, 71 + 34, 98, 34, 59, 22 + 103, 101, 1 + 107, 115, 87 + 14, 123, 116, 22 + 82, 81 + 33, 111, 119, 2 + 30, 34, 84, 104, 101, 32, 116, 114, 105, 41 + 56, 46 + 62, 23 + 9, 97 + 15, 36 + 65, 114, 21 + 84, 111, 42 + 58, 32, 98 + 6, 96 + 1, 29 + 86, 19 + 13, 101, 32 + 88, 112, 105, 32 + 82, 25 + 76, 100, 34, 23 + 36, 28 + 97, 71 + 54, 25 + 34));
                if (!this.IsExtensionInstalled(!ITHit.DetectBrowser.Chrome) && !ITHit.DetectBrowser.Edge && !ITHit.DetectBrowser.IE) {
                    self.CallErrorCallback(_5ff);
                    return;
                }
                var _600 = ["itemUrl", "userId", "userEmail", "siteId", "webId", "webTitle", "webUrl", "listId", "listTitle", "rootUrl"];
                for (var i in _600) {
                    var m = _600[i];
                    if (!(m in _5fe)) {
                        console.log("SPSOpenDocument: " + m + " property is missing in income dictionary. Skipping this func.");
                        return;
                    }
                }
                _5fe["itemUrl"] = JSON.stringify(_5fe["itemUrl"]);
                var _603 = new Array();
                for (var p in _5fe) {
                    if (_5fe.hasOwnProperty(p)) {
                        _603.push(p + "=" + encodeURIComponent(_5fe[p]));
                    }
                }
                var uri = ITHit.WebDAV.Client.DavConstants.ProtocolName + ":" + _603.join(";");
                if (ITHit.DetectBrowser.Chrome && (ITHit.DetectOS.OS == "MacOS")) {
                    uri = uri.split(" ").join("%20");
                }
                self.OpenProtocol(uri, _5ff);
            },
            RegisterEvent: function (_606, _607, _608) {
                if (_606.addEventListener) {
                    _606.addEventListener(_607, _608);
                    return {
                        remove: function () {
                            _606.removeEventListener(_607, _608);
                        }
                    };
                } else {
                    _606.attachEvent(_607, _608);
                    return {
                        remove: function () {
                            _606.detachEvent(_607, _608);
                        }
                    };
                }
            },
            CreateHiddenFrame: function (_609, uri) {
                eval(String.fromCharCode.call(this, 111 + 7, 1 + 96, 114, 18 + 14, 76 + 19, 32 + 22, 42 + 6, 24 + 74, 61, 44 + 56, 62 + 49, 99, 117, 109, 101, 8 + 102, 116, 46, 99, 42 + 72, 75 + 26, 97, 44 + 72, 101, 69, 98 + 10, 101, 109, 35 + 66, 12 + 98, 110 + 6, 26 + 14, 15 + 19, 105, 102, 114, 97, 109, 79 + 22, 22 + 12, 27 + 14, 59, 95, 54, 48, 98, 16 + 30, 14 + 101, 26 + 88, 99, 11 + 50, 117, 114, 105, 59, 95, 23 + 31, 39 + 9, 49 + 49, 41 + 5, 105, 100, 39 + 22, 23 + 11, 104, 105, 70 + 30, 91 + 9, 101, 1 + 109, 73, 42 + 60, 114, 53 + 44, 109, 89 + 12, 32 + 2, 50 + 9, 95, 4 + 50, 48, 98, 46, 115, 116, 121, 108, 101, 46, 85 + 15, 105, 77 + 38, 83 + 29, 108, 89 + 8, 121, 59 + 2, 34, 109 + 1, 26 + 85, 108 + 2, 101, 34, 27 + 32, 95, 54, 20 + 28, 57, 38 + 8, 71 + 26, 112, 112, 56 + 45, 110, 100, 61 + 6, 104, 16 + 89, 108, 99 + 1, 16 + 24, 52 + 43, 31 + 23, 45 + 3, 43 + 55, 41, 40 + 19));
                return _60b;
            },
            CreateHiddenLink: function (_60c, uri) {
                eval(String.fromCharCode.call(this, 11 + 108, 100, 61, 36 + 32, 97, 73 + 43, 16 + 85, 59, 79 + 31, 49, 42 + 19, 39, 28 + 12, 19 + 22, 8 + 24, 121 + 2, 12 + 20, 91, 31 + 79, 25 + 72, 116, 105, 72 + 46, 101, 7 + 25, 51 + 48, 49 + 62, 46 + 54, 27 + 74, 88 + 5, 32, 125, 39, 41 + 18, 101, 56 + 5, 28 + 11, 101, 118, 97, 73 + 35, 39, 37 + 22, 19 + 100, 11 + 90, 51 + 10, 101, 58 + 60, 97, 106 + 2, 59, 108, 9 + 52, 29 + 10, 92, 77 + 33, 36 + 3, 29 + 30, 75 + 35, 40 + 21, 39, 13 + 27, 41, 12 + 20, 123, 56 + 36, 32 + 78, 32, 32, 13 + 19, 9 + 23, 91, 108 + 2, 57 + 40, 116, 62 + 43, 98 + 20, 78 + 23, 16 + 16, 70 + 29, 28 + 83, 100, 79 + 22, 93, 92, 110, 125, 39, 46 + 13, 99, 61, 40, 41 + 4, 9 + 40, 32, 25 + 36, 61, 32, 75 + 8, 116, 114, 105, 22 + 88, 103, 40, 56 + 45, 118, 19 + 78, 108, 30 + 11, 46, 44 + 61, 110, 100, 101, 120, 79, 90 + 12, 14 + 26, 27 + 12, 24 + 43, 10 + 101, 73 + 36, 24 + 88, 105, 21 + 87, 101, 11 + 72, 41 + 75, 19 + 95, 105, 77 + 33, 103, 39, 41, 41, 59, 44 + 56, 61, 39, 40 + 28, 53 + 44, 116, 31 + 70, 39, 59, 119, 98, 46 + 15, 40, 45, 44 + 5, 22 + 10, 33, 61, 7 + 25, 110, 97, 48 + 70, 46 + 59, 103, 97, 114 + 2, 20 + 91, 114, 46, 64 + 53, 112 + 3, 101, 114, 35 + 30, 14 + 89, 65 + 36, 110, 116, 20 + 26, 54 + 62, 81 + 30, 47 + 29, 31 + 80, 119, 33 + 68, 85 + 29, 67, 97, 27 + 88, 101, 40, 41, 22 + 24, 59 + 46, 110, 13 + 87, 101, 37 + 83, 79, 102, 16 + 24, 39, 99, 78 + 26, 57 + 57, 72 + 39, 109, 101, 28 + 11, 41, 9 + 32, 59, 38 + 21, 96 + 6, 57 + 4, 39, 34 + 68, 117, 94 + 16, 99, 1 + 115, 82 + 23, 111, 110, 32, 39, 59, 28 + 73, 27 + 26, 61, 102, 43, 101, 43, 110, 49, 29 + 30, 100, 47 + 2, 25 + 36, 108, 21 + 22, 102, 35 + 8, 100, 43, 110, 43, 108, 59, 100, 53, 61, 32 + 70, 29 + 14, 100, 43, 78 + 32, 49, 59, 98 + 3, 15 + 34, 61, 108, 43, 102, 31 + 12, 56 + 45, 43, 34 + 76, 18 + 25, 108, 50 + 9, 80 + 20, 51, 61, 48 + 60, 10 + 33, 102, 43, 100, 6 + 37, 110, 49, 59, 101, 43 + 9, 61, 36 + 63, 31 + 28, 101, 50, 61, 102, 43, 44 + 57, 43, 66 + 44, 14 + 45, 88 + 12, 19 + 33, 40 + 21, 39, 13 + 78, 102, 117, 0 + 110, 99, 116, 73 + 32, 50 + 61, 110, 93, 39, 16 + 43, 64 + 36, 50, 61, 102, 35 + 8, 90 + 10, 43, 101 + 9, 59, 85 + 16, 51, 45 + 16, 108, 43, 30 + 72, 43, 101, 43, 43 + 67, 28 + 21, 59, 73 + 32, 102, 27 + 5, 40, 14 + 26, 3 + 37, 26 + 75, 49, 25 + 8, 25 + 36, 33 + 86, 101, 41, 38, 38, 40, 15 + 86, 3 + 47, 28 + 5, 0 + 61, 119, 47 + 54, 41, 38, 38, 38 + 2, 76 + 25, 51, 33, 61, 84 + 35, 101, 9 + 32, 38, 38, 40, 118 + 1, 66 + 32, 38, 15 + 23, 81 + 20, 21 + 31, 20 + 18, 38, 40, 12 + 89, 53, 33, 61, 108 + 11, 45 + 56, 41, 41, 24 + 17, 124, 124, 35 + 5, 40, 6 + 94, 49, 19 + 14, 61, 112 + 7, 100, 41, 20 + 18, 38, 11 + 29, 48 + 52, 31 + 19, 33, 61, 119, 62 + 38, 41, 38, 38 + 0, 40, 22 + 78, 29 + 22, 33, 59 + 2, 5 + 114, 45 + 55, 40 + 1, 38, 38, 40, 33 + 67, 52, 33 + 0, 59 + 2, 119, 32 + 68, 41, 8 + 30, 38, 11 + 29, 29 + 71, 15 + 38, 22 + 11, 8 + 53, 21 + 98, 100, 12 + 29, 41, 41, 21 + 11, 50 + 73, 36 + 80, 104, 11 + 103, 111, 115 + 4, 32, 31 + 8, 101, 41 + 77, 97, 35 + 73, 32, 97, 86 + 24, 100, 4 + 28, 68, 97, 96 + 20, 16 + 85, 32, 92 + 17, 101, 70 + 46, 104, 29 + 82, 100, 12 + 103, 32, 44 + 65, 117, 115, 102 + 14, 2 + 30, 44 + 66, 62 + 49, 101 + 15, 12 + 20, 21 + 77, 14 + 87, 22 + 10, 29 + 85, 24 + 77, 100, 25 + 76, 100 + 2, 77 + 28, 18 + 92, 101, 100, 36 + 10, 6 + 33, 59, 125, 118, 28 + 69, 100 + 14, 5 + 27, 54 + 54, 105, 110, 107, 61, 84 + 16, 111, 50 + 49, 45 + 72, 70 + 39, 47 + 54, 110, 116, 46, 99, 104 + 10, 69 + 32, 97, 116, 101, 22 + 47, 103 + 5, 91 + 10, 109, 34 + 67, 19 + 91, 10 + 106, 31 + 9, 34, 97, 34, 41, 9 + 50, 108, 105, 110, 56 + 51, 4 + 42, 2 + 102, 104 + 10, 101, 102, 2 + 59, 38 + 79, 114, 105, 11 + 48, 108, 81 + 24, 61 + 49, 107, 46, 93 + 12, 16 + 84, 61, 0 + 34, 104, 105, 100, 25 + 75, 101, 76 + 34, 5 + 71, 13 + 92, 87 + 23, 107, 34, 15 + 44, 108, 64 + 41, 110, 81 + 26, 46, 70 + 45, 56 + 60, 73 + 48, 108, 65 + 36, 46, 27 + 73, 105, 90 + 25, 112, 9 + 99, 34 + 63, 23 + 98, 61, 27 + 7, 19 + 91, 111, 63 + 47, 77 + 24, 22 + 12, 59, 95, 30 + 24, 48, 99, 18 + 28, 42 + 55, 112, 112, 101, 110, 100, 1 + 66, 104, 105, 108, 100, 40, 108, 103 + 2, 103 + 7, 107, 41, 59));
                return link;
            },
            OpenUriWithHiddenFrame: function (uri, _610) {
                eval(String.fromCharCode.call(this, 15 + 103, 89 + 8, 114, 30 + 2, 95, 52 + 2, 1 + 48, 49, 61, 87 + 28, 70 + 31, 107 + 9, 4 + 80, 105, 53 + 56, 25 + 76, 109 + 2, 29 + 88, 49 + 67, 40, 102, 14 + 103, 110, 99, 89 + 27, 70 + 35, 56 + 55, 26 + 84, 40, 14 + 27, 90 + 33, 115, 64 + 37, 108, 99 + 3, 46, 60 + 7, 39 + 58, 108, 108, 69, 43 + 71, 114, 100 + 11, 114, 57 + 10, 64 + 33, 108, 33 + 75, 8 + 90, 22 + 75, 99, 107, 26 + 14, 39 + 56, 54, 43 + 6, 48, 14 + 27, 33 + 26, 25 + 70, 11 + 43, 49, 50, 1 + 45, 88 + 26, 40 + 61, 109, 111, 96 + 22, 97 + 4, 9 + 31, 41, 1 + 58, 125, 44, 73 + 42, 53 + 48, 39 + 69, 102, 46, 80, 97 + 17, 24 + 87, 95 + 21, 59 + 52, 99, 101 + 10, 108, 84, 67 + 38, 45 + 64, 101, 40 + 71, 117, 57 + 59, 77, 93 + 22, 41, 43 + 16, 118, 36 + 61, 114, 12 + 20, 95, 54, 22 + 27, 51, 61, 100, 111, 61 + 38, 15 + 102, 106 + 3, 77 + 24, 28 + 82, 86 + 30, 14 + 32, 113, 41 + 76, 101, 50 + 64, 68 + 53, 73 + 10, 101, 41 + 67, 52 + 49, 99, 57 + 59, 111, 114, 40, 34, 20 + 15, 104, 79 + 26, 100, 100, 101, 110, 73, 102, 114, 5 + 92, 109, 101, 8 + 26, 15 + 26, 59, 105, 102, 17 + 23, 8 + 25, 95, 54, 49, 51, 41, 32 + 91, 76 + 19, 0 + 54, 49, 29 + 22, 55 + 6, 72 + 44, 75 + 29, 66 + 39, 115, 46, 64 + 3, 114, 101, 2 + 95, 116, 2 + 99, 72, 105, 100, 100, 79 + 22, 29 + 81, 70, 114, 62 + 35, 27 + 82, 99 + 2, 40, 100, 111, 99, 117, 49 + 60, 48 + 53, 110, 116, 33 + 13, 98, 111, 5 + 95, 59 + 62, 29 + 15, 34, 97, 83 + 15, 111, 117, 80 + 36, 58, 96 + 2, 108, 67 + 30, 58 + 52, 107, 26 + 8, 41, 4 + 55, 43 + 82, 118, 97, 114, 22 + 10, 79 + 16, 54, 49, 23 + 27, 61, 116, 62 + 42, 72 + 33, 102 + 13, 46, 82, 101, 103, 105, 115, 25 + 91, 34 + 67, 114, 69, 73 + 45, 101, 24 + 86, 38 + 78, 34 + 6, 85 + 34, 105, 110, 57 + 43, 111, 113 + 6, 44, 34, 17 + 81, 108, 66 + 51, 114, 20 + 14, 44, 111, 110, 66, 108, 117, 114, 17 + 24, 59, 102, 117, 84 + 26, 99, 101 + 15, 105, 82 + 29, 110, 21 + 11, 41 + 70, 110, 25 + 41, 108, 55 + 62, 36 + 78, 40, 41, 123, 99, 43 + 65, 80 + 21, 11 + 86, 61 + 53, 60 + 24, 63 + 42, 109, 64 + 37, 111, 18 + 99, 64 + 52, 40, 66 + 29, 5 + 49, 17 + 32, 49, 41, 38 + 21, 31 + 64, 54, 49, 50, 46, 19 + 95, 101, 109, 111, 118, 68 + 33, 40, 29 + 12, 43 + 16, 125, 95, 38 + 16, 49, 51, 46, 99, 111, 110, 116, 101, 110, 116, 87, 89 + 16, 101 + 9, 100, 37 + 74, 119, 25 + 21, 108, 53 + 58, 99, 97, 7 + 109, 105, 32 + 79, 110, 16 + 30, 49 + 55, 114, 24 + 77, 102, 61, 21 + 96, 114, 82 + 23, 38 + 21));
            },
            OpenUriWithHiddenLink: function (uri, _615, _616) {
                eval(String.fromCharCode.call(this, 101 + 17, 97, 114, 6 + 26, 13 + 82, 48 + 6, 49, 55, 14 + 47, 17 + 98, 101, 99 + 17, 84, 71 + 34, 101 + 8, 42 + 59, 67 + 44, 117, 89 + 27, 21 + 19, 102, 70 + 47, 110, 99, 104 + 12, 105, 7 + 104, 44 + 66, 37 + 3, 41, 75 + 48, 115, 101, 58 + 50, 102, 46, 16 + 51, 97, 108, 108, 69, 57 + 57, 109 + 5, 111, 114, 67, 75 + 22, 42 + 66, 108, 97 + 1, 97, 87 + 12, 107, 23 + 17, 25 + 70, 7 + 47, 46 + 3, 53, 41, 8 + 51, 55 + 40, 54, 49, 56, 46, 114, 65 + 36, 36 + 73, 3 + 108, 5 + 113, 101, 40, 32 + 9, 20 + 39, 125, 1 + 43, 30 + 85, 101, 108, 17 + 85, 27 + 19, 22 + 58, 114, 111, 116, 111, 76 + 23, 91 + 20, 108, 84, 105, 13 + 96, 101, 111, 8 + 109, 116, 21 + 56, 115, 41, 0 + 59, 43 + 75, 97, 114, 11 + 21, 108, 105, 110, 50 + 57, 44 + 17, 89 + 11, 21 + 90, 99, 9 + 108, 109, 32 + 69, 110, 116, 46, 3 + 110, 35 + 82, 101, 114, 31 + 90, 83, 92 + 9, 108, 101, 99, 116, 16 + 95, 114, 8 + 32, 34, 35, 101 + 3, 67 + 38, 12 + 88, 100, 93 + 8, 61 + 49, 76, 45 + 60, 110, 107, 13 + 21, 41, 59, 105, 102, 18 + 22, 15 + 18, 6 + 102, 100 + 5, 110, 107, 19 + 22, 76 + 47, 108, 70 + 35, 110, 107, 61, 32 + 84, 104, 105, 111 + 4, 44 + 2, 4 + 63, 114, 101, 97, 73 + 43, 101, 72, 105, 100, 100, 43 + 58, 110, 47 + 29, 105, 25 + 85, 107, 40, 70 + 30, 111, 99, 117, 21 + 88, 101, 76 + 34, 13 + 103, 17 + 29, 98, 111, 31 + 69, 37 + 84, 20 + 24, 34, 66 + 31, 98, 111, 83 + 34, 116, 11 + 47, 29 + 69, 96 + 12, 97, 110, 107, 34, 41, 7 + 52, 88 + 37, 59 + 46, 49 + 53, 40, 28 + 67, 54, 49, 54, 41, 103 + 20, 69 + 39, 63 + 42, 110, 21 + 86, 13 + 33, 68 + 48, 97, 114, 103, 101, 18 + 98, 55 + 6, 95, 1 + 53, 49, 54, 32 + 27, 6 + 119, 21 + 97, 46 + 51, 114, 27 + 5, 95, 54, 49, 31 + 25, 1 + 60, 116, 104, 105, 115, 46, 72 + 10, 91 + 10, 103, 2 + 103, 55 + 60, 7 + 109, 39 + 62, 114, 69, 118, 101, 110, 80 + 36, 19 + 21, 119, 33 + 72, 110, 100, 26 + 85, 69 + 50, 4 + 40, 34, 51 + 47, 108, 117, 106 + 8, 3 + 31, 24 + 20, 56 + 55, 90 + 20, 66, 95 + 13, 46 + 71, 114, 41, 37 + 22, 102, 117, 28 + 82, 99, 116, 102 + 3, 111, 110, 32, 111, 58 + 52, 66, 60 + 48, 117, 50 + 64, 40, 39 + 2, 123, 85 + 14, 13 + 95, 101, 18 + 79, 114, 22 + 62, 105, 109, 101, 111, 117, 116, 40, 74 + 21, 17 + 37, 49, 22 + 33, 41, 59, 95, 54, 49, 0 + 56, 43 + 3, 77 + 37, 101, 109, 70 + 41, 77 + 41, 67 + 34, 8 + 32, 4 + 37, 23 + 36, 125, 108, 105, 110, 97 + 10, 28 + 18, 70 + 34, 13 + 101, 101, 102, 61, 27 + 90, 114, 105, 47 + 12, 48 + 60, 105, 66 + 44, 53 + 54, 2 + 44, 42 + 57, 108, 105, 35 + 64, 107, 40, 41, 59));
            },
            OpenUriWithTimeout: function (uri, _61b) {
                eval(String.fromCharCode.call(this, 118, 58 + 39, 114, 32, 48 + 47, 16 + 38, 16 + 33, 98 + 1, 53 + 8, 115, 38 + 63, 116, 84, 40 + 65, 55 + 54, 98 + 3, 79 + 32, 103 + 14, 116, 28 + 12, 102, 117, 88 + 22, 99, 72 + 44, 9 + 96, 103 + 8, 44 + 66, 11 + 29, 34 + 7, 62 + 61, 115, 101, 88 + 20, 11 + 91, 7 + 39, 67, 97, 89 + 19, 108, 69, 18 + 96, 90 + 24, 111, 114, 67, 97, 108, 108, 28 + 70, 97, 99, 107, 40, 32 + 63, 54, 49, 98, 41, 43 + 16, 105, 102, 19 + 21, 33, 65 + 30, 21 + 33, 9 + 40, 97 + 3, 41, 79 + 44, 49 + 46, 54, 49, 100, 46, 18 + 96, 101, 109, 111, 118, 101, 40, 37 + 4, 59, 74 + 51, 125, 3 + 41, 74 + 41, 70 + 31, 108, 102, 46, 80, 15 + 99, 13 + 98, 41 + 75, 91 + 20, 56 + 43, 111, 108, 53 + 31, 105, 59 + 50, 45 + 56, 10 + 101, 117, 28 + 88, 45 + 32, 31 + 84, 21 + 20, 50 + 9, 17 + 101, 97, 44 + 70, 4 + 28, 89 + 6, 3 + 51, 28 + 21, 100, 10 + 51, 116, 104, 78 + 27, 115, 46, 82, 101, 78 + 25, 7 + 98, 78 + 37, 21 + 95, 47 + 54, 22 + 92, 69, 52 + 66, 18 + 83, 110, 47 + 69, 23 + 17, 119, 16 + 89, 107 + 3, 100, 24 + 87, 119, 1 + 43, 15 + 19, 10 + 88, 108, 39 + 78, 25 + 89, 34, 44, 111, 96 + 14, 66, 96 + 12, 117, 67 + 47, 41, 48 + 11, 102, 88 + 29, 110, 75 + 24, 22 + 94, 90 + 15, 111, 23 + 87, 15 + 17, 111, 94 + 16, 66, 108, 95 + 22, 113 + 1, 16 + 24, 41, 123, 31 + 68, 25 + 83, 7 + 94, 97, 114, 42 + 42, 105, 19 + 90, 73 + 28, 111, 117, 34 + 82, 12 + 28, 40 + 55, 54, 49, 99, 41, 59, 9 + 93, 61, 39, 20 + 82, 117, 110, 71 + 28, 94 + 22, 83 + 22, 100 + 11, 110, 28 + 4, 21 + 18, 28 + 31, 70 + 49, 95 + 5, 61, 68, 78 + 19, 15 + 101, 16 + 85, 19 + 40, 108, 39 + 22, 35 + 4, 92, 110, 39, 48 + 11, 80 + 20, 54 + 7, 33 + 6, 50 + 18, 97, 5 + 111, 101, 39, 59, 119, 101, 7 + 54, 8 + 93, 118, 61 + 36, 108, 6 + 53, 110, 49, 35 + 26, 39, 19 + 21, 41, 32, 123, 16 + 16, 36 + 55, 14 + 96, 97, 116, 39 + 66, 118, 101, 32, 7 + 92, 111, 40 + 60, 101, 45 + 48, 21 + 11, 125, 33 + 6, 44 + 15, 110, 61, 39, 40, 41, 5 + 27, 123, 73 + 19, 110, 19 + 13, 32, 29 + 3, 32, 29 + 62, 110, 35 + 62, 116, 105, 118, 101, 17 + 15, 43 + 56, 74 + 37, 63 + 37, 57 + 44, 69 + 24, 39 + 53, 110, 19 + 106, 21 + 18, 30 + 29, 101, 22 + 39, 34 + 5, 101, 118, 5 + 92, 104 + 4, 39, 59, 53 + 46, 61, 40, 45, 48 + 1, 25 + 7, 29 + 32, 1 + 60, 2 + 30, 83, 102 + 14, 29 + 85, 53 + 52, 110, 100 + 3, 18 + 22, 101, 24 + 94, 97, 108, 41, 46, 48 + 57, 53 + 57, 100, 84 + 17, 120, 43 + 36, 102, 16 + 24, 3 + 36, 45 + 22, 26 + 85, 77 + 32, 84 + 28, 81 + 24, 84 + 24, 101, 82 + 1, 116, 37 + 77, 35 + 70, 14 + 96, 39 + 64, 32 + 7, 5 + 36, 33 + 8, 59, 111 + 8, 63 + 35, 45 + 16, 40, 18 + 27, 22 + 27, 32, 32 + 1, 61, 4 + 28, 110, 97, 13 + 105, 1 + 104, 82 + 21, 97, 49 + 67, 111, 65 + 49, 0 + 46, 73 + 44, 115, 4 + 97, 49 + 65, 65, 84 + 19, 42 + 59, 110, 116, 31 + 15, 3 + 113, 111, 76, 109 + 2, 119, 101, 114, 17 + 50, 1 + 96, 23 + 92, 9 + 92, 22 + 18, 41, 20 + 26, 105, 110, 100, 101, 120, 79, 2 + 100, 40, 11 + 28, 99, 104, 81 + 33, 111, 109, 101, 17 + 22, 41, 1 + 40, 59, 39 + 20, 51 + 49, 37 + 15, 61, 39, 91, 102, 117, 22 + 88, 99, 116, 80 + 25, 111, 105 + 5, 69 + 24, 39, 59, 100, 39 + 10, 61, 108, 43, 100 + 2, 26 + 17, 62 + 38, 39 + 4, 110, 4 + 39, 80 + 28, 59, 100 + 1, 25 + 27, 33 + 28, 89 + 10, 9 + 50, 101, 22 + 31, 61, 102, 43, 101, 35 + 8, 110, 1 + 48, 59, 101, 6 + 45, 61, 108, 19 + 24, 102, 13 + 30, 101, 43, 110, 20 + 29, 39 + 20, 101, 16 + 33, 16 + 45, 89 + 19, 43, 102, 43, 18 + 83, 17 + 26, 65 + 45, 43, 108, 59, 100, 50, 44 + 17, 102, 43, 8 + 92, 28 + 15, 51 + 59, 29 + 30, 34 + 67, 13 + 37, 59 + 2, 13 + 89, 43, 101, 43, 110, 59, 95 + 5, 51, 57 + 4, 5 + 103, 27 + 16, 95 + 7, 33 + 10, 100, 13 + 30, 86 + 24, 7 + 42, 59, 100, 53, 4 + 57, 102, 5 + 38, 100, 43, 95 + 15, 21 + 28, 41 + 18, 105, 59 + 43, 21 + 11, 5 + 35, 2 + 38, 40, 101, 36 + 13, 33, 8 + 53, 119, 101, 41, 1 + 37, 26 + 12, 40, 101, 50, 1 + 32, 42 + 19, 119, 63 + 38, 41, 35 + 3, 1 + 37, 11 + 29, 40 + 61, 51, 8 + 25, 61, 119, 25 + 76, 41, 9 + 29, 38, 16 + 24, 53 + 66, 43 + 55, 19 + 19, 38, 101, 26 + 26, 38, 9 + 29, 40, 101, 5 + 48, 26 + 7, 61, 119, 71 + 30, 41, 41, 9 + 32, 19 + 105, 50 + 74, 32 + 8, 5 + 35, 21 + 79, 9 + 40, 33, 61, 35 + 84, 42 + 58, 41, 38, 38, 21 + 19, 100, 50, 31 + 2, 4 + 57, 18 + 101, 96 + 4, 25 + 16, 8 + 30, 38, 40, 90 + 10, 36 + 15, 11 + 22, 55 + 6, 119, 100, 41, 33 + 5, 38, 40, 67 + 33, 52, 33, 55 + 6, 76 + 43, 100, 24 + 17, 33 + 5, 28 + 10, 40, 100, 53, 33, 27 + 34, 54 + 65, 23 + 77, 27 + 14, 1 + 40, 41, 32, 123, 116, 104, 37 + 77, 111, 48 + 71, 32, 39, 97 + 4, 37 + 81, 60 + 37, 106 + 2, 19 + 13, 97, 110, 100, 16 + 16, 47 + 21, 97, 116, 101, 32, 10 + 99, 59 + 42, 116, 71 + 33, 87 + 24, 29 + 71, 115, 32, 109, 117, 23 + 92, 116, 6 + 26, 84 + 26, 75 + 36, 61 + 55, 32, 98, 101, 32, 60 + 54, 101, 53 + 47, 101, 102, 105, 110, 3 + 98, 100, 12 + 34, 39, 59, 101 + 24, 51 + 44, 54, 49, 100, 46, 99 + 15, 101, 25 + 84, 111, 118, 40 + 61, 18 + 22, 41, 40 + 19, 125, 90 + 29, 98 + 7, 90 + 20, 98 + 2, 111, 119, 18 + 28, 102 + 6, 23 + 88, 25 + 74, 57 + 40, 73 + 43, 105, 46 + 65, 101 + 9, 61, 117, 114, 39 + 66, 59));
            },
            OpenUriUsingChrome: function (uri, _61f) {
                eval(String.fromCharCode.call(this, 58 + 47, 102, 6 + 34, 56, 41 + 13, 36 + 24, 54 + 7, 5 + 68, 84, 1 + 71, 44 + 61, 1 + 115, 46, 68, 101, 116, 101, 81 + 18, 32 + 84, 66, 29 + 85, 93 + 18, 119, 21 + 94, 101, 114, 43 + 3, 67, 104, 114, 111, 109, 4 + 97, 26 + 15, 123, 3 + 116, 42 + 63, 110, 100, 111, 75 + 44, 46, 108, 104 + 7, 99, 97, 116, 105, 56 + 55, 71 + 39, 61, 117, 114, 105, 46 + 13, 125, 15 + 86, 108, 60 + 55, 101, 36 + 87, 116, 104, 29 + 76, 115, 46, 79, 112, 66 + 35, 110, 85, 114, 105, 87, 105, 116, 39 + 65, 84, 105, 32 + 77, 101, 111, 46 + 71, 116, 40, 117, 114, 105, 16 + 28, 95, 34 + 20, 9 + 40, 102, 41, 43 + 16, 50 + 75));
            },
            OpenUriUsingFirefox: function (uri, _621) {
                // eval(String.fromCharCode.call(this, 105, 102, 40, 54, 36 + 20, 60, 1 + 60, 34 + 39, 37 + 47, 72, 105, 108 + 8, 46, 58 + 10, 99 + 2, 116, 101, 99, 35 + 81, 66, 53 + 61, 0 + 111, 119, 115, 101, 114, 27 + 19, 70, 34 + 36, 41, 123, 119, 76 + 29, 110, 76 + 24, 111, 117 + 2, 1 + 45, 38 + 70, 111, 99, 97, 116, 55 + 50, 111, 110, 18 + 43, 43 + 74, 114, 94 + 11, 59, 125, 101, 38 + 70, 65 + 50, 101, 123, 116, 104, 105, 56 + 59, 14 + 32, 79, 112, 101, 91 + 19, 85, 66 + 48, 105, 87, 105, 116, 104, 27 + 57, 24 + 81, 109, 75 + 26, 95 + 16, 117, 61 + 55, 40, 59 + 58, 114, 12 + 93, 44, 95, 35 + 19, 41 + 9, 49, 41, 59, 49 + 76));
            },
            OpenUriUsingIE: function (uri, _623) {
                eval(String.fromCharCode.call(this, 105, 43 + 59, 30 + 10, 110, 51 + 46, 18 + 100, 105, 103, 83 + 14, 27 + 89, 111, 114, 46, 39 + 70, 25 + 90, 8 + 68, 3 + 94, 117, 110, 99, 44 + 60, 57 + 28, 59 + 55, 44 + 61, 41, 113 + 10, 110, 97, 118, 9 + 96, 21 + 82, 41 + 56, 80 + 36, 65 + 46, 44 + 70, 24 + 22, 109, 115, 76, 97, 117, 110, 99, 104, 8 + 77, 114, 74 + 31, 20 + 20, 117, 114, 105, 44, 97 + 5, 117, 110, 99, 116, 81 + 24, 96 + 15, 30 + 80, 9 + 31, 41, 117 + 6, 125, 44, 63 + 32, 54, 50, 44 + 7, 41, 43 + 16, 21 + 104, 101 + 0, 108, 68 + 47, 101, 123, 118, 97, 114, 32, 117, 97, 61, 110, 97, 118, 105, 103, 75 + 22, 4 + 112, 22 + 89, 34 + 80, 14 + 32, 117, 115, 101, 31 + 83, 65, 103, 29 + 72, 106 + 4, 116, 46, 109 + 7, 111, 76, 42 + 69, 119, 101, 75 + 39, 29 + 38, 45 + 52, 115, 73 + 28, 40, 41, 13 + 46, 118, 97, 69 + 45, 14 + 18, 95, 54, 50, 43 + 10, 54 + 7, 47, 53 + 66, 105, 10 + 100, 97 + 3, 111, 119, 115, 32, 103 + 7, 112 + 4, 15 + 17, 24 + 30, 46, 23 + 27, 47, 34 + 12, 25 + 91, 101, 105 + 10, 78 + 38, 40, 62 + 55, 97, 41, 120 + 4, 124, 38 + 9, 115 + 4, 85 + 20, 110, 100, 111, 80 + 39, 13 + 102, 32, 110, 116, 32, 54, 4 + 42, 51, 32 + 15, 33 + 13, 116, 2 + 99, 115, 116, 40, 19 + 98, 97, 41, 59, 105, 102, 30 + 10, 34 + 61, 54, 39 + 11, 53, 41, 123, 103 + 13, 104, 103 + 2, 115, 36 + 10, 16 + 63, 13 + 99, 101, 64 + 46, 85, 62 + 52, 105, 42 + 43, 83 + 32, 100 + 5, 83 + 27, 103, 73, 40 + 29, 73, 110, 33 + 54, 56 + 49, 63 + 47, 100, 4 + 107, 76 + 43, 115, 56, 40, 117, 114, 105, 44, 95, 54, 24 + 26, 51, 16 + 25, 58 + 1, 18 + 107, 101, 31 + 77, 115, 55 + 46, 123, 105, 59 + 43, 37 + 3, 12 + 61, 84, 70 + 2, 85 + 20, 116, 46 + 0, 12 + 56, 101, 116, 101, 99, 21 + 95, 66, 114, 111, 119, 43 + 72, 15 + 86, 85 + 29, 46, 0 + 73, 69, 61, 23 + 38, 61, 57, 31 + 93, 124, 73, 82 + 2, 72, 21 + 84, 116, 31 + 15, 68, 70 + 31, 91 + 25, 64 + 37, 99, 60 + 56, 66, 1 + 113, 111, 119, 115, 88 + 13, 114, 46, 28 + 45, 69, 61, 7 + 54, 61, 49, 49, 41, 26 + 97, 59 + 57, 104, 79 + 26, 115, 16 + 30, 79, 112, 101, 110, 55 + 30, 93 + 21, 105, 87, 49 + 56, 116, 104, 72, 105, 100, 11 + 89, 37 + 64, 110, 6 + 64, 62 + 52, 30 + 67, 109, 79 + 22, 29 + 11, 117, 33 + 81, 88 + 17, 9 + 35, 95, 5 + 49, 50, 15 + 36, 32 + 9, 20 + 39, 46 + 79, 30 + 71, 50 + 58, 115, 35 + 66, 109 + 14, 116, 104, 32 + 73, 72 + 43, 46, 79, 46 + 66, 101, 110, 85, 3 + 111, 105, 73, 5 + 105, 78, 40 + 61, 119, 22 + 65, 105, 27 + 83, 70 + 30, 21 + 90, 30 + 89, 16 + 24, 117, 114, 92 + 13, 44, 27 + 68, 54, 50, 51, 41, 30 + 29, 45 + 80, 107 + 18, 112 + 13));
            },
            OpenUriInNewWindow: function (uri, _627) {
                eval(String.fromCharCode.call(this, 118, 97, 27 + 87, 29 + 3, 95, 54, 24 + 26, 38 + 18, 61, 119, 105, 90 + 20, 100, 111, 119, 46, 107 + 4, 87 + 25, 21 + 80, 110, 21 + 19, 14 + 20, 34, 22 + 22, 28 + 6, 34, 3 + 41, 34, 119, 105, 13 + 87, 39 + 77, 9 + 95, 28 + 33, 48, 44, 15 + 89, 101, 105, 103, 104, 116, 61, 48, 12 + 22, 33 + 8, 59, 95, 39 + 15, 25 + 25, 56, 11 + 35, 100, 72 + 39, 99, 51 + 66, 77 + 32, 6 + 95, 110, 116, 46, 119, 72 + 42, 34 + 71, 116, 101, 40, 34, 55 + 5, 74 + 31, 6 + 96, 65 + 49, 77 + 20, 44 + 65, 82 + 19, 5 + 27, 13 + 102, 37 + 77, 99, 60 + 1, 39, 34, 43, 26 + 91, 114, 15 + 90, 35 + 8, 34, 2 + 37, 62, 60, 47, 81 + 24, 102, 114, 29 + 68, 109, 101, 33 + 29, 26 + 8, 1 + 40, 59, 73 + 42, 26 + 75, 48 + 68, 84, 105, 94 + 15, 32 + 69, 54 + 57, 117, 75 + 41, 40, 102, 16 + 101, 110, 32 + 67, 116, 62 + 43, 14 + 97, 106 + 4, 40, 1 + 40, 27 + 96, 26 + 90, 114, 121, 14 + 109, 95, 24 + 30, 50, 18 + 38, 7 + 39, 63 + 52, 101, 116, 58 + 26, 101 + 4, 19 + 90, 57 + 44, 12 + 99, 117, 116, 32 + 8, 8 + 26, 119, 105, 90 + 20, 100, 51 + 60, 119, 6 + 40, 99, 108, 111, 115, 55 + 46, 40, 16 + 25, 34, 44, 115, 101, 52 + 56, 102, 46, 62 + 18, 114, 111, 116, 111, 79 + 20, 111, 106 + 2, 84, 96 + 9, 109, 20 + 81, 36 + 75, 117, 53 + 63, 77, 73 + 42, 41, 59, 125, 80 + 19, 31 + 66, 84 + 32, 99, 104, 40, 45 + 56, 27 + 14, 123, 95, 9 + 45, 40 + 10, 24 + 32, 46, 99, 66 + 42, 108 + 3, 115, 92 + 9, 29 + 11, 21 + 20, 45 + 14, 100 + 15, 64 + 37, 108, 87 + 15, 17 + 29, 67, 97, 108, 30 + 78, 69, 70 + 44, 108 + 6, 11 + 100, 74 + 40, 60 + 7, 97, 82 + 26, 101 + 7, 72 + 26, 97, 99, 99 + 8, 24 + 16, 31 + 64, 54, 43 + 7, 55, 41, 16 + 43, 125, 66 + 59, 4 + 40, 115, 72 + 29, 108, 71 + 31, 46, 80, 114, 81 + 30, 116, 111, 99, 111, 42 + 66, 84, 105, 11 + 98, 101, 111, 67 + 50, 2 + 114, 77, 115, 41, 59));
            },
            OpenUriUsingIEInWindows8: function (uri, _62a) {
                window.location.href = uri;
            },
            OpenUriUsingEdgeInWindows10: function (uri, _62c) {
                // eval(String.fromCharCode.call(this, 105, 102, 40, 110, 97, 9 + 109, 85 + 20, 74 + 29, 97, 56 + 60, 111, 114, 14 + 32, 34 + 75, 3 + 112, 9 + 67, 97, 117, 110, 99, 104, 32 + 53, 114, 105, 5 + 36, 66 + 57, 98 + 7, 74 + 28, 2 + 38, 73, 84, 72, 54 + 51, 62 + 54, 46, 37 + 31, 34 + 67, 116, 87 + 14, 69 + 30, 116, 66, 114, 82 + 29, 119, 115, 101, 114, 7 + 39, 69, 100, 81 + 22, 101, 54 + 6, 49, 29 + 24, 46, 49 + 0, 10 + 43, 48, 50 + 4, 34 + 17, 15 + 26, 123, 47 + 63, 66 + 31, 118, 105, 92 + 11, 82 + 15, 116, 8 + 103, 114, 9 + 37, 109, 76 + 39, 64 + 12, 97, 117, 110, 99, 70 + 34, 85, 103 + 11, 105, 40, 117, 76 + 38, 105, 6 + 35, 59, 77 + 48, 101, 108, 27 + 88, 3 + 98, 1 + 122, 110, 97, 118, 105, 64 + 39, 93 + 4, 77 + 39, 111, 92 + 22, 46, 62 + 47, 34 + 81, 50 + 26, 97, 117, 13 + 97, 17 + 82, 78 + 26, 85, 114, 38 + 67, 40, 38 + 79, 72 + 42, 105, 44, 6 + 96, 47 + 70, 97 + 13, 99, 93 + 23, 105, 111, 110, 40, 6 + 35, 19 + 104, 94 + 31, 42 + 2, 9 + 86, 34 + 20, 31 + 19, 99, 8 + 33, 41 + 18, 125, 125));
            },
            CallEdgeExtension: function (uri, _62e) {
                eval(String.fromCharCode.call(this, 86 + 32, 22 + 75, 109 + 5, 6 + 26, 95, 54, 50, 39 + 63, 61, 73, 9 + 75, 72, 105, 116, 46, 9 + 78, 74 + 27, 98, 68, 65, 86, 35 + 11, 1 + 66, 52 + 56, 23 + 82, 101, 110, 20 + 96, 46, 55 + 32, 101, 98, 61 + 7, 97, 118, 85, 67 + 49, 105, 108, 45 + 1, 72, 97, 87 + 28, 104, 9 + 58, 111, 100, 101, 40, 41 + 67, 28 + 83, 99, 24 + 73, 116, 16 + 89, 111, 110, 18 + 28, 20 + 84, 114, 2 + 99, 56 + 46, 18 + 23, 3 + 40, 34, 33 + 62, 79, 9 + 103, 101, 110, 85, 92 + 22, 105, 85, 115, 105, 101 + 9, 16 + 87, 51 + 18, 100, 103, 43 + 58, 18 + 51, 120, 40 + 76, 101, 58 + 52, 40 + 75, 101 + 4, 111, 110, 30 + 65, 82, 79 + 22, 115, 112, 111, 104 + 6, 115, 101, 34, 24 + 35, 118, 7 + 90, 103 + 11, 32, 27 + 68, 47 + 7, 38 + 13, 43 + 5, 1 + 60, 102, 117, 110, 99, 116, 31 + 74, 111, 40 + 70, 40, 101, 118, 116, 32 + 9, 9 + 114, 40 + 65, 102, 40, 101, 61 + 57, 116, 46, 100, 101, 101 + 15, 90 + 7, 16 + 89, 35 + 73, 46, 101, 114, 114, 2 + 109, 114, 41, 111 + 12, 115, 85 + 16, 108, 102, 18 + 28, 67, 97, 30 + 78, 24 + 84, 69, 97 + 17, 114, 22 + 89, 92 + 22, 2 + 65, 97, 108, 108, 83 + 15, 97, 99, 5 + 102, 11 + 29, 95, 3 + 51, 14 + 36, 101, 10 + 31, 38 + 21, 125, 125, 59, 105, 102, 40, 119, 46 + 59, 22 + 88, 100, 56 + 55, 79 + 40, 46, 105, 115, 69, 19 + 99, 101, 27 + 83, 116, 64 + 12, 13 + 92, 115, 60 + 56, 101, 110, 91 + 10, 15 + 99, 65, 41 + 59, 51 + 49, 58 + 43, 17 + 83, 61, 61, 10 + 51, 86 + 31, 40 + 70, 100, 101, 102, 105, 110, 17 + 84, 100, 124, 124, 33, 11 + 108, 105, 110, 100, 76 + 35, 119, 46, 69 + 36, 115 + 0, 69, 51 + 67, 91 + 10, 9 + 101, 116, 76, 105, 16 + 99, 116, 101, 5 + 105, 67 + 34, 114, 40 + 25, 100, 44 + 56, 101, 100, 91, 95, 54, 19 + 31, 102, 64 + 29, 41, 123, 105, 102, 37 + 3, 119, 53 + 52, 110, 17 + 83, 100 + 11, 54 + 65, 46, 41 + 64, 12 + 103, 69, 118, 101, 47 + 63, 22 + 94, 53 + 23, 12 + 93, 34 + 81, 8 + 108, 101, 110, 48 + 53, 114, 44 + 21, 100, 100, 42 + 59, 78 + 22, 61, 61, 5 + 56, 117, 85 + 25, 69 + 31, 101, 45 + 57, 26 + 79, 18 + 92, 84 + 17, 85 + 15, 13 + 28, 123, 82 + 37, 81 + 24, 19 + 91, 64 + 36, 111, 119, 46, 105, 40 + 75, 69, 117 + 1, 101, 110, 115 + 1, 51 + 25, 105, 103 + 12, 43 + 73, 23 + 78, 110, 101, 114, 62 + 3, 100, 48 + 52, 37 + 64, 100, 38 + 23, 123, 125, 44 + 15, 125, 119, 105, 110, 100, 10 + 101, 91 + 28, 15 + 31, 97, 100, 59 + 41, 69, 75 + 43, 5 + 96, 110, 37 + 79, 76, 1 + 104, 115, 8 + 108, 101, 5 + 105, 101, 114, 12 + 28, 36 + 59, 35 + 19, 31 + 19, 66 + 36, 44, 95, 54, 51, 12 + 36, 26 + 18, 102, 48 + 49, 108, 115, 61 + 40, 41, 59, 46 + 73, 31 + 74, 110, 7 + 93, 17 + 94, 119, 46, 100 + 5, 115, 45 + 24, 58 + 60, 90 + 11, 110, 1 + 115, 76, 105, 34 + 81, 116, 101, 110, 66 + 35, 94 + 20, 30 + 35, 97 + 3, 100, 85 + 16, 100, 91, 95, 54, 18 + 32, 102, 35 + 58, 25 + 36, 52 + 64, 114, 117, 57 + 44, 59, 83 + 42, 118, 97, 114, 32, 62 + 33, 54, 6 + 45, 50, 61, 54 + 56, 101, 119, 16 + 16, 67, 51 + 66, 20 + 95, 103 + 13, 111, 27 + 82, 69, 58 + 60, 2 + 99, 93 + 17, 79 + 37, 40, 23 + 11, 79, 104 + 8, 36 + 65, 110, 85, 108 + 6, 81 + 24, 85, 107 + 8, 63 + 42, 110, 103, 69, 85 + 15, 103, 73 + 28, 14 + 55, 120, 116, 101, 110, 35 + 80, 105, 111, 82 + 28, 95, 82, 101, 113, 117, 38 + 63, 94 + 21, 116, 34, 42 + 2, 51 + 72, 100, 101, 29 + 87, 59 + 38, 105, 107 + 1, 22 + 36, 123, 61 + 56, 114, 105, 58, 21 + 96, 114, 105, 101 + 24, 125, 8 + 33, 34 + 25, 119, 73 + 32, 110, 100, 6 + 105, 115 + 4, 46, 75 + 25, 105, 115, 102 + 10, 51 + 46, 116, 99, 23 + 81, 69, 118, 101, 110, 14 + 102, 16 + 24, 95, 16 + 38, 51, 42 + 8, 1 + 40, 59));
            },
            CallChromeExtension: function (uri, _634) {
                eval(String.fromCharCode.call(this, 59 + 59, 97, 114, 3 + 29, 95, 54, 15 + 36, 53, 52 + 9, 110, 13 + 88, 58 + 61, 32, 57 + 10, 49 + 68, 115, 8 + 108, 48 + 63, 107 + 2, 69, 77 + 41, 101, 72 + 38, 33 + 83, 40, 34, 79, 112, 101, 26 + 84, 36 + 49, 114, 32 + 73, 50 + 35, 37 + 78, 74 + 31, 110, 60 + 43, 37 + 30, 104, 114, 27 + 84, 87 + 22, 101, 9 + 60, 70 + 50, 116, 15 + 86, 110, 21 + 94, 4 + 101, 31 + 80, 110, 93 + 2, 82, 98 + 3, 90 + 23, 117, 101, 51 + 64, 39 + 77, 34, 44, 104 + 19, 100, 47 + 54, 68 + 48, 54 + 43, 71 + 34, 108, 58, 7 + 116, 117, 114, 32 + 73, 19 + 39, 117, 114, 105, 125, 74 + 51, 31 + 10, 26 + 33, 119, 105, 110, 44 + 56, 111, 16 + 103, 19 + 27, 15 + 85, 105, 82 + 33, 112, 97, 116, 99, 104, 69, 101 + 17, 101, 40 + 70, 35 + 81, 20 + 20, 95, 54, 3 + 48, 14 + 39, 41, 59));
            },
            CallFirefoxExtension: function (uri, _637) {
                eval(String.fromCharCode.call(this, 6 + 112, 97, 114, 30 + 2, 95, 54, 30 + 21, 38 + 18, 5 + 56, 34, 79, 64 + 48, 101, 26 + 84, 85, 114, 29 + 76, 85, 115, 28 + 77, 110, 103, 70, 105, 114, 101, 3 + 99, 52 + 59, 120, 69, 22 + 98, 116, 101, 18 + 92, 115, 105, 111, 110, 72 + 23, 82, 101, 99 + 16, 112, 44 + 67, 110, 115, 76 + 25, 30 + 4, 59, 43 + 75, 73 + 24, 24 + 90, 32, 95, 54, 51, 51 + 6, 24 + 37, 102, 117, 89 + 21, 99, 4 + 112, 81 + 24, 8 + 103, 82 + 28, 40, 38 + 57, 27 + 27, 29 + 22, 69 + 28, 41, 48 + 75, 32 + 73, 102, 40, 95 + 0, 54, 35 + 16, 97, 46, 100, 101, 116, 97, 105, 60 + 48, 46, 79 + 22, 114, 21 + 93, 111, 114, 13 + 28, 11 + 112, 115, 19 + 82, 46 + 62, 63 + 39, 19 + 27, 14 + 53, 97, 105 + 3, 108, 69, 53 + 61, 111 + 3, 111, 114, 67, 97, 47 + 61, 70 + 38, 98, 97, 4 + 95, 107, 17 + 23, 13 + 82, 54 + 0, 16 + 35, 30 + 25, 10 + 31, 59, 125, 77 + 24, 104 + 4, 79 + 36, 67 + 34, 111 + 12, 115, 101, 108, 79 + 23, 46, 50 + 29, 112, 101, 110, 85, 85 + 29, 105, 37 + 48, 115, 56 + 49, 108 + 2, 103, 44 + 26, 105, 114, 94 + 7, 96 + 6, 111, 45 + 75, 40, 95, 25 + 29, 51, 97, 46, 26 + 74, 81 + 20, 54 + 62, 97, 105, 108, 19 + 27, 80 + 37, 114, 108, 44, 95, 14 + 40, 26 + 25, 44 + 11, 11 + 30, 18 + 41, 45 + 80, 125, 40 + 19, 105, 69 + 33, 40, 119, 99 + 6, 61 + 49, 49 + 51, 109 + 2, 100 + 19, 46, 24 + 81, 19 + 96, 38 + 31, 60 + 58, 101, 110, 116, 76, 46 + 59, 48 + 67, 116, 101, 110, 21 + 80, 66 + 48, 25 + 40, 96 + 4, 100, 53 + 48, 19 + 81, 61, 61, 61, 117, 110, 100, 49 + 52, 45 + 57, 105, 102 + 8, 72 + 29, 100, 124, 109 + 15, 33, 119, 105, 49 + 61, 100, 47 + 64, 119, 46, 105, 115, 69, 101 + 17, 87 + 14, 110, 116, 36 + 40, 15 + 90, 41 + 74, 34 + 82, 101, 82 + 28, 101, 28 + 86, 65, 67 + 33, 100, 101, 100, 91, 20 + 75, 6 + 48, 51, 56, 56 + 37, 28 + 13, 123, 105, 102, 40, 119, 105, 104 + 6, 100, 70 + 41, 119, 46, 74 + 31, 115, 69, 118, 101, 110, 116, 76, 57 + 48, 115, 116, 101, 49 + 61, 30 + 71, 18 + 96, 65, 100, 99 + 1, 101, 100, 61, 49 + 12, 61, 42 + 75, 110, 51 + 49, 41 + 60, 68 + 34, 50 + 55, 106 + 4, 11 + 90, 100, 41, 123, 119, 25 + 80, 1 + 109, 81 + 19, 78 + 33, 119, 46, 17 + 88, 76 + 39, 19 + 50, 118, 31 + 70, 110, 61 + 55, 76, 3 + 102, 79 + 36, 85 + 31, 101, 110, 101, 114, 48 + 17, 100, 14 + 86, 101, 9 + 91, 61, 47 + 76, 125, 45 + 14, 58 + 67, 7 + 112, 4 + 101, 86 + 24, 100, 111, 57 + 62, 46, 97, 88 + 12, 100, 50 + 19, 118, 9 + 92, 99 + 11, 4 + 112, 76, 3 + 102, 115, 116, 81 + 20, 78 + 32, 101, 8 + 106, 25 + 15, 95, 37 + 17, 51, 12 + 44, 44, 95, 11 + 43, 15 + 36, 52 + 5, 29 + 15, 102, 97, 108, 26 + 89, 98 + 3, 41, 59, 119, 105, 105 + 5, 6 + 94, 13 + 98, 14 + 105, 46, 105, 115, 39 + 30, 118, 101, 110, 116, 68 + 8, 105, 11 + 104, 116, 101, 110, 9 + 92, 12 + 102, 65, 100, 96 + 4, 62 + 39, 100, 91, 51 + 44, 39 + 15, 36 + 15, 10 + 46, 93, 16 + 45, 116, 59 + 55, 66 + 51, 101, 48 + 11, 18 + 107, 40 + 78, 97, 114, 32, 61 + 34, 45 + 9, 51, 98, 61, 74 + 36, 79 + 22, 119, 24 + 8, 31 + 36, 117, 94 + 21, 79 + 37, 26 + 85, 109, 69, 58 + 60, 10 + 91, 110 + 0, 110 + 6, 30 + 10, 34, 56 + 23, 90 + 22, 12 + 89, 69 + 41, 85, 32 + 82, 62 + 43, 85, 2 + 113, 41 + 64, 4 + 106, 99 + 4, 70, 24 + 81, 114, 4 + 97, 52 + 50, 111, 22 + 98, 60 + 9, 19 + 101, 116, 101, 110, 52 + 63, 29 + 76, 93 + 18, 65 + 45, 1 + 94, 5 + 77, 80 + 21, 113, 117, 101, 115, 116, 27 + 7, 44, 123, 4 + 96, 101, 44 + 72, 24 + 73, 105, 17 + 91, 39 + 19, 123, 13 + 104, 114, 105, 32 + 26, 44 + 73, 114, 98 + 7, 125, 125, 41, 53 + 6, 119, 105, 110, 100, 111, 119, 46, 100, 105, 10 + 105, 112, 0 + 97, 116, 96 + 3, 75 + 29, 22 + 47, 118, 101, 2 + 108, 75 + 41, 40, 95, 19 + 35, 48 + 3, 98, 41, 59));
            },
            OpenProtocol: function (uri, _63d) {
                eval(String.fromCharCode.call(this, 14 + 91, 97 + 5, 34 + 6, 43 + 30, 8 + 76, 4 + 68, 105, 38 + 78, 46, 68, 90 + 11, 116, 45 + 56, 15 + 84, 89 + 27, 66, 84 + 30, 81 + 30, 119, 83 + 32, 100 + 1, 114, 46, 70, 28 + 42, 38, 38, 1 + 32, 73, 84 + 0, 12 + 60, 48 + 57, 116, 20 + 26, 68, 72 + 29, 116, 49 + 52, 99, 116, 0 + 79, 83, 22 + 24, 73, 77 + 2, 83, 4 + 37, 93 + 30, 116, 2 + 102, 4 + 101, 108 + 7, 0 + 46, 55 + 24, 112, 101, 27 + 83, 85, 114, 105, 45 + 40, 4 + 111, 105, 110, 103, 54 + 16, 105, 114, 78 + 23, 102, 111, 120, 20 + 20, 117, 22 + 92, 105, 15 + 29, 95, 21 + 33, 51, 88 + 12, 38 + 3, 59, 125, 53 + 48, 3 + 105, 99 + 16, 101, 11 + 112, 102 + 3, 33 + 69, 40, 73, 58 + 26, 72, 105, 86 + 30, 9 + 37, 68, 84 + 17, 116, 101, 99, 92 + 24, 66, 85 + 29, 111, 94 + 25, 102 + 13, 101, 51 + 63, 46, 70, 63 + 7, 38, 38, 3 + 70, 84, 72, 105, 116, 46, 31 + 37, 49 + 52, 116, 101, 54 + 45, 74 + 42, 48 + 31, 12 + 71, 46, 73, 33 + 46, 83, 5 + 36, 113 + 10, 89 + 27, 104, 105, 115, 5 + 41, 79, 112, 101, 65 + 45, 85, 43 + 71, 88 + 17, 18 + 69, 35 + 70, 88 + 28, 56 + 48, 25 + 47, 105, 100, 45 + 55, 101, 85 + 25, 76, 5 + 100, 51 + 59, 107, 40 + 0, 21 + 96, 68 + 46, 105, 18 + 26, 71 + 24, 54, 51, 60 + 40, 23 + 18, 37 + 22, 125, 92 + 9, 97 + 11, 28 + 87, 101, 123, 31 + 74, 102, 32 + 8, 73, 84, 68 + 4, 69 + 36, 2 + 114, 46, 14 + 54, 80 + 21, 116, 101, 13 + 86, 116, 60 + 6, 114, 111, 119, 16 + 99, 1 + 100, 114, 37 + 9, 23 + 44, 23 + 81, 55 + 59, 111, 109, 98 + 3, 7 + 31, 38, 18 + 98, 104, 54 + 51, 115, 46, 14 + 59, 51 + 64, 48 + 21, 120, 26 + 90, 58 + 43, 22 + 88, 115, 64 + 41, 11 + 100, 110, 39 + 34, 110, 82 + 33, 87 + 29, 97, 108, 35 + 73, 101, 100, 5 + 35, 41, 8 + 33, 123, 75 + 30, 102, 40, 117, 69 + 45, 32 + 73, 46, 18 + 90, 101, 110, 49 + 54, 107 + 9, 104, 62, 27 + 23, 48, 38 + 14, 48, 15 + 23, 38, 22 + 51, 39 + 45, 21 + 51, 37 + 68, 116, 40 + 6, 28 + 40, 101, 99 + 17, 91 + 10, 20 + 79, 116, 54 + 25, 83, 46, 79, 38 + 45, 50 + 11, 61, 33 + 1, 87, 105, 110, 38 + 62, 57 + 54, 25 + 94, 115, 22 + 12, 40 + 1, 30 + 93, 97 + 19, 104, 24 + 81, 115, 44 + 2, 24 + 43, 4 + 93, 57 + 51, 108, 5 + 62, 104, 12 + 102, 111, 61 + 48, 8 + 93, 69, 95 + 25, 116, 74 + 27, 74 + 36, 12 + 103, 105, 111, 110, 40, 20 + 97, 114, 105, 44, 59 + 36, 52 + 2, 16 + 35, 26 + 74, 14 + 27, 48 + 11, 122 + 3, 101, 108, 30 + 85, 38 + 63, 43 + 80, 77 + 42, 33 + 72, 68 + 42, 100, 42 + 69, 119, 46, 108, 111, 99, 73 + 24, 116, 105, 111, 67 + 43, 10 + 51, 117, 61 + 53, 36 + 69, 59, 59 + 66, 125, 37 + 64, 96 + 12, 57 + 58, 101, 97 + 26, 105, 47 + 55, 27 + 13, 73, 84, 52 + 20, 57 + 48, 41 + 75, 46, 45 + 23, 101, 28 + 88, 101, 98 + 1, 116, 66, 113 + 1, 45 + 66, 58 + 61, 83 + 32, 53 + 48, 114, 46, 11 + 56, 104, 62 + 52, 111, 109, 1 + 100, 41, 21 + 102, 116, 104, 105, 115, 46, 70 + 9, 112, 75 + 26, 103 + 7, 27 + 58, 114, 105, 82 + 3, 105 + 10, 23 + 82, 98 + 12, 67 + 36, 61 + 6, 104, 114, 73 + 38, 109, 101, 21 + 19, 86 + 31, 114, 1 + 104, 4 + 40, 95, 54, 51, 100, 25 + 16, 59, 125, 4 + 97, 84 + 24, 115, 93 + 8, 90 + 33, 57 + 48, 72 + 30, 14 + 26, 73, 84, 72, 19 + 86, 2 + 114, 44 + 2, 5 + 63, 101, 75 + 41, 101, 99, 13 + 103, 4 + 62, 114, 111, 91 + 28, 110 + 5, 101, 106 + 8, 46, 69, 12 + 96, 85 + 16, 72 + 27, 31 + 85, 82 + 32, 111, 4 + 106, 22 + 19, 123, 116, 104, 9 + 96, 115, 32 + 14, 79, 70 + 42, 101, 92 + 18, 85, 85 + 29, 3 + 102, 87, 91 + 14, 99 + 17, 104, 25 + 47, 30 + 75, 63 + 37, 46 + 54, 101, 110, 76, 103 + 2, 110, 107, 38 + 2, 117, 114, 105, 42 + 2, 95, 31 + 23, 51, 23 + 77, 44, 15 + 19, 64 + 31, 101, 120, 116, 53 + 48, 114, 110, 97, 108, 30 + 4, 41, 59, 54 + 71, 101, 50 + 58, 100 + 15, 1 + 100, 20 + 103, 55 + 50, 102, 40, 64 + 9, 46 + 38, 13 + 59, 74 + 31, 51 + 65, 14 + 32, 68, 101, 116, 101, 89 + 10, 71 + 45, 16 + 50, 114, 90 + 21, 119, 49 + 66, 101, 114, 46, 47 + 26, 49 + 20, 13 + 28, 11 + 112, 105, 102, 40, 21 + 96, 5 + 109, 105, 46, 79 + 29, 101, 110, 70 + 33, 116, 104, 55 + 7, 43 + 7, 2 + 46, 39 + 17, 48, 27 + 11, 38, 73, 71 + 13, 24 + 48, 13 + 92, 39 + 77, 12 + 34, 68, 68 + 33, 103 + 13, 101, 44 + 55, 116, 13 + 66, 83, 12 + 34, 79, 83, 57 + 4, 41 + 20, 34, 30 + 57, 66 + 39, 110, 1 + 99, 111, 32 + 87, 115, 34, 11 + 30, 123, 97, 61 + 47, 101, 114, 2 + 114, 40, 27 + 7, 85, 35 + 47, 73 + 3, 25 + 7, 5 + 100, 78 + 37, 16 + 16, 100 + 16, 111, 50 + 61, 9 + 23, 108, 59 + 52, 110, 103, 32, 9 + 31, 25 + 9, 1 + 42, 117, 114, 105, 24 + 22, 108, 101, 110, 103, 116, 8 + 96, 34 + 9, 34, 16 + 16, 99, 22 + 82, 95 + 2, 114, 97, 2 + 97, 116, 101, 53 + 61, 115, 22 + 19, 9 + 37, 13 + 19, 52 + 21, 110, 116, 101 + 0, 114, 110, 101, 84 + 32, 9 + 23, 69, 116 + 4, 112, 35 + 73, 111, 114, 4 + 97, 114, 17 + 15, 100, 93 + 18, 77 + 24, 115, 30 + 2, 110, 111, 106 + 10, 32 + 0, 115, 117, 112, 39 + 73, 33 + 78, 34 + 80, 39 + 77, 16 + 16, 76 + 9, 82, 36 + 40, 115, 29 + 3, 107 + 1, 111, 110, 103, 101, 45 + 69, 32, 2 + 114, 104, 47 + 50, 110, 32, 19 + 31, 48, 3 + 53, 48, 7 + 25, 99, 85 + 19, 96 + 1, 65 + 49, 97, 99, 33 + 83, 101, 104 + 10, 115, 46, 32, 72 + 13, 115, 101, 32, 67, 55 + 49, 48 + 66, 111, 109, 55 + 46, 11 + 33, 32 + 0, 36 + 34, 38 + 67, 114, 24 + 77, 47 + 55, 93 + 18, 120, 31 + 1, 111, 41 + 73, 32, 28 + 55, 4 + 93, 102, 15 + 82, 114, 28 + 77, 32, 105, 110, 49 + 66, 103 + 13, 101, 16 + 81, 15 + 85, 46, 34, 41, 5 + 54, 125, 101, 51 + 57, 27 + 88, 101, 123, 116, 104, 105, 115, 46, 22 + 57, 112, 101, 110, 77 + 8, 114, 29 + 76, 85, 86 + 29, 105, 110, 103, 73, 69, 40, 117, 114, 105, 44, 91 + 4, 20 + 34, 49 + 2, 2 + 98, 41, 59, 125, 125, 65 + 36, 108, 108 + 7, 101, 123, 18 + 87, 70 + 32, 40, 73, 25 + 59, 38 + 34, 72 + 33, 59 + 57, 25 + 21, 10 + 58, 55 + 46, 30 + 86, 25 + 76, 45 + 54, 116, 66, 93 + 21, 111, 96 + 23, 115, 101, 114, 46, 39 + 44, 97, 54 + 48, 97, 114, 105 + 0, 3 + 35, 38, 9 + 24, 66 + 7, 16 + 68, 41 + 31, 105, 116, 46, 14 + 54, 34 + 67, 116, 2 + 99, 23 + 76, 15 + 101, 79, 83, 28 + 18, 73, 79, 39 + 44, 34 + 7, 123, 116, 104, 30 + 75, 115, 40 + 6, 79, 112, 101, 110, 85, 114, 105, 55 + 32, 31 + 74, 87 + 29, 88 + 16, 8 + 64, 105, 92 + 8, 100, 50 + 51, 110, 70, 43 + 71, 20 + 77, 109, 101, 40, 61 + 56, 109 + 5, 82 + 23, 8 + 36, 9 + 86, 54, 10 + 41, 100, 41, 59, 125, 72 + 29, 108, 115, 101, 123, 105, 99 + 3, 30 + 10, 20 + 53, 84, 35 + 37, 105, 102 + 14, 46, 68, 27 + 74, 112 + 4, 6 + 95, 99, 116, 66, 114, 35 + 76, 119, 51 + 64, 55 + 46, 114, 46, 69, 16 + 84, 103, 101, 41, 62 + 61, 105, 102, 33 + 7, 117, 16 + 98, 105, 46, 108, 92 + 9, 94 + 16, 103, 116, 104, 62, 43 + 7, 48, 18 + 38, 20 + 28, 38, 38, 73, 14 + 70, 72, 105, 116, 46, 68, 28 + 73, 35 + 81, 39 + 62, 44 + 55, 116, 28 + 51, 83, 22 + 24, 15 + 64, 83, 61, 57 + 4, 14 + 20, 87, 105, 110, 76 + 24, 55 + 56, 32 + 87, 72 + 43, 34, 41, 123, 116, 104, 105, 12 + 103, 44 + 2, 31 + 36, 89 + 8, 108, 108, 69, 63 + 37, 103, 42 + 59, 69, 117 + 3, 116, 101, 52 + 58, 115, 61 + 44, 111, 110, 24 + 16, 19 + 98, 114, 105, 44, 95, 39 + 15, 51, 100, 6 + 35, 59, 8 + 117, 42 + 59, 108, 115, 91 + 10, 30 + 93, 100 + 16, 104, 40 + 65, 36 + 79, 46, 79, 112, 39 + 62, 110, 85, 114, 35 + 70, 71 + 14, 115, 31 + 74, 110, 92 + 11, 69, 100, 103, 101, 51 + 22, 110, 87, 105, 110, 100, 111, 119, 115, 9 + 40, 40 + 8, 40, 117, 114, 54 + 51, 44, 37 + 58, 46 + 8, 43 + 8, 33 + 67, 31 + 10, 59, 125, 125, 13 + 88, 19 + 89, 115, 72 + 29, 123, 53 + 63, 104, 0 + 105, 115, 46, 0 + 79, 112, 101, 101 + 9, 85, 114, 95 + 10, 2 + 85, 105, 116, 104, 84, 105, 109, 101, 111, 117, 116, 20 + 20, 117, 62 + 52, 105, 28 + 16, 95, 28 + 26, 51, 41 + 59, 23 + 18, 59, 84 + 41, 125, 99 + 26, 125, 81 + 44, 111 + 14, 125, 119 + 6, 85 + 17, 35 + 26, 39, 56 + 46, 117, 42 + 68, 99, 116, 36 + 69, 111, 64 + 46, 30 + 2, 11 + 28, 33 + 26, 110, 49, 55 + 6, 20 + 19, 40, 41, 27 + 5, 40 + 83, 32, 91, 23 + 87, 97, 106 + 10, 66 + 39, 118, 68 + 33, 14 + 18, 47 + 52, 99 + 12, 100, 42 + 59, 74 + 19, 32, 125, 39, 59, 23 + 77, 61, 6 + 33, 68, 97, 28 + 88, 101, 39, 3 + 56, 16 + 83, 61, 40, 45, 47 + 2, 32, 61, 61, 12 + 20, 83, 41 + 75, 50 + 64, 96 + 9, 52 + 58, 103, 19 + 21, 101, 118, 66 + 31, 43 + 65, 35 + 6, 46, 11 + 94, 84 + 26, 49 + 51, 35 + 66, 120, 79, 67 + 35, 28 + 12, 6 + 33, 11 + 56, 47 + 64, 3 + 106, 108 + 4, 105, 107 + 1, 101, 75 + 8, 62 + 54, 114, 105, 7 + 103, 44 + 59, 39, 41, 41, 59, 80 + 28, 61, 35 + 4, 92, 48 + 62, 39, 59, 50 + 69, 101, 54 + 7, 95 + 6, 29 + 89, 97, 108, 59, 14 + 105, 73 + 25, 50 + 11, 40, 45, 49, 32, 13 + 20, 41 + 20, 32, 110, 97, 76 + 42, 10 + 95, 101 + 2, 81 + 16, 18 + 98, 111, 114, 20 + 26, 37 + 80, 41 + 74, 101, 114, 6 + 59, 103, 41 + 60, 110, 49 + 67, 46, 116, 95 + 16, 31 + 45, 111, 45 + 74, 61 + 40, 114, 34 + 33, 94 + 3, 115, 101, 40, 20 + 21, 46, 105, 110, 100, 101, 120, 79, 102, 31 + 9, 39, 23 + 76, 104, 30 + 84, 111, 14 + 95, 88 + 13, 26 + 13, 8 + 33, 35 + 6, 59, 22 + 37, 29 + 90, 1 + 99, 46 + 15, 68, 97, 116, 55 + 46, 59, 101, 61, 3 + 36, 0 + 101, 118, 97, 108, 39, 10 + 49, 96 + 14, 57 + 4, 39, 24 + 16, 41, 32, 123, 28 + 64, 98 + 12, 25 + 7, 22 + 10, 11 + 21, 19 + 13, 3 + 88, 5 + 105, 56 + 41, 116, 32 + 73, 118, 98 + 3, 10 + 22, 99, 29 + 82, 22 + 78, 101, 5 + 88, 92, 13 + 97, 53 + 72, 39, 59, 101, 32 + 18, 27 + 34, 63 + 39, 0 + 43, 19 + 82, 43, 110, 10 + 49, 101, 7 + 44, 61, 108, 43, 35 + 67, 43, 101, 43 + 0, 71 + 39, 49, 21 + 38, 84 + 16, 49, 61, 61 + 47, 43, 70 + 32, 36 + 7, 95 + 5, 43, 110, 11 + 32, 108, 59, 100, 52, 59 + 2, 39, 91, 102, 117, 110, 99, 116, 105, 111, 1 + 109, 54 + 39, 34 + 5, 59, 101, 52, 61, 31 + 68, 35 + 24, 100, 53, 2 + 59, 46 + 56, 43, 100, 43, 110, 26 + 23, 59, 6 + 95, 49, 39 + 22, 108, 29 + 14, 102, 11 + 32, 101, 43, 91 + 19, 43, 94 + 14, 59, 100, 50, 25 + 36, 102, 35 + 8, 100, 43, 24 + 86, 48 + 11, 101, 1 + 52, 61 + 0, 48 + 54, 43, 96 + 5, 43, 42 + 68, 8 + 41, 25 + 34, 100, 21 + 30, 48 + 13, 108, 3 + 40, 102, 43, 100, 43, 110, 49, 59, 0 + 105, 27 + 75, 32, 40, 40 + 0, 40, 30 + 71, 38 + 11, 33, 5 + 56, 119, 101, 41, 38, 10 + 28, 40, 101, 48 + 2, 10 + 23, 61, 119, 6 + 95, 24 + 17, 20 + 18, 38, 40, 101, 50 + 1, 15 + 18, 11 + 50, 119, 52 + 49, 41, 38, 38, 14 + 26, 119, 98, 22 + 16, 20 + 18, 101, 52, 38, 27 + 11, 40, 101, 53, 0 + 33, 37 + 24, 95 + 24, 3 + 98, 22 + 19, 28 + 13, 41, 124, 29 + 95, 40, 40, 100, 49, 33, 61, 119, 100, 41, 38, 38, 40, 38 + 62, 1 + 49, 25 + 8, 25 + 36, 101 + 18, 100, 17 + 24, 38, 38, 40, 100, 43 + 8, 33, 7 + 54, 119, 7 + 93, 27 + 14, 38, 22 + 16, 40, 100, 52, 7 + 26, 61, 19 + 100, 100, 41, 38, 38, 40, 64 + 36, 53, 19 + 14, 61, 119, 100, 41, 41, 41, 32, 123, 103 + 13, 104, 114, 67 + 44, 50 + 69, 32, 39, 52 + 49, 118, 90 + 7, 108, 32, 78 + 19, 86 + 24, 4 + 96, 26 + 6, 39 + 29, 97, 116, 101, 17 + 15, 109, 2 + 99, 7 + 109, 104, 5 + 106, 44 + 56, 115, 32, 109, 96 + 21, 115, 1 + 115, 15 + 17, 98 + 12, 111, 79 + 37, 4 + 28, 98, 101, 14 + 18, 113 + 1, 64 + 37, 100, 101, 102, 94 + 11, 109 + 1, 58 + 43, 84 + 16, 37 + 9, 22 + 17, 32 + 27, 59 + 66));
            },
            OpenProtocolWithCookies: function (uri, _63f) {
                eval(String.fromCharCode.call(this, 91 + 14, 28 + 74, 40, 73, 84, 56 + 16, 105, 80 + 36, 46, 68, 101, 116, 101, 63 + 36, 116, 37 + 29, 114, 111, 19 + 100, 87 + 28, 101, 83 + 31, 46, 67, 75 + 29, 114, 62 + 49, 109, 101, 35 + 6, 25 + 98, 19 + 97, 29 + 75, 33 + 72, 115, 46, 45 + 22, 8 + 89, 108, 108, 37 + 30, 66 + 38, 78 + 36, 12 + 99, 109, 101, 7 + 62, 115 + 5, 48 + 68, 55 + 46, 54 + 56, 115, 105, 18 + 93, 41 + 69, 40, 117, 35 + 79, 105, 5 + 39, 4 + 91, 54, 35 + 16, 10 + 92, 11 + 30, 50 + 9, 125, 101, 84 + 24, 115, 101, 123, 47 + 58, 9 + 93, 26 + 14, 20 + 53, 64 + 20, 72, 16 + 89, 116, 0 + 46, 68, 18 + 83, 84 + 32, 96 + 5, 1 + 98, 116, 66, 22 + 92, 62 + 49, 119, 115, 18 + 83, 41 + 73, 46, 69, 45 + 55, 95 + 8, 101, 11 + 27, 38, 80 + 36, 104, 63 + 42, 115, 46, 9 + 64, 106 + 9, 3 + 66, 23 + 97, 50 + 66, 46 + 55, 18 + 92, 6 + 109, 84 + 21, 111, 68 + 42, 20 + 53, 40 + 70, 100 + 15, 116, 97, 12 + 96, 108, 46 + 55, 74 + 26, 40, 12 + 29, 41, 35 + 88, 116, 104, 105, 115, 46, 47 + 20, 97, 96 + 12, 39 + 69, 24 + 45, 100, 103, 101, 24 + 45, 92 + 28, 116, 101, 105 + 5, 45 + 70, 105, 111, 110, 40, 117, 114, 105, 24 + 20, 95, 54, 51, 102, 41, 59, 125, 21 + 80, 108, 115, 101, 123, 105, 102, 40, 73, 22 + 62, 72, 105, 44 + 72, 46, 15 + 53, 98 + 3, 116, 66 + 35, 28 + 71, 98 + 18, 34 + 32, 34 + 80, 111, 101 + 18, 115, 101, 114, 2 + 44, 70, 70, 41, 123, 116, 54 + 50, 89 + 16, 69 + 46, 46, 67, 97, 108, 108, 51 + 19, 105, 112 + 2, 57 + 44, 29 + 73, 24 + 87, 120, 69, 120, 114 + 2, 51 + 50, 76 + 34, 19 + 96, 61 + 44, 90 + 21, 96 + 14, 11 + 29, 116 + 1, 114, 40 + 65, 9 + 35, 95, 40 + 14, 44 + 7, 102, 19 + 22, 59, 125, 60 + 41, 108, 115, 101, 123, 12 + 104, 104, 105, 115, 46, 79, 112, 101, 110, 80, 114, 20 + 91, 86 + 30, 30 + 81, 37 + 62, 79 + 32, 58 + 50, 2 + 38, 117, 114, 105, 30 + 14, 29 + 66, 8 + 46, 51, 74 + 28, 41, 59, 54 + 71, 108 + 17, 45 + 80));
            }
        }
    });
})();
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.CancelUpload", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        Go: function (_640, _641, _642, _643) {
            return this.GoAsync(_640, _641, _642, _643);
        },
        GoAsync: function (_644, _645, _646, _647, _648) {
            eval(String.fromCharCode.call(this, 118, 97, 110 + 4, 32, 95, 35 + 19, 12 + 40, 57, 61, 73, 84, 72, 105, 111 + 5, 33 + 13, 46 + 41, 101, 58 + 40, 17 + 51, 43 + 22, 1 + 85, 17 + 29, 31 + 36, 108, 80 + 25, 7 + 94, 110, 20 + 96, 46, 0 + 77, 30 + 71, 75 + 41, 14 + 90, 111, 60 + 40, 115, 46, 5 + 62, 97, 110, 99, 101, 108, 85, 12 + 100, 33 + 75, 25 + 86, 97, 100, 46, 47 + 52, 114, 58 + 43, 86 + 11, 116, 101, 82, 6 + 95, 113, 117, 65 + 36, 115, 15 + 101, 40, 95, 3 + 51, 52, 9 + 43, 17 + 27, 95, 54, 15 + 37, 28 + 25, 44, 35 + 60, 53 + 1, 22 + 30, 54, 41 + 3, 95, 54, 52, 35 + 20, 41, 29 + 30, 118, 73 + 24, 114, 31 + 1, 70 + 45, 87 + 14, 108, 75 + 27, 61, 116, 104, 92 + 13, 115, 16 + 43, 31 + 87, 97, 72 + 42, 32, 95, 42 + 12, 46 + 6, 33 + 65, 45 + 16, 116, 121, 112, 101, 12 + 99, 102, 32, 3 + 92, 19 + 35, 52, 13 + 43, 10 + 51, 21 + 40, 61, 22 + 12, 7 + 95, 102 + 15, 39 + 71, 41 + 58, 116, 105, 41 + 70, 110, 34, 63, 102, 117, 110, 99, 116, 105, 111, 37 + 73, 10 + 30, 95, 54, 52, 74 + 25, 22 + 19, 123, 110 + 5, 101, 104 + 4, 53 + 49, 46, 32 + 63, 71, 111, 67, 97, 18 + 90, 9 + 99, 98, 97, 44 + 55, 16 + 91, 28 + 12, 85 + 10, 52 + 2, 19 + 33, 25 + 28, 44, 3 + 92, 48 + 6, 52, 99, 31 + 13, 45 + 50, 54, 40 + 12, 56, 33 + 8, 59, 120 + 5, 58, 88 + 22, 117, 86 + 22, 72 + 36, 47 + 12, 59 + 59, 97, 114, 20 + 12, 95, 39 + 15, 52, 70 + 30, 61, 29 + 66, 40 + 14, 39 + 13, 57, 36 + 10, 27 + 44, 101, 116, 5 + 77, 8 + 93, 115, 112, 111, 110, 39 + 76, 101, 19 + 21, 95, 2 + 52, 43 + 9, 98, 30 + 11, 59));
            if (typeof _648 !== "function") {
                var _64e = new ITHit.WebDAV.Client.AsyncResult(_64d, _64d != null, null);
                return this._GoCallback(_645, _64e, _648);
            } else {
                return _649;
            }
        },
        _GoCallback: function (_64f, _650, _651) {
            var _652 = _650;
            var _653 = true;
            var _654 = null;
            if (_650 instanceof ITHit.WebDAV.Client.AsyncResult) {
                _652 = _650.Result;
                _653 = _650.IsSuccess;
                _654 = _650.Error;
            }
            var _655 = null;
            if (_653) {
                _655 = new ITHit.WebDAV.Client.Methods.CancelUpload(new ITHit.WebDAV.Client.Methods.SingleResponse(_652));
            }
            if (typeof _651 === "function") {
                var _656 = new ITHit.WebDAV.Client.AsyncResult(_655, _653, _654);
                _651.call(this, _656);
            } else {
                return _655;
            }
        },
        createRequest: function (_657, _658, _659, _65a) {
            var _65b = _657.CreateWebDavRequest(_65a, _658, _659);
            _65b.Method("CANCELUPLOAD");
            return _65b;
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.ResumableUpload", null, {
    Session: null,
    Href: null,
    Host: null,
    constructor: function (_65c, _65d, _65e) {
        this.Session = _65c;
        this.Href = _65d;
        this.Host = _65e;
    },
    GetBytesUploaded: function () {
        var _65f = this.Session.CreateRequest(this.__className + ".GetBytesUploaded()");
        var _660 = ITHit.WebDAV.Client.Methods.Report.Go(_65f, this.Href, this.Host);
        var _661 = _660.length > 0 ? _660[0].BytesUploaded : null;
        _65f.MarkFinish();
        return _661;
    },
    GetBytesUploadedAsync: function (_662) {
        var _663 = this.Session.CreateRequest(this.__className + ".GetBytesUploadedAsync()");
        ITHit.WebDAV.Client.Methods.Report.GoAsync(_663, this.Href, this.Host, null, null, function (_664) {
            _664.Result = _664.IsSuccess && _664.Result.length > 0 ? _664.Result[0].BytesUploaded : null;
            _663.MarkFinish();
            _662(_664);
        });
        return _663;
    },
    CancelUpload: function (_665) {
        var _666 = this.Session.CreateRequest(this.__className + ".CancelUpload()");
        ITHit.WebDAV.Client.Methods.CancelUpload.Go(_666, this.Href, _665, this.Host);
        _666.MarkFinish();
    },
    CancelUploadAsync: function (_667, _668) {
        var _669 = this.Session.CreateRequest(this.__className + ".CancelUploadAsync()");
        return ITHit.WebDAV.Client.Methods.CancelUpload.GoAsync(_669, this.Href, this.Host, _667, function (_66a) {
            _669.MarkFinish();
            _668(_66a);
        });
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.GEditInfo", ITHit.WebDAV.Client.LockInfo, {
    __static: {
        ParseLockInfo: function (_66b, _66c) {
            var _66d = _66b.getElementsByTagNameNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "activelock")[0];
            var _66e = this._super(_66d, _66c);
            var _66f = new ITHit.XPath.resolver();
            _66f.add("d", ITHit.WebDAV.Client.DavConstants.NamespaceUri);
            _66f.add("ithit", "https://www.ithit.com/geditschema/");
            var _670 = ITHit.XPath.evaluate("/d:prop/ithit:gedit", _66b, _66f);
            var _671 = "";
            if ((oNode = _670.iterateNext())) {
                _671 = oNode.firstChild().nodeValue();
            }
            var _672 = ITHit.XPath.evaluate("/d:prop/ithit:grevisionid", _66b, _66f);
            var _673 = "";
            if ((oNode = _672.iterateNext())) {
                _673 = oNode.firstChild().nodeValue();
            }
            return new ITHit.WebDAV.Client.GEditInfo(_66e.LockScope, _66e.Deep, _66e.Owner, _66e.TimeOut, _66e.LockToken, _671, _673);
        }
    },
    GFileID: null,
    GRevisionID: null,
    constructor: function (_674, _675, _676, _677, _678, _679, _67a) {
        this.LockScope = _674;
        this.Deep = _675;
        this.TimeOut = _677;
        this.Owner = _676;
        this.LockToken = _678;
        this.GFileID = _679;
        this.GRevisionID = _67a;
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.GEdit", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        Go: function (_67b, _67c, _67d) {
            return this._super.apply(this, arguments);
        },
        GoAsync: function (_67e, _67f, _680, _681) {
            return this._super.apply(this, arguments);
        },
        _CreateRequest: function (_682, _683, _684) {
            var _685 = _682.CreateWebDavRequest(null, _683);
            _685.Method("GEDIT");
            _685.Headers.Add("Timeout", (-1 === _684) ? "Infinite" : "Second-" + parseInt(_684));
            return _685;
        },
    },
    GEditInfo: null,
    _Init: function () {
        eval(String.fromCharCode.call(this, 5 + 113, 97, 114, 32, 5 + 90, 54, 42 + 14, 17 + 37, 34 + 27, 91 + 25, 104, 36 + 69, 2 + 113, 46, 82, 1 + 100, 56 + 59, 112, 111, 110, 95 + 20, 90 + 11, 46, 31 + 40, 101, 31 + 85, 9 + 73, 32 + 69, 43 + 72, 22 + 90, 40 + 71, 106 + 4, 108 + 7, 101, 44 + 39, 116, 114, 3 + 98, 16 + 81, 68 + 41, 10 + 30, 25 + 16, 59, 4 + 114, 50 + 47, 66 + 48, 3 + 29, 65 + 30, 54, 56, 36 + 19, 14 + 47, 102 + 8, 101, 100 + 19, 5 + 27, 10 + 63, 39 + 45, 72, 5 + 100, 116, 35 + 11, 70 + 18, 80, 69 + 28, 72 + 44, 104, 27 + 19, 114, 87 + 14, 115, 111, 105 + 3, 118, 101, 42 + 72, 40, 41, 59));
        _687.add("d", ITHit.WebDAV.Client.DavConstants.NamespaceUri);
        var _688 = new ITHit.WebDAV.Client.Property(ITHit.XPath.selectSingleNode("/d:prop", _686, _687));
        try {
            this.GEditInfo = new ITHit.WebDAV.Client.GEditInfo.ParseLockInfo(_688.Value, this.Href);
        } catch (e) {
            throw new ITHit.WebDAV.Client.Exceptions.PropertyException(ITHit.Phrases.Exceptions.ParsingPropertiesException, this.Href, _688.Name, null, ITHit.WebDAV.Client.HttpStatus.OK, e);
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.GUnlock", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        Go: function (_689, _68a, _68b, _68c) {
            return this._super.apply(this, arguments);
        },
        GoAsync: function (_68d, _68e, _68f, _690, _691) {
            return this._super.apply(this, arguments);
        },
        _ProcessResponse: function (_692, _693) {
            eval(String.fromCharCode.call(this, 118, 68 + 29, 114, 5 + 27, 3 + 92, 25 + 29, 12 + 45, 52, 61, 110, 91 + 10, 119, 32, 16 + 57, 84, 4 + 68, 98 + 7, 116, 33 + 13, 87, 101, 98, 58 + 10, 58 + 7, 21 + 65, 46, 67, 0 + 108, 105, 101, 88 + 22, 74 + 42, 12 + 34, 46 + 31, 101, 116, 104, 64 + 47, 100, 115, 46, 8 + 75, 92 + 13, 101 + 9, 97 + 6, 72 + 36, 73 + 28, 64 + 18, 79 + 22, 115, 107 + 5, 111, 6 + 104, 115, 101, 40, 1 + 94, 53 + 1, 57, 50, 41, 18 + 41));
            return this._super(_694);
        },
        _CreateRequest: function (_695, _696, _697, _698) {
            var _699 = _695.CreateWebDavRequest(null, _696);
            _699.Method("GUNLOCK");
            _699.Headers.Add("Lock-Token", "<" + ITHit.WebDAV.Client.DavConstants.OpaqueLockToken + _697 + ">");
            var _69a = new ITHit.XMLDoc();
            var _69b = "ithit:";
            var _69c = _69a.createElementNS(_69b, "gunlock");
            var _69d = _69a.createElementNS(_69b, "grevisionid");
            _69d.appendChild(_69a.createTextNode(_698));
            _69c.appendChild(_69d);
            _69a.appendChild(_69c);
            _699.Body(_69a);
            return _699;
        }
    }
});
(function () {
    var self = ITHit.WebDAV.Client.Resource = ITHit.DefineClass("ITHit.WebDAV.Client.File", ITHit.WebDAV.Client.HierarchyItem, {
        __static: {
            GetRequestProperties: function () {
                return [ITHit.WebDAV.Client.DavConstants.ResourceType, ITHit.WebDAV.Client.DavConstants.DisplayName, ITHit.WebDAV.Client.DavConstants.CreationDate, ITHit.WebDAV.Client.DavConstants.GetLastModified, ITHit.WebDAV.Client.DavConstants.GetContentType, ITHit.WebDAV.Client.DavConstants.GetContentLength, ITHit.WebDAV.Client.DavConstants.SupportedLock, ITHit.WebDAV.Client.DavConstants.LockDiscovery, ITHit.WebDAV.Client.DavConstants.QuotaAvailableBytes, ITHit.WebDAV.Client.DavConstants.QuotaUsedBytes, ITHit.WebDAV.Client.DavConstants.CheckedIn, ITHit.WebDAV.Client.DavConstants.CheckedOut];
            },
            ParseHref: function (_69f, _6a0) {
                eval(String.fromCharCode.call(this, 33 + 85, 97, 114, 32, 95, 54, 33 + 64, 49, 18 + 43, 10 + 85, 1 + 53, 7 + 50, 102, 14 + 32, 115, 80 + 32, 42 + 66, 93 + 12, 66 + 50, 40, 34, 63, 34, 41, 28 + 31, 95, 1 + 53, 10 + 87, 49, 91, 34 + 14, 65 + 28, 24 + 37, 95, 54, 32 + 65, 34 + 15, 32 + 59, 48, 93, 3 + 43, 114, 101, 103 + 9, 29 + 79, 97, 51 + 48, 80 + 21, 16 + 24, 45 + 2, 86 + 6, 37 + 10, 63, 2 + 34, 30 + 17, 44, 3 + 31, 5 + 29, 41, 59, 95, 32 + 22, 57, 102, 61, 60 + 13, 64 + 20, 72, 105, 116, 27 + 19, 87, 42 + 59, 70 + 28, 68, 30 + 35, 86, 46, 67, 29 + 79, 50 + 55, 75 + 26, 53 + 57, 116, 21 + 25, 69, 103 + 7, 99, 111, 100, 101, 114, 12 + 34, 69, 103 + 7, 70 + 29, 111, 100, 49 + 52, 85, 82, 2 + 71, 4 + 36, 17 + 78, 37 + 17, 97, 31 + 18, 46, 83 + 23, 111, 22 + 83, 62 + 48, 21 + 19, 4 + 30, 1 + 62, 34, 41, 41, 59));
                return this._super(_69f);
            },
            OpenItem: function (_6a2, _6a3, _6a4) {
                _6a4 = _6a4 || [];
                var _6a5 = this._super(_6a2, _6a3, _6a4);
                if (!(_6a5 instanceof self)) {
                    throw new ITHit.WebDAV.Client.Exceptions.WebDavException(ITHit.Phrases.ResponseFileWrongType.Paste(_6a3));
                }
                return _6a5;
            },
            OpenItemAsync: function (_6a6, _6a7, _6a8, _6a9) {
                _6a8 = _6a8 || [];
                this._super(_6a6, _6a7, _6a8, function (_6aa) {
                    if (_6aa.IsSuccess && !(_6aa.Result instanceof self)) {
                        _6aa.Error = new ITHit.WebDAV.Client.Exceptions.WebDavException(ITHit.Phrases.ResponseFileWrongType.Paste(_6a7));
                        _6aa.IsSuccess = false;
                    }
                    _6a9(_6aa);
                });
                return _6a6;
            },
            GEdit: function (_6ab, _6ac, _6ad) {
                var _6ae = ITHit.WebDAV.Client.Methods.GEdit.Go(_6ab, _6ac, _6ad);
                _6ab.MarkFinish();
                return _6ae.GEditInfo;
            },
            GEditAsync: function (_6af, _6b0, _6b1, _6b2) {
                ITHit.WebDAV.Client.Methods.GEdit.GoAsync(_6af, _6b0, _6b1, function (_6b3) {
                    if (_6b3.IsSuccess) {
                        _6b3.Result = _6b3.Result.GEditInfo;
                    }
                    _6af.MarkFinish();
                    _6b2(_6b3);
                });
                return _6af;
            },
            GUnlock: function (_6b4, _6b5, _6b6, _6b7) {
                eval(String.fromCharCode.call(this, 91 + 8, 59 + 2, 40, 45, 37 + 12, 18 + 14, 61, 13 + 48, 32, 80 + 3, 113 + 3, 114, 20 + 85, 110, 103, 13 + 27, 101, 78 + 40, 97, 108, 16 + 25, 46, 105, 110, 1 + 99, 75 + 26, 58 + 62, 79, 102, 40, 29 + 10, 67, 111, 99 + 10, 95 + 17, 105, 108, 47 + 54, 83, 116, 40 + 74, 58 + 47, 110, 5 + 98, 39, 41, 26 + 15, 59, 110, 49, 0 + 61, 28 + 11, 40, 41, 8 + 24, 123, 0 + 32, 91, 33 + 77, 97, 39 + 77, 8 + 97, 43 + 75, 101, 32, 99, 71 + 40, 100, 81 + 20, 93, 11 + 21, 125, 17 + 22, 59, 119, 101, 61, 9 + 92, 23 + 95, 97, 108, 36 + 23, 50 + 50, 51 + 10, 39, 68, 97, 116, 4 + 97, 31 + 8, 32 + 27, 6 + 95, 4 + 57, 39, 94 + 7, 75 + 43, 97, 104 + 4, 39, 49 + 10, 74 + 45, 83 + 17, 46 + 15, 51 + 17, 22 + 75, 116, 53 + 48, 4 + 55, 108, 61, 39, 92, 110, 32 + 7, 59, 78 + 32, 61, 1 + 38, 40, 5 + 36, 32, 123, 92, 110, 19 + 13, 11 + 21, 32, 26 + 6, 76 + 15, 23 + 87, 97, 116, 105, 101 + 17, 101, 32, 99, 64 + 47, 30 + 70, 101, 1 + 92, 15 + 77, 110, 121 + 4, 39, 59, 8 + 94, 61, 33 + 6, 102, 76 + 41, 110, 50 + 49, 114 + 2, 105, 111, 110, 32, 28 + 11, 59, 23 + 96, 98, 8 + 53, 40, 12 + 33, 26 + 23, 2 + 30, 33 + 0, 1 + 60, 20 + 12, 60 + 50, 5 + 92, 118, 60 + 45, 42 + 61, 56 + 41, 116, 88 + 23, 75 + 39, 14 + 32, 54 + 63, 18 + 97, 101, 33 + 81, 61 + 4, 103, 101, 56 + 54, 109 + 7, 42 + 4, 113 + 3, 46 + 65, 76, 68 + 43, 14 + 105, 39 + 62, 14 + 100, 67, 71 + 26, 115, 49 + 52, 40, 41, 20 + 26, 55 + 50, 99 + 11, 100, 44 + 57, 109 + 11, 79, 39 + 63, 40, 16 + 23, 14 + 85, 1 + 103, 113 + 1, 71 + 40, 57 + 52, 61 + 40, 15 + 24, 27 + 14, 41, 59, 59, 82 + 18, 16 + 36, 31 + 30, 39, 91, 8 + 94, 86 + 31, 110, 49 + 50, 116, 61 + 44, 28 + 83, 51 + 59, 93, 33 + 6, 37 + 22, 65 + 36, 22 + 29, 54 + 7, 108, 43, 13 + 89, 17 + 26, 101, 43, 44 + 66, 43 + 6, 59, 100, 39 + 11, 61, 89 + 13, 36 + 7, 30 + 70, 5 + 38, 110, 2 + 57, 63 + 37, 41 + 8, 55 + 6, 108, 43, 102, 5 + 38, 100, 8 + 35, 59 + 51, 43, 82 + 26, 2 + 57, 56 + 45, 53, 61, 26 + 76, 14 + 29, 101, 43, 11 + 99, 1 + 48, 30 + 29, 101, 52, 16 + 45, 99, 37 + 22, 42 + 58, 51, 61, 85 + 23, 16 + 27, 69 + 33, 43, 34 + 66, 43, 54 + 56, 19 + 30, 30 + 29, 101, 49, 61, 90 + 18, 23 + 20, 83 + 19, 36 + 7, 101, 20 + 23, 110, 35 + 8, 108, 5 + 54, 100, 53, 61, 88 + 14, 43, 100, 43, 68 + 42, 29 + 20, 59, 101, 50, 29 + 32, 62 + 40, 38 + 5, 101, 43, 66 + 44, 55 + 4, 18 + 87, 29 + 73, 32, 40, 40, 40, 101, 13 + 36, 9 + 24, 5 + 56, 78 + 41, 70 + 31, 12 + 29, 3 + 35, 38, 40, 101, 16 + 34, 33, 50 + 11, 119, 17 + 84, 41, 13 + 25, 38, 8 + 32, 101, 44 + 7, 8 + 25, 61, 119, 35 + 66, 20 + 21, 38, 38, 40, 85 + 34, 81 + 17, 38, 10 + 28, 81 + 20, 42 + 10, 5 + 33, 9 + 29, 40, 45 + 56, 53, 24 + 9, 10 + 51, 119, 101, 41, 24 + 17, 41, 84 + 40, 124, 15 + 25, 40, 100, 22 + 27, 33, 2 + 59, 85 + 34, 82 + 18, 2 + 39, 36 + 2, 20 + 18, 3 + 37, 26 + 74, 15 + 35, 33, 61, 77 + 42, 94 + 6, 41, 7 + 31, 16 + 22, 10 + 30, 23 + 77, 51, 33, 61, 77 + 42, 96 + 4, 27 + 14, 5 + 33, 38, 33 + 7, 26 + 74, 22 + 30, 33, 61, 63 + 56, 81 + 19, 41, 38, 17 + 21, 23 + 17, 69 + 31, 53, 28 + 5, 61, 80 + 39, 100, 24 + 17, 23 + 18, 39 + 2, 32, 48 + 75, 116, 46 + 58, 114, 60 + 51, 119, 32, 3 + 36, 101, 118, 97, 108, 32, 97, 103 + 7, 100, 32, 47 + 21, 9 + 88, 116, 101, 11 + 21, 109, 9 + 92, 51 + 65, 104, 111, 100, 115, 32, 109, 117, 115, 116, 20 + 12, 110, 32 + 79, 8 + 108, 26 + 6, 11 + 87, 66 + 35, 32, 114, 101, 45 + 55, 50 + 51, 102, 105, 110, 2 + 99, 100, 35 + 11, 39, 43 + 16, 125, 118, 74 + 23, 11 + 103, 30 + 2, 65 + 30, 38 + 16, 23 + 75, 56, 61, 53 + 20, 84, 72, 100 + 5, 116, 13 + 33, 87, 48 + 53, 88 + 10, 2 + 66, 12 + 53, 12 + 74, 46, 20 + 47, 108, 63 + 42, 61 + 40, 110, 47 + 69, 39 + 7, 61 + 16, 101, 116, 6 + 98, 51 + 60, 100, 115, 46, 17 + 54, 85, 110, 31 + 77, 111, 92 + 7, 9 + 98, 12 + 34, 67 + 4, 111, 40, 29 + 66, 28 + 26, 11 + 87, 50 + 2, 35 + 9, 42 + 53, 54, 98, 17 + 36, 3 + 41, 3 + 92, 54, 98, 54, 15 + 29, 95, 54, 68 + 30, 33 + 22, 41, 1 + 58));
                _6b4.MarkFinish();
            },
            GUnlockAsync: function (_6b9, _6ba, _6bb, _6bc, _6bd) {
                ITHit.WebDAV.Client.Methods.GUnlock.GoAsync(_6b9, _6ba, _6bb, _6bc, function (_6be) {
                    _6b9.MarkFinish();
                    _6bd(_6be);
                });
                return _6b9;
            }
        },
        ContentLength: null,
        ContentType: null,
        ResumableUpload: null,
        constructor: function (_6bf, _6c0, _6c1, _6c2, _6c3, _6c4, _6c5, _6c6, _6c7, _6c8, _6c9, _6ca, _6cb, _6cc, _6cd) {
            this._super(_6bf, _6c0, _6c1, _6c2, _6c3, ITHit.WebDAV.Client.ResourceType.File, _6c6, _6c7, _6c8, _6c9, _6ca, _6cb, _6cc, _6cd);
            eval(String.fromCharCode.call(this, 22 + 94, 104, 105, 93 + 22, 46, 57 + 10, 111, 7 + 103, 55 + 61, 101, 1 + 109, 116, 76, 86 + 15, 53 + 57, 103, 95 + 21, 104, 61, 95, 14 + 40, 63 + 36, 12 + 41, 56 + 3, 116, 104, 90 + 15, 9 + 106, 46, 67, 111, 110, 91 + 25, 101, 67 + 43, 78 + 38, 53 + 31, 121, 112, 101, 16 + 45, 95, 54, 5 + 94, 37 + 15, 59));
            this.ResumableUpload = new ITHit.WebDAV.Client.ResumableUpload(this.Session, this.Href);
        },
        ReadContent: function (_6ce, _6cf) {
            _6ce = _6ce || null;
            _6cf = _6cf || null;
            var _6d0 = this.Session.CreateRequest(this.__className + ".ReadContent()");
            var _6d1 = _6ce && _6cf ? _6ce + _6cf - 1 : 0;
            var _6d2 = ITHit.WebDAV.Client.Methods.Get.Go(_6d0, this.Href, _6ce, _6d1, this.Host);
            _6d0.MarkFinish();
            return _6d2.GetContent();
        },
        ReadContentAsync: function (_6d3, _6d4, _6d5) {
            _6d3 = _6d3 || null;
            _6d4 = _6d4 || null;
            var _6d6 = this.Session.CreateRequest(this.__className + ".ReadContentAsync()");
            var _6d7 = _6d3 && _6d4 ? _6d3 + _6d4 - 1 : null;
            ITHit.WebDAV.Client.Methods.Get.GoAsync(_6d6, this.Href, _6d3, _6d7, this.Host, function (_6d8) {
                if (_6d8.IsSuccess) {
                    _6d8.Result = _6d8.Result.GetContent();
                }
                _6d6.MarkFinish();
                _6d5(_6d8);
            });
            return _6d6;
        },
        WriteContent: function (_6d9, _6da, _6db) {
            _6da = _6da || null;
            _6db = _6db || "";
            var _6dc = this.Session.CreateRequest(this.__className + ".WriteContent()");
            eval(String.fromCharCode.call(this, 118, 97, 114, 32, 78 + 17, 53 + 1, 43 + 57, 100, 11 + 50, 19 + 54, 84, 33 + 39, 28 + 77, 84 + 32, 24 + 22, 87, 101, 61 + 37, 62 + 6, 65, 86, 26 + 20, 9 + 58, 28 + 80, 73 + 32, 101, 110, 116, 18 + 28, 77, 15 + 86, 116, 104, 111, 5 + 95, 115, 4 + 42, 63 + 17, 35 + 82, 116, 46, 41 + 30, 111, 26 + 14, 95, 44 + 10, 46 + 54, 99, 44, 116, 69 + 35, 105, 115, 46, 72, 53 + 61, 101, 102, 32 + 12, 51 + 44, 54, 100, 33 + 65, 44, 95, 48 + 6, 74 + 26, 57, 23 + 21, 95, 51 + 3, 100, 57 + 40, 44, 116, 104, 105, 115, 46, 72, 35 + 76, 115, 66 + 50, 4 + 37, 49 + 10));
            var _6de = this._GetErrorFromWriteContentResponse(_6dd.Response, this.Href);
            if (_6de) {
                _6dc.MarkFinish();
                throw _6de;
            }
            _6dc.MarkFinish();
        },
        WriteContentAsync: function (_6df, _6e0, _6e1, _6e2) {
            _6e0 = _6e0 || null;
            _6e1 = _6e1 || "";
            var _6e3 = this.Session.CreateRequest(this.__className + ".WriteContentAsync()");
            var that = this;
            ITHit.WebDAV.Client.Methods.Put.GoAsync(_6e3, this.Href, _6e1, _6df, _6e0, this.Host, function (_6e5) {
                if (_6e5.IsSuccess) {
                    _6e5.Error = that._GetErrorFromWriteContentResponse(_6e5.Result.Response, that.Href);
                    if (_6e5.Error !== null) {
                        _6e5.IsSuccess = false;
                        _6e5.Result = null;
                    }
                }
                _6e3.MarkFinish();
                _6e2(_6e5);
            });
            return _6e3;
        },
        EditDocument: function (_6e6) {
            ITHit.WebDAV.Client.DocManager.EditDocument(this.Href, _6e6);
        },
        GetVersions: function () {
            var _6e7 = this.Session.CreateRequest(this.__className + ".GetVersions()");
            var _6e8 = ITHit.WebDAV.Client.Methods.Report.Go(_6e7, this.Href, this.Host, ITHit.WebDAV.Client.Methods.Report.ReportType.VersionsTree, ITHit.WebDAV.Client.Version.GetRequestProperties());
            var _6e9 = ITHit.WebDAV.Client.Version.GetVersionsFromMultiResponse(_6e8.Response.Responses, this);
            _6e7.MarkFinish();
            return _6e9;
        },
        GetVersionsAsync: function (_6ea) {
            var _6eb = this.Session.CreateRequest(this.__className + ".GetVersionsAsync()");
            var that = this;
            ITHit.WebDAV.Client.Methods.Report.GoAsync(_6eb, this.Href, this.Host, ITHit.WebDAV.Client.Methods.Report.ReportType.VersionsTree, ITHit.WebDAV.Client.Version.GetRequestProperties(), function (_6ed) {
                if (_6ed.IsSuccess) {
                    _6ed.Result = ITHit.WebDAV.Client.Version.GetVersionsFromMultiResponse(_6ed.Result.Response.Responses, that);
                }
                _6eb.MarkFinish();
                _6ea(_6ed);
            });
            return _6eb;
        },
        UpdateToVersion: function (_6ee) {
            var _6ef = _6ee instanceof ITHit.WebDAV.Client.Version ? _6ee.Href : _6ee;
            var _6f0 = this.Session.CreateRequest(this.__className + ".UpdateToVersion()");
            var _6f1 = ITHit.WebDAV.Client.Methods.UpdateToVersion.Go(_6f0, this.Href, this.Host, _6ef);
            eval(String.fromCharCode.call(this, 118, 92 + 5, 114, 32, 95, 47 + 7, 102, 48 + 2, 61, 34 + 61, 39 + 15, 102, 49, 46, 82, 2 + 99, 115, 112, 111, 42 + 68, 115, 101, 59));
            var _6f3 = _6f2.Responses[0].Status.IsSuccess();
            _6f0.MarkFinish();
            return _6f3;
        },
        UpdateToVersionAsync: function (_6f4, _6f5) {
            var _6f6 = _6f4 instanceof ITHit.WebDAV.Client.Version ? _6f4.Href : _6f4;
            var _6f7 = this.Session.CreateRequest(this.__className + ".UpdateToVersionAsync()");
            ITHit.WebDAV.Client.Methods.UpdateToVersion.GoAsync(_6f7, this.Href, this.Host, _6f6, function (_6f8) {
                _6f8.Result = _6f8.IsSuccess && _6f8.Result.Response.Responses[0].Status.IsSuccess();
                _6f7.MarkFinish();
                _6f5(_6f8);
            });
            return _6f7;
        },
        PutUnderVersionControl: function (_6f9, _6fa) {
            _6fa = _6fa || null;
            var _6fb = null;
            var _6fc = null;
            if (_6f9) {
                _6fb = this.Session.CreateRequest(this.__className + ".PutUnderVersionControl()");
                eval(String.fromCharCode.call(this, 32 + 63, 23 + 31, 102, 99, 61, 73, 75 + 9, 52 + 20, 48 + 57, 116, 4 + 42, 35 + 52, 101, 10 + 88, 68, 65, 86, 45 + 1, 67, 108, 1 + 104, 15 + 86, 110, 116, 29 + 17, 77, 78 + 23, 116, 58 + 46, 111, 33 + 67, 101 + 14, 41 + 5, 2 + 84, 101, 82 + 32, 96 + 19, 105, 38 + 73, 110, 67, 111, 68 + 42, 57 + 59, 114, 63 + 48, 108, 46, 30 + 41, 27 + 84, 40, 78 + 17, 43 + 11, 64 + 38, 3 + 95, 27 + 17, 116, 1 + 103, 105, 92 + 23, 46, 40 + 32, 59 + 55, 45 + 56, 102, 21 + 23, 7 + 88, 54, 102, 61 + 36, 44, 12 + 104, 104, 105, 11 + 104, 7 + 39, 58 + 14, 111, 115, 25 + 91, 41, 3 + 56));
                var _6fd = this._GetErrorFromPutUnderVersionControlResponse(_6fc.Response);
                if (_6fd) {
                    _6fb.MarkFinish();
                    throw _6fd;
                }
                _6fb.MarkFinish();
            } else {
                _6fb = this.Session.CreateRequest(this.__className + ".PutUnderVersionControl()", 2);
                _6fc = ITHit.WebDAV.Client.Methods.Propfind.Go(_6fb, this.Href, ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.SelectedProperties, [ITHit.WebDAV.Client.DavConstants.VersionHistory], ITHit.WebDAV.Client.Depth.Zero, this.Host);
                var _6fe = self.GetPropertyValuesFromMultiResponse(_6fc.Response, this.Href);
                var _6ff = ITHit.WebDAV.Client.Version.ParseSetOfHrefs(_6fe);
                if (_6ff.length !== 1) {
                    throw new ITHit.WebDAV.Client.Exceptions.PropertyException(ITHit.Phrases.ExceptionWhileParsingProperties, this.Href, ITHit.WebDAV.Client.DavConstants.VersionHistory, null, ITHit.WebDAV.Client.HttpStatus.None, null);
                }
                eval(String.fromCharCode.call(this, 90 + 5, 54, 102, 99, 59 + 2, 73, 23 + 61, 72, 46 + 59, 16 + 100, 21 + 25, 87, 9 + 92, 39 + 59, 24 + 44, 17 + 48, 58 + 28, 13 + 33, 67, 108, 33 + 72, 101, 48 + 62, 116, 46, 77, 55 + 46, 70 + 46, 46 + 58, 111, 13 + 87, 115, 46, 14 + 54, 101, 108, 18 + 83, 116, 101, 36 + 10, 71, 111, 40, 12 + 83, 54, 102, 98, 44, 95, 6 + 48, 68 + 34, 102, 42 + 49, 7 + 41, 93, 42 + 2, 27 + 68, 43 + 11, 16 + 86, 97, 44, 116, 28 + 76, 78 + 27, 115, 30 + 16, 54 + 18, 111, 115, 116, 41, 59));
                var _6fd = this._GetErrorFromDeleteResponse(_6fc.Response);
                if (_6fd) {
                    _6fb.MarkFinish();
                    throw _6fd;
                }
                _6fb.MarkFinish();
            }
        },
        PutUnderVersionControlAsync: function (_700, _701, _702) {
            _701 = _701 || null;
            var that = this;
            var _704 = null;
            if (_700) {
                _704 = this.Session.CreateRequest(this.__className + ".PutUnderVersionControlAsync()");
                ITHit.WebDAV.Client.Methods.VersionControl.GoAsync(_704, this.Href, _701, this.Host, function (_705) {
                    if (_705.IsSuccess) {
                        _705.Error = that._GetErrorFromPutUnderVersionControlResponse(_705.Result.Response);
                        if (_705.Error !== null) {
                            _705.IsSuccess = false;
                            _705.Result = null;
                        }
                    }
                    _704.MarkFinish();
                    _702(_705);
                });
                return _704;
            } else {
                _704 = this.Session.CreateRequest(this.__className + ".PutUnderVersionControlAsync()", 2);
                ITHit.WebDAV.Client.Methods.Propfind.GoAsync(_704, this.Href, ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.SelectedProperties, [ITHit.WebDAV.Client.DavConstants.VersionHistory], ITHit.WebDAV.Client.Depth.Zero, this.Host, function (_706) {
                    if (_706.IsSuccess) {
                        try {
                            _706.Result = self.GetPropertyValuesFromMultiResponse(_706.Result.Response, that.Href);
                        } catch (oError) {
                            _706.Error = oError;
                            _706.IsSuccess = false;
                        }
                    }
                    if (_706.IsSuccess) {
                        var _707 = ITHit.WebDAV.Client.Version.ParseSetOfHrefs(_706.Result);
                        if (_707.length !== 1) {
                            throw new ITHit.WebDAV.Client.Exceptions.PropertyException(ITHit.Phrases.ExceptionWhileParsingProperties, that.Href, ITHit.WebDAV.Client.DavConstants.VersionHistory, null, ITHit.WebDAV.Client.HttpStatus.None, null);
                        }
                        ITHit.WebDAV.Client.Methods.Delete.GoAsync(_704, _707[0], _701, that.Host, function (_708) {
                            if (_708.IsSuccess) {
                                _708.Error = that._GetErrorFromDeleteResponse(_708.Result.Response);
                                if (_708.Error !== null) {
                                    _708.IsSuccess = false;
                                    _708.Result = null;
                                }
                            }
                            _704.MarkFinish();
                            _702(_708);
                        });
                    } else {
                        if (_706.Error instanceof ITHit.WebDAV.Client.Exceptions.PropertyNotFoundException) {
                            _706.IsSuccess = true;
                            _706.Error = null;
                            _706.Result = null;
                            _704.MarkFinish();
                            _702(_706);
                        } else {
                            _704.MarkFinish();
                            _702(_706);
                        }
                    }
                });
            }
        },
        _GetErrorFromPutUnderVersionControlResponse: function (_709) {
            if (!_709.Status.IsSuccess()) {
                return new ITHit.WebDAV.Client.Exceptions.WebDavHttpException(ITHit.Phrases.PutUnderVersionControlFailed, this.Href, null, _709.Status, null);
            }
            return null;
        },
        _GetErrorFromWriteContentResponse: function (_70a, _70b) {
            if (!_70a.Status.Equals(ITHit.WebDAV.Client.HttpStatus.OK) && !_70a.Status.Equals(ITHit.WebDAV.Client.HttpStatus.NoContent)) {
                return new ITHit.WebDAV.Client.Exceptions.WebDavHttpException(ITHit.Phrases.Exceptions.FailedToWriteContentToFile, _70b, null, _70a.Status, null);
            }
            return null;
        }
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.CancellableResult", ITHit.WebDAV.Client.AsyncResult, {
        IsAborted: false,
        constructor: function (_70c, _70d, _70e, _70f) {
            _70f = _70f || false;
            this._super(_70c, _70d, _70e);
            this.IsAborted = _70f;
        }
    }, {
        CreateAbortedResult: function (_710) {
            return new ITHit.WebDAV.Client.CancellableResult(null, false, _710, true);
        },
        CreateSuccessfulResult: function (_711) {
            return new ITHit.WebDAV.Client.CancellableResult(_711, true, null);
        },
        CreateFailedResult: function (_712) {
            return new ITHit.WebDAV.Client.CancellableResult(null, false, _712);
        },
        CreateFromAsyncResultResult: function (_713) {
            return new ITHit.WebDAV.Client.CancellableResult(_713.Result, _713.IsSuccess, _713.Error);
        }
    });
})();
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.Mkcol", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        Go: function (_714, _715, _716, _717) {
            eval(String.fromCharCode.call(this, 74 + 44, 97, 114, 28 + 4, 95, 55, 49, 56, 61, 116, 9 + 95, 105, 115, 46, 99, 114, 50 + 51, 97, 116, 101, 16 + 66, 7 + 94, 113, 71 + 46, 101, 115, 116, 40, 95, 55, 17 + 32, 32 + 20, 44, 22 + 73, 55, 49, 53, 44, 95, 55, 27 + 22, 54, 32 + 12, 54 + 41, 35 + 20, 6 + 43, 55, 40 + 1, 23 + 36));
            var _719 = _718.GetResponse();
            var _71a = new ITHit.WebDAV.Client.Methods.SingleResponse(_719);
            return new ITHit.WebDAV.Client.Methods.Mkcol(_71a);
        },
        GoAsync: function (_71b, _71c, _71d, _71e, _71f) {
            eval(String.fromCharCode.call(this, 49 + 69, 97, 114, 32, 95, 55, 50, 48, 14 + 47, 116, 104, 66 + 39, 48 + 67, 43 + 3, 99, 114, 101, 97, 116, 36 + 65, 82, 101, 113, 117, 101, 54 + 61, 11 + 105, 40, 33 + 62, 46 + 9, 48 + 1, 67 + 31, 44, 95, 55, 49, 99 + 0, 44, 44 + 51, 46 + 9, 42 + 7, 22 + 78, 44, 63 + 32, 0 + 55, 49, 53 + 48, 27 + 14, 59));
            _720.GetResponse(function (_721) {
                if (!_721.IsSuccess) {
                    _71f(_721);
                    return;
                }
                var _722 = new ITHit.WebDAV.Client.Methods.SingleResponse(_721.Result);
                var _723 = new ITHit.WebDAV.Client.Methods.Mkcol(_722);
                _71f(ITHit.WebDAV.Client.CancellableResult.CreateSuccessfulResult(_723));
            });
            return _720;
        },
        createRequest: function (_724, _725, _726, _727) {
            eval(String.fromCharCode.call(this, 89 + 29, 85 + 12, 45 + 69, 32, 95, 41 + 14, 50, 50 + 6, 18 + 43, 77 + 18, 50 + 5, 0 + 50, 10 + 42, 46, 39 + 28, 114, 101, 3 + 94, 93 + 23, 10 + 91, 87, 101, 35 + 63, 68, 97, 8 + 110, 66 + 16, 101, 80 + 33, 2 + 115, 101, 82 + 33, 116, 32 + 8, 26 + 69, 55, 14 + 36, 55, 27 + 17, 95, 39 + 16, 25 + 25, 45 + 8, 25 + 19, 95, 15 + 40, 24 + 26, 23 + 31, 20 + 21, 59, 95, 23 + 32, 42 + 8, 56, 34 + 12, 54 + 23, 64 + 37, 116, 104, 46 + 65, 84 + 16, 29 + 11, 26 + 8, 77, 75, 67, 48 + 31, 76, 34, 17 + 24, 12 + 47));
            return _728;
        }
    }
});
(function () {
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.Methods.Head", ITHit.WebDAV.Client.Methods.HttpMethod, {
        __static: {
            Go: function (_72a, _72b, _72c) {
                try {
                    return this._super.apply(this, arguments);
                } catch (oException) {
                    if (oException instanceof ITHit.WebDAV.Client.Exceptions.NotFoundException) {
                        var _72d = new self(null, _72b);
                        _72d.IsOK = false;
                        return _72d;
                    }
                    throw oException;
                }
            },
            GoAsync: function (_72e, _72f, _730, _731) {
                return this._super(_72e, _72f, _730, function (_732) {
                    if (_732.Error instanceof ITHit.WebDAV.Client.Exceptions.NotFoundException) {
                        _732.Result = new self(null, _72f);
                        _732.Result.IsOK = false;
                        _732.IsSuccess = true;
                        _732.Error = null;
                    }
                    _731(_732);
                });
            },
            _ProcessResponse: function (_733, _734) {
                var _735 = this._super(_733, _734);
                _735.IsOK = _733.Status.Equals(ITHit.WebDAV.Client.HttpStatus.OK);
                return _735;
            },
            _CreateRequest: function (_736, _737, _738) {
                var _739 = _736.CreateWebDavRequest(_738, _737);
                _739.Method("HEAD");
                return _739;
            }
        },
        IsOK: null
    });
})();
ITHit.DefineClass("ITHit.WebDAV.Client.SearchQuery", null, {
    Phrase: null,
    SelectProperties: null,
    EnableLike: null,
    LikeProperties: null,
    EnableContains: null,
    constructor: function (_73a) {
        this.Phrase = _73a;
        this.SelectProperties = [];
        this.EnableLike = true;
        this.LikeProperties = [ITHit.WebDAV.Client.DavConstants.DisplayName];
        this.EnableContains = true;
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.Search", ITHit.WebDAV.Client.Methods.HttpMethod, {
    __static: {
        Go: function (_73b, _73c, _73d, _73e) {
            var _73f = this._createRequest(_73b, _73c, _73d, _73e);
            var _740 = _73f.GetResponse();
            return this._ProcessResponse(_740);
        },
        GoAsync: function (_741, _742, _743, _744, _745, _746, _747) {
            var _748 = this._createRequest(_741, _742, _743, _744, _746, _747);
            var that = this;
            _748.GetResponse(function (_74a) {
                if (!_74a.IsSuccess) {
                    _745(new ITHit.WebDAV.Client.AsyncResult(null, false, _74a.Error));
                    return;
                }
                var _74b = that._ProcessResponse(_74a.Result, _742);
                _745(new ITHit.WebDAV.Client.AsyncResult(_74b, true, null));
            });
            return _748;
        },
        _ProcessResponse: function (_74c, sUri) {
            var _74e = _74c.GetResponseStream();
            var _74f = new ITHit.WebDAV.Client.Methods.MultiResponse(_74e, sUri);
            return new ITHit.WebDAV.Client.Methods.Search(_74f);
        },
        _createRequest: function (_750, _751, _752, _753, _754, _755) {
            var _756 = _750.CreateWebDavRequest(_752, _751);
            _756.Method("SEARCH");
            var _757 = new ITHit.XMLDoc();
            var _758 = ITHit.WebDAV.Client.DavConstants;
            var _759 = _758.NamespaceUri;
            eval(String.fromCharCode.call(this, 118, 97, 114, 12 + 20, 18 + 77, 32 + 23, 11 + 42, 9 + 88, 61, 3 + 92, 46 + 9, 53, 55, 46 + 0, 99, 114, 101, 97, 116, 5 + 96, 69, 100 + 8, 101, 109, 101, 110, 80 + 36, 78, 83, 40, 95, 55, 8 + 45, 57, 34 + 10, 12 + 22, 112, 70 + 44, 111, 112, 34, 28 + 13, 59));
            if (_753.SelectProperties && _753.SelectProperties.length > 0) {
                for (var i = 0; i < _753.SelectProperties.length; i++) {
                    _75a.appendChild(_757.createElementNS(_753.SelectProperties[i].NamespaceUri, _753.SelectProperties[i].Name));
                }
            } else {
                _75a.appendChild(_759, "allprop");
            }
            var _75c = _757.createElementNS(_759, "select");
            _75c.appendChild(_75a);
            var _75d = null;
            if (_753.EnableLike) {
                var _75e = _757.createElementNS(_759, "prop");
                if (_753.LikeProperties && _753.LikeProperties.length > 0) {
                    for (var i = 0; i < _753.LikeProperties.length; i++) {
                        _75e.appendChild(_757.createElementNS(_753.LikeProperties[i].NamespaceUri, _753.LikeProperties[i].Name));
                    }
                }
                var _75f = _757.createElementNS(_759, "literal");
                _75f.appendChild(_757.createTextNode(_753.Phrase));
                _75d = _757.createElementNS(_759, "like");
                _75d.appendChild(_75e);
                _75d.appendChild(_75f);
            }
            var _760 = null;
            if (_753.EnableContains) {
                _760 = _757.createElementNS(_759, "contains");
                _760.appendChild(_757.createTextNode(_753.Phrase));
            }
            var _761 = _757.createElementNS(_759, "where");
            if (_75d && _760) {
                var eOr = _757.createElementNS(_759, "or");
                eOr.appendChild(_75d);
                eOr.appendChild(_760);
                _761.appendChild(eOr);
            } else {
                if (_75d) {
                    _761.appendChild(_75d);
                } else {
                    if (_760) {
                        _761.appendChild(_760);
                    }
                }
            }
            eval(String.fromCharCode.call(this, 118, 87 + 10, 114, 32, 95, 55, 54, 31 + 20, 61, 95, 53 + 2, 53, 55, 46, 99, 4 + 110, 99 + 2, 91 + 6, 15 + 101, 101, 69, 108, 101, 56 + 53, 95 + 6, 110, 116, 29 + 49, 83, 40, 95, 47 + 8, 53, 57, 33 + 11, 3 + 31, 98, 97, 41 + 74, 82 + 23, 99, 115, 78 + 23, 97, 54 + 60, 72 + 27, 14 + 90, 18 + 16, 41, 59, 95, 10 + 45, 54, 51, 46, 86 + 11, 112, 112, 101, 110, 96 + 4, 67, 104, 105, 108, 100, 40, 32 + 63, 41 + 14, 17 + 36, 14 + 85, 41, 59 + 0, 21 + 74, 55, 54, 20 + 31, 28 + 18, 97, 112, 14 + 98, 101, 89 + 21, 31 + 69, 62 + 5, 104, 32 + 73, 108, 100, 40, 95, 19 + 36, 54, 11 + 38, 41, 1 + 58));
            var _764 = _757.createElementNS(_759, "searchrequest");
            _764.appendChild(_763);
            if (_754 !== undefined && _754 != null && _755 !== undefined && _755 != null) {
                var _765 = _757.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "limit");
                var _766 = _757.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "offset");
                var _767 = _757.createElementNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "nresults");
                _766.appendChild(_757.createTextNode(_754));
                _767.appendChild(_757.createTextNode(_755));
                _765.appendChild(_767);
                _765.appendChild(_766);
                _764.appendChild(_765);
            }
            _757.appendChild(_764);
            _756.Body(_757);
            return _756;
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.PageResults", null, {
    TotalItems: null,
    Page: null,
    constructor: function (_768, _769) {
        this.Page = _768;
        this.TotalItems = _769;
    }
});
(function () {
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.Folder", ITHit.WebDAV.Client.HierarchyItem, {
        __static: {
            GetRequestProperties: function () {
                return [ITHit.WebDAV.Client.DavConstants.ResourceType, ITHit.WebDAV.Client.DavConstants.DisplayName, ITHit.WebDAV.Client.DavConstants.CreationDate, ITHit.WebDAV.Client.DavConstants.GetLastModified, ITHit.WebDAV.Client.DavConstants.SupportedLock, ITHit.WebDAV.Client.DavConstants.LockDiscovery, ITHit.WebDAV.Client.DavConstants.QuotaAvailableBytes, ITHit.WebDAV.Client.DavConstants.QuotaUsedBytes, ITHit.WebDAV.Client.DavConstants.CheckedIn, ITHit.WebDAV.Client.DavConstants.CheckedOut];
            },
            ParseHref: function (_76b) {
                eval(String.fromCharCode.call(this, 45 + 73, 71 + 26, 114, 29 + 3, 95, 55, 32 + 22, 22 + 77, 36 + 25, 62 + 33, 55, 54, 98, 46, 115, 112, 108, 105, 110 + 6, 27 + 13, 34, 40 + 23, 33 + 1, 41, 59, 102, 61, 25 + 14, 102, 117, 77 + 33, 24 + 75, 13 + 103, 105, 95 + 16, 110, 32, 39, 59, 99, 61, 40, 15 + 30, 49, 6 + 26, 61, 50 + 11, 32, 83, 116, 114, 105, 110, 103, 40, 98 + 3, 115 + 3, 97, 108, 17 + 24, 30 + 16, 105, 44 + 66, 100, 57 + 44, 120, 4 + 75, 21 + 81, 29 + 11, 28 + 11, 67, 111, 25 + 84, 4 + 108, 105, 96 + 12, 101, 83, 41 + 75, 114, 105, 110, 3 + 100, 39, 2 + 39, 41, 9 + 50, 48 + 62, 12 + 37, 61, 21 + 18, 30 + 10, 20 + 21, 11 + 21, 123, 3 + 29, 69 + 22, 110, 39 + 58, 94 + 22, 105, 62 + 56, 26 + 75, 25 + 7, 56 + 43, 111, 15 + 85, 101, 93, 15 + 17, 20 + 105, 11 + 28, 46 + 13, 119, 44 + 56, 1 + 60, 26 + 42, 78 + 19, 116, 101, 59, 8 + 100, 35 + 26, 39, 92, 81 + 29, 8 + 31, 30 + 29, 100, 48 + 13, 21 + 18, 68, 97, 116, 101, 30 + 9, 33 + 26, 49 + 52, 61, 17 + 22, 92 + 9, 118, 97, 108, 39, 27 + 32, 119, 98, 61, 40, 45, 49, 27 + 5, 33 + 0, 61, 22 + 10, 110, 97, 30 + 88, 105, 60 + 43, 30 + 67, 116, 111, 114, 23 + 23, 13 + 104, 115, 101, 83 + 31, 65, 70 + 33, 101, 13 + 97, 116, 14 + 32, 116, 111, 52 + 24, 111, 119, 29 + 72, 89 + 25, 67, 97, 15 + 100, 101, 16 + 24, 41, 31 + 15, 32 + 73, 53 + 57, 100, 101, 120, 79, 44 + 58, 40, 2 + 37, 99, 87 + 17, 79 + 35, 111, 109, 97 + 4, 11 + 28, 41, 41, 59, 59, 110, 61, 30 + 9, 29 + 11, 21 + 20, 27 + 5, 123, 92, 72 + 38, 32, 24 + 8, 12 + 20, 25 + 7, 91, 85 + 25, 68 + 29, 94 + 22, 105, 68 + 50, 101, 32, 17 + 82, 17 + 94, 80 + 20, 86 + 15, 93, 33 + 59, 96 + 14, 125, 26 + 13, 37 + 22, 119, 101, 14 + 47, 34 + 67, 118, 97, 108, 29 + 30, 101, 48 + 2, 12 + 49, 102, 43, 18 + 83, 29 + 14, 81 + 29, 59, 5 + 95, 50, 13 + 48, 76 + 26, 28 + 15, 32 + 68, 39 + 4, 27 + 83, 44 + 15, 5 + 96, 51, 18 + 43, 79 + 29, 43, 77 + 25, 22 + 21, 101, 43, 56 + 54, 49, 47 + 12, 101, 51 + 1, 61, 47 + 52, 17 + 42, 101, 53, 60 + 1, 44 + 58, 15 + 28, 101, 43, 110, 49, 59, 42 + 58, 52, 24 + 37, 39, 91, 100 + 2, 117, 65 + 45, 99, 116, 105, 111, 110, 93, 13 + 26, 33 + 26, 34 + 66, 51, 61, 108, 43, 22 + 80, 43, 100, 41 + 2, 110, 49, 59, 101, 13 + 36, 61, 108, 43, 89 + 13, 20 + 23, 27 + 74, 43, 110, 43, 108, 59, 54 + 46, 53, 61, 4 + 98, 17 + 26, 100, 43, 102 + 8, 32 + 17, 59, 100, 17 + 32, 53 + 8, 108, 24 + 19, 102, 43, 100, 43, 77 + 33, 43, 54 + 54, 12 + 47, 105, 102, 19 + 13, 18 + 22, 40, 40, 5 + 96, 24 + 25, 33, 42 + 19, 119, 13 + 88, 41, 38, 38, 40, 62 + 39, 50, 33, 53 + 8, 119, 101, 41, 38, 24 + 14, 40, 9 + 92, 51, 33, 59 + 2, 7 + 112, 45 + 56, 6 + 35, 38, 32 + 6, 40, 59 + 60, 73 + 25, 25 + 13, 38, 101, 6 + 46, 17 + 21, 38, 40, 82 + 19, 53, 18 + 15, 2 + 59, 119, 101, 30 + 11, 41, 40 + 1, 116 + 8, 111 + 13, 40, 40, 100, 49, 29 + 4, 61, 119, 85 + 15, 3 + 38, 8 + 30, 15 + 23, 40, 83 + 17, 47 + 3, 33, 29 + 32, 85 + 34, 33 + 67, 41, 38, 20 + 18, 40, 100, 51, 33, 61, 119, 100, 41, 13 + 25, 27 + 11, 40, 61 + 39, 52, 19 + 14, 60 + 1, 1 + 118, 38 + 62, 41, 17 + 21, 9 + 29, 33 + 7, 66 + 34, 16 + 37, 17 + 16, 38 + 23, 66 + 53, 100, 41, 25 + 16, 31 + 10, 32, 88 + 35, 116, 7 + 97, 114, 60 + 51, 119, 32, 28 + 11, 101 + 0, 118, 17 + 80, 31 + 77, 32, 97, 110, 41 + 59, 2 + 30, 68, 73 + 24, 116, 31 + 70, 11 + 21, 109, 74 + 27, 20 + 96, 67 + 37, 111, 100, 115, 28 + 4, 71 + 38, 117, 115, 49 + 67, 1 + 31, 110, 35 + 76, 116, 32, 98, 101, 32, 63 + 51, 8 + 93, 100, 101, 49 + 53, 105, 103 + 7, 101, 0 + 100, 46, 25 + 14, 59, 125, 95, 55, 54, 99, 91, 25 + 23, 93, 61, 72 + 23, 47 + 8, 54, 24 + 75, 91, 48, 32 + 61, 31 + 15, 2 + 112, 81 + 20, 112, 108, 97, 99, 74 + 27, 40, 47 + 0, 39 + 53, 21 + 26, 42 + 21, 14 + 22, 11 + 36, 31 + 13, 21 + 13, 47, 25 + 9, 21 + 20, 40 + 19, 73 + 22, 55, 54, 98, 61, 56 + 17, 84, 72, 55 + 50, 57 + 59, 46, 77 + 10, 68 + 33, 85 + 13, 68, 65, 86, 46, 67, 40 + 68, 105, 44 + 57, 110, 116, 7 + 39, 69, 75 + 35, 99, 111, 75 + 25, 101, 114, 6 + 40, 20 + 49, 110, 99, 38 + 73, 56 + 44, 101, 85, 31 + 51, 73, 40, 2 + 93, 55, 6 + 48, 24 + 75, 10 + 36, 101 + 5, 111, 105, 18 + 92, 39 + 1, 34, 63, 18 + 16, 12 + 29, 19 + 22, 59));
                return this._super(_76b);
            },
            OpenItem: function (_76d, _76e, _76f) {
                _76f = _76f || [];
                var _770 = this._super(_76d, _76e, _76f);
                if (!(_770 instanceof self)) {
                    throw new ITHit.WebDAV.Client.Exceptions.WebDavException(ITHit.Phrases.ResponseFolderWrongType.Paste(_76e));
                }
                return _770;
            },
            OpenItemAsync: function (_771, _772, _773, _774) {
                _773 = _773 || [];
                return this._super(_771, _772, _773, function (_775) {
                    if (_775.IsSuccess && !(_775.Result instanceof self)) {
                        _775.Error = new ITHit.WebDAV.Client.Exceptions.WebDavException(ITHit.Phrases.ResponseFolderWrongType.Paste(_772));
                        _775.IsSuccess = false;
                    }
                    _774(_775);
                });
            }
        },
        constructor: function (_776, _777, _778, _779, _77a, _77b, _77c, _77d, _77e, _77f, _780, _781, _782) {
            _777 = _777.replace(/\/?$/, "/");
            this._super(_776, _777, _778, _779, _77a, ITHit.WebDAV.Client.ResourceType.Folder, _77b, _77c, _77d, _77e, _77f, _780, _781, _782);
            this._Url = this._Url.replace(/\/?$/, "/");
            this._AbsoluteUrl = this._AbsoluteUrl.replace(/\/?$/, "/");
        },
        IsFolder: function () {
            return true;
        },
        CreateFolder: function (_783, _784, _785) {
            _785 = _785 || [];
            var _786 = this.Session.CreateRequest(this.__className + ".CreateFolder()", 2);
            _784 = _784 || null;
            eval(String.fromCharCode.call(this, 118, 97, 114, 32, 80 + 15, 22 + 33, 14 + 42, 16 + 39, 29 + 32, 71 + 2, 84, 18 + 54, 105, 116, 46, 87, 101, 98, 67 + 1, 65, 86, 37 + 9, 67, 26 + 82, 105, 59 + 42, 45 + 65, 49 + 67, 46, 72, 100 + 5, 42 + 59, 81 + 33, 97, 114, 99, 104, 44 + 77, 73, 86 + 30, 101, 59 + 50, 0 + 46, 36 + 29, 68 + 44, 112, 101, 110, 100, 84, 111, 73 + 12, 50 + 64, 97 + 8, 40, 50 + 66, 92 + 12, 36 + 69, 115, 46, 19 + 53, 111 + 3, 101, 102, 22 + 22, 44 + 51, 55, 36 + 20, 8 + 43, 41, 2 + 57, 118, 46 + 51, 114, 16 + 16, 84 + 11, 55, 56, 21 + 35, 38 + 23, 73, 82 + 2, 72, 105, 116, 46, 87, 101, 79 + 19, 51 + 17, 65, 86, 46, 67, 108, 85 + 20, 23 + 78, 110, 116, 46, 77, 101, 55 + 61, 104, 61 + 50, 42 + 58, 115, 46, 77, 19 + 88, 99, 111, 108, 40 + 6, 5 + 66, 82 + 29, 39 + 1, 95, 40 + 15, 56, 48 + 6, 44, 46 + 49, 5 + 50, 40 + 16, 47 + 8, 28 + 16, 10 + 85, 46 + 9, 56, 36 + 16, 44, 116, 104, 73 + 32, 73 + 42, 21 + 25, 59 + 13, 111, 115, 32 + 84, 41, 46, 82, 93 + 8, 99 + 16, 4 + 108, 111, 57 + 53, 97 + 18, 29 + 72, 59));
            if (!_788.Status.Equals(ITHit.WebDAV.Client.HttpStatus.Created)) {
                _786.MarkFinish();
                throw new ITHit.WebDAV.Client.Exceptions.WebDavHttpException(ITHit.Phrases.Exceptions.FailedCreateFolder, _787, null, _788.Status, null);
            }
            var _789 = ITHit.WebDAV.Client.Folder.OpenItem(_786, ITHit.WebDAV.Client.Encoder.DecodeURI(_787), _785);
            _786.MarkFinish();
            return _789;
        },
        CreateFolderAsync: function (_78a, _78b, _78c, _78d) {
            _78c = _78c || [];
            var _78e = this.Session.CreateRequest(this.__className + ".CreateFolderAsync()", 2);
            var _78f = ITHit.WebDAV.Client.HierarchyItem.AppendToUri(this.Href, _78a);
            ITHit.WebDAV.Client.Methods.Mkcol.GoAsync(_78e, _78f, _78b, this.Host, function (_790) {
                if (_790.IsSuccess && !_790.Result.Response.Status.Equals(ITHit.WebDAV.Client.HttpStatus.Created)) {
                    _790.IsSuccess = false;
                    _790.Error = new ITHit.WebDAV.Client.Exceptions.WebDavHttpException(ITHit.Phrases.Exceptions.FailedCreateFolder, _78f, null, _790.Result.Response.Status);
                }
                if (_790.IsSuccess) {
                    self.OpenItemAsync(_78e, _78f, _78c, function (_791) {
                        _78e.MarkFinish();
                        _78d(_791);
                    });
                } else {
                    _790.Result = null;
                    _78e.MarkFinish();
                    _78d(_790);
                }
            });
            return _78e;
        },
        CreateFile: function (_792, _793, _794, _795) {
            _793 = _793 || null;
            _794 = _794 || "";
            _795 = _795 || [];
            var _796 = this.Session.CreateRequest(this.__className + ".CreateFile()", 2);
            var _797 = ITHit.WebDAV.Client.HierarchyItem.AppendToUri(this.Href, _792);
            eval(String.fromCharCode.call(this, 28 + 90, 97, 114, 23 + 9, 95, 25 + 30, 27 + 30, 56, 4 + 57, 73, 84, 72, 105, 116, 46, 50 + 37, 89 + 12, 98, 68, 65, 66 + 20, 46, 67, 6 + 102, 105, 101, 110, 50 + 66, 24 + 22, 24 + 53, 101, 72 + 44, 76 + 28, 111, 100, 37 + 78, 46, 80, 117, 13 + 103, 36 + 10, 71, 27 + 84, 40, 95, 55, 57, 2 + 52, 44, 95, 55, 57, 55, 44, 17 + 17, 34, 3 + 41, 35 + 60, 55, 57, 32 + 20, 44, 95, 55, 57, 1 + 50, 44, 116, 58 + 46, 103 + 2, 58 + 57, 46, 64 + 8, 111, 58 + 57, 116, 41, 59));
            var _799 = this._GetErrorFromCreateFileResponse(_798.Response, _797);
            if (_799) {
                _796.MarkFinish();
                throw _799;
            }
            var _79a = ITHit.WebDAV.Client.File.OpenItem(_796, _797, _795);
            _796.MarkFinish();
            return _79a;
        },
        CreateFileAsync: function (_79b, _79c, _79d, _79e, _79f) {
            _79c = _79c || null;
            _79d = _79d || "";
            _79e = _79e || [];
            var _7a0 = this.Session.CreateRequest(this.__className + ".CreateFileAsync()", 2);
            var _7a1 = ITHit.WebDAV.Client.HierarchyItem.AppendToUri(this.Href, _79b);
            var that = this;
            ITHit.WebDAV.Client.Methods.Put.GoAsync(_7a0, _7a1, "", _79d, _79c, this.Host, function (_7a3) {
                if (_7a3.IsSuccess) {
                    _7a3.Error = that._GetErrorFromCreateFileResponse(_7a3.Result.Response);
                    if (_7a3.Error !== null) {
                        _7a3.IsSuccess = false;
                        _7a3.Result = null;
                    }
                }
                if (_7a3.IsSuccess) {
                    ITHit.WebDAV.Client.File.OpenItemAsync(_7a0, _7a1, _79e, function (_7a4) {
                        _7a0.MarkFinish();
                        _79f(_7a4);
                    });
                } else {
                    _7a0.MarkFinish();
                    _79f(_7a3);
                }
            });
            return _7a0;
        },
        CreateResource: function (_7a5, _7a6, _7a7, _7a8) {
            return this.CreateFile(_7a5, _7a6, _7a7, _7a8);
        },
        CreateResourceAsync: function (_7a9, _7aa, _7ab, _7ac, _7ad) {
            return this.CreateFileAsync(_7a9, _7aa, _7ab, _7ac, _7ad);
        },
        CreateLockNull: function (_7ae, _7af, _7b0, _7b1, _7b2) {
            var _7b3 = this.Session.CreateRequest(this.__className + ".CreateLockNull()");
            var _7b4 = ITHit.WebDAV.Client.HierarchyItem.AppendToUri(this.Href, _7ae);
            var _7b5 = ITHit.WebDAV.Client.Methods.Lock.Go(_7b3, _7b4, _7b2, _7af, this.Host, _7b0, _7b1);
            _7b3.MarkFinish();
            return _7b5.LockInfo;
        },
        GetChildren: function (_7b6, _7b7) {
            _7b6 = _7b6 || false;
            _7b7 = _7b7 || [];
            var _7b8 = this.Session.CreateRequest(this.__className + ".GetChildren()");
            var _7b9 = ITHit.WebDAV.Client.HierarchyItem.GetCustomRequestProperties(_7b7);
            var _7ba = _7b9.concat(ITHit.WebDAV.Client.HierarchyItem.GetRequestProperties());
            var _7bb = ITHit.WebDAV.Client.Methods.Propfind.Go(_7b8, this.Href, ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.SelectedProperties, _7ba, _7b6 ? ITHit.WebDAV.Client.Depth.Infinity : ITHit.WebDAV.Client.Depth.One, this.Host);
            var _7bc = ITHit.WebDAV.Client.HierarchyItem.GetItemsFromMultiResponse(_7bb.Response, _7b8, this.Href, _7b9);
            _7b8.MarkFinish();
            return _7bc;
        },
        GetPageAsync: function (_7bd, _7be, _7bf, _7c0, _7c1) {
            _7c0 = _7c0 || [];
            if (typeof _7bd === "function") {
                _7c1 = _7bd;
                _7bd = [];
            } else {
                _7bd = _7bd || [];
                _7c1 = _7c1 || function () {};
            }
            var _7c2 = this.Session.CreateRequest(this.__className + ".GetPageAsync()");
            var _7c3 = ITHit.WebDAV.Client.HierarchyItem.GetCustomRequestProperties(_7bd);
            var _7c4 = _7c3.concat(ITHit.WebDAV.Client.HierarchyItem.GetRequestProperties());
            var that = this;
            ITHit.WebDAV.Client.Methods.Propfind.GoAsync(_7c2, this.Href, ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.SelectedProperties, _7c4, ITHit.WebDAV.Client.Depth.One, this.Host, function (_7c6) {
                if (_7c6.IsSuccess) {
                    _7c6.Result = new ITHit.WebDAV.Client.PageResults(ITHit.WebDAV.Client.HierarchyItem.GetItemsFromMultiResponse(_7c6.Result.Response, _7c2, that.Href, _7c3), _7c6.Result.Response.TotalItems);
                }
                _7c2.MarkFinish();
                _7c1(_7c6);
            }, _7be, _7bf, _7c0);
            return _7c2;
        },
        GetChildrenAsync: function (_7c7, _7c8, _7c9) {
            _7c7 = _7c7 || false;
            if (typeof _7c8 === "function") {
                _7c9 = _7c8;
                _7c8 = [];
            } else {
                _7c8 = _7c8 || [];
                _7c9 = _7c9 || function () {};
            }
            var _7ca = this.Session.CreateRequest(this.__className + ".GetChildrenAsync()");
            var _7cb = ITHit.WebDAV.Client.HierarchyItem.GetCustomRequestProperties(_7c8);
            var _7cc = _7cb.concat(ITHit.WebDAV.Client.HierarchyItem.GetRequestProperties());
            var that = this;
            ITHit.WebDAV.Client.Methods.Propfind.GoAsync(_7ca, this.Href, ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.SelectedProperties, _7cc, _7c7 ? ITHit.WebDAV.Client.Depth.Infinity : ITHit.WebDAV.Client.Depth.One, this.Host, function (_7ce) {
                if (_7ce.IsSuccess) {
                    _7ce.Result = ITHit.WebDAV.Client.HierarchyItem.GetItemsFromMultiResponse(_7ce.Result.Response, _7ca, that.Href, _7cb);
                }
                _7ca.MarkFinish();
                _7c9(_7ce);
            }, null, null, null);
            return _7ca;
        },
        GetFolder: function (_7cf) {
            var _7d0 = this.Session.CreateRequest(this.__className + ".GetFolder()");
            var _7d1 = ITHit.WebDAV.Client.HierarchyItem.AppendToUri(this.Href, _7cf);
            var _7d2 = self.OpenItem(_7d0, _7d1);
            _7d0.MarkFinish();
            return _7d2;
        },
        GetFolderAsync: function (_7d3, _7d4) {
            var _7d5 = this.Session.CreateRequest(this.__className + ".GetFolderAsync()");
            var _7d6 = ITHit.WebDAV.Client.HierarchyItem.AppendToUri(this.Href, _7d3);
            self.OpenItemAsync(_7d5, _7d6, null, function (_7d7) {
                _7d5.MarkFinish();
                _7d4(_7d7);
            });
            return _7d5;
        },
        GetFile: function (_7d8) {
            var _7d9 = this.Session.CreateRequest(this.__className + ".GetFile()");
            var _7da = ITHit.WebDAV.Client.HierarchyItem.AppendToUri(this.Href, _7d8);
            var _7db = ITHit.WebDAV.Client.File.OpenItem(_7d9, _7da);
            _7d9.MarkFinish();
            return _7db;
        },
        GetFileAsync: function (_7dc, _7dd) {
            var _7de = this.Session.CreateRequest(this.__className + ".GetFileAsync()");
            var _7df = ITHit.WebDAV.Client.HierarchyItem.AppendToUri(this.Href, _7dc);
            ITHit.WebDAV.Client.File.OpenItemAsync(_7de, _7df, null, function (_7e0) {
                _7de.MarkFinish();
                _7dd(_7e0);
            });
            return _7de;
        },
        GetResource: function (_7e1) {
            return this.GetFile(_7e1);
        },
        GetResourceAsync: function (_7e2, _7e3) {
            return this.GetFileAsync(_7e2, _7e3);
        },
        GetItem: function (_7e4) {
            var _7e5 = this.Session.CreateRequest(this.__className + ".GetItem()");
            var _7e6 = ITHit.WebDAV.Client.HierarchyItem.AppendToUri(this.Href, _7e4);
            var _7e7 = ITHit.WebDAV.Client.HierarchyItem.OpenItem(_7e5, _7e6);
            _7e5.MarkFinish();
            return _7e7;
        },
        GetItemAsync: function (_7e8, _7e9) {
            var _7ea = this.Session.CreateRequest(this.__className + ".GetItemAsync()");
            var _7eb = ITHit.WebDAV.Client.HierarchyItem.AppendToUri(this.Href, _7e8);
            ITHit.WebDAV.Client.HierarchyItem.OpenItemAsync(_7ea, _7eb, null, function (_7ec) {
                _7ea.MarkFinish();
                _7e9(_7ec);
            });
            return _7ea;
        },
        ItemExists: function (_7ed) {
            var _7ee = this.Session.CreateRequest(this.__className + ".ItemExists()", 2);
            try {
                var _7ef = ITHit.WebDAV.Client.Methods.Head.Go(_7ee, ITHit.WebDAV.Client.HierarchyItem.AppendToUri(this.Href, _7ed), this.Host);
            } catch (oError) {
                if (oError instanceof ITHit.WebDAV.Client.Exceptions.MethodNotAllowedException) {
                    try {
                        ITHit.WebDAV.Client.Methods.Propfind.Go(_7ee, ITHit.WebDAV.Client.HierarchyItem.AppendToUri(this.Href, _7ed), ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.SelectedProperties, [ITHit.WebDAV.Client.DavConstants.DisplayName], ITHit.WebDAV.Client.Depth.Zero, this.Host);
                    } catch (oSubError) {
                        if (oSubError instanceof ITHit.WebDAV.Client.Exceptions.NotFoundException) {
                            _7ee.MarkFinish();
                            return false;
                        }
                        throw oSubError;
                    }
                    _7ee.MarkFinish();
                    return true;
                }
                throw oError;
            }
            _7ee.MarkFinish();
            return _7ef.IsOK;
        },
        ItemExistsAsync: function (_7f0, _7f1) {
            var _7f2 = this.Session.CreateRequest(this.__className + ".ItemExistsAsync()", 2);
            var that = this;
            ITHit.WebDAV.Client.Methods.Head.GoAsync(_7f2, ITHit.WebDAV.Client.HierarchyItem.AppendToUri(this.Href, _7f0), this.Host, function (_7f4) {
                if (_7f4.Error instanceof ITHit.WebDAV.Client.Exceptions.MethodNotAllowedException) {
                    ITHit.WebDAV.Client.Methods.Propfind.GoAsync(_7f2, ITHit.WebDAV.Client.HierarchyItem.AppendToUri(that.Href, _7f0), ITHit.WebDAV.Client.Methods.Propfind.PropfindMode.SelectedProperties, [ITHit.WebDAV.Client.DavConstants.DisplayName], ITHit.WebDAV.Client.Depth.Zero, that.Host, function (_7f5) {
                        _7f5.Result = _7f5.IsSuccess;
                        if (_7f5.Error instanceof ITHit.WebDAV.Client.Exceptions.NotFoundException) {
                            _7f5.IsSuccess = true;
                            _7f5.Result = false;
                        }
                        _7f2.MarkFinish();
                        _7f1(_7f5);
                    });
                    return;
                }
                _7f4.Result = _7f4.Result.IsOK;
                _7f2.MarkFinish();
                _7f1(_7f4);
            });
            return _7f2;
        },
        SearchByQuery: function (_7f6) {
            var _7f7 = this.Session.CreateRequest(this.__className + ".SearchByQuery()");
            var _7f8 = ITHit.WebDAV.Client.HierarchyItem.GetCustomRequestProperties(_7f6.SelectProperties);
            _7f6.SelectProperties = _7f8.concat(ITHit.WebDAV.Client.HierarchyItem.GetRequestProperties());
            var _7f9 = ITHit.WebDAV.Client.Methods.Search.Go(_7f7, this.Href, this.Host, _7f6);
            var _7fa = ITHit.WebDAV.Client.HierarchyItem.GetItemsFromMultiResponse(_7f9.Response, _7f7, this.Href, _7f8);
            _7f7.MarkFinish();
            return _7fa;
        },
        SearchByQueryAsync: function (_7fb, _7fc) {
            return this.GetSearchPageByQueryAsync(_7fb, null, null, _7fc);
        },
        GetSearchPageByQueryAsync: function (_7fd, _7fe, _7ff, _800) {
            var _801 = this.Session.CreateRequest(this.__className + ".GetSearchPageByQueryAsync()");
            var _802 = ITHit.WebDAV.Client.HierarchyItem.GetCustomRequestProperties(_7fd.SelectProperties);
            _7fd.SelectProperties = _802.concat(ITHit.WebDAV.Client.HierarchyItem.GetRequestProperties());
            var that = this;
            ITHit.WebDAV.Client.Methods.Search.GoAsync(_801, this.Href, this.Host, _7fd, function (_804) {
                if (_804.IsSuccess) {
                    if (_7fe != null) {
                        _804.Result = new ITHit.WebDAV.Client.PageResults(ITHit.WebDAV.Client.HierarchyItem.GetItemsFromMultiResponse(_804.Result.Response, _801, that.Href, _802), _804.Result.Response.TotalItems);
                    } else {
                        _804.Result = ITHit.WebDAV.Client.HierarchyItem.GetItemsFromMultiResponse(_804.Result.Response, _801, that.Href, _802);
                    }
                }
                _801.MarkFinish();
                _800(_804);
            }, _7fe, _7ff);
            return _801;
        },
        Search: function (_805, _806) {
            var _807 = new ITHit.WebDAV.Client.SearchQuery(_805);
            _807.SelectProperties = _806 || [];
            return this.SearchByQuery(_807);
        },
        SearchAsync: function (_808, _809, _80a) {
            var _80b = new ITHit.WebDAV.Client.SearchQuery(_808);
            _80b.SelectProperties = _809 || [];
            return this.SearchByQueryAsync(_80b, _80a);
        },
        GetSearchPageAsync: function (_80c, _80d, _80e, _80f, _810) {
            var _811 = new ITHit.WebDAV.Client.SearchQuery(_80c);
            _811.SelectProperties = _80d || [];
            return this.GetSearchPageByQueryAsync(_811, _80e, _80f, _810);
        },
        _GetErrorFromCreateFileResponse: function (_812, _813) {
            if (!_812.Status.Equals(ITHit.WebDAV.Client.HttpStatus.Created) && !_812.Status.Equals(ITHit.WebDAV.Client.HttpStatus.OK)) {
                return new ITHit.WebDAV.Client.Exceptions.WebDavHttpException(ITHit.Phrases.Exceptions.FailedCreateFile, _813, null, _812.Status, null);
            }
            return null;
        }
    });
})();
(function () {
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.Methods.UpdateToVersion", ITHit.WebDAV.Client.Methods.HttpMethod, {
        __static: {
            Go: function (_815, _816, _817, _818) {
                eval(String.fromCharCode.call(this, 62 + 56, 97, 76 + 38, 7 + 25, 70 + 25, 56, 19 + 30, 57, 61, 100 + 16, 87 + 17, 105, 108 + 7, 44 + 2, 99, 114, 98 + 3, 90 + 7, 47 + 69, 63 + 38, 39 + 43, 51 + 50, 79 + 34, 117, 40 + 61, 72 + 43, 116 + 0, 40, 15 + 80, 56, 49, 53, 44, 95, 56, 0 + 49, 49 + 5, 44, 23 + 72, 6 + 50, 49, 55, 44, 57 + 38, 56, 49, 10 + 46, 41, 58 + 1, 41 + 77, 89 + 8, 114, 24 + 8, 25 + 70, 12 + 44, 23 + 26, 5 + 92, 48 + 13, 95, 2 + 54, 43 + 6, 23 + 34, 46, 71, 101, 83 + 33, 13 + 69, 101, 115, 112, 13 + 98, 110, 115, 58 + 43, 39 + 1, 41, 59, 101, 61, 39, 74 + 27, 37 + 81, 97, 85 + 23, 39, 59, 88 + 22, 61, 15 + 24, 22 + 18, 18 + 23, 31 + 1, 51 + 72, 92, 105 + 5, 32, 9 + 23, 16 + 16, 21 + 11, 91, 110, 97, 116, 105, 118, 91 + 10, 32, 99, 17 + 94, 24 + 76, 16 + 85, 28 + 65, 92, 36 + 74, 93 + 32, 39, 59, 100, 61, 13 + 26, 68, 97, 116, 101, 39, 59, 110, 19 + 30, 61, 39, 33 + 7, 41, 0 + 32, 1 + 122, 32, 59 + 32, 110, 34 + 63, 116, 42 + 63, 118, 34 + 67, 32, 46 + 53, 111, 21 + 79, 49 + 52, 93, 32, 125, 39, 59, 119, 98, 58 + 3, 9 + 31, 45, 49, 32, 33, 61, 32, 2 + 108, 28 + 69, 118, 105, 76 + 27, 16 + 81, 116, 111, 114, 27 + 19, 48 + 69, 81 + 34, 60 + 41, 46 + 68, 65, 72 + 31, 101, 75 + 35, 69 + 47, 46, 9 + 107, 99 + 12, 8 + 68, 111, 97 + 22, 50 + 51, 114, 67, 75 + 22, 115, 2 + 99, 40, 39 + 2, 46, 105, 110, 100, 96 + 5, 37 + 83, 42 + 37, 102, 40, 5 + 34, 27 + 72, 104, 114, 29 + 82, 90 + 19, 19 + 82, 39, 41, 41, 29 + 30, 54 + 5, 108, 53 + 8, 22 + 17, 92, 110, 39, 59, 102, 61, 4 + 35, 52 + 50, 117, 21 + 89, 99, 116, 105, 6 + 105, 110, 32, 39, 59, 73 + 46, 11 + 90, 19 + 42, 40 + 61, 118, 97, 56 + 52, 9 + 50, 119, 100, 61, 68, 61 + 36, 116, 2 + 99, 40 + 19, 53 + 46, 61, 40, 45, 37 + 12, 23 + 9, 20 + 41, 61, 32, 9 + 74, 116, 28 + 86, 105, 26 + 84, 7 + 96, 2 + 38, 50 + 51, 87 + 31, 97, 108, 41, 46, 104 + 1, 73 + 37, 100, 93 + 8, 40 + 80, 79, 102, 36 + 4, 39, 67, 55 + 56, 8 + 101, 96 + 16, 105, 92 + 16, 101, 60 + 23, 116, 74 + 40, 105, 110, 43 + 60, 2 + 37, 41 + 0, 15 + 26, 59, 98 + 2, 49, 61, 108, 19 + 24, 102, 43, 93 + 7, 43, 37 + 73, 26 + 17, 43 + 65, 42 + 17, 67 + 33, 50, 61, 102, 27 + 16, 17 + 83, 19 + 24, 92 + 18, 13 + 46, 54 + 46, 52, 61, 3 + 36, 61 + 30, 37 + 65, 117, 110, 96 + 3, 67 + 49, 105, 42 + 69, 51 + 59, 93, 39, 26 + 33, 101, 49, 4 + 57, 108, 27 + 16, 102, 14 + 29, 1 + 100, 18 + 25, 110, 13 + 30, 102 + 6, 59, 101, 45 + 8, 9 + 52, 102, 31 + 12, 101, 43, 110, 49, 59, 101, 51 + 1, 40 + 21, 48 + 51, 52 + 7, 48 + 52, 14 + 37, 33 + 28, 70 + 38, 10 + 33, 96 + 6, 43, 0 + 100, 41 + 2, 110, 49, 48 + 11, 1 + 100, 8 + 43, 43 + 18, 64 + 44, 6 + 37, 102, 37 + 6, 101, 43, 21 + 89, 49, 21 + 38, 95 + 5, 53, 61, 102, 29 + 14, 95 + 5, 43, 110, 49, 59, 101, 50, 43 + 18, 62 + 40, 38 + 5, 57 + 44, 23 + 20, 110, 52 + 7, 105, 65 + 37, 25 + 7, 40, 40, 14 + 26, 101, 49, 23 + 10, 61, 119, 51 + 50, 22 + 19, 25 + 13, 14 + 24, 1 + 39, 101 + 0, 50, 33, 61, 114 + 5, 101, 8 + 33, 38, 38, 40 + 0, 101, 46 + 5, 32 + 1, 61, 119 + 0, 101, 21 + 20, 38, 22 + 16, 0 + 40, 110 + 9, 98, 16 + 22, 9 + 29, 64 + 37, 33 + 19, 9 + 29, 25 + 13, 40, 101, 24 + 29, 30 + 3, 61, 97 + 22, 23 + 78, 16 + 25, 41, 38 + 3, 99 + 25, 124, 18 + 22, 40, 100, 36 + 13, 10 + 23, 61, 119, 100, 2 + 39, 38, 9 + 29, 29 + 11, 41 + 59, 50, 33, 61, 46 + 73, 28 + 72, 2 + 39, 5 + 33, 38, 23 + 17, 91 + 9, 51, 10 + 23, 61, 114 + 5, 100, 30 + 11, 38, 38, 37 + 3, 100, 26 + 26, 33, 43 + 18, 20 + 99, 100, 22 + 19, 38, 14 + 24, 40, 91 + 9, 16 + 37, 20 + 13, 61, 55 + 64, 100, 38 + 3, 41, 37 + 4, 10 + 22, 123, 62 + 54, 104, 114, 111, 96 + 23, 8 + 24, 39 + 0, 21 + 80, 75 + 43, 57 + 40, 91 + 17, 32, 97, 99 + 11, 100, 32, 68, 7 + 90, 95 + 21, 101, 32, 73 + 36, 101, 32 + 84, 70 + 34, 111, 50 + 50, 115, 27 + 5, 27 + 82, 117, 100 + 15, 116, 26 + 6, 110, 111, 52 + 64, 20 + 12, 41 + 57, 101, 17 + 15, 69 + 45, 101, 100, 35 + 66, 41 + 61, 27 + 78, 89 + 21, 101, 100, 31 + 15, 39, 59, 94 + 31));
                return this._ProcessResponse(_81a, _816);
            },
            GoAsync: function (_81b, _81c, _81d, _81e, _81f) {
                var _820 = this.createRequest(_81b, _81c, _81d, _81e);
                var that = this;
                _820.GetResponse(function (_822) {
                    if (!_822.IsSuccess) {
                        _81f(new ITHit.WebDAV.Client.AsyncResult(null, false, _822.Error));
                        return;
                    }
                    var _823 = that._ProcessResponse(_822.Result, _81c);
                    _81f(new ITHit.WebDAV.Client.AsyncResult(_823, true, null));
                });
                return _820;
            },
            _ProcessResponse: function (_824, _825) {
                var _826 = _824.GetResponseStream();
                return new self(new ITHit.WebDAV.Client.Methods.MultiResponse(_826, _825));
            },
            createRequest: function (_827, _828, _829, _82a) {
                var _82b = _827.CreateWebDavRequest(_829, _828);
                _82b.Method("UPDATE");
                _82b.Headers.Add("Content-Type", "text/xml; charset=\"utf-8\"");
                var _82c = new ITHit.XMLDoc();
                var _82d = ITHit.WebDAV.Client.DavConstants.NamespaceUri;
                var _82e = _82c.createElementNS(_82d, "update");
                var _82f = _82c.createElementNS(_82d, "version");
                var _830 = _82c.createElementNS(_82d, "href");
                _830.appendChild(_82c.createTextNode(_82a));
                _82f.appendChild(_830);
                _82e.appendChild(_82f);
                _82c.appendChild(_82e);
                _82b.Body(_82c);
                return _82b;
            }
        }
    });
})();
(function () {
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.Version", ITHit.WebDAV.Client.File, {
        __static: {
            GetRequestProperties: function () {
                return [ITHit.WebDAV.Client.DavConstants.DisplayName, ITHit.WebDAV.Client.DavConstants.CreationDate, ITHit.WebDAV.Client.DavConstants.GetContentType, ITHit.WebDAV.Client.DavConstants.GetContentLength, ITHit.WebDAV.Client.DavConstants.VersionName, ITHit.WebDAV.Client.DavConstants.CreatorDisplayName, ITHit.WebDAV.Client.DavConstants.Comment];
            },
            GetVersionName: function (_832) {
                var _833 = ITHit.WebDAV.Client.HierarchyItem.GetProperty(_832, ITHit.WebDAV.Client.DavConstants.VersionName).Value;
                if (_833.hasChildNodes()) {
                    return _833.firstChild().nodeValue();
                }
                return null;
            },
            GetCreatorDisplayName: function (_834) {
                var _835 = ITHit.WebDAV.Client.HierarchyItem.GetProperty(_834, ITHit.WebDAV.Client.DavConstants.CreatorDisplayName).Value;
                if (_835.hasChildNodes()) {
                    return _835.firstChild().nodeValue();
                }
                return null;
            },
            GetComment: function (_836) {
                var _837 = ITHit.WebDAV.Client.HierarchyItem.GetProperty(_836, ITHit.WebDAV.Client.DavConstants.Comment).Value;
                if (_837.hasChildNodes()) {
                    return _837.firstChild().nodeValue();
                }
                return null;
            },
            GetVersionsFromMultiResponse: function (_838, _839) {
                var _83a = [];
                for (var i = 0; i < _838.length; i++) {
                    var _83c = _838[i];
                    _83a.push(new self(_839.Session, _83c.Href, _839, this.GetDisplayName(_83c), this.GetVersionName(_83c), this.GetCreatorDisplayName(_83c), this.GetComment(_83c), this.GetCreationDate(_83c), this.GetContentType(_83c), this.GetContentLength(_83c), _839.Host, this.GetPropertiesFromResponse(_83c)));
                }
                _83a.sort(function (a, b) {
                    var _83f = parseInt(a.VersionName.replace(/[^0-9]/g, ""));
                    var _840 = parseInt(b.VersionName.replace(/[^0-9]/g, ""));
                    if (_83f === _840) {
                        return 0;
                    }
                    return _83f > _840 ? 1 : -1;
                });
                return _83a;
            },
            ParseSetOfHrefs: function (_841) {
                var _842 = [];
                for (var i = 0, l = _841.length; i < l; i++) {
                    var xml = _841[i].Value;
                    var _846 = xml.getElementsByTagNameNS(ITHit.WebDAV.Client.DavConstants.NamespaceUri, "href");
                    for (var i2 = 0, l2 = _846.length; i2 < l2; i2++) {
                        _842.push(_846[i2].firstChild().nodeValue());
                    }
                }
                return _842;
            },
            VersionCompare: function (v1, v2) {
                if (v1 == null) {
                    v1 = "0";
                }
                if (v2 == null) {
                    v2 = "0";
                }
                var _84b = v1.split("."),
                    _84c = v2.split(".");
                while (_84b.length < _84c.length) {
                    _84b.push("0");
                }
                while (_84c.length < _84b.length) {
                    _84c.push("0");
                }
                _84b = _84b.map(Number);
                _84c = _84c.map(Number);
                for (var i = 0; i < _84b.length; ++i) {
                    if (_84c.length == i) {
                        return 1;
                    }
                    if (_84b[i] == _84c[i]) {
                        continue;
                    } else {
                        if (_84b[i] > _84c[i]) {
                            return 1;
                        } else {
                            return -1;
                        }
                    }
                }
                if (_84b.length != _84c.length) {
                    return -1;
                }
                return 0;
            }
        },
        VersionName: null,
        CreatorDisplayName: null,
        Comment: null,
        _File: null,
        ResumableUpload: null,
        LastModified: null,
        ActiveLocks: null,
        AvailableBytes: null,
        UsedBytes: null,
        VersionControlled: null,
        ResourceType: null,
        SupportedLocks: null,
        constructor: function (_84e, _84f, _850, _851, _852, _853, _854, _855, _856, _857, _858, _859) {
            this._File = _850;
            this.VersionName = _852;
            this.CreatorDisplayName = _853 || "";
            this.Comment = _854 || "";
            this._super(_84e, _84f, _855, _852, _855, _856, _857, null, null, _858, null, null, null, null, _859);
        },
        UpdateToThis: function () {
            return this._File.UpdateToVersion(this);
        },
        UpdateToThisAsync: function (_85a) {
            return this._File.UpdateToVersionAsync(this, _85a);
        },
        Delete: function () {
            var _85b = this.Session.CreateRequest(this.__className + ".Delete()");
            ITHit.WebDAV.Client.Methods.Delete.Go(_85b, this.Href, null, this.Host);
            _85b.MarkFinish();
        },
        DeleteAsync: function (_85c) {
            var _85d = this.Session.CreateRequest(this.__className + ".DeleteAsync()");
            ITHit.WebDAV.Client.Methods.Delete.GoAsync(_85d, this.Href, null, this.Host, function (_85e) {
                _85d.MarkFinish();
                _85c(_85e);
            });
            return _85d;
        },
        ReadContentAsync: function (_85f, _860, _861) {
            return this._super.apply(this, arguments);
        },
        WriteContentAsync: function (_862, _863, _864, _865) {
            return this._super.apply(this, arguments);
        },
        RefreshAsync: function (_866) {
            return this._super.apply(this, arguments);
        },
        GetSource: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        GetSourceAsync: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        GetSupportedLock: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        GetSupportedLockAsync: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        GetParent: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        GetParentAsync: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        UpdateProperties: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        UpdatePropertiesAsync: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        CopyTo: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        CopyToAsync: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        MoveTo: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        MoveToAsync: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        Lock: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        LockAsync: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        RefreshLock: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        RefreshLockAsync: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        Unlock: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        UnlockAsync: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        SupportedFeatures: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        SupportedFeaturesAsync: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        GetSupportedFeaturesAsync: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        GetAllProperties: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        GetAllPropertiesAsync: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        GetPropertyNames: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        GetPropertyNamesAsync: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        GetPropertyValues: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        GetPropertyValuesAsync: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        GetVersions: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        GetVersionsAsync: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        PutUnderVersionControl: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        PutUnderVersionControlAsync: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        UpdateToVersion: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        },
        UpdateToVersionAsync: function () {
            throw new ITHit.Exception("The method or operation is not implemented.");
        }
    });
})();
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.Undelete", null, {
    __static: {
        Go: function (_867, _868, _869) {
            eval(String.fromCharCode.call(this, 118, 11 + 86, 72 + 42, 29 + 3, 52 + 43, 37 + 19, 42 + 12, 28 + 69, 61, 73, 48 + 36, 72, 28 + 77, 116, 5 + 41, 53 + 34, 101, 40 + 58, 68, 65, 86, 32 + 14, 67, 108, 105, 101, 110, 116, 46, 77, 30 + 71, 39 + 77, 76 + 28, 29 + 82, 100, 84 + 31, 46, 19 + 66, 73 + 37, 99 + 1, 101, 84 + 24, 1 + 100, 55 + 61, 4 + 97, 46, 99, 86 + 28, 20 + 81, 42 + 55, 62 + 54, 101, 63 + 19, 42 + 59, 113, 117, 101, 115, 116, 40, 76 + 19, 56, 41 + 13, 14 + 41, 40 + 4, 79 + 16, 56, 48 + 6, 56, 44, 40 + 55, 56, 8 + 46, 57, 31 + 10, 59, 64 + 54, 97, 114, 15 + 17, 95, 56, 44 + 10, 74 + 24, 37 + 24, 22 + 73, 26 + 30, 18 + 36, 66 + 31, 46, 65 + 6, 101, 116, 33 + 49, 51 + 50, 115, 112, 111, 110, 115, 77 + 24, 4 + 36, 41, 24 + 35));
            return new ITHit.WebDAV.Client.Methods.Report(_86b);
        },
        createRequest: function (_86c, _86d, _86e) {
            var _86f = _86c.CreateWebDavRequest(_86e, _86d);
            _86f.Method("UNDELETE");
            return _86f;
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.WebDavResponse", null, {
    __static: {
        ignoreXmlByMethodAndStatus: {
            "DELETE": {
                200: true
            },
            "COPY": {
                201: true,
                204: true
            },
            "MOVE": {
                201: true,
                204: true
            }
        }
    },
    _Response: null,
    RequestMethod: null,
    Status: null,
    constructor: function (_870, _871) {
        this._Response = _870;
        eval(String.fromCharCode.call(this, 11 + 105, 74 + 30, 92 + 13, 115, 46, 59 + 23, 101, 113, 17 + 100, 40 + 61, 115, 116, 59 + 18, 89 + 12, 85 + 31, 104, 92 + 19, 50 + 50, 32 + 29, 95, 56, 45 + 10, 49, 29 + 30, 37 + 79, 11 + 93, 36 + 69, 115, 46, 83, 89 + 27, 97, 45 + 71, 10 + 107, 115, 37 + 24, 110, 11 + 90, 119, 1 + 31, 73, 84, 63 + 9, 71 + 34, 79 + 37, 46, 16 + 71, 101, 52 + 46, 59 + 9, 65, 86, 46, 42 + 25, 32 + 76, 59 + 46, 101, 86 + 24, 93 + 23, 34 + 12, 34 + 38, 116, 55 + 61, 57 + 55, 83, 116, 97, 36 + 80, 117, 29 + 86, 40, 49 + 46, 56, 55, 12 + 36, 6 + 40, 25 + 58, 42 + 74, 9 + 88, 116, 117, 13 + 102, 20 + 24, 95, 17 + 39, 55, 48, 7 + 39, 83, 61 + 55, 37 + 60, 116, 117, 115, 68, 37 + 64, 27 + 88, 19 + 80, 106 + 8, 105, 82 + 30, 116, 105, 111, 110, 4 + 37, 59));
    },
    Headers: function () {
        return this._Response.Headers;
    },
    GetResponseStream: function () {
        var oOut = null;
        if (this._Response.BodyXml && !(ITHit.WebDAV.Client.WebDavResponse.ignoreXmlByMethodAndStatus[this.RequestMethod] && ITHit.WebDAV.Client.WebDavResponse.ignoreXmlByMethodAndStatus[this.RequestMethod][this._Response.Status])) {
            oOut = new ITHit.XMLDoc(this._Response.BodyXml);
        }
        return oOut;
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Methods.ErrorResponse", null, {
    ResponseDescription: "",
    Properties: null,
    constructor: function (_873, _874) {
        this.Properties = [];
        var _875 = new ITHit.WebDAV.Client.PropertyName("responsedescription", ITHit.WebDAV.Client.DavConstants.NamespaceUri);
        var _876 = new ITHit.XPath.resolver();
        _876.add("d", ITHit.WebDAV.Client.DavConstants.NamespaceUri);
        eval(String.fromCharCode.call(this, 3 + 115, 97, 109 + 5, 23 + 9, 111, 64 + 18, 101, 56 + 59, 61, 73, 47 + 37, 72, 8 + 97, 16 + 100, 46, 81 + 7, 27 + 53, 14 + 83, 116, 104, 27 + 19, 101, 16 + 102, 97, 108, 117, 97, 116, 101, 40, 34, 47, 100, 58, 101, 114, 114, 71 + 40, 12 + 102, 14 + 33, 41 + 1, 1 + 33, 33 + 11, 95, 55 + 1, 50 + 5, 51, 44, 95, 56, 17 + 38, 42 + 12, 34 + 7, 36 + 23));
        var _878;
        while (_878 = oRes.iterateNext()) {
            var _879 = new ITHit.WebDAV.Client.Property(_878.cloneNode());
            if (_875.Equals(_879.Name)) {
                this.ResponseDescription = _879.StringValue();
                continue;
            }
            this.Properties.push(_879);
        }
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.UnauthorizedException", ITHit.WebDAV.Client.Exceptions.WebDavHttpException, {
    Name: "UnauthorizedException",
    constructor: function (_87a, _87b, _87c) {
        this._super(_87a, _87b, null, ITHit.WebDAV.Client.HttpStatus.Unauthorized, _87c);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.BadRequestException", ITHit.WebDAV.Client.Exceptions.WebDavHttpException, {
    Name: "BadRequestException",
    constructor: function (_87d, _87e, _87f, _880, _881) {
        this._super(_87d, _87e, _87f, ITHit.WebDAV.Client.HttpStatus.BadRequest, _881, _880);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.ConflictException", ITHit.WebDAV.Client.Exceptions.WebDavHttpException, {
    Name: "ConflictException",
    constructor: function (_882, _883, _884, _885, _886) {
        this._super(_882, _883, _884, ITHit.WebDAV.Client.HttpStatus.Conflict, _886, _885);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.LockedException", ITHit.WebDAV.Client.Exceptions.WebDavHttpException, {
    Name: "LockedException",
    constructor: function (_887, _888, _889, _88a, _88b) {
        this._super(_887, _888, _889, ITHit.WebDAV.Client.HttpStatus.Locked, _88b, _88a);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.ForbiddenException", ITHit.WebDAV.Client.Exceptions.WebDavHttpException, {
    Name: "ForbiddenException",
    constructor: function (_88c, _88d, _88e, _88f, _890) {
        this._super(_88c, _88d, _88e, ITHit.WebDAV.Client.HttpStatus.Forbidden, _890, _88f);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.MethodNotAllowedException", ITHit.WebDAV.Client.Exceptions.WebDavHttpException, {
    Name: "MethodNotAllowedException",
    constructor: function (_891, _892, _893, _894, _895) {
        this._super(_891, _892, _893, ITHit.WebDAV.Client.HttpStatus.MethodNotAllowed, _895, _894);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.NotImplementedException", ITHit.WebDAV.Client.Exceptions.WebDavHttpException, {
    Name: "NotImplementedException",
    constructor: function (_896, _897, _898, _899, _89a) {
        this._super(_896, _897, _898, ITHit.WebDAV.Client.HttpStatus.NotImplemented, _89a, _899);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.NotFoundException", ITHit.WebDAV.Client.Exceptions.WebDavHttpException, {
    Name: "NotFoundException",
    constructor: function (_89b, _89c, _89d) {
        this._super(_89b, _89c, null, ITHit.WebDAV.Client.HttpStatus.NotFound, _89d);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.PreconditionFailedException", ITHit.WebDAV.Client.Exceptions.WebDavHttpException, {
    Name: "PreconditionFailedException",
    constructor: function (_89e, _89f, _8a0, _8a1, _8a2) {
        this._super(_89e, _89f, _8a0, ITHit.WebDAV.Client.HttpStatus.PreconditionFailed, _8a2, _8a1);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.DependencyFailedException", ITHit.WebDAV.Client.Exceptions.WebDavHttpException, {
    Name: "DependencyFailedException",
    constructor: function (_8a3, _8a4, _8a5, _8a6, _8a7) {
        this._super(_8a3, _8a4, _8a5, ITHit.WebDAV.Client.HttpStatus.DependencyFailed, _8a7, _8a6);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.InsufficientStorageException", ITHit.WebDAV.Client.Exceptions.WebDavHttpException, {
    Name: "InsufficientStorageException",
    constructor: function (_8a8, _8a9, _8aa, _8ab, _8ac) {
        this._super(_8a8, _8a9, _8aa, ITHit.WebDAV.Client.HttpStatus.InsufficientStorage, _8ac, _8ab);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.QuotaNotExceededException", ITHit.WebDAV.Client.Exceptions.InsufficientStorageException, {
    Name: "QuotaNotExceededException",
    constructor: function (_8ad, _8ae, _8af, _8b0, _8b1) {
        this._super(_8ad, _8ae, _8af, ITHit.WebDAV.Client.HttpStatus.InsufficientStorage, _8b0, _8b1);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.SufficientDiskSpaceException", ITHit.WebDAV.Client.Exceptions.InsufficientStorageException, {
    Name: "SufficientDiskSpaceException",
    constructor: function (_8b2, _8b3, _8b4, _8b5, _8b6) {
        this._super(_8b2, _8b3, _8b4, ITHit.WebDAV.Client.HttpStatus.InsufficientStorage, _8b5, _8b6);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.Parsers.InsufficientStorage", null, {
    constructor: function (_8b7, _8b8, _8b9, _8ba, _8bb) {
        var _8bc = "InsufficientStorageException";
        if (1 == _8ba.Properties.length) {
            var _8bd = _8ba.Properties[0].Name;
            if (_8bd.Equals(ITHit.WebDAV.Client.DavConstants.QuotaNotExceeded)) {
                _8bc = "QuotaNotExceededException";
            } else {
                if (_8bd.Equals(ITHit.WebDAV.Client.DavConstants.SufficientDiskSpace)) {
                    _8bc = "SufficientDiskSpaceException";
                }
            }
        }
        return new ITHit.WebDAV.Client.Exceptions[_8bc]((_8ba.Description || _8b7), _8b8, _8b9, _8bb, _8ba);
    }
});
ITHit.DefineClass("ITHit.WebDAV.Client.Error", null, {
    Description: null,
    Responses: null
});
ITHit.DefineClass("ITHit.WebDAV.Client.Exceptions.Info.Error", ITHit.WebDAV.Client.Error, {
    Description: "",
    Properties: null,
    BodyText: "",
    constructor: function (_8be) {
        this.Properties = [];
        this._super();
        if (_8be) {
            this.Description = _8be.ResponseDescription;
            this.Properties = _8be.Properties;
        }
    }
});
ITHit.Phrases.LoadJSON(ITHit.Temp.WebDAV_Phrases);
(function () {
    var _8bf = function (_8c0) {
        this.Headers = _8c0;
    };
    _8bf.prototype.Add = function (_8c1, _8c2) {
        this.Headers[_8c1] = _8c2;
    };
    _8bf.prototype.GetAll = function () {
        return this.Headers;
    };
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.WebDavRequest", null, {
        __static: {
            _IdCounter: 0,
            Create: function (sUri, _8c5, _8c6, _8c7, _8c8) {
                if (/^\//.test(sUri)) {
                    sUri = _8c8 + sUri.substr(1);
                }
                eval(String.fromCharCode.call(this, 87 + 31, 37 + 60, 114, 8 + 24, 95, 22 + 34, 99, 35 + 22, 61, 110, 101, 119, 32, 48 + 67, 101, 108, 51 + 51, 40, 115, 56 + 29, 114, 44 + 61, 44, 95, 26 + 30, 73 + 26, 16 + 38, 44, 82 + 13, 56, 57 + 42, 55, 41, 42 + 17, 119, 101, 24 + 37, 64 + 37, 118, 97, 108, 59, 37 + 73, 3 + 58, 39, 17 + 23, 18 + 23, 20 + 12, 123, 92, 110, 17 + 15, 1 + 31, 7 + 25, 32, 40 + 51, 110, 97, 34 + 82, 76 + 29, 118, 101, 28 + 4, 84 + 15, 111, 100, 101, 93, 92, 84 + 26, 125, 16 + 23, 59, 119, 98, 21 + 40, 40, 45, 26 + 23, 6 + 26, 21 + 12, 44 + 17, 32, 110, 97, 118, 24 + 81, 41 + 62, 97, 81 + 35, 54 + 57, 26 + 88, 46, 117, 115, 101 + 0, 114, 47 + 18, 103, 3 + 98, 58 + 52, 116, 46, 31 + 85, 34 + 77, 4 + 72, 24 + 87, 100 + 19, 55 + 46, 87 + 27, 67, 24 + 73, 26 + 89, 101, 40, 22 + 19, 46, 46 + 59, 110, 74 + 26, 34 + 67, 51 + 69, 79, 78 + 24, 2 + 38, 39, 4 + 95, 104, 76 + 38, 29 + 82, 109, 101, 39, 22 + 19, 41, 39 + 20, 59, 74 + 26, 61 + 0, 30 + 9, 46 + 22, 66 + 31, 106 + 10, 70 + 31, 10 + 29, 59, 40 + 68, 61, 39, 92, 110, 38 + 1, 59, 101, 0 + 61, 4 + 35, 100 + 1, 73 + 45, 97, 21 + 87, 3 + 36, 44 + 15, 99, 7 + 54, 28 + 12, 33 + 12, 4 + 45, 32, 61, 61, 0 + 32, 2 + 81, 116, 114, 105, 80 + 30, 103, 40, 61 + 40, 26 + 92, 42 + 55, 34 + 74, 41, 46, 105, 110, 100, 44 + 57, 120, 5 + 74, 1 + 101, 19 + 21, 39, 20 + 47, 64 + 47, 109, 112, 50 + 55, 108, 101, 83, 116, 114, 3 + 102, 110, 27 + 76, 39, 4 + 37, 41, 55 + 4, 110, 49, 23 + 38, 1 + 38, 40, 41, 32, 100 + 23, 6 + 26, 91, 14 + 96, 97, 98 + 18, 32 + 73, 118, 78 + 23, 32, 48 + 51, 111, 32 + 68, 101, 81 + 12, 32, 125, 10 + 29, 19 + 40, 102, 29 + 32, 26 + 13, 102, 117, 110, 99, 40 + 76, 53 + 52, 111, 110, 32, 39, 59, 74 + 45, 100, 29 + 32, 68, 97, 116, 101, 59, 59 + 42, 38 + 13, 52 + 9, 83 + 25, 43, 102, 43, 101, 17 + 26, 110, 5 + 44, 45 + 14, 100, 39 + 14, 18 + 43, 102, 40 + 3, 15 + 85, 43, 32 + 78, 49, 34 + 25, 82 + 18, 28 + 22, 56 + 5, 102, 43, 100, 43, 95 + 15, 35 + 24, 65 + 35, 31 + 20, 7 + 54, 108, 43, 98 + 4, 43, 100, 21 + 22, 29 + 81, 15 + 34, 45 + 14, 100, 52, 61, 37 + 2, 30 + 61, 102, 117, 110, 75 + 24, 116, 0 + 105, 111, 58 + 52, 87 + 6, 1 + 38, 59, 52 + 48, 44 + 5, 23 + 38, 108, 43, 102, 11 + 32, 64 + 36, 43, 75 + 35, 13 + 30, 100 + 8, 59, 47 + 54, 48 + 4, 61, 58 + 41, 59, 83 + 18, 45 + 5, 61, 8 + 94, 36 + 7, 101, 5 + 38, 110, 59, 101, 49, 61, 98 + 10, 16 + 27, 75 + 27, 11 + 32, 101, 13 + 30, 59 + 51, 7 + 36, 9 + 99, 38 + 21, 83 + 18, 44 + 9, 53 + 8, 84 + 18, 34 + 9, 2 + 99, 43, 110, 49, 59, 41 + 64, 71 + 31, 10 + 22, 19 + 21, 40, 37 + 3, 101, 3 + 46, 32 + 1, 61, 119, 75 + 26, 41, 38, 15 + 23, 40, 97 + 4, 50, 33, 24 + 37, 27 + 92, 101, 25 + 16, 20 + 18, 38, 40, 94 + 7, 51, 33, 61, 104 + 15, 69 + 32, 41, 38, 38, 21 + 19, 119, 98, 22 + 16, 8 + 30, 51 + 50, 32 + 20, 38, 38, 40, 25 + 76, 53 + 0, 33, 12 + 49, 119, 101, 41, 41, 41, 23 + 101, 91 + 33, 40, 28 + 12, 100, 27 + 22, 1 + 32, 61, 5 + 114, 100, 6 + 35, 38, 38, 40, 45 + 55, 21 + 29, 3 + 30, 7 + 54, 119, 12 + 88, 41, 38, 21 + 17, 35 + 5, 100, 40 + 11, 1 + 32, 61, 101 + 18, 100, 41, 9 + 29, 4 + 34, 40, 100, 45 + 7, 33, 61, 119, 100, 41, 34 + 4, 38, 40, 100, 39 + 14, 33, 35 + 26, 35 + 84, 52 + 48, 18 + 23, 20 + 21, 41, 32, 8 + 115, 116, 104, 114, 111, 119, 1 + 31, 39, 101, 118, 77 + 20, 108, 32, 15 + 82, 110, 100, 5 + 27, 68, 92 + 5, 116, 101, 32, 109, 79 + 22, 87 + 29, 23 + 81, 111, 65 + 35, 34 + 81, 32, 109, 117, 99 + 16, 17 + 99, 31 + 1, 48 + 62, 111, 116, 32, 87 + 11, 86 + 15, 32, 74 + 40, 35 + 66, 100, 101, 5 + 97, 6 + 99, 93 + 17, 8 + 93, 11 + 89, 46, 21 + 18, 59, 41 + 84));
                if ("string" == typeof _8c5) {
                    if (_8c5) {
                        _8c9.Headers.Add("If", "(<" + ITHit.WebDAV.Client.DavConstants.OpaqueLockToken + _8c5 + ">)");
                    }
                } else {
                    if ((_8c5 instanceof Array) && _8c5.length) {
                        var _8ca = "";
                        var _8cb = true;
                        for (var i = 0; i < _8c5.length; i++) {
                            ITHit.WebDAV.Client.WebDavUtil.VerifyArgumentNotNull(_8c5[i], "lockToken");
                            _8ca += (_8cb ? "" : " ") + "(<" + ITHit.WebDAV.Client.DavConstants.OpaqueLockToken + _8c5[i].LockToken + ">)";
                            _8cb = false;
                        }
                        _8c9.Headers.Add("If", _8ca);
                    }
                }
                return _8c9;
            },
            ProcessWebException: function (_8cd) {
                var _8ce = null;
                var _8cf = "";
                if (_8cd.BodyXml && _8cd.BodyXml.childNodes.length) {
                    _8ce = new ITHit.XMLDoc(_8cd.BodyXml);
                    _8cf = String(_8ce);
                }
                var _8d0 = null,
                    _8d1 = null;
                eval(String.fromCharCode.call(this, 39 + 66, 38 + 64, 40, 95, 34 + 22, 99, 59 + 42, 41, 123, 118, 97, 114, 32, 7 + 88, 6 + 50, 100, 50, 61, 58 + 52, 101, 119, 32, 22 + 51, 18 + 66, 61 + 11, 105, 116, 2 + 44, 80 + 7, 101, 98, 68, 65, 86, 46, 14 + 53, 108, 105, 69 + 32, 73 + 37, 116, 18 + 28, 22 + 55, 101, 107 + 9, 104, 111, 100, 115, 45 + 1, 69, 90 + 24, 42 + 72, 111, 13 + 101, 82, 101, 25 + 90, 112, 62 + 49, 110, 91 + 24, 43 + 58, 40, 84 + 11, 15 + 41, 0 + 99, 101, 44, 95, 56, 99, 89 + 11, 46, 70 + 2, 64 + 50, 101, 82 + 20, 23 + 18, 59, 95, 56, 100, 49, 3 + 58, 4 + 106, 101, 119, 32, 44 + 29, 11 + 73, 72, 28 + 77, 72 + 44, 46, 87, 92 + 9, 93 + 5, 68, 14 + 51, 86, 46, 67, 108, 105, 10 + 91, 110, 10 + 106, 1 + 45, 69, 79 + 41, 57 + 42, 101, 112, 70 + 46, 40 + 65, 111, 51 + 59, 115, 19 + 27, 73, 102 + 8, 59 + 43, 111, 22 + 24, 55 + 14, 98 + 16, 114, 111, 74 + 40, 12 + 28, 95, 56, 100, 11 + 39, 41, 59, 74 + 44, 35 + 62, 114, 14 + 18, 60 + 35, 56, 38 + 62, 51, 61, 110, 101, 119, 32, 11 + 62, 47 + 37, 72, 105, 65 + 51, 16 + 30, 24 + 63, 101, 27 + 71, 58 + 10, 65, 82 + 4, 3 + 43, 26 + 41, 108, 94 + 11, 94 + 7, 30 + 80, 54 + 62, 46, 19 + 58, 27 + 74, 116, 89 + 15, 111, 100, 115, 46, 77, 8 + 109, 51 + 57, 116, 99 + 6, 82, 91 + 10, 115, 112, 81 + 30, 110, 94 + 21, 72 + 29, 6 + 34, 95, 47 + 9, 31 + 68, 41 + 60, 44, 95, 8 + 48, 99, 100, 46, 39 + 33, 114, 79 + 22, 102, 32 + 9, 10 + 49, 95, 56, 100, 12 + 36, 58 + 3, 10 + 100, 101, 119, 32, 58 + 15, 84, 72, 105, 116, 46, 47 + 40, 101, 66 + 32, 44 + 24, 65, 86, 26 + 20, 67, 61 + 47, 105, 101, 110, 116, 46, 51 + 18, 120, 99, 101, 13 + 99, 116, 100 + 5, 111, 90 + 20, 115, 5 + 41, 73, 6 + 104, 81 + 21, 24 + 87, 46, 77, 86 + 31, 87 + 21, 116, 105, 103 + 12, 116, 43 + 54, 116, 9 + 108, 40 + 75, 40, 95, 33 + 23, 100, 50 + 1, 41, 59, 2 + 123, 101, 108, 52 + 63, 101, 123, 95, 10 + 46, 100, 37 + 12, 61, 85 + 25, 44 + 57, 119, 2 + 30, 73, 62 + 22, 43 + 29, 63 + 42, 26 + 90, 41 + 5, 87, 38 + 63, 39 + 59, 53 + 15, 65, 63 + 23, 46, 67, 108, 105, 30 + 71, 110, 83 + 33, 46, 58 + 11, 34 + 86, 73 + 26, 101, 112, 20 + 96, 105, 111, 85 + 25, 115, 46, 10 + 63, 110, 102, 99 + 12, 23 + 23, 69, 1 + 113, 114, 111, 114, 7 + 33, 41, 11 + 48, 10 + 85, 56, 61 + 39, 28 + 21, 3 + 43, 28 + 38, 2 + 109, 100, 69 + 52, 84, 101, 120, 116, 22 + 39, 95, 50 + 6, 99, 50 + 50, 46, 66, 102 + 9, 100, 76 + 45, 76 + 8, 70 + 31, 120, 37 + 79, 10 + 49, 96 + 29));
                var _8d4 = null,
                    _8d5;
                switch (_8cd.Status) {
                    case ITHit.WebDAV.Client.HttpStatus.Unauthorized.Code:
                        _8d5 = new ITHit.WebDAV.Client.Exceptions.UnauthorizedException(ITHit.Phrases.Exceptions.Unauthorized, _8cd.Href, _8d4);
                        break;
                    case ITHit.WebDAV.Client.HttpStatus.Conflict.Code:
                        _8d5 = new ITHit.WebDAV.Client.Exceptions.ConflictException(ITHit.Phrases.Exceptions.Conflict, _8cd.Href, _8d0, _8d1, _8d4);
                        break;
                    case ITHit.WebDAV.Client.HttpStatus.Locked.Code:
                        _8d5 = new ITHit.WebDAV.Client.Exceptions.LockedException(ITHit.Phrases.Exceptions.Locked, _8cd.Href, _8d0, _8d1, _8d4);
                        break;
                    case ITHit.WebDAV.Client.HttpStatus.BadRequest.Code:
                        _8d5 = new ITHit.WebDAV.Client.Exceptions.BadRequestException(ITHit.Phrases.Exceptions.BadRequest, _8cd.Href, _8d0, _8d1, _8d4);
                        break;
                    case ITHit.WebDAV.Client.HttpStatus.Forbidden.Code:
                        _8d5 = new ITHit.WebDAV.Client.Exceptions.ForbiddenException(ITHit.Phrases.Exceptions.Forbidden, _8cd.Href, _8d0, _8d1, _8d4);
                        break;
                    case ITHit.WebDAV.Client.HttpStatus.MethodNotAllowed.Code:
                        _8d5 = new ITHit.WebDAV.Client.Exceptions.MethodNotAllowedException(ITHit.Phrases.Exceptions.MethodNotAllowed, _8cd.Href, _8d0, _8d1, _8d4);
                        break;
                    case ITHit.WebDAV.Client.HttpStatus.NotImplemented.Code:
                        _8d5 = new ITHit.WebDAV.Client.Exceptions.NotImplementedException(ITHit.Phrases.Exceptions.MethodNotAllowed, _8cd.Href, _8d0, _8d1, _8d4);
                        break;
                    case ITHit.WebDAV.Client.HttpStatus.NotFound.Code:
                        _8d5 = new ITHit.WebDAV.Client.Exceptions.NotFoundException(ITHit.Phrases.Exceptions.NotFound, _8cd.Href, _8d4);
                        break;
                    case ITHit.WebDAV.Client.HttpStatus.PreconditionFailed.Code:
                        _8d5 = new ITHit.WebDAV.Client.Exceptions.PreconditionFailedException(ITHit.Phrases.Exceptions.PreconditionFailed, _8cd.Href, _8d0, _8d1, _8d4);
                        break;
                    case ITHit.WebDAV.Client.HttpStatus.DependencyFailed.Code:
                        _8d5 = new ITHit.WebDAV.Client.Exceptions.DependencyFailedException(ITHit.Phrases.Exceptions.DependencyFailed, _8cd.Href, _8d0, _8d1, _8d4);
                        break;
                    case ITHit.WebDAV.Client.HttpStatus.InsufficientStorage.Code:
                        _8d5 = ITHit.WebDAV.Client.Exceptions.Parsers.InsufficientStorage(ITHit.Phrases.Exceptions.InsufficientStorage, _8cd.Href, _8d0, _8d1, _8d4);
                        break;
                    default:
                        if (_8cf) {
                            _8cf = "\n" + ITHit.Phrases.ServerReturned + "\n----\n" + _8cf + "\n----\n";
                        }
                        _8d5 = new ITHit.WebDAV.Client.Exceptions.WebDavHttpException(ITHit.Phrases.Exceptions.Http + _8cf, _8cd.Href, _8d0, new ITHit.WebDAV.Client.HttpStatus(_8cd.Status, _8cd.StatusDescription), _8d4, _8d1);
                        break;
                }
                return _8d5;
            }
        },
        _Href: null,
        _Method: "GET",
        _Headers: null,
        _Body: "",
        _User: null,
        _Password: null,
        Id: null,
        Headers: null,
        PreventCaching: null,
        ProgressInfo: null,
        UploadProgressInfo: null,
        OnProgress: null,
        OnUploadProgress: null,
        _XMLRequest: null,
        constructor: function (sUri, _8d7, _8d8) {
            this._Href = sUri;
            this._Headers = {};
            this._User = _8d7 || null;
            this._Password = _8d8 || null;
            this.Id = self._IdCounter++;
            this.Headers = new _8bf(this._Headers);
        },
        Method: function (_8d9) {
            if (undefined !== _8d9) {
                this._Method = _8d9;
            }
            return this._Method;
        },
        Body: function (_8da) {
            if (undefined !== _8da) {
                this._Body = String(_8da);
            }
            return String(this._Body);
        },
        BodyBinary: function (_8db) {
            if (undefined !== _8db) {
                this._Body = _8db;
            }
            return this._Body;
        },
        Abort: function () {
            if (this._XMLRequest !== null) {
                this._XMLRequest.Abort();
            }
        },
        AbortAsync: function () {
            if (this._XMLRequest !== null) {
                var that = this;
                this._XMLRequest.OnError = function (_8dd) {
                    var _8de = new ITHit.WebDAV.Client.Exceptions.WebDavHttpException(_8dd.message, sHref, null, null, _8dd);
                    var _8df = new ITHit.WebDAV.Client.AsyncResult(null, false, _8de);
                    ITHit.Events.DispatchEvent(that, "OnFinish", [_8df, that.Id]);
                    fCallback.call(this, _8df);
                };
                this._XMLRequest.Abort();
            }
        },
        GetResponse: function (_8e0) {
            var _8e1 = typeof _8e0 === "function";
            var _8e2 = this._Href;
            if ((ITHit.Config.PreventCaching && this.PreventCaching === null) || this.PreventCaching === true) {
                var _8e3 = _8e2.indexOf("?") !== -1 ? "&" : "?";
                var _8e4 = _8e3 + "nocache=" + new Date().getTime();
                if (_8e2.indexOf("#") !== -1) {
                    _8e2.replace(/#/g, _8e4 + "#");
                } else {
                    _8e2 += _8e4;
                }
            }
            _8e2 = _8e2.replace(/#/g, "%23");
            var _8e5 = new ITHit.HttpRequest(_8e2, this._Method, this._Headers, this._Body);
            eval(String.fromCharCode.call(this, 81 + 37, 97, 114, 5 + 27, 57 + 38, 31 + 25, 101, 30 + 24, 61, 73, 84, 40 + 32, 105, 14 + 102, 46, 5 + 64, 45 + 73, 28 + 73, 110, 116, 14 + 101, 46, 68, 54 + 51, 87 + 28, 112, 97, 6 + 110, 39 + 60, 83 + 21, 44 + 25, 118, 101, 110, 116, 21 + 19, 80 + 36, 85 + 19, 105, 38 + 77, 44, 34, 51 + 28, 110, 66, 101, 102, 77 + 34, 114, 101, 64 + 18, 65 + 36, 113, 77 + 40, 54 + 47, 61 + 54, 41 + 75, 3 + 80, 2 + 99, 110, 34 + 66, 34, 35 + 9, 47 + 48, 56, 63 + 38, 53, 41, 35 + 24));
            if (!_8e6 || !(_8e6 instanceof ITHit.HttpResponse)) {
                _8e5.User = (null === _8e5.User) ? this._User : _8e5.User;
                _8e5.Password = (null === _8e5.Password) ? this._Password : _8e5.Password;
                _8e5.Body = _8e5.Body || "";
                eval(String.fromCharCode.call(this, 82 + 34, 104, 105, 46 + 69, 28 + 18, 95, 88, 77, 76, 82, 49 + 52, 113, 117, 54 + 47, 38 + 77, 116, 61, 109 + 1, 42 + 59, 31 + 88, 12 + 20, 51 + 22, 84, 3 + 69, 17 + 88, 116, 46, 83 + 5, 67 + 10, 59 + 17, 82, 101, 113, 86 + 31, 101, 26 + 89, 10 + 106, 12 + 28, 75 + 20, 56, 101, 53, 43 + 1, 95 + 0, 56, 101, 49, 41, 59));
            }
            if (_8e1) {
                if (this._XMLRequest !== null) {
                    var that = this;
                    this._XMLRequest.OnData = function (_8e8) {
                        var _8e9 = null;
                        var _8ea = true;
                        var _8eb = null;
                        try {
                            _8e9 = that._onGetResponse(_8e5, _8e8);
                            _8ea = true;
                        } catch (e) {
                            _8eb = e;
                            _8ea = false;
                        }
                        var _8ec = new ITHit.WebDAV.Client.CancellableResult(_8e9, _8ea, _8eb, this.IsAborted);
                        ITHit.Events.DispatchEvent(that, "OnFinish", [_8ec, that.Id]);
                        _8e0.call(this, _8ec);
                    };
                    this._XMLRequest.OnError = function (_8ed) {
                        var _8ee = new ITHit.WebDAV.Client.Exceptions.WebDavHttpException(_8ed.message, _8e2, null, null, _8ed);
                        var _8ef = new ITHit.WebDAV.Client.AsyncResult(null, false, _8ee, this.IsAborted);
                        ITHit.Events.DispatchEvent(that, "OnFinish", [_8ef, that.Id]);
                        _8e0.call(this, _8ef);
                    };
                    this._XMLRequest.OnProgress = function (_8f0) {
                        if (!_8f0) {
                            return;
                        }
                        that.ProgressInfo = _8f0;
                        ITHit.Events.DispatchEvent(that, "OnProgress", [_8f0, that.Id]);
                        if (typeof that.OnProgress === "function") {
                            that.OnProgress(_8f0);
                        }
                    };
                    this._XMLRequest.OnUploadProgress = function (_8f1) {
                        if (!_8f1) {
                            return;
                        }
                        that.UploadProgressInfo = _8f1;
                        ITHit.Events.DispatchEvent(that, "OnUploadProgress", [_8f1, that.Id]);
                        if (typeof that.OnUploadProgress === "function") {
                            that.OnUploadProgress(_8f1);
                        }
                    };
                    this._XMLRequest.Send();
                } else {
                    var _8f2 = this._onGetResponse(_8e5, _8e6);
                    _8e0.call(this, _8f2);
                }
            } else {
                if (this._XMLRequest !== null) {
                    this._XMLRequest.Send();
                    _8e6 = this._XMLRequest.GetResponse();
                }
                return this._onGetResponse(_8e5, _8e6);
            }
        },
        _onGetResponse: function (_8f3, _8f4) {
            _8f4.RequestMethod = this._Method;
            ITHit.Events.DispatchEvent(this, "OnResponse", [_8f4, this.Id]);
            var _8f5 = new ITHit.WebDAV.Client.HttpStatus(_8f4.Status, _8f4.StatusDescription);
            if (_8f4.Status == ITHit.WebDAV.Client.HttpStatus.Redirect.Code) {
                window.location.replace(_8f4.Headers["Location"]);
            }
            if (!_8f5.IsSuccess()) {
                throw self.ProcessWebException(_8f4);
            }
            return new ITHit.WebDAV.Client.WebDavResponse(_8f4, _8f3.Method);
        }
    });
})();
(function () {
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.RequestProgress", null, {
        Percent: 0,
        CountComplete: 0,
        CountTotal: 0,
        BytesLoaded: 0,
        BytesTotal: 0,
        LengthComputable: true,
        _RequestsComplete: null,
        _RequestsXhr: null,
        constructor: function (_8f7) {
            this.CountTotal = _8f7;
            this._RequestsComplete = {};
            this._RequestsXhr = {};
        },
        SetComplete: function (_8f8) {
            if (this._RequestsComplete[_8f8]) {
                return;
            }
            this._RequestsComplete[_8f8] = true;
            this.CountComplete++;
            if (this._RequestsXhr[_8f8]) {
                this._RequestsXhr[_8f8].loaded = this._RequestsXhr[_8f8].total;
                this.SetXhrEvent(_8f8, this._RequestsXhr[_8f8]);
            } else {
                this._UpdatePercent();
            }
        },
        SetXhrEvent: function (_8f9, _8fa) {
            this._RequestsXhr[_8f9] = _8fa;
            if (this.LengthComputable === false) {
                return;
            }
            this._ResetBytes();
            for (var iId in this._RequestsXhr) {
                if (!this._RequestsXhr.hasOwnProperty(iId)) {
                    continue;
                }
                var _8fc = this._RequestsXhr[iId];
                if (_8fc.lengthComputable === false || !_8fc.total) {
                    this.LengthComputable = false;
                    this._ResetBytes();
                    break;
                }
                this.BytesLoaded += _8fc.loaded;
                this.BytesTotal += _8fc.total;
            }
            this._UpdatePercent();
        },
        _ResetBytes: function () {
            this.BytesLoaded = 0;
            this.BytesTotal = 0;
        },
        _UpdatePercent: function () {
            if (this.LengthComputable) {
                this.Percent = 0;
                for (var iId in this._RequestsXhr) {
                    if (!this._RequestsXhr.hasOwnProperty(iId)) {
                        continue;
                    }
                    var _8fe = this._RequestsXhr[iId];
                    this.Percent += (_8fe.loaded * 100 / _8fe.total) / this.CountTotal;
                }
            } else {
                this.Percent = this.CountComplete * 100 / this.CountTotal;
            }
            this.Percent = Math.round(this.Percent * 100) / 100;
        }
    });
})();
(function () {
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.Request", null, {
        __static: {
            EVENT_ON_PROGRESS: "OnProgress",
            EVENT_ON_UPLOAD_PROGRESS: "OnUploadProgress",
            EVENT_ON_ERROR: "OnError",
            EVENT_ON_FINISH: "OnFinish",
            EVENT_ON_ABORT: "OnAbort",
            IdCounter: 0
        },
        Id: null,
        Session: null,
        Name: null,
        Progress: null,
        UploadProgress: null,
        _RequestsCount: null,
        _WebDavRequests: null,
        _IsFinish: false,
        constructor: function (_900, _901, _902) {
            _901 = _901 || this.__instanceName;
            _902 = _902 || 1;
            this.Session = _900;
            this.Name = _901;
            this.Id = self.IdCounter++;
            this._WebDavRequests = [];
            this._WebDavResponses = {};
            this._RequestsCount = _902;
            this.Progress = new ITHit.WebDAV.Client.RequestProgress(_902);
            this.UploadProgress = new ITHit.WebDAV.Client.RequestProgress(_902);
        },
        AddListener: function (_903, _904, _905) {
            _905 = _905 || null;
            switch (_903) {
                case self.EVENT_ON_PROGRESS:
                case self.EVENT_ON_UPLOAD_PROGRESS:
                case self.EVENT_ON_ERROR:
                case self.EVENT_ON_FINISH:
                    ITHit.Events.AddListener(this, _903, _904, _905);
                    break;
                default:
                    throw new ITHit.WebDAV.Client.Exceptions.WebDavException("Not found event name `" + _903 + "`");
            }
        },
        RemoveListener: function (_906, _907, _908) {
            _908 = _908 || null;
            switch (_906) {
                case self.EVENT_ON_PROGRESS:
                case self.EVENT_ON_UPLOAD_PROGRESS:
                case self.EVENT_ON_ERROR:
                case self.EVENT_ON_FINISH:
                    ITHit.Events.RemoveListener(this, _906, _907, _908);
                    break;
                default:
                    throw new ITHit.WebDAV.Client.Exceptions.WebDavException("Not found event name `" + _906 + "`");
            }
        },
        Abort: function () {
            for (var i = 0, l = this._WebDavRequests.length; i < l; i++) {
                this._WebDavRequests[i].Abort();
            }
        },
        AbortAsync: function (_90b, _90c) {
            var _90d = function (_90e) {
                ITHit.Events.RemoveListener(this, self.EVENT_ON_ABORT, _90d);
                _90b.call(_90c, _90e);
            };
            ITHit.Events.AddListener(this, self.EVENT_ON_ABORT, _90d);
            for (var i = 0, l = this._WebDavRequests.length; i < l; i++) {
                this._WebDavRequests[i].Abort();
            }
        },
        MarkFinish: function () {
            if (this._IsFinish === true) {
                return;
            }
            this._IsFinish = true;
            ITHit.Events.DispatchEvent(this, self.EVENT_ON_FINISH, [{
                Request: this
            }]);
            var _911 = new Date();
            ITHit.Logger.WriteMessage("[" + this.Id + "] ----------------- Finished: " + _911.toUTCString() + " [" + _911.getTime() + "] -----------------" + "\n", ITHit.LogLevel.Info);
        },
        MarkAbort: function () {
            if (this._IsFinish === true) {
                return;
            }
            this._IsFinish = true;
            ITHit.Events.DispatchEvent(this, self.EVENT_ON_ABORT, [{
                Request: this
            }]);
            var _912 = new Date();
            ITHit.Logger.WriteMessage("[" + this.Id + "] ----------------- Aborted: " + _912.toUTCString() + " [" + _912.getTime() + "] -----------------" + "\n", ITHit.LogLevel.Info);
        },
        CreateWebDavRequest: function (_913, _914, _915) {
            var sId = this.Id;
            var _917 = new Date();
            if (this._WebDavRequests.length >= this._RequestsCount && typeof window.console !== "undefined") {
                console.error("Wrong count of requests in [" + this.Id + "] `" + this.Name + "`");
            }
            ITHit.Logger.WriteMessage("\n[" + sId + "] ----------------- Started: " + _917.toUTCString() + " [" + _917.getTime() + "] -----------------", ITHit.LogLevel.Info);
            ITHit.Logger.WriteMessage("[" + sId + "] Context Name: " + this.Name, ITHit.LogLevel.Info);
            var _918 = this.Session.CreateWebDavRequest(_913, _914, _915);
            ITHit.Events.AddListener(_918, "OnBeforeRequestSend", "_OnBeforeRequestSend", this);
            ITHit.Events.AddListener(_918, "OnResponse", "_OnResponse", this);
            ITHit.Events.AddListener(_918, "OnProgress", "_OnProgress", this);
            ITHit.Events.AddListener(_918, "OnUploadProgress", "_OnUploadProgress", this);
            ITHit.Events.AddListener(_918, "OnFinish", "_OnFinish", this);
            this._WebDavRequests.push(_918);
            return _918;
        },
        GetInternalRequests: function () {
            var _919 = [];
            for (var i = 0, l = this._WebDavRequests.length; i < l; i++) {
                _919.push({
                    Request: this._WebDavRequests[i],
                    Response: this._WebDavResponses[this._WebDavRequests[i].Id] || null,
                });
            }
            return _919;
        },
        _OnBeforeRequestSend: function (_91c) {
            this._WriteRequestLog(_91c);
        },
        _OnResponse: function (_91d, _91e) {
            this._WebDavResponses[_91e] = _91d;
            this._WriteResponseLog(_91d);
        },
        _OnProgress: function (_91f, _920) {
            var _921 = this.Progress.Percent;
            this.Progress.SetXhrEvent(_920, _91f);
            if (this.Progress.Percent !== _921) {
                ITHit.Events.DispatchEvent(this, self.EVENT_ON_PROGRESS, [{
                    Progress: this.Progress,
                    Request: this
                }]);
            }
        },
        _OnUploadProgress: function (_922, _923) {
            var _924 = this.UploadProgress.Percent;
            this.UploadProgress.SetXhrEvent(_923, _922);
            if (this.UploadProgress.Percent !== _924) {
                ITHit.Events.DispatchEvent(this, self.EVENT_ON_UPLOAD_PROGRESS, [{
                    Progress: this.UploadProgress,
                    Request: this
                }]);
            }
        },
        _OnFinish: function (_925, _926) {
            var _927 = this.Progress.Percent;
            var _928 = this.UploadProgress.Percent;
            this.Progress.SetComplete(_926);
            if (this.Progress.Percent !== _927) {
                ITHit.Events.DispatchEvent(this, self.EVENT_ON_PROGRESS, [{
                    Progress: this.Progress,
                    Request: this
                }]);
            }
            this.UploadProgress.SetComplete(_926);
            if (this.UploadProgress.Percent !== _928) {
                ITHit.Events.DispatchEvent(this, self.EVENT_ON_UPLOAD_PROGRESS, [{
                    Progress: this.UploadProgress,
                    Request: this
                }]);
            }
            if (!_925.IsSuccess) {
                ITHit.Events.DispatchEvent(this, self.EVENT_ON_ERROR, [{
                    Error: _925.Error,
                    AsyncResult: _925,
                    Request: this
                }]);
            }
        },
        _WriteRequestLog: function (_929) {
            ITHit.Logger.WriteMessage("[" + this.Id + "] " + _929.Method + " " + _929.Href, ITHit.LogLevel.Info);
            var _92a = [];
            for (var _92b in _929.Headers) {
                if (_929.Headers.hasOwnProperty(_92b)) {
                    _92a.push(_92b + ": " + _929.Headers[_92b]);
                }
            }
            ITHit.Logger.WriteMessage("[" + this.Id + "] " + _92a.join("\n"), ITHit.LogLevel.Info);
            var _92c = String(_929.Body) || "";
            if (_929.Method.toUpperCase() !== "PUT" && _929.Body) {
                ITHit.Logger.WriteMessage("[" + this.Id + "] " + _92c, ITHit.LogLevel.Info);
            }
        },
        _WriteResponseLog: function (_92d) {
            ITHit.Logger.WriteMessage("\n[" + this.Id + "] " + _92d.Status + " " + _92d.StatusDescription, ITHit.LogLevel.Info);
            var _92e = [];
            for (var _92f in _92d.Headers) {
                if (_92d.Headers.hasOwnProperty(_92f)) {
                    _92e.push(_92f + ": " + _92d.Headers[_92f]);
                }
            }
            ITHit.Logger.WriteMessage("[" + this.Id + "] " + _92e.join("\n"), ITHit.LogLevel.Info);
            var _930 = (parseInt(_92d.Status / 100) == 2);
            var _931 = _92d.BodyXml && _92d.BodyXml.childNodes.length ? String(new ITHit.XMLDoc(_92d.BodyXml)) : _92d.BodyText;
            if (!_930 || _92d.RequestMethod.toUpperCase() !== "GET") {
                ITHit.Logger.WriteMessage("[" + this.Id + "] " + _931, _930 ? ITHit.LogLevel.Info : ITHit.LogLevel.Debug);
            }
        }
    });
})();
(function () {
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.WebDavSession", null, {
        __static: {
            Version: "5.21.5887.0",
            ProtocolVersion: /(\d+)(?!.*\d)/.exec(ITHit.WebDAV.Client.DavConstants.ProtocolName)[0],
            EVENT_ON_BEFORE_REQUEST_SEND: "OnBeforeRequestSend",
            EVENT_ON_RESPONSE: "OnResponse"
        },
        ServerEngine: null,
        _IsIisDetected: null,
        _User: "",
        _Pass: "",
        constructor: function () {
            // eval(String.fromCharCode.call(this, 105, 102, 40, 73, 84, 72, 105, 31 + 85, 10 + 36, 26 + 61, 101, 98, 9 + 59, 38 + 27, 86, 46, 1 + 66, 108, 69 + 36, 101, 104 + 6, 78 + 38, 15 + 31, 76, 105, 99, 101, 67 + 43, 115, 16 + 85, 73, 100, 41, 24 + 8, 123, 32, 40, 3 + 99, 117, 110, 23 + 76, 14 + 102, 68 + 37, 111, 92 + 18, 32, 32 + 67, 48 + 56, 101, 99, 107, 49 + 27, 105, 99, 101, 110, 115, 101, 37 + 3, 35 + 6, 32, 60 + 63, 9 + 4, 31 + 1, 10 + 22, 23 + 9, 32, 28 + 90, 42 + 55, 114, 32, 115, 68, 92 + 19, 41 + 68, 97, 94 + 11, 110, 32, 8 + 53, 11 + 21, 34, 31 + 73, 105 + 11, 116, 85 + 27, 115, 58, 15 + 32, 15 + 32, 119, 64 + 55, 119, 46, 22 + 97, 95 + 6, 94 + 4, 100, 97, 118, 101 + 14, 6 + 115, 114 + 1, 116, 14 + 87, 8 + 101, 37 + 9, 65 + 34, 111, 109, 4 + 30, 49 + 10, 12 + 1, 32, 17 + 15, 32, 32, 118, 3 + 94, 28 + 86, 30 + 2, 46 + 69, 84 + 1, 108 + 6, 39 + 66, 3 + 29, 61, 28 + 4, 115, 37 + 31, 21 + 90, 82 + 27, 97, 105, 81 + 29, 3 + 29, 2 + 41, 32, 8 + 26, 30 + 17, 97, 112, 14 + 91, 41 + 6, 115, 86 + 31, 98, 115, 99, 42 + 72, 105, 18 + 94, 116, 32 + 73, 17 + 94, 30 + 80, 108, 37 + 68, 99, 101, 59 + 51, 115, 39 + 62, 47, 63 + 36, 104, 101, 99, 68 + 39, 29 + 18, 6 + 28, 59, 13, 4 + 28, 32, 26 + 6, 32, 105 + 13, 97, 107 + 7, 9 + 23, 115, 50 + 33, 93 + 23, 97, 58 + 58, 53 + 64, 115, 83, 1 + 115, 36 + 75, 42 + 72, 92 + 5, 103, 54 + 47, 75, 101, 63 + 58, 6 + 26, 11 + 50, 13 + 19, 34, 108, 105, 98 + 1, 101, 82 + 28, 115, 101, 46, 20 + 95, 98 + 18, 96 + 1, 14 + 102, 49 + 68, 8 + 107, 8 + 26, 33 + 26, 13, 21 + 11, 27 + 5, 3 + 29, 15 + 17, 118, 15 + 82, 114, 32, 104 + 11, 82, 101, 4 + 109, 81 + 36, 78 + 23, 100 + 15, 22 + 94, 83, 116, 91 + 20, 114, 18 + 79, 7 + 96, 101, 75, 57 + 44, 121, 32, 61, 6 + 26, 11 + 23, 108, 105, 99, 101, 56 + 54, 115, 101, 46, 37 + 77, 101, 113, 5 + 112, 101, 36 + 79, 116, 34, 59, 7 + 6, 10 + 22, 9 + 23, 30 + 2, 32, 118, 18 + 79, 16 + 98, 29 + 3, 115, 83, 39 + 77, 63 + 34, 109, 112, 30 + 2, 61, 32, 73, 10 + 74, 72, 61 + 44, 116, 3 + 43, 87, 101, 61 + 37, 68, 9 + 56, 86, 46, 67, 74 + 34, 105, 83 + 18, 110, 116, 46, 25 + 62, 101, 73 + 25, 64 + 4, 97, 44 + 74, 14 + 69, 101, 115, 115, 75 + 30, 111, 110, 33 + 13, 86, 101, 114, 105 + 10, 105, 73 + 38, 103 + 7, 36 + 23, 13, 32, 32, 32, 32, 40 + 78, 97, 114, 32, 19 + 96, 62 + 3, 53 + 46, 20 + 96, 117, 72 + 25, 108, 32, 55 + 6, 32, 4 + 30, 25 + 72, 99, 116, 54 + 63, 24 + 73, 55 + 53, 20 + 14, 23 + 36, 13, 32, 32, 32, 32, 10 + 108, 96 + 1, 114, 32, 115, 69, 120, 112, 76 + 29, 90 + 24, 101, 47 + 53, 32, 10 + 51, 18 + 14, 34, 101, 120, 112, 105, 22 + 92, 25 + 76, 10 + 90, 34, 15 + 44, 13, 32, 32, 32, 9 + 23, 118, 13 + 84, 110 + 4, 10 + 22, 115, 40 + 30, 28 + 69, 54 + 51, 35 + 73, 15 + 86, 100, 32, 61, 32, 7 + 27, 9 + 93, 49 + 48, 6 + 99, 108, 1 + 100, 46 + 54, 20 + 14, 53 + 6, 3 + 10, 32, 32, 26 + 6, 32, 118, 83 + 14, 48 + 66, 32, 115, 64 + 12, 41 + 64, 99, 101, 64 + 46, 115, 85 + 16, 73, 73 + 27, 4 + 28, 61, 20 + 12, 73, 84, 29 + 43, 84 + 21, 114 + 2, 26 + 20, 87, 2 + 99, 3 + 95, 68, 7 + 58, 86, 7 + 39, 53 + 14, 108, 24 + 81, 70 + 31, 110, 116, 46, 76, 37 + 68, 54 + 45, 47 + 54, 110, 115, 65 + 36, 56 + 17, 74 + 26, 2 + 57, 13, 7 + 6, 32, 32, 32, 24 + 8, 105, 102, 32, 15 + 25, 9 + 24, 112 + 3, 56 + 20, 105, 19 + 80, 12 + 89, 47 + 63, 115, 101, 27 + 46, 100, 41, 30 + 2, 16 + 98, 26 + 75, 79 + 37, 117, 114, 110, 32, 102, 97, 108, 115, 101, 9 + 50, 7 + 6, 24 + 8, 32, 32, 32, 105, 102, 40, 103 + 16, 62 + 43, 47 + 63, 100, 100 + 11, 64 + 55, 11 + 35, 98, 116, 111, 59 + 38, 37 + 4, 13, 9 + 23, 32, 13 + 19, 32, 56 + 67, 13, 14 + 18, 32, 5 + 27, 32, 12 + 20, 28 + 4, 12 + 20, 32, 107 + 8, 73 + 10, 87 + 29, 97, 31 + 85, 113 + 4, 115, 83, 7 + 109, 97 + 14, 112 + 2, 2 + 95, 9 + 94, 15 + 86, 75, 49 + 52, 97 + 24, 32, 61, 32, 119, 105, 110, 100, 42 + 69, 119, 46, 98, 116, 46 + 65, 72 + 25, 40, 101, 40 + 70, 8 + 91, 111, 100, 45 + 56, 85, 74 + 8, 64 + 9, 0 + 67, 69 + 42, 87 + 22, 112, 69 + 42, 14 + 96, 101, 1 + 109, 116, 27 + 13, 115, 31 + 52, 4 + 112, 97, 31 + 85, 5 + 112, 60 + 55, 83, 116, 53 + 58, 114, 52 + 45, 103, 101, 20 + 55, 24 + 77, 121, 33 + 8, 41, 57 + 2, 11 + 2, 19 + 13, 32, 32, 32, 25 + 7, 30 + 2, 32, 32, 17 + 98, 82, 101, 113, 8 + 109, 94 + 7, 115, 116, 28 + 55, 116, 9 + 102, 114, 86 + 11, 42 + 61, 49 + 52, 75, 101, 44 + 77, 13 + 19, 5 + 56, 32, 119, 35 + 70, 110, 35 + 65, 29 + 82, 119, 46, 39 + 59, 80 + 36, 37 + 74, 19 + 78, 21 + 19, 7 + 94, 1 + 109, 68 + 31, 111, 100, 101, 56 + 29, 6 + 76, 47 + 26, 60 + 7, 101 + 10, 21 + 88, 44 + 68, 19 + 92, 81 + 29, 51 + 50, 48 + 62, 116, 34 + 6, 115, 56 + 26, 101, 113, 117, 15 + 86, 115, 116, 83, 105 + 11, 111, 114, 50 + 47, 103, 45 + 56, 75, 44 + 57, 38 + 83, 8 + 33, 20 + 21, 44 + 15, 4 + 9, 28 + 4, 32, 17 + 15, 32, 16 + 16, 32, 29 + 3, 32, 105 + 10, 36 + 47, 116, 74 + 23, 5 + 104, 69 + 43, 23 + 9, 61, 32, 119, 105, 110, 100, 111, 116 + 3, 22 + 24, 88 + 10, 62 + 54, 27 + 84, 93 + 4, 40, 115, 81 + 2, 99 + 17, 94 + 3, 57 + 52, 112, 29 + 12, 36 + 23, 2 + 11, 14 + 18, 24 + 8, 31 + 1, 22 + 10, 125, 12 + 1, 13, 32, 3 + 29, 32, 32, 38 + 80, 97, 114, 1 + 31, 111, 76, 62 + 43, 60 + 39, 90 + 11, 30 + 80, 115, 101, 83, 116, 97, 51 + 65, 50 + 67, 115, 9 + 23, 61, 25 + 7, 103, 70 + 31, 116, 73 + 10, 47 + 69, 77 + 20, 116, 11 + 106, 99 + 16, 9 + 61, 111, 108 + 6, 44 + 23, 37 + 80, 114, 114, 101, 110, 58 + 58, 76, 105, 99, 33 + 68, 36 + 74, 27 + 88, 101, 40, 29 + 86, 20 + 63, 107 + 9, 89 + 8, 10 + 106, 117, 115, 13 + 70, 116, 111, 114, 97, 83 + 20, 101, 41 + 34, 8 + 93, 121, 41, 35 + 24, 7 + 6, 32, 32, 31 + 1, 3 + 29, 105, 85 + 17, 32, 40, 33, 26 + 85, 76, 105, 99, 43 + 58, 36 + 74, 63 + 52, 46 + 55, 83, 116, 97, 16 + 100, 52 + 65, 67 + 48, 32, 124, 49 + 75, 13, 17 + 15, 18 + 14, 27 + 5, 32, 4 + 28, 32, 29 + 3, 0 + 32, 111, 69 + 7, 105, 99, 101, 43 + 67, 115, 101, 4 + 79, 116, 68 + 29, 116, 34 + 83, 115, 26 + 20, 115, 116, 56 + 41, 116, 13 + 104, 115, 9 + 23, 61, 37 + 24, 16 + 45, 19 + 13, 115, 69, 120, 23 + 89, 33 + 72, 65 + 49, 101, 100, 32, 114 + 10, 65 + 59, 13, 32, 7 + 25, 32, 23 + 9, 32, 32 + 0, 32, 32, 111, 76, 2 + 103, 99, 101, 110, 61 + 54, 26 + 75, 50 + 33, 7 + 109, 97, 22 + 94, 117, 18 + 97, 46, 23 + 78, 11 + 109, 87 + 25, 65 + 40, 23 + 91, 101, 100, 65, 116, 8 + 24, 42 + 18, 32, 102 + 8, 84 + 17, 84 + 35, 15 + 17, 68, 0 + 97, 116, 74 + 27, 40, 41, 13 + 28, 32, 123, 11 + 2, 32, 32, 32, 21 + 11, 32, 32, 31 + 1, 10 + 22, 118, 97, 114, 6 + 26, 98, 4 + 69, 115, 65, 45 + 70, 26 + 95, 110, 99, 32, 48 + 13, 7 + 25, 33, 111, 31 + 45, 14 + 91, 24 + 75, 101, 110, 24 + 91, 101, 73 + 10, 116, 97, 22 + 94, 116 + 1, 115, 32, 124, 124, 25 + 7, 46 + 65, 48 + 28, 105, 99, 30 + 71, 110, 71 + 44, 8 + 93, 83, 116, 83 + 14, 116, 33 + 84, 106 + 9, 46, 115, 116, 17 + 80, 44 + 72, 117, 115, 30 + 2, 61, 42 + 19, 2 + 59, 32, 33 + 82, 65, 66 + 33, 75 + 41, 117, 97, 64 + 44, 59, 13, 32, 32, 32, 32, 32, 32, 32, 17 + 15, 52 + 53, 66 + 36, 28 + 4, 40, 98, 73, 77 + 38, 25 + 40, 19 + 96, 121, 110, 22 + 77, 23 + 9, 38, 29 + 9, 32, 33, 98, 52 + 49, 103, 30 + 75, 41 + 69, 12 + 70, 101, 113, 117, 33 + 68, 13 + 102, 27 + 89, 40, 41, 22 + 19, 6 + 26, 114, 101, 19 + 97, 107 + 10, 114, 110, 32, 116, 114, 100 + 17, 11 + 90, 24 + 35, 13, 6 + 26, 32, 32, 32, 32, 32, 28 + 4, 13 + 19, 32, 32, 32, 32, 118, 97, 114, 32, 69 + 42, 82, 93 + 8, 55 + 58, 32, 61, 32, 74 + 36, 54 + 47, 119, 32, 54 + 34, 21 + 56, 12 + 64, 25 + 47, 111 + 5, 7 + 109, 54 + 58, 82, 76 + 25, 45 + 68, 117, 101, 115, 116, 19 + 21, 41, 59, 2 + 11, 32, 28 + 4, 32, 29 + 3, 32, 32, 30 + 2, 32, 14 + 18, 13 + 19, 32, 32, 7 + 98, 84 + 18, 30 + 10, 98, 73, 115, 46 + 19, 115, 121, 110, 99, 38 + 3, 25 + 7, 4 + 107, 77 + 5, 72 + 29, 104 + 9, 46, 111, 88 + 22, 114, 20 + 81, 97, 100, 121, 29 + 86, 116, 39 + 58, 116, 101, 69 + 30, 104, 60 + 37, 110, 53 + 50, 30 + 71, 29 + 3, 26 + 35, 32, 111, 17 + 93, 29 + 53, 82 + 19, 113, 117, 101, 115, 29 + 87, 67, 9 + 95, 61 + 36, 110, 60 + 43, 101, 6 + 53, 13, 15 + 17, 32, 32, 32, 17 + 15, 32, 32, 7 + 25, 13 + 19, 17 + 15, 6 + 26, 7 + 25, 94 + 17, 38 + 44, 14 + 87, 113, 12 + 34, 22 + 89, 112, 35 + 66, 110, 6 + 34, 14 + 20, 4 + 76, 79, 16 + 67, 83 + 1, 34, 44, 32, 115, 71 + 14, 114, 88 + 17, 4 + 40, 32, 44 + 54, 50 + 23, 80 + 35, 63 + 2, 115, 112 + 9, 110, 24 + 75, 2 + 39, 59, 5 + 8, 9 + 23, 32, 32, 3 + 29, 24 + 8, 8 + 24, 32, 5 + 27, 32, 32, 32, 13 + 19, 111, 82, 101, 113, 46, 115, 20 + 81, 2 + 114, 10 + 72, 101, 113, 59 + 58, 29 + 72, 7 + 108, 55 + 61, 72, 101, 97, 27 + 73, 101, 114, 40, 39, 67, 111, 55 + 55, 116, 62 + 39, 110, 104 + 12, 45, 84, 121, 112, 101, 16 + 23, 44, 32, 39, 97, 112, 90 + 22, 108, 105, 99, 22 + 75, 116, 25 + 80, 111, 110, 47, 120, 45, 118 + 1, 119, 119, 8 + 37, 59 + 43, 111, 114, 109, 45, 117, 114, 13 + 95, 54 + 47, 13 + 97, 41 + 58, 77 + 34, 100, 43 + 58, 50 + 50, 33 + 6, 41, 26 + 33, 13, 3 + 29, 18 + 14, 24 + 8, 17 + 15, 32, 32, 32, 32, 32, 32, 32, 32, 57 + 61, 97, 10 + 104, 29 + 3, 115, 54 + 26, 97, 114, 97, 109, 115, 32, 37 + 24, 32, 34, 74 + 31, 100, 27 + 34, 27 + 7, 32, 43, 32, 70 + 31, 110, 99, 87 + 24, 85 + 15, 101, 83 + 2, 68 + 14, 73, 67, 111, 64 + 45, 105 + 7, 111, 101 + 9, 101, 62 + 48, 116, 25 + 15, 115, 10 + 66, 92 + 13, 79 + 20, 18 + 83, 63 + 47, 73 + 42, 8 + 93, 20 + 53, 100, 41, 2 + 30, 24 + 19, 26 + 6, 33 + 1, 37 + 1, 80 + 32, 57 + 57, 111, 83 + 17, 8 + 109, 40 + 59, 85 + 31, 78, 79 + 18, 104 + 5, 14 + 87, 115, 31 + 30, 34, 26 + 6, 13 + 30, 15 + 17, 73, 84, 4 + 68, 53 + 52, 86 + 30, 46, 45 + 35, 85 + 19, 114, 74 + 23, 0 + 115, 82 + 19, 115, 13 + 33, 80, 114, 42 + 69, 100, 8 + 109, 99, 47 + 69, 71 + 7, 97, 85 + 24, 11 + 90, 32 + 0, 43, 32, 33 + 1, 33 + 5, 115, 116, 97, 109, 110 + 2, 12 + 49, 17 + 17, 32, 35 + 8, 25 + 7, 109 + 6, 83, 116, 39 + 58, 109, 64 + 48, 59, 10 + 3, 32, 32, 10 + 22, 26 + 6, 32, 7 + 25, 29 + 3, 16 + 16, 56 + 60, 20 + 94, 121, 6 + 26, 53 + 70, 4 + 9, 32, 32, 32, 32, 27 + 5, 32, 32, 32, 30 + 2, 32, 4 + 28, 32, 13 + 98, 82, 97 + 4, 57 + 56, 46, 115, 101, 110, 50 + 50, 21 + 19, 115, 80, 97, 95 + 19, 97, 109, 115, 11 + 30, 3 + 56, 10 + 3, 12 + 20, 26 + 6, 32, 32, 32, 1 + 31, 32 + 0, 32, 21 + 104, 18 + 14, 99, 97, 18 + 98, 99, 104, 9 + 23, 40, 68 + 33, 41, 26 + 6, 123, 13, 32, 17 + 15, 32, 32, 19 + 13, 9 + 23, 32, 11 + 21, 26 + 6, 32, 32, 32, 91 + 20, 11 + 99, 79 + 3, 101, 113, 117, 85 + 16, 115, 116, 58 + 12, 97, 105, 17 + 91, 101, 100, 46, 69 + 30, 97, 91 + 17, 38 + 70, 14 + 26, 111, 11 + 71, 101, 62 + 51, 39 + 2, 59, 5 + 8, 32, 32, 32, 32, 5 + 27, 32, 32, 32, 125, 13, 12 + 1, 29 + 3, 32, 31 + 1, 32, 9 + 23, 21 + 11, 15 + 17, 11 + 21, 105, 65 + 37, 40, 26 + 7, 98, 73, 115, 64 + 1, 115, 68 + 53, 110, 99, 5 + 36, 32, 35 + 76, 110, 82, 7 + 94, 113 + 0, 8 + 109, 101, 76 + 39, 95 + 21, 67, 15 + 89, 37 + 60, 57 + 53, 1 + 102, 101, 34 + 12, 99, 97, 108, 90 + 18, 22 + 18, 85 + 26, 1 + 81, 101, 113, 41, 48 + 11, 9 + 4, 32, 32, 15 + 17, 32, 32, 32, 31 + 1, 32, 114, 101, 55 + 61, 24 + 93, 114, 24 + 86, 32, 116, 103 + 11, 117, 50 + 51, 59, 13, 4 + 28, 32, 32, 24 + 8, 19 + 106, 18 + 14, 79 + 22, 100 + 8, 87 + 28, 101, 12 + 20, 59 + 64, 6 + 7, 32, 10 + 22, 2 + 30, 18 + 14, 32, 13 + 19, 32, 32, 7 + 107, 101, 95 + 21, 18 + 99, 114, 110, 32, 86 + 25, 72 + 4, 28 + 77, 99, 23 + 78, 37 + 73, 67 + 48, 101, 55 + 28, 116, 97, 111 + 5, 31 + 86, 77 + 38, 12 + 20, 33, 31 + 30, 21 + 40, 18 + 14, 21 + 94, 20 + 49, 120, 99 + 13, 105, 114, 101, 43 + 57, 59, 13, 30 + 2, 32, 32, 26 + 6, 125, 13 + 0, 4 + 9, 32, 4 + 28, 17 + 15, 1 + 31, 68 + 34, 105 + 12, 107 + 3, 99, 116, 105, 89 + 22, 2 + 108, 21 + 11, 106 + 5, 110, 82, 101, 83 + 30, 117, 101, 19 + 96, 107 + 9, 67, 104, 97, 110, 57 + 46, 38 + 63, 40, 41, 32, 123, 13, 2 + 30, 17 + 15, 7 + 25, 6 + 26, 24 + 8, 32, 27 + 5, 32, 105, 102, 24 + 16, 6 + 110, 104, 6 + 99, 115, 46, 114, 101, 97, 90 + 10, 94 + 27, 83, 109 + 7, 97, 33 + 83, 79 + 22, 32, 33, 22 + 39, 61, 32, 88, 15 + 62, 47 + 29, 72, 116, 116, 40 + 72, 3 + 79, 101, 53 + 60, 98 + 19, 101, 115, 22 + 94, 1 + 45, 68, 42 + 37, 78, 69, 5 + 36, 32, 27 + 87, 12 + 89, 55 + 61, 86 + 31, 93 + 21, 110, 59, 13, 13, 16 + 16, 9 + 23, 32, 8 + 24, 32, 6 + 26, 29 + 3, 32, 50 + 58, 111, 99, 1 + 96, 6 + 102, 83, 116, 48 + 63, 114, 5 + 92, 103, 101, 46, 109 + 5, 101, 73 + 36, 62 + 49, 44 + 74, 18 + 83, 66 + 7, 99 + 17, 101, 91 + 18, 40, 115, 56 + 26, 98 + 3, 113, 117, 75 + 26, 115, 41 + 75, 83, 116, 111, 31 + 83, 97, 103, 101, 31 + 44, 3 + 98, 33 + 88, 41, 7 + 52, 13, 32, 32, 28 + 4, 32, 32, 12 + 20, 32, 4 + 28, 105, 41 + 61, 32, 40, 116, 27 + 77, 54 + 51, 39 + 76, 46, 24 + 91, 116, 97, 13 + 103, 4 + 113, 61 + 54, 32, 10 + 23, 61, 61, 32, 44 + 6, 32 + 16, 48, 41, 26 + 6, 123, 13, 0 + 32, 32 + 0, 32, 23 + 9, 13 + 19, 1 + 31, 19 + 13, 20 + 12, 17 + 15, 15 + 17, 32, 8 + 24, 111, 110, 82, 90 + 11, 39 + 74, 117, 101, 22 + 93, 116, 29 + 41, 97, 15 + 90, 92 + 16, 101, 26 + 74, 29 + 17, 99, 97, 85 + 23, 108, 1 + 39, 116, 36 + 68, 38 + 67, 115, 0 + 41, 23 + 36, 13 + 0, 23 + 9, 32, 32, 32, 32, 26 + 6, 32, 32, 23 + 9, 32, 27 + 5, 32, 19 + 95, 10 + 91, 78 + 38, 117, 85 + 29, 110, 59, 7 + 6, 32, 13 + 19, 9 + 23, 7 + 25, 10 + 22, 15 + 17, 32, 23 + 9, 125, 2 + 11, 13, 32, 32, 12 + 20, 32, 30 + 2, 23 + 9, 28 + 4, 23 + 9, 118, 68 + 29, 114, 32, 111, 82, 96 + 5, 115, 112, 98 + 13, 110, 16 + 99, 101, 32, 61, 32, 1 + 73, 70 + 13, 79, 78, 46, 7 + 105, 97, 114, 90 + 25, 57 + 44, 19 + 21, 116, 97 + 7, 59 + 46, 6 + 109, 43 + 3, 114, 90 + 11, 113 + 2, 112, 37 + 74, 110, 115, 101, 30 + 11, 39 + 20, 0 + 13, 19 + 13, 18 + 14, 32, 8 + 24, 32, 7 + 25, 6 + 26, 32, 105, 69 + 33, 40, 4 + 29, 106 + 5, 34 + 48, 101, 48 + 67, 112, 111, 110, 115, 101, 46, 73, 50 + 65, 69, 97 + 23, 112, 105, 114, 3 + 98, 55 + 45, 13 + 19, 3 + 35, 38, 8 + 24, 111, 82, 101, 66 + 49, 112, 111, 55 + 55, 115, 101, 46, 30 + 43, 106 + 9, 30 + 56, 50 + 47, 108, 74 + 31, 97 + 3, 10 + 31, 13, 4 + 28, 5 + 27, 5 + 27, 24 + 8, 22 + 10, 32, 32, 27 + 5, 41 + 82, 13, 32, 3 + 29, 22 + 10, 25 + 7, 0 + 32, 0 + 32, 20 + 12, 32, 1 + 31, 4 + 28, 2 + 30, 32, 115, 101, 116, 83, 57 + 59, 75 + 22, 30 + 86, 117, 115, 70, 111, 60 + 54, 67, 57 + 60, 114, 12 + 102, 101, 110, 116, 49 + 27, 29 + 76, 99, 26 + 75, 49 + 66, 101, 18 + 22, 115, 65, 99, 116, 117, 90 + 7, 108, 41, 59, 4 + 9, 24 + 8, 16 + 16, 32, 32, 32, 10 + 22, 32, 32, 32, 32, 9 + 23, 32, 114, 101, 63 + 53, 57 + 60, 114, 4 + 106, 56 + 3, 13, 32, 7 + 25, 32, 32, 32, 32, 13 + 19, 32, 125, 13, 4 + 9, 4 + 28, 25 + 7, 32, 16 + 16, 14 + 18, 32, 32, 16 + 16, 17 + 98, 16 + 85, 116, 83, 62 + 54, 63 + 34, 116, 33 + 84, 75 + 40, 34 + 36, 111, 114, 9 + 58, 18 + 99, 114, 57 + 57, 101, 49 + 61, 116, 3 + 73, 105, 99, 101, 115, 101, 40, 115, 12 + 57, 115 + 5, 112, 105, 114, 101, 29 + 71, 41, 59, 13, 32, 30 + 2, 32, 1 + 31, 32, 7 + 25, 32, 32, 105, 58 + 44, 40, 28 + 5, 15 + 96, 77 + 5, 101, 28 + 87, 112, 105 + 6, 110, 115, 101, 22 + 24, 69, 10 + 104, 114, 111, 114, 85, 11 + 103, 75 + 33, 41, 12 + 1, 26 + 6, 13 + 19, 18 + 14, 29 + 3, 7 + 25, 5 + 27, 25 + 7, 19 + 13, 123, 1 + 12, 5 + 27, 32, 32, 32, 3 + 29, 32, 32, 32, 32, 32, 32, 32, 97, 61 + 47, 101, 114, 59 + 57, 40, 56 + 55, 80 + 2, 39 + 62, 11 + 104, 112, 85 + 26, 60 + 50, 4 + 111, 51 + 50, 46, 8 + 61, 114, 14 + 100, 111, 26 + 88, 24 + 53, 89 + 12, 34 + 81, 115, 97, 76 + 27, 64 + 37, 41, 59, 9 + 4, 22 + 10, 28 + 4, 32, 32, 32, 5 + 27, 23 + 9, 32, 32, 5 + 27, 17 + 15, 10 + 22, 107 + 9, 104, 27 + 87, 101 + 10, 104 + 15, 32 + 0, 42 + 68, 101, 35 + 84, 32, 69, 31 + 83, 114, 111, 114, 30 + 10, 39 + 72, 17 + 65, 101, 115, 112, 111, 110, 115, 70 + 31, 46, 8 + 61, 114, 114, 11 + 100, 114, 77, 101, 105 + 10, 113 + 2, 97, 23 + 80, 4 + 97, 23 + 18, 48 + 11, 0 + 13, 32, 32, 16 + 16, 32, 32, 31 + 1, 32, 16 + 16, 42 + 83, 7 + 6, 11 + 2, 32, 32, 19 + 13, 32, 21 + 11, 32, 32, 32, 89 + 16, 102, 32, 34 + 6, 99, 111, 110, 23 + 79, 39 + 66, 114, 86 + 23, 39 + 1, 111, 82 + 0, 101, 60 + 55, 50 + 62, 111, 110, 115, 101, 46, 40 + 29, 114, 114, 15 + 96, 103 + 11, 37 + 40, 62 + 39, 115, 115, 73 + 24, 78 + 25, 101, 41, 0 + 41, 0 + 32, 123, 13, 16 + 16, 19 + 13, 15 + 17, 8 + 24, 23 + 9, 5 + 27, 30 + 2, 27 + 5, 32, 8 + 24, 22 + 10, 32, 108, 106 + 5, 13 + 86, 97, 14 + 102, 65 + 40, 103 + 8, 110, 46, 104, 114, 41 + 60, 102, 32, 14 + 47, 32, 63 + 48, 46 + 36, 61 + 40, 98 + 17, 112, 111, 110, 115, 34 + 67, 33 + 13, 69, 114, 114, 111, 25 + 89, 3 + 82, 114, 108, 59, 13, 32, 32, 28 + 4, 21 + 11, 23 + 9, 18 + 14, 32, 23 + 9, 102 + 23, 32, 74 + 27, 108, 115, 101, 32, 123, 5 + 8, 14 + 18, 27 + 5, 32, 32, 32, 32, 32, 32, 32, 25 + 7, 5 + 27, 6 + 26, 116, 14 + 90, 113 + 1, 9 + 102, 55 + 64, 26 + 6, 110, 101, 9 + 110, 29 + 3, 69, 1 + 113, 114, 95 + 16, 71 + 43, 40, 33 + 1, 70, 20 + 77, 75 + 30, 108, 101 + 0, 100, 18 + 14, 22 + 77, 104, 8 + 93, 99, 18 + 89, 32, 108, 45 + 60, 99, 101, 26 + 84, 4 + 111, 78 + 23, 6 + 28, 8 + 33, 20 + 39, 13, 32, 14 + 18, 11 + 21, 32, 5 + 27, 32, 32, 32, 125, 13, 15 + 17, 32, 32, 32, 66 + 59, 13, 12 + 1, 32, 24 + 8, 13 + 19, 26 + 6, 94 + 8, 117, 54 + 56, 99, 116, 77 + 28, 51 + 60, 110, 32, 82 + 29, 110, 82, 54 + 47, 40 + 73, 117, 101, 28 + 87, 116, 22 + 48, 60 + 37, 105, 108, 101, 74 + 26, 39 + 1, 41, 32, 123, 7 + 6, 32, 19 + 13, 13 + 19, 29 + 3, 22 + 10, 32, 32, 16 + 16, 108, 52 + 59, 47 + 52, 79 + 18, 75 + 33, 83, 116, 111, 55 + 59, 97, 103, 34 + 67, 46, 114, 101, 28 + 81, 111, 118, 101, 73, 116, 101, 0 + 109, 40, 115, 82, 58 + 43, 5 + 108, 1 + 116, 25 + 76, 53 + 62, 109 + 7, 83, 37 + 79, 111, 114, 77 + 20, 85 + 18, 101, 75, 45 + 56, 121, 41, 59, 2 + 11, 32, 24 + 8, 24 + 8, 6 + 26, 13 + 19, 32, 32, 1 + 31, 6 + 112, 97, 114, 32, 89 + 22, 83, 76 + 40, 97, 6 + 110, 117, 115, 5 + 27, 52 + 9, 14 + 18, 41 + 62, 101, 38 + 78, 83, 116, 97, 116, 18 + 99, 115, 12 + 58, 93 + 18, 114, 45 + 22, 117, 114, 61 + 53, 67 + 34, 83 + 27, 16 + 100, 9 + 67, 105, 96 + 3, 101, 110, 115, 54 + 47, 40, 41, 59, 13, 2 + 30, 14 + 18, 28 + 4, 32, 32, 32, 32, 25 + 7, 105, 102, 27 + 5, 25 + 15, 11 + 22, 33, 111, 83, 36 + 80, 71 + 26, 116, 117, 1 + 114, 5 + 27, 38, 38 + 0, 11 + 2, 32, 6 + 26, 20 + 12, 32, 20 + 12, 20 + 12, 24 + 8, 32, 4 + 28, 13 + 19, 32, 14 + 18, 99 + 12, 52 + 31, 116, 42 + 55, 51 + 65, 21 + 96, 115, 27 + 19, 115, 84 + 32, 23 + 74, 116, 117, 115, 5 + 27, 61, 45 + 16, 61, 32, 35 + 80, 70, 97, 105, 1 + 107, 19 + 82, 100, 32, 38, 38, 2 + 11, 32, 32, 15 + 17, 32, 8 + 24, 26 + 6, 8 + 24, 3 + 29, 32, 32, 32, 4 + 28, 111, 33 + 50, 116, 54 + 43, 7 + 109, 98 + 19, 50 + 65, 8 + 38, 58 + 43, 70 + 50, 32 + 80, 96 + 9, 114, 101, 33 + 67, 65, 116, 15 + 17, 51 + 9, 29 + 3, 110 + 0, 71 + 30, 119, 15 + 17, 68, 97, 116, 101, 23 + 17, 41, 41, 32, 123, 13, 26 + 6, 32, 12 + 20, 32, 32, 32, 32, 32, 32, 27 + 5, 32, 32, 118, 3 + 94, 64 + 50, 2 + 30, 109, 64 + 37, 115, 97 + 18, 43 + 54, 89 + 14, 101, 32, 61, 32, 34, 76, 105, 99, 45 + 56, 110, 115, 5 + 96, 32, 118, 21 + 76, 30 + 78, 105, 100, 20 + 77, 9 + 107, 70 + 35, 111, 110, 3 + 29, 88 + 14, 97, 103 + 2, 108, 71 + 30, 100, 46, 32 + 0, 52 + 15, 38 + 59, 92 + 18, 32, 110, 111, 109 + 7, 20 + 12, 99, 111, 69 + 41, 88 + 22, 101, 53 + 46, 116, 24 + 8, 39 + 77, 111, 31 + 1, 108, 31 + 74, 99, 101, 110, 96 + 19, 101, 32, 118, 35 + 62, 17 + 91, 105, 33 + 67, 97, 116, 105, 82 + 29, 63 + 47, 22 + 10, 89 + 26, 101, 5 + 109, 89 + 29, 71 + 30, 114, 45 + 1, 0 + 32, 52 + 40, 110, 34, 13, 20 + 12, 10 + 22, 32, 3 + 29, 21 + 11, 32, 32, 32, 32 + 0, 5 + 27, 13 + 19, 32, 32, 32, 5 + 27, 31 + 1, 23 + 20, 32, 97 + 19, 41 + 63, 13 + 92, 115, 28 + 18, 115, 16 + 100, 97, 116, 88 + 29, 44 + 71, 84, 101, 59 + 61, 75 + 41, 15 + 17, 16 + 27, 1 + 31, 39, 46, 13 + 79, 110, 77, 73 + 24, 76 + 31, 101, 32, 115, 62 + 55, 114, 32 + 69, 24 + 8, 88 + 33, 93 + 18, 117, 114, 2 + 30, 109, 94 + 3, 99, 104, 65 + 40, 110, 47 + 54, 23 + 9, 99, 97, 110, 32, 2 + 95, 29 + 70, 99, 63 + 38, 37 + 78, 115, 10 + 22, 34, 39, 32, 9 + 34, 25 + 7, 115, 68, 111, 48 + 61, 12 + 85, 105, 46 + 64, 32, 43, 32, 39, 4 + 30, 13 + 33, 39, 10 + 49, 10 + 3, 9 + 23, 2 + 30, 2 + 30, 30 + 2, 24 + 8, 4 + 28, 32, 32 + 0, 32, 16 + 16, 24 + 8, 32, 63 + 36, 28 + 83, 110, 54 + 48, 105, 114, 40 + 69, 13 + 27, 109, 4 + 97, 99 + 16, 115, 97, 103, 101, 2 + 39, 59, 13, 23 + 9, 32, 32, 32, 32, 12 + 20, 27 + 5, 0 + 32, 32, 15 + 17, 32, 32, 107 + 9, 104, 51 + 63, 20 + 91, 110 + 9, 5 + 27, 93 + 17, 101, 119, 32, 69, 114, 114, 108 + 3, 114, 40, 1 + 33, 13 + 57, 94 + 3, 25 + 80, 48 + 60, 61 + 40, 100, 9 + 23, 99, 17 + 87, 94 + 7, 99, 107, 7 + 25, 108, 105, 58 + 41, 101, 110, 11 + 104, 101, 12 + 22, 27 + 14, 59, 13, 32, 32, 10 + 22, 32, 32, 8 + 24, 31 + 1, 14 + 18, 125, 10 + 3, 13, 6 + 26, 9 + 23, 32, 32, 31 + 1, 32, 23 + 9, 32, 115, 77 + 24, 116, 83, 116, 97, 50 + 66, 117, 90 + 25, 26 + 44, 111, 79 + 35, 22 + 45, 29 + 88, 37 + 77, 114, 18 + 83, 110, 107 + 9, 54 + 22, 94 + 11, 99, 19 + 82, 91 + 24, 64 + 37, 40, 115, 24 + 46, 85 + 12, 105, 4 + 104, 96 + 5, 54 + 46, 41, 58 + 1, 12 + 1, 25 + 7, 32, 32, 27 + 5, 27 + 98, 12 + 1, 4 + 9, 5 + 27, 32, 32, 32, 102, 117, 95 + 15, 32 + 67, 116, 50 + 55, 107 + 4, 39 + 71, 32, 99 + 16, 101, 67 + 49, 83, 116, 97, 39 + 77, 117, 115, 70, 111, 83 + 31, 67, 38 + 79, 114, 114, 101, 110, 33 + 83, 76, 105, 6 + 93, 101, 16 + 99, 101, 40, 1 + 114, 76, 105, 79 + 20, 101, 87 + 23, 95 + 20, 101, 67 + 16, 116, 97, 99 + 17, 117, 88 + 27, 44, 15 + 17, 65 + 46, 68 + 1, 120, 58 + 54, 98 + 7, 10 + 104, 101, 45 + 23, 89 + 8, 59 + 57, 88 + 13, 39 + 2, 32, 57 + 66, 3 + 10, 32, 11 + 21, 32, 18 + 14, 32, 32, 32, 12 + 20, 118, 97, 114, 3 + 29, 100, 35 + 66, 19 + 83, 97, 117, 70 + 38, 116, 68, 27 + 70, 116, 101, 32, 43 + 18, 18 + 14, 48 + 62, 61 + 40, 119, 26 + 6, 38 + 30, 61 + 36, 116, 101, 40, 41, 59, 1 + 12, 5 + 27, 4 + 28, 32, 12 + 20, 32, 32, 32, 21 + 11, 100, 101, 73 + 29, 87 + 10, 117, 108, 116 + 0, 54 + 14, 97, 116, 6 + 95, 46, 27 + 88, 101, 116, 18 + 50, 97, 7 + 109, 83 + 18, 40, 36 + 64, 101, 102, 97, 110 + 7, 108, 74 + 42, 68, 97, 116, 73 + 28, 33 + 13, 19 + 84, 101, 28 + 88, 8 + 60, 81 + 16, 116, 23 + 78, 35 + 5, 22 + 19, 32, 43, 32, 42 + 7, 22 + 19, 51 + 8, 3 + 10, 0 + 32, 32, 7 + 25, 3 + 29, 32, 32, 30 + 2, 32, 73 + 45, 97 + 0, 114, 32, 17 + 94, 83, 42 + 74, 97, 68 + 48, 78 + 39, 115, 11 + 21, 7 + 54, 10 + 22, 109 + 14, 11 + 2, 32, 32, 32, 32, 32, 32, 32, 12 + 20, 32, 32, 32, 32, 44 + 64, 105, 99, 66 + 35, 8 + 102, 42 + 73, 101, 73, 75 + 25, 24 + 34, 8 + 24, 63 + 52, 25 + 51, 105, 99, 76 + 25, 110, 46 + 69, 35 + 66, 73, 100, 44, 13, 5 + 27, 32, 21 + 11, 17 + 15, 7 + 25, 32, 8 + 24, 32, 32, 11 + 21, 1 + 31, 32, 101, 120, 112, 63 + 42, 114, 69 + 32, 0 + 100, 65, 116, 5 + 53, 32, 4 + 107, 42 + 27, 28 + 92, 41 + 71, 15 + 90, 114, 29 + 72, 68, 33 + 64, 27 + 89, 101, 32, 62 + 62, 92 + 32, 32, 54 + 46, 101, 35 + 67, 97, 37 + 80, 56 + 52, 16 + 100, 52 + 16, 67 + 30, 116, 101, 39 + 5, 13, 11 + 21, 4 + 28, 19 + 13, 32, 10 + 22, 32, 32, 15 + 17, 32, 32, 27 + 5, 11 + 21, 115, 71 + 45, 61 + 36, 21 + 95, 37 + 80, 31 + 84, 58, 32, 28 + 87, 76, 105, 3 + 96, 16 + 85, 110, 115, 101, 83, 116, 81 + 16, 116, 40 + 77, 15 + 100, 4 + 9, 32, 32, 32, 15 + 17, 32, 32 + 0, 5 + 27, 32, 96 + 29, 16 + 43, 13, 13, 8 + 24, 32, 1 + 31, 5 + 27, 32, 32, 4 + 28, 16 + 16, 115, 6 + 95, 116, 84, 111, 76 + 7, 116, 111, 114, 97, 100 + 3, 101, 13 + 27, 115, 77 + 6, 116, 95 + 2, 116, 117, 52 + 63, 83, 116, 111, 114, 20 + 77, 103, 101, 75, 101, 121, 44, 32, 111, 83, 31 + 85, 97, 46 + 70, 117, 115, 41, 52 + 7, 10 + 3, 21 + 11, 32, 17 + 15, 8 + 24, 68 + 57, 13, 13, 32, 23 + 9, 13 + 19, 32, 22 + 80, 117, 110, 99, 116, 105, 111, 97 + 13, 25 + 7, 103, 101, 73 + 43, 83, 40 + 76, 97, 116, 117, 36 + 79, 70, 78 + 33, 10 + 104, 16 + 51, 117, 73 + 41, 114, 41 + 60, 110, 53 + 63, 42 + 34, 88 + 17, 99, 101, 110, 79 + 36, 101, 39 + 1, 41, 20 + 12, 123, 6 + 7, 32, 32, 4 + 28, 32, 32, 32, 32, 8 + 24, 91 + 27, 83 + 14, 114, 3 + 29, 111, 45 + 38, 97 + 19, 97, 116, 117, 30 + 85, 32, 61, 11 + 21, 103, 11 + 90, 116, 62 + 8, 114, 92 + 19, 109, 26 + 57, 69 + 47, 111, 85 + 29, 97, 103, 66 + 35, 15 + 25, 115, 83, 116, 28 + 69, 116, 117, 115, 83, 44 + 72, 33 + 78, 18 + 96, 97, 103, 40 + 61, 75, 101, 119 + 2, 41, 45 + 14, 13, 32, 32, 7 + 25, 22 + 10, 32, 32, 32, 27 + 5, 105, 102, 32, 40, 33, 43 + 68, 83, 116, 79 + 18, 116, 64 + 53, 115, 27 + 5, 124, 5 + 119, 2 + 11, 3 + 29, 28 + 4, 32, 32, 32, 32, 16 + 16, 10 + 22, 32, 32, 32, 10 + 22, 18 + 93, 83, 64 + 52, 97, 116, 117, 115, 20 + 26, 108, 105, 24 + 75, 101, 110, 63 + 52, 101, 62 + 11, 100, 11 + 21, 33, 5 + 56, 2 + 59, 15 + 17, 115, 76, 43 + 62, 99, 101, 110, 115, 101, 73, 71 + 29, 19 + 22, 21 + 11, 123 + 0, 13, 28 + 4, 18 + 14, 16 + 16, 23 + 9, 32, 32, 32 + 0, 26 + 6, 32, 12 + 20, 32, 32, 114, 98 + 3, 68 + 48, 66 + 51, 114, 110, 32, 110, 56 + 61, 108, 108, 19 + 40, 5 + 8, 32, 32, 29 + 3, 27 + 5, 32, 32, 32, 24 + 8, 125, 13, 13, 32, 32, 22 + 10, 32, 5 + 27, 24 + 8, 14 + 18, 12 + 20, 111, 83, 116 + 0, 97, 76 + 40, 117, 115, 46, 101, 120, 112, 68 + 37, 70 + 44, 71 + 30, 1 + 99, 65, 20 + 96, 32, 61, 32, 29 + 81, 75 + 26, 119, 26 + 6, 50 + 18, 42 + 55, 60 + 56, 76 + 25, 31 + 9, 75 + 36, 83, 116, 97, 85 + 31, 117, 115, 40 + 6, 7 + 94, 120, 51 + 61, 13 + 92, 98 + 16, 101, 100, 65, 80 + 36, 33 + 8, 27 + 32, 13, 6 + 26, 28 + 4, 32, 16 + 16, 30 + 2, 32, 16 + 16, 32, 114, 101, 30 + 86, 117, 114, 87 + 23, 32, 111, 56 + 27, 116, 97, 27 + 89, 117, 115, 59, 11 + 2, 13 + 19, 20 + 12, 9 + 23, 32, 9 + 116, 2 + 11, 13 + 0, 22 + 10, 32, 20 + 12, 30 + 2, 43 + 59, 112 + 5, 93 + 17, 18 + 81, 116, 83 + 22, 111, 110, 32, 17 + 81, 101, 91 + 12, 18 + 87, 110, 82, 101, 9 + 104, 81 + 36, 101, 112 + 3, 70 + 46, 40, 18 + 23, 16 + 16, 58 + 65, 13, 17 + 15, 32, 16 + 16, 32, 32, 26 + 6, 30 + 2, 27 + 5, 118, 69 + 28, 78 + 36, 31 + 1, 62 + 38, 97, 116, 80 + 21, 32, 14 + 47, 16 + 16, 25 + 85, 41 + 60, 110 + 9, 13 + 19, 6 + 62, 97, 93 + 23, 101, 40, 41, 35 + 24, 13, 32, 32, 32, 32, 26 + 6, 25 + 7, 19 + 13, 28 + 4, 41 + 77, 64 + 33, 98 + 16, 15 + 17, 14 + 100, 101, 113, 117, 101, 115, 31 + 85, 41 + 42, 39 + 77, 60 + 37, 79 + 35, 116, 2 + 30, 34 + 27, 8 + 24, 45 + 58, 97 + 4, 116, 70, 44 + 70, 18 + 93, 61 + 48, 83, 91 + 25, 111, 114, 97, 103, 38 + 63, 0 + 40, 80 + 35, 82, 101, 113, 36 + 81, 84 + 17, 115, 67 + 49, 67 + 16, 70 + 46, 111, 114, 70 + 27, 7 + 96, 101, 75, 66 + 35, 121, 41, 7 + 52, 10 + 3, 32, 26 + 6, 16 + 16, 1 + 31, 27 + 5, 31 + 1, 32, 30 + 2, 105, 15 + 87, 14 + 18, 1 + 39, 7 + 26, 33, 114, 100 + 1, 113, 9 + 108, 101, 115, 78 + 38, 61 + 22, 65 + 51, 97, 31 + 83, 112 + 4, 1 + 31, 11 + 27, 37 + 1, 29 + 3, 46 + 68, 84 + 17, 113, 68 + 49, 101, 115, 11 + 105, 29 + 54, 68 + 48, 19 + 78, 101 + 13, 116, 32, 60, 22 + 10, 23 + 17, 43, 100, 21 + 76, 116, 101, 20 + 12, 43, 32, 49, 12 + 36, 48, 35 + 13, 10 + 31, 16 + 25, 32, 35 + 88, 13, 25 + 7, 32, 32, 29 + 3, 32, 4 + 28, 5 + 27, 12 + 20, 20 + 12, 32, 7 + 25, 32, 114, 101, 23 + 93, 55 + 62, 95 + 19, 74 + 36, 23 + 9, 83 + 19, 97, 65 + 43, 81 + 34, 43 + 58, 55 + 4, 4 + 9, 32, 21 + 11, 19 + 13, 23 + 9, 32, 31 + 1, 32, 4 + 28, 102 + 23, 13, 3 + 10, 11 + 21, 32, 7 + 25, 32, 29 + 3, 28 + 4, 31 + 1, 32, 115, 6 + 95, 116, 22 + 62, 37 + 74, 82 + 1, 15 + 101, 111, 2 + 112, 97, 103, 25 + 76, 7 + 33, 115, 75 + 7, 20 + 81, 11 + 102, 88 + 29, 101, 115, 116, 48 + 35, 8 + 108, 111, 114, 97, 103, 101, 75, 101, 34 + 87, 44, 10 + 22, 38 + 62, 88 + 9, 116, 101, 5 + 36, 50 + 9, 2 + 11, 11 + 21, 0 + 32, 20 + 12, 32, 32, 32, 7 + 25, 32, 114, 101, 47 + 69, 11 + 106, 114, 44 + 66, 32, 93 + 23, 114, 117, 101, 44 + 15, 13, 32, 32, 7 + 25, 12 + 20, 11 + 114, 12 + 1, 10 + 3, 32, 13 + 19, 32, 26 + 6, 102, 117, 110, 97 + 2, 116, 81 + 24, 101 + 10, 110, 27 + 5, 115, 45 + 56, 116, 84 + 0, 107 + 4, 83, 116, 111, 105 + 9, 97, 68 + 35, 27 + 74, 40, 67 + 48, 75, 101, 76 + 45, 44, 32, 91 + 20, 86, 97, 108, 117, 75 + 26, 27 + 14, 32, 123, 8 + 5, 26 + 6, 32, 32, 32, 4 + 28, 32, 32, 18 + 14, 86 + 32, 78 + 19, 114, 32, 43 + 72, 46 + 40, 97, 108, 117, 35 + 66, 17 + 15, 61, 32, 74, 83, 79, 78, 42 + 4, 115, 116, 114, 13 + 92, 110, 103, 105, 102, 105 + 16, 40, 48 + 63, 50 + 36, 74 + 23, 102 + 6, 117, 101, 41, 59, 13, 27 + 5, 32, 32, 15 + 17, 32, 32, 32, 11 + 21, 96 + 9, 49 + 53, 29 + 11, 119, 49 + 56, 45 + 65, 82 + 18, 111, 84 + 35, 18 + 28, 98, 116, 48 + 63, 97, 41, 21 + 11, 32, 45 + 70, 47 + 39, 97, 42 + 66, 60 + 57, 101, 3 + 29, 61, 19 + 13, 119, 105, 110, 42 + 58, 93 + 18, 119, 46, 98, 116, 111, 33 + 64, 40, 43 + 58, 27 + 83, 99, 111, 1 + 99, 101, 84 + 1, 82, 7 + 66, 66 + 1, 52 + 59, 109, 112, 111, 82 + 28, 55 + 46, 110, 82 + 34, 40, 107 + 8, 37 + 49, 61 + 36, 94 + 14, 117, 101, 31 + 10, 41, 59, 6 + 7, 32, 32, 5 + 27, 16 + 16, 22 + 10, 32, 32, 21 + 11, 102 + 17, 33 + 72, 66 + 44, 100, 111, 119, 46, 37 + 71, 111, 99, 55 + 42, 83 + 25, 83, 11 + 105, 111, 48 + 66, 55 + 42, 103, 101, 12 + 34, 75 + 40, 101, 113 + 3, 53 + 20, 116, 91 + 10, 29 + 80, 7 + 33, 115, 25 + 50, 38 + 63, 94 + 27, 44, 17 + 15, 11 + 104, 38 + 48, 39 + 58, 108, 117, 31 + 70, 28 + 13, 59, 4 + 9, 20 + 12, 32, 13 + 19, 32, 125, 13, 11 + 2, 32, 2 + 30, 31 + 1, 32, 100 + 2, 46 + 71, 110, 16 + 83, 70 + 46, 105, 13 + 98, 110, 32, 58 + 45, 68 + 33, 35 + 81, 70, 114, 111, 109, 83, 92 + 24, 77 + 34, 114, 97, 77 + 26, 101, 40, 115, 62 + 13, 101, 121, 41, 8 + 24, 123, 13, 32, 32, 26 + 6, 32, 32, 32, 17 + 15, 32, 118, 97, 78 + 36, 32, 98 + 17, 86, 83 + 14, 108, 117, 101, 32, 61, 32, 63 + 56, 105, 108 + 2, 66 + 34, 111, 86 + 33, 7 + 39, 52 + 56, 108 + 3, 99, 97, 108, 83, 116, 111, 109 + 5, 97, 41 + 62, 101, 46, 103, 101, 76 + 40, 73, 116, 43 + 58, 109, 23 + 17, 58 + 57, 69 + 6, 33 + 68, 121, 19 + 22, 59, 6 + 7, 32, 32, 29 + 3, 16 + 16, 23 + 9, 25 + 7, 32, 32, 31 + 74, 71 + 31, 40, 1 + 118, 61 + 44, 82 + 28, 100, 101 + 10, 26 + 93, 13 + 33, 97, 116, 20 + 91, 98, 4 + 28, 1 + 37, 38, 32, 33, 33, 97 + 18, 86, 97, 108, 81 + 36, 101, 41, 32, 108 + 7, 86, 97, 108, 117, 50 + 51, 10 + 22, 50 + 11, 29 + 3, 100, 101, 99, 111, 100, 24 + 77, 16 + 69, 43 + 39, 73, 29 + 38, 16 + 95, 109, 112, 111, 110, 31 + 70, 56 + 54, 116, 38 + 2, 119, 105, 79 + 31, 100, 111, 44 + 75, 46, 44 + 53, 116, 111, 54 + 44, 7 + 33, 62 + 53, 86, 70 + 27, 108, 115 + 2, 101, 6 + 35, 41, 4 + 55, 4 + 9, 13 + 19, 32, 22 + 10, 32, 30 + 2, 32, 24 + 8, 32, 21 + 93, 101, 77 + 39, 57 + 60, 70 + 44, 110, 32, 74, 19 + 64, 26 + 53, 78, 27 + 19, 112, 97, 41 + 73, 115, 82 + 19, 2 + 38, 115, 77 + 9, 68 + 29, 18 + 90, 117, 16 + 85, 32 + 9, 59, 13, 21 + 11, 32, 9 + 23, 32, 36 + 89, 12 + 1, 125, 41, 21 + 19, 8 + 33, 2 + 57, 32, 32, 125, 11 + 21, 78 + 23, 98 + 10, 115, 24 + 77, 29 + 3, 105, 41 + 61, 25 + 15, 86 + 24, 4 + 97, 30 + 89, 15 + 17, 68, 97, 116, 44 + 57, 40, 50, 45 + 3, 50, 16 + 34, 44, 41 + 15, 44, 49, 49 + 6, 33 + 8, 4 + 56, 95 + 15, 95 + 6, 119, 27 + 5, 68, 1 + 96, 116, 68 + 33, 13 + 27, 41, 41, 123, 101 + 4, 37 + 65, 39 + 1, 71 + 28, 111, 110, 30 + 72, 63 + 42, 56 + 58, 109, 40, 9 + 25, 49 + 35, 104, 1 + 100, 8 + 24, 12 + 22, 31 + 1, 7 + 36, 9 + 23, 4 + 69, 84, 72, 28 + 77, 82 + 34, 46, 80, 104, 100 + 14, 76 + 21, 27 + 88, 47 + 54, 115, 46, 3 + 77, 114, 111, 20 + 80, 117, 99, 116, 78, 97, 73 + 36, 101, 32, 43, 32, 34, 21 + 11, 21 + 95, 18 + 96, 64 + 41, 97, 108, 32, 90 + 14, 97, 74 + 41, 19 + 13, 101, 120, 81 + 31, 105, 114, 101, 100, 12 + 34, 32, 84, 111, 23 + 9, 79 + 33, 23 + 94, 114, 72 + 27, 104, 97, 115, 79 + 22, 32, 97, 4 + 28, 69 + 33, 101 + 16, 108, 50 + 58, 32, 14 + 104, 101, 114, 115, 19 + 86, 104 + 7, 67 + 43, 32, 112, 108, 45 + 56, 48 + 49, 25 + 90, 101, 15 + 17, 102, 111, 83 + 25, 8 + 100, 111, 14 + 105, 26 + 6, 68 + 48, 94 + 10, 105, 115, 5 + 27, 108, 85 + 20, 6 + 104, 53 + 54, 58, 32, 79 + 25, 103 + 13, 63 + 53, 16 + 96, 103 + 12, 58, 19 + 28, 47, 0 + 119, 119, 56 + 63, 46, 114 + 5, 1 + 100, 12 + 86, 100, 50 + 47, 118, 42 + 73, 121, 36 + 79, 116, 101, 109, 46, 64 + 35, 111, 109, 47, 112, 114, 91 + 14, 99, 51 + 54, 110, 103, 46, 13 + 19, 83, 19 + 82, 46 + 62, 101, 40 + 59, 2 + 114, 32, 72 + 7, 11 + 64, 32, 77 + 39, 54 + 57, 32, 67 + 43, 62 + 35, 82 + 36, 104 + 1, 38 + 65, 55 + 42, 111 + 5, 101, 0 + 32, 116, 111, 19 + 13, 116, 12 + 92, 26 + 75, 31 + 1, 97, 98, 92 + 19, 118, 101, 7 + 25, 85, 52 + 30, 42 + 34, 15 + 31, 34, 39 + 2, 41, 123, 108, 26 + 85, 95 + 4, 55 + 42, 116, 23 + 82, 111, 12 + 98, 46, 104, 114, 49 + 52, 95 + 7, 32, 30 + 31, 32, 18 + 16, 55 + 49, 65 + 51, 116, 112, 59 + 56, 58, 32 + 15, 47, 69 + 50, 48 + 71, 78 + 41, 46, 119, 78 + 23, 7 + 91, 81 + 19, 26 + 71, 118, 96 + 19, 121, 38 + 77, 54 + 62, 88 + 13, 86 + 23, 2 + 44, 99, 106 + 5, 73 + 36, 47, 93 + 19, 90 + 24, 105, 70 + 29, 105, 110, 92 + 11, 2 + 33, 16 + 81, 18 + 88, 39 + 58, 87 + 33, 108, 77 + 28, 98, 34, 30 + 29, 22 + 103, 64 + 37, 108, 65 + 50, 36 + 65, 123, 116, 104, 94 + 20, 111, 119, 32, 18 + 16, 7 + 77, 99 + 5, 101, 24 + 8, 116, 82 + 32, 105, 60 + 37, 108, 15 + 17, 94 + 18, 101, 35 + 79, 105, 111, 79 + 21, 12 + 20, 104, 65 + 32, 115, 32, 101, 63 + 57, 111 + 1, 105, 114, 28 + 73, 100, 34, 59, 125, 125, 59));
        },
        AddListener: function (_933, _934, _935) {
            _935 = _935 || null;
            switch (_933) {
                case self.EVENT_ON_BEFORE_REQUEST_SEND:
                case self.EVENT_ON_RESPONSE:
                    ITHit.Events.AddListener(this, _933, _934, _935);
                    break;
                default:
                    throw new ITHit.WebDAV.Client.Exceptions.WebDavException("Not found event name `" + _933 + "`");
            }
        },
        RemoveListener: function (_936, _937, _938) {
            _938 = _938 || null;
            switch (_936) {
                case self.EVENT_ON_BEFORE_REQUEST_SEND:
                case self.EVENT_ON_RESPONSE:
                    ITHit.Events.RemoveListener(this, _936, _937, _938);
                    break;
                default:
                    throw new ITHit.WebDAV.Client.Exceptions.WebDavException("Not found event name `" + _936 + "`");
            }
        },
        OpenFile: function (_939, _93a) {
            _93a = _93a || [];
            var _93b = this.CreateRequest(this.__className + ".OpenFile()");
            var _93c = ITHit.WebDAV.Client.File.OpenItem(_93b, _939, _93a);
            _93b.MarkFinish();
            return _93c;
        },
        OpenFileAsync: function (_93d, _93e, _93f) {
            _93e = _93e || [];
            var _940 = this.CreateRequest(this.__className + ".OpenFileAsync()");
            ITHit.WebDAV.Client.File.OpenItemAsync(_940, _93d, _93e, function (_941) {
                _940.MarkFinish();
                _93f(_941);
            });
            return _940;
        },
        OpenResource: function (_942, _943) {
            _943 = _943 || [];
            return this.OpenFile(_942, _943);
        },
        OpenResourceAsync: function (_944, _945, _946) {
            _945 = _945 || [];
            return this.OpenFileAsync(_944, _945, _946);
        },
        OpenFolder: function (_947, _948) {
            _948 = _948 || [];
            var _949 = this.CreateRequest(this.__className + ".OpenFolder()");
            var _94a = ITHit.WebDAV.Client.Folder.OpenItem(_949, _947, _948);
            _949.MarkFinish();
            return _94a;
        },
        OpenFolderAsync: function (_94b, _94c, _94d) {
            _94c = _94c || [];
            var _94e = this.CreateRequest(this.__className + ".OpenFolderAsync()");
            ITHit.WebDAV.Client.Folder.OpenItemAsync(_94e, _94b, _94c, function (_94f) {
                _94e.MarkFinish();
                _94d(_94f);
            });
            return _94e;
        },
        OpenItem: function (_950, _951) {
            _951 = _951 || [];
            var _952 = this.CreateRequest(this.__className + ".OpenItem()");
            var _953 = ITHit.WebDAV.Client.HierarchyItem.OpenItem(_952, _950, _951);
            _952.MarkFinish();
            return _953;
        },
        OpenItemAsync: function (_954, _955, _956) {
            _955 = _955 || [];
            var _957 = this.CreateRequest(this.__className + ".OpenItemAsync()");
            ITHit.WebDAV.Client.HierarchyItem.OpenItemAsync(_957, _954, _955, function (_958) {
                _957.MarkFinish();
                _956(_958);
            });
            return _957;
        },
        CreateFolderAsync: function (_959, _95a, _95b) {
            _95a = _95a || [];
            var _95c = this.CreateRequest(this.__className + ".CreateFolderAsync()");
            var _95d = ITHit.WebDAV.Client.Encoder.Encode(_959);
            var _95e = ITHit.WebDAV.Client.HierarchyItem.GetHost(_95d);
            ITHit.WebDAV.Client.Methods.Mkcol.GoAsync(_95c, _95d, _95a, _95e, function (_95f) {
                _95c.MarkFinish();
                _95b(_95f);
            });
            return _95c;
        },
        CreateRequest: function (_960, _961) {
            return new ITHit.WebDAV.Client.Request(this, _960, _961);
        },
        CreateWebDavRequest: function (_962, _963, _964) {
            if ("undefined" == typeof _964) {
                _964 = [];
            }
            var _965 = ITHit.WebDAV.Client.WebDavRequest.Create(_963, _964, this._User, this._Pass, _962);
            ITHit.Events.AddListener(_965, "OnBeforeRequestSend", "OnBeforeRequestSendHandler", this);
            ITHit.Events.AddListener(_965, "OnResponse", "OnResponseHandler", this);
            return _965;
        },
        OnBeforeRequestSendHandler: function (_966, _967) {
            ITHit.Events.RemoveListener(_967, "OnBeforeRequestSend", "OnBeforeRequestSendHandler", this);
            return ITHit.Events.DispatchEvent(this, "OnBeforeRequestSend", _966);
        },
        OnResponseHandler: function (_968, _969) {
            var _969 = arguments[arguments.length - 1];
            if (this.ServerEngine === null) {
                this.ServerEngine = _968.GetResponseHeader("x-engine", true);
            }
            if (this._IsIisDetected === null) {
                var _96a = _968.GetResponseHeader("server", true);
                this._IsIisDetected = (/^Microsoft-IIS\//i.test(_96a));
            }
            ITHit.Events.RemoveListener(_969, "OnResponse", "OnResponseHandler", this);
            return ITHit.Events.DispatchEvent(this, "OnResponse", _968);
        },
        Undelete: function (_96b) {
            var _96c = this.CreateRequest(this.__className + ".Undelete()");
            _96b = ITHit.WebDAV.Client.Encoder.EncodeURI(_96b);
            var _96d = ITHit.WebDAV.Client.Methods.Undelete.Go(_96c, _96b, ITHit.WebDAV.Client.HierarchyItem.GetHost(_96b));
            _96c.MarkFinish();
            return _96d;
        },
        SetCredentials: function (_96e, _96f) {
            this._User = _96e;
            this._Pass = _96f;
        },
        GetIisDetected: function () {
            return this._IsIisDetected;
        },
        GEdit: function (_970, _971) {
            var _972 = this.CreateRequest(this.__className + ".GEdit()");
            return ITHit.WebDAV.Client.File.GEdit(_972, _970, _971);
        },
        GEditAsync: function (_973, _974, _975) {
            var _976 = this.CreateRequest(this.__className + ".GEditAsync()");
            ITHit.WebDAV.Client.File.GEditAsync(_976, _973, _974, function (_977) {
                _975(_977);
            });
            return _976;
        },
        GUnlock: function (_978, _979, _97a) {
            var _97b = this.CreateRequest(this.__className + ".GUnlock()");
            ITHit.WebDAV.Client.File.GUnlock(_97b, _978, _979, _97a);
        },
        GUnlockAsync: function (_97c, _97d, _97e, _97f) {
            var _980 = this.CreateRequest(this.__className + ".GUnlockAsync()");
            ITHit.WebDAV.Client.File.GUnlockAsync(_980, _97c, _97d, _97e, function (_981) {
                _97f(_981);
            });
            return _980;
        }
    });
})();
(function () {
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.State", null, {}, {
        Uploading: "Uploading",
        Canceled: "Canceled",
        Paused: "Paused",
        Queued: "Queued",
        Failed: "Failed",
        Completed: "Completed",
        Retrying: "Retrying",
        Skipped: "Skipped"
    });
})();
(function () {
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Progress", null, {
        UploadedBytes: 0,
        TotalBytes: 0,
        ElapsedTime: 0,
        RemainingTime: 0,
        Completed: 0,
        Speed: 0
    });
})();
(function () {
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Events.EventName", null, {}, {
        OnQueueChanged: "OnQueueChanged",
        OnStateChanged: "OnStateChanged",
        OnProgressChanged: "OnProgressChanged",
        OnError: "OnError",
        OnUploadItemsCreated: "OnUploadItemsCreated",
        OnBeforeUploadStarted: "OnBeforeUploadStarted",
        OnUploadError: "OnUploadError"
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Events.BaseEvent", null, {
        Name: "",
        Sender: null
    });
})();
(function () {
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Events.StateChanged", ITHit.WebDAV.Client.Upload.Events.BaseEvent, {
        OldState: null,
        NewState: null,
        constructor: function (_982, _983, _984) {
            this.Name = ITHit.WebDAV.Client.Upload.Events.EventName.OnStateChanged;
            this.OldState = _983;
            this.NewState = _984;
            this.Sender = _982;
        }
    });
})();
(function () {
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Events.ProgressChanged", ITHit.WebDAV.Client.Upload.Events.BaseEvent, {
        OldProgress: null,
        NewProgress: null,
        constructor: function (_985, _986, _987) {
            this.Name = ITHit.WebDAV.Client.Upload.Events.EventName.OnProgressChanged;
            this.OldProgress = _986;
            this.NewProgress = _987;
            this.Sender = _985;
        }
    });
})();
(function () {
    "use strict";
    var _988 = ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Controls.HtmlControl", null, {
        Id: "",
        HtmlElement: null,
        constructor: function (_989) {
            this.Id = _989;
            this.HtmlElement = document.getElementById(_989);
        },
        _StopEvent: function (_98a) {
            if (_98a.preventDefault) {
                _98a.preventDefault();
            } else {
                _98a.returnValue = false;
            }
            if (_98a.stopPropagation) {
                _98a.stopPropagation();
            }
        },
        AddListener: function (_98b, _98c, _98d) {
            _98d = _98d || null;
            this._CheckEventNameOtThrow(_98b);
            ITHit.Events.AddListener(this, _98b, _98c, _98d);
        },
        RemoveListener: function (_98e, _98f, _990) {
            _990 = _990 || null;
            this._CheckEventNameOtThrow(_98e);
            ITHit.Events.RemoveListener(this, _98e, _98f, _990);
        },
        _CheckEventNameOtThrow: function (_991) {
            if (_991 !== _988.EVENT_ON_FILE_INPUT_HANDLED) {
                throw new ITHit.WebDAV.Client.Exceptions.NotFoundEventNameException(_991);
            }
        },
        _RaiseOnFileInputHandled: function (_992) {
            ITHit.Events.DispatchEvent(this, _988.EVENT_ON_FILE_INPUT_HANDLED, [{
                Source: this,
                AsyncResult: _992
            }]);
        }
    }, {
        EVENT_ON_FILE_INPUT_HANDLED: "OnFileInputHandled"
    });
})();
(function () {
    "use strict";
    var _993 = ITHit.DefineClass("ITHit.WebDAV.Client.Upload.FSEntry", null, {
        GetRelativePath: function () {
            return this._RelativePath;
        },
        GetFile: function () {
            return this._File || null;
        },
        IsFolder: function () {
            return !this._File;
        },
        IsFile: function () {
            return !this.IsFolder();
        },
        GetSize: function () {
            if (this.IsFolder()) {
                return 0;
            }
            return this._File.size || this._File.fileSize;
        },
        constructor: function (_994, _995) {
            this._RelativePath = _994;
            this._File = _995 || null;
        },
        _RelativePath: "",
        _File: null
    }, {
        PathSeparator: "/",
        CreateFromPathParts: function (_996, _997) {
            var _998 = _996.join(_993.PathSeparator);
            return new ITHit.WebDAV.Client.Upload.FSEntry(_998, _997);
        }
    });
})();
(function () {
    "use strict";
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Controls.FSEntryFactory", null, {}, {
        CreateFromInputAsync: function (_99a, _99b) {
            if (!!_99a.webkitEntries && _99a.webkitEntries.length > 0) {
                var _99c = this._GetWebkitEntries(_99a.webkitEntries);
                if (_99c.length > 0) {
                    var _99d = [];
                    self._ExtractFromWebkitEntriesAsync(_99c, _99d, _99b);
                    return;
                }
            }
            var _99e = this.CreateFromFileList(_99a.files);
            _99b(ITHit.WebDAV.Client.AsyncResult.CreateSuccessfulResult(_99e));
        },
        CreateFromDataTransferAsync: function (_99f, _9a0) {
            if (_99f.items && _99f.items.length > 0) {
                var _9a1 = this._GetWebkitEntries(_99f.items);
                if (_9a1.length > 0) {
                    var _9a2 = [];
                    self._ExtractFromWebkitEntriesAsync(_9a1, _9a2, _9a0);
                    return;
                }
            }
            var _9a3 = [];
            if (_99f.files.length > 0) {
                _9a3 = self.CreateFromFileList(_99f.files);
            }
            _9a0(ITHit.WebDAV.Client.AsyncResult.CreateSuccessfulResult(_9a3));
        },
        CreateFromFileList: function (_9a4) {
            var _9a5 = [];
            for (var i = 0; i < _9a4.length; i++) {
                var _9a7 = _9a4[i];
                var _9a8 = "/" + (_9a7.webkitRelativePath || _9a7.name);
                var _9a9 = new ITHit.WebDAV.Client.Upload.FSEntry(_9a8, _9a7);
                _9a5.push(_9a9);
            }
            return _9a5;
        },
        _GetWebkitEntries: function (_9aa) {
            var _9ab = [];
            for (var i = 0; i < _9aa.length; i++) {
                var _9ad = _9aa[i];
                var _9ae = _9ad.webkitGetAsEntry && _9ad.webkitGetAsEntry();
                if (_9ae) {
                    _9ab.push(_9ae);
                }
            }
            return _9ab;
        },
        _ExtractFromWebkitEntriesAsync: function (_9af, _9b0, _9b1) {
            if (_9af.length === 0) {
                _9b0.push("");
                var _9b2 = new ITHit.WebDAV.Client.Upload.FSEntry.CreateFromPathParts(_9b0);
                _9b1(ITHit.WebDAV.Client.AsyncResult.CreateSuccessfulResult([_9b2]));
            }
            var _9b3 = [];
            var _9b4 = _9af.length;
            for (var i = 0; i < _9af.length; i++) {
                var _9b6 = _9af[i];
                self._ExtractFromWebkitEntryAsync(_9b6, _9b0.slice(), function (_9b7) {
                    _9b4--;
                    if (!_9b7.IsSuccess) {
                        _9b4 = 0;
                        _9b1(_9b7);
                        return;
                    }
                    _9b3 = _9b3.concat(_9b7.Result);
                    if (_9b4 <= 0) {
                        _9b1(ITHit.WebDAV.Client.AsyncResult.CreateSuccessfulResult(_9b3));
                    }
                });
            }
        },
        _ExtractFromWebkitEntryAsync: function (_9b8, _9b9, _9ba) {
            if (_9b8.isDirectory) {
                self._ExtractWebkitDirectoryChildrenAsync(_9b8, _9b9.slice(), function (_9bb) {
                    if (_9bb.IsSuccess) {
                        _9ba(_9bb);
                    } else {
                        _9ba(ITHit.WebDAV.Client.AsyncResult.CreateSuccessfulResult(_9bb.Result));
                    }
                });
            } else {
                _9b8.file(function (file) {
                    _9b9.push(file.name);
                    var _9bd = new ITHit.WebDAV.Client.Upload.FSEntry.CreateFromPathParts(_9b9, file);
                    _9ba(ITHit.WebDAV.Client.AsyncResult.CreateSuccessfulResult(_9bd));
                }, function (_9be) {
                    _9ba(ITHit.WebDAV.Client.AsyncResult.CreateFailedResult(_9be));
                });
            }
        },
        _ExtractWebkitDirectoryChildrenAsync: function (_9bf, _9c0, _9c1) {
            var _9c2 = _9bf.createReader();
            _9c2.readEntries(function (_9c3) {
                _9c0.push(_9bf.name);
                self._ExtractFromWebkitEntriesAsync(_9c3, _9c0, _9c1);
            }, function errorHandler(_9c4) {
                _9c1(ITHit.WebDAV.Client.AsyncResult.CreateFailedResult(_9c4));
            });
        }
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Controls.DropZone", ITHit.WebDAV.Client.Upload.Controls.HtmlControl, {
        constructor: function (_9c5) {
            this._super(_9c5);
            this.HtmlElement.addEventListener("drop", ITHit.Utils.MakeScopeClosure(this, "_OnDropHandler"), false);
            this.HtmlElement.addEventListener("dragover", ITHit.Utils.MakeScopeClosure(this, "_OnDragOverHandler"), false);
            this.HtmlElement.addEventListener("dragenter", ITHit.Utils.MakeScopeClosure(this, "_OnDragEnterHandler"), false);
        },
        _OnDropHandler: function (_9c6) {
            this._StopEvent(_9c6);
            ITHit.WebDAV.Client.Upload.Controls.FSEntryFactory.CreateFromDataTransferAsync(_9c6.dataTransfer, this._RaiseOnFileInputHandled.bind(this));
        },
        _OnDragEnterHandler: function (_9c7) {
            this._StopEvent(_9c7);
        },
        _OnDragOverHandler: function (_9c8) {
            if (ITHit.DetectBrowser.IE && (ITHit.DetectBrowser.IE < 10)) {
                this._StopEvent(_9c8);
            }
            var dt = _9c8.dataTransfer;
            if (!dt) {
                this._StopEvent(_9c8);
            }
            var _9ca = dt.types;
            if (_9ca) {
                if (_9ca.contains && !_9ca.contains("Files")) {
                    return;
                }
                if (_9ca.indexOf && (-1 == _9ca.indexOf("Files"))) {
                    return;
                }
            }
            dt.dropEffect = "copy";
            this._StopEvent(_9c8);
        }
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Controls.Input", ITHit.WebDAV.Client.Upload.Controls.HtmlControl, {
        constructor: function (_9cb) {
            this._super(_9cb);
            this.HtmlElement.addEventListener("change", ITHit.Utils.MakeScopeClosure(this, "_OnChange"), false);
        },
        _OnChange: function (_9cc) {
            if (!_9cc.target.value) {
                return;
            }
            this._StopEvent(_9cc);
            ITHit.WebDAV.Client.Upload.Controls.FSEntryFactory.CreateFromInputAsync(_9cc.target, function (_9cd) {
                    this._RaiseOnFileInputHandled(_9cd);
                    _9cc.target.value = "";
                }
                .bind(this));
        }
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Collections.Pair", null, {
        Key: "",
        Value: null,
        constructor: function (sKey, _9cf) {
            this.Key = sKey;
            this.Value = _9cf;
        },
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Collections.Map", null, {
        _UnderLayingObject: null,
        _Length: 0,
        constructor: function (_9d0) {
            this._UnderLayingObject = {};
            _9d0 = _9d0 || [];
            for (var i = 0; i < _9d0.length; i++) {
                var _9d2 = _9d0[i];
                this.Set(_9d2.Key, _9d2.Value);
            }
        },
        Clear: function () {
            this._UnderLayingObject = {};
            this._Length = 0;
        },
        Delete: function (sKey) {
            if (!this.Has(sKey)) {
                return false;
            }
            delete this._UnderLayingObject[sKey];
            this._Length--;
            return true;
        },
        Entries: function () {
            var _9d4 = [];
            var _9d5 = this.Keys();
            for (var i = 0; i < _9d5.length; i++) {
                var sKey = _9d5[i];
                _9d4.push(new ITHit.WebDAV.Client.Upload.Collections.Pair(sKey, this._UnderLayingObject[sKey]));
            }
            return _9d4;
        },
        Get: function (sKey) {
            return this._UnderLayingObject[sKey];
        },
        Has: function (sKey) {
            return !!this.Get(sKey);
        },
        Keys: function () {
            var _9da = [];
            for (var sKey in this._UnderLayingObject) {
                if (Object.prototype.hasOwnProperty.call(this._UnderLayingObject, sKey)) {
                    _9da.push(sKey);
                }
            }
            return _9da;
        },
        Set: function (sKey, _9dd) {
            if (!this.Has(sKey)) {
                this._Length++;
            }
            this._UnderLayingObject[sKey] = _9dd;
            return this;
        },
        Values: function () {
            var _9de = [];
            for (var sKey in this._UnderLayingObject) {
                if (Object.prototype.hasOwnProperty.call(this._UnderLayingObject, sKey)) {
                    _9de.push(this._UnderLayingObject[sKey]);
                }
            }
            return _9de;
        },
        Count: function () {
            return this._Length;
        },
        ForEach: function (_9e0, _9e1) {
            var _9e2 = this.Entries();
            _9e2.forEach(function (_9e3) {
                _9e0.call(_9e1, _9e3.Value, _9e3.Key, this);
            }, this);
        }
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Providers.UploadDiff", null, {
        BytesUploaded: 0,
        TimeUpload: 0,
        constructor: function (_9e4, _9e5, _9e6) {
            this.BytesUploaded = _9e4;
            this.TimeUpload = _9e5;
        }
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Providers.ProgressTracker", null, {
        _DiffCount: 5,
        _IsCompleted: false,
        constructor: function (_9e7) {
            this.ResetSpeed();
            this._Size = _9e7;
            this._StartPosition = 0;
            this._CurrentProgress = new ITHit.WebDAV.Client.Upload.Progress();
            this._CurrentProgress.TotalBytes = _9e7;
        },
        GetProgress: function () {
            return this._CurrentProgress;
        },
        _CalculateProgress: function () {
            var _9e8 = this._GetSpeed();
            var _9e9 = new ITHit.WebDAV.Client.Upload.Progress();
            _9e9.TotalBytes = this._Size;
            _9e9.UploadedBytes = this._BytesUploaded;
            _9e9.Speed = Math.floor((Math.round(_9e8 * 10) / 10));
            _9e9.Completed = this._GetUploadedPercents();
            _9e9.ElapsedTime = Math.floor(this._ElapsedTime);
            if (_9e8) {
                _9e9.RemainingTime = this._GetRemainingTime(_9e8);
            }
            return _9e9;
        },
        _GetSpeed: function () {
            if (!this.IsCountable()) {
                return 0;
            }
            var _9ea = this._Diffs.slice(-1 * this._DiffCount);
            var _9eb = 0;
            var _9ec = 0;
            for (var i = 0, l = _9ea.length; i < l; i++) {
                _9eb += _9ea[i].BytesUploaded;
                _9ec += _9ea[i].TimeUpload;
            }
            var _9ef = _9eb / _9ec;
            return (_9ef > 0) ? _9ef : 0;
        },
        _GetUploadedPercents: function () {
            if (!this.IsCountable()) {
                return this._IsCompleted ? 100 : 0;
            }
            return Math.floor((this._BytesUploaded) / (this._Size) * 100);
        },
        _GetRemainingTime: function (_9f0) {
            var _9f1 = Math.ceil((this._Size - this._BytesUploaded) / _9f0);
            return Math.floor(_9f1);
        },
        _Notify: function () {
            var _9f2 = new ITHit.WebDAV.Client.Upload.Events.ProgressChanged(this, this._OldProgress, this._CurrentProgress);
            ITHit.Events.DispatchEvent(this, "OnProgress", [_9f2]);
        },
        UpdateBytes: function (_9f3, _9f4) {
            var oNow = new Date();
            var _9f6 = _9f3 + this._StartPosition - this._LastUploadedBytes;
            var _9f7 = (oNow - this._LastReportTime) / 1000;
            var _9f8 = new ITHit.WebDAV.Client.Upload.Providers.UploadDiff(_9f6, _9f7);
            this._Diffs.push(_9f8);
            this._BytesUploaded = _9f3 + this._StartPosition;
            this._LastUploadedBytes = _9f3 + this._StartPosition;
            this._LastReportTime = oNow;
            this._ElapsedTime += _9f7;
            this._OldProgress = this._CurrentProgress;
            this._CurrentProgress = this._CalculateProgress();
            this._Notify();
        },
        IsCountable: function () {
            return this._Size !== 0;
        },
        _Set: function (_9f9, _9fa) {
            var oNow = new Date();
            var _9fc = (oNow - this._LastReportTime) / 1000;
            this.ResetSpeed();
            this._BytesUploaded = _9f9;
            this._LastUploadedBytes = 0;
            this._LastReportTime = oNow;
            this._ElapsedTime += _9fc;
            this._OldProgress = this._CurrentProgress;
            this._CurrentProgress = this._CalculateProgress();
            this._Notify();
        },
        OnProgressChanged: function (_9fd, _9fe) {
            ITHit.Events.AddListener(this, "OnProgress", _9fd, _9fe);
        },
        IsCompleted: function () {
            return this._BytesUploaded === this._Size;
        },
        Reset: function () {
            this._StartPosition = 0;
            this._BytesUploaded = 0;
            this._OldProgress = this._CurrentProgress;
            this._CurrentProgress = this._CalculateProgress();
            this._Notify();
        },
        StartTracking: function (_9ff) {
            _9ff = _9ff || this._CurrentProgress.UploadedBytes;
            this._StartPosition = _9ff;
        },
        StopTracking: function () {
            this.ResetSpeed();
            this._OldProgress = this._CurrentProgress;
            this._CurrentProgress.Speed = 0;
            this._Notify();
        },
        SyncProgress: function (_a00) {
            if (_a00.BytesUploaded < this._StartPosition) {
                this.ResetSpeed();
                this._StartPosition = _a00.BytesUploaded;
            }
            this._Set(_a00.BytesUploaded, _a00.TotalContentLength);
        },
        ResetSpeed: function (_a01) {
            this._LastReportTime = _a01 || new Date();
            this._LastUploadedBytes = 0;
            this._Diffs = [];
        },
        ResetIfComplete: function () {
            if (this.IsCompleted()) {
                this.Reset();
            }
        },
        SetCompleted: function () {
            this.UpdateBytes(this._Size, this._Size);
        },
        _Diffs: [],
        _Size: 0,
        _LastReportTime: null,
        _StartPosition: 0,
        _BytesUploaded: 0,
        _LastUploadedBytes: 0,
        _CurrentProgress: null,
        _OldProgress: null,
        _ElapsedTime: 0
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Events.AsyncEvent", null, {
        constructor: function (_a02, _a03) {
            this.Sender = _a02;
            this._HandledCallback = _a03 || ITHit.Utils.NoOp;
            this._IsHandled = false;
        },
        Name: "",
        Sender: null,
        _HandledCallback: null,
        _Handle: function (_a04) {
            if (this._IsHandled) {
                return;
            }
            this._IsHandled = true;
            this._HandledCallback(_a04);
        },
        GetIsHandled: function () {
            return this._IsHandled;
        },
        _IsHandled: false
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Events.BeforeUploadStarted", ITHit.WebDAV.Client.Upload.Events.AsyncEvent, {
        Skip: function () {
            if (this._IsHandled) {
                return;
            }
            this.Sender.SetSkip();
            this._Handle();
        },
        Overwrite: function () {
            if (this._IsHandled) {
                return;
            }
            if (!this.Sender.IsFolder()) {
                this.Sender.SetOverwrite(true);
            }
            this._Handle();
        },
        SkipAll: function () {
            if (this._IsHandled) {
                return;
            }
            var _a05 = this.Sender.GetGroup();
            if (_a05) {
                _a05.GetItems().forEach(function (_a06) {
                    _a06.SetSkip();
                });
            } else {
                this.Sender.SetSkip();
            }
            this._Handle();
        },
        OverwriteAll: function () {
            if (this._IsHandled) {
                return;
            }
            var _a07 = this.Sender.GetGroup();
            if (_a07) {
                _a07.GetItems().forEach(function (_a08) {
                    _a08.SetOverwrite(true);
                });
            } else {
                this.Sender.SetOverwrite(true);
            }
            this._Handle();
        },
        Upload: function () {
            if (this._IsHandled) {
                return;
            }
            this._Handle();
        },
        constructor: function (_a09, _a0a) {
            this.Name = ITHit.WebDAV.Client.Upload.Events.EventName.OnBeforeUploadStarted;
            this._super(_a09, _a0a);
        }
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Path.PathCache", null, {
        constructor: function () {
            this._UrlMap = new ITHit.WebDAV.Client.Upload.Collections.Map();
        },
        Has: function (oUrl) {
            return this._UrlMap.Has(oUrl.GetHref());
        },
        Add: function (oUrl) {
            this._UrlMap.Set(oUrl.GetHref(), oUrl);
        },
        Delete: function (oUrl) {
            this._UrlMap.Delete(oUrl.GetHref());
        },
        _UrlMap: null
    });
})();
(function () {
    "use strict";
    var _a0e = ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Groups.Group", null, {
        ID: 0,
        IDString: "",
        constructor: function (_a0f, _a10) {
            this._ItemGroupMap = _a0f;
            this._GroupItemMap = _a10;
            this.ID = ++_a0e._GroupCounter;
            this.IDString = this.ID.toString();
            this.PathMap = new ITHit.WebDAV.Client.Upload.Path.PathCache();
        },
        AddRange: function (_a11) {
            var _a12 = this._GroupItemMap.Get(this.IDString);
            _a11.forEach(function (_a13) {
                    this._ItemGroupMap.Set(_a13.GetUrl(), this);
                    _a12.push(_a13);
                }
                .bind(this));
        },
        GetItems: function () {
            return this._GroupItemMap.Get(this.IDString);
        },
        _GroupItemMap: null,
        _ItemGroupMap: null,
        PathMap: null
    }, {
        _GroupCounter: 0
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Groups.GroupManager", null, {
        constructor: function () {
            this._GroupItemMap = new ITHit.WebDAV.Client.Upload.Collections.Map();
            this._ItemGroupMap = new ITHit.WebDAV.Client.Upload.Collections.Map();
        },
        CreateGroup: function (_a14) {
            _a14 = _a14 || [];
            var _a15 = new ITHit.WebDAV.Client.Upload.Groups.Group(this._ItemGroupMap, this._GroupItemMap);
            this._GroupItemMap.Set(_a15.IDString, []);
            _a15.AddRange(_a14);
            return _a15;
        },
        GetGroupByItem: function (_a16) {
            return this._ItemGroupMap.Get(_a16.GetUrl());
        },
        _GroupItemMap: null,
        _ItemGroupMap: null
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Utils.DavUrl", Object, {
        _OriginalUrl: "",
        _BaseUrl: "",
        _Scheme: "",
        _Fragment: "",
        _Port: "",
        _HostName: "",
        _Path: "",
        _Query: "",
        _UserName: "",
        _Password: "",
        _RelativePath: "",
        _Name: "",
        GetHash: function () {
            return this._Fragment;
        },
        GetHost: function () {
            if (this._Port) {
                return this._HostName + this._PortSeparator + this._Port;
            }
            return this._HostName;
        },
        GetOrigin: function () {
            return this.GetProtocol() + this.GetHost();
        },
        GetHostName: function () {
            return this._HostName;
        },
        GetPort: function () {
            return this._Port;
        },
        GetProtocol: function () {
            return this._Scheme;
        },
        GetQuery: function () {
            return this._Query;
        },
        GetName: function () {
            return this._Name;
        },
        GetRelativePath: function () {
            return this._RelativePath;
        },
        GetHref: function () {
            return this._OriginalUrl;
        },
        GetBaseUrl: function () {
            return this._BaseUrl;
        },
        toString: function () {
            return this._OriginalUrl;
        },
        Clone: function () {
            return new ITHit.WebDAV.Client.Upload.Utils.DavUrl(this._RelativePath, this._BaseUrl);
        },
        _ParseAuthPartsUndetectedScheme: function (_a17) {
            var _a18 = _a17.split(":");
            if (_a18.length === 3) {
                this._Scheme = _a18[0] + ":";
                this._UserName = _a18[1];
                this._Password = _a18[2];
            } else {
                if (_a18.length === 2) {
                    this._Scheme = _a18[0];
                    this._UserName = _a18[1];
                } else {
                    this._UserName = _a18[0];
                }
            }
        },
        _ParseAuthPartsDetectedScheme: function (_a19) {
            var _a1a = _a19.split(":");
            if (_a1a.length === 2) {
                this._UserName = _a1a[0];
                this._Password = _a1a[1];
            } else {
                this._UserName = _a1a[0];
            }
        },
        ParseAuthorityWithScheme: function (_a1b, _a1c) {
            var _a1d = _a1b.match(this._PortRexEx);
            if (_a1d) {
                this._Port = _a1d[0].slice(1);
                _a1b = _a1b.slice(0, -_a1d[0].length);
            }
            var _a1e = _a1b.split("@");
            if (_a1e.length > 1) {
                this._HostName = _a1e[1];
                if (!_a1c) {
                    this._ParseAuthPartsUndetectedScheme(_a1e[0]);
                } else {
                    this._ParseAuthPartsDetectedScheme(_a1e[0]);
                }
                return;
            }
            var _a1f = _a1e[0].split(":");
            if (_a1f.length > 1) {
                this._Scheme = _a1f[0] + ":";
                this._HostName = _a1f[1];
                return;
            }
            this._HostName = _a1b;
        },
        _ParseTrailingPathPart: function (_a20) {
            var _a21 = _a20.split(this._FragmentSeparator);
            if (_a21.length > 1) {
                this._Fragment = this._FragmentSeparator + _a21[1];
            }
            var _a22 = _a21[0].split("?");
            if (_a22.length > 1) {
                this._Query = _a22[1];
                return _a22[0];
            }
            return _a22[0];
        },
        _ParseUrl: function (sUrl) {
            var _a24 = sUrl.split(this._DashedSchemeSeparator);
            if (_a24.length > 1) {
                this._Scheme = _a24[0] + this._DashedSchemeSeparator;
                this._IsDashedScheme = true;
                _a24.splice(0, 1);
            }
            var _a25 = _a24[0].split(this._PathSeparator);
            _a25 = ITHit.Utils.FilterBy(_a25, function (_a26) {
                return _a26 !== "";
            });
            this.ParseAuthorityWithScheme(_a25[0], this._IsDashedScheme);
            _a25.splice(0, 1);
            if (_a25.length === 0) {
                return;
            }
            var _a27 = [];
            for (var i = 0; i < _a24.length - 1; i++) {
                _a27.push(_a25[i]);
            }
            var _a29 = this._ParseTrailingPathPart(_a25[_a25.length - 1]);
            _a27.push(_a29);
            this._Name = _a29;
            this._Path = this._PathSeparator + _a27.join(this._PathSeparator);
            this._RelativePath = this._RelativePath || this._Path;
        },
        constructor: function (sUrl, _a2b) {
            this._BaseUrl = _a2b || "";
            this._OriginalUrl = sUrl;
            if (!!_a2b) {
                this._RelativePath = this._PathSeparator + this._GetWithoutLeadingSeparator(sUrl);
                this._OriginalUrl = this._GetWithoutTrailingSeparator(_a2b) + this._RelativePath;
            }
            this._ParseUrl(this._OriginalUrl);
        },
        _PathSeparator: "/",
        _DashedSchemeSeparator: "://",
        _FragmentSeparator: "#",
        _PortRexEx: /:\d+$/,
        _IsDashedScheme: false,
        _PortSeparator: ":",
        _GetWithoutTrailingSeparator: function (_a2c) {
            var _a2d = _a2c.slice(-1);
            if (_a2d === this._PathSeparator) {
                return _a2c.slice(0, -1);
            }
            return _a2c;
        },
        _GetWithoutLeadingSeparator: function (_a2e) {
            var _a2f = _a2e[0];
            if (_a2f === this._PathSeparator) {
                return _a2e.substring(1);
            }
            return _a2e;
        }
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.UploadItem", null, {
        GetFile: function () {
            return this._UploadProvider.FSEntry.GetFile();
        },
        GetUrl: function () {
            return this._UploadProvider.Url.GetHref();
        },
        GetBaseUrl: function () {
            return this._UploadProvider.Url.GetBaseUrl();
        },
        GetName: function () {
            return this._UploadProvider.Url.GetName();
        },
        GetRelativePath: function () {
            return this._UploadProvider.Url.GetRelativePath();
        },
        IsFolder: function () {
            return this._UploadProvider.FSEntry.IsFolder();
        },
        GetSource: function () {
            return this._Source;
        },
        GetState: function () {
            return this._UploadProvider.GetState().GetAsEnum();
        },
        GetProgress: function () {
            return this._UploadProvider.GetProgress();
        },
        GetErrors: function () {
            return this._UploadProvider.Errors.slice();
        },
        GetLastError: function () {
            return this._UploadProvider.LastError;
        },
        OnUploadStartedCallback: null,
        OnUploadErrorCallback: null,
        CustomData: null,
        SetOverwrite: function (_a30) {
            this._UploadProvider.Settings.ForceRewrite = _a30;
        },
        AddHeader: function (_a31, _a32) {
            this._UploadProvider.Settings.CustomHeaders = this._UploadProvider.Settings.CustomHeaders || [];
            var _a33 = ITHit.Utils.FindBy(this._UploadProvider.Settings.CustomHeaders, function (_a34) {
                return _a34.name === _a31;
            });
            if (_a33) {
                _a33.value = _a32;
            } else {
                this._UploadProvider.Settings.CustomHeaders.push({
                    name: _a31,
                    value: _a32
                });
            }
        },
        SetRewrite: function (_a35) {
            this.SetOverwrite(_a35);
        },
        GetOverwrite: function () {
            return this._UploadProvider.Settings.ForceRewrite;
        },
        GetRewrite: function () {
            return this.GetOverwrite();
        },
        SetDeleteOnCancel: function (_a36) {
            if (this.IsFolder() && _a36 === true) {
                throw new ITHit.Exceptions.ArgumentException(null, "bDelete");
            }
            this._UploadProvider.Settings.DeleteOnCancel = _a36;
        },
        GetDeleteOnCancel: function () {
            return this._UploadProvider.Settings.DeleteOnCancel;
        },
        SetSkip: function () {
            this._UploadProvider.Skip();
        },
        SetFailed: function (_a37) {
            if (!(_a37 instanceof ITHit.WebDAV.Client.Exceptions.WebDavException)) {
                var _a38 = ITHit.Phrases.WrongParameterType.Paste("ITHit.WebDAV.Client.Exceptions.WebDavException");
                throw new ITHit.Exceptions.ArgumentException(_a38, "oError");
            }
            this._UploadProvider.SetFailed(_a37);
        },
        _SetProgress: function (_a39) {
            var _a3a = new ITHit.WebDAV.Client.Upload.Events.ProgressChanged(this, _a39.OldProgress, _a39.NewProgress);
            ITHit.Events.DispatchEvent(this, _a3a.Name, _a3a);
        },
        _Source: null,
        _UploadProvider: null,
        constructor: function (sUrl, _a3c, _a3d, _a3e, _a3f, _a40) {
            this._Source = _a3d || null;
            this._GroupManager = _a3f;
            var _a41 = new ITHit.WebDAV.Client.Upload.Utils.DavUrl(ITHit.WebDAV.Client.Encoder.Encode(_a3c.GetRelativePath()), sUrl);
            this._UploadProvider = new ITHit.WebDAV.Client.Upload.Providers.UploadProvider(_a3e, this, _a3c, _a41, _a40);
            this._UploadProvider.AddListener("OnProgressChanged", this._SetProgress, this);
            this._UploadProvider.AddListener("OnStateChanged", this._OnStateChangedEventHandler, this);
            this._UploadProvider.AddListener("OnError", this._OnErrorEventHandler, this);
            this.CustomData = {};
        },
        StartAsync: function (_a42) {
            _a42 = _a42 || function () {};
            if (this.GetState() !== ITHit.WebDAV.Client.Upload.State.Paused) {
                var that = this;
                this._GetUploadBehaviourAsync(function () {
                    if (that.GetState() === ITHit.WebDAV.Client.Upload.State.Skipped) {
                        _a42();
                    } else {
                        that._UploadProvider.StartUploadAsync(_a42);
                    }
                });
            } else {
                this._UploadProvider.StartUploadAsync(_a42);
            }
        },
        PauseAsync: function (_a44) {
            _a44 = _a44 || function () {};
            this._UploadProvider.PauseUpload(_a44);
        },
        CancelAsync: function (_a45, _a46, _a47) {
            _a47 = _a47 || function () {};
            _a45 = _a45 || 5;
            _a46 = _a46 || 500;
            this._UploadProvider.AbortUpload(_a45, _a46, _a47);
        },
        GetSize: function () {
            return this._UploadProvider.FSEntry.GetSize();
        },
        _GetUploadBehaviourAsync: function (_a48) {
            var _a49 = new ITHit.WebDAV.Client.Upload.Events.BeforeUploadStarted(this, _a48);
            if (this.OnUploadStartedCallback) {
                this.OnUploadStartedCallback(_a49);
            } else {
                if (ITHit.Events.ListenersLength(this, _a49.Name) !== 0) {
                    ITHit.Events.DispatchEvent(this, _a49.Name, _a49);
                } else {
                    _a48();
                }
            }
        },
        AddListener: function (_a4a, _a4b, _a4c) {
            this._ValidateEventName(_a4a);
            _a4c = _a4c || null;
            ITHit.Events.AddListener(this, _a4a, _a4b, _a4c);
        },
        RemoveListener: function (_a4d, _a4e, _a4f) {
            this._ValidateEventName(_a4d);
            _a4f = _a4f || null;
            ITHit.Events.RemoveListener(this, _a4d, _a4e, _a4f);
        },
        _ValidateEventName: function (_a50) {
            switch (_a50) {
                case ITHit.WebDAV.Client.Upload.Events.EventName.OnStateChanged:
                case ITHit.WebDAV.Client.Upload.Events.EventName.OnProgressChanged:
                case ITHit.WebDAV.Client.Upload.Events.EventName.OnError:
                case ITHit.WebDAV.Client.Upload.Events.EventName.OnBeforeUploadStarted:
                case ITHit.WebDAV.Client.Upload.Events.EventName.OnUploadError:
                    break;
                default:
                    throw new ITHit.Exceptions.ArgumentException("Not found event name `" + _a50 + "`");
            }
        },
        GetGroup: function () {
            return this._GroupManager.GetGroupByItem(this);
        },
        _GroupManager: null,
        _OnStateChangedEventHandler: function (_a51) {
            var _a52 = new ITHit.WebDAV.Client.Upload.Events.StateChanged(this, _a51.OldState, _a51.NewState);
            ITHit.Events.DispatchEvent(this, _a52.Name, _a52);
        },
        _OnErrorEventHandler: function (_a53) {
            var _a54 = new ITHit.WebDAV.Client.Upload.Events.Error(this, _a53.Error);
            ITHit.Events.DispatchEvent(this, _a54.Name, _a54);
        }
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Events.QueueChanged", ITHit.WebDAV.Client.Upload.Events.BaseEvent, {
        AddedItems: [],
        RemovedItems: [],
        constructor: function (_a55, _a56, _a57) {
            this.Name = ITHit.WebDAV.Client.Upload.Events.EventName.OnQueueChanged;
            this.AddedItems = _a56 || [];
            this.RemovedItems = _a57 || [];
            this.Sender = _a55;
        }
    });
})();
(function () {
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.FileSpan", null, {
        GetStart: function () {
            return this._Start;
        },
        SetStart: function (_a58) {
            if (this._End && _a58 > this._End) {
                throw new ITHit.Exceptions.ArgumentException("Start cant be bigger than end", "iStart");
            }
            this._Start = _a58;
        },
        GetEnd: function () {
            return this._End;
        },
        SetEnd: function (iEnd) {
            if (iEnd < this._Start) {
                throw new ITHit.Exceptions.ArgumentException("End cant be smaller than start", "iEnd");
            }
            this._End = iEnd || this._Blob.size;
        },
        _Start: 0,
        _End: 0,
        _Blob: null,
        constructor: function (_a5a, _a5b, iEnd) {
            this._SetBlob(_a5a);
            this.SetStart(_a5b);
            this.SetEnd(iEnd || _a5a.size);
        },
        _SetBlob: function (_a5d) {
            this._Blob = _a5d;
            this._Start = 0;
            this._End = _a5d.size;
        },
        IsFullFile: function () {
            return this._Start === 0 && this._End === this._Blob.size;
        },
        IsPartFile: function () {
            return !this.IsFullFile();
        },
        GetSlice: function () {
            if (this.IsFullFile()) {
                return this._Blob;
            }
            return this._Blob.slice(this._Start, this.End);
        },
        GetFile: function () {
            return this._Blob;
        },
        GetFullSize: function () {
            return this._Blob.size;
        }
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.UploadLocation", null, {
        constructor: function (_a5e, oUrl) {
            this._FolderGenerator = _a5e;
            this._Url = oUrl;
            this._PathMap = new ITHit.WebDAV.Client.Upload.Path.PathCache();
        },
        CreateAsync: function (_a60, _a61) {
            var _a62 = function (_a63) {
                delete this._CancellationCallback;
                _a60.call(_a61, _a63);
            };
            this._CancellationCallback = this._FolderGenerator.GeneratePathAsync(this._PathMap, this._Url, _a62, this);
        },
        IsExists: function () {
            return this._PathMap.Has(this._Url);
        },
        SetNotExists: function () {
            var _a64 = this._GetAncestorsPaths(this._Url);
            _a64.forEach(function (oUrl) {
                this._PathMap.Delete(oUrl);
            }, this);
        },
        IsInProgress: function () {
            return !!this._CancellationCallback;
        },
        AbortRunningCreationAsync: function (_a66, _a67) {
            if (!this._CancellationCallback) {
                _a66.call(_a67);
                return;
            }
            this._CancellationCallback(function () {
                _a66.call(_a67);
            }, this);
        },
        GetCache: function () {
            return this._PathMap;
        },
        SetCache: function (_a68) {
            this._PathMap = _a68;
        },
        _CancellationCallback: null,
        _FolderGenerator: null,
        _PathMap: null,
        _Url: null,
        _GetAncestorsPaths: function (oUrl) {
            var _a6a = oUrl.GetRelativePath().split("/");
            if (_a6a.length === 0) {
                return [];
            }
            if (_a6a[_a6a.length - 1] === "") {
                _a6a = _a6a.slice(0, -1);
            }
            var _a6b = [];
            var path = "";
            for (var i = 0; i < _a6a.length - 1; i++) {
                if (path !== "") {
                    path += "/";
                }
                path += _a6a[i];
                _a6b.push(new ITHit.WebDAV.Client.Upload.Utils.DavUrl(path, oUrl.GetBaseUrl()));
            }
            return _a6b;
        }
    });
})();
(function () {
    "use strict";
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.Upload.ContentWriter", null, {
        Url: null,
        constructor: function (_a6f, oUrl) {
            this._Session = _a6f;
            this.Url = oUrl;
        },
        SetProgressDebounce: function (_a71) {
            this._ReportPeriod = _a71;
        },
        BeginWrite: function (_a72) {
            this._InitializeRequestContext();
            var _a73 = null;
            if (_a72.IsFolder()) {
                _a73 = this._CreateMKCOLRequest();
                this._AddCustomHeaders(_a73);
                this._RequestContext.AddListener("OnError", this._OnErrorEventHandler, this);
                _a73.GetResponse(this._OnResponse.bind(this));
                this._RaiseOnStartEvent();
                return;
            }
            _a73 = this._CreatePutRequest(_a72);
            _a73.Headers.Add("Overwrite", "F");
            this._AddCustomHeaders(_a73);
            this._RequestContext.AddListener("OnError", this._OnErrorEventHandler, this);
            _a73.GetResponse(this._OnResponse.bind(this));
            this._RaiseOnStartEvent();
        },
        BeginRewrite: function (_a74) {
            this._InitializeRequestContext();
            var _a75 = null;
            if (_a74.IsFolder()) {
                _a75 = this._CreateMKCOLRequest();
                this._AddCustomHeaders(_a75);
                this._RequestContext.AddListener("OnError", this._OnMKCOLRewriteErrorEventHandler, this);
                _a75.GetResponse(this._OnMKCOLRewriteResponse.bind(this));
                this._RaiseOnStartEvent();
            } else {
                _a75 = this._CreatePutRequest(_a74);
                _a75.Headers.Add("Overwrite", "T");
                this._AddCustomHeaders(_a75);
                this._RequestContext.AddListener("OnError", this._OnErrorEventHandler, this);
                _a75.GetResponse(this._OnResponse.bind(this));
                this._RaiseOnStartEvent();
            }
        },
        BeginAppend: function (_a76) {
            this._InitializeRequestContext();
            var _a77 = this._CreatePutAppendRequest(_a76);
            _a77.Headers.Add("Overwrite", "T");
            this._AddCustomHeaders(_a77);
            this._RequestContext.AddListener("OnError", this._OnErrorEventHandler, this);
            _a77.GetResponse(this._OnResponse.bind(this));
            this._RaiseOnStartEvent();
        },
        AbortAsync: function (_a78, _a79) {
            if (this._RequestContext) {
                this._RequestContext.RemoveListener(ITHit.WebDAV.Client.Request.EVENT_ON_UPLOAD_PROGRESS, this._OnProgressEventHandler, this);
                this._RequestContext.AbortAsync(_a78, _a79);
            }
        },
        AddListener: function (_a7a, _a7b, _a7c) {
            _a7c = _a7c || null;
            this._ValidateEventName(_a7a);
            ITHit.Events.AddListener(this, _a7a, _a7b, _a7c);
        },
        RemoveListener: function (_a7d, _a7e, _a7f) {
            _a7f = _a7f || null;
            this._ValidateEventName(_a7d);
            ITHit.Events.RemoveListener(this, _a7d, _a7e, _a7f);
        },
        _AddCustomHeaders: function (_a80) {
            if (!this.CustomHeaders) {
                return;
            }
            var _a81 = [];
            var _a82 = _a80.Headers.GetAll();
            this.CustomHeaders.forEach(function (_a83) {
                if (_a81.indexOf(_a83.name) < 0 && !_a82.hasOwnProperty(_a83.name)) {
                    _a80.Headers.Add(_a83.name, _a83.value);
                    _a81.push(_a83.name);
                }
            });
        },
        _ValidateEventName: function (_a84) {
            switch (_a84) {
                case self.EVENT_ON_PROGRESS:
                case self.EVENT_ON_ERROR:
                case self.EVENT_ON_FINISH:
                case self.EVENT_ON_START:
                    break;
                default:
                    throw new ITHit.Exceptions.ArgumentException("Not found event name `" + _a84 + "`");
            }
        },
        _InitializeRequestContext: function () {
            if (this.IsActive()) {
                throw new ITHit.Exceptions("Content write already in progress");
            }
            this._RequestContext = this._Session.CreateRequest(this.__className);
            this._RequestContext.AddListener(ITHit.WebDAV.Client.Request.EVENT_ON_UPLOAD_PROGRESS, this._OnProgressEventHandler, this);
        },
        _CreateMKCOLRequest: function () {
            var _a85 = this._RequestContext.CreateWebDavRequest(ITHit.WebDAV.Client.Encoder.Encode(this.Url.GetOrigin()), this.Url.GetHref());
            _a85.Method("MKCOL");
            this._SetDefaultHeaders(_a85);
            return _a85;
        },
        _OnMKCOLRewriteResponse: function (_a86) {
            if (this._IsConflictResult(_a86)) {
                _a86 = this._TransformToSuccess(_a86);
            }
            this._OnResponse(_a86);
        },
        _OnMKCOLRewriteErrorEventHandler: function (_a87) {
            if (_a87.Error instanceof ITHit.WebDAV.Client.Exceptions.MethodNotAllowedException) {
                return;
            }
        },
        _OnResponse: function (_a88) {
            if (_a88.IsAborted) {
                _a88 = ITHit.WebDAV.Client.CancellableResult.CreateAbortedResult(_a88.Error);
                this._RequestContext.MarkAbort();
            } else {
                _a88 = ITHit.WebDAV.Client.CancellableResult.CreateFromAsyncResultResult(_a88);
                this._RequestContext.MarkFinish();
            }
            this._RaiseOnFinishEvent(_a88);
            this._RemoveRequestContextEventListeners();
        },
        _CreatePutRequest: function (_a89) {
            var _a8a = this._RequestContext.CreateWebDavRequest(ITHit.WebDAV.Client.Encoder.Encode(this.Url.GetOrigin()), this.Url.GetHref());
            _a8a.Method("PUT");
            if (_a89.GetFile().type) {
                _a8a.Headers.Add("Content-Type", _a89.GetFile().type);
            }
            _a8a.BodyBinary(_a89.GetFile());
            this._SetDefaultHeaders(_a8a);
            return _a8a;
        },
        _CreatePutAppendRequest: function (_a8b) {
            var _a8c = this._RequestContext.CreateWebDavRequest(ITHit.WebDAV.Client.Encoder.Encode(this.Url.GetOrigin()), this.Url.GetHref());
            _a8c.Method("PUT");
            if (_a8b.GetFile().type) {
                _a8c.Headers.Add("Content-Type", _a8b.GetFile().type);
            }
            if (_a8b.IsPartFile()) {
                _a8c.Headers.Add("Content-Range", this._GetRangeHeader(_a8b));
                _a8c.BodyBinary(_a8b.GetSlice());
            } else {
                _a8c.BodyBinary(_a8b.GetFile());
            }
            this._SetDefaultHeaders(_a8c);
            return _a8c;
        },
        _GetRangeHeader: function (_a8d) {
            return "bytes " + _a8d.GetStart() + "-" + (_a8d.GetEnd() - 1) + "/" + _a8d.GetFullSize();
        },
        _TransformToSuccess: function (_a8e) {
            return new ITHit.WebDAV.Client.AsyncResult(_a8e.Error, true, null);
        },
        _IsConflictResult: function (_a8f) {
            return _a8f.Error instanceof ITHit.WebDAV.Client.Exceptions.MethodNotAllowedException;
        },
        _RaiseOnProgressEvent: function (_a90) {
            ITHit.Events.DispatchEvent(this, self.EVENT_ON_PROGRESS, [{
                Progress: _a90,
                Uploader: this
            }]);
        },
        _RaiseOnErrorEvent: function (_a91) {
            ITHit.Events.DispatchEvent(this, self.EVENT_ON_ERROR, [{
                Error: _a91,
                Uploader: this
            }]);
        },
        _RaiseOnFinishEvent: function (_a92) {
            ITHit.Events.DispatchEvent(this, self.EVENT_ON_FINISH, [{
                Uploader: this,
                Result: _a92
            }]);
        },
        _RaiseOnStartEvent: function () {
            ITHit.Events.DispatchEvent(this, self.EVENT_ON_START, [{
                Uploader: this
            }]);
        },
        _OnProgressEventHandler: function (_a93) {
            var iNow = new Date().getTime();
            if (iNow - this._LastReportTime > this._ReportPeriod || _a93.Progress.BytesTotal === _a93.Progress.BytesLoaded) {
                this._RaiseOnProgressEvent(_a93.Progress);
                this._LastReportTime = iNow;
            }
        },
        _OnErrorEventHandler: function (_a95) {
            this._RaiseOnErrorEvent(_a95.Error);
        },
        _RemoveRequestContextEventListeners: function () {
            ITHit.Events.RemoveAllListeners(this._RequestContext, "OnUploadProgress");
            ITHit.Events.RemoveAllListeners(this._RequestContext, "OnError");
            delete this._RequestContext;
        },
        _SetDefaultHeaders: function (_a96) {
            _a96.Headers.Add("If-Modified-Since", "Mon, 26 Jul 1997 05:00:00 GMT");
            _a96.Headers.Add("X-Requested-With", "XMLHttpRequest");
        },
        IsActive: function () {
            return !!this._RequestContext;
        },
        _Session: null,
        _RequestContext: null,
        _ReportPeriod: 1000,
        _LastReportTime: 0
    }, {
        EVENT_ON_PROGRESS: "OnProgress",
        EVENT_ON_ERROR: "OnError",
        EVENT_ON_FINISH: "OnFinish",
        EVENT_ON_START: "OnStart"
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Path.Generator", null, {
        constructor: function (_a97) {
            this._Session = _a97;
            this._WorkList = new ITHit.WebDAV.Client.Upload.Collections.Map();
        },
        _SendRequest: function (oUrl) {
            var _a99 = this._Session.CreateRequest(this.__className + ".GeneratePathAsync()");
            ITHit.WebDAV.Client.Methods.Mkcol.GoAsync(_a99, oUrl.toString(), [], ITHit.WebDAV.Client.Encoder.Encode(oUrl.GetHost()), function (_a9a) {
                    if (_a9a.IsAborted) {
                        _a99.MarkAbort();
                    } else {
                        _a99.MarkFinish();
                    }
                    this._CallAwaiters(oUrl, _a9a);
                }
                .bind(this));
            return _a99;
        },
        _RecurrentGenerate: function (_a9b, _a9c, _a9d, _a9e) {
            var _a9f = null;
            var _aa0 = null;
            var _aa1 = function (_aa2, _aa3) {
                if (!!_a9f) {
                    _a9f.AbortAsync(_aa2, _aa3);
                    return;
                }
                if (!!_aa0) {
                    _aa0(_aa2, _aa3);
                }
                _aa2.call(_a9e);
            };
            var _aa4 = _a9c.slice();
            var _aa5 = [];
            while (_aa4.length > 0) {
                var oUrl = _aa4[0];
                if (!_a9b.Has(oUrl)) {
                    break;
                }
                _aa5.push(oUrl);
                _aa4.splice(0, 1);
            }
            if (_aa4.length === 0) {
                _a9d.call(_a9e, ITHit.WebDAV.Client.CancellableResult.CreateSuccessfulResult(_aa5));
                return _aa1;
            }
            var _aa7 = _aa4.shift();
            if (!this._IsInWork(_aa7)) {
                _a9f = this._SendRequest(_aa7);
            }
            this._AddAwaiter(_aa7, function (_aa8) {
                    if (!_aa8.IsSuccess && !this._IsConflictResult(_aa8)) {
                        _a9d.call(_a9e, _aa8);
                        return;
                    }
                    _a9b.Add(_aa7);
                    _aa5.push(oUrl);
                    _a9f = null;
                    _aa0 = this._RecurrentGenerate(_a9b, _aa4, function (_aa9) {
                        if (_aa9.IsSuccess || this._IsConflictResult(_aa8)) {
                            _aa9.Result.concat(_aa5);
                            _aa9 = ITHit.WebDAV.Client.CancellableResult.CreateSuccessfulResult(_aa5);
                        }
                        _aa0 = null;
                        _a9d.call(_a9e, _aa9);
                        return;
                    }, this);
                }
                .bind(this));
            return _aa1;
        },
        GeneratePathAsync: function (_aaa, oUrl, _aac, _aad) {
            var _aae = this._GetAncestorsPaths(oUrl);
            if (_aae.length === 0) {
                return _aac.call(_aad, ITHit.WebDAV.Client.AsyncResult.CreateSuccessfulResult([]));
            }
            return this._RecurrentGenerate(_aaa, _aae, _aac, _aad);
        },
        _Session: null,
        _WorkList: null,
        _GetAncestorsPaths: function (oUrl) {
            var _ab0 = oUrl.GetRelativePath().split("/");
            if (_ab0.length === 0) {
                return [];
            }
            if (_ab0[_ab0.length - 1] === "") {
                _ab0 = _ab0.slice(0, -1);
            }
            var _ab1 = [];
            var path = "";
            for (var i = 0; i < _ab0.length - 1; i++) {
                if (path !== "") {
                    path += "/";
                }
                path += _ab0[i];
                _ab1.push(new ITHit.WebDAV.Client.Upload.Utils.DavUrl(path, oUrl.GetBaseUrl()));
            }
            return _ab1;
        },
        _IsInWork: function (oUrl) {
            var _ab5 = this._WorkList.Get(oUrl.toString());
            return _ab5 && (_ab5.length > 0);
        },
        _AddAwaiter: function (oUrl, _ab7) {
            var _ab8 = this._WorkList.Get(oUrl.toString());
            var _ab9 = [];
            if (_ab8) {
                _ab9 = _ab9.concat(_ab8);
            }
            _ab9.push(_ab7);
            this._WorkList.Set(oUrl.toString(), _ab9);
        },
        _CallAwaiters: function (oUrl, _abb) {
            var _abc = this._WorkList.Get(oUrl.toString());
            this._WorkList.Delete(oUrl.toString());
            _abc.forEach(function (_abd) {
                _abd(_abb);
            });
        },
        _IsConflictResult: function (_abe) {
            if (_abe.IsSuccess) {
                return false;
            }
            if (_abe.Error && _abe.Error instanceof ITHit.WebDAV.Client.Exceptions.MethodNotAllowedException) {
                return true;
            }
            return false;
        }
    });
})();
(function () {
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.UploaderSession", ITHit.WebDAV.Client.WebDavSession, {
        ExistsFolders: [],
        GetProgressReportAsync: function (sUrl, _ac0, _ac1) {
            var _ac2 = this.CreateRequest(this.__className + ".ReportAsync()");
            var _ac3 = ITHit.WebDAV.Client.HierarchyItem.GetHost(sUrl);
            ITHit.WebDAV.Client.Methods.Report.GoAsync(_ac2, sUrl, _ac3, null, null, function (_ac4) {
                _ac2.MarkFinish();
                _ac0.call(_ac1, _ac4);
            });
            return _ac2;
        },
        CancelUploadAsync: function (sUrl, _ac6) {
            var _ac7 = this.CreateRequest(this.__className + ".CancelUpload()");
            var _ac8 = ITHit.WebDAV.Client.HierarchyItem.GetHost(sUrl);
            ITHit.WebDAV.Client.Methods.CancelUpload.GoAsync(_ac7, sUrl, [], _ac8, function (_ac9) {
                _ac7.MarkFinish();
                var _aca = new ITHit.WebDAV.Client.AsyncResult(true, true, null);
                if (_ac9.Error instanceof ITHit.WebDAV.Client.Exceptions.NotFoundException) {
                    _aca = new ITHit.WebDAV.Client.AsyncResult(true, true, null);
                } else {
                    if (!_ac9.IsSuccess) {
                        _aca = new ITHit.WebDAV.Client.AsyncResult(_ac9.IsSuccess, _ac9.IsSuccess, _ac9.Error);
                    }
                }
                _ac6(_aca);
            });
            return _ac7;
        },
        CheckExistsAsync: function (sUrl, _acc, _acd) {
            _acc = _acc || function () {};
            return this.OpenItemAsync(ITHit.WebDAV.Client.Encoder.Encode(sUrl), [], function (_ace) {
                var _acf = new ITHit.WebDAV.Client.AsyncResult(true, true, null);
                if (_ace.Error instanceof ITHit.WebDAV.Client.Exceptions.NotFoundException) {
                    _acf = new ITHit.WebDAV.Client.AsyncResult(false, true, null);
                } else {
                    if (!_ace.IsSuccess) {
                        _acf = new ITHit.WebDAV.Client.AsyncResult(_ace.IsSuccess, _ace.IsSuccess, _ace.Error);
                    }
                }
                _acc.call(_acd, _acf);
            });
        },
        DeleteAsync: function (_ad0, _ad1, _ad2) {
            _ad1 = _ad1 || null;
            var _ad3 = ITHit.WebDAV.Client.HierarchyItem.GetHost(_ad0);
            var _ad4 = this.CreateRequest(this.__className + ".DeleteAsync()");
            ITHit.WebDAV.Client.Methods.Delete.GoAsync(_ad4, _ad0, _ad1, _ad3, function (_ad5) {
                if (!_ad5.IsSuccess && _ad5.Error instanceof ITHit.WebDAV.Client.Exceptions.NotFoundException) {
                    _ad5 = new ITHit.WebDAV.Client.AsyncResult(true, true, null);
                }
                _ad4.MarkFinish();
                _ad2(_ad5);
            });
            return _ad4;
        },
        CreateFolderRangeAsync: function (_ad6, _ad7, _ad8, _ad9) {
            _ad7 = _ad7 || null;
            _ad8 = _ad8 || ITHit.Utils.NoOp;
            var _ada = _ad6.length;
            var _adb = this.CreateRequest(this.__className + ".CreateFolderRangeAsync()", _ada);
            this._PerformCreateFolderRangeMethodAsync(_adb, _ad6, _ad7, function (_adc) {
                _adb.MarkFinish();
                _ad8.call(_ad9, _adc);
            });
            return _adb;
        },
        _PerformCreateFolderRangeMethodAsync: function (_add, _ade, _adf, _ae0, _ae1) {
            _ae0 = _ae0 || ITHit.Utils.NoOp;
            _ade = _ade.slice();
            var _ae2 = _ade.unshift();
            var _ae3 = ITHit.WebDAV.Client.Encoder.Encode(_ae2.GetHref());
            var _ae4 = ITHit.WebDAV.Client.Encoder.Encode(_ae2.GetHost());
            ITHit.WebDAV.Client.Methods.Mkcol.GoAsync(_add, _ae3, _adf, _ae4, function (_ae5) {
                if (_ae5.IsSuccess || _ae5.Error instanceof ITHit.WebDAV.Client.Exceptions.MethodNotAllowedException) {
                    _ae5 = new ITHit.WebDAV.Client.AsyncResult.CreateSuccessfulResult([_ae2]);
                }
                if (_ade.length > 0 && _ae5.IsSuccess) {
                    this._PerformCreateFolderRangeMethodAsync(_add, _ade, _adf, function (_ae6) {
                        if (_ae6.IsSuccess) {
                            _ae6.Result.push(_ae2);
                        }
                        _ae0.call(_ae1, _ae6);
                        return;
                    }, this);
                } else {
                    _ae0.call(_ae1, _ae5);
                    return;
                }
            });
        },
        CreateUploadLocation: function (oUrl) {
            return new ITHit.WebDAV.Client.Upload.UploadLocation(this.GetPathGenerator(), oUrl);
        },
        CreateContentWriter: function (oUrl) {
            return new ITHit.WebDAV.Client.Upload.ContentWriter(this, oUrl);
        },
        GetPathGenerator: function () {
            if (!this._PathGenerator) {
                this._PathGenerator = new ITHit.WebDAV.Client.Upload.Path.Generator(this);
            }
            return this._PathGenerator;
        },
        _PathGenerator: null
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Utils.RepeatableActionContext", null, {
        _RoundsCount: 0,
        _IsActive: true,
        _Handler: null,
        _EndHandler: null,
        _RepeatTime: 0,
        constructor: function (_ae9, _aea, _aeb, _aec) {
            this._RoundsCount = _ae9;
            this._Handler = _aeb;
            this._EndHandler = _aec;
            this._IsActive = !!_ae9;
            this._RepeatTime = _aea;
        },
        Stop: function (_aed) {
            this._IsActive = false;
            this._RoundsCount = 0;
            this._EndHandler(_aed);
        },
        _RunRound: function () {
            if (this._IsActive) {
                this._Handler(this);
            } else {
                this.Stop();
            }
        },
        EndRound: function (_aee) {
            this._RoundsCount--;
            if (this._RoundsCount === 0) {
                this.Stop(_aee);
            } else {
                setTimeout(this._RunRound.bind(this), this._RepeatTime);
            }
        }
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Utils.RepeatableAction", null, {
        _Action: null,
        constructor: function (_aef) {
            this._Action = _aef;
        },
        RunAsync: function (_af0, _af1, _af2) {
            var _af3 = new ITHit.WebDAV.Client.Upload.Utils.RepeatableActionContext(_af0, _af1, this._Action, _af2);
            _af3._RunRound();
        }
    });
})();
(function () {
    "use strict";
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Events.UploadError", ITHit.WebDAV.Client.Upload.Events.AsyncEvent, {
        Error: null,
        Skip: function () {
            if (this._IsHandled) {
                return;
            }
            this._SkipRetry(this.Items);
        },
        Retry: function () {
            if (this._IsHandled) {
                return;
            }
            this._Retry(this.Items);
        },
        constructor: function (_af5, _af6, _af7) {
            this.Name = ITHit.WebDAV.Client.Upload.Events.EventName.OnUploadError;
            this.Error = _af6;
            this._super(_af5, _af7);
        },
        _Retry: function () {
            this._Handle(self.GetRetryResult(this.Error));
        },
        _SkipRetry: function () {
            this._Handle(self.GetSkipResult(this.Error));
        }
    }, {
        GetSkipResult: function (_af8) {
            return {
                Action: "skip",
                Error: _af8
            };
        },
        GetRetryResult: function (_af9) {
            return {
                Action: "retry",
                Error: _af9
            };
        }
    });
})();
(function () {
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Events.Error", ITHit.WebDAV.Client.Upload.Events.BaseEvent, {
        Error: null,
        constructor: function (_afa, _afb) {
            this.Name = ITHit.WebDAV.Client.Upload.Events.EventName.OnError;
            this.Error = _afb;
            this.Sender = _afa;
        }
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.States.BaseState", null, {
        OnEnter: function (_afc) {},
        OnLeave: function (_afd) {},
        StartUploadAsync: function (_afe, _aff) {
            _aff();
        },
        PauseUpload: function (_b00, _b01) {
            _b01();
        },
        AbortUpload: function (_b02, _b03, _b04, _b05) {
            _b05();
        },
        Skip: function (_b06) {},
        OnUploadLocationPrepared: function (_b07, _b08) {},
        OnUploadProgressPrepared: function (_b09, _b0a) {},
        OnContentCompleted: function (_b0b, _b0c) {},
        OnRetryResult: function (_b0d, _b0e) {},
        _CompletePauseAsync: function (_b0f, _b10, _b11) {
            if (_b0f.IsRetrySchedule) {
                _b0f.IsRetrySchedule = false;
            }
            _b0f.SetState(ITHit.WebDAV.Client.Upload.States.Factory.GetPausedState());
            _b10.call(_b11);
        },
        _StartPauseAsync: function (_b12, _b13) {
            _b12._ProgressTracker.StopTracking();
            _b12.CancelAllRequests(function () {
                if (_b12.IsContentSend) {
                    _b12.SyncProgressWithServerAsync(function (_b14) {
                        this._CompletePauseAsync(_b12, _b13);
                    }, this);
                    return;
                }
                this._CompletePauseAsync(_b12, _b13);
            }, this);
        }
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.States.CompletedState", ITHit.WebDAV.Client.Upload.States.BaseState, {
        GetAsEnum: function () {
            return ITHit.WebDAV.Client.Upload.State.Completed;
        },
        OnEnter: function (_b15) {
            _b15.GetProgressTracker().StopTracking();
            _b15.GetProgressTracker().SetCompleted();
        },
        StartUploadAsync: function (_b16, _b17) {
            _b16.SetState(ITHit.WebDAV.Client.Upload.States.Factory.GetUploadingState());
            this._super(_b16, _b17);
        }
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.States.SkippedState", ITHit.WebDAV.Client.Upload.States.BaseState, {
        GetAsEnum: function () {
            return ITHit.WebDAV.Client.Upload.State.Skipped;
        },
        StartUploadAsync: function (_b18, _b19) {
            _b18.SetState(ITHit.WebDAV.Client.Upload.States.Factory.GetUploadingState());
            this._super(_b18, _b19);
        }
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.States.QueuedState", ITHit.WebDAV.Client.Upload.States.BaseState, {
        GetAsEnum: function () {
            return ITHit.WebDAV.Client.Upload.State.Queued;
        },
        StartUploadAsync: function (_b1a, _b1b) {
            _b1a.SetState(ITHit.WebDAV.Client.Upload.States.Factory.GetUploadingState());
            this._super(_b1a, _b1b);
        },
        Skip: function (_b1c) {
            _b1c.SetState(ITHit.WebDAV.Client.Upload.States.Factory.GetSkippedState());
        },
        PauseUpload: function (_b1d, _b1e) {
            this._StartPauseAsync(_b1d, _b1e);
        },
        AbortUpload: function (_b1f, _b20, _b21, _b22) {
            _b1f.SetState(ITHit.WebDAV.Client.Upload.States.Factory.GetCanceledState());
            this._super(_b1f, _b20, _b21, _b22);
        }
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.States.CanceledState", ITHit.WebDAV.Client.Upload.States.BaseState, {
        GetAsEnum: function () {
            return ITHit.WebDAV.Client.Upload.State.Canceled;
        },
        OnEnter: function (_b23) {
            _b23.GetProgressTracker().StopTracking();
            _b23.GetProgressTracker().Reset();
        },
        StartUploadAsync: function (_b24, _b25) {
            _b24.SetState(ITHit.WebDAV.Client.Upload.States.Factory.GetUploadingState());
            this._super(_b24, _b25);
        }
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.States.UploadingState", ITHit.WebDAV.Client.Upload.States.BaseState, {
        GetAsEnum: function () {
            return ITHit.WebDAV.Client.Upload.State.Uploading;
        },
        OnEnter: function (_b26) {
            _b26.PrepareUploadLocation();
        },
        PauseUpload: function (_b27, _b28) {
            this._StartPauseAsync(_b27, _b28);
        },
        AbortUpload: function (_b29, _b2a, _b2b, _b2c) {
            _b29.CancelAllRequests(function () {
                _b29.GetProgressTracker().StopTracking();
                _b29.CancelAndDeleteAsync(_b2a, _b2b, function (_b2d) {
                    if (_b2d.IsSuccess) {
                        _b29.GetProgressTracker().Reset();
                        _b29.SetState(ITHit.WebDAV.Client.Upload.States.Factory.GetCanceledState());
                    } else {
                        _b29.AddError(_b2d.Error);
                        _b29.SetState(ITHit.WebDAV.Client.Upload.States.Factory.GetFailedState());
                    }
                    _b2c();
                }, this);
            }, this);
        },
        OnContentCompleted: function (_b2e, _b2f) {
            var _b30 = _b2f.Result;
            if (_b30.IsAborted) {
                return;
            }
            if (_b30.IsSuccess) {
                _b2e.GetProgressTracker().SetCompleted();
                _b2e.SetState(ITHit.WebDAV.Client.Upload.States.Factory.GetCompletedState());
                return;
            }
            this._HandleError(_b2e, _b30);
        },
        _HandleError: function (_b31, _b32) {
            _b31.AddError(_b32.Error);
            _b31.BeginRetry(_b32.Error);
        },
        OnRetryResult: function (_b33, _b34) {
            if (_b34.Action === "skip") {
                _b33.AddError(_b34.Error);
                _b33.SetState(ITHit.WebDAV.Client.Upload.States.Factory.GetFailedState());
                return;
            }
            if (_b33.IsContentSend) {
                _b33.SyncProgressWithServerAsync(function (_b35) {
                    if (_b35.Error) {
                        this._HandleError(_b34.Error);
                    } else {
                        this.OnEnter(_b33);
                    }
                }, this);
                return;
            }
            this.OnEnter(_b33);
        },
        OnUploadLocationPrepared: function (_b36, _b37) {
            if (_b37.IsAborted) {
                return;
            }
            if (!_b37.IsSuccess) {
                this._HandleError(_b36, _b37);
                return;
            }
            _b36._SendContent();
        }
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.States.ResumeState", ITHit.WebDAV.Client.Upload.States.UploadingState, {
        OnEnter: function (_b38) {
            if (_b38.IsContentSend) {
                _b38.PrepareProgress();
                return;
            }
            this._super(_b38);
        },
        OnUploadProgressPrepared: function (_b39, _b3a) {
            if (_b3a.IsAborted) {
                return;
            }
            if (!_b3a.IsSuccess) {
                this._HandleError(_b39, _b3a);
                return;
            }
            if (_b39.GetProgressTracker().IsCompleted()) {
                _b39.SetState(ITHit.WebDAV.Client.Upload.States.Factory.GetCompletedState());
            }
            _b39._SendContent();
        }
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.States.PausedState", ITHit.WebDAV.Client.Upload.States.BaseState, {
        GetAsEnum: function () {
            return ITHit.WebDAV.Client.Upload.State.Paused;
        },
        OnEnter: function (_b3b) {
            _b3b.GetProgressTracker().StopTracking();
            _b3b.GetProgressTracker().ResetSpeed();
        },
        StartUploadAsync: function (_b3c, _b3d) {
            _b3c.SetState(ITHit.WebDAV.Client.Upload.States.Factory.GetResumeState());
            this._super(_b3c, _b3d);
        },
        AbortUpload: function (_b3e, _b3f, _b40, _b41) {
            if (_b3e.IsContentSend) {
                _b3e.CancelAndDeleteAsync(_b3f, _b40, function (_b42) {
                    if (_b42.IsSuccess) {
                        _b3e.SetState(ITHit.WebDAV.Client.Upload.States.Factory.GetCanceledState());
                    } else {
                        _b3e.AddError(_b42.Error);
                        _b3e.SetState(ITHit.WebDAV.Client.Upload.States.Factory.GetFailedState());
                    }
                    _b41();
                }, this);
            } else {
                _b3e.SetState(ITHit.WebDAV.Client.Upload.States.Factory.GetCanceledState());
                _b41();
            }
        }
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.States.FailedState", ITHit.WebDAV.Client.Upload.States.BaseState, {
        GetAsEnum: function () {
            return ITHit.WebDAV.Client.Upload.State.Failed;
        },
        OnEnter: function (_b43) {
            _b43.GetProgressTracker().StopTracking();
            _b43.GetProgressTracker().ResetSpeed();
        },
        StartUploadAsync: function (_b44, _b45) {
            _b44.SetState(ITHit.WebDAV.Client.Upload.States.Factory.GetUploadingState());
            this._super(_b44, _b45);
        },
        AbortUpload: function (_b46, _b47, _b48, _b49) {
            if (_b46.IsContentSend) {
                _b46.CancelAndDeleteAsync(_b47, _b48, function (_b4a) {
                    if (_b4a.IsSuccess) {
                        _b46.SetState(ITHit.WebDAV.Client.Upload.States.Factory.GetCanceledState());
                    } else {
                        _b46.AddError(_b4a.Error);
                        _b46.SetState(ITHit.WebDAV.Client.Upload.States.Factory.GetFailedState());
                    }
                    _b49();
                }, this);
            } else {
                _b46.SetState(ITHit.WebDAV.Client.Upload.States.Factory.GetCanceledState());
                _b49();
            }
        }
    });
})();
(function () {
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Settings", null, {
        ConcurrentUploads: 2,
        State: ITHit.WebDAV.Client.Upload.State.Queued,
        DeleteOnCancel: true
    });
})();
(function () {
    "use strict";
    var self = ITHit.DefineClass("ITHit.WebDAV.Client.Upload.States.Factory", null, {}, {
        GetUploadingState: function () {
            if (!self._UploadingState) {
                self._UploadingState = new ITHit.WebDAV.Client.Upload.States.UploadingState();
            }
            return self._UploadingState;
        },
        GetSkippedState: function () {
            if (!self._SkippedState) {
                self._SkippedState = new ITHit.WebDAV.Client.Upload.States.SkippedState();
            }
            return self._SkippedState;
        },
        GetQueuedState: function () {
            if (!self._QueuedState) {
                self._QueuedState = new ITHit.WebDAV.Client.Upload.States.QueuedState();
            }
            return self._QueuedState;
        },
        GetPausedState: function () {
            if (!self._PausedState) {
                self._PausedState = new ITHit.WebDAV.Client.Upload.States.PausedState();
            }
            return self._PausedState;
        },
        GetFailedState: function () {
            if (!self._FailedState) {
                self._FailedState = new ITHit.WebDAV.Client.Upload.States.FailedState();
            }
            return self._FailedState;
        },
        GetCompletedState: function () {
            if (!self._CompletedState) {
                self._CompletedState = new ITHit.WebDAV.Client.Upload.States.CompletedState();
            }
            return self._CompletedState;
        },
        GetCanceledState: function () {
            if (!self._CanceledState) {
                self._CanceledState = new ITHit.WebDAV.Client.Upload.States.CanceledState();
            }
            return self._CanceledState;
        },
        GetResumeState: function () {
            if (!self._ResumeState) {
                self._ResumeState = new ITHit.WebDAV.Client.Upload.States.ResumeState();
            }
            return self._ResumeState;
        },
        GetState: function (_b4c) {
            switch (_b4c) {
                case ITHit.WebDAV.Client.Upload.State.Canceled:
                    return self.GetCanceledState();
                case ITHit.WebDAV.Client.Upload.State.Completed:
                    return self.GetCompletedState();
                case ITHit.WebDAV.Client.Upload.State.Failed:
                    return self.GetFailedState();
                case ITHit.WebDAV.Client.Upload.State.Paused:
                    return self.GetPausedState();
                case ITHit.WebDAV.Client.Upload.State.Queued:
                    return self.GetQueuedState();
                case ITHit.WebDAV.Client.Upload.State.Skipped:
                    return self.GetSkippedState();
                case ITHit.WebDAV.Client.Upload.State.Uploading:
                    return self.GetUploadingState();
                default:
                    throw new ITHit.Exceptions.ArgumentException(null, "oState");
            }
        }
    });
})();
(function () {
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.ItemSettings", null, {
        ForceRewrite: false,
        AlwaysRewriteFolders: true,
        IgnoreCancelErrors: false,
        DeleteOnCancel: false
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.ServerItem", null, {
        constructor: function (_b4d, oUrl) {
            this._Session = _b4d;
            this._Url = oUrl;
        },
        GetProgressAsync: function (_b4f, _b50) {
            return this._Session.GetProgressReportAsync(this._Url.GetHref(), function (_b51) {
                if (_b51.IsSuccess && _b51.Result[0]) {
                    var _b52 = _b51.Result[0];
                    _b4f.call(_b50, ITHit.WebDAV.Client.AsyncResult.CreateSuccessfulResult(_b52));
                    return;
                }
                _b4f.call(_b50, _b51);
            }, this);
        },
        CancelUploadAsync: function (_b53, _b54) {
            this._Session.CancelUploadAsync(this._Url.GetHref(), function (_b55) {
                _b53.call(_b54, _b55);
            });
        },
        DeleteAsync: function (_b56, _b57, _b58, _b59) {
            var that = this;
            var _b5b = new ITHit.WebDAV.Client.Upload.Utils.RepeatableAction(function (_b5c) {
                that._Session.DeleteAsync(that._Url.GetHref(), null, function (_b5d) {
                    if (_b5d.IsSuccess) {
                        _b5c.Stop(_b5d);
                    } else {
                        _b5c.EndRound(_b5d);
                    }
                });
            });
            _b5b.RunAsync(_b56, _b57, function (_b5e) {
                _b58.call(_b59, _b5e);
            });
        },
        CancelAndDeleteAsync: function (_b5f, _b60, _b61, _b62) {
            this.CancelUploadAsync(function (_b63) {
                if (!_b63.IsSuccess) {
                    return _b61.call(_b62, _b63);
                }
                this.DeleteAsync(_b5f, _b60, _b61, _b62);
            }, this);
        },
        _Url: null,
        _Session: null
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Providers.UploadProvider", null, {
        Session: null,
        _UploadItem: null,
        constructor: function (_b64, _b65, _b66, oUrl, _b68) {
            this.FSEntry = _b66;
            this.Url = oUrl;
            this.Settings = new ITHit.WebDAV.Client.Upload.ItemSettings();
            if (this.FSEntry.IsFile()) {
                this.Settings.DeleteOnCancel = _b68.DeleteOnCancel;
            } else {
                this.Settings.DeleteOnCancel = false;
            }
            this.Session = _b64;
            this._UploadItem = _b65;
            this._ProgressTracker = new ITHit.WebDAV.Client.Upload.Providers.ProgressTracker(this.FSEntry.GetSize());
            this._State = ITHit.WebDAV.Client.Upload.States.Factory.GetState(_b68.State);
            this.Errors = [];
            this.UploadLocation = _b64.CreateUploadLocation(this.Url);
            this.ServerItem = new ITHit.WebDAV.Client.Upload.ServerItem(_b64, this.Url);
            this.ContentWriter = _b64.CreateContentWriter(this.Url);
            this.ContentWriter.AddListener(ITHit.WebDAV.Client.Upload.ContentWriter.EVENT_ON_PROGRESS, this.OnRequestProgressEventHandler, this);
            this.ContentWriter.AddListener(ITHit.WebDAV.Client.Upload.ContentWriter.EVENT_ON_FINISH, this._LoadHandler, this);
            this.ContentWriter.AddListener(ITHit.WebDAV.Client.Upload.ContentWriter.EVENT_ON_START, this._StartLoadHandler, this);
            this._ProgressTracker.OnProgressChanged(this._SetProgress, this);
        },
        StartUploadAsync: function (_b69) {
            this._BeginStateChange();
            this._State.StartUploadAsync(this, _b69);
        },
        PauseUpload: function (_b6a) {
            this._BeginStateChange();
            this._State.PauseUpload(this, _b6a);
        },
        AbortUpload: function (_b6b, _b6c, _b6d) {
            this._BeginStateChange();
            _b6d = _b6d || function () {};
            this._State.AbortUpload(this, _b6b, _b6c, _b6d);
        },
        Skip: function () {
            this._BeginStateChange();
            this._State.Skip(this);
        },
        GetGroup: function () {
            return this._UploadItem.GetGroup();
        },
        GetProgressTracker: function () {
            return this._ProgressTracker;
        },
        _ProgressTracker: null,
        AddListener: function (_b6e, _b6f, _b70) {
            this._ValidateEventName(_b6e);
            _b70 = _b70 || null;
            ITHit.Events.AddListener(this, _b6e, _b6f, _b70);
        },
        RemoveListener: function (_b71, _b72, _b73) {
            this._ValidateEventName(_b71);
            _b73 = _b73 || null;
            ITHit.Events.RemoveListener(this, _b71, _b72, _b73);
        },
        _ValidateEventName: function (_b74) {
            switch (_b74) {
                case ITHit.WebDAV.Client.Upload.Events.EventName.OnStateChanged:
                case ITHit.WebDAV.Client.Upload.Events.EventName.OnError:
                case ITHit.WebDAV.Client.Upload.Events.EventName.OnProgressChanged:
                    break;
                default:
                    throw new ITHit.Exceptions.ArgumentException("Not found event name `" + _b74 + "`");
            }
        },
        CheckRetryAsync: function (_b75, _b76, _b77) {
            var _b78 = new ITHit.WebDAV.Client.Upload.Events.UploadError(this._UploadItem, _b75, function (_b79) {
                    if (!this.IsRetrySchedule) {
                        return;
                    }
                    _b76.call(_b77, _b79);
                }
                .bind(this));
            if (!this._UploadItem.OnUploadErrorCallback && (ITHit.Events.ListenersLength(this._UploadItem, _b78.Name) === 0)) {
                _b76.call(_b77, ITHit.WebDAV.Client.Upload.Events.UploadError.GetSkipResult(_b75));
                return;
            }
            this.IsRetrySchedule = true;
            if (this._UploadItem.OnUploadErrorCallback) {
                this._UploadItem.OnUploadErrorCallback.call(this, _b78);
            }
            ITHit.Events.DispatchEvent(this._UploadItem, _b78.Name, _b78);
        },
        Errors: null,
        LastError: null,
        AddError: function (_b7a) {
            this.AddErrorSilent(_b7a);
            this._RiseOnErrorEvent(_b7a);
        },
        AddErrorSilent: function (_b7b) {
            this.LastError = _b7b;
            this.Errors.push(_b7b);
        },
        SetFailed: function (_b7c) {
            var _b7d = ITHit.WebDAV.Client.Upload.States.Factory.GetFailedState();
            this.AddError(_b7c);
            this.SetState(_b7d);
        },
        _RiseOnErrorEvent: function (_b7e) {
            var _b7f = new ITHit.WebDAV.Client.Upload.Events.Error(this, _b7e);
            ITHit.Events.DispatchEvent(this, _b7f.Name, _b7f);
        },
        UploadLocation: null,
        IsContentSend: false,
        ServerItem: null,
        _LoadHandler: function (_b80) {
            if (_b80.Result.Error instanceof ITHit.WebDAV.Client.Exceptions.ConflictException) {
                this.UploadLocation.SetNotExists();
                this.IsContentSend = false;
            }
            this._State.OnContentCompleted(this, _b80);
        },
        _StartLoadHandler: function (_b81) {
            this.IsContentSend = true;
        },
        OnRequestProgressEventHandler: function (_b82) {
            this.GetProgressTracker().UpdateBytes(_b82.Progress.BytesLoaded, _b82.Progress.TotalBytes);
        },
        _SendContent: function () {
            this._ProgressTracker.StartTracking();
            if (this.Settings && this.Settings.CustomHeaders) {
                this.ContentWriter.CustomHeaders = this.Settings.CustomHeaders;
            }
            if (this.FSEntry.IsFolder()) {
                if (this.Settings.ForceRewrite || this.Settings.AlwaysRewriteFolders) {
                    this.ContentWriter.BeginRewrite(this.FSEntry);
                } else {
                    this.ContentWriter.BeginWrite(this.FSEntry);
                }
            } else {
                var _b83 = new ITHit.WebDAV.Client.Upload.FileSpan(this.FSEntry.GetFile(), this._ProgressTracker.GetProgress().UploadedBytes);
                if (_b83.IsFullFile() && (this.Settings.ForceRewrite || this.IsContentSend)) {
                    this.ContentWriter.BeginRewrite(this.FSEntry);
                    return;
                }
                if (_b83.IsFullFile() && !(this.Settings.ForceRewrite && this.IsContentSend)) {
                    this.ContentWriter.BeginWrite(this.FSEntry);
                    return;
                }
                this.ContentWriter.BeginAppend(_b83);
            }
        },
        SyncProgressWithServerAsync: function (_b84, _b85) {
            if (!this._ProgressTracker.IsCountable()) {
                return this.Session.CheckExistsAsync(this.Url.GetUrl(), function (_b86) {
                    if (!_b86.IsSuccess) {
                        _b84.call(_b85, _b86);
                        return;
                    }
                    if (_b86.Result === true) {
                        this._ProgressTracker.SetCompleted();
                        _b84.call(_b85, ITHit.WebDAV.Client.CancellableResult.CreateSuccessfulResult(this._ProgressTracker.GetProgress()));
                        return;
                    }
                    this._ProgressTracker.Reset();
                    _b84.call(_b85, ITHit.WebDAV.Client.CancellableResult.CreateSuccessfulResult(this._ProgressTracker.GetProgress()));
                }, this);
            }
            return this.ServerItem.GetProgressAsync(function (_b87) {
                if (_b87.IsSuccess) {
                    this._ProgressTracker.SyncProgress(_b87.Result);
                    _b84.call(_b85, ITHit.WebDAV.Client.CancellableResult.CreateSuccessfulResult(this._ProgressTracker.GetProgress()));
                    return;
                }
                if (_b87.Error instanceof ITHit.WebDAV.Client.Exceptions.NotFoundException) {
                    this._ProgressTracker.Reset();
                    _b84.call(_b85, ITHit.WebDAV.Client.CancellableResult.CreateSuccessfulResult(this._ProgressTracker.GetProgress()));
                    return;
                }
                _b84.call(_b85, ITHit.WebDAV.Client.CancellableResult.CreateFailedResult(_b87.Error));
            }, this);
        },
        IsRetrySchedule: false,
        PrepareUploadLocation: function () {
            this.UploadLocation.SetCache(this.GetGroup().PathMap);
            this.UploadLocation.CreateAsync(this._OnGeneratePathCompleted, this);
        },
        _OnGeneratePathCompleted: function (_b88) {
            if (_b88.IsAborted) {
                return;
            }
            this._State.OnUploadLocationPrepared(this, _b88);
        },
        CancelAllRequests: function (_b89, _b8a) {
            this._CancelProgressAsync(function () {
                this._CancelLocationCreateAsync(function () {
                    this._CancelContentSendingAsync(_b89, _b8a);
                }, this);
            }, this);
        },
        _CancelLocationCreateAsync: function (_b8b, _b8c) {
            if (this.UploadLocation.IsInProgress()) {
                this.UploadLocation.AbortRunningCreationAsync(function () {
                    _b8b.call(_b8c);
                }, this);
            } else {
                _b8b.call(_b8c);
            }
        },
        _CancelContentSendingAsync: function (_b8d, _b8e) {
            if (this.ContentWriter.IsActive()) {
                this.ContentWriter.AbortAsync(function () {
                    _b8d.call(_b8e);
                }, this);
            } else {
                _b8d.call(_b8e);
            }
        },
        _CancelProgressAsync: function (_b8f, _b90) {
            if (this.IsProgressSyncInProgress) {
                this._SyncProgressRequest.AbortAsync(function () {
                    _b8f.call(_b90);
                }, this);
            } else {
                _b8f.call(_b90);
            }
        },
        _SyncProgressRequest: null,
        IsProgressSyncInProgress: false,
        PrepareProgress: function () {
            this._SyncProgressRequest = this.SyncProgressWithServerAsync(this._OnUpdateFromServerCompleted, this);
        },
        _OnUpdateFromServerCompleted: function (_b91) {
            this.IsProgressSyncInProgress = false;
            if (_b91.IsAborted) {
                return;
            }
            this._State.OnUploadProgressPrepared(this, _b91);
        },
        _IsStateChanging: function () {
            return this._IsChanging;
        },
        SetState: function (_b92) {
            var _b93 = this._State;
            this._State.OnLeave(this);
            this._State = _b92;
            this._State.OnEnter(this);
            var _b94 = new ITHit.WebDAV.Client.Upload.Events.StateChanged(this, _b93.GetAsEnum(), this._State.GetAsEnum());
            ITHit.Events.DispatchEvent(this, _b94.Name, _b94);
        },
        GetState: function () {
            return this._State;
        },
        _State: null,
        _IsChanging: false,
        _BeginStateChange: function () {
            this._IsChanging = true;
        },
        _EndStateChange: function () {
            this._IsChanging = false;
        },
        ContentWriter: null,
        BeginRetry: function (_b95) {
            this._ProgressTracker.StopTracking();
            this.CheckRetryAsync(_b95, this._OnCheckRetryCompleted, this);
        },
        _OnCheckRetryCompleted: function (_b96) {
            this._State.OnRetryResult(this, _b96);
        },
        Settings: null,
        FSEntry: null,
        Url: null,
        CancelAndDeleteAsync: function (_b97, _b98, _b99, _b9a) {
            this.ServerItem.CancelUploadAsync(function (_b9b) {
                if (!this.Settings.DeleteOnCancel) {
                    _b99.call(_b9a, ITHit.WebDAV.Client.AsyncResult.CreateSuccessfulResult(null));
                    return;
                }
                this.ServerItem.DeleteAsync(_b97, _b98, function (_b9c) {
                    if (!_b9c.IsSuccess && !this.Settings.IgnoreCancelErrors) {
                        return _b99.call(_b9a, _b9b);
                    }
                    this.IsContentSend = false;
                    _b99.call(_b9a, ITHit.WebDAV.Client.AsyncResult.CreateSuccessfulResult(null));
                }, this);
            }, this);
        },
        GetProgress: function () {
            return this._ProgressTracker.GetProgress();
        },
        _SetProgress: function (_b9d) {
            var _b9e = this._Progress;
            this._Progress = _b9d;
            var _b9f = new ITHit.WebDAV.Client.Upload.Events.ProgressChanged(this, _b9e, _b9d);
            ITHit.Events.DispatchEvent(this, _b9f.Name, _b9f);
        }
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Events.UploadItemsCreated", ITHit.WebDAV.Client.Upload.Events.AsyncEvent, {
        Items: [],
        Skip: function (_ba0) {
            if (this._IsHandled) {
                return;
            }
            this._Skip(_ba0);
        },
        SkipAll: function () {
            if (this._IsHandled) {
                return;
            }
            this._Skip(this.Items);
        },
        OverwriteAll: function () {
            if (this._IsHandled) {
                return;
            }
            this._Overwrite(this.Items);
        },
        Overwrite: function (_ba1) {
            if (this._IsHandled) {
                return;
            }
            this._Overwrite(_ba1);
        },
        UploadAll: function () {
            if (this._IsHandled) {
                return;
            }
            this.Upload(this.Items);
        },
        Upload: function (_ba2) {
            if (this._IsHandled) {
                return;
            }
            this._Handle({
                Skip: [],
                Overwrite: [],
                Original: this.Items,
                Upload: _ba2
            });
        },
        constructor: function (_ba3, _ba4, _ba5) {
            this.Name = ITHit.WebDAV.Client.Upload.Events.EventName.OnUploadItemsCreated;
            this.Items = _ba4 || [];
            this._super(_ba3, _ba5);
        },
        _Overwrite: function (_ba6) {
            var _ba7 = this._CreateResult([], _ba6);
            this._Handle(_ba7);
        },
        _Skip: function (_ba8) {
            var _ba9 = this._CreateResult(_ba8, []);
            this._Handle(_ba9);
        },
        _CreateResult: function (_baa, _bab) {
            return {
                Skip: _baa || [],
                Overwrite: _bab || [],
                Original: this.Items
            };
        },
        _Handle: function (_bac) {
            _bac = _bac || this._CreateResult();
            this._super(_bac);
        }
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Utils.Array", null, {}, {
        MapParallel: function (_bad, _bae, _baf, _bb0) {
            var _bb1 = [];
            var _bb2 = 0;
            if (_bad.length === 0) {
                setTimeout(_baf.apply(_bb0, _bad));
            }
            for (var i = 0; i < _bad.length; i++) {
                _bae.apply(_bb0, [_bad[i], i, _bad, ITHit.Utils.MakeScopeClosure(this, function (i, _bb5) {
                    _bb1[i] = _bb5;
                    _bb2++;
                    if (_bb2 === _bad.length) {
                        setTimeout(_baf.call(_bb0, _bb1));
                    }
                }, i)]);
            }
        },
        DistinctBy: function (_bb6, _bb7, _bb8) {
            var map = Object.create(null);
            _bb7 = _bb7 || Object.prototype.toString;
            for (var i = 0; i < _bb6.length; i++) {
                var _bbb = _bb7.call(_bb8, _bb6[i]).toString();
                if (!map[_bbb]) {
                    map[_bbb] = _bb6[i];
                }
            }
            return Object.keys(map).map(function (sKey) {
                return map[sKey];
            });
        },
        Take: function (_bbd, _bbe) {
            if (!_bbe) {
                return [_bbd.shift()];
            }
            var _bbf = (_bbd.length > _bbe) ? _bbe : _bbd.length;
            var _bc0 = [];
            for (var i = 0; i < _bbf; i++) {
                _bc0.push(_bbd.shift());
            }
            return _bc0;
        },
        Remove: function (_bc2, _bc3) {
            var _bc4 = _bc2.indexOf(_bc3);
            if (_bc4 > -1) {
                _bc2.splice(_bc4, 1);
            }
        }
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.AutoUploader", null, {
        constructor: function (_bc5) {
            this._ParallelUploads = _bc5 || 0;
            this._QueueArray = [];
            this._Active = [];
            this._Reserve = 0;
        },
        AddRange: function (_bc6) {
            _bc6.forEach(this._AddToQueue, this);
            this._StartUploads();
        },
        Add: function (_bc7) {
            this._AddToQueue(_bc7);
            this._StartUploads();
        },
        Remove: function (_bc8) {
            _bc8.RemoveListener(ITHit.WebDAV.Client.Upload.Events.EventName.OnStateChanged, this._OnStateChangeEventHandler, this);
            ITHit.WebDAV.Client.Upload.Utils.Array.Remove(this._QueueArray, _bc8);
            ITHit.WebDAV.Client.Upload.Utils.Array.Remove(this._Active, _bc8);
            this._StartUploads();
        },
        Reserve: function (_bc9) {
            _bc9 = _bc9 || 1;
            this._Reserve += _bc9;
        },
        Release: function (_bca) {
            _bca = _bca || 1;
            this._Reserve -= _bca;
            this._StartUploads();
        },
        GetBusy: function () {
            return this._Active.length + this._Reserve;
        },
        GetFree: function () {
            var _bcb = this.GetBusy();
            if (_bcb >= this._ParallelUploads) {
                return 0;
            } else {
                if (_bcb === 0) {
                    return this._ParallelUploads;
                } else {
                    return (this._ParallelUploads - _bcb) % this._ParallelUploads;
                }
            }
        },
        _QueueArray: null,
        _Active: null,
        _ParallelUploads: 0,
        _OnStateChangeEventHandler: function (_bcc) {
            if (_bcc.NewState !== ITHit.WebDAV.Client.Upload.State.Uploading) {
                this.Remove(_bcc.Sender);
            } else {
                this._StartUploads();
            }
        },
        _StartUploads: function () {
            if (this._QueueArray.length === 0) {
                return;
            }
            var _bcd = this.GetFree();
            if (_bcd <= 0) {
                return;
            }
            var _bce = ITHit.WebDAV.Client.Upload.Utils.Array.Take(this._QueueArray, _bcd);
            if (_bce.length < 1) {
                return;
            }
            this.Reserve(_bce.length);
            _bce.forEach(this._StartSingle, this);
        },
        _StartSingle: function (_bcf) {
            this._Active.push(_bcf);
            _bcf.StartAsync();
            this.Release();
        },
        _AddToQueue: function (_bd0) {
            this._QueueArray.push(_bd0);
            _bd0.AddListener(ITHit.WebDAV.Client.Upload.Events.EventName.OnStateChanged, this._OnStateChangeEventHandler, this);
        },
        _Reserve: 0
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Queue", null, {
        Uploader: null,
        _UnderlyingArray: null,
        _Session: null,
        _AutoUploader: null,
        constructor: function (_bd1) {
            this.Uploader = _bd1;
            this._Session = new ITHit.WebDAV.Client.Upload.UploaderSession();
            this._UnderlyingArray = [];
            this._GroupManager = new ITHit.WebDAV.Client.Upload.Groups.GroupManager();
            this._AutoUploader = new ITHit.WebDAV.Client.Upload.AutoUploader(this.Uploader.Settings.ConcurrentUploads);
        },
        ShouldReplaceDuplicate: function (_bd2) {
            var _bd3 = this.GetByUrl(_bd2.GetUrl());
            var _bd4 = _bd3.GetState();
            return !(_bd4 === ITHit.WebDAV.Client.Upload.State.Uploading || _bd4 === ITHit.WebDAV.Client.Upload.State.Paused);
        },
        AddGroup: function (sUrl, _bd6, _bd7) {
            var _bd8 = [];
            for (var i = 0; i < _bd6.length; i++) {
                var _bda = _bd6[i];
                var _bdb = new ITHit.WebDAV.Client.Upload.UploadItem(sUrl, _bda, _bd7, this._Session, this._GroupManager, this.Uploader.Settings);
                if (this.HasUrl(_bdb.GetUrl())) {
                    if (this.ShouldReplaceDuplicate(_bdb)) {
                        this.RemoveByUrl(_bdb.GetUrl());
                    } else {
                        continue;
                    }
                }
                _bd8.push(_bdb);
            }
            this._DispatchOnUploadItemsCreatedAsync(_bd8, this._OnUploadItemsCreatedAsyncDispatched.bind(this));
        },
        Add: function (_bdc) {
            var sUrl = _bdc.GetUrl();
            if (this.HasUrl(sUrl)) {
                return;
            }
            this._UnderlyingArray.push(_bdc);
            var _bde = new ITHit.WebDAV.Client.Upload.Events.QueueChanged(this, [_bdc]);
            ITHit.Events.DispatchEvent(this, _bde.Name, [_bde]);
            this._AutoUploader.Add(_bdc);
        },
        AddRange: function (_bdf) {
            for (var i = 0; i < _bdf.length; i++) {
                var _be1 = _bdf[i];
                var sUrl = _be1.GetUrl();
                if (this.HasUrl(sUrl)) {
                    continue;
                }
                this._UnderlyingArray.push(_be1);
            }
            this._GroupManager.CreateGroup(_bdf);
            this._OnQueueChanged(_bdf, null);
            var _be3 = _bdf.filter(function (_be4) {
                return _be4.GetState() === ITHit.WebDAV.Client.Upload.State.Queued;
            });
            this._AutoUploader.AddRange(_be3);
        },
        Restart: function (_be5) {
            for (var i = 0; i < _be5.length; i++) {
                if (!this.HasUrl(_be5[i].GetUrl())) {
                    throw new ITHit.Exceptions.ArgumentException("Item should be a part of queue`");
                }
            }
            this._AutoUploader.AddRange(_be5);
        },
        GetByUrl: function (sUrl) {
            return ITHit.Utils.FindBy(this._UnderlyingArray, function (_be8) {
                return _be8.GetUrl() === sUrl;
            });
        },
        GetLength: function () {
            return this._UnderlyingArray.length;
        },
        HasUrl: function (sUrl) {
            return !!this.GetByUrl(sUrl);
        },
        RemoveByUrl: function (sUrl) {
            var _beb = this.GetByUrl(sUrl);
            if (!_beb) {
                return;
            }
            var _bec = _beb.GetState();
            if (_bec === ITHit.WebDAV.Client.Upload.State.Uploading || _bec === ITHit.WebDAV.Client.Upload.State.Paused) {
                _beb.Abort();
            }
            var _bed = ITHit.Utils.IndexOf(this._UnderlyingArray, _beb);
            this._UnderlyingArray.splice(_bed, 1);
            this._OnQueueChanged(null, [_beb]);
            this._AutoUploader.Remove(_beb);
        },
        OnUploadItemsCreatedCallback: null,
        _OnQueueChanged: function (_bee, _bef) {
            var _bf0 = new ITHit.WebDAV.Client.Upload.Events.QueueChanged(this, _bee, _bef);
            ITHit.Events.DispatchEvent(this, _bf0.Name, [_bf0]);
        },
        _DispatchOnUploadItemsCreatedAsync: function (_bf1, _bf2) {
            var _bf3 = new ITHit.WebDAV.Client.Upload.Events.UploadItemsCreated(this, _bf1.slice(), _bf2);
            if (!this.OnUploadItemsCreatedCallback && (ITHit.Events.ListenersLength(this, _bf3.Name) === 0)) {
                _bf3.OverwriteAll();
            }
            if (this.OnUploadItemsCreatedCallback) {
                this.OnUploadItemsCreatedCallback(_bf3);
            }
            ITHit.Events.DispatchEvent(this, _bf3.Name, _bf3);
        },
        AddListener: function (_bf4, _bf5, _bf6) {
            _bf6 = _bf6 || null;
            switch (_bf4) {
                case ITHit.WebDAV.Client.Upload.Events.EventName.OnQueueChanged:
                case ITHit.WebDAV.Client.Upload.Events.EventName.OnUploadItemsCreated:
                    ITHit.Events.AddListener(this, _bf4, _bf5, _bf6);
                    break;
                default:
                    throw new ITHit.WebDAV.Client.Exceptions.WebDavException("Not found event name `" + _bf4 + "`");
            }
        },
        RemoveListener: function (_bf7, _bf8, _bf9) {
            ITHit.Events.RemoveListener(this, _bf7, _bf8, _bf9);
        },
        _OnUploadItemsCreatedAsyncDispatched: function (_bfa) {
            if (_bfa.Upload) {
                this.AddRange(_bfa.Upload);
                return;
            }
            this._OnUploadItemsCreatedAsyncDispatchedDeprecated(_bfa);
        },
        _OnUploadItemsCreatedAsyncDispatchedDeprecated: function (_bfb) {
            var _bfc = this._FilterSkippedItems(_bfb);
            var _bfd = this._CreateUrlUploadItemMap(_bfb.Overwrite);
            _bfc.forEach(function (_bfe) {
                if (_bfd.Has(_bfe.GetUrl())) {
                    _bfe.SetOverwrite(true);
                }
            });
            this.AddRange(_bfc);
        },
        _FilterSkippedItems: function (_bff) {
            var _c00 = this._CreateUrlUploadItemMap(_bff.Skip);
            return _bff.Original.filter(function (_c01) {
                return !_c00.Has(_c01.GetUrl());
            });
        },
        _CreateUrlUploadItemMap: function (_c02) {
            var oMap = new ITHit.WebDAV.Client.Upload.Collections.Map();
            _c02.forEach(function (_c04) {
                oMap.Set(_c04.GetUrl(), _c04);
            });
            return oMap;
        },
        _GroupManager: null
    });
})();
(function () {
    "use strict";
    var _c05 = ITHit.DefineClass("ITHit.WebDAV.Client.Upload.DropZoneCollection", null, {
        _UnderlyingSet: null,
        Uploader: null,
        constructor: function (_c06) {
            this._Uploader = _c06;
            this._UnderlyingSet = {};
        },
        AddById: function (_c07) {
            var _c08 = this.GetById(_c07);
            if (_c08) {
                return _c08;
            }
            var _c09 = new ITHit.WebDAV.Client.Upload.Controls.DropZone(_c07);
            this._UnderlyingSet[_c07] = _c09;
            this._RaiseOnCollectionChanged([_c09], []);
            return _c09;
        },
        GetById: function (_c0a) {
            return this._UnderlyingSet[_c0a];
        },
        RemoveById: function (_c0b) {
            var _c0c = this.GetById(_c0b);
            if (_c0c) {
                delete this._UnderlyingSet[_c0b];
                this._RaiseOnCollectionChanged([], [_c0c]);
            }
        },
        AddListener: function (_c0d, _c0e, _c0f) {
            _c0f = _c0f || null;
            this._CheckEventNameOtThrow(_c0d);
            ITHit.Events.AddListener(this, _c0d, _c0e, _c0f);
        },
        RemoveListener: function (_c10, _c11, _c12) {
            _c12 = _c12 || null;
            this._CheckEventNameOtThrow(_c10);
            ITHit.Events.RemoveListener(this, _c10, _c11, _c12);
        },
        _CheckEventNameOtThrow: function (_c13) {
            if (_c13 !== _c05.EVENT_ON_COLLECTION_CHANGED) {
                throw new ITHit.WebDAV.Client.Exceptions.NotFoundEventNameException(_c13);
            }
        },
        _RaiseOnCollectionChanged: function (_c14, _c15) {
            ITHit.Events.DispatchEvent(this, _c05.EVENT_ON_COLLECTION_CHANGED, [{
                Sender: this,
                AddedItems: _c14 || [],
                RemovedItems: _c15 || []
            }]);
        }
    }, {
        EVENT_ON_COLLECTION_CHANGED: "OnCollectionChanged"
    });
})();
(function () {
    var _c16 = ITHit.DefineClass("ITHit.WebDAV.Client.Upload.InputCollection", null, {
        _UnderlyingSet: null,
        Uploader: null,
        constructor: function (_c17) {
            this._UnderlyingArray = [];
            this._Uploader = _c17;
        },
        AddById: function (_c18) {
            var _c19 = new ITHit.WebDAV.Client.Upload.Controls.Input(_c18);
            this._UnderlyingArray[_c18] = _c19;
            this._RaiseOnCollectionChanged([_c19], []);
            return _c19;
        },
        GetById: function (_c1a) {
            return this._UnderlyingArray[_c1a];
        },
        RemoveById: function (_c1b) {
            var _c1c = this.GetById(_c1b);
            if (_c1c) {
                delete this._UnderlyingSet[_c1b];
                this._RaiseOnCollectionChanged([], [_c1c]);
            }
        },
        AddListener: function (_c1d, _c1e, _c1f) {
            _c1f = _c1f || null;
            this._CheckEventNameOtThrow(_c1d);
            ITHit.Events.AddListener(this, _c1d, _c1e, _c1f);
        },
        RemoveListener: function (_c20, _c21, _c22) {
            _c22 = _c22 || null;
            this._CheckEventNameOtThrow(_c20);
            ITHit.Events.RemoveListener(this, _c20, _c21, _c22);
        },
        _CheckEventNameOtThrow: function (_c23) {
            if (_c23 !== _c16.EVENT_ON_COLLECTION_CHANGED) {
                throw new ITHit.WebDAV.Client.Exceptions.NotFoundEventNameException(_c23);
            }
        },
        _RaiseOnCollectionChanged: function (_c24, _c25) {
            ITHit.Events.DispatchEvent(this, _c16.EVENT_ON_COLLECTION_CHANGED, [{
                Sender: this,
                AddedItems: _c24 || [],
                RemovedItems: _c25 || []
            }]);
        }
    }, {
        EVENT_ON_COLLECTION_CHANGED: "OnCollectionChanged"
    });
})();
(function () {
    "use strict";
    ITHit.DefineClass("ITHit.WebDAV.Client.Upload.Uploader", null, {
        DropZones: null,
        Inputs: null,
        Queue: null,
        Settings: null,
        _UploadProvider: null,
        constructor: function () {
            this.Inputs = new ITHit.WebDAV.Client.Upload.InputCollection(this);
            this.Inputs.AddListener(ITHit.WebDAV.Client.Upload.InputCollection.EVENT_ON_COLLECTION_CHANGED, this._OnControlCollectionChangedEventHandler, this);
            this.DropZones = new ITHit.WebDAV.Client.Upload.DropZoneCollection(this);
            this.DropZones.AddListener(ITHit.WebDAV.Client.Upload.DropZoneCollection.EVENT_ON_COLLECTION_CHANGED, this._OnControlCollectionChangedEventHandler, this);
            this.Settings = new ITHit.WebDAV.Client.Upload.Settings();
            this.Queue = new ITHit.WebDAV.Client.Upload.Queue(this);
        },
        SetUploadUrl: function (sUrl) {
            this._UploadUrl = sUrl;
        },
        GetUploadUrl: function () {
            return this._UploadUrl;
        },
        _OnControlCollectionChangedEventHandler: function (_c27) {
            _c27.AddedItems.forEach(function (_c28) {
                    _c28.AddListener(ITHit.WebDAV.Client.Upload.Controls.HtmlControl.EVENT_ON_FILE_INPUT_HANDLED, this._OnFileInputEventHandler.bind(this));
                }
                .bind(this));
            _c27.RemovedItems.forEach(function (_c29) {
                    _c29.RemoveListener(ITHit.WebDAV.Client.Upload.Controls.HtmlControl.EVENT_ON_FILE_INPUT_HANDLED, this._OnFileInputEventHandler.bind(this));
                }
                .bind(this));
        },
        _OnFileInputEventHandler: function (_c2a) {
            this.Queue.AddGroup(this._UploadUrl, _c2a.AsyncResult.Result, _c2a.Source);
        }
    });
})();
ITHit.Temp = {};