/*!
Copyright 2016 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

/**
 * The data loader to load GPII authorization server data into CouchDB.
 * Before running this script, make sure CouchDB is started and ready for handling
 * database operation requests.
 */

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.setLogging(true);

require("./shared/dataLoader.js");

fluid.defaults("gpii.dataLoader.authDataLoader", {
    gradeNames: ["gpii.dataLoader"],
    databases: {
        expander: {
            funcName: "gpii.dataLoader.authDataLoader.constructAuthData",
            args: ["{that}.options.dbName", "{that}.options.dataFile"]
        }
    },
    listeners: {
        "onCreate.load": {
            listener: "gpii.dataLoader.authDataLoader.loadData",
            args: ["{that}"]
        }
    }
});

/**
 * Construct the value of `options.databases` that to be accepted by `gpii.dataLoader` (See dataLoader.js).
 *
 * @param dbName {String} The database name;
 * @param dataFile {Array} An array of data paths to files to be loaded into the database.
 */
gpii.dataLoader.authDataLoader.constructAuthData = function (dbName, dataFile) {
    var togo = {};
    fluid.set(togo, dbName + ".dataFile", dataFile);

    return togo;
};

/**
 * Triggers the loading function to load data.
 * @param that {Component} An instance of `gpii.dataLoader` (See dataLoader.js).
 * @return {None}
 */
gpii.dataLoader.authDataLoader.loadData = function (that) {
    var promise = that.load();
    promise.then(function () {
        console.log("The authorization data has been loaded successfully.");
    }, function (err) {
        console.log("Error at loading the authorization data. Error details: ", err);
    });
};

gpii.dataLoader.authDataLoader({
    dbName: "auth",
    dataFile: [
        "%universal/testData/security/TestOAuth2DataStore.json",
        "%universal/gpii/node_modules/gpii-oauth2/gpii-oauth2-datastore/dbViews/views.json"
    ],
    couchDbUrl: "http://admin:admin@localhost:5984"
});
