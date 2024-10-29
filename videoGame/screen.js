export class Screen {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        //this.backgroundImage = new Image();
        //this.backgroundImage.src = 'assets/pool-background.png';
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /*
    drawBackground() {
        // Draw a background image or color for the swimming pool
        if (this.backgroundImage.complete) {
            this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        } else {
            this.ctx.fillStyle = '#87CEEB'; // Light blue for pool water
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    */

    drawScore(score) {
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(`Score: ${score}`, 20, 30);
    }

    drawTimeLeft(timeLeft) {
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(`Time Left: ${timeLeft}`, this.canvas.width - 150, 30);
    }
}
