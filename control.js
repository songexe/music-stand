$(document).ready(function () {
    function updateControl() {
        var color = (mode ? 'blue' : 'red');
        var txt = (mode ? 'Personal' : 'Group');
        var perindex = (mode ? 1 : 0);
        var grpindex = (mode ? 0 : 1);
        
        $('#control').css('background-color', color);
        $('#control').text(txt);
        
        group.style.zIndex = grpindex;
        personal.style.zIndex = perindex;    
    }

    // reset the mode back to 'personal', the default
    function resetMode() {
        mode = true;
        updateControl();
    }

    function toggleMode() {
        mode = !mode;
        updateControl();
    }

    $('#control').click(function () {
        toggleMode();
    });

    updateControl();
});
