define({
    init : function(){
		var navManager = applicationManager.getNavigationManager();
		var currentForm=navManager.getCurrentForm();
		applicationManager.getPresentationFormUtility().initCommonActions(this,"YES",currentForm);
	},
    preShow: function () {
        if(applicationManager.getPresentationFormUtility().getDeviceName()==="iPhone"){
            this.view.flxHeader.isVisible = false;
            this.view.lblNote.text = kony.i18n.getLocalizedString("kony.mb.preferences.WouldYouLikeToUseTouchIdToLoginUsingYourBiometricsInsteadOfEnteringYourUsernameAndPassword?");
        }
        else{
            this.view.flxHeader.isVisible = true;
            this.view.lblNote.text = kony.i18n.getLocalizedString("kony.mb.preferences.UseDeviceBiometrics");
        }
        this.initActions();
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
        this.view.btnSetAsDefault.onClick = this.setTouchIdDefaultMode;
    },
  setTouchIdDefaultMode : function ()
  {
    applicationManager.getPresentationUtility().showLoadingScreen();
    var navManager = applicationManager.getNavigationManager();
    var authMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName":"AuthUIModule","appName":"AuthenticationMA"});
    authMod.presentationController.setBiometricCredentials();
    authMod.presentationController.setTouchIdflag(true);
    authMod.presentationController.setDefaultMode("touchid");
    var settingsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsUIModule", "appName" : "ManageProfileMA"});
	settingsModule.presentationController.getDevDetails();
    var tempData = settingsModule.presentationController.getAuthModeData();
    var deviceUtilManager = applicationManager.getDeviceUtilManager();
    var isIphone = deviceUtilManager.isIPhone();
    if(isIphone)
      tempData.popUpMsg = kony.i18n.getLocalizedString("kony.mb.Touch.Id.is.set.a.Default.Login");
    else
      tempData.popUpMsg = kony.i18n.getLocalizedString("kony.mb.devReg.defaultSignInChanged");
    navManager.setCustomInfo("frmPreferencesDefaultLogin",tempData);
    settingsModule.presentationController.commonFunctionForNavigation("frmPreferencesDefaultLogin");
   }
});