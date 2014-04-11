var Block = cc.Sprite.extend({
    ctor: function( x1, y1, x2, y2 ) {
        this._super();
        this.initWithFile( 'res/images/ground.png', cc.rect( 0, 0, x2-x1, y2 - y1 ) );
        this.setAnchorPoint( cc.p( 0, 0 ) );
        this.setPosition( cc.p( x1, y1 ) );
    },

    getTopY: function() {
        return cc.rectGetMaxY( this.getBoundingBoxToWorld() );
    },

    hitTop: function( oldRect, newRect ) {
        var borderRect = this.getBoundingBoxToWorld();
        if ( cc.rectGetMinY( oldRect ) >= cc.rectGetMaxY( borderRect ) ) {
            var loweredNewRect = this.getLowerNewRect( newRect );
            var unionRect = cc.rectUnion( oldRect, loweredNewRect );
            return cc.rectIntersectsRect( unionRect, borderRect );
        }
        return false;
    },

    onTop: function( rect ) {
        var borderRect = this.getBoundingBoxToWorld();
        var borderMinX = cc.rectGetMinX( borderRect );
        var borderMaxX = cc.rectGetMaxX( borderRect );
        var minX = cc.rectGetMinX( rect );
        var maxX = cc.rectGetMaxX( rect );
        return ( minX <= borderMaxX ) && ( borderMinX <= maxX );
    },

    getLowerNewRect: function( newRect ) {
         return cc.rect( newRect.x, newRect.y - 1, newRect.width, newRect.height + 1 );
    }
});

