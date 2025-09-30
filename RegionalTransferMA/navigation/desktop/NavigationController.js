define({
    //Add your navigation controller code here.
    handleTransferNavigation: function(data) {
        var formToBeNavigated = "";
        if (data !== null) {
            formToBeNavigated = {
                "friendlyName":  data.UIModule +  "/" + data.frm,
                "appName": data.appName
            };
            return formToBeNavigated;
        }
        return null;
    }
});