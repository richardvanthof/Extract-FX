if (typeof ($) == 'undefined') {
    $ = {};
}
$._ext = {
    evalFile: function (path) {
        try {
            $.evalFile(path);
        }
        catch (e) {
            alert("Exception:" + e);
        }
    },
    evalFiles: function (jsxFolderPath) {
        var folder = new Folder(jsxFolderPath);
        if (folder.exists) {
            var jsxFiles = folder.getFiles("*.jsx");
            for (var i = 0; i < jsxFiles.length; i++) {
                var jsxFile = jsxFiles[i];
                $._ext.evalFile(jsxFile);
            }
        }
    }
};
