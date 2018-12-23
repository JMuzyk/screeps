var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if(creep.memory.building) {
            const unfinishedBuilding = _.filter(Game.constructionSites, (site) => site.progress < 333300)[0]
            if(creep.build(unfinishedBuilding) === ERR_NOT_IN_RANGE) {
                creep.moveTo(unfinishedBuilding, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            const sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleBuilder;