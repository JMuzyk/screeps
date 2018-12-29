const roleTower = require('role.tower');

const structuresManager = {

    run: function() {
        const towers =_.filter(Game.structures, (structure) => structure.structureType === STRUCTURE_TOWER);

        for(let i = 0; i < towers.length; i++) {
            roleTower.run(towers[i]);
        }
    }
};

module.exports = structuresManager;