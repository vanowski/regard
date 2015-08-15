'use strict';

class Block {
    constructor(x, y) {
        this.$element = document.createElement('div');
        this.$element.className = 'element-for-move';
        this.geometry = {
            x: 0,
            y: 0,
            width: BLOCK_SIDE,
            height: BLOCK_SIDE
        };
        this.x = x;
        this.y = y;
        this.dragging = false;
        this.lastX = 0;
        this.lastY = 0;

        this.$element.addEventListener('mousedown', function(e) {
            e.stopPropagation();
            this.dragging = true;
            this.lastX = e.clientX;
            this.lastY = e.clientY;
        }.bind(this));

        document.addEventListener('mousemove', function(e) {
            if (this.dragging) {
                let dx = e.clientX;
                let dy = e.clientY;
                let deltaX = this.lastX - dx;
                let deltaY = this.lastY - dy;

                if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 0) {
                    this.direction = 'up';
                } else if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 0) {
                    this.direction = 'left';
                } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < 0) {
                    this.direction = 'down';
                } else if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < 0) {
                    this.direction = 'right';
                }

                this.lastX = dx;
                this.lastY = dy;

                if (dx >= 10 && dx <= 500 - this.geometry.width && dy >= 10 && dy <= 300 - this.geometry.height) {
                    this.x = e.clientX;
                    this.y = e.clientY;

                    document.dispatchEvent(
                        new CustomEvent('moving', {
                            'detail': {
                                x: this.x,
                                y: this.y,
                                direction: this.direction
                            }
                        })
                    );
                }
            }
        }.bind(this));

        document.addEventListener('mouseup', function(e) {
            this.dragging = false;
        }.bind(this));

        document.addEventListener('moving', function(e) {
            let data = e.detail;
            let dx = data.x;
            let dy = data.y;
            let direction = data.direction;
            let w = this.x + this.geometry.width;
            let h = this.y + this.geometry.height;

            if (dx <= w && dy >= this.y && dy <= h && direction === 'left') {
                this.x -= 1;
            } else if (dx + BLOCK_SIDE >= this.x && dy >= this.y && dy <= h && direction === 'right') {
                this.x += 1;
            } else if (dy <= h && dx >= this.x && dx <= w && direction === 'up') {
                this.y -= 1;
            } else if (dy + BLOCK_SIDE <= this.y && dx >= this.x && dx <= w && direction === 'down') {
                this.y += 1;
            }
        }.bind(this));
    }

    set x(dx) {
        this.geometry.x = dx;
        this.$element.style.left = dx + 'px';
    }

    set y(dy) {
        this.geometry.y = dy;
        this.$element.style.top = dy + 'px';
    }

    get x() {
        return this.geometry.x;
    }

    get y() {
        return this.geometry.y;
    }

    checkCollisions() {

    }
}