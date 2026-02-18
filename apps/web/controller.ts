class Controller {
    /**
     * Dispatch an event
     * @param event_name Name of event to dispatch
     * @param count Number associated with the command to dispatch
     */
    public dispatchEvent(event_name: keyof controller_events, count?:number):void {
        count = (count == undefined) ? 1 : count
        if (count < 1) {throw new Error("Must have 1 or more event counts")}
        this.event_el.dispatchEvent(this.createNewEvent(event_name, {repetitions: count}))
    }

    /**
     * Add an event listener
     * @param type Command type to listen for
     * @param listener Listener
     */
    public addEventListener<K extends keyof controller_events>(type: keyof controller_events, listener: (event: controller_events[K]) => any): void {
        this.event_el.addEventListener(type, listener)
        console.log("added event listener for '" + type + "'")
    }

    /**
     * Create a new event
     * @param type Event Type
     * @param details Details for the new event
     * @param cancelable Is this event able to be canceled
     * @param bubbles Does this event bubble up
     * @returns The new event
     */
    private createNewEvent(type: keyof controller_events, details: event_details, cancelable = true, bubbles = false):CustomEvent {
        return new CustomEvent(type, {
            detail: details,
            cancelable: cancelable,
            bubbles: bubbles
        })
    }

    /**
     * Remove an event listener
     * @param type Event type / name
     * @param listener Listener
     */
    public removeEventListener<K extends keyof controller_events>(type: keyof controller_events, listener: (event: controller_events[K]) => any) {
        this.event_el.removeEventListener(type, listener)
    }

    /**
     * Turn a keyboard event into a string representation
     * @param key_event Keyboard event
     * @returns string representation of of the Keyboard event in the format: {key}{altkey}{shiftkey}{metakey}{ctrlkey}
     * i.e., the key 'a' with the shift key and ctrl key press would be: a0101
     */
    private keyToString(key_event: KeyboardEvent):string {
        function boolToSting(bool: Boolean):String {
            return (bool == true) ? '1' : '0'
        }
        return key_event.key.toLowerCase()+boolToSting(key_event.altKey)+boolToSting(key_event.shiftKey)+boolToSting(key_event.metaKey)+boolToSting(key_event.ctrlKey)
    }

    /**
     * Handel keyboard events and dispatch events if needed
     * @param event Keyboard event
     */
    private handleKeys = (event: KeyboardEvent) => {
        const key = this.keyToString(event)
        //console.log("Controller got key: "+key)
        if (this.binds.has(key)) {
            const event_type = this.binds.get(key) as keyof controller_events
            this.dispatchEvent(event_type)
        }
    }

    /**
     * Add a keybind for an event
     * @param key Key event to make a bind for
     * @param event_name Event
     */
    public addBind(key:KeyboardEvent|string, event_name: keyof controller_events) {
        // this could be useful for something -> document.event

        key = (typeof key == "string") ? key : this.keyToString(key)
        key = key.toLowerCase()
        this.binds.set(key, event_name)
    }

    constructor() {
        this.event_el = document.createElement('div');
        this.binds = new Map();
        document.addEventListener("keypress", this.handleKeys)
    }

    private binds:Map<string, string>
    private event_el: HTMLElement
}

interface controller_events {
    readonly "create child": Event
    readonly "delete current": Event
    readonly "node mode": Event
    readonly "move node down": Event
    readonly "move node up": Event
    readonly "move node left": Event
    readonly "move node right": Event
}

interface event_details {
    repetitions: number
}

interface controllerEvent {
    detail: event_details
}

declare global {
    interface Event extends controllerEvent { }
}


var controller = new Controller()
let test_listener = (e: Event) => {
    console.log("received event " + e + " with repetitions: " + e.detail.repetitions)
}
controller.addEventListener("create child", test_listener)
controller.dispatchEvent("create child")
controller.removeEventListener("create child", test_listener)
controller.dispatchEvent("create child")

controller.addBind("A0101", "create child")
controller.addEventListener("create child", (e:Event)=>{console.log("Create child triggered")})

