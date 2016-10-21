# com.test.peoplelist
CiviCRM People List (Memberships, with start date filter)

## Implementation notes:

### PHP:

    Created a API function to search Memberships and merge with the Contact name
    api/v3/People/Search.php

### AngularJS:
    Created a single call to People/Search, with optional start date range argument
    ang/peoplelist/PeopleListCtrl.js

### CiviCRM:
    Registered the menu link for the People List


## Tests

### Running without filters
![civicrm_01.png](civicrm_01.png "test without filters")


### Running with begin and end date filters
![civicrm_02.png](civicrm_02.png "test with filters")

### Running only with the begin date filter
![civicrm_03.png](civicrm_03.png "test with a filter")

