define(['ViewConstants','CommonUtilities'], function(ViewConstants,CommonUtilities){
  var responsiveUtils = new ResponsiveUtils();
  return {


    updateFormUI: function(uiData) {
		this.init();
        if (uiData){
          if (uiData.NewsList){
             this.view.topNews.loadMarketNews(uiData.NewsList);
             this.setContentNews(uiData.NewsList);
          }
          if (uiData.NewsError) {
             this.hideContentNews(uiData.NewsList);
          }
        }
    },

    init: function(){
       this.view.preShow = this.preShow;
       this.view.postShow = this.postShow;
       this.view.onBreakpointChange = this.onBreakpointChange;
       this.view.pagination.fetchPaginatedRecords = this.fetchPaginatedRecords;
    },
    
    preShow: function(){
        this.view.marketIndexDashComp.getCriteria({}, applicationManager.getConfigurationManager().checkUserPermission("WEALTH_MARKET_AND_NEWS_MARKET_VIEW"), false);
    },
    
    postShow: function(){
        applicationManager.getNavigationManager().applyUpdates(this);
        this.setActiveHeaderHamburger();
    },
	onBreakpointChange: function(form, width){
      responsiveUtils.onOrientationChange(this.onBreakpointChange);
      this.view.customheadernew.onBreakpointChangeComponent(width);
      this.view.customfooternew.onBreakpointChangeComponent(width);
    },
    goBack: function(){
      //var navMan=applicationManager.getNavigationManager();
      //navMan.goBack();
      new kony.mvc.Navigation({"appName": "WealthOrderMA","friendlyName": "frmProductDetails"}).navigate();
    },
    
    /**
     *setActiveHeaderHamburger - Method to highlight active header and hamburger
     */
    setActiveHeaderHamburger: function() {
      this.view.customheadernew.activateMenu("Accounts", "My Accounts");
      this.view.customheadernew.flxContextualMenu.setVisibility(false);
      this.view.customheadernew.flxAccounts.skin = ViewConstants.SKINS.BLANK_SKIN_TOPMENU;
    },
    hideContentNews: function() {
       this.view.flxLeftContainer.setVisibility(false);
       this.view.flxErrorInfo.setVisibility(true);
    },
    fetchPaginatedRecords: function(offset, limit){
      var navMan = applicationManager.getNavigationManager();
      var data = navMan.getCustomInfo('frmTopNews');
      var StockNews = data.stock;
      let params;
      let wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
      if (StockNews) {
        
        let portRicCode = applicationManager.getNavigationManager().getCustomInfo('frmProductDetails').portfolioDetails.RICCode;
        let prodDetails = applicationManager.getNavigationManager().getCustomInfo('frmProductDetails').productDetails;
        let instrumentRicCode="";
        if(prodDetails.instrumentMinimal[0])
          instrumentRicCode = prodDetails.instrumentMinimal[0].RICCode;                   
        else
          instrumentRicCode = prodDetails.instrumentMinimal.RICCode;

          params = {
            "RICCode": portRicCode?portRicCode: instrumentRicCode,
            "pageSize": limit,
            "pageOffset": offset
          };
          wealthModule.getStockNewsDetails(params); 
      }
      else {
          params = {
            "Topic": "OLUSBUS",
            "pageSize": limit,
            "pageOffset": offset
          };
          wealthModule.getTopNews(params); 
      }

    },
    setContentNews: function(elems) {
		this.view.flxBack.onTouchEnd = this.goBack;
      
		var paginationDetails = this.view.pagination.getDefaultOffsetAndLimit();
        var navMan = applicationManager.getNavigationManager();
        var data = navMan.getCustomInfo('frmTopNews');
        var StockNews = data.stock;

        if (StockNews === true) {
            this.view.flxBack.setVisibility(true);
            this.view.flxPrimaryDetailsRow.top = "0dp";
            this.view.pagination.updatePaginationBar(paginationDetails.limit, elems.totalCount);
        }
        else {
            this.view.flxBack.setVisibility(false);
            this.view.flxPrimaryDetailsRow.top = "30dp";
            this.view.pagination.updatePaginationBar(paginationDetails.limit, elems.totalCount);
        }
	}
  };
});