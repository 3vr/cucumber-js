var JsonFormatter = function (options) {
  var Cucumber = require('../../cucumber');

  var self = Cucumber.Listener.Formatter(options);

  self.allFeatures = {
    features: []
  };

  self.handleAfterFeaturesEvent = function handleAfterFeaturesEvent(event, callback) {
    self.log(JSON.stringify(self.allFeatures));
    callback();
  };

  self.handleBeforeFeatureEvent = function handleBeforeFeatureEvent(event, callback) {
    var feature = self.getFeature(event);
    self.allFeatures.features.push(feature);
    callback();
  };

  self.handleBeforeScenarioEvent = function handleBeforeScenarioEvent(event, callback) {
    var feature = self.getFeature(event);
    var scenario = self.getScenario(feature, event);
    feature.scenarios.push(scenario);
    callback();
  };

  self.handleStepResultEvent = function handleStepResult(event, callback) {
    var feature = self.getFeature(event);
    var scenario = self.getScenario(feature, event);
    var stepResult = event.getPayloadItem('stepResult');
    var step = stepResult.getStep();
    var newStep = self.buildStep(stepResult, step);
    scenario.steps.push(scenario);
    callback();
  };

  self.getFeature = function(event) {
    return self.getItem(self.allFeatures.features, event, 'feature', self.buildFeature);
  };

  self.getScenario = function(feature, event) {
    return self.getItem(feature.scenarios, event, 'scenario', self.buildScenario);
  };

  self.getItem = function(array, event, type, builder) {
    var item = event.getPayloadItem(type);
    var ourItem = self.findByName(array, item.getName());
    if (!ourItem) {
      ourItem = builder(item);
    }
    return ourItem;
  };

  self.findByName = function(array, name) {
    for (var item in array) {
      if (item.name === name) {
        return item;
      }
    }
    return null;
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
    var message;
    if (stepResult.isFailed()) {
      result = 'failed';
      message = self.getStepFailureMessage(stepResult);
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
      result: result,
      message: message
    };
  };

  self.getStepFailureMessage = function(stepResult) {
    var failureException = stepResult.getFailureException();
    return failureException.stack || failureException;
  };

  return self;
};

module.exports = JsonFormatter;
