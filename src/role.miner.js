const roleMiner = (function(){


    function run(creep) {

        if(creep.carry.energy < creep.carryCapacity) {
            const sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
    }

    return {
        run: run
    }
})();

module.exports = roleMiner;