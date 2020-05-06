function make_stt_engine()
{
    "use strict";

    var enabled;
    var recognition;

    function onresult(event) {
        var len = event.results.length;
        var color = event.results[len-1][0].transcript;
        
        alert(color);

        console.log('Confidence: ' + event.results[len-1][0].confidence);
    }

    function onnomatch(event) {
        console.log("I didn't recognise that color.");
    }

    function onerror(event) {
        console.log('Error occurred in recognition: ' + event.error);
    }

    function onend() {
        if (!enabled) { return; }

        recognition.start();
        console.log('Restarted, ready to receive a color command.');
    };

    function make_recognition() {
        var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
        var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;

        var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 
                       'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 
                       'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 
                       'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 
                       'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 
                       'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 
                       'turquoise', 'violet', 'white', 'yellow'];
        var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;';

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
            console.log('Ready to receive a color command.');
        } else {
            recognition.stop();
            console.log('Recognition stopped.');
        }
    }

    recognition = make_recognition();
    toggle(true);

    return {
        toggle: toggle,
    };
}
