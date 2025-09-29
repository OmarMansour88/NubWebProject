/**
 * Component controller
 *
 * @author KH2144
 */
define(function() {

  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      this._headerText = "";
      this._infoText = "";
      this._crossImage = "";
      this._sknHeader = "";
      this._sknInfo = "";
    },

    initGettersSetters: function() {
      defineSetter(this, "headerText", function(val) {
        if((typeof val === 'string') && (val !== "")) {
          this._headerText = val;
        }
      });
      defineGetter(this, "headerText", function() {
        return this._headerText;
      });

      defineSetter(this, "infoText", function(val) {
        if((typeof val === 'string') && (val !== "")) {
          this._infoText = val;
        }
      });
      defineGetter(this, "infoText", function() {
        return this._infoText;
      });

      defineSetter(this, "crossImage", function(val) {
        if((typeof val === 'string') && (val !== "")) {
          this._crossImage = val;
        }
      });
      defineGetter(this, "crossImage", function() {
        return this._crossImage;
      });

      defineSetter(this, "sknHeader", function(val) {
        if((typeof val === 'string') && (val !== "")) {
          this._sknHeader = val;
        }
      });
      defineGetter(this, "sknHeader", function() {
        return this._sknHeader;
      });

      defineSetter(this, "sknInfo", function(val) {
        if((typeof val === 'string') && (val !== "")) {
          this._sknInfo = val;
        }
      });
      defineGetter(this, "sknInfo", function() {
        return this._sknInfo;
      });
    },

    /**
     * Component setData
     * Set values for properties
     * @param: flexData{JSONObject} - values for configuration
     */
    setData: function(flexData){
      var scope = this;
      scope._headerText = flexData.headerText;
      scope._infoText = flexData.infoText;
      scope._sknHeader = flexData.headerSkin;
      scope._sknInfo = flexData.infoSkin;
      scope._crossImage = flexData.crossImage;
      this.setUI();
    },

    /**
     * Component setUI
     * Assign the values based on the properties configured
     */
    setUI: function(){
      var scope = this;
      if(scope._headerText){
        scope.view.lblInfo.text = scope._headerText;
      }else{
        scope.view.lblInfo.text = "";
      }
      if(scope._infoText){
        scope.view.RichTextInfo.text = scope._infoText;
      }else{
        scope.view.RichTextInfo.text = "";
      }
      if(scope._sknHeader){
        scope.view.lblInfo.skin = scope._sknHeader;
      }
      if(scope._sknInfo){
        scope.view.RichTextInfo.skin = scope._sknInfo;
      }
      if(scope._crossImage){
        scope.view.imgCross.src = scope._crossImage;
        scope.view.imgCross.setVisibility(true);
      }
      else{
        scope.view.imgCross.setVisibility(false);
      }
    }
  };
});