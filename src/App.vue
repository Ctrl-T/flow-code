<template>
  <div id="app">
    <div class="container">
      <header>
        <div class="logo">ACFlow - 码图</div>
      </header>
      <div id="main">
        <div id="input-pane" class="flex-auto">
          <tabs>
            <tab name="code" :iconClass="'iconfont icon-code'">
              <code-editor
                v-on:code-change="updateDSL"
                :editorSize="editorSize"
              ></code-editor>
            </tab>
            <tab name="setting" :selected="true" :iconClass="'iconfont icon-manage'">
              <setting-pane/>
            </tab>
            <tab name="examples" :iconClass="'iconfont icon-bulb'">
              <div>Examples pane</div>
            </tab>
          </tabs>
        </div>
        <div id="output-pane" class="flex-auto">
          <diagram-canvas :DSL="DSL" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import codeEditor from "./components/code-editor";
import diagramCanvas from "./components/diagram-canvas";
import { tabs, tab } from "./components/tag-pane.js";
import Lexer from "./assets/js/parser/lexer";
import Parser from "./assets/js/parser/parser";
import Interpreter from "./assets/js/interpreter/interpreter";
import settingPane from "./components/setting-pane";

export default {
  name: "App",
  components: {
    "diagram-canvas": diagramCanvas,
    "code-editor": codeEditor,
    tab: tab,
    tabs: tabs,
    settingPane
  },
  data() {
    return {
      DSL: "",
      editorSize: null,
    };
  },
  mounted() {
    window.Split(["#input-pane", "#output-pane"], {
      sizes: [30, 70],
      minSize: [48, 200],
      gutter: (index, direction) => {
        const gutter = document.createElement("div");
        gutter.className = `gutter gutter-${direction} iconfont`;
        return gutter;
      },
      onDrag: (sizes) => {
        this.editorSize = sizes;
      },
    });
  },
  methods: {
    updateDSL(code) {
      try {
        let lexer = new Lexer(code);
        let parser = new Parser(lexer);
        let interpreter = new Interpreter(parser);
        this.DSL = interpreter.interpret();
      } catch (error) {
        console.log(`语法错误：${error.message}`);
      }
    },
  },
};
</script>

<style lang="scss">
@import "./assets/css/dark-theme.scss";

#app {
}
* {
  box-sizing: border-box;
}
html,
body {
  min-height: 100%;
  min-width: 100%;
  margin: 0;
}
#container {
  display: flex;
  flex-direction: column;
}
header {
  flex: none;
  min-height: 2rem;
  background: $bk-pop-clr;
  color: $txt-head-clr;
  .logo {
    padding: 1rem;
    font-size: 1.5rem;
    line-height: 1.5rem;
  }
}
#main {
  display: flex;
  flex: auto;
  flex-direction: row;
  min-height: 0.05rem;
  height: calc(100vh - 3.5rem);
}
.gutter {
  position: relative;
  color: $txt-clr;
  text-align: center;
  background: $bk-pop-clr;
  cursor: col-resize;
  &::before {
    content: "\e6bc";
    position: absolute;
    display: block;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scaleY(1.5);
  }
  &:hover {
    color: $txt-head-clr;
  }
}
.flex-auto {
  flex: auto;
}
</style>
