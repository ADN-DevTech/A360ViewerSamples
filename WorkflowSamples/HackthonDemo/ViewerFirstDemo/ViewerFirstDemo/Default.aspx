<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="ViewerFirstDemo.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>

    <link rel="stylesheet" href="https://viewing.api.autodesk.com/viewingservice/v1/viewers/style.css" type="text/css">
    <script src="https://viewing.api.autodesk.com/viewingservice/v1/viewers/viewer3D.min.js"></script>

    <script>
        function initializeViewer() {
            var options = {};

            // Environment controls service end points viewer uses.
            // Development, Staging, and Production are valid values.
            options.env = "ApigeeProd";
            // Access token required for authentication and authorization.
            // It is for now a 3 legged oauth 1 access token.
            // Here we have a hardcoded token for testing purpose.
            // In practice you need to obtain a valid access token and pass it to viewer, instead of using this token. Note it is valid for two hours so you will need to recreate from time to time.
            options.accessToken = "<%=accessToken%>";   // access token genereated from server side

              // the document to load in the viewer ...
              // URN the winForm app, which uploads and translate files
              documentId = "urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6ZGFuaWVsX3RyYW5sc2F0aW9uX2RlbW8vUm9ib3QrQXJtLmR3Zng=";

              // Initialize env, service end points, and authentication.
              initializeEnvironmentVariable(options);
              initializeServiceEndPoints();
              var auth = initializeAuth(null, options);

              // Use 3D viewer.
              var viewerElement = document.getElementById('viewer3d');
              var viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerElement, {});
              viewer.initialize();

              // Load model.
              loadDocument(viewer, auth, documentId);


              viewer.addEventListener('selection', function () {

                  alert('something is selectede');

              });
          }

          function loadDocument(viewer, auth, documentId) {
              var path = VIEWING_URL + '/bubbles/' + documentId.substr(4);

              Autodesk.Viewing.Document.load(path, auth,
                  function (document) {
                      var svfItems = Autodesk.Viewing.Document.getSubItemsWithProperties(document.getRootItem(),
                              { 'mime': 'application/autodesk-svf' }, true);
                      if (svfItems.length > 0) {
                          viewer.load(svfItems[0].urn);
                      }
                  }, onErrorLoadModel
              );
          }

          function onErrorLoadModel() {
              var container = document.getElementById('viewer3d');
              if (container) {
                  AlertBox.displayError(container, "LOAD Error: " + msg);
              }
          }
    </script>
</head>
<body onload="initializeViewer();" oncontextmenu="return false;">
    <form id="form1" runat="server">
        <div>

            <div id="viewer3d" style="position: absolute; width: 100%; height: 100%; overflow: hidden;"></div>

        </div>
    </form>
</body>
</html>
