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
      * @api : onNavigate
       * gets invoked as soon as the control comes to the form
      * @return : NA
      */
    onNavigate: function (param) {
      if(!kony.sdk.isNullOrUndefined(param.params)){
        param = param.params;
      }
      var scope = this;
      this.view.UnifiedTransfer.setContext(param);
      this.view.UnifiedTransfer.onError = this.onError;
      this.view.UnifiedTransfer.onCancelTransfer = this.onCancelTransfer;
      this.view.UnifiedTransfer.showErrorMessage = this.showErrorMessage;
      this.view.UnifiedTransfer.createTransfer = this.createTransfer;
    },

    preShow: function () {
      var scope = this;
      FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxHeader', 'flxFooter']);
      this.view.customheadernew.activateMenu("UNIFIEDTRANSFER", "");
      this.view.flxTransferOption1.onTouchStart = this.showTransferScreen.bind(this, "Same Bank");
      this.view.flxTransferOption2.onTouchStart = this.showTransferScreen.bind(this, "Domestic Transfer");
      this.view.flxTransferOption3.onTouchStart = this.showTransferScreen.bind(this, "International Transfer");
      this.view.flxTransferOption4.onTouchStart = this.showTransferScreen.bind(this, "Pay a Person");
      scope.view.flxClose.onClick = function () {
        scope.view.flxTransferError.setVisibility(false);
      };
    },

    postShow: function () {
      this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight - this.view.flxHeader.info.frame.height - this.view.flxFooter.info.frame.height + "dp";
      applicationManager.getNavigationManager().applyUpdates(this);
      applicationManager.executeAuthorizationFramework(this);
    },

    onHide: function() {
      this.view.flxTransferError.setVisibility(false);
      this.view.UnifiedTransfer.unsubscribeStore();
    },

    /**
       * updateFormUI - the entry point method for the form controller.
       * @param {Object} viewModel - it contains the set of view properties and keys.
       */
    updateFormUI: function (viewModel) {
      if (viewModel.isLoading === true) {
        FormControllerUtility.showProgressBar(this.view);
      } else if (viewModel.isLoading === false) {
        FormControllerUtility.hideProgressBar(this.view);
      }
    },

    /**
       * @api : onError
       * Error thrown from catch block in component and shown on the form
       * @return : NA
       */
    onError: function (err) {
      alert(JSON.stringify(err));
    },

    onCancelTransfer: function () {
      var scope=this;
      new kony.mvc.Navigation({
        "appName": "UnifiedTransferMA",
        "friendlyName": "frmUTFLanding"
      }, false).navigate();
      //       var obj = {
      //         "context": scope,
      //         "params": {
      //         },
      //         "callbackModelConfig": {
      //           "onCancelClick":true
      //         }
      //       };
      //       var navManager = kony.mvc.getNavigationManager();
      //       navManager.navigate(obj);
    },

    showErrorMessage: function (errorObj) {
      var scope = this;
      if (errorObj) {
        scope.view.flxFormContent.setContentOffset({ x: "0%", y: "0%" }, true);
        scope.view.flxTransferError.setVisibility(true);
        scope.view.lblErrorHeader.setVisibility(false);
        scope.view.lblErrorDescription.text = errorObj.dbpErrMsg || errorObj.errmsg || errorObj.errorMessage;
        scope.view.forceLayout();
      }
    },

    createTransfer: function (collectionObj) {
      var context = {
        "Transaction": collectionObj.Collection["Transaction"],
        "Recipients": collectionObj.Collection["Recipients"]
      };
      var scope=this;
      var obj = {
        "context": scope,
        "params": {
          "context":context
        },
        "callbackModelConfig": {
          "createTransfer":true
        }
      };
      var navManager = kony.mvc.getNavigationManager();
      navManager.navigate(obj);
    },

    showTransferScreen: function(transferType){
      var context = {
        "transferType": transferType
      };

      var frmName = "";
      switch (transferType) {
        case "Same Bank":
          frmName = "frmUTFSameBankTransfer";
          break;
        case "Domestic Transfer":
          frmName = "frmUTFDomesticTransfer";
          break;
        case "International Transfer":
          frmName = "frmUTFInternationalTransfer";
          break;
        case "Pay a Person":
          frmName = "frmUTFP2PTransfer";
          break;
      }

      if (transferType === "Pay a Person") {
        frmName = {
          "appName": "DigitalTransferMA",
          "friendlyName": "frmUTFP2PTransfer"
        };
      } else {
        frmName = {
          "appName": "UnifiedTransferMA",
          "friendlyName": frmName
        };
      }
      applicationManager.getNavigationManager().navigateTo(frmName, false, context);


      //       var scope=this;
      //       var obj = {
      //         "context": scope,
      //         "params": {
      //           "context":context
      //         },
      //         "callbackModelConfig": {
      //           "transferType":transferType
      //         }
      //       };
      //       var navManager = kony.mvc.getNavigationManager();
      //       navManager.navigate(obj);
    },

    showSameBankTransferOption: function() {
      this.view.flxTransferOption1.setVisibility(true);
    },

    hideSameBankTransferOption: function() {
      this.view.flxTransferOption1.setVisibility(false);
    },

    showDomesticTransferOption: function() {
      this.view.flxTransferOption2.setVisibility(true);
    },

    hideDomesticTransferOption: function() {
      this.view.flxTransferOption2.setVisibility(false);
    },

    showInternationalTransferOption: function() {
      this.view.flxTransferOption3.setVisibility(true);
    },

    hideInternationalTransferOption: function() {
      this.view.flxTransferOption3.setVisibility(false);
    },

    showP2PTransferOption: function() {
      this.view.flxTransferOption4.setVisibility(true);
    },

    hideP2PTransferOption: function() {
      this.view.flxTransferOption4.setVisibility(false);
    }

  };
});