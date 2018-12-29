const roleTower = require('role.tower');

const structuresManager = {

    run: function() {
        const towers = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_TOWER
        });

        for(let tower in towers) {
            roleTower.run(tower);
        }
    }
};

module.exports = structuresManager;