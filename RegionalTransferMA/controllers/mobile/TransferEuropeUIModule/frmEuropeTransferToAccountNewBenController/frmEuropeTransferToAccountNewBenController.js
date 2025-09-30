define({
  init: function () {
    var scope=this;
    var currentFormObject = kony.application.getCurrentForm();
    var currentForm=currentFormObject.id;
    applicationManager.getPresentationFormUtility().initCommonActions(this, "CALLBACK", currentForm, scope.navigateCustomBack);
  },
  navigateCustomBack: function() {
    var transMod = applicationManager.getModulesPresentationController({"moduleName" : "TransferEuropeUIModule", "appName" : "RegionalTransferMA"});
    transMod.commonFunctionForgoBack();
  },
  cancelOnClick:function(){
    var transMod = applicationManager.getModulesPresentationController({"moduleName" : "TransferEuropeUIModule", "appName" : "RegionalTransferMA"});
    transMod.cancelCommon();
  },
  initActions: function () {
    var transMod = applicationManager.getModulesPresentationController({"moduleName" : "TransferEuropeUIModule", "appName" : "RegionalTransferMA"});
    this.view.customHeader.flxBack.onClick = this.navigateCustomBack;
    this.view.customHeader.btnRight.onClick = this.cancelOnClick;
    this.getSegmentData();
    this.renderTitleBar();
    this.view.SegSelectBank.onRowClick = function() {   
      var bankSel = this.data[this.selectedIndex[1]].title;
      transMod.enterAddRecipientFlow(bankSel);    
    };
      
   },
    renderTitleBar: function() {
    if (kony.os.deviceInfo().name === "iPhone") {
      this.view.flxHeader.isVisible = false;
    } else {
      this.view.flxHeader.isVisible = true;
    }
	},
  getWidgetDataMap : function () {
    var map = {
      lblFrequency:"title"
    };
    return map;
  },
  getSegmentData : function () {
    var transferPresentationController = applicationManager.getModulesPresentationController({"moduleName" : "TransferEuropeUIModule", "appName" : "RegionalTransferMA"});
    var segData = transferPresentationController.selectBenBank();
    this.view.SegSelectBank.widgetDataMap = this.getWidgetDataMap();
     this.view.SegSelectBank.setData(segData);

  }
  
});