/**
 * @module LocateUsPresentationController
 */
define([], function() {
    var MDABasePresenter = kony.mvc.Presentation.BasePresenter;
    var BusinessController = kony.mvc.Business.Controller;
    var MDAFormController = kony.mvc.MDAFormController;
    /**
     * @alias module:LocateUsPresentationController
     * @class
     */
    function LocateUsPresentationController() {
        MDABasePresenter.call(this);
        this.locateUsSearchModel = {
            "searchResult": null,
        };
        locateUsPresentationScope = this;
    }
    inheritsFrom(LocateUsPresentationController, MDABasePresenter);
    LocateUsPresentationController.prototype.initializePresentationController = function() {};
    /**
     * presentLocateUs : Method for navigate to LocateUs form
     * @param {Object} data - viewModel to be sent to the form
     */
    LocateUsPresentationController.prototype.presentLocateUs = function(data) {
        var navigationManager = applicationManager.getNavigationManager();
        var currentForm = kony.application.getCurrentForm().id;
        if (currentForm === 'frmLocateUs') {} else {
            navigationManager.navigateTo({"appName" : "AboutUsMA", "friendlyName" : "LocateUsUIModule/frmLocateUs"});
        }
        navigationManager.updateForm(data, 'frmLocateUs');
    };
    /**
     * it loads the locate us components
     */
    LocateUsPresentationController.prototype.loadLocateUsComponents = function() {
        this.showProgressBar();
    };
    /**
     * showProgressBar : Method to show the progress bar
     */
    LocateUsPresentationController.prototype.showProgressBar = function() {
        var self = this;
        self.presentLocateUs({
            "ProgressBar": {
                show: true
            }
        });
    };
    /**
     * hideProgressBar : Method to hide the progress bar
     */
    LocateUsPresentationController.prototype.hideProgressBar = function() {
        var self = this;
        self.presentLocateUs({
            "ProgressBar": {
                show: false
            }
        });
    };
    /**
     * showLocateUsPage : Entry Function for Locate Us page
     */
    LocateUsPresentationController.prototype.showLocateUsPage = function() {
        var self = this;
        if (!navigator.geolocation) {
            self.presentLocateUs({
                "geoLocationError": "geoLocationError"
            });
            return;
        } else {
            var userObj = applicationManager.getUserPreferencesManager();
            var isLoggedin = userObj.isUserLoggedin();
            if (!isLoggedin) {
                this.presentLocateUs({
                    "preLoginView": "preLoginView"
                });
            } else {
                this.loadLocateUsComponents();
                this.presentLocateUs({
                    "postLoginView": "postLoginView"
                });
            }
        }
    };
    /**
     * getBranchOrATMList : Get the list of Atms and Branches based on the current location
     */
    LocateUsPresentationController.prototype.getBranchOrATMList = function() {
        var self = this;
        self.showProgressBar();
        var param = null;
        if (!navigator.geolocation) {
            self.presentLocateUs({
                "geoLocationError": "geoLocationError"
            });
            return;
        } else {
            navigator.geolocation.getCurrentPosition(geoSuccess, geoFailure);
        }

        function geoSuccess(position) {
            self.globalLat = position.coords.latitude;
            self.globalLon = position.coords.longitude;
            param = {
                "latitude": position.coords.latitude,
                "longitude": position.coords.longitude
            };
            var locateUsManager = applicationManager.getLocationManager();
            locateUsManager.fetchNearByLocations(param, locateUsPresentationScope.fetchNearByLocationsSuccess, locateUsPresentationScope.fetchNearByLocationsFailure);
        }

        function geoFailure() {
            self.presentLocateUs({
                "geoLocationError": "geoLocationError"
            });
            return;
        }
    };
    /**
     * fetchNearByLocationsSuccess : success callback of fetchNearByLocations
     */
    LocateUsPresentationController.prototype.fetchNearByLocationsSuccess = function(response) {
        var locationList = response;
        locateUsPresentationScope.presentLocateUs({
            "getBranchOrATMListSuccess": locationList
        });
    };
    /**
     * fetchNearByLocationsFailure : failure callback of fetchNearByLocations
     */
    LocateUsPresentationController.prototype.fetchNearByLocationsFailure = function(error) {
        locateUsPresentationScope.presentLocateUs({
            "getBranchOrATMListFailure": "getBranchOrATMListFailure"
        });
    };
    /**
     * getSearchBranchOrATMList : Method to get the list of ATMs and Branches based on the search criteria
     * @param {String} queryParams - queryParams contains the search criteria
     */
    LocateUsPresentationController.prototype.getSearchBranchOrATMList = function(queryParams) {
        var self = this;
        self.showProgressBar();
        var param = {
            "query": queryParams.query
        };
        var locateUsManager = applicationManager.getLocationManager();
        locateUsManager.fetchLocationsBySearch(queryParams.query, locateUsPresentationScope.fetchLocationsBySearchSuccess, locateUsPresentationScope.fetchLocationsBySearchFailure);
    };
    /**
     * fetchLocationsBySearchSuccess : success callback of fetchLocationsBySearch
     */
    LocateUsPresentationController.prototype.fetchLocationsBySearchSuccess = function(data) {
        if (data && data.length) {
            locateUsPresentationScope.presentLocateUs({
                "getSearchBranchOrATMListSuccess": data
            });
        } else {
            locateUsPresentationScope.presentLocateUs({
                "getSearchBranchOrATMListFailure": "getSearchBranchOrATMListFailure"
            });
        }
    };
    /**
     * fetchLocationsBySearchFailure : failure callback of fetchLocationsBySearch
     */
    LocateUsPresentationController.prototype.fetchLocationsBySearchFailure = function() {
        locateUsPresentationScope.presentLocateUs({
            "getSearchBranchOrATMListFailure": "getSearchBranchOrATMListFailure"
        });
    };
    /**
     * getAtmorBranchDetails : Method to get the Details of the ATM or Branch based on the Location Id
     * @param {Object} detailsJSON - contains the Type and Location Id
     */
    LocateUsPresentationController.prototype.getAtmorBranchDetails = function(detailsJSON) {
        var self = this;
        var params = {
            "type": detailsJSON.type,
            "placeID": detailsJSON.placeID
        };
        var locateUsManager = applicationManager.getLocationManager();
        locateUsManager.fetchLocationDetails(detailsJSON.placeID, locateUsPresentationScope.fetchLocationDetailsSuccess, locateUsPresentationScope.fetchLocationDetailsFailure);
    };
    LocateUsPresentationController.prototype.parseLocations = function (data) {
        try {
            // Parse the JSON data
            let parsedData = JSON.parse(data);
            
            // Check if the "Locations" array exists in the parsed data
            if (parsedData.PlaceDetails) {
                return parsedData.PlaceDetails;
            } else {
                console.error("No 'PlaceDetails' array found in the data.");
                return [];
            }
        } catch (error) {
            console.error("Invalid JSON format:", error);
            return [];
        }
        },


    /**
     * fetchLocationDetailsSuccess : success callback of fetchLocationDetails
     * @param {Array} data - location details
     */
    LocateUsPresentationController.prototype.fetchLocationDetailsSuccess = function(data) {
        if(Array.isArray(data)==false){
            data = this.parseLocations(data.rawResponse);
        }
        if (data && data.length > 0) {
            var details = data[0];
            locateUsPresentationScope.presentLocateUs({
                "getAtmorBranchDetailsSuccess": details
            });
        } else {
            locateUsPresentationScope.presentLocateUs({
                "getAtmorBranchDetailsFailure": "getAtmorBranchDetailsFailure"
            });
        }
    };
    /**
     * fetchLocationDetailsFailure : failure callback of fetchLocationDetails
     */
    LocateUsPresentationController.prototype.fetchLocationDetailsFailure = function() {
        locateUsPresentationScope.presentLocateUs({
            "getAtmorBranchDetailsFailure": "getAtmorBranchDetailsFailure"
        });
    };
    return LocateUsPresentationController;
});