define({
sortingData: [],
selectedRow: 0, 
  segData: [],
  //selectedColumnKey: "",
 // selectedColumn: "",
 init: function(){
   this.view.preShow = this.preShow;
   var navManager = applicationManager.getNavigationManager();
   var currentForm = navManager.getCurrentForm();
    applicationManager.getPresentationFormUtility().initCommonActions(this, "YES", currentForm);
 },
  preShow: function(){
     var navManager = applicationManager.getNavigationManager();
     let data = navManager.getCustomInfo("frmReportType");
  // this.selectedColumn = data.reportTypeData.selectedOption;
   // this.selectedColumnKey = data.reportTypeData.selectedKey;
    this.setSegmentData(data);
       if (applicationManager.getPresentationFormUtility().getDeviceName() !== "iPhone") {
            this.view.flxHeader.isVisible = true;
        } else {
            this.view.flxHeader.isVisible = false;
        }
    this.initActions();
  },
  initActions: function(){
     this.view.customHeader.flxBack.onTouchEnd = this.onDoneClick;
     this.view.btnDone.onClick = this.onDoneClick; 
     this.view.segReportType.onRowClick = this.onValueSelect;
    },
    onValueSelect: function() {
        var rowIndex = this.view.segReportType.selectedRowIndex[1];
        this.sortingData = this.view.segReportType.data;
        this.selectedRow = rowIndex;
        this.sortingData.forEach(function(e) {
            e.isSelected = false;
            e.imageDetails.src = "radiobuttoninactive.png";
        });
        this.sortingData[rowIndex].isSelected = true;
        this.sortingData[rowIndex].sortName = {
            "text": this.segData[rowIndex].sortName
        };
        this.sortingData[rowIndex].imageDetails = {
            "src": "radiobtn.png",
        };
       // this.selectedColumnKey = this.segData[rowIndex].sortIndex;
      //  this.selectedColumn = this.segData[rowIndex].sortName;
        applicationManager.getModulesPresentationController("WealthPortfolioUIModule").reportType = this.segData[rowIndex].sortName;
      applicationManager.getModulesPresentationController("WealthPortfolioUIModule").reportParams= this.segData[rowIndex].reportParams;
        this.view.segReportType.setData(this.sortingData);
    },
  onDoneClick: function(){
     var navManager = applicationManager.getNavigationManager();
     navManager.navigateTo("frmReport");
  },
  setSegmentData: function(data){
     // var temp = this.selectedColumnKey;
      var temp = applicationManager.getModulesPresentationController("WealthPortfolioUIModule").reportType;
      var reportType = [];
    for(var list in data){
    var storeData = {
                    "sortName": data[list].reportType,
                    "reportParams":data[list].downloadParams,
                    "isSelected": false
                };
    reportType.push(storeData);
    }
    this.segData = reportType;
      this.segData.forEach(function(e) {
            if (e.sortName === temp)
                e.isSelected = true;
            else e.isSelected = false;
        });
   this.sortingData = [];
   this.loadSegment();
},
     loadSegment: function() {
        var data = [];
        data = this.segData;
        for (var list in data) {
            var storeData;
                storeData = {
                    isSelected: true,
                    sortName: {
                        text: data[list].sortName,
                    },
                    imageDetails: {
                        src: (data[list].isSelected)?"radiobtn.png":"radiobuttoninactive.png",
                        isVisible: true
                    }
                  //reportParams: data[list].downloadParams
                   // sortIndex: data[list].sortIndex
                };
            this.sortingData.push(storeData);
        }
        this.view.segReportType.widgetDataMap = {
            lblTypeName: "sortName",
            imgCheck: "imageDetails"
        };
        this.view.segReportType.removeAll();
        this.view.segReportType.setData(this.sortingData);
    },

});