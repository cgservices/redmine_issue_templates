/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function checkExpand(ch) {
    var obj=document.all && document.all(ch) || document.getElementById && document.getElementById(ch);
    if(obj && obj.style) obj.style.display=
    "none" == obj.style.display ?"" : "none"
}

// Change Location of pulldown.
$(document).ready(function() {
    $('#template_area').insertBefore($('#issue_subject').parent());
});

var previous_description = "";
// TODO: When update description, confirmation dialog should be appeared.
function load_template(target_url, token, confirm_msg) {
    var allow_overwrite = $('#allow_overwrite_description').prop('checked');
    if ($("#issue_template").val() != "") {
        $.ajax({
            url:target_url,
            async:true,
            type:'post',
            data:$.param({issue_template:$("#issue_template").val(), authenticity_token:token})
        }).done(function (html) {

            if ($('#issue_subject').val() !== '' ) {
                return;
            }

            eval('var template = ' + html);

            if ($('#issue_description').val() == previous_description)  {
                $("#issue_description").val(template.issue_template.description);
                previous_description = $('#issue_description').val();
            } else {
                $("#issue_description").val(template.issue_template.description + "\n" + $("#issue_description").val() );
            }

            $("#issue_subject").val(template.issue_template.issue_title);
            try {
                if (CKEDITOR.instances.issue_description)
                    CKEDITOR.instances.issue_description.setData(template.issue_template.description);
            } catch(e) {
                // do nothing.
            }
        });
    }
}

function set_pulldown(tracker, target_url, token) {
    var allow_overwrite = $('#allow_overwrite_description').prop('checked');
    $.ajax({
        url: target_url,
        async: true,
        type: 'post',
        data: $.param({issue_tracker_id: tracker, authenticity_token: token})
    }).done(function( html ) {
        $('#issue_template').html(html);
        $('#allow_overwrite_description').attr("checked", allow_overwrite);
    });
}

(function($) {
    $.fn.flash_message = function(options) {
        // default
        options = $.extend({
            text: 'Done',
            time: 2000,
            how: 'before',
            class_name: ''
        }, options);

        return $(this).each(function() {
            if ($(this).parent().find('.flash_message').get(0)) return;

             var message = $('<div />', {
                'class': 'flash_message ' + options.class_name,
                text: options.text
                // display with fade in
            }).hide().fadeIn('fast');

            $(this)[options.how](message);
            //delay and fadeout
            message.delay(options.time).fadeOut('normal', function() {
                $(this).remove();
            });

        });
    };
})(jQuery);