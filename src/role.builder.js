const cacheGenie = require('cache_genie');

const roleBuilder = (function () {

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
        } else if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] > 100) {
            if (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.storage);
            }
        } else {
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }

    function checkIfThereIsUrgentRepairSomewhere(creep) {
        const structuresToRepair = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.hits / structure.hitsMax < 0.5 && structure.hits < 250000
        });
        if (structuresToRepair.length > 0) {
            delete creep.memory.constructionSiteId;
            creep.memory.structureToRepairId = structuresToRepair[0].id;
        }
    }

    function repairStructure(creep, structureToRepair) {
        if (creep.repair(structureToRepair) === ERR_NOT_IN_RANGE) {
            creep.moveTo(structureToRepair, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }

    function buildStructure(creep, constructionSite) {
        if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
            creep.moveTo(constructionSite, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }

    function run(creep) {

        if (creep.memory.constructionSiteId && creep.carry.energy > 0) {
            const constructionSite = Game.getObjectById(creep.memory.constructionSiteId);
            if (constructionSite !== null) {
                buildStructure(creep, constructionSite);
            }

            // every 50 ticks check if there is any building with less than 50% hits, then make it repair building and remove build structure
            if (Game.time % 50 === 0) {
                checkIfThereIsUrgentRepairSomewhere(creep);
            }

        } else if (creep.memory.structureToRepairId && creep.carry.energy > 0) {
            const structureToRepair = Game.getObjectById(creep.memory.structureToRepairId);
            if (structureToRepair !== null
                && structureToRepair.hits < structureToRepair.hitsMax && structureToRepair.hits < 300000) {
                repairStructure(creep, structureToRepair);
            } else {
                delete creep.memory.structureToRepairId;
            }

        } else if (creep.carry.energy < creep.carryCapacity) {
            delete creep.memory.constructionSiteId;
            delete creep.memory.structureToRepairId;
            gatherEnergy(creep);
        } else {
            const constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (constructionSites.length > 0) {
                const constructionSiteCloseToFinish = constructionSites.sort((a,b) => (a.progressTotal - a.progress) - (b.progressTotal - b.progress))[0];
                creep.memory.constructionSiteId = constructionSiteCloseToFinish.id;
                buildStructure(creep, constructionSiteCloseToFinish);
            } else {
                const structuresToRepair = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits / structure.hitsMax < 0.8 && structure.hits < 250000
                });
                if (structuresToRepair.length > 0) {
                    const structureToRepair = structuresToRepair[0];
                    creep.memory.structureToRepairId = structureToRepair.id;
                    repairStructure(creep, structureToRepair);
                }
            }
        }
    }

    return {
        run: run
    }
})();


module.exports = roleBuilder;

