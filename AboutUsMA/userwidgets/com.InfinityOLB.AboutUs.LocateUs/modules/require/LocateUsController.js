define(['CommonUtilities'], function(CommonUtilities) {

  return {
    postshow: function(){
      let widgets = [
        [this.view.tbxSearchBox, this.view.flxSearchBar]
      ]
      for(let i=0; i<widgets.length; i++){
        CommonUtilities.setA11yFoucsHandlers(widgets[i][0], widgets[i][1], this)
      }
    }
  };
});