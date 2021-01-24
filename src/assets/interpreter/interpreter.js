import { BlockStatement, ExpressionStatement, IfStatement, NoOp, WhileStatement } from '../parser/ast';
import { ChartNode, ConditionNode, EndNode, OperationNode, StartNode } from './chart-node';
// import { ChartNode, StartNode, EndNode, OperationNode, InputoutputNode, SubroutineNode, ConditionNode, ParallelNode } from './chart-node'

class Interpreter {
    /**
     * 
     * @param {Parser} parser 
     */
    constructor(parser) {
        this.parser = parser;
        this.DSL = "";
        this.chartNodes = [];
        this.DSLNodes = [];
        this.DSLConnections = [];
        this.lastNode = null;
    }

    /**
     * throw 'Invalid AST Node!' error
     */
    error() {
        throw new Error('Invalid AST Node!');
    }

    interpret() {
        let tree = this.parser.parse();
        if (!tree) {
            return null;
        }
        ChartNode.resetIdCnt();
        this.lastNode = new EndNode('结束', null);
        this.chartNodes.push(this.lastNode);
        this.traverse(tree);
        this.generateDSL();
        console.log(this.DSL);
        return this.DSL;
    }

    /**
     * traverse to generate chartNodes
     * @param {Array} tree AST
     */
    traverse(tree) {
        while (tree.length != 0) {
            this.convertToChartNode(tree.pop());
        }
        let startNode = new StartNode('开始', this.lastNode);
        this.chartNodes.push(startNode);
        this.chartNodes.reverse();
    }

    /**
     * 
     * @param {AST} node 
     * @returns {ChartNode} the (header) converted chart node
     */
    convertToChartNode(node) {
        if (node == null) {
            return null;
        }
        let chartNode = null;
        if (node instanceof ExpressionStatement) {
            chartNode = new OperationNode(node.text, this.lastNode);
        } else if (node instanceof BlockStatement) {
            let astNodes = [];
            for (let child of node.children) {
                astNodes.push(child);
            }
            while (astNodes.length != 0) {
                chartNode = this.convertToChartNode(astNodes.pop());
            }
            return chartNode;
        } else if (node instanceof IfStatement) {
            let realLastNode = this.lastNode;
            let trueNode = this.convertToChartNode(node.consequent);
            this.lastNode = realLastNode;
            let falseNode = null;
            if (node.alternate) {
                falseNode = this.convertToChartNode(node.alternate);
            } else {
                falseNode = realLastNode;
            }
            chartNode = new ConditionNode(node.test.text, trueNode, falseNode);
        } else if (node instanceof WhileStatement) {
            let realLastNode = this.lastNode;
            let pseudoNode = new ConditionNode(null, null, null);
            this.lastNode = pseudoNode
            let trueNode = this.convertToChartNode(node.body);
            chartNode = new ConditionNode(node.test.text, trueNode, realLastNode);
            pseudoNode.id = chartNode.id;
        } else if (node instanceof NoOp) {
            return this.lastNode;
        } else {
            this.error();
        }
        this.chartNodes.push(chartNode);
        this.lastNode = chartNode;
        return chartNode;
    }

    /**
     * gengrate DSL text
     */
    generateDSL() {
        for (let node of this.chartNodes) {
            this.DSLNodes.push(`${node.id}=>${node.type}: ${node.name}`);
            if (node instanceof EndNode) {
                continue;
            }
            if (node instanceof ConditionNode) {
                this.DSLConnections.push(`${node.id}(yes)->${node.trueNode.id}`);
                if (node.falseNode != null)
                    this.DSLConnections.push(`${node.id}(no)->${node.falseNode.id}`);
            } else {
                this.DSLConnections.push(`${node.id}->${node.nextNode.id}`);
            }

        }
        this.DSL = this.DSLNodes.join('\n') + '\n\n' + this.DSLConnections.join('\n');
    }
}

export default Interpreter;