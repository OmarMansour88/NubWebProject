define([], function () { 
    
    /**
     * User defined business controller
     * @constructor
     * @extends kony.mvc.Business.Controller
     */
    function WealthPortfolioManager() { 
		kony.mvc.Business.Delegator.call(this);
      // kony.mvc.Business.Controller.call(this); 

    } 

    inheritsFrom(WealthPortfolioManager, kony.mvc.Business.Delegator); 

    /**
     * Overridden Method of kony.mvc.Business.Controller
     * This method gets called when business controller gets initialized
     * @method
     */
    WealthPortfolioManager.prototype.initializeBusinessController = function() { 

    }; 

    /**
     * Overridden Method of kony.mvc.Business.Controller
     * This method gets called when business controller is told to execute a command
     * @method
     * @param {Object} kony.mvc.Business.Command Object
     */
	WealthPortfolioManager.prototype.execute = function(command) { 

		kony.mvc.Business.Controller.prototype.execute.call(this, command);

	};
   /**
    * set an attribute in the Wealth object.
    * @param {string} key , key in the Wealth object.
    * @param {string} value , value to be assigned for the key in the Wealth object.
    */
  WealthPortfolioManager.prototype.setWealthAttribute = function (key, value) {
    this.wealthData[key] = value;
  };
  /**
    * used to get a wealth object.
    * @return {object} WealthObject, entire Wealth Object.
    */
  WealthPortfolioManager.prototype.getWealthObject = function () {
    return this.wealthData;
  };
  /**
    * used to set a Wealth object.
    * @param {object} object, entire Wealth Object.
    */
  WealthPortfolioManager.prototype.setWealthObject = function (object) {
    this.wealthData = object;
  };
  /**
    * used to clear Wealth Object.
    */
  WealthPortfolioManager.prototype.clearWealthObject = function () {
    var modelDefinition = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Order");
    this.wealthData = new modelDefinition();
  };
   /**
    * get currency rate
    * @param {object} param ,
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
    */
   WealthPortfolioManager.prototype.getCurrencyRate = function (param, presentationSuccessCallback, presentationErrorCallback) {
    var savingsPotRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("CurrencyDetails"); 
    savingsPotRepo.customVerb("GetMarketRates", param, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error);
        if (obj["status"] === true) {
           presentationSuccessCallback(obj["data"]);
        }
        else {
          presentationErrorCallback(obj["errmsg"]);
       }
    }
  };
   WealthPortfolioManager.prototype.downloadList = function (params,presentationSuccessCallback, presentationErrorCallback) {
     var DownloadList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("DownloadPDF");
    DownloadList.customVerb("generatePDF", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  WealthPortfolioManager.prototype.getHoldingList = function (params,presentationSuccessCallback, presentationErrorCallback) {
     var holdingsList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("PortfolioDetails");
    holdingsList.customVerb("getPortfolioHoldings", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  WealthPortfolioManager.prototype.getReportDetails = function (params,presentationSuccessCallback, presentationErrorCallback) {
     var reportList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Reports");
     reportList.customVerb("getReportAndDownloadTypes", params, getAllCompletionCallback);
     function getAllCompletionCallback(status, data, error) {
       var srh = applicationManager.getServiceResponseHandler();
       var obj = srh.manageResponse(status, data, error);
       if (obj["status"] === true) {
         presentationSuccessCallback(obj["data"]);
       }
      else {
         presentationErrorCallback(obj["errmsg"]);
       }
     }
      
 };
  WealthPortfolioManager.prototype.getAccountActivityList = function(params, presentationSuccessCallback, presentationErrorCallback) {
    var accountActivity = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("AccountActivity");
    accountActivity.customVerb("getAccountActivityOperations", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error);
        if (obj["status"] === true) {
            presentationSuccessCallback(obj["data"]);
        } else {
            presentationErrorCallback(obj["errmsg"]);
        }
    }
};
/**
    * create order
    * @param {object} param ,
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
    */
   WealthPortfolioManager.prototype.createOrder = function (param, presentationSuccessCallback, presentationErrorCallback) {
    var savingsPotRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Order"); 
    savingsPotRepo.customVerb("createOrder", param, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error);
        if (obj["status"] === true) {
           presentationSuccessCallback(obj["data"]);
        }
        else {
          presentationErrorCallback(obj["errmsg"]);
       }
    }
  };

  WealthPortfolioManager.prototype.getAssets = function (params,presentationSuccessCallback, presentationErrorCallback) {
    var instrumentList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("PortfolioDetails");
   instrumentList.customVerb("getPortfolioDetails", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  
  };
  
   WealthPortfolioManager.prototype.getPortfolioDetails = function (params,presentationSuccessCallback, presentationErrorCallback) {
     var instrumentList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("PortfolioDetails");
    instrumentList.customVerb("getPortfolioDetails", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
 };
  
     WealthPortfolioManager.prototype.getDashboardDetails = function (params,presentationSuccessCallback, presentationErrorCallback) {
     var instrumentList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Dashboard");
    instrumentList.customVerb("getDashboardGraphData", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
 };
 
  WealthPortfolioManager.prototype.getTransactionList = function (params,presentationSuccessCallback, presentationErrorCallback) {
     var holdingsList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("PortfolioDetails");
    holdingsList.customVerb("getTransactionDetails", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  
    WealthPortfolioManager.prototype.getPerformanceList = function (params,presentationSuccessCallback, presentationErrorCallback) {
     var performanceList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("PortfolioPerformance");
    performanceList.customVerb("getPortfolioPerformance", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  WealthPortfolioManager.prototype.getHistoricalCurrencyRate = function (param, presentationSuccessCallback, presentationErrorCallback) {
    var savingsPotRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("CurrencyDetails"); 
    savingsPotRepo.customVerb("getHistoricalData", param, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error);
        if (obj["status"] === true) {
           presentationSuccessCallback(obj["data"]);
        }
        else {
          presentationErrorCallback(obj["errmsg"]);
       }
    }
  };
  WealthPortfolioManager.prototype.getInstrumentDetails = function (params,presentationSuccessCallback, presentationErrorCallback) {
     var holdingsList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("ProductDetails");
    holdingsList.customVerb("getProductDetails", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  WealthPortfolioManager.prototype.getInstrumentDetailsById = function (params,presentationSuccessCallback, presentationErrorCallback) {
     var holdingsList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("ProductDetails");
    holdingsList.customVerb("getProductDetailsFromId", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
    
  WealthPortfolioManager.prototype.updateUserFavouriteInstruments = function (params,presentationSuccessCallback, presentationErrorCallback) {
    var favouriteList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("FavouriteInstruments");
    favouriteList.customVerb("updateUserFavouriteInstruments", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  
  WealthPortfolioManager.prototype.getUserFavouriteInstruments = function (params,presentationSuccessCallback, presentationErrorCallback) {
    var favouriteList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("FavouriteInstruments");
    favouriteList.customVerb("getUserFavouriteInstruments", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  
   WealthPortfolioManager.prototype.getFavoriteInstruments = function (params,presentationSuccessCallback, presentationErrorCallback) {
    var favouriteList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("FavouriteInstruments");
    favouriteList.customVerb("getFavoriteInstruments", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };

   WealthPortfolioManager.prototype.getStockNewsStory = function (param, presentationSuccessCallback, presentationErrorCallback) {
   var stockNewsStory = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("InstrumentDetails"); 
    stockNewsStory.customVerb("getStockNewsStory", param, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error);
        if (obj["status"] === true) {
           presentationSuccessCallback(obj["data"]);
        }
        else {
          presentationErrorCallback(obj["errmsg"]);
       }
    }
  };

  WealthPortfolioManager.prototype.getCurrencyList = function (presentationSuccessCallback, presentationErrorCallback) {
     var holdingsList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("CurrencyDetails");
    holdingsList.customVerb("getAddCurrency",{}, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };

  //getSearchList
    WealthPortfolioManager.prototype.getSearchList = function (params,presentationSuccessCallback, presentationErrorCallback) {
     var holdingsList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("InstrumentDetails");
    holdingsList.customVerb("getSearchInstrumentList", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
   WealthPortfolioManager.prototype.getPlaceOrderDetails = function (params,presentationSuccessCallback, presentationErrorCallback) {
     var holdingsList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("GetInstrumentDetails");
    holdingsList.customVerb("GetInstrumentDetails", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
   WealthPortfolioManager.prototype.getTodayMarketNews = function (params,presentationSuccessCallback, presentationErrorCallback) {
     var holdingsList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("DailyMarket");
    holdingsList.customVerb("getDailyMarket", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  
    WealthPortfolioManager.prototype.getTopNews = function (params,presentationSuccessCallback, presentationErrorCallback) {
     var holdingsList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("MarketNews");
    holdingsList.customVerb("getTopMarketNews", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
// getWatchlist function - to get watchlist data from service - 
 // service not ready
   WealthPortfolioManager.prototype.getWatchList = function (params,presentationSuccessCallback, presentationErrorCallback) {
    var holdingsList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("MarketNews");
    holdingsList.customVerb("getTopMarketNews", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
   WealthPortfolioManager.prototype.getRecentActivity = function (params,presentationSuccessCallback, presentationErrorCallback) {
     var holdingsList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Dashboard");
    holdingsList.customVerb("getDashboardRecentActivity", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  //getWealthDashboard
    WealthPortfolioManager.prototype.getPortfolioList = function (params,presentationSuccessCallback, presentationErrorCallback) {
      var holdingsList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Dashboard");
     holdingsList.customVerb("getWealthDashboard", params, getAllCompletionCallback);
     function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
       var obj = srh.manageResponse(status, data, error);
       if (obj["status"] === true) {
         presentationSuccessCallback(obj["data"]);
       }
       else {
         presentationErrorCallback(obj["errmsg"]);
       }
     }
    
  };
   WealthPortfolioManager.prototype.getAssetsList = function (params,presentationSuccessCallback, presentationErrorCallback) {
     var holdingsList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Dashboard");
    holdingsList.customVerb("getAssetList", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  WealthPortfolioManager.prototype.createMarketOrder = function (param, presentationSuccessCallback, presentationErrorCallback) {
    var marketOrder = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Order"); 
    marketOrder.customVerb("createMarketOrder", param, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error);
        if (obj["status"] === true) {
           presentationSuccessCallback(obj["data"]);
        }
        else {
          presentationErrorCallback(obj["errmsg"]);
       }
    }
  };
  
    WealthPortfolioManager.prototype.modifyMarketOrder = function (param, presentationSuccessCallback, presentationErrorCallback) {
    var marketOrder = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Order"); 
    marketOrder.customVerb("modifyOrder", param, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error);
        if (obj["status"] === true) {
           presentationSuccessCallback(obj["data"]);
        }
        else {
          presentationErrorCallback(obj["errmsg"]);
       }
    }
  };
  
  WealthPortfolioManager.prototype.getOrdersDetails = function (params,presentationSuccessCallback, presentationErrorCallback) {
     var order = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("PortfolioDetails");
    order.customVerb("getOrdersDetails", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  WealthPortfolioManager.prototype.cancelOrder = function (params,presentationSuccessCallback, presentationErrorCallback) {
     var order = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("OrdersDetails");
    order.customVerb("cancelOrder", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  
  
  // ITEMS BELOW ARE TEMPORARY - TAP AND MOCK ITEMS - WRITE ACTUAL INTEGRATIONS ABOVE THIS
  
  
  	     
       
    
      WealthPortfolioManager.prototype.getStockNews = function (params,presentationSuccessCallback, presentationErrorCallback) {
       var stockNews = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("getStocksNews");
    stockNews.customVerb("getStockNews", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
        WealthPortfolioManager.prototype.getStockNewsDetails = function (params,presentationSuccessCallback, presentationErrorCallback) {
       var stockNews = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("InstrumentDetails");
    stockNews.customVerb("getstockNewsDetails", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
   WealthPortfolioManager.prototype.getDocuments = function (params,presentationSuccessCallback, presentationErrorCallback) {
//        var getDocs = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("getDocumentDetails");
//     getDocs.customVerb("getDocuments", params, getAllCompletionCallback);
//     function getAllCompletionCallback(status, data, error) {
//       var srh = applicationManager.getServiceResponseHandler();
//       var obj = srh.manageResponse(status, data, error);
//       if (obj["status"] === true) {
//         presentationSuccessCallback(obj["data"]);
//       }
//       else {
//         presentationErrorCallback(obj["errmsg"]);
//       }
//     }
  };
   WealthPortfolioManager.prototype.getNewsHighlights = function (presentationSuccessCallback, presentationErrorCallback) {
   // var getPendingUserTransactions = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("MarketNews");
       var externalBanks = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("getHeadlines");
    externalBanks.customVerb("getNewsHeadlines", {}, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
   WealthPortfolioManager.prototype.getIndexDetails = function (params,presentationSuccessCallback, presentationErrorCallback) {
   // var getPendingUserTransactions = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("MarketNews");
       var externalBanks = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("getMarketIndex");
    externalBanks.customVerb("getMarketIndexes", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };  
    return WealthPortfolioManager;

});