define(['FormControllerUtility', 'ViewConstants', 'OLBConstants'], function(FormControllerUtility, ViewConstants, OLBConstants) {
    return {
        shouldUpdateUI: function(viewModel) {
            return viewModel !== undefined && viewModel !== null;
        },
        loadSurveyModule: function() {
            return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName": "AboutUsMA","moduleName":"SurveyUIModule"});
        },
        /**
         * Function to make changes to UI
         * Parameters: surveyViewModel {Object}
         */
        updateFormUI: function(surveyViewModel) {
            if (surveyViewModel.showProgressBar) {
                FormControllerUtility.showProgressBar(this.view);
            } else if (surveyViewModel.hideProgressBar) {
                FormControllerUtility.hideProgressBar(this.view);
            }
            if (surveyViewModel.onServerDownError) {
                this.showServerDownForm(surveyViewModel.onServerDownError);
            }
            if (surveyViewModel.preLoginView) {
                this.showPreLoginView();
            }
            if (surveyViewModel.postLoginView) {
                this.showPostLoginView();
            }
            if (surveyViewModel.surveyQuestion) {
                this.setSurveyQuestionSegmentData(surveyViewModel.surveyQuestion.questions);
                var userObj = applicationManager.getUserPreferencesManager();
                var isLoggedin = userObj.isUserLoggedin();
                if (!isLoggedin) {
                    this.showPreLoginView();
                } else {
                    this.showPostLoginView();
                }
                this.view.forceLayout();
            }
            if (surveyViewModel.quetionsWithAnswers) {
                this.showSurveyAnswer(surveyViewModel.quetionsWithAnswers);
            }
            this.AdjustScreen();
        },
        /**
         * Methoid to handle Server errors.
         * Will navigate to serverdown page.
         */
        showServerDownForm: function(onServerDownError) {
            var authModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName": "AuthenticationMA","moduleName":"AuthUIModule"});
            authModule.presentationController.navigateToServerDownScreen();
        },
        /**
         * Survey Pre-Login View UI
         */
        showPreLoginView: function() {
            this.view.flxHeaderPreLogin.setVisibility(true);
            this.view.flxHeaderPostLogin.setVisibility(false);
            if (kony.application.getCurrentBreakpoint() === 640) {
                this.view.flxHeaderPreLogin.setVisibility(false);
                this.view.flxHeaderPostLogin.setVisibility(true);
            }
            this.view.imgKony.setFocus(true);
            this.view.customheader.topmenu.flxMenu.isVisible = false;
            this.view.forceLayout();
        },
        /**
         * Survey Post-Login View UI
         */
        showPostLoginView: function() {
            this.view.flxHeaderPreLogin.setVisibility(false);
            this.view.flxHeaderPostLogin.setVisibility(true);
            this.view.customheader.imgKony.setFocus(true);
            applicationManager.getLoggerManager().setCustomMetrics(this, false, "Survey");
            this.view.customheader.customhamburger.activateMenu("About Us", "Feedback");
            this.view.customheader.topmenu.flxMenu.isVisible = true;
        },
        //UI Code
        registerAction: function() {
            var scopeObj = this;
            this.view.btnLogin.onClick = function() {
                var authModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName": "AuthenticationMA","moduleName":"AuthUIModule"});
                authModule.presentationController.showLoginScreen();
            };
            this.view.imgLogout.onTouchEnd = function() {
                var authModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName": "AuthenticationMA","moduleName":"AuthUIModule"});
                authModule.presentationController.showLoginScreen();
            };
        },
        postShowCustomerFeedbackSurvey: function() {
            applicationManager.getNavigationManager().applyUpdates(this);
            this.AdjustScreen();
        },
      //UI Code
      AdjustScreen: function() {
        this.view.forceLayout();
        var mainheight = 0;
        var screenheight = kony.os.deviceInfo().screenHeight;
        mainheight = this.view.customheader.info.frame.height + this.view.flxMainContainer.info.frame.height;
        if (this.view.customheader.info.frame.height == 0) {
          mainheight += 120;
        }
        var diff = screenheight - mainheight;
        var orientationHandler = new OrientationHandler();
        var isMobile = ((kony.application.getCurrentBreakpoint() === 640) || orientationHandler.isMobile);
        if (!isMobile) {
          if (mainheight < screenheight) {
            diff = diff - this.view.flxFooter.info.frame.height;
            if (diff > 0) {
              if (kony.application.getCurrentBreakpoint() === 1024){
                this.view.flxFooter.top = kony.os.deviceInfo().screenHeight+300 + "dp";
              }else {
                this.view.flxFooter.top = mainheight + diff + "dp";
              }
            }
            else {
              if (kony.application.getCurrentBreakpoint() === 1024){
                this.view.flxFooter.top = kony.os.deviceInfo().screenHeight+300 + "dp";
              }
              else{
                this.view.flxFooter.top = mainheight + "dp";
              }
            }
          } else {
            if (kony.application.getCurrentBreakpoint() === 1024){
              this.view.flxFooter.top = kony.os.deviceInfo().screenHeight+300 + "dp";
            }else{
              this.view.flxFooter.top = mainheight + "dp";
            }
          }
        }
        else{
          this.view.flxFooter.top = "1450dp";
			}

        this.view.flxMainContainer.parent.forceLayout();
      },
        preShowCustomerFeedbackSurvey: function() {
            this.view.customheader.forceCloseHamburger();
            this.view.customheader.topmenu.flxaccounts.skin = ViewConstants.SKINS.BLANK_SKIN_TOPMENU_HOVER;
            this.view.customheader.topmenu.lblFeedback.skin = ViewConstants.SKINS.FEEDBACK_LABELFEEDBACK;
            this.registerAction();
            this.view.FeedbackSurvey.confirmButtons.btnConfirm.skin = ViewConstants.SKINS.BUTTON_ENABLED;
            this.view.FeedbackSurvey.confirmButtons.btnConfirm.hoverSkin = ViewConstants.SKINS.FOCUS;
            this.view.FeedbackSurvey.confirmButtons.btnConfirm.focusSkin = ViewConstants.SKINS.HOVER;
            this.view.FeedbackSurvey.confirmButtons.btnModify.toolTip = kony.i18n.getLocalizedString("i18n.transfers.Cancel");
            this.view.FeedbackSurvey.confirmButtons.btnConfirm.toolTip = kony.i18n.getLocalizedString("i18n.CustomerFeedback.Submit");
            this.view.FeedbackSurvey.confirmButtons.btnConfirm.onClick = this.btnSubmitAction;
            this.view.FeedbackSurvey.confirmButtons.btnModify.onClick = this.btnAckDoneAction;
            this.view.btnDone.onClick = this.btnAckDoneAction;
            var scopeObj = this;
            this.view.onBreakpointChange = function() {
                scopeObj.onBreakpointChange(kony.application.getCurrentBreakpoint());
            }
            this.view.forceLayout();
            FormControllerUtility.updateWidgetsHeightInInfo(this, ['customheader', 'flxMainContainer', 'flxFooter', 'flxHeaderPreLogin']);
        },
        onBreakpointChange: function(width) {
            this.view.customheader.customhamburger.width = "100%";
          this.view.customheader.onBreakpointChangeComponent(width);
        },
        showRatingAction: function(val) {
            for (var i = 1; i <= val; i++) {
                this.view.FeedbackSurvey["imgRating" + i].src = ViewConstants.IMAGES.CIRCLE_BLUE_FILLED;
            }
            for (i = (val + 1); i <= 5; i++) {
                this.view.FeedbackSurvey["imgRating" + i].src = ViewConstants.IMAGES.CIRCLE_UNFILLED;
            }
            this.enableButton(this.view.FeedbackSurvey.confirmButtons.btnConfirm);
            this.view.flxMainContainer.parent.forceLayout();
        },
        btnAckDoneAction: function() {
            this.loadSurveyModule().presentationController.surveyDone();
        },
        btnSubmitAction: function() {
            var resAnswer = {};
            var disAnswers = {};
            var allQuest = kony.application.getCurrentForm().FeedbackSurvey.segSurveyQuestion1.data;
            var displayAnswer = [];
            for (var i = 0; i < allQuest.length; i++) {
                var quest = allQuest[i];
                if (quest.template === "flxRowSurvey") {
                    resAnswer[quest.questionid] = this.returnRating(quest);
                } else if (quest.template === "flxSurveyQuestion2") {
                    resAnswer[quest.questionid] = this.getSelectedCheckBoxValue(quest);
                } else if (quest.template === "flxSurveyQuestion3") {
                    resAnswer[quest.questionid] = quest.txtareaUserAdditionalComments.text;
                } else if (quest.template === "flxSurveyQuestion4") {
                    resAnswer[quest.questionid] = this.returnYesNoAnswer(quest);
                } else {
                    return false;
                }
            }
            this.loadSurveyModule().presentationController.showSurveyAnswer(resAnswer);
            this.AdjustScreen();
        },
        returnRating: function(quest) {
            var response = {};
            response["rating"] = quest.selectedRating;
            response["type"] = this.returnRatingType(quest.lblVeryHard);
            return response;
        },
        returnRatingType: function(label) {
            if (label === "Very Unlikely") {
                return "likelyUnlikely";
            } else if (label === "Very Hard") {
                return "hardEasy";
            } else if (label === "Very Bad") {
                return "goodBad";
            }
        },
        returnYesNoAnswer: function(quest) {
            if (quest.lblRadioBtn1.text === "M") {
                return quest.lblYes;
            } else if (quest.lblRadioBtn2.text === "M") {
                return quest.lblNo;
            } else {
                return "";
            }
        },
        showSurveyAnswer: function(data) {
            var orientationHandler = new OrientationHandler();
            this.view.flxFeedbackSurveyContainer.setVisibility(false);
            this.view.flxFeedbackAcknowledgement.setVisibility(true);
            var dataMap = {
                "flxRowFeedbackSurveyQuestion": "flxRowFeedbackSurveyQuestion",
                "flxSurveyQuestionWrapper": "flxSurveyQuestionWrapper",
                "flxQuestion1": "flxQuestion1",
                "lblQuestion1": "lblQuestion1",
                "lblQuestionNo1": "lblQuestionNo1",
                "lblAnswer1": "lblAnswer1"
            };
            var numCounter = 1;
            var surveyData = data.map(function(dataItem) {
                return {
                    "lblQuestionNo1": numCounter++,
                     "lblQuestion1": {"text":dataItem.question,"left":"20dp"},
                    "lblAnswer1": {"text":dataItem.answerString,"left":"20dp"},
                    "template": "flxRowFeedbackSurveyQuestion"
                }
            });
            this.view.segSurveyQuestion.widgetDataMap = dataMap;
            this.view.segSurveyQuestion.setData(surveyData);
            var isMobile = ((kony.application.getCurrentBreakpoint() === 640) || orientationHandler.isMobile);
            var isTablet = ((kony.application.getCurrentBreakpoint() === 1024) || orientationHandler.isTablet);
            if (isMobile == false && isTablet == false) {
                this.view.flxMainContainer.height = "1050dp";
            }
            if (isMobile === true) {
                this.view.flxMainContainer.height = "1350dp";
            }
            if (isTablet === true) {
                this.view.flxMainContainer.height = "1200dp";
            }
            this.view.flxMainContainer.parent.forceLayout();
        },
        getSelectedCheckBoxValue: function(quest) {
            var selectedAns = [];
            for (var i = 1; quest["lblcheckbox" + i] != undefined; i++) {
                if (quest["lblcheckbox" + i] === OLBConstants.FONT_ICONS.CHECBOX_SELECTED) {
                    selectedAns.push(i - 1)
                }
            }
            return selectedAns;
        },
        btnCancelAction: function() {
            if (this.view.FeedbackSurvey.flxRating1.src === ViewConstants.IMAGES.CIRCLE_BLUE_FILLED || this.view.FeedbackSurvey.flxRating2.src === ViewConstants.IMAGES.CIRCLE_BLUE_FILLED || this.view.FeedbackSurvey.flxRating3.src === ViewConstants.IMAGES.CIRCLE_BLUE_FILLED || this.view.FeedbackSurvey.flxRating4.src === ViewConstants.IMAGES.CIRCLE_BLUE_FILLED || this.view.FeedbackSurvey.flxRating5.src === ViewConstants.IMAGES.CIRCLE_BLUE_FILLED) {
                this.view.FeedbackSurvey.flxRating1.src = ViewConstants.IMAGES.CIRCLE_UNFILLED;
                this.view.FeedbackSurvey.flxRating2.src = ViewConstants.IMAGES.CIRCLE_UNFILLED;
                this.view.FeedbackSurvey.flxRating3.src = ViewConstants.IMAGES.CIRCLE_UNFILLED;
                this.view.FeedbackSurvey.flxRating4.src = ViewConstants.IMAGES.CIRCLE_UNFILLED;
                this.view.FeedbackSurvey.flxRating5.src = ViewConstants.IMAGES.CIRCLE_UNFILLED;
                this.view.flxMainContainer.parent.forceLayout();
            } else {
                applicationManager.getNavigationManager().navigateTo("frmLogin");
            }
        },
        toggleCheckBox: function(imgCheckBox) {
            if (imgCheckBox.src === ViewConstants.IMAGES.UNCHECKED_IMAGE) {
                imgCheckBox.src = ViewConstants.IMAGES.CHECKED_IMAGE;
            } else {
                imgCheckBox.src = ViewConstants.IMAGES.UNCHECKED_IMAGE;
            }
        },
        /**
         *  Disable button.
         */
        disableButton: function(button) {
            button.setEnabled(false);
            button.skin = ViewConstants.SKINS.BLOCKED;
            button.hoverSkin = ViewConstants.SKINS.BLOCKED;
            button.focusSkin = ViewConstants.SKINS.BLOCKED;
        },
        /**
         * Enable button.
         */
        enableButton: function(button) {
            button.setEnabled(true);
            button.skin = ViewConstants.SKINS.BUTTON_ENABLED;
            button.hoverSkin = ViewConstants.SKINS.FOCUS;
            button.focusSkin = ViewConstants.SKINS.HOVER;
        },
        setSurveyQuestionSegmentData: function(data) {
            var self = this;
            this.view.flxFeedbackSurveyContainer.setVisibility(true);
            this.view.flxFeedbackAcknowledgement.setVisibility(false);
            var dataMap = {
                "flxRating1": "flxRating1",
                "flxRating2": "flxRating2",
                "flxRating3": "flxRating3",
                "flxRating4": "flxRating4",
                "flxRating5": "flxRating5",
                "flxRatingimg": "flxRatingimg",
                "flxRowSurvey": "flxRowSurvey",
                "flxSurveyQuestion1Wrapper": "flxSurveyQuestion1Wrapper",
                "flxaddress": "flxaddress",
                "imgRating1": "imgRating1",
                "imgRating2": "imgRating2",
                "imgRating3": "imgRating3",
                "imgRating4": "imgRating4",
                "imgRating5": "imgRating5",
                "lblRateYourExpeience": "lblRateYourExpeience",
                "lblVeryEasy": "lblVeryEasy",
                "lblVeryHard": "lblVeryHard",
                "flxNotificationsmsgs": "flxNotificationsmsgs",
                "flxSecurityQuestionSetting": "flxSecurityQuestionSetting",
                "flxSurveyQuestion2": "flxSurveyQuestion2",
                "flxSurveyQuestion2Wrapper": "flxSurveyQuestion2Wrapper",
                "flxTransfers": "flxTransfers",
                "flxbillpay": "flxbillpay",
                "flxcheckbox1": "flxcheckbox1",
                "flxcheckbox2": "flxcheckbox2",
                "flxcheckbox3": "flxcheckbox3",
                "flxcheckbox4": "flxcheckbox4",
                "lblcheckbox1": "lblcheckbox1",
                "lblcheckbox2": "lblcheckbox2",
                "lblcheckbox3": "lblcheckbox3",
                "lblcheckbox4": "lblcheckbox4",
                "lblAddYourComments": "lblAddYourComments",
                "lblBillpay": "lblBillpay",
                "lblSecurityQuestionSettings": "lblSecurityQuestionSettings",
                "lblTranfers": "lblTranfers",
                "lblnotificationsmsgs": "lblnotificationsmsgs",
                "flxSurveyQuestion3": "flxSurveyQuestion3",
                "flxSurveyQuestion3Wrapper": "flxSurveyQuestion3Wrapper",
                "flxUserFeedback": "flxUserFeedback",
                "lblQuestion": "lblQuestion",
                "txtareaUserAdditionalComments": "txtareaUserAdditionalComments",
                "flxSurveyQuestion4": "flxSurveyQuestion4",
                "flxSurveyQuestion4Wrapper": "flxSurveyQuestion4Wrapper",
                "lblYes": "lblYes",
                "lblNo": "lblNo",
                "lblRadioBtn1": "lblRadioBtn1",
                "lblRadioBtn2": "lblRadioBtn2",
                "flxNUORadioBtn1": "flxNUORadioBtn1",
                "flxNUORadioBtn2": "flxNUORadioBtn2"
            };
            var surveyData = [];
            if (data.length > 0) {
                surveyData = data.map(function(dataItem) {
                    var response = {};
                    if (dataItem.inputType === "rating") {
                        response = {
                            "imgRating1": ViewConstants.IMAGES.CIRCLE_UNFILLED,
                            "imgRating2": ViewConstants.IMAGES.CIRCLE_UNFILLED,
                            "imgRating3": ViewConstants.IMAGES.CIRCLE_UNFILLED,
                            "imgRating4": ViewConstants.IMAGES.CIRCLE_UNFILLED,
                            "imgRating5": ViewConstants.IMAGES.CIRCLE_UNFILLED,
                            "lblRateYourExpeience": dataItem.question,
                            "lblVeryHard": dataItem.questionInput[0],
                            "lblVeryEasy":{
								"text":dataItem.questionInput[1],
								"left":(kony.application.getCurrentBreakpoint() === 640)?"30%":"21.5%",
							},
                            "template": "flxRowSurvey"
                        }
                    } else if (dataItem.inputType === "mcq") {
                        response = {
                            "lblcheckbox1": OLBConstants.FONT_ICONS.CHECBOX_UNSELECTED,
                            "lblcheckbox2": OLBConstants.FONT_ICONS.CHECBOX_UNSELECTED,
                            "lblcheckbox3": OLBConstants.FONT_ICONS.CHECBOX_UNSELECTED,
                            "lblcheckbox4": OLBConstants.FONT_ICONS.CHECBOX_UNSELECTED,
                            "lblAddYourComments": dataItem.question,
                            "lblBillpay": {
                                "text": dataItem.questionInput[1],
                                "isVisible": true,
                            },
                            "lblSecurityQuestionSettings": {
                                "text": dataItem.questionInput[2],
                                "isVisible": true,
                            },
                            "lblTranfers": {
                                "text": dataItem.questionInput[0],
                                "isVisible": dataItem.questionInput[0] ? true : false,
                            },
                            "lblnotificationsmsgs": {
                                "text": dataItem.questionInput[3],
                                "isVisible": dataItem.questionInput[3] ? true : false,
                            },
                            "template": "flxSurveyQuestion2"
                        }
                    } else if (dataItem.inputType === "text") {
                        response = {
                            "flxSurveyQuestion3": "flxSurveyQuestion3",
                            "flxSurveyQuestion3Wrapper": "flxSurveyQuestion3Wrapper",
                            "flxUserFeedback": "flxUserFeedback",
                            "lblQuestion": dataItem.question,
                            "txtareaUserAdditionalComments": " ",
                            "template": "flxSurveyQuestion3"
                        }
                    } else if (dataItem.inputType === "yesNo") {
                        response = {
                            "flxSurveyQuestion4": "flxSurveyQuestion4",
                            "flxSurveyQuestion4Wrapper": "flxSurveyQuestion4Wrapper",
                            "lblRateYourExpeience": dataItem.question,
                            "lblYes": dataItem.questionInput[0],
                            "lblNo": dataItem.questionInput[1],
                            "lblRadioBtn1": {
                                "text": "L",
                                "skin": "sknC0C0C020pxNotFontIconsMOD"
                            },
                            "lblRadioBtn2": {
                                "text": "L",
                                "skin": "sknC0C0C020pxNotFontIconsMOD"
                            },
                            "flxNUORadioBtn1": {
                                "onClick": self.toggleYesNo.bind(self, 1)
                            },
                            "flxNUORadioBtn2": {
                                "onClick": self.toggleYesNo.bind(self, 2)
                            },
                            "template": "flxSurveyQuestion4"
                        }
                    }
                    response.questionid = dataItem.questionid;
                    return response;
                });
            }
            this.view.FeedbackSurvey.segSurveyQuestion1.widgetDataMap = dataMap;
            this.view.FeedbackSurvey.segSurveyQuestion1.setData(surveyData);
            this.view.flxMainContainer.parent.forceLayout();
        },
        toggleYesNo: function(index) {
            var labelWidgetIndex = this.view.FeedbackSurvey.segSurveyQuestion1.selectedRowIndex[1];
            var segData = this.view.FeedbackSurvey.segSurveyQuestion1.data;
            var rowData = this.view.FeedbackSurvey.segSurveyQuestion1.selectedRowItems[0];
            rowData.lblRadioBtn1 = {
                "text": "L",
                "skin": "sknC0C0C020pxNotFontIconsMOD"
            };
            rowData.lblRadioBtn2 = {
                "text": "L",
                "skin": "sknC0C0C020pxNotFontIconsMOD"
            };
            rowData['lblRadioBtn' + index] = {
                "text": "M",
                "skin": "sknLblFontTypeIcon3343e820pxMOD"
            };
            this.view.FeedbackSurvey.segSurveyQuestion1.setDataAt(rowData, labelWidgetIndex);
        }
    }
});