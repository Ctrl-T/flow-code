class AST { }

/**
 * ExpressionStatement: sentence;
 */
class ExpressionStatement extends AST {
    constructor(text) {
        super();
        this.text = text;
    }
}

/**
 * BlockStatement: {ExpressionStatement...}
 */
class BlockStatement extends AST {
    constructor() {
        super();
        this.children = [];
    }
}

/**
 * IfStatement: if (test) {consequent} else {alternate}
 */
class IfStatement extends AST {
    /**
     * 
     * @param {ExpressionStatement} test test condotion
     * @param {AST} consequent if true, do this
     * @param {AST} alternate else, do this
     */
    constructor(test, consequent, alternate = null) {
        super();
        this.test = test;
        this.consequent = consequent;
        this.alternate = alternate;
    }
}

/**
 * WhileStatement: while (test) {body}
 */
class WhileStatement extends AST {
    /**
     * 
     * @param {ExpressionStatement} test loop condotion
     * @param {AST} body loop body
     */
    constructor(test, body) {
        super();
        this.test = test;
        this.body = body;
    }
}

class NoOp extends AST { }

export { ExpressionStatement, BlockStatement, IfStatement, WhileStatement, NoOp };