<%--
  User: bouzeig
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<html>
<head>
    <title>Upload</title>
    <link rel="stylesheet" type="text/css" href="/tek3/web/Common/style/generic.css">
    <script language="javascript">
        function info(txt) { document.getElementById('info').innerHTML = txt; }
        function code(txt) {
            var passedTXT = txt;
			
			var index = passedTXT.indexOf("\"key\" : \"")+"\"key\" : \"".length;
            var key = passedTXT.substring(index, passedTXT.indexOf("\"", index+1));
			
            var index = passedTXT.indexOf("\"id\" : \"")+"\"id\" : \"".length;
            var urn = passedTXT.substring(index, passedTXT.indexOf("\"", index+1));
	
			var base64URN = window.btoa(urn);

            // trigger bubble POST
            var invocation = new XMLHttpRequest();
            function handler() {
              // noop
            }
            invocation.open('POST', 'https://developer.api.autodesk.com/viewingservice/v1/register', false); // do a sync call
            invocation.setRequestHeader('Content-Type', 'application/json');
            invocation.onreadystatechange = handler;  // see above
            invocation.withCredentials = true;
            var tosend = "{ \"urn\": \"" +  base64URN + "\"}";
            invocation.send(tosend);
            document.getElementById('byte_content').innerHTML = "<pre><code>" + "uploaded filename is: '" + key + "'.<BR>" +
                    "urn is: " + base64URN + "</code></pre>";

            invocation = new XMLHttpRequest();
            invocation.open('POST', '/tek3/web/Site/form/view/list.jsp?name=' + key + '&base64=' + base64URN, false); // do a sync call
            invocation.onreadystatechange = handler;  // see above
            invocation.withCredentials = true;
            invocation.send();

        }

        function init() {
            // Check for the various File API support.
            if (window.File && window.FileReader && window.FileList && window.Blob) {
              //info("Ready! All required File APIs are supported.");
            } else {
              //info("The File APIs are not fully supported in this browser.");
            }

            // Reset progress indicator on new file selection.
            var progress = document.querySelector('.percent');
            progress.style.width = '0%';
            progress.textContent = '0%';

            // Add Event Listeners
            document.getElementById('files').addEventListener('change', handleFileSelect, false);

            var dropZone = document.getElementById('drop_zone');
            dropZone.addEventListener('dragover', handleDragOver, false);
            dropZone.addEventListener('drop', handleFileDrop, false);

            //document.querySelector('.readBytesButtons').addEventListener('click', readBlob, false);

            document.querySelector('.sendBytesButtons').addEventListener('click', uploadFile, false);
        }

        function handleFileSelect(evt) {
            var files = evt.target.files;
            var output = [];
            for (var i = 0, f; f = files[i]; i++) {
              output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'application/stream', ') - ',
                          f.size, ' bytes, last modified: ',
                          f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                          '</li>');
            }
            document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
        }

        function handleDragOver(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'copy';
        }

        function handleFileDrop(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var files = evt.dataTransfer.files; // FileList object.
            document.getElementById('files').files = files;

            // files is a FileList of File objects. List some properties.
            var output = [];
            for (var i = 0, f; f = files[i]; i++) {
              output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'application/stream', ') - ',
                          f.size, ' bytes, last modified: ',
                          f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                          '</li>');
            }
            document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
        }

        function readBlob(evt) {
            var files = document.getElementById('files').files;
            if (!files.length) {
              info("Please select a file!");
              return;
            }

            var file = files[0];

            var reader = new FileReader();
            reader.onerror = errorHandler;
            reader.onprogress = updateProgress;
            reader.onabort = function(e) { info('File read cancelled'); };
            reader.onloadstart = function(e) { document.getElementById('progress_bar').className = 'loading'; };
            reader.onload = function(e) {
              // Ensure that the progress bar displays 100% at the end.
              var progress = document.querySelector('.percent');
              progress.style.width = '100%';
              progress.textContent = '100%';
              setTimeout("document.getElementById('progress_bar').className='';", 2000);
            }

            // If we use onloadend, we need to check the readyState.
            reader.onloadend = function(evt) {
              if (evt.target.readyState == FileReader.DONE) { // DONE == 2
                document.getElementById('byte_content').textContent = evt.target.result;
              }
            };

            var blob = file.slice(0, file.size);
            reader.readAsBinaryString(blob);
          }

        function errorHandler(evt) {
            var title = document.getElementById('title');
            switch(evt.target.error.code) {
              case evt.target.error.NOT_FOUND_ERR:
                info("File Not Found!");
                break;
              case evt.target.error.NOT_READABLE_ERR:
                info("File is not readable");
                break;
              case evt.target.error.ABORT_ERR:
                break; // noop
              default:
                info("An error occurred reading this file.");
            };
        }

        function updateProgress(evt) {
            var progress = document.querySelector('.percent');
            // evt is an ProgressEvent.
            if (evt.lengthComputable) {
              var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
              // Increase the progress bar length.
              if (percentLoaded < 100) {
                progress.style.width = percentLoaded + '%';
                progress.textContent = percentLoaded + '%';
              }
            }
        }

        // CORS
        // --------------------------------------
        // Create the XHR object.
        function createCORSRequest(method, url, headers) {
          var xhr = new XMLHttpRequest();
          if ("withCredentials" in xhr) {
            // XHR for Chrome/Firefox/Opera/Safari.
            xhr.open(method, url, true);
            xhr.withCredentials = true;
            for (var h in headers) { xhr.setRequestHeader(h, headers[h]); }
          } else {
            // CORS not supported.
            xhr = null;
          }
          return xhr;
        }

		function CreateBucket(bucketKey,invocation){
		
		
				function handler() {
				  if (invocation.readyState == 4) { //4 = 'loaded'
					var payload = invocation.responseText; // TODO no-op
					if (invocation.status==200){
						//created successfully
					}else if(invocation.status==409) {  
						//alert('conflict')
						//conflict, existed
					}
					else {
						alert('error when creating bucket');
					}
					 
				  }
				}
			invocation.open('POST', 'https://developer.api.autodesk.com/oss/v1/buckets', false); // do a sync call
			invocation.setRequestHeader('Content-Type', 'application/json');
			invocation.onreadystatechange = handler;  // see above
			invocation.withCredentials = true;
			var toSend =  "{\"bucketKey\":\"" + bucketKey + "\",\"servicesAllowed\":{},\"policy\":\"transient\"}";
			invocation.send(toSend);
			
		}
		
        // Make the actual CORS request.
        function uploadFile(evt) {
            var files = document.getElementById('files').files;
            if (!files.length) {
              info("Please select a file!");
              return;
            }
            var f = files[0];

            var invocation = new XMLHttpRequest();
            function handler() {
              if (invocation.readyState == 4) { //4 = 'loaded'
                 var payload = invocation.responseText; // TODO no-op
              }
            }
            var token = '<%=(String) session.getAttribute("token")%>'; // set from the server side on first time invocation.
            invocation.open('POST', 'https://developer.api.autodesk.com/utility/v1/settoken', false); // do a sync call
            invocation.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            invocation.onreadystatechange = handler;  // see above
            invocation.withCredentials = true;
            invocation.send("access-token=" + token);   // expected to set the cookie upon server response			
		
			 //random bucket to avoid confliction
			 // NOTE: do not need to create a bucket every time, it's recommended to use one bucket 
			var uploadBucket = "translation_daniel" + Math.ceil(Math.random() * 99);
			
			//if it does not exist, you need to create one,
			//please refer to http://developer.api.autodesk.com/documentation/v1/oss.html#oss-bucket-and-object-api-v1-0
			CreateBucket(uploadBucket,invocation);
			
			
			
            // create CORS request
            var method = 'PUT';
            
            var uploadServerUrl = "https://developer.api.autodesk.com";
            var url = uploadServerUrl + '/oss/v1/buckets/' + uploadBucket + '/objects/' + escape(f.name);
            var headers = {
                'Content-Type'  : f.type || 'application/stream',
            };

            var xhr = createCORSRequest(method, url, headers);
            if (!xhr) {
                info('CORS not supported');
                return;
            }

            // Handlers.
            xhr.onload = function() { code(xhr.responseText); };
            xhr.onerror = function() { info('Woops, there was an error making the request.'); };
            xhr.onprogress = updateProgress;

            var reader = new FileReader();
            reader.onerror = errorHandler;
            //reader.onprogress = updateProgress;
            reader.onabort = function(e) { info('File read cancelled'); };
            reader.onloadstart = function(e) { document.getElementById('progress_bar').className = 'loading'; };
            reader.onload = function(e) {
              // Ensure that the progress bar displays 100% at the end.
              var progress = document.querySelector('.percent');
              progress.style.width = '100%';
              progress.textContent = '100%';
              setTimeout("document.getElementById('progress_bar').className='';", 2000);
            }
            reader.onloadend = function(evt) {
              if (evt.target.readyState == FileReader.DONE) {
                xhr.send(evt.target.result);
              }
            };
            var blob = f.slice(0, f.size);
            reader.readAsArrayBuffer(blob);
        }
    </script>
</head>


  <body>
  <jsp:include page="../Headers/Top.jsp" />
    <img src="test.none" width="1" height="200">
    <div id="progress_bar"><div class="percent">0%</div></div>
    <h3 id="info"></h3>
      <p></p>
    <div>
        <input  type="file" id="files" name="file" />
        <output id="list"></output>
    </div>

    <div class="drop_zone">
        <div id="drop_zone">Drop files here</div>
    </div>

  <!--
    <span >
        <button class="readBytesButtons">Read File</button>
    </span>-->
      <span >
          <button class="sendBytesButtons">Upload File</button>
      </span>

    <div id="byte_content"></div>
    <script>
      init();
    </script>

  </body>
</html>