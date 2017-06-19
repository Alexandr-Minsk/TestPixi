class Button extends PIXI.Container{
    spriteDisabled: PIXI.Sprite;
    spriteNormal: PIXI.Sprite;
    spriteHover: PIXI.Sprite;
    spritePressed: PIXI.Sprite;
    game: Game;
    constructor(game) {
        super();
        this.game=game;
        const imageDisable = 'images/btn_spin_disable.png';
        const imageNormal = 'images/btn_spin_normal.png';
        const imageHover = 'images/btn_spin_hover.png';
        const imagePressed = 'images/btn_spin_pressed.png';
        this.spriteDisabled = PIXI.Sprite.fromImage(imageDisable);
        this.spriteNormal = PIXI.Sprite.fromImage(imageNormal);
        this.spriteHover = PIXI.Sprite.fromImage(imageHover);
        this.spritePressed = PIXI.Sprite.fromImage(imagePressed);
        this.interactive = true;
        this.buttonMode = true;
        this.addChild(this.spriteDisabled);
        this.addChild(this.spriteNormal);
        this.addChild(this.spriteHover);
        this.addChild(this.spritePressed);
        this.setNormal();
        this.position.set(870,630);
    }
    setDisabled(){
        this.spriteDisabled.visible=true;
        this.spriteNormal.visible=false;
        this.spriteHover.visible=false;
        this.spritePressed.visible=false;
    }
    setNormal(){
        this.spriteDisabled.visible=false;
        this.spriteNormal.visible=true;
        this.spriteHover.visible=false;
        this.spritePressed.visible=false;
    }
    setHover(){
        this.spriteDisabled.visible=false;
        this.spriteNormal.visible=false;
        this.spriteHover.visible=true;
        this.spritePressed.visible=false;
    }
    setPressed(){
        this.spriteDisabled.visible=false;
        this.spriteNormal.visible=false;
        this.spriteHover.visible=false;
        this.spritePressed.visible=true;
    }
    mouseover(){
        if (! this.spriteDisabled.visible) {
            this.setHover();
        }
    }
    mouseout(){
        if (! this.spriteDisabled.visible) {
            this.setNormal();
        }
    }
    mousedown(){
        if (! this.spriteDisabled.visible) {
            this.setPressed();
        }
    }
    mouseup(){
        if (! this.spriteDisabled.visible) {
            this.setHover();
        }
    }
    pointerupoutside(){
        if (! this.spriteDisabled.visible) {
            this.setNormal();
        }
    }
    click(){
        if (! this.spriteDisabled.visible){
            this.setDisabled();
            this.game.play();
        }
    }
}
class Reel extends PIXI.Container {
    offsetY: number = -150;
    last: number;
    stopPosition: number;
    slots:Array<number>;
    spriteContainer:Array<PIXI.Container> =[];
    container: PIXI.Container;
    constructor(slots) {
        super();
        this.slots = slots;
        this.create();
    }
    create(){
        this.container = new Container();
        for (let k=0; k <= 4; k++){
            this.spriteContainer[k] = new Container();
            this.spriteContainer[k].addChild(Sprite.fromImage('images/'+this.addZero(this.slots[k])+'.png'));
            this.spriteContainer[k].y=k*this.offsetY+450;
            this.container.addChildAt(this.spriteContainer[k],k);
        }
        this.last=4;
    }
    getContainer(){
        return this.container;
    }
    changeSprite(i, t){
        this.container.removeChildAt(i);
        this.spriteContainer[i] = new Container();
        this.spriteContainer[i].y=-150;
        for (let k=0; k<4; k++ ){
            if (t==(170-(k*10)) ) {
                this.last=this.getOffsetStopPosition(k);
            }
        }
        if (t < 140 || t>170){
            this.last=(this.last==29) ? 0 : (this.last+1);
        }
        this.spriteContainer[i].addChild(Sprite.fromImage('images/'+this.addZero(this.slots[this.last])+'.png'));
        this.container.addChildAt(this.spriteContainer[i],i);
    }
    spin(t){
        for (let i=0; i<=4; i++){
            if (t > 0 && t <= 181){
                this.container.getChildAt(i).y+=15;
            }
            if (t > 181 && t <=196 ){
                this.container.getChildAt(i).y+=-1;
            }
            if (t ==180){
                playSound('stopRil');
            }
            if (this.container.getChildAt(i).y == 600){
                this.changeSprite(i, t);
            }
        }
    }
    setStopPosition(stopPosition :number){
        this.stopPosition = stopPosition;
    }
    getOffsetStopPosition(offset :number){
        if (this.stopPosition < offset ){
             return (30-(offset - this.stopPosition));
        }
        else{
            return (this.stopPosition - offset);
        }
    }
    addZero(i){
        let imageNumber = '';
        if (i < 10) {
            imageNumber = "0" + i;
        }else{
            imageNumber = i+'';
        }
        return imageNumber;
    }
}
class Game{
    state: string;
    stopPositions: Array<number>;
    slots: Array<Array<number>>;
    constructor(){
        this.stopPositions = this.getStopPositions();
        this.slots = this.getSlots()
    }
    play(){
        this.state='play';
        this.stopPositions = this.getStopPositions();
        playSound ('play');
        t=0;
        for(let i=0; i<this.slots.length; i++) {
            reels[i].setStopPosition(this.stopPositions[i]);
        }
    }
    stop(){
        this.state='stop';
        t=0;
    }
    getState(){
        return this.state;
    }
    getSlots(){
        this.slots = new Array(5);
        for (let i = 0; i <= 4; i++) {
            this.slots[i]=new Array;
            this.slots[i] = [1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10];
        }
        return this.slots;
    }
    getRandomSlots(){
        this.slots = new Array(5);
        for (let i = 0; i < 5; i++) {
            this.slots[i]=new Array;
            for (let j = 0; j < 30; j++) {
                this.slots[i][j]=1 + Math.floor(Math.random() * 10);
            }
        }
        return this.slots;
    }
    getStopPositions(){
        this.stopPositions=[0,1,2,3,4];
        return this.stopPositions;
    }
    getRandomStopPositions(){
        for (let i=0; i<5; i++ ){
            this.stopPositions[i] = Math.floor(Math.random() * 30);
        }
        return this.stopPositions;
    }
}
var display={x:1150,y:800};
var app = new PIXI.Application(display.x, display.y, {backgroundColor : 0x1099bb}),
    Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    game :Game,
    btn: Button,
    t=0,
    backgroundSprite: PIXI.Sprite,
    overlay;

    document.body.appendChild(app.view);

game= new Game()
var reels=[];
var reelContainer;
reelContainer= new Container;
for(let i=0; i<game.slots.length; i++){
    reels[i]=new  Reel(game.slots[i]);
    reels[i].setStopPosition(game.stopPositions[i]);
    reels[i].getContainer().x=i*210;
    reels[i].getContainer().y=-10;
    reelContainer.addChild(reels[i].getContainer());
}

var baseRenderTexture = new PIXI.BaseRenderTexture(display.x-60,display.y-210, PIXI.SCALE_MODES.LINEAR, 1);
var renderTexture = new PIXI.RenderTexture(baseRenderTexture);
var sprite = new PIXI.Sprite(renderTexture);
sprite.x = 45;
sprite.y = 38;
app.stage.addChild(sprite);

loader
    .add("images/winningFrameBackground.jpg")
    .add("images/slotOverlay.png")
    .load(setup);

function loadSound () {
    createjs.Sound.registerSound("sound/Reel_Spin.mp3", 'play');
    createjs.Sound.registerSound("sound/Landing_1.mp3", 'stopRil');
}

function playSound (soundID) {
    createjs.Sound.play(soundID);
}
function stopSound () {
    createjs.Sound.stop();
}
loadSound ();
function setup() {
    backgroundSprite = new Sprite(resources["images/winningFrameBackground.jpg"].texture);
    backgroundSprite.width=display.x;
    backgroundSprite.height=display.y;
    overlay = new Sprite(resources["images/slotOverlay.png"].texture);
    overlay.width=display.x;
    overlay.height=display.y-150;
    btn = new Button(game);
    app.stage.addChild(backgroundSprite);
    app.stage.addChild(overlay);
    app.stage.addChild(btn);
    app.stage.addChild(sprite);

    gameLoop();
}
function gameLoop(){
    requestAnimationFrame(gameLoop);
    if (game.getState()=='play') {
        for (let i = 0; i < reels.length; i++) {
            reels[i].spin(t - i * 10);
        }
        t += 1;
        if (t==240) {
            stopSound();
            game.stop();
            btn.setNormal();
        }
    }
    app.renderer.render(reelContainer, renderTexture);
}