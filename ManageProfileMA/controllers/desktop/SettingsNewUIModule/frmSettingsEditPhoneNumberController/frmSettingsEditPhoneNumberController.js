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
          if(viewModel.editPhoneViewModel){
            this.updateEditPhoneViewModel(viewModel.editPhoneViewModel);
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
      applicationManager.getLoggerManager().setCustomMetrics(this, false, "Phone");
      this.view.flxAccountSettingsCollapseMobile.onClick = this.toggleMenuMobile;
      FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxHeader', 'flxFooter', 'flxMain','flxMenuItemMobile']);
      this.view.lblCollapseMobile.text  = "O";
      this.view.profileMenu.checkLanguage();
      FormControllerUtility.hideErrorForTextboxFields(this.view.tbxEditPhoneNumberCountryCode,this.view.flxError);
      this.view.customheadernew.activateMenu("Settings","Profile Settings");
      this.view.profileMenu.activateMenu("PROFILESETTINGS","Phone");
      this.setSelectedValue("i18n.Profilemanagement.lblPhone");
      this.setAccessibility();
      /*this.view.CopyimgWarning0d045e22dc1104f.accessibilityConfig = {
            "a11yARIA": 
            {
                "tabindex" : -1
            }
      };*/
      this.view.onBreakpointChange = function() {
        self.onBreakpointChange(kony.application.getCurrentBreakpoint());
      }
//       this.view.flxbtn1Container.responsiveConfig.span.1366 = "9.5";
//       this.view.flxbtn2Container.responsiveConfig.span.1366 = "2.5";
      this.view.forceLayout();
    },
    postshow : function(){
      applicationManager.getNavigationManager().applyUpdates(this);
      this.view.lblWarning.text = kony.i18n.getLocalizedString("i18n.profilemanagement.primaryNumberExists");
    },

    /**
	*  Method to set the Accessibility configurations
	*/
    setAccessibility: function(){
      var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
      //CommonUtilities.setText(this.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.ProfileManagement.profilesettings"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblOption3, kony.i18n.getLocalizedString("i18n.ProfileManageemnt.Makemyprimaryphonenumber"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblOption4, kony.i18n.getLocalizedString("i18n.alertSettings.markAlertComm"));
      //CommonUtilities.setText(this.view.lblEditPhoneNumberHeading, kony.i18n.getLocalizedString("i18n.ProfileManagement.EditPhoneNumber"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblPhoneNumberType, kony.i18n.getLocalizedString("i18n.ProfileManagement.Type"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblPhoneNumber, kony.i18n.getLocalizedString("i18n.ProfileManagement.PhoneNumber"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblWarning, kony.i18n.getLocalizedString("i18n.profilemanagement.primaryNumberExists"), accessibilityConfig);
     this.view.btnEditPhoneNumberSave.toolTip = kony.i18n.getLocalizedString("i18n.ProfileManagement.Save");
      this.view.btnEditPhoneNumberCancel.toolTip = kony.i18n.getLocalizedString("i18n.transfers.Cancel");
      CommonUtilities.setText(this.view.btnEditPhoneNumberSave, kony.i18n.getLocalizedString("i18n.ProfileManagement.Save"), accessibilityConfig);
      CommonUtilities.setText(this.view.btnEditPhoneNumberCancel, kony.i18n.getLocalizedString("i18n.transfers.Cancel"), accessibilityConfig);
      this.view.btnEditPhoneNumberSave.accessibilityConfig = {
                                   "a11yLabel":  kony.i18n.getLocalizedString("i18n.profilemanagement.savePhoneNumber")
                               };
      this.view.btnEditPhoneNumberCancel.accessibilityConfig = {
                                   "a11yLabel": kony.i18n.getLocalizedString("i18n.profilemanagement.cancelPhoneNumber")
                               };
      this.view.lblCollapseMobile.accessibilityConfig = {
        "a11yARIA": {
            "tabindex": -1
        }
      };
      this.view.flxAccountSettingsCollapseMobile.accessibilityConfig = {
        "a11yLabel": "Dropdown"
      };
      this.view.flxCheckBox3.accessibilityConfig = {
        "a11yARIA": {
            "tabindex": -1
        }
      };
      this.view.flxCheckBox4.accessibilityConfig = {
        "a11yARIA": {
            "tabindex": -1
        }
      };
      this.view.CopyimgWarning0d045e22dc1104f.accessibilityConfig = {
        "a11yARIA": {
            "tabindex": -1
        },
        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.EditPhoneAnotherPrimaryNumberExistsInfo")
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
      var scopeObj = this;
      this.view.btnEditPhoneNumberCancel.onClick = this.onCancelClick;
      if (!CommonUtilities.isCSRMode()) {
              this.setEditNewPhoneValidationActions();
          }
     /*this.view.tbxPhoneNumber.onTextChange = function(){
       scopeObj.view.tbxPhoneNumber.accessibilityConfig = {
            "a11yValue": scopeObj.view.tbxPhoneNumber.text.trim()
       };
     };*/
     this.view.tbxEditPhoneNumberCountryCode.onTextChange = function(){
        scopeObj.view.tbxEditPhoneNumberCountryCode.accessibilityConfig = {
            "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.EditPhoneNumberCountryCode")
        };
     };
     this.view.lbxPhoneNumberType.onSelection = function(){
       CommonUtilities.setText(scopeObj.view.lbxPhoneNumberType,scopeObj.view.lbxPhoneNumberType.selectedKey , CommonUtilities.getaccessibilityConfig());
     };

    },
     /**
       * Method to assign validation action while editing phone number  fields
       */
      setEditNewPhoneValidationActions: function() {
          this.view.tbxPhoneNumber.onKeyUp = this.checkUpdateEditPhoneForm.bind(this);
      },
    btnEditPhoneNumberSaveOnClick : function(editPhoneViewModel) {
      if (this.validateEditPhoneNumberForm()) {
        this.updatePhoneNumber(editPhoneViewModel, this.getEditPhoneFormData());
        this.view.flxHeader.setFocus(true);
      }
    },
    getEditPhoneFormData: function() {
      var data = {
        isPrimary: this.view.lblCheckBox3.text === ViewConstants.FONT_ICONS.CHECBOX_SELECTED,
        isAlertsRequired: this.view.lblCheckBox4.text === ViewConstants.FONT_ICONS.CHECBOX_SELECTED,
        isTypeBusiness:0
      }
      this.getPhoneNumberFromForm(data);
      /*  var services = {};
          this.view.segEditPhoneNumberOption1.data.forEach(function(data) {
              services[data.id] = data.lblCheckBox.text === ViewConstants.FONT_ICONS.CHECBOX_SELECTED
          })
          data.services = services;*/
      return data;
    },
    /**
       * Method to show data related to edit phone numbers scenario
       * @param {Object} - which sets the data
       */
    getPhoneNumberFromForm: function(data){
      data.phoneNumber = this.view.tbxPhoneNumber.text;
      if(applicationManager.getConfigurationManager().getCountryCodeFlag() == true){
        data.phoneCountryCode = this.view.tbxEditPhoneNumberCountryCode.text;
      }else{
        data.phoneCountryCode = "";
      }
      return data;
    },
    
    updatePhoneNumber: function(editPhoneViewModel, formData) {
      var servicesToSend = [];
      /* editPhoneViewModel.services.forEach(function(account) {
              if (!account.selected && formData.services[account.id]) {
                  servicesToSend.push({
                      id: account.id,
                      selected: true
                  });
              } else if (account.selected && !formData.services[account.id]) {
                  servicesToSend.push({
                      id: account.id,
                      selected: false
                  });
              }
          });
          formData.services = servicesToSend;*/
      formData.isTypeBusiness=editPhoneViewModel.isTypeBusiness;
      formData.Extension= this.view.lbxPhoneNumberType.selectedKey;
      kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"}).presentationController.editPhoneNumber(editPhoneViewModel.id, formData);
    },
    /**
       * Method to validate the phone umber after editing
       */
    validateEditPhoneNumberForm: function() {
      var phoneData = this.getEditPhoneFormData();
      if (!applicationManager.getValidationUtilManager().isValidPhoneNumber(phoneData.phoneNumber) || (phoneData.phoneNumber.length < 7 && phoneData.phoneNumber.length > 15)) {
        this.view.flxError.setVisibility(true);
        this.view.lblError.text = kony.i18n.getLocalizedString("i18n.profile.notAValidPhoneNumber");
        return false;
      } else {
        this.view.flxError.setVisibility(false);
        return true;
      }
    },
    /**
       * Method to update edit phone number UI based on the responce form backend
       * @param {Object} editPhoneViewModel - response from backend after fetching phone number
       */
    updateEditPhoneViewModel: function(editPhoneViewModel) {
      var scopeObj = this;
      if (editPhoneViewModel.serverError) {
        this.view.flxError.setVisibility(true);
        this.view.lblError.text = editPhoneViewModel.serverError.errorMessage;
      } else {
        this.view.flxError.setVisibility(false);
        this.showEditPhonenumber();
        if(editPhoneViewModel.isTypeBusiness === "1"){
          //this.view.lblTypeValue.setVisibility(true);
          //CommonUtilities.setText(this.view.lblPhoneNumberValue, scopeObj.constructPhoneNumber(editPhoneViewModel) , CommonUtilities.getaccessibilityConfig());
          //this.view.lblPhoneNumberValue.setVisibility(true);
          this.view.lbxPhoneNumberType.setVisibility(false);
         // this.view.flxEditPhoneNumberCountryCode.setVisibility(false);
        }
        this.view.flxError.setVisibility(false);
        if (editPhoneViewModel.phoneTypes.length > 0) {
        this.view.lbxPhoneNumberType.masterData = editPhoneViewModel.phoneTypes;
        this.view.lbxPhoneNumberType.selectedKey = editPhoneViewModel.phoneTypeSelected;
        }
        this.view.tbxPhoneNumber.text = editPhoneViewModel.phoneNumber;
        this.view.tbxEditPhoneNumberCountryCode.text = editPhoneViewModel.phoneCountryCode||"";
        //CommonUtilities.setText(scopeObj.view.tbxPhoneNumber, editPhoneViewModel.phoneNumber , CommonUtilities.getaccessibilityConfig());
        //CommonUtilities.setText(scopeObj.view.tbxEditPhoneNumberCountryCode, editPhoneViewModel.phoneCountryCode ||"" , CommonUtilities.getaccessibilityConfig());
        /*scopeObj.view.tbxPhoneNumber.accessibilityConfig = {
            "a11yValue": scopeObj.view.tbxPhoneNumber.text.trim()
        };*/
        scopeObj.view.tbxEditPhoneNumberCountryCode.accessibilityConfig = {
            "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.EditPhoneNumberCountryCode")
           // "a11yValue": scopeObj.view.tbxEditPhoneNumberCountryCode.text.trim()
        };
        CommonUtilities.setText(scopeObj.view.lbxPhoneNumberType, editPhoneViewModel.phoneTypeSelected ||"" , CommonUtilities.getaccessibilityConfig());
        this.view.flxOptions.setVisibility(!editPhoneViewModel.isPrimary||!editPhoneViewModel.isAlertsRequired);
        this.view.flxOption3.setVisibility(!editPhoneViewModel.isPrimary);
        this.view.flxWarning.setVisibility(!editPhoneViewModel.isPrimary);
        this.view.flxOption4.setVisibility(kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"}).presentationController.getenableSeparateContact());
        this.view.flxEditPhoneNumberButtons.setVisibility(true);
        this.view.lblCheckBox3.skin = editPhoneViewModel.isPrimary ? ViewConstants.SKINS.CHECKBOX_SELECTED_SKIN : ViewConstants.SKINS.CHECKBOX_UNSELECTED_SKIN;
        //CommonUtilities.setText(this.view.lblCheckBox3, editPhoneViewModel.isPrimary ? ViewConstants.FONT_ICONS.CHECBOX_SELECTED : ViewConstants.FONT_ICONS.CHECBOX_UNSELECTED , CommonUtilities.getaccessibilityConfig());
        this.view.lblCheckBox4.skin = editPhoneViewModel.isAlertsRequired ? ViewConstants.SKINS.CHECKBOX_SELECTED_SKIN : ViewConstants.SKINS.CHECKBOX_UNSELECTED_SKIN;
        //CommonUtilities.setText(this.view.lblCheckBox4, editPhoneViewModel.isAlertsRequired ? ViewConstants.FONT_ICONS.CHECBOX_SELECTED : ViewConstants.FONT_ICONS.CHECBOX_UNSELECTED , CommonUtilities.getaccessibilityConfig()); 
        if (editPhoneViewModel.isPrimary) {
                    this.view.lblCheckBox3.text = ViewConstants.FONT_ICONS.CHECBOX_SELECTED;
                    this.view.lblCheckBox3.accessibilityConfig = {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.EditPhoneMakeThisAsPrimaryPhoneNumberChecked")
                    };
                } else {
                    this.view.lblCheckBox3.text = ViewConstants.FONT_ICONS.CHECBOX_UNSELECTED;
                    this.view.lblCheckBox3.accessibilityConfig = {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.EditPhoneMakeThisAsPrimaryPhoneNumberUnchecked")
                    };
                }
                if (editPhoneViewModel.isAlertsRequired) {
                    this.view.lblCheckBox4.text = ViewConstants.FONT_ICONS.CHECBOX_SELECTED;
                    this.view.lblCheckBox4.accessibilityConfig = {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.EditPhoneMarkPhoneNumberForAlertCommunicationChecked")
                    };
                } else {
                    this.view.lblCheckBox4.text = ViewConstants.FONT_ICONS.CHECBOX_UNSELECTED;
                    this.view.lblCheckBox4.accessibilityConfig = {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.EditPhoneMarkPhoneNumberForAlertCommunicationUnchecked")
                    };
                }
        this.view.flxCheckBox3.onClick = function() {
          this.toggleFontCheckBox(this.view.lblCheckBox3);
          if (this.view.lblCheckBox3.text === ViewConstants.FONT_ICONS.CHECBOX_SELECTED) {
                        this.view.lblCheckBox3.accessibilityConfig = {
                            "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.EditPhoneMakeThisAsPrimaryPhoneNumberChecked")
                        };
                    } else {
                        this.view.lblCheckBox3.accessibilityConfig = {
                            "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.EditPhoneMakeThisAsPrimaryPhoneNumberUnchecked")
                        };
                    }
        }.bind(this);
        this.view.flxCheckBox4.onClick = function() {
          this.toggleFontCheckBox(this.view.lblCheckBox4);
          if (this.view.lblCheckBox4.text === ViewConstants.FONT_ICONS.CHECBOX_SELECTED) {
                        this.view.lblCheckBox4.accessibilityConfig = {
                            "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.EditPhoneMarkPhoneNumberForAlertCommunicationChecked")
                        };
                    } else {
                        this.view.lblCheckBox4.accessibilityConfig = {
                            "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.EditPhoneMarkPhoneNumberForAlertCommunicationUnchecked")
                        };
                    }
        }.bind(this);
        this.view.lblCheckBox4.skin = editPhoneViewModel.isAlertsRequired ? ViewConstants.SKINS.CHECKBOX_SELECTED_SKIN : ViewConstants.SKINS.CHECKBOX_UNSELECTED_SKIN;
        //CommonUtilities.setText(this.view.lblCheckBox4, editPhoneViewModel.isAlertsRequired ? ViewConstants.FONT_ICONS.CHECBOX_SELECTED : ViewConstants.FONT_ICONS.CHECBOX_UNSELECTED , CommonUtilities.getaccessibilityConfig());
        this.view.btnEditPhoneNumberSave.toolTip = kony.i18n.getLocalizedString("i18n.ProfileManagement.Save");
        CommonUtilities.setText(this.view.btnEditPhoneNumberSave, kony.i18n.getLocalizedString("i18n.ProfileManagement.Save") , CommonUtilities.getaccessibilityConfig());
        this.view.btnEditPhoneNumberSave.accessibilityConfig = {
                                   "a11yLabel":  kony.i18n.getLocalizedString("i18n.profilemanagement.savePhoneNumber")
                               };
        if (CommonUtilities.isCSRMode()) {
          this.view.btnEditPhoneNumberSave.onClick = CommonUtilities.disableButtonActionForCSRMode();
          this.view.btnEditPhoneNumberSave.skin = CommonUtilities.disableButtonSkinForCSRMode();
        } else {
          this.view.btnEditPhoneNumberSave.onClick = function() {
             if(!applicationManager.getValidationUtilManager().isValidPhoneNumberCountryCode(this.view.tbxEditPhoneNumberCountryCode.text) ){
                   FormControllerUtility.showErrorForTextboxFields(this.view.tbxEditPhoneNumberCountryCode,this.view.flxError);
                   CommonUtilities.setText(this.view.lblError, kony.i18n.getLocalizedString("i18n.profile.enterPhoneNumberCountryCode") , CommonUtilities.getaccessibilityConfig());
                   return false;
                 }
            else{
                  FormControllerUtility.hideErrorForTextboxFields(this.view.tbxEditPhoneNumberCountryCode,this.view.flxError);
            }
            if (this.validateEditPhoneNumberForm()) {
              this.updatePhoneNumber(editPhoneViewModel, this.getEditPhoneFormData());
              this.view.settings.flxHeader.setFocus(true);
            }
          }.bind(this);
        }
        this.view.flxEditPhoneNumberButtons.setVisibility(true);
        this.checkUpdateEditPhoneForm();
        //  this.setEditPhoneServicesData(editPhoneViewModel.services);
      }
    },
    /**
       * Method to enable/disable button based on the edited phone number entered
       */
    checkUpdateEditPhoneForm: function() {
      if (!CommonUtilities.isCSRMode()) {
        var formdata = this.getEditPhoneFormData();
        if (formdata.phoneNumber === "") {
          this.disableButton(this.view.btnEditPhoneNumberSave);
        } else {
          this.enableButton(this.view.btnEditPhoneNumberSave);
        }
      }
    },
    /**
       * Method to show the details while editing the phone number
       */
    showEditPhonenumber: function() {
      CommonUtilities.setText(this.view.lblEditPhoneNumberHeading, kony.i18n.getLocalizedString("i18n.ProfileManagement.EditPhoneNumber") , CommonUtilities.getaccessibilityConfig());
      this.view.btnDelete.isVisible = false;
      this.view.btnEdit.isVisible = false;
      //this.view.lblTypeValue.isVisible = false;
     // this.view.lblPhoneNumberValue.isVisible = false;
      this.view.tbxPhoneNumber.isVisible = true;
      this.view.lbxPhoneNumberType.isVisible = true;
      this.view.flxWarning.isVisible = true;
      this.view.btnEditPhoneNumberCancel.isVisible = true;
      if(applicationManager.getConfigurationManager().getCountryCodeFlag() == true){
        this.view.tbxEditPhoneNumberCountryCode.setVisibility(true);
      }else{
        this.view.tbxEditPhoneNumberCountryCode.setVisibility(false);
      }
      this.view.btnEditPhoneNumberSave.toolTip = kony.i18n.getLocalizedString('i18n.ProfileManagement.Save');
      CommonUtilities.setText(this.view.btnEditPhoneNumberSave, kony.i18n.getLocalizedString('i18n.profilemanagement.savePhoneNumber') , CommonUtilities.getaccessibilityConfig());
    },
    onCancelClick : function(){
      applicationManager.getNavigationManager().navigateTo("frmSettingsPhoneNumbers");

    },
    showOnlyRightGrid : function(){

    },
    showOnlyRightGrid : function(){

    },
    setDataToSegment : function(phoneList){
      this.showPhoneNumbers();
      if (phoneListViewModel.length >= 3 || !applicationManager.getConfigurationManager().checkUserPermission("PROFILE_SETTINGS_UPDATE")) {
        this.view.btnAddNewNumber.setVisibility(false);
      } else {
        this.view.btnAddNewNumber.setVisibility(true);
        this.view.btnAddNewPersonalNumber.setVisibility(true);
      }
      this.setPhoneSegmentData(phoneList);
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
      currForm.flxDeletePopUp.setVisibility(true);
      currForm.flxDeletePopUp.setFocus(true);
      CommonUtilities.setText(currForm.lblDeleteHeader, kony.i18n.getLocalizedString("i18n.transfers.deleteExternalAccount") , CommonUtilities.getaccessibilityConfig());
      CommonUtilities.setText(currForm.lblConfirmDelete, kony.i18n.getLocalizedString("i18n.ProfileManagement.deletePhoneNum") , CommonUtilities.getaccessibilityConfig());
      currForm.forceLayout();
      currForm.btnDeleteYes.onClick = function() {
        kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"}).presentationController.deletePhone(phoneObj);
        scopeObj.view.flxDelete.setFocus(true);
        scopeObj.view.flxDeletePopUp.setVisibility(false);
        scopeObj.view.forceLayout();
      }
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
    configureAccessibility: function () {  
      //     var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
      //     this.view.customheadernew.lblHeaderMobile.text = kony.i18n.getLocalizedString("i18n.savingsPot.mySavingsPot");
      //     CommonUtilities.setText(this.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("ii18n.savingsPot.mySavingsPot"), accessibilityConfig);

      //     this.view.lblContentHeader.accessibilityConfig = {
      //       "a11yLabel":"",
      //       "a11yARIA": {
      //         "tabindex": 0
      //       }	
      //     };
    },
    /**
       * Method to Enable a button
       * @param {String} button - ID of the button to be enabled
       */
      enableButton: function(button) {
          if(!CommonUtilities.isCSRMode()){
             button.setEnabled(true);
             button.skin = "sknbtnSSPffffff15px0273e3bg";
             button.hoverSkin = "sknbtnSSPffffff15px0273e3bg";//sknBtnHoverSSPFFFFFF15Px0273e3
             button.focusSkin = "sknbtnSSPffffff15px0273e3bg";//sknBtnFocusSSPFFFFFF15Px0273e3
          }
      },
       /**
       * Method to Disable a button
       * @param {String} button - ID of the button to be disabled
       */
      disableButton: function(button) {
          button.setEnabled(false);
          button.skin = "sknBtnBlockedSSPFFFFFF15Px";
          button.hoverSkin = "sknBtnBlockedSSPFFFFFF15Px";
          button.focusSkin = "sknBtnBlockedSSPFFFFFF15Px";
      },
     toggleFontCheckBox: function(imgCheckBox) {
          if (imgCheckBox.text === ViewConstants.FONT_ICONS.CHECBOX_SELECTED) {
              imgCheckBox.text = ViewConstants.FONT_ICONS.CHECBOX_UNSELECTED;
              imgCheckBox.skin = ViewConstants.SKINS.CHECKBOX_UNSELECTED_SKIN;
          } else {
              imgCheckBox.text = ViewConstants.FONT_ICONS.CHECBOX_SELECTED;
              imgCheckBox.skin = ViewConstants.SKINS.CHECKBOX_SELECTED_SKIN;
          }
      },

  };
});