class GameObject {
    constructor(config){
        this.id = config.id || null;
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.isMounted = false;
        this.direction = config.direction || 'down';
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || '/images/characters/people/hero.png',
        });

        this.behaviorLoop = config.behaviorLoop || [];
        this.behaviorLoopIndex = 0;

        this.talking = config.talking || [];
        this.retryTimeout = null;
    }

    mount(map){
        this.isMounted = true;
       

        //If we have behavior
        setTimeout(() => {
            this.doBehaviorEvent(map);
        },10)
    }

    update(){

    }

    async doBehaviorEvent(map) {

        //Don't do anything if there is cutscene or no config

        if (this.behaviorLoop.length === 0){
            return
        }

        if (map.isCutscenePlaying){

            if (this.retryTimeout){
                clearTimeout(this.retryTimeout);
            }

            this.retryTimeout = setTimeout(() => {
                this.doBehaviorEvent(map);
            },1000)
            return;
        }

        //Setting up or event with next relevant info
        let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
        eventConfig.who = this.id;

        //Create an event instance out of our next event config
        const eventHandler = new OverworldEvent({map, event: eventConfig});
        await eventHandler.init();

        //Setting 
        this.behaviorLoopIndex += 1;
            if (this.behaviorLoopIndex === this.behaviorLoop.length){
                this.behaviorLoopIndex = 0;
            }

    //Do it again
    this.doBehaviorEvent(map);        

    }
}