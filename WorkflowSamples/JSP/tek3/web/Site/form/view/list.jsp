<%@ page import="java.util.Map" %>
<%@ page import="java.util.HashMap" %><%

    String name = request.getParameter("name");
    String base64 = request.getParameter("base64");

    if (name!=null && base64!=null) {
        Map viewMap = (Map) session.getAttribute("viewMap");
        if (viewMap==null) {
            viewMap = new HashMap();
            session.setAttribute("viewMap", viewMap);
        }
        viewMap.put(name,base64);
    }
%>