define([],function () {
		    function AccountServicesManager(){
      kony.mvc.Business.Controller.call(this);
    }
    inheritsFrom(AccountServicesManager,kony.mvc.Business.Delegator);  
    AccountServicesManager.prototype.initializeBusinessController = function(){
    };
    AccountServicesManager.prototype.execute = function(command)
    {
      kony.mvc.Business.Controller.prototype.execute.call(this,command);
    };
  
    AccountServicesManager.prototype.generateCombinedStatement = function(payload, presentationSuccessCallback, presentationErrorCallback) {
    var accStatements = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("CombinedStatements");
    accStatements.customVerb("generate", payload, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error);
        if (obj["status"] === true) {
            presentationSuccessCallback(obj["data"]);
        } else {
            presentationErrorCallback(obj["errmsg"]);
        }
    }
};
  
AccountServicesManager.prototype.DownloadCombinedStatement = function( reqParams ) {
    var mfURL = KNYMobileFabric.mainRef.config.services_meta.DocumentManagement.url;
    var authToken = KNYMobileFabric.currentClaimToken;
    var serviceURL = mfURL + "/objects/CombinedStatements?Auth_Token=" + authToken;
    serviceURL = serviceURL + "&" + "X-Kony-ReportingParams" + "=" + kony.sdk.getEncodedReportingParamsForSvcid("register_"+"DbxUserLogin"); 
    var paramURL = "";
    if( reqParams.fileId ){
      paramURL += "&fileId=" + reqParams.fileId;
    }
    return serviceURL + paramURL;
  };

    AccountServicesManager.prototype.checkDownloadStatusOfCombinedStatement = function(payload, presentationSuccessCallback, presentationErrorCallback) {
    var accStatements = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("CombinedStatements");
    accStatements.customVerb("getStatements", payload, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error);
        if (obj["status"] === true) {
            presentationSuccessCallback(obj["data"]);
        } else {
            presentationErrorCallback(obj["errmsg"]);
        }
    }
};
    return AccountServicesManager; 
});
