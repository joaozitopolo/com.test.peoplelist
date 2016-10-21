<?php

/**
 * People.Search API specification (optional)
 * This is used for documentation and validation.
 *
 * @param array $spec description of fields supported by this API call
 * @return void
 * @see http://wiki.civicrm.org/confluence/display/CRMDOC/API+Architecture+Standards
 */
function _civicrm_api3_people_Search_spec(&$spec) {
  $spec['start_date'] = array('title' => 'range to start_date');
}

/**
 * People.Search API
 *
 * @param array $params
 * @return array API result descriptor
 * @see civicrm_api3_create_success
 * @see civicrm_api3_create_error
 * @throws API_Exception
 */
function civicrm_api3_people_Search($params) {
  // finds the Membership, filtered by start_date
  $result = civicrm_api3('Membership', 'get', $params);
  $values = $result['values'];

  // find the Contacts
  $ids = array();
  foreach($values as $v) {
    $ids[] = $v['contact_id'];
  }
  $result = civicrm_api3('Contact', 'get', array(
      'return' => array("display_name"),
      'id' => array('IN' => $ids)
  ));
  $contacts = $result['values'];

  // merge contacts
  $out = [];
  foreach($values as $v) {
    $v['contact'] = $contacts[$v['contact_id']];
    array_push($out, $v);
  }

  // finalize
  return civicrm_api3_create_success($out, $params, 'People', 'search');
}

