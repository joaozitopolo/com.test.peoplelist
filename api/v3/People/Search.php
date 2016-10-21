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

  // find memberships contacts
  $ids = array();
  foreach($values as $v) {
    $ids[] = $v['contact_id'];
  }
  $result = civicrm_api3('Contact', 'get', array(
      'return' => array("display_name"),
      'id' => array('IN' => $ids)
  ));
  $contacts = $result['values'];

  // prepare out list
  $out = [];
  foreach($values as $v) {
    $contact = $contacts[$v['contact_id']];
    $v['display_name'] = isset($contact) ? $contact['display_name'] : '';
    array_push($out, $v);
  }

  // finalize
  uasort($out, "sort_display_name");
  return civicrm_api3_create_success($out, $params, 'People', 'search');
}

function sort_display_name($v1, $v2) {
  return $v1['display_name'] == $v2['display_name'] ? 0 : $v1['display_name'] < $v2['display_name'] ? -1 : 1;
} 
