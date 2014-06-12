'use strict';

//==============================================================================
// A360 Viewing Application Reference Implementation
// Builds on the basic ViewingApplication by adding A360 specific UI and behaviors.
// This includes adding a tree browser for browsing the contents of the document.
// Upon clicking on an item, the appropriate viewer is launched.
//==============================================================================
Autodesk.A360ViewingApplication = function(elementId, options)
{
    var app = this;
    this.jQuery = (options && options.jQuery) ? options.jQuery : $;

    Autodesk.Viewing.ViewingApplication.call(this, elementId, options);

    // Create the view.
    // TODO:
    // Add a 'pin' UI that controls the docking.
    this.viewerContainer  = document.createElement("div");
    this.viewerContainer.className = "viewer-container docked";
    this.viewerContainer.id = this.appContainerId + '-viewing-container';

    app.container.appendChild(this.viewerContainer);
};

Autodesk.A360ViewingApplication.prototype = Object.create(Autodesk.Viewing.ViewingApplication.prototype);

// generate an id for the viewerContainer
Autodesk.A360ViewingApplication.prototype.getViewerContainer = function()
{
    return this.viewerContainer;
};

Autodesk.A360ViewingApplication.prototype.getLeftPanelContainerId = function()
{
    return this.appContainerId + '-leftPanel';
};

Autodesk.A360ViewingApplication.prototype.createExplorerTree = function(modelDocument, parentContainerId)
{
    var application = this;
    var explorerDelegate = new Autodesk.Viewing.Private.TreeDelegate();

    explorerDelegate.getTreeNodeId = function(node)
    {
        return node.guid;
    };

    explorerDelegate.getTreeNodeLabel = function(node)
    {
        // Just the name for now, but can display any info from the node.
        //
        return node.name || 'Unnamed ' + node.type;
    };

    explorerDelegate.getTreeNodeClass = function(node)
    {
        // Return the type of the node.  This way, in css, the designer can specify
        // custom styling per type like this:
        //
        // group.design > icon.collapsed {
        //    background: url("design_open.png") no-repeat;
        //
        // group.design > icon.expanded {
        //    background: url("design_open") no-repeat;
        //
        return node.type === 'geometry' ? node.type + '_' + node.role : node.type;
    };

    explorerDelegate.isTreeNodeGroup = function(node)
    {
        // Folders and designs are currently what we consider groups.
        //
        return node.type === 'folder' || node.type === 'design' || (1 < modelDocument.getNumViews(node));
    };

    explorerDelegate.shouldCreateTreeNode = function(node)
    {
        // Only filtering out resource nodes.
        //
        return node.type !== 'resource';
    };

    explorerDelegate.onTreeNodeHover = function(tree, node)
    {
        //stderr(node.name);
    };

    explorerDelegate.onTreeNodeClick = function(tree, node, event)
    {
        application.selectItem(node);

        // NOTE:
        // We can change the selection behavior here and in onItemSelected.
        // Currently we force a single selected object.  We can check the
        // event to see if any modifiers were used, and change what we consider
        // selected.
    };

    var viewableItems = Autodesk.Viewing.Document.getSubItemsWithProperties(modelDocument.getRootItem(), {'type':'folder','role':'viewable'}, true);

    // There should be at least one folder whose role is viewable.
    // We'll display the first one.
    //
    if(viewableItems.length > 0)
    {
        var options = {};
        options.jQuery = this.jQuery;
        this.myTree = new Autodesk.Viewing.Private.Tree(explorerDelegate, viewableItems[0], parentContainerId, options);
    }
    else
    {
        console.log(modelDocument);
        throw 'Invalid document';
    }
};

Autodesk.A360ViewingApplication.prototype.createBrowserView = function(modelDocument, parentContainerId)
{
    var application = this;
    var browserDelegate = new Autodesk.Viewing.Private.BrowserDelegate();

    browserDelegate.getNodeId = function(node)
    {
        return node.guid;
    };

    browserDelegate.getNodeLabel = function(node)
    {
        // Just the name for now, but can display any info from the node.
        //
        return node.name ? node.name : 'Unnamed ' + node.type;
    };

    browserDelegate.getNodeClass = function(node)
    {
        return node.type;
    };

    browserDelegate.hasThumbnail = function(node)
    {
        return ( (node.hasThumbnail) && (node.hasThumbnail).toLowerCase() === "true" );
    };

    browserDelegate.getThumbnail = function(node)
    {
        var requestedWidth = application.options && application.options.hasOwnProperty('kThumbnailWidth') ? application.options.kThumbnailWidth : 200;
        var requestedHeight = application.options && application.options.hasOwnProperty('kThumbnailHeight') ? application.options.kThumbnailHeight : 200;

        return this.hasThumbnail(node) ? application.myDocument.getThumbnailPath(node, requestedWidth, requestedHeight) : null;
    };

    browserDelegate.onNodeClick = function(browser, node, event)
    {
        application.selectItem(node);
        event.stopPropagation();
    };

    browserDelegate.hasContent = function(node)
    {
        return 1 < modelDocument.getNumViews(node);
    };

    browserDelegate.addContent = function(node, parentId)
    {
        var parent = application.jQuery("#card" + parentId);
		var cardparent = application.jQuery("#" + parentId);
		
		var wrapper = application.jQuery('<div class="wrappercam"><p>Views</p></div>');
        application.jQuery(wrapper).appendTo(parent);
		
        var views = application.jQuery('<div class="cameraviews"></div>');
        application.jQuery(views).appendTo(wrapper);

        function addViewClickHandler(viewName, view) {
            application.jQuery('<div class="cameraview">' + viewName + ' </div>').appendTo(views).click( function(e)
            {
                application.selectItem(view);
                e.stopPropagation();
            });
        }

        var childCount = node.children ? node.children.length : 0;
        var viewCount = 0;
        for (var childIndex = 0; childIndex < childCount; ++childIndex) {
            // Add the camera views.
            var child = node.children[childIndex];
            if (child.type === "view") {
                ++viewCount;
                addViewClickHandler(this.getNodeLabel(child), child);
            }
        }
		var viewsbtn = application.jQuery('<div class="viewsbtn"><p id="count">'+ viewCount +'</p><p id="close">X</p></div>');
        application.jQuery(viewsbtn).appendTo(cardparent).click( function(e)
                {	
					parent.toggleClass("flipped");
					e.preventDefault();
					return false;
                });
    };

    // The browser starts looking for geometry items at the same root as the tree -
    // the first folder-viewable item - not from the document's root.
    //
    var viewableItems = Autodesk.Viewing.Document.getSubItemsWithProperties(modelDocument.getRootItem(), {'type':'folder','role':'viewable'}, true);
    var root = viewableItems[0];
    var leafItems = Autodesk.Viewing.Document.getSubItemsWithProperties(root, {'type':'geometry'}, true);

    var options = {};
    options.jQuery = this.jQuery;
    this.myBrowser = new Autodesk.Viewing.Private.Browser(browserDelegate, leafItems, parentContainerId, options);
};

Autodesk.A360ViewingApplication.prototype.loadDocumentWithItemAndObject = function(documentId, itemId, objectId)
{
    var app = this;
    function loadItem(document) {
        // This demonstrates that you can either select the item directly (if you have it, it's
        // more efficient), or by its guid.  Note, a callback function can be provided, which
        // is executed once the item has been selected.  In this case, isolateObject() isolates
        // the object that's requested.
        //
        // Alternatively, one can add new methods to A360ViewingApplication to abstract all of this
        // functionality, or override its existing loadDocument and selectItem, selectItemById
        // methods to execute these extra operations.
        //
        var geometryItems;
        if(itemId) {
            geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(document.getRootItem(), {'guid':itemId}, true);
            if(geometryItems.length > 0) {
                app.selectItem(geometryItems[0], geometryLoaded, geometryFailedToLoad);
            }
        } else {
            geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(document.getRootItem(), {'type':'geometry'}, true);
            if(geometryItems.length > 0) {
                app.selectItemById(geometryItems[0].guid, geometryLoaded, geometryFailedToLoad);
            }
        }
    }

    function loadFailed(errorCode, errorMsg) {
        // Display an error message.
        var container = app.getViewerContainer();
        if (container) {
            Autodesk.Viewing.Private.ErrorHandler.reportError(container, errorCode);
        }
    }

    function geometryLoaded(viewer, item) {
        // Check if this is a 3d geometry item.
        //
        if (item.type === 'geometry' && item.role === '3d' && viewer) {
            var objectToLoad = parseInt(objectId);
            if (objectToLoad) {
                viewer.isolateById(objectToLoad);
            }
        }

        // If left panel is not created, then search field is attached to
        // the viewer container and on full screen mode changes it needs
        // to appear/disappear. Add the appropriate callback.
        //
        var viewer = app.getCurrentViewer();
        if(viewer && (viewer instanceof app.getViewerClass(app.k3D))) {
            if (app.myLeftPanel === null) {
                var search = app.jQuery('.search');
                viewer.addEventListener( Autodesk.Viewing.FULLSCREEN_MODE_EVENT, function(e) {
                    if (search.length > 0) {
                        var showSearchField = (e.mode === viewer.ScreenMode.kNormal);
                        if (showSearchField)
                            search[0].style.display = "block";
                        else
                            search[0].style.display = "none";
                    }
                });
            }
        }
    }

    function geometryFailedToLoad(errorCode, errorMsg) {
        // Display an error message.
        var container = app.getViewerContainer();
        if (container) {
            Autodesk.Viewing.Private.ErrorHandler.reportError(container, errorCode);
        }
    }

    app.loadDocument(documentId, loadItem, loadFailed);
};

Autodesk.A360ViewingApplication.prototype.selectItem = function(item, onItemSelectedCallback, onItemFailedToSelectCallback)
{
    if (item.type === 'folder' || item.type === 'design') {

        var groupId = this.myTree.delegate().getTreeNodeId(item);
        var success = this.myTree.setCollapsed( groupId, !this.myTree.isCollapsed(groupId));
        if(success) {
            // No viewer for this folder item, so pass in null.
            //
            if(onItemSelectedCallback) {
                onItemSelectedCallback(null, item);
            }
        }
        return success;

    } else if (1 < this.myDocument.getNumViews(item)) {

        // This is a leaf node. If the node is selected then collapse or expand.
        // Otherwise, load it.
        var nodeId = this.myTree.delegate().getTreeNodeId(item);
        var isSelected = this.myTree.isSelected(nodeId);
        if (isSelected) {
            var success = this.myTree.setCollapsed( nodeId, !this.myTree.isCollapsed(nodeId));
            if (success) {
                // No viewer for this folder item, so pass in null.
                //
                if(onItemSelectedCallback) {
                    onItemSelectedCallback(null, item);
                }
            }
            return success;
        }
    }
    return Autodesk.Viewing.ViewingApplication.prototype.selectItem.call(this, item, onItemSelectedCallback, onItemFailedToSelectCallback);
};

Autodesk.A360ViewingApplication.prototype.onItemSelected = function(item)
{
    if (this.myExplorerView)
    {
         this.myTree.setSelection( [this.myTree.delegate().getTreeNodeId(item)]);
         this.myBrowser.setSelection( [this.myBrowser.delegate().getNodeId(item)]);
    }
    Autodesk.Viewing.ViewingApplication.prototype.onItemSelected.call(this, item);
    this.searchField.style.visibility = (item.role && item.role === '2d') ? 'hidden' : 'visible';
};

Autodesk.A360ViewingApplication.prototype.createLeftPanel = function( searchField )
{
    var app = this;

    // create element
    function CL(tag, className, id){
        var newElement = document.createElement(tag);
        newElement.className = className;
        if( id ){
            newElement.id = id;
        }
        return newElement;
    }

    // Set the callback for resizing the left and view panel.
    //
    var resizeSliderMouseDown = false;
    var resizeSliderMouseInitPosX = 0;

    // Since some browsers return % and some px when queried for min/max width,
    // hardcode here what we have in css for left panel.
    var leftWidthGlobal   = 20;  // css: width     (20%)
    var maxWidthLeftPanel = 70;  // css: max-width (70%)
    var minWidthLeftPanel = 15;  // css: min-width (15%)

    function dragResizeSlider(e) {
        if (resizeSliderMouseDown) {
            var relativeDrag  = e.pageX - resizeSliderMouseInitPosX;
            resizeSliderMouseInitPosX = e.pageX;

            var left = app.jQuery('.leftpanel');
            var view = app.jQuery(app.getViewerContainer());
            var slider = app.jQuery('.resizeslider');
            var appContainer = app.jQuery('#' + app.appContainerId );

            var sliderWidth = ((slider.width()/appContainer.width())*100);
            var leftWidth   = leftWidthGlobal + ((relativeDrag/appContainer.width())*100);

            leftWidth = (leftWidth > maxWidthLeftPanel) ? maxWidthLeftPanel : leftWidth;
            leftWidth = (leftWidth < minWidthLeftPanel) ? minWidthLeftPanel : leftWidth;
            leftWidthGlobal = leftWidth;

            left.width( (leftWidth).toString() + "%" );
            view.width( (100-leftWidth-sliderWidth).toString() + "%");

            var viewer = app.getCurrentViewer();
            if (viewer) {
                viewer.resize();
                viewer.resizePanels({viewer: viewer});
            }
        }
    }

    function stopDraggingResizeSlider(e) {
        if (resizeSliderMouseDown) {
            resizeSliderMouseDown = false;
            var slider = app.jQuery('.resizeslider');
            var left   = app.jQuery('.leftpanel');
            var view   = app.jQuery(app.getViewerContainer());
            slider[0].onmousemove = function(e) {};
            left[0].onmousemove = function(e) {};
            view[0].onmousemove = function(e) {};

            slider[0].onmouseup = function(e) {};
            left[0].onmouseup   = function(e) {};
            view[0].onmouseup   = function(e) {};
        }
    }

    // Create left panel.
    app.leftPanel = CL("div", "leftpanel docked");
    var leftPanel = app.leftPanel;

    // Create the view buttons and attach them to left panel.
    var viewButtons = CL("div", "viewbuttons");

    // Add viewerButtons to left panel
    leftPanel.appendChild( viewButtons );

    // Add search field.
    leftPanel.appendChild(searchField);

    var treeViewBtn = CL("button", "viewbuttons treebtn");
    treeViewBtn.addEventListener('click', function( event )  {
        app.myExplorerView = app.myTree;
        app.myTree.show( true );
        app.myBrowser.show( false );
    });

    var browserViewBtn = CL("button", "viewbuttons browserbtn");
    browserViewBtn.addEventListener('click', function( event )  {
        app.myExplorerView = app.myBrowser;
        app.myTree.show( false );
        app.myBrowser.show( true );
    });
    viewButtons.appendChild( browserViewBtn );
    viewButtons.appendChild( treeViewBtn );

    var explorer = CL("div", "explorer", this.getLeftPanelContainerId() + "-explorer");
    leftPanel.appendChild( explorer );
    leftPanel.explorer = explorer;

    var resizeSlider = CL("div", "resizeslider");

    // Now attach the left panel and the view to the application.
    app.container.insertBefore(leftPanel, app.viewerContainer);
    app.container.insertBefore(resizeSlider, app.viewerContainer);

    resizeSlider.addEventListener( 'mousedown', function(e) {
        if (!resizeSliderMouseDown) {
            resizeSliderMouseDown = true;
            resizeSliderMouseInitPosX = e.pageX;

            var slider = app.jQuery('.resizeslider');
            var left   = app.jQuery('.leftpanel');
            var view   = app.jQuery(app.getViewerContainer());
            slider[0].onmousemove = dragResizeSlider;
            left[0].onmousemove   = dragResizeSlider;
            view[0].onmousemove   = dragResizeSlider;

            slider[0].onmouseup = stopDraggingResizeSlider;
            left[0].onmouseup   = stopDraggingResizeSlider;
            view[0].onmouseup   = stopDraggingResizeSlider;
        }
    });

    app.container.addEventListener('mouseleave', stopDraggingResizeSlider );

    window.addEventListener('resize', function(e) {
        // Make sure that the slider is always visible,

        var left = app.jQuery('.leftpanel');
        var slider = app.jQuery('.resizeslider');
        var view = app.jQuery(app.getViewerContainer());
        var appContainer = app.jQuery('#' + app.appContainerId );

        var sliderWidth = ((slider.width()/appContainer.width())*100);
        if (leftWidthGlobal+sliderWidth>99) leftWidthGlobal = 99 - sliderWidth;

        left.width( (leftWidthGlobal).toString() + "%" );
        view.width( (100-leftWidthGlobal-sliderWidth).toString() + "%");
    });

    return leftPanel;
};

Autodesk.A360ViewingApplication.prototype.onDocumentLoaded = function(modelDocument)
{
    var app = this;

    function showDesignExplorer( modelDocument )
    {
        var viewableItems = Autodesk.Viewing.Document.getSubItemsWithProperties(modelDocument.getRootItem(), {'type':'folder','role':'viewable'}, true);
        var root = viewableItems[0];
        var geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(root, {'type':'geometry'}, true);
        if (geometryItems.length === 0)
            return false;

        if (geometryItems.length === 1) {
            // Check if the item has camera views.
            return modelDocument.getNumViews( geometryItems[0] ) > 1;
        }
        return true;
    }

    // If the explorer already exists make sure to clear it out
    // so the new document loads correctly
    if( app.myExplorerView ) {
        var explorer = app.leftPanel.explorer;
        while(explorer.firstChild){
            explorer.removeChild(explorer.firstChild);
        }
    }

    // Create a search field.
    var searchField = document.createElement( "input" );
    searchField.className = "searchfield";
    searchField.placeholder = 'Search the currently displayed content';
    searchField.type = 'search';
    searchField.incremental = "incremental";

    // Search on keydown.  Since search can be expensive, wait a small amount
    // of time before starting a search so that we don't search on every
    // keystroke.
    //
    var searchTimer = null;

    function doIncrementalSearch()
    {
        if(searchTimer) {
            clearTimeout(searchTimer);
        }
        searchTimer = setTimeout(doSearch, 500);
    }

    function doSearch()
    {
        // Search only works for 3D content at the moment.  Check if we
        // have a 3D viewer.
        //
        var viewer = app.getCurrentViewer();
        if(viewer && (viewer instanceof app.getViewerClass(app.k3D)) && searchField.value !== viewer.searchText)
        {
            viewer.search(searchField.value, function(resultIds)
                {
                    viewer.isolateById(resultIds);
                }
            );
            stderr('Searching: ' + searchField.value);
        }
        searchTimer = null;
    }

    searchField.addEventListener('keydown', function(e) {
        doIncrementalSearch();
    });

    // This is to detect when the user clicks on the 'x' to clear.
    //
    searchField.addEventListener('click', function(e) {
        if(searchField.value === '')
        {
            doSearch();
        }
    });

    this.searchField = searchField;

    if (showDesignExplorer( modelDocument ))
    {
        app.myLeftPanel = app.createLeftPanel( searchField );
        var explorer  = app.myLeftPanel.explorer;

        app.createExplorerTree(modelDocument, explorer.id);
        app.createBrowserView(modelDocument, explorer.id);

        app.myExplorerView  = app.myTree;
        app.myTree.show( true );
        app.myBrowser.show( false );

        $(app.viewerContainer).width('79.5%'); // Design Explorer - initial width(20%)+ resize slider width(5%)
    }
    else
    {
        app.myExplorerView = null;
        app.myLeftPanel = null;

        var viewableItems = Autodesk.Viewing.Document.getSubItemsWithProperties(modelDocument.getRootItem(), {'type':'folder','role':'viewable'}, true);
        var root = viewableItems[0];
        var geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(root, {'type':'geometry'}, true);
        if (geometryItems.length > 0)
        {
            // Create the resizable search field.
            var search = document.createElement( "div" );
            search.className = "search";
            app.viewerContainer.appendChild(search);
            search.appendChild( searchField );
        }
        else
        {
            var container = app.getViewerContainer();
            if (container) {
                Autodesk.Viewing.Private.ErrorHandler.reportError(container, Autodesk.Viewing.ErrorCodes.BAD_DATA_NO_VIEWABLE_CONTENT);
            }
        }
    }
};
