<%@ taglib prefix="functions" uri="http://www.jahia.org/tags/functions" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>

<script type="text/javascript">
    contextJsParameters['siteTitle'] = '${functions:escapeJavaScript(renderContext.site.title)}';
</script>
<template:include view="app"/>