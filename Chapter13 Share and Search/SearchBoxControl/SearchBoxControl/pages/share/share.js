﻿// For an introduction to the Share Contract template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232513
//
// TODO: Edit the manifest to enable use as a share target.  The package 
// manifest could not be automatically updated.  Open the package manifest file
// and ensure that support for activation of sharing is enabled.

(function () {
    "use strict";

    var app = WinJS.Application;
    var share;

    function onShareSubmit() {
        document.querySelector(".progressindicators").style.visibility = "visible";
        document.querySelector(".commentbox").disabled = true;
        document.querySelector(".submitbutton").disabled = true;

        // TODO: Do something with the shared data stored in the 'share' var.
        var StandardDataFormats = Windows.ApplicationModel.DataTransfer.StandardDataFormats;

        // Process HTML
        if (share.data.contains(StandardDataFormats.html)) {
            share.data.getHtmlFormatAsync().done(function (html) {
                // Retrieve sanitized HTML fragment
                var htmlFormatHelper = Windows.ApplicationModel.DataTransfer.HtmlFormatHelper;
                var htmlFragment = htmlFormatHelper.getStaticFragment(html);

                // Save shared note to data source
                saveNote(share.data.properties.title, htmlFragment);
            });
        } else {
            // Process Text
            if (share.data.contains(StandardDataFormats.text)) {
                share.data.getTextAsync().done(function (text) {
                    saveNote(share.data.properties.title, text);
                });
            }
        }

        // Save note to database
        function saveNote(title, contents) {
            // Save shared note to data source
            var notesDataSource = new DataSources.FileDataSource("notes.json");
            notesDataSource.insertAtEnd(null, {
                title: title,
                contents: contents,
                comments: document.querySelector(".commentbox").value
            }).done(function () {
                // Let everyone know that the notes have been updated
                Windows.Storage.ApplicationData.current.signalDataChanged();

                // All done
                share.reportCompleted();
            });
        }

    }

    // This function responds to all application activations.
    app.onactivated = function (args) {
        var thumbnail;

        if (args.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.shareTarget) {
            document.querySelector(".submitbutton").onclick = onShareSubmit;
            share = args.detail.shareOperation;

            document.querySelector(".shared-title").textContent = share.data.properties.title;
            document.querySelector(".shared-description").textContent = share.data.properties.description;

            thumbnail = share.data.properties.thumbnail;
            if (thumbnail) {
                // If the share data includes a thumbnail, display it.
                args.setPromise(thumbnail.openReadAsync().done(function displayThumbnail(stream) {
                    document.querySelector(".shared-thumbnail").src = window.URL.createObjectURL(stream);
                }));
            } else {
                // If no thumbnail is present, expand the description  and
                // title elements to fill the unused space.
                document.querySelector("section[role=main] header").style.setProperty("-ms-grid-columns", "0px 0px 1fr");
                document.querySelector(".shared-thumbnail").style.visibility = "hidden";
            }
        }
    };

    app.start();
})();
