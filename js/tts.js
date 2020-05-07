function make_tts_engine()
{
    "use strict";
   
    var synth;
    var enabled = true;
    var expansions = 
        {"R":         "rook",
         "N":         "knight",
         "B":         "bishop",
         "Q":         "queen",
         "K":         "king",
         "a x":       "a, takes", // Odd case, axb4 -> ah takes bee 4
         "x":         "takes",
         "+":         "check",
         "#":         "checkmate",
         "O - O - O": "castles queenside",
         "O - O":     "castles kingside",
         "e . p .":   "ahn pahssehhnt",
         "=":         "promoting to",
        };

    if ('speechSynthesis' in window) {
        synth = window.speechSynthesis;
    }

    function toggle(state) { enabled = state; }

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
	if (!enabled) { return; }

        var move = san;

        move = add_spaces(move);
        move = expand_move(move);
        say(move);
    }

    // Inserts spaces around each character in the original move. 
    // This handles odd cases like R3e2 and Rae1. 
    // Without spaces these expand to "Rook 3e2" and "Rook ae1", which are then 
    // read as "Rook 3 times 10^2" and "Rook aieee 1" respectively!
    // But don't add space to "a1", "a2", ..., "a8" or these become "ah 1" etc.    
    function add_spaces(move) {
        move = move.split('').join(' ');

        var re = /(.*a) (\d.*)/;
        var match = re.exec(move);
        if (match) { move = match[1] + match[2]; }

        return move;
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

    return {
        say: say,
        say_move: say_move,
        toggle: toggle,
    };
}
