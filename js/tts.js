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
        if (!synth) { return; }
        if (synth.speaking) {
            window.setTimeout(say, 100, text);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
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
             "+":        " check ",
             "#":        " checkmate ",
             "O-O-O":    " castles queenside ",
             "O-O":      " castles kingside ",
             "e.p.":     " ahn pahssehhnt ",
             "=":        " promoting to ",
            };

        var reString = Object.keys(expansions).join("|");
        reString = reString.replace(/\+/g, "\\+");
        reString = reString.replace(/\./g, "\\.");
        var re = new RegExp(reString,"g");
        move = move.replace(re, function(matched) {
            return expansions[matched];
        });
        return move;
    }        

    return {
        say_move: say_move
    };
}
