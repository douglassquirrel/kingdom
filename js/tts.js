function make_tts_engine()
{
    "use strict";
   
    var synth;
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


    if ('speechSynthesis' in window) {
        synth = window.speechSynthesis;
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

    function say_move(san) {
        var move = san;
        move = fix_odd_exponential(move);        
        move = expand_move(move);
        say(move);
    }

    function expand_move(san) {
        var move = san;

        var reString = Object.keys(expansions).join("|");
        reString = reString.replace(/\+/g, "\\+");
        reString = reString.replace(/\./g, "\\.");
        var re = new RegExp(reString, "g");
        move = move.replace(re, function(matched) {
            return expansions[matched];
        });

        return move;
    }

    // Fix moves like "R7e2" which come out as exponentials: "R 7 times 10^2"
    function fix_odd_exponential(move) {
        var re2 = /^(.\d)(.*)/;
        var match = re2.exec(move);
        if (match) { move = match[1] + " " + match[2]; }

        return move;
    }        

    return {
        say_move: say_move
    };
}
