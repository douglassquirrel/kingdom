function make_stt_engine(onsuccess, onfailure)
{
    "use strict";

    var enabled;
    var recognition;

    function onresult(event) {
        var len = event.results.length;
        var uci = event.results[len-1][0].transcript;
        uci = uci.replace(/\s+/g, '').toLowerCase();
        console.log('Heard this: ' + uci);
        
        if (/^[a-h][1-8][a-h][1-8][nbrq]?$/.test(uci)) {
            onsuccess(uci);
        } else {
            onfailure('You said ' + uci + ' but that is not a valid move.');
        }
    }

    function onnomatch(event) {
        console.log("No match.");
        onfailure("I didn't understand that.");
    }

    function onerror(event) {
        console.log('Error occurred in recognition: ' + event.error);
        onfailure("Oops! An error occurred. Try again");
    }

    function onend() {
        if (!enabled) { return; }

        recognition.start();
        console.log('Restarted, ready to receive moves.');
    };

    function make_recognition() {
        var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
        var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;

        var coords = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
                       '1', '2', '3', '4', '5', '6', '7', '8',
                       'n', 'r', 'q'];
        var grammar = '#JSGF V1.0; grammar coords; public <coords> = ' + coords.join(' | ') + ' ;';

        var rec = new SpeechRecognition();
        var speechRecognitionList = new SpeechGrammarList();
        speechRecognitionList.addFromString(grammar, 1);
        rec.grammars = speechRecognitionList;
        rec.continuous = true;
        rec.lang = 'en-US';
        rec.interimResults = false;
        rec.maxAlternatives = 1;
 
        rec.onresult = onresult;
        rec.onnomatch = onnomatch;
        rec.onerror = onerror;        
        rec.onend = onend;   

        return rec;
    }

    function toggle(state) {
        enabled = state;
        if (enabled) {
            recognition.start();
            console.log('Ready to receive moves.');
        } else {
            recognition.stop();
            console.log('Listening stopped.');
        }
    }

    recognition = make_recognition();
    toggle(true);

    return {
        toggle: toggle,
    };
}
