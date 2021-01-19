import { TokenType } from './token';
import { ExpressionStatement, BlockStatement, IfStatement, WhileStatement, NoOp } from './ast';


class Parser {
    /**
     * 
     * @param {Lexer} lexer 
     */
    constructor(lexer) {
        this.lexer = lexer
        this.currentToken = this.lexer.getNextToken(); // set to first token
    }

    /**
     * thrower an 'Invalid syntax' error
     */
    error() {
        throw new Error('Invalid syntax');
    }

    /**
     * compare the current token with the token passed in
     * if they match, 'eat' current token and get next token
     * else throw exception
     * @param {TokenType} tokenType 
     */
    eat(tokenType) {
        if (tokenType == this.currentToken.type) {
            this.currentToken = this.lexer.getNextToken();
        } else {
            this.error();
        }
    }

    /**
     * BlockStatement: { statementList }
     * @returns {BlockStatement}
     */
    blockStatement() {
        this.eat(TokenType.BEGIN);
        let nodes = this.statementList();
        this.eat(TokenType.END);

        let root = new BlockStatement();
        for (const node of nodes) {
            root.children.push(node);
        }
        return root;
    }

    /**
     * statementList: statement
     *              | statement; statementList
     * @returns {Array}
     */
    statementList() {
        let nodes = [];
        nodes.push(this.statement());
        for(;;) {
            if (this.currentToken.type == TokenType.SEMI) {
                this.eat(TokenType.SEMI);
            }
            let next = this.statement();
            if (next instanceof NoOp) {
                break;
            }
            nodes.push(next);
        }
        if (this.currentToken.type == TokenType.SENTENCE) {
            this.error();
        }
        return nodes;
    }

    /**
     * statement: BlockStatement
     *          | ExpressionStatement
     *          | empty
     * @returns {(ExpressionStatement | BlockStatement | NoOp)}
     */
    statement() {
        let node;
        if (this.currentToken.type == TokenType.BEGIN) { // BlockStatement
            node = this.blockStatement();
        } else if (this.currentToken.type == TokenType.SENTENCE) { // ExpressionStatement
            node = this.expressionStatement();
        } else if (this.currentToken.type == TokenType.IF) {
            node = this.ifStatement();
        } else if (this.currentToken.type == TokenType.WHILE) {
            node = this.whileStatement();
        } else { // empty
            node = this.empty();
        }
        return node;
    }

    /**
     * ExpressionStatement: sentence;
     * @returns {ExpressionStatement}
     */
    expressionStatement() {
        let node = new ExpressionStatement(this.currentToken.value);
        this.eat(TokenType.SENTENCE);
        return node;
    }

    /**
     * IfStatement: if (test) {consequent} else {alternate}
     * @returns {IfStatement}
     */
    ifStatement() {
        this.eat(TokenType.IF);
        this.eat(TokenType.LPAREN);
        let test = this.expressionStatement();
        this.eat(TokenType.RPAREN);
        let consequent = this.statement();
        let alternate = null;
        if (this.currentToken.type == TokenType.ELSE) {
            this.eat(TokenType.ELSE);
            alternate = this.statement();
        }
        let node = new IfStatement(test, consequent, alternate);
        return node;
    }

    /**
     * WhileStatement: while (test) {body}
     */
    whileStatement() {
        this.eat(TokenType.WHILE);
        this.eat(TokenType.LPAREN);
        let test = this.expressionStatement();
        this.eat(TokenType.RPAREN);
        let body = this.statement();
        let node = new WhileStatement(test, body);
        return node;
    }

    /**
     * empty statement
     * @returns {NoOp}
     */
    empty() {
        return new NoOp();
    }

    /**
     * parse the entire program
     * @returns {AST} whole AST
     */
    parse() {
        let node = this.statementList();
        if (this.currentToken.type != TokenType.EOF) {
            this.error();
        }
        return node;
    }
}

export default Parser;