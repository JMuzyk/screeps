const cacheGenie = require('cache_genie');

const roleUpgrader = (function () {

    const CreepState = (function () {
        const obj = {};
        obj.UPGRADING = 'upgrading';
        obj.HARVESTING = 'harvesting';
        Object.freeze(obj);
        return obj;
    })();

    function goToState(creep, state) {
        creep.memory.state = state;
    }

    function gatherEnergy(creep) {
        if(typeof creep.memory.sourceId === 'undefined') {
            creep.memory.sourceId = cacheGenie.getResourceSourceClosestToController(creep.room);
        }
        const source = Game.getObjectById(creep.memory.sourceId);
        const containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 200
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

    function deliverEnergy(creep) {
        if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }

    function run(creep) {

        switch (creep.memory.state) {
            case CreepState.UPGRADING:
                if (creep.carry.energy === 0) {
                    goToState(creep, CreepState.HARVESTING);
                }
                break;
            case CreepState.HARVESTING:
                const maxEfficientEnergyLimit = creep.carryCapacity - (creep.carryCapacity % creep.body
                    .filter(body => body.type === WORK)
                    .map(() => 2)
                    .reduce((a, b) => a + b, 0));
                if (creep.carry.energy >= maxEfficientEnergyLimit) {
                    goToState(creep, CreepState.UPGRADING);
                }
                break;
            default:
                goToState(creep, CreepState.HARVESTING);
                break;
        }

        switch (creep.memory.state) {
            case CreepState.UPGRADING:
                deliverEnergy(creep);
                break;
            case CreepState.HARVESTING:
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

module.exports = roleUpgrader;