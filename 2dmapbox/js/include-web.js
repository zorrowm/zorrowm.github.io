(function () {
    var r = new RegExp("(^|(.*?\\/))(include-web\.js)(\\?|$)"),
        s = document.getElementsByTagName('script'), targetScript;
    for (var i = 0; i < s.length; i++) {
        var src = s[i].getAttribute('src');
        if (src) {
            var m = src.match(r);
            if (m) {
              var relativePath = m[1] || "./";
                targetScript = s[i];
                break;
            }
        }
    }
    function inputScript(url) {
        var script = '<script type="text/javascript" src="' + url + '"></script>';
        document.writeln(script);
    }
    function inputCSS(url) {
        var css = '<link rel="stylesheet" href="' + url + '">';
        document.writeln(css);
    }

    function inArray(arr, item) {
        for (i in arr) {
            if (arr[i] == item) {
                return true;
            }
        }
        return false;
    }

    //加载类库资源文件
    function load() {
        var includes = (targetScript.getAttribute('include') || "").split(",");
        if (inArray(includes, 'geolocation')) {
            inputScript("js/geolocation.min.js");
        }

        // if (inArray(includes, 'CesiumOfflineCache')) {
        //     inputScript("js/CesiumOfflineCache.min.js");
        // }
        // if (inArray(includes, 'turf')) {
        //     inputScript("js/turf-async/index.js")
        // }

        // if (inArray(includes, 'admin-lte')) {
        //     inputCSS("template/third-party/admin-lte/css/AdminLTE.min.css");
        //     inputCSS("template/third-party/admin-lte/css/skins/_all-skins.min.css");
        //     inputCSS("template/third-party/font-awesome/css/font-awesome.min.css");
        //     inputScript("template/third-party/admin-lte/js/app.min.js");
        // }
    }
    load();
})();
