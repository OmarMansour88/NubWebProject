define(["CommonUtilities", "FormControllerUtility", "OLBConstants", "ViewConstants"], function(CommonUtilities, FormControllerUtility, OLBConstants, ViewConstants) {
  var orientationHandler = new OrientationHandler();
  var responsiveUtils = new ResponsiveUtils();
  return{ 
    enableSeparateContact : false,
    updateFormUI: function(viewModel) {
      if (viewModel !== undefined) {
        if (viewModel.serverError) {
          this.showServerError(viewModel.serverError);
        } else {
          if (viewModel.isLoading !== undefined) {
            this.changeProgressBarState(viewModel.isLoading);
          }
          if(viewModel.deletePhoneError) this.showError(viewModel.deletePhoneError);
          if(viewModel.phoneList){
            this.setDataToSegment(viewModel.phoneList);
          }
        }
      }
    },
    init : function(){
      this.view.preShow = this.preshow;
      this.view.postShow = this.postshow;
      this.setFlowActions();
    },

    preshow : function(){  
      var self = this;
      this.view.flxRight.setVisibility(true);
      this.view.flxErrorContainer.setVisibility(false);
      applicationManager.getLoggerManager().setCustomMetrics(this, false, "Phone");
      this.view.flxAccountSettingsCollapseMobile.onClick = this.toggleMenuMobile;
      FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxHeader', 'flxFooter', 'flxMain','flxMenuItemMobile']);
      this.view.lblCollapseMobile.text  = "O";
      this.view.customheadernew.activateMenu("Settings","Profile Settings");
      this.view.profileMenu.checkLanguage();
      this.view.profileMenu.activateMenu("PROFILESETTINGS","Phone");
      this.setSelectedValue("i18n.Profilemanagement.lblPhone");
      this.setAccessibility();
      this.view.onBreakpointChange = function() {
        self.onBreakpointChange(kony.application.getCurrentBreakpoint());
      }
      this.view.forceLayout();
    },
    postshow : function(){
      applicationManager.getNavigationManager().applyUpdates(this);
    },
    showError: function(data){
      this.view.flxErrorContainer.setVisibility(true);
      this.view.lblImageError.text = data.errorMessage;
    },
    /**
	*  Method to set the Accessibility configurations
	*/
    setAccessibility: function(){
      var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
      this.view.btnAddNewNumber.toolTip = kony.i18n.getLocalizedString("i18n.ProfileManagement.AddNewPhoneNumber");
      this.view.btnAddNewNumberMobile.toolTip = kony.i18n.getLocalizedString("i18n.ProfileManagement.AddNewPhoneNumber");
      //CommonUtilities.setText(this.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.ProfileManagement.profilesettings"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblPhoneNumbersHeading, kony.i18n.getLocalizedString("i18n.konybb.manageUser.PhoneNo"), accessibilityConfig);
      CommonUtilities.setText(this.view.btnAddNewNumber, kony.i18n.getLocalizedString("i18n.ProfileManagement.AddNewPhoneNumber"), accessibilityConfig);
      CommonUtilities.setText(this.view.btnAddNewNumberMobile, kony.i18n.getLocalizedString("i18n.ProfileManagement.AddNewPhoneNumber"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblNoInfoWarning, kony.i18n.getLocalizedString("i18n.profile.noPhone"), accessibilityConfig);
      this.view.lblCollapseMobile.accessibilityConfig = {
        "a11yARIA": {
            "tabindex": -1
        }
      };
      this.view.flxAccountSettingsCollapseMobile.accessibilityConfig = {
        "a11yLabel": "Dropdown"
      };
      this.view.segPhoneNumbers.accessibilityConfig = {
        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.PhoneNumbersList")
      };
    },  

    /* *@param {String} text- text that needs to be appended to the upper text in mobile breakpoint
	*  Method to set the text in mobile breakpoint
	*/
    setSelectedValue: function (text) {
      var self = this;
      CommonUtilities.setText(self.view.lblAccountSettingsMobile, kony.i18n.getLocalizedString(text) , CommonUtilities.getaccessibilityConfig());
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
    /**
	*  Method to set ui for the component in mobile breakpoint
	*/
    toggleMenuMobile: function () {
      if (this.view.lblCollapseMobile.text == "O") {
        this.view.lblCollapseMobile.text = "P";
        this.view.flxLeft.setVisibility(true);
        this.view.flxRight.setVisibility(false);
      } else {
        this.view.lblCollapseMobile.text  = "O";
        this.view.flxLeft.setVisibility(false);
        this.view.flxRight.setVisibility(true);
      }
    }, 
    setFlowActions : function(){
      this.view.btnAddNewNumber.onClick = this.btnAddNewNumberOnClick;
      this.view.btnAddNewNumberMobile.onClick = this.btnAddNewNumberOnClick;
    },
   
    sortByPrimary: function(arr, val, prop) {
      var top = [];
      var rest = [];
      for (var el of arr) {
        if (el[prop] == val) {
          top.push(el)
        } else {
          rest.push(el);
        }
      }
      return top.concat(rest);
    },
    setDataToSegment: function(phoneListNotSorted) {
      var phoneList = this.sortByPrimary(phoneListNotSorted, "true", "isPrimary");
      if (phoneList.length >= 3 || !applicationManager.getConfigurationManager().checkUserPermission("PROFILE_SETTINGS_UPDATE")) {
        this.view.btnAddNewNumber.setVisibility(false);
        this.view.btnAddNewNumberMobile.setVisibility(false);
      } else {
        if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
          this.view.btnAddNewNumberMobile.setVisibility(true);
      }
      else{
        this.view.btnAddNewNumber.setVisibility(true);
       }
      }
      if(phoneList.length>0){
        this.setPhoneSegmentData(phoneList);
        this.view.flxNoInfoWarning.setVisibility(false); 
        this.view.flxPhoneNumbersBody.setVisibility(true);
      } else {
        this.view.flxNoInfoWarning.setVisibility(true); 
        this.view.flxPhoneNumbersBody.setVisibility(false);
      }
    },

    btnAddNewNumberOnClick : function(){
      kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"}).presentationController.getAddPhoneNumberView();
    },
    /**
       * Method to delete a particular phone number
       * @param {Object} phoneObj- JSON object of the phone to be deleted
       */
    deletePhone: function(phoneObj) {
      var scopeObj = this;
      var currForm = scopeObj.view;
      currForm.flxDialogs.setVisibility(true);
      currForm.flxLogout.setVisibility(false);
      currForm.flxDialogs.isModalContainer = true;
      currForm.flxDeletePopUp.setVisibility(true);
      currForm.flxDeletePopUp.setFocus(true);
      CommonUtilities.setText(currForm.lblDeleteHeader, kony.i18n.getLocalizedString("i18n.transfers.deleteExternalAccount") , CommonUtilities.getaccessibilityConfig());
      CommonUtilities.setText(currForm.lblConfirmDelete, kony.i18n.getLocalizedString("i18n.ProfileManagement.deletePhoneNum") , CommonUtilities.getaccessibilityConfig());
      currForm.forceLayout();
      currForm.btnDeleteNo.onClick = function() {
        scopeObj.view.flxDialogs.isModalContainer = false;
        scopeObj.view.flxDeletePopUp.setVisibility(false);
        scopeObj.view.flxDialogs.setVisibility(false);
        scopeObj.view.forceLayout();
      };
      currForm.btnDeleteYes.onClick = function() {
        kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"}).presentationController.deletePhone(phoneObj);
        scopeObj.view.flxDelete.setFocus(true);
        scopeObj.view.flxDialogs.isModalContainer = false;
        scopeObj.view.flxDeletePopUp.setVisibility(false);
        scopeObj.view.flxDialogs.setVisibility(false);
        scopeObj.view.forceLayout();
      };
      scopeObj.view.flxDeleteClose.onClick = function() {
        scopeObj.view.flxDialogs.isModalContainer = false;
        scopeObj.view.flxDeletePopUp.setVisibility(false);
        scopeObj.view.flxDialogs.setVisibility(false);
        scopeObj.view.forceLayout();
      };
    },
    /**
       * Method to edit a phone number
       * @param {Object} phoneObj - JSON object of the phone number to be edited
       */
    editPhone: function(phoneObj) {
      kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"}).presentationController.editPhoneView(phoneObj);
    },
    /**
    * onBreakpointChange : Handles ui changes on .
    * @member of {frmCreateSavingsGoalController}
    * @param {integer} width - current browser width
    * @return {}
    * @throws {}
    */
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
  
    setPhoneSegmentData: function(phoneListViewModel) {
      var isCombinedUser = applicationManager.getConfigurationManager().getConfigurationValue('isCombinedUser') === "true";
      var scopeObj = this;
      this.view.flxPhoneNumbers.setVisibility(true);
      var dataMap = {
        "btnViewDetail": "btnViewDetail",
        "btnDelete": "btnDelete",
        "flxCheckBox1": "flxCheckBox1",
        "flxCheckBox2": "flxCheckBox2",
        "flxCheckBox3": "flxCheckBox3",
        "flxCheckBox4": "flxCheckBox4",
        "flxCollapsible": "flxCollapsible",
        "flxDeleteAction": "flxDeleteAction",
        "flxEdit": "flxEdit",
        "flxOption1": "flxOption1",
        "flxOption2": "flxOption2",
        "flxOption3": "flxOption3",
        "flxOption4": "flxOption4",
        "flxOptions": "flxOptions",
        "flxPhoneNumber": "flxPhoneNumber",
        "flxPrimary": "flxPrimary",
        "flxUsedFor": "flxUsedFor",
        "flxRow": "flxRow",
        "flxSelectedPhoneNumbers": "flxSelectedPhoneNumbers",
        "lblCheckBox1": "lblCheckBox1",
        "lblCheckBox2": "lblCheckBox2",
        "lblCheckBox3": "lblCheckBox3",
        "lblCheckBox4": "lblCheckBox4",
        "imgCollapsible": "imgCollapsible",
        "lblHome": "lblHome",
        "lblOption1": "lblOption1",
        "lblOption2": "lblOption2",
        "lblOption3": "lblOption3",
        "lblOption4": "lblOption4",
        "lblOptionSeperator": "lblOptionSeperator",
        "lblPhoneNumber": "lblPhoneNumber",
        "lblPleaseChoose": "lblPleaseChoose",
        "lblPrimary": "lblPrimary",
        "lblUsedFor": "lblUsedFor",
        "lblSelectedSeperator": "lblSelectedSeperator",
        "lblSeperator": "lblSeperator",
        "template": "template",
        "lblCountryCode": "lblCountryCode"
      };

      function getShowDetailListener(phoneModel) {
        return function() {
          kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"}).presentationController.getPhoneDetails(phoneModel);
        }
      }
      var isCountryCodeEnabled = applicationManager.getConfigurationManager().getCountryCodeFlag();
      var flexWidth = "135px";
      var textToShow = "";
        var data = phoneListViewModel.map(function(phoneModel) {
          if (phoneModel.isPrimary === "true" && phoneModel.isAlertsRequired === "true") {
            flexWidth = "175px";
            textToShow = kony.i18n.getLocalizedString("i18n.alertSettings.PrimaryAlertComm");
          } else if (phoneModel.isAlertsRequired === "true" ) {
            flexWidth = "120px";
            textToShow = kony.i18n.getLocalizedString("i18n.alertSettings.alertComm");
          } else if (phoneModel.isPrimary === "true") {
            flexWidth = "135px";
            textToShow = kony.i18n.getLocalizedString("i18n.alertSettings.PrimaryComm");
          }
          return {
            "imgCollapsible": ViewConstants.IMAGES.ARRAOW_DOWN,
            "lblHome": {
              "text": CommonUtilities.changedataCase(phoneModel.Extension),
              /*"accessibilityConfig": {
                "a11yLabel": CommonUtilities.changedataCase(phoneModel.Extension),
              },*/
            },
            "lblPhoneNumber": {
              "text": (phoneModel.phoneNumber) ? phoneModel.phoneNumber : " ",
              /*"accessibilityConfig": {
                "a11yLabel": (phoneModel.phoneNumber) ? phoneModel.phoneNumber : " ",
              },*/
            },
            "lblCountryCode": {
              "text": isCountryCodeEnabled == true && !(kony.sdk.isNullOrUndefined(phoneModel.phoneCountryCode)) ? phoneModel.phoneCountryCode : "",
              /*"accessibilityConfig": {
                "a11yLabel": isCountryCodeEnabled == true && !(kony.sdk.isNullOrUndefined(phoneModel.phoneCountryCode)) ? phoneModel.phoneCountryCode : "",
              },*/
            },
            "flxUsedFor": {
              "isVisible": phoneModel.isPrimary === "true" || phoneModel.isAlertsRequired === "true" ? true : false
            },
            "flxPrimary": {
              "width": flexWidth
            },
            "lblPrimary": {
              "text": textToShow,
              /*"accessibilityConfig": {
                "a11yLabel": textToShow,
              },*/
            },
            "lblUsedFor": {
              "text": kony.i18n.getLocalizedString("i18n.alertSettings.Usedfor"),
              /*"accessibilityConfig": {
                "a11yLabel": kony.i18n.getLocalizedString("i18n.alertSettings.PhoneUsedfor")
              }*/
            },
            "btnViewDetail": {
              text: kony.i18n.getLocalizedString("i18n.billPay.Edit"),
              "accessibilityConfig": {
                "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.EditPhoneNumber"),
              },
              toolTip: kony.i18n.getLocalizedString("i18n.billPay.Edit"),
              onClick: scopeObj.editPhone.bind(scopeObj, phoneModel),
              isVisible: (phoneModel.isPrimary === "true" ? false : true) && (applicationManager.getConfigurationManager().checkUserPermission("PROFILE_SETTINGS_UPDATE"))
            },
            "btnDelete": {
              text: kony.i18n.getLocalizedString("i18n.transfers.deleteExternalAccount"),
              "accessibilityConfig": {
                "a11yLabel": kony.i18n.getLocalizedString("i18n.profilemanagement.deletePhoneaction"),
              },
              toolTip: kony.i18n.getLocalizedString("i18n.transfers.deleteExternalAccount"),
              onClick: scopeObj.deletePhone.bind(scopeObj, phoneModel),
              isVisible: (phoneModel.isPrimary === "true" ? false : true) && (applicationManager.getConfigurationManager().checkUserPermission("PROFILE_SETTINGS_UPDATE"))
            },
            "lblPleaseChoose": {
              "text": "Please choose what service you like to use this number for:",
              /*"accessibilityConfig": {
                "a11yLabel": "Please choose what service you like to use this number for:",
              },*/
            },
            "lblOption1": {
              "text": "Joint Savings ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦. 1234",
              /*"accessibilityConfig": {
                "a11yLabel": "Joint Savings ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦. 1234",
              },*/
            },
            "lblOption2": {
              "text": "Joint Checking ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦. 1234",
              /*"accessibilityConfig": {
                "a11yLabel": "Joint Checking ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦. 1234",
              },*/
            },
            "lblOption3": {
              "text": "Make my primary phone number",
              /*"accessibilityConfig": {
                "a11yLabel": "Make my primary phone number",
              },*/
            },
            "lblOption4": {
              "text": "Allow to recieve text messages",
              /*"accessibilityConfig": {
                "a11yLabel": "Allow to recieve text messages",
              },*/
            },
            "lblCheckBox1": {
              "text": ViewConstants.FONT_ICONS.CHECBOX_SELECTED,
              "accessibilityConfig": {
                "a11yLabel": ViewConstants.FONT_ICONS.CHECBOX_SELECTED,
              },
              "skin": ViewConstants.SKINS.CHECKBOX_SELECTED_SKIN
            },
            "lblCheckBox2": {
              "text": ViewConstants.FONT_ICONS.CHECBOX_SELECTED,
              "accessibilityConfig": {
                "a11yLabel": ViewConstants.FONT_ICONS.CHECBOX_SELECTED,
              },
              "skin": ViewConstants.SKINS.CHECKBOX_SELECTED_SKIN
            },
            "lblCheckBox3": {
              "text": ViewConstants.FONT_ICONS.CHECBOX_SELECTED,
              "accessibilityConfig": {
                "a11yLabel": ViewConstants.FONT_ICONS.CHECBOX_SELECTED,
              },
              "skin": ViewConstants.SKINS.CHECKBOX_SELECTED_SKIN
            },
            "lblCheckBox4": {
              "text": ViewConstants.FONT_ICONS.CHECBOX_SELECTED,
              "accessibilityConfig": {
                "a11yLabel": ViewConstants.FONT_ICONS.CHECBOX_SELECTED,
              },
              "skin": ViewConstants.SKINS.CHECKBOX_SELECTED_SKIN
            },
            "lblSelectedSeperator": "lblSelectedSeperator",
            "lblSeperator": "lblSeperator",
            "lblOptionSeperator": "lblOptionSeperator",
            "template": "flxProfileManagementPhoneNumbers",
            "phoneCountryCode": phoneModel.phoneCountryCode,
            "Extension": phoneModel.Extension,
            "phoneNumber": phoneModel.Value
          };
        })

        this.view.segPhoneNumbers.widgetDataMap = dataMap;
        if (kony.application.getCurrentBreakpoint() === 1024) {
          for (var i = 0; i < data.length; i++) {
            CommonUtilities.setText(data[i].btnViewDetail, kony.i18n.getLocalizedString("i18n.ProfileManagement.EditConsent"), CommonUtilities.getaccessibilityConfig());
          }
        }
        this.view.segPhoneNumbers.setData(data);
      FormControllerUtility.hideProgressBar(this.view);
      this.view.forceLayout();
    },

  };
});