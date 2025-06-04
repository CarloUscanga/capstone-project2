namespace SpriteKind {
    export const Ore = SpriteKind.create()
    export const Cursor = SpriteKind.create()
}

let Mob: Sprite = null
let Spawner = 0
let location: tiles.Location = null
let WeakMobs = [assets.image`Zombie`,assets.image`Spider`]
let Mobs = [assets.image`Zombie`, assets.image`Spider`, assets.image`Skeleton`,
assets.image`Witch`, assets.image`Wizard`,assets.image`Stone Golem`]
let StrongMobs = [assets.image`Wizard`, assets.image`Stone Golem`]
let Hider : Sprite[] = []
let FREEZE = false
let Battle = false
let Attacking = false
let UsingItem = false
let OGposition: tiles.Location = null
let Fight = textsprite.create("FIGHT")
let Items = textsprite.create("ITEMS")
let Attack1 = textsprite.create("PUNCH")
let FightMenu: TextSprite[] =[Fight,Items]
let AttackMenu: TextSprite[] = [Attack1]
let Bar: StatusBarSprite = null
let BarLabel: StatusBarSprite = null
let ZombieStats = [5, 1, 3, 2, 2]
let SpiderStats = [4, 1, 2, 2, 3]
let SkeletonStats = [3, 2, 4, 1, 5]
let WitchStats = [6, 5, 3, 4, 4]
let WizardStats = [7, 6, 4, 4, 5]
let StoneGolemStats = [12, 4, 10, 10, 1]



let Cursor = sprites.create(assets.image`Cursor`,SpriteKind.Cursor)

class Ore extends sprites.ExtendableSprite{
    miningTimes: number
}
class Potion extends sprites.ExtendableSprite{
    hitpoints: number
    strength: number
    intelligence: number
    speed: number
    defense: number
}
class Weapon extends sprites.ExtendableSprite{
    attack: number
    durability: number
    intelligence: number
}
class Armor extends sprites.ExtendableSprite{
    defense: number
    durability: number
    speed: number
}
class Player extends sprites.ExtendableSprite{
    hitpoints: number 
    maxHP: number
    strength: number
    defense: number
    intelligence: number
    speed: number

}
class Monster extends sprites.ExtendableSprite{
    hitpoints: number
    maxHP: number
    magiks: number
    strength: number
    defense: number
    speed: number

    
    constructor(image: Image, kind: number){
        super(image,kind)
        if(image.equals(assets.image`Zombie`)=== true){
            setstats(ZombieStats,this)
        } else if (image.equals(assets.image`Spider`)=== true){
            setstats(SpiderStats, this)
        } else if (image.equals(assets.image`Skeleton`) === true) {
            setstats(SkeletonStats, this)
        } else if (image.equals(assets.image`Witch`) === true) {
            setstats(WitchStats,this)
        } else if (image.equals(assets.image`Wizard`) === true) {
            setstats(WizardStats,this)
        } else if (image.equals(assets.image`Stone Golem`) === true) {
            setstats(StoneGolemStats,this)
        }
    }
}

function setstats(stats: number[], Mob : Monster ) {
    Mob.hitpoints = stats[0]
    Mob.maxHP = stats[0]
    Mob.magiks = stats[1]
    Mob.strength = stats[2]
    Mob.defense = stats[3]
    Mob.speed = stats[4]
}
function move(directon:CollisionDirection){
    location = Wilson.tilemapLocation()
    if (tiles.tileAtLocationIsWall(location.getNeighboringLocation(directon)) === false) {
        spriteutils.moveToAtSpeed(Wilson, location.getNeighboringLocation(directon), 100)
    }
}
function spawnMobs1(spawnTile:tiles.Location, selection: Array<Image>, min:number,max:number){
    Spawner = randint(min,max)
    Mob = new Monster(selection[Spawner],SpriteKind.Enemy)
    tiles.placeOnTile(Mob, spawnTile)
}
function spawnWeak(spawnTile: tiles.Location){
    Spawner = randint(0,1)
    Mob = new Monster(WeakMobs[Spawner], SpriteKind.Enemy)
    tiles.placeOnTile(Mob,spawnTile)
}
function spawnMobs(spawnTile:tiles.Location){
    Spawner = randint(0,5)
    Mob = new Monster(Mobs[Spawner], SpriteKind.Enemy)
    tiles.placeOnTile(Mob, spawnTile)
}
function spawnStrong(spawnTile: tiles.Location){
    Spawner = randint(0, 1)
    Mob = new Monster(StrongMobs[Spawner], SpriteKind.Enemy)
    tiles.placeOnTile(Mob, spawnTile)
}
function startBattle(player: Player, monster: Monster){
    FREEZE = true
    Battle = true
    OGposition = Wilson.tilemapLocation()
    tiles.setCurrentTilemap(tilemap`Battle`)
    hideWithKind(SpriteKind.Enemy)
    hideWithKind(SpriteKind.Ore)
    monster.setFlag(SpriteFlag.Invisible,false)
    monster.setFlag(SpriteFlag.RelativeToCamera, true)
    monster.setPosition(80,50)
    spriteutils.moveToAtSpeed(monster, spriteutils.pos(120, 50), 100)
    player.setFlag(SpriteFlag.RelativeToCamera, true)
    player.setPosition(80,50)
    spriteutils.moveToAtSpeed(player, spriteutils.pos(40, 50), 100)
    pause(600)
    showUsingArray(FightMenu)
    createMobBar(monster,40,monster.hitpoints + "/" + monster.maxHP,StatusBarKind.EnemyHealth)
    createPlayerBar(StatusBarKind.Health)


}
function createMobBar(attachTo: Monster, width: number, label:string, kind:number ){
    Bar = statusbars.create(width, 4, kind)
    BarLabel = statusbars.create(0.1, 0.1, StatusBarKind.Health)
    BarLabel.attachToSprite(attachTo,17,0)
    Bar.attachToSprite(attachTo,10,0)
    BarLabel.setLabel(label)
}
function createPlayerBar(kind:number){
    Bar = statusbars.create(40, 4, kind)
    BarLabel = statusbars.create(0.1, 0.1, StatusBarKind.Health)
    BarLabel.attachToSprite(Wilson,17,0)
    Bar.attachToSprite(Wilson,10,0)
    BarLabel.setLabel(Wilson.hitpoints+ "/" +Wilson.maxHP)
}
function hideWithKind(spriteKind: number){
    Hider = sprites.allOfKind(spriteKind)
    for (let index = 0; index < Hider.length; index++) {
        Hider[index].setFlag(SpriteFlag.Invisible, true)

    }

}
function showWithKind(spriteKind: number){
    Hider = sprites.allOfKind(spriteKind)
    for (let index = 0; index < Hider.length; index++) {
        Hider[index].setFlag(SpriteFlag.Invisible, false)

    }
}
function showUsingArray(array: Array<Sprite>){
    for (let index = 0; index < array.length; index++){
        array[index].setFlag(SpriteFlag.Invisible,false)
    }
}
function hideUsingArray(array: Array<Sprite>){
    for (let index = 0; index < array.length; index++) {
        array[index].setFlag(SpriteFlag.Invisible, true)
    }
}

sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function(player: Player, mob: Monster) {
    startBattle(player,mob)
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function() {
    if (FREEZE === false){
        move(CollisionDirection.Right)
    }
})
controller.up.onEvent(ControllerButtonEvent.Pressed, function(){
    if (FREEZE === false) {
     move(CollisionDirection.Top)
    }
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (FREEZE === false) {
     move(CollisionDirection.Bottom)
    }
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (FREEZE === false) {
     move(CollisionDirection.Left)
    }
})
browserEvents.MouseLeft.onEvent(browserEvents.MouseButtonEvent.Pressed, function(x: number, y: number) {
    if (Math.abs(x - Fight.x) <= 10 && Math.abs(y - Fight.y) <= 10 && Battle === true){
        hideUsingArray(FightMenu)
        showUsingArray(AttackMenu)    
    }
   

})
browserEvents.onMouseMove(function(x: number, y: number) {
    Cursor.setPosition(x,y)
})

tiles.setCurrentTilemap(tilemap`level3`)

for (let value of tiles.getTilesByType(assets.tile`WeakSpawnTile`)){
    spawnWeak(value)
}
for (let value of tiles.getTilesByType(assets.tile`SpawnTile`)) {
    spawnMobs(value)
}
for (let value of tiles.getTilesByType(assets.tile`StrongSpawnTile`)) {
    spawnStrong(value)
}
for (let value of tiles.getTilesByType(assets.tile`OreTile`)) {
    Mob = new Ore(assets.image`Rock Outcrop`,SpriteKind.Ore)
    tiles.placeOnTile(Mob, value)
}



let Wilson =
    new Player(assets.image`Wilson`, SpriteKind.Player)
    Wilson.hitpoints = 5
    Wilson.maxHP = 5
    Wilson.strength = 1
    Wilson.defense = 1
    Wilson.intelligence = 1
    Wilson.speed = 1
scene.cameraFollowSprite(Wilson)
tiles.placeOnTile(Wilson, tiles.getTileLocation(0, 0))
Fight.setFlag(SpriteFlag.RelativeToCamera, true)
Items.setFlag(SpriteFlag.RelativeToCamera, true)
Cursor.setFlag(SpriteFlag.RelativeToCamera,true)
Fight.setPosition(20,80)
Attack1.setPosition(20,80)
Items.setPosition(20,105)
hideWithKind(SpriteKind.Text)
