using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.SessionState;
using ViewerUtil;
using ViewerUtil.Models;

namespace ViewAndShare
{
    /// <summary>
    /// Summary description for TranslationProgress
    /// </summary>
    public class TranslationProgressHandler : IHttpHandler, IRequiresSessionState
    {
        Util util = new Util(SecretConstants.BASE_URL);

        public void ProcessRequest(HttpContext context)
        {
            var urn = context.Request["urn"];

            string accessToken;
            //TODO: check expiration of access token
            if (context.Session["token"] == null)
            {
                AccessToken tokenObj = util.GetAccessToken(SecretConstants.CLIENT_ID, SecretConstants.CLIENT_SECRET);

                accessToken = tokenObj.access_token;
                context.Session["token"] = accessToken;

            }

            accessToken = context.Session["token"].ToString();

            string progress = util.GetBubbleCreateProgress(urn, accessToken);
            

            context.Response.ContentType = "text/plain";
            context.Response.Write(progress);
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}