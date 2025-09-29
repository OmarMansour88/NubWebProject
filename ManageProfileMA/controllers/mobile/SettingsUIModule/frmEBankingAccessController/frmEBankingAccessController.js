define({ 

    //Type your controller code here 
    init : function(){
        var navManager = applicationManager.getNavigationManager();
        var currentForm = navManager.getCurrentForm();
        applicationManager.getPresentationFormUtility().initCommonActions(this,"YES",currentForm);
    },

    preshow : function(){
      	var deviceUtilManager = applicationManager.getDeviceUtilManager();
        var isIphone = deviceUtilManager.isIPhone();
        if(isIphone){
            this.view.flxHeader.isVisible = false;
        }
        else
            this.view.flxHeader.isVisible = true;
        this.setFlowActions();
        this.hidePopup();
        this.view.switchEbanking.selectedIndex = 1;
    },

    setFlowActions : function(){
        this.view.switchEbanking.onSlide = this.showPopup;
        this.view.btnCancel.onClick = this.hidePopup;
        this.view.btnRemove.onClick = this.showTnC;
        this.view.onDeviceBack = this.flxBackOnclick;
        this.view.customHeader.flxBack.onClick = this.flxBackOnclick;
    },

    showPopup : function(){
        this.view.flxPopup1.setVisibility(true);
    },

    hidePopup : function(){
        this.view.switchEbanking.selectedIndex = 1;
        this.view.flxPopup1.setVisibility(false);
    },

    bindViewError : function(msg){
        this.hidePopup();
        applicationManager.getDataProcessorUtility().showToastMessageError(this, msg);
    },

    flxBackOnclick:function(){
        var navManager = applicationManager.getNavigationManager();
        navManager.goBack();
    },
   
    showTnC : function(){
        applicationManager.getPresentationUtility().showLoadingScreen();
        var settingsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsUIModule", "appName" : "ManageProfileMA"});
        settingsModule.presentationController.getTnCForDisablingEBankingAccess();
    }
    });