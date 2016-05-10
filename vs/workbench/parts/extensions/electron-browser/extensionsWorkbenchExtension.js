/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", 'vs/nls', 'vs/base/common/errors', 'vs/platform/platform', 'vs/base/common/winjs.base', 'vs/workbench/parts/extensions/common/extensions', 'vs/platform/instantiation/common/instantiation', 'vs/platform/message/common/message', 'vs/base/common/severity', 'vs/workbench/services/workspace/common/contextService', 'vs/workbench/electron-browser/actions', 'vs/workbench/common/actionRegistry', 'vs/platform/actions/common/actions', './extensionsActions', 'vs/workbench/browser/quickopen', 'electron'], function (require, exports, nls, errors, platform, winjs_base_1, extensions_1, instantiation_1, message_1, severity_1, contextService_1, actions_1, wbaregistry, actions_2, extensionsActions_1, quickopen_1, electron_1) {
    "use strict";
    var ExtensionsWorkbenchExtension = (function () {
        function ExtensionsWorkbenchExtension(instantiationService, extensionsService, messageService, contextService, extenstionTips, // this is to eagerly start the service
            galleryService) {
            this.instantiationService = instantiationService;
            this.extensionsService = extensionsService;
            this.messageService = messageService;
            this.registerListeners();
            var options = contextService.getOptions();
            // Extensions to install
            if (options.extensionsToInstall && options.extensionsToInstall.length) {
                this.install(options.extensionsToInstall).done(null, errors.onUnexpectedError);
            }
            var actionRegistry = platform.Registry.as(wbaregistry.Extensions.WorkbenchActions);
            actionRegistry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(extensionsActions_1.ListExtensionsAction, extensionsActions_1.ListExtensionsAction.ID, extensionsActions_1.ListExtensionsAction.LABEL), 'Extensions: Show Installed Extensions', extensions_1.ExtensionsLabel);
            platform.Registry.as(quickopen_1.Extensions.Quickopen).registerQuickOpenHandler(new quickopen_1.QuickOpenHandlerDescriptor('vs/workbench/parts/extensions/electron-browser/extensionsQuickOpen', 'LocalExtensionsHandler', 'ext ', nls.localize('localExtensionsCommands', "Show Local Extensions")));
            if (galleryService.isEnabled()) {
                actionRegistry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(extensionsActions_1.InstallExtensionAction, extensionsActions_1.InstallExtensionAction.ID, extensionsActions_1.InstallExtensionAction.LABEL), 'Extensions: Install Extension', extensions_1.ExtensionsLabel);
                platform.Registry.as(quickopen_1.Extensions.Quickopen).registerQuickOpenHandler(new quickopen_1.QuickOpenHandlerDescriptor('vs/workbench/parts/extensions/electron-browser/extensionsQuickOpen', 'GalleryExtensionsHandler', 'ext install ', nls.localize('galleryExtensionsCommands', "Install Gallery Extensions"), true));
                actionRegistry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(extensionsActions_1.ListOutdatedExtensionsAction, extensionsActions_1.ListOutdatedExtensionsAction.ID, extensionsActions_1.ListOutdatedExtensionsAction.LABEL), 'Extensions: Show Outdated Extensions', extensions_1.ExtensionsLabel);
                platform.Registry.as(quickopen_1.Extensions.Quickopen).registerQuickOpenHandler(new quickopen_1.QuickOpenHandlerDescriptor('vs/workbench/parts/extensions/electron-browser/extensionsQuickOpen', 'OutdatedExtensionsHandler', 'ext update ', nls.localize('outdatedExtensionsCommands', "Update Outdated Extensions")));
                // add extension tips services
                actionRegistry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(extensionsActions_1.ListSuggestedExtensionsAction, extensionsActions_1.ListSuggestedExtensionsAction.ID, extensionsActions_1.ListSuggestedExtensionsAction.LABEL), 'Extensions: Show Extension Recommendations', extensions_1.ExtensionsLabel);
                platform.Registry.as(quickopen_1.Extensions.Quickopen).registerQuickOpenHandler(new quickopen_1.QuickOpenHandlerDescriptor('vs/workbench/parts/extensions/electron-browser/extensionsQuickOpen', 'SuggestedExtensionHandler', 'ext recommend ', nls.localize('suggestedExtensionsCommands', "Show Extension Recommendations")));
            }
        }
        ExtensionsWorkbenchExtension.prototype.registerListeners = function () {
            var _this = this;
            electron_1.ipcRenderer.on('vscode:installExtensions', function (event, request) {
                if (request.extensionsToInstall) {
                    _this.install(request.extensionsToInstall).done(null, errors.onUnexpectedError);
                }
            });
        };
        ExtensionsWorkbenchExtension.prototype.install = function (extensions) {
            var _this = this;
            return winjs_base_1.Promise.join(extensions.map(function (extPath) { return _this.extensionsService.install(extPath); }))
                .then(function (extensions) {
                _this.messageService.show(severity_1.default.Info, {
                    message: extensions.length > 1 ? nls.localize('success', "Extensions were successfully installed. Restart to enable them.")
                        : nls.localize('successSingle', "{0} was successfully installed. Restart to enable it.", extensions[0].displayName),
                    actions: [_this.instantiationService.createInstance(actions_1.ReloadWindowAction, actions_1.ReloadWindowAction.ID, nls.localize('reloadNow', "Restart Now"))]
                });
            });
        };
        ExtensionsWorkbenchExtension.prototype.getId = function () {
            return 'vs.extensions.workbenchextension';
        };
        ExtensionsWorkbenchExtension = __decorate([
            __param(0, instantiation_1.IInstantiationService),
            __param(1, extensions_1.IExtensionsService),
            __param(2, message_1.IMessageService),
            __param(3, contextService_1.IWorkspaceContextService),
            __param(4, extensions_1.IExtensionTipsService),
            // this is to eagerly start the service
            __param(5, extensions_1.IGalleryService)
        ], ExtensionsWorkbenchExtension);
        return ExtensionsWorkbenchExtension;
    }());
    exports.ExtensionsWorkbenchExtension = ExtensionsWorkbenchExtension;
});
//# sourceMappingURL=extensionsWorkbenchExtension.js.map