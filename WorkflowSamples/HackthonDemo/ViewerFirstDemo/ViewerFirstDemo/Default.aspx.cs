using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace ViewerFirstDemo
{
    public partial class Default : System.Web.UI.Page
    {
        public string accessToken= "";

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                string BASE_URL = "https://developer.api.autodesk.com";
      

                string CLIENT_ID = "your consumer key";
                string CLIENT_SECRET = "your secret";

                ViewerApigeeUtil.Util util = new ViewerApigeeUtil.Util(BASE_URL);

                accessToken = util.GetAccessToken(CLIENT_ID, CLIENT_SECRET).access_token;
                
            }
           



        }
    }
}