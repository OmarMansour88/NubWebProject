define(['CommonUtilities'], function(CommonUtilities) {
    return {
      portfolioData: '',
      xaxisArr: [],
      plotDataArr: [],
      chartConfig: '',
      cashAcc: [],
      marketValue: '',
      holdingsPermission: false,
      ordersPermission: false,
      txnPermission: false,
        init: function() {
            var navManager = applicationManager.getNavigationManager();
            var currentForm = navManager.getCurrentForm();
            applicationManager.getPresentationFormUtility().initCommonActions(this, "YES", currentForm);
          
        },

        preShow: function() {
           var configManager= applicationManager.getConfigurationManager();
          applicationManager.getModulesPresentationController("WealthPortfolioUIModule").sortByValueHoldings = "";
          applicationManager.getModulesPresentationController("WealthPortfolioUIModule").sortByValueTrans = "";
          applicationManager.getModulesPresentationController("WealthPortfolioUIModule").sortByValueOrders = "";
          applicationManager.getModulesPresentationController("WealthPortfolioUIModule").sortByValueAccounts = "";
            if (applicationManager.getPresentationFormUtility().getDeviceName() !== "iPhone") {
                this.view.flxHeader.isVisible = true;
            } else {
               this.view.flxHeader.isVisible = false;
             let portfolioDetailAccountViewPermission = configManager.getPortfolioAccountInfoViewPermissions().some(configManager.checkUserPermission.bind(configManager));
             
              var rightBarButtonItem = new kony.ui.BarButtonItem({
                                                 type: constants.BAR_BUTTON_IMAGE,
                                                 style: constants.BAR_ITEM_STYLE_PLAIN,
                                                 enabled: true,
                                                 action: portfolioDetailAccountViewPermission ? this.jointAcc :"",
                                                 tintColor: "ffffff",
                                                 metaData: {
                                                 image: portfolioDetailAccountViewPermission ? "info.png":""
                                                 }
                                                 });
             this.view.setRightBarButtonItems({items:[rightBarButtonItem],animated:true});
            }
			this.view.flxPortfolioLineChart.isVisible = false;
            this.checkPermissions();
            if(configManager.isMicroAppPresent("WealthOrderMA"))
			{
            this.view.flxSearch.setVisibility(true);
            this.view.btnConvertCurrency.setEnabled(true);
            }
			else{
                this.view.flxSearch.setVisibility(false);
              this.view.btnConvertCurrency.setEnabled(false);
            }
            this.initActions();
         let portfolioAssertPermission = configManager.getPortfolioAssetAllocationViewPermissions().some(configManager.checkUserPermission.bind(configManager));
          //let portfolioAssertPermission =configManager.checkUserPermission("PORTFOLIO_ASSET_ALLOCATION_VIEW");
          let portfoliocashPermission = configManager.getPortfolioCashBalanceViewPermissions().some(configManager.checkUserPermission.bind(configManager));
         // let portfoliocashPermission =configManager.checkUserPermission("PORTFOLIO_CASH_BALANCE_VIEW");
          
           // this.fetchAssetsAndCashData();
            var navManager = applicationManager.getNavigationManager();
          let portfolioDetailViewPermission = configManager.getPortfolioDetailViewPermissions().some(configManager.checkUserPermission.bind(configManager));
           //let portfolioDetailViewPermission =configManager.checkUserPermission("PORTFOLIO_DETAILS_VIEW");
          if(portfolioDetailViewPermission || portfolioAssertPermission || portfoliocashPermission)
            {
              var objArr = navManager.getCustomInfo("frmPortfolioDetails");
              if(!objArr)
                {
					objArr=applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portdet;
                }
              this.portfolioData = objArr.response;
              this.chartConfig = "1M";
              var graphDuration = this.portfolioData.graphDuration;
              this.changeGraphData("OneM", true);
              this.setDataToForm();
              this.view.investmentLineChart.currentFilter = this.chartConfig;
            }
            
            applicationManager.getModulesPresentationController("WealthPortfolioUIModule").navPage = "";
          // to be uncomented when propper users are in place
   	    this.view.flxPortfolioLineChart.isVisible=false;
		this.view.flxCashBtns.isVisible=true;
            this.view.btnTransferCash.setEnabled(true);
            this.view.btnConvertCurrency.setEnabled(true);
			
          if(applicationManager.getModulesPresentationController("WealthPortfolioUIModule").isJointAccount == true){
            this.view.flxCashBtns.isVisible=false;
          }
        },
        setDataToForm: function() {
           applicationManager.getPresentationUtility().showLoadingScreen();
            var val = this.portfolioData;
            var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
            this.view.customHeader.lblLocateUs.text = wealthModule.getMaskedAccountName();
            this.view.title = wealthModule.getMaskedAccountName();
            var forUtility = applicationManager.getFormatUtilManager();
            this.view.investmentLineChart.currencySymbol = forUtility.getCurrencySymbol(val.referenceCurrency);
      var totalVal = forUtility.formatAmountandAppendCurrencySymbol(val.marketValue, val.referenceCurrency);
      this.view.lblTotalVal.text = totalVal;
      this.marketValue = val.marketValue;
      var unrealizedPL = forUtility.formatAmountandAppendCurrencySymbol(val.unRealizedPLAmount, val.referenceCurrency);
      var todaysPL = forUtility.formatAmountandAppendCurrencySymbol(val.todayPLAmount, val.referenceCurrency);
      if(val.unRealizedPLAmount !==undefined && val.unRealizedPLAmount!=='')
      {
        if (val.unRealizedPL == "P") {
            this.view.lblUnrealizedPLValue.skin = "sknIbl2f8523SSPsb45px";
            this.view.lblUnrealizedPLValue.text = (unrealizedPL != "" && val.unRealizedPLPercentage !== "") ? ("+" + unrealizedPL + "(+" + val.unRealizedPLPercentage + "%)") : ((unrealizedPL != "") ? ("+" + unrealizedPL) : ((val.unRealizedPLPercentage !== "") ? ("(+" + val.unRealizedPLPercentage + "%)") : ""));
        } else {
            this.view.lblUnrealizedPLValue.skin = "sknIblEE0005SSPsb45px";
            if (val.unRealizedPLAmount.substr(0, 1) === '-') {
                this.view.lblUnrealizedPLValue.text = (unrealizedPL != "" && val.unRealizedPLPercentage !== "") ? ( unrealizedPL + "(" + val.unRealizedPLPercentage + "%)") : ((unrealizedPL != "") ? ( unrealizedPL) : ((val.unRealizedPLPercentage !== "") ? ("(" + val.unRealizedPLPercentage + "%)") : ""));
            } else {
                this.view.lblUnrealizedPLValue.text =(unrealizedPL != "" && val.unRealizedPLPercentage !== "") ? ("-" +unrealizedPL + "(-" + val.unRealizedPLPercentage + "%)") : ((unrealizedPL != "") ? ( "-"+unrealizedPL) : ((val.unRealizedPLPercentage !== "") ? ("(-" + val.unRealizedPLPercentage + "%)") : ""))
            }
        }
        applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioDetails.unRealizedPLAmount = (val.unRealizedPLAmount).replace(/[+-]/g, '');
        applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioDetails.unRealizedPL = val.unRealizedPL;
        applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioDetails.unRealizedPLPercentage = (val.unRealizedPLPercentage).replace(/[+-]/g, '');
        applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioDetails.marketValue = val.marketValue;
    }
    if (val.todayPLAmount !== undefined && val.todayPLAmount !== '') {
        if (val.todayPL == "P") {
          this.view.lblTodayPLValue.skin = "sknIbl2f8523SSPsb45px";
          this.view.lblTodayPLValue.text = "+" + todaysPL + " (+" + val.todayPLPercentage + "%)";
        } else {
          this.view.lblTodayPLValue.skin = "sknIblEE0005SSPsb45px";
          if(val.todayPLAmount.substr(0,1)==="-"){
            this.view.lblTodayPLValue.text =todaysPL + " (" + val.todayPLPercentage + "%)";

          }else{
            this.view.lblTodayPLValue.text = "-" + todaysPL + " (-" + val.todayPLPercentage + "%)";

          }
        }
        applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioDetails.todayPLAmount=val.todayPLAmount;
        applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioDetails.todayPL=val.todayPL;
        applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioDetails.todayPLPercentage=val.todayPLPercentage;
      }
      else{
        this.view.flxTodayPL.setVisibility(false);
      }

    },
    fetchAssetsAndCashData: function() {
      var inputParamsForAssetsAndCash = {
        "portfolioId": applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioId
      };
      var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
      wealthModule.getAssetsAllocation(inputParamsForAssetsAndCash);
    },
    navigateToSearch: function() {
      /* var params = {
                "sortBy": "",
                "searchByInstrumentName": "",
                "portfolioId": applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioId
            }
            var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
            wealthModule.getInstrumentSearchList(params, this.marketValue);*/
           applicationManager.getModulesPresentationController("WealthPortfolioUIModule").marketValue = this.marketValue;
       
           var navManager = applicationManager.getNavigationManager();
        navManager.navigateTo("frmInstrumentSearch");
    

        },
        postShow: function() {
            //this.fetchAssetsAndCashData();
        },
        initActions: function() {
          this.view.flxAdditionalOptions.setVisibility(false);
           this.view.flxSearchDummy.onTouchEnd = this.navigateToSearch;
            this.view.customHeader.flxBack.onClick = this.navigateCustomBack;
            this.view.flxHoldings.onTouchEnd = this.holdings;
            this.view.flxTransactions.onTouchEnd = this.transactions;
            this.view.flxOrders.onTouchEnd = this.openOrders;
            this.view.flxMore.onTouchEnd = this.moreOptions;
            this.view.flxCancelOption.onTouchEnd = this.onCancel;
            this.view.lblAccounts.onTouchEnd = this.accounts;
            this.view.flxPerformance.onTouchEnd = this.performance;
            this.view.flxReport.onTouchEnd = this.reports;
            this.view.flxInfo.onTouchEnd = this.jointAcc;       
            this.view.btnConvertCurrency.onClick = this.clickConvertCurrency;
            let filterValues = Object.keys(this.chartFilters).map(key => this.chartFilters[key]);
            this.view.investmentLineChart.setChartFilters(filterValues);
            this.view.flxCashSeparator.setVisibility(false);          
        },
        calculatePercent: function(part, total) {
            var partAmount = Math.abs(Number(part));
            //var totalAmount = Number(total);
            //var percent = ((partAmount *100) / totalAmount);
            var percent = ((partAmount *100) / total);
            return percent.toFixed(2);
        },
        setSkinBasedOnPercent: function(dataArr) {
            var skinVal = ["sknFlexslider2C82BE", "sknFlxslider53A8E2", "sknFlxslider24BFEC", "sknFlxslider76DDFB", "sknFlxsliderC7E0F1"];
            dataArr[0].flxSpent = {
                "skin": skinVal[0],
                "width": dataArr[0].assetPer.toString() + "%"
            };
            for (var i = 1; i <= dataArr.length - 1; i++) {
                if (dataArr[i].assetPer === dataArr[i - 1].assetPer) {
                    dataArr[i].flxSpent = {
                        "skin": skinVal[i - 1],
                        "width": dataArr[i].assetPer.toString() + "%"
                    };
                } else {
                    dataArr[i].flxSpent = {
                        "skin": skinVal[i],
                        "width": dataArr[i].assetPer.toString() + "%"
                    };
                }
            }
           applicationManager.getPresentationUtility().dismissLoadingScreen();
            return dataArr;
        },
      openOrder: function() {
          var sortByValue = undefined; 
          var type = "open";
          var today = new Date();
          var data = {};
          data.response = sortByValue;
          var navManager = applicationManager.getNavigationManager();
          navManager.setCustomInfo("frmSortBy", data);
        navManager.setCustomInfo("frmPortfolioDetails", true);
          var orderId;
        if(applicationManager.getModulesPresentationController("WealthPortfolioUIModule").orderList.length === 0){
          orderId = null;
        }
        else{
          orderId = applicationManager.getModulesPresentationController("WealthPortfolioUIModule").orderList.toString();
        }
        var previousDate = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
        var startDate = previousDate.getFullYear() + '-' + ('0' + (previousDate.getMonth() + 1)).slice(-2) + '-' + ('0' + previousDate.getDate()).slice(-2);
        var endDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
            var params = {
                "portfolioId": applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioId,
                "orderId": orderId,
                "sortBy": "description",
                "type": type, 
                "startDate": "2018-12-06",
				"endDate": endDate,
                "searchByInstrumentName": ""
          }
        var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
        var orderList = wealthModule.getOrdersDetails(params);
        applicationManager.getModulesPresentationController("WealthPortfolioUIModule").isPortfolio = true;
        applicationManager.getModulesPresentationController("WealthPortfolioUIModule").isDateRange = false;
        applicationManager.getModulesPresentationController("WealthPortfolioUIModule").isFirst = true;
        wealthModule.commonFunctionForNavigation("frmOrder");
        },
      openOrders: function() {
        var sortByValue = undefined; 
        var data = {};
        data.response = sortByValue;
        var navManager = applicationManager.getNavigationManager();	
        navManager.setCustomInfo("frmPortfolioDetails", true);
        navManager.setCustomInfo("frmSortBy", data);
		applicationManager.getModulesPresentationController("WealthPortfolioUIModule").isFrmWatchlist=false;
		applicationManager.getModulesPresentationController("WealthPortfolioUIModule").sortByValueOrders = "";
        navManager.navigateTo("frmOrders");
      },
      populateAssets: function(assetObj) {
        var currForm = kony.application.getCurrentForm();
        var responseObj = assetObj.response;
          var configManager= applicationManager.getConfigurationManager();
       let portfolioDetailAssetAllocationPermission = configManager.getPortfolioAssetAllocationViewPermissions().some(configManager.checkUserPermission.bind(configManager));
         //let portfolioDetailAssetAllocationPermission = configManager.checkUserPermission("PORTFOLIO_ASSET_ALLOCATION_VIEW");
        if(portfolioDetailAssetAllocationPermission)
          {
            var assets = responseObj.assets;
            //var assets=dataSet.assets;
            var assignedSkinsArr = [];
            var segData = [];
            var forUtility = applicationManager.getFormatUtilManager();
            if(assets.length>0){
              this.view.flxAssetsTab.isVisible=true;
            this.view.flxAssetsSummary.isVisible=true;
            var total=0;
            for(var j = 0; j < assets.length; j++) {
              total+=  Math.abs(Number(assets[j].marketValue));
            }  
            for (var list in assets) {
              //var assetPercent = this.calculatePercent(assets[list].marketValue, responseObj.totalMarketValue);
              var assetPercent=this.calculatePercent(assets[list].marketValue, total);
              var marketValue = forUtility.formatAmountandAppendCurrencySymbol(assets[list].marketValue, responseObj.referenceCurrency);
              var storeData;
              if (assetPercent !== "0") {
                storeData = {
                  assetClass: assets[list].assetGroup,
                  assetPer: assetPercent,
                  assetVal: assets[list].assetGroup + " (" + assetPercent.toString() + "%)",
                  assetCost: marketValue,
                  flxSpent: {
                    "skin": "",
                    "width": assetPercent.toString() + "%"
                  }
                };
                segData.push(storeData);
              } else {
                continue;
              }
            }
            segData.sort(function(a, b) {
              return parseFloat(b.assetPer) - parseFloat(a.assetPer);
            });
            assignedSkinsArr = this.setSkinBasedOnPercent(segData);
            this.view.segAssetSummary.widgetDataMap = {
              lblAssetDet: "assetVal",
              lblAssetCost: "assetCost",
              flxSpent: "flxSpent"
            };
            this.view.segAssetSummary.setData(assignedSkinsArr);
          }else{
            this.view.flxAssetsTab.isVisible=false;
            this.view.flxAssetsSummary.isVisible=false;
          }
          }
        let portfolioDetailCashbalancePermission = configManager.getPortfolioCashBalanceViewPermissions().some(configManager.checkUserPermission.bind(configManager));
	    let portfolioDetailViewPermission = configManager.getPortfolioDetailViewPermissions().some(configManager.checkUserPermission.bind(configManager));
        if(portfolioDetailCashbalancePermission)
          this.populateCashBalance(responseObj);
        if(portfolioDetailViewPermission)   
          this.bindNewGraphData(responseObj);
        currForm.forceLayout();
      },
        checkCashBalance: function(cashArr) {
            if (applicationManager.getModulesPresentationController("WealthPortfolioUIModule").newAccountsArr.length > 0) {
                cashArr.push(...applicationManager.getModulesPresentationController("WealthPortfolioUIModule").newAccountsArr);
            }
          if(applicationManager.getModulesPresentationController("WealthPortfolioUIModule").balanceArr.length > 0){
          for(i in applicationManager.getModulesPresentationController("WealthPortfolioUIModule").balanceArr){
            cashArr.forEach(function(e) {
                if (e.currency === applicationManager.getModulesPresentationController("WealthPortfolioUIModule").balanceArr[i].currency) {
                    e.balance = applicationManager.getModulesPresentationController("WealthPortfolioUIModule").balanceArr[i].amount;
                }
            });
            }
            }
            return cashArr;
        },
        navigateCustomBack: function() {
//             var navMan = applicationManager.getNavigationManager();
//             navMan.navigateTo('frmUnifiedDashboard');
          
          new kony.mvc.Navigation({"appName" : "HomepageMA", "friendlyName" : "frmUnifiedDashboard"}).navigate();
        },
        holdings: function() {
            var sortByValue = undefined;
            var data = {};
            data.response = sortByValue;
            var navManager = applicationManager.getNavigationManager();
            navManager.setCustomInfo("frmSortBy", data);
            navManager.setCustomInfo("frmPortfolioDetails", true);
            navManager.navigateTo("frmHoldings");
//             var params = {
//                 "portfolioId": applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioId,
//                 "navPage": "Holdings",
//                 "sortBy": "description",
//                 "searchByInstrumentName": ""
//             }
//             var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
//             wealthModule.getHoldings(params);
        },
        jointAcc: function(){
		    var navManager = applicationManager.getNavigationManager();
            navManager.navigateTo("frmJointAccount");
        },
        transactions: function() {
            var navManager = applicationManager.getNavigationManager();
            var sortByValue = undefined;
            var data = {};
            data.response = sortByValue;
            navManager.setCustomInfo("frmPortfolioDetails", true);
            navManager.setCustomInfo("frmSortBy", data);
            data.selectedPeriod = "previous30DaysSelected";           
            var today = new Date();
            var previousDate = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
            var startDate = previousDate.getFullYear() + '-' + ('0' + (previousDate.getMonth() + 1)).slice(-2) + '-' + ('0' + previousDate.getDate()).slice(-2);
            var endDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
		    data.startDate = startDate;
            data.endDate = endDate;
           applicationManager.getModulesPresentationController("WealthPortfolioUIModule").selectedDateRangeDetails = {
            startDate: startDate,
            endDate: endDate,
            selectedPeriod: "previous30DaysSelected",
            flag: false
          };
            //navManager.setCustomInfo("frmDateRange", data);
           /* var params = {
                "portfolioId": applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioId,
                "startDate": startDate,
                "endDate": endDate,
                "searchByInstrumentName": "",
                "sortBy": "tradeDate"
            }*/
           //             var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
//             wealthModule.getTransactions(params);
			navManager.navigateTo("frmTransactions");

        },
        performance: function(){
          var navManager = applicationManager.getNavigationManager();
          navManager.setCustomInfo("frmPortfolioDetails", true);
          var data = {};
          data.selectedPeriod = "1Year";
          data.duration = "OneY";
          applicationManager.getModulesPresentationController("WealthPortfolioUIModule").benchmark = "";
          //navManager.setCustomInfo("frmDateRange", data);
          var today = new Date();
          var startDate = (today.getFullYear() -1) + ('0' + (today.getMonth() + 1)).slice(-2) + ('0' + today.getDate()).slice(-2);
          var endDate = today.getFullYear() + ('0' + (today.getMonth() + 1)).slice(-2) + ('0' + today.getDate()).slice(-2);
          var params ={
  				"portfolioId":applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioId,
  				"dateFrom":startDate,
  				"dateTo":endDate,
  				"benchMarkIndex":"",
  				"duration":"OneY",
                "currencyId":applicationManager.getModulesPresentationController("WealthPortfolioUIModule").refCurrencyId
 }
      applicationManager.getModulesPresentationController("WealthPortfolioUIModule").selectedDateRangeDetails = {
            startDate: startDate,
            endDate: endDate,
            selectedPeriod: "1Year",
            flag: false,
           duration: "OneY"
          };
          var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
          wealthModule.getPerformance(params);
        },
        accounts: function() {
            var navManager = applicationManager.getNavigationManager();
            var sortByValue = undefined;
            var data = {};
            data.response = sortByValue;
            navManager.setCustomInfo("frmPortfolioDetails", true);
            navManager.setCustomInfo("frmSortBy", data);
            data.selectedPeriod = "previous30DaysSelected";
            var today = new Date();
            var previousDate = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
            var startDate = previousDate.getFullYear() + '-' + ('0' + (previousDate.getMonth() + 1)).slice(-2) + '-' + ('0' + previousDate.getDate()).slice(-2);
            var endDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
          data.startDate = startDate;
            data.endDate = endDate;
          applicationManager.getModulesPresentationController("WealthPortfolioUIModule").selectedDateRangeDetails = {
            startDate: startDate,
            endDate: endDate,
            selectedPeriod: "previous30DaysSelected",
            flag: false
          };
          //navManager.setCustomInfo("frmDateRange", data);
    /*      var params ={
"portfolioId":applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioId,
"accountId":applicationManager.getModulesPresentationController("WealthPortfolioUIModule").accountNumber,
"dateFrom":dateFrom,
"dateTo":dateTo,
"listType":"SEARCH",
"sortBy":"bookingDate",
"searchByInstrumentName":""
}
      var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
      wealthModule.getAccountActivity(params); */
          navManager.navigateTo("frmAccounts");
        },
        moreOptions: function() {
            this.view.flxAdditionalOptions.setVisibility(true);
        },
        onCancel: function() {
            this.view.flxAdditionalOptions.setVisibility(false);
        },
        getNewGraphData: function(filterParam) {
            var inputParams = {
                "portfolioId": applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioId,
                "navPage": "Portfolio",
                "graphDuration": filterParam
            };
            var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
            wealthModule.getAssetsAllocation(inputParams);
        },
        bindNewGraphData: function(responseObj) {
            //var responseObj = obj.response;
            var graphDet =  responseObj.instrumentTotal[0];
            var graphData = [];
            var temp = [];
            var temp = graphDet[graphDet.graphDuration];
            graphData = temp;
          if(graphData.length>0){
            this.view.flxPortfolioLineChart.isVisible=true;
               this.view.investmentLineChart.setChartData(graphData, null, null, null, "PORTFOLIO");
        
          }else{
            this.view.flxPortfolioLineChart.isVisible=false;
          
          }
            //     for(var item in graphData){
            //       this.xaxisArr.push(item);
            //       this.plotDataArr.push(graphData[item]); 
            //     }
            // this.view.investmentLineChart.setChartData(this.plotDataArr,this.xaxisArr,null,this.chartConfig);
            },
        changeGraphData: function(filterParam, isCallRequired) {
            this.xaxisArr = [];
            this.plotDataArr = [];
            var responseObj;
            if (isCallRequired) {
                this.getNewGraphData(filterParam);
            } else {
                responseObj = this.portfolioData;
                var graphData = [];
                var temp = [];
                var temp = responseObj[responseObj.graphDuration];
                graphData = temp;
                //     for(var item in graphData){
                //       this.xaxisArr.push(item);
                //       this.plotDataArr.push(graphData[item]); 
                //     }
                // this.view.investmentLineChart.setChartData(this.plotDataArr,this.xaxisArr,null,this.chartConfig);
              if(graphData.length>0){
            this.view.flxPortfolioLineChart.isVisible=true;
                this.view.investmentLineChart.setChartData(graphData, null, null, null, "PORTFOLIO");
            
              }else{
                 this.view.flxPortfolioLineChart.isVisible=false;
           
              }
                }

        },
        // Called when chart filter changed - Mapped in onFilterChange event on CHart Component
        chartFilters: {
            ONE_MONTH: '1M',
            ONE_YEAR: '1Y',
            FIVE_YEARS: '5Y',
            YTD: 'YTD',
        },
        clickTransferCash: function(){
//           var fastTransfer = applicationManager.getModulesPresentationController("TransferModule");
//           var navManager = applicationManager.getNavigationManager();
//           data = {};
//           navManager.setCustomInfo("frmTransfersFromAccount", data);
//           fastTransfer.commonFunctionForNavigation("frmTransfersFromAccount");
          
                    
          applicationManager.getPresentationUtility().showLoadingScreen();
          var navMan = applicationManager.getNavigationManager();
          navMan.setEntryPoint("centralmoneymovement","frmDashboardAggregated");
          var moneyMovementModule = applicationManager.getModulesPresentationController({ "moduleName": "MoneyMovementUIModule", "appName": "RegionalTransferMA" });
          moneyMovementModule.getFromAndToAccounts();
          moneyMovementModule.clearMMFlowAtributes();
          
        },
        clickTransferCashEuro: function(){
//           var fastTransfer = applicationManager.getModulesPresentationController("TransferModuleEurope");
//           var navManager = applicationManager.getNavigationManager();
//           data = {};
//           navManager.setCustomInfo("frmEuropeTransferFromAccount", data);
//           fastTransfer.commonFunctionForNavigation("frmEuropeTransferFromAccount");
          
          applicationManager.getPresentationUtility().showLoadingScreen();
          var navMan = applicationManager.getNavigationManager();
          navMan.setEntryPoint("europeTransferFlow","frmDashboardAggregated");
          var transferModPresentationController = applicationManager.getModulesPresentationController({ "moduleName": "TransferEuropeUIModule", "appName": "RegionalTransferMA" });
          transferModPresentationController.setEuropeFlowType("EXTERNAL");
          transferModPresentationController.getFromAndToAccounts();
          transferModPresentationController.clearEuropeFlowAtributes();
          
          
        },
        clickConvertCurrency: function() {
            var wealthMod = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
            var navManager = applicationManager.getNavigationManager();
            wealthMod.clearWealthData();
            data = {};
            data.cashAcc = this.cashAcc;
            navManager.setCustomInfo("frmSelectCurrency", data);
            applicationManager.getModulesPresentationController("WealthPortfolioUIModule").currencyConv = true;
            applicationManager.getModulesPresentationController("WealthPortfolioUIModule").toConv = true;
            applicationManager.getModulesPresentationController("WealthPortfolioUIModule").currencyConvData = true;

           // wealthMod.commonFunctionForNavigation("frmSelectCurrency");
           new kony.mvc.Navigation({"appName" : "WealthOrderMA", "friendlyName" : "frmSelectCurrency"}).navigate();
        },
        onFilterChanged: function(filter) {
            var maxVal = 0;
            var filterMap = "";
            this.chartConfig = filter;
            if (filter === this.chartFilters.ONE_MONTH) {
                filterMap = "OneM";
                this.changeGraphData(filterMap, true);
            } else if (filter === this.chartFilters.ONE_YEAR) {
                filterMap = "OneY";
                this.changeGraphData(filterMap, true);
            } else if (filter === this.chartFilters.FIVE_YEARS) {
                filterMap = "FiveY";
                this.changeGraphData(filterMap, true);
            } else {
                filterMap = "YTD";
                this.changeGraphData(filterMap, true);
            }

        },
      reports: function(){
             var today = new Date();
            var previousDate = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
            var startDate = previousDate.getFullYear() + '-' + ('0' + (previousDate.getMonth() + 1)).slice(-2) + '-' + ('0' + previousDate.getDate()).slice(-2);
            var endDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
        applicationManager.getModulesPresentationController("WealthPortfolioUIModule").reportType = "";    
        applicationManager.getModulesPresentationController("WealthPortfolioUIModule").selectedDateRangeDetails = {
            startDate: startDate,
            endDate: endDate,
            selectedPeriod: "previous30DaysSelected",
            flag: false
          };
        var params = {
          "portfolioId": applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioId,
          "navPage":"Reports"
        };
        var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
        wealthModule.getReports(params);
         
      },
      realignIconsBasedOnPermission: function(){
       this.view.flxHoldings.setVisibility(this.holdingsPermission);
       this.view.flxOrders.setVisibility(this.ordersPermission);
       this.view.flxTransactions.setVisibility(this.txnPermission);
       if(this.holdingsPermission && this.ordersPermission && this.txnPermission){
         this.view.flxHoldings.left = "0dp";
         this.view.flxOrders.left = "0dp";
         this.view.flxTransactions.left = "0dp";
         this.view.flxMore.centerX = "default";
       }
        else if(!this.holdingsPermission && !this.ordersPermission && !this.txnPermission){
           this.view.flxMore.centerX = "50%";
        }
        else if((!this.holdingsPermission && !this.ordersPermission && this.txnPermission) || (!this.holdingsPermission && this.ordersPermission && this.txnPermission)){
          this.view.flxTransactions.left = "50dp";
          this.view.flxHoldings.left = "0dp";
          this.view.flxOrders.left = "0dp";
          this.view.flxMore.centerX = "default";
        }
        else if((!this.holdingsPermission && this.ordersPermission && !this.txnPermission) || (!this.holdingsPermission && this.ordersPermission && this.txnPermission)){
          this.view.flxOrders.left = "50dp";
          this.view.flxHoldings.left = "0dp";
          this.view.flxTransactions.left = "0dp";
          this.view.flxMore.centerX = "default";
          
        }
        else if((this.holdingsPermission && !this.ordersPermission && !this.txnPermission) || (this.holdingsPermission && this.ordersPermission && !this.txnPermission) || (this.holdingsPermission && !this.ordersPermission && this.txnPermission)){
          this.view.flxHoldings.left = "50dp";
          this.view.flxTransactions.left = "0dp";
          this.view.flxOrders.left = "0dp";
          this.view.flxMore.centerX = "default";
        }
      },
      checkPermissions: function(){		
        var configManager =  applicationManager.getConfigurationManager();
           var checkUserPermission = function (permission) {
            return applicationManager.getConfigurationManager().checkUserPermission(permission);
          }
        
             var checkFeature = function (feature) {
            return applicationManager.getConfigurationManager().checkUserFeature(feature);
          }
        
        let self = this;
        
        var isCashTransfer =  configManager.getTransferCashPermission().some(configManager.checkUserPermission.bind(configManager));
        var isConvertCurrency = configManager.getConvertCurrencyPermission().some(configManager.checkUserPermission.bind(configManager));
        var isCashBalanceView = configManager.getCashBalanceViewPermission().some(configManager.checkUserPermission.bind(configManager));

        self.view.btnTransferCash.setVisibility(isCashTransfer);
        self.view.btnConvertCurrency.setVisibility(isConvertCurrency);
        self.view.flxCashAccountsTab.setVisibility(isCashBalanceView);
        self.view.flxCashAccountsDet.setVisibility(isCashBalanceView);
        
        let holdingsFeature = configManager.getWealthPortfolioFeature().some(configManager.checkUserFeature.bind(configManager));
        
        let isHoldingsView = configManager.getHoldingsdetailsPermissions().some(configManager.checkUserPermission.bind(configManager));
        this.holdingsPermission = (holdingsFeature && isHoldingsView)? true: false;
        
        let ordersFeature = configManager.getOrderBlotterFeature().some(configManager.checkUserFeature.bind(configManager));
        let isOpenOrderView = configManager.getOpenOrderViewPermissions().some(configManager.checkUserPermission.bind(configManager));
        let isHistoryOrderView = configManager.getHistoryOrderViewPermissions().some(configManager.checkUserPermission.bind(configManager));
        this.ordersPermission = (ordersFeature && (isOpenOrderView || isHistoryOrderView))? true: false;
        
        let txnFeature = configManager.getWealthPortfolioFeature().some(configManager.checkUserFeature.bind(configManager));
        let transactViewPermission = configManager.getTransactionDetailViewPermissions().some(configManager.checkUserPermission.bind(configManager));
        this.txnPermission = (txnFeature && transactViewPermission)? true: false;
        this.realignIconsBasedOnPermission();  
        
        let reportFeature = configManager.getWealthReportFeature().some(configManager.checkUserFeature.bind(configManager));
        
        var allReportPermissionAccessible = configManager.getWealthReportPermissions();
        var reportPermission = allReportPermissionAccessible.some(checkUserPermission);
        let allowReports = (reportFeature && reportPermission)? true: false;
        self.view.flxReport.setVisibility(allowReports);
        
        let performanceFeature = configManager.getWealthPortfolioFeature().some(configManager.checkUserFeature.bind(configManager));
        
        var allPerformancePermissionAccessible = configManager.getPortfolioPerformancePermissions();
        var performancePermission = allPerformancePermissionAccessible.some(checkUserPermission);
        let allowPerformance = (performanceFeature && performancePermission)? true: false;
        self.view.flxPerformance.setVisibility(allowPerformance);
        
        //Portfolio Detail page Permission
        let portfolioDetailViewPermission = configManager.getPortfolioDetailViewPermissions().some(configManager.checkUserPermission.bind(configManager));
        self.view.flxPortfolioDetails.isVisible =portfolioDetailViewPermission;
        self.view.flxPortfolioValues.isVisible =portfolioDetailViewPermission;
        self.view.flxPortfolioLineChart.isVisible =portfolioDetailViewPermission;
        
        let portfolioDetailAssetAllocationPermission = configManager.getPortfolioAssetAllocationViewPermissions().some(configManager.checkUserPermission.bind(configManager));
        self.view.flxAssetsTab.isVisible =portfolioDetailAssetAllocationPermission;
        self.view.flxAssetsSummary.isVisible=portfolioDetailAssetAllocationPermission;
       
        let portfolioDetailCashbalancePermission = configManager.getPortfolioCashBalanceViewPermissions().some(configManager.checkUserPermission.bind(configManager));
        self.view.flxCashAccountsTab.isVisible =portfolioDetailCashbalancePermission;
         self.view.flxCashAccountsDet.isVisible =portfolioDetailCashbalancePermission;
       
        let portfolioDetailProductSearchPermission = configManager.getPortfolioProductSearchViewPermissions().some(configManager.checkUserPermission.bind(configManager));
        self.view.flxSearchDummy.onTouchEnd = portfolioDetailProductSearchPermission ? this.navigateToSearch : '';
       
        let portfolioDetailAccountViewPermission = configManager.getPortfolioAccountInfoViewPermissions().some(configManager.checkUserPermission.bind(configManager));
        this.view.flxInfo.isVisible = portfolioDetailAccountViewPermission;
        self.view.flxInfo.onTouchEnd = portfolioDetailAccountViewPermission ? this.jointAcc : '';
        
        let AccountActivityPermission = configManager.getAccountSummaryViewPermissions().some(configManager.checkUserPermission.bind(configManager));
        self.view.flxAccounts.isVisible = AccountActivityPermission;
       if(portfolioDetailAccountViewPermission)
        {
          var isAppPresent=configManager.isMicroAppPresent("RegionalTransferMA");
               if(isAppPresent){
           if(configManager.getBaseCurrency() === 'EUR'){
           self.view.btnTransferCash.onClick = isCashTransfer ? self.clickTransferCashEuro :"";
          } else {
          self.view.btnTransferCash.onClick = isCashTransfer ? self.clickTransferCash : "";
          }
           }else{
                this.view.btnTransferCash.setVisibility(isAppPresent);
               }
         
          self.view.btnConvertCurrency.onClick = isConvertCurrency ? self.clickConvertCurrency : "";

        }
       else{
       self.view.btnTransferCash.onClick="";
       self.view.btnConvertCurrency.onClick = "";
          self.view.flxBtns.isVisible =portfolioDetailAccountViewPermission;
		}
     },
      
      populateCashBalance: function(responseObj){   
        var forUtility = applicationManager.getFormatUtilManager();
        let cashAccFromResponse = responseObj.cashAccounts
        this.cashAcc = [];
        var trimmedAccName = "";

        this.cashAcc = this.checkCashBalance(cashAccFromResponse);
        applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioCashAccounts = responseObj;
        var cashList;
        var cashData = [];
        for (var i in this.cashAcc) {
			var tempRefCashBalance,flx1,flx2,sep;
          tempRefCashBalance=(this.cashAcc[i].referenceCurrencyValue!== "")?forUtility.formatAmountandAppendCurrencySymbol(this.cashAcc[i].referenceCurrencyValue, responseObj.totalCashBalanceCurrency):"";
          
          if (tempRefCashBalance && tempRefCashBalance!=="")  
          {
            let balanceCurr=forUtility.formatAmountandAppendCurrencySymbol(this.cashAcc[i].balance, this.cashAcc[i].currency);
            let CashBaclnce=(this.cashAcc[i].referenceCurrencyValue!== "")?forUtility.formatAmountandAppendCurrencySymbol(this.cashAcc[i].referenceCurrencyValue, responseObj.totalCashBalanceCurrency):"";
            
          cashList = {
            accountName: CommonUtilities.truncateStringWithGivenLength(this.cashAcc[i].accountName + "....", 26) + CommonUtilities.getLastFourDigit(this.cashAcc[i].accountNumber),
            cashBalance: balanceCurr,
            refCashBalance:CashBaclnce,
            refCurrency: this.cashAcc[i].currency,
            accountNumber: this.cashAcc[i].accountNumber,
			flx1 : {"isVisible": true},
            sep: {"isVisible": false}
          };
          }
          else
            {
              let balanceCurr=forUtility.formatAmountandAppendCurrencySymbol(this.cashAcc[i].balance, this.cashAcc[i].currency);
              let CashBaclnce=(this.cashAcc[i].referenceCurrencyValue!== "")?forUtility.formatAmountandAppendCurrencySymbol(this.cashAcc[i].referenceCurrencyValue, responseObj.totalCashBalanceCurrency):"";
			 
              cashList = {
            accountName: CommonUtilities.truncateStringWithGivenLength(this.cashAcc[i].accountName + "....", 26) + CommonUtilities.getLastFourDigit(this.cashAcc[i].accountNumber),
            cashBalance:{
            "top": "20dp",
            "text": balanceCurr
            },
            refCashBalance: {
            "isVisible": false,
            "text": CashBaclnce
            },
            refCurrency:this.cashAcc[i].currency,
            accountNumber: this.cashAcc[i].accountNumber,
			flx1 : {"isVisible": true},
            
            sep: {"isVisible": true}
            };
          
        }
          cashData.push(cashList);
        }
        
        if (this.view.flxCashAccountsDet.isVisible){
          if (cashData.length === 1) {
            if (this.cashAcc[0].currency === responseObj.totalCashBalanceCurrency) {
              this.view.segCashSummary.setVisibility(false);
              this.view.flxCashSeparator.setVisibility(true);
            } else {
              this.view.segCashSummary.setVisibility(true);
              this.view.flxCashSeparator.setVisibility(false);
            }
          } else {
            this.view.segCashSummary.setVisibility(true);
            this.view.flxCashSeparator.setVisibility(false);
          }
          this.view.segCashSummary.widgetDataMap = {
            lblCashAcc: "accountName",
            lblCashAccBal: "cashBalance",
            lblRefCashBal: "refCashBalance",
            flxCash: "flx1",
            flxDummy :"sep"
          };
			if(responseObj.totalCashBalance !== "")
              {
                var cashBalTotal = forUtility.formatAmountandAppendCurrencySymbol(responseObj.totalCashBalance, responseObj.totalCashBalanceCurrency);
				this.view.flxCashBal.setVisibility(true);
              this.view.flxCashBalanceVal.setVisibility(true);
              this.view.flxCashSeparator.setVisibility(true);
                this.view.lblCashBalanceVal.text = cashBalTotal;
                
              }
          else 
            {
              this.view.flxCashBal.setVisibility(false);
              this.view.flxCashBalanceVal.setVisibility(false);
              this.view.flxCashSeparator.setVisibility(false);
            }
          this.view.segCashSummary.setData(cashData);
        }
        
        applicationManager.getModulesPresentationController("WealthPortfolioUIModule").totalCashBalance = responseObj.totalCashBalance;
        applicationManager.getModulesPresentationController("WealthPortfolioUIModule").totalCashBalanceCurrency = responseObj.totalCashBalanceCurrency;
        applicationManager.getModulesPresentationController("WealthPortfolioUIModule").accountNumber = cashData[0].accountNumber;
        var navMan = applicationManager.getNavigationManager();
        var dataSet = {};
        dataSet.cashData = cashData;
        dataSet.response = cashData[0].refCurrency + "-" + cashData[0].accountName.slice(-4);
        dataSet.accountName = cashData[0].refCurrency + " " + cashData[0].accountName;
        navMan.setCustomInfo('frmCashAccounts', dataSet);
      },
      
    };
});