//clases
function Snake() {
    //properties
    this.me = (() => {
        const instance = document.createElement("div");
        instance.classList.add("snake");
        gameDom.gameMap.appendChild(instance);
        return instance
    })();
    this.globalPos = {
        x: 0,
        y: 0
    };
    this.afterPos = {
        x: 0,
        y: 0
    };

    //functions
    this.setPos = function ([x, y]) {
        //guardamos la actual y nueva posicion
        this.afterPos = { ...this.globalPos };
        [this.globalPos.x, this.globalPos.y] = [x, y];
        //aplicamos la nueva posicion
        applyTransform(this.me, this.globalPos.x, this.globalPos.y);
    };
}
//>

//objetos
const game = {
    //properties
    speed: {
        x: 0,
        y: 0
    },
    mapLimit: {
        positive: 300,
        negative: -10
    },
    spawnLimit: {
        positive: 280,
        negative: 10
    }
}
const gameDom = {
    //properties
    gameMap: document.getElementById("game-map"),
    gameEat: document.getElementById("eat"),
    snakeList: []
}
//>



//game started
{
    gameDom.snakeList.push(new Snake());
    //cambiamos la posicion de la comida
    let random = getRandom(game.mapLimit.negative, game.mapLimit.positive);
    applyTransform(gameDom.gameEat, random.a, random.b);
}
//>

//update loop
function update() {
    //nos movemos junto a todos nuestro hijos
    gameDom.snakeList.forEach((element, index, arr) => {
        //movimiento de la cabeza
        if (!index) element.setPos([element.globalPos.x + game.speed.x, element.globalPos.y + game.speed.y]);
        //seguimiento retardado de los hijos
        else element.setPos([arr[index - 1].afterPos.x, arr[index - 1].afterPos.y]);
    });
    //comprobamos haber comido
    if (inCollision(gameDom.snakeList[0].me, gameDom.gameEat)) beforeEat();

    //comprobamos el estado del juego
    if(inLimits())location.reload(true);//perdemos si salimos del mapa
    if (gameDom.snakeList.length > 1) //perdemos si chocamos con nostros mismos
        if(gameDom.snakeList.some((item , index) => {
            if(index)
                return getDistance(gameDom.snakeList[0].me , item.me) < 10;
        })){
            location.reload(true);
        }
}
setInterval(update, 100);
//>

//obtencion del input
const speed = {
    w: { x: 0, y: -10 },
    s: { x: 0, y: 10 },
    d: { x: 10, y: 0 },
    a: { x: -10, y: 0 }
}
addEventListener("keypress", (e) => {
    if(speed[e.key]){
        const { x, y } = speed[e.key];
    game.speed = { x, y };
    }
});
//>

//detector de colisiones
function inCollision(element1, element2) {
    var rect1 = element1.getBoundingClientRect();
    var rect2 = element2.getBoundingClientRect();
    return !(
        (rect1.bottom < rect2.top) || (rect1.top > rect2.bottom) ||
        (rect1.right < rect2.left) || (rect1.left > rect2.right)
    );
}
//>

//genera numero random
function getRandom(min, max) {
    min = Math.ceil(min / 10) * 10;
    max = Math.floor(max / 10) * 10;
    return {
        a: Math.floor(Math.random() * (max - min + 1)) + min,
        b: Math.floor(Math.random() * (max - min + 1)) + min
    }
}
//>

//aplica transformaciones css
function applyTransform(element, x, y) {
    element.style.transform = `translateX(${x}px) translateY(${y}px)`;
}
//>

//se llama al comer comida
function beforeEat() {
    let random = getRandom(game.spawnLimit.negative, game.spawnLimit.positive);
    applyTransform(gameDom.gameEat, random.a, random.b);
    //
    gameDom.snakeList.push(new Snake());
}
//>

//comprueba que estemos en los limites
function inLimits() {
    return !(gameDom.snakeList[0].globalPos.x > game.mapLimit.negative &&
        gameDom.snakeList[0].globalPos.x < game.mapLimit.positive &&
        gameDom.snakeList[0].globalPos.y > game.mapLimit.negative &&
        gameDom.snakeList[0].globalPos.y < game.mapLimit.positive)
}
//>

//comprueba la distancia entre dos elementos
function getDistance(element1, element2) {
    var rect1 = element1.getBoundingClientRect();
    var rect2 = element2.getBoundingClientRect();
    return Math.sqrt(Math.pow(rect2.x - rect1.x, 2) + Math.pow(rect2.y - rect1.y, 2));
}
