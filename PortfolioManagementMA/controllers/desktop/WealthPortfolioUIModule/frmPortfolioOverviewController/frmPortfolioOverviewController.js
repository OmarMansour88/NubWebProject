var holdingsData = {};
var portfolioId = "";
var portdata = "";
var isJoint = scope_WealthPresentationController.isJointAccount;
var accountsListObj = {};
var chartDefaultValue = "";
var graphVisibility=false;
var assets={};
var cashCardServiceFlag=0;
var portfolioservicesdone=0;
var chartH = "";
var refCurrecny="";
define(['FormControllerUtility', 'ViewConstants', 'CommonUtilities', 'OLBConstants', 'CampaignUtility'], function(FormControllerUtility, ViewConstants, CommonUtilities, OLBConstants, CampaignUtility) {
    var responsiveUtils = new ResponsiveUtils();
    var orientationHandler = new OrientationHandler();
    return {


        updateFormUI: function(uiData) {
            if (uiData) {
                /* if (uiData.InstrumentsList) {
                   this.updateInstrumentSeg(uiData.InstrumentsList);
                 }*/
                if (uiData.cashCurrencyList) {
                    this.updateCashCard(uiData.cashCurrencyList, true);
                  this.bindNewGraphData(uiData.cashCurrencyList);
                }
            }
        },

        init: function() {
            chartDefaultValue = this.view.investmentLineChart.currentFilter;
			this.view.investmentLineChart.onFilterChanged = this.onFilterChanged.bind(this);
            this.view.preShow = this.preShow;
            this.view.postShow = this.postShow;
			this.chartH = this.view.flxPortofolioLineChart.height;
            this.view.onBreakpointChange = this.onBreakpointChange;
            this.view.btnViewFavorite.onClick = this.onWatchListClick;
            this.view.btnTab1.onClick = this.portfolioSummaryAction;
            this.view.btnTab2.onClick = this.accountInfoAction;
            this.view.settings.offVisibility = this.closeSettingsPopUp;
            this.view.settings.onClickSave = this.setSelectedColumn;
            this.view.settings.onClickDefault = this.setSelectedColumn;
          this.view.portfolioDetails.onSettingsVisibility = this.openSettingsPopUp;
          this.view.GenericMessageNew.closepopup = this.closepopup;
        },
        setSelectedColumn: function(ColumnValue) {
            this.view.portfolioDetails.RealignSegment(ColumnValue);
        },

        closeSettingsPopUp: function() {
            this.view.settings.setVisibility(false);
        },
      
      executionAfterCancel: function(response) {
        this.view.flxCancelPopup.setVisibility(false);
        this.view.flxPopup.setVisibility(false);
        this.view.flxSuccessMessage.setVisibility(true);
       if (response.messageDetails) {
          response.i18n = kony.i18n.getLocalizedString("i18n.wealth.cancelOrderSucceeded") +" " + response.orderId;
       } else if (response.error) {
         response=response.error;
         response.i18n = kony.i18n.getLocalizedString("i18n.wealth.cancelOrderFailed");
       }
        else{
           response.i18n = kony.i18n.getLocalizedString("i18n.wealth.cancelOrderSucceeded") +" " + response.orderId;
        }
        this.view.GenericMessageNew.setContext(response);
        this.view.flxFormContent.setContentOffset({
          "y": "0dp"
        });

      },

      closepopup: function() {
        this.view.flxSuccessMessage.setVisibility(false);
      },
        onWatchListClick: function() {
            scope_WealthPresentationController.watchlistFromPortfolio="Yes";
            var navManager = applicationManager.getNavigationManager();
            new kony.mvc.Navigation({
                "appName": "WealthOrderMA",
                "friendlyName": "frmWatchlist"
            }).navigate();
        },

        openSettingsPopUp: function(data) {
            this.view.settings.setVisibility(true);
            this.view.settings.setColumnArray(data);
        },
      setLineChartVisible: function(){
            this.view.flxPortofolioLineChart.height = this.chartH;
           
        },
        setLineChartInvisible: function(){
            this.view.flxPortofolioLineChart.height = "0px";
        },
        portfolioSummaryAction: function() {
            this.view.flxAccountInfoValues.setVisibility(false);
            this.view.flxPortofolioValues.setVisibility(true);
          //  this.view.flxPortofolioLineChart.setVisibility(graphVisibility);
          if(graphVisibility){
            this.setLineChartVisible();}
          else{
             this.setLineChartInvisible();
          }
             this.view.btnTab1.skin = "sknBtnSSP42424217PxSelectedTab";
            this.view.btnTab2.skin = "sknBtnSSP72727217PxUnSelectedTab";
            this.view.flxSeparator2.setVisibility(graphVisibility);
            this.view.flxSeparatorInvestment.setVisibility(true);
        },

        accountInfoAction: function() {
            this.view.flxAccountInfoValues.setVisibility(true);
            this.view.flxPortofolioValues.setVisibility(false);
         //   this.view.flxPortofolioLineChart.setVisibility(false);
          this.setLineChartInvisible();
            this.view.btnTab1.skin = "sknBtnSSP72727217PxUnSelectedTab";
            this.view.btnTab2.skin = "sknBtnSSP42424217PxSelectedTab";
            this.view.flxSeparator2.setVisibility(false);
            this.view.flxSeparatorInvestment.setVisibility(false);
            var data = scope_WealthPresentationController.jointAccountDetails.portfolioList;
            var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
            var portId = wealthModule.getPortfolioId();
            if (portfolioId === "") {
                portfolioId = portId;
            }
            for (list in data) {
                if (portfolioId === data[list].portfolioId) {
                    portdata = data[list];
                }
            }
            if (portdata.jointHolders !== "") {
                isJoint = true;
            } else {
                isJoint = false;
            }
            this.setUi(portdata);
            this.view.imgAccountNumber.src = "eye_show.png";
            this.view.imgAccountNumber.onTouchEnd = this.OnClickUnMask;
        },
        setUi: function(portdata) {
            this.view.lblAccountNumberValue.text = applicationManager.getDataProcessorUtility().maskAccountNumber(portdata.accountNumber);
            this.view.lblPrimaryHolderValue.text = portdata.primaryHolder;
            if (isJoint === true) {
                this.view.flxJointAccount.setVisibility(true);
                this.setsegmentJointHolders(portdata);
            } else {
                this.view.flxJointAccount.setVisibility(false);
            }
        },
        setsegmentJointHolders: function(portdata) {
            var scope = this;
            var currForm = kony.application.getCurrentForm();
            var data = portdata.jointHolders.split(',');
            var segData = [];
            var count = 1;
            for (var list in data) {
                var storeData;
                storeData = {
                    jointHolder: "Joint Holder " + count + ":",
                    jointHolderName: data[list],
                }
                count++;
                segData.push(storeData);
            }
            this.view.segmentJointHolders.widgetDataMap = {
                lblJointAccLabel: "jointHolder",
                lblJointAccName: "jointHolderName",
            }
            this.view.segmentJointHolders.setData(segData);
            currForm.forceLayout();
        },

        OnClickUnMask: function() {
            if (this.view.imgAccountNumber.src === "eye_hide.png") {
                this.view.lblAccountNumberValue.text = applicationManager.getDataProcessorUtility().maskAccountNumber(portdata.accountNumber);
                this.view.imgAccountNumber.src = "eye_show.png";
            } else {
                this.view.lblAccountNumberValue.text = portdata.accountNumber;
                this.view.imgAccountNumber.src = "eye_hide.png";
            }
        },
        bindNewGraphData: function(responseObj) {
            var val = responseObj.instrumentTotal[0];
            var forUtility = applicationManager.getFormatUtilManager();
			if(val.hasOwnProperty("OneM")) {
            var totalVal = forUtility.formatAmountandAppendCurrencySymbol(val.marketValue, val.referenceCurrency);
            var unrealizedPL = forUtility.formatAmountandAppendCurrencySymbol(val.unRealizedPLAmount, val.referenceCurrency);
            var todaysPL = forUtility.formatAmountandAppendCurrencySymbol(val.todayPLAmount, val.referenceCurrency);
            this.view.lblValueMarketValue.text = totalVal;
            var flxUnrealisedPL = this.view.flxUnrealisedPL;
            var lbllUnrealisedPL = this.view.lbllUnrealisedPL;
            var lblUnrealisedPLValue = this.view.lblUnrealisedPLValue;
         			
			if (val.unRealizedPL =='P') {
              lblUnrealisedPLValue.skin = "IWLabelGreenText15Px";
               lblUnrealisedPLValue.text = (unrealizedPL != "" && val.unRealizedPLPercentage !== "") ? ("+" + unrealizedPL + "(+" + val.unRealizedPLPercentage + "%)") : ((unrealizedPL != "") ? ("+" + unrealizedPL) : ((val.unRealizedPLPercentage !== "") ? ("(+" + val.unRealizedPLPercentage + "%)") : ""));
            } else {
              lblUnrealisedPLValue.skin = "sknlblff000015px";
               lblUnrealisedPLValue.text =  (unrealizedPL != "" && val.unRealizedPLPercentage !== "") ? ((unrealizedPL[0]=="-"?unrealizedPL:"-" +unrealizedPL) +(val.unRealizedPLPercentage[0]=="-"?"("+val.unRealizedPLPercentage+"%)": "(-" + val.unRealizedPLPercentage + "%)") ): ((unrealizedPL != "") ? (unrealizedPL[0]=="-"?unrealizedPL:"-" +unrealizedPL) : ((val.unRealizedPLPercentage !== "") ? (val.unRealizedPLPercentage[0]=="-"?"("+val.unRealizedPLPercentage+"%)": "(-" + val.unRealizedPLPercentage + "%)") : ""));
			}
			if(val.todayPLAmount!==""){
				this.view.flxTodayPL.isVisible=true;
				if (val.todayPLAmount >= 0) {
                this.view.lblTodayPLValue.skin = "IWLabelGreenText15Px";
                this.view.lblTodayPLValue.text = "+" + todaysPL.replace('+','') + "(+" + val.todayPLPercentage.replace('+','') + "%)";
            } else {
                this.view.lblTodayPLValue.skin = "sknlblff000015px";
                this.view.lblTodayPLValue.text = "-" + todaysPL.replace('-','') + "(-" + val.todayPLPercentage.replace('-','') + "%)";
            }
			}else{
				this.view.flxTodayPL.isVisible=false;
			}
			}
            
            var graphData = val[val.graphDuration];
			if(graphData.length>0){
              graphVisibility=true;
               scope_WealthPresentationController.investmentChartCurrency = forUtility.getCurrencySymbol(val.referenceCurrency);
				this.view.investmentLineChart.setChartData(graphData, null, null, null, "PORTFOLIO");
               if (kony.application.getCurrentBreakpoint() === 1024 || orientationHandler.isTablet){
               this.view.flxPortofolioValues.width="30%";
               }
     //   this.view.flxPortofolioLineChart.isVisible=true;
      this.setLineChartVisible();
		this.view.flxSeparator2.isVisible=true;
			}else{
              this.view.flxPortofolioValues.width="100%";
              graphVisibility=false;
		//		this.view.flxPortofolioLineChart.isVisible=false;
     this.setLineChartInvisible();
		this.view.flxSeparator2.isVisible=false;
		
			}
             
        },
        chartFilters: {
            ONE_MONTH: '1M',
            ONE_YEAR: '1Y',
            FIVE_YEARS: '5Y',
            YTD: 'YTD',
        },
        onFilterChanged: function(filter) {
            var filterMap = "";
            if (filter === this.chartFilters.ONE_MONTH) {
                filterMap = "OneM";
                this.chartService(filterMap);
            } else if (filter === this.chartFilters.ONE_YEAR) {
                filterMap = "OneY";
                this.chartService(filterMap);
            } else if (filter === this.chartFilters.FIVE_YEARS) {
                filterMap = "FiveY";
                this.chartService(filterMap);
            } else {
                filterMap = "YTD";
                this.chartService(filterMap);
            }

        },
        chartService: function(filter) {
            var params = {
                "portfolioId": portfolioId,
                "navPage": "Portfolio",
                "graphDuration": filter
            };
          applicationManager.getPresentationUtility().showLoadingScreen();
            var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
            wealthModule.getCashBalanceDetails(params);
        },
        preShow: function() {
			var configManager = applicationManager.getConfigurationManager();
          scope_WealthPresentationController.instrumentAction = "";
          scope_WealthPresentationController.reload = "";
           this.view.settings.setVisibility(true);         
            this.checkPermission();
			if(configManager.isMicroAppPresent("WealthOrderMA"))
			{
            this.view.flxInstrument.setVisibility(true);
            } 
			else{
                this.view.flxInstrument.setVisibility(false);
            }
            var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
            this.view.instrumentSearch.viewInstrumentDetails = this.viewInstrumentDetails;

            var portoId = wealthModule.getPortfolioId();
          refCurrecny=wealthModule.getPortfolioCurrency();
            accountsListObj = wealthModule.getAccountsListObj();
            if (scope_WealthPresentationController.isFirst === true) {
                this.getAccount(portoId);
            }
           
           
            var features = configManager.getUserFeatures();
            var permissions = configManager.getUserPermissions();
            var entitlement = {
                "features": features,
                "permissions": permissions
            };
            //var features=entitlement;

            this.view.portfolioDetails.setFeaturesAndPermissions(entitlement);

            this.view.instrumentSearch.setPortfolioId(portfolioId);
            this.view.flxAccountTypes.onClick = this.getAccountListDetails;
            this.initActions();
        },
        initActions: function() {
            this.view.portfolioDetails.onCancelRequest = this.showCancelPopup;
            this.view.portfolioDetails.onCancelSuccess = this.executionAfterCancel;
            this.view.portfolioDetails.contextMenuNavigation = this.frmNavigation;
            this.view.CustomPopupCancel.flxCross.onClick = this.HidePopup;
            this.view.CustomPopupCancel.btnNo.onClick = this.HidePopup;
            this.view.CustomPopupCancel.btnYes.onClick = this.makeCancelServiceCall;
			this.view.portfolioDetails.requestStart = this.startt;
           this.view.portfolioDetails.requestEnd = function() {
             portfolioservicesdone=0;
             if(cashCardServiceFlag===0){
                FormControllerUtility.hideProgressBar(this.view);
             }
               
            };
        },
      
      startt:function() {
        portfolioservicesdone = 1;
        FormControllerUtility.showProgressBar(this.view);
        this.closepopup();
      },
      
        frmNavigation: function(rowData, action) {
          scope_WealthPresentationController.isTAPIntegration = (rowData.isTapIntegration && rowData.isTapIntegration === "true")? true: false;          
            if (action !== "") {
              var navManager = applicationManager.getNavigationManager();

              if (action === "frmProductDetails") {
                let dataPortfolio = {};
                dataPortfolio.portfolioDetails = rowData;

                navManager.setCustomInfo(action, dataPortfolio); 
                let paramsProdDetails = {
                  "ISINCode": rowData.ISIN?rowData.ISIN:'',
                  "RICCode": rowData.RICCode?rowData.RICCode:'',
                  "instrumentId": rowData.holdingsId 
                };
				if(rowData.application){
                 scope_WealthPresentationController.application = rowData.application;
                  paramsProdDetails.application = rowData.application;
                }
                applicationManager.getModulesPresentationController("WealthPortfolioUIModule").setProductDetails(paramsProdDetails);
                applicationManager.getModulesPresentationController("WealthPortfolioUIModule").flow="Holdings";
				//navManager.navigateTo(action);
                new kony.mvc.Navigation({"appName" : "WealthOrderMA", "friendlyName" : action}).navigate();
              } else if (action === "frmPlaceOrder") {
                navManager.setCustomInfo(action, rowData); 
                var customData = {
                  "operation": rowData.operation,
                  "description": rowData.description,
                  "RICCode": rowData.RICCode,
                  "holdingsData": rowData
                };
				if (rowData.application) {
                        scope_WealthPresentationController.application = rowData.application;
                        customData.application = rowData.application;
                    }
                navManager.setCustomInfo(action, customData);
                // navManager.navigateTo(action);
                new kony.mvc.Navigation({"appName" : "WealthOrderMA", "friendlyName" : action}).navigate();
              } else {
                //navManager.navigateTo(action);
                new kony.mvc.Navigation({"appName" : "WealthOrderMA", "friendlyName" : action}).navigate();
              }
            }
        },
        HidePopup: function() {
            this.view.flxCancelPopup.setVisibility(false);
            this.view.flxPopup.setVisibility(false);
        },
        showCancelPopup: function() {
            this.view.flxCancelPopup.setVisibility(true);
            this.view.flxPopup.setVisibility(true);
        },
        makeCancelServiceCall: function() {
            this.view.portfolioDetails.makeDaoCallOnOrderCancelRequest();
        },

        postShow: function() {
          var configManager = applicationManager.getConfigurationManager();
            if(configManager.isMicroAppPresent("RegionalTransferMA"))
			{
                this.view.lblTransferCash.setVisibility(true);
                this.view.lblTransferCash.onTouchEnd = this.goToTransfer.bind(this);
            } 
			else 
			{
                this.view.lblTransferCash.setVisibility(false);
            }
	    if (configManager.isMicroAppPresent("WealthOrderMA")) {
                    this.view.lblConvertCurrency.setVisibility(true);
                } else {
                  this.view.lblConvertCurrency.setVisibility(false);
                }
            var scope = this;
            this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight - this.view.flxHeader.frame.height - this.view.flxFooter.frame.height + "dp";
           /* if (this.view.flxCashCard.isVisible === true || this.view.flxAsset.isVisible === true) {
              cashCardServiceFlag=1;
                this.getCashCardDetails();
            }         
          if (this.view.btnTab1.isVisible === true) {
                this.portfolioLevelChartService();
            }*/
            if (this.view.btnTab2.isVisible === true && this.view.btnTab1.isVisible === false) {
                this.accountInfoAction();
            }
                      if (this.view.flxCashCard.isVisible === true || this.view.flxAsset.isVisible === true || this.view.btnTab1.isVisible === true) {
              cashCardServiceFlag=1;
                this.getPortfolioDetails();
            }         
            this.setActiveHeaderHamburger();
          this.view.flxAccountList.setVisibility(false);
            this.view.accountListMenu.setVisibility(false);
            this.closeSettingsPopUp();
            scope_WealthPresentationController.viewOrdersTab = false;
        },

        getAccount: function(portoId) {
            var acctLst = accountsListObj
            for (var l in acctLst) {
                if (portoId === acctLst[l].portfolioId) {
                    this.view.lblAccountTypes.text = CommonUtilities.truncateStringWithGivenLength(acctLst[l].accountName + "...", 26) + CommonUtilities.getLastFourDigit(acctLst[l].accountNumber)
                    portfolioId = portoId;
                }
            }
            scope_WealthPresentationController.isFirst = false;
            //wealthModule.setPortfolioId(this.view.lblAccountTypes.text);
        },

        /**
         *setActiveHeaderHamburger - Method to highlight active header and hamburger
         */
        setActiveHeaderHamburger: function() {
            this.view.customheadernew.activateMenu("Accounts", "My Accounts");
            this.view.customheadernew.flxContextualMenu.setVisibility(false);
            this.view.customheadernew.flxAccounts.skin = ViewConstants.SKINS.BLANK_SKIN_TOPMENU;
        },
        /**
         * post show Method 
         */
        onBreakpointChange: function(form, width) {
           var isEuro = false;
            var configManager = applicationManager.getConfigurationManager();
            if (configManager.getBaseCurrency() === 'EUR') {
                isEuro = true;
            }
            var userId = applicationManager.getUserPreferencesManager().getUserId();
         //   this.view.portfolioDetails.setPortfolioId(portfolioId, userId, isEuro);
          
           responsiveUtils.onOrientationChange(this.onBreakpointChange, function() {
                 if (kony.application.getCurrentBreakpoint() === 1024 || orientationHandler.isTablet) {
                this.view.flxPrimaryDetailsRow.layoutType = kony.flex.FLOW_VERTICAL;
				this.view.flxLeftContainer.width="100%";
				this.view.flxLeftContainer.left="0%";
				this.view.flxRightContainer.width="100%";
				this.view.flxRightContainer.left="0%";
				this.view.flxPrimaryDetailsRow.width="95%";
				this.view.flxPrimaryDetailsRow.left="2.5%";
				this.view.flxSecondaryDetailsRow.width="95%";
				this.view.flxSecondaryDetailsRow.left="2.5%";
				this.view.flxComponent.width="100%";
				this.view.flxComponent.left="0%";
            this.view.portfolioDetails.onBreakPointChangeComponent(kony.application.getCurrentForm(), kony.application.getCurrentBreakpoint(),portfolioId, userId, isEuro);
            }
      }.bind(this));
            this.view.customheadernew.onBreakpointChangeComponent(width);
            //this.view.customfooternew.onBreakpointChangeComponent(width);
            this.view.customfooter.onBreakpointChangeComponent(width);
            var flag = "";
            if (kony.application.getCurrentBreakpoint() === 1024 || orientationHandler.isTablet) {
                flag = "horizontal";
            }
            this.view.totalAssets.onBreakpointChangeComponent(flag);
           
            this.view.portfolioDetails.onBreakPointChangeComponent(form, width,portfolioId, userId, isEuro,refCurrecny);
            this.changeUi();
             if ((this.view.flxCashCard.isVisible === true || this.view.flxAsset.isVisible === true)&&assets.assets!==undefined) {
                this.updateCashCard(assets, false);
            }
            this.setupFormOnTouchEnd(width);
           this.updateAccountList(accountsListObj);

        },
        setupFormOnTouchEnd: function(width) {
            var scope = this;
            if (width == 640) {
                this.view.onTouchEnd = function() {
                    scope.hideContextMenu();
                }
                this.nullifyPopupOnTouchStart();
            } else {
                if (width == 1024) {
                    this.view.onTouchEnd = function() {
                        scope.hideContextMenu();
                    }
                    this.nullifyPopupOnTouchStart();
                } else {
                    this.view.onTouchEnd = function() {
                        scope.hidePopups();
                    }
                }
                var userAgent = kony.os.deviceInfo().userAgent;
                if (userAgent.indexOf("iPad") != -1) {
                    this.view.onTouchEnd = function() {
                        scope.hideContextMenu();
                    }
                    this.nullifyPopupOnTouchStart();
                } else if (userAgent.indexOf("Android") != -1 && userAgent.indexOf("Mobile") == -1) {
                    this.view.onTouchEnd = function() {
                        scope.hideContextMenu();
                    }
                    this.nullifyPopupOnTouchStart();
                }
            }
        },
        hidePopups: function() {
            var currFormObj = kony.application.getCurrentForm();
            if (currFormObj.accountListMenu.isVisible === true) {
                if (currFormObj.accountListMenu.segAccountListActions.contentOffsetMeasured.y == 0) {
                    setTimeout(function() {
                        currFormObj.accountListMenu.isVisible = false;
                        if (currFormObj.imgAccountTypes.src === "arrow_up.png" || currFormObj.imgAccountTypes.src === "chevron_up.png") {
                            currFormObj.imgAccountTypes.src = "arrow_down.png";
                        }
                    }, "17ms")
                }
            }
            this.hideContextMenu();
        },

        nullifyPopupOnTouchStart: function() {
            this.view.flxAccountTypes.onTouchStart = null;
        },

        changeUi: function(width) {
            if (kony.application.getCurrentBreakpoint() === 1024 || orientationHandler.isTablet) {
                this.view.flxRightContainer.reverseLayoutDirection = true;
            //    this.view.accountListMenu.left = "30dp";
            //    this.view.accountListMenu.top = "50dp";
            } else {
                this.view.flxRightContainer.reverseLayoutDirection = false;
            }

        },

      viewInstrumentDetails: function(data) {
        scope_WealthPresentationController.instrumentAction = 'SearchInstrument';
        
        let paramsProdDetails = {
          "ISINCode": data.ISIN?data.ISIN:"",
          "RICCode": data.RICCode?data.RICCode:"",
          "instrumentId": data.instrumentId
        };
		if (data.application) {
           scope_WealthPresentationController.application = data.application;
           paramsProdDetails.application = data.application;
          }
        applicationManager.getModulesPresentationController("WealthPortfolioUIModule").setProductDetails(paramsProdDetails);
        applicationManager.getModulesPresentationController("WealthPortfolioUIModule").setDetailsOfInstrument(data);
        applicationManager.getModulesPresentationController("WealthPortfolioUIModule").flow="";
         new kony.mvc.Navigation({
                    "appName": "WealthOrderMA",
                    "friendlyName": "frmProductDetails"
                }).navigate();
      },

        getCashCardDetails: function() {
            var params = {
                "portfolioId": portfolioId
            };
            applicationManager.getPresentationUtility().showLoadingScreen();
            var wealthModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("WealthPortfolioUIModule");
            wealthModule.presentationController.getCashBalanceDetails(params);
        },
        getAccountListDetails: function() {
            if (this.view.accountListMenu.isVisible === false) {
                this.view.imgAccountTypes.src = ViewConstants.IMAGES.ARRAOW_UP;
                this.changeUi();
              this.view.flxAccountList.setVisibility(true);
                this.view.accountListMenu.setVisibility(true);
                this.updateAccountList(accountsListObj);


            } else {
                this.view.imgAccountTypes.src = ViewConstants.IMAGES.ARRAOW_DOWN;
                this.view.flxAccountList.setVisibility(false);
              this.view.accountListMenu.setVisibility(false);

            }
        },


        updateCashCard: function(uidata, flag) {
            var data = uidata.cashAccounts;
            var asset = uidata.assets;
          var temp=Object.assign({}, uidata);
			assets=JSON.parse(JSON.stringify(temp));
            var currForm = kony.application.getCurrentForm();

            /*	this.view.flxInstrument.zIndex = 100;
                  this.view.flxInstrumentDetails.isVisible = true;*/
            var segdata = [];
            for (var list in data) {

                var storeData;
                storeData = {
                    balance: applicationManager.getFormatUtilManager().formatAmountandAppendCurrencySymbol(data[list].balance, data[list].currency),
                    referenceCurrVal: (data[list].referenceCurrencyValue!== "")?{"isVisible": true,"text":applicationManager.getFormatUtilManager().formatAmountandAppendCurrencySymbol(data[list].referenceCurrencyValue, uidata.totalCashBalanceCurrency)}:{"isVisible": false,"text":""},
                    cashAccName: CommonUtilities.truncateStringWithGivenLength(data[list].accountName + "...", 26) + CommonUtilities.getLastFourDigit(data[list].accountNumber),
                  sep: {"height": "1Dp"}
                }
                if(list==data.length-1){
                                  storeData = {
                    balance: applicationManager.getFormatUtilManager().formatAmountandAppendCurrencySymbol(data[list].balance, data[list].currency),
                    referenceCurrVal: (data[list].referenceCurrencyValue!== "")?{"isVisible": true,"text":applicationManager.getFormatUtilManager().formatAmountandAppendCurrencySymbol(data[list].referenceCurrencyValue, uidata.totalCashBalanceCurrency)}:{"isVisible": false,"text":""},
                    cashAccName: CommonUtilities.truncateStringWithGivenLength(data[list].accountName + "...", 26) + CommonUtilities.getLastFourDigit(data[list].accountNumber),
                  sep: { "height": "0Dp"}
                }
                }
                  if (storeData.referenceCurrVal.text == ""){
                    storeData.lblVer = "";
                }
                else{
                     storeData.lblVer = "|";
                }
                segdata.push(storeData);
            }
            this.view.segmentCashBal.widgetDataMap = {
                lblBalAmount: "balance",
                lblRerfCashAmount: "referenceCurrVal",
                lblCashAccountName: "cashAccName",
                lblVertical: "lblVer",
                lblSeparator1:"sep"
            }
            this.view.segmentCashBal.setData(segdata);
          if (uidata.totalCashBalance !== ""){
             this.view.lblAccountVal.text = applicationManager.getFormatUtilManager().formatAmountandAppendCurrencySymbol(uidata.totalCashBalance, uidata.totalCashBalanceCurrency);
          }
           else{
             if(data.length == 1 && data[0].referenceCurrencyValue==""){
               this.view.lblAccountVal.text =  applicationManager.getFormatUtilManager().formatAmountandAppendCurrencySymbol(data[0].balance, data[0].currency);
             }
             else{
             this.view.lblAccountVal.text = "";
             }
           }
          scope_WealthPresentationController.cashBalance = this.view.lblAccountVal.text;          
            currForm.forceLayout();
            if (data.length > 1 ) {
           
                this.view.segmentCashBal.setVisibility(true);
                this.view.lblSeparator1.isVisible = true;
                this.view.lblSep.isVisible = false;
            } else {
                this.view.segmentCashBal.setVisibility(false);
                this.view.lblSeparator1.isVisible = false;
                this.view.lblSep.isVisible = true;
            }
            if (asset.length > 0) {
                this.view.flxAsset.setVisibility(true);
                this.setGraphData(uidata);
            } else {
              uidata.error="No Data";
                this.setGraphData(uidata);
            }
            if (data.length === 0) {
                this.view.flxCashCard.setVisibility(false);
            }
			//if(flag && portfolioservicesdone===0){
          if(flag){
			cashCardServiceFlag=0;
			applicationManager.getPresentationUtility().dismissLoadingScreen();
			}
        },


        navigateToConvertCurr: function() {
			var navManager = applicationManager.getNavigationManager();
			if(scope_WealthPresentationController.isJointAccount === false){
			navManager.setCustomInfo("frmCurrencyConverter", portfolioId);
			new kony.mvc.Navigation({"appName" : "WealthOrderMA", "friendlyName" : "frmCurrencyConverter"}).navigate();
			}
		},


        /**
         * Component setGraphData
         * Create Dounut chart and bind data
         */
        setGraphData: function(uidata) {
            this.view.totalAssets.createDonutChart(uidata);
        },


        goToTransfer: function() {
            var scope = this;
            var configurationManager = applicationManager.getConfigurationManager();
          if(scope_WealthPresentationController.isJointAccount === false){
            if (configurationManager.getBaseCurrency() === "EUR") {
                kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "TransferEurUIModule", "appName" : "RegionalTransferMA"}).presentationController.showTransferScreen({
                    context: "MakePaymentOwnAccounts",
                    isTransferCashWealth: true
                });
            } else {
                kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "TransferFastUIModule", "appName" : "RegionalTransferMA"}).presentationController.showTransferScreen({
                    isTransferCashWealth: true
                });
            }
          }
        },


        updateAccountList: function(accountList) {

            var data = accountList;
            var currForm = kony.application.getCurrentForm();
            /*	this.view.flxInstrument.zIndex = 100;
            this.view.flxInstrumentDetails.isVisible = true;*/
            var segdata = [];
            for (var list in data) {

                var storeData;
                storeData = {
                    acctName: CommonUtilities.truncateStringWithGivenLength(data[list].accountName + "...", 26) + CommonUtilities.getLastFourDigit(data[list].accountNumber),
                    flx: {
                        "onClick": function(event, context) {
                            this.onInvestmentAccountSelect(event, context);
                        }.bind(this)
                    },
                    portfolioId: data[list].portfolioId,
                   referenceCurrency: data[list].referenceCurrency
                }
                segdata.push(storeData);
            }
            this.view.accountListMenu.segAccountListActions.widgetDataMap = {
                lblUsers: "acctName",
                flxAccountTypes: "flx",
                dummyId: "portfolioId"
            }
            this.view.accountListMenu.segAccountListActions.setData(segdata);
            currForm.forceLayout();
        },

        onInvestmentAccountSelect: function(event, context) {
            this.view.imgAccountTypes.src = ViewConstants.IMAGES.ARRAOW_DOWN;
            var rowIndex = this.view.accountListMenu.segAccountListActions.selectedRowIndex[1];
            var rowData = this.view.accountListMenu.segAccountListActions.data[rowIndex];
            if (portfolioId === rowData.portfolioId) {
              this.view.flxAccountList.setVisibility(false);
                this.view.accountListMenu.setVisibility(false);
            } else {
                portfolioId = rowData.portfolioId;
              this.view.flxAccountList.setVisibility(false);
                this.view.accountListMenu.setVisibility(false);
	                this.checkPermission();
                this.postShow();
                if(this.view.btnTab1.isVisible === true){
                 this.portfolioSummaryAction();
                }
                var isEuro = false;
                var configManager = applicationManager.getConfigurationManager();
                if (configManager.getBaseCurrency() === 'EUR') {
                    isEuro = true;
                }
                var userId = applicationManager.getUserPreferencesManager().getUserId();
               var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
               wealthModule.setPortfolioId(portfolioId);
              refCurrecny=rowData.referenceCurrency;
               wealthModule.setPortfolioCurrency(rowData.referenceCurrency);
                this.view.instrumentSearch.setPortfolioId(portfolioId);
                this.view.portfolioDetails.setPortfolioId(portfolioId, userId, isEuro,refCurrecny);

                this.view.lblAccountTypes.text = rowData.acctName;
            }
        },

        portfolioLevelChartService: function() {
            let filterValues = Object.keys(this.chartFilters).map(key => this.chartFilters[key]);
            this.view.investmentLineChart.setChartFilters(filterValues);
            this.view.investmentLineChart.currentFilter = "1M";
            var params = {
                "portfolioId": portfolioId,
                "navPage": "Portfolio",
                "graphDuration": "OneM"
            };
            applicationManager.getPresentationUtility().showLoadingScreen();
            var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
            wealthModule.getCashBalanceDetails(params);
        },
      
      getPortfolioDetails: function(){
            let filterValues = Object.keys(this.chartFilters).map(key => this.chartFilters[key]);
            this.view.investmentLineChart.setChartFilters(filterValues);
            this.view.investmentLineChart.currentFilter = "1M";
            var params = {
                "portfolioId": portfolioId,
                "navPage": "Portfolio",
                "graphDuration": "OneM"
            };
        applicationManager.getPresentationUtility().showLoadingScreen();
            var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
            wealthModule.getCashBalanceDetails(params);
      },
      
        hideContextMenu: function() {
            var currFormObj = kony.application.getCurrentForm();
            if (currFormObj.portfolioDetails.contextualMenuVisibility()) {
                setTimeout(function() {
                    currFormObj.portfolioDetails.hideContextualMenu();
                }, "17ms")
            }
        },
        checkPermission: function() {
            var configManager = applicationManager.getConfigurationManager();
          var checkUserPermission = function (permission) {
            return configManager.checkUserPermission(permission);
          }; 
          
            let self = this;
            //Portfolio Details page Permission
            let portfolioDetailViewPermission = applicationManager.getConfigurationManager().checkUserPermission("WEALTH_PORTFOLIO_DETAILS_SUMMARY_VIEW");

            self.view.btnTab1.isVisible = portfolioDetailViewPermission;
            self.view.flxPortofolioValues.isVisible = portfolioDetailViewPermission;
            self.view.flxPortofolioLineChart.isVisible = portfolioDetailViewPermission;
            self.view.flxSeparator2.isVisible = portfolioDetailViewPermission;
            self.view.flxSeparatorInvestment.isVisible = portfolioDetailViewPermission;

            let portfolioDetailAccountViewPermission = applicationManager.getConfigurationManager().checkUserPermission("WEALTH_PORTFOLIO_DETAILS_ACCOUNT_INFO_VIEW");
            self.view.btnTab2.isVisible = portfolioDetailAccountViewPermission;
            if (!self.view.btnTab1.isVisible) {
                self.view.flxAccountInfoValues.isVisible = portfolioDetailAccountViewPermission;
                self.accountInfoAction();
            } else {
                self.portfolioSummaryAction();
            }
            if (!self.view.btnTab1.isVisible && !self.view.btnTab2.isVisible) {
                self.view.flxPortfolio.isVisible = false;
            }

            let portfolioDetailCashbalancePermission = applicationManager.getConfigurationManager().checkUserPermission("WEALTH_PORTFOLIO_DETAILS_CASH_BALANCE_VIEW");
            let btnTransferCashPermission = applicationManager.getConfigurationManager().checkUserFeature("WEALTH_CASH_MANAGEMENT") && configManager.getTransferCashPermission().some(checkUserPermission);
            let btnConvertCurrencyPermission = applicationManager.getConfigurationManager().checkUserFeature("WEALTH_CASH_MANAGEMENT") && configManager.getConvertCurrencyPermission().some(checkUserPermission);
            let cashBalanceDetailsPermission = applicationManager.getConfigurationManager().checkUserFeature("WEALTH_CASH_MANAGEMENT") && configManager.getCashBalanceViewPermission().some(checkUserPermission);
                    
            self.view.segmentCashBal.isVisible = cashBalanceDetailsPermission;

            self.view.flxCashCard.isVisible = portfolioDetailCashbalancePermission;
            self.view.lblConvertCurrency.isVisible = btnConvertCurrencyPermission;
            self.view.lblTransferCash.isVisible = btnTransferCashPermission;

            let portfolioDetailAssetAllocationPermission = applicationManager.getConfigurationManager().checkUserPermission("WEALTH_PORTFOLIO_DETAILS_ASSET_ALLOCATION_VIEW");

            self.view.flxAsset.isVisible = portfolioDetailAssetAllocationPermission;

            let portfolioDetailProductDetailsPermission = applicationManager.getConfigurationManager().checkUserFeature("WEALTH_PRODUCT_DETAILS") && configManager.getPortfolioProductSearchViewPermissions().some(checkUserPermission);
            let portfolioDetailWatchListPermission = applicationManager.getConfigurationManager().checkUserFeature("WEALTH_WATCHLIST") && configManager.watchlistViewInstrumentPermissions().some(checkUserPermission);

            self.view.flxInstrument.isVisible = portfolioDetailProductDetailsPermission;
            self.view.btnViewFavorite.isVisible = portfolioDetailWatchListPermission;
        }      
     
    };
});
