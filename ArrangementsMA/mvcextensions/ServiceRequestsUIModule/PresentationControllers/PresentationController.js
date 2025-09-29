
define([], function () {
  /**
     * User defined presentation controller
     * @constructor
     * @extends kony.mvc.Presentation.BasePresenter
     */
  function ServiceRequests_PresentationController() {
    kony.mvc.Presentation.BasePresenter.call(this);
  }

  inheritsFrom(ServiceRequests_PresentationController, kony.mvc.Presentation.BasePresenter);

  /**
     * Overridden Method of kony.mvc.Presentation.BasePresenter
     * This method gets called when presentation controller gets initialized
     * @method
     */
  ServiceRequests_PresentationController.prototype.initializePresentationController = function() {};
   
  ServiceRequests_PresentationController.prototype.initServiceRequests = function() {
    applicationManager.getPresentationUtility().showLoadingScreen();
    var navManager = applicationManager.getNavigationManager();
    navManager.updateForm({
      isLoading: true
    });
   
    new kony.mvc.Navigation({"appName" : "ArrangementsMA", "friendlyName" : "ServiceRequestsUIModule/frmServiceRequests"}).navigate();

  };
  return ServiceRequests_PresentationController;
});