<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<html lang="${renderContext.mainResourceLocale.language}">

<head>
    <meta charset="utf-8">
    <title>${fn:escapeXml(renderContext.mainResource.node.displayableName)}</title>
    <style>
        html, body {
            height: 100%;
            width: 100%;
        }
    </style>
</head>


<body>
    <template:area path="pagecontent"/>
</body>