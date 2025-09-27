define({
    showRatingActionCircle: function(val) {
        var imgdata = [5];
        var index = kony.application.getCurrentForm().FeedbackSurvey.segSurveyQuestion1.selectedRowIndex[1];
        var data = kony.application.getCurrentForm().FeedbackSurvey.segSurveyQuestion1.data;
        for (i = 0; i < data.length; i++) {
            if (i == index) {
                imgdata[1] = data[i].imgRating1;
                imgdata[2] = data[i].imgRating2;
                imgdata[3] = data[i].imgRating3;
                imgdata[4] = data[i].imgRating4;
                imgdata[5] = data[i].imgRating5;
            }
        }
        for (var i = 1; i <= val; i++) {
            imgdata[i] = "circle_blue_filled.png";
        }
        for (i = (val + 1); i <= 5; i++) {
            imgdata[i] = "circle_unfilled.png";
        }
        for (i = 0; i < data.length; i++) {
            if (i == index) {
                data[i].selectedRating = val;
                data[i].imgRating1 = imgdata[1];
                data[i].imgRating2 = imgdata[2];
                data[i].imgRating3 = imgdata[3];
                data[i].imgRating4 = imgdata[4];
                data[i].imgRating5 = imgdata[5];
            }
        }
        kony.application.getCurrentForm().FeedbackSurvey.segSurveyQuestion1.setDataAt(data[index], index);
        kony.application.getCurrentForm().forceLayout();
    }
});