<%@ page import="java.util.Map" %>
<%@ page import="java.util.Iterator" %>
<%--
  User: bouzeig
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<head>
    <link rel="stylesheet" type="text/css" href="/tek3/web/Common/style/generic.css">
</head>

<%
    String token = (String) session.getAttribute("token");
    String urn = request.getParameter("urn");%>
    <script>
    var invocation = new XMLHttpRequest();
    function handler() {
      if (invocation.readyState == 4) {
         var payload = invocation.responseText; // TODO no-op
      }
    }
    var token = '<%=token%>'; // set from the server side on first time invocation.
  	invocation.open('POST', 'https://developer.api.autodesk.com/viewingservice/v1/settoken', false); // do a sync call
  	invocation.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  	invocation.onreadystatechange = handler;  // see above
  	invocation.withCredentials = true;
    invocation.send("access-token=" + token);   // expected to set the cookie upon server response
    </script>
    <%
    if (urn==null || urn.trim().isEmpty()) {
        urn=""; } else {%>




	<link rel="stylesheet" href="https://viewing.api.autodesk.com/viewingservice/v1/viewers/style.css" type="text/css"/>
	<script src="https://viewing.api.autodesk.com/viewingservice/v1/viewers/viewer3D.min.js"></script>


      <script src="jquery-2.0.3.min.js"></script>

      <script>

          var viewers = [];
          function initialize() {

  			var options = {};
              // Environment controls service end points viewer uses.
              // Development, Staging, and Production are valid values.
              options.env = "ApigeeProd";
  			options.accessToken = getParameterByName("accessToken") ? getParameterByName("accessToken") : token;
              initializeEnvironmentVariable(options);
              initializeServiceEndPoints();
              auth = initializeAuth(token);
  			// dwf sample
              //loadDocument('viewer1', 'urn:dXJuOmFkc2suczM6ZGVyaXZlZC5maWxlOlZpZXdpbmdTZXJ2aWNlVGVzdEFwcC91c2Vycy9EYXZpZF9XYXR0L0Jsb3dlci5kd2Y', Autodesk.GuiViewer3D, {'type':'geometry', 'role':'3d'}, auth);

  			// from OSS
            // loadDocument('viewer1', 'urn:dXJuOmFkc2sub3NzOmZpbGUuZnM6c2FtcGxlcy9ibG93ZXIuZHdm', Autodesk.GuiViewer3D, {'type':'geometry', 'role':'3d'}, auth);
              loadDocument('viewer1', 'urn:<%=urn%>', Autodesk.GuiViewer3D, {'type':'geometry', 'role':'3d'}, auth);
          }

          function loadDocument(containerId, documentId, viewerClass, geometryFilter, auth) {
              // Create and initialize the given viewer in the given container.
              //
              var viewerContainer = document.getElementById(containerId);
              var viewer = new viewerClass(viewerContainer, {});
              viewer.initialize();

              // Load the given document.  When loaded, find the requested geometry type
              // and load its viewable into the viewer.
              //
              Autodesk.Document.load(documentId, auth,
                  function(document) { // onLoadCallback
                      var rootItem = document.getRootItem();
                      var geometryItems = Autodesk.Document.getSubItemsWithProperties(rootItem, geometryFilter, true);

                      // Load the first geometry.
                      //
                      viewer.load(document.getViewablePath(geometryItems[0]));
                  },
                  function(msg) { // onErrorCallback
                  }
              );

              return viewer;
          }
      </script>
    <%}
%>

<html>
  <head>
    <title>Site Administration</title>
  </head>
  <%if(urn.isEmpty()){%>
    <body>
  <%} else {%>
    <body onload="initialize();" oncontextmenu="return false;">
  <%}%>
  <jsp:include page="../Headers/Top.jsp" />
  <%if(urn.isEmpty()){%>
    <div class="form">
        <% Map viewMap = (Map) session.getAttribute("viewMap");
        if (viewMap!=null && !viewMap.isEmpty()) {
            Iterator it = viewMap.entrySet().iterator();
            while (it.hasNext()) {
                Map.Entry pairs = (Map.Entry)it.next();
        %>
        <A HREF="/tek3/web/Site/View/?urn=<%=pairs.getValue()%>">
        <IMG SRC="https://developer.api.autodesk.com/viewingservice/v1/thumbnails/<%=pairs.getValue()%>"></A>
        <!--https://developer.api.autodesk.com/viewingservice/v1/items/urn:adsk.viewing:fs.file:dXJuOmFkc2suczM6ZGVyaXZlZC5maWxlOnRyYW5zbGF0aW9uXzI1X3Rlc3RpbmcvRFdGL01NMzUwMEFzc2VtYmx5LmR3Zg==/output/1/image15.png-->
        <%=pairs.getKey()%><BR>
        <%}}%>
      <!--<form action="index.jsp" autocomplete="false" method="POST">
      URN:  <input type="text" name="urn" size="100"><BR>

      <BR>
      <input type="submit" value="View">

      </form>-->
    </div>
    <%} else {%>
      <div id="viewer1" style="position:absolute; left:390px; top:100px; width:1000px; height:740px; border-color: black; overflow-y:auto; overflow-x:auto; border-style:solid; border-width: 1px;"></div>
    <%}%>
  </body>
</html>