
var Core = {
	pages:{},
	
addPage: function(page_id, page_obj){
        
		Core.pages[page_id] = page_obj;
	},
	init: function(){
		$(document).bind("pageinit", function(event, ui) {
                         
                   //      $.mobile.defaultPageTransition = 'none';

                         
			var idPage = $(event.target).attr('id');
			var cPage = Core.pages[idPage];
            if(typeof(cPage)!="undefined") {
				cPage.initEvents();
                
			}
		});
	}
};

Core.init();






var ListView = function(id) {

	var targetId = id;
	return {
		elements: [],
        
		addElement: function(obj){

			this.elements.push(obj);
		},
        
		render: function(){
			var chtml = "";
            
            $(this.elements).each(function(){
				attrs = '';
				$(this.attr).each(function(){
                                  
					attrs+= ' '+this;
                         
                });
                    var presMasterId= this.presMaster;
                    chtml+='<li id ="'+this.presId+'" value='+presMasterId+' class="presentation_class" onClick="openRightPannel('+this.presId+',\''+this.img+'\',\''+this.presName+'\');"><a href="'+this.href+'" data-transition="slide"'+attrs+'><img width="200px" height="146px" src="'+this.img+'" /><br clear="all">'+this.content+'</a></li>';
                                  });
            
            
			$(targetId).html(chtml)
        }
	}
};



var pres_id;
var masterId;  // either Master Presentation or Not to delete
/*manage to edit prsentation funcationality*/
var edit_pres_name;

// long press event to delete the Presentation............

$( document ).on( "taphold", ".presentation_class", function() {
     pres_id = this.id;
     edit_pres_name=$(this).attr('name');
     if(this.value == 1)
     {
     alert("Master presentaion can not be delete");
     }
    else
    {
      $("#dlgEditAlbum").popup("open");
     //navigator.notification.confirm('Are you sure!', onConfirm,'Delete','Yes,Cancel');
     }
});





function onConfirm(buttonIndex) {
    
    if(buttonIndex == 1) // 1 for  "Yes",   2 = "Cancel"
        
        deletePresentation.open_db(pres_id);
    else
        alert('Canceled');
}

