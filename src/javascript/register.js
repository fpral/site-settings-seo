window.jahia.i18n.loadNamespaces('siteSettingsSeo');

window.jahia.uiExtender.registry.add('site-settings', 'siteSettingsSeoRoute', {
    isSelectable: true,
    targets: ['jcontent'],
    route: '/siteSettingsSeo',
    label: 'siteSettingsSeo:label.title',
    icon: window.jahia.moonstone.toIconComponent('Link', {size: 'big'})
});

window.jahia.uiExtender.registry.add('route', 'siteSettingsSeoRoute', {
    targets: ['jcontent'],
    path: '/siteSettingsSeo',
    defaultPath: '/siteSettingsSeo',
    render: function () {
        return window.jahia.uiExtender.getIframeRenderer(window.contextJsParameters.contextPath + '/cms/editframe/default/sites/$site-key.linkChecker.html');
    }
});
