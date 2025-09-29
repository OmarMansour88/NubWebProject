define({ 
  contextAck : "",
  onNavigate : function(context)
  {
    var scope = this;
    var navMan = applicationManager.getNavigationManager();
    context = navMan.getCustomInfo("frmNewPayeeNew");
    if(kony.os.deviceInfo().name === "iPhone") {
      var titleBarAttributes = this.view.titleBarAttributes;
      titleBarAttributes["shadowImage"] = "transparentbox.png";
      titleBarAttributes["hidesBackButton"] = false;
      this.view.titleBarAttributes = titleBarAttributes;
      this.view.setBackgroundImageForNavbar({
        "image": "transparentbox.png",
        "barMetrics": constants.BAR_METRICS_DEFAULT
      });
    }
    scope.initActions();
    this.contextAck = context;
    scope.view.saveNewPayee.setContext(context);
  },
  initActions:function()
  {
    var scope = this;
    var navMan = applicationManager.getNavigationManager();
    var configManager = applicationManager.getConfigurationManager();
    scope.view.flxSaveNewPayee.onScrolling = function() {
      scope.iPhoneHeaderHandler();
    };
    scope.view.saveNewPayee.onError = function(error)
    {
      alert(JSON.stringify(error));
    };
    scope.view.saveNewPayee.contextualActionButtonOnClick = function(data)
    {
      //       alert(JSON.stringify(data));
      if(data === "NewTransfer")
      {
//         var ntf = new kony.mvc.Navigation("frmSelectTransferType");
//         ntf.navigate();
        navMan.navigateTo("UnifiedTransferFlowNew/frmSelectTransferTypeNew");
      }
      if(data === "TryAgain")
      {
//         var ntf = new kony.mvc.Navigation("frmSelectTransferType");
//         ntf.navigate();
        navMan.navigateTo("UnifiedTransferFlowNew/frmSelectTransferTypeNew");
      }
       if(data === "TransferActivities")
      {
        var transMod = applicationManager.getModulesPresentationController("TransactionModule");
        if (configManager.getDeploymentGeography() === 'EUROPE') {
          applicationManager.getPresentationUtility().showLoadingScreen();
          var transferModPresentationController = applicationManager.getModulesPresentationController("TransferModule");
          transferModPresentationController.clearEuropeFlowAtributes();
          navMan.setEntryPoint("europeTransferFlow", "frmTransferActivitiesTransfersEurope");
          navMan.navigateTo("frmTransferActivitiesTransfersEurope");
        } 
        else {
          var moneyMovementModule = applicationManager.getModulesPresentationController("MoneyMovementModule");
          moneyMovementModule.clearMMFlowAtributes();
          navMan.setEntryPoint("centralmoneymovement", "frmTransferActivitiesTransfers");
          navMan.navigateTo("frmTransferActivitiesTransfers");

        }
      }
    };
    scope.view.saveNewPayee.getBtnEntitlement = function(btnId, data, callback)
    {
      callback(true);
    };
    scope.view.saveNewPayee.onBack = function()
    {
      scope.backToAcknowledgment();
    };
    scope.view.saveNewPayee.requestStart = function()
    {
      kony.application.showLoadingScreen(null, "", constants.LOADING_SCREEN_POSITION_ONLY_CENTER, true, true, {});
    };
    scope.view.saveNewPayee.requestEnd = function()
    {
      kony.application.dismissLoadingScreen();
    };
    scope.view.saveNewPayee.iphonePayeeAcknowledgmentHeaderHandler = scope.iphonePayeeAcknowledgmentHeader;
  },
  iPhoneHeaderHandler: function(){
    var scope = this;
    if(this.view.flxSaveNewPayee.contentOffsetMeasured.y > 50){
      scope.view.title = "Payee Nickname";
    }
    else if(this.view.flxSaveNewPayee.contentOffsetMeasured.y < 45){
      scope.view.title = "";
    }
  },
  backToAcknowledgment : function()
  {
    var ntf =new kony.mvc.Navigation(kony.application.getPreviousForm().id);
    ntf.navigate(this.contextAck);
  },
  iphonePayeeAcknowledgmentHeader: function() {
    var titleBarAttributes = this.view.titleBarAttributes;
    titleBarAttributes["hidesBackButton"] = true;
    this.view.titleBarAttributes = titleBarAttributes;
  }
});