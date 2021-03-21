interface IDictionary {
    [index: string]: string;
}

const lookup: IDictionary = {
    '0': '0000',
    '1': '0001',
    '2': '0010',
    '3': '0011',
    '4': '0100',
    '5': '0101',
    '6': '0110',
    '7': '0111',
    '8': '1000',
    '9': '1001',
    'a': '1010',
    'b': '1011',
    'c': '1100',
    'd': '1101',
    'e': '1110',
    'f': '1111',
    'A': '1010',
    'B': '1011',
    'C': '1100',
    'D': '1101',
    'E': '1110',
    'F': '1111'
};

export const hexToBinary = (str: String): String => {
    let ret = '';
    for (let i = 0, len = str.length; i < len; i++) {
        ret += lookup[str[i]];
    }
    return ret;
}

