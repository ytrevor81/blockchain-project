const Web3 = require("web3");

class StringBytes32Helper {
    
    web3 = new Web3();

    stringToBytes32(str)
    {
        let bytes32Version = web3.utils.toHex(str);
    
        if (_checkIfHexIsShorterThan66Chars(bytes32Version))
        {
            bytes32Version = _padHex(bytes32Version);
        }
    
        return bytes32Version;
    }
    
    bytes32ToString(bytes32)
    {
        const stringFromBytes32 = web3.utils.hexToUtf8(bytes32);
        return stringFromBytes32;
    }
    
    _checkIfHexIsShorterThan66Chars(bytes32)
    {
        const stringOfBytes32 = `${bytes32}`;
        return stringOfBytes32.length < 66;
    }
    
    _padHex(bytes32)
    {
        let str = `${bytes32}`;
    
        for(let i = str.length; i < 66; i++) {
            str += "0";
        }
    
        return str;
    }
}

module.exports = StringBytes32Helper;