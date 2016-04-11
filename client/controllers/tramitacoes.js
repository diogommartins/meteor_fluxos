/**
 * Created by diogomartins on 4/7/16.
 */
Session.setDefault('currentTramitacoes', []);

Template.tramitacoes.helpers({
    items: function(){
        return Tramitacoes.find({ID_DOCUMENTO: this.id_documento});
    },
    currentTramitacao: function(){
        const template = Template.instance();
        return Tramitacoes.findOne({
            ID_DOCUMENTO: this.id_documento,
            SEQUENCIA: template.data.currentSequencia.get()
        });
    },
    isGraphRendered: function () {
        return this.isGraphRendered.get();
    }
});

Template.tramitacoes.events({
    'click .play-animation': function(event, template){
        const graph = window.graph;
        const steps = template.data.tramitacoes.fetch();
        // var button = $(event.currentTarget).button('loading');
        graph.playAnimation(steps, 1000, () => {
            // $(event.currentTarget).button('reset');
        });
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
        
        $('.timeline').find('.primary').next().scrollintoview({ duration: "normal" });
        
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
        })
    });
});


Template.tramitacoesSlider.events({
    'userslide #slider': function(event, template){
        template.data.currentSequencia.set(event.ui.value);
    }
});

Template.tramitacoesSlider.onRendered(function(){
    this.data.$slider = $("#slider").slider({
        min: 1,
        max: Tramitacoes.find({ID_DOCUMENTO: this.data.id_documento}).count(),
        step: 1,
        value: 1,
        slide: function(event, ui){
            $(this).trigger($.Event('userslide', {event:event, ui:ui}));
        }
    });
    ;
});

Template.tramitacaoItem.helpers({
    active: function(){
        const parent = Template.parentData();
        return (parent.currentSequencia.get() === this.SEQUENCIA) ? 'active' : '';
    },
    recebido: function(){
        return (this.RECEBIDO.length > 0) ? this.RECEBIDO : '---';
    },
    description: function(){
        return this.DESPACHO;
    }
});



Template.tramitacaoTimelineItem.helpers({
    cls: function(){
        return (this.SEQUENCIA % 2) ? '' : 'timeline-inverted';
    },
    dtDespacho: function(){
        const date = moment(this.DT_DESPACHO + " " + this.HR_DESPACHO);
        return {
            relative: date.fromNow(),
            calendar: date.calendar()
        };
    },
    dtRecebimento: function(){
        const date = moment(this.DT_RECEBIMENTO + " " + this.HR_RECEBIMENTO);
        return {
            relative: date.fromNow(),
            calendar: date.calendar()
        };
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