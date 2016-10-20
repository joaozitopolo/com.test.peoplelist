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
    var queries = {};

    // simplified contact list
    queries.contacts = crmApi('Contact', 'getlist'); // [{ id, label }]
    
    // finds memberships by start date
    var args = angular.extend({}, { 'start_date': asRangeExpression(filter['beginDate'], filter['endDate']) })
    queries.memberships = crmApi('Membership', 'get', args);

    // run queries
    $q.all(queries).then(function(data) {
      // prepare contacts map
      var contacts = contactsMap(data.contacts);
      console.log(contacts);

      // update persons list
      persons.splice(0, persons.length);
      angular.forEach(data.memberships['values'], function(m) { this.push(angular.extend(m, { contact: contacts[m['contact_id']]  } )) }, persons);
    }); 
    
    crmApi('Membership', 'get', {
    }).then(function(result) {
      angular.forEach(result['values'], function(value) { this.push(value); }, persons);
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

  /** maps the contact list by id */
  function contactsMap(list) {
    var out = {};
    angular.forEach(list, function(item) { this[item['id']] = item }, out);
    return out;
  }

})(angular, CRM.$, CRM._);
