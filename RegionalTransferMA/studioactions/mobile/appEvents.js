define({
    /*
        This is an auto generated file and any modifications to it may result in corruption of the action sequence.
    */
    AS_AppEvents_j18d7af6abff4a31b3894db95cec5577: function AS_AppEvents_j18d7af6abff4a31b3894db95cec5577(eventobject) {
        var self = this;
        try {
            applicationManager.applicationMode = "Mobile";
        } catch (err) {
            alert(err);
        }
    },
    AS_AppEvents_h2ca58051d5547298a589e1f3daa9ebc: function AS_AppEvents_h2ca58051d5547298a589e1f3daa9ebc(eventobject) {
        var self = this;
        _kony.mvc.initCompositeApp(true);
        try {
            var ApplicationManager = require('ApplicationManager');
            applicationManager = ApplicationManager.getApplicationManager();
        } catch (err) {
            alert(err);
        }
    }
});