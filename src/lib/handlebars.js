const { format } = require("timeago.js");

const helpers = {};

helpers.timeago = (timestamp) => {
    return format(timestamp);
}; 


helpers.if_eq = ('if_eq', function(a, b, opts) {
    if(a == b) // Or === depending on your needs
        return opts.fn(this);
    else
        return opts.inverse(this);
});

module.exports = helpers;