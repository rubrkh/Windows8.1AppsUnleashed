﻿/// <reference path="//Microsoft.WinJS.2.0/js/base.js" />
/// <reference path="//Microsoft.WinJS.2.0/js/ui.js" />

(function () {
    "use strict";

    function init() {
        WinJS.UI.processAll().done(function() {
            var frmOrder = document.getElementById("frmOrder");

            // Get the order
            frmOrder.addEventListener("submit", function (e) {
                e.preventDefault();
                var order = {
                    billing_street: document.querySelector("#divBillingAddress .inpStreet").value,
                    billing_city: document.querySelector("#divBillingAddress .inpCity").value,
                    shipping_street: document.querySelector("#divShippingAddress .inpStreet").value,
                    shipping_city: document.querySelector("#divShippingAddress .inpCity").value
                };

                // Save to Database
            });

        });
    }

    document.addEventListener("DOMContentLoaded", init);

})();
