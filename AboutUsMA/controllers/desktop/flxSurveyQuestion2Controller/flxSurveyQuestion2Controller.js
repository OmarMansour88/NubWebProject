define({
    toggleSurveyQuestionTransfersCheckBox: function() {
        var index = kony.application.getCurrentForm().FeedbackSurvey.segSurveyQuestion1.selectedRowIndex[1];
        var data = kony.application.getCurrentForm().FeedbackSurvey.segSurveyQuestion1.data;
        for (i = 0; i < data.length; i++) {
            if (i == index) {
                kony.print("index:" + index);
                if (data[i].lblcheckbox1 === "D") {
                    data[i].lblcheckbox1 = "C";
                } else {
                    data[i].lblcheckbox1 = "D";
                }
            }
            kony.application.getCurrentForm().FeedbackSurvey.segSurveyQuestion1.setDataAt(data[index], index);
        }
    },
    toggleSurveyQuestionBillPayCheckBox: function() {
        var index = kony.application.getCurrentForm().FeedbackSurvey.segSurveyQuestion1.selectedRowIndex[1];
        var data = kony.application.getCurrentForm().FeedbackSurvey.segSurveyQuestion1.data;
        for (i = 0; i < data.length; i++) {
            if (i == index) {
                kony.print("index:" + index);
                if (data[i].lblcheckbox2 === "D") {
                    data[i].lblcheckbox2 = "C";
                } else {
                    data[i].lblcheckbox2 = "D";
                }
            }
            kony.application.getCurrentForm().FeedbackSurvey.segSurveyQuestion1.setDataAt(data[index], index);
        }
    },
    toggleSurveyQuestionSecuritySettingCheckBox: function() {
        var index = kony.application.getCurrentForm().FeedbackSurvey.segSurveyQuestion1.selectedRowIndex[1];
        var data = kony.application.getCurrentForm().FeedbackSurvey.segSurveyQuestion1.data;
        for (i = 0; i < data.length; i++) {
            if (i == index) {
                kony.print("index:" + index);
                if (data[i].lblcheckbox3 === "D") {
                    data[i].lblcheckbox3 = "C";
                } else {
                    data[i].lblcheckbox3 = "D";
                }
            }
            kony.application.getCurrentForm().FeedbackSurvey.segSurveyQuestion1.setDataAt(data[index], index);
        }
    },
    toggleSurveyQuestionNotificationMsgsCheckBox: function() {
        var index = kony.application.getCurrentForm().FeedbackSurvey.segSurveyQuestion1.selectedRowIndex[1];
        var data = kony.application.getCurrentForm().FeedbackSurvey.segSurveyQuestion1.data;
        for (i = 0; i < data.length; i++) {
            if (i == index) {
                kony.print("index:" + index);
                if (data[i].lblcheckbox4 === "D") {
                    data[i].lblcheckbox4 = "C";
                } else {
                    data[i].lblcheckbox4 = "D";
                }
            }
            kony.application.getCurrentForm().FeedbackSurvey.segSurveyQuestion1.setDataAt(data[index], index);
        }
    },
});