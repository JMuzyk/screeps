const cacheGenie = require('cache_genie');

const roleHarvester = (function () {

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
            } else if(creep.room.terminal && creep.room.terminal.store[RESOURCE_ENERGY] < 200000) {
                if (creep.transfer(creep.room.terminal, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.terminal);
                }
            } else if (creep.room.storage) {
                if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage);
                }
            }
        }
    }

    function gatherEnergy(creep) {
        const source = creep.room.find(FIND_SOURCES, {
            filter: (source) => source.id !== cacheGenie.getResourceSourceClosestToController(creep.room)
        })[0];
        const containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0
                    && structure.pos.findClosestByRange(FIND_SOURCES) === source;
            }
        });
        if (containers.length > 0) {
            if (creep.withdraw(containers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(containers[0]);
            }
        } else {
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }

    function isNearEnergySource(creep) {
        const source = creep.room.find(FIND_SOURCES, {
            filter: (source) => source.id !== cacheGenie.getResourceSourceClosestToController(creep.room)
        })[0];
        return creep.pos.isNearTo(source.pos)
    }

    function run(creep) {

        if (creep.carry.energy > 0 && !isNearEnergySource(creep) || creep.carry.energy === creep.carryCapacity) {
            deliverEnergy(creep);
        } else {
            gatherEnergy(creep);
        }
    }

    return {
        run: run
    };
})();

module.exports = roleHarvester;