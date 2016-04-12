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
        const graph = window.graph;
        const steps = template.data.tramitacoes.fetch();
        const $btn = $(event.currentTarget).button('loading');

        const animation = template.data.animation = new GraphAnimation(graph, steps);

        animation.playAnimation(1000, ()=>{
            $btn.button('reset');
            template.data.animation = null;
        });
    },
    'click .stop-animation': function(event, template){
        /** @type: GraphAnimation **/
        const animation = template.data.animation;
        if (animation)
            animation.stopAnimation();
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

        $('ul.timeline').find('li.active-item').next().scrollintoview({ duration: "normal" });
        
    },
    'graph.didAnimateElement': function(event, template, step, $elem){
    },
    'graph.didFinishAnimation': function(event, template){
        console.log('didFinish');
    }
});

Template.tramitacoes.onCreated(function(){
    const id_documento = this.data.id_documento;
    this.data.tramitacoes = Tramitacoes.find({ ID_DOCUMENTO: id_documento });
    this.data.currentSequencia = new ReactiveVar(1);
    this.data.isGraphRendered = new ReactiveVar(false);
    
    Meteor.call('updateTramitacoes', id_documento, (error, id_tipo_doc) => {
        Meteor.call('getFluxo', id_tipo_doc, (error, elements) => {
            const graph = new Graph(id_tipo_doc).renderGraph();

            graph.cy.ready(function(){
                const layout = graph.collection.fetch()[0].layout;
                graph.load(elements).applyStyle(layout);
            });
        });
    });
});


Template.tramitacoesSlider.events({
    'slider.userslide': function(event, template){
        template.data.currentSequencia.set(event.ui.value);
        $('ul.timeline').find('li.active-item').scrollintoview({ duration: "fast" });
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