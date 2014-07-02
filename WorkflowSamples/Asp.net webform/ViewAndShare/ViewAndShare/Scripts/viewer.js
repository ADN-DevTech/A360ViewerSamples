var _auth;
var _viewer;

///////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////
function getPropertyValue(viewer, dbId, name, callback) {

    function propsCallback(result) {

        if (result.properties) {

            for (var i = 0; i < result.properties.length; i++) {

                var prop = result.properties[i];

                if (prop.displayName == name) {

                    callback(prop.displayValue);
                }
            }

            callback('');
        }
    }

    viewer.getProperties(dbId, propsCallback);
}

///////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////
function clearCurrentModel() {

    var viewerElement = document.getElementById('viewer3d');
    if (viewerElement != null) {
        viewerElement.parentNode.removeChild(viewerElement);
    }
    
}

///////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////
function loadDocument(viewer, auth, documentId) {

    //var path = VIEWING_URL + '/bubbles/' + documentId.substr(4);
    var path = VIEWING_URL + '/' + documentId.substr(4);
    //var path = documentId;

    // Find the first 3d geometry and load that.
    Autodesk.Viewing.Document.load(path, auth,
        function (doc) {// onLoadCallback

            var geometryItems = [];
            geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {
                'type': 'geometry',
                'role': '3d'
            }, true);

        if (geometryItems.length > 0) {
            viewer.load(doc.getViewablePath(geometryItems[0]),
                null,           //sharedPropertyDbPath
                function () {   //onSuccessCallback
                    //alert('viewable are loaded successfully');
                },
                function () {   //onErrorCallback
                    //alert('viewable loading failded');
                }
            );
        }
    }, function (errorMsg) {// onErrorCallback
        alert("Load Error: " + errorMsg);
    });
}

///////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////
function createViewer(containerId, urn) {

    if (urn.indexOf('urn:') !== 0)
        urn = 'urn:' + urn;

    var viewerContainer = document.getElementById(containerId);

    var viewerElement = document.createElement("div");

    viewerElement.id = 'viewer3d';
    //viewerElement.style.width = "100%";
    viewerElement.style.height = viewerContainer.clientHeight;
    viewerElement.style.width = viewerContainer.clientWidth;
    viewerContainer.appendChild(viewerElement);



    var viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerElement, {});

    //As a best practice, access token should be generated from server side
    $.getJSON('/GetAccessToken.ashx', function(data){

        var accessToken = data.access_token;

        var options = {
            //'env': 'AutodeskStaging', 
            'accessToken': accessToken,
            'document': urn,
            'refreshToken': getAccessToken   //refresh token when token expires
        };

        Autodesk.Viewing.Initializer(options, function () {
            viewer.initialize();
            //loadDocument(viewer, getAuthObject(), options.document);
            //when the changes are pushed to prod
            loadDocument(viewer, Autodesk.Viewing.Private.getAuthObject(), options.document);
        });

    })
    .done(function () { })
    .fail(function (jqXHR, textStatus, errorThrown) {
        //alert('getJSON request failed! ' + textStatus);
    })
    .always();



    viewer.addEventListener('selection', onViewerItemSelected);

    // disable scrolling on DOM document 
    // while mouse pointer is over viewer area
    $('#viewer3d').hover(
        function () {
            var scrollX = window.scrollX;
            var scrollY = window.scrollY;
            window.onscroll = function () {
                window.scrollTo(scrollX, scrollY);
            };
        },
        function () {
            window.onscroll = null;
        }
    );

    // disable default context menu on viewer div 
    $('#viewer3d').on('contextmenu', function (e) {
        e.preventDefault();
    });

    return viewer;
}

///////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////
function onGeometryLoaded(event) {

    _viewer.removeEventListener(
        Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
        onGeometryLoaded);

    _viewer.getObjectTree(function (rootComponent) {

        _viewer.docstructure.handleAction(
            ["focus"],
            rootComponent.dbId);
    });
}





///////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////
function onViewerItemSelected(event) {

    var dbIdArray = event.dbIdArray;

    for (var i = 0; i < dbIdArray.length; i++) {

        var dbId = dbIdArray[i];

    }
}


///////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////
function initializeViewer(containerId, urn) {

       
       _viewer = createViewer(containerId, urn);

    
}


///////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////
function getThumbnail(urn) {

}

//////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////
function getAccessToken() {
    // This method should fetch token from a service if the current token has expired
    // it might be something like:
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "GetAccessToken.ashx", false);
    xmlHttp.send(null);
    var data = xmlHttp.responseText;

    var newToken = JSON.parse(data).access_token;
    return newToken;
}