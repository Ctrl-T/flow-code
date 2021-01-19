const TokenType = {
    LPAREN: '(',
    RPAREN: ')',
    BEGIN: '{',
    END: '}', 
    SEMI: ';', 
    EOF: 'EOF',
    IF: 'IF',
    ELSE: 'ELSE',
    WHILE: 'WHILE',
    SENTENCE: 'SENTENCE'
}

class Token {
    /**
     * constructor of class Token
     * @param {String} type type of token
     * @param {String} value value of token
     */
    constructor(type, value) {
        this.type = type
        this.value = value
    }
}

const ReservedKeyword = {
    'IF': new Token(TokenType.IF, 'IF'),
    'ELSE': new Token(TokenType.ELSE, 'ELSE'),
    'WHILE': new Token(TokenType.WHILE, 'WHILE'),
    'if': new Token(TokenType.IF, 'if'),
    'else': new Token(TokenType.ELSE, 'else'),
    'while': new Token(TokenType.WHILE, 'while')
}

export {Token, TokenType, ReservedKeyword};