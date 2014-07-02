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
    /// Summary description for GetAccessToken
    /// </summary>
    public class GetAccessToken : IHttpHandler, IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            string respJson = string.Empty;

            Util util = new Util(SecretConstants.BASE_URL);

            AccessToken token = util.GetAccessToken(SecretConstants.CLIENT_ID,
                SecretConstants.CLIENT_SECRET);


            if (context.Session["token"] == null)
            {
                string accessToken = token.access_token;
                if (accessToken == string.Empty)
                {
                    LogExtensions.Log("Authentication error");
                }
                context.Session["token"] = accessToken;
            }

            respJson = Newtonsoft.Json.JsonConvert.SerializeObject(token);
          
            context.Response.ContentType = "application/json";
            context.Response.Write(respJson);
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