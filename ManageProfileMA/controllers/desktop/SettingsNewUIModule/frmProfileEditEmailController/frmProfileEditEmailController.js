define(['CommonUtilities', 'CSRAssistUI', 'FormControllerUtility', 'OLBConstants', 'ViewConstants', 'CampaignUtility'], function (CommonUtilities, CSRAssistUI, FormControllerUtility, OLBConstants, ViewConstants, CampaignUtility) {
  var orientationHandler = new OrientationHandler();
  var responsiveUtils = new ResponsiveUtils();
  return {
    updateFormUI: function (viewModel) {
      if (viewModel !== undefined) {
        if (viewModel.isLoading !== undefined) this.changeProgressBarState(viewModel.isLoading);
        if (viewModel.editAlertCommError) this.showEmailError(viewModel.editAlertCommError);
        if (viewModel.campaign) {
          CampaignUtility.showCampaign(viewModel.campaign, this.view, "flxContainer");
        }
        if (viewModel.emailList) this.updateEmailList(viewModel.emailList);
        if (viewModel.emails) this.setEmailsToLbx(viewModel.emails);
        if (viewModel.emailObj) this.updateEmailList(viewModel.emailObj);
        if (viewModel.editemailObj) this.editEmail(viewModel.editemailObj)
      }
    },
    preShow: function () {
      var self = this;
      this.view.flxRight.setVisibility(true);
      applicationManager.getLoggerManager().setCustomMetrics(this, false, "Profile");
      this.view.postShow = this.postShowProfile;
      this.view.flxAccountSettingsCollapseMobile.onClick = this.toggleMenuMobile;
      FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxHeader', 'flxFooter', 'flxMain', 'flxMenuItemMobile']);
      this.view.lblCollapseMobile.text = "O";
      this.view.profileMenu.checkLanguage();
      this.view.profileMenu.activateMenu("PROFILESETTINGS", "Email");
      this.view.customheadernew.activateMenu("Settings", "Profile Settings");
      this.setSelectedValue("i18n.ProfileManagement.EmailId");
      this.setFlowActions();
      this.setAccessibility();
      /*this.view.imgPrimaryNumberexists.accessibilityConfig = {
            "a11yARIA": 
            {
                "tabindex" : -1
            }
      };*/
      this.view.onBreakpointChange = function () {
        self.onBreakpointChange(kony.application.getCurrentBreakpoint());
      }
      this.view.forceLayout();
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
  *  Method to set ui for the component in mobile breakpoint
  */
    toggleMenuMobile: function () {
      if (this.view.lblCollapseMobile.text == "O") {
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
    changeProgressBarState: function (isLoading) {
      if (isLoading) {
        FormControllerUtility.showProgressBar(this.view);
      } else {
        FormControllerUtility.hideProgressBar(this.view);
      }
    },
    postShowProfile: function () {
      applicationManager.getNavigationManager().applyUpdates(this);
      this.view.forceLayout();
    },
    onBreakpointChange: function (width) {
      var scope = this;
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
    /**
  *  Method to set the Accessibility configurations
  */
    setAccessibility: function () {
      var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
      this.view.btnEditEmailIdCancel.toolTip = kony.i18n.getLocalizedString("i18n.transfers.Cancel");
      this.view.btnEditEmailIdSave.toolTip = kony.i18n.getLocalizedString("i18n.ProfileManagement.Save");
      //CommonUtilities.setText(this.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.ProfileManagement.profilesettings"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblEditEmailHeading, kony.i18n.getLocalizedString("i18n.ProfileManagement.EditEmail"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblEditMarkAsPrimaryEmail, kony.i18n.getLocalizedString("i18n.ProfileManagement.MarkAsPrimaryEmail"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblEditMarkAsAlertCommEmail, kony.i18n.getLocalizedString("i18n.alertSettings.markAlertComm"), accessibilityConfig);
      CommonUtilities.setText(this.view.btnEditEmailIdCancel, kony.i18n.getLocalizedString("i18n.transfers.Cancel"), accessibilityConfig);
      CommonUtilities.setText(this.view.btnEditEmailIdSave, kony.i18n.getLocalizedString("i18n.ProfileManagement.Save"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblPrimaryNumberexists, kony.i18n.getLocalizedString("i18n.profile.anotherEmail"), accessibilityConfig);
      this.view.btnEditEmailIdSave.accessibilityConfig = {
                                   "a11yLabel": kony.i18n.getLocalizedString("i18n.profilemanagement.saveEmailAction")
                               };
      this.view.lblEditMarkAsPrimaryEmail.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.MarkAsPrimaryEmail");
      this.view.lblEditMarkAsAlertCommEmail.text = kony.i18n.getLocalizedString("i18n.alertSettings.markAlertComm");
      this.view.btnEditEmailIdCancel.accessibilityConfig = {
                                   "a11yLabel": kony.i18n.getLocalizedString("i18n.profilemanagement.cancelEmail")
                               };
     //CommonUtilities.setText(this.view.lblHeading, kony.i18n.getLocalizedString("i18n.ProfileManagement.Settingscapson"), accessibilityConfig);
      this.view.lblCollapseMobile.accessibilityConfig = {
        "a11yARIA": {
            "tabindex": -1
        }
      };
      this.view.flxAccountSettingsCollapseMobile.accessibilityConfig = {
        "a11yLabel": "Dropdown"
      };
      this.view.flxEditMarkAsPrimaryEmailCheckBox.accessibilityConfig = {
        "a11yARIA": {
            "tabindex": -1
        }
      };
      this.view.flxEditMarkAsAlertCommEmailCheckBox.accessibilityConfig = {
        "a11yARIA": {
            "tabindex": -1
        }
      };
      this.view.imgPrimaryNumberexists.accessibilityConfig = {
        "a11yARIA": {
            "tabindex": -1
        },
        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.EditEmailAnotherPrimaryEmailExistsInfo")
      };
      this.view.rtxEditEmail.accessibilityConfig = {
        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.i18n.ProfileManagement.EmailIdMandatoryIcon")
      };

    },
    /**
  *  Method to set the Form Flow Actions such as button onclick events
  */
    setFlowActions: function () {
      var scopeObj = this;
      this.view.btnEditEmailIdCancel.onClick = function () {
        this.showEmail();
      }.bind(this);
      this.view.flxEditMarkAsPrimaryEmailCheckBox.onClick = function () {
        scopeObj.toggleFontCheckBox(this.view.lblEditMarkAsPrimaryEmailCheckBox);
        if (this.view.lblEditMarkAsPrimaryEmailCheckBox.text === ViewConstants.FONT_ICONS.CHECBOX_SELECTED) {
                    this.view.lblEditMarkAsPrimaryEmailCheckBox.accessibilityConfig = {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.EditEmailMakeThisAsPrimaryEmailChecked")
                    };
                } else {
                    this.view.lblEditMarkAsPrimaryEmailCheckBox.accessibilityConfig = {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.EditEmailMakeThisAsPrimaryEmailUnchecked")
                    };
                }
      }.bind(this)
      this.view.flxEditMarkAsAlertCommEmailCheckBox.onClick = function () {
        this.toggleFontCheckBox(this.view.lblEditMarkAsAlertCommEmailCheckBox);
        if (this.view.lblEditMarkAsAlertCommEmailCheckBox.text === ViewConstants.FONT_ICONS.CHECBOX_SELECTED) {
                    this.view.lblEditMarkAsAlertCommEmailCheckBox.accessibilityConfig = {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.EditEmailMarkThisEmailForAlertCommunicationChecked")
                    };
                } else {
                    this.view.lblEditMarkAsAlertCommEmailCheckBox.accessibilityConfig = {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.EditEmailMarkThisEmailForAlertCommunicationUnchecked")
                    };
                }
      }.bind(this)
      /*this.view.tbxEditEmailId.onTextChange = function(){
              //CommonUtilities.setText(scopeObj.view.tbxEditEmailId,scopeObj.view.tbxEditEmailId.text.trim() , CommonUtilities.getaccessibilityConfig());
              scopeObj.view.tbxEditEmailId.accessibilityConfig ={
                "a11yValue":scopeObj.view.tbxEditEmailId.text.trim()
              }
      };*/
    },
    /**
    * Method to assign images when checkbox is clicked
    * @param {String} imgCheckBox- ID of the checkbox
    */
    toggleCheckBox: function (imgCheckBox) {
      if (imgCheckBox.src === ViewConstants.IMAGES.UNCHECKED_IMAGE) {
        imgCheckBox.src = ViewConstants.IMAGES.CHECKED_IMAGE;
      } else {
        imgCheckBox.src = ViewConstants.IMAGES.UNCHECKED_IMAGE;
      }
    },
    toggleFontCheckBox: function (imgCheckBox) {
      if (imgCheckBox.text === ViewConstants.FONT_ICONS.CHECBOX_SELECTED) {
        imgCheckBox.text = ViewConstants.FONT_ICONS.CHECBOX_UNSELECTED;
        imgCheckBox.skin = ViewConstants.SKINS.CHECKBOX_UNSELECTED_SKIN;
      } else {
        imgCheckBox.text = ViewConstants.FONT_ICONS.CHECBOX_SELECTED;
        imgCheckBox.skin = ViewConstants.SKINS.CHECKBOX_SELECTED_SKIN;
      }
    },
    /**
      * Method used to show the email view.
      */
    showEmail: function () {
      kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"}).presentationController.showUserEmail();
    },
    showEditEmail: function () {
      //   this.resetUpdateEmailForm();
      this.view.flxEditEmailWrapper.setVisibility(true);
    },
    /**
     * Method to reset fields in the UI of Email module
     */
    resetUpdateEmailForm: function () {
      this.view.tbxEditEmailId.text = "";
      //CommonUtilities.setText(this.view.lblEditMarkAsPrimaryEmailCheckBox, ViewConstants.FONT_ICONS.CHECBOX_UNSELECTED, CommonUtilities.getaccessibilityConfig());
      this.view.lblEditMarkAsPrimaryEmailCheckBox.skin = ViewConstants.SKINS.CHECKBOX_UNSELECTED_SKIN;
      //CommonUtilities.setText(this.view.lblEditMarkAsAlertCommEmailCheckBox, ViewConstants.FONT_ICONS.CHECBOX_UNSELECTED, CommonUtilities.getaccessibilityConfig());
      this.view.lblEditMarkAsAlertCommEmailCheckBox.skin = ViewConstants.SKINS.CHECKBOX_UNSELECTED_SKIN;
      this.disableButton(this.view.btnEditEmailIdSave);
      this.view.flxErrorEditEmail.setVisibility(false);
      this.view.lblEmailValue.setVisibility(false);
      this.view.tbxEditEmailId.setVisibility(true);
    },
    /**
     * Method to update the list of emails
     * @param {Object} emailListViewModel- list of emails
     */

    updateEmailList: function (emailObj) {
      var scopeObj = this;
      this.view.lblEditMarkAsPrimaryEmail.setVisibility(false);
      this.view.flxEditMarkAsPrimaryEmailCheckBox.setVisibility(false);
      this.view.flxAnotherprimaryNumberExists.setVisibility(false);

      this.view.lblEditMarkAsAlertCommEmail.setVisibility(true);
      this.view.flxEditMarkAsAlertCommEmailCheckBox.setVisibility(kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"}).presentationController.getenableSeparateContact());
      //  this.view.flxEditMarkAsAlertCommEmailCheckBox.top=this.view.lblEditMarkAsPrimaryEmail.isVisible?"120dp":"80dp";
      this.view.flxAnotherprimaryNumberExists.setVisibility(this.view.lblEditMarkAsPrimaryEmail.isVisible);
      if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
        //      this.view.flxAnotherprimaryNumberExists.top = emailObj.isAlertsRequired==="true"?"170dp":"120dp";
        this.view.flxEditMarkAsAlertCommEmailCheckBox.top = "20dp";

      }
      else {
        this.view.flxEditMarkAsAlertCommEmailCheckBox.top = "80dp";

        //      this.view.flxAnotherprimaryNumberExists.top = emailObj.isAlertsRequired==="true"?"170dp":"120dp";
      }
      //  this.view.lblEditMarkAsAlertCommEmail.top=this.view.lblEditMarkAsPrimaryEmail.isVisible?"115px":"85px";
      //CommonUtilities.setText(this.view.lblEditMarkAsAlertCommEmailCheckBox, ViewConstants.FONT_ICONS.CHECBOX_UNSELECTED, CommonUtilities.getaccessibilityConfig());
      this.view.lblEditMarkAsAlertCommEmailCheckBox.text = emailObj.isAlertsRequired === "true" ? ViewConstants.FONT_ICONS.CHECBOX_SELECTED : ViewConstants.FONT_ICONS.CHECBOX_UNSELECTED;
      this.view.lblEditMarkAsAlertCommEmailCheckBox.skin = emailObj.isAlertsRequired === "true" ? ViewConstants.SKINS.CHECKBOX_SELECTED_SKIN : ViewConstants.SKINS.CHECKBOX_UNSELECTED_SKIN;
      if (this.view.lblEditMarkAsPrimaryEmailCheckBox.text === ViewConstants.FONT_ICONS.CHECBOX_SELECTED) {
                this.view.lblEditMarkAsPrimaryEmailCheckBox.accessibilityConfig = {
                    "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.EditEmailMakeThisAsPrimaryEmailChecked")
                };
            } else {
                this.view.lblEditMarkAsPrimaryEmailCheckBox.accessibilityConfig = {
                    "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.EditEmailMakeThisAsPrimaryEmailUnchecked")
                };
            }
      if(this.view.lblEditMarkAsAlertCommEmailCheckBox.text === ViewConstants.FONT_ICONS.CHECBOX_SELECTED) {
                this.view.lblEditMarkAsAlertCommEmailCheckBox.accessibilityConfig = {
                    "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.EditEmailMarkThisEmailForAlertCommunicationChecked")
                };
            } else {
                this.view.lblEditMarkAsAlertCommEmailCheckBox.accessibilityConfig = {
                    "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.EditEmailMarkThisEmailForAlertCommunicationUnchecked")
                };
            }

      //  this.view.lblEditMarkAsAlertCommEmailCheckBox.skin = ViewConstants.SKINS.CHECKBOX_UNSELECTED_SKIN;
      this.view.forceLayout();
      scopeObj.showEditEmail();
      if (emailObj.isTypeBusiness === "1") {
        this.view.tbxEditEmailId.setVisibility(false);
        this.view.lblEmailValue.setVisibility(true);
        this.view.lblEmailValue.text = emailObj.Value;
        CommonUtilities.setText(scopeObj.view.lblEmailValue, scopeObj.view.lblEmailValue.text, CommonUtilities.getaccessibilityConfig());
      }
      scopeObj.view.tbxEditEmailId.text = emailObj.Value;
      //CommonUtilities.setText(scopeObj.view.tbxEditEmailId, scopeObj.view.tbxEditEmailId.text.trim(), CommonUtilities.getaccessibilityConfig());
      /*scopeObj.view.tbxEditEmailId.accessibilityConfig ={
           "a11yValue":scopeObj.view.tbxEditEmailId.text.trim()
      };*/
      this.checkUpdateEmailForm();
      if (CommonUtilities.isCSRMode()) {
        scopeObj.view.btnEditEmailIdSave.onClick = CommonUtilities.disableButtonSkinForCSRMode();
        scopeObj.view.btnEditEmailIdSave.skin = CommonUtilities.disableButtonSkinForCSRMode();
      } else {
        scopeObj.view.btnEditEmailIdSave.onClick = function () {
          kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"}).presentationController.editEmail({
            id: emailObj.id,
            extension: emailObj.extension,
            email: scopeObj.view.tbxEditEmailId.text,
            isPrimary: true,
            isAlertsRequired: scopeObj.view.lblEditMarkAsAlertCommEmailCheckBox.text === ViewConstants.FONT_ICONS.CHECBOX_SELECTED ? true : false,
            isTypeBusiness: emailObj.isTypeBusiness
          });
        };
      }
      scopeObj.checkUpdateEmailForm();
    },
    /**
      * Method to Disable a button
      * @param {String} button - ID of the button to be disabled
      */
    disableButton: function (button) {
      button.setEnabled(false);
      button.skin = "sknBtnBlockedSSPFFFFFF15Px";
      button.hoverSkin = "sknBtnBlockedSSPFFFFFF15Px";
      button.focusSkin = "sknBtnBlockedSSPFFFFFF15Px";
    },
    /**
     * Method to enable/disable button based on the email entered after editing
     */
    checkUpdateEmailForm: function () {
      if (!CommonUtilities.isCSRMode()) {
        if (applicationManager.getValidationUtilManager().isValidEmail(this.view.tbxEditEmailId.text)) {
          this.enableButton(this.view.btnEditEmailIdSave);
        } else {
          this.disableButton(this.view.btnEditEmailIdSave);
        }
      }
    },
    /**
     * Method to Enable a button
     * @param {String} button - ID of the button to be enabled
     */
    enableButton: function (button) {
      if (!CommonUtilities.isCSRMode()) {
        button.setEnabled(true);
        button.skin = "sknbtnSSPffffff15px0273e3bg";
        button.hoverSkin = "sknBtnFocusSSPFFFFFF15Px0273e3";
        button.focusSkin = "sknBtnHoverSSPFFFFFF15Px0273e3";
      }
    },
    /**
* Method to edit the email which is already set
* @param {Object} emailObj- JSON object of the email with all fields comminf from backend
*/
    editEmail: function (emailObj) {
      var scopeObj = this;
      this.view.lblEditMarkAsPrimaryEmail.setVisibility(!(emailObj.isPrimary === "true"));
      this.view.flxEditMarkAsPrimaryEmailCheckBox.setVisibility(!(emailObj.isPrimary === "true"));
      this.view.flxAnotherprimaryNumberExists.setVisibility(true);

      //CommonUtilities.setText(scopeObj.view.lblEditMarkAsPrimaryEmailCheckBox, ViewConstants.FONT_ICONS.CHECBOX_UNSELECTED, CommonUtilities.getaccessibilityConfig());
      scopeObj.view.lblEditMarkAsPrimaryEmailCheckBox.skin = ViewConstants.SKINS.CHECKBOX_UNSELECTED_SKIN;
      /*if (!(kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile)) {
        this.view.flxEditMarkAsAlertCommEmailCheckBox.top = this.view.lblEditMarkAsPrimaryEmail.isVisible ? "120px" : "80px";
        this.view.flxAnotherprimaryNumberExists.top = this.view.lblEditMarkAsPrimaryEmail.isVisible ? "170px" : "120px";
      }*/
      //  this.view.lblEditMarkAsAlertCommEmail.top=this.view.lblEditMarkAsPrimaryEmail.isVisible?"115px":"85px";
      this.view.lblEditMarkAsAlertCommEmail.setVisibility(true);
      this.view.flxEditMarkAsAlertCommEmailCheckBox.setVisibility(kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"}).presentationController.getenableSeparateContact());
      this.view.lblEditMarkAsAlertCommEmailCheckBox.text = emailObj.isAlertsRequired ? ViewConstants.FONT_ICONS.CHECBOX_SELECTED : ViewConstants.FONT_ICONS.CHECBOX_UNSELECTED;
      this.view.lblEditMarkAsAlertCommEmailCheckBox.skin = emailObj.isAlertsRequired ? ViewConstants.SKINS.CHECKBOX_SELECTED_SKIN : ViewConstants.SKINS.CHECKBOX_UNSELECTED_SKIN;
      if (this.view.lblEditMarkAsPrimaryEmailCheckBox.text === ViewConstants.FONT_ICONS.CHECBOX_SELECTED) {
                this.view.lblEditMarkAsPrimaryEmailCheckBox.accessibilityConfig = {
                    "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.EditEmailMakeThisAsPrimaryEmailChecked")
                };
            } else {
                this.view.lblEditMarkAsPrimaryEmailCheckBox.accessibilityConfig = {
                    "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.EditEmailMakeThisAsPrimaryEmailUnchecked")
                };
            }
      if (this.view.lblEditMarkAsAlertCommEmailCheckBox.text === ViewConstants.FONT_ICONS.CHECBOX_SELECTED) {
                this.view.lblEditMarkAsAlertCommEmailCheckBox.accessibilityConfig = {
                    "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.EditEmailMarkThisEmailForAlertCommunicationChecked")
                };
            } else {
                this.view.lblEditMarkAsAlertCommEmailCheckBox.accessibilityConfig = {
                    "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.EditEmailMarkThisEmailForAlertCommunicationUnchecked")
                };
            }
      scopeObj.showEditEmail();
      if (emailObj.isTypeBusiness === "1") {
        this.view.tbxEditEmailId.setVisibility(false);
        this.view.lblEmailValue.setVisibility(true);
        this.view.lblEmailValue.text = emailObj.Value;
        CommonUtilities.setText(scopeObj.view.lblEmailValue, scopeObj.view.lblEmailValue.text, CommonUtilities.getaccessibilityConfig());
      }
      this.view.forceLayout();
      scopeObj.view.tbxEditEmailId.text = emailObj.Value;
      this.checkUpdateEmailForm();
      if (CommonUtilities.isCSRMode()) {
        scopeObj.view.btnEditEmailIdSave.onClick = CommonUtilities.disableButtonActionForCSRMode();
        scopeObj.view.btnEditEmailIdSave.skin = CommonUtilities.disableButtonSkinForCSRMode();
      } else {
        scopeObj.view.btnEditEmailIdSave.onClick = function () {
          kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"}).presentationController.editEmail({
            id: emailObj.id,
            extension: emailObj.Extension,
            email: scopeObj.view.tbxEditEmailId.text,
            isPrimary: scopeObj.view.lblEditMarkAsPrimaryEmailCheckBox.text === ViewConstants.FONT_ICONS.CHECBOX_SELECTED ? true : false,
            isAlertsRequired: scopeObj.view.lblEditMarkAsAlertCommEmailCheckBox.text === ViewConstants.FONT_ICONS.CHECBOX_SELECTED ? true : false,
            isTypeBusiness: emailObj.isTypeBusiness
          });
        };
      }
      // scopeObj.checkAddEmailForm();
    },
    /**
  * Method to enable/disable button based on the email entered after editing
  */
    checkUpdateEmailForm: function () {
      if (!CommonUtilities.isCSRMode()) {
        if (applicationManager.getValidationUtilManager().isValidEmail(this.view.tbxEditEmailId.text)) {
          this.enableButton(this.view.btnEditEmailIdSave);
        } else {
          this.disableButton(this.view.btnEditEmailIdSave);
        }
      }
    },
    checkAddEmailForm: function () {
      if (applicationManager.getValidationUtilManager().isValidEmail(this.view.tbxEmailId.text)) {
        this.enableButton(this.view.btnAddEmailIdAdd);
      } else {
        this.disableButton(this.view.btnAddEmailIdAdd);
      }
    },
    showEmailError: function (errorMessage) {
      this.view.flxProfileError.setVisibility(true);
      CommonUtilities.setText(this.view.rtxError, errorMessage.errorMessage, CommonUtilities.getaccessibilityConfig());
    }
  };
});