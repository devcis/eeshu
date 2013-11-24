
var logininfo;
var listFamilyMember;
var listOrdRepBecause;
var list_pharmacy_info;
var pharmacyAuto_searchText;
var medicalAuto_searchText;
var nid_medical_search_list;
var nid_phahrmacy_search_list;
var is_edit;
var is_edit_nid;

/*store object in local storage*/
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

// Cordova is loaded and it is now safe to make calls Cordova methods
function onDeviceReady() {
//    alert("hgf");
    $.mobile.hidePageLoadingMsg();
    var networkState = navigator.connection.type;
	
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';
    
	if ( states[networkState] == 'Unknown connection' || states[networkState] == 'No network connection' )
    {
    	alert( 'Connection Error: ' + states[networkState] );
    }
    else
    {
//        getToknenid();
        checkMemberId()
    }
}

/*check member id is already exists*/
function checkMemberId()
{
    
//    alert(localStorage.uid +"--"+ localStorage.pinValue);
    if(localStorage.uid && localStorage.pinValue)
    {
            $.mobile.changePage('#id_PinEnter');
       
    }
    else
    {
        $.mobile.changePage('#id_login_page');
    }
    
}

function getToknenid(isRegister)
{
      $.mobile.showPageLoadingMsg();
    $.ajax({
           url:'http://www.repeatorderingsystem.co.nz/services/session/token',
           success: function(result) {
           
//           alert(result);
           
           $.mobile.hidePageLoadingMsg();
           localStorage.deviceToken=result;
            console.log(localStorage.deviceToken);
           $.mobile.hidePageLoadingMsg();
           if(isRegister.length==0)
           {
            getFamily();
           }
           else
           {
           $.mobile.changePage('#id_register_page');
           }
           
           },
           error: function(result) {
           
           customAlert(result.responseText,"ROS Alert!","ok");
           $.mobile.hidePageLoadingMsg();
           for(var i in result)
           console.log(i +"----"+result[i]);
           }
           });

}

var responceRegister=JSON.stringify({"uid":"107","uri":"http://www.repeatorderingsystem.co.nz/rest/user/107"});

function registerUser()
{

    var username = $( "#txtUsername" ).val();
    var emailAddress = $( "#txtEmail" ).val();
    var password = $( "#txtPassword" ).val();
    var pin = $( "#basic" ).val();
    
    
    var data="{'name':'"+username+"','pass':'"+password+"',  'mail':'"+emailAddress+"','user_roles':5,'field_login_pin_value':{'und':[{'value':'"+pin+"'}]} }";
    var jsonData = JSON.stringify(eval("(" + data + ")"));
    
    
    $.mobile.showPageLoadingMsg();
    $.ajax({
           type:"POST",
           beforeSend: function (request)
           {
           request.setRequestHeader("X-CSRF-Token",localStorage.deviceToken);
           request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
           },
           url: "http://www.repeatorderingsystem.co.nz/rest/user/register.json",
           data:jsonData,
           dataType: 'json',
           processData: false,
           success: function(result) {
           $.mobile.hidePageLoadingMsg();
           
           customAlert("registraion success","ROS Alert!","ok");
           
           /*parsing registraion data*/
           //               var parseData =JSON.parse(msg);
           /*store object to local storage for future use*/
           localStorage.uid=result['uid'];
           localStorage.uri=result['uri'];
           localStorage.pinValue=pin;
           load_menu_page_info();
 
           
           for(var i in result)
           console.log(i +"----"+result[i]);
           },
           error: function(msg) {
             customAlert(msg.responseText,"ROS Alert!","ok");
           
           }
           });
    
}

function load_menu_page_info()
{
    /*load profile information*/
     $.mobile.changePage('#id_menuPage');
    var infoObj=localStorage.getObj("logininfo");
    
    if(infoObj)
    {
        $("#lbl_firstname_menupage").text(infoObj['user']['name']);
    }
 
//    for(var key in listFamilyMember)
//    {
//        if(localStorage.uid==listFamilyMember['nid'])
//        {
//            alert(listFamilyMember[key]);
//            
//        }
//    }
    
    
}


function gotoLogin()
{
    var username = $( "#txtLoginUserName" ).val();
    var password = $( "#txtLoginAPssword" ).val();
    var pin = $( "#txtLoginPin" ).val();
    
    var data="{'username':'"+username+"','password':'"+password+"'}";
    var jsonData = JSON.stringify(eval("(" + data + ")"));
    
    $.mobile.showPageLoadingMsg();


    $.ajax({
           type:"POST",
           beforeSend: function (request)
           {
           request.setRequestHeader("X-CSRF-Token",localStorage.deviceToken);
           request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
           },
           url: "http://www.repeatorderingsystem.co.nz/rest/user/login.json ",
           data:jsonData,
           dataType: 'json',
           processData: false,
           success: function(result) {
          
           $.mobile.hidePageLoadingMsg();
           logininfo=result;
           localStorage.setObj("logininfo", logininfo);
            /*store object to local storage for future use*/
           localStorage.pinValue=pin;
           localStorage.uid=result.user.uid;
           localStorage.name = result.user.name;

           
            getToknenid("");
           
           
           for(var i in result)
           console.log(i +"----"+result[i]);
           },
           error: function(msg) {
            customAlert(result.responseText,"ROS Alert!","ok");
           $.mobile.hidePageLoadingMsg();

           }
           });
}

function checkPin()
{
    var pinValue = $( "#txtPin" ).val();

    if(pinValue.length >0 )
    {
        
        if(localStorage.pinValue == pinValue)
        {
            getToknenid("");
           
        }
        else
        {
            customAlert("Invalid Pin, please enter correct pin.","ROS Alert!","ok")
        }
    }
    else
    {
        customAlert("please enter value","ROS Alert!","ok");
    }
}

function getFamily(){
 
    loading('show');
    $.ajax({
           url: 'http://repeatorderingsystem.co.nz/rest/fm_list.json/?user_head_uid='+localStorage.uid,
           type: 'get',
           dataType: 'json',
           async: false,
           success: function(result)
           {
           loading('hide');
           listFamilyMember=result;
            load_menu_page_info();
           },
           error: function(result)
           {
           loading('hide');
           customAlert(result.responseText,"ROS Alert!","ok");
           
           
           }
           });
     load_menu_page_info();
}

function customAlert(message,title,btnTitle)
{
    navigator.notification.alert(message, tempCallback, title, btnTitle)
    
}

function tempCallback()
{
    
}

window.onload = function()
{
    //	document.addEventListener("deviceready", onDeviceReady, false);
};

/*fucntion show family of user*/
function showFamile()
{
    document.getElementById('id_familyInfo').innerHTML = '';
    $.mobile.changePage('#id_family_page', { transition: "slide", changeHash: false });
    $('body').addClass('ui-loading');
    setTimeout(function()
    {
        $.ajax({
               url: 'http://repeatorderingsystem.co.nz/rest/fm_list.json/?user_head_uid='+localStorage.uid,
               type: 'get',
               dataType: 'json',
               async: false,
               success: function(result)
               {
                    $('body').removeClass('ui-loading');
                   listFamilyMember=result;
                   if(result.length>0)
                   {
                       for(var i=0;i<result.length;i++)
                       {
                           var content = "<div data-role='collapsible' id='set" + i + "'>";
                               content+="<h3>"+result[i].Firstname+"</h3>";
                               content+="<p>Name: "+result[i].Firstname+' '+result[i].Middlename+' '+result[i].Lastname+"</p>";
                               content+="<p>DOB: "+result[i].Dateofbirth+"</p>";
                               content+="<p>Ph: "+result[i].Phoneno+"</p>";
                               content+="<p>Relation: "+result[i].Relations;
                               content+="<a data-role='button' onclick=\"required_field_add_family('"+result[i].nid+"')\"  data-icon='edit' data-theme='a'  data-iconpos='left' data-mini='true' data-inline='true'>Edit</a></p>";
                               content+="</div>";
               
               
                           $("#id_familyInfo").append( content ).collapsibleset('refresh');
                           $("#id_familyInfo").trigger('create');
                       }
                   }
                   else
                   {
                         $("#id_familyInfo").append("<div style=\"text-align:center\" data-role='list-divider'><h3>Family Member Not Found</h3></div>").collapsibleset('refresh');
                   }
               },
               error: function(result)
               {
                   $.mobile.hidePageLoadingMsg();
                   customAlert(result.responseText,"ROS Alert!","ok");
                   /*parsing for family perameter*/
               }
               });
      }, 1000);
    
    
}


/*manage repeat order page funcationality*/
function showRepeatOrder()
{
    $.mobile.showPageLoadingMsg();
    $.mobile.changePage('#id_repeat_medi_order', { transition: "slide", changeHash: false });
    document.getElementById('select-place_order').innerHTML = '';
    
    /*fill the list of family mambers */
    for(var i=0;i<listFamilyMember.length;i++)
    {
        var html = '';
        html+='<option value="'+listFamilyMember[i].Firstname+'" id_atr="'+listFamilyMember[i].nid+'">'+listFamilyMember[i].Firstname+' '+listFamilyMember[i].Middlename+' '+listFamilyMember[i].Lastname+'</option>';
        $("#select-place_order").append( html );
        
    }
    $('#select-place_order').attr('selected', true);
    $('#select-place_order').selectmenu("refresh");
    
    /*
     call formacy functionality as per provided doc
     */
    pharmacy_list("pharmacyAuto","div_pharmacyAuto");
    /*
     cal servcie to fill the ordering repeats because
     pass vid to get the list by default use 3
     */
    
}

function showPrecriptionOrder(){
    $.mobile.showPageLoadingMsg();
    
    $.mobile.changePage('#id_precription_order', { transition: "slide", changeHash: false });
    document.getElementById('div_specific_medicne').innerHTML = '';
    document.getElementById('family_select-place_order').innerHTML = '';
    
    /*fill the list of family mambers */
    
    if(listFamilyMember){
        for(var i=0;i<listFamilyMember.length;i++)
        {
            var html = '';
            html+='<option value="'+listFamilyMember[i].Firstname+'" id_atr="'+listFamilyMember[i].nid+'">'+listFamilyMember[i].Firstname+' '+listFamilyMember[i].Middlename+' '+listFamilyMember[i].Lastname+'</option>';
            $("#family_select-place_order").append( html );
        }
        $('#family_select-place_order').attr('selected', true);
        $('#family_select-place_order').selectmenu("refresh");
    }
    
    /*
     call formacy functionality as per provided doc
     */
    medical_list("medicalAuto","div_medicalAuto");
    /*
     cal servcie to fill the ordering repeats because
     pass vid to get the list by default use 3
     */
}


/*store lsit of pharmacy to show search result*/
function medical_list(id1,id2)
{
  
    var id_autosearch_ui="#"+id1;
    var id_autosearch_div="#"+id2;

    $.mobile.showPageLoadingMsg();
    $.ajax({
           url:'http://www.repeatorderingsystem.co.nz/rest/registered_mc.json',
           success: function(result) {
           $.mobile.hidePageLoadingMsg();
           list_pharmacy_info=result;
//           var res = eval("(" + result + ")");
           for(var index in result){
//           medicalList.push(res[index]);
           $(id_autosearch_ui).append("<li class=\"ui-screen-hidden\" onclick=\"fill_medical_list('"+id_autosearch_div+"','"+result[index].node_title+"','"+result[index].nid+"')\" ><a>"+result[index].node_title+"</a></li>");
           }
           $(id_autosearch_ui).listview('refresh');

           var vid="9";
           ordering_repeats_because(vid);
           /*create dinamic readio button  to show oder prepeat because option*/
           },
           error: function(result) {
            customAlert(result.responseText,"ROS Alert!","ok");
           $.mobile.hidePageLoadingMsg();
           for(var index in result)
           console.log(index +"----"+result[index]);
           }
           });
}
function fill_medical_list(id,value,id_atr)
{
    
    nid_medical_search_list=id_atr;
    $(''+id+' input[data-type="search"]').val(value);
    medicalAuto_searchText=value;
}

function fill_Search_Pharmacy(id,value,id_atr)
{
    
    $(''+id+' input[data-type="search"]').val(value);
   
    pharmacyAuto_searchText=value;
    nid_phahrmacy_search_list=id_atr;

}
var pharmacyList = [];
var medicalList = [];
/*store lsit of pharmacy to show search result*/
function pharmacy_list(id1,id2)
{
    var id_autosearch_ui="#"+id1;
    var id_autosearch_div="#"+id2;
      $.mobile.showPageLoadingMsg();
    $.ajax({
           url:'http://www.repeatorderingsystem.co.nz/rest/registered_pharmacy.json',
           success: function(result) {
           //               alert("success--"+result.length);
           $.mobile.hidePageLoadingMsg();
           list_pharmacy_info=result;
           var res = result;
           for(index in res){
           //               alert("----"+res[index].node_title);
//           pharmacyList.push(res[index]);
         
           $(id_autosearch_ui).append("<li class=\"ui-screen-hidden\"><a onclick=\"fill_Search_Pharmacy('"+id_autosearch_div+"','"+result[index].node_title+"','"+result[index].nid+"')\">"+res[index].node_title+"</a></li>");
           }
           
//       
           $(id_autosearch_ui).listview('refresh');
           var vid="3";
           ordering_repeats_because(vid);
           /*create dinamic readio button  to show oder prepeat because option*/
           },
           error: function(result) {
            customAlert(result.responseText,"ROS Alert!","ok");
           $.mobile.hidePageLoadingMsg();
           for(var index in result)
           console.log(index +"----"+result[index]);
           }
           });
}


function submit_repeat_medical(){
    
    var infoObj=localStorage.getObj("logininfo");

    var familySelectplaceOrderUserName = infoObj['user']['name'];
    var familySelectplaceOrderUserId = $("#select-place_order").find(":selected").attr("id_atr");
    
    var radiopharmacyName=$("#pharmacyAuto").val();
    var radiopharmacyId=nid_phahrmacy_search_list;
    var radioPickup1 = $("#radio_order_repeat :radio:checked").attr("id_atr");
    var radioPickup2 = $("#radio_order_type :radio:checked").attr("id_atr");
    
    
  
    var arraypharmacy=[];
    if(radioPickup2 == 123)
    {
        $('#parmecy_list_container input').each(function() {
                                                var type = $(this).attr("type");
                                                if (type == "text") {
                                                var objpharmacy=new Object();
                                                objpharmacy.value=$(this).val();
                                                arraypharmacy.push(objpharmacy);
                                                }
                                                
                                                })
    }
    var jsonmpharmacy = JSON.stringify(arraypharmacy);
 
    
     var data2="{'name':'"+familySelectplaceOrderUserName+"','type':'repeat_order','field_ro_order_type':{'und':["+radioPickup2+"]},'field_ro_repeat_order_exemption':{'und':["+radioPickup1+"]},'field_ro_specific_repeat_order':{'und':"+jsonmpharmacy+"},'field_ro_pharmacy':{'und':[{'nid':'[nid:"+radiopharmacyId+"]' }] },'field_ro_select_order_for':{'und':["+familySelectplaceOrderUserId+"]}}";
      
    
    var jsonData = JSON.stringify(eval("(" + data2 + ")"));
    console.log(jsonData);
    $.mobile.showPageLoadingMsg();
    $.ajax({
           type:"POST",
           beforeSend: function (request)
           {
           request.setRequestHeader("X-CSRF-Token",localStorage.deviceToken);
           request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
           },
           url: "http://www.repeatorderingsystem.co.nz/rest/node.json ",
           data:jsonData,
           dataType: 'json',
           processData: false,
           success: function(result) {
           $.mobile.hidePageLoadingMsg();
           customAlert("order success fully submitted","ROS Alert!","ok");
           show_MC_Activity_log();
           
           },
           error: function(msg) {
           for(var i in msg)
           console.log(i +"----"+msg[i]);
             $.mobile.hidePageLoadingMsg();
             customAlert(msg.statusText,"ROS Error !","ok");
           }
           });
}

function submit_request_repeat_prescription()
{
     console.log(localStorage.deviceToken);
    var infoObj=localStorage.getObj("logininfo");
    var familySelectplaceOrderUserName = infoObj['user']['name'];
    var familySelectplaceOrderUserId = $("#family_select-place_order").find(":selected").attr("id_atr");
    familySelectplaceOrderUserName=$.trim(familySelectplaceOrderUserName);
    var medicalName=$("#medicalAuto").val();
    var radioMedicalId=nid_medical_search_list;
    var radioPickup1 = $("#radio_medicine_type :radio:checked").attr("id_atr");
    var radioPickup2 = $("#radio_pickup_repeat :radio:checked").attr("id_atr");
   
    
    
  
    var arraymedicne=[];
    
    if(radioPickup1 == 217)
    {
        $('#medicne_list_contsiner input').each(function() {
                                                var type = $(this).attr("type");
                                                if (type == "text") {
                                                var objMedcine=new Object();
                                                objMedcine.value=$(this).val();
                                                arraymedicne.push(objMedcine);
                                                }
                                                
                                                })
    }
    var jsonmedicne = JSON.stringify(arraymedicne);
    
    var data2= "{'name':'"+familySelectplaceOrderUserName+"','type':'repeat_prescription','field_rp_order_type':{'und':["+radioPickup1+"]},'field_rp_pick_up_yourself':{'und':["+radioPickup2+"]},'field_rp_repeat_prescription':{'und':"+jsonmedicne+"},'field_rp_doctor':{'und':['1' ] },'field_rp_pharmacy':{'und':[{'nid':'[nid:5]' }] },'field_rp_medical_center':{'und':[{'nid':'[nid:"+radioMedicalId+"]' }] },'field_ro_select_order_for':{'und':["+familySelectplaceOrderUserId+"]}}"

  
    
    var jsonData = JSON.stringify(eval("(" + data2 + ")"));
    $.mobile.showPageLoadingMsg();
    $.ajax({
           type:"POST",
           beforeSend: function (request)
           {
           request.setRequestHeader("X-CSRF-Token",localStorage.deviceToken);
           request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
           },
           url: "http://www.repeatorderingsystem.co.nz/rest/node.json ",
           data:jsonData,
           dataType: 'json',
           processData: false,
           success: function(result) {
           $.mobile.hidePageLoadingMsg();
           customAlert("Repeat prescription order success fully submitted","ROS Alert!","ok");
           show_Phormacy_Activity_log();
           },
           error: function(msg) {
           for(var i in msg)
           console.log(i +"----"+msg[i]);
           $.mobile.hidePageLoadingMsg();
           customAlert(msg.statusText,"ROS Error !","ok");
           }
           });
}


function required_field_add_family(nid)
{
    var str_relation;
    var str_region;
    if(nid)
    {
        var objRecord;
        for(var key in listFamilyMember)
        {
            if(listFamilyMember[key].nid==nid)
            {
                objRecord=listFamilyMember[key];
//                alert(JSON.stringify(objRecord));
                break;
            }
        }
        str_relation=objRecord['Relations'];
        str_region=objRecord['Address']['value'];
        is_edit_nid=objRecord['nid'];
        
        
        var html = objRecord['Phoneno'];
        var div_phone_no = document.createElement("div");
        div_phone_no.innerHTML = html;
         
        
        $( "#firstname_family_member" ).val(objRecord['Firstname']);
        $( "#middle_family_member" ).val(objRecord['Middlename']);
        $( "#last_name_family_member" ).val(objRecord['Lastname']);
        $( "#phone_no_family_member" ).val(div_phone_no.innerText);
        $( "#DOB_family_member" ).val(objRecord['Dateofbirth']);
        $( "#street_address_family_member" ).val();
        $( "#suburb_family_member" ).val();
         $( "#postal_code_family_member" ).val();
        is_edit=1;
        
    }
    else
    {
  
        $( "#firstname_family_member" ).val('');
        $( "#middle_family_member" ).val('');
        $( "#last_name_family_member" ).val('');
        $("#relation_family_member option:selected").val('');
        $( "#phone_no_family_member" ).val('');
        $( "#DOB_family_member" ).val('');
        $( "#street_address_family_member" ).val('');
        $( "#suburb_family_member" ).val('');
        $("#region_family_member").find("option:selected").val('');
        $( "#postal_code_family_member" ).val('');
        is_edit=0;
        str_relation="";
        str_region="";
        is_edit_nid='';
    }
 
    $.mobile.changePage('#addFamilyMem', { transition: "slide", changeHash: false });
    setTimeout(function()
    {
        getRelation_add_family("7",str_relation);
        getregion_family_member("2",str_region);
    },100);
}
function getRelation_add_family(vid,str_relation)
{
    $('body').addClass('ui-loading'); 
    document.getElementById('relation_family_member').innerHTML = '';
    setTimeout(function()
    {
        $.ajax({
               url: 'http://www.repeatorderingsystem.co.nz/rest/taxonomy_term.json?parameters[vid]='+vid,
               type: 'get',
               dataType: 'json',
               async: false,
               success: function(result)
               {
                    $('body').removeClass('ui-loading');
                    for(var key in result)
                    {
                       var html = '';
                       html+='<option id="relation_family_member'+key+'" value="'+result[key].tid+'">'+result[key].name+'</option>';
               
                       $("#relation_family_member").append( html );
                    }
                   $('#relation_family_member').attr('selected', true);
               
               
                  
                   $("#relation_family_member").find("option:contains('"+str_relation+"')").each(function()
                   {
                       if( jQuery(this).text() ==  str_relation)
                       {
                           jQuery(this).attr("selected","selected");
                       }
                   });
                $('#relation_family_member').selectmenu("refresh");
               },
               error: function(result)
               {
               $('body').removeClass('ui-loading');
               customAlert(result.responseText,"ROS Alert!","ok");
               
               /*parsing for family perameter*/;
               
               }
               });
               } ,1000);
}
function getregion_family_member(vid,str_region)
{
   
    document.getElementById('region_family_member').innerHTML = '';
    $('body').addClass('ui-loading');
    setTimeout(function()
    {
    $.ajax({
           url: 'http://www.repeatorderingsystem.co.nz/rest/taxonomy_term.json?parameters[vid]="'+vid+'"&pagesize=2000',
           type: 'get',
           dataType: 'json',
           async: false,
           success: function(result)
           {
           for(var key in result)
           {
               $('body').removeClass('ui-loading');
               var html = '';
               html+='<option id="region_family_member'+key+'" value="'+result[key].tid+'">'+result[key].name+'</option>';
               $("#region_family_member").append( html );
               }
                $('#region_family_member0').attr("selected","selected");
               $('#relation_family_member').selectmenu("refresh");
//               $("#region_family_member").find("option:value('"+str_region+"')").each(function()
//                 {
//                         if( jQuery(this).text() ==  str_relation)
//                         {
//                         jQuery(this).attr("selected","selected");
//                         }
//                 });
          
           },
           error: function(result)
           {
           $('body').removeClass('ui-loading');
           
           customAlert(result.responseText,"ROS Alert!","ok");
           
           /*parsing for family perameter*/;
           
           }
           });
        } ,1000);
}
function add_family_member()
{
  
    var userId=localStorage.uid;
    var first_name = $( "#firstname_family_member" ).val();
    var middle_name = $( "#middle_family_member" ).val();
    var last_name = $( "#last_name_family_member" ).val();
    var relation = $("#relation_family_member option:selected").val();
    var phone_no = $( "#phone_no_family_member" ).val();
    var date_of_birth = $( "#DOB_family_member" ).val();
    var street_address = $( "#street_address_family_member" ).val();
    var suburb = $( "#suburb_family_member" ).val();
    var region = $("#region_family_member").find("option:selected").val();
    var postal_code = $( "#postal_code_family_member" ).val();
    
    var data;
    var str_url;
    var method;

    if(is_edit==1)
    {
        str_url="http://www.repeatorderingsystem.co.nz/rest/node/"+is_edit_nid+".json";
        method="PUT";
        data="{'name':'"+first_name+"','type':'family_member','field_cus_first_name':{'und':[{'value':'"+first_name+"'}]},'field_cus_middle_name':{'und':[{'value':'"+middle_name+"'}]},'field_cus_last_name':{'und':[{'value':'"+last_name+"'}]},'field_ph__phone':{'und':[{'value':'"+phone_no+"'}]},'field_cus_date_of_birth':{'und':[{'value':{'date':'"+date_of_birth+"'}}]},'field_fm_relations':{ 'und':['"+relation+"']},'field_fm_user_head':{'und':['"+userId+"']},'field_cus_complete_address':{'und':[{'field_ph_address':{'und':[{'value':'"+street_address+"'}]},'field_ph_suburb':{'und':[{'value':'"+suburb+"'}]},'field_ph__postalcode':{'und':[{'postal':'"+postal_code+"'}]},'field_ph_city_region':{'und':['"+region+"']}},{'field_ph_address':{'und':[{'value':'test street address2'}]},'field_ph_suburb':{'und':[{'value':'test suburb 2'}]},'field_ph__postalcode':{'und':[{'postal':'5353'}]},'field_ph_city_region':{'und':['114']}}]}}";
    }
    else
    {
        
        str_url="http://www.repeatorderingsystem.co.nz/rest/node.json";
        method="POST";
        data="{'name':'"+first_name+"','type':'family_member','field_cus_first_name':{'und':[{'value':'"+first_name+"'}]},'field_cus_middle_name':{'und':[{'value':'"+middle_name+"'}]},'field_cus_last_name':{'und':[{'value':'"+last_name+"'}]},'field_ph__phone':{'und':[{'value':'"+phone_no+"'}]},'field_cus_date_of_birth':{'und':[{'value':{'date':'"+date_of_birth+"'}}]},'field_fm_relations':{ 'und':['"+relation+"']},'field_fm_user_head':{'und':['"+userId+"']},'field_cus_complete_address':{'und':[{'field_ph_address':{'und':[{'value':'"+street_address+"'}]},'field_ph_suburb':{'und':[{'value':'"+suburb+"'}]},'field_ph__postalcode':{'und':[{'postal':'"+postal_code+"'}]},'field_ph_city_region':{'und':['"+region+"']}},{'field_ph_address':{'und':[{'value':'test street address2'}]},'field_ph_suburb':{'und':[{'value':'test suburb 2'}]},'field_ph__postalcode':{'und':[{'postal':'5353'}]},'field_ph_city_region':{'und':['114']}}]}}";
    }

    
 
    

   
    var jsonData = JSON.stringify(eval("(" + data + ")"));
       console.log(str_url+"\n"+jsonData);
    $.mobile.showPageLoadingMsg();
    $.ajax({
           type:method,
           beforeSend: function (request)
           {
           request.setRequestHeader("X-CSRF-Token",localStorage.deviceToken);
           request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
           },
           url: str_url,
           data:jsonData,
           dataType: 'json',
           processData: false,
           success: function(result) {
           $.mobile.hidePageLoadingMsg();
           customAlert("Family member successfully addes","ROS Alert!","ok");
           
           for(var i in result)
           console.log(i +"----"+result[i]);
           
           getFamily();
           }
           ,
           error: function(msg) {
           for(var i in msg)
           console.log(i +"----"+msg[i]);
           $.mobile.hidePageLoadingMsg();
           customAlert(msg.statusText,"ROS Error !","ok");
           }
           });
}

/*ordering repeats because */

/*ordering repeats because */

function ordering_repeats_because(vid)
{
    
    $.mobile.showPageLoadingMsg();
    
    $.ajax({
           url:'http://www.repeatorderingsystem.co.nz/rest/taxonomy_term.json?parameters[vid]='+vid,
           success: function(result) {
//                      alert("success--"+JSON.stringify(result));
           $.mobile.hidePageLoadingMsg();
           listOrdRepBecause=result;
           /*create dinamic readio button  to show oder prepeat because option*/
//           var res = eval("(" + result + ")");
           
           //           alert("res: "+res.length);
           if(vid==4){
           document.getElementById('radio_order_repeat').innerHTML = '';
           for(var i=0;i<result.length;i++)
           {
           var id = "radio_order_repeat" + i;
           $("#radio_order_repeat").append("<input type='radio'  value='"+result[i].name+"' id_atr='"+result[i].tid+"' name='radio_order_repeat' id='" + id + "' />");
           $("#radio_order_repeat").append("<label for='" + id + "' >" + result[i].name + "</label>");
           $("#" + id).checkboxradio().checkboxradio("refresh");
           
           }
           $("#radio_order_repeat").controlgroup("refresh");
           $("#radio_order_repeat0").attr("checked", true).checkboxradio("refresh");
           
           $("#id_repeat_medi_order").trigger('create');
           }
           else if(vid==3){
           document.getElementById('radio_order_type').innerHTML = '';
           for(var i=0;i<result.length;i++)
           {
           var id = "radio_order_type" + i;
           $("#radio_order_type").append("<input type='radio' onchange='specific_medicine_repeat_medical("+result[i].tid+")' value='"+result[i].name +"' name='radio_order_type' id_atr='"+result[i].tid+"' id='" + id + "' />");
           $("#radio_order_type").append("<label for='" + id + "' >" + result[i].name + "</label>");
           $("#" + id).checkboxradio().checkboxradio("refresh");
           
           }
           $("#radio_order_type").controlgroup("refresh");
           $("#radio_order_type1").attr("checked", true).checkboxradio("refresh");
           ordering_repeats_because(4);
           }
           else if(vid==9){
          
           document.getElementById('radio_medicine_type').innerHTML = '';
           for(var i=0;i<result.length;i++)
           {
           var id = "radio_medicine_type" + i;
           $("#radio_medicine_type").append("<input type='radio' onchange='specific_medicine_list_repeat_prescription("+result[i].tid+")' value='"+result[i].name +"' id_atr='"+result[i].tid+"' name='radio_medicine_type' id='" + id + "' />");
           $("#radio_medicine_type").append("<label for='" + id + "' >" + result[i].name + "</label>");
           $("#" + id).checkboxradio().checkboxradio("refresh");
           
           }
           $("#radio_medicine_type").controlgroup("refresh");
           $("#radio_medicine_type1").attr("checked", true).checkboxradio("refresh");
           ordering_repeats_because(8);
           }
           else if(vid==8){
           document.getElementById('radio_pickup_repeat').innerHTML = '';
           for(var i=0;i<result.length;i++)
           {
           var id = "radio_pickup_repeat" + i;
           $("#radio_pickup_repeat").append("<input type='radio' value='"+result[i].name+"' id_atr='"+result[i].tid+"'name='radio_pickup_repeat' id='" + id + "' />");
           $("#radio_pickup_repeat").append("<label for='" + id + "' >" + result[i].name + "</label>");
           $("#" + id).checkboxradio().checkboxradio("refresh");
           
           }
           $("#radio_pickup_repeat").controlgroup("refresh");
           $("#radio_pickup_repeat0").attr("checked", true).checkboxradio("refresh");
           $("#id_precription_order").trigger('create');
           }
           
           
           
           },
           error: function(result) {
            customAlert(result.responseText,"ROS Alert!","ok");
           $.mobile.hidePageLoadingMsg();
           for(var i in result)
           console.log(i +"----"+result[i]);
           }
           });
    
}

/*show medicne list for repeat medical */
function add_more_medicne_repeat_medical()
{
    var content="<div data-role='fieldcontain'>";
    content += "<input type='text' placeholder='pharmacy name'/>";
    content+="</div>";
    
    $("#parmecy_list_container").append( content ).trigger('create');;
}
function specific_medicine_repeat_medical(tid)
{
        /*add input view*/
        
        document.getElementById('div_specific_pharmacy').innerHTML = '';
        
        if(tid==123)
        {
            var content="<div data-role='fieldcontain' id='parmecy_list_container'>";
            content += "<input type='text' name='username' placeholder='pharmacy name' />";
            content+="</div>";
            content+="<div data-role='fieldcontain' >";
            content+="<input type='button' style='width:120px;' id='#add_medicne_list' onclick='add_more_medicne_repeat_medical()' value='add' />";
            content+="</div>";
            $("#div_specific_pharmacy").append( content ).trigger('create');
            
        }
        else
        {
            document.getElementById('div_specific_pharmacy').innerHTML = '';
        }
        
   
}
/*show medicne list for repeat prescription*/
function add_more_medicne_repeat_prescription()
{
    var content="<div data-role='fieldcontain'>";
    content += "<input type='text' placeholder='medicne name'/>";
    content+="</div>";

    $("#medicne_list_container").append( content ).trigger('create');;
;
}
function specific_medicine_list_repeat_prescription(tid)
{
  /*add input view*/
    
     document.getElementById('div_specific_medicne').innerHTML = '';
    
    if(tid==217)
    {
        var content="<div data-role='fieldcontain' id='medicne_list_container'>";
        content += "<input type='text' name='username' placeholder='medicne name' />";
        content+="</div>";
        content+="<div data-role='fieldcontain' >";
        content+="<input type='button' style='width:120px;' id='#add_medicne_list' onclick='add_more_medicne_repeat_prescription()' value='add' />";
        content+="</div>";
        $("#div_specific_medicne").append( content ).trigger('create');;
;
      
        
    }
    else
    {
        document.getElementById('div_specific_medicne').innerHTML = '';
    }
    
}

/*manage to show phormacy activity log*/
function show_Phormacy_Activity_log()
{

    $.mobile.changePage('#id_phr_activity_log_page', { transition: "slide", changeHash: false });
    
    $('body').addClass('ui-loading');  
    document.getElementById('id_par_activity_log').innerHTML = '';
    setTimeout(function(){
        $.ajax({
               url: 'http://www.repeatorderingsystem.co.nz/rest/phactivitylogip.json?uid='+localStorage.name,
               type: 'get',
               dataType: 'json',
               async: false,
               success: function(result)
               {
                    if(result.length>0)
                    {
                          for(var i=0;i<result.length;i++)
                           {
                           
                               var content = "<div data-role='collapsible' id='set" + i + "'>";
                               content+="<h3>"+result[i].Pharmacy+"</h3>";
                               content+="<p><a>nid:</a>"+result[i].nid;
                               content+="<a onclick='showPrecriptionOrder()' data-role='button' data-icon='edit' data-theme='a'  data-iconpos='left' data-mini='true' data-inline='true'>Edit</a></p>";
                               content+="<p><a>Order Type:</a>"+result[i]["Order type"]+"</p>";
                               content+="<p><a>Ordering Reason:</a>"+result[i]["ordering reason"]+"</p>";
                               content+="<p><a>Ordered Medicine:</a>"+result[i]["Ordered Medicine(s)"]+"</p>";
                               content+="<p><a>Order State:</a>"+result[i]["Order state"]+"</p>";
                               content+="</div>";
                               
                               $("#id_par_activity_log").append( content ).collapsibleset('refresh');
                                 $("#id_par_activity_log").trigger('create');
                           }
                    }
                    else
                    {
                            $("#id_par_activity_log").append("<div style=\"text-align:center\" data-role='list-divider'><h1>Data Not Found</h1></div>").collapsibleset('refresh');
                     }
                    $('body').removeClass('ui-loading');
               },
               error: function(result)
               {
               $('body').removeClass('ui-loading');
                customAlert(result.responseText,"ROS Alert!","ok");
               
               }
               });
    }, 500);
    
}

function search_pharmacy(){

   
    $.mobile.changePage('#searchaPharmacyResult', { transition: "slide", changeHash: false });
   
    var username=$("#username_search_pharmacy").val();
    var subrb=$("#subrb_search_pharmacy").val();
    city=pharmacyAuto_searchText;
    var id="#div_search_paharmacy_auto";
    city=$(''+id+' input[data-type="search"]').val();
    document.getElementById('search_pharma_content').innerHTML = '';
    var url='http://www.repeatorderingsystem.co.nz/rest/pharmacy_search_api.json?name='+ name +'&suburb='+ subrb +'&city='+city+'';
    $('body').addClass('ui-loading');
    setTimeout(function(){
        $.ajax({
               url: url,
               type: 'get',
               dataType: 'json',
               async: false,
               success: function(result)
               {
               $('body').removeClass('ui-loading');
               if(result.length>0)
               {
                   for(index in result)
                   {
                       $("#search_pharma_content").append("<li data-role=\"list-divider\"><strong><h2>"+result[index].node_title+"</h2></strong></li>"+
                      "<li>"+
                      "<p>Email:"+result[index].Email+"</p>"+
                      "<p>Phone:"+result[index].Phone+"</p>"+
                      "<p>Address:"+result[index].Address+"</p>"+
                      "<p>Suburb:"+result[index].Suburb+"</p>"+
                      "<p>City:"+result[index].City+"</p>"+
                      "<p>Working hours:"+result[index]['Working hours']+"</p>"+
                      "</li>");
                   }
               }
               else
               {
                    $("#search_pharma_content").append("<li style=\"text-align:center\" data-role=\"list-divider\"><h1>Data Not Found</h1></li>")
               }
               $("#search_pharma_content").listview("refresh");
              
               },
               error: function(result)
               {
               $('body').removeClass('ui-loading');
               customAlert(result.responseText,"ROS Alert!","ok");
               }
               });
   }, 1000);
    
}

function search_medical(){
    $.mobile.changePage('#searchaMedicalResult', { transition: "slide", changeHash: false });
   
    var username=$("#username_search_pharmacy").val();
    var subrb=$("#subrb_search_pharmacy").val();
    city=medicalAuto_searchText;
    var id="#div_search_medical_auto";
    city=$(''+id+' input[data-type="search"]').val();
    
  
    document.getElementById('search_medi_content').innerHTML = '';
    var url='http://www.repeatorderingsystem.co.nz/rest/mc_search.json?name='+ name +'&suburb='+ subrb +'&city='+city+'';
 

    $("#search_medi_content").html("");
    
     $('body').addClass('ui-loading');
    setTimeout(function(){
        $.ajax({
               url:url,
               type: 'get',
               dataType: 'json',
               async: false,
               success: function(result)
               {
              
               if(result.length)
               {
                   for(index in result)
                   {
                       $("#search_medi_content").append("<li data-role=\"list-divider\"><strong><h2>"+result[index].node_title+"</h2></strong></li>"+
                        "<li>"+
                        "<p>Email:"+result[index].Email+"</p>"+
                        "<p>Phone:"+result[index].Phone+"</p>"+
                        "<p>Address:"+result[index]['Street address']+"</p>"+
                        "<p>Suburb:"+result[index].Suburb+"</p>"+
                        "<p>City:"+result[index]['Region/City']+"</p>"+
                        "<p>Working hours:"+result[index]['Working hours']+"</p>"+
                        "</li>");
                   }
               }
               else
               {
                    $("#search_medi_content").append("<li style=\"text-align:center\" data-role=\"list-divider\"><h1>Data Not Found</h1></li>")
               }
                $("#search_medi_content").listview("refresh");
                $('body').removeClass('ui-loading');
               
               },
               error: function(result)
               {
                $('body').removeClass('ui-loading');
                customAlert(result.responseText,"ROS Alert!","ok");
               
               /*parsing for family perameter*/;
               
               }
               });
       }, 1000);
    
}

/*manage to show medicam  center log*/
function show_MC_Activity_log()
{
    
    $.mobile.changePage('#id_MC_activity_page', { transition: "slide", changeHash: false });
    
    
    document.getElementById('id_MC_activity_log').innerHTML = '';
    $('body').addClass('ui-loading');
    setTimeout(function(){
        $.ajax({
               url: 'http://www.repeatorderingsystem.co.nz/rest/mc_activity_log.json?uid='+localStorage.uid,
               type: 'get',
               dataType: 'json',
               async: false,
               success: function(result)
               {
               $.mobile.hidePageLoadingMsg();
               if(result.length>0)
               {
                   for(var i=0;i<result.length;i++)
                   {
                       var content = "<div data-role='collapsible' id='set" + i + "'>";
                       content+="<h3>"+result[i]["Medical centre"]+"</h3>";
                       content+="<p><a>Node Id:</a>"+result[i].nid;
                       content+="<a onclick='showRepeatOrder()' data-role='button' data-icon='edit' data-theme='a'  data-iconpos='left' data-mini='true' data-inline='true'>Edit</a></p>";
                        content+="<p><a>Node Title:</a>"+result[i].node_title+"</p>";
                       content+="<p><a>Medicine:</a>"+result[i]["Name of the medicine(s) you require"]+"</p>";
                       content+="<p><a>Request a repeat prescription for:</a>"+result[i]["Request a repeat prescription for"]+"</p>";
                       content+="<p><a>Pick up yourself/fax to my pharmacy:</a>"+result[i]["Pick up yourself / fax to my pharmacy"]+"</p>";
                      
                       content+="</div>";
               
                        $("#id_MC_activity_log").append( content ).collapsibleset('refresh');
                        $("#id_MC_activity_log").trigger('create');
                   }
               }
               else
               {
                     $("#id_MC_activity_log").append("<div style=\"text-align:center\" data-role='list-divider'><h1>Data Not Found</h1></div>").collapsibleset('refresh');
               }
               
               $('body').removeClass('ui-loading');
               },
               error: function(result)
               {
               $('body').removeClass('ui-loading');
               customAlert(result.responseText,"ROS Alert!","ok");
               
               /*parsing for family perameter*/;
               
               }
               });
    }, 1000);
    
}
/*manage to show medicam  notification log*/
function show_notification_log()
{
    
    $.mobile.changePage('#id_notification_page', { transition: "slide", changeHash: false });
    $('body').addClass('ui-loading');  
    setTimeout(function(){
       document.getElementById('id_notification_list').innerHTML = '';
       $.ajax({
              url: 'http://www.repeatorderingsystem.co.nz/rest/csnotiip.json?repeatuid='+localStorage.name+'&prescriptionuid='+localStorage.name,
              type: 'get',
              dataType: 'json',
              async: false,
              success: function(result)
              {
             
              for(var i=0;i<result.length;i++)
              {
                  var content = "<div data-role='collapsible' id='set" + i + "'>";
                  content+="<h3>"+result[i].node_title+"</h3>";
                  content+="<p><b>nid:</b>"+result[i].nid+"</p>";
                  content+="<p><b>Node Type:</b>"+result[i].node_type+"</p>";
                  content+="<p><b>User Node Name:</b>"+result[i].users_node_1_name+"</p>";
                  content+="<p><b>Comments:</b>"+result[i].Comments+"</p>";
                  content+="</div>";
                  
                  $("#id_notification_list").append( content ).collapsibleset('refresh');
                }
               $('body').removeClass('ui-loading');
              },
              error: function(result)
              {
              $('body').removeClass('ui-loading');

              customAlert(result.responseText,"ROS Alert!","ok");
              
              /*parsing for family perameter*/;
              
              }
              });
    }, 1000);
    
    
   
    
}



function search_city_region_pharma()
{
    $("#username_search_pharmacy").val("");
    $("#subrb_search_pharmacy").val("");
    document.getElementById('search_paharmacy_auto').innerHTML = '';
    $('#div_search_paharmacy_auto input[data-type="search"]').val("");
    
    
    
    $.mobile.changePage('#searchaPharmacy', { transition: "slide", changeHash: false });
    $.mobile.showPageLoadingMsg();
    var id_autosearch_ui="#search_paharmacy_auto";
    var id_autosearch_div="#div_search_paharmacy_auto";
  
    
    var data="{'vid':'2','parent':'0',  'maxdepth':'5'}";
    var jsonData = JSON.stringify(eval("(" + data + ")"));
    console.log("6"+localStorage.deviceToken);
    loading('show');
    $.ajax({
           type:"POST",
           beforeSend: function (request)
           {
           request.setRequestHeader("X-CSRF-Token",localStorage.deviceToken);
           request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
           },
           url: "http://www.repeatorderingsystem.co.nz/rest/taxonomy_vocabulary/getTree.json",
           data:jsonData,
           dataType: 'json',
           processData: false,
           success: function(result) {
            var res = result;
           loading('hide');
           
           for(index in res){
           $(id_autosearch_ui).append("<li class=\"ui-screen-hidden\"><a onclick=\"fill_Search_Pharmacy('"+id_autosearch_div+"','"+res[index].name+"','"+res[index].tid+"')\">"+res[index].name+"</a></li>");
           }
          
           $(id_autosearch_ui).listview('refresh');
           },
           error: function(msg) {
            loading('hide');
           customAlert(msg.statusText,"ROS Alert!","ok");
           for(var i in msg)
           console.log(i +"----"+msg[i]);
           }
    });
    
}


function search_city_region_medical_center()
{
    $("#username_search_medical").val("");
    $("#subrb_search_medical").val("");
    document.getElementById('search_medical_auto').innerHTML = '';
    $('#div_search_medical_auto input[data-type="search"]').val("");
    
    $.mobile.changePage('#searchaMedical', { transition: "slide", changeHash: false });
    var id_autosearch_ui="#search_medical_auto";
    var id_autosearch_div="#div_search_medical_auto";
    var data="{'vid':'2','parent':'0',  'maxdepth':'5'}";
    var jsonData = JSON.stringify(eval("(" + data + ")"));
 
    
    $.mobile.showPageLoadingMsg();
    $.ajax({
           type:"POST",
           beforeSend: function (request)
           {
           request.setRequestHeader("X-CSRF-Token",localStorage.deviceToken);
           request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
           
           },
           url: "http://www.repeatorderingsystem.co.nz/rest/taxonomy_vocabulary/getTree.json",
           data:jsonData,
           dataType: 'json',
           processData: false,
           success: function(result) {
           var res = result;
           $.mobile.hidePageLoadingMsg();
           
           for(index in res){
           console.log(res[index].name);
            $(id_autosearch_ui).append("<li class=\"ui-screen-hidden\"><a onclick=\"fill_medical_list('"+id_autosearch_div+"','"+res[index].name+"','"+res[index].tid+"')\">"+res[index].name+"</a></li>");
           }
           $(id_autosearch_ui).listview('refresh');
           },
           error: function(msg) {
           customAlert(msg.statusText,"ROS Alert!","ok");
            $.mobile.hidePageLoadingMsg();
           for(var i in msg)
           console.log(i +"----"+msg[i]);
           }
           });
    
}


function loading(showOrHide) {
    setTimeout(function(){
               $.mobile.loading(showOrHide);
               }, 1);
}


/*back button to handler*/
function goToBackPage(pageID) {
    $.mobile.changePage('#'+pageID, { transition: "slide",reverse: true, changeHash: false });
    //$.mobile.changePage( '#'+pageID );
    
}

/*notification to set reminder*/

var notification = {
init:function(){
    
},
	
	// This will fire after 60 seconds
local_min:function(seconds,message){
 
    var idReminder=localStorage.notificationId+1;
    var d = new Date();
    d = d.getTime() + seconds*1000; //20 seconds from now
    d = new Date(d);
    customAlert(d,"Remider!","ok");
    plugins.localNotification.add({
                                  date: d,
                                  repeat:'daily',
                                  message: message,
                                  hasAction: true,
                                  badge: 1,
                                  id:idReminder,
                                  sound:'horn.caf',
                                  background:'app.background',
                                  foreground:'app.running'
                                  });
    

},
	
	// This will fire based on the time provided.
	// Something to note is that the iPhone goes off of 24hr time
	// it defaults to no timezone adjustment so +0000 !IMPORTANT
local_timed:function(hh,mm){
    // the example time we provide is 13:00
    // This means the alarm will go off at 1pm +0000
    // how does this translate to your time? While the phone schedules 1pm +0000
    // it will still go off at your desired time base on your phones time.
    
    console.log(hh+" "+mm);
    // Now lets make a new date
    var d = new Date();
    d = d.setSeconds(00);
    d = new Date(d);
    d = d.setMinutes(mm);
    d = new Date(d);
    d = d.setHours(hh);
    d = new Date(d);
    plugins.localNotification.add({
                                  date: d,
                                  repeat:'daily',
                                  message: 'This went off just as expected!',
                                  hasAction: true,
                                  badge: 1,
                                  id: '2',
                                  sound:'horn.caf',
                                  background:'app.background',
                                  foreground:'app.running'
                                  });
},
clear:function(){
    plugins.localNotification.cancelAll();
},
tomorrow:function(hh,mm,days,message){
 
    var idReminder=localStorage.notificationId;
    idReminder=idReminder+1;
    // Now lets make a new date
    var d = new Date();
    d = d.setSeconds(00);
    d = new Date(d);
    d = d.setMinutes(mm);
    d = new Date(d);
    d = d.setHours(hh);
    d = new Date(d);
  
    // add a day
    d = d.setDate(d.getDate()+days);
    d = new Date(d);
      alert(d);
    plugins.localNotification.add({
                                  date: d,
                                  repeat:'daily',
                                  message: message,
                                  hasAction: true,
                                  badge: 1,
                                  id:idReminder,
                                  sound:'horn.caf',
                                  background:'app.background',
                                  foreground:'app.running'
                                  });
}
	
}




// APP
var app = {
bodyLoad:function(){
    document.addEventListener("deviceready", app.deviceReady, false);
},
deviceReady:function(){
    app.init();
},
init:function(){
 
},
background:function(id){
    alert("I was in the background but i'm back now! ID="+id);
 },
running:function(id){
    alert("I am currently running, what should I do? ID="+id);
  }
};


/*minus dates*/




