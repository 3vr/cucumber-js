var JSFormatter = function (options) {
  var Cucumber = require('../../cucumber');

  var self = Cucumber.Listener.Formatter(options);
  var currentFeature = null;
  var currentScenario = null;

  self.handleBeforeFeatureEvent = function handleBeforeFeatureEvent(event, callback) {
    var feature = event.getPayloadItem('feature');
    currentFeature = self.buildFeature(feature);
    callback();
  };

  self.handleAfterFeatureEvent = function handleAfterFeatureEvent(event, callback) {
    self.log(JSON.stringify(currentFeature));
    callback();
  };

  self.handleBeforeScenarioEvent = function handleBeforeScenarioEvent(event, callback) {
    var scenario = event.getPayloadItem('scenario');
    currentScenario = self.buildScenario(scenario);
    self.addScenario(currentScenario);
    callback();
  };

  self.handleStepResultEvent = function handleStepResult(event, callback) {
    var stepResult = event.getPayloadItem('stepResult');
    var step = stepResult.getStep();
    var newStep = self.buildStep(stepResult, step);
    self.addStep(newStep);
    callback();
  };

  self.buildFeature = function(feature) {
    return {
      name: feature.getName(),
      description: feature.getDescription(),
      scenarios: []
    };
  };

  self.buildScenario = function(scenario) {
    return {
      name: scenario.getName(),
      description: scenario.getDescription(),
      steps: []
    };
  };

  self.buildStep = function(stepResult, step) {
    var result;
    if (stepResult.isFailed()) {
      result = 'failed';
    } else if (stepResult.isPending()) {
      result = 'pending';
    } else if (stepResult.isSkipped()) {
      result = 'skipped';
    } else if (stepResult.isSuccessful()) {
      result = 'successful';
    } else {
      result = 'undefined';
    }
    return {
      keyword: step.getKeyword(),
      name: step.getName(),
      result: result
    };
  };

  self.addScenario = function(scenario) {
    currentFeature.scenarios.push(scenario);
  };

  self.addStep = function(step) {
    currentScenario.steps.push(step);
  };

  return self;
};
JSFormatter.EVENT_HANDLER_NAME_PREFIX = 'handle';
JSFormatter.EVENT_HANDLER_NAME_SUFFIX = 'Event';
module.exports = JSFormatter;