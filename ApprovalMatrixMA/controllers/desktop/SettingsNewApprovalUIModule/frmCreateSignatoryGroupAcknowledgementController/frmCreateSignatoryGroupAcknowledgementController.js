define(['CommonUtilities', 'FormControllerUtility', 'ViewConstants', 'OLBConstants', 'CampaignUtility'], function(CommonUtilities, FormControllerUtility, ViewConstants, OLBConstants, CampaignUtility) {
    var orientationHandler = new OrientationHandler();

  //Type your controller code here 
  return{
    
    preShow : function(){
      var scope = this;
      this.view.btnProceedAddServices.text = "View All Signatory Groups";
      this.view.btnBackConfirmation.text = "Create New Group";
      this.view.btnApplytoApprovalMatrix.text = "Apply To Approval Matrix";
     // this.view.lblGroupNameValue.text = applicationManager.getConfigurationManager().groupName;
      //this.view.lblGroupDescValue.text = applicationManager.getConfigurationManager().groupDesc;
      //this.view.lblTotalSelectedUsersValue.text = applicationManager.getConfigurationManager().totalSelectedUsers;
      this.setAckData();
      this.view.btnBackConfirmation.onClick = function () {
        scope.navigateToCreateSignatory();
      }.bind(this);
      this.view.btnProceedAddServices.onClick = function () {
        scope.navigateToSignatoryGroups();
      }.bind(this);
      this.view.btnApplytoApprovalMatrix.onClick = function () {
        scope.navigateToApprovalMatrix();
      }.bind(this);
    },
    onBreakpointChange: function(width) {
        this.view.customheadernew.onBreakpointChangeComponent(width);
      },
    
    setAckData : function(){
      this.view.lblGroupNameVal.text = applicationManager.getConfigurationManager().groupName;
      this.view.lblGroupDescVal.text = applicationManager.getConfigurationManager().groupDesc;
      this.view.lblTotalSelectedUsersVal.text = applicationManager.getConfigurationManager().totalSelectedUsers;
      this.view.lblCreatedOnVal.text = applicationManager.getConfigurationManager().createdOn;
      this.view.lblCreatedByVal.text = applicationManager.getConfigurationManager().createdBy;
      this.view.lblCustomerNameVal.text = applicationManager.getConfigurationManager().coreCustomerName;
      this.view.lblCustomerIdVal.text = applicationManager.getConfigurationManager().coreCustomerID;
      this.view.lblContractVal.text = applicationManager.getConfigurationManager().contractName;
    },
    
    navigateToCreateSignatory : function(){
      applicationManager.getNavigationManager().navigateTo("frmCreateSignatoryGroup");
    },
    
    navigateToSignatoryGroups : function(){
       var e = {
                    "contractId": applicationManager.getConfigurationManager().contractId,
                    "coreCutomerId": applicationManager.getConfigurationManager().coreCustomerId
                };
                kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("SettingsNewApprovalUIModule").presentationController.getAllSignatoryGroups(e);
    },
    navigateToApprovalMatrix : function(){
      var settingsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("SettingsNewApprovalUIModule");
                    settingsModule.presentationController.setContractDetailsForApprovalMatrices();
    }


    //Type your controller code here 
  };
});