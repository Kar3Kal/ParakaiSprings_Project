export class Player {
    constructor(x, y, ctx) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.speed = 5;
        this.width = 20;
        this.height = 20;
        this.direction = { up: false, down: false, left: false, right: false };
        this.image = new Image();
        this.image.src = 'assets/player-swim.png';
        this.facingDirection = 'right';
        this.isCollecting = false;
        this.imageLoaded = false;

        this.image.onload = () => {
            this.imageLoaded = true;
        };
    }

    handleKeyDown(event) {
        switch (event.key) {
            case 'ArrowUp':
            case 'w':
                this.direction.up = true;
                break;
            case 'ArrowDown':
            case 's':
                this.direction.down = true;
                break;
            case 'ArrowLeft':
            case 'a':
                this.direction.left = true;
                this.facingDirection = 'left';
                break;
            case 'ArrowRight':
            case 'd':
                this.direction.right = true;
                this.facingDirection = 'right';
                break;
            case ' ':
                this.isCollecting = true; // Press space to collect
                break;
        }
    }

    handleKeyUp(event) {
        switch (event.key) {
            case 'ArrowUp':
            case 'w':
                this.direction.up = false;
                break;
            case 'ArrowDown':
            case 's':
                this.direction.down = false;
                break;
            case 'ArrowLeft':
            case 'a':
                this.direction.left = false;
                break;
            case 'ArrowRight':
            case 'd':
                this.direction.right = false;
                break;
            case ' ':
                this.isCollecting = false;
                break;
        }
    }

    update() {
        if (this.direction.up && this.y > 0) {
            this.y -= this.speed;
        }
        if (this.direction.down && this.y + this.height < this.ctx.canvas.height) {
            this.y += this.speed;
        }
        if (this.direction.left && this.x > 0) {
            this.x -= this.speed;
        }
        if (this.direction.right && this.x + this.width < this.ctx.canvas.width) {
            this.x += this.speed;
        }
    }

    draw() {
        if (!this.imageLoaded) {
            return;
        }
        
        this.ctx.save();
        if (this.facingDirection === 'left') {
            this.ctx.translate(this.x + this.width, this.y);
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(this.image, -this.width, 0, this.width, this.height);
        } else {
            this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        this.ctx.restore();
    }

    // collidesWith(toy) {
    //     const dx = (this.x + this.width / 2) - toy.x;
    //     const dy = (this.y + this.height / 2) - toy.y;
    //     const distance = Math.sqrt(dx * dx + dy * dy);
    //     return distance < toy.radius + Math.min(this.width, this.height) / 2;
    // }

    collidesWith(toy) {
        return (
            this.x < toy.x + toy.radius &&
            this.x + this.width > toy.x &&
            this.y < toy.y + toy.radius &&
            this.y + this.height > toy.y
        );
    }    

    collect(toys) {
        if (this.isCollecting) {
            for (let toy of toys) {
                if (this.collidesWith(toy) && toy.state === 'staying') {
                    toy.state = 'collected';
                    toy.resetPosition();
                    return true; // Successfully collected a toy
                }
            }
        }
        return false;
    }
}
