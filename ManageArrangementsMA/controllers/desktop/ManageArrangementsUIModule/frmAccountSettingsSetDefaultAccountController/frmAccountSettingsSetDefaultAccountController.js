define(["CommonUtilities", "FormControllerUtility", "OLBConstants", "ViewConstants"], function(CommonUtilities, FormControllerUtility, OLBConstants, ViewConstants) {
  var orientationHandler = new OrientationHandler();
  var responsiveUtils = new ResponsiveUtils();
  return{ 
    defaultNames : {},
    enableSeparateContact : false,
    updateFormUI: function(viewModel) {
      if (viewModel !== undefined) {
        if (viewModel.serverError) {
          this.showServerError(viewModel.serverError);
        } else {
          if (viewModel.isLoading !== undefined) {
            this.changeProgressBarState(viewModel.isLoading);
          }
          if(viewModel.getAccountsList){
            this.showAccountsList(viewModel.getAccountsList);
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
      this.primaryCustomerId = applicationManager.getUserPreferencesManager().primaryCustomerId;  
      this.view.btnDefaultTransactionAccountSave.toolTip = kony.i18n.getLocalizedString("i18n.ProfileManagement.Save");
      this.view.btnDefaultTransactionAccountCancel.toolTip = kony.i18n.getLocalizedString("i18n.transfers.Cancel");
      /*this.view.imgDefaultTransactionAccountWarning.accessibilityConfig = {
            "a11yARIA": 
            {
                "tabindex" : -1
            }
        };  */
      this.view.forceLayout();
    },
   
    postshow : function(){
      applicationManager.getNavigationManager().applyUpdates(this);
      this.view.lblDefaultTransactionAccountWarning.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.PleaseChooseTheDefaultAccounts");
      this.view.lblTransfersKey.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.Transfers");
      this.view.lblBillPayKey.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.BillPay");
      this.view.lblPayAPersonKey.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.Payaperson");
      this.view.lblCheckDepositKey.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.CheckDeposit");
      this.view.forceLayout();
    },
    showServerError : function(){
      FormControllerUtility.hideProgressBar(this.view);
      this.view.lblDefaultTransactionAccountWarning.text = kony.i18n.getLocalizedString("i18n.common.OoopsServerError");             
    },
    /**
	*  Method to set the Accessibility configurations
	*/
    setAccessibility: function(){
      var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
      CommonUtilities.setText(this.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.Accounts.ContextualActions.updateSettingAndPreferences"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblDefaultTransactionAccounttHeading, kony.i18n.getLocalizedString("i18n.ProfileManagement.DefaultTransactionAccounts"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblDefaultTransactionAccountWarning, kony.i18n.getLocalizedString("i18n.ProfileManagement.PleaseChooseTheDefaultAccounts"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblTransfersKey, kony.i18n.getLocalizedString("i18n.profilemanagement.Transfers"), accessibilityConfig);
      CommonUtilities.setText(this.view.lblBillPayKey, kony.i18n.getLocalizedString("i18n.profilemanagement.BillPay"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblPayAPersonKey, kony.i18n.getLocalizedString("i18n.profilemanagement.Payaperson"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblCheckDepositKey, kony.i18n.getLocalizedString("i18n.profilemanagement.CheckDeposit"), accessibilityConfig); 
      CommonUtilities.setText(this.view.btnDefaultTransactionAccountSave, kony.i18n.getLocalizedString("i18n.ProfileManagement.Save") , CommonUtilities.getaccessibilityConfig());      
      CommonUtilities.setText(this.view.btnDefaultTransactionAccountCancel, kony.i18n.getLocalizedString('i18n.transfers.Cancel') , CommonUtilities.getaccessibilityConfig());
      this.view.lblBillPayAccountsDropdown.accessibilityConfig = {
             "a11yLabel":kony.i18n.getLocalizedString("i18n.profilemanagement.viewMyAccounts")          
      };
      this.view.lblCheckDepositAccountsDropdown.accessibilityConfig = {
             "a11yLabel":kony.i18n.getLocalizedString("i18n.profilemanagement.viewMyAccounts")          
      };
      this.view.lblCollapseMobile.accessibilityConfig = {
        "a11yARIA": {
            "tabindex": -1
        }
      };
      this.view.flxAccountSettingsCollapseMobile.accessibilityConfig = {
        "a11yLabel": "Dropdown"
      };
      this.view.imgDefaultTransactionAccountWarning.accessibilityConfig = {
        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.SetDefaultAccount") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info"),
        "a11yARIA": {
            "tabindex": -1
        }
      };
      this.view.lblDefaultTransactionAccounttHeading.accessibilityConfig = {
        "a11yLabel": ""
    };
    this.view.lblDefaultTransactionAccountWarning.accessibilityConfig = {
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
    this.view.lblCheckDepositAccountName.accessibilityConfig = {
        "a11yLabel": ""
    };
    this.view.lblPayAPersonValue.accessibilityConfig = {
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
       * Method to show the list of accounts
       * @param {Object} viewModel Model containing list of accounts related to transactions
       */
    showAccountsList: function(viewModel) {
      var self = this;
      var isCombinedUser = applicationManager.getConfigurationManager().getConfigurationValue('isCombinedUser') === "true";
      var isSMEUser = applicationManager.getConfigurationManager().getConfigurationValue('isSMEUser') === "true";
      var configurationManager = applicationManager.getConfigurationManager();
      this.defaultNames = viewModel.defaultNames;
      // if (configurationManager.isFastTransferEnabled == "true") {
         self.view.flxTransfers.setVisibility(false);
         self.view.flxPayAPerson.setVisibility(false);
//       }else{
//          self.view.flxTransfers.setVisibility(true);
//          self.view.flxPayAPerson.setVisibility(true);
//          if(viewModel.defaultNames.defaultTransferAccount!== "None" && viewModel.defaultNames.defaultTransferAccount != undefined)
//          self.view.lblTransfersValue.text = viewModel.defaultNames.defaultTransferAccount+ '-XXXX' + viewModel.defaultTransfersAccounts.slice(-4);
//          else
//          self.view.lblTransfersValue.text = kony.i18n.getLocalizedString("i18n.common.none");
//          if(viewModel.defaultNames.defaultP2PAccount!== "None" && viewModel.defaultNames.defaultTransferAccount != undefined)
//          self.view.lblPayAPersonValue.text = viewModel.defaultNames.defaultP2PAccount+ '-XXXX' + viewModel.defaultP2PAccounts.slice(-4);    
//          else
//          self.view.lblPayAPersonValue.text = kony.i18n.getLocalizedString("i18n.common.none");
//       }
        this.view.flxBillPaySelectedValue.setVisibility(true);
        this.view.lblBillPayAccountsDropdown.text = "O";
        this.view.flxBillPayAccounts.setVisibility(false);
        this.view.flxBillPaySelectedValue.onClick = this.onBillPayClick.bind(this);
        this.setBillPayAccountsData(viewModel.BillPayAccounts,viewModel.defaultBillPayAccounts);
        this.view.flxCheckDepositSelectedValue.setVisibility(true);
        this.view.lblCheckDepositAccountsDropdown.text = "O";
        this.view.flxCheckDepositAccounts.setVisibility(false);
        this.view.flxCheckDepositSelectedValue.onClick = this.onCheckDepositClick.bind(this);
        this.view.lblCheckDepositAccountIcon.isVisible = isCombinedUser ? true : false;
        this.checkDepositAccounts = [];
        if (!(kony.sdk.isNullOrUndefined(viewModel.CheckDepositAccounts))) {
            this.setCheckDepositAccountsData(viewModel.CheckDepositAccounts,viewModel.defaultCheckDepositAccounts);
        }
        this.defaultBillPayAccounts = viewModel.defaultBillPayAccounts;
        this.defaultCheckDepositAccounts = viewModel.defaultCheckDepositAccounts;
        if(viewModel.defaultNames.defaultBillPayAccount!== "None" && viewModel.defaultNames.defaultBillPayAccount != undefined)
        this.view.lblBillPayAccountName.text = viewModel.defaultNames.defaultBillPayAccount + '-XXXX' + viewModel.defaultBillPayAccounts.slice(-4);
        else
        this.view.lblBillPayAccountName.text = kony.i18n.getLocalizedString("i18n.common.none");
        if(viewModel.defaultNames.defaultCheckDepositAccount!== "None" && viewModel.defaultNames.defaultCheckDepositAccount != undefined)
        this.view.lblCheckDepositAccountName.text = viewModel.defaultNames.defaultCheckDepositAccount + '-XXXX' + viewModel.defaultCheckDepositAccounts.slice(-4);
        else
        this.view.lblCheckDepositAccountName.text = kony.i18n.getLocalizedString("i18n.common.none");
        this.view.lblBillPayAccountIcon.text = this.view.lblBillPayIcon.text;
        this.view.lblCheckDepositAccountIcon.text = this.view.lblCheckDepositIcon.text;                
      this.view.forceLayout();
      FormControllerUtility.hideProgressBar(this.view);
    },

    /**
       * Method to get account in Format AccountName-XXXX1234
       * @param {JSON} fromAccount Account information
       * @returns Array with account id and display name in format AccountName-XXXX1234
       */
    generateFromAccounts: function(fromAccount) {
      var getAccountDisplayName = function(fromAccount) {
        return fromAccount.accountName + '-XXXX' + fromAccount.accountID.slice(-4);
      };
      return [fromAccount.accountID, getAccountDisplayName(fromAccount)];
    },
    onBillPayClick: function(){
      var self = this;
      if(self.view.lblBillPayAccountsDropdown.text === "P"){
        self.view.lblBillPayAccountsDropdown.text = "O";
      } else{
        self.view.lblBillPayAccountsDropdown.text = "P"
      }
      this.view.flxBillPayAccounts.setVisibility(!this.view.flxBillPayAccounts.isVisible);
      this.view.lblCheckDepositAccountsDropdown.text = "O";
      this.view.flxCheckDepositAccounts.setVisibility(false);
    },
    onCheckDepositClick: function(){
      var self = this;
      if(self.view.lblCheckDepositAccountsDropdown.text === "P"){
        self.view.lblCheckDepositAccountsDropdown.text = "O";
      } else{
        self.view.lblCheckDepositAccountsDropdown.text = "P"
      }
      this.view.lblBillPayAccountsDropdown.text = "O";
      this.view.flxBillPayAccounts.setVisibility(false);
      this.view.flxCheckDepositAccounts.setVisibility(!this.view.flxCheckDepositAccounts.isVisible);
    },

    
        setBillPayAccountsData: function(accounts,defaultBillPayAccountNum) {
            var self = this;
            var isCombinedUser = applicationManager.getConfigurationManager().isCombinedUser === "true";
            var isSingleCustomerProfile = applicationManager.getUserPreferencesManager().isSingleCustomerProfile;
            var dataMap = {
                "lblDefaultAccountIcon": "lblDefaultAccountIcon",
                "lblDefaultAccountName": "lblDefaultAccountName",
                "accountId": "accountId",
                "flxAccountRoleType": "flxAccountRoleType",
                "lblAccountRoleType": "lblAccountRoleType",
                "lblAccountTypeHeader": "lblAccountTypeHeader",
                "flxDefaultAccountsHeader": "flxDefaultAccountsHeader"
            };
            this.billPayAccounts = accounts;
            var billPayAccountswithPermission = []; 
            if(accounts!=""){
              accounts.forEach(function(account) {
                if(account.actions.indexOf("\"BILL_PAY_CREATE\"")>0){
                  billPayAccountswithPermission.push(account);
                }
              });
            }else{
               billPayAccountswithPermission=accounts;
            }
            this.view.segBillPayAccounts.widgetDataMap = dataMap;
            //this.view.lblBillPayAccountIcon.isVisible = isCombinedUser?true:false;
            if (billPayAccountswithPermission.length !== 0) {
                var data = this.getDropdownDataWithSections(billPayAccountswithPermission);
                this.view.segBillPayAccounts.setData(data);
                this.view.segBillPayAccounts.rowTemplate = "flxRowDefaultAccounts";
                this.view.segBillPayAccounts.onRowClick = this.onBillPayAccountSelect.bind(this);
            } else {
                this.view.flxBillPayValue.setVisibility(true);
                if(this.defaultNames.defaultBillPayAccount!== "None" && this.defaultNames.defaultBillPayAccount != undefined)
                this.view.lblBillPayValue.text = this.defaultNames.defaultBillPayAccount+'-XXXX'+defaultBillPayAccountNum.slice(-4);
                else
                this.view.lblBillPayValue.text = kony.i18n.getLocalizedString("i18n.common.none");
                this.view.flxBillPaySelectedValue.setVisibility(false);
            }
            CommonUtilities.setText(self.view.lblBillPayValue,self.view.lblBillPayValue.text, CommonUtilities.getaccessibilityConfig());
            this.view.lblBillPayAccountIcon.isVisible = this.profileAccess === "both" ? true : false;
            this.view.forceLayout();
        },
        setCheckDepositAccountsData: function(accounts,defaultCheckDepositAccountNum) {
            var self = this;
            //var isCombinedUser = applicationManager.getConfigurationManager().isCombinedUser==="true";
            var isSingleCustomerProfile = applicationManager.getUserPreferencesManager().isSingleCustomerProfile;
            var data;
            var dataMap = {
                "lblDefaultAccountIcon": "lblDefaultAccountIcon",
                "lblDefaultAccountName": "lblDefaultAccountName",
                "accountId": "accountId",
                "flxAccountRoleType": "flxAccountRoleType",
                "lblAccountRoleType": "lblAccountRoleType",
                "lblAccountTypeHeader": "lblAccountTypeHeader",
                "flxDefaultAccountsHeader": "flxDefaultAccountsHeader"
            };
            this.checkDepositAccounts = accounts;
            var checkDepositAccountswithPermission = [];
            if(accounts!=""){
              accounts.forEach(function(account) {
                  if (account.actions.indexOf("RDC") > 0) {
                      checkDepositAccountswithPermission.push(account);
                  }
              });
            }else{
               checkDepositAccountswithPermission=accounts;
            }
            this.view.segCheckDepositAccounts.widgetDataMap = dataMap;
            if (checkDepositAccountswithPermission.length !== 0) {
                data = this.getDropdownDataWithSections(checkDepositAccountswithPermission);
                this.view.segCheckDepositAccounts.setData(data);
                this.view.segCheckDepositAccounts.rowTemplate = "flxRowDefaultAccounts";
                this.view.segCheckDepositAccounts.onRowClick = this.onCheckDepositAccountSelect.bind(this);
            } else {
                this.view.flxCheckDepositValue.setVisibility(true);
                if(this.defaultNames.defaultCheckDepositAccount!== "None" && this.defaultNames.defaultCheckDepositAccount != undefined)
                this.view.lblCheckDepositValue.text = this.defaultNames.defaultCheckDepositAccount+'-XXXX' + defaultCheckDepositAccountNum.slice(-4);
                else
                this.view.lblCheckDepositValue.text = kony.i18n.getLocalizedString("i18n.common.none");
              this.view.flxCheckDepositSelectedValue.setVisibility(false);
              CommonUtilities.setText(self.view.lblCheckDepositValue,self.view.lblCheckDepositValue.text, CommonUtilities.getaccessibilityConfig());
            
            }

            //this.view.lblCheckDepositAccountIcon.isVisible = isCombinedUser?true:false;
            this.view.lblCheckDepositAccountIcon.isVisible = this.profileAccess === "both" ? true : false;
            this.view.forceLayout();
        },
        onBillPayAccountSelect: function() {
            //var isCombinedUser = applicationManager.getConfigurationManager().isCombinedUser==="true";
            var isSingleCustomerProfile = applicationManager.getUserPreferencesManager().isSingleCustomerProfile;
            var account = this.view.segBillPayAccounts.selectedRowItems[0];
            this.view.lblBillPayAccountIcon.text = account.lblDefaultAccountIcon.text;
            this.view.lblBillPayAccountName.text = account.lblDefaultAccountName;
            //this.view.lblBillPayAccountIcon.isVisible = isCombinedUser?true:false;
            this.view.lblBillPayAccountIcon.isVisible = this.profileAccess === "both" ? true : false;
            this.view.lblBillPayAccountsDropdown.text = "O";
            this.view.flxBillPayAccounts.setVisibility(false);
        },
        onCheckDepositAccountSelect: function() {
            var isSingleCustomerProfile = applicationManager.getUserPreferencesManager().isSingleCustomerProfile;
            //var isCombinedUser = applicationManager.getConfigurationManager().isCombinedUser==="true";
            var account = this.view.segCheckDepositAccounts.selectedRowItems[0];
            this.view.lblCheckDepositAccountIcon.text = account.lblDefaultAccountIcon.text;
            this.view.lblCheckDepositAccountName.text = account.lblDefaultAccountName;
            //this.view.lblCheckDepositAccountIcon.isVisible = isCombinedUser?true:false;
            this.view.lblCheckDepositAccountIcon.isVisible = this.profileAccess === "both" ? true : false;
            this.view.lblCheckDepositAccountsDropdown.text = "O";
            this.view.flxCheckDepositAccounts.setVisibility(false);
        },
    getDropdownDataWithSections: function(accounts) {
            var scopeObj = this;
            var finalData = {};
            var prioritizeAccountTypes = [];
            var business = kony.i18n.getLocalizedString("i18n.accounts.Business");
            var personal = kony.i18n.getLocalizedString("i18n.accounts.Personal");
            var isSingleCustomerProfile = applicationManager.getUserPreferencesManager().isSingleCustomerProfile;
            accounts.forEach(function(account) {
                if (isSingleCustomerProfile) {
                    var accountType = applicationManager.getTypeManager().getAccountType(account.accountType);
                    if (finalData.hasOwnProperty(accountType)) {
                        finalData[accountType][1].push(scopeObj.createSegmentData(account));
                    } else {
                        finalData[accountType] = [{
                                flxAccountRoleType: {
                                    "isVisible": false
                                },
                                lblAccountTypeHeader: {
                                    "text": accountType, //=== "Personal Accounts" ? accountType : account.MembershipName,
                                    "left": "10px"
                                },
                                template: "flxDefaultAccountsHeader"
                            },
                            [scopeObj.createSegmentData(account)]
                        ];
                    }
                    this.sectionData = [];
                    var data = [];
                    for (var key in prioritizeAccountTypes) {
                        var accountType = prioritizeAccountTypes[key];
                        if (finalData.hasOwnProperty(accountType)) {
                            data.push(finalData[accountType]);
                            this.sectionData.push(accountType);
                        }
                    }
                    for (i = 0; i < data.length; i++) {
                        var sortedData = data[i][1];
                        if (!this.isFavAccAvailable) this.isFavAccAvailable = sortedData.filter(this.isFavourite).length > 0;
                        if (!this.isExtAccAvailable) this.isExtAccAvailable = sortedData.filter(this.isExternal).length > 0;
                    }
                } else {
                    var accountType = personal;
                    var accountTypeIcon = "";
                    if (account.isBusinessAccount === "false") {
                        if (scopeObj.primaryCustomerId.id === account.Membership_id && scopeObj.primaryCustomerId.type === 'personal') {
                            accountType = "Personal Accounts";
                            accountTypeIcon = "s";
                        } else {
                            accountType = account.Membership_id;
                            accountTypeIcon = "s";
                        }
                    } else {
                        accountType = account.Membership_id;
                        accountTypeIcon = "r";
                    }
                    if (finalData.hasOwnProperty(accountType) && account.Membership_id === finalData[accountType][0]["membershipId"]) {
                        if (finalData[accountType][1][finalData[accountType][1].length - 1].length === 0) {
                            finalData[accountType][1].pop();
                        }
                        finalData[accountType][1].push(scopeObj.createSegmentData(account));
                    } else {
                        prioritizeAccountTypes.push(accountType);
                        finalData[accountType] = [{
                                flxAccountRoleType: {
                                    "isVisible": false
                                },
                                //lblAccountRoleType: accountType === personal ? "s" : "r",
                                flxAccountRoleType: {isVisible : false},
                                lblAccountTypeHeader: {
                                    "text": accountType === "Personal Accounts" ? accountType : account.MembershipName,
                                    "left": "20px"
                                },
                                membershipId: account.Membership_id,
                                template: "flxDefaultAccountsHeader"
                            },
                            [scopeObj.createSegmentData(account)]
                        ];
                    }
                }
            });

            return this.sortAccountData(finalData);
        },
    createSegmentData: function(account) {
            var processedAccountName = this.generateFromAccounts(account);
            var isSingleCustomerProfile = applicationManager.getUserPreferencesManager().isSingleCustomerProfile;
            var businessUser = applicationManager.getConfigurationManager().isSMEUser === "true"
            var dataObject = {
                "lblDefaultAccountName": processedAccountName[1],
                "accountID": account.Account_id || account.accountID || account.accountNumber,
                "lblDefaultAccountIcon": {
                    isVisible: !isSingleCustomerProfile && this.profileAccess === "both" ? true : false,
                    left: !isSingleCustomerProfile && this.profileAccess === "both" ? "20px" : "10px",
                    text: account.isBusinessAccount === "true" ? "r" : "s",
                }

            };
            return dataObject;
        },

     sortAccountData: function(finalData) {
            var data = [];
            var prioritizeAccountRoleTypes = [];
            var viewType = applicationManager.getConfigurationManager().getConfigurationValue('combinedDashboardView');

            var sections = Object.keys(finalData);
            var index = sections.indexOf(kony.i18n.getLocalizedString("i18n.accounts.personalAccounts"));
            if (index > -1) {
                sections.splice(index, 1);
            }

            prioritizeAccountRoleTypes.push(kony.i18n.getLocalizedString("i18n.accounts.personalAccounts"));
            prioritizeAccountRoleTypes = prioritizeAccountRoleTypes.concat(sections);

            this.sectionData = [];

            for (var i = 0; i < prioritizeAccountRoleTypes.length; i++) {
                var accountType = prioritizeAccountRoleTypes[i];
                if (finalData.hasOwnProperty(accountType)) {
                    data.push(finalData[accountType]);
                    this.sectionData.push(accountType);
                }
            }


            for (var i = 0; i < data.length; i++) {
                var accoountTypeOrder = applicationManager.getTypeManager().getAccountTypesByPriority();
                var sortedData = data[i][1];
                sortedData.sort(function(a, b) {
                    return accoountTypeOrder.indexOf(a.lblAccountType) - accoountTypeOrder.indexOf(b.lblAccountType);
                });
                data[i][1] = sortedData;

            }

            return data;
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
        scopeObj.view.btnDefaultTransactionAccountSave.onClick = CommonUtilities.disableButtonActionForCSRMode();
        scopeObj.view.btnDefaultTransactionAccountSave.skin = CommonUtilities.disableButtonSkinForCSRMode();
      } else {
        scopeObj.view.btnDefaultTransactionAccountSave.onClick = scopeObj.onSaveDefaultAccounts;
      }
      this.view.btnDefaultTransactionAccountCancel.onClick = this.onCancelDefaultAccounts;
   	this.view.flxMain.onClick = this.onRightFlexClick;
		
        },
		onRightFlexClick : function(){
			if(this.view.flxBillPayAccounts.isVisible){
                this.view.lblBillPayAccountsDropdown.text = "O";
				this.view.flxBillPayAccounts.setVisibility(false);
			}
        if(this.view.flxCheckDepositAccounts.isVisible){
            this.view.lblCheckDepositAccountsDropdown.text = "O";
			this.view.flxCheckDepositAccounts.setVisibility(false);
		}
		},
    /**
       * Method that gets called on click of cancel default accounts
       */
    onCancelDefaultAccounts: function() {
      applicationManager.getNavigationManager().navigateTo("frmAccountSettingsDefaultAccount");
    },

    /**
       * Method that gets called on click of save default accounts
       */
    onSaveDefaultAccounts: function() {
        var isRetailUser = applicationManager.getConfigurationManager().getConfigurationValue('isRBUser') === "true";
            var scopeObj = this;
            FormControllerUtility.showProgressBar(scopeObj.view);
                var defaultAccounts = {
                    default_account_billPay: (scopeObj.view.segBillPayAccounts.selectedRowItems.length > 0) ? scopeObj.view.segBillPayAccounts.selectedRowItems[0].accountID : (this.defaultBillPayAccounts!="undefined"?this.defaultBillPayAccounts:''),
                    default_account_deposit: (scopeObj.view.segCheckDepositAccounts.selectedRowItems.length > 0) ? scopeObj.view.segCheckDepositAccounts.selectedRowItems[0].accountID : this.defaultCheckDepositAccounts
                };
                if ((scopeObj.view.flxTransfers.isVisible && defaultAccounts.default_account_transfers === "undefined") ||
                    (scopeObj.view.flxBillPay.isVisible && defaultAccounts.default_account_billPay === "undefined") ||
                    (scopeObj.view.flxPayAPerson.isVisible && defaultAccounts.default_from_account_p2p === "undefined") ||
                    (scopeObj.view.flxCheckDeposit.isVisible && defaultAccounts.default_account_deposit === "undefined")) {
                    scopeObj.view.lblDefaultTransactionAccountWarning.text = kony.i18n.getLocalizedString("i18n.profile.defaultAccountToBlank");
                    scopeObj.view.forceLayout();
                    FormControllerUtility.hideProgressBar(scopeObj.view);
                 }else{
                    kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageArrangementsUIModule", "appName" : "ManageArrangementsMA"}).presentationController.saveDefaultAccounts(defaultAccounts);
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
        CommonUtilities.setText(this.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.Accounts.ContextualActions.updateSettingAndPreferences"), accessibilityConfig);
      }
      this.view.forceLayout();
    },
  };
});