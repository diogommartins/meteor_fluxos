class CanvasSketcher{
    /**
     * 
     * @param $canvas: jQuery
     * @param color: String
     * @param lineWidth: Number
     */
    constructor($canvas, color="black", lineWidth=2){
        this.$canvas = $canvas;
        this.canvas = this.$canvas[0];
        
        
        this.ctx = this.canvas.getContext("2d");
        this.color = color;
        this.lineWidth = lineWidth;

        this.canvasWidth = this.canvas.width;
        this.canvasheight = this.canvas.height;

        this._isInitialDot = true;

        this.previousPosition = this._emptyPosition();
        this.currentPosition = this._emptyPosition();
        /** @type Graph **/
        this.graph = undefined;
    }

    _emptyPosition(){
        return {x:undefined, y:undefined}
    }

    /**
     * 
     * @param event: MouseEvent
     * @private
     */
    _updatePositions(event){
        this.previousPosition.x = this.currentPosition.x;
        this.previousPosition.y = this.currentPosition.y;

        this.currentPosition = this.graph.relativePosition(event.cyRenderedPosition);
    }

    drawToContext() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.previousPosition.x, this.previousPosition.y);
        this.ctx.lineTo(this.currentPosition.x, this.currentPosition.y);
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.stroke();
        this.ctx.closePath();
    }

    _makeDot(){
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.currentPosition.x, this.currentPosition.y, this.lineWidth, this.lineWidth);
        this.ctx.closePath();
    }

    clearContextArea(){
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasheight);
    }

    registerEventHandlers(){
        this.$canvas.on(this.eventHandlers());
        return this;
    }

    eventHandlers(){
        var self = this;
        return {
            'mousemove': function(event){
                if (event.originalEvent.shiftKey){
                    self._updatePositions(event);
                    self.drawToContext()
                } else if(typeof self.currentPosition.x !== 'undefined'){
                    self.currentPosition = self._emptyPosition();
                }
            },
            'mouseup': function(event){
                if (event.originalEvent.shiftKey) {
                    self._updatePositions(event);
                    self._makeDot();
                }
            }
        }
    }
}

this.CanvasSketcher = CanvasSketcher;