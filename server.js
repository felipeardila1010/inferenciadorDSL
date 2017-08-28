// Variables Globals
var messages = {};

// Add requires libraries
var express             = require('express');
var mongojs             = require('mongojs');
var bodyParser          = require('body-parser');
var fs                  = require('fs');
var isJSON              = require('is-json');
var empty               = require('is-empty');
var validatorJsonSchema = require('jsonschema').Validator;
var rulesJsonSchema     = require('./config/rules_json_schema/main');
var validDataRules      = require('./config/rules_json_schema/valid_data');

//Use Libraries
var app = express();
var db  = mongojs('inferenciadortest', ['inferenciadortest']);

// App.Use express Static Folders
app.use(express.static('config'));
app.use(express.static('node_modules'));
app.use(express.static('public'));
app.use(express.static('tests'));
app.use(express.static('controllers'));
app.use(bodyParser.json());

// Config message of the system
app.get('/messages', function (req, res) {
  messages = rulesJsonSchema.messages();
  res.end(JSON.stringify( messages )); 
});

// App.Set Jade
app.set('view engine','jade');

// Inicially Routes of the system
app.get('/', function (req, res) {
  res.render('index');
});

app.get('/addRuleView', function (req, res) {
  res.render('addRule');
});

app.get('/inferenciador', function (req, res) {
  res.render('inferenciador');
});

app.post('/testinferenciador', function (req, res) {
  req.body.id = 'validate';
  postAndUpdate(req,res);
});

//-------------------------------------- CRUD INFERENCIADOR -----------------------------------------
//---------------------- GET and POST -------------------------
app.get('/inferenciadorlist', function (req, res) {
  db.inferenciadortest.find(function (err, docs) {
    res.status(200).json(docs);
  });
});

app.post('/inferenciadorlist', function (req, res) {
  postAndUpdate(req,res);
});

function postAndUpdate (req, res) {
  var validatorObject = new validatorJsonSchema();
  var json = req.body.json;
  var id = req.body.id;
  var responseMessages;

  var ruleSchema1 = rulesJsonSchema.configMainRule1();
  var ruleSchema2 = rulesJsonSchema.configMainRule2();
  var responseValidatorJsonSchema1 = validatorObject.validate(json, ruleSchema1);
  var responseValidatorJsonSchema2 = validatorObject.validate(json, ruleSchema2);
  
  if(!empty(responseValidatorJsonSchema1.errors) && empty(responseValidatorJsonSchema2.errors)){
    return getDataJson(json, res, id);
  }else{
    validDataRules.responseJSONError(responseValidatorJsonSchema2.errors, messages);
  }

  if(empty(responseValidatorJsonSchema1.errors) && !empty(responseValidatorJsonSchema2.errors)){
    return getDataJson(json, res, id);
  }else{
    validDataRules.responseJSONError(responseValidatorJsonSchema1.errors, messages);
  }

  res.status(400).json(messages.errors.variable_structure); // Send Error
}

function getDataJson (json, res, id) {
  var condition_general = json.condition.type;
  var jsonInputs = json.condition.inputs[0];

  // Call Validation For Build the condition
  var condition = validDataRules.validRuleData(jsonInputs, condition_general, messages, empty);
  var response = {
    'name' : json.name,
    'condition' : condition,
    'jsoneditor' : JSON.stringify(json)
  };

  if(id ==  'undefined'){ // Create Rule
    db.inferenciadortest.insert(response, function(err, doc) {
      return res.status(200).end('OK');
    });
  }else if(id == 'validate'){
    return res.status(200).json(response);
  }
  else{ // Update Rule
    db.inferenciadortest.findAndModify({
      query: {
        _id: mongojs.ObjectId(id)
      },
      update: {
        $set: response
      },
      new: true
    }, 
    function (err, doc) {
        return res.status(200).end('OK');
      }
    );
  }
}

//---------------------- EDIT -------------------------
app.get('/addRuleView/:id', function (req, res) {
  var params;
  var id = req.params.id;
  db.inferenciadortest.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
   res.render('addRule',doc);
  });
}); 

//---------------------- DELETE -------------------------
app.delete('/inferenciadorlist', function (req, res) {
  var id = req.body.id;
  db.inferenciadortest.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
    return res.status(200).end('OK');
  });
});

messages = rulesJsonSchema.messages();
app.listen(6700);
console.log("Servidor corriendo para el puerto 6700"); 