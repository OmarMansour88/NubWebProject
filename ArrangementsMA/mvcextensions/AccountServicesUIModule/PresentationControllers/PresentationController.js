define([], function () {
  function AccountServices_PresentationController() {
    kony.mvc.Presentation.BasePresenter.call(this);
  }
  inheritsFrom(AccountServices_PresentationController, kony.mvc.Presentation.BasePresenter);
  AccountServices_PresentationController.prototype.initializePresentationController = function () {
  };
     /**
     * presentSurvey : Method to present data to form
     * @member of {Survey_PresentationController}
     * @param {Json object} data- viewmodel to present
     * @return {}
     * @throws {}
     */
  AccountServices_PresentationController.prototype.navigateToConsolidatedStatements = function () {
    var navManager = applicationManager.getNavigationManager();
    navManager.navigateTo('frmConsolidatedStatements');
    //this.presentUserInterface('frmCustomerFeedbackSurvey', data);
  };  
  
     /**
     * showView : Method to handle present data to the form
     * @member of {Survey_PresentationController}
     * @param {String, Object} frm- form name, data- data to send form
     * @return {}
     * @throws {}
     */
  AccountServices_PresentationController.prototype.showView = function (frm, data) {
    this.presentUserInterface(frm, data);
  };
     /**
     * showProgressBar : Method to handle show progress bar
     * @member of {Survey_PresentationController}
     * @param {}
     * @return {}
     * @throws {}
     */
  AccountServices_PresentationController.prototype.showProgressBar = function () {
    var self = this;
    self.navigateToConsolidatedStatements({ "showProgressBar": "showProgressBar" });
  };
     /**
     * hideProgressBar : Method to handle hide progress bar
     * @member of {Survey_PresentationController}
     * @param {}
     * @return {}
     * @throws {}
     */
  AccountServices_PresentationController.prototype.hideProgressBar = function () {
    var self = this;
    self.navigateToConsolidatedStatements({ "hideProgressBar": "hideProgressBar" });
  };
  
  AccountServices_PresentationController.prototype.generateCombinedStatement = function(context, SuccessCallback, FailureCallback) {
        
		applicationManager.getAccountServicesModule().generateCombinedStatement(context,function sucess(response){
		SuccessCallback(response)}, function failure(response){
		applicationManager.getNavigationManager().updateForm({
            showLoadingIndicator: {
                status: false
            }
        })
        FailureCallback(response)
        });
  }
  return AccountServices_PresentationController;
});