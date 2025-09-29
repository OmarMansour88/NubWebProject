define({
 init : function(){
   var navManager = applicationManager.getNavigationManager();
   var currentForm=navManager.getCurrentForm();
   applicationManager.getPresentationFormUtility().initCommonActions(this,"YES",currentForm);
 },
 frmPreShow : function(){
    this.setPreshowData();
    this.setFlowActions();
   this.setData();
   var navManager = applicationManager.getNavigationManager();
   var currentForm=navManager.getCurrentForm();
   applicationManager.getPresentationFormUtility().logFormName(currentForm);
   applicationManager.getPresentationUtility().dismissLoadingScreen();
  },
  setPreshowData : function(){
        if(applicationManager.getPresentationFormUtility().getDeviceName() !== "iPhone"){
      this.view.flxHeader.isVisible = true;
      this.view.flxMainContainer.top = "56dp";
    }
    else{
      this.view.flxHeader.isVisible = false;
      this.view.flxMainContainer.top = "0dp";
    }
  },
  setData : function(){
    var nav = applicationManager.getNavigationManager();
    var data = nav.getCustomInfo('frmProfileConfirmDetails');
    this.view.lblPhoneNumberValue.text = data.phoneCountryCode+" "+data.phoneNumber;
    this.view.lblContantTypeValue.text = data.type;
    this.view.lblCountryValue.text = data.countryType;
    this.view.lblMarkasPrimaryValue.text = data.isPrimary === "true"?"Yes":"No";
  },
  setFlowActions : function(){
    var scope = this;
    this.view.btnUpdateChanges.onClick = function(){
      //scope.navToList();
      var settingsMode = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("SettingsUIModule");
    settingsMode.presentationController.addUserPhoneNumber();
    };
	this.view.customHeader.btnRight.onClick = function(){
    var settingsMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("SettingsUIModule");
	settingsMod.presentationController.commonFunctionForNavigation("frmProfilePersonalDetails");
    };
    this.view.customHeader.flxBack.onClick = function(){
      var navManager = applicationManager.getNavigationManager();
      navManager.goBack();
    };
  },
  navToList : function(){
  }
 });