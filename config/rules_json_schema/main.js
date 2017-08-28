var fs = require('fs');

module.exports = {
	configMainRule1: function() {
		return  JSON.parse(fs.readFileSync('config/rules_json_schema/rules/rule1.json', 'utf-8'));
	},
	configMainRule2: function() {
		return  JSON.parse(fs.readFileSync('config/rules_json_schema/rules/rule2.json', 'utf-8'));
	},
	test1: function() {
		return  JSON.parse(fs.readFileSync('tests/test1.json', 'utf-8'));
	},
	test2: function() {
		return  JSON.parse(fs.readFileSync('tests/test2.json', 'utf-8'));
	},
	messages: function() {
		return  JSON.parse(fs.readFileSync('config/lang/es/main.json', 'utf-8'));
	}
};