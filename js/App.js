'use strict';

const BLOCK_SIDE = 50;

class App {
    constructor() {
        this.$container = document.getElementById('wrapper');
        this.dragging = false;
        this.blocks = [];
        this.startX = 0;
        this.startY = 0;
    }

    start() {
        document.getElementById('addElement').addEventListener('click', function() {
            let coords = this.findFreeSpot();

            this.addBlock(new Block(coords[0], coords[1]));
        }.bind(this));

        this.$container.addEventListener('mousedown', function(e) {
            this.dragging = true;
            this.startX = e.clientX;
            this.startY = e.clientY;
        }.bind(this));

        this.$container.addEventListener('mousemove', function(e) {
            if (this.dragging && e.target === this.$container) {
                let currentBackgroundX = parseInt(this.$container.style.backgroundPositionX) || 0;
                let currentBackgroundY = parseInt(this.$container.style.backgroundPositionY) || 0;

                this.$container.style.backgroundPositionX = currentBackgroundX - (this.startX - e.clientX) / 15 + 'px';
                this.$container.style.backgroundPositionY = currentBackgroundY - (this.startY - e.clientY) / 15 + 'px';
            }
        }.bind(this));

        document.addEventListener('mouseup', function(e) {
            this.dragging = false;
        }.bind(this));
    }

    addBlock(block) {
        this.blocks.push(block);
        this.$container.appendChild(block.$element);
    }

    findFreeSpot() {
        let x = this.randomFromRange(0, 500 - BLOCK_SIDE);
        let y = this.randomFromRange(0, 300 - BLOCK_SIDE);
        let vertices = [
            {x: x, y: y},
            {x: x + BLOCK_SIDE, y: y},
            {x: x + BLOCK_SIDE, y: y + BLOCK_SIDE},
            {x: x, y: y + BLOCK_SIDE}
        ];

        let checkIntersections = function(x, y) {
            return this.blocks.some(function(block) {
                return (
                    x > block.geometry.x && x < block.geometry.x + block.geometry.width &&
                    y > block.geometry.y && y < block.geometry.y + block.geometry.height
                );
            });
        }.bind(this);

        let noIntersections = vertices.every(function(vertex) {
            return checkIntersections(vertex.x, vertex.y) == false;
        });

        if (noIntersections) {
            return [x, y];
        } else {
            return this.findFreeSpot();
        }
    }

    randomFromRange(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
}