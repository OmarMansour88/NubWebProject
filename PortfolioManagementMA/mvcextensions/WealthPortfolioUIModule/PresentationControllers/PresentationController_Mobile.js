define(['CommonUtilities'], function(CommonUtilities) {
    /**
     * User defined presentation controller
     * @constructor
     * @extends kony.mvc.Presentation.BasePresenter
     */
    function Wealth_PresentationController() {
      kony.mvc.Presentation.BasePresenter.call(this);
        
        scope_WealthPresentationController = this;
        //stateNavigation - holds the value as true if it is on state management form like amount or review screen and for rest of screens hold false value
      scope_WealthPresentationController.downloadParams = "";
        scope_WealthPresentationController.stateNavigation = "";
      scope_WealthPresentationController.sortByValueWatchlist = "";
      scope_WealthPresentationController.sortByValueHoldings = "";
      scope_WealthPresentationController.sortByValueTrans = "";
      scope_WealthPresentationController.sortByValueInstrumentTrans = "";
      scope_WealthPresentationController.sortByValueOrders = "";
      scope_WealthPresentationController.sortByValueAccounts = "";
      scope_WealthPresentationController.selectedDateRangeDetails = {};
      scope_WealthPresentationController.portdet={};
        //stateTriggeredForm - holds the value as mame of form where state management has triggered.
        scope_WealthPresentationController.stateTriggeredForm = "";
        
        scope_WealthPresentationController.portfolioDetails = {};
       
        scope_WealthPresentationController.currencyRate = {};
        scope_WealthPresentationController.assetObj = {};
        scope_WealthPresentationController.convertNowFlow = true;
        scope_WealthPresentationController.marketValue = "";
        scope_WealthPresentationController.currency = "";
        scope_WealthPresentationController.instrumentAcc = false;
        scope_WealthPresentationController.amount = "0.00";
        scope_WealthPresentationController.newAccount = {};
      scope_WealthPresentationController.newAccountsArr = [];
      scope_WealthPresentationController.balanceArr = [];
        scope_WealthPresentationController.addCurrency = false;
        scope_WealthPresentationController.fromCurrencyFlag = "";
        scope_WealthPresentationController.toCurrencyFlag = "";
        scope_WealthPresentationController.fromAccountBalance = "";
        scope_WealthPresentationController.toAccountBalance = "";
        scope_WealthPresentationController.totalCashBalance = "";
        scope_WealthPresentationController.totalCashBalanceCurrency = "";
        scope_WealthPresentationController.instrumentDetailsEntry = false;
        scope_WealthPresentationController.maskedAccountName="";
        scope_WealthPresentationController.portfolioId = "",
        scope_WealthPresentationController.refCurrencyId = "",
        scope_WealthPresentationController.accountNumber = "",
        scope_WealthPresentationController.portfolioCashAccounts = "",
        scope_WealthPresentationController.benchmark = "",
        scope_WealthPresentationController.currencyConv = false;
        scope_WealthPresentationController.toConv = false;
        scope_WealthPresentationController.currencyConvData = false;
       
        
        scope_WealthPresentationController.convertCurrency = false;
        scope_WealthPresentationController.searchEntryPoint = false;
		scope_WealthPresentationController.isHistory = false;
		scope_WealthPresentationController.isFrmOrder = false;
		scope_WealthPresentationController.orderList = [];
        scope_WealthPresentationController.ordType = "open";
		scope_WealthPresentationController.isPortfolio = false;
        scope_WealthPresentationController.isDateRange = false;
      scope_WealthPresentationController.dateBetween={};
        scope_WealthPresentationController.isFirst = false;
         scope_WealthPresentationController.verify=false;
      scope_WealthPresentationController.jointAccountDetails='';
      scope_WealthPresentationController.isJointAccount = false;
       scope_WealthPresentationController.reportType='';
      scope_WealthPresentationController.reportParams="";
       scope_WealthPresentationController.reportData="";
      scope_WealthPresentationController.recentActivityService= true;
      scope_WealthPresentationController.marketIndexService= true;
      scope_WealthPresentationController.marketNewsService= true;
      scope_WealthPresentationController.assetsService= false;
      scope_WealthPresentationController.investSummaryService= true;
      scope_WealthPresentationController.isTapIntegration= false;
      scope_WealthPresentationController.watchlistFlow="";
	  scope_WealthPresentationController.dashboardErrorFlow= false;
      this.editFlow = false;
     
      
     
      scope_WealthPresentationController.portfolioIdUpdate= "";
        this.AccountId = "";
        this.AccountName = "";
        this.navPage = "";
        this.watchlistAccountsList = {};
        this.watchlistAccountName = "";
        this.watchlistPortfolioId = "";
        this.watchlistCashAccountsList = {};
       this.instrumentId = "";
      this.instrumentTransactions = "";
      this.ISINCode="";
      this.RICCode="";
    }

    inheritsFrom(Wealth_PresentationController, kony.mvc.Presentation.BasePresenter);

    /**
     * Overridden Method of kony.mvc.Presentation.BasePresenter
     * This method gets called when presentation controller gets initialized
     * @method
     */
    Wealth_PresentationController.prototype.initializePresentationController = function() {

    };
    Wealth_PresentationController.prototype.setVerifyFlow = function(params) {
        this.editFlow = params;
    };
  
    Wealth_PresentationController.prototype.setAccountId = function(params) {
        this.AccountId = params;
    };
    Wealth_PresentationController.prototype.getAccountId = function() {
        return this.AccountId;
    };
    Wealth_PresentationController.prototype.setWatchlistAccountsList = function(params) {
        this.watchlistAccountsList = params;
    };
    Wealth_PresentationController.prototype.getWatchlistAccountsList = function() {
        return this.watchlistAccountsList;
    };
    Wealth_PresentationController.prototype.setMaskedAccountName = function(params) {
		scope_WealthPresentationController.maskedAccountName=params;
        this.AccountName = params;
    };
    Wealth_PresentationController.prototype.getMaskedAccountName = function() {
        return this.AccountName;
    };

  Wealth_PresentationController.prototype.setInstrumentId = function(instrumentId) {
        this.instrumentId = instrumentId;
    };
    Wealth_PresentationController.prototype.getInstrumentId = function() {
        return this.instrumentId;
    };
  
   
   Wealth_PresentationController.prototype.setISINCode = function(ISINCode) {
        this.ISINCode = ISINCode;
    };
    Wealth_PresentationController.prototype.getISINCode = function() {
        return this.ISINCode;
    };
   Wealth_PresentationController.prototype.setRICCode = function(RICCode) {
        this.RICCode = RICCode;
    };
    Wealth_PresentationController.prototype.getRICCode = function() {
        return this.RICCode;
    };

    Wealth_PresentationController.prototype.getInvestmentData = function(data) {
        var navManager = applicationManager.getNavigationManager();
        var prevdata = navManager.getCustomInfo('frmPlaceOrder');
        var dataFromResponse = data.response.portfolioHoldings;
        var length = dataFromResponse.length;
        var count = 0;
        if (count < length) {
            for (var list in dataFromResponse) {
                if (dataFromResponse[list].RICCode === prevdata.RICCode) {
                    scope_WealthOrderPresentationController.currentPos = dataFromResponse[list].marketValue;
                    scope_WealthOrderPresentationController.quantity = dataFromResponse[list].quantity;
                    // navManager.navigateTo('frmPlaceOrder');
                } else {
                    count++;
                }
            }
        } else {
            scope_WealthOrderPresentationController.currentPos = '';
            scope_WealthOrderPresentationController.quantity = '';
            //  navManager.navigateTo('frmPlaceOrder');
        }
    };


    /**
     * This method is used to handle the backward navigation including state management
     */
    Wealth_PresentationController.prototype.commonFunctionForgoBack = function() {
        var navManager = applicationManager.getNavigationManager();
        var currentForm = kony.application.getCurrentForm();
        // If state management is triggered and if it is not on the state triggered form then we will navigate to state triggered form and ignoring it's entry(passing additional parameter boolean along with the form name to navigateTo method) into the navigation stack as the form is being re-visited
        if (scope_WealthPresentationController.stateNavigation && scope_WealthPresentationController.stateTriggeredForm !== currentForm.id) {
            navManager.navigateTo(scope_WealthPresentationController.stateTriggeredForm, true);
            scope_WealthPresentationController.stateNavigation = false;
            scope_WealthPresentationController.stateTriggeredForm = "";
        }
        // This is triggered when the forms entry into navigation manager's stack is equal to one .
        else {
            navManager.goBack();
        }
    };

    Wealth_PresentationController.prototype.commonFunctionForNavigation = function(formName) {
        var navManager = applicationManager.getNavigationManager();
        var currentForm = kony.application.getCurrentForm();
        // If state management is triggered and if it is not on the state triggered form then we will navigate to state triggered form and ignoring it's entry(passing additional parameter boolean along with the form name to navigateTo method) into the navigation stack as the form is being re-visited
        if (scope_WealthPresentationController.stateNavigation && scope_WealthPresentationController.stateTriggeredForm !== currentForm.id) {
            navManager.navigateTo(scope_WealthPresentationController.stateTriggeredForm, true);
            scope_WealthPresentationController.stateNavigation = false;
            scope_WealthPresentationController.stateTriggeredForm = "";
        }
        // If state management is triggered and if it is on the state triggered form then we will navigate to specified form and ignoring it's entry into the navigation stack as the form is being re-visited
        else if (scope_WealthPresentationController.stateNavigation) {
            navManager.navigateTo(formName, true);
        }
        // This is triggered when the forms are being visited for the first time.
        else {
            navManager.navigateTo(formName);
        }
    };
    /**
     * 
     **/
    Wealth_PresentationController.prototype.getAssetsAllocation = function(params) {
        var WealthPortfolioManager = applicationManager.getWealthPortfolioManager();
        WealthPortfolioManager.getAssets(params, this.getAssetsSuccessCallBack.bind(this), this.getAssetsErrorCallBack.bind(this));
    };
    /**
     *
     **/
    Wealth_PresentationController.prototype.getAssetsSuccessCallBack = function(obj) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
        var navManager = applicationManager.getNavigationManager();
        var data = {};
        data.response = obj;
        //scope_WealthPresentationController.assetObj = data;
        if (kony.application.getCurrentForm().id === "frmInvestmentAcc") {

            var cashData = navManager.getCustomInfo("frmInvestmentAcc");
            if (kony.sdk.isNullOrUndefined(cashData)) {
                var cashData = {};
                cashData.cashData = obj;
            } else {
                cashData.cashData = obj;
            }
            navManager.setCustomInfo('frmInvestmentAcc', cashData);
          new kony.mvc.Navigation({"appName" : "WealthOrderMA", "friendlyName" : "frmPlaceOrder"}).navigate();

        } else {
            var controller;
            if (this.navPage === "frmWatchlist") {
                scope_WealthPresentationController.portfolioIdUpdate = scope_WealthPresentationController.watchlistPortfolioId;
                controller = applicationManager.getPresentationUtility().getController('frmWatchlist', true);
                controller.populateCashBalance(data.response);
               applicationManager.getModulesPresentationController({ "moduleName": "WealthOrderUIModule", "appName": "WealthOrderMA" }).isFrmWatchlist = true;
            } else {
                controller = applicationManager.getPresentationUtility().getController('frmPortfolioDetails', true);
                controller.populateAssets(data);
            }
            // navManager.setCustomInfo("frmPortfolioDetails", data);

        }

    };
    /**
     *
     **/
    Wealth_PresentationController.prototype.getAssetsErrorCallBack = function() {

    };
    /**
     * 
     **/
    Wealth_PresentationController.prototype.getDashboardGraphDetails = function(params) {
        applicationManager.getPresentationUtility().showLoadingScreen();
        var WealthPortfolioManager = applicationManager.getWealthPortfolioManager();
        WealthPortfolioManager.getDashboardDetails(params, this.getDashboardDetailsSuccessCallback.bind(this), this.getDashboardDetailsErrorCallback.bind(this));
    };
    /**
     *
     **/
    Wealth_PresentationController.prototype.getDashboardDetailsSuccessCallback = function(obj) {
        var navManager = applicationManager.getNavigationManager();
        var data = {};
        data.response = obj;
      var controller = applicationManager.getPresentationUtility().getController('frmUnifiedDashboard', true);
      if (data.response && data.response.graphDuration && Object.keys(data.response.graphDuration).length > 0) {
        scope_WealthPresentationController.investSummaryService = true;
        controller.checkPermissions();
        controller.lineChartData(data);
        applicationManager.getPresentationUtility().dismissLoadingScreen();
      } else {        
        scope_WealthPresentationController.investSummaryService = false;
        controller.checkPermissions();
		applicationManager.getPresentationUtility().dismissLoadingScreen();
      }
    };
    /**
     *
     **/
    Wealth_PresentationController.prototype.getDashboardDetailsErrorCallback = function() {
        scope_WealthPresentationController.investSummaryService = false;
	    var controller = applicationManager.getPresentationUtility().getController('frmUnifiedDashboard', true);
        controller.checkPermissions();
		applicationManager.getPresentationUtility().dismissLoadingScreen();
    };
      /**
     * 
     **/
    Wealth_PresentationController.prototype.getAccountActivity = function(params) {
        applicationManager.getPresentationUtility().showLoadingScreen();
        var WealthPortfolioManager = applicationManager.getWealthPortfolioManager();
        WealthPortfolioManager.getAccountActivityList(params, this.getAccountActivitySuccessCallback.bind(this), this.getAccountActivityErrorCallback.bind(this));
    };
    /**
     *
     **/
    Wealth_PresentationController.prototype.getAccountActivitySuccessCallback = function(obj) {
        var navManager = applicationManager.getNavigationManager();
        var data = {};
        data.response = obj;
        navManager.setCustomInfo("frmAccounts", data);
        applicationManager.getPresentationUtility().dismissLoadingScreen();
       // var controller = applicationManager.getPresentationUtility().getController('frmAccounts', true);
      //  controller.setDataToSegment(data);
      navManager.navigateTo("frmAccounts");
    };
    /**
     *
     **/
    Wealth_PresentationController.prototype.getAccountActivityErrorCallback = function() {

    };
    Wealth_PresentationController.prototype.getPortfolioAndGraphDetails = function(params) {
        applicationManager.getPresentationUtility().showLoadingScreen();
        var WealthPortfolioManager = applicationManager.getWealthPortfolioManager();
       var configManager= applicationManager.getConfigurationManager();
      //let portfolioDetailViewPermission =configManager.checkUserPermission("PORTFOLIO_DETAILS_VIEW");
      let portfolioDetailViewPermission = true;
      if(portfolioDetailViewPermission)
        {
          WealthPortfolioManager.getPortfolioDetails(params, this.getPortfolioDetailsSuccessCallback.bind(this), this.getPortfolioDetailsErrorCallback.bind(this));  
        }        
      else
        {
          let  data={};
          var navManager = applicationManager.getNavigationManager();
          
           applicationManager.getPresentationUtility().dismissLoadingScreen();
          navManager.setCustomInfo("frmPortfolioDetails", data);
            navManager.navigateTo("frmPortfolioDetails");
        }
    };
    /**
     *
     **/
    Wealth_PresentationController.prototype.getPortfolioDetailsSuccessCallback = function(obj) {
        var navManager = applicationManager.getNavigationManager();
        var data = {};
        
        var rowIndexValueTemp=navManager.getCustomInfo("frmPortfolioRowIndex");
        data.response = obj.instrumentTotal[0];
        var accountName = rowIndexValueTemp.accountName;
        var accountID = rowIndexValueTemp.accountNumber;
        var maskAccountName = CommonUtilities.truncateStringWithGivenLength(accountName + "....", 26) + CommonUtilities.getLastFourDigit(accountID);
        this.setAccountId(accountID);
        this.setMaskedAccountName(maskAccountName);
        if (kony.application.getCurrentForm() !== "frmPortfolioDetails") {
            applicationManager.getPresentationUtility().dismissLoadingScreen();
            scope_WealthPresentationController.portdet=data;
            navManager.setCustomInfo("frmPortfolioDetails", data);
            new kony.mvc.Navigation({"appName" : "PortfolioManagementMA", "friendlyName" : "frmPortfolioDetails"}).navigate();
        } else {
            applicationManager.getPresentationUtility().dismissLoadingScreen();
            var controller = applicationManager.getPresentationUtility().getController('frmPortfolioDetails', true);
            controller.bindNewGraphData(data);
        }
    };
    /**
     *
     **/
    Wealth_PresentationController.prototype.getPortfolioDetailsErrorCallback = function() {

    };
    /**
     *
     **/
    /**
     * This method is used to initialise the state management flow
     * initialized- {boolean} hold the initialisation state value
     * triggeredForm - {String} holds the form name from where state management has been triggered.
     */
    Wealth_PresentationController.prototype.initializeStateData = function(initialized, triggeredForm) {
        scope_WealthPresentationController.stateNavigation = initialized;
        scope_WealthPresentationController.stateTriggeredForm = triggeredForm;
    };
    Wealth_PresentationController.prototype.getWealthObject = function() {
        var wealth = applicationManager.getWealthPortfolioManager();
        var obj = wealth.getWealthObject();
        return obj;
    };
    Wealth_PresentationController.prototype.setCurrencyData = function(data) {
        var wealth = applicationManager.getWealthPortfolioManager();
        // wealth.setWealthAttribute("buyCurrency", data.buyCurrency);
        //  wealth.setWealthAttribute("sellCurrency", data.sellCurrency);
        wealth.setWealthAttribute("buyAmount", data.buyAmount);
        wealth.setWealthAttribute("sellAmount", data.sellAmount);
    };
 
  
    // Holdings List
    Wealth_PresentationController.prototype.getHoldings = function(params) {
        applicationManager.getPresentationUtility().showLoadingScreen();
        var WealthPortfolioManager = applicationManager.getWealthPortfolioManager();
        WealthPortfolioManager.getHoldingList(params, this.getHoldingsSuccess.bind(this), this.getHoldingsError.bind(this));
    };
	
  Wealth_PresentationController.prototype.getHoldingsSuccess = function(response) {

      var navManager = applicationManager.getNavigationManager();
      var data = {};
      var param = {};
      data.response = response;
      navManager.setCustomInfo("frmHoldings", data);
      if (kony.application.getCurrentForm().id === "frmInvestmentAcc") {
          applicationManager.getPresentationUtility().dismissLoadingScreen();
          scope_WealthPresentationController.getInvestmentData(data);
          param = {
              "portfolioId": scope_WealthOrderPresentationController.onSelectPortfolioId
          };
          scope_WealthPresentationController.getAssetsAllocation(param);

      } else if ((kony.application.getCurrentForm().id === "frmInstrumentSearch") || (kony.application.getCurrentForm().id === "frmWatchlist")) {

          let dataTemp = navManager.getCustomInfo("frmInstrumentDetails");
          if (!dataTemp)
              dataTemp = {};
          if ((response.portfolioHoldings).length > 0) {

              if (kony.application.getCurrentForm().id === "frmInstrumentSearch") {
                  dataTemp.response = response.portfolioHoldings[0];
                  param = {
                      "ISINCode": response.portfolioHoldings[0].ISIN ? response.portfolioHoldings[0].ISIN : "",
                      "RICCode": response.portfolioHoldings[0].RICCode ? response.portfolioHoldings[0].RICCode : "",
                      "instrumentId": scope_WealthPresentationController.getInstrumentId(),
                      "application": scope_WealthPresentationController.applicationId
                  };
              } else {
                  param = {
                      "ISINCode": response.portfolioHoldings[0].ISIN ? response.portfolioHoldings[0].ISIN : "",
                      "RICCode": response.portfolioHoldings[0].RICCode ? response.portfolioHoldings[0].RICCode : "",
                      "instrumentId": dataTemp.response.instrumentId,
                      "application": dataTemp.response.application
                  };
				  dataTemp.response = response.portfolioHoldings[0];
              }
          } else {
              dataTemp = {};
              dataTemp.response = {};
              param = {};
              if ((kony.application.getCurrentForm().id === "frmWatchlist")) {
                  var data1 = applicationManager.getNavigationManager().getCustomInfo("frmInstrumentDetails");
                  dataTemp.response.RICCode = data1.response.RIC;
                  param = {
                      "ISINCode": data1.response.ISINCode,
                      "RICCode": data1.response.RIC,
                      "instrumentId": data1.response.instrumentId,
                      "application": scope_WealthPresentationController.applicationId
                  };
              } else {
                  dataTemp.response.RICCode = scope_WealthPresentationController.getRICCode();
                  param = {
                      "ISINCode": scope_WealthPresentationController.getISINCode(),
                      "RICCode": scope_WealthPresentationController.getRICCode(),
                      "instrumentId": scope_WealthPresentationController.getInstrumentId(),
                      "application": scope_WealthPresentationController.applicationId
                  };
              }
          }
          navManager.setCustomInfo('frmInstrumentDetails', dataTemp);

          //   var controller = applicationManager.getPresentationUtility().getController('frmInstrumentDetails', true);
          //    controller.setCurrentPosition(dataTemp);

          scope_WealthPresentationController.getInstrumentDetails(param);
      } else {
          applicationManager.getPresentationUtility().dismissLoadingScreen();
          navManager.navigateTo("frmHoldings");
      }
  };

    Wealth_PresentationController.prototype.getHoldingsError = function(err) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
    };
    Wealth_PresentationController.prototype.getTransactions = function(params) {
        applicationManager.getPresentationUtility().showLoadingScreen();
        var WealthPortfolioManager = applicationManager.getWealthPortfolioManager();
        WealthPortfolioManager.getTransactionList(params, this.getTransactionsSuccess.bind(this), this.getTransactionsError.bind(this));
    };
    Wealth_PresentationController.prototype.getTransactionsSuccess = function(response) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
        var navManager = applicationManager.getNavigationManager();
        var data = {};
        data.response = response;
        navManager.setCustomInfo("frmTransactions", data);
        navManager.navigateTo("frmTransactions");
    };
    Wealth_PresentationController.prototype.getTransactionsError = function(err) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
    };
  Wealth_PresentationController.prototype.getPerformance = function(params) {
        applicationManager.getPresentationUtility().showLoadingScreen();
        var WealthPortfolioManager = applicationManager.getWealthPortfolioManager();
        WealthPortfolioManager.getPerformanceList(params, this.getPerformanceSuccess.bind(this), this.getPerformanceError.bind(this));
    };
    Wealth_PresentationController.prototype.getPerformanceSuccess = function(response) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
        var navManager = applicationManager.getNavigationManager();
        var data = {};
        data.response = response;
        navManager.setCustomInfo("frmPerformance", data);
        navManager.navigateTo("frmPerformance");
    };
    Wealth_PresentationController.prototype.getPerformanceError = function(err) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
    };
    Wealth_PresentationController.prototype.createOrder = function(param) {
        applicationManager.getPresentationUtility().showLoadingScreen();
        var WealthPortfolioManager = applicationManager.getWealthPortfolioManager();
        WealthPortfolioManager.createOrder(param, this.creareOrderSuccess, this.creareOrderFailure);
    }
    Wealth_PresentationController.prototype.creareOrderSuccess = function(response) {
        //scope_WealthPresentationController.currencyRate=response;
        applicationManager.getPresentationUtility().dismissLoadingScreen();
        //scope_WealthPresentationController.commonFunctionForNavigation('frmConvertCurrencyAck');
      new kony.mvc.Navigation({"appName" : "WealthOrderMA", "friendlyName" : "frmConvertCurrencyAck"}).navigate();

    };
    Wealth_PresentationController.prototype.creareOrderFailure = function(error) {
        if (err["isServerUnreachable"]) {
            applicationManager.getPresentationUtility().dismissLoadingScreen();
            applicationManager.getPresentationInterruptHandler().showErrorMessage("postLogin", err);
        } else {
            applicationManager.getPresentationUtility().dismissLoadingScreen();
            var controller = applicationManager.getPresentationUtility().getController('frmSCTermsAndCondition', true);
            controller.bindGenericError(err.error);
        }
    };
    Wealth_PresentationController.prototype.clearWealthData = function() {
        var wealth = applicationManager.getWealthPortfolioManager();
        var obj = wealth.clearWealthObject();
        return obj;
    };

    Wealth_PresentationController.prototype.getHistoricalCurrencyData = function(currencyPairs, dateOrPeriod) {
        let param = {
            currencyPairs,
            dateOrPeriod
        };
        var WealthPortfolioManager = applicationManager.getWealthPortfolioManager();
        applicationManager.getPresentationUtility().showLoadingScreen();
        WealthPortfolioManager.getHistoricalCurrencyRate(param, this.getHistoricalDataSuccess, this.getHistoricalDataFailure);
    };

    Wealth_PresentationController.prototype.getHistoricalDataSuccess = function(response) {
        var controller = applicationManager.getPresentationUtility().getController('frmCurrencyChart', true);
        controller.setChartData(response.historicalData);
        applicationManager.getPresentationUtility().dismissLoadingScreen();
    };

    Wealth_PresentationController.prototype.getHistoricalDataFailure = function(err) {
      var controller = applicationManager.getPresentationUtility().getController('frmCurrencyChart', true);
      controller.setChartData({});
      applicationManager.getPresentationUtility().dismissLoadingScreen();
    };
  
  Wealth_PresentationController.prototype.getHistoricalInstrumentData = function(RICCode, dateOrPeriod,ISINCode,instrumentId) {
        let param = {
            RICCode,
          ISINCode,
          instrumentId,
            dateOrPeriod
        };
        var WealthPortfolioManager = applicationManager.getWealthPortfolioManager();
        applicationManager.getPresentationUtility().showLoadingScreen();
        WealthPortfolioManager.getHistoricalCurrencyRate(param, this.getHistoricalInstrumentDataSuccess, this.getHistoricalInstrumentDataFailure);
    };

    Wealth_PresentationController.prototype.getHistoricalInstrumentDataSuccess = function(response) {
        var navManager = applicationManager.getNavigationManager();
        var data = navManager.getCustomInfo("frmInstrumentDetails");
        if (kony.sdk.isNullOrUndefined(data)) {
             data = {};
            data.chartData = response.historicalData?response.historicalData:{};
        } else {
            data.chartData = response.historicalData?response.historicalData:{};
        }
        navManager.setCustomInfo('frmInstrumentDetails', data);

        applicationManager.getPresentationUtility().dismissLoadingScreen();
      // need to check
        if (scope_WealthPresentationController.instrumentDetailsEntry === true) {
            new kony.mvc.Navigation({"appName" : "WealthOrderMA", "friendlyName" : "frmInstrumentDetails"}).navigate();
        } else {
          var controller = applicationManager.getPresentationUtility().getController('frmInstrumentDetails', true);
           controller.setChartData();
        }
    };
  
   Wealth_PresentationController.prototype.getHistoricalInstrumentDataFailure = function(err) {
        var navManager = applicationManager.getNavigationManager();
        var data = navManager.getCustomInfo("frmInstrumentDetails");
        if (kony.sdk.isNullOrUndefined(data)) {
             data = {};
            data.chartData = {};
        } else {
            data.chartData = {};
        }
        navManager.setCustomInfo('frmInstrumentDetails', data);

        applicationManager.getPresentationUtility().dismissLoadingScreen();
        if (scope_WealthPresentationController.instrumentDetailsEntry === true) {
            new kony.mvc.Navigation({"appName" : "WealthOrderMA", "friendlyName" : "frmInstrumentDetails"}).navigate();
        } else {
          var controller = applicationManager.getPresentationUtility().getController('frmInstrumentDetails', true);
            controller.setChartData();

        }       
    };
    Wealth_PresentationController.prototype.getInstrumentDetails = function(params) {
        applicationManager.getPresentationUtility().showLoadingScreen();
        var WealthPortfolioManager = applicationManager.getWealthPortfolioManager();
        WealthPortfolioManager.getInstrumentDetailsById(params, this.getInstrumentDetailsSuccess.bind(this), this.getInstrumentDetailsError.bind(this));
    };

  Wealth_PresentationController.prototype.getInstrumentDetailsSuccess = function(response) {
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    var navManager = applicationManager.getNavigationManager();
    var data = navManager.getCustomInfo("frmInstrumentDetails");
    if (kony.sdk.isNullOrUndefined(data)) {
      data = {};
      data.instrumentDetails = response;
    } else {
      data.instrumentDetails = response;
    }
    navManager.setCustomInfo('frmInstrumentDetails', data);
    var frmHoldings = navManager.getCustomInfo("frmHoldings");
    var frmWatchlist = navManager.getCustomInfo("frmWatchlist");
    if ((kony.application.getCurrentForm().id === "frmHoldings" && frmHoldings.selHoldings !== 'view') || (kony.application.getCurrentForm().id === "frmWatchlist" && frmWatchlist.selWatchlist !== 'view')) {
      var Data = {};
      if (frmHoldings && frmHoldings.selHoldings === 'buy' || frmWatchlist && frmWatchlist.selWatchlist === 'buy')
        Data.buy = true;
      else
        Data.buy = false;


      navManager.setCustomInfo("frmPlaceOrder", Data);
     new kony.mvc.Navigation({"appName" : "WealthOrderMA", "friendlyName" : "frmPlaceOrder"}).navigate();



    } 
    else if (kony.application.getCurrentForm().id === "frmOrders"){
      navManager.navigateTo('frmInstrumentOrder');
    }
    else {
      if (kony.application.getCurrentForm().id !== "frmInstrumentDetails") {
        // scope_WealthPresentationController.commonFunctionForNavigation('frmInstrumentDetails');
        var filter = '1D';
        /*   if(scope_WealthPresentationController.instrumentChartFilter===""){
                     filter='1D';

                   }else{
                     filter=scope_WealthPresentationController.instrumentChartFilter;
                   }*/
        var ricCode,ISINCode,instrumentId = "";
        if(response.instrumentMinimal[0])
          {
            ricCode = response.instrumentMinimal[0].RICCode;
            ISINCode= response.instrumentMinimal[0].ISINCode;
            instrumentId= response.instrumentMinimal[0].instrumentId;
          }
         else
           {
             ricCode = response.instrumentMinimal.RICCode;
             ISINCode= response.instrumentMinimal.ISINCode;
            instrumentId= response.instrumentMinimal.instrumentId;
           }
          
        
         
        
        scope_WealthPresentationController.getHistoricalInstrumentData(ricCode, filter,ISINCode,instrumentId);
      }

      if (kony.application.getCurrentForm().id === "frmInstrumentDetails") {
        var controller = applicationManager.getPresentationUtility().getController('frmInstrumentDetails', true);
        controller.setDataOnRefresh();
      }
    }


  };
  Wealth_PresentationController.prototype.getInstrumentDetailsError = function(err) {
    applicationManager.getPresentationUtility().dismissLoadingScreen();
   };


    Wealth_PresentationController.prototype.getInstrumentSearchList = function(params) {
        applicationManager.getPresentationUtility().showLoadingScreen();
        var WealthPortfolioManager = applicationManager.getWealthPortfolioManager();
     //   scope_WealthPresentationController.marketValue = marketValue;
        WealthPortfolioManager.getSearchList(params, this.getInstrumentSearchListSuccess.bind(this), this.getInstrumentSearchListError.bind(this));
    };
    Wealth_PresentationController.prototype.getInstrumentSearchListSuccess = function(response) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
        var navManager = applicationManager.getNavigationManager();
        var data = {};
        data.response = response;
        navManager.setCustomInfo("frmInstrumentSearch", data);
   //     navManager.navigateTo("frmInstrumentSearch");
      var controller = applicationManager.getPresentationUtility().getController('frmInstrumentSearch', true);
        controller.setResultDataToSeg();
    
    };
    Wealth_PresentationController.prototype.getInstrumentSearchListError = function(err) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
    };

   

    Wealth_PresentationController.prototype.getStockNewsStory = function(params) {
        applicationManager.getPresentationUtility().showLoadingScreen();
        var WealthPortfolioManager = applicationManager.getWealthPortfolioManager();
        WealthPortfolioManager.getStockNewsStory(params, this.getStockNewsStorySuccess.bind(this), this.getStockNewsStoryError.bind(this));
    };
    Wealth_PresentationController.prototype.getStockNewsStorySuccess = function(response) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
        var navMan = applicationManager.getNavigationManager();
        var currencyData = navMan.getCustomInfo("frmTopNewsDetails");
        if (kony.sdk.isNullOrUndefined(currencyData)) {
            var currencyData = {};
            currencyData.response = response;
        } else {
            currencyData.response = response;
        }
        navMan.setCustomInfo("frmTopNewsDetails", currencyData);
        scope_WealthPresentationController.commonFunctionForNavigation('frmTopNewsDetails');
    };
    Wealth_PresentationController.prototype.getStockNewsStoryError = function(err) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
    };
    Wealth_PresentationController.prototype.getTodayMarketNews = function() {
        applicationManager.getPresentationUtility().showLoadingScreen();
        var WealthPortfolioManager = applicationManager.getWealthPortfolioManager();
        WealthPortfolioManager.getTodayMarketNews("", this.getTodayMarketNewsSuccess.bind(this), this.getTodayMarketNewsError.bind(this));
    };
    Wealth_PresentationController.prototype.getTodayMarketNewsSuccess = function(obj) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
        var data = {};
        data.response = obj.GetSimpleData_Response_2 ? obj.GetSimpleData_Response_2.SimpleDataResult.ItemResponse[0].Item : null;
        //data.response = obj.GetSimpleData_Response_2.SimpleDataResult.ItemResponse[0].Item;
        var controller = applicationManager.getPresentationUtility().getController('frmUnifiedDashboard', true);
        controller.loadMarketNewsSection(data);
    };
    Wealth_PresentationController.prototype.getTodayMarketNewsError = function(err) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
    };

    Wealth_PresentationController.prototype.getTopNews = function(params) {
        applicationManager.getPresentationUtility().showLoadingScreen();
        var WealthPortfolioManager = applicationManager.getWealthPortfolioManager();
        WealthPortfolioManager.getTopNews(params, this.getTopNewsSuccess.bind(this), this.getTopNewsError.bind(this));
    };
    Wealth_PresentationController.prototype.getTopNewsSuccess = function(obj) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
        var data = {};
        data.response = obj;
      if (data.response && Object.keys(data.response.GetSummaryByTopic_Response_1).length > 0) {
        data.fromDashboard = true;
        var navMan = applicationManager.getNavigationManager();
        navMan.setCustomInfo("frmTopNews", data);
        //scope_WealthPresentationController.commonFunctionForNavigation('frmTopNews');
       // navMan.navigateTo("frmTopNews");
new kony.mvc.Navigation({"appName": "PortfolioManagementMA","friendlyName": "frmTopNews"}).navigate();
      } else {        
        scope_WealthPresentationController.marketNewsService = false;
        var controller = applicationManager.getPresentationUtility().getController('frmUnifiedDashboard', true);
        controller.checkPermissions();
      }
    };
    Wealth_PresentationController.prototype.getTopNewsError = function(err) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
        scope_WealthPresentationController.marketNewsService = false;
        var controller = applicationManager.getPresentationUtility().getController('frmUnifiedDashboard', true);
        controller.checkPermissions();
    };

    Wealth_PresentationController.prototype.getRecentActivity = function(params) {
        applicationManager.getPresentationUtility().showLoadingScreen();
        var WealthPortfolioManager = applicationManager.getWealthPortfolioManager();
        WealthPortfolioManager.getRecentActivity(params, this.getRecentActivitySuccess.bind(this), this.getRecentActivityError.bind(this));
    };
    Wealth_PresentationController.prototype.getRecentActivitySuccess = function(obj) {
      applicationManager.getPresentationUtility().dismissLoadingScreen();
      var data = {};
      data.response = obj;
      var navMan = applicationManager.getNavigationManager();
        navMan.setCustomInfo("frmRecentActivity", data);
        //scope_WealthPresentationController.commonFunctionForNavigation('frmRecentActivity');
      //navMan.navigateTo("frmRecentActivity");
      new kony.mvc.Navigation({"appName": "PortfolioManagementMA","friendlyName": "frmRecentActivity"}).navigate();
    };
    Wealth_PresentationController.prototype.getRecentActivityError = function(err) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
        scope_WealthPresentationController.recentActivityService = false;
        var controller = applicationManager.getPresentationUtility().getController('frmUnifiedDashboard', true);
        controller.checkPermissions();
    };

   
  
   
    // getWatchlist
    Wealth_PresentationController.prototype.getWatchlist = function() {
      var navManager = applicationManager.getNavigationManager();
      //       var customerId = applicationManager.getUserPreferencesManager().primaryCustomerId.id;
      var customerId = "";
      var userMan = applicationManager.getUserPreferencesManager();
      if (userMan.backendIdentifier && userMan.backendIdentifier  !== "") {
        customerId = userMan.backendIdentifier;
      } else if(userMan.primaryCustomerId.id && userMan.primaryCustomerId.id !== "") {
        customerId = userMan.primaryCustomerId.id;
      } else {
        customerId = userMan.accessibleCustomerIds[0].id;
      }
      var params = {
        "customerId": customerId,
        "navPage": "frmWatchlist"
      };
      this.getPortfolioList(params);
    };
    //remove FavoriteInstruments
    Wealth_PresentationController.prototype.updateUserFavouriteInstruments = function(params) {
        applicationManager.getPresentationUtility().showLoadingScreen();
        var WealthPortfolioManager = applicationManager.getWealthPortfolioManager();
        WealthPortfolioManager.updateUserFavouriteInstruments(params, this.updateUserFavouriteInstrumentsSuccess.bind(this), this.updateUserFavouriteInstrumentsError.bind(this));
    };
    Wealth_PresentationController.prototype.updateUserFavouriteInstrumentsSuccess = function(obj) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
        var navManager = applicationManager.getNavigationManager();
        navManager.navigateTo("frmWatchlist"); 
    };
    Wealth_PresentationController.prototype.updateUserFavouriteInstrumentsError = function(err) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
    };
    //getPortfolioList
    Wealth_PresentationController.prototype.getPortfolioList = function(params) {
        this.navPage = params.navPage || "";
        applicationManager.getPresentationUtility().showLoadingScreen();
        var WealthPortfolioManager = applicationManager.getWealthPortfolioManager();
        WealthPortfolioManager.getPortfolioList(params, this.getPortfolioListSuccess.bind(this), this.getPortfolioListError.bind(this));
    };
    Wealth_PresentationController.prototype.getPortfolioListSuccess = function(obj) {
      applicationManager.getPresentationUtility().dismissLoadingScreen();
	  scope_WealthPresentationController.dashboardErrorFlow = false;
      var data = {};
     // var marketData = {};
      var configManager =  applicationManager.getConfigurationManager();
      var checkUserPermission = function (permission) {
        return applicationManager.getConfigurationManager().checkUserPermission(permission);
      };
      data.response = obj;
      let marketIndexPermission = configManager.getMarketIndexPermissionsList().some(checkUserPermission);
      let marketTopNewsPermission = configManager.getTopNewsPermissionsList().some(checkUserPermission);  
      let investSummaryPermission = configManager.getInvestmentSummaryPermissionsList().some(checkUserPermission);
      var navMan = applicationManager.getNavigationManager();
      navMan.setCustomInfo("frmUnifiedDashboard", data);
        if (kony.application.getCurrentForm().id === "frmPlaceOrder") {
            this.navPage = "";
            navMan.setCustomInfo("frmInvestmentAcc", data);
            scope_WealthPresentationController.commonFunctionForNavigation('frmInvestmentAcc');
        } else if (this.navPage === "frmWatchlist") {
            this.setWatchlistAccountsList(data);
            //navMan.navigateTo("frmWatchlist");
          new kony.mvc.Navigation({"appName": "WealthOrderMA","friendlyName": "frmWatchlist"}).navigate();
        } else {
          this.navPage = "";
         /* if (marketIndexPermission === true){
            marketData.response = obj.GetSimpleData_Response_2 ? obj.GetSimpleData_Response_2.SimpleDataResult.ItemResponse[0].Item : null;
            controller.loadMarketNewsSection(marketData);
          }*/
          // controller.loadAssetsDetails(data);
          if (investSummaryPermission === true) {
            //var customerId = applicationManager.getUserPreferencesManager().primaryCustomerId.id;
			var customerId = "";
			var userMan = applicationManager.getUserPreferencesManager();
		    if (userMan.backendIdentifier && userMan.backendIdentifier  !== "") {
				customerId = userMan.backendIdentifier;
			  } else if(userMan.primaryCustomerId.id && userMan.primaryCustomerId.id !== "") {
				customerId = userMan.primaryCustomerId.id;
			  } else {
				customerId = userMan.accessibleCustomerIds[0].id;
			  }
			var params = {
              "customerId": customerId,
              "graphDuration": "OneM"
            };
            var wealthModule = kony.mvc.MDAApplication.getSharedInstance().moduleManager.getModule({ "moduleName": "WealthPortfolioUIModule", "appName": "PortfolioManagementMA" }).presentationController;
            wealthModule.getDashboardGraphDetails(params);
          }
          scope_WealthPresentationController.commonFunctionForNavigation('frmUnifiedDashboard');
        }
    };
    Wealth_PresentationController.prototype.getPortfolioListError = function(err) {
		scope_WealthPresentationController.dashboardErrorFlow = true;
        applicationManager.getPresentationUtility().dismissLoadingScreen();
        scope_WealthPresentationController.marketIndexService= false;
        var controller = applicationManager.getPresentationUtility().getController('frmUnifiedDashboard', true);
        controller.checkPermissions();
    };
    //getAssetsList
    Wealth_PresentationController.prototype.getAssetsList = function(params) {
        applicationManager.getPresentationUtility().showLoadingScreen();
        var WealthPortfolioManager = applicationManager.getWealthPortfolioManager();
        WealthPortfolioManager.getAssetsList(params, this.getAssetsListSuccess.bind(this), this.getAssetsListError.bind(this));
    };
    Wealth_PresentationController.prototype.getAssetsListSuccess = function(obj) {
      applicationManager.getPresentationUtility().dismissLoadingScreen();
      var data = {};
      data.response = obj;
      if (data.response && data.response.AssetList && Object.keys(data.response.AssetList).length > 0) {
        scope_WealthPresentationController.assetsService = true;
        var controller = applicationManager.getPresentationUtility().getController('frmUnifiedDashboard', true);
        controller.loadAssetsDetails(data);
      } else {        
        scope_WealthPresentationController.assetsService = false;
        var controller = applicationManager.getPresentationUtility().getController('frmUnifiedDashboard', true);
        controller.checkPermissions();
      }
    };
    Wealth_PresentationController.prototype.getAssetsListError = function(err) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
        scope_WealthPresentationController.assetsService = false;
        var controller = applicationManager.getPresentationUtility().getController('frmUnifiedDashboard', true);
        controller.checkPermissions();
    };
    
   Wealth_PresentationController.prototype.getOrdersDetails = function(params) {
        applicationManager.getPresentationUtility().showLoadingScreen();
        var WealthPortfolioManager = applicationManager.getWealthPortfolioManager();
        WealthPortfolioManager.getOrdersDetails(params, this.getOrdersDetailsSuccess.bind(this), this.getOrdersDetailsError.bind(this));
    };
   Wealth_PresentationController.prototype.getOrdersDetailsSuccess = function(response) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
        var navManager = applicationManager.getNavigationManager();
        var data = {};
        data.response = response;
        navManager.setCustomInfo("frmOrder", data);
        var controller = applicationManager.getPresentationUtility().getController('frmOrder', true);
        if (scope_WealthPresentationController.isDateRange === true){
             scope_WealthPresentationController.commonFunctionForNavigation("frmOrder");
             controller.setHistorySeg(data);
         }
         else{
          if (scope_WealthPresentationController.isHistory === true) {
            controller.setHistorySeg(data);
        } else {
            controller.formSegmentData(data);
        }
         }
    };
    Wealth_PresentationController.prototype.getOrdersDetailsError = function(err) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
    };
  Wealth_PresentationController.prototype.cancelOrder = function(params) {
        applicationManager.getPresentationUtility().showLoadingScreen();
        var WealthPortfolioManager = applicationManager.getWealthPortfolioManager();
        WealthPortfolioManager.cancelOrder(params, this.cancelOrderSuccess.bind(this), this.cancelOrderError.bind(this));
    };
   Wealth_PresentationController.prototype.cancelOrderSuccess = function(response) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
        var navManager = applicationManager.getNavigationManager();
        var data = {};
        data.response = response;
        navManager.setCustomInfo("frmOrder", data);
        navManager.navigateTo("frmOrder");
    };
    Wealth_PresentationController.prototype.cancelOrderError = function(err) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
    };
  Wealth_PresentationController.prototype.getDownloadList = function(params) {
        applicationManager.getPresentationUtility().showLoadingScreen();
        var WealthPortfolioManager = applicationManager.getWealthPortfolioManager();
    var configManager = applicationManager.getConfigurationManager();
    if(configManager.getBaseCurrency() === 'EUR'){
      params.isEuro= true;
    }
        WealthPortfolioManager.downloadList(params, this.getDownloadListSuccess.bind(this), this.getDownloadListError.bind(this));
    };
    Wealth_PresentationController.prototype.getDownloadListSuccess = function(obj) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
        var data = {};
        var marketData = {};
        data = obj;
      var d = new Date();
      let Timestanp= d.getTime();
      var base64Val=data.base64;
    
      var filename=(scope_WealthPresentationController.downloadParams.navPage).replace(' ', '-');
     
       var controller='';
      if(scope_WealthPresentationController.downloadParams.navPage==='Holdings')
        {
            controller= applicationManager.getPresentationUtility().getController('frmHoldings', true);
            controller.onClickDownloadMessage(base64Val,filename+Timestanp+".pdf");
        }
      else if(scope_WealthPresentationController.downloadParams.navPage==='Transactions')
        {
           controller = applicationManager.getPresentationUtility().getController('frmTransactions', true);
            controller.onClickDownloadMessage(base64Val,filename+Timestanp+".pdf");
        }
      else if(scope_WealthPresentationController.downloadParams.navPage==='InstrumentTransactions')
        {
           controller = applicationManager.getPresentationUtility().getController('frmInstrumentTransactions', true);
            controller.onClickDownloadMessage(base64Val,filename+Timestanp+".pdf");
        }
		else if(scope_WealthPresentationController.downloadParams.navPage==='Open Order' || scope_WealthPresentationController.downloadParams.navPage==='History Order')
        {
           controller = applicationManager.getPresentationUtility().getController('frmOrders', true);
            controller.onClickDownloadMessage(base64Val,filename+Timestanp+".pdf");
        }
        else if(scope_WealthPresentationController.downloadParams.navPage==='Watchlist' )
        {
           controller = applicationManager.getPresentationUtility().getController('frmWatchlist', true);
            controller.onClickDownloadMessage(base64Val,filename+Timestanp+".pdf");
        }
		else if(scope_WealthPresentationController.downloadParams.navPage==='Accounts Activity' )
        {
           controller = applicationManager.getPresentationUtility().getController('frmAccounts', true);
            controller.onClickDownloadMessage(base64Val,filename+Timestanp+".pdf");
        }
      else
        {
           controller = applicationManager.getPresentationUtility().getController('frmReport', true);
            controller.onClickDownloadMessage(base64Val,filename+Timestanp+".pdf");
        }
       

    };
    Wealth_PresentationController.prototype.getDownloadListError = function(err) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
    };

     Wealth_PresentationController.prototype.getReports = function(params) {
        applicationManager.getPresentationUtility().showLoadingScreen();
        var WealthPortfolioManager = applicationManager.getWealthPortfolioManager();
        WealthPortfolioManager.getReportDetails(params, this.getReportsSuccessCallback.bind(this), this.getReportsErrorCallback.bind(this));
    };
    /**
     *
     **/
    Wealth_PresentationController.prototype.getReportsSuccessCallback = function(obj) {
        var navManager = applicationManager.getNavigationManager();
        var data = {};
        data.response = obj;
        scope_WealthPresentationController.reportData=data;
        applicationManager.getPresentationUtility().dismissLoadingScreen();
        navManager.navigateTo("frmReport");
    };
    /**
     *
     **/
    Wealth_PresentationController.prototype.getReportsErrorCallback = function() {
       applicationManager.getPresentationUtility().dismissLoadingScreen();
    };
  
  
 

 
  
   
    return Wealth_PresentationController;
});

