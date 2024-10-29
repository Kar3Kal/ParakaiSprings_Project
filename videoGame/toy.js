export class Toy {
    constructor(x, y, ctx) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.initialRadius = 12; // Original size radius
        this.radius = this.initialRadius; // Current radius
        this.color = this.getRandomColor();
        this.state = 'entering'; // Lifecycle states: 'entering', 'staying', 'leaving', 'collected'
        this.targetX = Math.random() * ctx.canvas.width;
        this.targetY = Math.random() * ctx.canvas.height;
        this.speed = 2;
        this.stayDuration = 5000; // 5 seconds
        this.startTime = null;
    }

    getRandomColor() {
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        switch (this.state) {
            case 'entering':
                this.moveToTarget();
                if (this.hasReachedTarget()) {
                    this.state = 'staying';
                    this.startTime = Date.now();
                }
                break;
            case 'staying':
                if (Date.now() - this.startTime >= this.stayDuration) {
                    this.state = 'leaving';
                }
                break;
            case 'leaving':
                this.moveToEdge();
                break;
        }
    }

    moveToTarget() {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > this.speed) {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
            this.radius = Math.max(this.initialRadius / 2, this.radius - 0.05); // Gradually decrease radius while entering
        }
    }

    moveToEdge() {
        const edgeX = this.x < this.ctx.canvas.width / 2 ? 0 : this.ctx.canvas.width;
        const edgeY = this.y < this.ctx.canvas.height / 2 ? 0 : this.ctx.canvas.height;
        const dx = edgeX - this.x;
        const dy = edgeY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > this.speed) {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
            this.radius = Math.min(this.initialRadius, this.radius + 0.05); // Gradually increase radius while leaving
        } else {
            this.resetPosition();
        }
    }

    hasReachedTarget() {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        return Math.abs(dx) < this.speed && Math.abs(dy) < this.speed;
    }

    resetPosition() {
        const edge = Math.floor(Math.random() * 4);
        switch (edge) {
            case 0: // Top
                this.x = Math.random() * this.ctx.canvas.width;
                this.y = 0;
                break;
            case 1: // Right
                this.x = this.ctx.canvas.width;
                this.y = Math.random() * this.ctx.canvas.height;
                break;
            case 2: // Bottom
                this.x = Math.random() * this.ctx.canvas.width;
                this.y = this.ctx.canvas.height;
                break;
            case 3: // Left
                this.x = 0;
                this.y = Math.random() * this.ctx.canvas.height;
                break;
        }
        this.radius = this.initialRadius; // Reset radius to original size
        this.color = this.getRandomColor();
        this.state = 'entering';
        this.targetX = Math.random() * this.ctx.canvas.width;
        this.targetY = Math.random() * this.ctx.canvas.height;
    }

    draw() {
        if (this.state !== 'collected') {
            const gradient = this.ctx.createRadialGradient(this.x, this.y, this.radius / 4, this.x, this.y, this.radius);
            gradient.addColorStop(0, 'white');
            gradient.addColorStop(1, this.color);
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            this.ctx.closePath();
        }
    }
}
