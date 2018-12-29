const roleTower = require('role.tower');

const structuresManager = {

    run: function() {
        const towers =_.filter(Game.structures, (structure) => structure.structureType === STRUCTURE_TOWER);

        console.log(towers);
        for(let tower in towers) {
            console.log(tower);
            roleTower.run(tower);
        }
    }
};

module.exports = structuresManager;