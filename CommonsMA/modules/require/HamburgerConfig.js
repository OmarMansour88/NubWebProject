/* eslint require-jsdoc: 0,
          olblint/enforce-i18n: 0,
          olblint/image-names: 0
*/
define(['FormControllerUtility', 'OLBConstants'], function(FormControllerUtility, OLBConstants) {
    var orientationHandler = new OrientationHandler();
    var checkUserFeature = function(feature) {
        return applicationManager.getConfigurationManager().checkUserFeature(feature);
    }
    var checkAtLeastOneFeaturePresent = function(features) {
        return features.some(checkUserFeature);
    }

    var checkUserPermission = function(permission) {
        return applicationManager.getConfigurationManager().checkUserPermission(permission);
    }

    var checkAtLeastOnePermission = function(permissions) {
        return permissions.some(checkUserPermission);
    }

    var checkAllPermissions = function(permissions) {
        return permissions.every(checkUserPermission);
    }

    var widgetsMap = [{
            id: "ACCOUNTS",
            menu: "flxAccountsMenu",
            text: "i18n.topmenu.accounts",
            toolTip: "i18n.topmenu.accounts",
            icon: "a",
			isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.HOMEPAGE) === true
                               || configurationManager.isMicroAppPresent(configurationManager.microappConstants.ACCAGGREGATION) === true || configurationManager.isMicroAppPresent(configurationManager.microappConstants.CARDS) === true
                               || configurationManager.isMicroAppPresent(configurationManager.microappConstants.ARRANGEMENTS) === true || configurationManager.isMicroAppPresent(configurationManager.microappConstants.FINANCEMANAGEMENT) === true)
                                return true;
                            else
                                return false;
            },
            subMenu: {
                children: [{
                        id: "MY ACCOUNTS",
                        text: "i18n.hamburger.myaccounts",
                        toolTip: "i18n.hamburger.myaccounts",
                        onClick: function() {
                            var accountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "AccountsUIModule", "appName" : "HomepageMA"});
                            accountsModule.presentationController.showAccountsDashboard();
                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.HOMEPAGE) === true)
                                return true;
                            else
                                return false;
                        }
                    },
                    {
                        id: "Stop Payment Requests",
                        text: "i18n.olb.chequeManagement.chequeManagement",
                        toolTip: "i18n.olb.chequeManagement.chequeManagement",
                        onClick: function() {
                            var accountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "StopPaymentsUIModule", "appName" : "ArrangementsMA"});  
                            accountsModule.presentationController.showStopPayments();
                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.ARRANGEMENTS) === true) {
                                return checkAtLeastOneFeaturePresent([
                                    "CHEQUE_BOOK_REQUEST",
                                    "STOP_PAYMENT_REQUEST",
                                    "VIEW_CHEQUES"
                                ]);
                            } else {
                                return false;
                            }
                        }
                    },
                    {
                        id: "Open New Account",
                        text: "i18n.WireTransfer.CreateNewAccount",
                        toolTip: "i18n.WireTransfer.CreateNewAccount",
                        onClick: function() {
                              var config = applicationManager.getConfigurationManager();
							  var ssoConfig = config.getSSOConfig();
							  if(ssoConfig!== undefined && ssoConfig.toLowerCase() === "true"){
							    var configurationManager = applicationManager.getConfigurationManager();
								var reDirectionURL = configurationManager.getOnBoardingAppDirectionURL();
								if (reDirectionURL) {
								   location.assign(reDirectionURL);
								} else {
									// Parsing the service url present in appConfig
									var protocol = appConfig.isturlbase.split("//")[0];
									var origin = appConfig.isturlbase.split("//")[1].split("/")[0];
									// Getting the current app name from appDetails
									var appName = appDetails.appID;
									// Redirecting to
									location.assign(protocol + "//" + origin + "/apps/" + configurationManager.getOnboardingAppID() + "#_frmLanding");
							   }
							  }
							  else if(ssoConfig.toLowerCase() === "false")
								{
								 //commenting this snippet as there is no NAO feature yet	
								 /** applicationManager.getNavigationManager().navigateTo("frmNAO");
								  this.presentNAO({
									resetForm: {}
								  });
								  this.getProducts();
								  context = context || {
									NUOLanding: "true"
								  }**/
								}
                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                                if (configurationManager.isSMEUser === "true" || configurationManager.isMBUser === "true")
                                    return false;
                                else
                                    return checkUserFeature("NAO");                                 
                            
                        }
                    },
                    {
                        id: "Add External Bank Accounts",
                        text: "i18n.Hamburger.AddExternalBankAccounts",
                        toolTip: "i18n.Hamburger.AddExternalBankAccounts",
                        onClick: function() {
                            var externalAccountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                                "moduleName": "ExternalAccountsUIModule",
                                "appName": "AccAggregationMA"
                            });
                            externalAccountsModule.presentationController.getBankListForCountry();
                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.ACCAGGREGATION) === true) {
                                if (configurationManager.isRBUser === "true" || configurationManager.isCombinedUser === "true") {
                                    if (checkUserPermission("MANAGE_EXTERNAL_ACCOUNT") && applicationManager.getConfigurationManager().getConfigurationValue('AggregatedExternalAccountEnabled')) {
                                        return true;
                                    }
                                } else
                                    return false;
                            } else
                                return false;
                        }
                    },
                    {
                        id: "Card Management",
                        text: "i18n.hamburger.cardmanagement",
                        toolTip: "i18n.hamburger.cardmanagement",
                        onClick: function() {
							applicationManager.getNavigationManager().navigateTo({"appName": "CardsMA","friendlyName": "frmCardManagement"});
						    kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCardsUIModule", "appName" : "CardsMA"}).presentationController.navigateToManageCards();
                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.CARDS) === true)
                                return checkUserFeature("CARD_MANAGEMENT");
                            else
                                return false;
                        }
                    },
                    {
                        id: "Disputed Transaction",
                        text: "i18n.StopCheckPayments.DisputedTransactions",
                        toolTip: "i18n.StopCheckPayments.DisputedTransactions",
                        onClick: function() {
                            var disputeModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "DisputeTransactionUIModule", "appName" : "ArrangementsMA"});
                            disputeModule.presentationController.showDisputeTransactionModule({
                                show: OLBConstants.ACTION.SHOW_DISPUTE_LIST
                            });
                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.ARRANGEMENTS) === true)
                                return checkUserFeature("DISPUTE_TRANSACTIONS");
                            else
                                return false;

                        }
                    },

                    {
                        id: "PFM",
                        text: "i18n.accounts.PersonalFinanceManagement",
                        toolTip: "i18n.accounts.PersonalFinanceManagement",
                        onClick: function() {
                             var pfmModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                              "moduleName": "PersonalFinanceManagementUIModule",
                              "appName": "FinanceManagementMA"
                            });
                            pfmModule.presentationController.initPFMForm();
                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.FINANCEMANAGEMENT) === true) {
                                return (configurationManager.isRBUser === "true" || configurationManager.isCombinedUser === "true" || checkUserPermission("PERSONAL_FINANCE_MANAGEMENT"));
                            } else
                                return false;
                        }
                    },
                    {
                        id: "Account Statements",
                        text: "i18n.hamburger.accountstatements",
                        toolTip: "i18n.hamburger.accountstatements",
                        onClick: function() {
                            var presenter = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "AccountsUIModule", "appName" : "HomepageMA"});
                            var accounts = presenter.presentationController.accounts;
                            var accountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "AccountsUIModule", "appName" : "ArrangementsMA"});
                            if (accounts !== null && accounts !== undefined && accounts.length > 0) {
                                accountsModule.presentationController.showFormatEstatements(accounts[0]);
                            }
                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.ARRANGEMENTS) === true)
                                return checkAtLeastOnePermission(["VIEW_COMBINED_STATEMENTS", "VIEW_ESTATEMENTS"])
                            else
                                return false;
                        }
                    },
                    {
                        id: "Service Requests",
                        text: "i18n.accounts.ServiceRequest",
                        toolTip: "i18n.accounts.ServiceRequest",
                        onClick: function() {
                            var servModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                                "moduleName": "ServiceRequestsUIModule",
                                "appName": "ArrangementsMA"
                            });
                            servModule.presentationController.initServiceRequests();
                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.ARRANGEMENTS) === true)
                                return true;
                            else
                                return false;
                        }
                    }
                ]

            },
        },
        {
            isVisible: function() {
                var configurationManager = applicationManager.getConfigurationManager();
                if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.REGIONALTRANSFER) === true) {
                    return configurationManager.isFastTransferEnabled === "false" && configurationManager.getDeploymentGeography() !== "EUROPE" && checkAtLeastOneFeaturePresent([
                        "INTERNATIONAL_ACCOUNT_FUND_TRANSFER",
                        "INTER_BANK_ACCOUNT_FUND_TRANSFER",
                        "INTRA_BANK_FUND_TRANSFER",
                        "TRANSFER_BETWEEN_OWN_ACCOUNT"
                    ])
                } else
                    return false;
            },
            id: "TRANSFERS",
            menu: "flxTransfers",
            text: "i18n.hamburger.transfers",
            toolTip: "i18n.hamburger.transfers",
            icon: "t",
            subMenu: {
                parent: "flxTransfersSubMenu",
                children: [{
                    id: "Transfer Money",
                    text: "i18n.billPay.BillPayMakeTransfer",
                    toolTip: "i18n.billPay.BillPayMakeTransfer",
                    isVisible: function() {
                        var configurationManager = applicationManager.getConfigurationManager();
                        if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.REGIONALTRANSFER) === true) {
                            return checkAtLeastOnePermission([
                                "TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE",
                                "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE",
                                "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE",
                                "INTRA_BANK_FUND_TRANSFER_CREATE",
                            ])
                        } else
                            return false;
                    },
                    onClick: function() {
                        applicationManager.getModulesPresentationController("TransferModule").showTransferScreen();
                    },
                }, {
                    id: "Transfer history",
                    text: "i18n.hamburger.transferHistory",
                    toolTip: "i18n.hamburger.transferHistory",
                    isVisible: function() {
                        var configurationManager = applicationManager.getConfigurationManager();
                        if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.REGIONALTRANSFER) === true) {
                            return checkAtLeastOnePermission([
                                "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_VIEW",
                                "INTER_BANK_ACCOUNT_FUND_TRANSFER_VIEW",
                                "INTRA_BANK_FUND_TRANSFER_VIEW",
                                "TRANSFER_BETWEEN_OWN_ACCOUNT_VIEW",
                            ])
                        } else
                            return false;
                    },
                    onClick: function() {
                        applicationManager.getModulesPresentationController("TransferModule").showTransferScreen({
                            initialView: 'recent'
                        })
                    }
                }, {
                    id: "External Accounts",
                    text: "i18n.hamburger.externalAccounts",
                    toolTip: "i18n.hamburger.externalAccounts",
                    onClick: function() {
                        applicationManager.getModulesPresentationController("TransferModule").showTransferScreen({
                            initialView: 'externalAccounts'
                        });
                    },
                    isVisible: function() {
                        var configurationManager = applicationManager.getConfigurationManager();
                        if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.REGIONALTRANSFER) === true) {
                            return checkAtLeastOnePermission([
                                "TRANSFER_BETWEEN_OWN_ACCOUNT_VIEW_RECEPIENT",
                                "INTRA_BANK_FUND_TRANSFER_VIEW_RECEPIENT",
                                "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_VIEW_RECEPIENT"
                            ])
                        } else
                            return false;
                    }
                }, {
                    id: "Add Infinity Accounts",
                    text: "i18n.hamburger.addKonyAccount",
                    toolTip: "i18n.hamburger.addKonyAccount",
                    onClick: function() {
                        applicationManager.getModulesPresentationController("TransferModule").showTransferScreen({
                            initialView: "addInternalAccounts"
                        });
                    },
                    isVisible: function() {
                        var configurationManager = applicationManager.getConfigurationManager();
                            return checkUserPermission("INTRA_BANK_FUND_TRANSFER_CREATE_RECEPIENT");
                        
                    }
                }, {
                    id: "Add Non Kony Accounts",
                    text: "i18n.hamburger.addNonKonyAccount",
                    toolTip: "i18n.hamburger.addNonKonyAccount",
                    onClick: function() {
                        applicationManager.getModulesPresentationController("TransferModule").showTransferScreen({
                            initialView: 'addExternalAccounts'
                        });
                    },
                    isVisible: function() {
                        var configurationManager = applicationManager.getConfigurationManager();
                            return checkAtLeastOnePermission([
                                "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
                                "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
                            ])
                        
                    }
                }]
            },
        },
        {
            isVisible: function() {
                var configurationManager = applicationManager.getConfigurationManager();
                if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.REGIONALTRANSFER) === true) {
                    return configurationManager.isFastTransferEnabled === "true" &&
                        checkAtLeastOneFeaturePresent([
                            "INTERNATIONAL_ACCOUNT_FUND_TRANSFER",
                            "INTER_BANK_ACCOUNT_FUND_TRANSFER",
                            "INTRA_BANK_FUND_TRANSFER",
                            "P2P",
                            "TRANSFER_BETWEEN_OWN_ACCOUNT"
                        ])
                } else
                    return false;
            },
            id: "FASTTRANSFERS",
            menu: "flxTransfers",
            text: "i18n.hamburger.transfers",
            toolTip: "i18n.hamburger.transfers",
            icon: "t",
            subMenu: {
                parent: "flxTransfersSubMenu",
                children: [{
                        id: "Transfer Money",
                        text: "i18n.hamburger.transfer",
                        toolTip: "i18n.hamburger.transfer",
                        onClick: function() {
                            applicationManager.getModulesPresentationController({"appName" : "RegionalTransferMA", "moduleName" : "TransferFastUIModule"}).showTransferScreen();
                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.REGIONALTRANSFER) === true) {
                                return checkAtLeastOnePermission([
                                    "TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE",
                                    "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE",
                                    "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE",
                                    "INTRA_BANK_FUND_TRANSFER_CREATE",
                                    "P2P_CREATE"
                                ])
                            } else
                                return false;
                        }
                    },
                    {
                        id: "Transfer history",
                        text: "i18n.Transfers.TRANSFERACTIVITIES",
                        toolTip: "i18n.Transfers.TRANSFERACTIVITIES",
                        onClick: function() {
                            applicationManager.getModulesPresentationController({"appName" : "RegionalTransferMA", "moduleName" : "TransferFastUIModule"}).getPastPayments();
                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.REGIONALTRANSFER) === true) {
                                return checkAtLeastOnePermission([
                                    "TRANSFER_BETWEEN_OWN_ACCOUNT_VIEW",
                                    "INTRA_BANK_FUND_TRANSFER_VIEW",
                                    "INTER_BANK_ACCOUNT_FUND_TRANSFER_VIEW",
                                    "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_VIEW",
                                    "P2P_VIEW"
                                ])
                            } else
                                return false;
                        }
                    }, {
                        id: "External Accounts",
                        text: "i18n.PayAPerson.ManageRecipient",
                        toolTip: "i18n.PayAPerson.ManageRecipient",
                        onClick: function() {
                            kony.application.showLoadingScreen();
                            applicationManager.getModulesPresentationController({"appName" : "RegionalTransferMA", "moduleName" : "TransferFastUIModule"}).showTransferScreen({
                                showManageRecipients: true
                            });
                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.REGIONALTRANSFER) === true) {
                                return checkAtLeastOnePermission([
                                    "INTER_BANK_ACCOUNT_FUND_TRANSFER_VIEW_RECEPIENT",
                                    "INTRA_BANK_ACCOUNT_FUND_TRANSFER_VIEW_RECEPIENT",
                                    "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_VIEW_RECEPIENT",
                                    "P2P_VIEW_RECEPIENT"
                                ])
                            } else
                                return false;
                        }
                    }, {
                        id: "Add Infinity Accounts",
                        text: "i18n.PayAPerson.AddRecipient",
                        toolTip: "i18n.PayAPerson.AddRecipient",
                        onClick: function() {
                            var addRecipientTransferModule = applicationManager.getModulesPresentationController({"appName" : "RegionalTransferMA", "moduleName" : "TransferFastUIModule"});
                            addRecipientTransferModule.showTransferScreen({
                                showRecipientGateway: true
                            });
                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                                return checkAtLeastOnePermission([
                                    "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
                                    "INTRA_BANK_FUND_TRANSFER_CREATE_RECEPIENT",
                                    "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
                                    "P2P_CREATE_RECEPIENT"
                                ]);
                            
                        }
                    }
                ]
            },
        },
        {
            isVisible: function() {
                var configurationManager = applicationManager.getConfigurationManager();
                if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.REGIONALTRANSFER) === true || configurationManager.isMicroAppPresent(configurationManager.microappConstants.UNIFIEDTRANSFER) === true) {
                    return configurationManager.getDeploymentGeography() === "EUROPE" && checkAtLeastOneFeaturePresent([
                        "INTERNATIONAL_ACCOUNT_FUND_TRANSFER",
                        "INTER_BANK_ACCOUNT_FUND_TRANSFER",
                        "INTRA_BANK_FUND_TRANSFER",
                        "TRANSFER_BETWEEN_OWN_ACCOUNT"
                    ])
                } else
                    return false;
            },
            id: "EUROTRANSFERS",
            menu: "flxTransfers",
            text: "i18n.TransfersEur.PaymentsAndTransfers",
            toolTip: "i18n.TransfersEur.PaymentsAndTransfers",
            icon: "t",
            subMenu: {
                parent: "flxTransfersSubMenu",
                children: [{
                        id: "Make a Payment",
                        text: "i18n.TransfersEur.MakePayment",
                        toolTip: "i18n.TransfersEur.MakePayment",
                        onClick: function() {
                            applicationManager.getModulesPresentationController({"appName" : "RegionalTransferMA", "moduleName" : "TransferEurUIModule"}).showTransferScreen({
                                context: "MakePayment"
                            });
                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.REGIONALTRANSFER) === true) {
                                return checkAtLeastOnePermission([
                                    "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE",
                                    "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE",
                                    "INTRA_BANK_FUND_TRANSFER_CREATE",
                                ])
                            } else
                                return false;
                        }
                    },
                    {
                        id: "Transfer Between Accounts",
                        text: "i18n.TransfersEur.TransferBetweenAccounts",
                        toolTip: "i18n.TransfersEur.TransferBetweenAccounts",
                        onClick: function() {
                            applicationManager.getModulesPresentationController({"appName" : "RegionalTransferMA", "moduleName" : "TransferEurUIModule"}).showTransferScreen({
                                context: "MakePaymentOwnAccounts"
                            });
                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.REGIONALTRANSFER) === true)
                                return checkUserPermission('TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE');
                            else
                                return false;
                        }
                    },
                    {
                        id: "Manage Beneficiaries",
                        text: "i18n.TransfersEur.ManageBeneficiaries",
                        toolTip: "i18n.TransfersEur.ManageBeneficiaries",
                        onClick: function() {
                            applicationManager.getModulesPresentationController({"appName" : "UnifiedTransferMA", "moduleName" : "ManageActivitiesUIModule"}).showTransferScreen({
                                context: "ManageBeneficiaries"
                            });
                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.UNIFIEDTRANSFER) === true)
                                return true;
                            else
                                return false;
                        }
                    }, {
                        id: "Manage Payments",
                        text: "i18n.TransfersEur.ManageTransactions",
                        toolTip: "i18n.TransfersEur.ManageTransactions",
                        onClick: function() {
                            applicationManager.getModulesPresentationController({"appName" : "UnifiedTransferMA", "moduleName" : "ManageActivitiesUIModule"}).showTransferScreen({
                                context: "PastPayments"
                            });
                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.UNIFIEDTRANSFER) === true) {
                                return checkAtLeastOnePermission([
                                    "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_VIEW",
                                    "INTER_BANK_ACCOUNT_FUND_TRANSFER_VIEW",
                                    "INTRA_BANK_FUND_TRANSFER_VIEW",
                                    "TRANSFER_BETWEEN_OWN_ACCOUNT_VIEW",
                                ])
                            } else
                                return false;
                        }
                    }
                ]
            },
        },
        {
            id: "UNIFIEDTRANSFER",
            text: "i18n.UnifiedTransfer.HamburgerMenuTitle",
            toolTip: "i18n.UnifiedTransfer.HamburgerMenuTitle",
            skin: "sknLblFontType0a57b91c10db243",
            icon: "&",
            onClick: function() {
                var navMan = applicationManager.getNavigationManager();
                var configManager = applicationManager.getConfigurationManager();
                var data = applicationManager.getUserPreferencesManager().getUserObj();
                navMan.navigateTo({
                "appName": "UnifiedTransferMA",
                "friendlyName": "frmUTFLanding"
            }, false, data);
            },
            isVisible: function() {
                var configurationManager = applicationManager.getConfigurationManager();
                if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.UNIFIEDTRANSFER) === true) {
                    return (checkAtLeastOnePermission([
                        "INTRA_BANK_FUND_TRANSFER_CREATE",
                        "TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE",
                        "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE",
                        "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE",
                        "P2P_CREATE",
                        "INTRA_BANK_FUND_TRANSFER_CREATE_RECEPIENT",
                        "TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE_RECEPIENT",
                        "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
                        "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
                        "P2P_CREATE_RECEPIENT"
                    ]) && (checkUserFeature("UNIFIED_TRANSFER") && checkUserPermission("UNIFIED_TRANSFER_CREATE")));
                } else
                    return false;
            },
            subMenu: {
                children: []
            }
        },
        {
            isVisible: function() {
                var configurationManager = applicationManager.getConfigurationManager();
                if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.BILLPAY) === true)
                    return checkUserFeature("BILL_PAY");
                else
                    return false;
            },
            id: "Bill Pay",
            text: function() {
                var configurationManager = applicationManager.getConfigurationManager();
                return (configurationManager.isFastTransferEnabled === "true" ? "i18n.Pay.MyBills" : "i18n.billPay.BillPay");
            },
            toolTip: function() {
                var configurationManager = applicationManager.getConfigurationManager();
                return (configurationManager.isFastTransferEnabled === "true" ? "i18n.Pay.MyBills" : "i18n.billPay.BillPay");
            },
            icon: function() {
                var configurationManager = applicationManager.getConfigurationManager();
                return "B";
            },
            subMenu: {
                children: [{
                    id: "Pay a Bill",
                    text: "i18n.hamburger.payABill",
                    toolTip: "i18n.hamburger.payABill",
                    onClick: function() {
                        var billPayModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "BillPayMA", "moduleName" : "BillPaymentUIModule"});
                        if (checkUserPermission("BILL_PAY_BULK"))
                            billPayModule.presentationController.showBillPaymentScreen({
                                context: "BulkPayees",
                                loadBills: true
                            });
                        else
                            billPayModule.presentationController.showBillPaymentScreen({
                                context: "MakeOneTimePayment"
                            });
                    },
                    isVisible: function() {
                        var configurationManager = applicationManager.getConfigurationManager();
                        if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.BILLPAY) === true)
                            return checkUserPermission("BILL_PAY_CREATE");
                        else
                            return false;
                    }
                }, {
                    id: "Bill Pay History",
                    text: "i18n.hamburger.billPayHistory",
                    toolTip: "i18n.hamburger.billPayHistory",
                    onClick: function() {
                        var billPayModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "BillPayMA", "moduleName" : "BillPaymentUIModule"});
                        billPayModule.presentationController.showBillPaymentScreen({
                            context: "History",
                            loadBills: true
                        });
                    },
                    isVisible: function() {
                        var configurationManager = applicationManager.getConfigurationManager();
                        if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.BILLPAY) === true)
                            return checkAtLeastOnePermission(["BILL_PAY_CREATE", "BILL_PAY_VIEW_PAYEES"]);
                        else
                            return false;
                    }
                }, {
                    id: "My Payee List",
                    text: "i18n.hamburger.myPayeeList",
                    toolTip: "i18n.hamburger.myPayeeList",
                    onClick: function() {
                       var billPayModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "BillPayMA", "moduleName" : "BillPaymentUIModule"});
                        billPayModule.presentationController.showBillPaymentScreen({
                            context: "ManagePayees",
                            loadBills: true
                        });
                    },
                    isVisible: function() {
                        var configurationManager = applicationManager.getConfigurationManager();
                        if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.BILLPAY) === true)
                            return checkUserPermission("BILL_PAY_VIEW_PAYEES");
                        else
                            return false;
                    }
                }, {
                    id: "Add Payee",
                    text: "i18n.billPay.addPayee",
                    toolTip: "i18n.billPay.addPayee",
                    onClick: function() {
                        var billPayModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "BillPayMA", "moduleName" : "BillPaymentUIModule"});
                        billPayModule.presentationController.showBillPaymentScreen({
                            context: "AddPayee"
                        });
                    },
                    isVisible: function() {
                        var configurationManager = applicationManager.getConfigurationManager();
                        if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.BILLPAY) === true)
                            return checkUserPermission("BILL_PAY_CREATE_PAYEES");
                        else
                            return false;
                    }
                }, {
                    id: "Make One Time Payment",
                    text: "i18n.BillPay.MAKEONETIMEPAYMENT",
                    toolTip: "i18n.BillPay.MAKEONETIMEPAYMENT",
                    onClick: function() {
                        var billPayModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "BillPayMA", "moduleName" : "BillPaymentUIModule"});
                        billPayModule.presentationController.showBillPaymentScreen({
                            context: "MakeOneTimePayment"
                        });
                    },
                    isVisible: function() {
                        var configurationManager = applicationManager.getConfigurationManager();
                        if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.BILLPAY) === true)
                            return checkUserPermission("BILL_PAY_CREATE");
                        else
                            return false;
                    }
                }]
            }
        },
        {
            isVisible: function() {
                var configurationManager = applicationManager.getConfigurationManager();
                if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.ACH) === true){
                    return checkAtLeastOneFeaturePresent([
                        'ACH_COLLECTION', 'ACH_PAYMENT', 'ACH_FILES'
                    ]);
				}else
                    return false;	
                
            },
            id: "ACH",
            text: "i18n.konybb.ACH.ACH",
            skin: "sknLblFontType0a57b91c10db243",
            icon: "$",
            subMenu: {
                children: [{
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                                return ((orientationHandler.isTablet) || kony.application.getCurrentBreakpoint() === 1024) &&
                                    (
                                        (checkUserFeature("ACH_COLLECTION") && checkUserPermission("ACH_COLLECTION_CREATE_TEMPLATE")) ||
                                        (checkUserFeature("ACH_PAYMENT") && checkUserPermission("ACH_PAYMENT_CREATE_TEMPLATE"))
                                    );
                            
                        },
                        id: "Create a Template",
                        text: "i18n.konybb.common.createATemplate",
                        onClick: function() {
                            var navigationObject = {
                                "requestData": null,
                                "onSuccess": {
                                    "form": "frmACHDashboard",
                                    "module": "ACHUIModule",
                                  	"appName": "ACHMA",
                                    "context": {
                                        "key": BBConstants.CREATE_ACH_TEMPLATES,
                                        "responseData": null
                                    }
                                },
                                "onFailure": {
                                    "form": "AuthUIModule/frmLogin",
                                    "module": "AuthUIModule",
                                  	"appName": "AuthenticationMA",
                                    "context": {
                                        "key": BBConstants.LOG_OUT,
                                        "responseData": null
                                    }
                                }
                            };
                            var ACHModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "ACHUIModule", "appName": "ACHMA"});
                            ACHModule.presentationController.noServiceNavigate(navigationObject);
                        }
                    },
                    {
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                                return !(kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile) && (
                                    checkAtLeastOnePermission(applicationManager.getConfigurationManager().getViewACHTemplatePermissionsList()) &&
                                    checkAtLeastOnePermission(applicationManager.getConfigurationManager().getCreateACHTransactionPermissionsList())
                                );
                           
                        },
                        id: "Make Payment With Template",
                        text: "i18n.konybb.ACH.MakePaymentWithTemplate",
                        onClick: function() {
                            var navigationObject = {
                                "requestData": null,
                                "onSuccess": {
                                    "form": "frmACHDashboard",
                                    "module": "ACHUIModule",
                                  	"appName": "ACHMA",
                                    "context": {
                                        "key": BBConstants.SHOW_ACH_TEMPLATES_TAB,
                                        "responseData": null
                                    }
                                },
                                "onFailure": {
                                    "form": "AuthUIModule/frmLogin",
                                    "module": "AuthUIModule",
                                  	"appName": "AuthenticationMA",
                                    "context": {
                                        "key": BBConstants.LOG_OUT,
                                        "responseData": null
                                    }
                                }
                            };
                            var ACHModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "ACHUIModule", "appName": "ACHMA"});
                            ACHModule.presentationController.noServiceNavigate(navigationObject);
                        }
                    },
                    {
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                                return !(kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile) && checkAtLeastOnePermission(
                                    applicationManager.getConfigurationManager().getCreateACHTransactionPermissionsList()
                                );
                            
                        },
                        id: "Make One Time Payment",
                        text: "i18n.konybb.ACH.MakeOneTimePayment",
                        onClick: function() {
                            var navigationObject = {
                                "requestData": null,
                                "onSuccess": {
                                    "form": "frmACHDashboard",
                                    "module": "ACHUIModule",
                                  	"appName": "ACHMA",
                                    "context": {
                                        "key": BBConstants.TRANSACTION_WITHOUT_TEMPLATE,
                                        "responseData": null
                                    }
                                },
                                "onFailure": {
                                    "form": "AuthUIModule/frmLogin",
                                    "module": "AuthUIModule",
                                  	"appName": "AuthenticationMA",
                                    "context": {
                                        "key": BBConstants.LOG_OUT,
                                        "responseData": null
                                    }
                                }
                            };
                            var ACHModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "ACHUIModule", "appName": "ACHMA"});
                            ACHModule.presentationController.noServiceNavigate(navigationObject);
                        }
                    },
                    {
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                                return checkAtLeastOnePermission(
                                    applicationManager.getConfigurationManager().getViewACHTransactionPermissionsList()
                                );
                            
                        },
                        id: "ACH History",
                        text: "i18n.konybb.ACH.ACHHistory",
                        onClick: function() {
                            var navigationObject = {
                                "requestData": null,
                                "onSuccess": {
                                    "form": "frmACHDashboard",
                                    "module": "ACHUIModule",
                                  	"appName": "ACHMA",
                                    "context": {
                                        "key": BBConstants.SHOW_ACH_TRANSACTIONS_TAB,
                                        "responseData": null
                                    }
                                },
                                "onFailure": {
                                    "form": "AuthUIModule/frmLogin",
                                    "module": "AuthUIModule",
                                  	"appName": "AuthenticationMA",
                                    "context": {
                                        "key": BBConstants.LOG_OUT,
                                        "responseData": null
                                    }
                                }
                            };
                            var ACHModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "ACHUIModule", "appName": "ACHMA"});
                            ACHModule.presentationController.noServiceNavigate(navigationObject);
                        }
                    },
                    {
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                                return !(kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile) && checkAtLeastOnePermission(
                                    applicationManager.getConfigurationManager().getViewACHFilePermissionsList()
                                );
                            
                        },
                        id: "Files",
                        text: "i18n.konybb.hamburger.ACHFiles",
                        onClick: function() {
                            var navigationObject = {
                                "requestData": null,
                                "onSuccess": {
                                    "form": "frmACHDashboard",
                                    "module": "ACHUIModule",
                                  	"appName": "ACHMA",
                                    "context": {
                                        "key": BBConstants.SHOW_ACH_FILES_TAB,
                                        "responseData": null
                                    }
                                },
                                "onFailure": {
                                    "form": "AuthUIModule/frmLogin",
                                    "module": "AuthUIModule",
                                  	"appName": "AuthenticationMA",
                                    "context": {
                                        "key": BBConstants.LOG_OUT,
                                        "responseData": null
                                    }
                                }
                            };
                            var ACHModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "ACHUIModule", "appName": "ACHMA"});
                            ACHModule.presentationController.noServiceNavigate(navigationObject);
                        }
                    }
                ]
            }
        },
		{
            isVisible: function() {
                var configurationManager = applicationManager.getConfigurationManager();
                if (configurationManager.isMicroAppPresent("TradeFinanceMA") === true) {
             return checkAtLeastOnePermission(['IMPORT_LC_VIEW', 'EXPORT_LC_VIEW'])
            } else
              return false;
          },
            id: "TradeFinance",
            text: "i18n.TradeFinance.TradeFinanceHamburger",
            skin: "sknLblFontType0a57b91c10db243",
            icon: "B",
            subMenu: {
                children: [{
                    isVisible: function() {
                        var configurationManager = applicationManager.getConfigurationManager();
                        if (configurationManager.isMicroAppPresent("TradeFinanceMA") === true) {
                      return checkUserPermission("IMPORT_LC_VIEW")
                    } else
                      return false;
                  },
                    id: "Imports",
                    text: "i18n.TradeFinance.Imports",
                    onClick: function() {
                        var navMan = applicationManager.getNavigationManager();
                        var configManager = applicationManager.getConfigurationManager();
                        var data = applicationManager.getUserPreferencesManager().getUserObj();
                        navMan.navigateTo({
                            "appName": "TradeFinanceMA",
                            "friendlyName": "ImportLCUIModule/frmImportLCDashboard"
                        }, false, data);
                    }
                }, {
                    isVisible: function() {
                        var configurationManager = applicationManager.getConfigurationManager();
                        if (configurationManager.isMicroAppPresent("TradeFinanceMA") === true) {
                      return checkUserPermission("EXPORT_LC_VIEW")
                    } else
                      return false;
                  },
                    id: "Exports",
                    text: "i18n.TradeFinance.Exports",
                    onClick: function() {
                        var navMan = applicationManager.getNavigationManager();
                        var configManager = applicationManager.getConfigurationManager();
                        navMan.navigateTo({
                            "appName": "TradeFinanceMA",
                            "friendlyName": "ExportLCUIModule/frmExportLCDashboard"
                        }, false, { flowType: 'GetAllExportLettersOfCredit' });
                    }
                }]
            }
        },
        {
            isVisible: function() {
                var configurationManager = applicationManager.getConfigurationManager();
                if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.BULKPAYMENTS) === true) {
                    var features = configurationManager.getBulkPaymentFeaturePermissionsList();
                    return !(kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile) && checkAtLeastOnePermission(features);
                } else
                    return false;
            },

            id: "Bulk Payments",
            text: "i18n.kony.BulkPayments.bulkPaymentHeader",
            toolTip: "i18n.kony.BulkPayments.bulkPaymentHeader",
            skin: "sknLblFontType0a57b91c10db243",
            icon: "#",
            subMenu: {
                children: [{
                        id: "Upload Status",
                        text: "i18n.kony.BulkPayments.viewUploadedfiles",
                        toolTip: "i18n.kony.BulkPayments.viewUploadedfiles",
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.BULKPAYMENTS) === true) {
                                var features = configurationManager.getBulkPaymentFilesViewPermissionsList();
                                return checkAtLeastOnePermission(features);
                            } else
                                return false;
                        },
                        onClick: function() {  
                          var navigationObject = {
                            "requestData": null,
                            "onSuccess": {
                              "form": "frmBulkPaymentsDashboard",
                              "module": "BulkPaymentsUIModule",
                              "appName": "BulkPaymentsMA",
                              "context": {
                                "key": "Upload Status",
                                "responseData": null
                              }
                            },
                            "onFailure": {
                              "form": "AuthUIModule/frmLogin",
                              "module": "AuthUIModule",
                              "appName": "AuthenticationMA",
                              "context": {
                                "key": BBConstants.LOG_OUT,
                                "responseData": null
                              }
                            }
                          };
                          var BulkPaymentsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "BulkPaymentsUIModule", "appName" : "BulkPaymentsMA"});
                          BulkPaymentsModule.presentationController.noServiceNavigateTemp(navigationObject);
                       }
                    },
                    {
                        id: "Review & Submit",
                        text: "i18n.kony.BulkPayments.PaymentsStatus",
                        toolTip: "i18n.kony.BulkPayments.PaymentsStatus",
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.BULKPAYMENTS) === true) {
                                var features = configurationManager.getBulkPaymentRequestViewPermissionsList();
                                return checkAtLeastOnePermission(features);
                            } else
                                return false;
                        },
                        onClick: function() {
                          var navigationObject = {
                            "requestData": null,
                            "onSuccess": {
                              "form": "frmBulkPaymentsDashboard",
                              "module": "BulkPaymentsUIModule",
                              "appName": "BulkPaymentsMA",
                              "context": {
                                "key": "Review & Submit",
                                "responseData": null
                              }
                            },
                            "onFailure": {
                              "form": "AuthUIModule/frmLogin",
                              "module": "AuthUIModule",
                              "appName": "AuthenticationMA",
                              "context": {
                                "key": BBConstants.LOG_OUT,
                                "responseData": null
                              }
                            }
                          };
                          var BulkPaymentsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "BulkPaymentsUIModule", "appName" : "BulkPaymentsMA"});
                          BulkPaymentsModule.presentationController.noServiceNavigateTemp(navigationObject);      
                       }
                    },

                    {
                        id: "Processed Requests",
                        text: "i18n.kony.BulkPayments.paymentHistory",
                        toolTip: "i18n.kony.BulkPayments.paymentHistory",
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.BULKPAYMENTS) === true) {
                                var features = configurationManager.getBulkPaymentRequestViewPermissionsList();
                                return checkAtLeastOnePermission(features);
                            } else
                                return false;
                        },
                        onClick: function() {
                          var navigationObject = {
                            "requestData": null,
                            "onSuccess": {
                              "form": "frmBulkPaymentsDashboard",
                              "module": "BulkPaymentsUIModule",
                              "appName": "BulkPaymentsMA",
                              "context": {
                                "key": "Processed Requests",
                                "responseData": null
                              }
                            },
                            "onFailure": {
                              "form": "AuthUIModule/frmLogin",
                              "module": "AuthUIModule",
                              "appName": "AuthenticationMA",
                              "context": {
                                "key": BBConstants.LOG_OUT,
                                "responseData": null
                              }
                            }
                          };
                            var BulkPaymentsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "BulkPaymentsUIModule", "appName" : "BulkPaymentsMA"});
                            BulkPaymentsModule.presentationController.noServiceNavigateTemp(navigationObject);             
                       }
                    },
                    {
                        id: "Templates",
                        text: "i18n.kony.BulkPayments.viewTemplates",
                        toolTip: "i18n.kony.BulkPayments.viewTemplates",
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.BULKPAYMENTS) === true) {
                                var features = configurationManager.getBulkPaymentTemplateViewPermissionsList();
                                return checkAtLeastOnePermission(features);
                            } else
                                return false;
                        },
                        onClick: function() {
                          
                          var navigationObject = {
                            "requestData": null,
                            "onSuccess": {
                              "form": "frmBulkPaymentsDashboard",
                              "module": "BulkPaymentsUIModule",
                              "appName": "BulkPaymentsMA",
                              "context": {
                                "key": BBConstants.BULKPAYMENT_VIEW_TEMPLATES,
                                "responseData": null
                              }
                            },
                            "onFailure": {
                              "form": "AuthUIModule/frmLogin",
                              "module": "AuthUIModule",
                              "appName": "AuthenticationMA",
                              "context": {
                                "key": BBConstants.LOG_OUT,
                                "responseData": null
                              }
                            }
                          };

                           var BulkPaymentsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "BulkPaymentsUIModule", "appName" : "BulkPaymentsMA"});	
                            BulkPaymentsModule.presentationController.noServiceNavigateTemp(navigationObject);    	
       }
                    },
                    {
                        id: "Upload File",
                        text: "i18n.kony.BulkPayments.uploadFileAndMakeBulkPayments",
                        toolTip: "i18n.kony.BulkPayments.uploadFileAndMakeBulkPayments",
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.BULKPAYMENTS) === true) {
                                var features = configurationManager.getBulkPaymentFileUploadPermissionsList();
                                return checkAtLeastOnePermission(features);
                            } else
                                return false;
                        },
                        onClick: function() {
                            var navigationObject = {	
                            "requestData": null,	
                            "onSuccess": {	
                              "form": "frmBulkPaymentsUploadFile",	
                              "module": "BulkPaymentsUIModule",	
                              "appName": "BulkPaymentsMA",	
                              "context": {	
                                "key": BBConstants.BULKPAYMENTS_UPLOAD_FILE,	
                                "responseData": null	
                              }	
                            },	
                            "onFailure": {	
                              "form": "AuthUIModule/frmLogin",	
                              "module": "AuthUIModule",	
                              "appName": "AuthenticationMA",	
                              "context": {	
                                "key": BBConstants.LOG_OUT,	
                                "responseData": null	
                              }	
                            }	
                          };	
                            var BulkPaymentsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "BulkPaymentsUIModule", "appName" : "BulkPaymentsMA"});	
                          BulkPaymentsModule.presentationController.noServiceNavigateTemp(navigationObject);    	
                           }
                    },
                    {
                        id: "Create New Template",
                        text: "i18n.kony.BulkPayments.createTemplates",
                        toolTip: "i18n.kony.BulkPayments.createTemplates",
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.BULKPAYMENTS) === true) {
                                var features = configurationManager.getBulkPaymentTemplateCreatePermissionsList();
                                return checkAtLeastOnePermission(features);
                            } else
                                return false;
                        },
                        onClick: function() {
                          var navigationObject = {
                            "requestData": null,
                            "onSuccess": {
                              "form": "frmBulkPaymentsTemplate",
                              "module": "BulkPaymentsUIModule",
                              "appName": "BulkPaymentsMA",
                              "context": {
                                "key": BBConstants.BULKPAYMENTS_CREATE_TEMPLATE,
                                "responseData": null
                              }
                            },
                            "onFailure": {
                              "form": "AuthUIModule/frmLogin",
                              "module": "AuthUIModule",
                              "appName": "AuthenticationMA",
                              "context": {
                                "key": BBConstants.LOG_OUT,
                                "responseData": null
                              }
                            }
                          };
                            var BulkPaymentsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "BulkPaymentsUIModule", "appName" : "BulkPaymentsMA"});
                          BulkPaymentsModule.presentationController.noServiceNavigateTemp(navigationObject);  
                          
                        }                             	
                    }
                ]
            }
        },
        {
            id: "Exchange Rates",
            text: "i18n.kony.exchangeRates.ExchangeRatesHeader",
            toolTip: "i18n.kony.exchangeRates.ExchangeRatesHeader",
            skin: "sknLblFontType0a57b91c10db243",
            icon: "&",
            onClick: function() {

                var ForeignExchangeModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ForeignExchangeUIModule", "appName" : "ForeignExchangeMA"});
                ForeignExchangeModule.presentationController.noServiceNavigate("ForeignExchangeUIModule/frmForexDashboard", "Exchange Rates");
            },
            isVisible: function() {
                var configurationManager = applicationManager.getConfigurationManager();
                if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.FOREIGNEXCHANGE) === true)
                     return checkUserFeature("FX_RATES");
                else
                    return false;
            },
            subMenu: {
                children: [

                ]
            }
        },
        {
            isVisible: function() {
                var configurationManager = applicationManager.getConfigurationManager();
                if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.APPROVALREQUEST) === true) {
                    var features = configurationManager.getApprovalReqModulePermissionsList();
                    return checkAtLeastOnePermission(features);
                } else
                    return false;
            },
            id: "Approvals Requests",
            text: "i18n.konybb.Common.ApprovalsRequests",
            skin: "sknLblFontType0a57b91c10db243",
            icon: "%",
            subMenu: {
                children: [{
                        id: "My Approvals",
                        text: "i18n.konybb.Common.MyApprovals",
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.APPROVALREQUEST) === true) {
                                var features = configurationManager.getApprovalsFeaturePermissionsList();
                                return checkAtLeastOnePermission(features);
                            } else
                                return false;
                        },
                        onClick: function() {
                            var navigationObject = {
                                "requestData": null,
                                "onSuccess": {
                                    "form": "frmBBApprovalsDashboard",
                                    "module": "ApprovalsReqUIModule",
                                    "appName": "ApprovalRequestMA",
                                    "context": {
                                        "key": BBConstants.DASHBOARD_DEFAULT_TAB,
                                        "responseData": null
                                    }
                                },
                                "onFailure": {
                                    "form": "AuthUIModule/frmLogin",
                                    "module": "AuthUIModule",
                                    "appName":"AuthenticationMA",
                                    "context": {
                                        "key": BBConstants.LOG_OUT,
                                        "responseData": null
                                    }
                                }
                            };
                            var ApprovalsReqModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "ApprovalsReqUIModule", "appName": "ApprovalRequestMA"});
                            ApprovalsReqModule.presentationController.noServiceNavigation(navigationObject);
                        }
                    },
                    {
                        id: "My Requests",
                        text: "i18n.konybb.Common.MyRequests",
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.APPROVALREQUEST) === true) {
                                var features = configurationManager.getRequestsFeaturePermissionsList();
                                return checkAtLeastOnePermission(features);
                            } else
                                return false;
                        },
                        onClick: function() {
                            var navigationObject = {
                                "requestData": null,
                                "onSuccess": {
                                    "form": "frmBBRequestsDashboard",
                                    "module": "ApprovalsReqUIModule",
                                    "appName": "ApprovalRequestMA",
                                    "context": {
                                        "key": BBConstants.DASHBOARD_DEFAULT_TAB,
                                        "responseData": null
                                    }
                                },
                                "onFailure": {
                                    "form": "AuthUIModule/frmLogin",
                                    "module": "AuthUIModule",
                                    "appName":"AuthenticationMA",
                                    "context": {
                                        "key": BBConstants.LOG_OUT,
                                        "responseData": null
                                    }
                                }
                            };
                            var ApprovalsReqModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "ApprovalsReqUIModule", "appName": "ApprovalRequestMA"});
                            ApprovalsReqModule.presentationController.noServiceNavigation(navigationObject);
                        }
                    },
                    {
                        id: "Approval History",
                        text: "i18n.konybb.Common.approvalHistory",
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.APPROVALREQUEST) === true) {
                                var features = configurationManager.getBulkPaymentsApprovalsFeaturePermissionsList();
                                //                       return !(kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile) && checkAtLeastOnePermission(features);
                                return false;
                            } else
                                return false;
                        },
                        onClick: function() {
                            var navigationObject = {
                                "requestData": null,
                                "onSuccess": {
                                    "form": "frmBBApprovalHistory",
                                    "module": "ApprovalsReqUIModule",
                                    "appName": "ApprovalRequestMA",
                                    "context": {
                                        "key": BBConstants.DASHBOARD_DEFAULT_TAB,
                                        "responseData": null
                                    }
                                },
                                "onFailure": {
                                    "form": "AuthUIModule/frmLogin",
                                    "module": "AuthUIModule",
                                    "appName":"AuthenticationMA",
                                    "context": {
                                        "key": BBConstants.LOG_OUT,
                                        "responseData": null
                                    }
                                }
                            };
                            var ApprovalsReqModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "ApprovalsReqUIModule", "appName": "ApprovalRequestMA"});
                            ApprovalsReqModule.presentationController.noServiceNavigation(navigationObject);
                        }
                    },
                    {
                        id: "Request History",
                        text: "i18n.konybb.Common.requestHistory",
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.APPROVALREQUEST) === true) {
                                var features = configurationManager.getBulkPaymentRequestPermissionsList();
                                //                       return !(kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile) && checkAtLeastOnePermission(features);
                                return false;
                            } else
                                return false;
                        },
                        onClick: function() {
                            var navigationObject = {
                                "requestData": null,
                                "onSuccess": {
                                    "form": "frmBBRequestHistory",
                                    "module": "ApprovalsReqUIModule",
                                    "appName": "ApprovalRequestMA",
                                    "context": {
                                        "key": BBConstants.DASHBOARD_DEFAULT_TAB,
                                        "responseData": null
                                    }
                                },
                                "onFailure": {
                                    "form": "AuthUIModule/frmLogin",
                                    "module": "AuthUIModule",
                                    "appName":"AuthenticationMA",
                                    "context": {
                                        "key": BBConstants.LOG_OUT,
                                        "responseData": null
                                    }
                                }
                            };
                            var ApprovalsReqModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "ApprovalsReqUIModule", "appName": "ApprovalRequestMA"});
                            ApprovalsReqModule.presentationController.noServiceNavigation(navigationObject);
                        }
                    }
                ]
            }
        },
        {
            isVisible: function() {
                var configurationManager = applicationManager.getConfigurationManager();
                if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.WIRETRANSFER) === true) {
                    return checkAtLeastOneFeaturePresent([
                        OLBConstants.BULK_WIRE_PERMISSIONS.DOMESTIC_WIRE_TRANSFER,
                        OLBConstants.BULK_WIRE_PERMISSIONS.INTERNATIONAL_WIRE_TRANSFER
                    ])
                } else
                    return false;
            },
            id: "Wire Transfer",
            text: "i18n.transfers.wireTransfer",
            toolTip: "i18n.transfers.wireTransfer",
            icon: function() {
                return "6";
            },
            subMenu: {
                children: [{
                    id: "Make Transfer",
                    text: "i18n.AccountDetails.MAKETRANSFER",
                    toolTip: "i18n.AccountDetails.MAKETRANSFER",
                    onClick: function() {
                        var wireTransferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                            "moduleName": "WireTransferNewUIModule",
                            "appName": "WireTransferMA"
                        });
                        wireTransferModule.presentationController.showWireTransfer({
                            landingPageView: "makeTransfer"
                        })
                    },
                    isVisible: function() {
                        var configurationManager = applicationManager.getConfigurationManager();
                        if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.WIRETRANSFER) === true) {
                            return checkAtLeastOnePermission([
                                OLBConstants.BULK_WIRE_PERMISSIONS.INTERNATIONAL_WIRE_TRANSFER_CREATE,
                                OLBConstants.BULK_WIRE_PERMISSIONS.DOMESTIC_WIRE_TRANSFER_CREATE
                            ])
                        } else
                            return false;
                    },
                }, {
                    id: "History",
                    text: "i18n.billPay.History",
                    toolTip: "i18n.billPay.History",
                    onClick: function() {
                        var wireTransferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                            "moduleName": "WireTransferNewUIModule",
                            "appName": "WireTransferMA"
                        });
                        wireTransferModule.presentationController.showWireTransfer({
                            landingPageView: "wireTransferHistory"
                        })
                    },
                    isVisible: function() {
                        var configurationManager = applicationManager.getConfigurationManager();
                        if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.WIRETRANSFER) === true) {
                            return checkAtLeastOnePermission([
                                OLBConstants.BULK_WIRE_PERMISSIONS.INTERNATIONAL_WIRE_TRANSFER_CREATE,
                                OLBConstants.BULK_WIRE_PERMISSIONS.DOMESTIC_WIRE_TRANSFER_CREATE,
                                OLBConstants.BULK_WIRE_PERMISSIONS.INTERNATIONAL_WIRE_TRANSFER_VIEW,
                                OLBConstants.BULK_WIRE_PERMISSIONS.DOMESTIC_WIRE_TRANSFER_VIEW
                            ])
                        } else
                            return false;
                    }
                }, {
                    id: "My Recipients",
                    text: "i18n.WireTransfer.MyRecepient",
                    toolTip: "i18n.WireTransfer.MyRecepient",
                    onClick: function() {
                        var wireTransferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                            "moduleName": "WireTransferNewUIModule",
                            "appName": "WireTransferMA"
                        });
                        wireTransferModule.presentationController.showWireTransfer({
                            landingPageView: "myRecipients"
                        })
                    },
                    isVisible: function() {
                        var configurationManager = applicationManager.getConfigurationManager();
                        if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.WIRETRANSFER) === true) {
                            return checkAtLeastOnePermission([
                                "DOMESTIC_WIRE_TRANSFER_VIEW_RECEPIENT",
                                "DOMESTIC_WIRE_TRANSFER_DELETE_RECEPIENT",
                                "DOMESTIC_WIRE_TRANSFER_CREATE_RECEPIENT",
                                "INTERNATIONAL_WIRE_TRANSFER_CREATE_RECEPIENT",
                                "INTERNATIONAL_WIRE_TRANSFER_DELETE_RECEPIENT",
                                "INTERNATIONAL_WIRE_TRANSFER_VIEW_RECEPIENT"
                            ])
                        } else
                            return false;
                    }
                }, {
                    id: "Add Recipient",
                    text: "i18n.PayAPerson.AddRecipient",
                    toolTip: "i18n.PayAPerson.AddRecipient",
                    onClick: function() {
                        var wireTransferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                            "moduleName": "WireTransferNewUIModule",
                            "appName": "WireTransferMA"
                        });
                        if ((checkUserPermission("DOMESTIC_WIRE_TRANSFER_CREATE_RECEPIENT") === true) || ((checkUserPermission("DOMESTIC_WIRE_TRANSFER_CREATE_RECEPIENT") === true) && (checkUserPermission("INTERNATIONAL_WIRE_TRANSFER_CREATE_RECEPIENT") === true))) {
                            wireTransferModule.presentationController.showWireTransferAddRecipientStep1({
                                landingPageView: "addRecipient"
                            })
                        } else if (checkUserPermission("INTERNATIONAL_WIRE_TRANSFER_CREATE_RECEPIENT") === true) {
                            wireTransferModule.presentationController.showWireTransferInternationalStep1({
                                landingPageView: "addRecipientInternational"
                            })
                        }
                    },
                    isVisible: function() {
                        var configurationManager = applicationManager.getConfigurationManager();
                        if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.WIRETRANSFER) === true) {
                            return checkAtLeastOnePermission([
                                OLBConstants.BULK_WIRE_PERMISSIONS.INTERNATIONAL_WIRE_TRANSFER_CREATE_RECEPIENT,
                                OLBConstants.BULK_WIRE_PERMISSIONS.DOMESTIC_WIRE_TRANSFER_CREATE_RECEPIENT
                            ])
                        } else
                            return false;
                    }
                }, {
                    id: "Make One Time Payment",
                    text: "i18n.BillPay.MAKEONETIMEPAYMENT",
                    toolTip: "i18n.BillPay.MAKEONETIMEPAYMENT",
                    onClick: function() {
                        var wireTransferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                            "moduleName": "WireTransferNewUIModule",
                            "appName": "WireTransferMA"
                            });
                        wireTransferModule.presentationController.showOneTimeWireTransfer({
                            landingPageView: "oneTimeTransfer"
                        })
                    },
                    isVisible: function() {
                        var configurationManager = applicationManager.getConfigurationManager();
                        if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.WIRETRANSFER) === true) {
                            return checkAtLeastOnePermission([
                                OLBConstants.BULK_WIRE_PERMISSIONS.INTERNATIONAL_WIRE_TRANSFER_CREATE,
                                OLBConstants.BULK_WIRE_PERMISSIONS.DOMESTIC_WIRE_TRANSFER_CREATE
                            ])
                        } else
                            return false;
                    },
                }, {
                    id: "Create New Template",
                    text: "i18n.wireTransfers.CreateNewTemplate",
                    toolTip: "i18n.wireTransfers.CreateNewTemplate",
                    onClick: function() {
                       var wireTransferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                            "moduleName": "WireTransferNewUIModule",
                            "appName": "WireTransferMA"
                        });
                        wireTransferModule.presentationController.resetPrimaryDetails();
                        wireTransferModule.presentationController.resetRecipientData();
                        wireTransferModule.presentationController.navigateToCreateTemplateForm();

                    },
                    isVisible: function() {
                        var configurationManager = applicationManager.getConfigurationManager();
                        if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.WIRETRANSFER) === true) {
                            return !(kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile) && checkAtLeastOnePermission([
                                OLBConstants.BULK_WIRE_PERMISSIONS.DOMESTIC_WIRE_TRANSFER_UPDATE_BULK_TEMPLATES,
                                OLBConstants.BULK_WIRE_PERMISSIONS.INTERNATIONAL_WIRE_TRANSFER_UPDATE_BULK_TEMPLATES
                            ])
                        } else
                            return false;
                    },
                }, {
                    id: "Files & Templates",
                    text: "i18n.wireTransfers.Files&Templates",
                    toolTip: "i18n.wireTransfers.Files&Templates",
                    onClick: function() {
                        var wireTransferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                            "moduleName": "WireTransferNewUIModule",
                            "appName": "WireTransferMA"
                        });
                        var params = {
                            "formName": "frmBulkTransferFiles",
                            "bulkWireCategoryFilter": "All"
                        };
                        wireTransferModule.presentationController.showBulkwirefiles(params);
                    },
                    isVisible: function() {
                        var configurationManager = applicationManager.getConfigurationManager();
                        if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.WIRETRANSFER) === true) {
                            return checkAtLeastOnePermission([
                                OLBConstants.BULK_WIRE_PERMISSIONS.DOMESTIC_WIRE_TRANSFER_VIEW_BULK_FILES,
                                OLBConstants.BULK_WIRE_PERMISSIONS.INTERNATIONAL_WIRE_TRANSFER_VIEW_BULK_FILES,
                                OLBConstants.BULK_WIRE_PERMISSIONS.DOMESTIC_WIRE_TRANSFER_VIEW_BULK_TEMPLATES,
                                OLBConstants.BULK_WIRE_PERMISSIONS.INTERNATIONAL_WIRE_TRANSFER_VIEW_BULK_TEMPLATES
                            ])
                        } else
                            return false;
                    },
                }, {
                    id: "Make Bulk Transfer",
                    text: "i18n.bulkWire.makeBulkTransfer",
                    toolTip: "i18n.bulkWire.makeBulkTransfer",
                    onClick: function() {
                        var wireTransferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                            "moduleName": "WireTransferNewUIModule",
                            "appName": "WireTransferMA"
                        });
                        var params = {
                            "formName": "frmMakeBulkTransferTemplate",
                            "bulkWireCategoryFilter": OLBConstants.BULKWIRE_CATEGORY_FILTER.TEMPLATES
                        };
                        wireTransferModule.presentationController.showBulkwirefiles(params);
                    },
                    isVisible: function() {
                        var configurationManager = applicationManager.getConfigurationManager();
                        if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.WIRETRANSFER) === true) {
                            return !(kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile) &&
                                ((checkAtLeastOnePermission([OLBConstants.BULK_WIRE_PERMISSIONS.DOMESTIC_WIRE_TRANSFER_VIEW_BULK_FILES, OLBConstants.BULK_WIRE_PERMISSIONS.DOMESTIC_WIRE_TRANSFER_VIEW_BULK_TEMPLATE]) &&
                                        checkAllPermissions([OLBConstants.BULK_WIRE_PERMISSIONS.DOMESTIC_WIRE_TRANSFER_CREATE])) ||
                                    (checkAtLeastOnePermission([OLBConstants.BULK_WIRE_PERMISSIONS.INTERNATIONAL_WIRE_TRANSFER_VIEW_BULK_FILES, OLBConstants.BULK_WIRE_PERMISSIONS.INTERNATIONAL_WIRE_TRANSFER_VIEW_BULK_TEMPLATES]) &&
                                        checkAllPermissions([OLBConstants.BULK_WIRE_PERMISSIONS.INTERNATIONAL_WIRE_TRANSFER_CREATE])))
                        } else
                            return false;
                    },
                }, {
                    id: "Add Bulk Transfer File",
                    text: "i18n.BulkWire.AddBulkWireFile",
                    toolTip: "i18n.BulkWire.AddBulkWireFile",
                    onClick: function() {
                        var wireTransferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                            "moduleName": "WireTransferNewUIModule",
                            "appName": "WireTransferMA"
                        });
                        applicationManager.getNavigationManager().navigateTo({
                            appName: 'WireTransferMA',
                            friendlyName: "frmAddBulkTransferFile"
                        });
                    },
                    isVisible: function() {
                        var configurationManager = applicationManager.getConfigurationManager();
                        if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.WIRETRANSFER) === true) {
                            return !(kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile) && checkAtLeastOnePermission([
                                OLBConstants.BULK_WIRE_PERMISSIONS.DOMESTIC_WIRE_TRANSFER_UPLOAD_BULK_FILES,
                                OLBConstants.BULK_WIRE_PERMISSIONS.INTERNATIONAL_WIRE_TRANSFER_UPLOAD_BULK_FILES
                            ])
                        } else
                            return false;
                    },
                }]
            }
        },
        {
            id: "ALERTS AND MESSAGES",
            text: function() {
                var configurationManager = applicationManager.getConfigurationManager();
                return (configurationManager.isFastTransferEnabled === "true" ? "i18n.AlertsAndMessages.Message" : "i18n.AlertsAndMessages.AlertsAndMessages");
            },
            toolTip: function() {
                var configurationManager = applicationManager.getConfigurationManager();
                return (configurationManager.isFastTransferEnabled === "true" ? "i18n.AlertsAndMessages.Message" : "i18n.AlertsAndMessages.AlertsAndMessages");
            },
            isVisible: function() {
                var configurationManager = applicationManager.getConfigurationManager();
                if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.SECUREMESSAGE) === true)
                    return checkUserFeature("MESSAGES");
                else
                    return false;
            },
            icon: "m",
            subMenu: {
                parent: "flxTransfersSubMenu",
                children: [{
                    id: "Alerts",
                    text: "i18n.AlertsAndMessages.Alerts",
                    toolTip: "i18n.AlertsAndMessages.Alerts",
                    onClick: function() {
                        var alertsMsgsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "AlertsMsgsUIModule", "appName" : "SecureMessageMA"});
                        alertsMsgsModule.presentationController.showAlertsPage();
                    },
                    isVisible: function() {
                        var configurationManager = applicationManager.getConfigurationManager();
                        if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.SECUREMESSAGE) === true)
                            return checkUserPermission("NOTIFICATION_VIEW");
                        else
                            return false;
                    },
                }, {
                    id: "My Messages",
                    text: "i18n.AlertsAndMessages.Messages",
                    toolTip: "i18n.AlertsAndMessages.Messages",
                    onClick: function() {
                        var alertsMsgsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "AlertsMsgsUIModule", "appName" : "SecureMessageMA"});
                        alertsMsgsModule.presentationController.showAlertsPage("hamburgerMenu", {
                            show: "Messages"
                        });
                    },
                    isVisible: function() {
                        var configurationManager = applicationManager.getConfigurationManager();
                            return checkUserPermission("MESSAGES_VIEW");
                        
                    },
                }, {
                    id: "New Message",
                    text: "i18n.AlertsAndMessages.NewMessagesMod",
                    toolTip: "i18n.AlertsAndMessages.NewMessagesMod",
                    onClick: function() {
                        var alertsMsgsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "AlertsMsgsUIModule", "appName" : "SecureMessageMA"});
                        alertsMsgsModule.presentationController.showAlertsPage("hamburgerMenu", {
                            show: "CreateNewMessage"
                        });
                    },
                    isVisible: function() {
                        var configurationManager = applicationManager.getConfigurationManager();
                            return checkUserPermission("MESSAGES_CREATE_OR_REPLY");
                        
                    }
                }]
            }
        },
        {
            isVisible: function() {
                var configurationManager = applicationManager.getConfigurationManager();
                if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.USERMANAGEMENT) === true)
                    return checkUserFeature("USER_MANAGEMENT")
                else
                    return false;
            },
            id: "User Management",
            text: "i18n.common.UserManagement",
            toolTip: "i18n.common.UserManagement",
            icon: "u",
            subMenu: {
                children: [{
                        id: "All Users",
                        text: "i18n.userManagement.allUsers",
                        toolTip: "i18n.userManagement.allUsers",
                        onClick: function() {
                            var userModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "BusinessBankingUIModule", "appName": "UserManagementMA"});
                            userModule.presentationController.showUserManagent({
                                show: 'showAllUsers'
                            });
                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.USERMANAGEMENT) === true) {
                                return checkAtLeastOnePermission([
                                    "USER_MANAGEMENT_ACTIVATE",
                                    "USER_MANAGEMENT_DELETE",
                                    "USER_MANAGEMENT_SUSPEND",
                                    "USER_MANAGEMENT_VIEW"
                                ]);
                            } else
                                return false;
                        }
                    }, {
                        id: "User Roles",
                        text: "i18n.customRoles.userRoles",
                        toolTip: "i18n.customRoles.userRoles",
                        onClick: function() {
                            var userModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "BusinessBankingUIModule", "appName": "UserManagementMA"});
                            userModule.presentationController.showUserManagent({
                                show: 'showUserRoles'
                            });
                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.USERMANAGEMENT) === true) {
                                return checkAtLeastOnePermission([
                                    "CUSTOM_ROLES_VIEW"
                                ]) && !(kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile);
                            } else
                                return false;
                        }
                    },
                    /*{
                                       id: "Create A User",
                                       text: "i18n.userManagement.createAuser",
                                       toolTip: "i18n.userManagement.createAuser",
                                       onClick: function() {
                                           var userModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("BusinessBanking");
                                           userModule.presentationController.showUserManagent({
                                               show: 'createNewUser'
                                           });
                                       },
                                       isVisible: function() {
                                           return !(kony.application.getCurrentBreakpoint()==640 || orientationHandler.isMobile) && checkUserPermission("USER_MANAGEMENT_CREATE");
                                       }
                                   },*/
                    {
                        id: "Create UM User",
                        text: "i18n.userManagement.createAuser",
                        toolTip: "i18n.userManagement.createAuser",
                        onClick: function() {
                            var userModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "BusinessBankingUIModule", "appName": "UserManagementMA"});
                            userModule.presentationController.showUserManagent({
                                show: 'creatUMUser'
                            });
                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.USERMANAGEMENT) === true) {
                                return !(kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile) && checkUserPermission("USER_MANAGEMENT_CREATE");
                            } else
                                return false;
                        }
                    },
                    {
                        id: "Create Custom Role",
                        text: "i18n.customRole.createCustomRole",
                        toolTip: "i18n.customRole.createCustomRole",
                        onClick: function() {
                            var userModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "BusinessBankingUIModule", "appName": "UserManagementMA"});
                            userModule.presentationController.showUserManagent({
                                show: 'createNewCustomRole'
                            });
                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.USERMANAGEMENT) === true) {
                                return !(kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile) && checkUserPermission("CUSTOM_ROLES_CREATE");
                            } else
                                return false;
                        }
                    }
                ]
            }
        },
        {
            isVisible: function() {
                var configurationManager = applicationManager.getConfigurationManager();
                if (configurationManager.isMicroAppPresent() === true)
                    return configurationManager.isFastTransferEnabled === "false" && checkUserFeature("P2P") && configurationManager.getDeploymentGeography() !== "EUROPE";
                else
                    return false;
            },
            id: "Pay a Person",
            text: "i18n.p2p.PayAPerson",
            toolTip: "i18n.p2p.PayAPerson",
            icon: "P",
            subMenu: {
                children: [{
                    id: "Send Money",
                    text: "i18n.Pay.SendMoney",
                    toolTip: "i18n.Pay.SendMoney",
                    onClick: function() {
                        var p2pModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("PayAPersonModule");
                        p2pModule.presentationController.showPayAPerson("sendMoneyTab");
                    },
                    isVisible: function() {
                        var configurationManager = applicationManager.getConfigurationManager();
                            return checkUserPermission("P2P_CREATE");
                        
                    }
                }, {
                    id: "History",
                    text: "i18n.billPay.History",
                    toolTip: "i18n.billPay.History",
                    onClick: function() {
                        var p2pModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("PayAPersonModule");
                        p2pModule.presentationController.showPayAPerson("SentTransactionsTab");
                    },
                    isVisible: function() {
                        var configurationManager = applicationManager.getConfigurationManager();
                            return checkUserPermission("P2P_VIEW");
                        
                    }
                }, {
                    id: "My Recipients",
                    text: "i18n.WireTransfer.MyRecepient",
                    toolTip: "i18n.WireTransfer.MyRecepient",
                    onClick: function() {
                        var p2pModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("PayAPersonModule");
                        p2pModule.presentationController.showPayAPerson("ManageRecipients");

                    },
                    isVisible: function() {
                        var configurationManager = applicationManager.getConfigurationManager();
                            return checkAtLeastOnePermission([
                                "P2P_MANAGE_PAYEES",
                                "P2P_CREATE"
                            ])
                        
                    }
                }, {
                    id: "Add Recipient",
                    text: "i18n.PayAPerson.AddRecipient",
                    toolTip: "i18n.PayAPerson.AddRecipient",
                    onClick: function() {
                        var p2pModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("PayAPersonModule");
                        p2pModule.presentationController.showPayAPerson("AddRecipient");

                    },
                    isVisible: function() {
                        var configurationManager = applicationManager.getConfigurationManager();
                            return checkUserPermission("P2P_MANAGE_PAYEES");
                       
                    }
                }, {
                    id: "Send Money to New Recipient",
                    text: "i18n.PayAPerson.SendMoneyToNewRecipient",
                    toolTip: "i18n.PayAPerson.SendMoneyToNewRecipient",
                    onClick: function() {
                        var p2pModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("PayAPersonModule");
                        p2pModule.presentationController.showPayAPerson("sendMoneyToNewRecipient");
                    },
                    isVisible: function() {
                        var configurationManager = applicationManager.getConfigurationManager();
                            return checkUserPermission("P2P_CREATE");
                       
                    }
                }]
            }
        },
        {
            isVisible: function() {
                var configurationManager = applicationManager.getConfigurationManager();
                if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.MANAGEARRANGEMENTS) === true || configurationManager.isMicroAppPresent(configurationManager.microappConstants.APPROVALMATRIX) === true
                   || configurationManager.isMicroAppPresent(configurationManager.microappConstants.ALERTSETTINGS) === true || configurationManager.isMicroAppPresent(configurationManager.microappConstants.CONSENTMANAGEMENT) === true
				   || configurationManager.isMicroAppPresent(configurationManager.microappConstants.MANAGEPROFILE)=== true)
                    return ((((kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile)) || !(kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile)));
                else
                    return false;
            },
            id: "Settings",
            text: "i18n.ProfileManagement.Settingscapson",
            toolTip: "i18n.ProfileManagement.Settingscapson",
            icon: "s",
            subMenu: {
                children: [{
                        id: "Profile Settings",
                        text: "i18n.ProfileManagement.profilesettings",
                        toolTip: "i18n.ProfileManagement.profilesettings",
                        onClick: function() {
                            var profileModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"});
                            profileModule.presentationController.enterProfileSettings("profileSettings");
                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.MANAGEPROFILE) === true)
                                return checkUserPermission('PROFILE_SETTINGS_VIEW');
                            else
                                return false;
                        }
                    },
                    {
                        id: "Security Settings",
                        text: "i18n.ProfileManagement.SecuritySettings",
                        toolTip: "i18n.ProfileManagement.SecuritySettings",
                        onClick: function() {
                            var alertsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"});
                            alertsModule.presentationController.enterProfileSettings("securityQuestions");

                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.MANAGEPROFILE) === true)
                                return true;
                            else
                                return false;
                        }
                    },
                    {
                        id: "Account Settings",
                        text: "i18n.Accounts.ContextualActions.updateSettingAndPreferences",
                        toolTip: "i18n.Accounts.ContextualActions.updateSettingAndPreferences",
                        onClick: function() {
                            var settingsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName": "ManageArrangementsMA",
                            "moduleName": "ManageArrangementsUIModule"});
                            settingsModule.presentationController.enterProfileSettings("accountSettings");
                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                                return checkUserPermission("ACCOUNT_SETTINGS_VIEW");
                            
                        }
                    },
                    {
                        id: "Approval Matrix",
                        text: "i18n.Settings.ApprovalMatrix.approvalMatrix",
                        toolTip: "i18n.Settings.ApprovalMatrix.approvalMatrix",
                        onClick: function() {
                            var settingsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "SettingsNewApprovalUIModule", "appName": "ApprovalMatrixMA" });
                            settingsModule.presentationController.enterProfileSettings("approvalMatrix");

                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.APPROVALMATRIX) === true)
                                return kony.application.getCurrentBreakpoint() !== 640 && !orientationHandler.isMobile && checkUserPermission('APPROVAL_MATRIX_VIEW');
                            else
                                return false;
                        }
                    },
                    {
                        id: "Alert Settings",
                        text: "i18n.ProfileManagement.Alerts",
                        toolTip: "i18n.ProfileManagement.Alerts",
                        onClick: function() {
                            var alertsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "SettingsNewAlertsUIModule", "appName": "AlertSettingsMA" });
                            alertsModule.presentationController.enterProfileSettings("alertSettings");
                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.ALERTSETTINGS) === true)
                              {
                              var alertsdata = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "SettingsNewAlertsUIModule", "appName": "AlertSettingsMA" });
                              alertsdata.presentationController.fetchAlertsCategoryNew("alertSettings");
                              return (checkUserPermission("ALERT_MANAGEMENT"));
                              }
                            else
                                return false;
                        }
                    },
                           {
                             id: "Consent Management",
                             text: "i18n.ProfileManagement.Consent",
                             toolTip: "i18n.ProfileManagement.Consent",
                             onClick: function() {
                               var consentModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                                 "moduleName": "CDPConsentUIModule",
                                 "appName": "ConsentMgmtMA"
                               });
                               consentModule.presentationController.showConsentManagement();
                             },
                             isVisible: function() {
                               var configurationManager = applicationManager.getConfigurationManager();
                               if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.CONSENTMANAGEMENT) === true)
                                 return (checkUserPermission("CDP_CONSENT_VIEW"));
                               else
                                 return false;
                             }
                           },
                           {
                             id: "Manage Account Access",
                             text: "i18n.ProfileManagement.ManageAccountAccess",
                             toolTip: "i18n.ProfileManagement.ManageAccountAccess",
                             onClick: function() {

                               var manageAccountAccessModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                                 "moduleName": "PSD2ConsentUIModule",
                                 "appName": "ConsentMgmtMA"
                               });
                               manageAccountAccessModule.presentationController.showManageAccountAccess();

                             },
                             isVisible: function() {
                               var configurationManager = applicationManager.getConfigurationManager();
                               if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.CONSENTMANAGEMENT) === true)
                                 return (checkUserPermission("PSD2_TPP_CONSENT_VIEW"));
                               else
                                 return false;
                             }
                           }
                ]
            }
        },
        /*{
        id: "Investment Banking",
        text: "i18n.wealth.investmentBanking",
        toolTip: "i18n.wealth.investmentBanking",
        icon: "&",
        subMenu: {
            children: [{
                id: "Wealth Dashboard",
                text: "i18n.wealth.wealthDashboard",
                toolTip: "i18n.wealth.wealthDashboard",
                onClick: function() {
                     var navMan = applicationManager.getNavigationManager();
					       navMan.navigateTo("CopyfrmAccountsLanding");
                }
            }]
        }
    },*/
        {
            isVisible: function() {
                var configurationManager = applicationManager.getConfigurationManager();
                if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.ABOUTUS) === true)
                    return true;
                else
                    return false;
            },
            id: "About Us",
            text: "i18n.hamburger.aboutus",
            toolTip: "i18n.hamburger.aboutus",
            icon: "A",
            subMenu: {
                children: [{
                        id: "Terms & Conditions",
                        text: "i18n.common.TnC",
                        toolTip: "i18n.common.TnC",
                        onClick: function() {
                            var termsAndConditionModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName": "AboutUsMA", "moduleName" : "InformationContentUIModule"});
                            termsAndConditionModule.presentationController.showTermsAndConditions(OLBConstants.TNC_FLOW_TYPES.Hamburger_TnC);
                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.ABOUTUS) === true)
                                return true;
                            else
                                return false;
                        }
                    }, {
                        id: "Privacy Policy",
                        text: "i18n.footer.privacy",
                        toolTip: "i18n.footer.privacy",
                        onClick: function() {
                            var informationContentModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName": "AboutUsMA", "moduleName" : "InformationContentUIModule"});
                            informationContentModule.presentationController.showPrivacyPolicyPage();
                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.ABOUTUS) === true)
                                return true;
                            else
                                return false;
                        }
                    }, {
                        id: "Contact Us",
                        text: "i18n.footer.contactUs",
                        toolTip: "i18n.footer.contactUs",
                        onClick: function() {
                            var informationContentModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName": "AboutUsMA", "moduleName" : "InformationContentUIModule"});
                            informationContentModule.presentationController.showContactUsPage();
                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.ABOUTUS) === true)
                                return true;
                            else
                                return false;
                        }
                    },
                    {
                        id: "Locate Us",
                        text: "i18n.footer.locateUs",
                        toolTip: "i18n.footer.locateUs",
                        onClick: function() {
                            var locateUsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName": "AboutUsMA", "moduleName" : "LocateUsUIModule"});
                            locateUsModule.presentationController.showLocateUsPage();

                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.ABOUTUS) === true)
                                return true;
                            else
                                return false;
                        }
                    },
                    {
                        id: "FAQs",
                        text: "i18n.topmenu.help",
                        toolTip: "i18n.topmenu.help",
                        onClick: function() {
                            var informationContentModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName": "AboutUsMA", "moduleName" : "InformationContentUIModule"});
                            informationContentModule.presentationController.showFAQs();
                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.ABOUTUS) === true)
                                return true;
                            else
                                return false;
                        }
                    },
                    {
                        id: "Feedback",
                        text: "i18n.CustomerFeedback.Feedback",
                        toolTip: "i18n.CustomerFeedback.Feedback",
                        onClick: function() {
                            if (kony.application.getCurrentForm() !== "frmCustomerFeedback") {
                                var feedbackModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName": "AboutUsMA", "moduleName" : "FeedbackUIModule"});
                                feedbackModule.presentationController.showFeedback();
                            }
                        },
                        isVisible: function() {
                            var configurationManager = applicationManager.getConfigurationManager();
                            if (configurationManager.isMicroAppPresent(configurationManager.microappConstants.ABOUTUS) === true)
                                return checkUserFeature("FEEDBACK")
                            else
                                return false;
                        }
                    }
                ]
            }
        }
    ];

    return {
        config: widgetsMap
    };
});