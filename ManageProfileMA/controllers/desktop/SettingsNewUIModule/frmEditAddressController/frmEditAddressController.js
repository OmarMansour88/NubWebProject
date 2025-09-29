define(['CommonUtilities', 'CSRAssistUI', 'FormControllerUtility', 'OLBConstants', 'ViewConstants', 'CampaignUtility'], function (CommonUtilities, CSRAssistUI, FormControllerUtility, OLBConstants, ViewConstants, CampaignUtility) {  
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
               /*this.view.tbxEditAddressLine1.onTextChange = function(){
               //CommonUtilities.setText(scopeObj.view.tbxEditAddressLine1,scopeObj.view.tbxEditAddressLine1.text.trim() , CommonUtilities.getaccessibilityConfig());
                scopeObj.view.tbxEditAddressLine1.accessibilityConfig ={
                    "a11yValue":scopeObj.view.tbxEditAddressLine1.text.trim()
                }
              }; 
            this.view.tbxEditAddressLine2.onTextChange = function(){
                //CommonUtilities.setText(scopeObj.view.tbxEditAddressLine2,scopeObj.view.tbxEditAddressLine2.text.trim() , CommonUtilities.getaccessibilityConfig());
                scopeObj.view.tbxEditAddressLine2.accessibilityConfig ={
                      "a11yValue":scopeObj.view.tbxEditAddressLine2.text.trim()
                }
              }; 
            this.view.tbxEditCountry.onTextChange = function(){
                CommonUtilities.setText(scopeObj.view.tbxEditCountry,scopeObj.view.tbxEditCountry.text.trim() , CommonUtilities.getaccessibilityConfig());
                  scopeObj.view.tbxEditState.accessibilityConfig ={
                "a11yValue":scopeObj.view.tbxEditState.selectedKeyValue[1]
              };   
            }; */
            this.view.tbxEditState.onTextChange = function(){
              CommonUtilities.setText(scopeObj.view.tbxEditState,scopeObj.view.tbxEditState.text.trim() , CommonUtilities.getaccessibilityConfig());
              
            }; 
             /*this.view.tbxEdtCity.onTextChange = function(){
                //CommonUtilities.setText(scopeObj.view.tbxEdtCity,scopeObj.view.tbxEdtCity.text.trim() , CommonUtilities.getaccessibilityConfig());
                scopeObj.view.tbxEdtCity.accessibilityConfig ={
                  "a11yValue":scopeObj.view.tbxEdtCity.text.trim()
                }
              };
             this.view.tbxEditZipcode.onTextChange = function(){
               //CommonUtilities.setText(scopeObj.view.tbxEditZipcode,scopeObj.view.tbxEditZipcode.text.trim() , CommonUtilities.getaccessibilityConfig());
                scopeObj.view.tbxEditZipcode.accessibilityConfig ={
                  "a11yValue":scopeObj.view.tbxEditZipcode.text.trim()
                }
              };*/
              this.view.tbxEditCity.onSelection = function(){
                 CommonUtilities.setText(scopeObj.view.tbxEditCity,scopeObj.view.tbxEditCity.selectedKeyValue[1] , CommonUtilities.getaccessibilityConfig());
              };
            /*this.view.lbxEditType.onSelection = function(){
                  //CommonUtilities.setText(scopeObj.view.lbxEditType, scopeObj.view.lbxEditType.selectedKeyValue[1], CommonUtilities.getaccessibilityConfig());
                  scopeObj.view.lbxEditType.accessibilityConfig = {
                      "a11yValue" : kony.i18n.getLocalizedString("i18n.ProfileManagement.Address") +" "+ kony.i18n.getLocalizedString("i18n.common.Type") + " " + scopeObj.view.lbxEditType.selectedKeyValue[1]
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
              this.view.btnEditAddressSave.toolTip = kony.i18n.getLocalizedString("i18n.ProfileManagement.Save");
              this.view.btnEditAddressCancel.toolTip = kony.i18n.getLocalizedString("i18n.transfers.Cancel");
              //CommonUtilities.setText(this.view.lblAddressHeading, kony.i18n.getLocalizedString("i18n.ProfileManagement.Address"), accessibilityConfig);
              //CommonUtilities.setText(this.view.lblSetAsPreferred, kony.i18n.getLocalizedString("i18n.ProfileManagement.SetAsPreferredCommunicationAddress"), accessibilityConfig);
              CommonUtilities.setText(this.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.ProfileManagement.profilesettings"), accessibilityConfig);
             // CommonUtilities.setText(this.view.lblEditAddressHeader, kony.i18n.getLocalizedString("i18n.ProfileManagement.editAddress"), accessibilityConfig);
              CommonUtilities.setText(this.view.btnEditAddressSave, kony.i18n.getLocalizedString("i18n.ProfileManagement.Save"), accessibilityConfig);
              CommonUtilities.setText(this.view.btnEditAddressCancel, kony.i18n.getLocalizedString("i18n.transfers.Cancel"), accessibilityConfig);
              this.view.btnEditAddressSave.accessibilityConfig = {
                                     "a11yLabel": kony.i18n.getLocalizedString("i18n.profilemanagement.saveAddress")
                                 };
              this.view.btnEditAddressCancel.accessibilityConfig = {
                                     "a11yLabel": kony.i18n.getLocalizedString("i18n.profilemanagement.cancelAddress")
                                 };
             this.view.lbxEditType.accessibilityConfig = {
                  "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Address") + " " + kony.i18n.getLocalizedString("i18n.common.Type")
              };
              this.view.tbxEditAddressLine1.accessibilityConfig = {
                  "a11yLabel": kony.i18n.getLocalizedString("i18n.WireTransfer.AddressLine1")
              };
              this.view.tbxEditAddressLine2.accessibilityConfig = {
                  "a11yLabel": kony.i18n.getLocalizedString("i18n.WireTransfer.AddressLine2")
              };
              this.view.imgEditInfo.accessibilityConfig = {
                  "a11yLabel": kony.i18n.getLocalizedString("i18n.WireTransfers.Information")
              };
              this.view.lblEditSetAsPreferred.accessibilityConfig = {
                  "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.SetAsPreferredCommunicationAddress")
              };
              this.view.lblEditSetAsPreferredCheckBox.accessibilityConfig = {
                  "a11yLabel": kony.i18n.getLocalizedString("i18n.settings.accessibility.checkbox")
              };
              this.view.tbxEditZipcode.accessibilityConfig = {
                  "a11yLabel": kony.i18n.getLocalizedString("i18n.common.zipcode")
              };
              this.view.tbxEdtCity.accessibilityConfig = {
                  "a11yLabel": kony.i18n.getLocalizedString("i18n.WireTransfer.CityName")
              };
              this.view.tbxEditState.accessibilityConfig = {
                  "a11yLabel": kony.i18n.getLocalizedString("i18n.common.state")
              };
              this.view.tbxEditCountry.accessibilityConfig = {
                  "a11yLabel": kony.i18n.getLocalizedString("i18n.WireTransfer.Country")
              };
              /*this.view.lblErrorEditAddress.accessibilityConfig = {
                  "a11yLabel": kony.i18n.getLocalizedString("i18n.settings.accessibility.error")
              };
              this.view.lblEditInfoTxt.accessibilityConfig = {
                  "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.AddAnotherPrimaryAddress")
              };*/
              this.view.lblCollapseMobile.accessibilityConfig = {
                   "a11yARIA": {
                       "tabindex": -1
                    }
              };
              this.view.flxAccountSettingsCollapseMobile.accessibilityConfig = {
                    "a11yLabel": "Dropdown"
              };
              this.view.flxEditSetAsPreferredCheckBox.accessibilityConfig = {
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
                  if (viewModel.editAddress) this.showEditAddressForm(viewModel.editAddress);
                  if (viewModel.addressList === null) {
                      viewModel.addressList = [];
                      FormControllerUtility.hideProgressBar(this.view);
                  }
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
                  this.view.flxMain.height = "650dp";
                 }
              var scopeObj = this;
              this.setAccessibility();
              //Address flow
              
              
              this.view.flxEditSetAsPreferredCheckBox.onClick = function() {
                  scopeObj.toggleFontCheckBox(scopeObj.view.lblEditSetAsPreferredCheckBox);
              };
              if (!CommonUtilities.isCSRMode()) {
                  
                  this.setUpdateAddressValidationActions();
              }
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
           * Method to hide all the flex of main body
           * @param {Object} editAddressViewModel - None
           */
          showEditAddressForm: function(editAddressViewModel) {
              var self = this;
            var scopeObj = this;
              //this.hideAll();
              this.view.flxEditAddressWrapper.setVisibility(true);
              var currBreakpoint = kony.application.getCurrentBreakpoint();
              if (currBreakpoint === 640 || orientationHandler.isMobile) {
                  this.view.flxAddressWrapper.height = "593dp";
              }
              if (editAddressViewModel.serverError) {
                 if (currBreakpoint === 640 || orientationHandler.isMobile) {
                  this.view.flxMain.height = "750dp";
                 }
                 this.view.flxProfileError.setVisibility(true);
                  CommonUtilities.setText(this.view.rtxError, editAddressViewModel.serverError.errorMessage, CommonUtilities.getaccessibilityConfig());
              } else {
              this.view.lbxEditType.masterData = editAddressViewModel.addressTypes || "";
              if (editAddressViewModel.addressTypeSelected) this.view.lbxEditType.selectedKey = editAddressViewModel.addressTypeSelected;
              this.view.tbxEditAddressLine1.text = editAddressViewModel.addressLine1 || "";
              this.view.tbxEditAddressLine2.text = editAddressViewModel.addressLine2 || "";
              self.view.tbxEdtCity.text = (editAddressViewModel.city) ? editAddressViewModel.city : editAddressViewModel.citySelected || "";
              this.view.lbxEditCountry.masterData = editAddressViewModel.countryNew;
              var country = (editAddressViewModel.countrySelected) ? editAddressViewModel.countrySelected : (editAddressViewModel.CountryCode) ? (editAddressViewModel.CountryCode) : editAddressViewModel.countryNew[0][0];
              if(country.length!==2){
                country = "1";
              }
              this.view.lbxEditCountry.selectedKey = country;
              //this.view.lbxEditState.selectedKey = editAddressViewModel.stateSelected;
              if (country!=="1"){
                data = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"}).presentationController.getSpecifiedCitiesAndStates("country", editAddressViewModel.countrySelected, editAddressViewModel.stateNew);
              self.view.lbxEditState.masterData = (editAddressViewModel.countrySelected) ? data.states : editAddressViewModel.stateNew;
              self.view.lbxEditState.selectedKey = (editAddressViewModel.stateSelected) ? editAddressViewModel.stateSelected : editAddressViewModel.stateNew[0][0];
              } else{
                self.view.lbxEditState.setEnabled(false);
                self.view.lbxEditState.masterData = editAddressViewModel.stateNew;
                self.view.lbxEditState.selectedKey = editAddressViewModel.stateNew[0][0];
              }
                this.view.lbxEditCountry.onSelection = function() {
                  var data = [];
                  var countryId = self.view.lbxEditCountry.selectedKeyValue[0];
                  if (countryId == "1") {
                      self.checkUpdateAddressForm();
                      self.view.lbxEditState.masterData = editAddressViewModel.stateNew;
                      self.view.lbxEditState.selectedKey = editAddressViewModel.stateNew[0][0];
                      self.view.lbxEditState.setEnabled(false);
                      //self.disableButton(self.view.btnEditAddressSave);
                  } else {
                      self.checkUpdateAddressForm();
                      self.view.lbxEditState.setEnabled(true);
                      //self.disableButton(self.view.btnEditAddressSave);
                      data = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"}).presentationController.getSpecifiedCitiesAndStates("country", countryId, editAddressViewModel.stateNew);
                      self.view.lbxEditState.masterData = data.states;
                      self.view.lbxEditState.selectedKey = data.states[0][0];
                  }
                  //CommonUtilities.setText(scopeObj.view.lbxEditCountry,scopeObj.view.lbxEditCountry.selectedKeyValue[1] , CommonUtilities.getaccessibilityConfig());
                   self.view.lbxEditCountry.accessibilityConfig = {
                      "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.selectCountry")
                    }
                  //CommonUtilities.setText(scopeObj.view.lbxEditState, scopeObj.view.lbxEditState.selectedKeyValue[1], CommonUtilities.getaccessibilityConfig());                
                  /*self.view.lbxEditState.accessibilityConfig = {
                  "a11yValue" : kony.i18n.getLocalizedString("i18n.ProfileManagement.selectState") +" "+ scopeObj.view.lbxEditState.selectedKeyValue[1]
                  }*/
                };
              this.view.lbxEditState.onSelection = function() {
                  var data = [];
                  var stateId = self.view.lbxEditState.selectedKeyValue[0];
                  self.checkUpdateAddressForm();
                  //CommonUtilities.setText(scopeObj.view.lbxEditState,scopeObj.view.lbxEditState.selectedKeyValue[1] , CommonUtilities.getaccessibilityConfig());
              };
              //self.view.tbxEditCountry.text = editAddressViewModel.country || "";
              //self.view.tbxEditState.text = editAddressViewModel.state || "";
              self.view.tbxEdtCity.text = (editAddressViewModel.city)? editAddressViewModel.city : (editAddressViewModel.citySelected)? editAddressViewModel.citySelected : "";
              this.view.tbxEditZipcode.text = editAddressViewModel.zipcode || "";
              this.view.lblEditSetAsPreferredCheckBox.skin = editAddressViewModel.isPreferredAddress ? ViewConstants.SKINS.CHECKBOX_SELECTED_SKIN : ViewConstants.SKINS.CHECKBOX_UNSELECTED_SKIN;
              CommonUtilities.setText(this.view.lblEditSetAsPreferredCheckBox, editAddressViewModel.isPreferredAddress ? ViewConstants.FONT_ICONS.CHECBOX_SELECTED : ViewConstants.FONT_ICONS.CHECBOX_UNSELECTED, CommonUtilities.getaccessibilityConfig());
              //this.view.flxEditSetAsPreferred.setVisibility(!editAddressViewModel.isPreferredAddress);
              this.checkUpdateAddressForm();
              if (CommonUtilities.isCSRMode()) {
                  this.view.btnEditAddressSave.onClick = CommonUtilities.disableButtonActionForCSRMode();
                  this.view.btnEditAddressSave.skin = CommonUtilities.disableButtonSkinForCSRMode();
              } else {
                  this.view.btnEditAddressSave.onClick = function() {
                      FormControllerUtility.showProgressBar(self.view);
                      var data = this.getUpdateAddressData();
                      data.addressId = editAddressViewModel.addressId;
                      kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"}).presentationController.updateAddress(data);
                  }.bind(this);
                  this.view.btnEditAddressCancel.onClick = function() {
                   //   applicationManager.getNavigationManager().navigateTo("frmAddressSettings");
                      kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"}).presentationController.showUserAddresses();
                  };
              }
                  /*scopeObj.view.tbxEditAddressLine1.accessibilityConfig ={
                    "a11yValue":scopeObj.view.tbxEditAddressLine1.text.trim()
                  };
                  scopeObj.view.tbxEditAddressLine2.accessibilityConfig ={
                    "a11yValue":scopeObj.view.tbxEditAddressLine2.text.trim()
                  };
                  scopeObj.view.tbxEdtCity.accessibilityConfig ={
                    "a11yValue":scopeObj.view.tbxEdtCity.text.trim()
                  };
                  scopeObj.view.tbxEditZipcode.accessibilityConfig ={
                    "a11yValue":scopeObj.view.tbxEditZipcode.text.trim()
                  };*/
                //CommonUtilities.setText(scopeObj.view.tbxEditAddressLine1,scopeObj.view.tbxEditAddressLine1.text.trim() , CommonUtilities.getaccessibilityConfig());
                  //CommonUtilities.setText(scopeObj.view.tbxEditAddressLine2,scopeObj.view.tbxEditAddressLine2.text.trim() , CommonUtilities.getaccessibilityConfig());
                  CommonUtilities.setText(scopeObj.view.tbxEditCountry,scopeObj.view.tbxEditCountry.text.trim() , CommonUtilities.getaccessibilityConfig());
                  CommonUtilities.setText(scopeObj.view.tbxEditState,scopeObj.view.tbxEditState.text.trim() , CommonUtilities.getaccessibilityConfig());
                  //CommonUtilities.setText(scopeObj.view.tbxEdtCity,scopeObj.view.tbxEdtCity.text.trim() , CommonUtilities.getaccessibilityConfig());
                  //CommonUtilities.setText(scopeObj.view.tbxEditZipcode,scopeObj.view.tbxEditZipcode.text.trim() , CommonUtilities.getaccessibilityConfig());
                  CommonUtilities.setText(scopeObj.view.tbxEditCity,scopeObj.view.tbxEditCity.selectedKeyValue[1] , CommonUtilities.getaccessibilityConfig());
                  CommonUtilities.setText(scopeObj.view.lbxEditState,scopeObj.view.lbxEditState.selectedKeyValue[1] , CommonUtilities.getaccessibilityConfig());
                  CommonUtilities.setText(scopeObj.view.lbxEditCountry,scopeObj.view.lbxEditCountry.selectedKeyValue[1] , CommonUtilities.getaccessibilityConfig());
                 // CommonUtilities.setText(scopeObj.view.lbxEditType, scopeObj.view.lbxEditType.selectedKeyValue[1], CommonUtilities.getaccessibilityConfig());
                 /*this.view.lbxEditType.accessibilityConfig = {
                  "a11yValue" : kony.i18n.getLocalizedString("i18n.ProfileManagement.Address") +" "+ kony.i18n.getLocalizedString("i18n.common.Type") + " " + scopeObj.view.lbxEditType.selectedKeyValue[1]
                  }*/
              this.view.forceLayout();
                }
            
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
          
          
          /**
           * Method to show data after updating the New Address scenario
           */
          getUpdateAddressData: function() {
              var addrLine1 = (this.view.tbxEditAddressLine1.text) ? this.view.tbxEditAddressLine1.text.trim() : "";
              var addrLine2 = (this.view.tbxEditAddressLine2.text) ? this.view.tbxEditAddressLine2.text.trim() : "";
              var Country_id = this.view.lbxEditCountry.selectedKey;
              var Region_id = (this.view.lbxEditState.selectedKey !== 'lbl1') ? this.view.lbxEditState.selectedKey : "";
              var City_id = (this.view.tbxEdtCity.text) ? this.view.tbxEdtCity.text.trim() : "";
              var ZipCode = (this.view.tbxEditZipcode.text) ? this.view.tbxEditZipcode.text.trim() : "";
              var Addr_type = (this.view.lbxEditType.selectedKey) ? this.view.lbxEditType.selectedKey : "";
              return {
                  addrLine1: addrLine1,
                  addrLine2: addrLine2,
                  Country_id: Country_id,
                  countrySelected: Country_id,
                  Region_id: Region_id,
                  City_id: City_id,
                  ZipCode: ZipCode,
                  isPrimary: this.view.lblEditSetAsPreferredCheckBox.text === ViewConstants.FONT_ICONS.CHECBOX_SELECTED,
                  Addr_type: Addr_type
              };
          },
          /**
           * Method to validate the edited address
           */
          checkUpdateAddressForm: function() {
              if (!CommonUtilities.isCSRMode()) {
                  var addAddressFormData = this.getUpdateAddressData();
                  var re = /[+=\\\\|<>^*%$&@#(){}[\]!`";:?]/i;
                  if (addAddressFormData[0].addrLine1 === '') {
                      this.disableButton(this.view.btnEditAddressSave);
                  }
                  else if((re.test(addAddressFormData[0].addrLine1))){
                      this.disableButton(this.view.btnEditAddressSave);
                      }
                  else if(addAddressFormData[0].addrLine2 && (re.test(addAddressFormData[0].addrLine2))){
                      this.disableButton(this.view.btnEditAddressSave);
                  }else if (!this.isValid(addAddressFormData[0].ZipCode)) {
                      this.disableButton(this.view.btnEditAddressSave);
                  } else if (addAddressFormData[0].Country_id === '1') {
                      this.disableButton(this.view.btnEditAddressSave);
                      //} else if (addAddressFormData.Region_id === 'lbl1') {
                      //this.disableButton(this.view.btnEditAddressSave);
                  } else if (addAddressFormData[0].City_id === '') {
                      this.disableButton(this.view.btnEditAddressSave);
                  } else {
                      this.enableButton(this.view.btnEditAddressSave);
                  }
              }
          },
          /**
           * Method to assign validation action on the edit address fields
           */
          setUpdateAddressValidationActions: function() {
              //this.disableButton(this.view.btnEditAddressSave);
              this.view.tbxEditAddressLine1.onKeyUp = this.checkUpdateAddressForm.bind(this);
              this.view.tbxEditAddressLine2.onKeyUp = this.checkUpdateAddressForm.bind(this);
              this.view.tbxEditZipcode.onKeyUp = this.checkUpdateAddressForm.bind(this);
              this.view.tbxEdtCity.onKeyUp = this.checkUpdateAddressForm.bind(this);
              this.view.tbxEditCountry.onKeyUp = this.checkUpdateAddressForm.bind(this);
              this.view.tbxEditState.onKeyUp = this.checkUpdateAddressForm.bind(this);
          },
          /**
           * Method to assign validation action on the edit address fields
           */
          getBase64: function(file, successCallback) {
              var reader = new FileReader();
              reader.onloadend = function() {
                  successCallback(reader.result);
              };
              reader.readAsDataURL(file);
          },
          
          /**
           * Method to edit the address which is already set
           * @param {Object} address- All the fields of the Address
           */
          editAddress: function(address) {
              kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"}).presentationController.getEditAddressView(address);
          },
      }
  });
  