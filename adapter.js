(function () {
    const mscrm = window.Mscrm;
    let context = null;
    let phoneWidget = null;

    const start = function (_context) {
        context = _context;
        phoneWidget = document.getElementById("telephony-widget");

        context.addEventListener("getCustomer", handleGetCustomer);
        context.addEventListener("startCall", handleStartCall);

        window.addEventListener("message", receiveMessageFromWidget, false);
    };

    const handleGetCustomer = function (event) {
        const customerData = {
            name: "John Doe",
            phone: "+1234567890",
            id: "contact-guid"
        };
        context.sendCustomEvent("customerInfo", customerData);
    };

    const handleStartCall = function (event) {
        const phoneNumber = event.payload.phoneNumber;
        phoneWidget.contentWindow.postMessage({ type: "startCall", phoneNumber }, "*");
    };

    const receiveMessageFromWidget = function (event) {
        if (event.data && event.data.type === "incomingCall") {
            context.notifyEvent("incomingCall", {
                customer: {
                    name: event.data.name || "Unknown",
                    phone: event.data.phoneNumber
                }
            });
        }
    };

    const stop = function () {};
    const getName = function () { return "CIF Telephony Adapter"; };
    const getVersion = function () { return "1.0.0"; };

    window.Mscrm.TabPanel.setAdapter({
        start: start,
        stop: stop,
        getName: getName,
        getVersion: getVersion
    });
})();
