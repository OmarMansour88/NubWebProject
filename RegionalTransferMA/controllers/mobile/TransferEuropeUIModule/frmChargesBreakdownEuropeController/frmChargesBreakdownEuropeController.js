define({ 

  //Type your controller code here 
  initActions: function () {
    this.renderTitleBar();
    this.view.customHeader.flxBack.onTouchEnd = this.navigateCustomBack;
    this.view.customHeader.btnRight.onClick = this.cancelOnClick;
    this.getSegmentData();
  },
  navigateCustomBack: function() {
    var transferModule = applicationManager.getModulesPresentationController({"moduleName" : "TransferEuropeUIModule", "appName" : "RegionalTransferMA"});
    transferModule.commonFunctionForgoBack();
  },
  renderTitleBar: function() {
    if (applicationManager.getPresentationFormUtility().getDeviceName() === 'iPhone') {
      this.view.flxHeader.setVisibility(false);
      this.view.flxMain.top = "0dp";
    }
  },
  cancelOnClick:function(){
    var transferModule = applicationManager.getModulesPresentationController({"moduleName" : "TransferEuropeUIModule", "appName" : "RegionalTransferMA"});
    transferModule.cancelCommon();
  },

  getWidgetDataMap : function () {
    var map = {
      lblTitle:"property",
      lblDetails:"value",
    }
    return map;
  },
  getSegmentData : function () {
    var transferPresentationController = applicationManager.getModulesPresentationController({"moduleName" : "TransferEuropeUIModule", "appName" : "RegionalTransferMA"});
    var segData = transferPresentationController.getChargesBreakdown();
    this.view.segDataCharges.widgetDataMap = this.getWidgetDataMap();
    this.view.segDataCharges.setData(segData);

  }
  
});