var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Button = (function (_super) {
    __extends(Button, _super);
    function Button(game) {
        var _this = _super.call(this) || this;
        _this.game = game;
        var imageDisable = 'images/btn_spin_disable.png';
        var imageNormal = 'images/btn_spin_normal.png';
        var imageHover = 'images/btn_spin_hover.png';
        var imagePressed = 'images/btn_spin_pressed.png';
        _this.spriteDisabled = PIXI.Sprite.fromImage(imageDisable);
        _this.spriteNormal = PIXI.Sprite.fromImage(imageNormal);
        _this.spriteHover = PIXI.Sprite.fromImage(imageHover);
        _this.spritePressed = PIXI.Sprite.fromImage(imagePressed);
        _this.interactive = true;
        _this.buttonMode = true;
        _this.addChild(_this.spriteDisabled);
        _this.addChild(_this.spriteNormal);
        _this.addChild(_this.spriteHover);
        _this.addChild(_this.spritePressed);
        _this.setNormal();
        _this.position.set(870, 630);
        return _this;
    }
    Button.prototype.setDisabled = function () {
        this.spriteDisabled.visible = true;
        this.spriteNormal.visible = false;
        this.spriteHover.visible = false;
        this.spritePressed.visible = false;
    };
    Button.prototype.setNormal = function () {
        this.spriteDisabled.visible = false;
        this.spriteNormal.visible = true;
        this.spriteHover.visible = false;
        this.spritePressed.visible = false;
    };
    Button.prototype.setHover = function () {
        this.spriteDisabled.visible = false;
        this.spriteNormal.visible = false;
        this.spriteHover.visible = true;
        this.spritePressed.visible = false;
    };
    Button.prototype.setPressed = function () {
        this.spriteDisabled.visible = false;
        this.spriteNormal.visible = false;
        this.spriteHover.visible = false;
        this.spritePressed.visible = true;
    };
    Button.prototype.mouseover = function () {
        if (!this.spriteDisabled.visible) {
            this.setHover();
        }
    };
    Button.prototype.mouseout = function () {
        if (!this.spriteDisabled.visible) {
            this.setNormal();
        }
    };
    Button.prototype.mousedown = function () {
        if (!this.spriteDisabled.visible) {
            this.setPressed();
        }
    };
    Button.prototype.mouseup = function () {
        if (!this.spriteDisabled.visible) {
            this.setHover();
        }
    };
    Button.prototype.pointerupoutside = function () {
        if (!this.spriteDisabled.visible) {
            this.setNormal();
        }
    };
    Button.prototype.click = function () {
        if (!this.spriteDisabled.visible) {
            this.setDisabled();
            this.game.play();
        }
    };
    return Button;
}(PIXI.Container));
var Reel = (function (_super) {
    __extends(Reel, _super);
    function Reel(slots) {
        var _this = _super.call(this) || this;
        _this.offsetY = -150;
        _this.spriteContainer = [];
        _this.slots = slots;
        _this.create();
        return _this;
    }
    Reel.prototype.create = function () {
        this.container = new Container();
        for (var k = 0; k <= 4; k++) {
            this.spriteContainer[k] = new Container();
            this.spriteContainer[k].addChild(Sprite.fromImage('images/' + this.addZero(this.slots[k]) + '.png'));
            this.spriteContainer[k].y = k * this.offsetY + 450;
            this.container.addChildAt(this.spriteContainer[k], k);
        }
        this.last = 4;
    };
    Reel.prototype.getContainer = function () {
        return this.container;
    };
    Reel.prototype.changeSprite = function (i, t) {
        this.container.removeChildAt(i);
        this.spriteContainer[i] = new Container();
        this.spriteContainer[i].y = -150;
        for (var k = 0; k < 4; k++) {
            if (t == (170 - (k * 10))) {
                this.last = this.getOffsetStopPosition(k);
            }
        }
        if (t < 140 || t > 170) {
            this.last = (this.last == 29) ? 0 : (this.last + 1);
        }
        this.spriteContainer[i].addChild(Sprite.fromImage('images/' + this.addZero(this.slots[this.last]) + '.png'));
        this.container.addChildAt(this.spriteContainer[i], i);
    };
    Reel.prototype.spin = function (t) {
        for (var i = 0; i <= 4; i++) {
            if (t > 0 && t <= 181) {
                this.container.getChildAt(i).y += 15;
            }
            if (t > 181 && t <= 196) {
                this.container.getChildAt(i).y += -1;
            }
            if (t == 180) {
                playSound('stopRil');
            }
            if (this.container.getChildAt(i).y == 600) {
                this.changeSprite(i, t);
            }
        }
    };
    Reel.prototype.setStopPosition = function (stopPosition) {
        this.stopPosition = stopPosition;
    };
    Reel.prototype.getOffsetStopPosition = function (offset) {
        if (this.stopPosition < offset) {
            return (30 - (offset - this.stopPosition));
        }
        else {
            return (this.stopPosition - offset);
        }
    };
    Reel.prototype.addZero = function (i) {
        var imageNumber = '';
        if (i < 10) {
            imageNumber = "0" + i;
        }
        else {
            imageNumber = i + '';
        }
        return imageNumber;
    };
    return Reel;
}(PIXI.Container));
var Game = (function () {
    function Game() {
        this.stopPositions = this.getStopPositions();
        this.slots = this.getSlots();
    }
    Game.prototype.play = function () {
        this.state = 'play';
        this.stopPositions = this.getStopPositions();
        playSound('play');
        t = 0;
        for (var i = 0; i < this.slots.length; i++) {
            reels[i].setStopPosition(this.stopPositions[i]);
        }
    };
    Game.prototype.stop = function () {
        this.state = 'stop';
        t = 0;
    };
    Game.prototype.getState = function () {
        return this.state;
    };
    Game.prototype.getSlots = function () {
        this.slots = new Array(5);
        for (var i = 0; i <= 4; i++) {
            this.slots[i] = new Array;
            this.slots[i] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        }
        return this.slots;
    };
    Game.prototype.getRandomSlots = function () {
        this.slots = new Array(5);
        for (var i = 0; i < 5; i++) {
            this.slots[i] = new Array;
            for (var j = 0; j < 30; j++) {
                this.slots[i][j] = 1 + Math.floor(Math.random() * 10);
            }
        }
        return this.slots;
    };
    Game.prototype.getStopPositions = function () {
        this.stopPositions = [0, 1, 2, 3, 4];
        return this.stopPositions;
    };
    Game.prototype.getRandomStopPositions = function () {
        for (var i = 0; i < 5; i++) {
            this.stopPositions[i] = Math.floor(Math.random() * 30);
        }
        return this.stopPositions;
    };
    return Game;
}());
var display = { x: 1150, y: 800 };
var app = new PIXI.Application(display.x, display.y, { backgroundColor: 0x1099bb }), Container = PIXI.Container, autoDetectRenderer = PIXI.autoDetectRenderer, loader = PIXI.loader, resources = PIXI.loader.resources, Sprite = PIXI.Sprite, game, btn, t = 0, backgroundSprite, overlay;
document.body.appendChild(app.view);
game = new Game();
var reels = [];
var reelContainer;
reelContainer = new Container;
for (var i = 0; i < game.slots.length; i++) {
    reels[i] = new Reel(game.slots[i]);
    reels[i].setStopPosition(game.stopPositions[i]);
    reels[i].getContainer().x = i * 210;
    reels[i].getContainer().y = -10;
    reelContainer.addChild(reels[i].getContainer());
}
var baseRenderTexture = new PIXI.BaseRenderTexture(display.x - 60, display.y - 210, PIXI.SCALE_MODES.LINEAR, 1);
var renderTexture = new PIXI.RenderTexture(baseRenderTexture);
var sprite = new PIXI.Sprite(renderTexture);
sprite.x = 45;
sprite.y = 38;
app.stage.addChild(sprite);
loader
    .add("images/winningFrameBackground.jpg")
    .add("images/slotOverlay.png")
    .load(setup);
function loadSound() {
    createjs.Sound.registerSound("sound/Reel_Spin.mp3", 'play');
    createjs.Sound.registerSound("sound/Landing_1.mp3", 'stopRil');
}
function playSound(soundID) {
    createjs.Sound.play(soundID);
}
function stopSound() {
    createjs.Sound.stop();
}
loadSound();
function setup() {
    backgroundSprite = new Sprite(resources["images/winningFrameBackground.jpg"].texture);
    backgroundSprite.width = display.x;
    backgroundSprite.height = display.y;
    overlay = new Sprite(resources["images/slotOverlay.png"].texture);
    overlay.width = display.x;
    overlay.height = display.y - 150;
    btn = new Button(game);
    app.stage.addChild(backgroundSprite);
    app.stage.addChild(overlay);
    app.stage.addChild(btn);
    app.stage.addChild(sprite);
    gameLoop();
}
function gameLoop() {
    requestAnimationFrame(gameLoop);
    if (game.getState() == 'play') {
        for (var i = 0; i < reels.length; i++) {
            reels[i].spin(t - i * 10);
        }
        t += 1;
        if (t == 240) {
            stopSound();
            game.stop();
            btn.setNormal();
        }
    }
    app.renderer.render(reelContainer, renderTexture);
}
//# sourceMappingURL=main.js.map