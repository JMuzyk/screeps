const roleFighter = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.room.find(FIND_HOSTILE_CREEPS).length > 0) {
            const creepToAttack = creep.room.find(FIND_HOSTILE_CREEPS)[0];

            if(creep.attack(creepToAttack) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creepToAttack);
            }
        }
    }
};

module.exports = roleFighter;