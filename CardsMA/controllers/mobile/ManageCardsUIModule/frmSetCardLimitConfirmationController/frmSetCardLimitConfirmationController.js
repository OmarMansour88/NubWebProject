define({
  currencyCode: "",
  init: function () {
    var scope=this;
    var currentFormObject = kony.application.getCurrentForm();
    var currentForm=currentFormObject.id;
    applicationManager.getPresentationFormUtility().initCommonActions(this, "CALLBACK", currentForm, scope.navigateCustomBack);
  },
  
  preShow: function () {
/*    if(applicationManager.getPresentationFormUtility().getDeviceName() !== "iPhone"){
      this.view.flxHeader.isVisible = true;
    }
    else{
      this.view.flxHeader.isVisible = false;
      this.view.title= kony.i18n.getLocalizedString("kony.mb.MM.Confirmation");
    } */
    var navManager = applicationManager.getNavigationManager();
    var deviceUtilManager = applicationManager.getDeviceUtilManager();
    var configurationManager = applicationManager.getConfigurationManager();
    var formatManager = applicationManager.getFormatUtilManager();
    var isIPhone = deviceUtilManager.isIPhone();
    this.view.flxHeader.setVisibility(!isIPhone);
    this.currencyCode = configurationManager.getCurrencyCode();
    
    this.initActions();
    
    var cardDetails = navManager.getCustomInfo("frmSetCardLimitConfirmation");
    this.cardDetails = cardDetails;
    if (cardDetails === undefined) {
      var newObj = {
        "view": "none"
      };
      cardDetails = newObj;
    }
//    this.setupUI();
    this.view.lblRequestId.text = cardDetails.requestId;
    if (cardDetails.view === "purchase") {
      this.view.lblUpdateMsg.text=kony.i18n.getLocalizedString("kony.mb.cardManage.purchaseLimitUpdate");
    }
    
    if (cardDetails.view === "withdrawal") {
      this.view.lblUpdateMsg.text=kony.i18n.getLocalizedString("kony.mb.cardManage.ATMLimitUpdate");
    }

    var newLimit = cardDetails.newLimit;
//    var currencySymbol = cardDetails.currencySymbol;
    this.view.lblNewLimitValue.text = formatManager.getCurrencySymbol(this.currencyCode) + " " + newLimit; 
    applicationManager.getPresentationUtility().dismissLoadingScreen();

    var currentForm = navManager.getCurrentForm();

    applicationManager.getPresentationFormUtility().logFormName(currentForm);
  },
  
  initActions: function () {
    var scope = this;

    scope.view.btnCardsManagement.onClick=function(){
//      scope_ManageCards_Pres.activeCardsScenario=true;
      var navManager = applicationManager.getNavigationManager();
      navManager.setCustomInfo("frmCardManageHome",{"isMainScreen": false});
      var manageCardsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule");
      manageCardsModule.presentationController.showCardsHome();
    };
    this.view.onDeviceBack = scope.view.btnCardsManagement.onClick;
  },
  setupUI : function () {
    /*  if(scope_ManageCards_Pres.isATMLimitScenario===true)
    {
      scope_ManageCards_Pres.isATMLimitScenario=false;
      this.view.lblUpdateMsg.text=kony.i18n.getLocalizedString("kony.mb.cardManage.ATMLimitUpdate");

    }
  else
    {
      scope_ManageCards_Pres.isPurchaseLimitScenario=false;
      this.view.lblUpdateMsg.text=kony.i18n.getLocalizedString("kony.mb.cardManage.purchaseLimitUpdate");
    }

*/
    var newLimit = 2000;
    this.view.lblNewLimitValue.text = kony.i18n.getLocalizedString("kony.mb.common.currencySymbol") + " " + newLimit;
    applicationManager.getPresentationUtility().dismissLoadingScreen();
  }

});