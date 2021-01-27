import {Token, TokenType, ReservedKeyword} from './token';

/**
 * Lexer seperate code into tokens by traversing every char of it
 */
class Lexer{
    /**
     * Constructor of class Lexer
     * @param {String} text code text
     */
    constructor(text) {   
        this.text = text; // input code text        
        this.pos = 0; // current pos, index of this.text
        this.currentChar = this.text[this.pos];
    }

    /**
     * throw an 'Invalid character' error
     */
    err() {
        throw new Error('Invalid character');
    }

    /**
     * Advance the `pos` pointer and set the `current_char` variable
     */
    advance() {
        this.pos += 1;
        if (this.pos > this.text.length) {
            // at the end of text
            this.currentChar = null;
        } else {
            // update this.currentChar
            this.currentChar = this.text[this.pos];
        }
    }

    skipWhiteSpace() {
        while(this.currentChar && this.currentChar.match(/\s/)) {
            this.advance();
        }
    }

    /**
     * Handle sentence or reserved words
     * @returns {Token}
     */
    getSentence() {
        let result = '';
        while(this.currentChar.match(/[^\s(){};]/)) {
            result += this.currentChar;
            this.advance();
        }
        if (ReservedKeyword[result] != undefined) {
            return ReservedKeyword[result]
        }
        while(this.currentChar.match(/[^);]/)) {
            result += this.currentChar;
            this.advance();
        }
        result = result.trim();
        return new Token(TokenType.SENTENCE, result);
    }

    /**
     * Break code text into tokens one at a time
     * @returns {Token} the next token
     */
    getNextToken() {
        while (this.currentChar) {
            if(this.currentChar.match(/\s/)) {
                this.skipWhiteSpace();
                continue;
            }
            if(this.currentChar == ';') {
                this.advance();
                return new Token(TokenType.SEMI, ';');
            }
            if(this.currentChar == '(') {
                this.advance();
                return new Token(TokenType.LPAREN, '(');
            }
            if(this.currentChar == ')') {
                this.advance();
                return new Token(TokenType.RPAREN, ')');
            }
            if(this.currentChar == '{') {
                this.advance();
                return new Token(TokenType.BEGIN, '{');
            }
            if(this.currentChar == '}') {
                this.advance();
                return new Token(TokenType.END, '}');
            }
            return this.getSentence();
        }
        return new Token(TokenType.EOF, null);
    }
    
}

export default Lexer;