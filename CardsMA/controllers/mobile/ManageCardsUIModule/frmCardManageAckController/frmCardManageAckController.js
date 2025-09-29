define({
init: function () {
var scope=this;
var currentFormObject = kony.application.getCurrentForm();
var currentForm=currentFormObject.id;
applicationManager.getPresentationFormUtility().initCommonActions(this, "CALLBACK", currentForm, scope.navigateCustomBack);
},
preShow: function () {
 if(applicationManager.getPresentationFormUtility().getDeviceName() !== "iPhone"){
      		this.view.flxHeader.isVisible = true;
    	}
    	else{
      		this.view.flxHeader.isVisible = false;
this.view.title= kony.i18n.getLocalizedString("kony.mb.MM.Confirmation");
   		 }
this.initActions();
this.setupUI();
// this.view.lblSuccessMsg.isVisible=false;
  //this.view.btnDisposeCard.isVisible=false;
var navManager = applicationManager.getNavigationManager();
var currentForm = navManager.getCurrentForm();
applicationManager.getPresentationFormUtility().logFormName(currentForm);
},
initActions: function () {
var scope = this;
scope.view.btnDisposeCard.onClick=function(){
kony.application.openURL("https://www.google.com/");
};
scope.view.btnMyAccounts.onClick=function(){
scope_ManageCards_Pres.activeCardsScenario=true;
var manageCardsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule");
manageCardsModule.presentationController.showCardsHome();
};
},
setupUI : function () {
if (scope_ManageCards_Pres.ackFlag===true){
this.view.flxReplaceCardSuccess.isVisible = true;
this.view.flxFailure.isVisible = false;
  if(scope_ManageCards_Pres.isReplaceCardScenario===true)
    {
      scope_ManageCards_Pres.isReplaceCardScenario=false;
      this.view.lblSuccessMsg.setVisibility(true);
      this.view.btnDisposeCard.setVisibility(true);
      this.view.lblSuccessMessage.setVisibility(true);
      this.view.btnDisposeCard.text=kony.i18n.getLocalizedString("kony.mb.cards.dispose");
      this.view.lblSuccessMsg.text=kony.i18n.getLocalizedString("kony.mb.cards.disposeCards");
     this.view.lblSuccessMessage.text= kony.i18n.getLocalizedString("kony.mb.cards.replacecards")+" orderId: "+scope_ManageCards_Pres.reqID;
    }
  else
    {
      this.view.lblSuccessMsg.setVisibility(false);
      this.view.btnDisposeCard.setVisibility(false);
      this.view. lblSuccessMessage.isVisible=true;
       this.view.lblSuccessMessage.text= kony.i18n.getLocalizedString("kony.mb.cards.activate")+" orderId: "+scope_ManageCards_Pres.reqID;
    }
// this.view.lblError.text = "Invalid Params";
}
else {
this.view.flxFailure.isVisible = true;
this.view.flxReplaceCardSuccess.isVisible = false;
  this.view.btnDisposeCard.setVisibility(false);
this.view.lblMessage.text = scope_ManageCards_Pres.errorMsg;
scope_ManageCards_Pres.lblMessage="";
}
scope_ManageCards_Pres.ackFlag=false;
  scope_ManageCards_Pres.reqID.reqID="";
applicationManager.getPresentationUtility().dismissLoadingScreen();
}

});