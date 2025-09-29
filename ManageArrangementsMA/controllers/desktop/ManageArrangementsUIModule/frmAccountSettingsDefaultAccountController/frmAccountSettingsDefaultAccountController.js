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
          if(viewModel.showDefaultUserAccounts){
            this.showDefaultUserAccount(viewModel.showDefaultUserAccounts);
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
      applicationManager.getLoggerManager().setCustomMetrics(this, false, "Set Default Account");
      this.view.flxAccountSettingsCollapseMobile.onClick = this.toggleMenuMobile;
      FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxHeader', 'flxFooter', 'flxMain','flxMenuItemMobile']);
      this.view.lblCollapseMobile.text  = "O";
      this.view.customheadernew.activateMenu("Settings","Account Settings");
      this.view.profileMenu.checkLanguage();
      this.view.profileMenu.activateMenu("ACCOUNTSETTINGS","Set Default Account");
      this.setSelectedValue("i18n.ProfileManagement.SetDefaultAccount");
      this.setAccessibility();
      this.view.onBreakpointChange = function() {
        self.onBreakpointChange(kony.application.getCurrentBreakpoint());
      }
     // var configurationManager = applicationManager.getConfigurationManager();
     // if (configurationManager.isFastTransferEnabled == "true") {
         self.view.flxTransfers.setVisibility(false);
         self.view.flxPayAPerson.setVisibility(false);
     // }         
      this.view.btnDefaultTransactionAccountEdit.setVisibility(applicationManager.getConfigurationManager().checkUserPermission("ACCOUNT_SETTINGS_EDIT"));
      this.view.btnDefaultTransactionAccountEdit.toolTip = kony.i18n.getLocalizedString("i18n.billPay.Edit");
      this.view.forceLayout();
    },
    postshow : function(){
      applicationManager.getNavigationManager().applyUpdates(this);
      this.view.lblSelectedDefaultAccounts.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.YouhaveSelectedTheFollowingAccounts");
      this.view.lblTransfersKey.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.Transfers");
      this.view.lblBillPayKey.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.BillPay");
      this.view.lblPayAPersonKey.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.Payaperson");
      this.view.lblCheckDepositKey.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.CheckDeposit");
      this.view.forceLayout();
    },

    /**
	*  Method to set the Accessibility configurations
	*/
    setAccessibility: function(){
      var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
      CommonUtilities.setText(this.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.Accounts.ContextualActions.updateSettingAndPreferences"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblDefaultTransactionAccounttHeading, kony.i18n.getLocalizedString("i18n.ProfileManagement.DefaultTransactionAccounts"), accessibilityConfig);
      CommonUtilities.setText(this.view.lblDefaultTransactionAccountWarning, kony.i18n.getLocalizedString("i18n.ProfileManagement.PleaseChooseTheDefaultAccounts"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblTransfersKey, kony.i18n.getLocalizedString("i18n.profilemanagement.Transfers"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblBillPayKey, kony.i18n.getLocalizedString("i18n.profilemanagement.BillPay"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblPayAPersonKey, kony.i18n.getLocalizedString("i18n.profilemanagement.Payaperson"), accessibilityConfig);
      CommonUtilities.setText(this.view.lblCheckDepositKey, kony.i18n.getLocalizedString("i18n.profilemanagement.CheckDeposit"), accessibilityConfig); 
      CommonUtilities.setText(this.view.btnDefaultTransactionAccountEdit, kony.i18n.getLocalizedString("i18n.billPay.Edit") , CommonUtilities.getaccessibilityConfig());      
      //CommonUtilities.setText(this.view.lblSelectedDefaultAccounts, kony.i18n.getLocalizedString("i18n.ProfileManagement.YouhaveSelectedTheFollowingAccounts") , CommonUtilities.getaccessibilityConfig()); 
      this.view.lblCollapseMobile.accessibilityConfig = {
        "a11yARIA": {
            "tabindex": -1
        }
      };
      this.view.flxAccountSettingsCollapseMobile.accessibilityConfig = {
        "a11yLabel": "Dropdown"
      };
    this.view.lblDefaultTransactionAccounttHeading.accessibilityConfig = {
        "a11yLabel": ""
    };
    this.view.lblSelectedDefaultAccounts.accessibilityConfig = {
        "a11yLabel": ""
    };
    this.view.lblTransfersKey.accessibilityConfig = {
        "a11yLabel": ""
    };
    this.view.lblTransfersValue.accessibilityConfig = {
        "a11yLabel": ""
    };
    this.view.lblBillPayKey.accessibilityConfig = {
        "a11yLabel": ""
    };
    this.view.lblBillPayValue.accessibilityConfig = {
        "a11yLabel": ""
    };
    this.view.lblPayAPersonKey.accessibilityConfig = {
        "a11yLabel": ""
    };
    this.view.lblPayAPersonValue.accessibilityConfig = {
        "a11yLabel": ""
    };
    this.view.lblCheckDepositKey.accessibilityConfig = {
        "a11yLabel": ""
    };
    this.view.lblCheckDepositValue.accessibilityConfig = {
        "a11yLabel": ""
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
      if (CommonUtilities.isCSRMode()) {
              this.view.btnDefaultTransactionAccountEdit.onClick = CommonUtilities.disableButtonActionForCSRMode();
              this.view.btnDefaultTransactionAccountEdit.skin = CommonUtilities.disableButtonSkinForCSRMode();
      } else {
              this.view.btnDefaultTransactionAccountEdit.onClick = this.onEditDefaultAccounts;
      }
    },

  
     /**
       * Method that gets called on click of edit default accounts
       */
      onEditDefaultAccounts: function() {
          var isRetailUser = applicationManager.getConfigurationManager().getConfigurationValue('isRBUser') === "true";
          var scopeObj = this;
          FormControllerUtility.showProgressBar(scopeObj.view);
          var SettingsNewModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageArrangementsUIModule", "appName" : "ManageArrangementsMA"});
          SettingsNewModule.presentationController.getAccountsList(); 
      },

    /**
       * Method to update the module while adding a new phone number
       * @param {Object} addPhoneViewModel- responce from backend after fetching phone number
       */
    showDefaultUserAccount: function(viewModel) {
         // this.view.customheader.customhamburger.activateMenu("Settings", "Account Settings");
          if (viewModel.errorCase === true) {
              this.view.flxDefaultAccountsSelected.setVisibility(false);
              this.view.flxDefaultTransactionAccountWarning.setVisibility(true);
              this.view.lblDefaultTransactionAccountWarning.text = kony.i18n.getLocalizedString("i18n.common.OoopsServerError");
          } else {
              this.view.flxDefaultTransactionAccountWarning.setVisibility(false);
              this.view.lblDefaultTransactionAccountWarning.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.PleaseChooseTheDefaultAccounts");
              this.view.flxDefaultAccountsSelected.setVisibility(true);
              this.showDefaultTransctionAccount(viewModel);
          }
          FormControllerUtility.hideProgressBar(this.view);
    },
   
    /**
       * Method to show UI according to the default account
       * @param {JSON} viewModel list of default accounts for different transactions
       */
      showDefaultTransctionAccount: function(viewModel) {
          var isCombinedUser = applicationManager.getConfigurationManager().getConfigurationValue('isCombinedUser') === "true";
          var count = 0;
          for (var keys in viewModel) {
              if (viewModel[keys] !== 'None') count++;
          }
          if (count !== 0) {
              this.view.flxDefaultTransactionAccountWarning.setVisibility(false);
              this.view.flxDefaultAccountsSelected.setVisibility(true);
          } else {
              this.view.flxDefaultTransactionAccountWarning.setVisibility(true);
              this.view.flxDefaultAccountsSelected.setVisibility(false);
          }

        if(isCombinedUser){
          if(viewModel.defaultBillPayAccount!== "None" && viewModel.defaultBillPayAccount !== undefined)
          CommonUtilities.setText(this.view.lblBillPayValue, viewModel.defaultBillPayAccount+ '-XXXX' + viewModel.defaultAccountNum.defaultBillPayAccounts.slice(-4) , CommonUtilities.getaccessibilityConfig());
          else
          CommonUtilities.setText(this.view.lblBillPayValue, kony.i18n.getLocalizedString("i18n.common.none") , CommonUtilities.getaccessibilityConfig());
          if(viewModel.defaultCheckDepositAccount!== "None" && viewModel.defaultCheckDepositAccount !== undefined)
          CommonUtilities.setText(this.view.lblCheckDepositValue, viewModel.defaultCheckDepositAccount +'-XXXX' + viewModel.defaultAccountNum.defaultCheckDepositAccounts.slice(-4)  , CommonUtilities.getaccessibilityConfig());
          else
          CommonUtilities.setText(this.view.lblCheckDepositValue, kony.i18n.getLocalizedString("i18n.common.none") , CommonUtilities.getaccessibilityConfig());
          this.getFontIconsForAccount(viewModel);
        } 
        else{
          if(viewModel.defaultTransferAccount!== "None" && viewModel.defaultTransferAccount !== undefined)
          CommonUtilities.setText(this.view.lblTransfersValue, viewModel.defaultTransferAccount+ '-XXXX' + viewModel.defaultAccountNum.defaultTransfersAccounts.slice(-4), CommonUtilities.getaccessibilityConfig());
          else
          CommonUtilities.setText(this.view.lblTransfersValue, kony.i18n.getLocalizedString("i18n.common.none") , CommonUtilities.getaccessibilityConfig());
          if(viewModel.defaultBillPayAccount!== "None" && viewModel.defaultBillPayAccount !== undefined)
          CommonUtilities.setText(this.view.lblBillPayValue, viewModel.defaultBillPayAccount+ '-XXXX' + viewModel.defaultAccountNum.defaultBillPayAccounts.slice(-4) , CommonUtilities.getaccessibilityConfig());
          else
          CommonUtilities.setText(this.view.lblBillPayValue, kony.i18n.getLocalizedString("i18n.common.none") , CommonUtilities.getaccessibilityConfig());
          if(viewModel.defaultP2PAccount!== "None" && viewModel.defaultP2PAccount !== undefined)
          CommonUtilities.setText(this.view.lblPayAPersonValue, viewModel.defaultP2PAccount+ '-XXXX' + viewModel.defaultAccountNum.defaultP2PAccounts.slice(-4), CommonUtilities.getaccessibilityConfig());
          else
          CommonUtilities.setText(this.view.lblPayAPersonValue, kony.i18n.getLocalizedString("i18n.common.none") , CommonUtilities.getaccessibilityConfig());
          if(viewModel.defaultCheckDepositAccount!== "None" && viewModel.defaultCheckDepositAccount !== undefined)
          CommonUtilities.setText(this.view.lblCheckDepositValue, viewModel.defaultCheckDepositAccount +'-XXXX' + viewModel.defaultAccountNum.defaultCheckDepositAccounts.slice(-4)  , CommonUtilities.getaccessibilityConfig());
          else
          CommonUtilities.setText(this.view.lblCheckDepositValue, kony.i18n.getLocalizedString("i18n.common.none") , CommonUtilities.getaccessibilityConfig());     
       }	
      },

   /**
       * Method to get Font Icons For Account
       * @param {JSON} fromAccount Account information
       * @returns void
       */
    getFontIconsForAccount : function(viewModel) {
      this.view.lblTransfersIcon.setVisibility(false);
      this.view.lblBillPayIcon.setVisibility(false);
      this.view.lblPayAPersonIcon.setVisibility(false);
      this.view.lblCheckDepositIcon.setVisibility(false);
      this.accountDataStore = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AccountsModule").presentationController.accounts;
      
      if(kony.sdk.isNullOrUndefined(this.accountDataStore)) return;
      if(kony.sdk.isNullOrUndefined(viewModel)) return;

      var businessAccountList = [];
      var personalAccountList = [];
      var accountData = cloneJSON(this.accountDataStore);
      var len = accountData.length;
      var i;

      for(i = 0; i < len; i++) {
        if(accountData[i]["isBusinessAccount"] === "true") {
          businessAccountList.push(cloneJSON(accountData[i]["accountName"]));
          businessAccountList.push(cloneJSON(accountData[i]["nickName"]));
        }
        else {
          personalAccountList.push(cloneJSON(accountData[i]["accountName"]));
          personalAccountList.push(cloneJSON(accountData[i]["nickName"]));
        }
      }

      if(!kony.sdk.isNullOrUndefined(viewModel.defaultTransferAccount)) {
        this.view.lblTransfersIcon.setVisibility(true);
        this.view.lblTransfersIcon.text = this.getAcccountIconByType(businessAccountList, personalAccountList, viewModel.defaultTransferAccount);
      }
      if(!kony.sdk.isNullOrUndefined(viewModel.defaultBillPayAccount)) {
        this.view.lblBillPayIcon.setVisibility(true);
        this.view.lblBillPayIcon.text = this.getAcccountIconByType(businessAccountList, personalAccountList, viewModel.defaultBillPayAccount);
      }
      if(!kony.sdk.isNullOrUndefined(viewModel.defaultP2PAccount)) {
        this.view.lblPayAPersonIcon.setVisibility(true);
        this.view.lblPayAPersonIcon.text = this.getAcccountIconByType(businessAccountList, personalAccountList, viewModel.defaultP2PAccount);
      }
      if(!kony.sdk.isNullOrUndefined(viewModel.defaultCheckDepositAccount)) {
        this.view.lblCheckDepositIcon.setVisibility(true);
        this.view.lblCheckDepositIcon.text = this.getAcccountIconByType(businessAccountList, personalAccountList, viewModel.defaultCheckDepositAccount);
      }
    },
    
    /**
       * Method to get account Icon By Type
       * @param {JSON} fromAccount Account information
       * @returns void
       */
    getAcccountIconByType : function (businessAccountList, personalAccountList, accountName){
      if(businessAccountList.includes(accountName)) return "r";
      if(personalAccountList.includes(accountName)) return "s";
      return "";
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
        CommonUtilities.setText(this.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.Accounts.ContextualActions.updateSettingAndPreferences"), accessibilityConfig);
      }
      this.view.forceLayout();
    },

  };
});