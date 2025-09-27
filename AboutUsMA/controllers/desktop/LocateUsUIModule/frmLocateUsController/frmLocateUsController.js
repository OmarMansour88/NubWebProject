define(['FormControllerUtility', 'ViewConstants', 'CampaignUtility','OLBConstants'], function(FormControllerUtility, viewConstants, CampaignUtility,OLBConstants) {
    var orientationHandler = new OrientationHandler();
    return {
        locateUsViewModel: null,
        flag: true,
        mapView:true,
        /*
         *it updates the form ui
         *@param {Object} locateUsViewModel
         */
        updateFormUI: function(locateUsViewModel) {
            this.view.customheader.topmenu.flxaccounts.skin = "flxHoverSkinPointer";
            if (this.flag) {
                this.locateUsViewModel = locateUsViewModel.preLoginView;
                this.flag = false;
            }
            if (locateUsViewModel.ProgressBar) {
                if (locateUsViewModel.ProgressBar.show) {
                    FormControllerUtility.showProgressBar(this.view);
                } else {
                    FormControllerUtility.hideProgressBar(this.view);
                }
            }
            if (locateUsViewModel.preLoginView) {
                this.showPreLoginView();
            }
            if (locateUsViewModel.postLoginView) {
                this.showPostLoginView();
                CampaignUtility.fetchPopupCampaigns();
            }
            if (locateUsViewModel.locationListViewModel) {
                this.searchResultData = locateUsViewModel.locationListViewModel;
                this.updateSearchSegmentResult(locateUsViewModel.locationListViewModel);
                this.globalMapLat = this.presenter.globalLat;
                this.globalMapLong = this.presenter.globalLon;
                this.filterSearchData();
            }
            if (locateUsViewModel.getAtmorBranchDetailsSuccess) {
                this.getAtmOrBranchDetailsSuccessCallback(locateUsViewModel.getAtmorBranchDetailsSuccess);
            }
            if (locateUsViewModel.getAtmorBranchDetailsFailure) {
                this.getAtmOrBranchDetailsErrorCallback();
            }
            if (locateUsViewModel.getSearchBranchOrATMListSuccess) {
                this.getSearchBranchOrATMListSuccessCallback(locateUsViewModel.getSearchBranchOrATMListSuccess);
            }
            if (locateUsViewModel.getSearchBranchOrATMListFailure) {
                this.getSearchBranchOrATMListErrorCallback();
            }
            if (locateUsViewModel.getBranchOrATMListSuccess) {
                this.getBranchOrATMListSuccessCallback(locateUsViewModel.getBranchOrATMListSuccess);
            }
            if (locateUsViewModel.getBranchOrATMListFailure) {
                this.getBranchOrATMListErrorCallback();
            }
            if (locateUsViewModel.geoLocationError) {
                this.noSearchResultUI();
                this.view.LocateUs.lblNoSearchResults.text = kony.i18n.getLocalizedString("i18n.LocateUs.geolocationNoSearchData");
                FormControllerUtility.hideProgressBar(this.view);
            }
            if (locateUsViewModel.campaign) {
                CampaignUtility.showCampaign(locateUsViewModel.campaign, this.view, "flxContainer");
            }
            this.AdjustScreen();
        },
        /*
         * this is helper function to get the presentationcontroller of Locate Us
         */
        getLocateUsPresentationController: function() {
            var locateUsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName": "AboutUsMA","moduleName":"LocateUsUIModule"});
            if (locateUsModule) {
                return locateUsModule.presentationController;
            } else {
                return null;
            }
        },
        /**
         * it updates the hamburger
         */
        updateHamburgerMenu: function() {
            this.view.customheader.customhamburger.activateMenu("About Us", "Locate Us");
        },
        /**
         * it returns the current location data
         */
        getCurrentLocationData: function() {
            var presenter = this.getLocateUsPresentationController();
            return {
                "lat": this.globalMapLat,
                "lon": this.globalMapLong,
                "locationId": "",
                "showCallout": false,
                "calloutData": {
                    "lblBranchName": "",
                    "lblBranchAddressOneLine": "",
                    "lblBranchAddress2": "",
                    "lblOpen": "",
                    "lblClosed": "",
                    "imgGo": "",
                    "flxLocationDetails": {
                        "onClick": function() {},
                    },
                },
                "imgBuildingType": viewConstants.IMAGES.BANK_ICON,
                "imgGo": "",
                "imgIndicator": {
                    "src": viewConstants.IMAGES.ACCOUNTS_SIDEBAR_BLUE,
                    "isVisible": false,
                },
                "lblAddress": "",
                "lblClosed": "",
                "lblName": "",
                "lblOpen": "",
                "lblSeperator": " ",
                "flxSearchResults": {
                    "skin": viewConstants.SKINS.SKNFLEXF9F9F9,
                    "hoverSkin": viewConstants.SKINS.SKNSEGF9F9F9HOVER
                },
                "template": "flxSearchResults",
            };
        },
        /**
         * it bind the data to the map
         */
        bindMapData: function(data) {
            var scopeObj = this;
            var mapData = data;
            if (mapData.length > 1) {
                mapData = JSON.parse(JSON.stringify(data));
                mapData.map(function(dataItem) {
                    dataItem.calloutData.flxLocationDetails.onClick = function() {
                        scopeObj.view.LocateUs.mapLocateUs.dismissCallout();
                        scopeObj.onRowClickSegment(dataItem);
                        scopeObj.showBranchDetails();
                        scopeObj.pinToSegment(dataItem);
                    };
                    return dataItem;
                });
                mapData.push(this.getCurrentLocationData());
            }
            // this.view.LocateUs.flxMap.setVisibility(true);
            this.showMap();
            this.view.LocateUs.flxBranchDetails.setVisibility(false);
            this.view.LocateUs.flxHideMap.setVisibility(false);
            this.view.LocateUs.mapLocateUs.calloutTemplate = "flxDistanceDetails";
            this.view.LocateUs.mapLocateUs.zoomLevel = 15;
            this.view.LocateUs.mapLocateUs.widgetDataMapForCallout = {
                "lblBranchName": "lblBranchName",
                "lblBranchAddressOneLine": "lblBranchAddressOneLine",
                "lblBranchAddress2": "lblBranchAddress2",
                "lblOpen": "lblOpen",
                "lblClosed": "lblClosed",
                "imgGo": "imgGo",
                "flxLocationDetails": "flxLocationDetails",
            };
            this.view.LocateUs.mapLocateUs.locationData = mapData;
            this.gotoSearchLocation();
        },
        /**
         * it bind the search data to the segment
         */
        bindSearchSegmentData: function(data) {
            var scopeObj = this;
            scopeObj.searchResultUI();
            var segmentDataMap = {
                "flxDetails": "flxDetails",
                "flxDistanceAndGo": "flxDistanceAndGo",
                "flxIndicator": "flxIndicator",
                "flxSearchResults": "flxSearchResults",
                "imgBuildingType": "imgBuildingType",
                "imgGo": "imgGo",
                "imgIndicator": "imgIndicator",
                "lblAddress": "lblAddress",
                "lblClosed": "lblClosed",
                "lblName": "lblName",
                "lblOpen": "lblOpen",
                "lblSeperator": "lblSeperator"
            };
            this.view.LocateUs.segResults.widgetDataMap = segmentDataMap;
            this.view.LocateUs.segResults.setData(data);
        },
        
        parseLocations:function (data) {
        try {
            // Parse the JSON data
            let parsedData = JSON.parse(data);
            
            // Check if the "Locations" array exists in the parsed data
            if (parsedData.Locations) {
                return parsedData.Locations;
            } else {
                console.error("No 'Locations' array found in the data.");
                return [];
            }
        } catch (error) {
            console.error("Invalid JSON format:", error);
            return [];
        }
        },
        /**
         * update the seach data in segment
         * @param {Object} locationListViewModel
         */
        updateSearchSegmentResult: function(locationListViewModel) {
            var scopeObj = this;
            if(Array.isArray(locationListViewModel)==false){
                locationListViewModel = this.parseLocations(locationListViewModel.rawResponse);
            }
            if (locationListViewModel.length === 0 || locationListViewModel[0].latitude === null) {
                scopeObj.noSearchResultUI();
            } else {
                var data = locationListViewModel.map(function(dataItem) {
                    return {
                        "lat": dataItem.latitude,
                        "lon": dataItem.longitude,
                        "locationId": dataItem.locationId,
                        "showCallout": true,
                        "image": dataItem.type === "BRANCH" ? viewConstants.IMAGES.BANK_ICON_BLUE : viewConstants.IMAGES.ATM_ICON_BLUE,
                        "calloutData": {
                            "lblBranchName": dataItem.informationTitle,
                            "lblBranchAddressOneLine": dataItem.addressLine1,
                            "lblBranchAddress2": dataItem.addressLine2,
                            "lblOpen": {
                                "text": "Open",
                                "isVisible": dataItem.status === "OPEN" ? true : false
                            },
                            "lblClosed": {
                                "text": "Closed",
                                "isVisible": dataItem.status === "OPEN" ? false : true
                            },
                            "imgGo": {
                                "text": "Q"
                            },
                            "flxLocationDetails": {
                                "onClick": function() {
                                    scopeObj.view.LocateUs.mapLocateUs.dismissCallout();
                                    scopeObj.onRowClickSegment(dataItem);
                                    scopeObj.pinToSegment(dataItem);
                                    scopeObj.showBranchDetails();
                                }
                            }
                        },
                        "imgBuildingType": dataItem.type === "BRANCH" ? viewConstants.IMAGES.BANK_ICON : viewConstants.IMAGES.TRANSACTION_TYPE_WITHDRAWL,
                        "imgGo": {
                            "text": "Q"
                        },
                        "flxIndicator": {
                            "skin": viewConstants.SKINS.BLANK_SKIN_FLEX
                        },
                        "imgIndicator": {
                            "src": viewConstants.IMAGES.ACCOUNTS_SIDEBAR_BLUE,
                            "isVisible": false,
                        },
                        "lblAddress": dataItem.addressLine2,
                        "lblClosed": {
                            "text": "Closed",
                            "isVisible": dataItem.status === "OPEN" ? false : true
                        },
                        "lblName": dataItem.informationTitle,
                        "lblOpen": {
                            "text": "Open",
                            "isVisible": dataItem.status === "OPEN" ? true : false
                        },
                        "lblSeperator": " ",
                        "flxSearchResults": {
                            "skin": viewConstants.SKINS.SKNFLEXF9F9F9,
                            "hoverSkin": viewConstants.SKINS.SKNSEGF9F9F9HOVER
                        },
                        "template": "flxSearchResults",
                    };
                });
                this.bindSearchSegmentData(data);
                this.bindMapData(data);
            }
        },
        /**
         * post show locate us form
         */
        postShowLocateUs: function() {
            this.view.customheader.imgKony.setFocus(true);
            this.view.LocateUs.flxViewsAndFilters.setVisibility(false);
            this.showSearch();
            this.AdjustScreen();
            if (this.locateUsViewModel) {
                this.showPreLoginView();
            }
          if(kony.application.getCurrentBreakpoint() === 1024){
				this.view.flxFooter.left ="20dp";
            this.view.LocateUs.btnAll.left = "20dp";
			}
        },
        /**
         *UI Code to adjust screen
         */
      AdjustScreen: function() {
            var mainheight = 0;
            var screenheight = kony.os.deviceInfo().screenHeight;
            mainheight = this.view.customheader.frame.height + this.view.flxContainer.frame.height;
            var diff = screenheight - mainheight;
            if (mainheight < screenheight) {
                diff = diff - this.view.flxFooter.frame.height;
                if (diff > 0) {
					if(kony.application.getCurrentBreakpoint() === 1024){
						this.view.flxFooter.top = mainheight + diff - 250 + "dp";
					}else{
					this.view.flxFooter.top = mainheight + diff + 250 + "dp";
					}
				}
                else this.view.flxFooter.top = mainheight + "dp";
            } else {
                this.view.flxFooter.top = mainheight + "dp";
            }
            this.initializeResponsiveViews();
            this.view.forceLayout();
        },
        /**
         * it shows the single pin which represents current location
         */
        showNoMapPins: function() {
            var scopeObj = this;
            if (!this.globalMapLat) {
                var presenter = this.getLocateUsPresentationController();
                this.globalMapLat = presenter.globalLat;
                this.globalMapLong = presenter.globalLon;
            }
            var locationData = {
                lat: scopeObj.globalMapLat,
                lon: scopeObj.globalMapLong,
                showCallout: false
            };
            //this.view.LocateUs.mapLocateUs.navigateToLocation(locationData, false, false);
            var data = [];
            data.push(locationData);
            this.bindMapData(data);
        },
        //Added as per the bug ARB-11205
        gotoSearchLocation: function() {
            if (this.searchResultData && this.searchResultData.length > 0) {
                this.view.LocateUs.mapLocateUs.zoomLevel = 5;
                this.view.LocateUs.mapLocateUs.navigateToLocation({
                    lat: this.searchResultData[0].latitude,
                    lon: this.searchResultData[0].longitude
                }, false, false);
                this.view.forceLayout();
            }
        },
        /**
         * to navigate the map to current location
         */
        gotoCurrentLocation: function() {
            this.view.LocateUs.mapLocateUs.zoomLevel = 15;
            var presenter = this.getLocateUsPresentationController();
            this.view.LocateUs.mapLocateUs.navigateToLocation({
                lat: presenter.globalLat,
                lon: presenter.globalLon
            }, false, false);
            this.view.forceLayout();
        },
        processServices: function(data) {
            if (data) {
                data = data.split("||");
                this.view.LocateUs.lblService1.text = "";
                this.view.LocateUs.lblService2.text = "";
                this.view.LocateUs.lblService3.text = "";
                this.view.LocateUs.lblService4.text = "";
                this.view.LocateUs.flxService1.isVisible = data[0] ? true : false;
                this.view.LocateUs.flxService2.isVisible = data[1] ? true : false;
                this.view.LocateUs.flxService3.isVisible = data[2] ? true : false;
                this.view.LocateUs.flxService4.isVisible = data[3] ? true : false;
              if(kony.application.getCurrentBreakpoint() ===640){
				if(this.view.LocateUs.flxService1.isVisible &&  this.view.LocateUs.flxService2.isVisible && this.view.LocateUs.flxService3.isVisible &&  this.view.LocateUs.flxService4.isVisible) {
					this.view.LocateUs.flxBranchTimingsAndServices.height = "390dp";
				}else if(this.view.LocateUs.flxService1.isVisible){
					this.view.LocateUs.flxBranchTimingsAndServices.height = "295dp";
				}else if(this.view.LocateUs.flxService2.isVisible){
					this.view.LocateUs.flxBranchTimingsAndServices.height = "320dp";
				}else if(this.view.LocateUs.flxService3.isVisible){
					this.view.LocateUs.flxBranchTimingsAndServices.height = "345dp";
				}
				}
                try {
                    this.view.LocateUs.lblService1.text = data[0].trim();
                    this.view.LocateUs.lblService2.text = data[1].trim();
                    this.view.LocateUs.lblService3.text = data[2].trim();
                    this.view.LocateUs.lblService4.text = data[3].trim();
                } catch (ex) {}
            } else {
                this.view.LocateUs.flxService1.isVisible = false;
                this.view.LocateUs.flxService2.isVisible = false;
                this.view.LocateUs.flxService3.isVisible = false;
                this.view.LocateUs.flxService4.isVisible = false;
            }
        },
        responsiveViews: {},
        initializeResponsiveViews: function() {
            this.responsiveViews["flxMap"] = this.isViewVisible("flxMap");
            this.responsiveViews["flxBranchDetails"] = this.isViewVisible("flxBranchDetails");
            this.responsiveViews["flxDirections"] = this.isViewVisible("flxDirections");
        },
        isViewVisible: function(container) {
            if (this.view.LocateUs[container].isVisible) {
                return true;
            } else {
                return false;
            }
        },
        orientationHandler: null,
        onBreakPointChange2: function(width) {
            kony.print("onBreakPoint change called");
            var scope = this;
            this.view.CustomPopup.onBreakpointChangeComponent(scope.view.CustomPopup, width);
            orientationHandler.onOrientationChange(this.onBreakPointChange2);
            this.view.customheader.onBreakpointChangeComponent(width);
            this.setupFormOnTouchEnd(width);
            var screenHeight = kony.os.deviceInfo().screenHeight;
            this.view.LocateUs.lblNoSearchResults.text = kony.i18n.getLocalizedString('i18n.LocateUs.NosearchresultfoundPleasechangethesearchcriteria');
            if (width === 640 || orientationHandler.isMobile) {
                this.view.LocateUs.flxTabs.skin = "sknFlxffffffShadowdddcdcnoradius";
                this.view.LocateUs.flxSearchBox.skin = "sknFlxf7f7f7";
                this.view.LocateUs.flxSearchBar.skin = "sknFlxffffffBorderE8E9EB";
               this.view.flxFormContent.top = "51dp";
                this.view.flxMapAndListButtons.isVisible = true;
                this.view.LocateUs.flxLeft.setVisibility(true);
                this.view.LocateUs.flxRight.setVisibility(true);
                // this.view.LocateUs.flxRight.height="820dp";
                //this.view.LocateUs.flxLeft.height="preferred";
                this.view.LocateUs.flxLocateUsWrapper.height = (screenHeight - 51) + "px";
                this.view.LocateUs.height = (screenHeight - 51) + "px";
                this.view.LocateUs.flxMap.height = (screenHeight - 51) + "px";
                this.view.LocateUs.flxHideMap.height = (screenHeight - 51) + "px";
                this.view.flxShareDirection.height = (screenHeight - 51) + "px";
                this.view.LocateUs.flxEmptySpace.height = screenHeight - 51 - this.view.LocateUs.flxSearchBox.frame.height + "px" //screenHeight-header-searchbox
                this.view.LocateUs.segResults.height = screenHeight - 80 - 51 - this.view.LocateUs.flxSearchBox.frame.height - 30 + "px"; //screenHeight--header-searchbox-searchbox.Top
                this.view.LocateUs.flxSearch.height = (screenHeight - 51 - 30) + "px";
                // this.view.flxLocateUsWrapper.width = "100%"; //setting from ctrl as it is not reflecting in build if changed in viz
                this.view.flxLocateUsWrapper.top = "0px";
                this.view.flxLocateUsWrapper.left = "0px";
                //this.view.flxLocateUsWrapper.height="preffered";
                this.view.flxHeader.zIndex = 2005;
                this.view.flxContainer.zIndex = 3;
                this.view.flxLoading.zIndex = 2007;
                this.view.flxLogout.zIndex = 2006;
                this.view.flxMapAndListButtons.zIndex = 2004;
                this.showViews = function(views) {
                    if (views.length === 1) {
                        if (views[0] === "flxHideMap") {
                            return;
                        }
                        this.view.flxMapAndListButtons.setVisibility(false);
                        this.view.LocateUs.flxSearch.setVisibility(false);
                        this.view.LocateUs.flxViewsAndFilters.setVisibility(false);
                        this.view.LocateUs.flxDirections.setVisibility(false);
                        this.view.LocateUs.flxMap.setVisibility(false);
                        this.view.LocateUs.flxBranchDetails.setVisibility(false);
                        this.view.LocateUs.flxHideMap.setVisibility(false);
                        this.view.LocateUs.flxTabs.setVisibility(false);
                        if (views[0] === "flxSearch") {
                            var screenHeight = kony.os.deviceInfo().screenHeight;
                            this.view.LocateUs.flxContents.height = (screenHeight - 51) + "px";
                            this.view.LocateUs.flxTabs.setVisibility(true);
                            this.view.LocateUs.flxMap.setVisibility(false);
                            this.view.LocateUs.flxSearch.setVisibility(true);
                            this.view.flxMapAndListButtons.setVisibility(true);
                            this.view.LocateUs.forceLayout();
                            // this.view.LocateUs.segResults.height = this.view.LocateUs.flxSearch.frame.height - this.view.LocateUs.flxSearchBox.frame.height - 80 + "px";
                        } else if (views[0] === "flxMap") {
                            this.view.LocateUs.flxTabs.setVisibility(true);
                            this.view.LocateUs.flxSearch.setVisibility(true);
                            this.view.LocateUs.flxEmptySpace.setVisibility(false);
                            this.view.flxMapAndListButtons.setVisibility(true);
                            this.view.LocateUs.forceLayout();
                            this.view.LocateUs.segResults.setVisibility(false);
                        }
                        if (views[0] === "flxSearch" || views[0] === "flxViewsAndFilters" || views[0] === "flxDirections") {
                            var screenHeight = kony.os.deviceInfo().screenHeight;
                            this.view.LocateUs.flxLeft.height = (screenHeight - 51) + "px";
                        } else {
                            //  this.view.LocateUs.flxLeft.height ="preferred";
                        }
                    }
                    for (var i = 0; i < views.length; i++) {
                        this.view.LocateUs[views[i]].isVisible = true;
                    }
                    this.view.LocateUs.forceLayout();
                };
            } else {
                kony.print("default function set");
                this.view.flxMapAndListButtons.isVisible = false;
                this.view.LocateUs.flxLocateUsWrapper.height = "650px";
                this.view.flxLocateUsWrapper.height = "650dp";
                //this.view.flxLocateUsWrapper.width = "87.85%";
                //this.view.flxLocateUsWrapper.left = "6.08%";
                this.view.flxLocateUsWrapper.top = "68px";
                this.view.LocateUs.segResults.height = "495px";
                //To do: This needs to be updated when "views & filters" functionality is implemented to fix the height of segment - UI
                //this.view.LocateUs.segResults.height=600-this.view.LocateUs.flxSearchBox.frame.height+"px";
                this.showViews = function(views) {
                    this.view.LocateUs.flxLocateUsWrapper.height = "650px";
                    this.view.flxLocateUsWrapper.height = "650dp";
                    // this.view.flxLocateUsWrapper.width = "87.85%";
                    // this.view.flxLocateUsWrapper.left = "6.08%";
                    this.view.flxLocateUsWrapper.top = "68px";
                    this.view.LocateUs.height = "650px";
                    this.view.LocateUs.flxLocateUsWrapper.height = "650px";
                    this.view.LocateUs.flxContents.height = "650px";
                    // this.view.LocateUs.flxLeft.height="650px";
                    this.view.LocateUs.flxRight.height = "650px";
                    this.view.LocateUs.flxSearch.height = "600px";
                    this.view.LocateUs.flxDirections.height = "650px";
                    this.view.LocateUs.flxMap.height = "650px";
                    this.view.LocateUs.flxBranchDetails.height = "650px";
                    this.view.LocateUs.flxHideMap.height = "650px";
                    this.view.LocateUs.segResults.height = "495px";
                    //To do: This needs to be updated when "views & filters" functionality is implemented to fix the height of segment - UI
                    //this.view.LocateUs.segResults.height=600-this.view.LocateUs.flxSearchBox.frame.height+"px";
                    if (views.length === 1) {
                        if (views[0] === "flxSearch" || views[0] === "flxViewsAndFilters" || views[0] === "flxDirections") {
                            this.view.LocateUs.flxSearch.setVisibility(false);
                            this.view.LocateUs.flxViewsAndFilters.setVisibility(false);
                            this.view.LocateUs.flxDirections.setVisibility(false);
                            if (views[0] === "flxSearch") {
                                this.view.LocateUs.flxTabs.setVisibility(true);
                            } else {
                                this.view.LocateUs.flxTabs.setVisibility(false);
                            }
                        } else {
                            this.view.LocateUs.flxMap.setVisibility(false);
                            this.view.LocateUs.flxBranchDetails.setVisibility(false);
                            this.view.LocateUs.flxHideMap.setVisibility(false);
                        }
                    }
                    for (var i = 0; i < views.length; i++) {
                        this.view.LocateUs[views[i]].isVisible = true;
                    }
                    this.view.LocateUs.forceLayout();
                };

            }
            var tempViews = Object.keys(this.responsiveViews);
            tempViews.forEach(function(e) {
                scope.view.LocateUs[e].isVisible = scope.responsiveViews[e];
            });
            this.AdjustScreen();
        },
        setupFormOnTouchEnd: function(width) {
            if (width == 640) {
                this.view.onTouchEnd = function() {}
                this.nullifyPopupOnTouchStart();
            } else {
                if (width == 1024) {
                    this.view.onTouchEnd = function() {}
                    this.nullifyPopupOnTouchStart();
                } else {
                    this.view.onTouchEnd = function() {
                        hidePopups();
                    }
                }
                var userAgent = kony.os.deviceInfo().userAgent;
                if (userAgent.indexOf("iPad") != -1) {
                    this.view.onTouchEnd = function() {}
                    this.nullifyPopupOnTouchStart();
                } else if (userAgent.indexOf("Android") != -1 && userAgent.indexOf("Mobile") == -1) {
                    this.view.onTouchEnd = function() {}
                    this.nullifyPopupOnTouchStart();
                }
            }
        },
        nullifyPopupOnTouchStart: function() {},
        showViews: function(views) {
            this.view.LocateUs.flxRight.height = "650px";
            this.view.LocateUs.height = "700px";
            if (views.length === 1) {
                if (views[0] === "flxSearch" || views[0] === "flxViewsAndFilters" || views[0] === "flxDirections") {
                    this.view.LocateUs.flxSearch.setVisibility(false);
                    this.view.LocateUs.flxViewsAndFilters.setVisibility(false);
                    this.view.LocateUs.flxDirections.setVisibility(false);
                    if (views[0] === "flxSearch") {
                        this.view.LocateUs.flxTabs.setVisibility(true);
                    } else {
                        this.view.LocateUs.flxTabs.setVisibility(false);
                    }
                } else {
                    this.view.LocateUs.flxMap.setVisibility(false);
                    this.view.LocateUs.flxBranchDetails.setVisibility(false);
                    this.view.LocateUs.flxHideMap.setVisibility(false);
                }
            }
            for (var i = 0; i < views.length; i++) {
                this.view.LocateUs[views[i]].isVisible = true;
            }
            this.view.LocateUs.forceLayout();
        },
        /**
         *it shows prelogin view
         */
        showPreLoginView: function() {
           this.view.flxFormContent.top = "70dp";
            this.view.customheader.lblHeaderMobile.text = "Locate Us";
            this.view.lblLoginMobile.text = kony.i18n.getLocalizedString("i18n.common.login");
            this.view.flxLoginMobile.isVisible = false;
            if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
               this.view.flxFormContent.top = "51dp";
                this.view.flxLoginMobile.isVisible = true;
                this.view.flxLoginMobile.onClick = function() {
                    var authModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName": "AuthenticationMA","moduleName":"AuthUIModule"});
                    authModule.presentationController.showLoginScreen();
                };
            }
            this.view.customheader.showPreLoginView();
            this.view.customheader.headermenu.btnLogout.onClick = function() {
                var authModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName": "AuthenticationMA","moduleName":"AuthUIModule"});
                authModule.presentationController.showLoginScreen();
            };
            this.view.customheader.imgKony.onTouchEnd = function() {
                var authModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName": "AuthenticationMA","moduleName":"AuthUIModule"});
                authModule.presentationController.showLoginScreen();
            };
            this.view.LocateUs.segResults.setData([]);
            this.view.LocateUs.mapLocateUs.locationData = [];
            this.clearAll();
            this.segSetFilters();
            this.selectedView = "ALL";
            this.view.LocateUs.lblViewType.text = kony.i18n.getLocalizedString("i18n.locateus.view") + ": " + kony.i18n.getLocalizedString("i18n.locateus.Branches&Atms");
            this.selectRadioButton(this.view.LocateUs.imgRadioButtonAll);
            this.viewText = this.view.LocateUs.lblViewType.text;
            this.view.LocateUs.btnClearAll.setVisibility(false);
            this.searchTextClearAndRefresh();
            this.view.flxseperator.setVisibility(false);
            this.view.LocateUs.forceLayout();
            var scopeObj = this;
            scopeObj.selectedView = "ALL";
            scopeObj.view.LocateUs.lblViewType.text = kony.i18n.getLocalizedString("i18n.locateus.view") + ": " + kony.i18n.getLocalizedString("i18n.locateus.Branches&Atms");
            scopeObj.view.LocateUs.btnBranch.skin = viewConstants.SKINS.TAB_INACTIVE;
            scopeObj.view.LocateUs.btnAll.skin = viewConstants.SKINS.TAB_ACTIVE;
            scopeObj.view.LocateUs.btnATM.skin = viewConstants.SKINS.TAB_INACTIVE;
//             scopeObj.view.LocateUs.btnATM.hoverSkin = viewConstants.SKINS.TAB_HOVER;
//             scopeObj.view.LocateUs.btnAll.hoverSkin = viewConstants.SKINS.TAB_HOVER;
//             scopeObj.view.LocateUs.btnBranch.hoverSkin = viewConstants.SKINS.TAB_HOVER;
        },
        /**
         *it shows post login views
         */
        showPostLoginView: function() {
            var self = this;
            applicationManager.getLoggerManager().setCustomMetrics(this, false, "Locations");
            if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
               this.view.flxFormContent.top = "50dp";
            } else {
                this.view.customheader.lblHeaderMobile.setVisibility(false);
               this.view.flxFormContent.top = "120dp";
            }
            this.view.LocateUs.segResults.setData([]);
            this.view.LocateUs.mapLocateUs.locationData = [];
            this.view.customheader.showPostLoginView();
            this.view.customheader.headermenu.btnLogout.onClick = function() {
                self.view.flxLogout.setVisibility(true);
                self.view.CustomPopup.lblHeading.text = kony.i18n.getLocalizedString("i18n.common.logout");
                self.view.CustomPopup.lblPopupMessage.text = kony.i18n.getLocalizedString("i18n.common.LogoutMsg");
                var height = self.view.flxHeader.frame.height + self.view.flxContainer.frame.height + self.view.flxFooter.frame.height;
                self.view.flxLogout.height = height + kony.os.deviceInfo().screenHeight + "dp";
                self.view.flxLogout.left = "0%";
            };
            this.view.CustomPopup.btnYes.onClick = function() {
                var authModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName": "AuthenticationMA","moduleName":"AuthUIModule"});
                var context = {
                    "action": "Logout"
                };
                authModule.presentationController.doLogout(context);
                self.view.flxLogout.setVisibility(false);
                self.view.flxLogout.left = "-100%";
            };
            this.view.CustomPopup.btnNo.onClick = function() {
                self.view.flxLogout.setVisibility(false);
                self.view.flxLogout.left = "-100%";
            };
            this.view.CustomPopup.flxCross.onClick = function() {
                self.view.flxLogout.setVisibility(false);
                self.view.flxLogout.left = "-100%";
            };
            this.clearAll();
            this.segSetFilters();
            this.selectedView = "ALL";
            this.view.LocateUs.lblViewType.text = kony.i18n.getLocalizedString("i18n.locateus.view") + ": " + kony.i18n.getLocalizedString("i18n.locateus.Branches&Atms");
            this.selectRadioButton(this.view.LocateUs.imgRadioButtonAll);
            this.viewText = this.view.LocateUs.lblViewType.text;
            this.view.LocateUs.btnClearAll.setVisibility(false);
            this.searchTextClearAndRefresh();
            this.view.LocateUs.forceLayout();
            this.viewText = this.view.LocateUs.lblViewType.text;
            var scopeObj = this;
            scopeObj.selectedView = "ALL";
            scopeObj.view.LocateUs.lblViewType.text = kony.i18n.getLocalizedString("i18n.locateus.view") + ": " + kony.i18n.getLocalizedString("i18n.locateus.Branches&Atms");
            scopeObj.view.LocateUs.btnBranch.skin = viewConstants.SKINS.TAB_INACTIVE;
            scopeObj.view.LocateUs.btnAll.skin = viewConstants.SKINS.TAB_ACTIVE;
            scopeObj.view.LocateUs.btnATM.skin = viewConstants.SKINS.TAB_INACTIVE;
//             scopeObj.view.LocateUs.btnATM.hoverSkin = viewConstants.SKINS.TAB_HOVER;
//             scopeObj.view.LocateUs.btnAll.hoverSkin = viewConstants.SKINS.TAB_HOVER;
//             scopeObj.view.LocateUs.btnBranch.hoverSkin = viewConstants.SKINS.TAB_HOVER;
            this.view.flxLoginMobile.setVisibility(false);
        },
        /**
         * success callback of getBrachOrATMList
         */
        getBranchOrATMListSuccessCallback: function(data) {
            this.searchResultData = data;
            this.updateSearchSegmentResult(data);
            var presenter = this.getLocateUsPresentationController();
            this.globalMapLat = presenter.globalLat;
            this.globalMapLong = presenter.globalLon;
            this.filterSearchData();
            FormControllerUtility.hideProgressBar(this.view);
            this.view.LocateUs.forceLayout();
        },
        /**
         *failure callback
         */
        getBranchOrATMListErrorCallback: function() {
            this.noSearchResultUI();
            FormControllerUtility.hideProgressBar(this.view);
            this.view.LocateUs.forceLayout();
        },
        showSearch: function() {
            // this.setFilters();
            this.segSetFilters();
            this.showViews(["flxSearch"]);
            this.mapView = false;
        },
        showViewsAndFilters: function() {
            this.showViews(["flxViewsAndFilters"]);
            this.showHideMap();
        },
        /**
         * to show directions
         */
        showDirections: function() {
            this.showViews(["flxDirections"]);
        },
        /**
         * to show map
         */
        showMap: function() {
            this.showViews(["flxMap"]);
            this.view.flxButtonsWrapper.skin = "sknflxGradientffffff0273e3";
          	this.view.lblListViewIcon.skin = "sknlblfonticon17px0273e3";
            this.view.lblListView.skin = "sknLabelSSP0273e315px";
            this.view.lblMapView.skin = "sknSSPLblFFFFFF15Px";
            this.view.lblMapViewIcon.skin = "sknLblFontIconsffffff17px";
            this.mapView = true;
        },
        /**
         * to show brach details
         */
        showBranchDetails: function() {
            if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile)
                this.view.LocateUs.flxLeft.zIndex = 1;
            var scopeObj = this;
            scopeObj.showViews(["flxBranchDetails"]);
        },
        showHideMap: function() {
            this.showViews(["flxHideMap"]);
        },
        showRedoSearch: function(boolValue) {
            if (this.view.LocateUs.flxRedoSearch.isVisible !== boolValue) {
                this.view.LocateUs.flxRedoSearch.isVisible = boolValue;
            }
        },
        removeFilter2: function(filterNum) {
            var lblName = "lblFilterName" + filterNum;
            var cancelBtnName = "flxCancelFilter" + filterNum;
            this.view.LocateUs[lblName].setVisibility(false);
            this.view.LocateUs[cancelBtnName].setVisibility(false);
        },
        selectRadioButton: function(imgRadio) {
            this.view.LocateUs.imgRadioButtonAll.src = viewConstants.IMAGES.ICON_RADIOBTN;
            this.view.LocateUs.imgRadioButtonBranch.src = viewConstants.IMAGES.ICON_RADIOBTN;
            this.view.LocateUs.imgRadioButtonAtm.src = viewConstants.IMAGES.ICON_RADIOBTN;
            imgRadio.src = viewConstants.IMAGES.RADIO_BUTTON_ACTIVE;
        },
        toggleCheckBox: function(imgCheckBox) {
            var data = this.view.LocateUs.segViewsAndFilters.data;
            if (imgCheckBox.src === viewConstants.IMAGES.UNCHECKED_IMAGE) {
                imgCheckBox.src = viewConstants.IMAGES.CHECKED_IMAGE;
            } else {
                imgCheckBox.src = viewConstants.IMAGES.UNCHECKED_IMAGE;
            }
            this.view.LocateUs.segViewsAndFilters.setData(data);
        },
        SegRemoveFilter: function(a) {
            var data = this.view.LocateUs.segViewsAndFilters.data;
            data[a].lblCheckbox.text = viewConstants.FONT_ICONS.CHECBOX_UNSELECTED;
            this.view.LocateUs.segViewsAndFilters.setData(data);
        },
        clearAll: function() {
            var data = this.view.LocateUs.segViewsAndFilters.data;
            for (var i = 0; i < data.length; i++) {
                data[i].lblCheckbox.text = viewConstants.FONT_ICONS.CHECBOX_UNSELECTED;
            }
            this.view.LocateUs.segViewsAndFilters.setData(data);
        },
        showShareDirection: function() {
            this.view.flxShareDirection.setVisibility(true);
        },
        showTextbox: function() {
            if (this.view.lbxSendMapTo.selectedKey !== "key1") {
                this.view.tbxSendMapTo.setVisibility(true);
                this.view.btnShareSend.skin = viewConstants.SKINS.LOCATE_BUTTONSHARESEND;
                this.view.btnShareCancel.skin = viewConstants.SKINS.LOCATE_BTNSHARECANCEL;
            } else {
                this.view.tbxSendMapTo.setVisibility(false);
                this.view.btnShareSend.skin = viewConstants.SKINS.LOCATE_BTNSHARESEND;
                //this.view.btnShareCancel.skin="sknBtnffffffBorder3343a81pxRadius2px";
            }
        },
        hideShareDirection: function() {
            this.view.flxShareDirection.setVisibility(false);
        },
        changeResultsRowSkin: function() {
            var index = this.view.LocateUs.segResults.selectedRowIndex;
            var rowIndex = index[1];
            var data = this.view.LocateUs.segResults.data;
            for (var i = 0; i < data.length; i++) {
                data[i].flxSearchResults.skin = viewConstants.SKINS.SKNFLXFFFFFFBORDER0;
                data[i].flxIndicator.skin = viewConstants.SKINS.BLANK_SKIN_FLEX;
                // data[i].imgIndicator.isVisible = false;
            }
            data[rowIndex].flxSearchResults.skin = viewConstants.SKINS.SKNFLEXF9F9F9;
            data[rowIndex].flxIndicator.skin = viewConstants.SKINS.PFM_LBLIDENTIFIER;
            // data[rowIndex].imgIndicator.isVisible = true;
            this.view.LocateUs.segResults.setData(data);
            this.view.forceLayout();
            if (kony.application.getCurrentBreakpoint() != 640 || !orientationHandler.isMobile)
                this.view.LocateUs.segResults.selectedRowIndex = [0, rowIndex];
        },
        //preshow
        locateUsPreshow: function() {
           FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxContainer', 'flxMain','customheader', 'flxFooter', 'LocateUs.flxSearchBox', 'flxHeader','flxFormContent']);
            this.view.LocateUs.mapLocateUs.mapKey = OLBConstants.CLIENT_PROPERTIES["CLIENT_MAP_KEY"];//applicationManager.getConfigurationManager().mapKey;
            this.view.flxButtonsWrapper.skin = "sknflxGradientffffff0273e3"
            this.setFlowActions();
            this.setDirectionsSegmentData();
            this.setViewsAndFilterSegmentData();
            this.segSetFilters();
            this.view.customheader.forceCloseHamburger();
            this.selectedViewOnApply = this.view.LocateUs.imgRadioButtonAll;
            this.selectedServicesList = [];
            this.view.LocateUs.lblViewType.text = kony.i18n.getLocalizedString("i18n.locateus.view") + ": " + kony.i18n.getLocalizedString("i18n.locateus.Branches&Atms");
            this.initializationForFirstCancel();
            this.view.LocateUs.tbxSearchBox.text = "";
            this.view.LocateUs.flxTabs.setVisibility(true);
            this.view.LocateUs.flxRadioButtons.setVisibility(false);
            this.updateHamburgerMenu();
            var currBreakpoint = kony.application.getCurrentBreakpoint();
            if (currBreakpoint === 640) {
                this.view.flxMapAndListButtons.top = "805px"
            }
            var scopeObj = this;
            scopeObj.selectedView = "ALL";
            scopeObj.view.LocateUs.lblViewType.text = kony.i18n.getLocalizedString("i18n.locateus.view") + ": " + kony.i18n.getLocalizedString("i18n.locateus.Branches&Atms");
            scopeObj.view.LocateUs.btnBranch.skin = viewConstants.SKINS.TAB_INACTIVE;
            scopeObj.view.LocateUs.btnAll.skin = viewConstants.SKINS.TAB_ACTIVE;
            scopeObj.view.LocateUs.btnATM.skin = viewConstants.SKINS.TAB_INACTIVE;
            applicationManager.getNavigationManager().applyUpdates(this);
            this.view.LocateUs.tbxSearchBox.onKeyUp = this.toggleCrossSearch;
            this.view.customheader.topmenu.flxaccounts.skin = "flxHoverSkinPointer";
        },
        toggleCrossSearch: function() {
            this.view.LocateUs.flxCloseIcon.setVisibility(this.view.LocateUs.tbxSearchBox.text.length > 0);
            this.view.LocateUs.flxSearch.forceLayout();
        },
        initializationForFirstCancel: function() {
            this.selectedView = "ALL";
            this.selectRadioButton(this.view.LocateUs.imgRadioButtonAll);
            this.viewText = this.view.LocateUs.lblViewType.text;
            this.prevData = ["D", "D", "D", "D", "D"];
        },
        segSetFilters: function() {
            var i;
            var scopeObj = this;
            var filterlblWidget;
            var filterCloseBtn;
            var filterNum = 1;
            this.selectedServicesList = [];
            scopeObj.prevData = [];
            var data = this.view.LocateUs.segViewsAndFilters.data;
            var l = data.length;
            for (i = 0; i < l; i++) {
                scopeObj.prevData.push(data[i].lblCheckbox.text);
                if (data[i].lblCheckbox.text === viewConstants.FONT_ICONS.CHECBOX_SELECTED) {
                    filterlblWidget = "lblFilterName" + filterNum;
                    filterCloseBtn = "flxCancelFilter" + filterNum;
                    var lbl = data[i].lblOption;
                    this.selectedServicesList.push(lbl);
                    this.view.LocateUs[filterlblWidget].text = lbl;
                    this.view.LocateUs[filterlblWidget].setVisibility(true);
                    this.view.LocateUs[filterCloseBtn].setVisibility(true);
                    filterNum++;
                }
            }
            if (filterNum > 1) {
                this.view.LocateUs.btnClearAll.setVisibility(true);
            }
            if (filterNum === 1) {
                this.view.LocateUs.flxFilters.height = "0dp";
                this.view.LocateUs.btnClearAll.setVisibility(false);
            }
            if (filterNum === 2 || filterNum === 3) {
                this.view.LocateUs.flxFilters.height = "42dp";
                this.view.LocateUs.btnClearAll.top = "120dp";
            }
            if (filterNum === 4 || filterNum === 5) {
                this.view.LocateUs.flxFilters.height = "74dp";
                this.view.LocateUs.btnClearAll.top = "150dp";
            }
            if (filterNum === 6) {
                this.view.LocateUs.flxFilters.height = "104dp";
                this.view.LocateUs.btnClearAll.top = "170dp";
            }
            for (i = filterNum; i < 6; i++) {
                filterlblWidget = "lblFilterName" + i;
                filterCloseBtn = "flxCancelFilter" + i;
                this.view.LocateUs[filterlblWidget].setVisibility(false);
                this.view.LocateUs[filterCloseBtn].setVisibility(false);
            }
            this.view.LocateUs.flxFilters.setVisibility(true);
        },
        removeFilter: function(filterName) {
            var scopeObj = this;
            var data = this.view.LocateUs.segViewsAndFilters.data;
            for (var i = 0; i < data.length; i++) {
                if (data[i].lblOption === filterName) {
                    scopeObj.SegRemoveFilter(i);
                    break;
                }
            }
            scopeObj.segSetFilters();
            scopeObj.filterSearchData();
        },
        //flow actions
        setFlowActions: function() {
            var scopeObj = this;
            this.view.onBreakpointChange = function() {
                scopeObj.onBreakPointChange2(kony.application.getCurrentBreakpoint());
            };
            this.view.LocateUs.flxSearchImage.onClick = function() {
                scopeObj.performSearch();
            };
            this.view.LocateUs.flxCloseIcon.onTouchEnd = function() {
                scopeObj.view.LocateUs.tbxSearchBox.text = "";
                scopeObj.view.LocateUs.flxCloseIcon.setVisibility(false);
                var presenter = scopeObj.getLocateUsPresentationController();
                presenter.getBranchOrATMList();
            };
            this.view.LocateUs.tbxSearchBox.onDone = function() {
                scopeObj.performSearch();
            };
            this.view.LocateUs.imgMyLocation.onTouchEnd = function() {
                scopeObj.gotoCurrentLocation();
            };
            this.view.LocateUs.segResults.onRowClick = function(obj) {
                scopeObj.onRowClickSegment(obj.selectedRowItems[0]);
                scopeObj.showBranchDetails();
                scopeObj.changeResultsRowSkin();
                if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
                    scopeObj.view.LocateUs.flxRight.setVisibility(true);
                }
            };
            this.view.LocateUs.flxViewAndFilters.onClick = function() {
                if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
                    scopeObj.showViewsAndFilters();
                    scopeObj.view.LocateUs.flxLeft.zIndex = 2;
                    scopeObj.view.forceLayout();
                    return;
                }
                scopeObj.showViewsAndFilters();
                scopeObj.showMap();
                scopeObj.view.LocateUs.flxHideMap.setVisibility(true);
                // scopeObj.setViewsAndFilterSegmentData();
            };
            this.view.LocateUs.flxRedoSearch.onClick = function() {
                scopeObj.showRedoSearch(false);
            };
            this.view.LocateUs.flxViewsAndFiltersClose.onClick = function() {
                if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
                    scopeObj.view.LocateUs.flxLeft.zIndex = 1;
                    if(scopeObj.mapView){
                      scopeObj.showSearch();
                      scopeObj.view.LocateUs.flxMap.setVisibility(true);
                    }
                    else
                      scopeObj.showSearch();
                    scopeObj.view.forceLayout();
                    return;
                }
                scopeObj.cancelFilters();
                scopeObj.showSearch();
                scopeObj.showMap();
                scopeObj.view.LocateUs.flxHideMap.setVisibility(false);
            };
            this.view.LocateUs.btnCancelFilters.onClick = function() {
                scopeObj.cancelFilters();
                scopeObj.view.LocateUs.flxHideMap.setVisibility(false);
                scopeObj.view.LocateUs.flxLeft.zIndex = 2;
                scopeObj.view.forceLayout();
            };
            this.view.LocateUs.btnApplyFilters.onClick = function() {
                scopeObj.applyFilters();
                scopeObj.view.LocateUs.flxHideMap.setVisibility(false);
            };
            this.view.LocateUs.imgCheckBox1.onTouchEnd = function() {
                scopeObj.toggleCheckBox(scopeObj.view.LocateUs.imgCheckBox1);
            };
            this.view.LocateUs.imgCheckBox2.onTouchEnd = function() {
                scopeObj.toggleCheckBox(scopeObj.view.LocateUs.imgCheckBox2);
            };
            this.view.LocateUs.imgCheckBox3.onTouchEnd = function() {
                scopeObj.toggleCheckBox(scopeObj.view.LocateUs.imgCheckBox3);
            };
            this.view.LocateUs.imgCheckBox4.onTouchEnd = function() {
                scopeObj.toggleCheckBox(scopeObj.view.LocateUs.imgCheckBox4);
            };
            this.view.LocateUs.imgCheckBox5.onTouchEnd = function() {
                scopeObj.toggleCheckBox(scopeObj.view.LocateUs.imgCheckBox5);
            };
            this.view.LocateUs.btnATM.onClick = function() {
                scopeObj.selectedView = "ATM";
                scopeObj.view.LocateUs.lblViewType.text = kony.i18n.getLocalizedString("i18n.locateus.view") + ": " + kony.i18n.getLocalizedString("i18n.locateus.OnlyAtm");
                scopeObj.view.LocateUs.btnBranch.skin = viewConstants.SKINS.TAB_INACTIVE;
                scopeObj.view.LocateUs.btnAll.skin = viewConstants.SKINS.TAB_INACTIVE;
                scopeObj.view.LocateUs.btnATM.skin = viewConstants.SKINS.TAB_ACTIVE;
                var searchText = scopeObj.view.LocateUs.tbxSearchBox.text.trim();
                if (searchText !== null && searchText !== '' && searchText.length > 0) {
                    scopeObj.searchData(searchText);
                } else {
                    var presenter = scopeObj.getLocateUsPresentationController();
                    presenter.getBranchOrATMList();
                }
            };
            this.view.LocateUs.btnBranch.onClick = function() {
                scopeObj.selectedView = "BRANCH";
                scopeObj.view.LocateUs.lblViewType.text = kony.i18n.getLocalizedString("i18n.locateus.view") + ": " + kony.i18n.getLocalizedString("i18n.locateus.OnlyBranches");
                scopeObj.view.LocateUs.btnBranch.skin = viewConstants.SKINS.TAB_ACTIVE;
                scopeObj.view.LocateUs.btnAll.skin = viewConstants.SKINS.TAB_INACTIVE;
                scopeObj.view.LocateUs.btnATM.skin = viewConstants.SKINS.TAB_INACTIVE;
                var searchText = scopeObj.view.LocateUs.tbxSearchBox.text.trim();
                if (searchText !== null && searchText !== '' && searchText.length > 0) {
                    scopeObj.searchData(searchText);
                } else {
                    var presenter = scopeObj.getLocateUsPresentationController();
                    presenter.getBranchOrATMList();
                }
            };
            this.view.LocateUs.btnAll.onClick = function() {
                scopeObj.selectedView = "ALL";
                scopeObj.view.LocateUs.lblViewType.text = kony.i18n.getLocalizedString("i18n.locateus.view") + ": " + kony.i18n.getLocalizedString("i18n.locateus.Branches&Atms");
                scopeObj.view.LocateUs.btnBranch.skin = viewConstants.SKINS.TAB_INACTIVE;
                scopeObj.view.LocateUs.btnAll.skin = viewConstants.SKINS.TAB_ACTIVE;
                scopeObj.view.LocateUs.btnATM.skin = viewConstants.SKINS.TAB_INACTIVE;
                var searchText = scopeObj.view.LocateUs.tbxSearchBox.text.trim();
                if (searchText !== null && searchText !== '' && searchText.length > 0) {
                    scopeObj.searchData(searchText);
                } else {
                    var presenter = scopeObj.getLocateUsPresentationController();
                    presenter.getBranchOrATMList();
                }
            };
            this.view.LocateUs.btnBackToMap.onClick = function() {
                scopeObj.clearSelectedIndicator();
                scopeObj.showSearch();
                scopeObj.showMap();
                var locationData = {
                    lat: scopeObj.globalMapLat,
                    lon: scopeObj.globalMapLong,
                };
                scopeObj.view.LocateUs.mapLocateUs.navigateToLocation(locationData, false, false);
                scopeObj.view.LocateUs.mapLocateUs.zoomLevel = 15;
                if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
                    scopeObj.view.LocateUs.flxBranchDetails.isVisible = false;
                    scopeObj.view.LocateUs.flxMap.isVisible = true;
                    scopeObj.view.LocateUs.flxRight.top = "150dp";
                }
                scopeObj.view.customheader.headermenu.setFocus(true);
                scopeObj.view.LocateUs.flxLeft.zIndex = 1;
                scopeObj.view.forceLayout();
            };
            this.view.LocateUs.btnProceed.onClick = function() {
                if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
                    scopeObj.showDirections();
                    scopeObj.view.LocateUs.flxLeft.zIndex = 2;
                    scopeObj.view.forceLayout();
                    return;
                }
                scopeObj.showDirections();
                scopeObj.showMap();
            };
            this.view.LocateUs.flxCancelFilter1.onClick = function() {
                scopeObj.removeFilter(scopeObj.view.LocateUs.lblFilterName1.text);
            };
            this.view.LocateUs.flxCancelFilter2.onClick = function() {
                scopeObj.removeFilter(scopeObj.view.LocateUs.lblFilterName2.text);
            };
            this.view.LocateUs.flxCancelFilter3.onClick = function() {
                scopeObj.removeFilter(scopeObj.view.LocateUs.lblFilterName3.text);
            };
            this.view.LocateUs.flxCancelFilter4.onClick = function() {
                scopeObj.removeFilter(scopeObj.view.LocateUs.lblFilterName4.text);
            };
            this.view.LocateUs.flxCancelFilter5.onClick = function() {
                scopeObj.removeFilter(scopeObj.view.LocateUs.lblFilterName5.text);
            };
            this.view.LocateUs.flxBack.onClick = function() {
                if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
                    scopeObj.showBranchDetails();
                    return;
                }
                scopeObj.showBranchDetails();
                scopeObj.showSearch();
            };
            this.view.LocateUs.btnBackToSearch.onClick = function() {
                scopeObj.view.LocateUs.flxLeft.zIndex = 2;
                scopeObj.view.forceLayout();
                if (kony.application.getCurrentBreakpoint() === 640)
                    scopeObj.view.LocateUs.flxRight.top = "150dp";
                scopeObj.showViewsAndFilters();
            };
            this.view.LocateUs.flxZoomIn.onClick = function() {
                //  scopeObj.showRedoSearch(true);
                var zoom = scopeObj.view.LocateUs.mapLocateUs.zoomLevel;
                zoom--;
                scopeObj.view.LocateUs.mapLocateUs.zoomLevel = zoom;
            };
            this.view.LocateUs.flxZoomOut.onClick = function() {
                // scopeObj.showRedoSearch(true);
                var zoom = scopeObj.view.LocateUs.mapLocateUs.zoomLevel;
                zoom++;
                scopeObj.view.LocateUs.mapLocateUs.zoomLevel = zoom;
            };
            this.view.LocateUs.flxShare.onClick = function() {
                scopeObj.showShareDirection();
            };
            this.view.LocateUs.btnClearAll.onClick = function() {
                scopeObj.searchTextClearAndRefresh();
                scopeObj.clearAll();
                scopeObj.segSetFilters();
                scopeObj.view.LocateUs.btnClearAll.setVisibility(false);
            };
            this.view.LocateUs.btnShare.onClick = function() {
                scopeObj.showShareDirection();
            };
            this.view.LocateUs.btnBackToDetails.onClick = function() {
                if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
                    scopeObj.showBranchDetails();
                    return;
                }
                scopeObj.showBranchDetails();
                scopeObj.showSearch();
            };
            this.view.imgShareClose.onTouchEnd = function() {
                scopeObj.hideShareDirection();
            };
            this.view.btnShareCancel.onClick = function() {
                scopeObj.hideShareDirection();
            };
            this.view.btnShareSend.onClick = function() {
                //Not implemented
                scopeObj.hideShareDirection();
            };
            this.view.lbxSendMapTo.onSelection = function() {
                scopeObj.showTextbox();
            };
            this.view.LocateUs.mapLocateUs.onPinClick = scopeObj.pinCallback;
            this.view.flxShowMapView.onClick = function() {
                scopeObj.showViews(["flxMap"]);
             	scopeObj.mapView = true;
                scopeObj.view.LocateUs.flxEmptySpace.setVisibility(false);
                scopeObj.view.LocateUs.segResults.setVisibility(false);
                scopeObj.view.LocateUs.flxFilters.setVisibility(false);
                scopeObj.view.LocateUs.btnClearAll.setVisibility(false);
                scopeObj.view.LocateUs.flxLeft.zIndex = 1;
                if (scopeObj.view.flxButtonsWrapper.skin == "sknflxGradient0273e3ffffff")
                    scopeObj.toggleListMap();
                scopeObj.view.forceLayout();
            };
            this.view.flxShowListView.onClick = function() {
                scopeObj.showViews(["flxSearch"]);
                scopeObj.mapView = false;
                scopeObj.view.LocateUs.flxEmptySpace.setVisibility(false);
                if (scopeObj.view.LocateUs.segResults.data.length >= 1 && (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile))
                    scopeObj.view.LocateUs.segResults.setVisibility(true);
                scopeObj.view.LocateUs.flxFilters.setVisibility(true);
                //scopeObj.view.LocateUs.btnClearAll.setVisibility(true);
                window.scrollTo(0, 0);
                scopeObj.view.LocateUs.flxLeft.zIndex = 2;
                if (scopeObj.view.flxButtonsWrapper.skin == "sknflxGradientffffff0273e3")
                    scopeObj.toggleListMap();
                scopeObj.view.forceLayout();
            };
          this.view.imgMyLocationIcon.onTouchEnd = function() {
            scopeObj.gotoCurrentLocation();
          };
        },
        toggleListMap: function() {
            if (this.view.flxButtonsWrapper.skin == "sknflxGradientffffff0273e3") {
                this.view.flxButtonsWrapper.skin = "sknflxGradient0273e3ffffff";
                this.view.lblListViewIcon.skin = "sknLblFontIconsffffff17px";
                this.view.lblListView.skin = "sknSSPLblFFFFFF15Px";
                this.view.lblMapView.skin = "sknLabelSSP0273e315px";
                this.view.lblMapViewIcon.skin = "sknlblfonticon17px0273e3";
            } else {
                this.view.flxButtonsWrapper.skin = "sknflxGradientffffff0273e3";
                this.view.lblListViewIcon.skin = "sknlblfonticon17px0273e3";
                this.view.lblListView.skin = "sknLabelSSP0273e315px";
                this.view.lblMapView.skin = "sknSSPLblFFFFFF15Px";
                this.view.lblMapViewIcon.skin = "sknLblFontIconsffffff17px";
            }
        },
        pinCallback: function(mapid, locationdata) {
            var scopeObj = this;
            scopeObj.pinToSegment(locationdata);
        },
        segToggleCheckBox: function() {
            var index = this.view.LocateUs.segViewsAndFilters.selectedRowIndex;
            var rowIndex = index[1];
            var data = this.view.LocateUs.segViewsAndFilters.data;
            if (data[rowIndex].lblCheckbox.text === viewConstants.FONT_ICONS.CHECBOX_UNSELECTED) {
                data[rowIndex].lblCheckbox.text = viewConstants.FONT_ICONS.CHECBOX_SELECTED;
            } else {
                data[rowIndex].lblCheckbox.text = viewConstants.FONT_ICONS.CHECBOX_UNSELECTED;
            }
            this.view.LocateUs.segViewsAndFilters.setDataAt(data[rowIndex], rowIndex);
        },
        onRowClickSegment: function(obj) {
            this.view.LocateUs.flxMap.isVisible = false;
            this.view.LocateUs.flxBranchDetails.isVisible = true;
            this.view.LocateUs.flxRight.top = "0dp";
            var params = {
                "type": "details",
                "placeID": obj.locationId
            };
            FormControllerUtility.showProgressBar(this.view);
            var presenter = this.getLocateUsPresentationController();
            presenter.getAtmorBranchDetails(params);
        },
        getAtmOrBranchDetailsSuccessCallback: function(locationDetailsViewModel) {
            this.view.LocateUs.imgBankImage.src = viewConstants.IMAGES.BANK_IMG_ROUNDED;
            this.view.LocateUs.lblDistanceAndTimeFromUser.text = "";
            if (locationDetailsViewModel.addressLine2) {
                this.view.LocateUs.lblAddressLine2.text = locationDetailsViewModel.addressLine2.trim();
            }
          if(kony.application.getCurrentBreakpoint() === 640){
				this.view.LocateUs.lblBranchName2.top = "50dp";
			}
            if (locationDetailsViewModel.addressLine1) {
                this.view.LocateUs.lblAddressLine1.text = locationDetailsViewModel.addressLine1.trim();
            }
            this.view.LocateUs.lblBranchName2.text = locationDetailsViewModel.informationTitle.trim();
            this.view.LocateUs.lblBranchName3.text = locationDetailsViewModel.informationTitle.trim();
            this.processServices(locationDetailsViewModel.services);
            if (locationDetailsViewModel.phoneNumber) {
                this.view.LocateUs.lblPhoneNumber1.text = locationDetailsViewModel.phoneNumber.trim();
            } else {
                this.view.LocateUs.lblPhoneNumber1.text = "N/A";
            }
            this.view.LocateUs.lblPhoneNumber2.text = "";
            if (locationDetailsViewModel.workingHours) {
                var days = locationDetailsViewModel.workingHours.split("||");
                for (var i = 0; i < days.length; i++)
                    days[i] = days[i].trim();
                let sortedDays = [days[0], days[1], days[2], days[3], days[4], days[5], days[6]];
                var data = sortedDays.map(function(dataItem) {
                    return {
                        "lblTimings": dataItem.replace(/\?/g, " to ")
                    };
                });
                this.view.LocateUs.segDayAndTime.widgetDataMap = {
                    "lblTimings": "lblTimings"
                };
                this.view.LocateUs.segDayAndTime.setData(data);
            } else {
                this.view.LocateUs.segDayAndTime.setData([]);
              if(kony.application.getCurrentBreakpoint() === 640){
					this.view.LocateUs.flxBranchTimings.height = "50dp";
				this.view.LocateUs.flxBranchTimingsAndServices.height = "270dp";
				}
            }
            FormControllerUtility.hideProgressBar(this.view);
            this.view.forceLayout();
        },
        getAtmOrBranchDetailsErrorCallback: function() {
            this.view.LocateUs.imgBankImage.src = viewConstants.IMAGES.BANK_IMG_ROUNDED;
            this.view.LocateUs.lblBranchName2.text = kony.i18n.getLocalizedString("i18n.locateus.detailsNA");
            this.view.LocateUs.lblDistanceAndTimeFromUser.text = "";
            this.view.LocateUs.lblAddressLine2.text = "";
            this.view.LocateUs.lblAddressLine1.text = "";
            this.view.LocateUs.lblPhoneNumber1.text = "";
            this.view.LocateUs.lblPhoneNumber2.text = "";
            this.view.LocateUs.segDayAndTime.setData([]);
            this.view.LocateUs.lblService1.text = "";
            this.view.LocateUs.lblService2.text = "";
            this.view.LocateUs.lblService3.text = "";
            this.view.LocateUs.lblService4.text = "";
            this.view.LocateUs.lblBranchName3.text = "";
            FormControllerUtility.hideProgressBar(this.view);
            this.view.forceLayout();
        },
        setViewsAndFilterSegmentData: function() {
            var scopeObj = this;
            var services = scopeObj.getServices();
            var dataMap = {
                "flximg": "flximg",
                "flxOption": "flxOption",
                "lblCheckbox": "lblCheckbox",
                "lblOption": "lblOption",
                "lblSepartor": "lblSepartor"
            };
            var data = services.map(function(item) {
                return {
                    "flximg": {
                        "onClick": scopeObj.segToggleCheckBox,
                        "skin": "skncursor"
                    },
                    "lblCheckbox": {
                        "text": viewConstants.FONT_ICONS.CHECBOX_UNSELECTED,
                    },
                    "lblOption": item,
                    "lblSepartor": "."
                };
            });
            this.view.LocateUs.segViewsAndFilters.widgetDataMap = dataMap;
            this.view.LocateUs.segViewsAndFilters.setData(data);
            this.view.forceLayout();
        },
        setDirectionsSegmentData: function() {
            var dataMap = {
                "flxDirectionDetails": "flxDirectionDetails",
                "flxDirections": "flxDirections",
                "imgDirection": "imgDirection",
                "lblDirection": "lblDirection",
                "lblDistanceAndTime": "lblDistanceAndTime",
                "lblSeperator": "lblSeperator"
            };
            var data = [{
                    "imgDirection": "arrow_up_blue.png",
                    "lblDirection": "Head southwest on S El Camino Real toward W 4th Ave Lorem Ipsum",
                    "lblDistanceAndTime": "80 Feet | 20 Seconds",
                    "lblSeperator": " ",
                    "template": "flxDirections"
                },
                {
                    "imgDirection": "arrow_right_blue.png",
                    "lblDirection": "Head southwest on S El Camino Real toward W 4th Ave Lorem Ipsum",
                    "lblDistanceAndTime": "80 Feet | 20 Seconds",
                    "lblSeperator": " ",
                    "template": "flxDirections"
                },
                {
                    "imgDirection": "arrow_turn_blue.png",
                    "lblDirection": "Head southwest on S El Camino Real toward W 4th Ave Lorem Ipsum",
                    "lblDistanceAndTime": "80 Feet | 20 Seconds",
                    "lblSeperator": " ",
                    "template": "flxDirections"
                },
                {
                    "imgDirection": "arrow_right_blue.png",
                    "lblDirection": "Head southwest on S El Camino Real toward W 4th Ave Lorem Ipsum",
                    "lblDistanceAndTime": "80 Feet | 20 Seconds",
                    "lblSeperator": " ",
                    "template": "flxDirections"
                },
                {
                    "imgDirection": "arrow_up_blue.png",
                    "lblDirection": "Head southwest on S El Camino Real toward W 4th Ave Lorem Ipsum",
                    "lblDistanceAndTime": "80 Feet | 20 Seconds",
                    "lblSeperator": " ",
                    "template": "flxDirections"
                }
            ];
            this.view.LocateUs.segDirections.widgetDataMap = dataMap;
            this.view.LocateUs.segDirections.setData(data);
        },
        filterSearchData: function() {
            var scopeObj = this;
            var data = scopeObj.searchResultData;
            var filterData = scopeObj.filterDataByView(data);
            data = scopeObj.filterDataByServices(filterData);
            if (data) {
                scopeObj.updateSearchSegmentResult(data);
            } else {
                scopeObj.noSearchResultUI();
            }
        },
        filterDataByView: function(data) {
            var scopeObj = this;
            if(Array.isArray(data)==false){
                data = this.parseLocations(data.rawResponse);
            }
            var view = scopeObj.selectedView;
            if (view === "ALL")
                return data;
            else if (view === "ATM") {
                return data.filter(function(row) {
                    if (row.type === "ATM")
                        return true;
                    else
                        return false;
                });
            } else if (view === "BRANCH") {
                return data.filter(function(row) {
                    if (row.type === "Branch" || row.type === "BRANCH")
                        return true;
                    else
                        return false;
                });
            }
        },
        filterDataByServices: function(data) {
            var scopeObj = this;
            var filter = scopeObj.selectedServicesList;
            if (filter.length > 0) {
                //TO DO-filter data
                //As of now no criteria for how to filter
                //if any of the filter is selected-Showing no data is found
                return null;
            } else
                return data;
        },
        noSearchResultUI: function() {
            this.showNoMapPins();
            this.view.LocateUs.flxSearch.setVisibility(true);
            this.view.LocateUs.flxDirections.setVisibility(false);
            this.view.LocateUs.flxViewsAndFilters.setVisibility(false);
            this.view.LocateUs.flxSearchBox.setVisibility(true);
            this.view.LocateUs.segResults.setVisibility(false);
            this.view.LocateUs.flxNoSearchResult.setVisibility(true);
            this.view.LocateUs.lblNoSearchResults.text = kony.i18n.getLocalizedString("i18n.LocateUs.NosearchresultfoundPleasechangethesearchcriteria");
            var screenHeight = kony.os.deviceInfo().screenHeight;
            this.view.LocateUs.flxLeft.height = (screenHeight - 51) + "px";
            this.view.forceLayout();
        },
        searchResultUI: function() {
            this.view.LocateUs.flxSearch.setVisibility(true);
            this.view.LocateUs.flxDirections.setVisibility(false);
            this.view.LocateUs.flxViewsAndFilters.setVisibility(false);
            this.view.LocateUs.flxSearchBox.setVisibility(true);
            this.view.LocateUs.segResults.setVisibility(true);
            this.view.LocateUs.flxTabs.setVisibility(true);
            this.view.LocateUs.flxNoSearchResult.setVisibility(false);
            this.view.forceLayout();
        },
        pinToSegment: function(dataItem) {
            var scopeObj = this;
            var locationId = dataItem.locationId;
            var informationTitle = dataItem.informationTitle ? dataItem.informationTitle : dataItem.lblName;
            var data = scopeObj.view.LocateUs.segResults.data;
            var index = -1;
            data.forEach(function(item, i) {
                if (item.locationId === locationId && item.lblName === informationTitle) {
                    index = i;
                }
            });
            if (index !== -1) {
                scopeObj.view.LocateUs.segResults.selectedRowIndex = [0, index];
                scopeObj.changeResultsRowSkin();
                scopeObj.view.forceLayout();
            }
        },
        /**
         * make service call based on serch text
         */
        searchData: function(searchText) {
            var scopeObj = this;
            var queryParams = {
                "query": searchText.trim()
            };
            var presenter = scopeObj.getLocateUsPresentationController();
            presenter.getSearchBranchOrATMList(queryParams);
        },
        /**
         * success callback
         */
        getSearchBranchOrATMListSuccessCallback: function(data) {
            if (data.length === 0) {
                this.getSearchBranchOrATMListErrorCallback();
            } else {
                this.searchResultData = data;
                if (this.searchResultData[0].latitude && this.searchResultData[0].longitude) {
                    //this.globalMapLat = data[0].latitude;
                    //this.globalMapLong = data[0].longitude;
                }
                this.filterSearchData();
                FormControllerUtility.hideProgressBar(this.view);
            }
        },
        /**
         * error callback
         */
        getSearchBranchOrATMListErrorCallback: function() {
            this.noSearchResultUI();
            FormControllerUtility.hideProgressBar(this.view);
        },
        /**
         * it perform the search
         */
        performSearch: function() {
            var scopeObj = this;
            var searchText = scopeObj.view.LocateUs.tbxSearchBox.text.trim();
            if (searchText !== null && searchText !== '' && searchText.length > 0) {
                scopeObj.searchData(searchText);
            } else {
                scopeObj.searchTextClearAndRefresh();
                return;
            }
        },
        /**
         * to apply the filter
         */
        applyFilters: function() {
            var scopeObj = this;
            scopeObj.performSearch();
            scopeObj.segSetFilters();
            scopeObj.viewText = scopeObj.view.LocateUs.lblViewType.text;
            scopeObj.selectedViewOnApply = scopeObj.selectedRadioBtn();
            scopeObj.showViews(["flxSearch"]);
            scopeObj.mapView = false;
        },
        /**
         * cancel the filter
         */
        cancelFilters: function() {
            var scopeObj = this;
            scopeObj.setPreviousViewSelection();
            scopeObj.setPreviousFilterSelection();
            scopeObj.searchResultUI();
            scopeObj.performSearch();
            scopeObj.view.forceLayout();
        },
        /**
         *it clears the search text and make a service call
         */
        searchTextClearAndRefresh: function() {
            var scopeObj = this;
            var locateUsPresenter = scopeObj.getLocateUsPresentationController();
            locateUsPresenter.getBranchOrATMList();
            scopeObj.view.LocateUs.tbxSearchBox.text = "";
        },
        /**
         * it sets the previous filter selection
         */
        setPreviousFilterSelection: function() {
            var scopeObj = this;
            scopeObj.setViewsAndFilterSegmentData();
            var data = scopeObj.view.LocateUs.segViewsAndFilters.data;
            for (var i = 0; i < data.length; i++) {
                data[i].lblCheckbox.text = scopeObj.prevData[i];
                data[i].flximg.onClick = scopeObj.segToggleCheckBox;
            }
            scopeObj.view.LocateUs.segViewsAndFilters.setData(data);
            scopeObj.view.forceLayout();
        },
        setPreviousViewSelection: function() {
            var scopeObj = this;
            scopeObj.view.LocateUs.lblViewType.text = scopeObj.viewText;
            scopeObj.selectRadioButton(scopeObj.selectedViewOnApply);
        },
        /**
         *returns the selected radio button
         */
        selectedRadioBtn: function() {
            var scopeObj = this;
            if (scopeObj.view.LocateUs.imgRadioButtonAll.src === viewConstants.IMAGES.RADIO_BUTTON_ACTIVE)
                return scopeObj.view.LocateUs.imgRadioButtonAll;
            if (scopeObj.view.LocateUs.imgRadioButtonBranch.src === viewConstants.IMAGES.RADIO_BUTTON_ACTIVE)
                return scopeObj.view.LocateUs.imgRadioButtonBranch;
            if (scopeObj.view.LocateUs.imgRadioButtonAtm.src === viewConstants.IMAGES.RADIO_BUTTON_ACTIVE)
                return scopeObj.view.LocateUs.imgRadioButtonAtm;
        },
        /**
         * return the services
         */
        getServices: function() {
            return [kony.i18n.getLocalizedString("i18n.LocateUs.DriveUpATM"), kony.i18n.getLocalizedString("i18n.LocateUs.SurchargeFreeATM"), kony.i18n.getLocalizedString("i18n.LocateUs.DepositTakingATM"), kony.i18n.getLocalizedString("i18n.LocateUs.CoOpSharedBranch"), kony.i18n.getLocalizedString("i18n.LocateUs.SafeDepositBox")];
        },
        /**
         * it clear the selected indicator
         */
        clearSelectedIndicator: function() {
            var data = this.view.LocateUs.segResults.data;
            for (var i = 0; i < data.length; i++) {
                data[i].flxSearchResults.skin = viewConstants.SKINS.SKNFLXFFFFFFBORDER0;
                data[i].imgIndicator.isVisible = false;
            }
            this.view.LocateUs.segResults.setData(data);
            this.view.forceLayout();
        }
    };
});