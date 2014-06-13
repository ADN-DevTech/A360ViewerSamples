package Async;

import java.util.List;

import com.example.adnandroidapigeetest.GlobalHelper;
import com.example.adnandroidapigeetest.MainActivity;
import com.example.adnandroidapigeetest.R;
import com.example.adnandroidapigeetest.R.id;
import com.google.gson.Gson;

import Services.RestServices;
import android.app.ProgressDialog;
import android.os.AsyncTask;
import android.widget.TextView;
import android.widget.Toast;

public class AsyncPostToBubble extends  AsyncTask<List<String>, Void, Void>{

	public MainActivity _activity;
	//indicate whether the task completed
    private Boolean _isOK = false;
    
  //ini progress dialog
  	private ProgressDialog progress;
  	  public AsyncPostToBubble(ProgressDialog progress) {
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
					  "post bubble succeeded!",
					Toast.LENGTH_LONG).show(); 
	    	  
	    	 
	    	 //tell the main activity to refresh
	    	 _activity.setResult(20, null);
	    	 
	    	 
	    	 TextView urntxt = (TextView)_activity.findViewById(R.id.textViewUrn);
	    	  urntxt.setText(GlobalHelper._currentUrn);
	    }
	    else
	    {
	    	// show msg of failure
	    	 Toast.makeText(
					  _activity.getApplicationContext(),
					  "Failed to post bubble",
					Toast.LENGTH_LONG).show();
	    }
	    
	    // end login activity
	    //return to main activity
	   
	    //_activity.finish();
	  }
	@Override
	protected Void doInBackground(List<String>... params) {
		// TODO Auto-generated method stub
		if(RestServices.srv_post_bubble(params[0].get(0)) ) 
		 {  			 
			 _isOK = true;
		 }
		 else
		 {
			 _isOK = false;
		 }
		 
		
		return null;
	}

}
