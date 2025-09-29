define(function() {

  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      //contracts declarations

      //General
      this._tnc = "";
    },
    //Logic for getters/setters of custom properties
    initGettersSetters: function() {
      //setter method for tnc in the group:General
      defineSetter(this, "tnc", function(val) {
        if((typeof val==='string') && (val !== "")){
          this._tnc=val;
        }
      });
      //getter method for tnc in the group:General
      defineGetter(this, "tnc", function() {
        return this._tnc;
      });
    },

    /**
     * Component setContext.
     * Responsible to setting the context
     */
    setContext: function(context){
      this._context = context;
    },

    /**
      * setParentScope.
      * This Method is exposed to the form to pass the Form Scope.
      */
    setParentScope: function(scope){
      this._parentScope = scope;
    },

    /**
     * Component preShow.
     */
    preshow: function(){
      this.view.rtxTermsConditionsValue.text = this._tnc;
    },
  };
});