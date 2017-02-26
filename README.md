
Followin is the setting up the grid Struct

	var GridStruct = {
		colLayout: [
			{"name":"c", "caption":"Year"},
			{"name":"a", "caption":"Title"},
			{"name":"d", "caption":"Address"}
		],
		dataForBinding: [
			{"a":1, "b":2, "c":3, "d":4, "e":5, "f":6},
			{"a":1, "b":2, "c":3, "d":4, "e":5, "g":8},
			{"a":1, "b":2, "c":3, "d":4, "e":5, "f":6},
			{"a":1, "b":2, "c":3, "d":4, "e":5, "g":8},
			{"a":1, "b":2, "c":3, "d":4, "e":5, "f":6},
			{"a":1, "b":2, "c":3, "d":4, "e":5, "g":8},
			{"a":1, "b":2, "c":3, "d":4, "e":5, "f":6},
			{"a":1, "b":2, "c":3, "d":4, "e":5, "g":8},
			{"a":1, "b":2, "c":3, "d":4, "e":5, "f":6},
			{"a":1, "b":2, "c":3, "d":4, "e":5, "g":8},
			{"a":1, "b":2, "c":3, "d":4, "e":5, "f":6},
			{"a":1, "b":2, "c":3, "d":4, "e":5, "g":8},
			{"a":1, "b":2, "c":3, "d":4, "e":5, "h":9}
		], //json object
        resultPerShow: thisApp.prop.resultPerShow, 
        listableFunc: thisApp.prop.listableFunc,
        appendElementID: "myGrid",
        styleOddRow: "", // class name
        styleEvenRow: "", // class name
        styleTBL: "", // class name
        styleTh: "tblHeader", // class name
        styleDiv:"ScrollTable", /class name
        scroll: true,
        gridWidth: "100%",
        gridHeight: "240px",
        showCheckBox: true,
        deleteButton: "callback_ShowDeleteButton"
        recordPerShow:10,
        recordOffSet:5
};
*****************************************
*****************************************
Following is the usage of the Grid control
*****************************************
// START DEBUG CODE
var gridControl = new Grid(GridSetting, "callback_returnData", thisApp); 
gridControl.ShowCheckbox(false);
gridControl.ShowCheckbox(true);
gridControl.ShowDeletebox(false);
gridControl.ShowDeletebox(true);

//GridStruct - A GridStruct objects which contains settings used by the Grid
//"call_backOnClick" - A String describing which method to execute using data from the row you clicked
//thisApp - The App that this grid is being created within

var call_backOnClick = function (data, type) {
    if ( type =="DoubleClick") {
        console.log("This was the callback specified above, it will be called when that completes")
        alert(JSON.stringify (data));
    }

    if ( type =="Click") {
        console.log("This was the callback specified above, it will be called when that completes")
        alert(JSON.stringify (data));
    }
};

this.callback_ShowDeleteButton = function( data ) {
        alert("data return number : " + data.length + "return from delete button " + JSON.stringify (data));
};