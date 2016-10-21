(function(angular, $, _) {

  angular.module('peoplelist').config(function($routeProvider) {
      $routeProvider.when('/peoplelist', {
        controller: 'PeoplelistPeopleListCtrl',
        controllerAs: 'vm',
        templateUrl: '~/peoplelist/PeopleListCtrl.html',
      });
    }
  );

  angular.module('peoplelist').controller('PeoplelistPeopleListCtrl', function($scope, $q, crmApi, crmStatus, crmUiHelp) {
    
    // local scope and helpful functions
    var vm = this;
    var ts = $scope.ts = CRM.ts('peoplelist');
    var hs = $scope.hs = crmUiHelp({file: 'CRM/peoplelist/PeopleListCtrl'}); // See: templates/CRM/peoplelist/PeopleListCtrl.hlp

    // definitions
    vm.filter = {};
    vm.persons = [];

    // actions
    vm.search = function() { search(vm.filter, vm.persons, $q, crmApi); };

  });

  /** search persons using the filters beginDate and endDate */
  function search(filter, persons, $q, crmApi) {
    var args = angular.extend({}, { 'start_date': asRangeExpression(filter['beginDate'], filter['endDate']) })
    crmApi('People', 'search', args).then(function(result) {
      persons.splice(0, persons.length);
      angular.forEach(result['values'], function(m) { this.push(m); }, persons);
    });
  }

  /** prepares a range expression */
  function asRangeExpression(val1, val2) {
    var out = undefined;
    if(!!val1 && !!val2) {
      out = { 'BETWEEN': [ val1, val2 ]};
    } else if(!!val1) {
      out = { '>=': val1 }
    } else if(!!val2) {
      out = { '<=': val2 }
    }
    return out;
  }

})(angular, CRM.$, CRM._);
