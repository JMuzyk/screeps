const roleMineralHarvester = (function () {

    const CreepState = (function () {
        const obj = {};
        obj.STORING = 'storing';
        obj.HARVESTING = 'harvesting';
        Object.freeze(obj);
        return obj;
    })();

    function goToState(creep, state) {
        creep.memory.state = state;
    }

    function storeMinerals(creep) {

        const resourceToTransfer = Object.keys(creep.carry).filter(key => creep.carry[key] > 0)[0];
        const terminalStore = _sum(creep.room.terminal.store);
        if (creep.room.terminal && terminalStore < 300000) {
            if (creep.transfer(creep.room.terminal, resourceToTransfer) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.terminal);
            }
        } else if (creep.transfer(creep.room.storage, resourceToTransfer) === ERR_NOT_IN_RANGE) {
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
         const creepCarry = _.sum(creep.carry);
         switch (creep.memory.state) {

            case CreepState.STORING:
                if (creepCarry === 0) {
                    goToState(creep, CreepState.HARVESTING);
                }
                break;
            case CreepState.HARVESTING:

                if (creepCarry >= creep.carryCapacity) {
                    goToState(creep, CreepState.STORING);
                }
                break;
            default:
                goToState(creep, CreepState.HARVESTING);
                break;
        }

        switch (creep.memory.state) {
            case CreepState.STORING:
                storeMinerals(creep);
                break;
            case CreepState.HARVESTING:
                gatherMinerals(creep);
                break;
            default:
                gatherMinerals(creep);
        }
    }

    return {
        run: run
    };
})();

module.exports = roleMineralHarvester;