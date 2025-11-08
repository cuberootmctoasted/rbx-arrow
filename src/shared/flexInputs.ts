export type FlexInput =
    | "spc"
    | "`"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "0"
    | "-"
    | "="
    | "bspc"
    | "q"
    | "w"
    | "e"
    | "r"
    | "t"
    | "y"
    | "u"
    | "i"
    | "o"
    | "p"
    | "["
    | "]"
    | "\\"
    | "a"
    | "s"
    | "d"
    | "f"
    | "g"
    | "h"
    | "j"
    | "k"
    | "l"
    | ";"
    | "'"
    | "ent"
    | "z"
    | "x"
    | "c"
    | "v"
    | "b"
    | "n"
    | "m"
    | ","
    | "."
    | "/"
    | "n0"
    | "n1"
    | "n2"
    | "n3"
    | "n4"
    | "n5"
    | "n6"
    | "n7"
    | "n8"
    | "n9"
    | "n."
    | "nent"
    | "n-"
    | "n+"
    | "n/"
    | "n*"
    | "f1"
    | "f2"
    | "f3"
    | "f4"
    | "f5"
    | "f6"
    | "f7"
    | "f8"
    | "f9"
    | "f10"
    | "f11"
    | "f12"
    | "tab"
    | "lsft"
    | "rsft"
    | "del"
    | "lctl"
    | "lgui"
    | "lalt"
    | "rctl"
    | "rgui"
    | "ralt"
    | "up"
    | "down"
    | "left"
    | "right"
    | "home"
    | "end"
    | "pgup"
    | "pgdown"
    | "lmb"
    | "rmb"
    | "mmb"
    | "UNKNOWN";

// loads of if else statements please forgive me for the bad practice lol
function getFlexibleInputByKeyCode(keycode: Enum.KeyCode): FlexInput {
    switch (keycode.Name) {
        // | "spc"
        case "Space":
            return "spc";
        // | "`"
        case "Tilde":
            return "`";
        // | "1"
        case "One":
            return "1";
        // | "2"
        case "Two":
            return "2";
        // | "3"
        case "Three":
            return "3";
        // | "4"
        case "Four":
            return "4";
        // | "5"
        case "Five":
            return "5";
        // | "6"
        case "Six":
            return "6";
        // | "7"
        case "Seven":
            return "7";
        // | "8"
        case "Eight":
            return "8";
        // | "9"
        case "Nine":
            return "9";
        // | "0"
        case "Zero":
            return "0";
        // | "-"
        case "Minus":
            return "-";
        // | "="
        case "Equals":
            return "=";
        // | "bspc"
        case "Backspace":
            return "bspc";
        // | "q"
        case "Q":
            return "q";
        // | "w"
        case "W":
            return "w";
        // | "e"
        case "E":
            return "e";
        // | "r"
        case "R":
            return "r";
        // | "t"
        case "T":
            return "t";
        // | "y"
        case "Y":
            return "y";
        // | "u"
        case "U":
            return "u";
        // | "i"
        case "I":
            return "i";
        // | "o"
        case "O":
            return "o";
        // | "p"
        case "P":
            return "p";
        // | "["
        case "LeftBracket":
            return "[";
        // | "]"
        case "RightBracket":
            return "]";
        // | "\\"
        case "BackSlash":
            return "\\";
        // | "a"
        case "A":
            return "a";
        // | "s"
        case "S":
            return "s";
        // | "d"
        case "D":
            return "d";
        // | "f"
        case "F":
            return "f";
        // | "g"
        case "G":
            return "g";
        // | "h"
        case "H":
            return "h";
        // | "j"
        case "J":
            return "j";
        // | "k"
        case "K":
            return "k";
        // | "l"
        case "L":
            return "l";
        // | ";"
        case "Semicolon":
            return ";";
        // | "'"
        case "Quote":
            return "'";
        // | "ent"
        case "Return":
            return "ent";
        // | "z"
        case "Z":
            return "z";
        // | "x"
        case "X":
            return "x";
        // | "c"
        case "C":
            return "c";
        // | "v"
        case "V":
            return "v";
        // | "b"
        case "B":
            return "b";
        // | "n"
        case "N":
            return "n";
        // | "m"
        case "M":
            return "m";
        // | ","
        case "Comma":
            return ",";
        // | "."
        case "Period":
            return ".";
        // | "/"
        case "Slash":
            return "/";
        // | "n0"
        case "KeypadZero":
            return "n0";
        // | "n1"
        case "KeypadOne":
            return "n1";
        // | "n2"
        case "KeypadTwo":
            return "n2";
        // | "n3"
        case "KeypadThree":
            return "n3";
        // | "n4"
        case "KeypadFour":
            return "n4";
        // | "n5"
        case "KeypadFive":
            return "n5";
        // | "n6"
        case "KeypadSix":
            return "n6";
        // | "n7"
        case "KeypadSeven":
            return "q";
        // | "n8"
        case "KeypadEight":
            return "n8";
        // | "n9"
        case "KeypadNine":
            return "n9";
        // | "n."
        case "KeypadPeriod":
            return "n.";
        // | "nent"
        case "KeypadEnter":
            return "nent";
        // | "n-"
        case "KeypadMinus":
            return "n-";
        // | "n+"
        case "KeypadPlus":
            return "n+";
        // | "n/"
        case "KeypadDivide":
            return "n/";
        // | "n*"
        case "KeypadMultiply":
            return "n*";
        // | "f1"
        case "F1":
            return "f1";
        // | "f2"
        case "F2":
            return "f2";
        // | "f3"
        case "F3":
            return "f3";
        // | "f4"
        case "F4":
            return "f4";
        // | "f5"
        case "F5":
            return "f5";
        // | "f6"
        case "F6":
            return "f6";
        // | "f7"
        case "F7":
            return "f7";
        // | "f8"
        case "F8":
            return "f8";
        // | "f9"
        case "F9":
            return "f9";
        // | "f10"
        case "F10":
            return "f10";
        // | "f11"
        case "F11":
            return "f11";
        // | "f12"
        case "F12":
            return "f12";
        // | "tab"
        case "Tab":
            return "tab";
        // | "lsft"
        case "LeftShift":
            return "lsft";
        // | "rsft"
        case "RightShift":
            return "rsft";
        // | "del"
        case "Delete":
            return "del";
        // | "lctl"
        case "LeftControl":
            return "lctl";
        // | "lgui"
        case "LeftMeta":
            return "lgui";
        // | "lalt"
        case "LeftAlt":
            return "lalt";
        // | "rctl"
        case "RightControl":
            return "rctl";
        // | "rgui"
        case "RightMeta":
            return "rgui";
        // | "ralt"
        case "RightAlt":
            return "ralt";
        // | "up"
        case "Up":
            return "up";
        // | "down"
        case "Down":
            return "down";
        // | "left"
        case "Left":
            return "left";
        // | "right"
        case "Right":
            return "right";
        // | "home"
        case "Home":
            return "home";
        // | "end"
        case "End":
            return "end";
        // | "pgup"
        case "PageUp":
            return "pgup";
        // | "pgdown"
        case "PageDown":
            return "pgdown";
        default:
            return "UNKNOWN";
    }
}

export function getFlexibleInput(regularInput: InputObject): FlexInput {
    switch (regularInput.UserInputType.Name) {
        case "MouseButton1":
            return "lmb";
        case "MouseButton2":
            return "rmb";
        case "MouseButton3":
            return "mmb";
        case "Keyboard":
            return getFlexibleInputByKeyCode(regularInput.KeyCode);
        default:
            return "UNKNOWN";
    }
}
