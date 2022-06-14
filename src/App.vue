<template>
  <div id="app" @mousemove="handleMousemove">
    <div class="line"></div>
    <div
      class="drag-el"
      :style="{ left: left + 'px', top: top + 'px' }"
      @mousedown="handleMousedown"
    >
      <ArrowCanvas />
    </div>
  </div>
</template>

<script>
import ArrowCanvas from '@/components/arrow-canvas.vue';

export default {
  name: 'App',

  components: {
    ArrowCanvas,
  },

  data() {
    return {
      left: 400,
      top: 100,
    };
  },

  mounted() {
    window.addEventListener('mouseup', this.handleMouseup);
  },

  beforeDestroy() {
    window.removeEventListener('mouseup', this.handleMouseup);
  },

  methods: {
    handleMouseup() {
      this.drag = false;
    },

    handleMousedown(event) {
      this.drag = true;
      this.mouseEnterInfo = {};
      ({ x: this.mouseEnterInfo.x, y: this.mouseEnterInfo.y } = event);
    },

    handleMousemove(event) {
      if (!this.drag) return;

      const left = event.x - this.mouseEnterInfo.x;
      const top = event.y - this.mouseEnterInfo.y;
      this.mouseEnterInfo.y = event.y;
      this.mouseEnterInfo.x = event.x;

      this.left += left;
      this.top += top;
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

#app {
  width: 1200px;
  height: 600px;
  margin: 100px auto 0 auto;
  border: 1px solid rgb(31, 165, 107);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.drag-el {
  position: absolute;
}

.line {
  position: fixed;
  width: 1px;
  height: 100vh;
  left: 420px;
  top: 0;
  background-color: red;
}
</style>
