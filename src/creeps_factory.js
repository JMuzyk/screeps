const creepsFactory = (function () {

    const spawnName = 'Krakow';
    const BIG_HARVESTER_BODY_PARTS = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE];
    const FIGHTER_BODY_PARTS = [ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE];
    const UPGRADER_BODY_PARTS = [WORK, WORK, CARRY, MOVE];
    const HARVESTER_BODY_PARTS = [WORK, CARRY, MOVE];
    const BUILDER_BODY_PARTS = [WORK, WORK, CARRY, MOVE];

    const defaultBodies = {
        upgrader: [WORK, WORK, CARRY, MOVE],
        builder: [WORK, CARRY, MOVE],
        harvester: [WORK, WORK, CARRY, MOVE]
    };

    const bodyPartSegments = {
        upgrader: [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
        builder: [WORK, WORK, WORK, CARRY, MOVE, MOVE],
        harvester: [WORK, WORK, WORK, CARRY, MOVE, MOVE]
    };

    function fighterBodyParts() {
        const energyAvailable = Game.spawns[spawnName].room.energyCapacityAvailable;
        let bodyParts = [];

    }

    function assembleBodyParts(defaultBody, bodyPartsSegment) {
        const segmentCost = bodyCost(bodyPartsSegment);
        const energyAvailable = Game.spawns[spawnName].room.energyCapacityAvailable;

        if (energyAvailable < segmentCost) {
            return defaultBody;
        } else {
            const numberOfSegmentsToBuild = parseInt(energyAvailable / segmentCost, 10);
            if (numberOfSegmentsToBuild > 1) {
                let assemblyBodyParts = [];
                for (let i = 0; i < numberOfSegmentsToBuild; i++) {
                    assemblyBodyParts = assemblyBodyParts.concat(bodyPartsSegment);
                }
                return assemblyBodyParts;
            } else {
                return bodyPartsSegment;
            }
        }
    }

    function bodyCost(body) {
        return body.reduce((cost, part) => cost + BODYPART_COST[part], 0);
    }

    function createUpdater() {
        const newName = 'Upgrader' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns[spawnName].spawnCreep(UPGRADER_BODY_PARTS, newName, {memory: {role: 'upgrader'}});
    }

    function createHarvester() {
        const newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns[spawnName].spawnCreep(HARVESTER_BODY_PARTS, newName, {memory: {role: 'harvester'}});
    }

    function createBuilder() {
        const newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns[spawnName].spawnCreep(BUILDER_BODY_PARTS, newName, {memory: {role: 'builder'}});
    }

    function createFighter() {
        const newName = 'Fighter' + Game.time;
        console.log('Spawning new fighter: ' + newName);
        console.log(Game.spawns[spawnName].spawnCreep(FIGHTER_BODY_PARTS, newName, {memory: {role: 'fighter'}}));
    }

    return {
        createUpdater: createUpdater,
        createHarvester: createHarvester,
        createBuilder: createBuilder,
        createFighter: createFighter
    };
})();


module.exports = creepsFactory;
