define({
    /*
        This is an auto generated file and any modifications to it may result in corruption of the action sequence.
    */
    AS_AppEvents_c88cd89f639744e4ad9ac08a2f5ccf28: function AS_AppEvents_c88cd89f639744e4ad9ac08a2f5ccf28(eventobject) {
        var self = this;
        try {
            applicationManager.applicationMode = "Mobile";
        } catch (err) {
            alert(err);
        }
    },
    AS_AppEvents_e4cfe1196a10430181f00b5e4c711e8f: function AS_AppEvents_e4cfe1196a10430181f00b5e4c711e8f(eventobject) {
        var self = this;
        try {
            _kony.mvc.initCompositeApp(true);
            var ApplicationManager = require('ApplicationManager');
            applicationManager = ApplicationManager.getApplicationManager();
        } catch (err) {
            alert(err);
        }
    }
});