module.exports = {
	"proxy": {
		"/shopify/*": {
			"target": "http://localhost:4000/",
			"secure": false
		},
		"manythanks": {
			"target": "http://localhost:5000/",

		}
	},
}