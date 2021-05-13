const express = require('express');
const File = require('../models/file')

const router = express.Router();

router.get('/files/download/:uuid', async (req, res) => {
    const file = await File.findOne({uuid: req.params.uuid});
    if(!file) {
        res.render('download', {error: "Link has been expired."})
    }

    const filePath = `${__dirname}/../${file.path}`;
    res.download(filePath)
})

module.exports = router;