const roleTower = (function () {

    function run(tower) {
        const enemyCreepsToAttack = tower.room.find(FIND_HOSTILE_CREEPS,
            {filter: (enemyCreep) => enemyCreep.pos.inRangeTo(tower.pos, 20)});

        const friendlyCreepsToHeal = tower.room.find(FIND_MY_CREEPS,
            {filter: (friendlyCreep) => friendlyCreep.hits < friendlyCreep.hitsMax});
        if (enemyCreepsToAttack.length > 0) {
            const creepToAttack = enemyCreepsToAttack[0];
            tower.attack(creepToAttack);
        } else if (friendlyCreepsToHeal.length > 0) {
            const creepToHeal = friendlyCreepsToHeal[0];
            tower.heal(creepToHeal);
        }
    }

    return {
        run: run
    }
})();

module.exports = roleTower;