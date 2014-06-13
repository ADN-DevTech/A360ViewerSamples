// Viewer 3D
var viewer3D;

// HTML document to access the elements
var htmlDoc;

// Viewer Document
var currentViewerDoc;

// Document Id that is to be loaded
var documentId;

// OAuth
var auth;

// Geometry nodes
var geometryItems;
var geometryItems_children;

// For navigation between nodes
var selectedModelListIndex = 0;
var currNodes = [];
var currNode = null;
var level = 0;

// Current Camera parameters
var position = [];
var target = [];
var upVector = [];
var aspect = 1.0;
var fov = 10;
//var orthoHeight = 
var isPerspective = true;

// For changing camera position along a chosen direction
// X Y or Z
var direction;

var bFirst;

function xmlHttpRequestHandler() 
{
}

function xmlHttpRequestErrorHandler() 
{
}

var xmlhttp;


// Initialization on load of the page
function OnInitialize() 
{
    htmlDoc = document;
	
	bFirst = true;

}



function OnInitializeViwer()
{
	//get the token.
	var token = htmlDoc.getElementById("TokenText").value; 
	
	xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://developer.api.autodesk.com/utility/v1/settoken', false); 
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xmlhttp.onreadystatechange = xmlHttpRequestHandler;
    xmlhttp.onerror = xmlHttpRequestErrorHandler;
    xmlhttp.withCredentials = true;
    xmlhttp.send("access-token=" + token);
	
   var options = {};
    options.env = "ApigeeProd";
    options.accessToken = token;
	
    initializeEnvironmentVariable(options);

    initializeServiceEndPoints();
    auth = initializeAuth(null, options);

	if(bFirst == true)
	{
		var viewerContainer = htmlDoc.getElementById('3dViewDiv');
		viewer3D = new Autodesk.Viewing.Private.GuiViewer3D(viewerContainer, {});
		viewer3D.initialize();
		bFirst = false;
	}

    //Do not show property grid
    viewer3D.propertygrid.openOnSelect = false;

    // Get the htmlDoc Id to load
    documentId = document.getElementById("DocIdTB").value;

    
    //camara event
    viewer3D.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, cameraChangedEventCB);
   
    // Load the document
    Autodesk.Viewing.Document.load(documentId, getAuthObject(), onSuccessDocumentLoadCB, onErrorDocumentLoadCB);
}

//Load the viewer document
function LoadDocumentBtnClicked() 
{
	OnInitializeViwer();
	
    documentId = document.getElementById("DocIdTB").value;

    Autodesk.Viewing.Document.load(documentId, getAuthObject(), onSuccessDocumentLoadCB, onErrorDocumentLoadCB);

    UpdateCommandLine("Loading document : " + documentId);
}

// Document successfully loaded 
function onSuccessDocumentLoadCB(viewerDocument) 
{
    currentViewerDoc = viewerDocument;
    var rootItem = viewerDocument.getRootItem();

    //store in globle variable
    geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(rootItem, { 'type': 'geometry', 'role': '3d' }, true);

    if (geometryItems.length > 0) 
    {
        var item3d = viewerDocument.getViewablePath(geometryItems[0]);

       // viewer3D.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, geometryLoadedEventCB);

        viewer3D.load(item3d);

        level = 0;

        // Add the 3d geometry items to the list
        $("#ModelList").empty()

        var itemList = htmlDoc.getElementById('ModelList');
        for (i = 0; i < geometryItems.length; i++) 
        {
            itemList.add(new Option(geometryItems[i].name, geometryItems[i]));
        }
    }

    // var el = $("#OperationSelectionBox").first();
    // el.selected = true;
}

// Some error during document load
function onErrorDocumentLoadCB(errorMsg, errorCode) 
{
    $('#tree_container').empty();
    UpdateCommandLine("Unable to load the document : " + documentId + errorMsg);
}

// Get the object tree and load the select elements for navigation
function getObjectTreeCB(result) 
{
    $("#ModelList").empty()
    geometryItems_children = result.children;

    var itemList = htmlDoc.getElementById('ModelList');
    for (i = 0; i < geometryItems_children.length; i++) 
    {
        itemList.add(new Option(geometryItems_children[i].name, geometryItems_children[i]));

        currNodes.push(geometryItems_children[i]);
    }
    //viewer3D.docstructure.handleAction(["focus"], result.dbId);
}

// Selection changed event Callback in the 3D viewer
function selectionChangedEventCB(event) 
{
    var dbIdArray = event.dbIdArray;
    if (dbIdArray.length == 0) 
    {
        UpdateCommandLine("Selection changed event : No selection ");
        return;
    }

    for (i = 0; i < dbIdArray.length; i++) 
    {
        var dbId = dbIdArray[0];
        UpdateCommandLine("Selection changed event : selecting object " + dbId);
    }
}

// Isolate event Callback in the 3D Viewer
function isolateEventCB(event) 
{
    var dbIdArray = event.dbIdArray;
    if (dbIdArray.length == 0) 
    {
        UpdateCommandLine("Isolate event : No selection ");
        return;
    }

    for (i = 0; i < dbIdArray.length; i++) {
        var dbId = dbIdArray[0];
        UpdateCommandLine("Isolate event : isolating object " + dbId);
    }
}

function hideEventCB(event) 
{
    var dbIdArray = event.dbIdArray;
    if (dbIdArray.length == 0) {
        UpdateCommandLine("Hide event : No selection ");
        return;
    }

    for (i = 0; i < dbIdArray.length; i++) {
        var dbId = dbIdArray[0];
        UpdateCommandLine("Hide event : isolating object " + dbId);
    }
}

function showEventCB(event) 
{
    var dbIdArray = event.dbIdArray;
    if (dbIdArray.length == 0) {
        UpdateCommandLine("Show event : No selection ");
        return;
    }

    for (i = 0; i < dbIdArray.length; i++) {
        var dbId = dbIdArray[0];
        UpdateCommandLine("Show event : isolating object " + dbId);
    }
}

function progressUpdateEventCB(event) 
{
    var dbIdArray = event.dbIdArray;
    if (dbIdArray.length == 0) {
        UpdateCommandLine("Progress update event : No selection ");
        return;
    }

    for (i = 0; i < dbIdArray.length; i++) {
        var dbId = dbIdArray[0];
        UpdateCommandLine("Progress update event : isolating object " + dbId);
    }
}

function errorEventCB(event) 
{
    var dbIdArray = event.dbIdArray;
    if (dbIdArray.length == 0) {
        UpdateCommandLine("Error event : No selection ");
        return;
    }

    for (i = 0; i < dbIdArray.length; i++) {
        var dbId = dbIdArray[0];
        UpdateCommandLine("Error event : isolating object " + dbId);
    }
}

function escapeEventCB(event) 
{
    var dbIdArray = event.dbIdArray;
    if (dbIdArray.length == 0) {
        UpdateCommandLine("Escape event : No selection ");
        return;
    }

    for (i = 0; i < dbIdArray.length; i++) {
        var dbId = dbIdArray[0];
        UpdateCommandLine("Escape event : isolating object " + dbId);
    }
}

function navigationModeEventCB(event) 
{
    var dbIdArray = event.dbIdArray;
    if (dbIdArray.length == 0) {
        UpdateCommandLine("Navigation Mode event : No selection ");
        return;
    }

    for (i = 0; i < dbIdArray.length; i++) {
        var dbId = dbIdArray[0];
        UpdateCommandLine("Navigation Mode event : isolating object " + dbId);
    }
}

function highlightEventCB(event) 
{
    var dbIdArray = event.dbIdArray;
    if (dbIdArray.length == 0) {
        UpdateCommandLine("Highlight event : No selection ");
        return;
    }

    for (i = 0; i < dbIdArray.length; i++) {
        var dbId = dbIdArray[0];
        UpdateCommandLine("Highlight event : isolating object " + dbId);
    }
}

function geometryLoadedEventCB(event) 
{
    UpdateCommandLine("Geometry loaded event");
    viewer3D.getObjectTree(getObjectTreeCB);
    viewer3D.removeEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, geometryLoadedEventCB);
}

function OnChangeOperation() 
{
    var e = document.getElementById("OperationSelectionBox");
    var str = e.options[e.selectedIndex].text;

    viewer3D.showAll();
    //viewer3D.docstructure.handleAction(["focus"], null);
}

function UpdateCommandLine(text) 
{
    var itemList = htmlDoc.getElementById('OutputMessages');
    var obj = itemList.add(new Option(text, text));

    var e = document.getElementById("OutputMessages");
    e.scrollTop = e.scrollHeight - 20;
}

function Model_selectedItem(modelList) 
{
    if (selectedModelListIndex == modelList.selectedIndex) {
       //
	   if(level == 0)
	   {
	   }
	   else
	   {
		currNode = currNodes[selectedModelListIndex];
	   }
       return; // Do not reload repeatedly
    }

    selectedModelListIndex = modelList.selectedIndex;

    if (level == 0) 
    {
        var item3d = currentViewerDoc.getViewablePath(geometryItems[selectedModelListIndex]);
        //viewer3D.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, geometryLoadedEventCB);
		viewer3D.initialize();
        viewer3D.load(item3d);
		viewer3D.propertygrid.openOnSelect = false;

        // Clear the properties table
        var table = htmlDoc.getElementById('PropertiesTable')
        while (table.hasChildNodes()) 
        {
            table.removeChild(table.firstChild);
        }

        // Disable the Back button since this is the first level
        $("#NavigateBackBtn").prop('disabled', true);
        
        UpdateCommandLine("Geometry : " + geometryItems[modelList.selectedIndex].name);
    }
    else {
    // Enable the Back button
        $("#NavigateBackBtn").prop('disabled', false);

        currNode = currNodes[selectedModelListIndex];
        var selectedObjectdbId = currNode.dbId;

        var geomItemsChildren = currNode.children;

        // Disable the Forward button if no further child nodes
        if (typeof geomItemsChildren === "undefined") {
            $("#NavigateForwardBtn").prop('disabled', true);
        }
        else if (geomItemsChildren.length == 0) {
            $("#NavigateForwardBtn").prop('disabled', true);
        }
        else {
            $("#NavigateForwardBtn").prop('disabled', false);
        }

        UpdateCommandLine("Geometry : " + currNode.name);

        // Isolate, Select the node item

        var e = document.getElementById("OperationSelectionBox");
        var str = e.options[e.selectedIndex].text;

        if (str === "Isolate") 
        {
			//reset firts
            viewer3D.isolateById(selectedObjectdbId);
            UpdateCommandLine("Isolating object " + currNode.name + " (dbId = " + currNode.dbId + ")");
        }
        else if (str === "Select") 
        {
            // Clear the current selection
            viewer3D.clearSelection();
            
            // Select the node
            viewer3D.select(selectedObjectdbId);

            UpdateCommandLine("Selecting object " + currNode.name + " (dbId = " + currNode.dbId + ")");
        }

        var zoomcb = document.getElementById("ZoomCheckbox");
        if (zoomcb.checked == true) {
            // Zoom if needed
            viewer3D.docstructure.handleAction(["focus"], selectedObjectdbId);
        }

        // Update the properties of the item that was selected.
        viewer3D.getProperties(selectedObjectdbId, getPropertiesCB);
    }
}

function getPropertiesCB(result) 
{
    var id = result.dbId;
    var name = result.name;
	
	UpdateCommandLine("Getting Properties of object " + name + " (dbId = " + id + ")");

    // Get the properties table
    var propertiesTable = htmlDoc.getElementById('PropertiesTable')

    // Clear the properties table
    while (propertiesTable.hasChildNodes()) 
    {
        propertiesTable.removeChild(propertiesTable.firstChild);
    }

    // Populate the table with the properties
    for (i = 0; i < result.properties.length; i++) 
    {
        var property = result.properties[i];
        var disName = property.displayName;
        var disValue = property.displayValue;

        var row = propertiesTable.insertRow(i);

        var cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1);

        cell0.innerHTML = disName;
        cell1.innerHTML = disValue;
    }
}

function onNavigateForward() {
    if (level == 0) {
        var item3d = currentViewerDoc.getViewablePath(geometryItems[selectedModelListIndex]);
        viewer3D.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, geometryLoadedEventCB);
        viewer3D.load(item3d);
		
    }
    else {
        $("#ModelList").empty();
        var itemList = htmlDoc.getElementById('ModelList');

        currNodes = [];
        var geomItemsChildren = currNode.children;
        for (i = 0; i < geomItemsChildren.length; i++) {
            itemList.add(new Option(geomItemsChildren[i].name, geomItemsChildren[i].dbId));
            currNodes.push(geomItemsChildren[i]);
        }
    }

    level = level + 1;
	selectedModelListIndex = -1;
}

function onNavigateBack() 
{
    if(level == 1)
    {
        // Add the 3d geometry items to the list
        $("#ModelList").empty();

		viewer3D.initialize();
		var item3d = currentViewerDoc.getViewablePath(geometryItems[0]);
       // viewer3D.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, geometryLoadedEventCB);
        viewer3D.load(item3d);	
		viewer3D.propertygrid.openOnSelect = false;
		
        var itemList = htmlDoc.getElementById('ModelList');
        for (i = 0; i < geometryItems.length; i++) 
        {
            itemList.add(new Option(geometryItems[i].name, geometryItems[i].dbId));
        }


        $("#NavigateBackBtn").prop('disabled', true);
        $("#NavigateForwardBtn").prop('disabled', false);
    }
    else 
    {
        $("#ModelList").empty();
        var itemList = htmlDoc.getElementById('ModelList');

        currNodes = [];
        var geomItemsChildren = currNode.parent.parent.children;
        for (i = 0; i < geomItemsChildren.length; i++) {
            itemList.add(new Option(geomItemsChildren[i].name, geomItemsChildren[i].dbId));
            currNodes.push(geomItemsChildren[i]);
        }
    }

    level = level - 1;
	selectedModelListIndex = -1;
}


function ChangeCameraPosPositive() 
{
    switch(direction) 
    {
        case 'X':
            ChangeCameraPosX1();
            break;

        case 'Y':
            ChangeCameraPosY1();
            break;

        case 'Z':
            ChangeCameraPosZ1();
            break;

        default:
            ChangeCameraPosX1();
            break;
    }
}

function ChangeCameraPosNegative() {

    switch (direction) {
        case 'X':
            ChangeCameraPosX0();
            break;

        case 'Y':
            ChangeCameraPosY0();
            break;

        case 'Z':
            ChangeCameraPosZ0();
            break;

        default:
            ChangeCameraPosX0();
            break;
    }
}

// Move the camera position in Negative X direction
function ChangeCameraPosX0() 
{
    var threeCamera = viewer3D.getCamera();
    threeCamera.position.set(position.x * 0.9, position.y, position.z);
    viewer3D.applyCamera(threeCamera, false);
}

// Move the camera position in Positive X direction
function ChangeCameraPosX1() {
    var threeCamera = viewer3D.getCamera();
    threeCamera.position.set(position.x * 1.1, position.y, position.z);
    viewer3D.applyCamera(threeCamera, false);
}

// Move the camera position in Negative Y direction
function ChangeCameraPosY0() {
    var threeCamera = viewer3D.getCamera();
    threeCamera.position.set(position.x, position.y * 0.9, position.z);
    viewer3D.applyCamera(threeCamera, false);
}

// Move the camera position in Positive X direction
function ChangeCameraPosY1() {
    var threeCamera = viewer3D.getCamera();
    threeCamera.position.set(position.x, position.y * 1.1, position.z);
    viewer3D.applyCamera(threeCamera, false);
}

// Move the camera position in Negative Z direction
function ChangeCameraPosZ0() {
    var threeCamera = viewer3D.getCamera();
    threeCamera.position.set(position.x, position.y, position.z * 0.9);
    viewer3D.applyCamera(threeCamera, false);
}

// Move the camera position in Positive Z direction
function ChangeCameraPosZ1() {
    var threeCamera = viewer3D.getCamera();
    threeCamera.position.set(position.x, position.y, position.z * 1.1);
    viewer3D.applyCamera(threeCamera, false);
}

function cameraChangedEventCB(evt) 
{
    position = evt.camera.position;
    target = evt.camera.target;
    upVector = evt.camera.up;
    aspect = evt.camera.aspect;
    fov = evt.camera.fov;
    //var orthoHeight = 
    isPerspective = evt.camera.isPerspective;

    var cb = document.getElementById("CameraChangedEvtCheckbox");
    if (cb.checked == true) {
        UpdateCommandLine("Camera : PosX = " + position.x + "PosY = " + position.y + "PosZ = " + position.z + "TargetX = " + target.x + "TargetY = " + target.y + "TargetZ = " + target.z);
    }
   
    
    //UpdateCommandLine(" UpVecX = " + upVector.x + " UpVecY = " + upVector.y + " UpVecZ = " + upVector.z + " Aspect = " + aspect + " FOV = " + fov + " isPers = " + isPerspective);
}

function OnChangeDirection() {
    var e = document.getElementById("DirectionSelect");
    direction = e.options[e.selectedIndex].text;
}

function OnChangeSelectionChangedEvtCheckbox() {

    var cb = document.getElementById("SelectionChangedEvtCheckbox");
    if (cb.checked == true) {
        viewer3D.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, selectionChangedEventCB);
    }
    else {
        viewer3D.removeEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, selectionChangedEventCB);
    }
}

function OnChangeIsolateEvtCheckbox() {
    var cb = document.getElementById("IsolateEvtCheckbox");
    if (cb.checked == true) {
        viewer3D.addEventListener(Autodesk.Viewing.ISOLATE_EVENT, isolateEventCB);
    }
    else {
        viewer3D.removeEventListener(Autodesk.Viewing.ISOLATE_EVENT, isolateEventCB);
    }
}

function OnChangeHideEvtCheckbox() {
    var cb = document.getElementById("HideEvtCheckbox");
    if (cb.checked == true) {
        viewer3D.addEventListener(Autodesk.Viewing.HIDE_EVENT, hideEventCB);
    }
    else {
        viewer3D.removeEventListener(Autodesk.Viewing.HIDE_EVENT, hideEventCB);
    }
}

function OnChangeShowEvtCheckbox() {
    var cb = document.getElementById("ShowEvtCheckbox");
    if (cb.checked == true) {
        viewer3D.addEventListener(Autodesk.Viewing.SHOW_EVENT, showEventCB);
    }
    else {
        viewer3D.removeEventListener(Autodesk.Viewing.SHOW_EVENT, showEventCB);
    }
}

function OnChangeProgressUpdateEvtCheckbox() {
    var cb = document.getElementById("ProgressUpdateEvtCheckbox");
    if (cb.checked == true) {
        viewer3D.addEventListener(Autodesk.Viewing.PROGRESS_UPDATE_EVENT, progressUpdateEventCB);
    }
    else {
        viewer3D.removeEventListener(Autodesk.Viewing.PROGRESS_UPDATE_EVENT, progressUpdateEventCB);
    }
}

function OnChangeErrorEvtCheckbox() {
    var cb = document.getElementById("ErrorEvtCheckbox");
    if (cb.checked == true) {
        viewer3D.addEventListener(Autodesk.Viewing.ERROR_EVENT, errorEventCB);
    }
    else {
        viewer3D.removeEventListener(Autodesk.Viewing.ERROR_EVENT, errorEventCB);
    }
}

function OnChangeEscapeEvtCheckbox() {
    var cb = document.getElementById("EscapeEvtCheckbox");
    if (cb.checked == true) {
        viewer3D.addEventListener(Autodesk.Viewing.ESCAPE_EVENT, escapeEventCB);
    }
    else {
        viewer3D.removeEventListener(Autodesk.Viewing.ESCAPE_EVENT, escapeEventCB);
    }
}

function OnChangeNavigationModeEvtCheckbox() {
    var cb = document.getElementById("NavigationModeEvtCheckbox");
    if (cb.checked == true) {
        viewer3D.addEventListener(Autodesk.Viewing.NAVIGATION_MODE_CHANGED_EVENT, navigationModeEventCB);
    }
    else {
        viewer3D.removeEventListener(Autodesk.Viewing.NAVIGATION_MODE_CHANGED_EVENT, navigationModeEventCB);
    }
}

function OnChangeCameraChangedEvtCheckbox() {
//    var cb = document.getElementById("CameraChangedEvtCheckbox");
//    if (cb.checked == true) {
//        viewer3D.addEventListener(CAMERA_CHANGE_EVENT, cameraChangedEventCB);
//    }
//    else {
//        viewer3D.removeEventListener(CAMERA_CHANGE_EVENT, cameraChangedEventCB);
//    }
}

function OnChangeHighlightEvtCheckbox() {
    var cb = document.getElementById("HighlightEvtCheckbox");
    if (cb.checked == true) {
        viewer3D.addEventListener(Autodesk.Viewing.HIGHLIGHT_EVENT, highlightEventCB);
    }
    else {
        viewer3D.removeEventListener(Autodesk.Viewing.HIGHLIGHT_EVENT, highlightEventCB);
    }
}

function OnChangeGeometryLoadedEvtCheckbox() {
    var cb = document.getElementById("GeometryLoadedEvtCheckbox");
    if (cb.checked == true) {
        viewer3D.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, geometryLoadedEventCB);
    }
    else {
        viewer3D.removeEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, geometryLoadedEventCB);
    }
}

function OnResetViewBtnClicked() {
    // Go Home
    //viewer3D.impl.controls.goHome();

//    selectedModelListIndex = -1;
//    $("#ModelList").click();
}