(function($){

		var plugname="qmultiplyfileupload";

		var  defaultoptions = {
			  selector      : this.selector
		};

		$.fn[plugname]=function()
		{
			var isMethodCall=arguments.length>0 && typeof arguments[0] === "string";
			if(isMethodCall)
			{
				var methodname=arguments[0];
				var args = Array.prototype.slice.call(arguments,1);
				this.each(function() {
					var instance = $.data( this,plugname);
					if(instance && $.isFunction( instance[methodname] ))
					{
						var method=instance[methodname];
						method.apply(instance,args);
					}
				});
			}else{
				var inputoptions = arguments;
				$(this).each(
						function ()
						{
							var optionsnew = $.extend( {}, defaultoptions);
							if(inputoptions.length>0)
							{
									optionsnew=$.extend(optionsnew,inputoptions[0]);
							}
							var instance=$(this).data(plugname);
							if(instance)
							{
								instance.init(optionsnew);
							}else
							{
								var target=$(this);
								instance=new PluginObject(target);
								instance.init(optionsnew);
								$(this).data(plugname,instance);
							}
						}
					);
					return this;
			};
		}


		function UploadManager()
		{
			this.uploadSingleFile=function(file){
				var formdata=new FormData(); 
				formdata.append("upfile" ,file);
				formdata.append("action","uploadimage");
				return $.ajax({
		           type : 'post',
		           url :'http://localhost:8080/BossAppm/systemController.do?picPuload',
		           data : formdata,
		           cache : false,
		           processData : false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
		           contentType : false,//"application/json",//false, // 不设置Content-type请求头
		           success : function(data){
		           		console.log(data);
		           },
		           error : function(error){
		           		console.log(error);
		           }
			   });
			};
		};

		function PluginObject(target)
		{
			//{"success":true,"msg":"上传成功","obj":{"viewUrl":"http://bossappnew.oss-cn-hangzhou.aliyuncs.com/managerimage/20170323172613rTu8YypZ.png","filePath":"managerimage/20170323172613rTu8YypZ.png"},"attributes":null,"jsonStr":"{\"msg\":\"上传成功\",\"success\":true,\"obj\":{\"filePath\":\"managerimage/20170323172613rTu8YypZ.png\",\"viewUrl\":\"http://bossappnew.oss-cn-hangzhou.aliyuncs.com/managerimage/20170323172613rTu8YypZ.png\"}}"}
			var self=this;
			self.ele=target;
			self.popbox;
			self.uploadManager=new UploadManager();
			self.qfilepickerEle;
			self.qmultiplyfileuploadbox;
			self.qfilelistEle;
			self.onconfirm;
			self.renderToFileList=function(file,data){
				data= jQuery.parseJSON(data);
				var fileItem=self.fileItemTempEle.clone();
				if(data.success)
				{
					fileItem.find("img").attr("src",data.obj.viewUrl);
					self.qfilelistEle.append(fileItem);
					fileItem.data("filepath",data.obj.filePath);
					
				}
				else
				{
					fileItem.find("img").attr("src","none");
					self.qfilelistEle.append(fileItem);
					self.resultFilePath.push(data.src);
				}
				fileItem.find(".qdelete").on("click",function(){
					fileItem.remove();
				});
			};
		    self.removeFile=function(){
		    	
		    };
		    self.comfirm=function()
		    {
		    	var filepaths=self.qfilelistEle.find(".qfileitem").filter(function(obj){
		    		return $(this).data("filepath")?true:false;
		    	}).map(function(){
		    		return $(this).data("filepath");
		    	});
		    	var values=filepaths.get().join();
		    	console.log(values);
		    	self.qmultiplyfileuploadbox.hide();
		    	target.val(values);
		    };
		    self.cancel=function()
		    {
		    	self.qmultiplyfileuploadbox.hide();
		    };
			self.uploadFiles=function(files){
				$(files).each(function(index,item){
					$.when(self.uploadManager.uploadSingleFile(item)).then(function(data){
						console.log(item,data);
						self.renderToFileList(item,data);
					});
				});
			};
			self.init=function(options){
				self.qmultiplyfileuploadbox=options.qmultiplyfileuploadboxTemplate.clone().removeClass("qmultiplyfileuploadboxTemplate");
				self.qfilepickerEle=self.qmultiplyfileuploadbox.find(".qfilepicker");
				self.qfilelistEle=self.qmultiplyfileuploadbox.find(".qfilelist");
				self.confirmEle=self.qmultiplyfileuploadbox.find(".qconfirm");
				self.cancelEle=self.qmultiplyfileuploadbox.find(".qcancel");
				self.qfilepickerwrapEle=self.qmultiplyfileuploadbox.find(".qfilepickerwrap");
				self.fileItemTempEle=self.qmultiplyfileuploadbox.find(".qfileitemTemp").clone().removeClass("qfileitemTemp").show();
				self.qfilepickerEle.on("change",function(e){
					var files=e.target.files;
					self.uploadFiles(files);
				});
				$("body").append(self.qmultiplyfileuploadbox);
				target.on("focus",function(){
					self.qmultiplyfileuploadbox.show();
				});
				self.cancelEle.on("click",function(){
					self.cancel();
				});
				self.confirmEle.on("click",function(){
					self.comfirm();
				});
				self.qfilepickerwrapEle.on("click",function(){
					self.qfilepickerEle.trigger("click");
				});
				
				
			};


		};

})(jQuery);