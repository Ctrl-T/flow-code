const ChartNodeType = {
    START: 'start',
    END: 'end',
    OPERATION: 'operation',
    INPUTOUTPUT: 'inputoutput',
    SUBROUTINE: 'subroutine',
    CONDITION: 'condition',
    PARALLEL: 'parallel'
}

const DirctionType = {
    LEFT: 'left',
    RIGHT: 'right',
    TOP: 'top',
    BOTTOM: 'bottom'
}

class ChartNode {
    static idCnt = 0;
    /**
     * 
     * @param {String} type type of node
     * @param {String} name name of node
     * @param {ChartNode} nextNode next node
     */
    constructor(type, name, nextNode) {
        this.type = type;
        this.name = name;
        this.nextNode = nextNode;
        this.id = type.substring(0, 2) + ChartNode.idCnt;
        ChartNode.idCnt += 1;
    }

    static resetIdCnt() {
        ChartNode.idCnt = 0;
    }
}

class StartNode extends ChartNode {
    /**
     * 
     * @param {String} name 
     * @param {ChartNode} nextNode 
     */
    constructor(name, nextNode) {
        super(ChartNodeType.START, name, nextNode);
    }
}

class EndNode extends ChartNode {
    /**
     * 
     * @param {String} name 
     * @param {ChartNode} nextNode 
     */
    constructor(name, nextNode) {
        super(ChartNodeType.END, name, nextNode);
    }
}

class OperationNode extends ChartNode {
    /**
     * 
     * @param {String} name 
     * @param {ChartNode} nextNode 
     */
    constructor(name, nextNode) {
        super(ChartNodeType.OPERATION, name, nextNode);
    }
}

class InputoutputNode extends ChartNode {
    /**
     * 
     * @param {String} name 
     * @param {ChartNode} nextNode 
     */
    constructor(name, nextNode) {
        super(ChartNodeType.INPUTOUTPUT, name, nextNode);
    }
}

class SubroutineNode extends ChartNode {
    /**
     * 
     * @param {String} name 
     * @param {ChartNode} nextNode 
     */
    constructor(name, nextNode) {
        super(ChartNodeType.SubroutineNode, name, nextNode);
    }
}

class ConditionNode extends ChartNode {
    /**
     * 
     * @param {String} name 
     * @param {ChartNode} trueNode 
     * @param {ChartNode} falseNode 
     */
    constructor(name, trueNode, falseNode) {
        super(ChartNodeType.CONDITION, name, trueNode);
        this.trueNode = trueNode;
        this.falseNode = falseNode;
    }
}

class ParallelNode extends ChartNode {
    /**
     * 
     * @param {String} name 
     * @param {ChartNode} nextNode 
     */
    constructor(name, nextNode) {
        super(ChartNodeType.PARALLEL, name, nextNode);
    }
}

export {DirctionType, ChartNode, StartNode, EndNode, OperationNode, InputoutputNode, SubroutineNode, ConditionNode, ParallelNode };