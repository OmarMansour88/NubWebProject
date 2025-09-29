define(['FormControllerUtility'], function (FormControllerUtility) {
  const responsiveUtils = new ResponsiveUtils();
  return {
    init: function () {
      this.view.preShow = this.preShow;
      this.view.postShow = this.postShow;
      this.view.onDeviceBack = function () { };
      this.view.onBreakpointChange = this.onBreakpointChange;
    },
    preShow: function () {
      FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxHeader', 'flxFooter', 'flxMain', 'flxLogout']);
      this.view.UnifiedTransfersAcknowledgement.button1Click = this.button1Click;
      this.view.UnifiedTransfersAcknowledgement.onError = this.onError;
    },
    postShow: function () {
      this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight - this.view.flxHeader.info.frame.height - this.view.flxFooter.info.frame.height + "dp";
      applicationManager.getNavigationManager().applyUpdates(this);
    },
    onBreakpointChange: function (form, width) {
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
    onNavigate: function (data) {
      var scope = this;
      var p2pMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("P2PActivationDeactivationUIModule");
      p2pMod.presentationController.fetchUser();
      this.setHeaderLabel(data.Ack["flowType"]);
      this.view.UnifiedTransfersAcknowledgement.setContext(data);
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
     * @api : setHeaderLabel
     *set the text for header label
     * @return : NA
     */
    setHeaderLabel: function (flowType) {
      if (flowType === "Activation") {
        this.view.lblActivate.text = "Activate Person-to-Person";
      } else {
        this.view.lblActivate.text = "Deactivate Person-to-Person";
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
    button1Click: function (params) {
      var scope = this;
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
      var navMan = applicationManager.getNavigationManager();
      new kony.mvc.Navigation({
        "appName": "UnifiedTransferMA",
        "friendlyName": "frmUTFLanding"
      }).navigate();
    },
  };
});