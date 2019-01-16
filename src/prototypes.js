const prototypes = (function(){
    Creep.prototype.goToState = function(state) {
        console.log('goToState: ' + state);
        this.memory.state = state;
    };

})();


module.exports = prototypes;