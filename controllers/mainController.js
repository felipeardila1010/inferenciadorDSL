// Se crea un modulo de la aplicacion del modulo Test
var TestInferenciador = angular.module('TestInferenciador', ['ngMaterial','ngRoute','ng.jsoneditor'] ).filter('tel');
  
// Controlador 
TestInferenciador.controller('TestInferenciadorController', ['$scope', '$http','$mdDialog','$window', function($scope, $http,$mdDialog,$window) {

var headers = {
  'Content-type': 'application/json;charset=utf-8'
};

// Config JsonEditor
$scope.jsoninserted = {data: {}, options: { mode: 'code' }};
$scope.jsonresult = {data: {}, options: { mode: 'view' }};

$scope.btnClick = function() {
  $scope.obj.options.mode = 'code'; //should switch you to code view
}

var refresh = function() {
  $http({
    method: 'GET',
    url: '/inferenciadorlist'
  })
  .then(function successCallback(response) {
    $scope.inferenciadortest = response.data;
    $scope.inferenciador = "";
  }, function errorCallback(response) {
    console.log('Error en el GET');
  });
};

var messages = function() {
  $http({
    method: 'GET',
    url: '/messages'
  })
  .then(function successCallback(response) {
    $scope.messages = angular.fromJson(response.data);
  }, function errorCallback(response) {
    console.log('Error en el GET Message');
  });
};

$scope.addRule = function(id) {
  try{
      $http({
      method: 'POST',
      url: '/inferenciadorlist',
      headers: headers,
      data: { 
        json: $scope.jsoninserted.data,
        id : id
      }
    })
    .then(function successCallback(response) {
      $window.location.href = "/";
    }, function errorCallback(response) {
      $scope.showAlert(response.data);
    });

   }catch(e){
    $scope.showAlert($scope.messages.errors.invalid_structure);
  }
};

$scope.removeRule = function(_id) {
  $http({
    method: 'DELETE',
    url: '/inferenciadorlist',
    headers: headers,
    data: { 
      'id': _id
    }
  })
  .then(function successCallback(response) {
    refresh();
  }, function errorCallback(response) {
    $scope.showAlert(response.data);
  });
};

$scope.testJSON = function() {
  try{
      $http({
      method: 'POST',
      url: '/testinferenciador',
      headers: headers,
      data: { 
        json: $scope.jsoninserted.data
      }
    })
    .then(function successCallback(response) {
      $scope.jsonresult.data = angular.fromJson(response.data);
    }, function errorCallback(response) {
      $scope.showAlert(response.data);
    });

   }catch(e){
    $scope.showAlert($scope.messages.errors.invalid_structure);
  }
};

// ---------------------------------------------- MODALS -----------------------------------------------------

$scope.showAlert = function(message) {
  $mdDialog.show(
    $mdDialog.alert()
      .parent(angular.element(document.querySelector('#popupContainer')))
      .clickOutsideToClose(true)
      .title('Error en la creación de la regla')
      .textContent(message)
      .ariaLabel('Alert Dialog TestInferenciador')
      .ok('Continuar')
      .targetEvent(message)
  );
};

refresh();
messages();
 
}]);﻿