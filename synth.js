// Sine tone shaped by a simple attack/sustain/release envelope and periodically triggered.
var synth = flock.synth({
    synthDef: [
        {
            id: "righthat",
            ugen: "flock.ugen.whiteNoise",
            mul: {
                ugen: "flock.ugen.env.simpleASR",
                start: 0.0,
                attack: 0.01,
                sustain: 0.2,
                release: 0.1,
                gate: {
                    ugen: "flock.ugen.impulse",
                    rate: "control",
                    freq: 2,
                    phase: 0.5
                }
            }
        },
        {
            id: "lefthat",
            ugen: "flock.ugen.whiteNoise",
            mul: {
                ugen: "flock.ugen.env.simpleASR",
                start: 0.0,
                attack: 0.01,
                sustain: 0.2,
                release: 0.1,
                gate: {
                    ugen: "flock.ugen.impulse",
                    rate: "control",
                    freq: 2,
                    phase: 0.0
                }
            }    
        }
    ]
});

var bass = flock.synth({
    synthDef: {
        id : "bass",
        ugen : "flock.ugen.saw", 
        freq : {
            ugen: "flock.ugen.sinOsc",
            add: 100,
            freq: 0.1234,
            mul: 5,
        }, 
        mul : 0,
    }
});


// Periodically trigger a function that causes the scope area to shake.
var modbass = flock.synth({
    synthDef: {
        ugen: "flock.ugen.triggerCallback",
        trigger: {
            ugen: "flock.ugen.impulse",
            freq: 0.75,
            phase: 0.5
        },
        options: {
            callback: {
                func: function () {
                    if (Math.random() > 0.5) 		 
                        bass.set("bass.freq.add", bass.get("bass.freq.add")-1);
                    else
                        bass.set("bass.freq.add", bass.get("bass.freq.add")+1);
                }
            }
        }
    }
});

var drumthing = flock.synth({
        synthDef: {
            id : "drum", 
            ugen: "flock.ugen.sinOsc",
            freq: 440,
            mul: {
                ugen: "flock.ugen.asr",
                start: 0.0,
                attack: 0.25,
                sustain: 0.25,
                release: 1.0,
                gate: 0,
        }
    }
});

window.midiConnection = flock.midi.connection({
    openImmediately: true,

    ports: {
        input: "LPD8"
    },

    listeners: {
                   control: function (msg) {
                                switch(msg.number){
				    case 1: 
				       synth.set("righthat.mul.gate.freq", msg.value/50);
				       synth.set();
			               break;
				    case 2:
				       synth.set("righthat.mul.gate.freq", msg.value/50);
				       synth.set("lefthat.mul.gate.freq", msg.value/50);
				       synth.set("righthat.mul.gate.phase", 0);
				       synth.set("lefthat.mul.gate.phase", 0);
				       break;
				    case 5:
					bass.set("bass.freq.freq", msg.value/100);
					break;
                                    case 6: 
					bass.set("bass.freq.mul",msg.value/10);
                                        break;
				    case 7:
					bass.set("bass.mul",msg.value/127);
					break;
                                    case 8:
                                        bass.set("bass.freq.add", msg.value); 
                                        break; 
                                }
                            },
                   noteOn: function(msg){
                              drumthing.set("drum.mul.gate",1); 
                              drumthing.set("drum.mul.sustain",msg.velocity/127); 
                              drumthing.set("drum.mul.release", 1.01 - (msg.velocity/127) ); 
                              drumthing.set("drum.freq",msg.note*10); 
                           },
                   noteOff: function(msg){
                              drumthing.set("drum.mul.gate",0); 
                            },
               }
});
