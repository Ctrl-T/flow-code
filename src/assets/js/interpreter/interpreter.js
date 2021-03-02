import { BlockStatement, ExpressionStatement, IfStatement, NoOp, WhileStatement } from '../parser/ast';
import { ChartNode, ConditionNode, EndNode, OperationNode, StartNode, PseudoNode, ParallelNode } from './chart-node';
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
        this.lastNode = new EndNode('结束');
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
            if (this.lastNode instanceof PseudoNode) {
                chartNode = new ParallelNode(node.text, this.lastNode);
            } else {
                chartNode = new OperationNode(node.text, this.lastNode);
            }
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
            realLastNode.resetHeight();
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
            realLastNode.resetHeight();
            let pseudoNode = new PseudoNode();
            this.lastNode = pseudoNode
            let trueNode = this.convertToChartNode(node.body);
            chartNode = new ConditionNode(node.test.text, trueNode, realLastNode);
            pseudoNode.restoreRealNodes(chartNode, realLastNode);
        } else if (node instanceof NoOp) {
            if (this.lastNode instanceof PseudoNode)
                chartNode = new ParallelNode("Null", this.lastNode);
            else
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
            // TODO: (align-next=no) to disable shift
            this.DSLNodes.push(`${node.id}=>${node.type}: ${node.name}`);
            if (node instanceof EndNode) {
                continue;
            }
            if (node instanceof ConditionNode) {
                let yesDir = ', bottom', noDir = '';
                if (!node.trueToBottom) {
                    [yesDir, noDir] = [noDir, yesDir];
                }
                this.DSLConnections.push(`${node.id}(yes${yesDir})->${node.nextNode.id}`);
                if (node.falseNode != null)
                    this.DSLConnections.push(`${node.id}(no${noDir})->${node.falseNode.id}`);
            } else if (node instanceof ParallelNode) {
                this.DSLConnections.push(`${node.id}(path1, bottom)->${node.falseNode.id}`);
                this.DSLConnections.push(`${node.id}(path2)->${node.nextNode.id}`);
                this.DSLConnections.push(`${node.id}@>${node.falseNode.id}({"stroke-width":0})`);
            } else {
                this.DSLConnections.push(`${node.id}->${node.nextNode.id}`);
            }

        }
        this.DSL = this.DSLNodes.join('\n') + '\n\n' + this.DSLConnections.join('\n');
    }
}

export default Interpreter;