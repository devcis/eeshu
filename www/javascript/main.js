
// to handle the click of search div
$(document).delegate('#id_register','click',function()
 {
 
     var username = $( "#txtUsername" ).val();
     var emailAddress = $( "#txtEmail" ).val();
     var confirmEmail = $( "#txtConEmail" ).val();
     var password = $( "#txtPassword" ).val();
     var cofirmpassword = $( "#txtConpassword" ).val();
     var pin = $( "#basic" ).val();
     
//     alert(username+"--"+emailAddress+"--"+confirmEmail+"--"+password+"--"+pin);
     
     if(username.length>0 && emailAddress.length>0 && confirmEmail.length >0 && password.length>0 && cofirmpassword.length > 0 && pin.length > 0 )
     {
         if(emailAddress !=confirmEmail)
         {
         
             customAlert("please enter correct email","Message","ok");
         
         }
         else if(password != cofirmpassword)
         {
             customAlert("please enter correct password","Message","ok");
         }
         else
         {
                     registerUser();
         }
     
     }
     else
     {
     customAlert("please fill all required field","Message","ok");
     
     }
 
 
 });




// register page setting
$(document).delegate('#id_login','click',function() 
{
   
     var username = $( "#txtLoginUserName" ).val();
     var password = $( "#txtLoginAPssword" ).val();
     var pin = $( "#txtLoginPin" ).val();
                  
     if(username.length>0 && password.length>0 && pin.length >0 )
     {
                     gotoLogin();
     }
     else
     {
         customAlert("please fill all required field","Message","ok");

     }
                     
                     
});

//show register page
$(document).delegate('#id_signup','click',function()
{
       
                     getToknenid("isRegister")
});

// contact us div show
$(document).delegate('#id_PinCheck','click',function()
{
                     
    checkPin();

});

$(document).delegate('#Menu_popup','click',function()
{
     //    showFamile();
                     
                   
});


$(document).delegate('#my_family','click',function()
{
                    
                     showFamile();
                    

});


// show activity log for phormacy actitivity

$(document).delegate('#ph_activity_log','click',function()
{
        show_Phormacy_Activity_log();
});
// show repeat order page with required info

$(document).delegate('#menu_repeat_order','click',function()
{
        showRepeatOrder();
});
// show repeat order page with required info

$(document).delegate('#menu_mc_activity_log','click',function()
{
    show_MC_Activity_log();
});

$(document).delegate('#menu_precription_order','click',function()
                     {
                     showPrecriptionOrder();
                     });

// show repeat order page with required info

$(document).delegate('#menu_id_notification','click',function()
{
    show_notification_log();
});



$(document).delegate('#menu_search_pharma','click',function()
                     {
//                     search_pharmacy();
                     search_city_region_pharma();
                     });


$(document).delegate('#menu_search_medical','click',function()
                     {
//                     search_medical();
                     search_city_region_medical_center();
                     });


/*request repeat prescript*/

$(document).delegate('#submit_precription_order','click',function()
{
                     submit_request_repeat_prescription();
                     
});


/*close prescription order specipic medican popup */
$(function(){
  $('#date_reminder').scroller({
                       preset: 'datetime',
                       theme: 'ios7'
                       
                       });
  //getCurrentDate();
  });

$(function(){
  $('#DOB_family_member').scroller({
                               preset: 'date',
                               dateFormat : "dd/mm/yy",
                               theme: 'ios7'
                               
                               });
  //getCurrentDate();
  });

$(document).delegate('#id_add_reminder','click',function()
{
        
         var end_actual_time    = $('#date_reminder').val();
         var start_actual_time = new Date();
         var end_actual_time = new Date(end_actual_time);
         
         var diff = end_actual_time-start_actual_time;
  

         var diffSeconds = diff/1000;
//         var HH = Math.floor(diffSeconds/3600);
//         var MM = Math.floor(diffSeconds%3600)/60;
         
         /*add notification as remincer*/
         var remindertext=$("#id_reminder_text").val();
                                      
         if(!localStorage.notificationId)
         {
                     localStorage.notificationId=0;
         }
      
        getTime(diffSeconds,remindertext);
      
});

function getTime(seconds,message) {
    var leftover=seconds;
    var days = Math.floor(leftover / 86400);
    
    //how many seconds are left
    leftover = leftover - (days * 86400);

    //how many full hours fits in the amount of leftover seconds
    var hours = Math.floor(leftover / 3600);
    
    //how many seconds are left
    leftover = leftover - (hours * 3600);

    //how many minutes fits in the amount of leftover seconds
    var minutes = leftover / 60;

    //how many seconds are left
    //leftover = leftover - (minutes * 60);
    notification.local_min(seconds,message);
//    notification.tomorrow(hours,minutes,days,message);

}



$(document).delegate('#id_show_add_family_member','click',function()
                     {
                     required_field_add_family();
                     });



$(document).delegate('#id_submit_search_medical','click',function()
                     {
                    
                     var name=$("#username_search_medical").val();
                     var subrub=$("#subrb_search_medical").val();
                     var search_criteria=$('#div_search_medical_auto input[data-type="search"]').val();
                     
                     if(name.length==0)
                     {
                     customAlert("Please fill name field","Message","ok");
                     }
                     else if(subrub.length==0)
                     {
                     customAlert("Please fill Subrub field","Message","ok");
                     }
                     else if(search_criteria.length==0)
                     {
                     customAlert("Please fill Seach Criteria field","Message","ok");
                     }
                     else
                     {
                      search_medical();
                     }

});

$(document).delegate('#id_submit_pharma_medical','click',function()
{
                     
                     var name=$("#username_search_pharmacy").val();
                     var subrub=$("#subrb_search_pharmacy").val();
                     var search_criteria=$('#div_search_paharmacy_auto input[data-type="search"]').val();
                 
                     if(name.length==0)
                     {
                            customAlert("Please fill name field","Message","ok");
                     }
                     else if(subrub.length==0)
                     {
                             customAlert("Please fill Subrub field","Message","ok");
                     }
                     else if(search_criteria.length==0)
                     {
                            customAlert("Please fill Seach Criteria field","Message","ok");
                     }
                     else
                     {
                            search_pharmacy();
                     }


});

