export class Audio { 
    mute:boolean;

    constructor(mute:boolean) {
        this.mute = mute;
    }
  
    dameJSON() {
        return JSON.parse( JSON.stringify(this));
    }
}
