
define(['FormControllerUtility', 'CommonUtilities'], function(FormControllerUtility, CommonUtilities) {

  var responsiveUtils = new ResponsiveUtils();

  return {

    init: function(){
      this.view.preShow = this.preShow;
      this.view.postShow = this.postShow;
      this.view.onBreakpointChange = this.onBreakpointChange;
      var data = {};
      this.view.viewRequests.setContext();
    },

    //Type your controller code here 
    preShow: function() {
      this.view.customheadernew.activateMenu("ACCOUNTS", "Service Requests");
      this.view.flxDowntimeWarning.setVisibility(false);
      // this.view.viewRequests.onError = this.onError();
      //  this.view.viewRequests.showErrorMessage = this.showErrorMessage();

    },

    postShow: function() {
      this.flxMainCalculateHeight();
    },
    
    flxMainCalculateHeight: function() {
      let headerHeight = this.view.flxHeader.height;
      let footerHeight = this.view.flxFooter.height;
      this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight - headerHeight.substring(0, headerHeight.length - 2) - footerHeight.substring(0, footerHeight.length - 2) + "dp";
      applicationManager.getNavigationManager().applyUpdates(this);
    },
    
    updateFormUI: function(viewModel) {
    },

    onBreakpointChange: function(form, width) {
      responsiveUtils.onOrientationChange(this.onBreakpointChange);
      this.view.customheadernew.onBreakpointChangeComponent(width);
      this.view.customfooternew.onBreakpointChangeComponent(width);
      this.flxMainCalculateHeight();
    },

  };
});

