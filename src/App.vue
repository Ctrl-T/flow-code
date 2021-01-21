<template>
  <div id="app">
    <div class="container">
      <header>
        <div class="logo">FlowCode</div>
      </header>
      <div id="main">
        <div id="input-pane" class="flex-auto">
          <tabs>
            <tab name="代码" :selected="true">
              <code-editor v-on:code-change="updateDSL"></code-editor>
            </tab>
            <tab name="样式">
              <div>here is the content for the music tab.</div>
            </tab>
            <tab name="样例">
              <div>here is the content for the video tab.</div>
            </tab>
          </tabs>
        </div>
        <div id="output-pane" class="flex-auto">
          <diagram-canvas v-bind:DSL="DSL"></diagram-canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import codeEditor from "./components/code-editor";
import diagramCanvas from "./components/diagram-canvas";
import { tabs, tab } from "./components/tag-pane.js";

export default {
  name: "App",
  components: {
    "diagram-canvas": diagramCanvas,
    "code-editor": codeEditor,
    tab: tab,
    tabs: tabs,
  },
  data() {
    return {
      DSL: "",
    };
  },
  mounted() {
    window.Split(["#input-pane", "#output-pane"], {
      sizes: [25, 75],
    });
  },
  methods: {
    updateDSL(DSL) {
      this.DSL = DSL;
    },
  },
};
</script>

<style>
#app {
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
}
.logo {
  padding: 1rem;
  font-size: 1.5rem;
  line-height: 1.5rem;
}
#main {
  display: flex;
  flex: auto;
  flex-direction: row;
  min-height: 0.05rem;
  height: calc(100vh - 3.5rem);
}
.flex-auto {
  flex: auto;
}
.gutter {
  position: relative;
  color: #868ba9;
  text-align: center;
  background: rgb(83, 87, 110);
}
.gutter::before {
  content: "||";
  position: absolute;
  display: block;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scaleY(1.5);
}
.gutter:hover {
  color: #babfe0;
}
</style>
