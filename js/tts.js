function make_tts_engine()
{
    "use strict";
   
    var synth;

    if ('speechSynthesis' in window) {
        synth = window.speechSynthesis;
    }

    function speak_move(san) {
        if (!synth || synth.speaking) { return; }
        const utterance = new SpeechSynthesisUtterance(san);
        utterance.addEventListener('error', error => console.error(error));
        synth.speak(utterance);
    }

    return {
        speak_move: speak_move
    };
}
