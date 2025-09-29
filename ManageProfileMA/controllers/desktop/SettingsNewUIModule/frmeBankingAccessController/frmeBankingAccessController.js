define(['CommonUtilities', 'CSRAssistUI','FormControllerUtility', 'OLBConstants', 'ViewConstants', 'CampaignUtility'], function(CommonUtilities, CSRAssistUI, FormControllerUtility, OLBConstants, ViewConstants) {
  var orientationHandler = new OrientationHandler();
  var responsiveUtils = new ResponsiveUtils();
  return {
    updateFormUI: function(viewModel) {
      if (viewModel !== undefined) {
        if (viewModel.eBankingAccessLanding){this.showEBankingAccess();}
        if(viewModel.termsAndConditionsContent){
          this.setTncContent(viewModel.termsAndConditionsContent);
        }
        if (viewModel.isLoading !== undefined) this.changeProgressBarState(viewModel.isLoading);   
      }
    },
    preShow:function()
    {
      this.view.flxRight.setVisibility(true);
      FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxHeader', 'flxFooter', 'flxMain','flxMenuItemMobile']);
      this.view.lblCollapseMobile.text  = "O";
      this.view.customheadernew.activateMenu("Settings","Profile Settings");
      this.view.profileMenu.checkLanguage();
      this.view.profileMenu.activateMenu("PROFILESETTINGS","eBankingAccess");
      this.setSelectedValue("i18n.profile.eBankingAccess");
      this.setAccessibility();
      this.view.forceLayout();
    },
    init:function(){
      var self=this;
      applicationManager.getLoggerManager().setCustomMetrics(this, false, "Profile");
      this.view.preShow=this.preShow;
      this.view.postShow=this.postShow;
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
    setSelectedValue: function (text) {
     var self = this;
      CommonUtilities.setText(self.view.lblAccountSettingsMobile, kony.i18n.getLocalizedString(text) , CommonUtilities.getaccessibilityConfig());
    },
    setTncContent: function(TncContent){
      var scopeObj = this; 
      this.view.flxDialogs.setVisibility(true);
      scopeObj.view.flxDialogs.isModalContainer = true;
      this.view.flxTermsAndConditions.setVisibility(true);
      this.view.forceLayout();
      this.view.flxTermsAndConditionsHeader.setFocus(true);
      FormControllerUtility.setHtmlToBrowserWidget(this, this.view.brwBodyTnC, TncContent);
      FormControllerUtility.hideProgressBar(this.view);
      this.view.flxClose.onClick= function(){
        scopeObj.view.flxDialogs.isModalContainer = false;
        scopeObj.view.flxTermsAndConditions.setVisibility(false); 
        scopeObj.view.flxDialogs.setVisibility(false);
      };
    },
    /**
	*  Method to set the Accessibility configurations
	*/
    setAccessibility: function(){
      var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
      this.view.btnTermsAndConditionsEbankingaccess.toolTip = kony.i18n.getLocalizedString("i18n.common.TnC");
      this.view.btnEBankingAccessSave.toolTip = kony.i18n.getLocalizedString("i18n.profile.eBankingDisable");
      CommonUtilities.setText(this.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.ProfileManagement.profilesettings"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblEBamkingAccessHeader, kony.i18n.getLocalizedString("i18n.profile.eBankingAccess"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblEBankingAccessNotification, kony.i18n.getLocalizedString("i18n.profile.eBankingDescription"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblRulesEBankingAcces, kony.i18n.getLocalizedString("i18n.profile.pleaseNote"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblSecurityRuleEBA1, kony.i18n.getLocalizedString("i18n.profile.eBankingTandC"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblSecurityRuleEBA2, kony.i18n.getLocalizedString("i18n.logout.reachOutBank"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblAgree, kony.i18n.getLocalizedString("i18n.ProfileManagement.IAccept"), accessibilityConfig);
      CommonUtilities.setText(this.view.btnTermsAndConditionsEbankingaccess, kony.i18n.getLocalizedString("i18n.common.TnC"), accessibilityConfig);
      //CommonUtilities.setText(this.view.btnEBankingAccessSave, kony.i18n.getLocalizedString("i18n.profile.eBankingDisable"), accessibilityConfig);    
      //CommonUtilities.setText(this.view.lblHeading, kony.i18n.getLocalizedString("i18n.ProfileManagement.Settingscapson"), accessibilityConfig);
      this.view.btnEBankingAccessSave.accessibilityConfig = {
         "a11yLabel": kony.i18n.getLocalizedString("i18n.profilemanagement.DisableeBankingAccess")
      }
      this.view.imgClose.accessibilityConfig = {
         "a11yLabel": kony.i18n.getLocalizedString("i18n.common.close")
      }
      this.view.lblCollapseMobile.accessibilityConfig = {
        "a11yARIA": {
            "tabindex": -1
        }
      };
      this.view.flxAccountSettingsCollapseMobile.accessibilityConfig = {
        "a11yLabel": "Dropdown"
      };
      this.view.flxCheckbox.accessibilityConfig = {
        "a11yARIA" :{
          "role":"checkbox"
        },
      };
    }, 
    onBreakpointChange: function (width) {
      FormControllerUtility.setupFormOnTouchEnd(width);
      responsiveUtils.onOrientationChange(this.onBreakpointChange);
      this.view.customheadernew.onBreakpointChangeComponent(width);
      this.view.customfooternew.onBreakpointChangeComponent(width);
      this.view.profileMenu.onBreakpointChangeComponent(width);
      orientationHandler.onOrientationChange(this.onBreakpointChange);
      if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
        var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
        CommonUtilities.setText(this.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.ProfileManagement.profilesettings"), accessibilityConfig);
      }
      this.view.forceLayout();      
    },
    disableButton: function(button) {
      button.setEnabled(false);
      button.skin = "sknBtnBlockedSSPFFFFFF15Px";
      button.hoverSkin = "sknBtnBlockedSSPFFFFFF15Px";
      button.focusSkin = "sknBtnBlockedSSPFFFFFF15Px";
    },
    setFlowActions:function(){
      var scopeObj=this;
      this.view.flxCheckbox.onClick=this.toggleTnC.bind(scopeObj,scopeObj.view.lblRememberMeIcon);
      this.view.btnTermsAndConditionsEbankingaccess.onClick= scopeObj.showTermsAndConditionsForEBA.bind(scopeObj);
    },
    toggleTnC: function(widget) {
      CommonUtilities.toggleFontCheckbox(this.view.lblRememberMeIcon);
      if (widget.text === OLBConstants.FONT_ICONS.CHECBOX_UNSELECTED) {
        CommonUtilities.disableButton(this.view.btnEBankingAccessSave);
        widget.skin = "sknlblOLBFonts0273E420pxOlbFontIcons";
        widget.accessibilityConfig = {
        "a11yLabel": kony.i18n.getLocalizedString("i18n.profile.eBankingAccess") + " " + kony.i18n.getLocalizedString("i18n.common.TnC") +" "+kony.i18n.getLocalizedString("i18n.accountSettings.unchecked"),
        "a11yARIA": {"aria-checked": "false"}    
        };
      } else {
        CommonUtilities.enableButton(this.view.btnEBankingAccessSave);
        widget.skin = "sknlblDelete20px";
        widget.accessibilityConfig = {
        "a11yLabel": kony.i18n.getLocalizedString("i18n.profile.eBankingAccess") + " " + kony.i18n.getLocalizedString("i18n.common.TnC") +" "+kony.i18n.getLocalizedString("i18n.accountSettings.checked"),
        "a11yARIA": {"aria-checked": "true"}     
        };
      }
    },
    showTermsAndConditionsForEBA: function(){
      FormControllerUtility.showProgressBar(this.view);
      var profileModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"});
      profileModule.presentationController.getTncContent();
    },
    /**
	*  Method to set ui for the component in mobile breakpoint
	*/
    toggleMenuMobile: function () {
      if (this.view.lblCollapseMobile.text === "O") {
        this.view.lblCollapseMobile.text = "P";
        this.view.flxLeft.setVisibility(true);
        this.view.flxRight.setVisibility(false);
      } else {
        this.view.lblCollapseMobile.text  = "O";
        this.view.flxLeft.setVisibility(false);
        this.view.flxRight.setVisibility(true);
      }
    }, 
    showEBankingAccess: function(){
      var self=this;
      var scopObj= this;
      this.view.flxHeader.setFocus(true);
      scopObj.view.lblRememberMeIcon.text="D";
      scopObj.view.lblRememberMeIcon.skin = OLBConstants.SKINS.CHECKBOX_UNSELECTED_SKIN;
      scopObj.view.lblRememberMeIcon.accessibilityConfig = {
        "a11yLabel": kony.i18n.getLocalizedString("i18n.profile.eBankingAccess") + " " + kony.i18n.getLocalizedString("i18n.common.TnC") +" "+kony.i18n.getLocalizedString("i18n.accountSettings.unchecked"),
        "a11yARIA": {"aria-checked": "false"}    
      };
      scopObj.disableButton(scopObj.view.btnEBankingAccessSave);
      this.view.flxCheckbox.onClick=this.toggleTnC.bind(this,self.view.lblRememberMeIcon);
      this.view.btnTermsAndConditionsEbankingaccess.onClick= self.showTermsAndConditionsForEBA.bind(self);
      scopObj.view.btnEBankingAccessSave.onClick = this.showEbankingAccessPopup.bind(this);
    },
    showEbankingAccessPopup: function(){
      var scopeObj = this;
      this.view.flxDeletePopUp.setVisibility(true);
      this.view.flxLogout.setVisibility(false);
      this.view.flxDialogs.setVisibility(true);
      scopeObj.view.flxDialogs.isModalContainer = true;
      this.view.lblDeleteHeader.text = kony.i18n.getLocalizedString("i18n.profile.eBankingDisable");
      this.view.lblConfirmDelete.text =  kony.i18n.getLocalizedString("i18n.profile.eBankingAlertMsg");
      this.view.forceLayout();
      this.view.flxDeleteHeader.setFocus(true);
      this.view.btnDeleteNo.onClick= function(){
        scopeObj.view.flxDialogs.isModalContainer = false;
        scopeObj.view.flxDialogs.setVisibility(false);
        scopeObj.view.flxDeletePopUp.setVisibility(false);
      };
      this.view.flxDeleteClose.onClick= function(){
        scopeObj.view.flxDialogs.isModalContainer = false;
        scopeObj.view.flxDialogs.setVisibility(false);
        scopeObj.view.flxDeletePopUp.setVisibility(false);
      };
      this.view.btnDeleteYes.onClick= function(){
        FormControllerUtility.showProgressBar(this.view);
        var profileModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"});
        profileModule.presentationController.disableEBankingAccess();
      };
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
      this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight -this.view.flxHeader.info.frame.height - this.view.flxFooter.info.frame.height + "dp"; 
      this.view.forceLayout();      
    },

  };
});