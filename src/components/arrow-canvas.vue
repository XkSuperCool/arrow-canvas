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
import drawArrow from './arrow';

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
      const { left, right } = this.positions;
      this.ctx.clearRect(0, 0, this.width, this.height);
      drawArrow(this.ctx, left.x, left.y, right.x, right.y, 'red');
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

      const prevIsRightToLeft = this.positions.right.x < this.positions.left.x;
      const prevIsBottomToTop = this.positions.right.y < this.positions.left.y;
      this.positions.right.x += x;
      this.positions.right.y += y;

      const isRightToLeft = this.positions.right.x < this.positions.left.x;
      const isNegativeX = x < 0;

      const isBottomToTop = this.positions.right.y < this.positions.left.y;
      const isNegativeY = y < 0;

      const prevWidth = this.width;
      const prevHeight = this.height;
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

      // 在快速移动时，事件的触发会有节流的效果，这会导致绘制计算错误，下面代码解决了这个问题
      const PADDING = this.PADDING * 2;
      const diffWidth = prevWidth - PADDING;
      if (!prevIsRightToLeft && isRightToLeft && prevWidth > PADDING) {
        this.$parent.left += diffWidth;
        this.positions.left.x -= diffWidth;
        this.width =
          Math.abs(this.positions.left.x - this.positions.right.x) + PADDING;
      }

      if (prevIsRightToLeft && !isRightToLeft && prevWidth > PADDING) {
        this.$parent.left += diffWidth;
        this.positions.left.x -= diffWidth;
        this.positions.right.x -= diffWidth;
        this.width =
          Math.abs(this.positions.left.x - this.positions.right.x) + PADDING;
      }

      const diffHeight = prevHeight - PADDING;
      if (!prevIsBottomToTop && isBottomToTop && prevHeight > PADDING) {
        this.$parent.top += diffHeight;
        this.positions.left.y -= diffHeight;
        this.height =
          Math.abs(this.positions.left.y - this.positions.right.y) + PADDING;
      }

      if (prevIsBottomToTop && !isBottomToTop && prevHeight > PADDING) {
        this.$parent.top += diffHeight;
        this.positions.left.y -= diffHeight;
        this.positions.right.y -= diffHeight;
        this.height =
          Math.abs(this.positions.left.y - this.positions.right.y) + PADDING;
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
