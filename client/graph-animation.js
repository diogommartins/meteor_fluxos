/**
 * Created by diogomartins on 4/12/16.
 */
class GraphAnimation{
    /**
     *
     * @param graph: Graph
     * @param steps: Array
     */
    constructor(graph, steps){
        this.graph = graph;
        this.steps = steps;

        this.$graphContainer = $(this.graph.container);

        this.__shouldAnimate = false;
    }

    clearHighlightedElements(){
        this.graph.cy.elements().removeClass('highlighted walkedby');
        return this;
    }

    /**
     * Dado um número de sequência, o método retorna o document Tramitacoes correspondente se estiver
     * na lista de steps da animaçào
     *
     * @param sequencia: Number
     * @returns {Tramitacoes}
     */
    getStepFromSequencia(sequencia){
        for(let step of this.steps){
            if (step.SEQUENCIA === sequencia)
                return step;
        }
    }

    stopAnimation(){
        this.$graphContainer.trigger('graph.willStopAnimation');
        this.__shouldAnimate = false;
        return this;
    }
    /**
     *
     * @param interval: Number
     * @param callback: function
     */
    playAnimation(interval=1000, callback){
        var i = 0;

        this.clearHighlightedElements();

        var animateElement = ($previousElement) => {
            if (( i < this.steps.length) && (this.__shouldAnimate)){
                const step = this.steps[i];
                let $elem = this.graph.cy.getElementById(step.elementId);

                this.$graphContainer.trigger('graph.willAnimateElement', [step, $elem]);

                if ((typeof $previousElement !== 'undefined') && ($previousElement.id() !== $elem.id())){
                    GraphAnimation.markElementAsWalked($previousElement);
                }
                GraphAnimation.highlightElement($elem);
                this.$graphContainer.trigger('graph.didAnimateElement', [step, $elem]);

                i++;
                setTimeout(()=>{ animateElement($elem) }, interval);
            }
            else{
                this.$graphContainer.trigger('graph.didFinishAnimation');
                callback();
            }
        };
        this.__shouldAnimate = true;
        animateElement();
    }

    static highlightElement($elem){
        $elem.removeClass('walkedby');
        $elem.addClass('highlighted');
    }
    static markElementAsWalked($elem) {
        $elem.removeClass('highlighted');
        $elem.addClass('walkedby');
    }
}

this.GraphAnimation = GraphAnimation;