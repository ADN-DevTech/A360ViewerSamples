package com.example.adnandroidapigeetest;


import java.io.File;
import java.io.FilenameFilter;
import java.util.ArrayList;
import java.util.List;

 

 
import Async.AsyncCreateBucket;
import Async.AsyncGetThumbnail;
import Async.AsyncPostToBubble;
import Async.AsyncToken;
import Async.AsyncUpload;
import android.os.Bundle;
import android.os.Environment;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.AlertDialog.Builder;
import android.app.Dialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.util.Base64;
import android.view.Menu;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends Activity {

	private  Button btn_get_token;	
	private  Button btn_create_bucket;
	private  Button btn_browser_model;
	private  Button btn_upload_model;
	private  Button btn_post_bubble;
	private  Button btn_show_thumbnail;
	
	private String token;
	
	private String[] mFileList;
	
	private String mChosenFile;
	private static final String FTYPE = ".txt";    
	private static final int DIALOG_LOAD_FILE = 1000;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		
		btn_get_token = (Button)findViewById(R.id.gettoken);
		btn_create_bucket = (Button)findViewById(R.id.createbucket);
		btn_upload_model =(Button)findViewById(R.id.uploadmodel);
		btn_post_bubble =(Button)findViewById(R.id.btnpostbubble);		
		btn_show_thumbnail = (Button)findViewById(R.id.showthumbnail);
		btn_browser_model =  (Button)findViewById(R.id.btnBrowserModel);
		
		//login button click
		btn_get_token.setOnClickListener(new View.OnClickListener() {
			        public void onClick(View v) { 
			           
			        	List<String> forAsync = new ArrayList<String>();
			        	String clienid = getString(R.string._clientid);
				        String clientsecret = getString(R.string._clientkey);
				        forAsync.add(clienid);
				        forAsync.add(clientsecret);
				        
			        	ProgressDialog progress = new ProgressDialog(MainActivity.this);
 			        	AsyncToken task_gettoken =  new AsyncToken(progress);         
			        	task_gettoken._activity = MainActivity.this;
			        	task_gettoken.execute(forAsync); 
			        	
			        	        	
			          }   
					});  
		
		btn_create_bucket.setOnClickListener(new View.OnClickListener() {
	        public void onClick(View v) {   
	        	
	        	 
		    	TextView bucketName = (TextView)findViewById(R.id.txtViewBucketName); 
	        	List<String> forAsync = new ArrayList<String>();
	        	String dummy1 = bucketName.getText().toString();
		        String dummy2 = "dummy";
		        forAsync.add(dummy1);
		        forAsync.add(dummy2);
		        
	        	ProgressDialog progress = new ProgressDialog(MainActivity.this);
 	        	AsyncCreateBucket task_upload =  new AsyncCreateBucket(progress);         
	        	task_upload._activity = MainActivity.this;
	        	task_upload.execute(forAsync);  
	        	 
	          }   
			});  
		
		btn_browser_model.setOnClickListener(new View.OnClickListener() {
	        public void onClick(View v) { 
	          
	        	loadFileList();
	        	onCreateDialog(DIALOG_LOAD_FILE).show();  
	          }   
			});  
		
		btn_upload_model.setOnClickListener(new View.OnClickListener() {
	        public void onClick(View v) {  

	        	if(mChosenFile==null || mChosenFile=="")
	        		return; 
	        	
	        	
	        	File mPath = new File(Environment.getExternalStorageDirectory() + "//ADNAndroidApigeeTest//");
	        	
	        	TextView bucketName = (TextView)findViewById(R.id.txtViewBucketName); 
	        	TextView modelName = (TextView)findViewById(R.id.txtViewModelName); 
	         
	        	
	        	List<String> forAsync = new ArrayList<String>();
	        	String dummy1 = bucketName.getText().toString();
		        String dummy2 = mPath + "/"+modelName.getText().toString();
		        forAsync.add(dummy1);
		        forAsync.add(dummy2);
		        
	        	ProgressDialog progress = new ProgressDialog(MainActivity.this);
	        	//progress.setMessage(getString(R.string.msg_prog_login_async));
	        	AsyncUpload task_upload =  new AsyncUpload(progress);         
	        	task_upload._activity = MainActivity.this;
	        	task_upload.execute(forAsync);  
	        	 
	          }   
			});  
		

		btn_post_bubble.setOnClickListener(new View.OnClickListener() {
	        public void onClick(View v) {  
	        	 
	        	TextView urntxt = (TextView)findViewById(R.id.textViewUrn);
	        	
	        	List<String> forAsync = new ArrayList<String>();
	        	String dummy1 = urntxt.getText().toString();
		        String dummy2 = "dummy";
		        forAsync.add(dummy1);
		        forAsync.add(dummy2);
		        
	        	ProgressDialog progress = new ProgressDialog(MainActivity.this);	      
	        	AsyncPostToBubble post_bubble =  new AsyncPostToBubble(progress);         
	        	post_bubble._activity = MainActivity.this;
	        	post_bubble.execute(forAsync);  
	        	 
	          }   
			}); 
		
		btn_show_thumbnail.setOnClickListener(new View.OnClickListener() {
	        public void onClick(View v) {  
	        	 
	        	TextView urntxt = (TextView)findViewById(R.id.textViewUrn);
	        	
	        	List<String> forAsync = new ArrayList<String>();
	        	String dummy1 = urntxt.getText().toString();
		        String dummy2 = "dummy";
		        forAsync.add(dummy1);
		        forAsync.add(dummy2);
		        
	        	ProgressDialog progress = new ProgressDialog(MainActivity.this);
 	        	AsyncGetThumbnail task_thumb =  new AsyncGetThumbnail(progress);         
	        	task_thumb._activity = MainActivity.this;
	        	task_thumb.execute(forAsync);  
	        	 
	          }  //onClick
			}); // setOnClickListener  login button click
		
		
		
	}
	
	
	private void loadFileList() {
		File mPath = new File(Environment.getExternalStorageDirectory() + "//ADNAndroidApigeeTest//");
		
	    try {
	        mPath.mkdirs();
	    }
	    catch(SecurityException e) {
	        //Log.e(TAG, "unable to write on the sd card " + e.toString());
	    }
	    if(mPath.exists()) {
	        FilenameFilter filter = new FilenameFilter() {
	            public boolean accept(File dir, String filename) {
	                File sel = new File(dir, filename);
	                return true;
	            }
	        };
	        mFileList = mPath.list(filter);
	    }
	    else {
	        mFileList= new String[0];
	    }
	}
	
	protected Dialog onCreateDialog(int id) {
	    Dialog dialog = null;
	    AlertDialog.Builder builder = new Builder(this);

	    switch(id) {
	        case DIALOG_LOAD_FILE:
	            builder.setTitle("Choose your file");
	            if(mFileList == null) {
	                //Log.e(TAG, "Showing file picker before loading the file list");
	                dialog = builder.create();
	                return dialog;
	            }
	            builder.setItems(mFileList, new DialogInterface.OnClickListener() {
	                public void onClick(DialogInterface dialog, int which) {
	                    mChosenFile = mFileList[which];
	                    TextView modelName = (TextView)findViewById(R.id.txtViewModelName); 
	    	        	modelName.setText(mChosenFile);
	    	        	
	                }	                
	            }); 
	           
	            break;
	    }
	    dialog = builder.show();
	    return dialog;
	}

	
	@Override  
    protected void onActivityResult(int requestCode, int resultCode, Intent data)  
    {   
		//login activity returned
        if(20==resultCode)  
        {  
        	 
        }   
     
        super.onActivityResult(requestCode, resultCode, data);  
    }   

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}

}
