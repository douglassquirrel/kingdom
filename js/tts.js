function make_tts_engine()
{
    "use strict";
   
    var synth;

    if ('speechSynthesis' in window) {
        synth = window.speechSynthesis;
    }

    function speak_move(san) {
        if (!synth || synth.speaking) { return; }
        var move = expand_move(san);
        const utterance = new SpeechSynthesisUtterance(move);
        utterance.addEventListener('error', error => console.error(error));
        synth.speak(utterance);
    }

    function expand_move(san) {
        var move = san;
        var expansions = 
            {"R":        " rook ",
             "N":        " knight ",
             "B":        " bishop ",
             "Q":        " queen ",
             "K":        " king ",
             "\\+":      " check ",
             "x":        " takes ",
             "O-O-O":    " castles queenside ",
             "O-O":      " castles kingside ",
             "e\\.p\\.": " en passant ",
             "=":        " promoting to ",
            };

        var re = new RegExp(Object.keys(expansions).join("|"),"g");
        move = move.replace(re, function(matched) {
            return expansions[matched];
        });
        return move;
    }        

    return {
        speak_move: speak_move
    };
}
