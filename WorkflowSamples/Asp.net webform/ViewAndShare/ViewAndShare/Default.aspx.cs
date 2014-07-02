using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using ViewerApigeeUtil;

namespace ViewAndShare
{
    public partial class Default : System.Web.UI.Page
    {


        // Util util = new Util(SecretConstants.BASE_URL);

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {

                Util util = new Util(SecretConstants.BASE_URL);

                if (Session["token"] == null)
                {
                    string token = util.GetAccessToken(SecretConstants.CLIENT_ID,
                       SecretConstants.CLIENT_SECRET).access_token;
                    if (token == string.Empty)
                    {
                        LogExtensions.Log("Authentication error");
                    }
                    Session["token"] = token;
                }

                bool bucketExist = util.IsBucketExist(SecretConstants.DEFAULT_BUCKET_KEY, Session["token"].ToString());
                if (!bucketExist)
                {
                    util.CreateBucket(SecretConstants.DEFAULT_BUCKET_KEY, Session["token"].ToString());
                }

            }

        }
    }
}