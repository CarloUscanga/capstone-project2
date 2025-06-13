namespace SpriteKind {
    export const Ore = SpriteKind.create()
    export const Cursor = SpriteKind.create()
    export const Potion = SpriteKind.create()
}

let Mob: Monster = null
let FightingMob: Monster = null
let ClickedGear: Upgrades = null
let Gear: Upgrades = null
let ore: Ore = null
let Spawner = 0
let CurrentHP = 0
let NumberOfPotions = 3
let MonsterAttackPicker = 0
let InventorySpace = 0
let ArmorSpace = 0
let location: tiles.Location = null
let WeakMobs = [assets.image`Zombie`,assets.image`Spider`]
let Mobs = [assets.image`Zombie`, assets.image`Spider`, assets.image`Skeleton`,
assets.image`Witch`, assets.image`Wizard`,assets.image`Stone Golem`]
let StrongMobs = [assets.image`Wizard`, assets.image`Stone Golem`]
let ArmorArray = [assets.image`LeatherTunic`, assets.image`LeatherPants`,
    assets.image`LeatherBoots`, assets.image`LeatherHelm`, assets.image`IronChestplate`,
    assets.image`IronBoots`, assets.image`IronLeggings`, assets.image`IronHelmet`,
    assets.image`GoldChestplate`, assets.image`GoldLeggings`, assets.image`GoldHelmet`,
    assets.image`GoldBoots`
]
let Hider : Sprite[] = []
let FREEZE = false
let Battle = false
let Attacking = false
let UsingItem = false
let InventoryOpen = false
let GearClicked = false
let OGposition: tiles.Location = null
let OGUpgradePosition: tiles.Location = null
let Fight = textsprite.create("FIGHT")
let Items = textsprite.create("ITEMS")
let Attack1 = textsprite.create("PUNCH")
let Attack2 = textsprite.create("MAGICK")
let UsePotion = textsprite.create("HEALTH POTION")
let Inventory: Upgrades[] = []
let ArmorUsed: Upgrades[] = []
let FightMenu: TextSprite[] =[Fight,Items]
let AttackMenu: TextSprite[] = [Attack1, Attack2]
let ItemMenu: TextSprite[] = [UsePotion]
let Bar: StatusBarSprite = null
let MBar: StatusBarSprite = null
let BarLabel: StatusBarSprite = null
let MBarLabel: StatusBarSprite = null
let ZombieStats = [5, 1, 3, 2, 2]
let SpiderStats = [4, 1, 2, 2, 3]
let SkeletonStats = [3, 2, 4, 1, 5]
let WitchStats = [6, 5, 3, 4, 4]
let WizardStats = [7, 6, 4, 4, 5]
let StoneGolemStats = [12, 4, 10, 10, 1]
let Wilson : Player = null
let Cursor = sprites.create(assets.image`Cursor`,SpriteKind.Cursor)

class Ore extends sprites.ExtendableSprite{

}
class Upgrades extends sprites.ExtendableSprite{
    showing: boolean
    defense: number
    HP: number
    speed: number
    attack: number
    intelligence: number
    
    constructor(image: Image, kind: number) {
        super(image, kind)
        this.defense = 5
        this.HP = 5
        this.speed = 5
        this.attack = 5 
        this.intelligence = 5
    }
}
class Player extends sprites.ExtendableSprite{
    hitpoints: number 
    maxHP: number
    strength: number
    defense: number
    intelligence: number
    speed: number

    PhysicalHit(Attacker: Monster) {
        game.showLongText("The Monster launches a physical attack!", DialogLayout.Bottom)
        CurrentHP = this.hitpoints
        if (Attacker.strength <= this.defense) {
            this.hitpoints--
            for (let index = 0; Bar.value > Math.round((this.hitpoints / this.maxHP) * 100); index++) {
                Bar.value--
                BarLabel.setLabel(this.hitpoints + "/" + this.maxHP)
                pause(10)
            }
        } else {
    
        
            for (let index = 0; this.hitpoints > CurrentHP - (Attacker.strength-this.defense); index++) {
                this.hitpoints--
                for (let index = 0; Bar.value > Math.round((this.hitpoints / this.maxHP) * 100); index++) {
                    if (Bar.value <= 0) {
                        game.setGameOverMessage(false, "You got beat to a pulp")
                        game.gameOver(false)
                        break
                    }
                    Bar.value--
                    BarLabel.setLabel(this.hitpoints + "/" + this.maxHP)
                    pause(10)
                }
            }
        }
        if (Bar.value == 0) {
            game.setGameOverMessage(false, "You got beat to a pulp")
            game.gameOver(false)
        }
    }
    MagickHit(Attacker: Monster) {
        game.showLongText("The Monster launches a magical attack!", DialogLayout.Bottom)
        CurrentHP = this.hitpoints
        for (let index = 0; this.hitpoints > CurrentHP - Attacker.magiks; index++) {
                this.hitpoints--
                for (let index = 0; Bar.value > Math.round((this.hitpoints / this.maxHP) * 100); index++) {
                    if (Bar.value <= 0) {
                        game.setGameOverMessage(false, "You got beat to a pulp")
                        game.gameOver(false)
                        break
                    }
                    Bar.value--
                    BarLabel.setLabel(this.hitpoints + "/" + this.maxHP)
                    pause(10)
                }
        }
        if (Bar.value == 0) {
            game.setGameOverMessage(false, "You got beat to a pulp")
            game.gameOver(false)
        }
    }

}
class Monster extends sprites.ExtendableSprite{
    hitpoints: number
    maxHP: number
    magiks: number
    strength: number
    defense: number
    speed: number

    PhysicalHit(): void {
        
        if (Wilson.speed < this.speed) {
            MonsterTurn()
        }
        game.showLongText("You launch a physical attack!", DialogLayout.Bottom)
        CurrentHP = this.hitpoints
        if (Wilson.strength <= this.defense) {
            this.hitpoints--
            for (let index = 0; MBar.value > Math.round((this.hitpoints / this.maxHP) * 100); index++) {
                if (MBar.value <= 0) {
                    BattleWon()
                    break
                }
                MBar.value--
                MBarLabel.setLabel(this.hitpoints + "/" + this.maxHP)
                pause(10)
                
            
            }
        } else {
            for (let index = 0; this.hitpoints > CurrentHP - (Wilson.strength-this.defense); index++) {
                this.hitpoints--
                for (let index = 0; MBar.value > Math.round((this.hitpoints / this.maxHP) * 100); index++) {
                    if (MBar.value <= 0) {
                        BattleWon()
                        break
                    }
                    MBar.value--
                    MBarLabel.setLabel(this.hitpoints + "/" + this.maxHP)
                    pause(10)
                
            
                }
            
            }
        }
        if (Battle === true && MBar.value == 0) {
            BattleWon()
            
        } else if (Wilson.speed > this.speed) {
            MonsterTurn()
            showUsingArray(FightMenu)
        } else if (MBar.value > 0) {
            showUsingArray(FightMenu)
        }
        

        

    }
    MagickHit(): void {
        
        if (Wilson.speed < this.speed) {
            MonsterTurn()
        }
        game.showLongText("You launch a magical attack!", DialogLayout.Bottom)
        CurrentHP = this.hitpoints
        for (let index = 0; this.hitpoints > CurrentHP - Wilson.intelligence; index++) {
            this.hitpoints--
            for (let index = 0; MBar.value > Math.round((this.hitpoints / this.maxHP) * 100); index++) {
                if (MBar.value <= 0) {
                    BattleWon()
                    break
                }
                MBar.value--
                MBarLabel.setLabel(this.hitpoints + "/" + this.maxHP)
                pause(10)
                
            
            }
            
        }
        if (Battle === true && MBar.value == 0) {
            BattleWon()
        } else if (Wilson.speed > this.speed) {
            MonsterTurn()
            showUsingArray(FightMenu)
        } else if (MBar.value > 0) {
            showUsingArray(FightMenu)
        }
    }
    
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
function spawnWeak(spawnTile: tiles.Location){
    Spawner = randint(0,1)
    Mob = new Monster(WeakMobs[Spawner], SpriteKind.Enemy)
    tiles.placeOnTile(Mob,spawnTile)
}
function spawnLoot(spawnTile: tiles.Location, type: Image[]) { 
    Spawner = randint(0, type.length - 1)
    Gear = new Upgrades(type[Spawner], SpriteKind.Food)
    Gear.showing = true
    tiles.placeOnTile(Gear,spawnTile)
    
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
    FightingMob = monster
    OGposition = Wilson.tilemapLocation()
    tiles.setCurrentTilemap(tilemap`Battle`)
    hideWithKind(SpriteKind.Food)
    hideWithKind(SpriteKind.Enemy)
    hideWithKind(SpriteKind.Ore)
    FightingMob.setFlag(SpriteFlag.Invisible,false)
    FightingMob.setFlag(SpriteFlag.RelativeToCamera, true)
    FightingMob.setPosition(80,50)
    spriteutils.moveToAtSpeed(FightingMob, spriteutils.pos(120, 50), 100)
    player.setFlag(SpriteFlag.RelativeToCamera, true)
    player.setPosition(80,50)
    spriteutils.moveToAtSpeed(player, spriteutils.pos(40, 50), 100)
    pause(600)
    showUsingArray(FightMenu)
    AddArmorStats(ArmorUsed)
    createMobBar(FightingMob,40,FightingMob.hitpoints + "/" + FightingMob.maxHP,StatusBarKind.EnemyHealth)
    createPlayerBar(StatusBarKind.Health)


}
function AddArmorStats(array: Upgrades[]) {
    for (let index = 0; index < array.length; index++) {
        Wilson.hitpoints = 5 + array[index].HP
        Wilson.maxHP = 5 + array[index].HP
        Wilson.defense = 1 + array[index].defense
        Wilson.speed = 1 + array[index].speed
        Wilson.intelligence = 1 + array[index].intelligence
        Wilson.strength = 2 + array[index].attack

    }
}
function ResetStats() {
    Wilson.hitpoints = 5
    Wilson.maxHP = 5
    Wilson.strength = 2
    Wilson.defense = 1
    Wilson.intelligence = 1
    Wilson.speed = 1
}
function MonsterTurn() {
    MonsterAttackPicker = randint(0, 5)
    if (MonsterAttackPicker < 5) {
        
        Wilson.PhysicalHit(FightingMob)
    } else {
        
        Wilson.MagickHit(FightingMob)
    }
    pause(1000)
}
function BattleWon() {
    hideUsingArray(FightMenu)
    hideUsingArray(AttackMenu)
    FightingMob.destroy(effects.disintegrate, 3)
    pause(1000)
    destroyHPBars()
    showWithKind(SpriteKind.Enemy)
    showWithKind(SpriteKind.Ore)
    Wilson.setFlag(SpriteFlag.RelativeToCamera,false)
    tiles.setCurrentTilemap(tilemap`level3`)
    coverSpawnTiles()
    tiles.placeOnTile(Wilson, OGposition)
    ResetStats()
    showWithKind(SpriteKind.Food)
    FREEZE = false
    Battle = false
    


}
function destroyHPBars() {
    Bar.destroy()
    BarLabel.destroy()
    MBar.destroy()
    MBarLabel.destroy()
}
function createMobBar(attachTo: Monster, width: number, label:string, kind:number ){
    MBar = statusbars.create(width, 4, kind)
    MBar.value = 100
    MBarLabel = statusbars.create(0.1, 0.1, StatusBarKind.Health)
    MBarLabel.attachToSprite(attachTo,17,0)
    MBar.attachToSprite(attachTo,10,0)
    MBarLabel.setLabel(label)
}
function createPlayerBar(kind:number){
    Bar = statusbars.create(40, 4, kind)
    Bar.value = Math.round((Wilson.hitpoints/Wilson.maxHP)*100)
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
function coverSpawnTiles() {
    for (let value of tiles.getTilesByType(assets.tile`WeakSpawnTile`)) {
        tiles.setTileAt(value, assets.tile`FillerTile`)
    }
    for (let value of tiles.getTilesByType(assets.tile`SpawnTile`)) {
        tiles.setTileAt(value, assets.tile`FillerTile`)
    }
    for (let value of tiles.getTilesByType(assets.tile`StrongSpawnTile`)) {
        tiles.setTileAt(value, assets.tile`FillerTile`)
    }
    for (let value of tiles.getTilesByType(assets.tile`OreTile`)) {
    tiles.setTileAt(value, assets.tile`FillerTile`)
    }
    for (let value of tiles.getTilesByType(assets.tile`LootTile`)) {
    tiles.setTileAt(value, assets.tile`FillerTile`)
    }
}
function OpenInventory() {
    if (Battle == false && InventoryOpen == false) {
        OGposition = Wilson.tilemapLocation()
        Cursor.setFlag(SpriteFlag.RelativeToCamera, false)
        InventoryOpen = true
        FREEZE = true
        tiles.setCurrentTilemap(tilemap`Inventory`)
        Wilson.setFlag(SpriteFlag.RelativeToCamera, true)
        tiles.placeOnTile(Wilson, tiles.getTileLocation(2, 2))
        hideWithKind(SpriteKind.Enemy)
        hideWithKind(SpriteKind.Ore)
        InventorySpace = 0
        ArmorSpace = 0
        for (let value of tiles.getTilesByType(assets.tile`InventorySlot`)) {
            if (Inventory.length == 0) {
                hideWithKind(SpriteKind.Food)
                break
            }
            InventorySpace++
            if (InventorySpace <= Inventory.length) {
                Inventory[InventorySpace - 1].setFlag(SpriteFlag.Invisible, false)
                Inventory[InventorySpace - 1].showing = true
                tiles.placeOnTile(Inventory[InventorySpace - 1], value)
            } else {
                
                break
            }
            
        }
        for (let value of tiles.getTilesByType(assets.tile`ArmorSlot`)) {
            if (ArmorSpace < ArmorUsed.length) {
                ArmorSpace++
                ArmorUsed[ArmorSpace - 1].setFlag(SpriteFlag.Invisible, false)
                ArmorUsed[ArmorSpace - 1].showing = true
                tiles.placeOnTile(ArmorUsed[ArmorSpace - 1], value)
            } else {
                break
            }
        }
        
    } else if (InventoryOpen === true) {
        InventoryOpen = false
        Cursor.setFlag(SpriteFlag.RelativeToCamera, true)
        Wilson.setFlag(SpriteFlag.RelativeToCamera, false)
        tiles.setCurrentTilemap(tilemap`level3`)
        coverSpawnTiles()
        tiles.placeOnTile(Wilson,OGposition)
        showWithKind(SpriteKind.Enemy)
        showWithKind(SpriteKind.Ore)
        showWithKind(SpriteKind.Food)
        for (let index = 0; index < Inventory.length; index++) {
            Inventory[index].setFlag(SpriteFlag.Invisible, true)
            Inventory[index].showing = false
        }
        FREEZE = false
    }

}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (player: Player, Upgrade: Upgrades) {
    if (Upgrade.showing === true) {
        if (controller.A.isPressed()&& Inventory.length < 24) {
            Inventory.push(Upgrade)
            game.showLongText("You pick up it up!", DialogLayout.Bottom)
            Upgrade.setFlag(SpriteFlag.Invisible, true)
            Upgrade.showing = false
        } else if (controller.A.isPressed() && Inventory.length >= 24) {
            game.showLongText("You have no room in your inventory!", DialogLayout.Bottom)
        }   
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (player: Player, mob: Monster) {
    startBattle(player, mob)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Ore, function (player: Player, Potion: Ore) {
    if (controller.A.isPressed()) {
        NumberOfPotions++
        game.showLongText("You pick up a health potion! You have " + NumberOfPotions + " potions left.", DialogLayout.Bottom)
        Potion.destroy()
    }
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
browserEvents.MouseLeft.onEvent(browserEvents.MouseButtonEvent.Pressed, function (x: number, y: number) {
    if (Math.abs(x - Fight.x) <= 10 && Math.abs(y - Fight.y) <= 10 && Battle === true && Attacking === false) {
        hideUsingArray(FightMenu)
        showUsingArray(AttackMenu)
        Attacking = true
    } else if (Math.abs(x - Attack1.x) <= 10 && Math.abs(y - Attack1.y) <= 10 && Battle === true && Attacking === true) {
        Attacking = false
        hideUsingArray(AttackMenu)
        FightingMob.PhysicalHit()

    } else if (Math.abs(x - Attack2.x) <= 10 && Math.abs(y - Attack2.y) <= 10 && Battle === true && Attacking === true) {
        Attacking = false
        hideUsingArray(AttackMenu)
        FightingMob.MagickHit()
    } else if (Math.abs(x - Items.x) <= 10 && Math.abs(y - Items.y) <= 10 && Battle === true && UsingItem === false && Attacking === false) {
        UsingItem = true
        hideUsingArray(FightMenu)
        showUsingArray(ItemMenu)
    } else if (Math.abs(x - UsePotion.x) <= 10 && Math.abs(y - UsePotion.y) <= 10 && Battle === true && UsingItem === true) {
        UsingItem = false
        hideUsingArray(ItemMenu)
        if (NumberOfPotions > 0) {
            if (Wilson.hitpoints < Wilson.maxHP) {
                Wilson.hitpoints += 5
                NumberOfPotions--
                game.showLongText("You use a health potion! You have " + NumberOfPotions + " potions left.", DialogLayout.Bottom)
                
                if (Wilson.hitpoints > Wilson.maxHP) {
                    Wilson.hitpoints = Wilson.maxHP
                }
                Bar.value = Math.round((Wilson.hitpoints / Wilson.maxHP) * 100)
                BarLabel.setLabel(Wilson.hitpoints + "/" + Wilson.maxHP)
                showUsingArray(FightMenu)
            } else if (Wilson.hitpoints >= Wilson.maxHP) {
                game.showLongText("You are already at full health!", DialogLayout.Bottom)
                showUsingArray(FightMenu)
            }
        
        } else {
            game.showLongText("You have no potions left!", DialogLayout.Bottom)
            showUsingArray(FightMenu)
        }
    }
    // Find the first visible upgrade in the inventory that overlaps with the cursor
    let hoveredUpgrade = Inventory.find(upg => upg.showing && Cursor.overlapsWith(upg));
    if (InventoryOpen === true && hoveredUpgrade && GearClicked === false) {
        ClickedGear = hoveredUpgrade
        OGUpgradePosition = ClickedGear.tilemapLocation()
        GearClicked = true
    } else if (InventoryOpen === true && GearClicked === true) {
        if (ClickedGear.tileKindAt(TileDirection.Center, assets.tile`InventorySlot`) === true) {
            tiles.placeOnTile(ClickedGear, ClickedGear.tilemapLocation())
            GearClicked = false
        } else if (ClickedGear.tileKindAt(TileDirection.Center, assets.tile`BattleBack`) === true) {
            tiles.placeOnTile(ClickedGear, OGUpgradePosition)
            GearClicked = false
        } else if (ClickedGear.tileKindAt(TileDirection.Center, assets.tile`ArmorSlot`) === true) {
            ArmorUsed.push(ClickedGear)
            tiles.placeOnTile(ClickedGear, ClickedGear.tilemapLocation())
            GearClicked = false
        }
    }
}


)
browserEvents.onMouseMove(function(x: number, y: number) {
    Cursor.setPosition(x, y)
    if (GearClicked === true) {
        ClickedGear.setPosition(x, y)
    }
        
})
browserEvents.R.onEvent(browserEvents.KeyEvent.Pressed, function () {
    OpenInventory()
})

tiles.setCurrentTilemap(tilemap`level3`)

for (let value of tiles.getTilesByType(assets.tile`WeakSpawnTile`)){
    spawnWeak(value)
    tiles.setTileAt(value, assets.tile`FillerTile`)
}
for (let value of tiles.getTilesByType(assets.tile`SpawnTile`)) {
    spawnMobs(value)
    tiles.setTileAt(value, assets.tile`FillerTile`)
}
for (let value of tiles.getTilesByType(assets.tile`StrongSpawnTile`)) {
    spawnStrong(value)
    tiles.setTileAt(value, assets.tile`FillerTile`)
}
for (let value of tiles.getTilesByType(assets.tile`OreTile`)) {
    ore = new Ore(assets.image`Rock Outcrop`,SpriteKind.Ore)
    tiles.placeOnTile(ore, value)
    tiles.setTileAt(value, assets.tile`FillerTile`)
}
for (let value of tiles.getTilesByType(assets.tile`LootTile`)) {
    spawnLoot(value, ArmorArray)
    tiles.setTileAt(value, assets.tile`FillerTile`)
}
UsingItem = false
Inventory = []
Wilson = new Player(assets.image`Wilson`,SpriteKind.Player)
ResetStats()
scene.cameraFollowSprite(Wilson)
tiles.placeOnTile(Wilson, tiles.getTileLocation(16, 18))
Fight.setFlag(SpriteFlag.RelativeToCamera, true)
Items.setFlag(SpriteFlag.RelativeToCamera, true)
Cursor.setFlag(SpriteFlag.RelativeToCamera,true)
Fight.setPosition(20, 80)
UsePotion.setPosition(50, 90)
Attack1.setPosition(20, 80)
Attack2.setPosition(20, 105)
Items.setPosition(20,105)
hideWithKind(SpriteKind.Text)
game.showLongText("Use the arrow keys to move around, and R to open your inventory.", DialogLayout.Bottom)
game.showLongText("You can pick up health potions or armor by walking over them and pressing A.", DialogLayout.Bottom)
game.showLongText("in the Inventory, use the cursor to select items.", DialogLayout.Bottom)
game.showLongText("You can equip armor by placing it in the armor slots in your inventory.", DialogLayout.Bottom)
game.showLongText("Fight monsters by walking into them.", DialogLayout.Bottom)
game.showLongText("You can attack monsters by clicking on the FIGHT button, then selecting an attack.", DialogLayout.Bottom)
game.showLongText("You can also use health potions by clicking on the ITEMS button, then using a potion.", DialogLayout.Bottom)

