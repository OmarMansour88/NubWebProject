define({
  searchList: [],
  init : function(){
    this.view.preShow =  this.preShow;
    var navManager = applicationManager.getNavigationManager();
    var currentForm=navManager.getCurrentForm();
    applicationManager.getPresentationFormUtility().initCommonActions(this,"YES",currentForm);
  },
  onClickCancel:function(){
    //navigate back
    /*var wealthMod = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
    wealthMod.commonFunctionForgoBack();*/
    new kony.mvc.Navigation({"appName" : "PortfolioManagementMA", "friendlyName" : "frmPortfolioDetails"}).navigate();

  },
  preShow:function(){
    var scope = this;
    function timercallback(){
      scope.view.tbxSearch.setFocus(true);
    }
    this.view.tbxSearch.text = "";
    kony.timer.schedule("tbxfocustimer1", timercallback, 0.5, false);
    this.view.segInstrument.isVisible = false;
    this.view.flxError.isVisible = false;
    this.view.tbxSearch.text = "";
    this.view.imgClose.isVisible =  false;
    /*  var navigationMan=applicationManager.getNavigationManager();
    var temp = navigationMan.getCustomInfo("frmInstrumentSearch");
    var data = temp.response;
    this.searchList = data.instrumentList;*/
    this.initActions();
  },
  initActions:function(){
    this.view.tbxSearch.onTextChange=this.onSearchInstrument;  
    this.view.btnCancel.onClick = this.onClickCancel;
    this.view.imgClose.onTouchEnd = this.clearText;
    this.view.segInstrument.onRowClick = this.onSelectInstrument;
  },
  onSearchInstrument:function(){  
    this.view.imgClose.isVisible =  true;
    this.view.flxError.isVisible = false;
    this.view.segInstrument.removeAll();

    if(this.view.tbxSearch.text === "" || this.view.tbxSearch.text === null||this.view.tbxSearch.text.length<3){
      this.view.segInstrument.setVisibility(false);
      this.view.imgClose.isVisible =  false;
    }else{
      var searchTxt = this.view.tbxSearch.text;
      var params = {
        "sortBy": "",
        "searchByInstrumentName": searchTxt,
        "portfolioId": applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioId
      };
      var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
      wealthModule.getInstrumentSearchList(params);
      //  this.setResultDataToSeg(searchTxt);
    }    
  },
  onSelectInstrument: function(){
    var rowIndex = this.view.segInstrument.selectedRowIndex[1];
    var rowData = this.view.segInstrument.data[rowIndex];
    var wealthMod = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
    wealthMod.setInstrumentId(rowData.instrumentId);
    // var marketName = rowData.marketName;

    rowData.totalValue= applicationManager.getModulesPresentationController("WealthPortfolioUIModule").marketValue;
    var data = {};
    data.response = rowData;
    var navigationMan=applicationManager.getNavigationManager();
    navigationMan.setCustomInfo("frmInstrumentDetails",data);
    applicationManager.getModulesPresentationController("WealthPortfolioUIModule").instrumentDetailsEntry=true;
    applicationManager.getModulesPresentationController("WealthPortfolioUIModule").searchEntryPoint=true;
    wealthMod.setISINCode(rowData.ISIN);
    wealthMod.setRICCode(rowData.RICCode);
    wealthMod.setInstrumentId(rowData.instrumentId);
	scope_WealthPresentationController.applicationId=rowData.application;

    //     var param={
    //       "ISINCode": rowData.ISIN?rowData.ISIN:'',
    //       "RICCode": rowData.RICCode?rowData.RICCode:'',
    //       "instrumentId" : rowData.instrumentId?rowData.instrumentId:''
    //     };
    //     wealthMod.getInstrumentDetails(param);

    var paramHoldings = {
      "portfolioId":applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioId,
      "navPage":"Holdings",
      "sortBy":"description",
      "searchByInstrumentName": rowData.instrumentName,
      "RICCode":rowData.RICCode,
      "instrumentId":rowData.instrumentId
    };
    wealthMod.getHoldings(paramHoldings);

  },
  clearText: function(){
    this.view.tbxSearch.text = "";
    this.view.imgClose.isVisible =  false;
    this.view.flxError.isVisible=false;
    this.view.segInstrument.removeAll();
  },
  setResultDataToSeg: function(){
    var currForm = kony.application.getCurrentForm();
    var navigationMan=applicationManager.getNavigationManager();
    var temp = navigationMan.getCustomInfo("frmInstrumentSearch");
    var data1 = temp.response;
    var data=data1.instrumentList;
    // this.searchList = data.instrumentList;

    //  var searchData = [];
    //   searchData = this.searchList;
    //  var data = searchData.filter(el => ((el.description).toLowerCase()).indexOf(searchText) !== -1);
    if(data.length === 0){
      this.view.flxError.isVisible = true;
    }
    else{
      var segData = [];
      for(var list in data){	

        var exchange;
        if(data[list].ISIN && data[list].holdingsType )
        {
          exchange = data[list].ISIN + ' | ' + data[list].holdingsType;
        }
        else if(data[list].ISIN)
        {
          exchange = data[list].ISIN;
        }
        else if(data[list].holdingsType )
        {
          exchange = data[list].holdingsType;
        }
        else
        {
          exchange={"isVisible": false};
          //exchange="";
        }
        var storeData = {
          instrumentName: data[list].description,
          marketName: exchange,
          instrumentId: data[list].instrumentId,
          description: data[list].description,
          ISIN: data[list].ISIN,
          holdingsType: data[list].holdingsType,
          RICCode: data[list].RICCode
        };
        if(data[list].application){
          storeData.application = data[list].application;
        //scope_WealthPresentationController.applicationId = data[list].application;
        }
        segData.push(storeData);
      }
      this.view.segInstrument.widgetDataMap = {
        lblInstrumentName: "instrumentName",
        lblInstrumentDet: "marketName"
      };		
      this.view.segInstrument.removeAll();
      this.view.segInstrument.setData(segData);
      this.view.segInstrument.setVisibility(true);
      currForm.forceLayout();
    }
  }
});
