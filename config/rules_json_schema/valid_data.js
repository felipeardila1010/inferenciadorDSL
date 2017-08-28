var arithmetic_conditions = {
	'add' : '+',
	'mul' : '*',
	'sub' : '-',
	'div' : '/',
 };
 
 var rulesConditions =  {
 	'fact' : [
 		'field'
 	],
 	'constant' : [
 		'value'
 	]
 };

var conditionals = {
	'and' : '&&',
	'or' : '||'
};

module.exports = {
	validRuleData: function(jsonInputs, condition_general, messages, empty) {

		var condition = content1Validation(jsonInputs, condition_general);
		// 1. Case First of the validation	
		if(condition == ''){
		// 2. Case Second of the validation
			condition = content2Validation(jsonInputs);
		}

		return condition;
	},
	responseJSONError : function(responseValidatorJsonSchema, messages) {
		var responseMessages = {};
		try{
		    for (var i = 0; i < responseValidatorJsonSchema.length; i++) {
		    	
		      messages.errors.variable_structure.message = messages.errors.variable_structure.message.replace(
		                                                  ':variable:', 
		                                                  responseValidatorJsonSchema[i].name
		                                                  );
		      messages.errors.variable_structure.message = messages.errors.variable_structure.message.replace(
		                                                  ':message:', 
		                                                  responseValidatorJsonSchema[i].message
		                                                  );
		      messages.errors.variable_structure.stack = messages.errors.variable_structure.stack.replace(
		                                                  ':stack:',
		                                                  responseValidatorJsonSchema[i].stack
		                                                  );
		      
		      responseMessages[i] = messages.errors.variable_structure;
		      messages.errors.variable_structure = temporal_messages;
		    }
	    }catch(error){ }
	}
};

function content1Validation (jsonInputs, condition_general) {

	var condition = '';
	try{
		for(var i = 0; i < jsonInputs.length; i++) {
				
			condition += '(';
			var data_variable_a = jsonInputs[i]['a'][0][0];
			var data_variable_b = jsonInputs[i]['b'][0][0];
			var variable_required_a = rulesConditions[data_variable_a.type];
			var variable_required_b = rulesConditions[data_variable_b.type];
			condition += data_variable_a[variable_required_a] + ' ' + 
						jsonInputs[i].condition + ' ' + 
						data_variable_b[variable_required_b] + ') ';

			if((i%2) == 0){
				condition += conditionals[condition_general] + ' ';
			}
		}
	}catch(error){ }

	return condition;
}

function content2Validation (jsonInputs) {

	var condition = '';
	
	try{
		condition = '((';
		var a = jsonInputs.a[0][0].inputs[0];
		var type_input_a = jsonInputs.a[0][0];

		// Value a
		for(var i = 0; i < a.length; i++) {
			var variable = a[i].field;
			var arithmetic_condition = arithmetic_conditions[type_input_a.type];
			condition += variable + ' ';

			if(i < (a.length-1)){
				condition += arithmetic_condition + ' ';				
			}
		}
		condition += ') ' + jsonInputs.condition + ' ';	

		// Value b
		var b1 = jsonInputs.b[0][0];
		var a2 = jsonInputs.b[0][0].a[0][0];
		var b2 = jsonInputs.b[0][0].b[0][0];
		condition += '(' + a2.field + ' ' + arithmetic_conditions[b1.type] + ' ' + b2.field + '))';
	}catch(error){ }

	return condition;
}

