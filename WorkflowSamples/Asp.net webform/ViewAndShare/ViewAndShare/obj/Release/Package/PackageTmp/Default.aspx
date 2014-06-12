<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="ViewAndShare.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">

    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>View and Share </title>

    <!-- Bootstrap -->
    <link href="Content/bootstrap.min.css" rel="stylesheet" />

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

    <!-- Custom styles for this template -->
    <link href="Content/sticky-footer-navbar.css" rel="stylesheet" />

    <style>
        #box {
            width: 100%;
            height: 100px;
            text-align: center;
            vertical-align: middle;
            padding: 15px;
            font-family: Arial;
            font-size: 16px;
            border: 2px dashed #bbb;
            color: #bbb;
            background: #eee;
            margin-top: 10px;
            margin-bottom: 10px;
        }
    </style>






</head>
<body>
    <form id="form1" runat="server">
        <div>
        </div>
    </form>


    <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#">Project name</a>
            </div>
            <div class="collapse navbar-collapse">
                <ul class="nav navbar-nav">
                    <li class="active"><a href="#">Home</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </div>
            <!--/.nav-collapse -->
        </div>
    </div>

    <div class="container">

        <!-- Toogle Buttons -->


        <div id="file-uploading" class="collapse">

            <div id="box">Drag & Drop files from your machine on this box.</div>
            <div class="text-right">
                <button id="upload" type="button" class="btn btn-default btn-success">Upload</button>

            </div>

            <%--       <div class="jumbotron">
            </div>--%>
        </div>




        <div class="starter-template">
            <h1>View your models</h1>
            <p class="lead">
                Upload your models and share it with your friends.
              
            </p>

            <!-- Single button -->
            <div class="text-right">
                <div class="btn-group">
                    <button type="button" class="btn btn-primary btn-lg"
                        data-toggle="collapse" data-target="#file-uploading">
                        Upload your files</button>


                    <button type="button" class="btn btn-success btn-lg dropdown-toggle" data-toggle="dropdown">
                        Share &nbsp; <span class="glyphicon glyphicon-share"></span>
                    </button>
                    <ul class="dropdown-menu" role="menu">
                        <li id="getThisLink"><a href="#">Share this link to friends</a></li>
                        <li id="getEmbededHtml" class="open-modal"><a href="#">Get embeded HTML code</a></li>
                        <%-- <li><a href="#">Something else here</a></li>
                        <li class="divider"></li>
                        <li><a href="#">Separated link</a></li>--%>
                    </ul>
                </div>
            </div>


            <div class="row">
                <div id="viewer3d" style="height : 600px"></div>
          </div>
        </div>

    </div>
    <!-- /.container -->



    <!-- Modal Contents Share with friends-->
    <div id="ShareModal" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">

                    <button type="button" class="close" data-dismiss="modal"
                        aria-hidden="true">
                        ×</button>

                    <h4 class="modal-title">Get embeded HTML</h4>
                </div>

                <div class="modal-body">
                    <p>Embed it into your blog or your own webpage</p>
                    <div class="panel panel-default">
                        <div class="panel-body">
                            <div id="setting" class="control-group">
                                <div class="controls">
                                    Width:<input id="width" type="text" class="input-sm" value="800" />
                                    Height:
                              <input id="height" type="text" class="input-sm" value="500" /><br />
                                </div>
                            </div>
                            <div id="iframe_code" class="control-group">


                                <div class="form-group">
                                    <textarea id="iframe_code_box" class="form-control" rows="3">
                                    </textarea>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-primary">Copy to clipboard</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>

            </div>
        </div>
    </div>

        <!-- Modal Contents Processing indicator-->
    <div class="modal fade" id="pleaseWaitDialog" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1>Processing...</h1>
                </div>
                <div class="modal-body">
                    <div class="progress progress-striped active">
                        <div class="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">
                            <span class="sr-only">Processing...</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>


    <div id="footer">
        <div class="container text-center">
            <p class="text-muted">Developed by Daniel Du. Autodesk Developer Network.</p>
        </div>
    </div>


    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="Scripts/jquery-1.9.0.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="Scripts/bootstrap.min.js"></script>
    <script src="Scripts/modernizr-2.5.3.js"></script>

    <script type="text/javascript">
        // Sharing to friends

        $(document).ready(function () {
            $('#getEmbededHtml').click(function () {

                var height = $('#height').val();
                var width = $('#width').val();
                var html = '<iframe src="' + document.URL + '" style="height:' + height + '; width:' + width + '" />';
                $('#iframe_code_box').val(html);

                $('#iframe_code_box').focus();
                $('#iframe_code_box').select();
              

                $('#ShareModal').modal('show');
            });

            $('#getThisLink').click(function () {
                var thisUrl = document.URL;

                window.prompt("Copy to clipboard: Ctrl+C, Enter", thisUrl);




            });
        });
    </script>

    <script type="text/javascript">
        ///////////////////////////////////////////
        // File upload



        $(function () {

            var urn = '';

            if (!Modernizr.draganddrop) {
                alert("This browser doesn't support File API and Drag & Drop features of HTML5!");
                return;
            }

            var box;
            box = document.getElementById("box");
            box.addEventListener("dragenter", OnDragEnter, false);
            box.addEventListener("dragover", OnDragOver, false);
            box.addEventListener("drop", OnDrop, false);

            $("#upload").click(upload);




            function upload() {

                //clappes the upload panel
                //$('#file-uploading').collapse();

                if (selectedFiles && selectedFiles.length > 0) {

                    var data = new FormData();
                    for (var i = 0; i < selectedFiles.length; i++) {
                        data.append(selectedFiles[i].name, selectedFiles[i]);
                    }

                    //show the waiting dialog
                    var waitDiv = $('#pleaseWaitDialog');
                    waitDiv.modal('show');

                    $.ajax({
                        type: "POST",
                        url: "FileUploadHandler.ashx",
                        contentType: false,
                        processData: false,
                        data: data,
                        success: function (result) {

                            //alert(result);
                            var json = JSON.parse(result);

                            //hide the waiting dialog
                            waitDiv.modal('hide');

                            //alert(json.urn + 'transalted.');
                            urn = json.urn;

                            //start the viewer
                            var token = '<%=Session["token"] == null ? "" : Session["token"].ToString()%>';
                           
                            var options = {};
                            // Environment controls service end points viewer uses.
                            options.env = 'ApigeeStaging';
                            // Access token required for authentication and authorization.
                            // It is for now a 3 legged oauth 1 access token.
                            options.accessToken = token;

                            // the document to load in the viewer ...
                            var documentId = 'urn:' + urn;
                            // Load model.
                            var auth = initializeAuth(null, options);
                            loadDocument(viewer, auth, documentId);

                        },
                        error: function () {
                            alert("There was error uploading files!");
                        }

                    });
                }
            }


            function OnDragEnter(e) {
                e.stopPropagation();
                e.preventDefault();
            }

            function OnDragOver(e) {
                e.stopPropagation();
                e.preventDefault();
            }

            function OnDrop(e) {
                e.stopPropagation();
                e.preventDefault();
                selectedFiles = e.dataTransfer.files;
                
                // files is a FileList of File objects. List some properties.
                var output = [];
                for (var i = 0, f; f = selectedFiles[i]; i++) {
                    output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'application/stream', ') - ',
                                f.size, ' bytes, last modified: ',
                                f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                                '</li>');
                }

                document.getElementById('box').innerHTML = '<ul>' + output.join('') + '</ul>';

                //$("#box").text(selectedFiles.length + " file(s) selected for uploading!");
               
            }

        });

    </script>


        <link rel="stylesheet" href="https://viewing-staging.api.autodesk.com/viewingservice/v1/viewers/style.css" type="text/css"/>
        <script src="https://viewing-staging.api.autodesk.com/viewingservice/v1/viewers/viewer3D.min.js"></script>
    <script src="Scripts/Autodesk360App.js"></script>
<%--            <link rel="stylesheet" href="https://viewing.api.autodesk.com/viewingservice/v1/viewers/style.css" type="text/css"/>
        <script src="https://viewing.api.autodesk.com/viewingservice/v1/viewers/viewer3D.min.js"></script>--%>
<%--    <script src="Scripts/viewer3D.min.cp.js"></script>
    <script src="Scripts/viewer3D.min.js"></script>--%>

    <script type="text/javascript">
        $(document).ready(function () {

            var canvasId = 'viewer3d';

            var urn = getParameterByName("urn");
            if (!urn) {
                //default model
                urn = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6ZGFuaWVsX3RyYW5zbGF0ZV9idWNrZXQvRHJpbGwuZHdmeA==';
            }

            var token = '<%=Session["token"] == null ? "" : Session["token"].ToString()%>';

            var options = {};
            // Environment controls service end points viewer uses.
            options.env = 'ApigeeStaging';
            // Access token required for authentication and authorization.
            // It is for now a 3 legged oauth 1 access token.
            options.accessToken = token;

            var viewer = initializeViewer(canvasId, options);


            // the document to load in the viewer ...
            documentId = 'urn:' + urn;   
            // Load model.
            var auth = initializeAuth(null, options);
            loadDocument(viewer, auth, documentId);

            
        });

        function startViewerInIframe(containerId, url) {
            var container = document.getElementById(containerId);

            var iframe = document.createElement('iframe');
            iframe.style = 'height:100%; width=100%';
            iframe.src = url;

            container.appendChild(iframe);
        }
      
        






        function initializeViewer(canvasId, options) {





                    // Initialize env, service end points, and authentication.
            initializeEnvironmentVariable(options);
            initializeServiceEndPoints();
            var auth = initializeAuth(null, options);

                    // Use 3D viewer.
            var container = document.getElementById(canvasId);
            var viewer = new Autodesk.Viewing.Private.GuiViewer3D(container, {});


            viewer.initialize();



                    //export the viewer
            return viewer;
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

        function onErrorLoadModel(msg) {
            var container = document.getElementById('viewer3d');
            if (container) {
                AlertBox.displayError(container, "LOAD Error: " + msg);
            }
        }

    </script>

</body>
</html>
