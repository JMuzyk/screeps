const roleTower = {

    run: function(tower) {
        const enemyCreepsToAttack = tower.room.find(FIND_HOSTILE_CREEPS,
            {filter: (enemyCreep) => enemyCreep.pos.inRangeTo(tower.pos, 20)});

        if (enemyCreepsToAttack.length > 0) {
            const creepToAttack = enemyCreepsToAttack[0];
            tower.attack(creepToAttack);
        }
    }
};

module.exports = roleTower;