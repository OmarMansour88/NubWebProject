define(['CommonUtilities', 'CSRAssistUI', 'FormControllerUtility', 'OLBConstants', 'ViewConstants', 'CampaignUtility'], function(CommonUtilities, CSRAssistUI, FormControllerUtility, OLBConstants, ViewConstants, CampaignUtility) {
    var orientationHandler = new OrientationHandler();
    var responsiveUtils = new ResponsiveUtils();
    return {
        enableSeparateAddress: false,
        /**
         * Init Method 
         */
        init: function() {
            this.view.preShow = this.preShow;
            this.view.postShow = this.postShowProfile;
            //CommonUtilities.setText(this.view.btnAddNewAddressMobile, kony.i18n.getLocalizedString("i18n.ProfileManagement.AddNewAddress"), CommonUtilities.getaccessibilityConfig());
            //CommonUtilities.setText(this.view.btnAddNewPersonalAddressMobile, kony.i18n.getLocalizedString("i18n.ProfileManagement.AddNewAddress"), CommonUtilities.getaccessibilityConfig());
           this.setFlowActions();
          
        },
        setFlowActions : function(){
           var scopeObj = this;
           this.view.addressInfo.flxCross.onClick = function() {
                scopeObj.view.addressInfo.isVisible = false;
            }
            this.view.onDeviceBack = function() {};
            this.view.onBreakpointChange = function() {
                scopeObj.onBreakpointChange(kony.application.getCurrentBreakpoint());
            }
            /*this.view.tbxAddressLine1.onTextChange = function(){
         //    CommonUtilities.setText(scopeObj.view.tbxAddressLine1,scopeObj.view.tbxAddressLine1.text.trim() , CommonUtilities.getaccessibilityConfig());
             scopeObj.view.tbxAddressLine1.accessibilityConfig ={
                  "a11yValue":scopeObj.view.tbxAddressLine1.text.trim()
              }
            };
            this.view.tbxAddressLine2.onTextChange = function(){
           //     CommonUtilities.setText(scopeObj.view.tbxAddressLine2,scopeObj.view.tbxAddressLine2.text.trim() , CommonUtilities.getaccessibilityConfig());
                scopeObj.view.tbxAddressLine2.accessibilityConfig ={
                    "a11yValue":scopeObj.view.tbxAddressLine2.text.trim()
                }
            };
            this.view.tbxCityName.onTextChange = function(){
         //     CommonUtilities.setText(scopeObj.view.tbxCityName,scopeObj.view.tbxCityName.text.trim() , CommonUtilities.getaccessibilityConfig());
             scopeObj.view.tbxCityName.accessibilityConfig ={
                "a11yValue":scopeObj.view.tbxCityName.text.trim()
            }
            };
            this.view.tbxZipcode.onTextChange = function(){
           //   CommonUtilities.setText(scopeObj.view.tbxZipcode,scopeObj.view.tbxZipcode.text.trim() , CommonUtilities.getaccessibilityConfig());
             scopeObj.view.tbxZipcode.accessibilityConfig ={
                "a11yValue":scopeObj.view.tbxZipcode.text.trim()
            }
            };*/
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
                CommonUtilities.setText(this.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.ProfileManagement.profilesettings"), accessibilityConfig);
            }
            this.view.forceLayout();
        },
        /**
         *  Method to set the Accessibility configurations
         */
        setAccessibility: function() {
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            this.view.btnAddNewAddressAdd.toolTip = kony.i18n.getLocalizedString("i18n.ProfileManagement.ADD");
            this.view.btnAddNewAddressCancel.toolTip = kony.i18n.getLocalizedString("i18n.transfers.Cancel");
            //CommonUtilities.setText(this.view.btnAddNewAddress, kony.i18n.getLocalizedString("i18n.ProfileManagement.AddNewAddress"), accessibilityConfig);
            //CommonUtilities.setText(this.view.lblAddressHeading, kony.i18n.getLocalizedString("i18n.ProfileManagement.Address"), accessibilityConfig);
            CommonUtilities.setText(this.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.ProfileManagement.profilesettings"), accessibilityConfig);
            //CommonUtilities.setText(this.view.lblAddNewAddressHeader, kony.i18n.getLocalizedString("i18n.ProfileManagement.AddNewAddress"), accessibilityConfig);
            CommonUtilities.setText(this.view.btnAddNewAddressAdd, kony.i18n.getLocalizedString("i18n.ProfileManagement.ADD"), accessibilityConfig);
            CommonUtilities.setText(this.view.btnAddNewAddressCancel, kony.i18n.getLocalizedString("i18n.transfers.Cancel"), accessibilityConfig);
            this.view.btnAddNewAddressAdd.accessibilityConfig = {
                                   "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.AddNewAddress")
                               };
            this.view.btnAddNewAddressCancel.accessibilityConfig = {
                                   "a11yLabel": kony.i18n.getLocalizedString("i18n.profilemanagement.cancelAddress")
                               };
            this.view.lblSetAsPreferred.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.SetAsPreferredCommunicationAddress");
            this.view.tbxAddressLine1.accessibilityConfig = {
                "a11yLabel": kony.i18n.getLocalizedString("i18n.WireTransfer.AddressLine1")
            };
            this.view.tbxAddressLine2.accessibilityConfig = {
                "a11yLabel": kony.i18n.getLocalizedString("i18n.WireTransfer.AddressLine2")
            };
            this.view.lbxCountry.accessibilityConfig = {
                "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.selectCountry")
            }
            this.view.lbxState.accessibilityConfig = {
                "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.selectState")
            }
            this.view.tbxCityName.accessibilityConfig = {
                "a11yLabel": kony.i18n.getLocalizedString("i18n.WireTransfer.CityName")
            };
            this.view.tbxZipcode.accessibilityConfig = {
                "a11yLabel": kony.i18n.getLocalizedString("i18n.common.zipcode")
            };
            /*this.view.lblSetAsPreferredCheckBox.accessibilityConfig = {
                "a11yLabel": kony.i18n.getLocalizedString("i18n.settings.accessibility.checkbox")
            };*/
            this.view.imgInfo.accessibilityConfig = {
                "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.AddAddressAnotherPrimaryAddressExistsInfo")
            };
            /*this.view.lblInfoTxt.accessibilityConfig = {
                "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.AddAnotherPrimaryAddress")
            };*/
            this.view.imgErrorAddAddress.accessibilityConfig = {
                "a11yLabel": kony.i18n.getLocalizedString("i18n.settings.accessibility.error")
            };
            this.view.lblCollapseMobile.accessibilityConfig = {
                "a11yARIA": {
                   "tabindex": -1
                 }
            };
            this.view.flxAccountSettingsCollapseMobile.accessibilityConfig = {
                "a11yLabel": "Dropdown"
            };
            this.view.flxSetAsPreferredCheckBox.accessibilityConfig = {
                "a11yARIA": {
                    "tabindex": -1
                }
            };
        },
        updateFormUI: function(viewModel) {
            if (viewModel !== undefined) {
                if (viewModel.isLoading !== undefined) this.changeProgressBarState(viewModel.isLoading);
                if (viewModel.campaign) {
                    CampaignUtility.showCampaign(viewModel.campaign, this.view, "flxContainer");
                }
                if (viewModel.addNewAddress) this.showAddNewAddressForm(viewModel.addNewAddress);
                if (viewModel.addressList === null) {
                    viewModel.addressList = [];
                    FormControllerUtility.hideProgressBar(this.view);
                }
                if (viewModel.addressList) this.updateAddressList(viewModel.addressList);
            }
            this.view.forceLayout();
        },
        preShow: function() {
            var self = this;
            applicationManager.getLoggerManager().setCustomMetrics(this, false, "Profile");
            this.view.flxAccountSettingsCollapseMobile.onClick = this.toggleMenuMobile;
            FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxHeader', 'flxFooter', 'flxMain', 'flxContainer']);
            this.view.lblCollapseMobile.text = "O";
            this.view.flxRight.setVisibility(true);
            this.view.profileMenu.checkLanguage();
            this.view.profileMenu.activateMenu("PROFILESETTINGS", "Address");
            this.view.customheadernew.activateMenu("Settings", "Profile Settings");
            this.setSelectedValue("i18n.ProfileManagement.Address");
            this.view.addressInfo.isVisible = false;
            this.view.flxProfileError.setVisibility(false);
			var currBreakpoint = kony.application.getCurrentBreakpoint();
            if (currBreakpoint === 640 || orientationHandler.isMobile) {
                this.view.flxMain.height = "830dp";
               }
            var scopeObj = this;
            this.view.btnAddNewAddressCancel.onClick = function() {
                scopeObj.showAddresses();
            };
            this.view.btnAddNewAddressAdd.onClick = function() {
                //write code to ADD new Address
                scopeObj.showAddresses();
            };
            this.view.flxSetAsPreferredCheckBox.onClick = function() {
                if (totalAddress != 0) {
                    scopeObj.toggleFontCheckBox(scopeObj.view.lblSetAsPreferredCheckBox);
                    if (scopeObj.view.lblSetAsPreferredCheckBox.text === ViewConstants.FONT_ICONS.CHECBOX_SELECTED) {
                        scopeObj.view.lblSetAsPreferredCheckBox.accessibilityConfig = {
                            "a11yLabel": kony.i18n.getLocalizedString("i18n.accountSettings.checked") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.SetAsPreferredCommunicationAddress")
                        };
                    } else {
                        scopeObj.view.lblSetAsPreferredCheckBox.accessibilityConfig = {
                            "a11yLabel": kony.i18n.getLocalizedString("i18n.accountSettings.unchecked") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.SetAsPreferredCommunicationAddress")
                        };
                    }
                }
            };
            if (!CommonUtilities.isCSRMode()) {
            this.setNewAddressValidationActions();
            //this.setUpdateAddressValidationActions();
             }
            
             this.view.imgInfo.accessibilityConfig = {
            "a11yARIA": 
            {
                "tabindex" : -1
            }
        };
            this.setAccessibility();
            this.view.forceLayout();
        },
        /**
         * *@param {String} text- text that needs to be appended to the upper text in mobile breakpoint
         *  Method to set the text in mobile breakpoint
         */
        setSelectedValue: function(text) {
          var self = this;
      CommonUtilities.setText(self.view.lblAccountSettingsMobile, kony.i18n.getLocalizedString(text) , CommonUtilities.getaccessibilityConfig());
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
         * Method to hide all the flex of main body
         * @param {Object} addAddressViewModel - None
         */
        showAddNewAddressForm: function(addAddressViewModel) {
            var self = this;
            //this.hideAll();
            this.view.flxAddNewAddressWrapper.setVisibility(true);
            var currBreakpoint = kony.application.getCurrentBreakpoint();
            if (currBreakpoint === 640 || orientationHandler.isMobile) {
                this.view.flxAddressWrapper.height = "775dp";
            }
            if (addAddressViewModel.serverError) {
				if (currBreakpoint === 640 || orientationHandler.isMobile) {
                  this.view.flxMain.height = "930dp";
                }
                this.view.flxProfileError.setVisibility(true);
                CommonUtilities.setText(this.view.rtxError, addAddressViewModel.serverError.errorMessage, CommonUtilities.getaccessibilityConfig());
            } else {
                this.view.flxErrorAddAddress.setVisibility(false);
              if(addAddressViewModel.addressTypes.length>0){
                this.view.lbxType.masterData = addAddressViewModel.addressTypes;
                this.view.lbxType.selectedKey = addAddressViewModel.addressTypeSelected;
              }
                this.view.tbxAddressLine1.text = addAddressViewModel.addressLine1;
                this.view.tbxAddressLine2.text = addAddressViewModel.addressLine2;
                this.view.lbxCountry.masterData = addAddressViewModel.countryNew;
                this.view.lbxCountry.selectedKey = addAddressViewModel.countrySelected;
                this.view.lbxState.masterData = addAddressViewModel.stateNew;
                this.view.lbxState.selectedKey = addAddressViewModel.stateSelected;
                this.view.tbxCityName.text = addAddressViewModel.city;
                this.view.tbxZipcode.text = addAddressViewModel.zipcode;
                this.view.lblSetAsPreferredCheckBox.skin = addAddressViewModel.isPreferredAddress ? ViewConstants.SKINS.CHECKBOX_SELECTED_SKIN : ViewConstants.SKINS.CHECKBOX_UNSELECTED_SKIN;
                self.view.lbxType.accessibilityConfig = {
                    "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Address") + " " + kony.i18n.getLocalizedString("i18n.common.Type")
                };
                var countryId = self.view.lbxCountry.selectedKeyValue[0];
                if (countryId == "1") {
                    self.view.lbxState.setEnabled(false);
                }
                this.view.lbxCountry.onSelection = function() {
                    var data = [];
                    var countryId = self.view.lbxCountry.selectedKeyValue[0];
                    if (countryId == "1") {
                        self.checkNewAddressForm();
                        self.view.lbxState.masterData = addAddressViewModel.stateNew;
                        self.view.lbxState.selectedKey = addAddressViewModel.stateSelected;
                        self.view.lbxCountry.selectedKey = countryId;
                        self.view.lbxState.setEnabled(false);
                    } else {
                        self.view.lbxState.setEnabled(true);
                        self.view.lbxCountry.selectedKey = countryId;
                        data = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"}).presentationController.getSpecifiedCitiesAndStates("country", countryId, addAddressViewModel.stateNew);
                        self.view.lbxState.masterData = data.states;
                        self.view.lbxState.selectedKey = addAddressViewModel.stateSelected;
                        var stateId = self.view.lbxState.selectedKeyValue[0];
                        if (stateId == "lbl1") {
                            self.checkNewAddressForm();
                            self.view.lbxCountry.masterData = addAddressViewModel.countryNew;
                            self.view.lbxCountry.selectedKey = countryId;
                        } else {
                            self.view.lbxState.setEnabled(true);
                            self.checkNewAddressForm();
                        }
                    }
                  // CommonUtilities.setText(self.view.lbxCountry,self.view.lbxCountry.selectedKeyValue[1] , CommonUtilities.getaccessibilityConfig());
                  //CommonUtilities.setText(self.view.lbxState,self.view.lbxState.selectedKeyValue[1] , CommonUtilities.getaccessibilityConfig());
                };
                this.view.lbxState.onSelection = function() {
                    var stateId = self.view.lbxState.selectedKeyValue[0];
                    self.checkNewAddressForm();
                  //CommonUtilities.setText(self.view.lbxState,self.view.lbxState.selectedKeyValue[1] , CommonUtilities.getaccessibilityConfig());
                };
                if (totalAddress == 0) {
                    this.view.lblSetAsPreferredCheckBox.skin = addAddressViewModel.isPreferredAddress ? ViewConstants.SKINS.CHECKBOX_SELECTED_SKIN : ViewConstants.SKINS.CHECKBOX_SELECTED_SKIN;
                    CommonUtilities.setText(this.view.lblSetAsPreferredCheckBox, addAddressViewModel.isPreferredAddress ? ViewConstants.FONT_ICONS.CHECBOX_SELECTED : ViewConstants.FONT_ICONS.CHECBOX_SELECTED, CommonUtilities.getaccessibilityConfig());
                    this.view.lblSetAsPreferredCheckBox.accessibilityConfig = {
                        "a11yLabel":  kony.i18n.getLocalizedString("i18n.accountSettings.checked") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.SetAsPreferredCommunicationAddress")
                    };

                } else {
                    CommonUtilities.setText(this.view.lblSetAsPreferredCheckBox, addAddressViewModel.isPreferredAddress ? ViewConstants.FONT_ICONS.CHECBOX_SELECTED : ViewConstants.FONT_ICONS.CHECBOX_UNSELECTED, CommonUtilities.getaccessibilityConfig());
                    if (addAddressViewModel.isPreferredAddress) {
                        this.view.lblSetAsPreferredCheckBox.accessibilityConfig = {
                            "a11yLabel": kony.i18n.getLocalizedString("i18n.accountSettings.checked") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.SetAsPreferredCommunicationAddress")
                        };
                    }
                    else {
                        this.view.lblSetAsPreferredCheckBox.accessibilityConfig = {
                            "a11yLabel":  kony.i18n.getLocalizedString("i18n.accountSettings.unchecked") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.SetAsPreferredCommunicationAddress")

                        };
                    }
                }
                this.checkNewAddressForm();
                this.view.btnAddNewAddressAdd.onClick = function() {
                    kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"}).presentationController.saveAddress(this.getNewAddressFormData());
                }.bind(this);
                this.view.btnAddNewAddressCancel.onClick = function() {
                    applicationManager.getNavigationManager().navigateTo("frmAddressSettings");
                };
            }
        },
        /**
         * Method to show data related to New Address scenario
         * @param {Object} - which sets the data
         */
        getNewAddressFormData: function() {
            var addrLine1 = (this.view.tbxAddressLine1.text) ? this.view.tbxAddressLine1.text.trim() : "";
            var addrLine2 = (this.view.tbxAddressLine2.text) ? this.view.tbxAddressLine2.text.trim() : "";
            var countrySelected = this.view.lbxCountry.selectedKey;
            var stateSelected = (this.view.lbxState.selectedKey !== 'lbl1') ? this.view.lbxState.selectedKey : "";
            var citySelected = (this.view.tbxCityName.text) ? this.view.tbxCityName.text.trim() : "";
            var zipcode = (this.view.tbxZipcode.text) ? this.view.tbxZipcode.text.trim() : "";
            var Addr_type = (this.view.lbxType.selectedKey) ? this.view.lbxType.selectedKey : "";
            return {
                addrLine1: addrLine1,
                addrLine2: addrLine2,
                countrySelected:countrySelected, // this.view.lbxCountry.selectedKey,
                zipcode:zipcode,
                isPreferredAddress: this.view.lblSetAsPreferredCheckBox.text === ViewConstants.FONT_ICONS.CHECBOX_SELECTED,
                Addr_type: Addr_type,
                stateSelected:stateSelected, //this.view.lbxState.selectedKey,
                citySelected: citySelected //.selectedKey
            };
        },
        /**
         * Method to validate the address entered
         */
        checkNewAddressForm: function() {
            var addAddressFormData = this.getNewAddressFormData();
			var re = /[+=\\\\|<>^*%$&@#(){}[\]!`";:?]/i ;
            if (addAddressFormData.addrLine1 === '') {
                this.disableButton(this.view.btnAddNewAddressAdd);
           // } else if (addAddressFormData.zipcode === '') {
		   }
		   else if((re.test(addAddressFormData[0].addrLine1))){
                this.disableButton(this.view.btnAddNewAddressAdd);
            }
            else if(addAddressFormData[0].addrLine2 && (re.test(addAddressFormData[0].addrLine2))){
                this.disableButton(this.view.btnAddNewAddressAdd);
            }else if (!this.isValid(addAddressFormData[0].zipcode)) {
                this.disableButton(this.view.btnAddNewAddressAdd);
            } else if (addAddressFormData.city === '') {
                this.disableButton(this.view.btnAddNewAddressAdd);
            } else if (addAddressFormData.countrySelected === "1") {
                this.disableButton(this.view.btnAddNewAddressAdd);
            }
            else if (addAddressFormData.citySelected === "") {
                this.disableButton(this.view.btnAddNewAddressAdd);
            } else {
                this.enableButton(this.view.btnAddNewAddressAdd);
            }
        },
        /**
         *  Method to set ui for the component in mobile breakpoint
         */
        toggleMenuMobile: function() {
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
        changeProgressBarState: function(isLoading) {
            if (isLoading) {
                FormControllerUtility.showProgressBar(this.view);
            } else {
                FormControllerUtility.hideProgressBar(this.view);
            }
        },
        postShowProfile: function() {
            this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight - this.view.flxHeader.frame.height - this.view.flxFooter.frame.height + "dp";
            applicationManager.getNavigationManager().applyUpdates(this);
            this.view.forceLayout();
        },
        /**
         * Method to Enable a button
         * @param {String} button - ID of the button to be enabled
         */
        enableButton: function(button) {
            if (!CommonUtilities.isCSRMode()) {
                button.setEnabled(true);
                button.skin = "sknbtnSSPffffff15px0273e3bg";
                button.hoverSkin = "sknBtnFocusSSPFFFFFF15Px0273e3";
                button.focusSkin = "sknBtnHoverSSPFFFFFF15Px0273e3";
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
        hideAll: function() {
            this.view.flxAddressesWrapper.setVisibility(false);
            this.view.flxAddNewAddressWrapper.setVisibility(false);
        },
        /**
         * Method to assign validation action on the address fields
         */
        setNewAddressValidationActions: function() {
            this.disableButton(this.view.btnAddNewAddressAdd);
            this.view.tbxAddressLine1.onKeyUp = this.checkNewAddressForm.bind(this);
            this.view.tbxAddressLine2.onKeyUp = this.checkNewAddressForm.bind(this);
            this.view.tbxZipcode.onKeyUp = this.checkNewAddressForm.bind(this);
            this.view.tbxCityName.onKeyUp = this.checkNewAddressForm.bind(this);
        },
        showAddresses: function() {
            //this.hideAll();
            this.view.flxAddNewAddressWrapper.setVisibility(true);
            var currBreakpoint = kony.application.getCurrentBreakpoint();
            if (currBreakpoint === 640 || orientationHandler.isMobile) {
                this.view.flxAddNewAddressWrapper.height = "550dp";
            }
        },

    }
});
// define("SettingsNew/frmAddNewAddressControllerActions", {
//     /*
//       This is an auto generated file and any modifications to it may result in corruption of the action sequence.
//     */
//     /** init defined for frmAddNewAddress **/
//     AS_Form_bc82211e950c4e2f9b26f9a5d884c4e8: function AS_Form_bc82211e950c4e2f9b26f9a5d884c4e8(eventobject) {
//         var self = this;
//         return self.init.call(this);
//     }
// });
// define("SettingsNew/frmAddNewAddressController", ["SettingsNew/userfrmAddNewAddressController", "SettingsNew/frmAddNewAddressControllerActions"], function() {
//     var controller = require("SettingsNew/userfrmAddNewAddressController");
//     var controllerActions = ["SettingsNew/frmAddNewAddressControllerActions"];
//     return kony.visualizer.mixinControllerActions(controller, controllerActions);
// });
