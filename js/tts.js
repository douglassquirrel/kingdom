function make_tts_engine()
{
    "use strict";
   
    var synth;

    if ('speechSynthesis' in window) {
        synth = window.speechSynthesis;
    }

    function say_move(san) {
        var move = expand_move(san);
        say(move);
    }

    function say(text) {
        if (!synth || synth.speaking) { return; }
        const utterance = new SpeechSynthesisUtterance(text);
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
             "x":        " takes ",
             "\\+":      " check ",
             "#":        " checkmate ",
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
        say_move: say_move
    };
}
