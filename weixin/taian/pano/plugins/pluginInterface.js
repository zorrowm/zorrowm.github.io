var krpanoplugin = function () {
    var local = this;

    var krpano = null;
    var plugin = null;
    var device = null;
    var browserevents = null;
    local.registerplugin = function (krpanointerface, pluginpath, pluginobject) {
        krpano = krpanointerface;
        plugin = pluginobject;
        plugin.registerattribute("krpanointerface", krpanointerface, null, function () { return krpano; });
    }
}
