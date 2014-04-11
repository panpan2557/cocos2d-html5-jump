var Jumper = cc.Sprite.extend({
    ctor: function( x, y ) {
        this._super();
        this.initWithFile( 'res/images/jumper.png' );
        this.setAnchorPoint( cc.p( 0.5, 0 ) );
        this.x = x;
        this.y = y;
        
        this.vx = 0;
        this.vy = 0;

        this.moveLeft = false;
        this.moveRight = false;
        this.jump = false;

        this.ground = null;

        this.blocks = [];

        this.updateSpritePosition();
    },

    updateSpritePosition: function() {
        this.setPosition( cc.p( Math.round( this.x ), Math.round( this.y ) ) );
    },

    getPlayerRect: function() {
        var spriteRect = this.getBoundingBoxToWorld();
        var spritePos = this.getPosition();

        var dX = this.x - spritePos.x;
        var dY = this.y - spritePos.y;
        return cc.rect( spriteRect.x + dX,
                        spriteRect.y + dY,
                        spriteRect.width,
                        spriteRect.height );
    },
    
    update: function() {
        var currentPositionRect = this.getPlayerRect();

        this.updateYMovement();
        this.updateXMovement();

        var newPositionRect = this.getPlayerRect();
        this.handleCollision( currentPositionRect,
                              newPositionRect );

        this.updateSpritePosition();
    },

    updateXMovement: function() {
        if ( this.ground ) {
            if ( this.isNotPressKey() ) {
                this.autoDeaccelerateX();
            } else if ( this.moveRight ) {
                this.accelerateX( Jumper.ACC );
            } else {
                this.accelerateX( -Jumper.ACC );
            }
        }
        this.x += this.vx;
        if ( this.x < 0 ) {
            this.x += screenWidth;
        }
        if ( this.x > screenWidth ) {
            this.x -= screenWidth;
        }
    },

    updateYMovement: function() {
        if ( this.ground ) {
            this.vy = 0;
            if ( this.jump ) {
                this.vy = Jumper.JUMP_V;
                this.y = this.ground.getTopY() + this.vy;
                this.ground = null;
            }
        } else {
            this.vy += Jumper.G;
            this.y += this.vy;
        }
    },

    isNotPressKey: function() {
        return ( !this.moveLeft ) && ( !this.moveRight );
    },

    isSameDirection: function( dir ) {
        return ( ( ( this.vx >=0 ) && ( dir >= 0 ) ) ||
                 ( ( this.vx <= 0 ) && ( dir <= 0 ) ) );
    },

    accelerateX: function( dir ) {
        if ( this.isSameDirection( dir ) ) {
            this.vx += dir * Jumper.ACC_X;
            if ( this.vxIsHigherThanMaxV() ) {
                this.vx = dir * Jumper.MAX_VX;
            }
        } else {
            if ( this.vxIsHigherThanBackVx() ) {
                this.vx += dir * Jumper.BACK_ACC_X;
            } else {
                this.vx = 0;
            }
        }
    },

    vxIsHigherThanMaxV: function() {
        return Math.abs( this.vx ) > Jumper.MAX_VX;
    },

    vxIsHigherThanBackVx: function() {
        return Math.abs( this.vx ) >= Jumper.BACK_ACC_X;
    },
    
    autoDeaccelerateX: function() {
        if ( Math.abs( this.vx ) < Jumper.ACC_X ) {
            this.vx = 0;
        } else if ( this.vx > 0 ) {
            this.vx -= Jumper.ACC_X;
        } else {
            this.vx += Jumper.ACC_X;
        }
    },

    handleCollision: function( oldRect, newRect ) {
        if ( this.ground ) {
            if ( !this.ground.onTop( newRect ) ) {
                this.ground = null;
            }
        } else {
            if ( this.vy <= 0 ) {
                var topBlock = this.findTopBlock( this.blocks, oldRect, newRect );
                if ( topBlock ) {
                    this.ground = topBlock;
                    this.y = topBlock.getTopY();
                    this.vy = 0;
                }
            }
        }
    },
    
    findTopBlock: function( blocks, oldRect, newRect ) {
        var topBlock = null;
        var topBlockY = -1;
        
        blocks.forEach( function( b ) {
            if ( b.hitTop( oldRect, newRect ) ) {
                if ( b.getTopY() > topBlockY ) {
                    topBlockY = b.getTopY();
                    topBlock = b;
                }
            }
        }, this );
        
        return topBlock;
    },
    
    handleKeyDown: function( e ) {
        if ( Jumper.KEYMAP[ e ] != undefined ) {
            this[ Jumper.KEYMAP[ e ] ] = true;
        }
    },

    handleKeyUp: function( e ) {
        if ( Jumper.KEYMAP[ e ] != undefined ) {
            this[ Jumper.KEYMAP[ e ] ] = false;
        }
    },

    setBlocks: function( blocks ) {
        this.blocks = blocks;
    }
});

Jumper.ACC = 1;
Jumper.G = -1;
Jumper.JUMP_V = 20;
Jumper.BACK_ACC_X = 0.5;
Jumper.ACC_X = 0.25;
Jumper.MAX_VX = 8;
Jumper.KEYMAP = {}
Jumper.KEYMAP[cc.KEY.left] = 'moveLeft';
Jumper.KEYMAP[cc.KEY.right] = 'moveRight';
Jumper.KEYMAP[cc.KEY.up] = 'jump';
        
