var Web3 = require("web3");
const web3 = new Web3();

const inputtedString = "Hello World!";

function StringToBytes32(str)
{
    let bytes32Version = web3.utils.toHex(str);

    if (CheckIfHexIsShorterThan66Chars(bytes32Version))
    {
        bytes32Version = PadHex(bytes32Version);
    }

    return bytes32Version;
}

function Bytes32ToString(bytes32)
{
    let stringFromBytes32 = web3.utils.hexToUtf8(bytes32);
    return stringFromBytes32;
}

function CheckIfHexIsShorterThan66Chars(bytes32)
{
    let stringOfBytes32 = `${bytes32}`;
    return stringOfBytes32.length < 66;
}

function PadHex(bytes32)
{
    let str = `${bytes32}`;

    for(let i = str.length; i < 66; i++) {
        str += "0";
    }

    return str;
}

//var hex = StringToBytes32(inputtedString);
var returnedString = Bytes32ToString("0x48656c6c6f20576f726c64210000000000000000000000000000000000000000");

//console.log(hex);
console.log(returnedString);