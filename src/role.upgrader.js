const roleUpgrader = (function () {

    function gatherEnergy(creep) {
        // TODO get proper source from memory
        const source = creep.room.find(FIND_SOURCES)[0];
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

    function isNearEnergySource(creep) {
        // TODO source from memory
        const energySources = creep.room.find(FIND_SOURCES);
        return creep.pos.isNearTo(energySources[0].pos)
    }


    function deliverEnergy(creep) {
        if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }

    function isNearController(creep) {
        return creep.pos.inRangeTo(creep.room.controller.pos, 3);
    }

    function run(creep) {
        if (creep.carry.energy > 0 && (isNearController(creep) || !isNearEnergySource(creep))
            || creep.carry.energy === creep.carryCapacity) {
            deliverEnergy(creep);
        } else {
            gatherEnergy(creep);
        }
    }

    return {
        run: run
    }
})();

module.exports = roleUpgrader;