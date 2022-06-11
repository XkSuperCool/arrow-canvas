<template>
  <div class="arrow-canvas">
    <canvas
      ref="canvas"
      :width="width"
      :height="height"
      @mousedown="handleMousedown"
    />
  </div>
</template>

<script>
export default {
  name: 'ArrowCanvas',

  data() {
    return {
      width: 200,
      height: 40,

      PADDING: 20,

      positions: {
        left: {
          x: 20,
          y: 20,
        },

        right: {
          x: 180,
          y: 20,
        },
      },
    };
  },

  mounted() {
    this.initCanvas();

    window.addEventListener('mousemove', this.handleMousemove);
    window.addEventListener('mouseup', this.handleMouseup);
  },

  beforeDestroy() {
    window.removeEventListener('mousemove', this.handleMousemove);
    window.removeEventListener('mouseup', this.handleMouseup);
  },

  methods: {
    initCanvas() {
      /**
       * @type {HTMLCanvasElement}
       */
      this.ctx = this.$refs.canvas.getContext('2d');
      this.draw();
    },

    draw() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.beginPath();
      const { left, right } = this.positions;
      this.ctx.moveTo(left.x, left.y);
      this.ctx.lineTo(right.x, right.y);
      this.ctx.closePath();
      this.ctx.strokeStyle = 'red';
      this.ctx.stroke();
    },

    handleMousedown(event) {
      const { offsetX, offsetY, x, y } = event;
      const { right } = this.positions;

      this.mousedownInfo = { x, y };

      if (
        // (
        Math.abs(offsetX - right.x) <= 10 &&
        Math.abs(offsetY - right.y) <= 10
        // ) ||
        // (
        //   Math.abs(offsetX - left.x) <= 10 &&
        //   Math.abs(offsetY - left.y) <= 10
        // )
      ) {
        this.drag = true;
        event.stopPropagation();
      }
    },

    handleMouseup() {
      this.drag = false;
    },

    handleMousemove(event) {
      if (!this.drag) return;

      const x = event.x - this.mousedownInfo.x;
      const y = event.y - this.mousedownInfo.y;

      this.positions.right.x += x;
      this.positions.right.y += y;

      const isRightToLeft = this.positions.right.x < this.positions.left.x;
      const isNegativeX = x < 0;

      const isBottomToTop = this.positions.right.y < this.positions.left.y;
      const isNegativeY = y < 0;

      this.width += isRightToLeft ? (isNegativeX ? Math.abs(x) : -x) : x;
      this.height += isBottomToTop ? (isNegativeY ? Math.abs(y) : -y) : y;

      this.mousedownInfo.y = event.y;
      this.mousedownInfo.x = event.x;

      // 右点由左面旋转到右面
      if (isRightToLeft) {
        this.$parent.left += isNegativeX ? -Math.abs(x) : Math.abs(x);
        this.positions.left.x += isNegativeX ? Math.abs(x) : -Math.abs(x);
        this.positions.right.x = this.PADDING;
      }


      // 右点由下面选转到上面
      if (isBottomToTop) {
        this.$parent.top += isNegativeY ? -Math.abs(y) : Math.abs(y);
        this.positions.left.y += isNegativeY ? Math.abs(y) : -Math.abs(y);
        this.positions.right.y = this.PADDING;
      }

      this.$nextTick(this.draw);
    },
  },
};
</script>

<style scoped>
.arrow-canvas {
  border: 1px solid red;
  position: absolute;
  box-sizing: border-box;
}
</style>
