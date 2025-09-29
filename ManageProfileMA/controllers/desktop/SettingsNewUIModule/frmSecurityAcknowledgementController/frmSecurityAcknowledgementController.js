define(['CommonUtilities', 'CSRAssistUI', 'FormControllerUtility', 'OLBConstants', 'ViewConstants', 'CampaignUtility'], function(CommonUtilities, CSRAssistUI, FormControllerUtility, OLBConstants, ViewConstants) {
  var orientationHandler = new OrientationHandler();
  var responsiveUtils = new ResponsiveUtils();
  return {
    updateFormUI: function(viewModel) {
      if (viewModel !== undefined) {
        if (viewModel.isLoading !== undefined) this.changeProgressBarState(viewModel.isLoading);
      }
    },
    preShow: function() {
      this.view.flxRight.setVisibility(true);
      FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxHeader', 'flxFooter', 'flxMain','flxMenuItemMobile']);
      this.view.lblCollapseMobile.text  = "O";
      this.view.customheadernew.activateMenu("Settings","Security Settings");
      this.view.profileMenu.checkLanguage();
      this.view.profileMenu.activateMenu("SECURITYSETTINGS","Security Setting");
      this.setSelectedValue("i18n.ProfileManagement.SecuritySettings");
      this.setAccessibility();
      this.view.forceLayout();
    },
    init: function() {
      var self = this;
      applicationManager.getLoggerManager().setCustomMetrics(this, false, "Profile");
      this.view.preShow = this.preShow;
      this.view.postShow = this.postShow;
      this.view.flxAccountSettingsCollapseMobile.onClick = this.toggleMenuMobile;
      this.view.onBreakpointChange = function() {
        self.onBreakpointChange(kony.application.getCurrentBreakpoint());
      };
      this.setFlowActions();
    },
    /**
         * *@param {String} text- text that needs to be appended to the upper text in mobile breakpoint
         *  Method to set the text in mobile breakpoint
         */
    setSelectedValue: function(text) {
     var self = this;
      CommonUtilities.setText(self.view.lblAccountSettingsMobile, kony.i18n.getLocalizedString(text) , CommonUtilities.getaccessibilityConfig());
    },
    /**
         *  Method to set the Accessibility configurations
         */
    setAccessibility: function() {
      var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
      this.view.btnAcknowledgementDone.toolTip = kony.i18n.getLocalizedString("i18n.ProfileManagement.Done");
      CommonUtilities.setText(this.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.ProfileManagement.SecuritySettings"), accessibilityConfig);
      CommonUtilities.setText(this.view.lblAcknowledgementHeader, kony.i18n.getLocalizedString("i18n.transfers.Acknowledgement"), accessibilityConfig);
      CommonUtilities.setText(this.view.lblTransactionMessage, kony.i18n.getLocalizedString("i18n.ProfileManagement.YourSecurityQuestionswereupdatedSuccessfully"), accessibilityConfig);
      //CommonUtilities.setText(this.view.btnAcknowledgementDone, kony.i18n.getLocalizedString("i18n.ProfileManagement.Done"), accessibilityConfig);
      CommonUtilities.setText(this.view.lblHeading, kony.i18n.getLocalizedString("i18n.ProfileManagement.Settingscapson"), accessibilityConfig);
      this.view.btnAcknowledgementDone.accessibilityConfig = {
        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.SecurityAcknowledgementDone")
      }	
      this.view.lblCollapseMobile.accessibilityConfig = {
        "a11yARIA": {
            "tabindex": -1
        }
      };
      this.view.flxAccountSettingsCollapseMobile.accessibilityConfig = {
        "a11yLabel": "Dropdown"
      };
    },
    onBreakpointChange: function(width) {
      FormControllerUtility.setupFormOnTouchEnd(width);
      responsiveUtils.onOrientationChange(this.onBreakpointChange);
      this.view.customheadernew.onBreakpointChangeComponent(width);
      this.view.customfooternew.onBreakpointChangeComponent(width);
      this.view.profileMenu.onBreakpointChangeComponent(width);
      orientationHandler.onOrientationChange(this.onBreakpointChange);
      if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
        var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
        CommonUtilities.setText(this.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.ProfileManagement.SecuritySettings"), accessibilityConfig);
      }
      this.view.forceLayout();
    },

    setFlowActions: function() {
      this.view.btnAcknowledgementDone.onClick = function(){
        kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"}).presentationController.checkSecurityQuestions();
      }
    },
    /**
       * Method to show error while updating Question and answer at the service side
       */
    showUpdateSecurityQuestionError: function() {
      CommonUtilities.setText(this.view.lblErrorSecuritySettings, kony.i18n.getLocalizedString("i18n.ProfileManagement.updateServerError") , CommonUtilities.getaccessibilityConfig());
      this.view.flxErrorEditSecuritySettings.setVisibility(true);
      this.view.forceLayout();
      FormControllerUtility.hideProgressBar(this.view);
    },
    /**
         *  Method to set ui for the component in mobile breakpoint
         */
    toggleMenuMobile: function() {
      if (this.view.lblCollapseMobile.text === "O") {
        this.view.lblCollapseMobile.text = "P";
        this.view.flxLeft.setVisibility(true);
        this.view.flxRight.setVisibility(false);
      } else {
        this.view.lblCollapseMobile.text = "O";
        this.view.flxLeft.setVisibility(false);
        this.view.flxRight.setVisibility(true);
      }
    },
    /**
     * *@param {Boolean} isLoading- True or false to show/hide the progess bar
     *  Method to set show/hide the progess bar
     */
    changeProgressBarState: function(isLoading) {
      if (isLoading) {
        FormControllerUtility.showProgressBar(this.view);
      } else {
        FormControllerUtility.hideProgressBar(this.view);
      }
    },
    postShow: function() {
      applicationManager.getNavigationManager().applyUpdates(this);
      this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight - this.view.flxHeader.info.frame.height - this.view.flxFooter.info.frame.height + "dp";
      this.view.forceLayout();
    },
  };
});