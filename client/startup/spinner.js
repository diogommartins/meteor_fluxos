/**
 * Created by diogomartins on 4/11/16.
 */
Meteor.Spinner.options = {
    lines: 17 // The number of lines to draw
    , length: 30 // The length of each line
    , width: 2 // The line thickness
    , radius: 12 // The radius of the inner circle
    , scale: 3 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: '#337ab7' // #rgb or #rrggbb or array of colors
    , opacity: 0.05 // Opacity of the lines
    , rotate: 0 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 1 // Rounds per second
    , trail: 60 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '50%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: true // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    , position: 'relative'
};