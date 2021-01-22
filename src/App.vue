<template>
  <div id="app">
    <div class="container">
      <header>
        <div class="logo">FlowCode</div>
      </header>
      <div id="main">
        <div id="input-pane" class="flex-auto">
          <tabs>
            <tab
              name="code"
              :selected="true"
              v-bind:icon-url="iconCode"
              v-bind:active-icon-url="iconCodeActive"
            >
              <code-editor v-on:code-change="updateDSL"></code-editor>
            </tab>
            <tab name="setting"
                          v-bind:icon-url="iconSetting"
              v-bind:active-icon-url="iconSettingActive">
              <div>here is the content for the music tab.</div>
            </tab>
            <tab name="examples"
                          v-bind:icon-url="iconExample"
              v-bind:active-icon-url="iconExampleActive">
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
import iconCode from "./assets/img/code.svg";
import iconCodeActive from "./assets/img/code-active.svg";
import iconSetting from "./assets/img/settings.svg";
import iconSettingActive from "./assets/img/settings-active.svg";
import iconExample from "./assets/img/bulb.svg";
import iconExampleActive from "./assets/img/bulb-active.svg";

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
      iconCode,
      iconCodeActive,
      iconSetting,
      iconSettingActive,
      iconExample,
      iconExampleActive
    };
  },
  mounted() {
    window.Split(["#input-pane", "#output-pane"], {
      sizes: [25, 75],
      minSize: [48, 200],
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
  background: #373a47;
  color: aliceblue;
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
