
// Array for campan list
var campaignID;
var timerFlag=true;
var varTimer
var syncFlag=false;
var webService_URL="http://www.softpoint.es/icall/";
/*manage syncronization message only start of the application */



//.......................................CREATE DATABASE....................................//


var createDatabase = {
    initEvents :function(){

        if(localStorage.getItem("dbCreated")!=true){
            var db = window.openDatabase("campaign", "1.0", "campaign db", 1000000);
            db.transaction(createDatabase.populateDB,createDatabase.errorDB,createDatabase.successDB1);
        }
    },
populateDB:function(tx){
    

   var assets_create = 'CREATE TABLE IF NOT EXISTS assets(id  INTEGER PRIMARY KEY AUTOINCREMENT,name varchar(50),path varchar(100),htmlData text,isThumb INTEGER, isMaster INTEGER)';
   
    var calls_create = 'CREATE TABLE IF NOT EXISTS calls(id  INTEGER PRIMARY KEY AUTOINCREMENT,presentation_name varchar,client_name varchar,start_date datetime,finish_date datetime,duration INTEGER)';
    
    var campaigns_create='CREATE TABLE IF NOT EXISTS campaigns(id  INTEGER PRIMARY KEY AUTOINCREMENT,name varchar(50),asset_id INTEGER)';
    
    var clients_create='CREATE TABLE IF NOT EXISTS clients(id  INTEGER PRIMARY KEY AUTOINCREMENT,name varchar(50))';

       
    var presentation = 'CREATE TABLE "presentation" ("id" INTEGER PRIMARY KEY  NOT NULL , "name" VARCHAR, "as_id" INTEGER, "master_id" INTEGER DEFAULT 0)';
    var pres_campaing = 'CREATE TABLE "presentationCampaign" ("id" INTEGER PRIMARY KEY  NOT NULL , "pres_id" INTEGER, "slide_id" INTEGER, "camp_id" INTEGER)';
    
    tx.executeSql(presentation, createDatabase.errorDB,createDatabase.successDB);
    tx.executeSql(pres_campaing, createDatabase.errorDB,createDatabase.successDB);
    tx.executeSql(calls_create);
    tx.executeSql(campaigns_create,createDatabase.errorDB,createDatabase.successDB);
    tx.executeSql(clients_create);
    tx.executeSql(assets_create,createDatabase.errorDB,createDatabase.successQry);
    
    
    
},
successDB:function(tx,results){
   // alert("success : "+results);
},
successDB1:function(tx,results){
//    alert("successasdasdsuccessasdasd : "+results);
},
    
errorDB: function(){
    alert('error'+tx);
},
successQry:function(tx){
    
     insertClient(tx);
     insertData.assets(tx);
     insertData.campaign(tx);

}
}

// Insert Client (side-lilst) in table....

function insertClient(tx){
    
    tx.executeSql('insert into clients values(1, "Adam Kinkaid")');
    tx.executeSql( 'insert into clients values(2, "Alex Wickerham")'); 
    tx.executeSql('insert into clients values(3, "Bob Cabot")'); 
    tx.executeSql('insert into clients values(4, "Caleb Booth")' ); 
    tx.executeSql('insert into clients values(5, "Culver James")' ); 
    tx.executeSql('insert into clients values(6, "Elizabeth Bacon")'); 
    tx.executeSql('insert into clients values(7, "Emery Parker")'); 
    tx.executeSql('insert into clients values(8, "Graham Smith")'); 
    tx.executeSql('insert into clients values(9, "Mike Farnsworth")' ); 
    tx.executeSql('insert into clients values(10, "Murray Vanderbuilt")' ); 
    tx.executeSql('insert into clients values(11, "Nathan Williams")' ); 
    tx.executeSql('insert into clients values(12, "Paul Baker")' ); 
    tx.executeSql('insert into clients values(13, "Wakefield")' ); 
   
};      



var cid='';
var presentationId='';
var presentation_name='';



//.......................................Campaign....................................//


// Create list of campaigns 

var createCampan = {
    
    initEvents : function(){

        
        $.ajax({
               url:'http://www.repeatorderingsystem.co.nz/services/session/token',
               success: function(result) {
               console.log("success--"+result);
               },
               error: function(result) {
               console.log("success--"+result);
               }
               });
//        $.ajax({
//               url:' http://repeatorderingsystem.co.nz/rest/fm_list.json/?user_head_uid=146',
//               success: function(result) {
//               alert(result);
//               for(var key in result){
//               console.log(key+"-------"+result[key]);
//                   for(var key1 in result[key])
//                   console.log(key1+"--"+result[key][key1]);
//                       
//
//               }
//               },
//               error: function(result) {
//               alert("error"+result);
//               }
//               });
        
        
        var j='{"name":"customer4asd","pass":"customer4asd",  "mail":"customase46@xyf.com","user_roles":"5","field_login_pin_value":{"und":[{"value":"2324"}]} }';
        var json = JSON.stringify(eval("(" + j + ")"));
//
           $.ajax({
               type:"POST",
      
                
               beforeSend: function (request)
               {
               request.setRequestHeader("X-CSRF-Token","u3c-NBXrD0HOHNIjYJMZRnQUudXA4x9PIYkaoWlR7Uc");
                  request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
               },
               url: "http://www.repeatorderingsystem.co.nz/rest/user/register.json",
               data:json,
               ßdataType: 'json',
               processData: false,
               success: function(msg) {
                  for(var i in msg)
                  console.log(i +"----"+msg[i]);
               },
               error: function(msg) {
               for(var i in msg)
               console.log(i +"----"+msg[i]);
               alert("error"+msg);
               }
               });
        
        
        
        
        if(localStorage.getItem("dbCreated")!=true){
 
            var db = window.openDatabase("campaign", "1.0", "campaign db", 1000000);
            db.transaction(createCampan.populateDB,createCampan.error,createCampan.successDB);
        }
    },
    
    populateDB:function(tx){
        
         var sql = "select assets.name as asset_name,campaigns.name as campaign_name, campaigns.id as campaign_id from assets , campaigns where  assets.id =  campaigns.asset_id";
        
        tx.executeSql(sql,[],createCampan.processCampaign);
        
    },
    
    successDB : function(){

    },
    error : function(){
 //       alert("Data base not created please try again");
    },
    processCampaign:function(tx,results)
    {
        
        var len = results.rows.length;
        campaignsName = [];
        imageName =[];
        campaignId = [];
        for(var i=0;i<len;i++){
            
            campaignsName[i] =  results.rows.item(i).campaign_name; 
            imageName[i] = results.rows.item(i).asset_name;
            campaignId[i] =results.rows.item(i).campaign_id;
        }
        $("#campanId").empty();
        
        /*manage only one time for satrting of the application*/
        if ( window.localStorage.getItem("sync_flag") == null)
        {
            window.localStorage.setItem("sync_flag","false");
        }
        
        if (window.localStorage.getItem("sync_flag") == "false")
        {
            navigator.notification.alert("Synchronize to load master presentation", [], 'Message!', 'ok');
        }
        $.each(campaignsName,function(i,v){
               
               $("#campanId").append('<li><a data-transition="slide">\<img src="img/'+imageName[i]+'" onclick="openPresentaionPage('+campaignId[i]+')">\<span>'+campaignsName[i]+'</span>\</a>\</li>');
               
        });
    } 
};

function openPresentaionPage(campaignId)
{

    if(window.localStorage.getItem("sync_flag") == "false")
    {
        navigator.notification.alert("Synchronize to load master presentation", [], 'Message! ', 'ok');
    }
    else
    {
        $.mobile.changePage("#albumsList");
        showPresentation.pres_data(campaignId);
    }
    
}


//.......................................PRESENTATION....................................//

var masterPreThumNail;

//Click event of list Item (Compain)................
var showPresentation = {
    
    pres_data:function(id){
        cid=id;
        if(localStorage.getItem("dbCreated")!=true){
            var db = window.openDatabase("campaign", "1.0", "campaign db", 1000000);
            db.transaction(showPresentation.populateDB,showPresentation.errorDB,showPresentation.successDB);
        }
    },
    populateDB:function(tx)
    {
       var sql = "SELECT DISTINCT p.id as pres_id, p.master_id as master, p.name as pres_name, a.path as image_name, p.master_id from assets as a, presentation as p, presentationCampaign as pc where p.as_id = a.id and pc.pres_id = p.id and pc.camp_id="+cid;
        tx.executeSql(sql,[],showPresentation.getPresList);
        console.log("press data"+sql);
 
    },
       
    // Fill the list of Presentation by this function.....
    getPresList:function(tx,results){
        var len = results.rows.length;
        
        var presList = [len];
        for(var i =0;i<len;i++) {
            var imgUrl;
            
            if(i==0){
                masterPreThumNail = results.rows.item(i).image_name;
            }
            imgUrl= masterPreThumNail;
            presList[i] = results.rows.item(i).pres_name;
            var objPreName = {
                name: results.rows.item(i).pres_name,
                imageName:imgUrl,
                presId: results.rows.item(i).pres_id,
                presMaster: results.rows.item(i).master,
                iPres: i,
            }
                    
            data.albums.push(objPreName);
        }
        showPresentation.fillList();
   
    },
    
    
        
    
    fillList:function(){
        listv = new ListView('#listPresentaciones');
        
        $(data.albums).each(function(i){
    
            data.albums=[];
            listv.addElement({
                presName:this.name,
                img:this.imageName,
                href:'#medicPanel',
                compain_id:cid,
                presId: this.presId,           
                presMaster: this.presMaster,
                content:'<strong>'+this.name+'</strong>',
            });
        });
     listv.render();
    }
}




//........................PRESENTATION - RIGHT PANEL.............................//
var pres_thumbNail;

function openRightPannel(id,presImage,presName){
    pres_thumbNail=presImage;
    presentationId = id;
    presentation_name = presName;
    showRightPanel.panel_data();
    
};

var showRightPanel = {
    
   
    panel_data:function(){

     
        if(localStorage.getItem("dbCreated")!=true){
            var db = window.openDatabase("campaign", "1.0", "campaign db", 1000000);
            db.transaction(showRightPanel.populateDB,showRightPanel.errorDB,showRightPanel.successDB);
        }
    },
    
    populateDB:function(tx){
        var sql = "SELECT * FROM clients";
        tx.executeSql(sql,[],showRightPanel.getPanelList);
        
        var sqlSlite;
       
        if(presentationId==1){
            
            
            
            sqlSlite = "select distinct pc.slide_id, s.name,s.path,s.htmlData from presentationCampaign as pc, assets as s where s.id = pc.slide_id  and pc.pres_id = "+presentationId;
            
        }else {
            
            sqlSlite = "select pc.slide_id, s.name,s.path,s.htmlData from presentationCampaign as pc, assets as s where s.id = pc.slide_id  and pc.pres_id = "+presentationId;
            
        }


        tx.executeSql(sqlSlite,[],showRightPanel.getSlideList);
        
  
    },
  
    
    
    // Fill the list of Right Panel by this function.....
    getPanelList:function(tx,results){
        


        var len = results.rows.length;
        var panelList = [len];
        $('#sideList').empty();
        
        for(var i =0;i<len;i++) {
             var bhtml = "";
                 bhtml+='<li><a href="#" id="'+results.rows.item(i).name+'" onclick="goToSlideList(\''+results.rows.item(i).name+'\')" rel="external">'+results.rows.item(i).name+'</a></li>';
                    $('#sideList').append(bhtml)
                    $('#sideList').listview('refresh');
            }
          }, 
    
    
    // Slide list according presentation click...
    getSlideList:function(tx,results){
              
        var len = results.rows.length;
        data.slideList = [len];

        for(var i =0;i<len;i++)
        {
            data.slideList[i] = results.rows.item(i);
        }
   }
}



var start_time;
var end_time;
var client_name;

var iscrollPage=null;
function goToSlideList(id)
{
    client_name=id;
    var len=data.slideList.length;
    document.getElementById('innerSwipDiv').innerHTML = '';
    document.getElementById('thumbNaillist').innerHTML = '';
    var html ='';
    var thumbhtml ='';
    for(var i =0;i<len;i++)
    {
       
        if(data.slideList[i].path=='')
        {

            html+='<div>';
            html+='<div class="scroll_htmlData">';
            html+=data.slideList[i].htmlData;
            html+='</div>';
            html+='</div>';
                 
            thumbhtml+='<div id="'+i+'" onclick="goToCurrentSlide('+i+')" >';
            thumbhtml+='<img width="190px" height="140px" style="margin:4px;"   src="img/preview_not.png" />';
            thumbhtml+='</div>';

            
        }
        else
        {
            html+='<div style="display:block;">';
            html+='<img width="1024px" height="748px" src="'+data.slideList[i].path+'" />';
            html+='</div>';
            
            thumbhtml+='<div id="'+i+'" onclick="goToCurrentSlide('+i+')" >';
            thumbhtml+='<img width="190px" height="140px" style="margin:4px;"  src="'+data.slideList[i].path+'"/>';
            thumbhtml+='</div>';
         
        
        }
    

    }

  
    var thumNailDivWidth;
    thumNailDivWidth=len*200*2;
    $('#thumbNaillist').width(thumNailDivWidth);
    $('#thumbNaillist').append(thumbhtml);
      
    $('#innerSwipDiv').append(html);
    $.mobile.changePage("#id_slidePage");
    
    
    var scrollerWidth=200;
    $('#scroller_slide').width(scrollerWidth);
    swipSlide = new Swipe(document.getElementById('id_swipSlide'));
    $("#btnPause .ui-btn-text").text("Play");
    $("#id_slide_footer").hide();
    start_time = new Date();
}
/*manage rendam image show in slide image*/
function goToCurrentSlide(id)
{
    swipSlide.slide(id);
}



// ...............................Delete the Presentation...........................//

var deletePresentation = {
    
     open_db:function(pres_id1){
        
        presentationId= pres_id1;
        if(localStorage.getItem("dbCreated")!=true){
            var db = window.openDatabase("campaign", "1.0", "campaign db", 1000000);
            db.transaction(deletePresentation.populateDB,showRightPanel.errorDB,showRightPanel.successDB);
        }  
    },
    
    populateDB:function(tx){
        var sql = "delete from presentation where id="+presentationId;
        tx.executeSql(sql,[],deletePresentation.showArert);
        var sqlSlide = " delete from presentationCampaign where pres_id = "+presentationId;
        tx.executeSql(sqlSlide,[],deletePresentation.showArert);
    
    },
    
    showArert:function(){
        showPresentation.pres_data(cid);
        $.mobile.changePage('#albumsList');
    },
}


// ...............................time count of running presentation...........................//


var TimerCountEntry = {
    
    initEvents : function(){
        
        
        end_time = new Date();
        $.mobile.changePage("#albumsList");
        if(localStorage.getItem("dbCreated")!=true){
            var db = window.openDatabase("campaign", "1.0", "campaign db", 1000000);
            db.transaction(TimerCountEntry.populateDB,showRightPanel.errorDB,showRightPanel.successDB);
        }
    },
    
    populateDB:function(tx){
        
        var diference =  Math.round((end_time-start_time)/1000);
        var pres_visit_time = timeFormatter(diference);
        navigator.notification.alert(pres_visit_time, [], 'Total Time', 'ok');
        var sql = "insert into calls(presentation_name, client_name, start_date, finish_date, duration) values('"+presentation_name+"', '"+client_name+"', '"+start_time+"','"+end_time+"','"+diference+"')";
        console.log(sql);
        tx.executeSql(sql,[],TimerCountEntry.goBackPres);
    },
    
    goBackPres : function(){
        showPresentation.pres_data(cid);
        $.mobile.changePage("#albumsList");
    },
};




/**********--------Show Add new presentaion dialog-----------***************************/

//...Get the list of Presentaion to show in dialog..//



var GetPresentationList = {
    
    initEvents : function(){
        if(localStorage.getItem("dbCreated")!=true){
            var db = window.openDatabase("campaign", "1.0", "campaign db", 1000000);
            db.transaction(GetPresentationList.populateDB,showRightPanel.errorDB,showRightPanel.successDB);
        }
    },
    
    populateDB:function(tx){
       var sql = "SELECT id, name FROM presentation";
       tx.executeSql(sql,[],GetPresentationList.showPresentationName);
    },
        
    showPresentationName : function(tx,results)
    {
        $('select').selectmenu('enable');
        var optHtml = "";
        for(var i=0;i<results.rows.length;i++)
        {
            optHtml += '<option value="'+results.rows.item(i).id+'">'+results.rows.item(i).name+'</option>';
        }
        $('#optAPres').html(optHtml);
        
        $('#optAPres').selectmenu('refresh');
      
    }
    
};

var isPresArray=false;


//...Add new presentaion information ..//
var new_preName;

var DialogAdd_info =
{
   
    actionAddAlbum: function()
    {
     //   is_edit_pres=false;
        new_preName=$('#txtAName').val();
        var preId=$('#optAPres').val();
        
        if(new_preName.length >0)
        {
            presentationId=preId;
            /*handle the menu close*/
            $('#optAPres').selectmenu('close');
            $.mobile.changePage('#orden_own');
            PageOrder.init(false);
            $('#sortableGrid').disableSelection();
        }
        else
        {
            navigator.notification.alert('Please insert the name', [], 'Message', 'ok');
        }
    }
};



/*---------------------add new presentaion----------------------*/
$( document ).on( "vclick", "#btnAddAlbum", function()
 {
      DialogAdd_info.actionAddAlbum();
 });
/*---------------------show dialog----------------------*/
$( document ).on( "vclick", "#id_show_dialog", function()
 {
         GetPresentationList.initEvents();
               
         $('#sortable').sortable();
         $('#sortable').disableSelection();
         $('#sortable').bind("sortstop", function(event, ui) {
                PageOrder.actionOrdena();
         });
         $.mobile.changePage('#dlgAddAlbum', 'pop', true, true);
         $('#txtAName').val("");
        
 });


///*******-----------------------Show presentaion editable page-------------------------******/

/*managing the editable function is working like delete or add*/
var editablePres_flag=false;
var is_edit_pres;

var PageOrder=
{
    init:function(is_edit){
        console.log("pop up flag");
        $.mobile.selectmenu.prototype.options.nativeMenu = false;
        $('select').selectmenu('disable');
        $('select').selectmenu('close');
        is_edit_pres = is_edit;
        isPresArray=true;
        if(localStorage.getItem("dbCreated")!=true){
            var db = window.openDatabase("campaign", "1.0", "campaign db", 1000000);
            db.transaction(PageOrder.populateDB,PageOrder.errorDB,PageOrder.successDB);
        }
    },
        
    populateDB:function(tx){
        var sqlSlite;
        
        if(presentationId==1){
            sqlSlite = "select distinct pc.slide_id, s.name,s.path,s.htmlData from presentationCampaign as pc, assets as s where s.id = pc.slide_id  and pc.pres_id = "+presentationId;
            
        }else {
            
            sqlSlite = "select pc.slide_id, s.name,s.path,s.htmlData from presentationCampaign as pc, assets as s where s.id = pc.slide_id  and pc.pres_id = "+presentationId;
            
        }
        
        tx.executeSql(sqlSlite,[],PageOrder.actionLoadPages);
    },
  
    errorDB: function(){
        alert('error'+tx);
    },
    successDB: function(){
    },
    
    
    
    // show the list of slides....
    actionLoadPages: function(tx,results)
    {
        
        
        
            document.getElementById('sortable').innerHTML="";
            var htmlSort = "";
            var len = results.rows.length;
            data.slideList = [len];
            dataCurrent.slideList=[len];

        
        for(var i =0;i<len;i++)
        {
            data.slideList[i] = results.rows.item(i);
            data.slideList[i].isSelect=true;
            dataCurrent.slideList[i]=data.slideList[i];
            var str_htmlData="";
            var encode_str_htmlData="";
            encode_str_htmlData=escape(str_htmlData);
            str_htmlData=data.slideList[i].htmlData;
            
            
            var strHtmlData = new String(data.slideList[i].htmlData);
             htmlSort+='<li name="'+data.slideList[i].name+'" slide_id="'+data.slideList[i].slide_id+'" pag="'+data.slideList[i].path+'" isSelect="'+data.slideList[i].isSelect+'" htmlData="'+encode_str_htmlData+'" >';
            if(data.slideList[i].path=='')
            {
                htmlSort += '<img  width="200px" height="148px" id="'+dataCurrent.slideList[i].name+'" src="img/preview_not.png"/>';

            }
            else
            {
                htmlSort += '<img  width="200px" height="146px" id="'+dataCurrent.slideList[i].name+'" src="'+data.slideList[i].path+'"/>';
            }
           
            htmlSort+='</li>';
        }
        var sqlSlite;
        sqlSlite = "select distinct pc.slide_id, s.name,s.path,s.htmlData from presentationCampaign as pc, assets as s where s.id = pc.slide_id  and pc.pres_id ='1'";
        console.log("%@",sqlSlite);
        tx.executeSql(sqlSlite,[],function(tx,results)
        {
                                               
              for(var k=0;k<results.rows.length;k++)
              {
                      var checkFlag=false;
                      for(var l=0 ;l<data.slideList.length;l++)
                      {
                          if(results.rows.item(k).slide_id == data.slideList[l].slide_id)
                          {
                              checkFlag=true;
                          }
                      }
                      if(checkFlag ==  false)
                      {

                            data.slideList.push(results.rows.item(k));
                      }
              }
        });
     
        $('#sortable').html(htmlSort);
        $('#sortable').sortable();
        $('#orden_own .count-pages').text(len);

    },
    actionOrdena: function()
     {

         var tempArray=[];
         tempArray=data.slideList;
         var orden = [];
         $('#sortable li').each(function()
         {
            var obj =
            {
                  slide_id:$(this).attr('slide_id'),
                  name:$(this).attr('name'),
                  path: $(this).attr('pag'),
                  htmlData:$(this).attr('htmlData'),
                  isSelect:$(this).attr('isSelect')
            };
            orden.push(obj);
         });
         data.slideList=[];
         data.slideList=orden;
         for(var i=0;i<tempArray.length;i++)
         {
             console.log("temp array value : "+tempArray[i].isSelect);
             if(!tempArray[i].isSelect)
             {
                 data.slideList.push(tempArray[i]);
             }
         }
        
    }
};

/*********----------End Show presentaion editable page--------------*************/

/*---------------------manage click of add button in odren page----------------------*/
$( document ).on( "click", "#id_addSlide", function()
{
     AlbumEdit_own.initSelection();
});
/**------End editAlbum presentaion page-------------*************/

var AlbumEdit_own =
{
   actionTouch: function(obj){
        $(obj).find('span.mark').toggleClass('selected');
    
    },
    
    
    //................Back Button of Edit to New Presentation..................
    
    actionLoadPages_back: function()
    {
        var selected=document.getElementById("gridEdit");
        var slectionArray = selected.getElementsByTagName('li');
       /* if(editablePres_flag == true) // if = true... MOved
        {
            console.log("editable flag : "+editablePres_flag);
        
            for(var i=0;i<slectionArray.length;i++)
            {
                var isSelect = slectionArray[i].children[1].className;
                if(isSelect =='mark selected')
                {
                   
                    var obj = {
                        slide_id:slectionArray[i].getAttribute('slide_id', 0),
                        name: slectionArray[i].getAttribute('name', 0),
                        path:slectionArray[i].getAttribute('pag', 0),
                        htmlData:slectionArray[i].getAttribute('htmlData', 0),
                       };
                       data.slideList.push(obj);
                }
            }
            
        }
        else
        {

          for(var j = slectionArray.length-1;j>=0;j--)
          {
               var isSelect = slectionArray[j].children[1].className;
               if(isSelect =='mark')
               {
                  for(var k=data.slideList.length-1;k>=0;k--)
                  {
                      if(slectionArray[j].children[1].id == data.slideList[k].name)
                      {
                          data.slideList.splice(k,1);
                          break;
                      }
                  }
               }
            }
        }*/
        data.slideList=[];
        
        for(var i=0;i<slectionArray.length;i++)
        {
            
            
            var isSelect = slectionArray[i].children[1].className;
            if(isSelect =='mark selected')
            {
                var obj = {
                slide_id:slectionArray[i].getAttribute('slide_id', 0),
                name: slectionArray[i].getAttribute('name', 0),
                path:slectionArray[i].getAttribute('pag', 0),
                htmlData:slectionArray[i].getAttribute('htmlData', 0),
                isSelect:true
                };
                data.slideList.push(obj);
               
            }
            else
            {
                var obj = {
                slide_id:slectionArray[i].getAttribute('slide_id', 0),
                name: slectionArray[i].getAttribute('name', 0),
                path:slectionArray[i].getAttribute('pag', 0),
                htmlData:slectionArray[i].getAttribute('htmlData', 0),
                isSelect:false
                };
                data.slideList.push(obj);
            }
             
        }
     
        AlbumEdit_own.actionLoadPages_back_editMode();
        
    },
    
    
   
    //...............manage click of pencil icon.........
    actionLoadPages_back_editMode:function()
    {
        document.getElementById('sortable').innerHTML="";
        var htmlSort = "";
        var selectedCount=0;
        var len = data.slideList.length;
         for(var k =0;k<len;k++) {
            
            var str_htmlData=data.slideList[k].htmlData;
            var encode_str_htmlData=escape(str_htmlData);
            if(data.slideList[k].isSelect)
            {
                selectedCount++;
                htmlSort+='<li name="'+data.slideList[k].name+'" slide_id="'+data.slideList[k].slide_id+'" pag="'+data.slideList[k].path+'" isSelect="'+data.slideList[k].isSelect+'" htmlData="'+encode_str_htmlData+'">';
                
                if(data.slideList[k].path=='')
                {
                    htmlSort += '<img  width="200px" height="148px" id="'+data.slideList[k].name+'" src="img/preview_not.png"/>';
                }
                else
                {
                    htmlSort += '<img  width="200px" height="146px" id="'+data.slideList[k].name+'" src="'+data.slideList[k].path+'"/>';
                }
               htmlSort+='</li>';
            }
        }
        $('#sortable').html(htmlSort);
        $('#sortable').sortable();
        $('#orden_own .count-pages').text(selectedCount);
         editablePres_flag=false;
        $.mobile.changePage('#orden_own');

    },
    
    
    
    //...............Edit Page Of new presentation.........
    
    initSelection: function()
    {
        var currentPres = dataCurrent.slideList;
        var currentAlbum = dataCurrent.slideList[data.current.iAlbum];
       
       
        var html_c = "";
        $('#gridEdit').html("");
        
        dataCurrent.slideList=data.slideList;

        
        
        $('#editAlbum_own .count-pages').text('('+dataCurrent.slideList.length+')');
        
        for(var i=0;i<dataCurrent.slideList.length;i++)
        {

            var str_htmlData=data.slideList[i].htmlData;
            var encode_str_htmlData=escape(str_htmlData);
            
            html_c += '<li isSelect="'+dataCurrent.slideList[i].isSelect+'" name="'+dataCurrent.slideList[i].name+'" slide_id="'+dataCurrent.slideList[i].slide_id+'" pag="'+dataCurrent.slideList[i].path+'" htmlData="'+encode_str_htmlData+'" >';
            if(dataCurrent.slideList[i].path=='')
            {
                html_c += '<img  width="200px" height="146px" id="'+dataCurrent.slideList[i].name+'" src="img/preview_not.png"/>';
            }
            else
            {
                html_c += '<img  width="200px" height="146px" id="'+dataCurrent.slideList[i].name+'" src="'+dataCurrent.slideList[i].path+'"/>';
            }
         
            html_c += '<span id="'+dataCurrent.slideList[i].name+'" class="mark';
            if(dataCurrent.slideList[i].isSelect)
            {
               if(editablePres_flag == false)
                {
                    html_c += ' selected';
               }
            }
            html_c += '"></span>';
            html_c += '</li>';
        }

        $('#gridEdit').html(html_c);
        $.mobile.changePage('#editAlbum_own');
    },
    
    
    //..................manage list of check list............
   
};




    


//.................................Othere Functions..............................//
var data = {
current:{
iAlbum:0,
iPage:0,
album: function(){
    return data.albums[data.current.iAlbum];
}
},
albums:[],
pres:[],
slideList:[],
};


var dataCurrent = {
slideList:[]
};


/*manage back */
function goBack(id)
{

    $.mobile.changePage("#"+id);
}

/*manage login click*/
$( document ).on( "vclick", "#btnLogin", function() {
                 $.mobile.changePage("#page1");
                 createCampan.initEvents();
                 });
/*manage slide gallary event*/

var footerSlideFlag=true;



function dubbleClick()
{
    console.log("hello");

}
$(document ).on( "tap", "#id_btnOpenMenu", function() {
    if(footerSlideFlag == true)
    {
        footerSlideFlag=false;
        $("#id_slide_footer").slideDown(300);
    }
    else
    {
        $("#id_slide_footer").slideUp(300);
        footerSlideFlag=true;
    }
           
});

$(document ).on( "tap", "#id_swipSlide1", function() {
                
                if (firing)
                {
                popupAc(this.id);
                clearTimeout(timer);
                firing = false;
                return;
                }
                firing = true;
                timer = setTimeout(function() {
                                   begen(this.id);
                                   clearTimeout(timer);
                                   firing = false;
                                   },400);
                
                
                
                });
                
$(document ).on( "vclick", "#id_swipSlide1", function() {
                
                console.log("vclick");
                
                
                
                });

/*
 
 manage dubble click in slide show
 
 */
var double_clicl_flag=0;
var time_out_handler='';


$(document ).on( "tap", "#id_swipSlide1", function() {

    if(footerSlideFlag == true)
    {
        footerSlideFlag=false;
        $("#id_slide_footer").slideDown(300);
    }
    else
    {
        $("#id_slide_footer").slideUp(300);
        footerSlideFlag=true;
    }

});



var timer;
var firing = false;
var begen = function(id) {
    console.log("oneclick");
};

function reset_double_click_timer(){
   // console.log("double click reset");
    double_clicl_flag=0;
}

var popupAc = function(id) {
    console.log("dubbleClick");
    if(footerSlideFlag == true)
    {
        footerSlideFlag=false;
        $("#id_slide_footer").slideDown(300);
        
    }
    else
    {
        $("#id_slide_footer").slideUp(300);
        footerSlideFlag=true;
        
    }


};



function temp_dbClick()
{
   // alert("readonly");
}

/*manage slide gallary operation */
$( document ).on( "vclick", "#btnPause", function()
                 {
    if(timerFlag == false)
    {
        $("#btnPause .ui-btn-text").text("Play");
        timerFlag=true;
        stopTimer(varTimer);
    }
    else
    {
        $("#btnPause .ui-btn-text").text("Pause");
        timerFlag=false;
        varTimer=setInterval(function(){slideTimer()},3000);
    }
        
});
$( document ).on( "vclick", "#btnFinish", function() {
     stopTimer(varTimer);
     timerFlag=true;
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

         TimerCountEntry.initEvents();
     }
     else
     {
             
         syncronizationProcess_callsTabel();
     }
                 
                 
    
                 
});
/*call web servie to syncronize call talbel*/
function syncronizationProcess_callsTabel()
{
   //   alert("syncronizationProcess");
    
    /*store all silde information for master presentaion */
    end_time = new Date();
    var diference =  Math.round((end_time-start_time)/1000);
    var pres_visit_time = timeFormatter(diference);
    var urlOwn = webService_URL+"/data2.php?cn="+client_name+"&sd="+start_time+"&ed="+end_time+"&ds="+diference+"&pn="+presentation_name;
    $.mobile.showPageLoadingMsg();
    $.post( urlOwn,{val:""},
       function(data)
       {
           $.mobile.hidePageLoadingMsg();
           showPresentation.pres_data(cid);
           $.mobile.changePage("#albumsList");
           
        }).error(function(data)
        {
             navigator.notification.alert('please try again', [], 'Error', 'ok');
             $.mobile.hidePageLoadingMsg();
             showPresentation.pres_data(cid);
             $.mobile.changePage("#albumsList");
            
        });
  
}


$( document ).on( "vclick", "#btnHome", function() {
                
                 stopTimer(varTimer);
                  timerFlag=true;
                 $.mobile.changePage("#page1");
                 createCampan.initEvents();
                 });

/*manage timer for sliding*/


function slideTimer()
{
    swipSlide.next();
    
}

function stopTimer(timer)
{
    clearInterval(timer);
}

function timeFormatter(totalSec)
{
    hours = parseInt( totalSec / 3600 ) % 24;
    minutes = parseInt( totalSec / 60 ) % 60;
    seconds = totalSec % 60;
    
    result = (hours < 10 ? "0" + hours : hours) + "-" + (minutes < 10 ? "0" + minutes : minutes) + "-" + (seconds  < 10 ? "0" + seconds : seconds);
    return result;
}




/*------------manage click of editable funcationality--------------*/
$( document ).on( "click", "#editAlbum_back", function(event, ui)
{
    event.stopImmediatePropagation();
    AlbumEdit_own.actionLoadPages_back();

});
$( document ).on( "click", "#editAlbum_add", function(event, ui)
{
   event.stopImmediatePropagation();
   AlbumEdit_own.actionLoadPages_back();

});

$( document ).on( "vclick", "#gridEdit li", function(event, ui)
{
    AlbumEdit_own.actionTouch(this);
});
/*manage prev slide list with all infomarion for selected slides*/
var data_slide_prev = {
slideList:[],
};

/*go to view album*/
$( document ).on( "vclick", "#id_order_home", function(event, ui)
{
    
     checkedSlideLength=0;
     data_slide_prev.slideList=[];
     for(var j=0;j<data.slideList.length;j++)
     {
        if(data.slideList[j].isSelect)
        {
                 data_slide_prev.slideList.push(data.slideList[j]);
        }
     }
     //alert(data_slide_prev.slideList.length+"------------"+data.slideList.length);
     /*manage slide is available for preview or not*/
     if(data_slide_prev.slideList.length > 0)
     {
         $.mobile.changePage('#viewAlbum_own');
         slide_prev_index=0;
         PagesView.refresh();
         PagesView.swipeEvents();
     }
     else
     {
        navigator.notification.alert("Select at least 1 slide to save presentation", [], 'Message!', 'ok');
     }
     
   
});

/*click next button*/
$( document ).on( "vclick", "#btnViewNext", function(event, ui)
{
    PagesView.goNext();
});
/*click previous button*/
$( document ).on( "vclick", "#btnViewPrev", function(event, ui)
{
    PagesView.goPrev();
});


var slide_prev_index=0;
var checkedSlideLength=0;

/*manage ablum view for add new presentation*/
var PagesView = {
    swipeEvents: function()
    {
        $('#editAlbum').bind("swiperight", function(event, ui) {
                  
                             PagesView.goNext();
         });
        $('#editAlbum').bind("swipeleft", function(event, ui) {
                     
                             PagesView.goNext();
         });
        },
    goNext: function(){
        if(slide_prev_index+1 < data_slide_prev.slideList.length){
            slide_prev_index++;
        }
        PagesView.refresh();
    },
    goPrev: function(){
        if(slide_prev_index> 0){
            slide_prev_index--;
        }
        PagesView.refresh();
    },
    refresh: function(){

        
        if(slide_prev_index==0){
            $('#btnViewPrev').hide();
        }else{
            $('#btnViewPrev').show();
        }
        if(slide_prev_index==data_slide_prev.slideList.length-1){
            $('#btnViewNext').hide();
        }else{
            $('#btnViewNext').show();
        }
        $('#viewAlbum_own span.count-now').text(slide_prev_index+1);
        $('#viewAlbum_own span.count-total').text(data_slide_prev.slideList.length);
        $('#viewAlbum_own span.headtitle').text(data_slide_prev.slideList[slide_prev_index].name);
        if(data_slide_prev.slideList[slide_prev_index].name=='')
        {
            var str_encode_htmlData="";
            var str_encode_htmlData=data_slide_prev.slideList[slide_prev_index].htmlData;
            var str_decode_htmlData="";
            var str_decode_htmlData=unescape(str_encode_htmlData);
            $('#viewPage').html('<div style="margin-top:40px;margin-bottom:40px;width:1024px;height:748px">'+str_decode_htmlData+'</div>');
        }
        else
        {
            $('#viewPage').html('<img width="1024px" height="748px" src="'+data_slide_prev.slideList[slide_prev_index].path+'">');
        }
        
    }
};

/*handel click of edit button in viewAlbum (pencil icon)*/
$( document ).on( "click", "#id_viewAlbum_edit", function(event, ui)
{
    
    AlbumEdit_own.actionLoadPages_back_editMode();
    $('#sortableGrid').disableSelection();
    $.mobile.changePage('#orden_own');
});
/*handel click of edit button in viewAlbum*/
$( document ).on( "vclick", "#id_viewAlbum_home", function(event, ui)
{
         
                 AddPresentation.open_db();
                 $.mobile.changePage("#page1");
                 editablePres_flag=false;
                 edit_pres_name="";
                 createCampan.initEvents();
});


//................ Insert New Presentation..............//

/*
 manage edit functionalty to check the is_edit_pres variable , if they true it means presentaion will upadate ot they will delete.
 
 */

var AddPresentation ={
    
       
    open_db:function(){
            if(localStorage.getItem("dbCreated")!=true){
            var db = window.openDatabase("campaign", "1.0", "campaign db", 1000000);
            db.transaction(AddPresentation.populateDB,showRightPanel.errorDB,showRightPanel.successDB);
        }
    },

    populateDB:function(tx){
 
        if(is_edit_pres == false){
            var sql = "INSERT INTO presentation (name,as_id,master_id) VALUES ('"+new_preName+"',"+data.slideList[0].slide_id+",0)";
            tx.executeSql(sql,insertData.error,insertData.success);
        
            var sqlId = "SELECT max (id) as id FROM presentation";
            tx.executeSql(sqlId,insertData.error,AddPresentation.insertSlides);
       
        }
        else
        {
            var sqlDelPresCamp = "delete from presentationCampaign where pres_id ="+pres_id;
            tx.executeSql(sqlDelPresCamp,insertData.error,AddPresentation.insertSlides);

             
        }
    },
    
    insertSlides: function(tx,results) {
        if(is_edit_pres){
            for(var i=0; i<data.slideList.length; i++){
                if(data.slideList[i].isSelect)
                {

                    var inserSql = "INSERT INTO presentationCampaign(pres_id,slide_id,camp_id) VALUES ("+pres_id+","+data.slideList[i].slide_id+","+cid+")";

                    tx.executeSql(inserSql,insertData.error,insertData.success);
                }
            }

        }
        
        else
        {
            var pres_id5 = results.rows.item(0);
            for(var i=0; i<data.slideList.length; i++){
                if(data.slideList[i].isSelect)
                {
                    var inserSql = "INSERT INTO presentationCampaign(pres_id,slide_id,camp_id) VALUES ("+pres_id5.id+","+data.slideList[i].slide_id+","+cid+")";

                    tx.executeSql(inserSql,insertData.error,insertData.success);
                }
            }
        }// end of else
    },
    
    showArert:function(){

    }
}





/*click to handle progress window*/

$( document ).on( "vclick", "#btnSync", function(event, ui)
{
     $.mobile.changePage('#id_progressbar', 'pop', true, true);
     syncronizationProcess();
});


 var downloadListArray=[];
 var slidesArray=[];




/*manage sync web service*/
function syncronizationProcess()
{
    //alert("syncronizationProcess");
    
    /*store all silde information for master presentaion */
    var slidesArray;
    storeCounter=0;
    $( "#progressbar" ).progressbar({value: 0});
    $( "#id_completedFile" ).text("Completed file : 0");
    $( "#id_totalFile" ).text("Total Files : 0");
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
        mts_notification(states[networkState],'Error','ok');
        navigator.notification.alert(states[networkState], [], 'Error', 'ok');
    }
    else
    {
        $.post( webService_URL+"/data1.php",{val:""},
               function(data)
               {

               downloadListArray=[];
               var slidesArray=data.slides;
               var obj={
                   main_image:"false",
                   is_html:false,
                   html_data:"",
                   image_name:data.pres_name,
                   imageURL:data.pres_img
                }
               downloadListArray.push(obj);
               for(var i=0;i<slidesArray.length;i++)
               {
                    if(slidesArray[i].is_html == "false")
                    {
                        var obj={
                            main_image:"true",
                            is_html:false,
                            html_data:"",
                            image_name:slidesArray[i].s_name,
                            imageURL:slidesArray[i].s_img
                        }
                        downloadListArray.push(obj);
                    }
                    else
                    {
                       var obj={
                           main_image:"",
                           is_html:true,
                           html_data:slidesArray[i].html_data,
                           image_name:"",
                           imageURL:""
                       }
                       downloadListArray.push(obj);
                   }
               }

   
               store_assets(downloadListArray);
               
               
               }).error(function(data)
                {
                    navigator.notification.alert('please try again', [], 'Error', 'ok');
                });
    }
    window.localStorage.setItem("sync_flag","true");
    
    
}

var storeCounter=0;
/*manage sycronization process for assets folder*/
function store_assets(downloadListArray)
{

    var slideArray=downloadListArray;
    $( "#id_totalFile" ).text("Total Files : "+slideArray.length);
    var localObj=slideArray[storeCounter];
    if(slideArray.length>storeCounter)
    {
        if(localObj.is_html== false)
        {
            var imageName=localObj.image_name;
            var dirName;
            if(localObj.main_image == "false")
            {
                dirName="thumbNail";
            }
            else
            {
               dirName="slides";
            }
               
            $( "#id_currentFile" ).text("Current file name : "+imageName);
             window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
             function onFileSystemSuccess(fileSystem)
             {
              
             fileSystem.root.getDirectory(dirName, {create: true, exclusive: false},                                     
              
                 function gotFileEntry(fileEntry)
                 {
                   var sPath = fileEntry.fullPath;
                   var fileTransfer = new FileTransfer();
                   fileEntry.remove();

                                     
                     fileTransfer.download(localObj.imageURL,sPath+"/"+imageName+".jpg",
                       function(theFile)
                       {
                            downloadListArray[storeCounter].imageURL=theFile.toURI();
                           if(slideArray.length>=storeCounter)
                           {
                                   storeCounter++;
                                   $( "#id_completedFile" ).text("Completed file : "+storeCounter);
                                   store_assets(slideArray);
                           }
                           
                       },
                       function(error)
                       {
                           console.log("download error source " + error.source);
                           console.log("download error target " + error.target);
                           console.log("upload error code: " + error.code);
                       }
                       );
                     fileTransfer.onprogress = function(progressEvent) {
                         if (progressEvent.lengthComputable)
                         {
                            var intvalue = Math.floor( (progressEvent.loaded / progressEvent.total)*100 );
                            $( "#progressbar" ).progressbar({
                                                                     value: intvalue
                                                                     });
                   
                         } else {
                         
                             loadingStatus.increment();
                         }
                     };
                                     
                 },
                 fail);
             },
             fail);
        }
        else
        {
            if(slideArray.length>=storeCounter)
            {
                storeCounter++;
                $( "#id_completedFile" ).text("Completed file : "+storeCounter);
            }
            else
            {
                storeCounter++;
                $( "#id_completedFile" ).text("Completed file : "+storeCounter);
            }
            store_assets(slideArray);
        }
    }
    else
    {
        storeCounter=0;
        synchronising.init();
        $.mobile.changePage("#page1");
        createCampan.initEvents();
        
    }
    
}

function fail(evt) {
   
    console.log(evt.target.error.code);
}

/*manage syncronization record for call tabel that have record for clients and visinting info */
var callTabel;

/*data base intry for sync prpcess*/
var synchronising = {
    
    init:function(){
        isPresArray=true;
        if(localStorage.getItem("dbCreated")!=true){
            var db = window.openDatabase("campaign", "1.0", "campaign db", 1000000);
            db.transaction(synchronising.populateDB,PageOrder.errorDB,PageOrder.successDB);
        }

    },
        
    populateDB:function(tx){
       
        var sqlDeletePres = "delete from presentation where id =1";
        var sqlDeleteCamp=  "delete from presentationCampaign where pres_id=1";

        tx.executeSql(sqlDeletePres,[],function(tx,results)
        {
           // alert(sqlDeletePres);
               
        });
        
        tx.executeSql(sqlDeleteCamp,[],function(tx,results)
        {
           // alert(sqlDeleteCamp);

        });
       
        for(var i=0;i< downloadListArray.length; i++)
        {
            var localObj=downloadListArray[i];
            var thumbStatus;
       
            if(localObj.main_image == "false")
                thumbStatus=1;
            else
                thumbStatus=0;
     
            var insertAsset = "insert into assets(name, path, htmlData,isThumb, isMaster) values('"+localObj.image_name+"','"+localObj.imageURL+"','"+localObj.html_data+"',"+thumbStatus+",1)";
            tx.executeSql(insertAsset,[],function(tx,results)
            {
                   // console.log("success for insert assets");
            });
        }

        var thumbNail_assetId;
   
            var getassetId = "select max(id) as id from assets where isMaster = 1 and isThumb = 1";
            tx.executeSql(getassetId,[],function(tx,results)
            {
            
            thumbNail_assetId=results.rows.item(0).id;
            var inserPresentation = "INSERT INTO presentation VALUES (1,'"+downloadListArray[0].image_name+"',"+results.rows.item(0).id+",1)";
            tx.executeSql(inserPresentation,[],function(tx,results)
            {
             var getMasterAssets = "select id from assets where isMaster = 1 and isThumb = 0 and id > "+thumbNail_assetId;
                          
                tx.executeSql(getMasterAssets,[],function(tx,results)
                {
                  var Array_AssetId=results.rows;
                  var campaignIdList = "select id from campaigns";         
                  tx.executeSql(campaignIdList,[],function(tx,results)
                  {
                        var Array_CampaignsId=results.rows;
                       
                        for(var i=0;i<Array_CampaignsId.length;i++)
                        {
                        
                                for(var j=0;j<Array_AssetId.length;j++)
                                {
                                
                                    var pres_campaignIds="insert into presentationCampaign(pres_id, slide_id, camp_id) values(1,"+Array_AssetId.item(j).id+","+Array_CampaignsId.item(i).id+")";
                                    tx.executeSql(pres_campaignIds,insertData.error,insertData.success);
                                }
                        }
                   });

                });
                          
              });
            });
          
        /*syncronization start for calls tabel*/
        var sql_calls="select * from  calls";
        tx.executeSql(sql_calls,[],function(tx,results)
        {
              callTabel=[];
              callTabel=results.rows;
              var isSuccess=false;
              for(var l=0;l<callTabel.length;l++)
              {
                      
                    var urlOwn = webService_URL+"/data2.php?cn="+callTabel.item(l).client_name+"&sd="+callTabel.item(l).start_time+"&ed="+callTabel.item(l).finish_date+"&ds="+callTabel.item(l).duration+"&pn="+callTabel.item(l).presentation_name;
                    $.mobile.showPageLoadingMsg();
                    $.post( urlOwn,{val:""},
                    function(data)
                    {
                        isSuccess=true;
                        console.log("data successfully inserted : "+data.result);
                        $.mobile.hidePageLoadingMsg();
                        
                    }).error(function(data)
                    {
                        navigator.notification.alert('please try again', [], 'Error', 'ok');
                        $.mobile.hidePageLoadingMsg();
                  });
              }
              tx.executeSql("delete from calls",[],function(tx,results)
              {
                            console.log("delete all records in call tabel");
              });
       });
      
        
    navigator.notification.alert('Syncronization Completed', [], 'Message', 'ok');

 }
};


/*close the edit pop of the presentaion list window*/

$( document ).on( "vclick", "#id_close_pop_modificar", function(event, ui)
{
    $("#dlgEditAlbum").popup("close");
});

/*manage delete in presentaion list*/
$( document ).on( "vclick", "#id_delete_pres", function(event, ui)
{
    deletePresentation.open_db(pres_id);
});
/*---------------------edit existing presentaion----------------*/
var DialogEdit_info =
{
    
    actionAddAlbum: function()
    {
        preName=edit_pres_name;
        presentationId=pres_id;
        $.mobile.changePage('#orden_own');
        PageOrder.init(true);
        $('#sortableGrid').disableSelection();
       
    }
};

/*manage edit in presentaion list*/
$( document ).on( "vclick", "#id_edit_pres", function(event, ui)
{
    console.log("id_delete_pres");
    DialogEdit_info.actionAddAlbum();
});
