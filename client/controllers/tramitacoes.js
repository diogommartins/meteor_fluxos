/**
 * Created by diogomartins on 4/7/16.
 */
Template.tramitacoes.helpers({
    title: function(){
        return Documentos.findOne({ID_DOCUMENTO: this.id_documento}).NUM_PROCESSO;
    },
    items: function(){
        return Tramitacoes.find({ID_DOCUMENTO: this.id_documento});
    },
    isGraphRendered: function () {
        return this.isGraphRendered.get();
    },
    currentSequencia: function(){
        return this.currentSequencia.get();
    }
});

Template.tramitacoes.events({
    'click .play-animation': function(event, template){
        /** @type: Graph **/
        const graph = window.graph;
        const $btn = $(event.currentTarget).button('loading');

        graph.plugins.animation.playAnimation(1000, ()=>{
            $btn.button('reset');
        });
    },
    'click .stop-animation': function(event, template){
        /** @type: Graph **/
        const graph = window.graph;
        /** @type: GraphAnimation **/
        const animation = graph.plugins.animation;

        if (typeof animation !== "undefined")
            animation.stopAnimation();
        else{
            alert("Sem animação");
        }
    },
    'click .scroll-top': function(){
        $('ul.timeline > li').first().scrollintoview({ duration: "slow" });
    },
    'click .scroll-bottom': function(){
        $('ul.timeline > li').last().scrollintoview({ duration: "slow" })
    },
    'graph.didRender': function(event, template, graph){
        this.isGraphRendered.set(true);
        $('#graph-column').affix({
            offset: {
                top: 100
            }
        })
    },
    'graph.willAnimateElement': function(event, template, step, $elem){
        this.currentSequencia.set(step.SEQUENCIA);
        this.$slider.slider('value', step.SEQUENCIA);
        const timelineActiveItem = $('ul.timeline').find('li.active-item');
        timelineActiveItem.next().scrollintoview({ duration: "normal" });
        
    },
    'graph.didAnimateElement': function(event, template, step, $elem){
    },
    'graph.didFinishAnimation': function(event, template){
        console.log('didFinish');
    }
});

Template.tramitacoes.onCreated(function(){
    const id_documento = this.data.id_documento;
    var tramitacoes = this.data.tramitacoes = Tramitacoes.find({ ID_DOCUMENTO: id_documento });
    this.data.currentSequencia = new ReactiveVar(1);
    this.data.isGraphRendered = new ReactiveVar(false);
    
    Meteor.call('updateTramitacoes', id_documento, (error, id_tipo_doc) => {
        Meteor.call('getFluxo', id_tipo_doc, (error, elements) => {
            const graph = new Graph(id_tipo_doc).renderGraph();

            graph.cy.ready(function(){
                graph.registerPlugin('animation', new GraphAnimation(graph, tramitacoes.fetch()));
                const layout = graph.collection.fetch()[0].layout;
                graph.load(elements).applyStyle(layout);
            });
        });
    });
});


Template.tramitacoesSlider.events({
    'slider.userslide': function(event, template){
        const sequencia = event.ui.value;

        // Atualiza sequencia
        template.data.currentSequencia.set(sequencia);

        // Rola timeline
        const timelineItem = $('ul.timeline').find('li.active-item');
        timelineItem.scrollintoview({ duration: "fast" });

        // Marca item corrente no grafo e para animação, se houver
        /** @type: Graph **/
        const graph = window.graph;
        /** @type: GraphAnimation **/
        const animation = graph.plugins.animation;
        const tramitacao = animation.getStepFromSequencia(sequencia);

        const $elem = graph.cy.getElementById(tramitacao.elementId);

        animation.stopAnimation().clearHighlightedElements();
        GraphAnimation.highlightElement($elem);
    }
});

Template.tramitacoesSlider.onRendered(function(){
    this.data.$slider = $("#slider").slider({
        min: 1,
        max: Tramitacoes.find({ID_DOCUMENTO: this.data.id_documento}).count(),
        step: 1,
        value: 1,
        slide: function(event, ui){
            $(this).trigger($.Event('slider.userslide', {event:event, ui:ui}));
        }
    });
    $('[data-toggle="tooltip"]').tooltip({html: true});
});

Template.tramitacaoTimelineItem.helpers({
    cls: function(){
        return (this.SEQUENCIA % 2) ? '' : 'timeline-inverted';
    },
    dtDespacho: function(){
        const date = this.momentDespacho();
        return {
            relative: date.fromNow(),
            calendar: date.format("MMM DD hh:mm:ss")
        };
    },
    dtRecebimento: function() {
        const date = this.momentRecebimento();
        return {
            relative: date.fromNow(),
            calendar: date.format("MMM DD hh:mm:ss")
        }
    },
    dateDiff: function(){
        const diff = this.momentDiff();
        return moment.duration(diff).humanize();
    },
    active: function(){
        const parent = Template.parentData();
        return parent.currentSequencia.get() === this.SEQUENCIA;
    },
    passed: function(){
        const parent = Template.parentData();
        return parent.currentSequencia.get() > this.SEQUENCIA;
    }
});