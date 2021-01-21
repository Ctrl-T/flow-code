<template>
  <div class="canvas-container">
    <div class="nav-btn-list">
      <div id="center" class="nav-btn"></div>
      <div id="zoom-in" class="nav-btn"></div>
      <div id="zoom-out" class="nav-btn"></div>
    </div>
    <div id="canvas-bkg" class="canvas-container">
      <div id="canvas"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "diagramCanvas",
  props: {
    DSL: String,
  },
  data() {
    return {
      canvas: null,
      canvasBkg: null,
      pos: { x: 0, y: 0 },
      scale: 1,
    };
  },
  mounted() {
    // init canvas
    this.canvasBkg = document.getElementById("canvas-bkg");
    this.canvas = document.getElementById("canvas");
    this.centerCanvas();
    // Make canvas draggable
    this.canvasDraggable();
    // Make canvas Scrollable
    this.ScrollZoom(this.canvasBkg, 10, 0.15);
    this.initBtns();
  },
  watch: {
    DSL: function (newVal) {
      // on DSL change
      let diagram = window.flowchart.parse(newVal);
      // let canvas = document.getElementById("canvas");
      this.canvas.innerHTML = "";
      diagram.drawSVG(this.canvas);
      this.centerCanvas();
    },
  },
  methods: {
    /**
     * drag the canvasBkg while canvas move
     */
    canvasDraggable() {
      let deltaX = 0,
        deltaY = 0,
        lastX = 0,
        lastY = 0;
      this.canvasBkg.onmousedown = dragMouseDown;
      let that = this;

      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        lastX = e.clientX;
        lastY = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        deltaX = lastX - e.clientX;
        deltaY = lastY - e.clientY;
        lastX = e.clientX;
        lastY = e.clientY;
        // set the element's new position:
        that.pos.x -= deltaX;
        that.pos.y -= deltaY;
        that.update();
      }

      function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
      }
    },
    /**
     * make canvas draggable
     */
    ScrollZoom(container, max_scale, factor) {
      var target = container.children[0];
      var pos = this.pos;
      var zoom_target = { x: 0, y: 0 };
      var zoom_point = { x: 0, y: 0 };
      var update = this.update;
      let that = this;
      target.style["transform-origin"] = "0 0";
      container.onwheel = scrolled;

      function scrolled(e) {
        let offset = container.getBoundingClientRect();
        // pos relativa to target's lefttop corner
        zoom_point.x = e.clientX - offset.left;
        zoom_point.y = e.clientY - offset.top;

        e.preventDefault();
        var delta = -e.deltaY || e.originalEvent.wheelDelta;
        if (delta === undefined) {
          //we are on firefox
          delta = e.originalEvent.detail;
        }
        delta = Math.max(-1, Math.min(1, delta)); // cap the delta to [-1,1] for cross browser consistency

        // determine the point on where the slide is zoomed in
        zoom_target.x = (zoom_point.x - pos.x) / that.scale;
        zoom_target.y = (zoom_point.y - pos.y) / that.scale;
        // apply zoom
        that.scale += delta * factor * that.scale;
        that.scale = Math.max(0.1, Math.min(max_scale, that.scale));

        // calculate x and y based on zoom
        pos.x = -zoom_target.x * that.scale + zoom_point.x;
        pos.y = -zoom_target.y * that.scale + zoom_point.y;
        update();
      }
    },
    /**
     * update transform of canvas
     */
    update() {
      this.canvas.style.transform =
        "translate(" +
        this.pos.x +
        "px," +
        this.pos.y +
        "px) scale(" +
        this.scale +
        "," +
        this.scale +
        ")";
    },
    /**
     * center vanvas
     */
    centerCanvas() {
      let bkgRect, canvasRect;
      updateRects(this);
      while (canvasRect.height > bkgRect.height - 50 || canvasRect.width > bkgRect.width - 50) {
        this.scale -= 0.1;
        this.update();
        updateRects(this);
      }
      while (canvasRect.height < bkgRect.height - 50 && canvasRect.width < bkgRect.width - 50) {
        this.scale += 0.1;
        this.update();
        updateRects(this);        
      }
      // updateRects(this);
      this.pos.y = bkgRect.height / 2 - canvasRect.height / 2;
      this.pos.x = bkgRect.width / 2 - canvasRect.width / 2;
      this.update();
      function updateRects(that) {
        bkgRect = that.canvasBkg.getBoundingClientRect();
        canvasRect = that.canvas.getBoundingClientRect();
      }
    },
    initBtns() {
      let btnCenter = document.getElementById("center");
      btnCenter.onclick = () => {
        this.centerCanvas();
      };
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
#canvas-bkg {
  background: #f6f6f6;
}
#canvas {
  position: absolute;
  cursor: default;
  padding: 3rem;
  background: white;
  box-shadow: 3px 4px 14px rgba(18, 18, 18, 0.1);
}
.smooth-scale {
  transition: transform 220ms ease-in-out;
}
.nav-btn-list {
  position: absolute;
  z-index: 4;
  display: flex;
  flex-direction: column;
  top: 3rem;
  right: 2rem;
}
.nav-btn {
  width: 2rem;
  height: 2rem;
  margin: 1rem;
  background: white;
  border-radius: 0.4rem;
  box-shadow: 3px 4px 14px rgba(18, 18, 18, 0.1),
    inset -3px -3px 1px 0px rgb(18 18 18 / 12%),
    inset 6px 6px 9px rgb(18 18 18 / 10%);
  cursor: pointer;
}
</style>
