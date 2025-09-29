define(['FormControllerUtility', 'CommonUtilities'], function (FormControllerUtility, CommonUtilities) {
  var responsiveUtils = new ResponsiveUtils();
  var orientationHandler = new OrientationHandler();
  return {

    init: function () {
      this.view.preShow = this.preShow;
      this.view.postShow = this.postShow;
      this.view.onDeviceBack = function () { };
      this.view.onBreakpointChange = this.onBreakpointChange;
      this.view.onHide = this.onHide;
    },

    onBreakpointChange: function (form, width) {
      var scope = this;
      FormControllerUtility.setupFormOnTouchEnd(width);
      responsiveUtils.onOrientationChange(this.onBreakpointChange);
      this.view.customheadernew.onBreakpointChangeComponent(width);
      this.view.customfooternew.onBreakpointChangeComponent(width);
    },

    /**
       * preShow
       * @api : preShow    
       * @return : NA
       */
    preShow : function(){
      FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxHeader', 'flxFooter','flxMain','flxLogout']);
      this.view.customheadernew.activateMenu("UNIFIEDTRANSFER", "");
      this.view.UnifiedTransfersAcknowledgement.button1Click = this.button1Click;
      this.view.UnifiedTransfersAcknowledgement.button2Click = this.button2Click;
      this.view.UnifiedTransfersAcknowledgement.button3Click = this.button3Click;
    },

    postShow: function(){},

    onHide: function() {
      this.view.UnifiedTransfersAcknowledgement.unsubscribeStore();
    },

    onNavigate:function(params) {
      var scope = this;
      if(!kony.sdk.isNullOrUndefined(params.params)){
        params = params.params;
      }
      if(kony.application.getCurrentBreakpoint() === "640") {
        this.view.flxHeader.height = "50dp";
      }
      if(params.Collection) params = params.Collection;
      this.view.UnifiedTransfersAcknowledgement.setContext(params,scope); 
    },

    button3Click: function () {
      // if (applicationManager.getConfigurationManager().getDeploymentGeography() === "EUROPE") {
        applicationManager.getModulesPresentationController({
          "moduleName": "ManageActivitiesUIModule",
          "appName": "UnifiedTransferMA"
        }).showTransferScreen({ context: "PastPayments" });
      // } else {
      //   applicationManager.getModulesPresentationController({
      //     "moduleName": "TransferFastUIModule",
      //     "appName": "RegionalTransferMA"
      //   }).showTransferScreen({ initialView: "PastPayments" });
      // }
    },

    button1Click: function(){
      var scope=this;
      var navMan = applicationManager.getNavigationManager();
      new kony.mvc.Navigation({
        "appName": "UnifiedTransferMA",
        "friendlyName": "frmUTFLanding"
      }).navigate();

      //       var obj = {
      //         "context": scope,
      //         "params": {
      //         },
      //         "callbackModelConfig": {
      //           "button1click":true
      //         }
      //       };
      //       var navManager = kony.mvc.getNavigationManager();
      //       navManager.navigate(obj);
    },

    button2Click: function(params) {
      params = Object.assign(params.Recipients, params.Transaction);
      var scope=this;
      //       var obj = {
      //         "context": scope,
      //         "params": {
      //           "params":params
      //         },
      //         "callbackModelConfig": {
      //           "button2click":true
      //         }
      //       };
      //       var navManager = kony.mvc.getNavigationManager();
      //       navManager.navigate(obj);

      var navMan = applicationManager.getNavigationManager();
      new kony.mvc.Navigation({
        "appName": "UnifiedTransferMA",
        "friendlyName": "frmSavePayeeforOTT"
      },false,params).navigate();
    },

    updateFormUI: function(viewModel) {
      if (viewModel.isLoading === true) {
        FormControllerUtility.showProgressBar(this.view);
      } else if (viewModel.isLoading === false) {
        FormControllerUtility.hideProgressBar(this.view);
      }
    }
  };
});

