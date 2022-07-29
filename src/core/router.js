const express = require("express");

module.exports = ({ inject }) => inject("router", () => new express.Router());
