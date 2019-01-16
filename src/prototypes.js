const prototypes = (function(){
    Creep.prototype.goToState = function(state) {
        this.memory.state = state;
    };

})();


module.exports = prototypes;