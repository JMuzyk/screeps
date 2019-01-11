const roleCarrier = (function(){

    const CreepState = (function () {
        const obj = {};
        obj.DELIVERING = 'delivering';
        obj.GATHERING = 'gathering';
        Object.freeze(obj);
        return obj;
    })();

    function deliverEnergy(creep) {
        const spawnsAndTowers = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_SPAWN ||
                    structure.structureType === STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        });

        if (spawnsAndTowers.length > 0) {
            if (creep.transfer(spawnsAndTowers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(spawnsAndTowers[0]);
            }
        } else {
            const closestExtensionWithEnergyNeed = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType === STRUCTURE_EXTENSION
                        && structure.energy < structure.energyCapacity;
                }
            });

            if (closestExtensionWithEnergyNeed !== null) {
                if (creep.transfer(closestExtensionWithEnergyNeed, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestExtensionWithEnergyNeed);
                }
            }
        }
    }

    function gatherEnergy(creep) {
        if(creep.room.storage) {
            if (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.storage);
            }
        }
    }

    function goToState(creep, state) {
        creep.memory.state = state;
    }

    function run(creep) {

        switch (creep.memory.state) {
            case CreepState.DELIVERING:
                if (creep.carry.energy === 0) {
                    goToState(creep, CreepState.GATHERING);
                }
                break;
            case CreepState.GATHERING:
                if (creep.carry.energy === creep.carryCapacity) {
                    goToState(creep, CreepState.DELIVERING);
                }
                break;
            default:
                goToState(creep, CreepState.GATHERING);
                break;
        }

        switch (creep.memory.state) {
            case CreepState.DELIVERING:
                deliverEnergy(creep);
                break;
            case CreepState.GATHERING:
                gatherEnergy(creep);
                break;
            default:
                gatherEnergy(creep);
        }

    }

    return {
        run: run
    }
})();

module.exports = roleCarrier;