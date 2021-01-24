<template>
  <div class="canvas-container">
    <div class="nav-btn-list">
      <div id="center" class="nav-btn" v-on:click="centerCanvas()">
        <i class="iconfont icon-self-adaption"></i>
      </div>
      <div id="zoom-in" class="nav-btn" v-on:click="zoom(true)">
        <i class="iconfont icon-add"></i>
      </div>
      <div id="zoom-out" class="nav-btn" v-on:click="zoom(false)">
        <i class="iconfont icon-reduce"></i>
      </div>
      <div id="download" class="nav-btn"  @click="$modal.show('download-modal', canvas.children[0])">
        <i class="iconfont icon-download"></i>
      </div>
    </div>
    <div id="canvas-bkg" class="canvas-container">
      <div
        id="canvas"
        class="smooth-scale"
        v-bind:style="{
          transform:
            'translate(' +
            pos.x +
            'px, ' +
            pos.y +
            'px) scale(' +
            scale +
            ', ' +
            scale +
            ')',
        }"
      ></div>
    </div>
    <download-modal />
  </div>
</template>

<script>
import downloadModal from "./download-modal";

export default {
  name: "diagramCanvas",
  props: {
    DSL: String,
  },
  components: {
    downloadModal,
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
    // Make canvas draggable
    this.canvasDraggable();
    // Make canvas Scrollable
    this.ScrollZoom(this.canvasBkg, 10, 0.15);
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
      this.canvasBkg.ontouchstart = dragMouseDown;
      let that = this;

      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        if (e.clientX) {
          lastX = e.clientX;
          lastY = e.clientY;
        } else {
          lastX = e.touches[0].clientX;
          lastY = e.touches[0].clientY;
        }
        that.canvasBkg.onmouseup = closeDragElement;
        that.canvasBkg.ontouchend = closeDragElement;
        // call a function whenever the cursor moves:
        that.canvasBkg.onmousemove = elementDrag;
        that.canvasBkg.ontouchmove = elementDrag;
      }

      function elementDrag(e) {
        that.canvas.classList.remove("smooth-scale");
        e = e || window.event;
        e.preventDefault();
        let currentX, currentY;
        if (e.clientX) {
          currentX = e.clientX;
          currentY = e.clientY;
        } else {
          currentX = e.touches[0].clientX;
          currentY = e.touches[0].clientY;
        }
        // calculate the new cursor position:
        deltaX = lastX - currentX;
        deltaY = lastY - currentY;
        lastX = currentX;
        lastY = currentY;
        // set the element's new position:
        that.pos.x -= deltaX;
        that.pos.y -= deltaY;
      }

      function closeDragElement() {
        that.canvas.classList.add("smooth-scale");
        // stop moving when mouse button is released:
        that.canvasBkg.onmouseup = null;
        that.canvasBkg.onmousemove = null;
      }
    },
    /**
     * make canvas draggable
     */
    ScrollZoom(container, max_scale, factor) {
      var target = container.children[0];
      var zoom_target = { x: 0, y: 0 };
      var zoom_point = { x: 0, y: 0 };
      let that = this;
      target.style["transform-origin"] = "0 0";
      container.onwheel = scrolled;

      function scrolled(e) {
        let offset = container.getBoundingClientRect(),
          x = that.pos.x,
          y = that.pos.y,
          scale = that.scale;
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
        zoom_target.x = (zoom_point.x - x) / scale;
        zoom_target.y = (zoom_point.y - y) / scale;
        // apply zoom
        scale += delta * factor * scale;
        scale = Math.max(0.1, Math.min(max_scale, scale));

        // calculate x and y based on zoom
        x = -zoom_target.x * scale + zoom_point.x;
        y = -zoom_target.y * scale + zoom_point.y;

        // update
        that.scale = scale;
        that.pos = {
          x: x,
          y: y,
        };
      }
    },
    /**
     * center vanvas
     */
    centerCanvas() {
      let bkgRect = this.canvasBkg.getBoundingClientRect(),
        canvasRect = this.canvas.getBoundingClientRect(),
        width = canvasRect.width / this.scale,
        height = canvasRect.height / this.scale;
      // scale
      this.scale = Math.min(
        (bkgRect.height - 50) / height,
        (bkgRect.width - 50) / width
      );
      width *= this.scale;
      height *= this.scale;
      this.pos.y = bkgRect.height / 2 - height / 2;
      this.pos.x = bkgRect.width / 2 - width / 2;
    },
    zoom(zoomIn = true, step = 3) {
      let bkgRect = this.canvasBkg.getBoundingClientRect();
      let wheelEvent = new WheelEvent("wheel", {
        deltaY: zoomIn ? -1 : 1,
        clientX: bkgRect.left + bkgRect.width / 2,
        clientY: bkgRect.top + bkgRect.height / 2,
      });
      for (let i = 0; i < step; ++i) {
        this.canvasBkg.dispatchEvent(wheelEvent);
      }
    },

    boundryStopper(newPos) {
      const edge = 20;
      let x, y;
      if (newPos != undefined) {
        x = newPos.x;
        y = newPos.y;
      } else {
        x = this.pos.x;
        y = this.pos.y;
      }
      let bkgRect = this.canvasBkg.getBoundingClientRect();
      let canvasRect = this.canvas.getBoundingClientRect();
      if (bkgRect.right - canvasRect.left < edge) {
        x -= canvasRect.left - bkgRect.right + edge;
      }
      if (canvasRect.right - bkgRect.left < edge) {
        x += bkgRect.left - canvasRect.right + edge;
      }
      if (canvasRect.bottom - bkgRect.top < edge) {
        y += -(canvasRect.bottom - bkgRect.top) + edge;
      }
      if (bkgRect.bottom - canvasRect.top < edge) {
        y -= -(bkgRect.bottom - canvasRect.top) + edge;
      }
      return {
        x: x,
        y: y,
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
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
}
.smooth-scale {
  transition: transform 200ms cubic-bezier(0.46, 0.03, 0.52, 0.96);
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
  padding: 0.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.nav-btn:hover {
  background: #f5f5f5;
}
.nav-btn:active {
  background: #f1f1f1;
}
</style>
