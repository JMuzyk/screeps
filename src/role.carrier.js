const roleCarrier = (function () {

    const CreepState = (function () {
        const obj = {};
        obj.IDLE = 'idle';
        obj.DELIVERING = 'delivering';
        obj.GATHERING = 'gathering';
        obj.GATHERING_MINERALS = 'gathering_minerals';
        obj.DELIVERING_MINERALS = 'delivering_minerals';
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

    function deliverMinerals(creep) {
        const mineralType = creep.room.find(FIND_MINERALS)[0].mineralType;
        if (creep.carry[mineralType] > 0) {
            if (creep.transfer(creep.room.terminal, mineralType) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.terminal);
            }
        }
    }

    function gatherMinerals(creep) {
        const mineralType = creep.room.find(FIND_MINERALS)[0].mineralType;
        if (creep.room.storage) {
            if (creep.withdraw(creep.room.storage, mineralType) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.storage);
            }
        }
    }

    function terminalNeedsResources(creep) {
        const mineralType = creep.room.find(FIND_MINERALS)[0].mineralType;
        return typeof creep.room.terminal !== 'undefined' && creep.room.terminal.store[mineralType] < 100000;
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
                if (creep.ticksToLive > 50) {
                    if (anyStructureRequireEnergy(creep)) {
                        if (creep.carry.energy === creep.carryCapacity) {
                            goToState(creep, CreepState.DELIVERING);
                        } else {
                            goToState(creep, CreepState.GATHERING);
                        }
                    } else if (terminalNeedsResources(creep)) {
                        if (_.sum(creep.carry) === creep.carryCapacity) {
                            goToState(creep, CreepState.DELIVERING_MINERALS);
                        } else {
                            goToState(creep, CreepState.GATHERING_MINERALS);
                        }
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
            case CreepState.DELIVERING_MINERALS:
                deliverMinerals(creep);
                break;
            case CreepState.GATHERING_MINERALS:
                gatherMinerals(creep);
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