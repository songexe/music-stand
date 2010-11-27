(function() {
    var Control = window.Control = {
        updateControl: function() {
            if (edit) {
                var color = (mode ? 'blue' : 'red');
                var perindex = (mode ? 1 : 0);
                var grpindex = (mode ? 0 : 1);
                
                $('#control').css('background-color', color);
                
                $('#group').css('z-index', grpindex);
                $('#personal').css('z-index', perindex);
                
                $('#control').removeClass('hidden');
            } else {
                $('#control').addClass('hidden');
            }
        },

        resetMode: function() {
            mode = true;
            Control.updateControl();

        },

        toggleMode: function() {
            mode = !mode;
            Control.updateControl();
        },

        init: function() {
            $('#control').click(function () {
                Control.toggleMode();
            });

            Control.updateControl();
        }
    };
})();

$(document).ready(function () {
    Control.init();
});
