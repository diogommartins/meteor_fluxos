class CanvasSketcher{
    /**
     * 
     * @param canvasContainer: jQuery
     * @param color: String
     * @param lineWidth: Number
     */
    constructor(canvasContainer, color="black", lineWidth=2){
        this.canvasContainer = canvasContainer;
        
        this.$canvas = this._makeCanvas(); 
        this.canvas = this.$canvas[0];
        
        this.ctx = this.canvas.getContext("2d");
        this.color = color;
        this.lineWidth = lineWidth;

        this.previousPosition = this._emptyPosition();
        this.currentPosition = this._emptyPosition();
        /** @type Graph **/
        this.graph = undefined;
    }

    _makeCanvas(){
        const cyLayer = this.canvasContainer.children('canvas:first');
        let newCanvas = $('<canvas/>',{
            'class':'sketcher-canvas',
            id: 'sketcher-canvas'
        }).prop({
            width: cyLayer.width(),
            height: cyLayer.height()
        });
        this.canvasContainer.append(newCanvas);
        return newCanvas;
    }

    _emptyPosition(){
        return {x:undefined, y:undefined}
    }

    /**
     * 
     * @param position: {{x:Number, y:Number}}
     * @private
     */
    _updatePositions(position){
        this.previousPosition.x = this.currentPosition.x;
        this.previousPosition.y = this.currentPosition.y;

        this.currentPosition = this.graph.relativePosition(position);
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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    eventHandlers(){
        var self = this;
        return {
            'mousemove': function(event){
                if (event.originalEvent.shiftKey){
                    self._updatePositions(event.cyRenderedPosition);
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