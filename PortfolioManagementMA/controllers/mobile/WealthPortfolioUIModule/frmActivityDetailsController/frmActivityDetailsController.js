define({ 
 init : function(){
    var navManager = applicationManager.getNavigationManager();
    var currentForm=navManager.getCurrentForm();
    applicationManager.getPresentationFormUtility().initCommonActions(this,"YES",currentForm);
  },
  preShow:function(){
    if(applicationManager.getPresentationFormUtility().getDeviceName() !== "iPhone"){
      this.view.flxHeader.isVisible = true;
    }
    else{
      this.view.flxHeader.isVisible = false;
    }
   var navManager = applicationManager.getNavigationManager();
   var activityDetail = navManager.getCustomInfo("frmActivityDetails");
   var actDetail=activityDetail.details;
    this.setDataToSegment(actDetail);
    this.initActions();
  },
  initActions:function(){
    this.view.customHeader.flxBack.onTouchEnd = this.onBack;
  },
   onBack : function () {
   var navMan = applicationManager.getNavigationManager();
      navMan.navigateTo("frmAccounts");
  },

setDataToSegment:function(activityDetail){
  var result = [];
for(var i in activityDetail){
let temp = {
name : i+":",
value: activityDetail[i]
};
result.push(temp);
}
 var currForm = kony.application.getCurrentForm();
 var segData = [];
      for(var list in result){	
        var storeData;
        storeData = {
          name: result[list].name,
          value: result[list].value
        };
        segData.push(storeData);
      }

      this.view.segActivityDetail.widgetDataMap = {
        lblName: "name",
        lblValue: "value"
      };		
      this.view.segActivityDetail.setData(segData);
      currForm.forceLayout(); 
}
 });