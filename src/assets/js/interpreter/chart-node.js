const ChartNodeType = {
    START: 'start',
    END: 'end',
    OPERATION: 'operation',
    INPUTOUTPUT: 'inputoutput',
    SUBROUTINE: 'subroutine',
    CONDITION: 'condition',
    PARALLEL: 'parallel',
    PSEUDO: 'pseudo'
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
        if (nextNode) {
            this.height = nextNode.height + 1;
        } else {
            this.height = 0;
        }
        this.checkLinkPseudoNode();
        ChartNode.idCnt += 1;
    }

    resetHeight() {
        this.height = 0;
    }

    static resetIdCnt() {
        ChartNode.idCnt = 0;
    }

    checkLinkPseudoNode() {
        if (this.nextNode instanceof PseudoNode) {
            this.nextNode.addPrevNode(this);
        }
        if (this.falseNode instanceof PseudoNode) {
            this.falseNode.addPrevNode(this);
        }
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
     */
    constructor(name) {
        super(ChartNodeType.END, name, null);
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
        this.falseNode = falseNode;
        if (trueNode && falseNode) {
            this.trueToBottom = trueNode.height >= falseNode.height;
        }
        this.checkLinkPseudoNode();
    }
}

class ParallelNode extends ChartNode {
    /**
     * 
     * @param {String} name 
     * @param {ChartNode} nextNode 
     * @param {ChartNode} next2Node 
     */
    constructor(name, nextNode, nextNode2) {
        super(ChartNodeType.PARALLEL, name, nextNode);
        this.falseNode = nextNode2;
        this.checkLinkPseudoNode();
    }
}

class PseudoNode extends ChartNode {
    constructor() {
        super(ChartNodeType.PSEUDO, null, null);
        this.prevNodes = [];
    }
    addPrevNode(node) {
        if (!this.prevNodes.includes(node))
            this.prevNodes.push(node);
    }
    /**
     * restore pesudoNodes to real nodes
     * @param {ChartNode} realNode 
     * @param {ChartNode} realNode2 
     */
    restoreRealNodes(realNode, realNode2) {
        while (this.prevNodes.length > 0) {
            let node = this.prevNodes.pop();
            if (node instanceof ParallelNode) {
                if (node.nextNode == this)
                    node.nextNode = realNode;
                node.falseNode = realNode2;
            }
            if (node instanceof ConditionNode) {
                if (node.nextNode == this)
                    node.nextNode = realNode;
                else
                    node.falseNode = realNode;
            } else {
                node.nextNode = realNode;
            }
            node.checkLinkPseudoNode();
        }
    }
}

export { DirctionType, ChartNode, StartNode, EndNode, OperationNode, InputoutputNode, SubroutineNode, ConditionNode, ParallelNode, PseudoNode };