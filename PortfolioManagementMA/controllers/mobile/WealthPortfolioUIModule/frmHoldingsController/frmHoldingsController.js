define({
    //segmentRowDataId : [],
  sortByCustomData: "",
  segResponse: {},
  totalValue: "",
  selectedRicCode: "",
  ISINCode:"",
  holdingsId:"",
  
    init: function() {
        this.view.preShow = this.preShow;
        var navManager = applicationManager.getNavigationManager();
        var currentForm = navManager.getCurrentForm();
        applicationManager.getPresentationFormUtility().initCommonActions(this, "YES", currentForm);
        this.initActions();
    },
    preShow: function() {
      this.view.flxAdditionalOptions.setVisibility(false);
          var navManager = applicationManager.getNavigationManager();
      this.sortByCustomData = navManager.getCustomInfo("frmSortBy");
      var configManager = applicationManager.getConfigurationManager();
      if(configManager.getBaseCurrency() === 'EUR'){
      this.view.segmentDetailsWealth.setEuroFlow(true);
    }
      else{
         this.view.segmentDetailsWealth.setEuroFlow(false);
      }
      this.view.segmentDetailsWealth.getHoldingsTopDetails(applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioDetails);
      
      var params = {
                "portfolioId": applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioId,
                "navPage": "Holdings",
                "sortBy": (applicationManager.getModulesPresentationController("WealthPortfolioUIModule").sortByValueHoldings === "")?"description":applicationManager.getModulesPresentationController("WealthPortfolioUIModule").sortByValueHoldings,
                "searchByInstrumentName": " ",
            }
      this.view.segmentDetailsWealth.setContext(params);
         var data = {};
             navManager.setCustomInfo("frmInstrumentDetails", data);
  			 navManager.setCustomInfo("frmPortfolioDetails", false);
           
          
        if (applicationManager.getPresentationFormUtility().getDeviceName() !== "iPhone") {
            this.view.flxHeader.isVisible = true;
        } else {
            this.view.flxHeader.isVisible = false;
        }
        
        this.view.flxAdditionalOptions.isVisible = false;
      this.checkPermission("Holdings");
      if(configManager.isMicroAppPresent("WealthOrderMA"))
        {
         	this.view.segmentDetailsWealth.setVisibleActionImage(true);
		}
      else
        {
			this.view.segmentDetailsWealth.setVisibleActionImage(false);
        }
      
    },
  
      dummyFunc: function(param, dets) {
        var data = {};
            //var rowIndex = param.rowIndex;
            var holdings = dets.rowdetails;
            //var id = holdings.ISIN;
            holdings.totalValue = dets.totalValue;
            data.response = holdings;
            // this.segmentRowDataId = id;
            this.selectedRicCode = holdings.RICCode;
            this.ISINCode = holdings.ISIN;
            this.holdingsId = holdings.holdingsId;
        scope_WealthPresentationController.applicationId=holdings.application;
        var navManager = applicationManager.getNavigationManager();
        navManager.setCustomInfo("frmInstrumentDetails", data);
            this.setUpActionSheet("Holdings");
        this.checkPermission("Holdings");
        if(holdings.isSecurityAsset===false){
          this.view.flxAccounts.isVisible=false;
          this.view.flxReport.isVisible=false; 
        }else{
          this.view.flxAccounts.isVisible=true;
          this.view.flxReport.isVisible=true;   
        }
        },
    initActions: function() {
       this.view.segmentDetailsWealth.onActionButtonClicked = this.dummyFunc;
      this.view.segmentDetailsWealth.onRequestStart = function() {
        applicationManager.getPresentationUtility().showLoadingScreen();
      };
      this.view.segmentDetailsWealth.onRequestEnd = function() {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
      };
        this.view.flxMore.onTouchEnd = this.onClickMoreOptions;
        this.view.customHeader.flxBack.onTouchEnd = this.navigateCustomBack;
      
       this.view.segmentDetailsWealth.onRowClickEvent = this.onHoldingsSelect;
   
    },
  onHoldingsSelect:function(){

  },
    
    onClickMoreOptions: function() {
       this.view.flxHeader.setEnabled(false);
      this.view.flxScroll.setEnabled(false);
      this.checkPermission("MoreOptions");
        this.setUpActionSheet("MoreOptions");
    },
    setUpActionSheet: function(triggerPoint) {
        if (triggerPoint === "Holdings") {
            this.view.flxAccounts.isVisible = true;
            this.view.lblPerformance.text = kony.i18n.getLocalizedString("i18n.wealth.view");
            this.view.lblAccounts.text = kony.i18n.getLocalizedString("i18n.wealth.buy");
            this.view.lblReport.text = kony.i18n.getLocalizedString("i18n.wealth.sell");
            this.view.flxPerformance.onTouchEnd = this.onClickView;
            this.view.flxAccounts.onTouchEnd = this.onClickBuy;
            this.view.flxReport.onTouchEnd = this.onClickSell;
            this.view.flxCancelOption.onTouchEnd = this.onClickHoldingsCancel;
        } else {
            this.view.flxAccounts.isVisible = false;
            this.view.lblPerformance.text =  kony.i18n.getLocalizedString("i18n.wealth.downloadHoldings");
            this.view.lblReport.text = kony.i18n.getLocalizedString("i18n.wealth.sortBy");
            this.view.flxPerformance.onTouchEnd = this.onClickDownloadTxns;
            this.view.flxReport.onTouchEnd = this.onClickSortBy;
            this.view.flxCancelOption.onTouchEnd = this.onClickCancel;
        }
        this.view.flxAdditionalOptions.isVisible = true;
    },
    onClickView: function() {
       this.view.flxHeader.setEnabled(true);
      this.view.flxScroll.setEnabled(true);
        applicationManager.getModulesPresentationController("WealthPortfolioUIModule").instrumentDetailsEntry = true;
        this.callOnNavigate('view');
    },
    onClickBuy: function() {
       this.view.flxHeader.setEnabled(true);
      this.view.flxScroll.setEnabled(true);
        this.callOnNavigate('buy')
    },
    onClickSell: function() {
      this.view.flxHeader.setEnabled(true);
      this.view.flxScroll.setEnabled(true);
        this.callOnNavigate('sell');
    },
    callOnNavigate: function(selectedHoldings) {
        applicationManager.getModulesPresentationController("WealthPortfolioUIModule").searchEntryPoint = false;
        var navManager = applicationManager.getNavigationManager();
      scope_WealthPresentationController.isFrmWatchlist = false;
      scope_WealthOrderPresentationController.navForm = "frmHoldings";
      var param = {
        "ISINCode": this.ISINCode?this.ISINCode:'',
        "RICCode": this.selectedRicCode?this.selectedRicCode:'',
        "instrumentId" : this.holdingsId
      };
      if(scope_WealthPresentationController.applicationId){
        param.application=scope_WealthPresentationController.applicationId;
      }
        var selData = {
            'selHoldings': selectedHoldings,
           // 'response': this.segResponse.response
        };
        navManager.setCustomInfo("frmHoldings", selData);
        //var controller = applicationManager.getPresentationUtility().getController('frmPlaceOrder', true);
        //controller.watchlistFlow = null;
      scope_WealthOrderPresentationController.isFrmWatchlist = false;
       scope_WealthPresentationController.watchlistFlow=null;
        var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
        wealthModule.getInstrumentDetails(param);

    },
    onClickHoldingsCancel: function() {
       this.view.flxHeader.setEnabled(true);
      this.view.flxScroll.setEnabled(true);
        this.view.flxAdditionalOptions.isVisible = false;
    },
	onClickDownloadTxns: function() {
       this.view.flxHeader.setEnabled(true);
      this.view.flxScroll.setEnabled(true);
      applicationManager.getModulesPresentationController("WealthPortfolioUIModule").downloadParams = this.view.segmentDetailsWealth.getCriteriaObjValue(); 
      applicationManager.getModulesPresentationController("WealthPortfolioUIModule").downloadParams.navPage = "Holdings";
      var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
        wealthModule.getDownloadList(applicationManager.getModulesPresentationController("WealthPortfolioUIModule").downloadParams);
        kony.print("test"+applicationManager.getModulesPresentationController("WealthPortfolioUIModule").downloadParams);
    },
   onClickDownloadMessage:function(base64String,filename)
  {
    try 
    {  
       this.view.flxPopup.setVisibility(false);
       this.view.flxAdditionalOptions.isVisible = false;
       this.view.socialshare.shareWithBase64(base64String,filename);
    }catch(error){
   
      applicationManager.getPresentationUtility().dismissLoadingScreen();
    }
  },
    onClickCancel: function() {
      this.view.flxHeader.setEnabled(true);
      this.view.flxScroll.setEnabled(true);
        this.view.flxAdditionalOptions.isVisible = false;
    },
    navigateCustomBack: function() {
       var navMan = applicationManager.getNavigationManager();
      navMan.navigateTo("frmPortfolioDetails");
      },
    onClickSortBy: function() {
      this.view.flxHeader.setEnabled(true);
      this.view.flxScroll.setEnabled(true);
        var data = {};
       // data.searchText = this.view.tbxSearch.text;
        var navManager = applicationManager.getNavigationManager();
        if (applicationManager.getModulesPresentationController("WealthPortfolioUIModule").sortByValueHoldings == "") {
            data.sortByValue = "description";
            navManager.setCustomInfo("frmHoldings", data);
        } else {
            data.sortByValue = applicationManager.getModulesPresentationController("WealthPortfolioUIModule").sortByValueHoldings;
            navManager.setCustomInfo("frmHoldings", data);
        }
        var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
        wealthModule.commonFunctionForNavigation("frmSortBy");

    },
  checkPermission: function(triggerPoint){
     var configManager = applicationManager.getConfigurationManager();
        if (triggerPoint === "Holdings") {
            let holdingsViewPermission = false;
            let holdingsBuyPermission =false;
            let holdingsSellPermission =false;
            var getPermissionDetails = JSON.parse(this.view.segmentDetailsWealth.getFeaturesAndPermissions());
            if (typeof getPermissionDetails !== "undefined") {
                if (getPermissionDetails.view.length > 0) {
                    holdingsViewPermission = configManager.checkAtLeastOnePermission(getPermissionDetails.view);
                    this.view.flxPerformance.isVisible = holdingsViewPermission;
                }
                if (getPermissionDetails.buy.length > 0) {
                    holdingsBuyPermission = configManager.checkAtLeastOnePermission(getPermissionDetails.buy);
                    this.view.flxAccounts.isVisible = holdingsBuyPermission;
                }
                if (getPermissionDetails.sell.length > 0) {
                    holdingsSellPermission = configManager.checkAtLeastOnePermission(getPermissionDetails.sell);
                    this.view.flxReport.isVisible = holdingsSellPermission;
                }
            }
          
            if (holdingsSellPermission!==true && holdingsBuyPermission!==true && holdingsViewPermission!==true) {
                this.view.segmentDetailsWealth.setVisibleActionImage(false);
             }
           else {
               this.view.segmentDetailsWealth.setVisibleActionImage(true);
              }
        } else {
            this.view.flxReport.isVisible = true;
            this.view.flxPerformance.isVisible = true;
        }
    
  },
  

});