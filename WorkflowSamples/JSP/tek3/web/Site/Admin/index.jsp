<%--
  User: bouzeig
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.net.*,java.io.*,javax.net.ssl.HttpsURLConnection" %>

<head>
    <link rel="stylesheet" type="text/css" href="/tek3/web/Common/style/generic.css">
</head>

<%

    String client = (request.getParameter("client")==null)?"":request.getParameter("client");
    String secret = (request.getParameter("secret")==null)?"":request.getParameter("secret");
    String token = null;

    if (!client.isEmpty() && !secret.isEmpty()) {
        // get an access token
        DataOutputStream output = null;
        InputStream input = null;
        BufferedReader buffer = null;

        try {
            URL url = new URL("https://developer.api.autodesk.com/authentication/v1/authenticate");
            HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            connection.setDoOutput(true);
            connection.setDoInput(true);

            output = new DataOutputStream(connection.getOutputStream ());
            output.writeBytes("client_id=" + URLEncoder.encode(client, "UTF-8") +
                    "&client_secret=" + URLEncoder.encode(secret, "UTF-8") +
                    "&grant_type=client_credentials");

            input = connection.getInputStream();
            buffer = new BufferedReader(new InputStreamReader(input));
            String line;
            StringBuffer stringBuffer = new StringBuffer();
            while((line = buffer.readLine()) != null) {
                stringBuffer.append(line);
                stringBuffer.append('\r');
            }
            String responseString = stringBuffer.toString();
            int index = responseString.indexOf("\"access_token\":\"") + "\"access_token\":\"".length();
            int index2 = responseString.indexOf("\"", index);
            token = responseString.substring(index, index2);
            session.setAttribute("token", token);
        } catch (Exception e) {%>
          EXCEPTION = <%=e.getMessage()%>
        <%} finally {
            if (output!=null) output.close();
            if (input!=null) input.close();
            if (buffer!=null) buffer.close();
        }
    }

%>

<html>
  <head>
    <title>Site Administration</title>
  </head>
  <body>
  <jsp:include page="../Headers/Top.jsp" />
  <%if(token!=null){%>
  <div class="message"><%="Token is: '" + token + "'"%></div>
  <%}%>
  <div class="form">
      <form action="index.jsp" autocomplete="false" method="POST">
      Client ID:  <input type="text" name="client" size="50" value="<%=client%>"><BR>
      Client Secret:  <input type="text" name="secret" size="50" value="<%=secret%>"><BR>

      <BR>
      <input type="submit" value="Apply">
  </form>

  </div>

  </body>
</html>