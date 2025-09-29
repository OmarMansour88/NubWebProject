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

    preShow: function () {
      FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxHeader', 'flxFooter']);
      this.view.customheadernew.activateMenu("UNIFIEDTRANSFER", "");
      this.setFormUI();
    },

    postShow: function () {
      this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight - this.view.flxHeader.info.frame.height - this.view.flxFooter.info.frame.height + "dp";
    },

    onHide: function() {
      this.view.UnifiedTransferConfirm.unsubscribeStore();
    },

    onNavigate: function (param) {
      if(!kony.sdk.isNullOrUndefined(param.context)){
        param = param.context;
      }
      this.view.UnifiedTransferConfirm.setContext(param);
      this.view.UnifiedTransferConfirm.buttonConfirmOnClick = this.buttonConfirmOnClick;
      this.view.UnifiedTransferConfirm.buttonModifyOnClick = this.buttonModifyOnClick;
      this.view.UnifiedTransferConfirm.btnCancelOnClick = this.buttonCancelOnClick;
      this.view.UnifiedTransferConfirm.confirmTransferMFA = this.confirmTransferMFA;
      this.view.UnifiedTransferConfirm.onError = this.onError;
    },
    setFormUI: function () {
      this.view.customheadernew.lblHeaderMobile.text = kony.i18n.getLocalizedString("i18n.unifiedTransfer.TransfersConfirmation");
      this.view.lblConfirm.text = kony.i18n.getLocalizedString("i18n.unifiedTransfer.TransfersConfirmation");
      this.view.flxWarning.setVisibility(false);
    },
    confirmTransferMFA: function (params) {
      var navMan = applicationManager.getNavigationManager();
      if (params.MFAAttributes.MFAType === "SECURE_ACCESS_CODE") {
        new kony.mvc.Navigation({
          "appName": "UnifiedTransferMA",
          "friendlyName": "frmUTFEmailOrSMS"
        }, false).navigate(params);
        
      }
      else if (params.MFAAttributes.MFAType === "SECURITY_QUESTIONS") {
        new kony.mvc.Navigation({
          "appName": "UnifiedTransferMA",
          "friendlyName": "frmUTFSecurityQuestions"
        }, false).navigate(params);
      }

      //       var scope=this;
      //       var obj = {
      //         "context": scope,
      //         "params": {
      //           "params":params
      //         },
      //         "callbackModelConfig": {
      //           "MFAType":params.MFAAttributes.MFAType
      //         }
      //       };
      //       var navManager = kony.mvc.getNavigationManager();
      //       navManager.navigate(obj);
    },

    buttonConfirmOnClick: function (param) {
      var scope = this;
      var obj = {
        "context": scope,
        "params": {
          "params":param
        },
        "callbackModelConfig": {
          "buttonConfirmClick":true
        }
      };
      var navManager = kony.mvc.getNavigationManager();
      navManager.navigate(obj);
    },

    buttonModifyOnClick: function (param) {
      var addedParam = (!kony.sdk.isNullOrUndefined(param.Collection) && Object.keys(param.Collection).length > 0) ? param.Collection : param;
      //adding transferFlow variable for modify flow
      var params = {
        "transferType": addedParam.Transaction.transferType,
        "transferFlow": "Modify",
        "ErrorDetails": addedParam.ErrorDetails
      };
      var scope=this;
      var obj = {
        "context": scope,
        "params": {
          "params":params
        },
        "callbackModelConfig": {
          "buttonModifyClick":true
        }
      };
      var navManager = kony.mvc.getNavigationManager();
      navManager.navigate(obj);
    },

    buttonCancelOnClick: function () {
      var scope=this;
      //       var obj = {
      //         "context": scope,
      //         "params": {
      //         },
      //         "callbackModelConfig": {
      //           "buttonCancelClick":true
      //         }
      //       };
      //       var navManager = kony.mvc.getNavigationManager();
      //       navManager.navigate(obj);

      new kony.mvc.Navigation({
        "appName": "UnifiedTransferMA",
        "friendlyName": "frmUTFLanding"
      }, false).navigate();
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
};
       });