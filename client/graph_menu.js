/**
 * Created by diogomartins on 3/10/16.
 */

class CircularMenu{
    constructor(element){
        this.element = element;
        this.wrapper = $(this.element).find('.cn-wrapper');
        this.position = {x:0, y:0};
        // Container deve ser quadrado, logo: largura==altura==diametro do menu
        this.diameter = $(this.wrapper).width();
        this.currentEdge = undefined;
    }

    isOpen(){
        return $(this.wrapper).hasClass('opened-nav');
    }

    show(event, fluxo, position){
        this.position = position;

        this.updatePosition();

        if(!this.isOpen()){
            //this.innerHTML = "Close";
            $(this.wrapper).addClass('opened-nav');
        }
    }

    hide(){
        $(this.wrapper).removeClass('opened-nav');
    }

    resize(factor){
        const newDiameter = this.diameter * factor;
        $(this.wrapper).width(newDiameter);
        $(this.wrapper).height(newDiameter);
    }

    updatePosition(x=this.position.x, y=this.position.y){
        $(this.wrapper).css({left: x, top: y, position:'absolute', 'z-index': 9999});
    }
}

this.CircularMenu = CircularMenu;