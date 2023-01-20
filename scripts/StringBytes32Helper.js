class StringBytes32Helper {
    Web3 = require("web3");
    web3 = new Web3();

    StringToBytes32(str)
    {
        let bytes32Version = web3.utils.toHex(str);
    
        if (CheckIfHexIsShorterThan66Chars(bytes32Version))
        {
            bytes32Version = PadHex(bytes32Version);
        }
    
        return bytes32Version;
    }
    
    Bytes32ToString(bytes32)
    {
        const stringFromBytes32 = web3.utils.hexToUtf8(bytes32);
        return stringFromBytes32;
    }
    
    CheckIfHexIsShorterThan66Chars(bytes32)
    {
        const stringOfBytes32 = `${bytes32}`;
        return stringOfBytes32.length < 66;
    }
    
    PadHex(bytes32)
    {
        let str = `${bytes32}`;
    
        for(let i = str.length; i < 66; i++) {
            str += "0";
        }
    
        return str;
    }
}

export default StringBytes32Helper;