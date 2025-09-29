define(['CommonUtilities', 'FormControllerUtility', 'OLBConstants', 'ViewConstants'], function(CommonUtilities, FormControllerUtility, OLBConstants, ViewConstants) {
    var orientationHandler = new OrientationHandler();
    return {
        updateFormUI: function(context) {
            if (context.TnCcontent) {
                this.setTnCDATASection(context.TnCcontent);
            }
            if (context.error) {
                this.showError(context.error);
            }
        },
        preShow: function() {
            CommonUtilities.disableButton(this.view.btnProceed);
            this.view.lblFavoriteEmailCheckBox.text = OLBConstants.FONT_ICONS.CHECBOX_UNSELECTED;
            //this.view.flxCloseFontIconParent.onClick = this.showLoginOnCancel;
            this.view.flxCloseFontIconParent.onClick = this.showLogoutOnCancel;
            this.view.flxMain.skin = ViewConstants.SKINS.LOGIN_MAIN_BAKGROUND;
            this.view.flxFooterMenu.setVisibility(false);
        },
        postShow: function() {
            applicationManager.getNavigationManager().applyUpdates(this);
            this.view.lblCopyright.setVisibility(false);
        },
        initActions: function() {
            FormControllerUtility.setRequestUrlConfig(this.view.brwBodyTnC);
            this.view.flxClose.onClick = this.hideTermsAndConditionPopUp;
            this.view.btnVeiwMore.onClick = function() {
                var config = applicationManager.getConfigurationManager();
                kony.application.openURL(config.getConfigurationValue("LINK_TO_DBX"));
            };
            this.view.btnProceed.onClick = this.agreeTnc;
            this.view.lblFavoriteEmailCheckBox.onTouchEnd = this.toggleTnC.bind(this, this.view.lblFavoriteEmailCheckBox);
        },
        /*showLoginOnCancel: function() {
            var authModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AuthUIModule");
            authModule.presentationController.showLoginScreen();
        },*/
        showLogoutOnCancel: function() {
            var authModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AuthUIModule");
            authModule.presentationController.onTnCNotSelect();
        },
        showTermsAndConditionPopUp: function() {
            this.view.flxTermsAndConditions.setVisibility(true);
        },
        hideTermsAndConditionPopUp: function() {
            this.view.flxTermsAndConditions.setVisibility(false);
        },
        setTnCDATASection: function(content) {
            this.view.lblWrongInformation.setVisibility(false);
            if (content.contentTypeId === OLBConstants.TERMS_AND_CONDITIONS_URL) {
                this.view.btnTandC.onClick = function() {
                    window.open(content.termsAndConditionsContent);
                }
            } else {
                this.view.btnTandC.onClick = this.showTermsAndConditionPopUp;
                this.view.rtxTC.text = content.termsAndConditionsContent;
                FormControllerUtility.setHtmlToBrowserWidget(this, this.view.brwBodyTnC, content.termsAndConditionsContent);
            }
            this.view.forceLayout();
            FormControllerUtility.hideProgressBar(this.view)
        },
        toggleTnC: function(widget) {
            CommonUtilities.toggleFontCheckbox(widget);
            if (widget.text === OLBConstants.FONT_ICONS.CHECBOX_UNSELECTED) {
                CommonUtilities.disableButton(this.view.btnProceed);
                widget.skin = OLBConstants.SKINS.CHECKBOX_UNSELECTED_SKIN
            } else {
                CommonUtilities.enableButton(this.view.btnProceed);
                widget.skin = OLBConstants.SKINS.CHECKBOX_SELECTED_SKIN
            }

        },
        agreeTnc: function() {
            FormControllerUtility.showProgressBar(this.view);
            var termsAndConditionModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("TermsAndConditionsUIModule");
            termsAndConditionModule.presentationController.createTnC(OLBConstants.TNC_FLOW_TYPES.Login_TnC);
        },
        showError: function(error) {
            this.view.lblWrongInformation.setVisibility(true);
            this.view.lblWrongInformation.text = error.errorMessage;
            FormControllerUtility.hideProgressBar(this.view);
            this.view.forceLayout();
        }
    };
});