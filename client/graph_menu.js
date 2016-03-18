/**
 * Created by diogomartins on 3/10/16.
 */

class CircularMenu{
    constructor(element){
        this.element = element;
        this.wrapper = $(this.element).find('.cn-wrapper')[0];
        this.position = {x:0, y:0};
        // Container deve ser quadrado, logo: largura==altura==diametro do menu
        this.diameter = $(this.wrapper).width();
        this.currentItem = undefined;
        this.z = 9999;
    }

    isOpen(){
        return $(this.wrapper).hasClass('opened-nav');
    }

    show(event, item, position){
        this.position = position;
        this.currentItem = item;

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

    updatePosition(position=this.position){
        $(this.wrapper).css({
            left: position.x,
            top: position.y,
            position:'absolute',
            'z-index': this.z
        });
    }
}

this.CircularMenu = CircularMenu;