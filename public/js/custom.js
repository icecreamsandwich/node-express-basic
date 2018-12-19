$(document).ready(function(){
    //edit button handler
    $(document).on('click','#edit_btn',function(){
        var userId = $(this).attr("data-id");
        alert("User id is :"+userId)
    });
    //close button handler
    $(document).on('click',"#close_btn",function(){
        var userId = $(this).attr("data-id");
        alert("User id is :"+userId)
    });
});