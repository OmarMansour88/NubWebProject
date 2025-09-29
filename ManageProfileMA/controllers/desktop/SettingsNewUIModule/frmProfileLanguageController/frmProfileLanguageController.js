define(['CommonUtilities', 'CSRAssistUI', 'FormControllerUtility', 'OLBConstants', 'ViewConstants', 'CampaignUtility'], function (CommonUtilities, CSRAssistUI, FormControllerUtility, OLBConstants, ViewConstants, CampaignUtility) {
  var orientationHandler = new OrientationHandler();
  var responsiveUtils = new ResponsiveUtils();
  return {
    updateFormUI: function (viewModel) {
      if (viewModel !== undefined) {
        if (viewModel.isLoading !== undefined) this.changeProgressBarState(viewModel.isLoading);
      }
    },

    init : function(){
       this.view.preShow=this.preShow;
       this.view.postShow=this.postShowProfileLanguage;
    },

    preShow: function () {
      var self = this;
      this.view.flxRight.setVisibility(true);
      applicationManager.getLoggerManager().setCustomMetrics(this, false, "frmProfileLanguage");
      FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxHeader', 'flxFooter', 'flxMain', 'flxMenuItemMobile']);
      this.view.lblCollapseMobile.text = "O";
      this.view.customheadernew.activateMenu("Settings", "Profile Settings");
      this.view.profileMenu.checkLanguage();
      this.view.profileMenu.activateMenu("PROFILESETTINGS", "Language");
      this.setSelectedValue("i18n.Profile.Language");
      this.view.lbxSelectLanguage.onSelection = this.disableorEnableSaveButton;
      this.setAccessibility();
      this.setActions();
      this.setLanguages();
      this.view.flxAccountSettingsCollapseMobile.onClick = this.toggleMenuMobile;
      this.view.onBreakpointChange = function () {
        self.onBreakpointChange(kony.application.getCurrentBreakpoint());
      }
      this.view.forceLayout();
    },


    setSelectedValue: function (text) {
      var self = this;
      CommonUtilities.setText(self.view.lblAccountSettingsMobile, kony.i18n.getLocalizedString(text) , CommonUtilities.getaccessibilityConfig());
    },


    disableorEnableSaveButton:function(){
      var scopeObj= this;
      var selectedLang = this.view.lbxSelectLanguage.selectedKey;
      var langlist = this.getLanguageMasterData();
      if(this.view.lbxSelectLanguage.selectedKey === langlist[scopeObj.getFrontendLanguage(applicationManager.getStorageManager().getStoredItem("langObj").language)]){
          this.disableButton(this.view.btnChangeLanguage);
        }else{
          this.enableButton(this.view.btnChangeLanguage);
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

    postShowProfileLanguage: function () {
      applicationManager.getNavigationManager().applyUpdates(this);
      this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight - this.view.flxHeader.info.frame.height - this.view.flxFooter.info.frame.height + "dp";
      this.view.forceLayout();
    },

    onBreakpointChange: function (width) {
      FormControllerUtility.setupFormOnTouchEnd(width);
      responsiveUtils.onOrientationChange(this.onBreakpointChange);
      this.view.customheadernew.onBreakpointChangeComponent(width);
      this.view.customfooternew.onBreakpointChangeComponent(width);
      orientationHandler.onOrientationChange(this.onBreakpointChange);
      if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
        var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
        CommonUtilities.setText(this.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.ProfileManagement.profilesettings"), accessibilityConfig);
      }
      this.view.forceLayout();
    },

    getFrontendLanguage: function (lang) {
      var languageData = this.getLanguageMasterData();
      var configManager = applicationManager.getConfigurationManager();
      var langObject = configManager.locale;
      for (var key in langObject) {
        if (langObject.hasOwnProperty(key)) {
          if (key === lang) {
            return this.getValueFromKey(langObject[key], languageData);
          }
        }
      }
    },

      /**
       * Method to change the selected language to backend language string
       * @param {String} lang - selected language
       */
      getBackendLanguage : function(lang){
        var languageData = this.getLanguageMasterData();
        var configManager = applicationManager.getConfigurationManager();
        var langObject = configManager.locale;
        for(var key in languageData) {
           if (languageData.hasOwnProperty(key)) {
               if(key===lang){
                 return this.getValueFromKey(languageData[key],langObject);
               }
          }
       }
   },

    /**
     * Method to fetch language from key
     * @param {String} value - selected language
     * @param {Object} langObject - language Object
     */
    getValueFromKey: function (value, langObject) {
      for (var key in langObject) {
        if (langObject.hasOwnProperty(key)) {
          var shortLang = langObject[key];
          if (shortLang === value) {
            return key;
          }
        }
      }
    },

    enableButton: function(button) {
      if(!CommonUtilities.isCSRMode()){
         button.setEnabled(true);
         button.skin = "sknbtnSSPffffff15px0273e3bg";
         button.hoverSkin = "sknBtnFocusSSPFFFFFF15Px0273e3";
         button.focusSkin = "sknBtnHoverSSPFFFFFF15Px0273e3";
      }
    },

  disableButton: function(button) {
    button.setEnabled(false);
    button.skin = "sknBtnBlockedSSPFFFFFF15Px";
    button.hoverSkin = "sknBtnBlockedSSPFFFFFF15Px";
    button.focusSkin = "sknBtnBlockedSSPFFFFFF15Px";
  },

    /**
	*  Method to set the Accessibility configurations
	*/
    setAccessibility: function () {
      var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
      this.view.btnChangeLanguage.toolTip = kony.i18n.getLocalizedString("i18n.profile.change");
      CommonUtilities.setText(this.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.ProfileManagement.profilesettings"), accessibilityConfig);
      CommonUtilities.setText(this.view.CustomChangeLanguagePopup.btnYes, kony.i18n.getLocalizedString("i18n.common.yes"), accessibilityConfig);
      CommonUtilities.setText(this.view.CustomChangeLanguagePopup.btnNo, kony.i18n.getLocalizedString("i18n.common.no"), accessibilityConfig);
      this.view.CustomChangeLanguagePopup.lblHeading.text = kony.i18n.getLocalizedString("i18n.Profile.Language");
      //CommonUtilities.setText(this.view.lblChangeLanguageHeading, kony.i18n.getLocalizedString("i18n.Profile.Language"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblSelectLanguage, kony.i18n.getLocalizedString("i18n.Profile.SelectLanguage"), accessibilityConfig);
      //CommonUtilities.setText(this.view.btnChangeLanguage, kony.i18n.getLocalizedString("i18n.profile.change"), accessibilityConfig);
      //CommonUtilities.setText(this.view.btnCancel, kony.i18n.getLocalizedString("i18n.konybb.common.cancel"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblHeading, kony.i18n.getLocalizedString("i18n.ProfileManagement.Settingscapson"), accessibilityConfig);
      this.view.btnCancel.accessibilityConfig = {
         "a11yLabel": kony.i18n.getLocalizedString("i18n.Profile.CancelChangingProfileLanguage")
      };
      this.view.btnChangeLanguage.accessibilityConfig = {
         "a11yLabel": kony.i18n.getLocalizedString("i18n.Profile.ChangeProfileLanguage")
      };
      this.view.CustomChangeLanguagePopup.btnYes.accessibilityConfig = {
         "a11yLabel": kony.i18n.getLocalizedString("i18n.common.yes")
      };
      this.view.CustomChangeLanguagePopup.btnNo.accessibilityConfig = {
         "a11yLabel": kony.i18n.getLocalizedString("i18n.common.no")
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

    setActions: function () {
      var scopeObj = this;
      this.view.btnChangeLanguage.onClick = function () {
        var langSelected = scopeObj.view.lbxSelectLanguage.selectedKeyValue[1];
        scopeObj.view.CustomChangeLanguagePopup.lblPopupMessage.text = kony.i18n.getLocalizedString("i18n.common.changeLanguageMessage") + " " + langSelected + "?";
        scopeObj.view.flxDialogs.setVisibility(true);
        scopeObj.view.flxDialogs.isModalContainer = true;
        scopeObj.view.flxChangeLanguage.setVisibility(true);
        scopeObj.view.flxLogout.setVisibility(false);
        scopeObj.view.CustomChangeLanguagePopup.flxCross.onClick = function () {
          scopeObj.view.flxDialogs.isModalContainer = false;
          scopeObj.view.flxDialogs.setVisibility(false);
          scopeObj.view.flxChangeLanguage.setVisibility(false);
          scopeObj.view.forceLayout();
        }
        scopeObj.view.forceLayout();
      };

      this.view.CustomChangeLanguagePopup.btnYes.onClick = function () {
        var localeCode = scopeObj.view.lbxSelectLanguage.selectedKey;
        var langSelected = scopeObj.view.lbxSelectLanguage.selectedKeyValue[1];
        kony.i18n.setCurrentLocaleAsync(localeCode, function () {
          applicationManager.getStorageManager().setStoredItem("langObj", { language: scopeObj.getBackendLanguage(langSelected) });
          applicationManager.getConfigurationManager().setLocaleAndDateFormat({ "data": {} });
          scopeObj.view.flxDialogs.isModalContainer = false;
          scopeObj.view.flxDialogs.setVisibility(false);
          scopeObj.view.flxChangeLanguage.setVisibility(false);
          applicationManager.getNavigationManager().navigateTo("frmProfileLanguage");
        }, function () { });
        scopeObj.view.forceLayout();
      };
      this.view.btnCancel.onClick = function(){
        applicationManager.getNavigationManager().navigateTo("frmProfile");
      };
      this.view.CustomChangeLanguagePopup.btnNo.onClick = function(){
          scopeObj.view.flxDialogs.isModalContainer = false;
          scopeObj.view.flxChangeLanguage.setVisibility(false);
          scopeObj.view.flxDialogs.setVisibility(false);
          scopeObj.view.forceLayout();
      }

    },

    getLanguageMasterData: function () {
      return {
        "US English": "en_US",
        // "UK English": "en_GB",
        // "Spanish": "es_ES",
        // "German": "de_DE",
        // "French": "fr_FR"
      }
    },
    setLanguages: function () {
      var langlist = this.getLanguageMasterData();
      var scopeObj = this;
      var languages = [];
      for (var lang in langlist) {
        if (langlist.hasOwnProperty(lang)) {
          var temp = ([langlist[lang], lang]);
          languages.push(temp);
        }
      }
      this.view.lbxSelectLanguage.masterData = languages;
      this.view.lbxSelectLanguage.selectedKey = langlist[scopeObj.getFrontendLanguage(applicationManager.getStorageManager().getStoredItem("langObj").language)];
      if (this.view.lbxSelectLanguage.selectedKey === langlist[scopeObj.getFrontendLanguage(applicationManager.getStorageManager().getStoredItem("langObj").language)]) {
        this.disableButton(this.view.btnChangeLanguage);
      } else {
        this.enableButton(this.view.btnChangeLanguage);
      }
    },

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
  };
});