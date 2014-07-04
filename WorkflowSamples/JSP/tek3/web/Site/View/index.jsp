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
  	invocation.open('POST', 'https://developer.api.autodesk.com/utility/v1/settoken', false); // do a sync call
  	invocation.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  	invocation.onreadystatechange = handler;  // see above
  	invocation.withCredentials = true;
    invocation.send("access-token=" + token);   // expected to set the cookie upon server response
    </script>
    <%
    if (urn==null || urn.trim().isEmpty()) {
        urn=""; } else {%>



	<link rel="stylesheet" href="https://developer.api.autodesk.com/viewingservice/v1/viewers/style.css" type="text/css">
    <script src="https://developer.api.autodesk.com/viewingservice/v1/viewers/viewer3D.min.js"></script>


      <script>

          var viewers = [];
          function initialize() {

  			var options = {};
        
			options.accessToken = Autodesk.Viewing.Private.getParameterByName("accessToken") ? Autodesk.Viewing.Private.getParameterByName(		"accessToken") : token;
			options.document = 'urn:<%=urn%>';

			var viewerContainer = document.getElementById('viewer1');
			var viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerContainer, {});
			
			Autodesk.Viewing.Initializer(options, function () {
				viewer.initialize();
				//loadDocument(viewer, getAuthObject(), options.document);
				//when the changes are pushed to prod
				loadDocument(viewer, Autodesk.Viewing.Private.getAuthObject(), options.document);
			});

		
           
          }
		  
		  
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
        <A HREF="/tek3/web/Site/View/?urn=<%=pairs.getValue()%>&accessToken=<%=token%>">
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