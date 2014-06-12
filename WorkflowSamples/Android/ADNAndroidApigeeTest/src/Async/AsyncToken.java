package Async;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.StatusLine;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;
 
 
 
import com.example.adnandroidapigeetest.GlobalHelper;
import com.example.adnandroidapigeetest.MainActivity;
import com.example.adnandroidapigeetest.R;
import com.example.adnandroidapigeetest.R.id;
import com.google.gson.Gson;

import Services.RestServices;
import android.app.ProgressDialog;
import android.content.Intent;
import android.os.AsyncTask;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;
import android.view.View;

public class AsyncToken extends AsyncTask<List<String>, Void, Void>{

	private String _clientid;
	private String _clientsecret;
	public MainActivity _activity;
	//indicate whether the task completed
    private Boolean _isOK = false;
   
  //ini progress dialog
  	private ProgressDialog progress;
  	  public AsyncToken(ProgressDialog progress) {
  		    this.progress = progress;
  		  }

  		  public void onPreExecute() {
  		    progress.show();
  		  } 
  		  
  		  
    // task completed
	  public void onPostExecute(Void unused) { 
	    progress.dismiss();
	    
	    
	    if(_isOK)
	    {
	    	// show msg of succeess
	    	 Toast.makeText(
					  _activity.getApplicationContext(),
					  "get token Succeeded!",
					Toast.LENGTH_LONG).show(); 
	    	  
	    	 
	    	 //tell the main activity to refresh
	    	 _activity.setResult(20, null);	    	 
	    	 
	    	 TextView tokentxt = (TextView)_activity.findViewById(R.id.textViewToken);
	    	 tokentxt.setText(GlobalHelper._currentToken);
	    }
	    else
	    {
	    	// show msg of failure
	    	 Toast.makeText(
					  _activity.getApplicationContext(),
					  "Failed to get token",
					Toast.LENGTH_LONG).show();
	    }
	    
	    // end login activity
	    //return to main activity
	   
	    //_activity.finish();
	  }
  	
	@Override
	protected Void doInBackground(List<String>... params) {
		// TODO Auto-generated method stub
		
		// call service of login
		// input user name and password
		
		 if(RestServices.srv_authenticate(
				 params[0].get(0),   // user name
				 params[0].get(1) ))  // password
		 {  
			 _clientid =  params[0].get(0);
			 _clientsecret =  params[0].get(1);
			 
			 _isOK = true;
		 }
		 else
		 {
			 _isOK = false;
		 }
		 
		return null;
		
	 
	} 
	
	

}
