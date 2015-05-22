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
        mul : 0.05,
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



window.midiConnection = flock.midi.connection({
    openImmediately: true,

    ports: {
        input: "LPD8"
    },

    listeners: {
                   control: function (msg) {
                                //synth.set("freq.source", msg.value);
                                console.log("Control:", msg);
                            }
               }
});
