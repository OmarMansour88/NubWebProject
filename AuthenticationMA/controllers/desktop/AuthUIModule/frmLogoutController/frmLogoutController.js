/**
 * Login form controller which will handle all login page UI changes
 * @module frmLoginController
 */
define(['FormControllerUtility', 'Deeplinking', 'ViewConstants', 'CommonUtilities', 'OLBConstants'], function(FormControllerUtility, Deeplinking, ViewConstants, CommonUtilities, OLBConstants) {
    var DEVICE_TYPES = {
        DESKTOP: {},
        IPHONE: {
            linkConfigKey: 'iphoneNativeAppLink',
            image: ViewConstants.IMAGES.APP_STORE
        },
        IPAD: {
            linkConfigKey: 'ipadNativeAppLink',
            image: ViewConstants.IMAGES.APP_STORE
        },
        ANDROID_PHONE: {
            linkConfigKey: 'androidPhoneNativeAppLink',
            image: ViewConstants.IMAGES.PLAY_STORE
        },
        ANDROID_TABLET: {
            linkConfigKey: 'androidTabletNativeAppLink',
            image: ViewConstants.IMAGES.PLAY_STORE
        },
    }
    var orientationHandler = new OrientationHandler();
    this.customerPhone = "";
    this.customerEmail = "";
    return /** @alias module:frmLoginController */ {
        /**
         * Method to load and return Auth Module
         * @returns {object} Auth Module object.
         */
        loadAuthModule: function() {
            return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AuthUIModule");
        },
        /**
         * Function to be called on pre show of the frmLogin
         */
        onPreShow: function() {
            var authModule = this.loadAuthModule();
            if (kony.application.getCurrentBreakpoint() === 640) {
                this.view.CustomFeedbackPopup.lblHeading.skin = "bbSknLbl424242Lato20Px";
            }
            this.attachToModule(authModule);
            this.presentationValidationUtility = applicationManager.getPresentationValidationUtility();
            this.dataProcessUtilityManager = applicationManager.getDataProcessorUtility();
            this.validationUtilManager = applicationManager.getValidationUtilManager();
            this.view.logOutMsg.lblSuccessMsgEBA.setVisibility(false);
            //this.view.main.btnForgotPassword.toolTip = "Cannot Sign In?";
            this.view.forceLayout();
            // this.restoreOriginalMainLoginUIChanges();
            this.preshowFrmLogout();
            //  this.initializeResponsiveViews();
            this.setLanguages();
            this.view.imgKony.onTouchEnd = this.showLoginOnCancel;
            this.view.BrowserCheckPopup.setOnBrowserDownloaded(this.setOnBrowserDownloadedClicked);
            this.view.BrowserCheckPopup.setOnContinue(this.setOnBrowserCheckContinue);
            this.view.logOutMsg.AlterneteActionsLoginNow.fontIconOption.skin = "sknlblfonticon24px0273e3";
            this.view.logOutMsg.AlterneteActionsLoginNow.fontIconOption.text = "V";
            if (applicationManager.getStorageManager().getStoredItem("langObj")) {
                var langObj = applicationManager.getStorageManager().getStoredItem("langObj").language;
                this.showDefaultLanguageOnLoginScreen(langObj);
            }
            //this.view.flxFooterMenu.setVisibility(false);
            FormControllerUtility.updateWidgetsHeightInInfo(this, ['flxMain', 'flxDropdown']);
            this.view.flxFooterContainer.setVisibility(false);
            this.view.lblCopyright.accessibilityConfig = {
                "a11yLabel" : kony.i18n.getLocalizedString("i18n.footer.copyrightNew")
            }
        },
        frmLoginInit: function() {
            this.view.tbxAutopopulateIssueFix.secureTextEntry = true;
            this.view.tbxAutopopulateIssueFix.setVisibility(true);
        },
        setOnBrowserDownloadedClicked: function(params) {
            //application manager service call
            applicationManager.logBrowser(params);
        },
        setOnBrowserCheckContinue: function(params) {
            applicationManager.logBrowser(params);
        },
        showLoginOnCancel: function() {
            var authModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AuthUIModule");
            authModule.presentationController.showLoginScreen();
        },
        /**
         * setLanguages :This function sets the languages in the dropdown list
         */
        setLanguages: function() {
            var langlist = this.getLanguageMasterData();
            var languages = [];
            for (var lang in langlist) {
                if (langlist.hasOwnProperty(lang)) {
                    var temp = {
                        "lblLang": lang,
                        "lblSeparator": "a"
                    };
                    languages.push(temp);
                }
            }
            this.view.segLanguagesList.setData(languages);
        },
        /**
         * showDefaultLanguage :This function sets the default language in the textbox as the value in local store or coming from backend
         * @param {String} lang - selected language
         */
        showDefaultLanguageOnLoginScreen: function(lang) {
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.lblLanguage, this.getFrontendLanguage(lang), accessibilityConfig);
            this.view.lblLanguage.toolTip = this.getFrontendLanguage(lang);
            this.setLocale(lang);
        },
        /**
         * setLocale :This function sets the locale selected
         * @param {String} lang - selected language
         */
        setLocale: function(lang) {
            var localeCode = applicationManager.getConfigurationManager().locale[lang];
            kony.i18n.setCurrentLocaleAsync(localeCode, function() {
                applicationManager.getStorageManager().setStoredItem("langObj", {
                    language: lang
                });
                applicationManager.getConfigurationManager().setLocaleAndDateFormat({
                    "data": {}
                });
            }, function() {});
        },
        /**
         * Method to fetch languages JSON
         */
        getLanguageMasterData: function() {
            return {
                "US English": "en_US",
                "UK English": "en_GB",
                "Spanish": "es_ES",
                "German": "de_DE",
                "French": "fr_FR"
            }
        },
        /**
         * Method to fetch language from key
         * @param {String} value - selected language
         * @param {Object} langObject - language Object
         */
        getValueFromKey: function(value, langObject) {
            for (var key in langObject) {
                if (langObject.hasOwnProperty(key)) {
                    var shortLang = langObject[key];
                    if (shortLang === value) {
                        return key;
                    }
                }
            }
        },
        /**
         * Method to change the selected language to backend language string
         * @param {String} lang - selected language
         */
        getBackendLanguage: function(lang) {
            var languageData = this.getLanguageMasterData();
            var configManager = applicationManager.getConfigurationManager();
            var langObject = configManager.locale;
            for (var key in languageData) {
                if (languageData.hasOwnProperty(key)) {
                    if (key === lang) {
                        return this.getValueFromKey(languageData[key], langObject);
                    }
                }
            }
        },
        /**
         * Method to change the selected language to backend language string
         * @param {String} lang - selected language
         */
        getFrontendLanguage: function(lang) {
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
         * showDefaultLanguage :This function sets the default language in the textbox if nothing is set in local store
         */
        showDefaultLanguage: function() {
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.lblLanguage, this.view.segLanguagesList.data[0].lblLang, accessibilityConfig);
            this.view.lblLanguage.toolTip = this.view.segLanguagesList.data[0].lblLang;
            this.setLocale(this.getBackendLanguage(this.view.segLanguagesList.data[0].lblLang));
        },
        hideTextBox: function() {
            var scopeObj = this;

            function timerFunc() {
                scopeObj.view.tbxAutopopulateIssueFix.setVisibility(false);
                kony.timer.cancel("mytimer");
            }
            kony.timer.schedule("mytimer", timerFunc, 0.5, false);
        },
        /**
         * Function to be called on post show of the frmLogin
         */
        onPostShow: function() {
            var scopeObj = this;
            scopeObj.hideTextBox();

            if (applicationManager.getStorageManager().getStoredItem("langObj")) {
                var langObj = applicationManager.getStorageManager().getStoredItem("langObj").language;
                this.showDefaultLanguageOnLoginScreen(langObj);
            }
            applicationManager.getNavigationManager().applyUpdates(this);
            //Footer actions.
            this.view.btnFaqs.onClick = scopeObj.loadAuthModule().presentationController.navigateToFAQ.bind(scopeObj);
            this.view.btnContactUs.onClick = scopeObj.loadAuthModule().presentationController.navigateToContactUs.bind(scopeObj);
            this.view.btnPrivacy.onClick = scopeObj.loadAuthModule().presentationController.navigateToPrivacyPrivacy.bind(scopeObj);
            this.view.btnTermsAndConditions.onClick = scopeObj.loadAuthModule().presentationController.navigateToTermsAndConditions.bind(scopeObj);
            this.view.btnLocateUs.onClick = function() {
                scopeObj.view.flxLogoutMsg.isVisible = false;
                scopeObj.loadAuthModule().presentationController.navigateToLocateUs();
            };
            this.initializeResponsiveViews();
            //this.setupNativeAppLink();
            this.view.logOutMsg.AlterneteActionsLoginNow.onClick = function() {
                scopeObj.loginLater(scopeObj.view.flxLogoutMsg);
            };
            this.view.logOutMsg.AlterneteActionsLoginNow.rtxCVV.onTouchEnd = function() {
                scopeObj.loginLater(scopeObj.view.flxLogoutMsg);
            };
            this.view.flxDropdown.onClick = function() {
                if (scopeObj.view.lblCheckBox.text === "O" && (scopeObj.view.lblCheckBox.origin === false) || scopeObj.view.lblCheckBox.origin === undefined) {
                    var right = scopeObj.view.flxMain.info.frame.width - (scopeObj.view.flxDropdown.info.frame.width + scopeObj.view.flxDropdown.info.frame.x);
                    scopeObj.view.flxLanguagePicker.left = "";
                    //TODO: remove Desktop conditional statement.
                    if (orientationHandler.isDesktop)
                        right += 25;
                    scopeObj.view.flxLanguagePicker.right = right + "dp";
                    scopeObj.view.flxLanguagePicker.isVisible = true;
                    scopeObj.view.lblCheckBox.text = "P";
                    scopeObj.view.lblCheckBox.origin = true;
                } else {
                    scopeObj.view.flxLanguagePicker.isVisible = false;
                    scopeObj.view.lblCheckBox.text = "O";
                    scopeObj.view.lblCheckBox.origin = false;
                }
            };
            this.view.logOutMsg.AlterneteActionsLoginNow.skin = "sknBGFFFFFBdrE3E3E3BdrRadius2Px";
            this.view.logOutMsg.AlterneteActionsLoginNow.hoverSkin = "sknBGFFFFFBdrE3E3E3BdrRadius2PxHover";
            var handCursor = document.querySelectorAll(".sknBGFFFFFBdrE3E3E3BdrRadius2Px");
            for (var i = 0; i < handCursor.length; i++) {
                handCursor[i].style.cursor = "pointer";
            }
            scopeObj.setCustomHeaderLogo();
            scopeObj.setFooterCopyrightText();
        },
        /**
         * This function is called to set the logo based on the last logged in user
         * @param {}
         */
        setCustomHeaderLogo: function(userType) {
            if (!userType) {
                return; //Fallback to default Logo. Cannot Infer user type
            }
            if (userType.isSMEUser === "true") this.view.imgKony.src = "sbb.png";
            else if (userType.isRBUser === "true") this.view.imgKony.src = "kony_logo.png";
            else if (userType.isMBBUser === "true") this.view.imgKony.src = "mbb.png";
            else this.view.imgKony.src = "digital_banking.png";
        },

        /**
         * This function is called to set footer copyright text based on the last logged in user
         * @param {}
         */
        setFooterCopyrightText: function() {
            var configurationManager = applicationManager.getConfigurationManager();
            if (configurationManager.isSMEUser === "true")
                this.view.lblCopyright.text = kony.i18n.getLocalizedString("i18n.footer.copyrightsme");
            else
                this.view.lblCopyright.text = kony.i18n.getLocalizedString("i18n.footer.copyright");
        },
        /**
         * This function is called once the user clicks on loginlater after resetting the password
         * @param {obejct} currentFlex current flex object
         */
        loginLater: function(currentFlex) {
            currentFlex.isVisible = false;
            this.restoreOriginalMainLoginUIChanges();
            applicationManager.getConfigurationManager().fetchApplicationProperties(function(res) {
                applicationManager.getNavigationManager().updateForm({
                    isLanguageSelectionEnabled: res.isLanguageSelectionEnabled,
                    defaultLanguage: res.language
                }, "frmLogin");
            }, function() {})
            // if(kony.application.getCurrentBreakpoint() === 1400){
            //   this.view.flxLogin.top = "0dp";
            // }
            // else if(kony.application.getCurrentBreakpoint() === 640){
            //   this.view.flxLogin.top = "40dp";
            // }
            // else if(kony.application.getCurrentBreakpoint() === 768 || kony.application.getCurrentBreakpoint() === 1024){
            //   this.view.flxLogin.top = "60dp";
            // }
            //currentFlex.parent.forceLayout();
            //this.initializeResponsiveViews();
            applicationManager.getPresentationUtility().showLoadingScreen();
            applicationManager.getNavigationManager().navigateTo("frmLogin");
        },
        setFocusSkin: function(flexWidget) {
            flexWidget.skin = "sknFlxBorder4A90E23px";
        },
        setNormalSkin: function(flexWidget) {
            flexWidget.skin = "sknBorderE3E3E3";
        },


        updateFormUI: function(context) {
            if (context.action === "Logout" || context.action === "userNamePasswordSuccessfullyChanged") {
                this.showLogoutPage();
            }
            if (context.action === "Logout" || context.action === "selectTermsAndConditonsProceed") {
                this.showLogoutPage();
            }
            if (context.action === "SessionExpired") {
                this.showSessionExpiredPage();
            }
            if (context.action === "ServerDown") {
                this.showServerErrorPage(this.view.flxLogoutMsg);
            }
            if (context.showProgressBar) {
                FormControllerUtility.showProgressBar(this.view);
            }
            if (context.hideProgressBar) {
                FormControllerUtility.hideProgressBar(this.view);
            }

            if (context.errorMessage) {
                this.showErrorMessage(context.errorMessage);
            }

            if (context.action === "userNamePasswordSuccessfullyChanged") {
                this.showUserNameSuccessfulMessage(context);
            }

            if (context.action === "disabledEBankingAccess") {
                this.showDisableEbankingMessage();
            }
            /* 
             if (context.isLanguageSelectionEnabled) {
                 this.languageDropdownEnabled(context.isLanguageSelectionEnabled);
             }
             if (applicationManager.getStorageManager().getStoredItem("langObj")) {
                 var langObj = applicationManager.getStorageManager().getStoredItem("langObj").language;
                 this.showDefaultLanguageOnLoginScreen(langObj);
             } else if (context.defaultLanguage) {
                 this.showDefaultLanguageOnLoginScreen(context.defaultLanguage);
             } else {
                 this.showDefaultLanguage();
             }
            */
            this.initializeResponsiveViews();
        },
        /**
         * showServerErrorPage :This function is for showing the server DownTime Screen
         * @param {object} currentFlex - flex object
         */
        showServerErrorPage: function(currentFlex) {
            //to handle csr successs but entitlements failure
            if (!this.view.isVisible) {
                this.view.setVisibility(true);
            }
            currentFlex.isVisible = false;
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.EnrollAlert.rtxServerError, kony.i18n.getLocalizedString("i18n.common.OoopsServerError"), accessibilityConfig);
            this.view.EnrollAlert.btnBackToLogin.setVisibility(false);
            this.view.logOutMsg.lblSuccessIcon.setVisibility(false);
            this.view.logOutMsg.lblLoggedOut.setVisibility(false);
            this.view.logOutMsg.imgLogoutSuccess.setVisibility(false);
            this.view.logOutMsg.lblSuccessMsgEBA.setVisibility(false);
            FormControllerUtility.hideProgressBar(this.view);
            this.view.flxEnrollOrServerError.isVisible = true;
            this.view.EnrollAlert.btnBackToLogin.setVisibility(true);
            currentFlex.parent.forceLayout();
            // currentFlex.parent.forceLayout();
        },
        /**
         * This function shows the logout Message on the login form
         */
        showLogoutPage: function() {
            // this.view.lblLoggedOut.text = kony.i18n.getLocalizedString("i18n.login.SuccessfullyLoggedOut");
            // this.view.imgLogoutSuccess.src = ViewConstants.IMAGES.LOGOUT_TICK_MARK;
            var scopeObj = this;
            this.view.logOutMsg.imgLogoutSuccess.src = ViewConstants.IMAGES.SUCCESS_GREEN;
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            var logOutAction = applicationManager.getStorageManager().getStoredItem('OLBLogoutStatus').action;
            var logOutText = applicationManager.getStorageManager().getStoredItem('OLBLogoutStatus').text;
            if ((logOutText == "username") && (logOutAction == "userNamePasswordSuccessfullyChanged")) {
                CommonUtilities.setText(this.view.logOutMsg.lblLoggedOut, kony.i18n.getLocalizedString("i18n.login.SuccessfullyChangedUsername"), accessibilityConfig);
                CommonUtilities.setText(this.view.logOutMsg.lblSuccessIcon, kony.i18n.getLocalizedString("i18n.login.LogOutSuccess"), accessibilityConfig);
            } else if ((logOutText == "password") && (logOutAction == "userNamePasswordSuccessfullyChanged")) {
                CommonUtilities.setText(this.view.logOutMsg.lblLoggedOut, kony.i18n.getLocalizedString("i18n.login.SuccessfullyChangedPassword"), accessibilityConfig);
                CommonUtilities.setText(this.view.logOutMsg.lblSuccessIcon, kony.i18n.getLocalizedString("i18n.login.LogOutSuccess"), accessibilityConfig);
            } else if ((logOutText == "tnc") && (logOutAction == "selectTermsAndConditonsProceed")) {
                CommonUtilities.setText(this.view.logOutMsg.lblLoggedOut, kony.i18n.getLocalizedString("i18n.login.SelectTnC"), accessibilityConfig);
                CommonUtilities.setText(this.view.logOutMsg.lblSuccessIcon, kony.i18n.getLocalizedString("i18n.login.LogOutSuccess"), accessibilityConfig);
                //this.view.flxFooterMenu.setVisibility(false);
            } else {
                CommonUtilities.setText(this.view.logOutMsg.lblLoggedOut, kony.i18n.getLocalizedString("i18n.login.SuccessfullyLoggedOut"), accessibilityConfig);
                CommonUtilities.setText(this.view.logOutMsg.lblSuccessIcon, kony.i18n.getLocalizedString("i18n.login.LogOutSuccess"), accessibilityConfig);
            }
            this.view.logOutMsg.lblSuccessMsgEBA.setVisibility(false);
            //this.view.logOutMsg.lblLoggedOut.text = kony.i18n.getLocalizedString("i18n.login.SuccessfullyLoggedOut");
            //this.view.logOutMsg.lblSuccessIcon.text = kony.i18n.getLocalizedString("i18n.login.LogOutSuccess");
            //             this.view.logOutMsg.lblLoggedOut.top = "45%";
            //             this.view.logOutMsg.lblLoggedOut.height = "27%";
            //this.restoreOriginalMainLoginUIChanges();
            this.changesAfterLogout();
            kony.timer.schedule("survey", function() {
                scopeObj.changesAfterLogout();
            }, 1, false);
            this.initializeResponsiveViews();
            this.setCustomHeaderLogo(applicationManager.getStorageManager().getStoredItem('OLBLogoutStatus').userType);
            FormControllerUtility.hideProgressBar(scopeObj.view);
        },
        /**
         * This function shows the logout Message on the login form
         */
        showLogoutPageMFA: function() {
            var scopeObj = this;
            this.view.logOutMsg.imgLogoutSuccess.src = "error_yellow.png";
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.logOutMsg.lblLoggedOut, kony.i18n.getLocalizedString("i18n.login.logoutMFA"), accessibilityConfig);
            //this.view.logOutMsg.lblLoggedOut.text = kony.i18n.getLocalizedString("i18n.login.logoutMFA");
            this.view.logOutMsg.lblSuccessIcon.setVisibility(false);
            //             this.view.logOutMsg.lblLoggedOut.top = "45%";
            //             this.view.logOutMsg.lblLoggedOut.height = "27%";
            //this.restoreOriginalMainLoginUIChanges();
            this.changesAfterLogout();
            kony.timer.schedule("survey", function() {
                scopeObj.changesAfterLogout();
            }, 1, false);
            FormControllerUtility.hideProgressBar(scopeObj.view);
            this.initializeResponsiveViews();
        },
        /**
         * This function shows the logout Message on the login form
         */
        showLockoutPageMFA: function(lockTime) {
            var scopeObj = this;
            this.view.logOutMsg.imgLogoutSuccess.src = "error_yellow.png";
            var text = kony.i18n.getLocalizedString("i18n.login.LockoutMFA") + " " + lockTime + " " + kony.i18n.getLocalizedString("i18n.mfa.minutes");
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.logOutMsg.lblLoggedOut, text, accessibilityConfig);
            //this.view.logOutMsg.lblLoggedOut.text = kony.i18n.getLocalizedString("i18n.login.LockoutMFA") + " " + lockTime + " " + kony.i18n.getLocalizedString("i18n.mfa.minutes");
            this.view.logOutMsg.lblSuccessIcon.setVisibility(false);
            //             this.view.logOutMsg.lblLoggedOut.top = "45%";
            //             this.view.logOutMsg.lblLoggedOut.height = "27%";
            this.restoreOriginalMainLoginUIChanges();
            this.changesAfterLogout();
            kony.timer.schedule("survey", function() {
                scopeObj.changesAfterLogout();
            }, 1, false);
            this.initializeResponsiveViews();
        },
        /**
         * This function shows the message when the session is Expired
         */
        showSessionExpiredPage: function() {
            this.view.logOutMsg.imgLogoutSuccess.src = ViewConstants.IMAGES.SUCCESS_GREEN;
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.logOutMsg.lblLoggedOut, kony.i18n.getLocalizedString("i18n.login.SessionExpired"), accessibilityConfig);
            //this.view.logOutMsg.lblLoggedOut.text = kony.i18n.getLocalizedString("i18n.login.SessionExpired");
            //             this.view.logOutMsg.lblLoggedOut.top = "22%";
            //          this.view.logOutMsg.lblLoggedOut.height = "9%";
            this.view.logOutMsg.lblSuccessMsgEBA.setVisibility(false);
            this.restoreOriginalMainLoginUIChanges();
            this.changesAfterLogout();
            this.initializeResponsiveViews();
        },

        showDisableEbankingMessage: function() {
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.logOutMsg.lblLoggedOut, kony.i18n.getLocalizedString("i18n.logout.eBankingDisableSuccess"), accessibilityConfig);
            CommonUtilities.setText(this.view.logOutMsg.lblSuccessMsgEBA, kony.i18n.getLocalizedString("i18n.logout.reachOutBank"), accessibilityConfig);
            CommonUtilities.setText(this.view.logOutMsg.lblSuccessIcon, "", accessibilityConfig);
            this.view.logOutMsg.lblSuccessMsgEBA.setVisibility(true);
            this.view.logOutMsg.forceLayout();
        },
        /* selectYourLanguage :This function sets the language selected from the dropdown menu to the label and also stores it in localstore
         */
        selectYourLanguage: function() {
            this.view.flxLanguagePicker.setVisibility(false);
            var langSelected = JSON.stringify(this.view.segLanguagesList.selectedRowItems[0]["lblLang"]);
            langSelected = langSelected.replace(/"/g, "");
            this.showLanguageSelectionPopUp(langSelected);
        },
        /**
         * Method to show language selection popup
         * @param {String} langSelected - selected language
         */
        showLanguageSelectionPopUp: function(langSelected) {
            var scopeObj = this;
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.CustomChangeLanguagePopup.lblPopupMessage, kony.i18n.getLocalizedString("i18n.common.changeLanguageMessage") + " " + langSelected + "?", accessibilityConfig);
            //this.view.CustomChangeLanguagePopup.lblPopupMessage.text = kony.i18n.getLocalizedString("i18n.common.changeLanguageMessage") + " " + langSelected + "?";
            this.view.flxChangeLanguage.setVisibility(true);
            this.view.CustomChangeLanguagePopup.btnYes.onClick = function() {
                applicationManager.getStorageManager().setStoredItem("langObj", {
                    language: scopeObj.getBackendLanguage(langSelected)
                });
                var localeCode = applicationManager.getConfigurationManager().locale[scopeObj.getBackendLanguage(langSelected)];
                kony.i18n.setCurrentLocaleAsync(localeCode, function() {
                    applicationManager.getStorageManager().setStoredItem("langObj", {
                        language: scopeObj.getBackendLanguage(langSelected)
                    });
                    applicationManager.getConfigurationManager().setLocaleAndDateFormat({
                        "data": {}
                    });
                    applicationManager.getNavigationManager().navigateTo("frmLoginLanguage");
                }, function() {});
                CommonUtilities.setText(this.view.lblLanguage, langSelected, accessibilityConfig);
                //this.view.lblLanguage.text = langSelected;
                this.hideLanguageSelectionPopUp();
            }.bind(this);
            this.view.CustomChangeLanguagePopup.btnNo.onClick = this.hideLanguageSelectionPopUp.bind(this);
            this.view.CustomChangeLanguagePopup.flxCross.onClick = this.hideLanguageSelectionPopUp.bind(this);
        },
        hideLanguageSelectionPopUp: function() {
            this.view.lblCheckBox.text = "O";
            this.view.flxChangeLanguage.setVisibility(false);
        },
        updateFeedbackId: function() {
            var feedbackID = applicationManager.getStorageManager().removeStoredItem("feedbackUserId");
            if (feedbackID) {
                applicationManager.getFeedbackManager().updateFeedbackId(feedbackID);
            }
        },
        /**
         * This UI function does the needed changes once we click on logout button to the login form
         */
        changesAfterLogout: function() {
            this.updateFeedbackId();
            var OLBLogoutStatus = kony.store.getItem('OLBLogoutStatus');
            this.view.flxLogoutMsg.setVisibility(true);
            if (applicationManager.getConfigurationManager().isFeedbackEnabled === "false") {
                this.view.flxFeedbackTakeSurvey.setVisibility(false);
            } else if (applicationManager.getConfigurationManager().isFeedbackEnabled !== "false" && !(OLBLogoutStatus.isSurveyPopupResponseRecorded)) {
                if (kony.application.getCurrentBreakpoint() === 1400 && orientationHandler.isTablet) {
                    this.view.CustomFeedbackPopup.width = "60%";
                }
                this.view.flxFeedbackTakeSurvey.setVisibility(true);
            }
            if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
                this.view.imgKony.left = "14%";
            }
            // this.view.lblLanguage.skin = ViewConstants.SKINS.LANGUAGE1;
            this.view.flxMain.skin = ViewConstants.SKINS.LOGIN_AFTER_LOGOUT;
            this.view.logOutMsg.AlterneteActionsLoginNow.fontIconOption.skin = "sknlblfonticon24px0273e3";
            this.view.logOutMsg.AlterneteActionsLoginNow.fontIconOption.text = "V";
            //this.view.main.btnForgotPassword.isVisible = false;
            this.view.flxMain.parent.forceLayout();
        },
        /**
         * This  function shows the error Message to the user
         * @param {string} errorMessage error message to display
         */
        showErrorMessage: function(errorMessage) {
            if (this.view.main.flxLoginUser.isVisible) {
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.main.rtxErrorMsgUser, errorMessage, accessibilityConfig);
                this.view.main.rtxErrorMsgUser.setVisibility(true);
            } else {
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.main.rtxErrorMsg, errorMessage, accessibilityConfig);
                this.view.main.rtxErrorMsg.setVisibility(true);
            }
            this.view.logOutMsg.lblSuccessMsgEBA.setVisibility(false);
            this.view.main.flxLoginUser.parent.forceLayout();
        },
        /**
        /**
         * The function is used to turn the visibility on or off for the Language Selection
         */
        languageDropdownEnabled: function(isEnabled) {
            if (isEnabled === "true") {
                this.view.flxDropdown.setVisibility(true);
            } else {
                this.view.flxDropdown.setVisibility(false);
            }
            this.view.forceLayout();
        },
        /**
         * This function is called on PreShow of the Login form
         */
        preshowFrmLogout: function() {
            var scopeObj = this;
            var OLBLogoutStatus = kony.store.getItem('OLBLogoutStatus');
            this.view.btnVeiwMore.hoverSkin = "sknbtn41a0edviewmoreHover";
            if (OLBLogoutStatus) {
                this.updateFormUI(OLBLogoutStatus);
                //OLBLogoutStatus.isUserLoggedoutSuccessfully = false;
                //applicationManager.getStorageManager().setStoredItem('OLBLogoutStatus', OLBLogoutStatus);
            }
            this.view.btnVeiwMore.onClick = function() {
                var config = applicationManager.getConfigurationManager();
                kony.application.openURL(config.getConfigurationValue("LINK_TO_DBX"));
            }
            this.view.forceLayout();
        },
        /**
         * This function is for recovering the original UI changes
         */
        restoreOriginalMainLoginUIChanges: function() {

        },

        /**
         * UI Function change all button widget pointer
         */
        onLoadChangePointer: function() {
            var elems = document.querySelectorAll("input[kwidgettype='Button']");
            for (var i = 0, iMax = elems.length; i < iMax; i++) {
                elems[i].style.cursor = 'pointer';
            }
        },
        /**
         * Ui Method to handle the responsive things
         * @param {integer} width value specifies width
         */
        onBreakpointChange: function(width) {
            kony.print('on breakpoint change');
            orientationHandler.onOrientationChange(this.onBreakpointChange);
            this.view.lblCopyright.setVisibility(true);
            this.view.lblCopyrightTab1.setVisibility(false);
            this.view.lblCopyrightTab2.setVisibility(false);
            this.view.logOutMsg.lblSuccessIcon.contentAlignment = constants.CONTENT_ALIGN_CENTER;
            //this.view.main.rtxErrorMsg.contentAlignment = constants.CONTENT_ALIGN_TOP_CENTER;
            var responsiveFonts = new ResponsiveFonts();
            if ((width <= 1024 && orientationHandler.isTablet) || (width <= 1024 && orientationHandler.isDesktop)) {
                //this.view.logOutMsg.lblLoggedOut.contentAlignment = constants.CONTENT_ALIGN_TOP_CENTER;
                //this.view.logOutMsg.lblSuccessIcon.contentAlignment = constants.CONTENT_ALIGN_TOP_CENTER;
            }
            if ((width === 640 && orientationHandler.isMobile) || (width === 640 && orientationHandler.isDesktop)) {
                this.view.flxCloseFontIconParent.left = "";
                this.view.flxCloseFontIconParent.right = "7.50%";
                this.view.flxCloseFontIconParent.top = "40dp";
                this.view.flxDropdown.right = "13.88%";
                this.view.flxFooterMenu.width = "145dp";
                this.view.btnLocateUs.left = "0dp";
                //  this.view.imgKony.left = this.view.flxLogin.frame.x + this.view.main.flxUserName.frame.x + 2 + "dp";
                this.view.logOutMsg.lblSuccessIcon.contentAlignment = constants.CONTENT_ALIGN_TOP_CENTER;
                this.view.logOutMsg.lblLoggedOut.contentAlignment = constants.CONTENT_ALIGN_TOP_CENTER;
                this.view.CustomFeedbackPopup.lblHeading.skin = "bbSknLbl424242Lato20Px";
            }
            if ((width <= 640 && orientationHandler.isMobile) || (width <= 640 && orientationHandler.isDesktop)) {
                responsiveFonts.setMobileFonts();
                this.view.forceLayout();
            }
            if ((width === 768 && orientationHandler.isTablet) || (width === 768 && orientationHandler.isDesktop)) {
                this.view.flxCloseFontIconParent.left = "";
                this.view.flxCloseFontIconParent.right = "15%";
                this.view.flxCloseFontIconParent.top = "60dp";
                this.view.flxDropdown.right = "20.25%";
                this.view.logOutMsg.lblLoggedOut.contentAlignment = constants.CONTENT_ALIGN_TOP_CENTER;
                this.view.logOutMsg.lblSuccessIcon.contentAlignment = constants.CONTENT_ALIGN_TOP_CENTER;
            }
            if ((width === 1024 && orientationHandler.isTablet) || (width === 1024 && orientationHandler.isDesktop)) {
                this.view.flxDropdown.right = "24.5%";
                this.view.flxCloseFontIconParent.left = "";
                this.view.flxCloseFontIconParent.right = "20%";
                this.view.flxCloseFontIconParent.top = "60dp";
                //this.view.main.flxContainer.height = "600dp";
                this.view.logOutMsg.lblLoggedOut.contentAlignment = constants.CONTENT_ALIGN_TOP_CENTER;
                this.view.logOutMsg.lblSuccessIcon.contentAlignment = constants.CONTENT_ALIGN_TOP_CENTER;
            }
            if (width > 1024) {
                // this.view.logOutMsg.lblLoggedOut.contentAlignment = constants.CONTENT_ALIGN_MIDDLE_LEFT;
                //this.view.logOutMsg.lblSuccessIcon.contentAlignment = constants.CONTENT_ALIGN_MIDDLE_LEFT;
                this.view.logOutMsg.lblSuccessIcon.contentAlignment = constants.CONTENT_ALIGN_TOP_LEFT;
                this.view.logOutMsg.lblLoggedOut.contentAlignment = constants.CONTENT_ALIGN_TOP_LEFT;
            }
            if (width !== 1400)
                this.view.onTouchEnd = function() {}
            var scope = this;
            this.view.CustomFeedbackPopup.onBreakpointChangeComponent(scope.view.CustomFeedbackPopup, width);
            this.view.CustomChangeLanguagePopup.onBreakpointChangeComponent(scope.view.CustomChangeLanguagePopup, width);
            var views = Object.keys(this.responsiveViews);
            views.forEach(function(e) {
                scope.view[e].isVisible = scope.responsiveViews[e];
            });
            if (width >= 768 && orientationHandler.isTablet) {}
            //this.allFieldsCheck();
        },
        setupFormOnTouchEnd: function(width) {
            if (width == 640) {
                this.view.onTouchEnd = function() {}
                this.nullifyPopupOnTouchStart();
            } else {
                if (width == 1024 || width == 768) {
                    this.view.onTouchEnd = function() {}
                    this.nullifyPopupOnTouchStart();
                } else {
                    this.view.onTouchEnd = function() {
                        hidePopups();
                    }
                }
                var userAgent = kony.os.deviceInfo().userAgent;
                if (userAgent.indexOf("iPad") != -1) {
                    this.view.onTouchEnd = function() {}
                    this.nullifyPopupOnTouchStart();
                } else if (userAgent.indexOf("Android") != -1 && userAgent.indexOf("Mobile") == -1) {
                    this.view.onTouchEnd = function() {}
                    this.nullifyPopupOnTouchStart();
                }
            }
        },
        nullifyPopupOnTouchStart: function() {},
        responsiveViews: {},
        /**
         * Method to initialize Response views
         */
        initializeResponsiveViews: function() {
            this.responsiveViews["flxLogoutMsg"] = this.view.flxLogoutMsg.isVisible;
            this.responsiveViews["flxFeedbackTakeSurvey"] = this.view.flxFeedbackTakeSurvey.isVisible;
            this.responsiveViews["imgKony"] = this.view.imgKony.isVisible;
            this.responsiveViews["flxEnrollOrServerError"] = this.view.flxEnrollOrServerError.isVisible;
        },
        /**
         * This function navigates to the customer Feedback form.
         */
        btnYesTakeSurvey: function() {
            this.view.flxFeedbackTakeSurvey.setVisibility(false);
            this.updateSurveyResponse(true);
            this.loadAuthModule().presentationController.navigateToFeedbackPage();
        },
        /**
         * This function sets the visibility of the Survey Flex to false
         */
        btnNoTakeSurvey: function() {
            this.view.flxFeedbackTakeSurvey.setVisibility(false);
            this.updateSurveyResponse(true);
        },
        updateSurveyResponse: function(value) {
            var OLBLogoutStatus = kony.store.getItem('OLBLogoutStatus');
            OLBLogoutStatus.isSurveyPopupResponseRecorded = value;
            applicationManager.getStorageManager().setStoredItem('OLBLogoutStatus', OLBLogoutStatus);
        },

        /**
         * Set up native app link for mobile and tablet
         */
        setupNativeAppLink: function() {
            var configurationManager = applicationManager.getConfigurationManager();
            var deviceConfig = this.detectDevice();
            //this.view.flxPlayStore.setVisibility(false);
            if (deviceConfig !== DEVICE_TYPES.DESKTOP) {
                this.view.imgAppstore.src = deviceConfig.image;
                /* this.view.flxAppStore.onClick = function () {
                     // Picking Native App Link from Configuration
                     kony.application.openURL(configurationManager[deviceConfig.linkConfigKey])
                 }*/
            }
            this.view.forceLayout();
        },
        /**
         * detects the device type
         * @returns {Number} Type of device
         */
        detectDevice: function() {
            var userAgent = kony.os.deviceInfo().userAgent
            if (/iphone/i.test(userAgent)) {
                return DEVICE_TYPES.IPHONE;
            } else if (/ipad/i.test(userAgent)) {
                return DEVICE_TYPES.IPAD;
            } else if (/android/i.test(userAgent) && /mobile/i.test(userAgent)) {
                return DEVICE_TYPES.ANDROID_PHONE;
            } else if (/android/i.test(userAgent)) {
                return DEVICE_TYPES.ANDROID_TABLET;
            }
            return DEVICE_TYPES.DESKTOP;
        },
        /**
         * Method to close the feedback pop up.
         */
        onFeedbackCrossClick: function() {
            this.view.flxFeedbackTakeSurvey.setVisibility(false);
            this.initializeResponsiveViews();
            this.updateSurveyResponse(true);
        },

        showUserNameSuccessfulMessage: function(context) {
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            if (context.text === "username") {
                CommonUtilities.setText(this.view.logOutMsg.lblLoggedOut, kony.i18n.getLocalizedString("i18n.common.usernamechanged"), accessibilityConfig);
            } else if (context.text === "password") {
                CommonUtilities.setText(this.view.logOutMsg.lblLoggedOut, kony.i18n.getLocalizedString("i18n.common.passwordchanged"), accessibilityConfig);
            }
            this.view.logOutMsg.imgLogoutSuccess.src = ViewConstants.IMAGES.SUCCESS_GREEN;
            this.view.logOutMsg.lblSuccessMsgEBA.setVisibility(false);
            this.view.logOutMsg.forceLayout();
            this.restoreOriginalMainLoginUIChanges();
            this.initializeResponsiveViews();
        },
    };
});