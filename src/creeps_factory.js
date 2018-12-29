const spawnName = 'Krakow';
const BIG_HARVESTER_BODY_PARTS = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE];
const FIGHTER_BODY_PARTS = [ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE];
const UPGRADER_BODY_PARTS = [WORK, WORK, CARRY, MOVE] ;
const HARVESTER_BODY_PARTS = [WORK, CARRY, MOVE];
const BUILDER_BODY_PARTS = [WORK, WORK, CARRY, MOVE];

const creepsFactory = {

    createUpdater: function () {
        const newName = 'Upgrader' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns[spawnName].spawnCreep(UPGRADER_BODY_PARTS, newName, {memory: {role: 'upgrader'}});
    },

    createHarvester: function () {
        const newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns[spawnName].spawnCreep(HARVESTER_BODY_PARTS, newName, {memory: {role: 'harvester'}});
    },

    createBuilder: function () {
        const newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns[spawnName].spawnCreep(BUILDER_BODY_PARTS, newName, {memory: {role: 'builder'}});
    },

    createFighter: function () {
        const newName = 'Fighter' + Game.time;
        console.log('Spawning new fighter: ' + newName);
        console.log(Game.spawns[spawnName].spawnCreep(FIGHTER_BODY_PARTS, newName, {memory: {role: 'fighter'}}));
    }
};

function bodyCost(body) {
    return body.reduce((cost, part) => cost + BODYPART_COST[part], 0);
}

module.exports = creepsFactory;

function fighterBodyParts() {
    const energyAvailable = Game.spawns[spawnName].room.energyCapacityAvailable;
    let bodyParts = [];

}

function upgraderBodyParts() {
    const defaultBody = [WORK, CARRY, MOVE];
    const bodyPartsSegment = [WORK, WORK, WORK, CARRY, MOVE, MOVE];
    const segmentCost = bodyCost(bodyPartsSegment);
    const energyAvailable = Game.spawns[spawnName].room.energyCapacityAvailable;

    if(energyAvailable < segmentCost) {
        return defaultBody;
    } else {
        const numberOfSegmentsToBuild = energyAvailable / segmentCost;
        return [];
    }
}