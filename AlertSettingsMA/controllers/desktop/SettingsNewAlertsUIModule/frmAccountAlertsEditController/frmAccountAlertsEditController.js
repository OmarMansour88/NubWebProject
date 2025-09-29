define(['CommonUtilities', 'CSRAssistUI', 'FormControllerUtility', 'OLBConstants', 'ViewConstants', 'CampaignUtility'], function(CommonUtilities, CSRAssistUI, FormControllerUtility, OLBConstants, ViewConstants, CampaignUtility) {
    var orientationHandler = new OrientationHandler();
    var responsiveUtils = new ResponsiveUtils();
    var alertData = [];
    return {
        updateFormUI: function(viewModel) {
            if (viewModel !== undefined) {
                if (viewModel.serverError) {
                    this.showServerError(viewModel.serverError);
                } else {
                    if (viewModel.isLoading !== undefined) {
                        this.changeProgressBarState(viewModel.isLoading);
                    }
                    if (viewModel.AlertsDataById) {
                        alertData = viewModel.AlertsDataById;
                        this.setAlertsDataToUI(viewModel.AlertsDataById);
                        FormControllerUtility.hideProgressBar(this.view);
                    }
                }
            }
        },
        preShow: function() {
            var self = this;
            this.view.setVisibility(true);
            applicationManager.getLoggerManager().setCustomMetrics(this, false, "Profile");
            this.view.postShow = this.postShowProfile;
            this.view.flxAccountSettingsCollapseMobile.onClick = this.toggleMenuMobile;
            FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxHeader', 'flxFooter', 'flxMain', 'flxMenuItemMobile', 'flxRight']);
            this.view.profileMenu.checkLanguage();
            //this.view.profileMenu.forceInitializeProfileMenu();
            //this.view.customheadernew.activateMenu("Settings", "Alert Settings");
            this.setFlowActions();
            this.setAccessibility();
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.ProfileManagement.Alerts"), accessibilityConfig);
            this.view.lblSMSInfo.text=kony.i18n.getLocalizedString("i18n.ProfileManagement.SMS");
            this.view.lblPushInfo.text=kony.i18n.getLocalizedString("i18n.Alertsettings.PushNotifications");
            this.view.lblEmailInfo.text=kony.i18n.getLocalizedString("i18n.ProfileManagement.EmailId");
            this.view.lblNotifInfo.text=kony.i18n.getLocalizedString("i18n.alertSettings.NotifCenter");
            this.view.lblEnableAlerts.text=kony.i18n.getLocalizedString("i18n.Alerts.ENABLEALERTS");
            this.view.rtxAlertsWarning.text=kony.i18n.getLocalizedString("i18n.ProfileManagement.ViewAlert");
            this.view.lblFrequencyTitle.text=kony.i18n.getLocalizedString("i18n.PayPerson.frequency");
            this.view.lblChannelsTitle.text=kony.i18n.getLocalizedString("i18n.Alerts.SelectChannels");
            CommonUtilities.setText(this.view.btnAlertSave, kony.i18n.getLocalizedString("i18n.ProfileManagement.Save"), accessibilityConfig);
            CommonUtilities.setText(this.view.btnAlertCancel, kony.i18n.getLocalizedString("i18n.transfers.Cancel"), accessibilityConfig);
            alertData=[];
			this.view.lblSMSIcon.accessibilityConfig = {
				"a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.SMS")
			  }
			   this.view.lblPushIcon.accessibilityConfig = {
				"a11yLabel": kony.i18n.getLocalizedString("i18n.Alertsettings.PushNotifications")
			  }
			   this.view.lblEmailIcon.accessibilityConfig = {
				"a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.EmailId")
			  }
			   this.view.lblNotifIcon.accessibilityConfig = {
				"a11yLabel": kony.i18n.getLocalizedString("i18n.alertSettings.NotifCenter")
			  }
            this.view.lblChannel1.accessibilityConfig = {
              "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Unselected") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.EmailId") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
            }
            this.view.lblChannel2.accessibilityConfig = {
                "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Unselected") + " " + kony.i18n.getLocalizedString("i18n.alertSettings.NotifCenter") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
            }
            this.view.lblChannel3.accessibilityConfig = {
                "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Unselected") + " " + kony.i18n.getLocalizedString("i18n.Alertsettings.PushNotifications") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
            }
            this.view.lblChannel4.accessibilityConfig = {
                "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Unselected") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.SMS") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
            }
            this.view.lblChannel1Tab.accessibilityConfig = {
                "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Unselected") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.EmailId") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
            }
            this.view.lblChannel2Tab.accessibilityConfig = {
                "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Unselected") + " " + kony.i18n.getLocalizedString("i18n.alertSettings.NotifCenter") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
            }
            this.view.lblChannel3Tab.accessibilityConfig = {
                "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Unselected") + " " + kony.i18n.getLocalizedString("i18n.Alertsettings.PushNotifications") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
            }
            this.view.lblChannel4Tab.accessibilityConfig = {
                "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Unselected") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.SMS") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
            }
            this.view.lblAlertsWarningImage.accessibilityConfig = {
              "a11yLabel": kony.i18n.getLocalizedString("i18n.alerts.InfoEditAccountAlerts")
            }
            this.view.onBreakpointChange = function() {
                self.onBreakpointChange(kony.application.getCurrentBreakpoint());
            }
            if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
            if (this.view.lblCollapseMobile.text == "P") {
                this.view.lblCollapseMobile.text = "O";
                this.view.flxLeft.setVisibility(false);
                this.view.flxRight.setVisibility(true);
            }
            }
            this.view.flxNoAlertsFound.setVisibility(false);
			this.view.flxAlertsSegment.setVisibility(true);
            this.view.forceLayout();
        },
        /**
         * *@param {String} text- text that needs to be appended to the upper text in mobile breakpoint
         *  Method to set the text in mobile breakpoint
         */
        setSelectedValue: function(text) {
          var self = this;
      CommonUtilities.setText(self.view.lblAccountSettingsMobile, kony.i18n.getLocalizedString(text) , CommonUtilities.getaccessibilityConfig());
        },
        /**
         *  Method to set ui for the component in mobile breakpoint
         */
         toggleMenuMobile: function () {
          if (this.view.lblCollapseMobile.text == "O") {
            this.view.lblCollapseMobile.text = "P";
            this.view.flxLeft.setVisibility(true);
            this.view.flxRight.setVisibility(false);
          } else {
            this.view.lblCollapseMobile.text  = "O";
            this.view.flxLeft.setVisibility(false);
            this.view.flxRight.setVisibility(true);
          }
        }, 



        /**
         * *@param {Boolean} isLoading- True or false to show/hide the progess bar
         *  Method to set show/hide the progess bar
         */
        changeProgressBarState: function(isLoading) {
            if (isLoading) {
                FormControllerUtility.showProgressBar(this.view);
            } 
        },
        postShowProfile: function() {
            applicationManager.getNavigationManager().applyUpdates(this);
//             this.view.profileMenu.flxSeperator.height = this.view.flxRight.info.frame.height;
//      	    this.view.flxLeft.height = this.view.flxRight.info.frame.height;
            this.view.forceLayout();
        },
        onBreakpointChange: function(width) {
            var scope = this;
            FormControllerUtility.setupFormOnTouchEnd(width);
            responsiveUtils.onOrientationChange(this.onBreakpointChange);
            this.view.customheadernew.onBreakpointChangeComponent(width);
            this.view.customfooternew.onBreakpointChangeComponent(width);
            this.view.profileMenu.onBreakpointChangeComponent(width);
            orientationHandler.onOrientationChange(this.onBreakpointChange);
            if(alertData.alertsData){
                this.setAlertsDataToUI(alertData);
            }
            if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
              var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
              CommonUtilities.setText(this.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.ProfileManagement.Alerts"), accessibilityConfig);
            }
            this.view.forceLayout();
        },
        setAccessibility: function() {
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            this.view.lblCollapseMobile.accessibilityConfig = {
                "a11yARIA": {
                    "tabindex": -1
                }
            };
            this.view.flxAccountSettingsCollapseMobile.accessibilityConfig = {
                "a11yLabel": "Dropdown"
            };
        },
        /**
         *  Method to set the Form Flow Actions such as button onclick events
         */
        setFlowActions: function() {
            var scopeObj = this;

        },
        /**
      *Method is used to call respective functions based on alert preference
    **/
      setAlertsDataToUI: function(alertsModel) {
        var scopeObj = this;
        var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
        var alertsViewModel=alertsModel.alertsData;
        var isInitialLoad=alertsViewModel.categorySubscription.isInitialLoad;
        //var isModifyScreen = this.view.btnEditAlerts.isVisible === true ? false : true;
        this.enableFrequency=alertsViewModel.alertConfiguration[0].enableFrequency==="1"?true:false;
        var isEnabledScreen = (alertsViewModel.categorySubscription.isSubscribed==="true") ? "o" : "n";
        if(this.view.lblSwitch.text!==isEnabledScreen)
          this.view.lblSwitch.text=isEnabledScreen;
        if (scopeObj.view.lblSwitch.text === "n") {
          scopeObj.view.lblSwitch.skin = "skn727272fonticons";  
                } else{
                  scopeObj.view.lblSwitch.skin = "sknfonticontoggleON45px";    
                }
               this.setFrequencyData();
               var AlertsCategories = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("SettingsNewAlertsUIModule").presentationController.getAlertsCategoryResponse();
               for(var i=0; i<AlertsCategories.records.length; i++){
                    if(AlertsCategories.records[i].alertcategory_id === alertsModel.AlertCategoryId){
                    this.view.profileMenu.activateMenu("ALERTSETTINGS", AlertsCategories.records[i].alertcategory_Name);
                    this.view.lblAlertsHeading.text=AlertsCategories.records[i].alertcategory_Name;
                    CommonUtilities.setText(this.view.lblAccountSettingsMobile, AlertsCategories.records[i].alertcategory_Name, accessibilityConfig);
                    CommonUtilities.setText(this.view.btnEditAlerts, kony.i18n.getLocalizedString("i18n.billPay.Edit"), accessibilityConfig);
					this.view.title = AlertsCategories.records[i].alertcategory_Name;
                    }
                }
               if (alertsModel.AlertCategoryId === "ALERT_CAT_ACCOUNTS") {                
                  this.view.btnAlertSave.setVisibility(true);
                  this.view.btnAlertCancel.setVisibility(true);
                  this.view.flxAlertBtnSeperator.setVisibility(true);
            } else {
                  this.view.btnAlertSave.setVisibility(false);
                  this.view.btnAlertCancel.setVisibility(false);	
                  this.view.flxAlertBtnSeperator.setVisibility(false); 
            }
              if(alertsViewModel.alertConfiguration[0].alertPreferenceView==="CATEGORY"){
                this.setCategoryChannelsToUI(alertsViewModel.alertCategory.supportedChannels,alertsViewModel.alertCategory.subscribedChannels,isInitialLoad);
                this.setCategoryFrequencyData(alertsViewModel.alertCategory.subscribedFrequency);
                if (kony.application.getCurrentBreakpoint() === 1024 || orientationHandler.isTablet) {
                this.view.flxChannelsFrequencyTab.setVisibility(true);
				} else {
					this.view.flxChannelsFrequency.setVisibility(true);
				}
            } else {
                this.view.flxChannelsFrequency.setVisibility(false);
                this.view.flxChannelsFrequencyTab.setVisibility(false);
              }
             if (alertsViewModel.alertConfiguration[0].alertPreferenceView !== "CATEGORY") {
                if (kony.application.getCurrentBreakpoint() === 1024 || orientationHandler.isTablet) {
                    this.view.flxAlertsSegment.top = "10dp";
                } else if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
                    this.view.flxAlertsSegment.top = "0dp";
                } else {
                    this.view.flxAlertsSegment.top = "0dp";
                }
            } else {
                if (kony.application.getCurrentBreakpoint() === 1024 || orientationHandler.isTablet) {
                    this.view.flxAlertsSegment.top = "5dp";
                } else if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
                    this.view.flxAlertsSegment.top = "0dp";
                } else {
                    this.view.flxAlertsSegment.top = "10dp";
                }
              }
              this.view.lblSwitch.setEnabled(false);
              this.view.flxChannelsFrequency.setEnabled(false);
              this.view.flxChannelsFrequencyTab.setEnabled(false);
              this.view.segAlertsListing.setEnabled(false);
              this.alertPreference=alertsViewModel.alertConfiguration[0].alertPreferenceView; 
              if(alertsViewModel.alertTypes.length===0){
                scopeObj.view.flxNoAlertsFound.setVisibility(true);
                scopeObj.view.flxAlertsSegment.setVisibility(false);
              }else if(this.alertPreference==="ALERT")
                this.setAlertLevelAlertsSegData(alertsViewModel.alertTypes,isInitialLoad);
              else if(this.alertPreference==="GROUP")
                this.setGroupLevelAlertsSegData(alertsViewModel.alertTypes,isInitialLoad);
              else if(this.alertPreference==="CATEGORY")
                this.setCategoryLevelAlertsSegData(alertsViewModel.alertTypes);
              this.isServiceCallNeeded= false;
              this.view.flxEnableSwitch.onClick =function(){
                if (scopeObj.view.lblSwitch.text === "o") {
                  scopeObj.view.lblSwitch.skin = "skn727272fonticons";  
                  scopeObj.view.lblSwitch.text = "n";   
                } else{
                  scopeObj.view.lblSwitch.skin = "sknfonticontoggleON45px";
                   scopeObj.view.lblSwitch.text = "o";     
                }
                if((isInitialLoad==="true"||isInitialLoad===true)&&scopeObj.view.lblSwitch.text==="o")
                  scopeObj.initialAlertsToggle(alertsModel);
                scopeObj.ToggleSwitchAlerts();
                if (scopeObj.view.lblSwitch.text === "o") {
                  scopeObj.view.lblSwitch.accessibilityConfig = {
                      "a11yLabel": kony.i18n.getLocalizedString("i18n.alerts.AccountsAlertsEnabled")
                  };
              }
              else {
                  scopeObj.view.lblSwitch.accessibilityConfig = {
                  "a11yLabel": kony.i18n.getLocalizedString("i18n.alerts.AccountsAlertsDisabled")
                  }
              }
              };
              if (alertsModel.AlertCategoryId === "ALERT_CAT_ACCOUNTS") {
				this.view.btnEditAlerts.setVisibility(false);
				this.view.lblSwitch.setEnabled(true);
				this.ToggleSwitchAlerts();
            } else {
                if (alertsViewModel.alertTypes.length === 0) {
					this.view.btnEditAlerts.setVisibility(false);
				} else {
                this.view.btnEditAlerts.setVisibility(true);
				}
            }
              this.view.btnEditAlerts.onClick = scopeObj.onEditAlertsClick.bind(this, alertsModel.AlertCategoryId);
              this.view.btnAlertCancel.onClick = scopeObj.onClickCancelAlerts.bind(this, alertsModel);
              if (CommonUtilities.isCSRMode()) {
                  this.view.btnAlertSave.onClick = CommonUtilities.disableButtonActionForCSRMode();
                  this.view.btnAlertSave.skin = CommonUtilities.disableButtonSkinForCSRMode();
                  this.view.btnAlertSave.focusSkin = CommonUtilities.disableButtonSkinForCSRMode();
              } else {
                  this.view.btnAlertSave.onClick = scopeObj.onAlertSaveClick.bind(this,alertsModel);
              }
              FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxHeader', 'flxFooter', 'flxMain', 'flxMenuItemMobile', 'flxRight']);
              this.view.profileMenu.flxSeperator.height = this.view.flxRight.info.frame.height;
              this.view.flxLeft.height = this.view.flxRight.info.frame.height;
              this.view.flxAlertsBody.forceLayout();
              FormControllerUtility.hideProgressBar(this.view);
              if (this.view.lblSwitch.text === "o") {
                this.view.lblSwitch.accessibilityConfig = {
                    "a11yLabel": kony.i18n.getLocalizedString("i18n.alerts.AccountsAlertsEnabled")
                };
            }
            else {
                this.view.lblSwitch.accessibilityConfig = {
                "a11yLabel": kony.i18n.getLocalizedString("i18n.alerts.AccountsAlertsDisabled")
                }
            }
    },
      /**
      *Method is used to set frequency data at category level
      * @param [{"alertFrequencyId":"","frequencyValue":"","frequencyTime":""}] Frequency object JSON
    **/
    setCategoryFrequencyData : function(subscribedFreq){
      if(subscribedFreq&&this.enableFrequency){
        if (kony.application.getCurrentBreakpoint() === 1024  || orientationHandler.isTablet){
          this.view.lstBoxFrequency1Tab.masterData=this.frequencyList.category;
          this.view.lstBoxFrequency1Tab.selectedKey= subscribedFreq[0].alertFrequencyId;
          if(subscribedFreq[0].alertFrequencyId==="DAILY"){
            this.view.flxFrequency2Tab.setVisibility(false);
          }else{
            this.view.flxFrequency2Tab.setVisibility(true);
            this.view.lstBoxFrequency2Tab.masterData=subscribedFreq[0].alertFrequencyId==="WEEKLY"?this.frequencyList.weeks:this.frequencyList.dates;
            this.view.lstBoxFrequency2Tab.selectedKey= subscribedFreq[0].frequencyValue;
          }
          this.view.lstBoxFrequency3Tab.masterData=this.frequencyList.time;
          this.view.lstBoxFrequency3Tab.selectedKey=applicationManager.getFormatUtilManager().getTwelveHourTimeString(subscribedFreq[0].frequencyTime);
          this.view.flxCategoryFrequency.setVisibility(false);
          this.view.flxCategoryFrequencyTab.setVisibility(true);
        } else {
                    this.view.lstBoxFrequency1.masterData = this.frequencyList.category;
                    this.view.lstBoxFrequency1.selectedKey = subscribedFreq[0].alertFrequencyId;
                    if (subscribedFreq[0].alertFrequencyId === "DAILY") {
                        if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
                            this.view.flxFrequency3.left = "2%";
                        }
						this.view.flxFrequency2.setVisibility(false);
                    } else {
                      if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
                            this.view.flxFrequency2.left = "2%";
							this.view.flxFrequency3.left = "66%";
                        }
                        this.view.flxFrequency2.setVisibility(true);
                        this.view.lstBoxFrequency2.masterData = subscribedFreq[0].alertFrequencyId === "WEEKLY" ? this.frequencyList.weeks : this.frequencyList.dates;
                        this.view.lstBoxFrequency2.selectedKey = subscribedFreq[0].frequencyValue;
                    }
                    this.view.lstBoxFrequency3.masterData = this.frequencyList.time;
                    this.view.lstBoxFrequency3.selectedKey = applicationManager.getFormatUtilManager().getTwelveHourTimeString(subscribedFreq[0].frequencyTime);
                    this.view.flxCategoryFrequencyTab.setVisibility(false);
                    this.view.flxCategoryFrequency.setVisibility(true);
                }
      }else{
        this.view.flxCategoryFrequency.setVisibility(false);
        this.view.flxCategoryFrequencyTab.setVisibility(false);
        if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
                            this.view.flxChannelsFrequency.height = "124px";
                }
		if (kony.application.getCurrentBreakpoint() === 1024 || orientationHandler.isTablet) {
                            this.view.flxChannelsFrequencyTab.height = "74px";
          }
      }
      this.setAlertsFlowActions();
      this.view.forceLayout();
    },
    
     /**
         *Method is used to set channels data at category level
         * @param {String,String,Boolean} supported channels string , subscribed channels string , isInitialLoad flag
         **/
        setCategoryChannelsToUI: function(supportedChannels, subscribedChannels, isInitialLoad) {
            var channelsData = supportedChannels.split(",");
            var channelIcons = {
                "CH_SMS": {
                    "text": "v",
                    "normalSkin": "sknLblSMS727272FontIcon",
                    "selectedSkin": "sknLblSMS003e75FontIcon"
                },
                "CH_EMAIL": {
                    "text": "w",
                    "normalSkin": "sknLblEmail727272FontIcon",
                    "selectedSkin": "sknLblEmail003e75FontIcon"
                },
                "CH_PUSH_NOTIFICATION": {
                    "text": "x",
                    "normalSkin": "sknLblPush727272FontIcon",
                    "selectedSkin": "sknLblPush003e75FontIcon"
                },
                "CH_NOTIFICATION_CENTER": {
                    "text": "y",
                    "normalSkin": "sknLblNotification727272FontIcon",
                    "selectedSkin": "sknLblNotification003e75FontIcon"
                }
            };
            var channelsCount = 0;
            if (isInitialLoad === "true" || isInitialLoad === true || subscribedChannels === undefined) subscribedChannels = "";
            this.view.flxChannel1.skin = "slFbox";
            this.view.flxChannel2.skin = "slFbox";
            this.view.flxChannel3.skin = "slFbox";
            this.view.flxChannel4.skin = "slFbox";
            this.view.flxChannel1Tab.skin = "slFbox";
            this.view.flxChannel2Tab.skin = "slFbox";
            this.view.flxChannel3Tab.skin = "slFbox";
            this.view.flxChannel4Tab.skin = "slFbox";
            for (var i = 0; i < channelsData.length; i++) {
                this.view["flxChannel" + (i + 1)].setVisibility(true);
                this.view["flxChannel" + (i + 1) + "Tab"].setVisibility(true);
                if (i !== 0) {
                    this.view["flxVerticalSeparator" + (i)].setVisibility(true);
                    this.view["flxVerticalSeparator" + (i) + "Tab"].setVisibility(true);
                }
                this.view["lblChannel" + (i + 1)].text = channelIcons[channelsData[i]].text;
                this.view["lblChannel" + (i + 1) + "Tab"].text = channelIcons[channelsData[i]].text;
                this.view["lblChannel" + (i + 1)].info = {
                    "id": channelsData[i],
                    "isSelected": false,
                    "normalSkin": channelIcons[channelsData[i]].normalSkin,
                    "selectedSkin": channelIcons[channelsData[i]].selectedSkin
                };
                this.view["lblChannel" + (i + 1) + "Tab"].info = {
                    "id": channelsData[i],
                    "isSelected": false,
                    "normalSkin": channelIcons[channelsData[i]].normalSkin,
                    "selectedSkin": channelIcons[channelsData[i]].selectedSkin
                };
                if (subscribedChannels.indexOf(channelsData[i]) >= 0) {
                    // this.view["flxChannel"+(i+1)].onClick();
                    this.view["lblChannel" + (i + 1)].skin = this.view["lblChannel" + (i + 1)].info.selectedSkin;
                    this.view["lblChannel" + (i + 1) + "Tab"].skin = this.view["lblChannel" + (i + 1) + "Tab"].info.selectedSkin;
					this.view["flxChannel" + (i + 1)].skin = "bbSknFlxffffffWithShadow1";
					 this.view["flxChannel" + (i + 1) + "Tab"].skin = "bbSknFlxffffffWithShadow1";
					 this.view["lblChannel" + (i + 1)].info.isSelected = true;
					 this.view["lblChannel" + (i + 1) + "Tab"].info.isSelected = true;
                    // this.view["flxChannel"+(i+1)+"Tab"].onClick();
                } else {
                    this.view["lblChannel" + (i + 1)].skin = this.view["lblChannel" + (i + 1)].info.normalSkin;
                    this.view["lblChannel" + (i + 1) + "Tab"].skin = this.view["lblChannel" + (i + 1) + "Tab"].info.normalSkin;
					this.view["flxChannel" + (i + 1)].skin = "slFbox";
					this.view["flxChannel" + (i + 1) + "Tab"].skin = "slFbox";
					this.view["lblChannel" + (i + 1)].info.isSelected = false;
					 this.view["lblChannel" + (i + 1) + "Tab"].info.isSelected = false;
                }
            }
            for (var x = i + 1; x <= 4; x++) {
                this.view["flxChannel" + x].setVisibility(false);
                this.view["flxVerticalSeparator" + (x - 1)].setVisibility(false);
                this.view["flxChannel" + x + "Tab"].setVisibility(false);
                this.view["flxVerticalSeparator" + (x - 1) + "Tab"].setVisibility(false);
            }
            this.view.flxChannels.width = (channelsData.length) * 55 + "px";
            this.view.flxChannelsTab.width = (channelsData.length) * 55 + "px";
            this.view.forceLayout();
        },
      
            /**
         *setAlertsFlowActions- function to add actions for alerts flow
         */
        setAlertsFlowActions: function() {
            //functions for menu flow
            var scopeObj = this;
            this.view.flxChannel1.onClick = function() {
                var info = scopeObj.view.lblChannel1.info;
                scopeObj.view.flxChannels.skin = "sknFlxffffffNoShadowbodere3e3round3px";
                if (info && info.isSelected === true) {
                    scopeObj.view.flxChannel1.skin = "slFbox";
                    scopeObj.view.lblChannel1.info.isSelected = false;
                    scopeObj.view.lblChannel1.skin = scopeObj.view.lblChannel1.info.normalSkin;
                    scopeObj.view.flxChannel2.skin = scopeObj.view.flxChannel2.skin === "bbSknFlxffffffWithShadow2" ? "bbSknFlxffffffWithShadow1" : "slFbox";
                    scopeObj.view.lblChannel1.accessibilityConfig = {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Selected") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.EmailId") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
                    };
                } else {
                    scopeObj.view.flxChannel1.skin = "bbSknFlxffffffWithShadow1";
                    scopeObj.view.lblChannel1.info.isSelected = true;
                    scopeObj.view.lblChannel1.skin = scopeObj.view.lblChannel1.info.selectedSkin;
                    scopeObj.view.flxChannel2.skin = scopeObj.view.flxChannel2.skin === "bbSknFlxffffffWithShadow1" ? "bbSknFlxffffffWithShadow2" : "slFbox";
                    scopeObj.view.lblChannel1.accessibilityConfig = {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Unselected") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.EmailId") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
                    };
                }
            };
            this.view.flxChannel2.onClick = function() {
                var info = scopeObj.view.lblChannel2.info;
                scopeObj.view.flxChannels.skin = "sknFlxffffffNoShadowbodere3e3round3px";
                if (info && info.isSelected === true) {
                    scopeObj.view.flxChannel2.skin = "slFbox";
                    scopeObj.view.lblChannel2.info.isSelected = false;
                    scopeObj.view.lblChannel2.skin = scopeObj.view.lblChannel2.info.normalSkin;
                    scopeObj.view.flxChannel3.skin = scopeObj.view.flxChannel3.skin === "bbSknFlxffffffWithShadow2" ? "bbSknFlxffffffWithShadow1" : "slFbox";
                    scopeObj.view.lblChannel2.accessibilityConfig = {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Selected") + " " + kony.i18n.getLocalizedString("i18n.alertSettings.NotifCenter") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
                    };
                } else {
                    scopeObj.view.flxChannel2.skin = scopeObj.view.flxChannel1.skin === "bbSknFlxffffffWithShadow1" ? "bbSknFlxffffffWithShadow2" : "bbSknFlxffffffWithShadow1";
                    scopeObj.view.lblChannel2.info.isSelected = true;
                    scopeObj.view.lblChannel2.skin = scopeObj.view.lblChannel2.info.selectedSkin;
                    scopeObj.view.flxChannel3.skin = scopeObj.view.flxChannel3.skin === "bbSknFlxffffffWithShadow1" ? "bbSknFlxffffffWithShadow2" : "slFbox";
                    scopeObj.view.lblChannel2.accessibilityConfig = {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Unselected") + " " + kony.i18n.getLocalizedString("i18n.alertSettings.NotifCenter") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
                    };
                }
            };
            this.view.flxChannel3.onClick = function() {
                var info = scopeObj.view.lblChannel3.info;
                scopeObj.view.flxChannels.skin = "sknFlxffffffNoShadowbodere3e3round3px";
                if (info && info.isSelected === true) {
                    scopeObj.view.flxChannel3.skin = "slFbox";
                    scopeObj.view.lblChannel3.info.isSelected = false;
                    scopeObj.view.lblChannel3.skin = scopeObj.view.lblChannel3.info.normalSkin;
                    scopeObj.view.flxChannel4.skin = scopeObj.view.flxChannel4.skin === "bbSknFlxffffffWithShadow2" ? "bbSknFlxffffffWithShadow1" : "slFbox";
                    scopeObj.view.lblChannel3.accessibilityConfig = {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Selected") + " " + kony.i18n.getLocalizedString("i18n.Alertsettings.PushNotifications") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
                    };
                } else {
                    scopeObj.view.flxChannel3.skin = scopeObj.view.flxChannel2.skin !== "slFbox" ? "bbSknFlxffffffWithShadow2" : "bbSknFlxffffffWithShadow1";
                    scopeObj.view.lblChannel3.info.isSelected = true;
                    scopeObj.view.lblChannel3.skin = scopeObj.view.lblChannel3.info.selectedSkin;
                    scopeObj.view.flxChannel4.skin = scopeObj.view.flxChannel4.skin === "bbSknFlxffffffWithShadow1" ? "bbSknFlxffffffWithShadow2" : "slFbox";
                    scopeObj.view.lblChannel3.accessibilityConfig = {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Unselected") + " " + kony.i18n.getLocalizedString("i18n.Alertsettings.PushNotifications") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
                    };
                }
            };
            this.view.flxChannel4.onClick = function() {
                var info = scopeObj.view.lblChannel4.info;
                scopeObj.view.flxChannels.skin = "sknFlxffffffNoShadowbodere3e3round3px";
                if (info && info.isSelected === true) {
                    scopeObj.view.flxChannel4.skin = "slFbox";
                    scopeObj.view.lblChannel4.skin = scopeObj.view.lblChannel4.info.normalSkin;
                    scopeObj.view.lblChannel4.info.isSelected = false;
                    scopeObj.view.lblChannel4.accessibilityConfig = {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Selected") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.SMS") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
                    };
                } else {
                    scopeObj.view.flxChannel4.skin = scopeObj.view.flxChannel3.skin !== "slFbox" ? "bbSknFlxffffffWithShadow2" : "bbSknFlxffffffWithShadow1";
                    scopeObj.view.lblChannel4.info.isSelected = true;
                    scopeObj.view.lblChannel4.skin = scopeObj.view.lblChannel4.info.selectedSkin;
                    scopeObj.view.lblChannel4.accessibilityConfig = {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Unselected") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.SMS") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
                    };
                }
            };
            this.view.flxChannel1Tab.onClick = function() {
                var info = scopeObj.view.lblChannel1Tab.info;
                scopeObj.view.flxChannelsTab.skin = "sknFlxffffffNoShadowbodere3e3round3px";
                if (info && info.isSelected === true) {
                    scopeObj.view.flxChannel1Tab.skin = "slFbox";
                    scopeObj.view.lblChannel1Tab.info.isSelected = false;
                    scopeObj.view.lblChannel1Tab.skin = scopeObj.view.lblChannel1Tab.info.normalSkin;
                    scopeObj.view.flxChannel2Tab.skin = scopeObj.view.flxChannel2Tab.skin === "bbSknFlxffffffWithShadow2" ? "bbSknFlxffffffWithShadow1" : "slFbox";
                    scopeObj.view.lblChannel1Tab.accessibilityConfig = {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Selected") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.EmailId") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
                    };
                } else {
                    scopeObj.view.flxChannel1Tab.skin = "bbSknFlxffffffWithShadow1";
                    scopeObj.view.lblChannel1Tab.info.isSelected = true;
                    scopeObj.view.lblChannel1Tab.skin = scopeObj.view.lblChannel1Tab.info.selectedSkin;
                    scopeObj.view.flxChannel2Tab.skin = scopeObj.view.flxChannel2Tab.skin === "bbSknFlxffffffWithShadow1" ? "bbSknFlxffffffWithShadow2" : "slFbox";
                    scopeObj.view.lblChannel1Tab.accessibilityConfig = {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Unselected") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.EmailId") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
                    };
                }
            };
            this.view.flxChannel2Tab.onClick = function() {
                var info = scopeObj.view.lblChannel2Tab.info;
                scopeObj.view.flxChannelsTab.skin = "sknFlxffffffNoShadowbodere3e3round3px";
                if (info && info.isSelected === true) {
                    scopeObj.view.flxChannel2Tab.skin = "slFbox";
                    scopeObj.view.lblChannel2Tab.info.isSelected = false;
                    scopeObj.view.lblChannel2Tab.skin = scopeObj.view.lblChannel2Tab.info.normalSkin;
                    scopeObj.view.flxChannel3Tab.skin = scopeObj.view.flxChannel3Tab.skin === "bbSknFlxffffffWithShadow2" ? "bbSknFlxffffffWithShadow1" : "slFbox";
                    scopeObj.view.lblChannel2Tab.accessibilityConfig = {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Selected") + " " + kony.i18n.getLocalizedString("i18n.alertSettings.NotifCenter") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
                    };
                } else {
                    scopeObj.view.flxChannel2Tab.skin = scopeObj.view.flxChannel1Tab.skin === "bbSknFlxffffffWithShadow1" ? "bbSknFlxffffffWithShadow2" : "bbSknFlxffffffWithShadow1";
                    scopeObj.view.lblChannel2Tab.info.isSelected = true;
                    scopeObj.view.lblChannel2Tab.skin = scopeObj.view.lblChannel2Tab.info.selectedSkin;
                    scopeObj.view.flxChannel3Tab.skin = scopeObj.view.flxChannel3Tab.skin === "bbSknFlxffffffWithShadow1" ? "bbSknFlxffffffWithShadow2" : "slFbox";
                    scopeObj.view.lblChannel2Tab.accessibilityConfig = {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Unselected") + " " + kony.i18n.getLocalizedString("i18n.alertSettings.NotifCenter") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
                    };
                }
            };
            this.view.flxChannel3Tab.onClick = function() {
                var info = scopeObj.view.lblChannel3Tab.info;
                scopeObj.view.flxChannelsTab.skin = "sknFlxffffffNoShadowbodere3e3round3px";
                if (info && info.isSelected === true) {
                    scopeObj.view.flxChannel3Tab.skin = "slFbox";
                    scopeObj.view.lblChannel3Tab.info.isSelected = false;
                    scopeObj.view.lblChannel3Tab.skin = scopeObj.view.lblChannel3Tab.info.normalSkin;
                    scopeObj.view.flxChannel4Tab.skin = scopeObj.view.flxChannel4Tab.skin === "bbSknFlxffffffWithShadow2" ? "bbSknFlxffffffWithShadow1" : "slFbox";
                    scopeObj.view.lblChannel3Tab.accessibilityConfig = {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Selected") + " " + kony.i18n.getLocalizedString("i18n.Alertsettings.PushNotifications") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
                    };
                } else {
                    scopeObj.view.flxChannel3Tab.skin = scopeObj.view.flxChannel2Tab.skin !== "slFbox" ? "bbSknFlxffffffWithShadow2" : "bbSknFlxffffffWithShadow1";
                    scopeObj.view.lblChannel3Tab.info.isSelected = true;
                    scopeObj.view.lblChannel3Tab.skin = scopeObj.view.lblChannel3Tab.info.selectedSkin;
                    scopeObj.view.flxChannel4Tab.skin = scopeObj.view.flxChannel4Tab.skin === "bbSknFlxffffffWithShadow1" ? "bbSknFlxffffffWithShadow2" : "slFbox";
                    scopeObj.view.lblChannel3Tab.accessibilityConfig = {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Unselected") + " " + kony.i18n.getLocalizedString("i18n.Alertsettings.PushNotifications") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
                    };
                }
            };
            this.view.flxChannel4Tab.onClick = function() {
                var info = scopeObj.view.lblChannel4Tab.info;
                scopeObj.view.flxChannelsTab.skin = "sknFlxffffffNoShadowbodere3e3round3px";
                if (info && info.isSelected === true) {
                    scopeObj.view.flxChannel4Tab.skin = "slFbox";
                    scopeObj.view.lblChannel4Tab.info.isSelected = false;
                    scopeObj.view.lblChannel4Tab.skin = scopeObj.view.lblChannel4Tab.info.normalSkin;
                    scopeObj.view.lblChannel4Tab.accessibilityConfig = {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Selected") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.SMS") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
                    };
                } else {
                    scopeObj.view.flxChannel4Tab.skin = scopeObj.view.flxChannel3Tab.skin !== "slFbox" ? "bbSknFlxffffffWithShadow2" : "bbSknFlxffffffWithShadow1";
                    scopeObj.view.lblChannel4Tab.info.isSelected = true;
                    scopeObj.view.lblChannel4Tab.skin = scopeObj.view.lblChannel4Tab.info.selectedSkin;
                    scopeObj.view.lblChannel4Tab.accessibilityConfig = {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Unselected") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.SMS") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
                    };
                }
            };
            // Frequency listboxes actions
            this.view.lstBoxFrequency1.onSelection = function() {
                scopeObj.displayBasedOnSelectedFrequency();
            };
            this.view.lstBoxFrequency2.onSelection = function() {
                scopeObj.view.lstBoxFrequency2.skin = "sknlbxalto42424215pxBordere3e3e32pxRadius";
            };
            this.view.lstBoxFrequency3.onSelection = function() {
                scopeObj.view.lstBoxFrequency3.skin = "sknlbxalto42424215pxBordere3e3e32pxRadius";
            };
            this.view.lstBoxFrequency1Tab.onSelection = function() {
                scopeObj.displayBasedOnSelectedFrequency();
            };
            this.view.lstBoxFrequency2Tab.onSelection = function() {
                scopeObj.view.lstBoxFrequency2Tab.skin = "sknlbxalto42424215pxBordere3e3e32pxRadius";
            };
            this.view.lstBoxFrequency3Tab.onSelection = function() {
                scopeObj.view.lstBoxFrequency3Tab.skin = "sknlbxalto42424215pxBordere3e3e32pxRadius";
            };

        },
    
       /**
         *Method is used to set master data for frequency
         **/
        setFrequencyData: function() {
            var category = [
                ["MONTHLY", "Monthly"],
                ["WEEKLY", "Weekly"],
                ["DAILY", "Daily"]
            ];
            var weekData = [
                ["SELECT", "Select"],
                ["MONDAY", "Monday"],
                ["TUESDAY", "Tuesday"],
                ["WEDNESDAY", "Wednesday"],
                ["THURSDAY", "Thursday"],
                ["FRIDAY", "Friday"],
                ["SATURDAY", "Saturday"],
                ["SUNDAY", "Sunday"]
            ]
            var monthDates = [
                ["SELECT", "Select"]
            ];
            for (var i = 1; i <= 31; i++) {
                monthDates.push([i.toString(), i.toString()]);
            }
            var time = [
                ["SELECT", "Select"]
            ];
            var timeString = "";
            for (var j = 1; j < 13; j++) {
                timeString = j;
                time.push([timeString + ":00AM", timeString + ":00AM"], [timeString + ":30AM", timeString + ":30AM"]);
            }
            for (var j = 1; j < 13; j++) {
                timeString = j;
                time.push([timeString + ":00PM", timeString + ":00PM"], [timeString + ":30PM", timeString + ":30PM"]);
            }
            this.frequencyList = {
                "category": category,
                "weeks": weekData,
                "dates": monthDates,
                "time": time
            };
        },
       /**
      *Method is used to set segment data at ALERT level
    **/
    setAlertLevelAlertsSegData : function(alertTypesData,isInitialLoad){
      var self=this;
      var widgetMap={
        "flxCategoryAlertsHeader":"flxCategoryAlertsHeader",
        "flxCategoryAlertsContainer":"flxCategoryAlertsContainer",
        "flxGroupCheckBox":"flxGroupCheckBox",
        "lblGroupCheckBoxIcon":"lblGroupCheckBoxIcon",
        "lblGroupName":"lblGroupName",
        "lblGroupAlertsCount":"lblGroupAlertsCount",
        "flxFrequencyFields":"flxFrequencyFields",
        "lblFrequencyTitle":"lblFrequencyTitle",
        "flxFrequency":"flxFrequency",
        "flxFrequencyBox1":"flxFrequencyBox1",
        "lstBoxFrequency1":"lstBoxFrequency1",
        "flxFrequencyBox2":"flxFrequencyBox2",
        "lstBoxFrequency2":"lstBoxFrequency2",
        "flxFrequencyBox3":"flxFrequencyBox3",
        "lstBoxFrequency3":"lstBoxFrequency3",
        "flxChannels":"flxChannels",
        "flxChannel1":"flxChannel1",
        "lblChannel1":"lblChannel1",
        "flxVerticalSeparator1":"flxVerticalSeparator1",
        "flxChannel2":"flxChannel2",
        "lblChannel2":"lblChannel2",
        "flxVerticalSeparator2":"flxVerticalSeparator2",
        "flxChannel3":"flxChannel3",
        "lblChannel3":"lblChannel3",
        "flxVerticalSeparator3":"flxVerticalSeparator3",
        "flxChannel4":"flxChannel4",
        "lblChannel4":"lblChannel4",
        "flxGroupAlertRowDW":"flxGroupAlertRowDW",
        "flxGroupAlertRowTablet":"flxGroupAlertRowTablet",
        "flxGroupAlertRowMobile":"flxGroupAlertRowMobile",
        "flxAlert":"flxAlert",
        "flxFullSeperator":"flxFullSeperator",
        "flxdummy":"flxdummy",
        "flxAlertName":"flxAlertName",
        "flxAlertCheckBox":"flxAlertCheckBox",
        "lblAlertCheckBoxIcon":"lblAlertCheckBoxIcon",
        "lblAlertName":"lblAlertName",
        "flxAmountAttribute":"flxAmountAttribute",
        "flxAttributeValues":"flxAttributeValues",
        "flxAlertAttribute1":"flxAlertAttribute1",
        "lblAttributeTitle1":"lblAttributeTitle1",
        "lblFromValue":"lblFromValue",
        "flxAmount1":"flxAmount1",
        "lblCurrencySymbol1":"lblCurrencySymbol1",
        "tbxAmount1":"tbxAmount1",
        "flxAlertAttribute2":"flxAlertAttribute2",
        "lblToValue":"lblToValue",
        "flxAmount2":"flxAmount2",
        "lblCurrencySymbol2":"lblCurrencySymbol2",
        "tbxAmount2":"tbxAmount2",
        "flxAlertAttribute3":"flxAlertAttribute3",
        "lblAttributeTitle3":"lblAttributeTitle3",
        "lblToValue2":"lblToValue2",
        "flxAmount3":"flxAmount3",
        "lblCurrencySymbol3":"lblCurrencySymbol3",
        "tbxAmount3":"tbxAmount3",
        "flxSeperator":"flxSeperator" ,
        "showToVal":"showToVal",
        "recordData":"recordData",
        "alertsubtype_id":"alertsubtype_id",
        "alerttype_id":"alerttype_id",
        "supportedChannels":"supportedChannels",
        "subscribedChannels":"subscribedChannels"
      };
      var segData=[];
      var rows=[];
      var subscribedAlertsCount=0;
      for(var i=0;i<alertTypesData.length;i++){
        var sectionData = self.mapAlertLevelGroupSection(alertTypesData[i]);
        rows=[];
        subscribedAlertsCount=0;
        if(alertTypesData[i].alertSubTypes.length>0){
          for(var j=0;j<alertTypesData[i].alertSubTypes.length;j++){
            rows.push(self.mapAlertLevelAlertRow(alertTypesData[i].alertSubTypes[j],alertTypesData[i].isSubscribed,isInitialLoad));
            if(alertTypesData[i].alertSubTypes[j].isSubscribed==="true"){
              subscribedAlertsCount++;
            }
          }
          rows[rows.length-1].flxSeperator.isVisible=false;
          rows[rows.length-1].flxFullSeperator.isVisible=true;
          if (kony.application.getCurrentBreakpoint() === 640  || orientationHandler.isMobile){
            rows[rows.length-1].flxSeperator.isVisible=false;
            rows[rows.length-1].flxFullSeperator.isVisible=false;
            rows[rows.length-1].flxdummy.isVisible=true;
            rows[rows.length-1].flxAlert.skin="sknFlxfffffborder4rd";
          } 
        }
        if((subscribedAlertsCount!==alertTypesData[i].alertSubTypes.length)&&alertTypesData[i].isSubscribed==="true")
          sectionData.lblGroupCheckBoxIcon.text="z";
        if(alertTypesData[i].isSubscribed==="true"){
          sectionData.lblGroupAlertsCount.text="("+subscribedAlertsCount+"/"+alertTypesData[i].alertSubTypes.length+")";
          sectionData.lblGroupAlertsCount.isVisible=true;
        }
        segData.push([sectionData,rows]);
      }
      this.view.segAlertsListing.widgetDataMap=widgetMap;
      this.view.segAlertsListing.setData(segData);
      this.view.forceLayout();
    },
    /**
      *Method is used to set mapping data for Group section at ALERT/CATEGORY level
    **/
    mapAlertLevelGroupSection : function(secData){
      var self=this;
    return {
      "alerttype_id": secData.alerttype_id,
	  "flxGroupCheckBox":{"onClick":self.toggleGroupCheckBox,
                        "accessibilityConfig": {
                            "a11yARIA": {
                                "tabindex": -1
                            }
                        }},
	  "lblGroupCheckBoxIcon":{"text": secData.isSubscribed === "true" ? "C" : "D",
                    "skin": OLBConstants.SKINS.CHECKBOX_UNSELECTED_SKIN,
					"accessibilityConfig": {
                        "a11yLabel": secData.isSubscribed === "true" ? kony.i18n.getLocalizedString("i18n.accountSettings.checked") + " " +  secData.alerttypetext_DisplayName: kony.i18n.getLocalizedString("i18n.accountSettings.unchecked")+ " " +  secData.alerttypetext_DisplayName,
                        "a11yARIA": {
                          "role": "checkbox",
                          "aria-checked": secData.isSubscribed === "true" ? "true" : "false",
                          "aria-disabled": secData.isSubscribed === "true" ? "false" : "true",
                          "tabindex": 0
                        }
                    }},
      "lblGroupName":{"text":secData.alerttypetext_DisplayName
                },
	  "lblGroupAlertsCount":{"isVisible":false,"text":"0/"+secData.alertSubTypes.length},
      "isEdited":false,
      "flxCategoryAlertsContainer":{"skin":"sknFlxf8f7f8BorderRad4px"},
      "template":"flxCategoryAlertsHeader",
    };
  },
  /**
      *Method is used to set mapping data for Alert section at ALERT level
  **/
  mapAlertLevelAlertRow : function(rowData,isGroupSubscribed,isInitialLoad){
    var self =this;
    var showToVal=false;
    var template="";
    var isTablet=false;
    var frqText1="";
    var frqText2="SELECT";
    var frqText3="SELECT";
    var showSep =true;
    var fullsep = false;
    if (kony.application.getCurrentBreakpoint() === 1024  || orientationHandler.isTablet){
      template="flxGroupAlertRowTablet";
      isTablet=true;
    } else if (kony.application.getCurrentBreakpoint() === 640  || orientationHandler.isMobile){
      template="flxGroupAlertRowMobile";
       isTablet=true;
      showSep=false;
      fullsep = true;
    } else{
      template="flxGroupAlertRowDW";
    }
    if(rowData.alertCondition && rowData.alertCondition.id==="IN_BETWEEN")
      showToVal=true;
    if(rowData.subscribedFrequency){
      frqText1=rowData.subscribedFrequency[0].alertFrequencyId;
      frqText2=rowData.subscribedFrequency[0].frequencyValue===""||rowData.subscribedFrequency[0].frequencyValue==="null"||rowData.subscribedFrequency[0].frequencyValue==="0"||rowData.subscribedFrequency[0].frequencyValue===undefined?"SELECT":rowData.subscribedFrequency[0].frequencyValue;
      frqText3=applicationManager.getFormatUtilManager().getTwelveHourTimeString(rowData.subscribedFrequency[0].frequencyTime);
    }
    var rowJSON= {
      "recordData":rowData,
      "alertsubtype_id": rowData.alertsubtype_id,
      "flxAlertCheckBox":{"onClick":self.toggleAlertCheckBox,
                          "accessibilityConfig":{
                              "a11yARIA":{
                                "tabindex": -1
                              }
                          }},
      "lblAlertCheckBoxIcon" :{"text": isGroupSubscribed === "true" && rowData.isSubscribed === "true" ? "C" : "D",
                    "skin": OLBConstants.SKINS.CHECKBOX_UNSELECTED_SKIN,
					"accessibilityConfig": {
                        "a11yLabel": isGroupSubscribed === "true" && rowData.isSubscribed === "true" ? kony.i18n.getLocalizedString("i18n.accountSettings.checked") + " " +  rowData.alertsubtypetext_displayName : kony.i18n.getLocalizedString("i18n.accountSettings.unchecked")+ " " +  rowData.alertsubtypetext_displayName,
                        "a11yARIA":{
                          "tabindex": 0
                        }
                    }
                   },
      "lblAlertName":{"text":rowData.alertsubtypetext_displayName},
      "flxFrequencyFields":{"isVisible":isGroupSubscribed==="true"&&rowData.isSubscribed==="true"&&self.enableFrequency&&frqText1!==""?true:false},
      "flxFrequencyBox1":{"width":isTablet===true?(frqText2==="SELECT"?"49%":"100%"):"28%"},
      "flxFrequencyBox3":{"top":isTablet===true?(frqText2==="SELECT"?"0dp":"50dp"):"0dp"},
      "flxFrequencyBox2":{"isVisible":frqText2==="SELECT"?false:true},
      "lstBoxFrequency1":{"masterData":self.frequencyList.category,"selectedKey":frqText1!==""?frqText1:"DAILY","onSelection":function(){self.onFrequencySelection(arguments[1],1)},"skin":"sknlbxalto42424215pxBordere3e3e32pxRadius"},
      "lstBoxFrequency2":{"masterData":frqText1==="MONTHLY"?self.frequencyList.dates:self.frequencyList.weeks,"selectedKey": frqText2,"onSelection":function(){self.onFrequencySelection(arguments[1],2)},"skin":"sknlbxalto42424215pxBordere3e3e32pxRadius"},
      "lstBoxFrequency3":{"masterData":self.frequencyList.time,"selectedKey": frqText3,"onSelection":function(){self.onFrequencySelection(arguments[1],3)},"skin":"sknlbxalto42424215pxBordere3e3e32pxRadius"},
      "flxAmountAttribute":{"isVisible":isGroupSubscribed==="true"&&rowData.isSubscribed==="true"&&rowData.alertAttribute?true:false},
      "lblAttributeTitle1":{"text":rowData.alertsubtypetext_description},
      "lblFromValue":{"text":kony.i18n.getLocalizedString("i18n.alertSettings.FromValue"),"isVisible":showToVal},
      "flxAmount1":{"skin":"sknBorder727272bgffffff"},
      "tbxAmount1":{"text":rowData.alertsubtype_value1?rowData.alertsubtype_value1:"0"},
      "flxAlertAttribute2":{"isVisible":isTablet===false&&showToVal},
      "flxAmount2":{"skin":"sknBorder727272bgffffff"},
      "tbxAmount2":{"text":rowData.alertsubtype_value2?rowData.alertsubtype_value2:"0"},
      "flxAlertAttribute3":{"isVisible":rowData.isSubscribed==="true"&&isTablet&&showToVal},
      "flxAmount3":{"skin":"sknBorder727272bgffffff"},
      "tbxAmount3":{"text":rowData.alertsubtype_value2?rowData.alertsubtype_value2:"0"},
      "flxChannels":{"width":"220px","isVisible":true},
      "flxChannel1":{"skin":"slFbox","isVisible":true,"onClick":function(){self.channelOnClick(1)}},
      "lblChannel1":{"text":"v","skin":"slFbox","info":{},"accessibilityConfig": {"a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Unselected") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.EmailId") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")}},
      "flxChannel2":{"skin":"slFbox","isVisible":true,"onClick":function(){self.channelOnClick(2)}},
      "lblChannel2":{"text":"w","skin":"slFbox","info":{},"accessibilityConfig": {"a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Unselected") + " " + kony.i18n.getLocalizedString("i18n.alertSettings.NotifCenter") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")}},
      "flxChannel3":{"skin":"slFbox","isVisible":true,"onClick":function(){self.channelOnClick(3)}},
      "lblChannel3":{"text":"x","skin":"slFbox","info":{},"accessibilityConfig": {"a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Unselected") + " " + kony.i18n.getLocalizedString("i18n.Alertsettings.PushNotifications") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")}},
      "flxChannel4":{"skin":"slFbox","isVisible":true,"onClick":function(){self.channelOnClick(4)}},
      "lblChannel4":{"text":"y","skin":"slFbox","info":{},"accessibilityConfig": {"a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Unselected") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.SMS") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")}},
      "flxVerticalSeparator1":{"isVisible":true},
      "flxVerticalSeparator2":{"isVisible":true},
      "flxVerticalSeparator3":{"isVisible":true},
      "flxSeperator":{"isVisible":showSep},
      "flxFullSeperator":{"isVisible":fullsep},
      "flxAlert":{"skin":"sknFlxffffffBordere3e3e3"},
      "flxdummy":{"isVisible":false},
      "supportedChannels":rowData.supportedChannels,
      "subscribedChannels":rowData.subscribedChannels?rowData.subscribedChannels:"",
      "showToVal":showToVal,
      "template":template,
    };
    var finalJSON=[];
    finalJSON=self.setAlertChannelsToUI(rowData.supportedChannels,rowJSON.lblAlertCheckBoxIcon.text==="C"?rowJSON.subscribedChannels:"",rowJSON);
    return finalJSON;
  },
    /**
      *Method is used to set segment data at GROUP level
    **/
    setGroupLevelAlertsSegData: function(alertTypesData,isInitialLoad){
      var self=this;
      var widgetMap={
        "flxGroupAlertsHeaderDW":"flxGroupAlertsHeaderDW",
        "flxGroupAlertsHeaderTablet":"flxGroupAlertsHeaderTablet",
        "flxGroupAlertsHeaderMobile":"flxGroupAlertsHeaderMobile",
        "flxGroupAlertsContainer":"flxGroupAlertsContainer",
        "flxGroupAlertsContainerTablet":"flxGroupAlertsContainerTablet",
        "flxGroupCheckBox":"flxGroupCheckBox",
        "lblGroupCheckBoxIcon":"lblGroupCheckBoxIcon",
        "lblGroupName":"lblGroupName",
        "flxFrequencyFields":"flxFrequencyFields",
        "lblFrequencyTitle":"lblFrequencyTitle",
        "flxFrequency":"flxFrequency",
        "flxFrequencyBox1":"flxFrequencyBox1",
        "flxFrequencyBox2":"flxFrequencyBox2",
        "flxFrequencyBox3":"flxFrequencyBox3",
        "lstBoxFrequency1":"lstBoxFrequency1",
        "lstBoxFrequency2":"lstBoxFrequency2",
        "lstBoxFrequency3":"lstBoxFrequency3",
        "lblChannelsTitle":"lblChannelsTitle",
        "flxChannels":"flxChannels",
        "flxChannel1":"flxChannel1",
        "lblChannel1":"lblChannel1",
        "flxVerticalSeparator1":"flxVerticalSeparator1",
        "flxChannel2":"flxChannel2",
        "lblChannel2":"lblChannel2",
        "flxVerticalSeparator2":"flxVerticalSeparator2",
        "flxChannel3":"flxChannel3",
        "lblChannel3":"lblChannel3",
        "flxVerticalSeparator3":"flxVerticalSeparator3",
        "flxChannel4":"flxChannel4",
        "lblChannel4":"lblChannel4",
        "flxCategoryAlertRow":"flxCategoryAlertRow",
        "flxAlert":"flxAlert",
        "flxdummy":"flxdummy",
        "flxFullSeperator":"flxFullSeperator",
        "lblAlertName":"lblAlertName",
        "flxAttributes":"flxAttributes",
        "flxAttributeValues":"flxAttributeValues",
        "flxAlertAttribute1":"flxAlertAttribute1",
        "lblAttributeTitle1":"lblAttributeTitle1",
        "lblFromValue":"lblFromValue",
        "flxAmount1":"flxAmount1",
        "lblCurrencySymbol1":"lblCurrencySymbol1",
        "tbxAmount1":"tbxAmount1",
        "flxAlertAttribute2":"flxAlertAttribute2",
        "lblToValue":"lblToValue",
        "flxAmount2":"flxAmount2",
        "lblCurrencySymbol2":"lblCurrencySymbol2",
        "tbxAmount2":"tbxAmount2",
        "flxAlertAttribute3":"flxAlertAttribute3",
        "lblAttributeTitle3":"lblAttributeTitle3",
        "lblToValue2":"lblToValue2",
        "flxAmount3":"flxAmount3",
        "lblCurrencySymbol3":"lblCurrencySymbol3",
        "tbxAmount3":"tbxAmount3",
        "flxSeperator":"flxSeperator",
        "flxFullSeperator":"flxFullSeperator",
        "showToVal":"showToVal",
        "recordData":"recordData",
        "alertsubtype_id":"alertsubtype_id",
        "alerttype_id":"alerttype_id",
        "supportedChannels":"supportedChannels",
        "lblSegRoleSeperator":"lblSegRoleSeperator",
        "subscribedChannels":"subscribedChannels"
      };
      var segData=[];
      var rows=[];
      for(var i=0;i<alertTypesData.length;i++){
        var sectionData = self.mapGroupLevelGroupSection(alertTypesData[i],isInitialLoad);
        rows=[];
        if(alertTypesData[i].alertSubTypes.length>0){
          for(var j=0;j<alertTypesData[i].alertSubTypes.length;j++){
            rows.push(self.mapGroupLevelAlertRow(alertTypesData[i].alertSubTypes[j],alertTypesData[i].isSubscribed));
          }
          rows[rows.length-1].flxSeperator.isVisible=false;
          rows[rows.length-1].flxFullSeperator.isVisible=true;
          if (kony.application.getCurrentBreakpoint() === 640  || orientationHandler.isMobile){
            rows[rows.length-1].flxSeperator.isVisible=false;
            rows[rows.length-1].flxFullSeperator.isVisible=false;
            rows[rows.length-1].flxdummy.isVisible=true;
            rows[rows.length-1].flxAlert.skin="sknFlxfffffborder4rd";
          } 
        }
       else if (kony.application.getCurrentBreakpoint() === 640  || orientationHandler.isMobile){
           sectionData.flxGroupAlertsContainerTablet.skin="skflxbgf7f8f7border4pxe3e3e3"; 
          }
        segData.push([sectionData,rows]);
      }
      this.view.segAlertsListing.widgetDataMap=widgetMap;
      this.view.segAlertsListing.setData(segData);
      this.view.forceLayout();
    },
    /**
      *Method is used to set mapping for group section at GROUP level
    **/
    mapGroupLevelGroupSection : function(secData,isInitialLoad){
      var self=this;
      var isTablet=false;
      var template="flxGroupAlertsHeaderDW";
      var dropDownSkin="sknLblOlbFontIconsA0A0A012Px";
      var frqText1="";
      var frqText2="SELECT";
      var frqText3="SELECT";
      var showSep = false;
      var fullsep = true;
      if (kony.application.getCurrentBreakpoint() === 1024  || orientationHandler.isTablet){
        template="flxGroupAlertsHeaderTablet";
        isTablet=true;
      } else  if (kony.application.getCurrentBreakpoint() === 640  || orientationHandler.isMobile){
        template="flxGroupAlertsHeaderMobile";
         isTablet=true;
          showSep=false;
      fullsep = true;
      } else{
        template="flxGroupAlertsHeaderDW";
      }
      if(secData.subscribedFrequency){
        frqText1=secData.subscribedFrequency[0].alertFrequencyId;
        frqText2=secData.subscribedFrequency[0].frequencyValue===""||secData.subscribedFrequency[0].frequencyValue==="null"||secData.subscribedFrequency[0].frequencyValue==="0"||secData.subscribedFrequency[0].frequencyValue===undefined?"SELECT":secData.subscribedFrequency[0].frequencyValue;
        frqText3=secData.subscribedFrequency[0].frequencyTime ? applicationManager.getFormatUtilManager().getTwelveHourTimeString(secData.subscribedFrequency[0].frequencyTime) : "SELECT";
      }
      if(secData.isSubscribed==="true")
        dropDownSkin="sknLblFontTypeIcon1a98ff12pxOther";
      var rowJSON= {
        "alerttype_id": secData.alerttype_id,
        "flxGroupCheckBox":{"onClick":self.toggleGroupCheckBox,
                            "accessibilityConfig": {
                                "a11yARIA": {
                                    "tabindex": -1
                                 }
                            }},
        "lblGroupCheckBoxIcon":{ "text": secData.isSubscribed === "true" ? "C" : "D",
                    "skin": OLBConstants.SKINS.CHECKBOX_UNSELECTED_SKIN,
					"accessibilityConfig": {
                        "a11yLabel": secData.isSubscribed === "true" ? kony.i18n.getLocalizedString("i18n.accountSettings.checked") + " " +  secData.alerttypetext_DisplayName: kony.i18n.getLocalizedString("i18n.accountSettings.unchecked")+ " " +  secData.alerttypetext_DisplayName,
                        "a11yARIA": {
                          "role": "checkbox",
                          "aria-checked": secData.isSubscribed === "true" ? "true" : "false",
                          "aria-disabled": secData.isSubscribed === "true" ? "false" : "true",
                          "tabindex": 0
                        }
                     }
                   },
        "lblGroupName":{"text":secData.alerttypetext_DisplayName
                },
        "flxFrequencyFields":{"isVisible":self.enableFrequency&&frqText1!==""?true:false},
        "flxFrequencyBox1":{"width":isTablet===true?(frqText2==="SELECT"?"49%":"100%"):"28%"},
        "flxFrequencyBox3":{"top":isTablet===true?(frqText2==="SELECT"?"0dp":"50dp"):"0dp"},
        "flxFrequencyBox2":{"isVisible":frqText2==="SELECT"?false:true},
        "lstBoxFrequency1":{"masterData":self.frequencyList.category,"selectedKey": frqText1===""?"DAILY":frqText1,"onSelection":function(){self.onFrequencySelection(arguments[1],1)},"skin":"sknlbxalto42424215pxBordere3e3e32pxRadius"},
        "lstBoxFrequency2":{"masterData":frqText1==="MONTHLY"?self.frequencyList.dates:self.frequencyList.weeks,"selectedKey": frqText2,"onSelection":function(){self.onFrequencySelection(arguments[1],2)},"skin":"sknlbxalto42424215pxBordere3e3e32pxRadius"},
        "lstBoxFrequency3":{"masterData":self.frequencyList.time,"selectedKey": frqText3,"onSelection":function(){self.onFrequencySelection(arguments[1],3)},"skin":"sknlbxalto42424215pxBordere3e3e32pxRadius"},
        "lblChannelsTitle":{"text":kony.i18n.getLocalizedString("i18n.Alerts.SelectChannels")
                },
        "lblFrequencyTitle":{"text":kony.i18n.getLocalizedString("i18n.PayPerson.frequency")
               },
        "flxChannels":template === "flxGroupAlertsHeaderDW" ? {"width":"180px"} :{"width":"220px"},
        "flxChannel1":{"skin":"slFbox","isVisible":true,"onClick":function(){self.channelOnClick(1)}},
        "lblChannel1":{"text":"v","skin":"slFbox","info":{},"accessibilityConfig": {"a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Unselected") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.EmailId") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")}},
        "flxChannel2":{"skin":"slFbox","isVisible":true,"onClick":function(){self.channelOnClick(2)}},
        "lblChannel2":{"text":"w","skin":"slFbox","info":{},"accessibilityConfig": {"a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Unselected") + " " + kony.i18n.getLocalizedString("i18n.alertSettings.NotifCenter") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")}},
        "flxChannel3":{"skin":"slFbox","isVisible":true,"onClick":function(){self.channelOnClick(3)}},
        "lblChannel3":{"text":"x","skin":"slFbox","info":{},"accessibilityConfig": {"a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Unselected") + " " + kony.i18n.getLocalizedString("i18n.Alertsettings.PushNotifications") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")}},
        "flxChannel4":{"skin":"slFbox","isVisible":true,"onClick":function(){self.channelOnClick(4)}},
        "lblChannel4":{"text":"y","skin":"slFbox","info":{},"accessibilityConfig": {"a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Unselected") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.SMS") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")}},
        "flxVerticalSeparator1":{"isVisible":true},
        "flxVerticalSeparator2":{"isVisible":true},
        "flxVerticalSeparator3":{"isVisible":true},
        "flxSeperator":{"isVisible":showSep},
         "flxFullSeperator":{"isVisible":fullsep},
         "flxAlert":{"skin":"sknFlxffffffBordere3e3e3"},
         "flxdummy":{"isVisible":false},
        "flxGroupAlertsContainerTablet":{"skin":"sknFlxf8f7f8BorderRad4px"},
        "supportedChannels":secData.supportedChannels,
        "subscribedChannels":secData.subscribedChannels?secData.subscribedChannels:"",
        "template":template
    };
    var finalJSON=[];
    finalJSON=self.setAlertChannelsToUI(secData.supportedChannels,rowJSON.lblGroupCheckBoxIcon.text==="C"?rowJSON.subscribedChannels:"",rowJSON);
    return finalJSON;
    },
    /**
      *Method is used to set mapping for alert section at GROUP/CATEGORY level
    **/
    mapGroupLevelAlertRow: function(rowData,isGroupSubscribed){
      var isTablet=false;
      var showToVal=false;
      var showSep =true;
      var fullsep = false;
      if (kony.application.getCurrentBreakpoint() === 1024  || orientationHandler.isTablet){
        isTablet=true;
     }
      else  if (kony.application.getCurrentBreakpoint() === 640  || orientationHandler.isMobile){
        showSep = false;
        fullsep = true;
      }
      if(rowData.alertCondition && rowData.alertCondition.id==="IN_BETWEEN")
      showToVal=true;
      return{
        "recordData":rowData,
        "alertsubtype_id": rowData.alertsubtype_id,
        "lblAlertName":{"text":rowData.alertsubtypetext_displayName},
        "flxAttributes":{"isVisible":isGroupSubscribed==="true"&&rowData.alertAttribute?true:false},
        "lblAttributeTitle1":{"text":rowData.alertsubtypetext_description},
        "lblFromValue":{"text":kony.i18n.getLocalizedString("i18n.alertSettings.FromValue"),"isVisible":showToVal},
        "tbxAmount1":{"text":rowData.alertsubtype_value1?rowData.alertsubtype_value1:"0"},
        "flxAmount1":{"skin":"sknBorder727272bgffffff"},
        "flxAmount2":{"skin":"sknBorder727272bgffffff"},
        "flxAmount3":{"skin":"sknBorder727272bgffffff"},
        "flxAlertAttribute2":{"isVisible":isTablet===false&&showToVal},
        "tbxAmount2":{"text":rowData.alertsubtype_value2?rowData.alertsubtype_value2:"0"},
        "flxAlertAttribute3":{"isVisible":isGroupSubscribed==="true"&&isTablet&&showToVal?true:false},
        "tbxAmount3":{"text":rowData.alertsubtype_value2?rowData.alertsubtype_value2:"0"},
        "flxSeperator":{"isVisible":showSep},
        "flxFullSeperator":{"isVisible":fullsep},
        "flxAlert":{"skin":"sknFlxffffffBordere3e3e3"},
        "flxdummy":{"isVisible":false},
        "showToVal":showToVal,
        "template":"flxCategoryAlertRow"
      }
    },
    /**
      *Method is used to set data for segment at CATEGORY level
    **/
    setCategoryLevelAlertsSegData : function(alertTypesData){
      var self=this;
      var widgetMap={
        "flxCategoryAlertsHeader":"flxCategoryAlertsHeader",
        "flxCategoryAlertsContainer":"flxCategoryAlertsContainer",
        "flxGroupCheckBox":"flxGroupCheckBox",
        "lblGroupCheckBoxIcon":"lblGroupCheckBoxIcon",
        "lblGroupName":"lblGroupName",
        "lblGroupAlertsCount":"lblGroupAlertsCount",
        "flxCategoryAlertRow":"flxCategoryAlertRow",
        "flxAlert":"flxAlert",
        "flxdummy":"flxdummy",
        "flxFullSeperator":"flxFullSeperator",
        "lblAlertName":"lblAlertName",
        "flxAttributes":"flxAttributes",
        "flxAttributeValues":"flxAttributeValues",
        "flxAlertAttribute1":"flxAlertAttribute1",
        "lblAttributeTitle1":"lblAttributeTitle1",
        "lblFromValue":"lblFromValue",
        "flxAmount1":"flxAmount1",
        "lblCurrencySymbol1":"lblCurrencySymbol1",
        "tbxAmount1":"tbxAmount1",
        "flxAlertAttribute2":"flxAlertAttribute2",
        "lblToValue":"lblToValue",
        "flxAmount2":"flxAmount2",
        "lblCurrencySymbol2":"lblCurrencySymbol2",
        "tbxAmount2":"tbxAmount2",
        "flxAlertAttribute3":"flxAlertAttribute3",
        "lblAttributeTitle3":"lblAttributeTitle3",
        "lblToValue2":"lblToValue2",
        "flxAmount3":"flxAmount3",
        "lblCurrencySymbol3":"lblCurrencySymbol3",
        "tbxAmount3":"tbxAmount3",
        "flxSeperator":"flxSeperator",
        "flxFullSeperator":"flxFullSeperator",
        "showToVal":"showToVal",
        "recordData":"recordData",
        "alertsubtype_id":"alertsubtype_id",
        "alerttype_id":"alerttype_id"
      };
      var segData=[];
      var rows=[];
      for(var i=0;i<alertTypesData.length;i++){
        var sectionData = self.mapAlertLevelGroupSection(alertTypesData[i]);
        rows=[];
        if(alertTypesData[i].alertSubTypes.length>0){
          for(var j=0;j<alertTypesData[i].alertSubTypes.length;j++){
            rows.push(self.mapGroupLevelAlertRow(alertTypesData[i].alertSubTypes[j],alertTypesData[i].isSubscribed));
          }
          rows[rows.length-1].flxSeperator.isVisible=false;
          rows[rows.length-1].flxFullSeperator.isVisible=true;
          if (kony.application.getCurrentBreakpoint() === 640  || orientationHandler.isMobile){
            rows[rows.length-1].flxSeperator.isVisible=false;
            rows[rows.length-1].flxFullSeperator.isVisible=false;
            rows[rows.length-1].flxdummy.isVisible=true;
            rows[rows.length-1].flxAlert.skin="sknFlxfffffborder4rd";
          } 
        }
        else if (kony.application.getCurrentBreakpoint() === 640  || orientationHandler.isMobile){
        sectionData.flxCategoryAlertsContainer.skin="skflxbgf7f8f7border4pxe3e3e3"; 
        }
        segData.push([sectionData,rows]);
      }
      this.view.segAlertsListing.widgetDataMap=widgetMap;
      this.view.segAlertsListing.setData(segData);
      this.view.forceLayout();
    },
    /**
      *Method is used to set channels data for group/alert sections at GROUP/ALERT level respectively
    **/
    setAlertChannelsToUI: function(supportedChannels,subscribedChannels,rowJSON){
 var channelsData=supportedChannels.split(",");
      var channelIcons={"CH_SMS":{"text":"v","normalSkin":"sknLblSMS727272FontIcon","selectedSkin":"sknLblSMS003e75FontIcon"},"CH_NOTIFICATION_CENTER":{"text":"y","normalSkin":"sknLblNotification727272FontIcon","selectedSkin":"sknLblNotification003e75FontIcon"},"CH_PUSH_NOTIFICATION":{"text":"x","normalSkin":"sknLblPush727272FontIcon","selectedSkin":"sknLblPush003e75FontIcon"},"CH_EMAIL":{"text":"w","normalSkin":"sknLblEmail727272FontIcon","selectedSkin":"sknLblEmail003e75FontIcon"}};
      for(var i=0;i<channelsData.length;i++){
         if (kony.application.getCurrentBreakpoint() === 640  || orientationHandler.isMobile){
          // by default all skin = slfboxdeselectedrighte3e3e3
           rowJSON["flxChannel"+(i+1)].skin="slfboxdeselectedrighte3e3e3";
          rowJSON["flxChannel"+(i+1)].isVisible=true;
          rowJSON["lblChannel"+(i+1)].text=channelIcons[channelsData[i]].text;
           if(i<=2)
           rowJSON["flxVerticalSeparator"+(i+1)].isVisible=false;
          rowJSON["lblChannel"+(i+1)].info={"id":channelsData[i],"isSelected":false,"normalSkin":channelIcons[channelsData[i]].selectedSkin,"selectedSkin":channelIcons[channelsData[i]].selectedSkin};
          rowJSON["lblChannel"+(i+1)].skin=rowJSON["lblChannel"+(i+1)].info.normalSkin;
           if(subscribedChannels.indexOf(channelsData[i])>=0){
           /* rowJSON["lblChannel"+(i+1)].info.isSelected=true;
            rowJSON["lblChannel"+(i+1)].skin=rowJSON["lblChannel"+(i+1)].info.selectedSkin;
            rowJSON["flxChannel"+(i+1)].skin=rowJSON["flxChannel"+i]&&rowJSON["flxChannel"+i].skin==="slFbox"?"bbSknFlxffffffWithShadow1": "bbSknFlxffffffWithShadow2";
            }else{/*/
            
            rowJSON["lblChannel"+(i+1)].skin=rowJSON["lblChannel"+(i+1)].info.normalSkin;
            rowJSON["lblChannel"+(i+1)].info.isSelected=true;
           var opt =i+1;
           switch(opt)
             {

               case 1 :  
                 rowJSON["flxChannel"+(opt)].skin="sknFlxBgFFFFFFBr003e75Rd3pxlefttopbottom2";
                 rowJSON["lblChannel"+(opt+1)].skin=rowJSON["lblChannel"+(opt+1)].info.selectedSkin;
                 break;
               case 2 : 
                 if(rowJSON["lblChannel"+(opt-1)].info.isSelected) {
                   rowJSON["flxChannel"+(opt)].skin="sknFlxBgFFFFFFBr003e75Noborder2";
                   rowJSON["flxChannel"+(opt-1)].skin="sknFlxBgFFFFFFBr003e75Rd3pxlefttopbottom";
                 }
                 else 
                 {
                   rowJSON["flxChannel"+(opt)].skin="sknFlxBgFFFFFFBr003e75Noborder";
                   rowJSON["flxChannel"+(opt-1)].skin="slFbox";
                 }
                 break;
               case 3 : 
                 if(rowJSON["lblChannel"+(opt-1)].info.isSelected) {
                   rowJSON["flxChannel"+(opt)].skin="sknFlxBgFFFFFFBr003e75Noborder2";
                   rowJSON["flxChannel"+(opt-1)].skin="sknFlxBgFFFFFFBr003e75Noborder";
                 }
                 else
                 {
                   rowJSON["flxChannel"+(opt)].skin="sknFlxBgFFFFFFBr003e75Noborder";
                   rowJSON["flxChannel"+(opt-1)].skin="slfboxdeselectedrighte3e3e3";
                   // rowJSON["flxChannel"+(opt-2)].skin="slFbox";
                 }
                 break; 
               case 4 : 
                 if(rowJSON["lblChannel"+(opt-1)].info.isSelected) {
                   rowJSON["flxChannel"+(opt)].skin="sknFlxBgFFFFFFBr003e75Rd3pxrighttopbottom";
                   rowJSON["flxChannel"+(opt-1)].skin="sknFlxBgFFFFFFBr003e75Noborder";
                 }
                 else
                 {
                   rowJSON["flxChannel"+(opt)].skin="sknFlxBgFFFFFFBr003e75Rd3pxrighttopbottom";
                   rowJSON["flxChannel"+(opt-1)].skin="slFbox";
                   // rowJSON["flxChannel"+(opt-2)].skin="slFbox";
                 }
                 break;  
             }
         }
           else
             {
            rowJSON["lblChannel"+(i+1)].skin=rowJSON["lblChannel"+(i+1)].info.normalSkin;
            rowJSON["lblChannel"+(i+1)].info.isSelected=false;
           var opt =i+1;
           switch(opt)
             {

               case 1 :  
                 rowJSON["flxChannel"+(opt)].skin="slfboxdeselectedrighte3e3e3";
                 break;
               case 2 : 
                 if(rowJSON["lblChannel"+(opt-1)].info.isSelected) {
                     rowJSON["flxChannel"+(opt)].skin="slfboxdeselectedrighte3e3e3";
                 }
                 break;
               case 3 : 
                 if(rowJSON["lblChannel"+(opt-1)].info.isSelected&&(!rowJSON["lblChannel"+(opt-2)].info.isSelected)) {
                   rowJSON["flxChannel" + (opt - 1)].skin = "sknFlxBgFFFFFFBr003e75Noborder2";
                 }
                 break; 
               case 4 : 
                 if(rowJSON["lblChannel"+(opt-1)].info.isSelected&&(!rowJSON["lblChannel"+(opt-2)].info.isSelected) ) {
                   rowJSON["flxChannel"+(opt-1)].skin="sknFlxBgFFFFFFBr003e75Noborder2";
                 }
                 break;  
             }
               
             }
         }
        else{
          rowJSON["flxChannel"+(i+1)].skin="slFbox";
          rowJSON["flxChannel"+(i+1)].isVisible=true;
          rowJSON["lblChannel"+(i+1)].text=channelIcons[channelsData[i]].text;
          rowJSON["lblChannel"+(i+1)].info={"id":channelsData[i],"isSelected":false,"normalSkin":channelIcons[channelsData[i]].normalSkin,"selectedSkin":channelIcons[channelsData[i]].selectedSkin};
          if(subscribedChannels.indexOf(channelsData[i])>=0){
            rowJSON["lblChannel"+(i+1)].info.isSelected=true;
            rowJSON["lblChannel"+(i+1)].skin=rowJSON["lblChannel"+(i+1)].info.selectedSkin;
            rowJSON["flxChannel"+(i+1)].skin=rowJSON["flxChannel"+i]&&rowJSON["flxChannel"+i].skin==="slFbox"?"bbSknFlxffffffWithShadow1": "bbSknFlxffffffWithShadow2";
            }else{
            rowJSON["lblChannel"+(i+1)].skin=rowJSON["lblChannel"+(i+1)].info.normalSkin;
            }   }
        
      }
      for(var x=i+1;x<=4;x++){
        rowJSON["flxChannel"+x].isVisible=false;
        rowJSON["flxVerticalSeparator"+(x-1)].isVisible=false;
      }
	  if(rowJSON.template === "flxGroupAlertRowDW" || rowJSON.template === "flxGroupAlertRowTablet" ||
	     rowJSON.template === "flxGroupAlertsHeaderTablet"){
		  rowJSON.flxChannels.width=(channelsData.length)*55+"px";
	  } else{
		  rowJSON.flxChannels.width=(channelsData.length)*45+"px";
	  }
       if (kony.application.getCurrentBreakpoint() === 640  || orientationHandler.isMobile){
         rowJSON.flxChannels.width=((channelsData.length)*45+2)+"px";
       }
      return rowJSON;
    },
    /**
      *Method is used to set selected channels skin at both ALERT&GROUP level
    **/
    channelOnClick : function(opt){
      var secIndex=0;
      var rowIndex=0;
      var data=this.view.segAlertsListing.data;
      var selectedRowData=[];
      var isSubscribed=false;
      if(this.alertPreference==="GROUP"){
        secIndex=this.view.segAlertsListing.selectedRowIndex[0];
        selectedRowData=data[secIndex][0];
        isSubscribed=selectedRowData.lblGroupCheckBoxIcon.text==="C"?true:false;
      }else{
        secIndex=this.view.segAlertsListing.selectedRowIndex[0];
        rowIndex=this.view.segAlertsListing.selectedRowIndex[1];
        selectedRowData=data[secIndex][1][rowIndex];
        isSubscribed=selectedRowData.lblAlertCheckBoxIcon.text==="C"?true:false;
      }
      if(isSubscribed){//to enable onclick for only subscribed group/alert
      var info=selectedRowData["lblChannel"+opt].info;
      if(info&&info.isSelected===true){
        selectedRowData["flxChannel"+opt].skin="slFbox";
        selectedRowData["lblChannel"+opt].info.isSelected=false;
        selectedRowData["lblChannel"+opt].skin=selectedRowData["lblChannel"+opt].info.normalSkin;
        if (selectedRowData["lblChannel" + opt].info.id === "CH_EMAIL"){
           selectedRowData["lblChannel" + opt].accessibilityConfig = {
              "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Selected") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.EmailId") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
           }
        }
        else if (selectedRowData["lblChannel" + opt].info.id === "CH_NOTIFICATION_CENTER"){
           selectedRowData["lblChannel" + opt].accessibilityConfig = {
              "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Selected") + " " + kony.i18n.getLocalizedString("i18n.alertSettings.NotifCenter") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
           }
        }
        else if (selectedRowData["lblChannel" + opt].info.id === "CH_PUSH_NOTIFICATION"){
           selectedRowData["lblChannel" + opt].accessibilityConfig = {
              "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Selected") + " " + kony.i18n.getLocalizedString("i18n.Alertsettings.PushNotifications") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
           }
        }
        else {
           selectedRowData["lblChannel" + opt].accessibilityConfig = {
              "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Selected") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.SMS") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
           }
        }
                //for mobile breakpoint
        if (kony.application.getCurrentBreakpoint() === 640  || orientationHandler.isMobile){
          switch(opt){
            case 1:
              selectedRowData["flxChannel" + (opt)].skin = (selectedRowData["flxChannel" + (opt + 1)].skin === "slfboxdeselectedrighte3e3e3" || selectedRowData["flxChannel" + (opt + 1)].skin === "slFbox") ? "slfboxdeselectedrighte3e3e3" : "slFbox";
              break;
            case 2:
              if (selectedRowData["lblChannel" + (opt - 1)].info.isSelected) {
                selectedRowData["flxChannel" + (opt - 1)].skin = "sknFlxBgFFFFFFBr003e75Rd3pxlefttopbottom2";
              } else {
                selectedRowData["flxChannel" + (opt - 1)].skin = "slfboxdeselectedrighte3e3e3";
              }
              selectedRowData["flxChannel" + (opt)].skin = (selectedRowData["flxChannel" + (opt - 1)].skin === "sknFlxBgFFFFFFBr003e75Rd3pxlefttopbottom2" && selectedRowData["flxChannel" + (opt + 1)].skin === "sknFlxBgFFFFFFBr003e75Noborder") ? "slFbox" : "slfboxdeselectedrighte3e3e3";
              break;
            case 3:
              if (selectedRowData["lblChannel" + (opt - 1)].info.isSelected) {
                selectedRowData["flxChannel" + (opt - 1)].skin = "sknFlxBgFFFFFFBr003e75Noborder2";
              } else {
                selectedRowData["flxChannel" + (opt - 1)].skin = "slfboxdeselectedrighte3e3e3";
              }
              selectedRowData["flxChannel" + (opt)].skin = (selectedRowData["flxChannel" + (opt - 1)].skin === "slfboxdeselectedrighte3e3e3" && selectedRowData["flxChannel" + (opt + 1)].skin === "sknFlxBgFFFFFFBr003e75Rd3pxrighttopbottom") ? "slFbox" : "slfboxdeselectedrighte3e3e3";
              break;
            case 4:
              if (selectedRowData["lblChannel" + (opt - 1)].info.isSelected) {selectedRowData["flxChannel" + (opt - 1)].skin = "sknFlxBgFFFFFFBr003e75Noborder2";} else {
                selectedRowData["flxChannel" + (opt - 1)].skin = "slfboxdeselectedrighte3e3e3";
              }
              selectedRowData["flxChannel" + (opt)].skin = "slFbox"; //(selectedRowData["flxChannel"+(opt-1)].skin==="sknFlxBgFFFFFFBr003e75Noborder" && selectedRowData["flxChannel"+(opt+1)].skin==="slfbox")?"sknFlxBgFFFFFFBr003e75Noborder2":"sknFlxBgFFFFFFBr003e75Noborder";
              break
          }
        }
        else //other breakpoint
        {
          if(selectedRowData["flxChannel"+(opt+1)])
            selectedRowData["flxChannel"+(opt+1)].skin=selectedRowData["flxChannel"+(opt+1)].skin==="bbSknFlxffffffWithShadow2"?"bbSknFlxffffffWithShadow1":"slFbox";

        }
      }else{
        selectedRowData["flxChannel"+opt].skin=selectedRowData["flxChannel"+(opt-1)]&&selectedRowData["flxChannel"+(opt-1)].skin!=="slFbox"?"bbSknFlxffffffWithShadow2": "bbSknFlxffffffWithShadow1";
        selectedRowData["lblChannel"+opt].info.isSelected=true;
        selectedRowData["lblChannel"+opt].skin=selectedRowData["lblChannel"+opt].info.selectedSkin;
        if (selectedRowData["lblChannel" + opt].info.id === "CH_EMAIL"){
          selectedRowData["lblChannel" + opt].accessibilityConfig = {
            "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Unselected") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.EmailId") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
          }
        }
        else if (selectedRowData["lblChannel" + opt].info.id === "CH_NOTIFICATION_CENTER"){
          selectedRowData["lblChannel" + opt].accessibilityConfig = {
            "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Unselected") + " " + kony.i18n.getLocalizedString("i18n.alertSettings.NotifCenter") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
          }
        }
        else if (selectedRowData["lblChannel" + opt].info.id === "CH_PUSH_NOTIFICATION"){
          selectedRowData["lblChannel" + opt].accessibilityConfig = {
            "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Unselected") + " " + kony.i18n.getLocalizedString("i18n.Alertsettings.PushNotifications") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
          }
        }
        else {
          selectedRowData["lblChannel" + opt].accessibilityConfig = {
            "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Unselected") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.SMS") + " " + kony.i18n.getLocalizedString("i18n.ProfileManagement.Info")
          }
        }
        //for mobile breakpoint
        if (kony.application.getCurrentBreakpoint() === 640  || orientationHandler.isMobile){
          switch(opt){
            case 1:
              selectedRowData["flxChannel" + (opt)].skin = selectedRowData["flxChannel" + (opt + 1)].skin === "slfboxdeselectedrighte3e3e3" ? "sknFlxBgFFFFFFBr003e75Rd3pxlefttopbottom2" : "sknFlxBgFFFFFFBr003e75Rd3pxlefttopbottom";
              break;
            case 2:
              if (selectedRowData["lblChannel" + (opt - 1)].info.isSelected) {
                selectedRowData["flxChannel" + (opt - 1)].skin = "sknFlxBgFFFFFFBr003e75Rd3pxlefttopbottom";
              } else {
                selectedRowData["flxChannel" + (opt - 1)].skin = "slfboxdeselectedrighte3e3e3";
              }
              selectedRowData["flxChannel" + (opt)].skin = ((selectedRowData["flxChannel" + (opt - 1)].skin === "sknFlxBgFFFFFFBr003e75Rd3pxlefttopbottom" || selectedRowData["flxChannel" + (opt - 1)].skin === "slfboxdeselectedrighte3e3e3") && (selectedRowData["flxChannel" + (opt + 1)].skin === "slfboxdeselectedrighte3e3e3"||selectedRowData["flxChannel" + (opt + 1)].skin === "slFbox")) ? "sknFlxBgFFFFFFBr003e75Noborder2" : "sknFlxBgFFFFFFBr003e75Noborder";
              break;
            case 3:
              if (selectedRowData["lblChannel" + (opt - 1)].info.isSelected) {
                selectedRowData["flxChannel" + (opt - 1)].skin = "sknFlxBgFFFFFFBr003e75Noborder";
              } else {
                selectedRowData["flxChannel" + (opt - 1)].skin = "slfboxdeselectedrighte3e3e3";
              }
              selectedRowData["flxChannel" + (opt)].skin = (selectedRowData["flxChannel" + (opt - 1)].skin === "sknFlxBgFFFFFFBr003e75Noborder" && selectedRowData["flxChannel" + (opt + 1)].skin === "sknFlxBgFFFFFFBr003e75Rd3pxrighttopbottom")||(selectedRowData["flxChannel" + (opt + 1)].skin === "sknFlxBgFFFFFFBr003e75Rd3pxrighttopbottom") ? "sknFlxBgFFFFFFBr003e75Noborder" : "sknFlxBgFFFFFFBr003e75Noborder2";
              break;
            case 4:
              if (selectedRowData["lblChannel" + (opt - 1)].info.isSelected) {
                selectedRowData["flxChannel" + (opt - 1)].skin = "sknFlxBgFFFFFFBr003e75Noborder";
              } else {
                selectedRowData["flxChannel" + (opt - 1)].skin = "slfboxdeselectedrighte3e3e3";
              }
              selectedRowData["flxChannel" + (opt)].skin = "sknFlxBgFFFFFFBr003e75Rd3pxrighttopbottom"; //(selectedRowData["flxChannel"+(opt-1)].skin==="sknFlxBgFFFFFFBr003e75Noborder" && selectedRowData["flxChannel"+(opt+1)].skin==="slfbox")?"sknFlxBgFFFFFFBr003e75Noborder2":"sknFlxBgFFFFFFBr003e75Noborder";
              break;
          }
        }
        else //other breakpoint
        {
           if(selectedRowData["flxChannel"+(opt+1)])
            selectedRowData["flxChannel"+(opt+1)].skin=selectedRowData["flxChannel"+(opt+1)].skin==="bbSknFlxffffffWithShadow1"?"bbSknFlxffffffWithShadow2":"slFbox";
        }
      }
      if(this.alertPreference==="GROUP"){
        data[secIndex][0]=selectedRowData
        this.view.segAlertsListing.setData(data);
      }else
        this.view.segAlertsListing.setDataAt(selectedRowData,rowIndex,secIndex);
      this.view.flxAlertsBody.forceLayout();
     // this.AdjustScreen();
      this.view.forceLayout();
      }
    },
    /**
      *Method is used to update the alerts data on checkbox click
    **/
    toggleAlertCheckBox : function(){
      var data=this.view.segAlertsListing.data;
      var secIndex=this.view.segAlertsListing.selectedRowIndex[0];
      var selectedSecData=data[secIndex];
      var rowIndex=this.view.segAlertsListing.selectedRowIndex[1];
      var selectedRowData=data[secIndex][1][rowIndex];
      var selectedAlerts=0;            
      if(selectedRowData.lblAlertCheckBoxIcon.text==="D"){
        selectedRowData.lblAlertCheckBoxIcon.text="C";
	    selectedRowData.lblAlertCheckBoxIcon.accessibilityConfig = {
             "a11yLabel": kony.i18n.getLocalizedString("i18n.accountSettings.checked") + " " +  selectedRowData.lblAlertName.text
         }
        selectedRowData.flxFrequencyFields.isVisible=true;
        selectedRowData.flxAmountAttribute.isVisible=true;
        selectedRowData.flxFrequencyFields.isVisible=selectedRowData.recordData.subscribedFrequency?true:false;
        selectedRowData.flxAmountAttribute.isVisible=selectedRowData.recordData.alertAttribute?true:false;
        selectedRowData.flxAlertAttribute3.isVisible=(kony.application.getCurrentBreakpoint() === 1024  || orientationHandler.isTablet)&&selectedRowData.showToVal?true:false;
        selectedRowData=this.setAlertChannelsToUI(selectedRowData.supportedChannels,selectedRowData.subscribedChannels,selectedRowData)
      }else{
        selectedRowData.lblAlertCheckBoxIcon.text="D";
		selectedRowData.lblAlertCheckBoxIcon.accessibilityConfig = {
           "a11yLabel": kony.i18n.getLocalizedString("i18n.accountSettings.unchecked") + " " +  selectedRowData.lblAlertName.text
         }
        selectedRowData.flxFrequencyFields.isVisible=false;
        selectedRowData.flxAmountAttribute.isVisible=false;
        selectedRowData.flxAlertAttribute3.isVisible=false;
        selectedRowData=this.setAlertChannelsToUI(selectedRowData.supportedChannels,"",selectedRowData);
      }
      for(var i=0;i<selectedSecData[1].length;i++){
        if(selectedSecData[1][i].lblAlertCheckBoxIcon.text==="C")
          selectedAlerts++;
      }
      selectedSecData[0].lblGroupCheckBoxIcon.text=selectedAlerts===selectedSecData[1].length?"C":selectedAlerts===0?"D":"z";
      selectedSecData[0].lblGroupAlertsCount.text="("+selectedAlerts+"/"+selectedSecData[1].length+")";
      selectedSecData[0].lblGroupAlertsCount.isVisible=selectedAlerts===0?false:true;
      selectedSecData[1][rowIndex]=selectedRowData;
      data[secIndex]=selectedSecData;
      this.view.segAlertsListing.setData(data);
      this.view.flxAlertsBody.forceLayout();
    //  this.AdjustScreen();
      this.view.forceLayout();
    },
    /**
      *Method is used to update groups&alerts row data on checkbox click
    **/
   toggleGroupCheckBox: function() {
            var data = this.view.segAlertsListing.data;
            var secIndex = this.view.segAlertsListing.selectedRowIndex[0];
            var selectedSecData = data[secIndex];
            if (this.alertPreference === "GROUP" || this.alertPreference === "CATEGORY") {
                if (selectedSecData[0].lblGroupCheckBoxIcon.text === "D") {
                    selectedSecData[0].lblGroupCheckBoxIcon.text = "C";
                    selectedSecData[0].lblGroupCheckBoxIcon.accessibilityConfig = {
                      "a11yLabel": kony.i18n.getLocalizedString("i18n.accountSettings.checked") + " " +  selectedSecData[0].lblGroupName.text,
                      "a11yARIA": {
                         "role": "checkbox",
                         "aria-checked": "true",
                         "aria-disabled": "false",
                         "tabindex": 0
                      }
                     }

                    for (var x = 0; x < selectedSecData[1].length; x++) {
                        selectedSecData[1][x].flxAttributes.isVisible = true;
                        selectedSecData[1][x].flxAlertAttribute3.isVisible = (kony.application.getCurrentBreakpoint() === 1024 || orientationHandler.isTablet) && selectedSecData[1][x].showToVal ? true : false;
                    }
                    if (this.alertPreference === "GROUP") selectedSecData[0] = this.setAlertChannelsToUI(selectedSecData[0].supportedChannels, selectedSecData[0].subscribedChannels, selectedSecData[0]);
                } else {
                    selectedSecData[0].lblGroupCheckBoxIcon.text = "D";
					selectedSecData[0].lblGroupCheckBoxIcon.accessibilityConfig = {
                      "a11yLabel": kony.i18n.getLocalizedString("i18n.accountSettings.unchecked") + " " +  selectedSecData[0].lblGroupName.text,
                      "a11yARIA": {
                         "role": "checkbox",
                         "aria-checked": "false",
                         "aria-disabled": "true",
                         "tabindex": 0
                      }
                     }

                    for (var x = 0; x < selectedSecData[1].length; x++) {
                        selectedSecData[1][x].flxAttributes.isVisible = false;
                        selectedSecData[1][x].flxAlertAttribute3.isVisible = false;
                    }
                    if (this.alertPreference === "GROUP") selectedSecData[0] = this.setAlertChannelsToUI(selectedSecData[0].supportedChannels, "", selectedSecData[0]);
                }
            } else {
                if (selectedSecData[0].lblGroupCheckBoxIcon.text === "D") {
                    selectedSecData[0].lblGroupAlertsCount.text = "(" + selectedSecData[1].length + "/" + selectedSecData[1].length + ")";
                    selectedSecData[0].lblGroupAlertsCount.isVisible = true;
                    selectedSecData[0].lblGroupCheckBoxIcon.text = "C";
					selectedSecData[0].lblGroupCheckBoxIcon.accessibilityConfig = {
                      "a11yLabel": kony.i18n.getLocalizedString("i18n.accountSettings.checked") + " " +  selectedSecData[0].lblGroupName.text,
                      "a11yARIA": {
                         "role": "checkbox",
                         "aria-checked": "true",
                         "aria-disabled": "false",
                         "tabindex": 0
                      }
                     }

                    for (var y = 0; y < selectedSecData[1].length; y++) {
                        selectedSecData[1][y].lblAlertCheckBoxIcon.text = "C";
						selectedSecData[1][y].lblAlertCheckBoxIcon.accessibilityConfig = {
						  "a11yLabel": kony.i18n.getLocalizedString("i18n.accountSettings.checked") + " " +  selectedSecData[1][y].lblAlertName.text,
                          "a11yARIA": {
                             "role": "checkbox",
                             "aria-checked": "true",
                             "aria-disabled": "false",
                             "tabindex": 0
                          }
						 }
                        selectedSecData[1][y].flxFrequencyFields.isVisible = selectedSecData[1][y].recordData.subscribedFrequency ? true : false;
                        selectedSecData[1][y].flxAmountAttribute.isVisible = selectedSecData[1][y].recordData.alertAttribute ? true : false;
                        selectedSecData[1][y].flxAlertAttribute3.isVisible = (kony.application.getCurrentBreakpoint() === 1024 || orientationHandler.isTablet) && selectedSecData[1][y].showToVal ? true : false;
                        selectedSecData[1][y] = this.setAlertChannelsToUI(selectedSecData[1][y].supportedChannels, selectedSecData[1][y].subscribedChannels, selectedSecData[1][y]);
                    }
                } else {
                    selectedSecData[0].lblGroupCheckBoxIcon.text = "D";
					selectedSecData[0].lblGroupCheckBoxIcon.accessibilityConfig = {
                      "a11yLabel": kony.i18n.getLocalizedString("i18n.accountSettings.unchecked") + " " +  selectedSecData[0].lblGroupName.text,
                      "a11yARIA": {
                         "role": "checkbox",
                         "aria-checked": "false",
                         "aria-disabled": "true",
                         "tabindex": 0
                      }
                     }

                    selectedSecData[0].lblGroupAlertsCount.isVisible = false;
                    for (var y = 0; y < selectedSecData[1].length; y++) {
                        selectedSecData[1][y].lblAlertCheckBoxIcon.text = "D";
						selectedSecData[1][y].lblAlertCheckBoxIcon.accessibilityConfig = {
						  "a11yLabel": kony.i18n.getLocalizedString("i18n.accountSettings.unchecked") + " " +  selectedSecData[1][y].lblAlertName.text,
                          "a11yARIA": {
                            "role": "checkbox",
                            "aria-checked": "false",
                            "aria-disabled": "true",
                            "tabindex": 0
                          }
						 }
                        selectedSecData[1][y].flxFrequencyFields.isVisible = false;
                        selectedSecData[1][y].flxAmountAttribute.isVisible = false;
                        selectedSecData[1][y].flxAlertAttribute3.isVisible = false;
                        selectedSecData[1][y] = this.setAlertChannelsToUI(selectedSecData[1][y].supportedChannels, "", selectedSecData[1][y]);
                    }
                }
            }
            data[secIndex] = selectedSecData;
            this.view.segAlertsListing.setData(data);
            this.view.flxAlertsBody.forceLayout();
            //  this.AdjustScreen();
            this.view.forceLayout();
        },
    /**
      *Method is used to call enable/disable the segment based on switch selection
    **/
    ToggleSwitchAlerts : function(){
      var scopeObj = this;
      if(this.view.flxAlertsSegment.isVisible){
          if(this.view.lblSwitch.text==="o"){
              this.enableAlertsSegment(true);
          }
          else{
              this.enableAlertsSegment(false);
          }
      this.view.forceLayout();
      }
      var isEnabled = this.view.lblSwitch.text === "o" ? true : false;
      if(this.alertPreference==="CATEGORY"){
		  this.view.flxChannelsFrequency.setEnabled(isEnabled);
	  }
      FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxHeader', 'flxFooter', 'flxMain', 'flxMenuItemMobile', 'flxRight']);
      this.view.profileMenu.flxSeperator.height = this.view.flxRight.info.frame.height;
	  this.view.flxLeft.height = this.view.flxRight.info.frame.height;
    },
    /**
      *Method is used to set frequency data based on frequency type selection at CATEGORY level
    **/
   displayBasedOnSelectedFrequency: function() {
            var preference = this.alertPreference;
            this.view.flxFrequency2.setVisibility(true);
            this.view.flxFrequency2Tab.setVisibility(true);
            if (kony.application.getCurrentBreakpoint() === 1024 || orientationHandler.isTablet) {
                if (this.view.lstBoxFrequency1Tab.selectedKey === "WEEKLY") this.view.lstBoxFrequency2Tab.masterData = this.frequencyList.weeks;
                else if (this.view.lstBoxFrequency1Tab.selectedKey === "MONTHLY") this.view.lstBoxFrequency2Tab.masterData = this.frequencyList.dates;
                else this.view.flxFrequency2Tab.setVisibility(false);
                this.view.lstBoxFrequency2Tab.selectedKey = "SELECT";
                this.view.lstBoxFrequency3Tab.selectedKey = "SELECT";
            } else {
				 if (kony.application.getCurrentBreakpoint() === 640  || orientationHandler.isMobile){
					 if (this.view.lstBoxFrequency1.selectedKey === "WEEKLY" || this.view.lstBoxFrequency1.selectedKey === "MONTHLY"){
					  this.view.flxFrequency2.left = "2%";
					  this.view.flxFrequency3.left = "66%";
					 }
					 else {
					  this.view.flxFrequency3.left = "2%";
					}
				 }
                if (this.view.lstBoxFrequency1.selectedKey === "WEEKLY") this.view.lstBoxFrequency2.masterData = this.frequencyList.weeks;
                else if (this.view.lstBoxFrequency1.selectedKey === "MONTHLY") this.view.lstBoxFrequency2.masterData = this.frequencyList.dates;
                else this.view.flxFrequency2.setVisibility(false);
                this.view.lstBoxFrequency2.selectedKey = "SELECT";
                this.view.lstBoxFrequency3.selectedKey = "SELECT";
            }
        },
    /**
      *Method is used to set frequency data based on frequency type selection at ALERT&GROUP levels
    **/
    onFrequencySelection: function(args,opt){
      var self=this;
      var secIndex=0;
      var rowIndex=args.rowIndex;
      var data=this.view.segAlertsListing.data;
      var selectedRowData=[];
      secIndex=args.sectionIndex;
      if(this.alertPreference==="GROUP"){     
        selectedRowData=data[secIndex][0];
      }else{
        selectedRowData=data[secIndex][1][rowIndex];
      }
      if(opt===1){
        selectedRowData.flxFrequencyBox2.isVisible = true;
        selectedRowData.flxFrequencyBox1.width = ((kony.application.getCurrentBreakpoint() === 1024 || orientationHandler.isTablet) || (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile)) ? "100%" : "28%";
        selectedRowData.flxFrequencyBox3.top = ((kony.application.getCurrentBreakpoint() === 1024 || orientationHandler.isTablet) || (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile)) ? "50dp" : "0dp";
      if(selectedRowData.lstBoxFrequency1.selectedKey==="WEEKLY")
          selectedRowData.lstBoxFrequency2={"masterData":this.frequencyList.weeks,"selectedKey": "SELECT","onSelection":function(){self.onFrequencySelection(arguments[1],2)},"skin":"sknlbxalto42424215pxBordere3e3e32pxRadius"};
        else if(selectedRowData.lstBoxFrequency1.selectedKey==="MONTHLY")
          selectedRowData.lstBoxFrequency2={"masterData":this.frequencyList.dates,"selectedKey": "SELECT","onSelection":function(){self.onFrequencySelection(arguments[1],2)},"skin":"sknlbxalto42424215pxBordere3e3e32pxRadius"};
          else{
            selectedRowData.flxFrequencyBox2.isVisible=false;
            selectedRowData.flxFrequencyBox1.width = ((kony.application.getCurrentBreakpoint() === 1024 || orientationHandler.isTablet) || (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile)) ? "49%" : "28%";
            selectedRowData.flxFrequencyBox3.top="0dp";
          }
      selectedRowData.lstBoxFrequency3.selectedKey="SELECT";
      }else if(opt===2){
        selectedRowData.lstBoxFrequency2.skin="sknlbxalto42424215pxBordere3e3e32pxRadius";
        selectedRowData.lstBoxFrequency3.selectedKey="SELECT";
      }else{
        selectedRowData.lstBoxFrequency3.skin="sknlbxalto42424215pxBordere3e3e32pxRadius";
      }
     if(this.alertPreference==="GROUP"){
        data[secIndex][0]=selectedRowData;
      this.view.segAlertsListing.setData(data);
      }else{
        data[secIndex][1][rowIndex]=selectedRowData;
        this.view.segAlertsListing.setData(data);
      }
      this.view.forceLayout();
    },
    /**
      *Method is used to set edit page
    **/
    onEditAlertsClick: function(){
      this.view.lblSwitch.setEnabled(true);
      this.view.flxChannelsFrequency.setEnabled(true);
      this.view.flxChannelsFrequencyTab.setEnabled(true);
      this.view.segAlertsListing.setEnabled(this.view.lblSwitch.text === "o"?true:false);
      FormControllerUtility.showProgressBar(this.view);
      this.view.btnEditAlerts.setVisibility(false);
      this.view.flxAlertButtons.setVisibility(true);
      this.view.btnAlertSave.setVisibility(true);
	  this.view.btnAlertCancel.setVisibility(true);
      this.view.flxAlertBtnSeperator.setVisibility(true);    
      this.view.flxAlertsBody.forceLayout();
      this.enableAlertsSegment(this.view.lblSwitch.text === "o" ?true:false);
    //  this.AdjustScreen();
      FormControllerUtility.hideProgressBar(this.view);
    },
     /**
       *onClickCancelAlerts- function that triggers on click of button Modify of  alerts
       *@param {Object} alertsViewModel - alerts payload
       */
     onClickCancelAlerts: function(alertsViewModel) {
        if(alertsViewModel.accountId === undefined){
          FormControllerUtility.showProgressBar(this.view);
          var params = {
            "AlertCategoryId": alertsViewModel.AlertCategoryId
          };
          kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("SettingsNewAlertsUIModule").presentationController.fetchAlertsDataById(params);
        } else {
           kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("SettingsNewAlertsUIModule").presentationController.navigateToAccountAlerts("alertSettings2");
        }
      },
       /**
       *AdjustScreen- function to adjust the footer
       */
      AdjustScreen: function() {
          this.view.forceLayout();
          var mainheight = 0;
          var screenheight = kony.os.deviceInfo().screenHeight;
          mainheight = this.view.customheadernew.info.frame.height + this.view.flxContainer.info.frame.height;
          var diff = screenheight - mainheight;
          if (mainheight < screenheight) {
              diff = diff - this.view.flxFooter.info.frame.height;
              if (diff > 0)
                  this.view.flxFooter.top = mainheight + diff + "dp";
              else
                  this.view.flxFooter.top = mainheight + "dp";
          } else {
              this.view.flxFooter.top = mainheight + "dp";
          }
          this.view.forceLayout();
         // this.initializeResponsiveViews();
      },
    /**
      *Method is used to enable/disable the checkboxes in segment
      * @param boolean (based on toggle switch selected index)
    **/
    enableAlertsSegment: function(isEnable){
      var checkBoxskin="sknFontIconCheckBoxSelected";
      this.view.segAlertsListing.setEnabled(true);
      if(!isEnable){
        checkBoxskin="sknC0C0C020pxolbfonticons";
        this.view.segAlertsListing.setEnabled(false);
      }
      var data=this.view.segAlertsListing.data;
      for(var i=0;i<data.length;i++){
        data[i][0].lblGroupCheckBoxIcon.skin=checkBoxskin;
      if(this.alertPreference==="ALERT"){
        for(var j=0;j<data[i][1].length;j++){
          data[i][1][j].lblAlertCheckBoxIcon.skin=checkBoxskin;
        }
      }
      }
      this.view.segAlertsListing.setData(data);
      if(this.alertPreference==="CATEGORY"){
		  this.view.flxChannelsFrequency.setEnabled(isEnable);
        this.view.flxChannelsFrequencyTab.setEnabled(isEnable);
	  }
      this.view.forceLayout();
    },
    /**
      *Method is used to call updateAlerts by collecting payloads from respective preference based functions
    **/
     onAlertSaveClick: function(alertsViewModel) {
            // var data=this.view.segAlertsCategory.data;
            var requestPayload;
			if (this.alertPreference === "CATEGORY") requestPayload = this.generateCategoryAlertsPayload(alertsViewModel);
            if (this.isValidData(alertsViewModel)) {            
                if (this.alertPreference === "GROUP") requestPayload = this.generateGroupAlertsPayload(alertsViewModel);
                else if (this.alertPreference === "ALERT") requestPayload = this.generateAlertLevelAlertsPayload(alertsViewModel);
              kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("SettingsNewAlertsUIModule").presentationController.updateAlerts(requestPayload, alertsViewModel);
            }
        },
    /**
      *Method is used to generate update payload at CATEGORY level
    **/
    generateCategoryAlertsPayload : function(alertsModel){
      if(alertsModel.accountId === undefined) {
         var payload={
        "alertCategoryId": alertsModel.AlertCategoryId,
        "isSubscribed": this.view.lblSwitch.text === "o" ? true:false,
        "alertSubscription": {
          "preferenceLevel": this.alertPreference,
          "chanls": [],
          "groups": []
        }
      }
      } else {
      var payload={
        "alertCategoryId": alertsModel.AlertCategoryId,
        "accountId": alertsModel.accountId,
        "isSubscribed": this.view.lblSwitch.text === "o" ? true:false,
        "alertSubscription": {
          "preferenceLevel": this.alertPreference,
          "chanls": [],
          "groups": []
        }
      }
      }
      var alertsViewModel=alertsModel.alertsData;
      var groupsData=[];
      var groupJSON={};
      var alertJSON={};
      if(this.view.flxAlertsSegment.isVisible){
    	var data=this.view.segAlertsListing.data;
      for(var i=0;i<data.length;i++){
        groupJSON={};
        groupJSON.typeID=data[i][0].alerttype_id;
        groupJSON.isSub=data[i][0].lblGroupCheckBoxIcon.text!=="D"?true:false;
        groupJSON.alerts=[];
        for(var j=0;j<data[i][1].length;j++){
          alertJSON={};
          alertJSON.id=data[i][1][j].alertsubtype_id;
          alertJSON.value1=data[i][1][j].tbxAmount1.text;
          alertJSON.value2=(kony.application.getCurrentBreakpoint() === 1024  || orientationHandler.isTablet)?data[i][1][j].tbxAmount3.text:data[i][1][j].tbxAmount2.text;
          alertJSON.isSub=alertsViewModel.alertTypes[i].alertSubTypes[j].isSubscribed==="true"?true:false;
          groupJSON.alerts.push(alertJSON);
        }
        groupsData.push(groupJSON);
      }
    }
      payload.alertSubscription.groups=groupsData;
      var channelsData=[];
      var supChanls=alertsViewModel.alertCategory.supportedChannels.split(",");
      for(var x=1;x<=supChanls.length;x++){
        if(kony.application.getCurrentBreakpoint() === 1024  || orientationHandler.isTablet){
          channelsData.push({"id":this.view["lblChannel"+x+"Tab"].info.id,"isSub":this.view["lblChannel"+x+"Tab"].info.isSelected});
        }else{
          channelsData.push({"id":this.view["lblChannel"+x].info.id,"isSub":this.view["lblChannel"+x].info.isSelected});
        }
      }
      payload.alertSubscription.chanls=channelsData;
      if(((kony.application.getCurrentBreakpoint() === 1024|| orientationHandler.isTablet)&&this.view.flxCategoryFrequencyTab.isVisible)){
        payload.alertSubscription.freq={};
        payload.alertSubscription.freq.id=this.view.lstBoxFrequency1Tab.selectedKey;
        if(this.view.lstBoxFrequency1Tab.selectedKey!=="DAILY")
          payload.alertSubscription.freq.value=this.view.lstBoxFrequency2Tab.selectedKey;
        payload.alertSubscription.freq.time=applicationManager.getFormatUtilManager().getTwentyFourHourTimeString(this.view.lstBoxFrequency3Tab.selectedKey);
      }else if(this.view.flxCategoryFrequency.isVisible){
        payload.alertSubscription.freq={};
        payload.alertSubscription.freq.id=this.view.lstBoxFrequency1.selectedKey;
        if(this.view.lstBoxFrequency1.selectedKey!=="DAILY")
          payload.alertSubscription.freq.value=this.view.lstBoxFrequency2.selectedKey;
        payload.alertSubscription.freq.time=applicationManager.getFormatUtilManager().getTwentyFourHourTimeString(this.view.lstBoxFrequency3.selectedKey);
      }
      return payload;
    },
    /**
      *Method is used to call respective preference level validation functions
    **/
    isValidData : function(alertsModel){
      var isValid=true;
      var data=this.view.segAlertsListing.data;
      if(this.view.lblSwitch.text === "o"){
        if(this.alertPreference==="CATEGORY"){
          isValid=this.validateCategoryLevel(alertsModel.alertsData);
        }else if(this.alertPreference==="GROUP"){
          isValid=this.validateGroupLevel(alertsModel.alertsData);
        }else{
          isValid=this.validateAlertLevel(alertsModel.alertsData);
        }
     } else{
         this.view.flxChannels.skin="sknFlxffffffNoShadowbodere3e3round3px";
     }
      return isValid;
    },
    /**
      *Method is used to validate entered data at CATEGORY level
    **/
    validateCategoryLevel : function(alertsModel){
      var isValid=true;
      var supportedChans=0;
      var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
      this.view.lblInvalidAmount.text=kony.i18n.getLocalizedString("i18n.common.errorEditData");
      this.view.flxInvalidAmount.setVisibility(false);
      if(this.view.flxCategoryFrequencyTab.isVisible&&kony.application.getCurrentBreakpoint() === 1024  || orientationHandler.isTablet){
        this.view.lstBoxFrequency2Tab.skin="sknlbxalto42424215pxBordere3e3e32pxRadius";
        this.view.lstBoxFrequency3Tab.skin="sknlbxalto42424215pxBordere3e3e32pxRadius";
        if(this.view.flxFrequency2Tab.isVisible&&this.view.lstBoxFrequency2Tab.selectedKey==="SELECT"){
          this.view.lstBoxFrequency2Tab.skin="sknlbxff0000SSP15px";
          this.view.flxInvalidAmount.setVisibility(true);
          isValid=false;
        }
        if(this.view.lstBoxFrequency3Tab.selectedKey==="SELECT"){
          this.view.flxInvalidAmount.setVisibility(true);
          this.view.lstBoxFrequency3Tab.skin="sknlbxff0000SSP15px";
          isValid=false;
        }
      }else if(this.view.flxCategoryFrequency.isVisible){
        this.view.lstBoxFrequency2.skin="sknlbxalto42424215pxBordere3e3e32pxRadius";
        this.view.lstBoxFrequency3.skin="sknlbxalto42424215pxBordere3e3e32pxRadius";
        if(this.view.flxFrequency2.isVisible&&this.view.lstBoxFrequency2.selectedKey==="SELECT"){
          this.view.lstBoxFrequency2.skin="sknlbxff0000SSP15px";
          this.view.flxInvalidAmount.setVisibility(true);
          isValid=false;
        }
        if(this.view.lstBoxFrequency3.selectedKey==="SELECT"){
          this.view.flxInvalidAmount.setVisibility(true);
          this.view.lstBoxFrequency3.skin="sknlbxff0000SSP15px";
          isValid=false;
        }
      }
      var supChanls=alertsModel.alertCategory.supportedChannels.split(",");
      for(var i=1;i<=supChanls.length;i++){
        if(kony.application.getCurrentBreakpoint() === 1024  || orientationHandler.isTablet){
          if(this.view["lblChannel"+i+"Tab"].info.isSelected===true)
            supportedChans++;
        }else{
          if(this.view["lblChannel"+i].info.isSelected===true)
            supportedChans++;
        }
      }
      if(supportedChans===0){
        isValid=false;
        this.view.lblInvalidAmount.text=kony.i18n.getLocalizedString("i18n.profile.editSecureAccessSettingsError");
        this.view.flxInvalidAmount.setVisibility(true);
        this.view.flxChannels.skin="sknFlxFF0000Op100Radius3px";
      }
      else
        this.view.flxChannels.skin="sknFlxffffffNoShadowbodere3e3round3px";
      if(this.view.flxAlertsSegment.isVisible){
        var data=this.view.segAlertsListing.data;
        for(var x=0;x<data.length;x++){
          for(var y=0;y<data[x][1].length;y++){
            data[x][1][y].flxAmount1.skin="sknBorder727272bgffffff";
            data[x][1][y].flxAmount2.skin="sknBorder727272bgffffff";
            data[x][1][y].flxAmount3.skin="sknBorder727272bgffffff";
            if(data[x][1][y].flxAttributes.isVisible){
              var amount1 = Number(CommonUtilities.deFormatAmount(data[x][1][y].tbxAmount1.text));            
              if(isNaN(amount1) || amount1 <= 0 ) {
                isValid=false;
                this.view.lblInvalidAmount.text=kony.i18n.getLocalizedString("i18n.common.errorEditData");
                this.view.flxInvalidAmount.setVisibility(true);
                data[x][1][y].flxAmount1.skin="sknFlxFF0000Op100Radius3px";
              }
              if(data[x][1][y].showToVal){
                var amount2=Number(CommonUtilities.deFormatAmount(((kony.application.getCurrentBreakpoint() === 1024  || orientationHandler.isTablet)?data[x][1][y].tbxAmount3.text:data[x][1][y].tbxAmount2.text)));
                if(amount2 <=0 || isNaN(amount2)|| amount2<=amount1) {
                  isValid=false;
                  this.view.lblInvalidAmount.text=kony.i18n.getLocalizedString("i18n.common.errorEditData");
                  data[x][1][y].flxAmount2.skin="sknFlxFF0000Op100Radius3px";
                  data[x][1][y].flxAmount3.skin="sknFlxFF0000Op100Radius3px";
                  this.view.flxInvalidAmount.setVisibility(true);
                }
              }
            }
          }
        }
        this.view.segAlertsListing.setData(data);
      }
      this.view.flxAlertsBody.forceLayout();
   //   this.AdjustScreen();
      this.view.forceLayout();
      return isValid;
    },
    /**
      *Method is used to validate entered data at GROUP level
    **/
    validateGroupLevel : function(alertsModel){
      var isValid=true;
      var supportedChans=0;
      var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
      this.view.lblInvalidAmount.text=kony.i18n.getLocalizedString("i18n.common.errorEditData");
      this.view.flxInvalidAmount.setVisibility(false);
      if(this.view.flxAlertsSegment.isVisible){
        var data=this.view.segAlertsListing.data;
        for(var x=0;x<data.length;x++){
          supportedChans=0;
          data[x][0].lstBoxFrequency2.skin="sknlbxalto42424215pxBordere3e3e32pxRadius";
          data[x][0].lstBoxFrequency3.skin="sknlbxalto42424215pxBordere3e3e32pxRadius";
          if(data[x][0].lblGroupCheckBoxIcon.text==="C"){
            if(data[x][0].flxFrequencyFields.isVisible&&data[x][0].flxFrequencyBox2.isVisible&&data[x][0].lstBoxFrequency2.selectedKey==="SELECT"){
              data[x][0].lstBoxFrequency2.skin="sknlbxff0000SSP15px";
              this.view.flxInvalidAmount.setVisibility(true);
              isValid=false;
            }
            if(data[x][0].flxFrequencyFields.isVisible&&data[x][0].lstBoxFrequency3.selectedKey==="SELECT"){
              this.view.flxInvalidAmount.setVisibility(true);
              data[x][0].lstBoxFrequency3.skin="sknlbxff0000SSP15px";
              isValid=false;
            }
            var supChanls=alertsModel.alertTypes[x].supportedChannels.split(",");
            for(var i=1;i<=supChanls.length;i++){
              if(data[x][0]["lblChannel"+i].info.isSelected===true)
                supportedChans++;
            }
            if(supportedChans===0){
              isValid=false;
              this.view.lblInvalidAmount.text=kony.i18n.getLocalizedString("i18n.profile.editSecureAccessSettingsError");
              this.view.flxInvalidAmount.setVisibility(true);
              data[x][0].flxChannels.skin="sknFlxFF0000Op100Radius3px";
            }else
              data[x][0].flxChannels.skin="sknFlxffffffNoShadowbodere3e3round3px";
            for(var y=0;y<data[x][1].length;y++){
              data[x][1][y].flxAmount1.skin="sknBorder727272bgffffff";
              data[x][1][y].flxAmount2.skin="sknBorder727272bgffffff";
              data[x][1][y].flxAmount3.skin="sknBorder727272bgffffff";
              if(data[x][1][y].flxAttributes.isVisible){
                var amount1 = Number(CommonUtilities.deFormatAmount(data[x][1][y].tbxAmount1.text));            
                if(isNaN(amount1) || amount1 <= 0 ) {
                  isValid=false;
                  this.view.lblInvalidAmount.text=kony.i18n.getLocalizedString("i18n.common.errorEditData");
                  this.view.flxInvalidAmount.setVisibility(true);
                  data[x][1][y].flxAmount1.skin="sknFlxFF0000Op100Radius3px";
                }
                if(data[x][1][y].showToVal){
                  var amount2=Number(CommonUtilities.deFormatAmount(((kony.application.getCurrentBreakpoint() === 1024  || orientationHandler.isTablet)?data[x][1][y].tbxAmount3.text:data[x][1][y].tbxAmount2.text)));
                  if(amount2 <=0 || isNaN(amount2)|| amount2<=amount1) {
                    isValid=false;
                    this.view.lblInvalidAmount.text=kony.i18n.getLocalizedString("i18n.common.errorEditData");
                    data[x][1][y].flxAmount2.skin="sknFlxFF0000Op100Radius3px";
                    data[x][1][y].flxAmount3.skin="sknFlxFF0000Op100Radius3px";
                    this.view.flxInvalidAmount.setVisibility(true);
                  }
                }
              }
            }
          }
        }
        this.view.segAlertsListing.setData(data);
      }
      this.view.flxAlertsBody.forceLayout();
   //   this.AdjustScreen();
      this.view.forceLayout();
      return isValid;
    },
    /**
      *Method is used to validate entered data at ALERT level
    **/
    validateAlertLevel : function(alertsModel){
      var isValid=true;
      var supportedChans=0;
      var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
      this.view.lblInvalidAmount.text=kony.i18n.getLocalizedString("i18n.common.errorEditData");
      this.view.flxInvalidAmount.setVisibility(false);
      if(this.view.flxAlertsSegment.isVisible){
        var data=this.view.segAlertsListing.data;
        for(var x=0;x<data.length;x++){     
          for(var y=0;y<data[x][1].length;y++){
            supportedChans=0;
            if(data[x][1][y].lblAlertCheckBoxIcon.text==="C"){
              data[x][1][y].lstBoxFrequency2.skin="sknlbxalto42424215pxBordere3e3e32pxRadius";
              data[x][1][y].lstBoxFrequency3.skin="sknlbxalto42424215pxBordere3e3e32pxRadius";
              if(data[x][1][y].flxFrequencyFields.isVisible&&data[x][1][y].flxFrequencyBox2.isVisible&&data[x][1][y].lstBoxFrequency2.selectedKey==="SELECT"){
                data[x][1][y].lstBoxFrequency2.skin="sknlbxff0000SSP15px";
                this.view.flxInvalidAmount.setVisibility(true);
                isValid=false;
              }
              if(data[x][1][y].flxFrequencyFields.isVisible&&data[x][1][y].lstBoxFrequency3.selectedKey==="SELECT"){
                this.view.flxInvalidAmount.setVisibility(true);
                data[x][1][y].lstBoxFrequency3.skin="sknlbxff0000SSP15px";
                isValid=false;
              }
              var supChanls=alertsModel.alertTypes[x].alertSubTypes[y].supportedChannels.split(",");
              for(var i=1;i<=supChanls.length;i++){
                if(data[x][1][y]["lblChannel"+i].info.isSelected===true)
                  supportedChans++;
              }
              if(supportedChans===0){
                isValid=false;
                this.view.lblInvalidAmount.text=kony.i18n.getLocalizedString("i18n.profile.editSecureAccessSettingsError");
                this.view.flxInvalidAmount.setVisibility(true);
                data[x][1][y].flxChannels.skin="sknFlxFF0000Op100Radius3px";
              }else
                data[x][1][y].flxChannels.skin="sknFlxffffffNoShadowbodere3e3round3px";
              data[x][1][y].flxAmount1.skin="sknBorder727272bgffffff";
              data[x][1][y].flxAmount2.skin="sknBorder727272bgffffff";
              data[x][1][y].flxAmount3.skin="sknBorder727272bgffffff";
              if(data[x][1][y].flxAmountAttribute.isVisible){
                var amount1 = Number(CommonUtilities.deFormatAmount(data[x][1][y].tbxAmount1.text));            
                if(isNaN(amount1) || amount1 <= 0 ) {
                  isValid=false;
                  this.view.lblInvalidAmount.text=kony.i18n.getLocalizedString("i18n.common.errorEditData");
                  this.view.flxInvalidAmount.setVisibility(true);
                  data[x][1][y].flxAmount1.skin="sknFlxFF0000Op100Radius3px";
                }
                if(data[x][1][y].showToVal){
                  var amount2=Number(CommonUtilities.deFormatAmount(((kony.application.getCurrentBreakpoint() === 1024  || orientationHandler.isTablet)?data[x][1][y].tbxAmount3.text:data[x][1][y].tbxAmount2.text)));
                  if(amount2 <=0 || isNaN(amount2)|| amount2<=amount1) {
                    isValid=false;
                    this.view.lblInvalidAmount.text=kony.i18n.getLocalizedString("i18n.common.errorEditData");
                    data[x][1][y].flxAmount2.skin="sknFlxFF0000Op100Radius3px";
                    data[x][1][y].flxAmount3.skin="sknFlxFF0000Op100Radius3px";
                    this.view.flxInvalidAmount.setVisibility(true);
                  }
                }
              }
            }
          }
        }
        this.view.segAlertsListing.setData(data);
      }
      this.view.flxAlertsBody.forceLayout();
   //   this.AdjustScreen();
      this.view.forceLayout();
      return isValid;
    },
    /**
      *Method is used to generate update payload at GROUP level
    **/
    generateGroupAlertsPayload : function(alertsModel){
      if(alertsModel.accountId === undefined) {
         var payload={
        "alertCategoryId": alertsModel.AlertCategoryId,
        "isSubscribed": this.view.lblSwitch.text === "o" ? true:false,
        "alertSubscription": {
          "preferenceLevel": this.alertPreference,
          "chanls": [],
          "groups": []
        }
      }
      } else {
      var payload={
        "alertCategoryId": alertsModel.AlertCategoryId,
        "accountId": alertsModel.accountId,
        "isSubscribed": this.view.lblSwitch.text === "o" ? true:false,
        "alertSubscription": {
          "preferenceLevel": this.alertPreference,
          "chanls": [],
          "groups": []
        }
      }
      }
      var alertsViewModel=alertsModel.alertsData;
      var groupsData=[];
      var groupJSON={};
      var alertJSON={};
      if(this.view.flxAlertsSegment.isVisible){
        var data=this.view.segAlertsListing.data;
        for(var i=0;i<data.length;i++){
          groupJSON={};
          groupJSON.typeID=data[i][0].alerttype_id;
          groupJSON.isSub=data[i][0].lblGroupCheckBoxIcon.text!=="D"?true:false;
          groupJSON.alerts=[];
          groupJSON.chanls=[];
          groupJSON.freq={};
          var channelsData=[];
          var supChanls=alertsViewModel.alertTypes[i].supportedChannels.split(",");
          for(var x=1;x<=supChanls.length;x++){
            channelsData.push({"id":data[i][0]["lblChannel"+x].info.id,"isSub":data[i][0]["lblChannel"+x].info.isSelected});
          }
          groupJSON.chanls=channelsData;
          if(data[i][0].flxFrequencyFields.isVisible){
            groupJSON.freq.id=data[i][0].lstBoxFrequency1.selectedKey;
            if(data[i][0].lstBoxFrequency1.selectedKey!=="DAILY")
              groupJSON.freq.value=data[i][0].lstBoxFrequency2.selectedKey;
            groupJSON.freq.time=applicationManager.getFormatUtilManager().getTwentyFourHourTimeString(data[i][0].lstBoxFrequency3.selectedKey);
          }
          for(var j=0;j<data[i][1].length;j++){
            alertJSON={};
            alertJSON.id=data[i][1][j].alertsubtype_id;
            alertJSON.value1=data[i][1][j].tbxAmount1.text;
            alertJSON.value2=(kony.application.getCurrentBreakpoint() === 1024  || orientationHandler.isTablet)?data[i][1][j].tbxAmount3.text:data[i][1][j].tbxAmount2.text;
            alertJSON.isSub=alertsViewModel.alertTypes[i].alertSubTypes[j].isSubscribed==="true"?true:false;
            groupJSON.alerts.push(alertJSON);
          }
          groupsData.push(groupJSON);
        }
      }
      payload.alertSubscription.groups=groupsData;
      return payload;
    },
    /**
      *Method is used to generate update payload at ALERT level
    **/
    generateAlertLevelAlertsPayload : function(alertsModel){
     if(alertsModel.accountId === undefined) {
         var payload={
        "alertCategoryId": alertsModel.AlertCategoryId,
        "isSubscribed": this.view.lblSwitch.text === "o" ? true:false,
        "alertSubscription": {
          "preferenceLevel": this.alertPreference,
          "chanls": [],
          "groups": []
        }
      }
      } else {
      var payload={
        "alertCategoryId": alertsModel.AlertCategoryId,
        "accountId": alertsModel.accountId,
        "isSubscribed": this.view.lblSwitch.text === "o" ? true:false,
        "alertSubscription": {
          "preferenceLevel": this.alertPreference,
          "chanls": [],
          "groups": []
        }
      }
      }
      var alertsViewModel=alertsModel.alertsData;
      var groupsData=[];
      var groupJSON={};
      var alertJSON={};
      if(this.view.flxAlertsSegment.isVisible){
        var data=this.view.segAlertsListing.data;
        for(var i=0;i<data.length;i++){
          groupJSON={};
          groupJSON.typeID=data[i][0].alerttype_id;
          groupJSON.isSub=data[i][0].lblGroupCheckBoxIcon.text!=="D"?true:false;
          groupJSON.alerts=[];
          for(var j=0;j<data[i][1].length;j++){
            alertJSON={};
            alertJSON.id=data[i][1][j].alertsubtype_id;
            alertJSON.value1=data[i][1][j].tbxAmount1.text;
            alertJSON.value2=(kony.application.getCurrentBreakpoint() === 1024  || orientationHandler.isTablet)?data[i][1][j].tbxAmount3.text:data[i][1][j].tbxAmount2.text;
            alertJSON.isSub=data[i][1][j].lblAlertCheckBoxIcon.text==="C"?true:false;
            alertJSON.chanls=[];
            var channelsData=[];
            var supChanls=alertsViewModel.alertTypes[i].alertSubTypes[j].supportedChannels.split(",");
            for(var x=1;x<=supChanls.length;x++){
              channelsData.push({"id":data[i][1][j]["lblChannel"+x].info.id,"isSub":data[i][1][j]["lblChannel"+x].info.isSelected});
            }
            alertJSON.chanls=channelsData;
            if(data[i][1][j].flxFrequencyFields.isVisible){
              alertJSON.freq={};
              alertJSON.freq.id=data[i][1][j].lstBoxFrequency1.selectedKey;
              if(data[i][1][j].lstBoxFrequency1.selectedKey!=="DAILY")
                alertJSON.freq.value=data[i][1][j].lstBoxFrequency2.selectedKey;
              alertJSON.freq.time=applicationManager.getFormatUtilManager().getTwentyFourHourTimeString(data[i][1][j].lstBoxFrequency3.selectedKey);
            }
            groupJSON.alerts.push(alertJSON);
          }
          groupsData.push(groupJSON);
        }
      }
      payload.alertSubscription.groups=groupsData;
      return payload;
    },
    /**
      *Method is used to enable/disable when isInitialLoad is true at ALERT&GROUP&CATEGORY levels
    **/
    initialAlertsToggle : function(alertsModel){
      var alertsViewModel=alertsModel.alertsData;
      if(this.alertPreference==="CATEGORY"){
          this.setCategoryChannelsToUI(alertsViewModel.alertCategory.supportedChannels,alertsViewModel.alertCategory.supportedChannels,false);
      }
      for(var i=0;i<alertsViewModel.alertTypes.length;i++){
        alertsViewModel.alertTypes[i].isSubscribed="true";
        if(this.alertPreference==="GROUP")
          alertsViewModel.alertTypes[i].subscribedChannels=alertsViewModel.alertTypes[i].supportedChannels;
        for(var j=0;j<alertsViewModel.alertTypes[i].alertSubTypes.length;j++){
          alertsViewModel.alertTypes[i].alertSubTypes[j].isSubscribed="true";
          if(this.alertPreference==="ALERT")
            alertsViewModel.alertTypes[i].alertSubTypes[j].subscribedChannels=alertsViewModel.alertTypes[i].alertSubTypes[j].supportedChannels;
        }
      }
      if(this.alertPreference==="ALERT")
        this.setAlertLevelAlertsSegData(alertsViewModel.alertTypes,true);
      else if(this.alertPreference==="GROUP")
        this.setGroupLevelAlertsSegData(alertsViewModel.alertTypes,true);
      else if(this.alertPreference==="CATEGORY")
        this.setCategoryLevelAlertsSegData(alertsViewModel.alertTypes);
      this.view.flxAlertsBody.forceLayout();
    //  this.AdjustScreen();
      this.view.forceLayout();
    },
    clearCategoryLevelValidation : function(){
      this.view.flxInvalidAmount.setVisibility(false);
      this.view.flxChannels.skin="sknFlxffffffNoShadowbodere3e3round3px";
    },
   
   

    };
});