 /*************************required  jquery lib to work********/
/******************************************
*******************************************
******************Grid Contrl V 1.00
******************Developer: Ratha Mom
*******************************************
*******************************************/
var Framework = {
    prop: { 
        developer: true,
    },

    isEmpty: function(value) {
        if(value) {
            return false;
        }
        return true;
    },

    IsBoolean: function(value) {
        if(typeof(value) === "boolean") {
            return true;
        }
        return false;
    },

    UI: {
    	MsgBox:function(msg) {
    		alert(msg);
	    }
    },

    API: {
        getData: function(url, parameter, callBackFunction, thisApp) {
          //GetAPI(thisApp.listableServlet, thisApp.listableFunc, callbackthisApp, "callback_GetNextList", {"Start": thisApp._nextDataCount, "ResultPerShow": thisApp.resultPerShow});
            $.ajax({
                method: "POST",
                url: url,
                data: parameter,
                dataType:"json"
                })
                .done(function( msg ) {
                    if (msg) {
                        thisApp[callBackFunction](msg);
                    }
            });
        }
    }

}

var Grid = function(GridStruct, callback_returnData, callbackthisApp) {
    if (Framework.prop.developer) {
        console.log("Grid-Control(INFO): creating new Grid.js Control");
    }
    
	if (Framework.isEmpty(GridStruct)) {
		if (Framework.prop.developer) {
			console.log('Grid-Control(ERROR): required argument GridStruct is null');
			Framework.UI.MsgBox("title:'Grid Control Error', message:'Attempted to create Grid control failed, it requires a GridStruct as an argument to initialise.', modal:false, width:400, height:300");
		}
		
		return null;
	}
	
	try {		
		this.ColDetails = {_nameList: [], _captionList: []};
		this._nextDataCount = GridStruct.resultPerShow;// START NUMBER
        
		var error = true;
		if ((!Framework.isEmpty(GridStruct.colLayout)) && (typeof(GridStruct.colLayout) == 'object') && (typeof(GridStruct.colLayout.length) != 'undefined')) {
			for (var i = 0; i < GridStruct.colLayout.length; i++) {
				this.ColDetails._nameList.push(GridStruct.colLayout[i].name);
				this.ColDetails._captionList.push(GridStruct.colLayout[i].caption);
				error = false;
			}
		}
		
		if (error) {
			if (Framework.prop.developer) {
				console.log('Grid-Control(ERROR): required argument GridStruct does not have a "colLayout" list of columns');
				Framework.UI.MsgBox("title:'Grid Control Error', message:'Attempt to create Grid control failed, the GridStruct argument needs to have a colLayout list of columns.', modal:false, width:400, height:300");
			}
			
			return null;
		}
        
        this._elementID = GridStruct.appendElementID;
        
        if (Framework.isEmpty(callbackthisApp._grid)) callbackthisApp._grid = [];
		
        callbackthisApp._grid[this._elementID] = this;
        
        this._storeData = [{}]; // create this var in the grid 
        this._showCheckbox = null;
        this._showDeleteButton = null;
        this.recordOffSet = (Framework.isEmpty(GridStruct.recordOffSet)) ? 5 : GridStruct.recordOffSet;
        this.resultPerShow = (Framework.isEmpty(GridStruct.resultPerShow)) ? 10 : GridStruct.resultPerShow;
        this.listableServlet = (Framework.isEmpty(GridStruct.listableServlet)) ? callbackthisApp.listableServlet : GridStruct.listableServlet;        
        this.listableFunc = (Framework.isEmpty(GridStruct.listableFunc)) ? callbackthisApp.listableFunc : GridStruct.listableFunc;        
		this.tblHeaders = this.ColDetails._captionList; // array
		this.tblDisplayHeaders = this.ColDetails._nameList; // array
		this.tblContent = GridStruct.dataForBinding; //object
        this._divClasName = (Framework.isEmpty(GridStruct.styleDiv)) ? "divScroll" : GridStruct.styleDiv;
		this._tableHeaderColumnHTML = '';
		this._row = '';
		this._grid = '';
		this.enableScrolling = GridStruct.scroll;		
		this._tblClassName = (Framework.isEmpty(GridStruct.styleTBL)) ? " table tblstyle table-hover grid" : GridStruct.styleTBL;//tblstyle
		this._oddClassRow = (Framework.isEmpty(GridStruct.styleOddRow)) ? "" : GridStruct.styleOddRow;//odd
		this._evenClassRow = (Framework.isEmpty(GridStruct.styleEvenRow)) ? "" : GridStruct.styleEvenRow;//even
		this._isOddOrEven = true;
        this.tblDivBK =  (Framework.isEmpty(GridStruct.styleTBLDiv)) ? "tblDivBK" : GridStruct.styleTBLDiv;//tblstyle
		this._thClassName = (Framework.isEmpty(GridStruct.styleTh)) ? "header" : GridStruct.styleTh;
        this._checkBox = (Framework.isEmpty(GridStruct.showCheckBox)) ? "" : GridStruct.showCheckBox;
        this._deleteButton = (Framework.isEmpty(GridStruct.deleteButton)) ? "" : GridStruct.deleteButton;    
        var divObj = $("#" + this._elementID );
        var styleString = '';
		
        if (!Framework.isEmpty(GridStruct.gridHeight)) {
           styleString = ' height: ' + GridStruct.gridHeight + ' !important;';
        }
        
        if (!Framework.isEmpty(GridStruct.gridWidth)) {
            styleString += ' width: ' + GridStruct.gridWidth + ' !important;';
        }
		
		if (styleString != '') {
			divObj.attr('style',styleString );
		}
		
		for (var i = 0; i < this.tblHeaders.length; i++ ) {	
            this._tableHeaderColumnHTML += "<th>" + this.tblHeaders[i] + "<div>" + this.tblHeaders[i] + "</div>";
		} 
        
        if (!Framework.isEmpty(this._checkBox)) {
           this._tableHeaderColumnHTML += "<th class='_GridCheckBox'> <div>  &nbsp;<input type ='checkbox'  id='headercheckbox' name='checkbox[]' ></div></th>";
        } 
                
        if (!Framework.isEmpty(this._deleteButton)) {
           this._tableHeaderColumnHTML +=  "<th class='_GridDeleteBox'> <div> &nbsp;<button class='btn btn-danger btn-xs' type='button'  disabled><i class='fa fa-times' aria-hidden='true'></i></button></div></th>"; 
        }
        
        this._tableHeaderColumnHTML += "</th>";
        
        this._BuildTableRows = function(tblContent) {			
            var row = '';      
			for (var key in tblContent) {			
				if (!tblContent.hasOwnProperty(key)) continue;
				
				if (this._isOddOrEven) {
					row += "<tr class='" + this._evenClassRow + "'>";
					this._isOddOrEven = false;
				} else {
					row += "<tr class='" + this._oddClassRow + "'>";
					this._isOddOrEven = true;
				}
				
				for (var prop in tblContent[key]) {
					if (this.tblDisplayHeaders.indexOf(prop) < 0) continue;
					if (!tblContent[key].hasOwnProperty(prop)) continue;
                    
					row += "<td>" + tblContent[key][prop] + "</td>";
				}
                
                if (!Framework.isEmpty(this._checkBox)) {
				    row += "<td class='_GridCheckBox'><input type ='checkbox'  name='checkbox[]'></td>";
                } 
                
                if (!Framework.isEmpty(this._deleteButton)) {
                    row += "<td class='_GridDeleteBox'><button class='btn btn-danger btn-xs' type='button'><i class='fa fa-times' aria-hidden='true'></i></button></td>"; 
                }
                
                row += "</tr>";
			}
			return row;
		};
        
        this.HeaderCheckbox_OnClick = function() {
            var table = $( "#" + this._elementID + " table");
            var headercheckbox = table.find("tr td._GridCheckBox input[type=checkbox]");
			var thisApp = this;
			table.find("tr th._GridCheckBox").unbind();
            table.find("tr th._GridCheckBox").on("change", function () {

				headercheckbox.prop('checked', table.find("tr th._GridCheckBox input[type=checkbox]").is(":checked"));		
                var checkedRow = thisApp.ReturnCheckbox(headercheckbox, true, "number");
                if (checkedRow > 0) {
                    table.find("tr th._GridDeleteBox button").prop("disabled", false);
					table.find("tr").attr("class", "GridRowsSelected");
                } else {
                    table.find("tr th._GridDeleteBox button").prop("disabled", true);
					table.find("tr").attr("class", "");
                }
            });   
        };
        
		/*
        this.CheckboxChecked = function() {
            var table = $(callbackthisApp.prop.hWnd + "#" + this._elementID + " table");
            var headercheckbox = table.find("tr td._GridCheckBox input[type=checkbox]");
			var thisApp = this;
			
            headercheckbox.unbind();
            headercheckbox.on("change", function () {
                //console.log($(this).is(":checked"));
                
              if ($(event.target).is(":checked") == true) { 
                  $(event.tartget).parent("tr").addClass("GridRowsSelected");
              } else {
                  $(event.tartget).parent("tr").removeClass("GridRowsSelected");
              }
            });  
        };
		*/
        
        this.HeaderDeleteButton_OnClick = function() {
            var table = $("#" + this._elementID + " table");
            var headercheckbox = table.find("tr td._GridCheckBox input[type=checkbox]");
            var thisApp = this;
			
            table.find("tr th._GridDeleteBox button").unbind();
            table.find("tr th._GridDeleteBox button").on("click", function () {
                var checkedRow = thisApp.ReturnCheckbox(headercheckbox, true, "data");
                var callbackOnDelete = callbackthisApp[thisApp._deleteButton];  
                callbackOnDelete(checkedRow);
            });   				
        };
        
		// parentElement is selector , bool is boolean status return the true or false status checkbox, type is return data or number of checkbox checked  type = "data" type ="number"
		this.ReturnCheckbox = function(parentElement, bool, type) {
			var returnData = [];
			var thisApp = callbackthisApp._grid[this._elementID];
            var count = 0;
			
			parentElement.each(function (i) { 
				if ($(this).is(":checked") && (bool)) {
					returnData.push(thisApp._storeData[i + 1]);
                    count ++;
				} else if (!bool){
                    returnData.push(thisApp._storeData[i + 1]);
                    count ++;
                }
			});
			
            if (type == "number") {
                return count;
            } else if (type == "data") {
                return returnData;
            } else {
                if (Framework.prop.developer) {
                    console.log('Grid-Control(ERROR): required argument for ReturnCheckbox third arg is not correct syntax. third arg accept only two string such as: "data" or "number"');
                    Framework.UI.MsgBox("title:'Grid Control Error', message:'required argument for ReturnCheckbox third arg is not correct syntax. third arg accept only two strings such as: data or number', modal:false, width:400, height:300");
                }
            }
		};
        
        // method for set the row hide and show 
        this.ShowCheckbox = function(arg) {
            if (Framework.IsBoolean(arg)) {
                this._showCheckbox = arg;
                var table = $("#" + this._elementID + " table");
                if (arg) {
                   table.find("tr td._GridCheckBox").show();
                   table.find("tr th._GridCheckBox").show(); 
                } else {
                   table.find("tr td._GridCheckBox").hide();
                   table.find("tr th._GridCheckBox").hide(); 
                }
            } else {
                Framework.UI.MsgBox("title:'Grid Control Developer Error', message:'Attempt to fill Grid control failed, arg pass throw ShowCheckbox is not a boolean or null.', modal:false, width:400");
            }
        };
        
        this.ShowDeletebox = function(arg) {
            if (Framework.IsBoolean(arg)) {
                this._showDeleteButton = arg;
                var table = $("#" +  this._elementID + " table");
                if (arg) {
                   table.find("tr td._GridDeleteBox").show();
                   table.find("tr th._GridDeleteBox").show(); 
                } else {
                   table.find("tr td._GridDeleteBox").hide();
                   table.find("tr th._GridDeleteBox").hide(); 
                }
            } else {
                Framework.UI.MsgBox("title:'Grid Control Developer Error', message:'Attempt to fill Grid control failed, arg pass throw ShowCheckbox is not a boolean or null.', modal:false, width:400");
            }
        };
        
        this.AppendRows = function(tbldata) {		
			var parent = $("#" + this._elementID + " table:first-child");
            
			if (parent.length <= 0) {
                if (Framework.prop.developer) {
                    console.log('Grid-Control(ERROR): Cannot append. App, or table in App does not exist');
					Framework.UI.MsgBox("title:'Grid Control Error', message:'Attempt to fill Grid control failed, The App, or the table in App does not exist.', modal:false, width:400, height:300");
                }
				
                return null;
            }            
            parent.append (tbldata);
        };
                
		this.BindOnClickEventToEachRow = function(elementID) {
            var table = $("#" + elementID + " table:first-child");
            var thisApp = callbackthisApp._grid[elementID];
			
			if (table.length <= 0) {
				if (Framework.prop.developer) {
					console.log('Grid-Control(ERROR): Cannot append. App, or table in App does not exist');
					Framework.UI.MsgBox("title:'Grid Control Error', message:'Attempt to fill Grid control failed, The App, or the table in App does not exist.', modal:false, width:400, height:300");
				}
				
				return null;
			}
            
			// add onclick to tr
			var rows = table.children('tr'); // or table.getElementsByTagName("tr");
			
			if (Framework.isEmpty(rows)) {
				if (Framework.prop.developer) {
					console.log('Grid-Control(ERROR): rows is null, quitting before we bind events to the rows');
				}
				
				return null;
			}			
            
            table.unbind("click");
            table.on("click", 'tbody tr', function(event) {
                var i = $(this).closest('tr').index() + 1;
                var data = thisApp._storeData[i];
                var callbackOnClick = callbackthisApp[callback_returnData];
				
                $(this).parent("tbody").children("tr").each(function() {
                    if ($(this).hasClass("GridRowSelected")) {
                      this.setAttribute("class", '');
                    }
                });
              
                this.setAttribute("class","GridRowSelected");
                var eventType = "Click";
                callbackOnClick(data, eventType);
            });   
		};
        
        this.BindOnDoubleClickEventToEachRow = function(elementID) {
            var table = $("#" + elementID + " table:first-child");
            var thisApp = callbackthisApp._grid[elementID];
			if (table.length <= 0) {
				if (Framework.prop.developer) {
					console.log('Grid-Control(ERROR): Cannot append. App, or table in App does not exist');
					Framework.UI.MsgBox("title:'Grid Control Error', message:'Attempt to fill Grid control failed, The App, or the table in App does not exist.', modal:false, width:400, height:300");
				}
				
				return null;
			}
            
			// add onclick to tr
			var rows = table.children('tr'); // or table.getElementsByTagName("tr");
			
			if (Framework.isEmpty(rows)) {
				if (Framework.prop.developer) {
					console.log('Grid-Control(ERROR): rows is null, quitting before we bind events to the rows');
				}
				
				return null;
			}
            
            table.unbind("dblclick");
            table.on("dblclick", 'tbody tr' , function(event) {
                var i = $(this).closest('tr').index() +1;
                //var data = thisApp._storeData[i]; // single record
                // multi data return block 
                var current_data = thisApp._storeData[i]; // current click row's data single record
                var headercheckbox = table.find("tr td._GridCheckBox input[type=checkbox]");
                var data = thisApp.ReturnCheckbox(headercheckbox, true, "data"); // multi record selected return     
                data.push(current_data);
                
                var callbackOnClick = callbackthisApp[callback_returnData];         
                var chkbox = this.getElementsByTagName('input')[0];
				
                $(this).parent("tbody").children("tr").each(function() {
                    if ($(this).hasClass("GridRowSelected")) {
                        this.setAttribute("class", '');
                        var chkbox = this.getElementsByTagName('input')[0];
                        chkbox.checked = false;
                    }
                });
                
                this.setAttribute("class","GridRowSelected");
                chkbox.checked = true; 
                var eventType = "DoubleClick";
                callbackOnClick(data, eventType);
            });
            
            var thisApp = this
            table.unbind("click");
            table.on("click", 'tbody tr' , function(event) {
                var i = $(this).closest('tr').index() +1;
                var data = thisApp._storeData[i];
                var callbackOnClick = callbackthisApp[callback_returnData];                               
                var chkbox = this.getElementsByTagName('input')[0];
				
				if (event.target.type !== 'checkbox')
					chkbox.checked = !chkbox.checked;    

                if (!chkbox.checked) {
                    this.setAttribute("class", ''); 
                } else {
                    this.setAttribute("class","GridRowsSelected");                    
                }
				
                var table2 = $("#" + elementID + " table");
                var headercheckbox = table2.find("tr td._GridCheckBox input[type=checkbox]");
                var checkedRow = thisApp.ReturnCheckbox(headercheckbox, true, "number");
				
                if (checkedRow > 0) {
                    table2.find("tr th._GridDeleteBox button").prop("disabled", false);
                } else {
                    table2.find("tr th._GridDeleteBox button").prop("disabled", true);
                }
            });
			
			// binding the onclick events
			this.HeaderCheckbox_OnClick();
            this.HeaderDeleteButton_OnClick();
		};
        
        this.Restore = function(self) {
            if (!Framework.isEmpty(this._checkBox)) {
				self.BindOnDoubleClickEventToEachRow(self._elementID);
            } else {
               self.BindOnClickEventToEachRow(self._elementID);
            }
                     
            if (self.enableScrolling) {
                var div = $("#" + self._elementID );//+ " div:first-child");
				
                if (div.length <= 0) {
                    if (Framework.prop.developer) {
                        console.log('Grid-Control(ERROR): Cannot append. App, or table in App does not exist');
                        Framework.UI.MsgBox("title:'Grid Control Error', message:'Attempt to fill Grid control failed, The App, or the table in App does not exist.', modal:false, width:400, height:300");
                    }
                } else {
                    div.on("scroll", ScrollNext);
                    // on div scroll call following function
                    function ScrollNext() {
                        //Get the Event object
                        var obj = WindowLib.GetEventObj();

                        //Get the parent container
                        var element = $(obj).parent()[0];                    
                        if  (Framework.isEmpty(element)) return;
						
                        var elementID = element.id;
                        var thisApp = callbackthisApp._grid[elementID];

                        if ((($(this).scrollTop() + $(this).innerHeight()) >= (this.scrollHeight - 10)) && (thisApp.enableScrolling)) {
                           // console.log("this is the resulPershow" + thisApp._nextDataCount);
                            // var api = new Framework.API.getData(thisApp.listableServlet, thisApp.listableFunc, callbackthisApp, "callback_GetNextList", {"Start": thisApp._nextDataCount, "ResultPerShow": thisApp.resultPerShow});
                            // api.args = {"controlID": elementID };
                            // api.invoke();

                        }
                    }			
                }
            }
        };
		
		/****************************************
		* With all functions declared above, we *
		* can now build and initialise the grid *
		*****************************************/
        $("#" + this._elementID).addClass("gridContainer");
		this._tableHeaderColumnHTML = "<thead><tr class='" + this._thClassName + "'>" + this._tableHeaderColumnHTML + "</tr></thead>";
        
		//Add all new data into the DataStore (callbackthisApp.prop._storeData)
		this._storeData = this._storeData.concat(this.tblContent);
		
		this._row = this._BuildTableRows(this.tblContent);		
		this._grid = "<div class='" + this._divClasName + "' id='" + this._divClasName + "'><div class='headerDiv'></div><div class='" + this.tblDivBK+ "'><table class='" +  this._tblClassName + "' name='GridTBL'>" +           this._tableHeaderColumnHTML + this._row + "</table></div></div>";
		$(" #" + this._elementID).html(this._grid);
		
		  
        /****************************************
        **************end of the initial*********
        *****************************************/
        this.Restore(this);
        
        // this is create and initial by the grid not the app 
        callbackthisApp["callback_GetNextList"] = function(data, elementID) {
            callbackthisApp = this;
            var thisApp = callbackthisApp._grid[elementID];
            
            if ((Framework.isEmpty(data)) || (data.length <= 0)) {
                if (Framework.prop.developer) {
                    console.log("Data get back from GetAPI is empty");
                }
				
                thisApp.enableScrolling = false;
                return;
            }
       
            if (data.length > 0) {
                thisApp._nextDataCount += thisApp.resultPerShow;
                thisApp._storeData = thisApp._storeData.concat(data);
                var tblString = thisApp._BuildTableRows(data);  
				thisApp.AppendRows(tblString);
                if (!Framework.isEmpty(thisApp._checkBox)) {
                    thisApp.BindOnDoubleClickEventToEachRow(thisApp._elementID); 
                    if (!Framework.isEmpty(thisApp._showDeleteButton)) {
                        thisApp.ShowDeletebox(thisApp._showDeleteButton);
                    }
                    if (!Framework.isEmpty(thisApp._showCheckbox)) {
                        thisApp.ShowCheckbox(thisApp._showCheckbox);
                    }
                } else {
                    thisApp.BindOnClickEventToEachRow(thisApp._elementID);
                }
                return;
            }
        };
	} catch (error) {
		if (Framework.prop.developer) {
            console.log('An error occured: ' + error);
			Framework.UI.MsgBox("An unexpected error occurred while trying to initialise the Grid Control");
        }
		
		return null;
	}
};
