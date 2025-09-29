define(['CommonUtilities', 'CSRAssistUI','FormControllerUtility', 'OLBConstants', 'ViewConstants', 'CampaignUtility'], function(CommonUtilities, CSRAssistUI, FormControllerUtility, OLBConstants, ViewConstants, CampaignUtility) {
  var orientationHandler = new OrientationHandler();
  var responsiveUtils = new ResponsiveUtils();
  return {
    updateFormUI: function(viewModel) {
      if (viewModel !== undefined) {
        if (viewModel.isLoading !== undefined) this.changeProgressBarState(viewModel.isLoading);
        if (viewModel.emailError) this.showEmailError(viewModel.emailError);
        if (viewModel.campaign) {
          CampaignUtility.showCampaign(viewModel.campaign, this.view, "flxContainer");
        }   
         if (viewModel.emailList) this.updateEmailList(viewModel.emailList);
         if (viewModel.emails) this.setEmailsToLbx(viewModel.emails);
             
      }
    },
    preShow:function()
    {
      var self=this;
      this.view.flxRight.setVisibility(true);
      applicationManager.getLoggerManager().setCustomMetrics(this, false, "Profile");
      this.view.postShow=this.postShowProfile;
      this.view.flxAccountSettingsCollapseMobile.onClick = this.toggleMenuMobile;
      FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxHeader', 'flxFooter', 'flxMain','flxMenuItemMobile']);
      this.view.lblCollapseMobile.text  = "O";
      this.view.profileMenu.checkLanguage();
      this.view.profileMenu.activateMenu("PROFILESETTINGS","Email");
      this.view.customheadernew.activateMenu("Settings","Profile Settings");
      this.setSelectedValue("i18n.ProfileManagement.EmailId");
      this.setFlowActions();
      this.resetAddEmailForm();
      this.setAccessibility();
      this.view.onBreakpointChange = function() {
        self.onBreakpointChange(kony.application.getCurrentBreakpoint());
      }
      /*this.view.imgPrimaryNumberexists.accessibilityConfig = {
            "a11yARIA": 
            {
                "tabindex" : -1
            }
        };*/
      this.view.tbxEmailId.accessibilityConfig = {
                                   "a11yLabel": kony.i18n.getLocalizedString("i18n.Profile.Enteremail")
                               };
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
        this.view.lblCollapseMobile.text  = "O";
        this.view.flxLeft.setVisibility(false);
        this.view.flxRight.setVisibility(true);
      }
    }, 
      /**
       * Method to enable/disable button based on the email entered
       */
      checkAddEmailForm: function() {
          if (applicationManager.getValidationUtilManager().isValidEmail(this.view.tbxEmailId.text)) {
              this.enableButton(this.view.btnAddEmailIdAdd);
          } else {
              this.disableButton(this.view.btnAddEmailIdAdd);
          }
      },
      /**
       * Method to set the validation function while entering email
       */
      setAddEmailValidationActions: function() {
          var scopeObj = this;
          this.disableButton(this.view.btnAddEmailIdAdd);
          this.view.tbxEmailId.onKeyUp = function() {
              scopeObj.checkAddEmailForm();
          };
      },
     /**
       * Method to Enable a button
       * @param {String} button - ID of the button to be enabled
       */
      enableButton: function(button) {
          if(!CommonUtilities.isCSRMode()){
             button.setEnabled(true);
             button.skin = "sknbtnSSPffffff15px0273e3bg";
             button.hoverSkin = "sknBtnFocusSSPFFFFFF15Px0273e3";
             button.focusSkin = "sknBtnHoverSSPFFFFFF15Px0273e3";
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
    postShowProfile: function() { 
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
    setAccessibility: function(){
      var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
      this.view.btnAddEmailIdCancel.toolTip = kony.i18n.getLocalizedString("i18n.transfers.Cancel");
      this.view.btnAddEmailIdAdd.toolTip = kony.i18n.getLocalizedString("i18n.ProfileManagement.ADD");
      //CommonUtilities.setText(this.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.ProfileManagement.profilesettings"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblAddNewEmailHeading, kony.i18n.getLocalizedString("i18n.ProfileManagement.AddNewEmail"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblMarkAsPrimaryEmail, kony.i18n.getLocalizedString("i18n.ProfileManagement.MarkAsPrimaryEmail"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblMarkAsAlertCommEmail, kony.i18n.getLocalizedString("i18n.alertSettings.markAlertComm"), accessibilityConfig);
      CommonUtilities.setText(this.view.btnAddEmailIdCancel, kony.i18n.getLocalizedString("i18n.transfers.Cancel"), accessibilityConfig);
      CommonUtilities.setText(this.view.btnAddEmailIdAdd, kony.i18n.getLocalizedString("i18n.ProfileManagement.ADD"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblPrimaryNumberexists, kony.i18n.getLocalizedString("i18n.profile.anotherEmail"), accessibilityConfig);
      this.view.lblMarkAsPrimaryEmail.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.MarkAsPrimaryEmail");
      this.view.lblMarkAsAlertCommEmail.text = kony.i18n.getLocalizedString("i18n.alertSettings.markAlertComm");
      this.view.btnAddEmailIdAdd.accessibilityConfig = {
                                   "a11yLabel": kony.i18n.getLocalizedString("i18n.PayAPerson.AddEmail")
                               };
      this.view.btnAddEmailIdCancel.accessibilityConfig = {
                                   "a11yLabel": kony.i18n.getLocalizedString("i18n.profilemanagement.cancelEmail")
                               };
      if (this.view.lblMarkAsPrimaryEmailCheckBox.text === ViewConstants.FONT_ICONS.CHECBOX_SELECTED) {
                this.view.lblMarkAsPrimaryEmailCheckBox.accessibilityConfig = {
                    "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.AddEmailMakeThisAsPrimaryEmailChecked")
                };
            } else {
                this.view.lblMarkAsPrimaryEmailCheckBox.accessibilityConfig = {
                    "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.AddEmailMakeThisAsPrimaryEmailUnchecked")
                };
            }
      if (this.view.lblMarkAsAlertCommEmailCheckBox.text === ViewConstants.FONT_ICONS.CHECBOX_SELECTED) {
                this.view.lblMarkAsAlertCommEmailCheckBox.accessibilityConfig = {
                    "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.AddEmailMarkThisEmailForAlertCommunicationChecked")
                };
            } else {
                this.view.lblMarkAsAlertCommEmailCheckBox.accessibilityConfig = {
                    "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.AddEmailMarkThisEmailForAlertCommunicationUnchecked")
                };
            }
      
      //CommonUtilities.setText(this.view.lblHeading, kony.i18n.getLocalizedString("i18n.ProfileManagement.Settingscapson"), accessibilityConfig);
      this.view.lblCollapseMobile.accessibilityConfig = {
        "a11yARIA": {
            "tabindex": -1
        }
      };
      this.view.flxAccountSettingsCollapseMobile.accessibilityConfig = {
        "a11yLabel": "Dropdown"
      };
      this.view.flxMarkAsPrimaryEmailCheckbox.accessibilityConfig = {
         "a11yARIA": {
             "tabindex": -1
          }
       };
       this.view.flxMarkAsAlertCommEmailCheckBox.accessibilityConfig = {
          "a11yARIA": {
              "tabindex": -1
           }
       };
       this.view.imgPrimaryNumberexists.accessibilityConfig = {
        "a11yARIA": {
            "tabindex": -1
        },
        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.AddEmailAnotherPrimaryEmailExistsInfo")
      };
     
    },  
    /**
	*  Method to set the Form Flow Actions such as button onclick events
	*/
    setFlowActions:function(){
      var scopeObj=this;
      /*this.view.tbxEmailId.onTextChange = function(){
          CommonUtilities.setText(scopeObj.view.tbxEmailId,scopeObj.view.tbxEmailId.text.trim() , CommonUtilities.getaccessibilityConfig());
          scopeObj.view.tbxEmailId.accessibilityConfig ={
                "a11yValue":scopeObj.view.tbxEmailId.text.trim()
          }
      };*/
      this.view.btnAddEmailIdAdd.onClick = function() {
              //add code to ADD new email
              kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"}).presentationController.saveEmail(this.getNewEmailData());
              // scopeObj.showEmail();
          }.bind(this);
       this.view.flxMarkAsPrimaryEmailCheckbox.onClick = function() {
              this.toggleFontCheckBox(this.view.lblMarkAsPrimaryEmailCheckBox);
         if (this.view.lblMarkAsPrimaryEmailCheckBox.text === ViewConstants.FONT_ICONS.CHECBOX_SELECTED) {
                    this.view.lblMarkAsPrimaryEmailCheckBox.accessibilityConfig = {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.AddEmailMakeThisAsPrimaryEmailChecked")
                    };
                } else {
                    this.view.lblMarkAsPrimaryEmailCheckBox.accessibilityConfig = {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.AddEmailMakeThisAsPrimaryEmailUnchecked")
                    };
                }
          }.bind(this);
       
       this.view.flxMarkAsAlertCommEmailCheckBox.onClick = function() {
              this.toggleFontCheckBox(this.view.lblMarkAsAlertCommEmailCheckBox);
         if (this.view.lblMarkAsAlertCommEmailCheckBox.text === ViewConstants.FONT_ICONS.CHECBOX_SELECTED) {
                    this.view.lblMarkAsAlertCommEmailCheckBox.accessibilityConfig = {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.AddEmailMarkThisEmailForAlertCommunicationChecked")
                    };
                } else {
                    this.view.lblMarkAsAlertCommEmailCheckBox.accessibilityConfig = {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.AddEmailMarkThisEmailForAlertCommunicationUnchecked")
                    };
                }
          }.bind(this);
       this.view.btnAddEmailIdCancel.onClick = function() {
              this.showEmail();
          }.bind(this);
      // FormControllerUtility.showProgressBar(scopeObj.view);
          if (!CommonUtilities.isCSRMode()) {
             
              this.setAddEmailValidationActions();
             
          }
      this.view.imgPrimaryNumberexists.onTextChange = function(){
              CommonUtilities.setText(scopeObj.view.tbxEmailId,scopeObj.view.tbxEmailId.text.trim() , CommonUtilities.getaccessibilityConfig());
      };
    },
       /**
       * Method to assign images when checkbox is clicked
       * @param {String} imgCheckBox- ID of the checkbox
       */
      toggleCheckBox: function(imgCheckBox) {
          if (imgCheckBox.src === ViewConstants.IMAGES.UNCHECKED_IMAGE) {
              imgCheckBox.src = ViewConstants.IMAGES.CHECKED_IMAGE;
          } else {
              imgCheckBox.src = ViewConstants.IMAGES.UNCHECKED_IMAGE;
          }
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
     /**
       * Method to show data related to New Email scenario
       */
      getNewEmailData: function() {
          return {
              value: this.view.tbxEmailId.text,
              isPrimary: this.view.lblMarkAsPrimaryEmailCheckBox.text === ViewConstants.FONT_ICONS.CHECBOX_SELECTED,
              isAlertsRequired: this.view.lblMarkAsAlertCommEmailCheckBox.text  === ViewConstants.FONT_ICONS.CHECBOX_SELECTED
          };
      },
     /**
       * Method to reset the fields while adding email
       */
      resetAddEmailForm: function() {
          this.view.tbxEmailId.text = "";
          this.view.lblMarkAsPrimaryEmailCheckBox.skin = ViewConstants.SKINS.CHECKBOX_UNSELECTED_SKIN;
        CommonUtilities.setText(this.view.lblMarkAsPrimaryEmailCheckBox, ViewConstants.FONT_ICONS.CHECBOX_UNSELECTED , CommonUtilities.getaccessibilityConfig());
        
        this.view.lblMarkAsAlertCommEmailCheckBox.skin = ViewConstants.SKINS.CHECKBOX_UNSELECTED_SKIN;
        CommonUtilities.setText(this.view.lblMarkAsAlertCommEmailCheckBox, ViewConstants.FONT_ICONS.CHECBOX_UNSELECTED , CommonUtilities.getaccessibilityConfig());
          this.view.flxErrorAddNewEmail.setVisibility(false);
          this.disableButton(this.view.btnAddEmailIdAdd);
        //show /hide alert communication option
          this.view.flxAlertCommAddEmail.setVisibility(kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"}).presentationController.getenableSeparateContact());
        
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
      /**
     /**
       * Method used to show the email view.
       */
      showEmail: function() {
         		  kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"}).presentationController.showUserEmail();
      },
      /**
       * Method to update the list of emails
       * @param {Object} emailListViewModel- list of emails
       */
      updateEmailList: function(emailListViewModel) {
       //   this.view.customheader.customhamburger.activateMenu("Settings", "Profile Settings");
          this.showEmail();
          if (emailListViewModel.length >= 3 || !applicationManager.getConfigurationManager().checkUserPermission("PROFILE_SETTINGS_UPDATE")) {
              this.view.btnAddNewEmail.setVisibility(false);
          //    this.view.settings.btnEditAddNewEmail.setVisibility(false);
          } else {
              this.view.btnAddNewEmail.setVisibility(true);
       //       this.view.settings.btnEditAddNewEmail.setVisibility(true);
       //       this.view.settings.btnAddNewPersonalEmail.setVisibility(true);
          }
          
          this.setEmailSegmentData(emailListViewModel);
         // this.setSelectedSkin("flxEmail");
      },
       editPrimaryEmail: function(emailObj) {
             applicationManager.getNavigationManager().navigateTo('frmProfileEditEmail');
          var viewProperties = {
           emailObj:emailObj
        };
        applicationManager.getNavigationManager().updateForm(viewProperties, "frmProfileEditEmail");
    
     
       },
     editEmail: function(emailObj) {
             applicationManager.getNavigationManager().navigateTo('frmProfileEditEmail');
          var viewProperties = {
           editemailObj:emailObj
        };
        applicationManager.getNavigationManager().updateForm(viewProperties, "frmProfileEditEmail");
    
     
       },
       showEmailError: function(errorMessage) {
        this.view.flxProfileError.setVisibility(true);
      CommonUtilities.setText(this.view.rtxError, errorMessage.errorMessage , CommonUtilities.getaccessibilityConfig());
    }
  };
});