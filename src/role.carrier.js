const roleCarrier = (function () {

    const CreepState = (function () {
        const obj = {};
        obj.IDLE = 'idle';
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
            } else {
                if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage);
                }
            }
        }
    }

    function gatherEnergy(creep) {
        if (creep.room.storage) {
            if (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.storage);
            }
        }
    }

    function returnEnergyToStorage(creep) {
        if (creep.carry.energy > 0) {
            if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.storage);
            }
        }
    }

    function goToState(creep, state) {
        creep.memory.state = state;
    }

    function anyStructureRequireEnergy(creep) {
        const spawnsAndTowers = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_SPAWN
                    || structure.structureType === STRUCTURE_TOWER
                    || structure.structureType === STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity;
            }
        });

        return spawnsAndTowers.length > 0;
    }

    function run(creep) {

        switch (creep.memory.state) {
            case CreepState.DELIVERING:
                if (creep.carry.energy === 0) {
                    if (creep.ticksToLive < 50 || !anyStructureRequireEnergy(creep)) {
                        goToState(creep, CreepState.IDLE);
                    } else {
                        goToState(creep, CreepState.GATHERING);
                    }
                }
                break;
            case CreepState.GATHERING:
                if (creep.carry.energy === creep.carryCapacity) {
                    goToState(creep, CreepState.DELIVERING);
                }
                break;
            case CreepState.IDLE:
                if (anyStructureRequireEnergy(creep) && creep.ticksToLive > 50) {
                    if (creep.carry.energy === creep.carryCapacity) {
                        goToState(creep, CreepState.DELIVERING);
                    } else {
                        goToState(creep, CreepState.GATHERING);
                    }
                }
                break;
            default:
                goToState(creep, CreepState.IDLE);
                break;
        }

        switch (creep.memory.state) {
            case CreepState.DELIVERING:
                deliverEnergy(creep);
                break;
            case CreepState.GATHERING:
                gatherEnergy(creep);
                break;
            case CreepState.IDLE:
                returnEnergyToStorage(creep);
                break;
            default:
                returnEnergyToStorage(creep);
        }

    }

    return {
        run: run
    }
})();

module.exports = roleCarrier;