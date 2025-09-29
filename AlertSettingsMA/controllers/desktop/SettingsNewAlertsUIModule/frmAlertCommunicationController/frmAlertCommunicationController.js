define(['CommonUtilities', 'CSRAssistUI','FormControllerUtility', 'OLBConstants', 'ViewConstants', 'CampaignUtility'], function(CommonUtilities, CSRAssistUI, FormControllerUtility, OLBConstants, ViewConstants) {
  var orientationHandler = new OrientationHandler();
  var responsiveUtils = new ResponsiveUtils();
  var initialPhone ="";
  var initialEmail = "";
  return {
    updateFormUI: function(viewModel) {
      if (viewModel !== undefined) {
        if (viewModel.alertCommunication) this.setAlertCommData();
        if (viewModel.isLoading !== undefined) this.changeProgressBarState(viewModel.isLoading);   
        if (viewModel.editAlertCommError) this.showEditAlertCommError(viewModel.editAlertCommError);
      }
    },
    preShow:function()
    {
      this.view.flxRight.setVisibility(true);
      FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxHeader', 'flxFooter', 'flxMain','flxMenuItemMobile']);
      this.view.lblCollapseMobile.text  = "O";
      //this.view.customheadernew.activateMenu("Settings","Alert Settings");
      this.view.profileMenu.checkLanguage();
      this.view.profileMenu.activateMenu("ALERTSETTINGS","Alert Communication");
      this.setSelectedValue("i18n.alertSettings.alertComm");
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
    /**
	*  Method to set the Accessibility configurations
	*/
    setAccessibility: function(){
      var accessibilityConfig = CommonUtilities.getaccessibilityConfig(); 
      this.view.btnEditCommAlerts.toolTip = kony.i18n.getLocalizedString("i18n.billPay.Edit");
      this.view.btnAlertCommSave.toolTip = kony.i18n.getLocalizedString("i18n.ProfileManagement.Save");
      this.view.btnAlertCommCancel.toolTip = kony.i18n.getLocalizedString("i18n.konybb.common.cancel");
      //CommonUtilities.setText(this.view.btnEditCommAlerts, kony.i18n.getLocalizedString("i18n.billPay.Edit"), accessibilityConfig);
      CommonUtilities.setText(this.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.ProfileManagement.Alerts"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblPhoneComm, kony.i18n.getLocalizedString("i18n.ProfileManagement.PhoneNumbers"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblEmailComm, kony.i18n.getLocalizedString("i18n.LoginMFA.EmailID"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblAlertCommHeading, kony.i18n.getLocalizedString("i18n.alertSettings.Communication"), accessibilityConfig);
      //CommonUtilities.setText(this.view.btnAlertCommSave, kony.i18n.getLocalizedString("i18n.ProfileManagement.Save"), accessibilityConfig);
      //CommonUtilities.setText(this.view.btnAlertCommCancel, kony.i18n.getLocalizedString("i18n.konybb.common.cancel"), accessibilityConfig);
      CommonUtilities.setText(this.view.lblHeading, kony.i18n.getLocalizedString("i18n.ProfileManagement.Settingscapson"), accessibilityConfig);
      this.view.btnAlertCommCancel.accessibilityConfig = {
        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.CancelAlertCommunication")
      };
      this.view.btnAlertCommSave.accessibilityConfig = {
        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.SaveAlertCommunication")
      };
      this.view.btnEditCommAlerts.accessibilityConfig = {
        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.EditAlertCommunication")
      };
      this.view.lblAlertsCommWarningImage.accessibilityConfig = {
        "a11yLabel": kony.i18n.getLocalizedString("i18n.alerts.InfoAlertCommunication")
      };
      this.view.lblCollapseMobile.accessibilityConfig = {
        "a11yARIA": {
            "tabindex": -1
        }
      };
      this.view.flxAccountSettingsCollapseMobile.accessibilityConfig = {
        "a11yLabel": "Dropdown"
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
        CommonUtilities.setText(this.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.ProfileManagement.Alerts"), accessibilityConfig);
      }
      if (kony.application.getCurrentBreakpoint() === 640) {
          this.disableButton(this.view.btnAlertCommSave);
      }
      this.view.forceLayout();      
    },
    setFlowActions:function(){
      var scopeObj=this;
      this.view.btnEditCommAlerts.onClick = function(){
        scopeObj.setAlertData();
        scopeObj.showEditAlertCommunications();
      };
      this.view.btnAlertCommSave.onClick = function(){
        scopeObj.saveAlertCommunications();
      };
      this.view.btnAlertCommCancel.onClick = function(){
        scopeObj.showAlertCommView();
      };
      this.view.flxMain.onClick = function(){
        scopeObj.toggleSegment();
      };
      this.view.flxPhoneDropDown.onClick = function(){
        if(scopeObj.view.flxPhoneNumbersSegment.isVisible){
          scopeObj.view.flxPhoneNumbersSegment.setVisibility(false);
          scopeObj.view.lblImgDropdown11.text="O";
          scopeObj.view.lblImgDropdown11.accessibilityConfig = {
            "a11yLabel" : kony.i18n.getLocalizedString("i18n.profile.Expand") + " " + kony.i18n.getLocalizedString("i18n.konybb.manageUser.PhoneNo")
          };
        }else{
          scopeObj.view.flxPhoneNumbersSegment.setVisibility(true);
          scopeObj.view.lblImgDropdown11.text="P";
          scopeObj.view.lblImgDropdown11.accessibilityConfig = {
            "a11yLabel" : kony.i18n.getLocalizedString("i18n.profile.Collapse") + " " + kony.i18n.getLocalizedString("i18n.konybb.manageUser.PhoneNo")
          };
        }    
        scopeObj.view.flxEmailsSegment.setVisibility(false);
        scopeObj.view.lblImgDropdown21.text="O";
        scopeObj.view.lblImgDropdown21.accessibilityConfig = {
          "a11yLabel" : kony.i18n.getLocalizedString("i18n.profile.Expand") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.EmailId")
        };
      };
      this.view.flxEmailDropDown.onClick = function(){
        if(scopeObj.view.flxEmailsSegment.isVisible){
          scopeObj.view.flxEmailsSegment.setVisibility(false);
          scopeObj.view.lblImgDropdown21.text="O";
          scopeObj.view.lblImgDropdown21.accessibilityConfig = {
            "a11yLabel" : kony.i18n.getLocalizedString("i18n.profile.Expand") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.EmailId")
          };
        }else{
          scopeObj.view.flxEmailsSegment.setVisibility(true);
          scopeObj.view.lblImgDropdown21.text="P";
          scopeObj.view.lblImgDropdown21.accessibilityConfig = {
            "a11yLabel" : kony.i18n.getLocalizedString("i18n.profile.Collapse") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.EmailId")
          };
        }
        scopeObj.view.flxPhoneNumbersSegment.setVisibility(false);
        scopeObj.view.lblImgDropdown11.text="O";
        scopeObj.view.lblImgDropdown11.accessibilityConfig = {
          "a11yLabel" : kony.i18n.getLocalizedString("i18n.profile.Expand") + " " + kony.i18n.getLocalizedString("i18n.konybb.manageUser.PhoneNo")
        };
      };
      this.view.segPhoneComm.onRowClick = function(){
        scopeObj.setSelectedContactInfo(scopeObj.view.segPhoneComm, scopeObj.view.lblSelectPhoneNumber);
        if(scopeObj.view.lblSelectPhoneNumber.text !== initialPhone)
        {
          scopeObj.enableButton(scopeObj.view.btnAlertCommSave);
        } else if(scopeObj.view.lblSelectEmailNumber.text == initialEmail && scopeObj.view.lblSelectPhoneNumber.text == initialPhone){
          scopeObj.disableButton(scopeObj.view.btnAlertCommSave);
        }
        scopeObj.view.flxPhoneNumbersSegment.setVisibility(false);
        scopeObj.view.lblImgDropdown11.text="O";
        scopeObj.view.lblImgDropdown11.accessibilityConfig = {
          "a11yLabel" : kony.i18n.getLocalizedString("i18n.profile.Expand") + " " + kony.i18n.getLocalizedString("i18n.konybb.manageUser.PhoneNo")
        };
      };
      this.view.segEmailComm.onRowClick = function(){
        scopeObj.setSelectedContactInfo(scopeObj.view.segEmailComm, scopeObj.view.lblSelectEmailNumber);
        if(scopeObj.view.lblSelectEmailNumber.text !== initialEmail)
        {
          scopeObj.enableButton(scopeObj.view.btnAlertCommSave);
        } else if(scopeObj.view.lblSelectEmailNumber.text == initialEmail && scopeObj.view.lblSelectPhoneNumber.text == initialPhone){
          scopeObj.disableButton(scopeObj.view.btnAlertCommSave);
        }
        scopeObj.view.flxEmailsSegment.setVisibility(false);
        scopeObj.view.lblImgDropdown21.text="O";
        scopeObj.view.lblImgDropdown21.accessibilityConfig = {
          "a11yLabel" : kony.i18n.getLocalizedString("i18n.profile.Expand") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.EmailId")
        };
      };
    },
    toggleSegment : function(){
      this.view.flxEmailsSegment.setVisibility(false);
      this.view.lblImgDropdown21.text="O";
      this.view.lblImgDropdown21.accessibilityConfig = {
        "a11yLabel" : kony.i18n.getLocalizedString("i18n.profile.Expand") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.EmailId")
      };
      this.view.flxPhoneNumbersSegment.setVisibility(false);
      this.view.lblImgDropdown11.text="O";
      this.view.lblImgDropdown11.accessibilityConfig = {
        "a11yLabel" : kony.i18n.getLocalizedString("i18n.profile.Expand") + " " + kony.i18n.getLocalizedString("i18n.konybb.manageUser.PhoneNo")
      };
    },
    /**
       * Method to error while updating the alert communication scenario
       * @param {String} errorMessage- Message to be shown
       */
    showEditAlertCommError: function(errorMessage) {
      this.view.flxErrorEditAlertComm.setVisibility(true);
      this.view.lblErrorAlertComm.text=errorMessage.errorMessage;
    },
    setAlertCommData:function(){
      this.view.flxAlertComm1.setVisibility(true);
      this.view.flxAlertComm2.setVisibility(true);
      this.showAlertCommView();
      this.view.lblSelectPhoneNumber.text="";
      this.view.lblSelectEmailNumber.text="";   
      this.setAlertData();
    },
    setAlertData : function(){
      var userPhoneNumbers=applicationManager.getUserPreferencesManager().getEntitlementPhoneNumbers();
      var userEmailIds=applicationManager.getUserPreferencesManager().getEntitlementEmailIds();
      if(userPhoneNumbers.length!==0)
        this.setSegContactData(userPhoneNumbers, this.view.segPhoneComm,"Phone");
      else
        this.view.flxAlertComm1.setVisibility(false);
      if(userEmailIds.length!==0)
        this.setSegContactData(userEmailIds, this.view.segEmailComm,"Email");
      else
        this.view.flxAlertComm2.setVisibility(false);
      if(userPhoneNumbers.length===0&&userEmailIds.length===0){
        this.view.btnEditCommAlerts.setVisibility(false);
        this.view.flxAlertCommBody.setVisibility(false);
        this.view.rtxAlertsCommWarning.text=kony.i18n.getLocalizedString("i18n.alertSettings.NoPrimaryMsg");
      } else if(userPhoneNumbers.length===1&&userEmailIds.length===1){
        this.view.btnEditCommAlerts.setVisibility(false);
        this.view.flxAlertCommBody.setVisibility(true);
      }else{
        this.view.btnEditCommAlerts.setVisibility(true);
        this.view.flxAlertCommBody.setVisibility(true);
        if(userPhoneNumbers.length===1){
          this.view.flxPhoneDropDown.setEnabled(false);
          this.view.flxPhoneDropDown.skin="bbSknFlxf9fafb";
        } else{
          this.view.flxPhoneDropDown.setEnabled(true);
          this.view.flxPhoneDropDown.skin="sknFFFFFFmodbre3e3e33px";
        }
        if(userEmailIds.length===1){
          this.view.flxEmailDropDown.setEnabled(false);
          this.view.flxEmailDropDown.skin="bbSknFlxf9fafb";
        } else{
          this.view.flxEmailDropDown.setEnabled(true);
          this.view.flxEmailDropDown.skin="sknFFFFFFmodbre3e3e33px";
        }
      }
      this.view.flxButtons.setVisibility(false);
      FormControllerUtility.hideProgressBar(this.view);
    },
    setSelectedContactInfo : function(segmentPath,valueLabelPath){
      var selectedIndex=segmentPath.selectedRowIndex[1];
      var selectedItem=segmentPath.data[selectedIndex];
      valueLabelPath.text=selectedItem.lblContact.text;
      valueLabelPath.info=selectedItem.contactData;
      this.view.forceLayout();
    },
    saveAlertCommunications: function(){
      var phoneInfo=this.view.lblSelectPhoneNumber.info;
      var emailInfo=this.view.lblSelectEmailNumber.info;
      var self = this;
      var data = {
        Extension: phoneInfo.Extension,
        isPrimary: phoneInfo.isPrimary==="true"?'1':'0',
        isAlertsRequired: true,
      }
      data={
        "emailIds":[{'id':emailInfo.id,'Extension':emailInfo.Extension,'isPrimary':emailInfo.isPrimary==="true"?'1':'0','isAlertsRequired':'1','value':emailInfo.Value}],
        "phoneNumbers":[{'id':phoneInfo.id,'Extension':phoneInfo.Extension,'isPrimary':phoneInfo.isPrimary==="true"?'1':'0','isAlertsRequired':'1','phoneNumber':phoneInfo.phoneNumber,'phoneCountryCode':phoneInfo.phoneCountryCode}],
      }
      kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("SettingsNewAlertsUIModule").presentationController.updateAlertCommunication(data);
    },
    showAlertCommView: function(){
      //this.view.lblPhoneComm.skin="sknSSP72727215Px";
      //this.view.lblEmailComm.skin="sknSSP72727215Px";
      this.view.lblPhoneCommValue.setVisibility(true);
      this.view.flxCommPhoneDropDown.setVisibility(false);
      this.view.lblEmailCommValue.setVisibility(true);
      this.view.flxCommEmailDropDown.setVisibility(false);
      this.view.btnEditCommAlerts.setVisibility(true);
      this.view.flxErrorEditAlertComm.setVisibility(false);
      this.view.rtxAlertsCommWarning.text=kony.i18n.getLocalizedString("i18n.alertSettings.alertCommEditMsg");
      this.view.flxButtons.setVisibility(false);
      this.view.forceLayout();
    },

    showEditAlertCommunications : function(){
      //this.view.lblPhoneComm.skin="sknLblSSP42424215px";
      //this.view.lblEmailComm.skin="sknLblSSP42424215px";
      this.view.lblPhoneCommValue.setVisibility(false);
      this.view.flxCommPhoneDropDown.setVisibility(true);
      this.view.lblEmailCommValue.setVisibility(false);
      this.view.flxCommEmailDropDown.setVisibility(true);
      this.view.flxEmailsSegment.setVisibility(false);
      this.view.lblImgDropdown21.text="O";
      this.view.lblImgDropdown11.text="O";
      this.view.lblImgDropdown11.accessibilityConfig = {
        "a11yLabel" : kony.i18n.getLocalizedString("i18n.profile.Expand") + " " + kony.i18n.getLocalizedString("i18n.konybb.manageUser.PhoneNo")
      };
      this.view.lblImgDropdown21.accessibilityConfig = {
        "a11yLabel" : kony.i18n.getLocalizedString("i18n.profile.Expand") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.EmailId")
      };
      this.view.flxPhoneNumbersSegment.setVisibility(false);
      this.view.btnEditCommAlerts.setVisibility(false);
      this.view.flxErrorEditAlertComm.setVisibility(false);
      this.view.rtxAlertsCommWarning.text=kony.i18n.getLocalizedString("i18n.alertSettings.alertCommViewMsg");
      this.view.flxButtons.setVisibility(true);
      this.view.forceLayout();
    },
    setSegContactData : function(contactInfo,widgetId,type){
      var contactText="";
      var self=this;      
      var primaryPhone="";
      var primaryEmail="";
      var contactTypeId="";
      var primaryContact={};
      var  dataMap = {
        "flxAlertCommunication":"flxAlertCommunication",
        "flxContactsList":"flxContactsList",
        "lblContact" : "lblContact",
        "flxPrimary" : "flxPrimary",
        "lblPrimary": "lblPrimary",
        "contactData":"contactData"
      };
      var data=contactInfo.map(function(contact){
        if(type==="Phone"){
          contactTypeId="phone";
          contactText=contact.Extension+" - ("+contact.phoneCountryCode+")"+" "+contact.phoneNumber;
          if(contact.isAlertsRequired==="true"){
            self.view.lblSelectPhoneNumber.text=contactText;
            self.view.lblPhoneCommValue.text=contactText;
            self.view.lblSelectPhoneNumber.info=contact;
          }
          if(contact.isPrimary==="true")
            primaryPhone=contactText;
          primaryContact=contact;
        }else if(type==="Email"){
          contactTypeId="Email";
          contactText=contact.Value;
          if(contact.isAlertsRequired==="true"){
            self.view.lblSelectEmailNumber.text=contactText;
            self.view.lblEmailCommValue.text=contactText;
            self.view.lblSelectEmailNumber.info=contact;
          }
          if(contact.isPrimary==="true")
            primaryEmail=contactText;
          primaryContact=contact;
        }
        return{
          "flxAlertCommunication":"flxAlertCommunication",
          "flxContactsList":"flxContactsList",
          "lblContact" : {"text":contactText,
                          "accessibilityConfig": {
                            "a11yLabel": contactText,
                          }},
          "flxPrimary" : {"isVisible":contact.isPrimary==="true"?true:false},
          "lblPrimary":  {"text" : kony.i18n.getLocalizedString("i18n.ProfileManagement.Primary"),
                          "accessibilityConfig": {
                            "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Primary"),
                          }
                         },
          "contactData": contact
        }
      });
      if(contactTypeId==="phone"&&this.view.lblSelectPhoneNumber.text===""){
        self.view.lblSelectPhoneNumber.text=primaryPhone;
        self.view.lblPhoneCommValue.text=primaryPhone;
        this.view.lblSelectPhoneNumber.info=primaryContact;
      }else if(contactTypeId==="Email"&&this.view.lblSelectEmailNumber.text===""){self.view.lblSelectEmailNumber.text=primaryEmail;
        self.view.lblSelectEmailNumber.text=primaryEmail;
        self.view.lblEmailCommValue.text=primaryEmail;
        this.view.lblSelectEmailNumber.info=primaryContact;
      }
      initialEmail = self.view.lblEmailCommValue.text;
      initialPhone = self.view.lblPhoneCommValue.text;
      this.disableButton(self.view.btnAlertCommSave);
      widgetId.widgetDataMap=dataMap;
      widgetId.setData(data);
      this.view.forceLayout();
    },
    disableButton: function(button) {
      button.setEnabled(false);
      button.skin = "sknBtnBlockedSSPFFFFFF15Px";
      button.hoverSkin = "sknBtnBlockedSSPFFFFFF15Px";
      button.focusSkin = "sknBtnBlockedSSPFFFFFF15Px";
    },
    enableButton: function(button) {
      if (!CommonUtilities.isCSRMode()) {
        button.setEnabled(true);
        button.skin = "sknbtnSSPffffff15px0273e3bg";
        button.hoverSkin = "sknBtnFocusSSPFFFFFF15Px0273e3";
        button.focusSkin = "sknBtnHoverSSPFFFFFF15Px0273e3";
      }
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