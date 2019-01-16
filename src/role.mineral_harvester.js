const roleMineralHarvester = (function () {

    const CreepState = (function () {
        const obj = {};
        obj.STORING = {
            name: 'storing',
            updateState: function(creep) {
                const creepCarry = _.sum(creep.carry);
                if (creepCarry === 0) {
                    creep.goToState(CreepState.HARVESTING);
                }
            },
            action: storeMinerals
        };
        obj.HARVESTING = {
            name: 'harvesting',
            updateState: function(creep) {
                const creepCarry = _.sum(creep.carry);
                if (creepCarry >= creep.carryCapacity) {
                    creep.goToState(CreepState.STORING);
                }
            },
            action: gatherMinerals
        };
        Object.freeze(obj);
        return obj;
    })();

    function storeMinerals(creep) {

        const resourceToTransfer = Object.keys(creep.carry).filter(key => creep.carry[key] > 0)[0];

        if (creep.transfer(creep.room.storage, resourceToTransfer) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.storage);
        }
    }

    function gatherMinerals(creep) {
        const mineralSource = creep.room.find(FIND_MINERALS)[0];
        const extractors = creep.room.find(FIND_STRUCTURES, {filter: (structure) =>  structure.structureType === STRUCTURE_EXTRACTOR});
        if (extractors.length > 0) {
            if (creep.harvest(mineralSource) === ERR_NOT_IN_RANGE) {
                creep.moveTo(mineralSource);
            }
        }
    }

     function run(creep) {

         if(creep.memory.state) {
             creep.memory.state.updateState(creep);
         } else {
             creep.goToState(CreepState.HARVESTING)
         }

        creep.memory.state.action(creep);
    }

    return {
        run: run
    };
})();

module.exports = roleMineralHarvester;