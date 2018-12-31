const roleFighter = {

    /** @param {Creep} creep **/
    run: function(creep) {

        const enemyCreeps = creep.room.find(FIND_HOSTILE_CREEPS);
        if (enemyCreeps.length > 0) {
            const creepToAttack = enemyCreeps[0];

            if(creep.attack(creepToAttack) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creepToAttack);
            }
        }
    }
};

module.exports = roleFighter;