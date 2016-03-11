/**
 * Created by diogomartins on 3/10/16.
 */

class CircularMenu{
    constructor(wrapper){
        this.open = false;
        this.button = undefined;
        this.wrapper = undefined;
        this.x = 0;
        this.y = 0;
    }

    show(event, element, position){
        this.x = position.x;
        this.y = position.y;

        if(!this.open){
            this.innerHTML = "Close";
            //classie.add(this.wrapper, 'opened-nav');
        }
        else{
            this.innerHTML = "Menu";
            //classie.remove(this.wrapper, 'opened-nav');
        }
        this.open = !this.open;
    }
}

this.CircularMenu = CircularMenu;