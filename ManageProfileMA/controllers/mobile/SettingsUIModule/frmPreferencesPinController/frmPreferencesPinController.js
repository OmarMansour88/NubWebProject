define({
	timerCounter: 0,
	init : function(){
		var navManager = applicationManager.getNavigationManager();
		var currentForm=navManager.getCurrentForm();
		applicationManager.getPresentationFormUtility().initCommonActions(this,"YES",currentForm);
	},
    preShow: function () {
        if(applicationManager.getPresentationFormUtility().getDeviceName()==="iPhone"){
            this.view.flxHeader.isVisible = false;
        }
        else{
            this.view.flxHeader.isVisible = true;
        }
        this.initActions();
        this.showPopUpMsg();
        var navManager = applicationManager.getNavigationManager();
	  	var currentForm = navManager.getCurrentForm();
	    applicationManager.getPresentationFormUtility().logFormName(currentForm);
	  	applicationManager.getPresentationUtility().dismissLoadingScreen();
    },
    initActions: function () {
        var scope = this;
        this.view.customHeader.flxBack.onClick=function(){
            var navManager = applicationManager.getNavigationManager();
            navManager.goBack();
        };
        this.view.btnSetAsDefault.onClick=this.btnSetAsDefaultOnClick;
        this.view.btnChangePin.onClick=this.btnChangePinOnClick;
    },
    showPopUpMsg : function()
   {
      var navManager = applicationManager.getNavigationManager();
      var msgData = navManager.getCustomInfo("frmPreferencesPin");
      if((msgData.popUpMsg!==null)&&(msgData.popUpMsg!==""))
      {
         var scopeObj=this;
         applicationManager.getDataProcessorUtility().showToastMessageSuccess(scopeObj,msgData.popUpMsg);
      }
     msgData.popUpMsg="";
	 navManager.setCustomInfo("frmPreferencesPin",msgData);
    },
    btnChangePinOnClick: function(){
      applicationManager.getPresentationUtility().showLoadingScreen();
      var settingsMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsUIModule", "appName" : "ManageProfileMA"});
      settingsMod.presentationController.commonFunctionForNavigation("frmPreferencesResetStep1");
	},
    btnSetAsDefaultOnClick: function(){
       applicationManager.getPresentationUtility().showLoadingScreen();
       var navManager = applicationManager.getNavigationManager();
       authMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "AuthUIModule", "appName" : "AuthenticationMA"});
       authMod.presentationController.setPinflag(true);
       authMod.presentationController.setDefaultMode("pin");
       var settingsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsUIModule", "appName" : "ManageProfileMA"});
       var tempData = settingsModule.presentationController.getAuthModeData();
	   settingsModule.presentationController.getDevDetails();
       tempData.popUpMsg = kony.i18n.getLocalizedString("kony.mb.PIN.is.set.as.Default.Login");
       navManager.setCustomInfo("frmPreferencesDefaultLogin",tempData);
       settingsModule.presentationController.commonFunctionForNavigation("frmPreferencesDefaultLogin");
    },
    bindViewSuccess : function(msg)
    {
    	applicationManager.getDataProcessorUtility().showToastMessageSuccess(this,msg);
  	}
});