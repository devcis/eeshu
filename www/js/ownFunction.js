
var insertData = {
    
      assets:function(tx){
          
            tx.executeSql("insert into assets(name, path, htmlData,isThumb, isMaster) values ('cmp0.png','img/cmp0.png','',0,0)",insertData.error,insertData.success);
            tx.executeSql("insert into assets(name, path, htmlData,isThumb, isMaster) values ('cmp1.png','img/cmp1.png','',0,0)",insertData.error,insertData.success);
            tx.executeSql("insert into assets(name, path, htmlData,isThumb, isMaster) values ('cmp2.png','img/cmp2.png','',0,0)",insertData.error,insertData.success);
            tx.executeSql("insert into assets(name, path, htmlData,isThumb, isMaster) values ('cmp3.png','img/cmp3.png','',0,0)",insertData.error,insertData.success);
            tx.executeSql("insert into assets(name, path, htmlData,isThumb, isMaster) values ('cmp4.png','img/cmp4.png','',0,0)",insertData.error,insertData.success);
            tx.executeSql("insert into assets(name, path, htmlData,isThumb, isMaster) values ('cmp5.png','img/cmp5.png','',0,0)",insertData.error,insertData.success);
            tx.executeSql("insert into assets(name, path, htmlData,isThumb, isMaster) values ('cmp0.png','img/cmp0.png','',0,0)",insertData.error,insertData.success);
            tx.executeSql("insert into assets(name, path, htmlData,isThumb, isMaster) values ('cmp1.png','img/cmp1.png','',0,0)",insertData.error,insertData.success);
            tx.executeSql("insert into assets(name, path, htmlData,isThumb, isMaster) values ('cmp2.png','img/cmp2.png','',0,0)",insertData.error,insertData.success);
            tx.executeSql("insert into assets(name, path, htmlData,isThumb, isMaster) values ('cmp3.png','img/cmp3.png','',0,0)",insertData.error,insertData.success);
     
        },
    
        campaign:function(tx){
    
   
    
            tx.executeSql("insert into campaigns(name,asset_id) values('Campaign1',1)",insertData.error,insertData.success);
            tx.executeSql("insert into campaigns(name,asset_id) values('Campaign2',2)",insertData.error,insertData.success);
            tx.executeSql("insert into campaigns(name,asset_id) values('Campaign3',3)",insertData.error,insertData.success);
            tx.executeSql("insert into campaigns(name,asset_id) values('Campaign4',4)",insertData.error,insertData.success);
            tx.executeSql("insert into campaigns(name,asset_id) values('Campaign5',5)",insertData.error,insertData.success);
            tx.executeSql("insert into campaigns(name,asset_id) values('Campaign6',6)",insertData.error,insertData.success);
            tx.executeSql("insert into campaigns(name,asset_id) values('Campaign7',1)",insertData.error,insertData.success);
            tx.executeSql("insert into campaigns(name,asset_id) values('Campaign8',2)",insertData.error,insertData.success);
            tx.executeSql("insert into campaigns(name,asset_id) values('Campaign9',3)",insertData.error,insertData.success);
            tx.executeSql("insert into campaigns(name,asset_id) values('Campaign10',4)",insertData.error,insertData.success);
            tx.executeSql("insert into campaigns(name,asset_id) values('Campaign11',5)",insertData.error,insertData.success);
            tx.executeSql("insert into campaigns(name,asset_id) values('Campaign12',6)",insertData.error,insertData.success);
  
        },
        presentation:function(tx){
            
            tx.executeSql("INSERT INTO presentation VALUES (1,'presentation-1',13,1)",insertData.error,insertData.success);
            tx.executeSql("INSERT INTO presentation VALUES (2,'presentation-2',14,0)",insertData.error,insertData.success);
            tx.executeSql("INSERT INTO presentation VALUES (3,'presentation-3',15,0)",insertData.error,insertData.success);
            tx.executeSql("INSERT INTO presentation VALUES (4,'presentation-4',16,0)",insertData.error,insertData.success);
            tx.executeSql("INSERT INTO presentation VALUES (5,'presentation-5',17,0)",insertData.error,insertData.success);
            
        },

        success:function(){

        },
        error:function(){
            alert('error');
        },
    
    
        getCompaign :function(){
           tx.executeSql("select assets.name as asset_name,campaigns.name as campaign_name, campaigns.id as campaign_id from assets , campaigns where  assets.id =  campaigns.asset_id",insertData.error,insertData.processCampaign);
        }
    
};
