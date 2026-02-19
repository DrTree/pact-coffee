function toggleNav() {
  shouldSleep = closeOverlays('open-nav')
  time = 0
  body = document.getElementsByTagName('body')[0]
  if (shouldSleep) {
    time = 500
  }
  setTimeout(function () {
    if (!body.classList.contains('open-nav')) {
      body.classList.add('open-nav')
    } else {
      body.classList.remove('open-nav')
    }
  }, time)
}

function toggleAccountOnMenu() {
  const vuex = JSON.parse(window.localStorage.getItem('vuex'))
  if (!Object.keys(vuex.User.info).length) {
    window.location.pathname = '/account'
  }
  shouldSleep = closeOverlays('open-account')
  time = 0
  body = document.getElementsByTagName('body')[0]
  if (shouldSleep) {
    time = 500
  }
  setTimeout(function () {
    if (!body.classList.contains('open-account')) {
      body.classList.add('open-account')
    } else {
      body.classList.remove('open-account')
    }
  }, time)
}

function toggleAccount() {
  shouldSleep = closeOverlays('open-account')
  time = 0
  body = document.getElementsByTagName('body')[0]
  if (shouldSleep) {
    time = 500
  }
  setTimeout(function () {
    if (!body.classList.contains('open-account')) {
      body.classList.add('open-account')
    } else {
      body.classList.remove('open-account')
    }
  }, time)
}

function toggleSearch() {
  shouldSleep = closeOverlays('open-search')
  time = 0
  body = document.getElementsByTagName('body')[0]
  if (shouldSleep) {
    time = 500
  }
  setTimeout(function () {
    if (!body.classList.contains('open-search')) {
      body.classList.add('open-search')
    } else {
      body.classList.remove('open-search')
    }
  }, time)
}

function BasketAutoCloseStart() {
  body = document.getElementsByTagName('body')[0]
  body.classList.add('auto-closing')
  setTimeout(BasketAutoClose, 7000)
}
function BasketAutoClose() {
  body = document.getElementsByTagName('body')[0]
  if (
    body.classList.contains('auto-closing') &&
    body.classList.contains('open-basket')
  ) {
    body.classList.remove('open-basket')
  }
}

function removeAutoClosing() {
  body = document.getElementsByTagName('body')[0]
  if (body.classList.contains('auto-closing')) {
    body.classList.remove('auto-closing')
  }
}

function clickOutsideBasket(e) {
  if (e.target.nodeName === 'HTML') {
      toggleBasket()
    }
}

function openBasket() {
  body = document.getElementsByTagName('body')[0]
  if (!body.classList.contains('open-basket')) {
    body.classList.add('open-basket')
    window.addEventListener('click', clickOutsideBasket)
  }
}
function closeBasketMouseLeave() {
  body = document.getElementsByTagName('body')[0]
  if (body.classList.contains('open-basket')) {
    setTimeout(function () {
      body.classList.remove('open-basket')
    }, 700)
  }
}

function toggleBasket() {
  shouldSleep = closeOverlays('open-basket')
  time = 0
  body = document.getElementsByTagName('body')[0]
  if (shouldSleep) {
    time = 500
  }
  setTimeout(function () {
    if (!body.classList.contains('open-basket')) {
      body.classList.add('open-basket')
      window.addEventListener('click', clickOutsideBasket)
    } else {
      body.classList.remove('open-basket')
      window.removeEventListener('click', clickOutsideBasket)
    }
  }, time)
}

function openSubNav(id) {
  document.getElementById('nav-wrap').classList.add('sub-nav-active')
  document.getElementById('dropdown-' + id).classList.add('active')
}

function closeSubNav(id) {
  document.getElementById('nav-wrap').classList.remove('sub-nav-active')
  document.getElementById('dropdown-' + id).classList.remove('active')
}

// mobile stack menu
var mobileStack = []

function openNewSubNav(id) {
  document.getElementById('nav-wrap').classList.add('sub-nav-active')
  document.getElementById('dropdown-' + id).classList.add('active')
}

function closeNewSubNav(id) {
  document.getElementById('nav-wrap').classList.remove('sub-nav-active')
  document.getElementById('dropdown-' + id).classList.remove('active')
}

function _showSubNavItem(id) {
  document.getElementById(id).classList.add('active')
}

function _hideSubNavItem(id) {
  document.getElementById(id).classList.remove('active')
}

function _getLastElementFromStack() {
  const lastItem = mobileStack.length - 1
  const lastIndex = lastItem >= 0 ? lastItem : 0
  return mobileStack[lastIndex]
}

/**
 * Push to top of stack element to show as `.active`
 * param {HtmlElement} - Html element
 */
function pushSubNav(element) {
  // get id from element and remove prefix of menu id
  const id = element.target.id.replace('dp-menu-', '')
  mobileStack.push(id)
  // show the last element
  _showSubNavItem(_getLastElementFromStack())
}

/**
 * Remove the item of stack of elements and switch the next element to show as `.active`
 */
function popSubNav() {
  const item = mobileStack.pop()
  // hide item
  _hideSubNavItem(item)
  if (mobileStack.length > 0) {
    _showSubNavItem(_getLastElementFromStack())
  }
}

// Variable to track current path of navigation menu
var currentPath = []

/**
 * Get index from element id with description
 * param {string} value - element id with description
 */
function _getIndex(value) {
  return value.split('|')[0]
}

/**
 * Validation of path of current navigation menu
 * param {*} id
 * return -1 if is valid if not return the index after the break
 */
function _validatePath(id) {
  if (currentPath.length == 0) {
    return -1
  } else {
    let findIndex = -1
    // search from reverse path
    for (let k = currentPath.length - 1; k >= 0; k--) {
      const _previousIndex = _getIndex(currentPath[k])
      if (id === _previousIndex || id.length === _previousIndex.length) {
        findIndex = k
      }
    }
    return findIndex
  }
}
/**
 * Clear active class from array passed with ids of menus
 * param {string[]} _currentPath
 * returns empty array
 */
function clearMenu(_currentPath) {
  for (let n = 0; n < _currentPath.length; n++) {
    const id = _currentPath[n]

    const dpMenuID = document.getElementById('dp-menu-' + id)
    if (!!dpMenuID) {
      dpMenuID.classList.remove('active')
    }

    const dpMenuContainer = document.getElementById(id)
    if (!!dpMenuContainer) {
      dpMenuContainer.classList.remove('active')
    }

    closeTopLevelTiles(_getIndex(id))
  }
  _currentPath = []
  return _currentPath
}


function openTopLevelTiles(topLevelID) {
  const limit = 10;
  for (let j = 1; j < limit; j++) {
    const dpTilesTop = document.getElementById('dp-tiles-level1-' + topLevelID + '-' + j)
    if (!!dpTilesTop) {
      dpTilesTop.classList.add('active')
    }
  }
}

function closeTopLevelTiles(topLevelID) {
  const limit = 10;
  for (let j = 1; j < limit; j++) {
    const dpTilesTop = document.getElementById('dp-tiles-level1-' + topLevelID + '-' + j)

    if (!!dpTilesTop) {
      dpTilesTop.classList.remove('active')
    }
  }
}
// ====== GA
/**
 * Compose data and send to GA
 * param {string} - top level category
 * param {string} - sub level subCategory
 */
function clickTrackingNavBar(category, subCategory) {
  dataLayer = window.dataLayer || []
    dataLayer.push({
    event: 'analytics_event',
    event_data:{
      event_name: 'navigation_click',
      event_category: `navigation-${category}`,
      event_label: category + ' - ' + (category !== subCategory ? subCategory : ''),
      event_value: undefined
    }
  })
}

// ====== GA

/**
 * Controls navigation menu using currentPath as global variable
 * param {html} element - Html element for fetch target id
 * param {boolean} clear - Force clear all menu
 * param {boolean} hasDropDown - flag for dropdown menu
 * returns null - for clean state or for skip some logic
 */
function openDesktopSubNav(element) {
  var clear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var hasDropDown = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  // force clear and exit
  if (clear) {
    currentPath = clearMenu(currentPath);
    return null;
  }

  // FIXME: try to get target element id from top level menu
  var _id = !!element.target.id ? element.target.id : (element.path && element.path[1] ? element.path[1].id : null);
  if (_id) {
    _id = _id.replace('dp-menu-', '');
    var id = _id;

    var indexId = _getIndex(id);

    if (indexId === '' || indexId.length === 1) {
      // is top menu -> clean navigation
      currentPath = clearMenu(currentPath);
      openTopLevelTiles(indexId); // push root path

      currentPath.push(id);
    } else {
      var _indexFromValidation = _validatePath(indexId);

      if (_indexFromValidation === -1) {
        // add last id to path
        currentPath.push(id);
      } else {
        // is invalid return index
        // split and hide indexes
        var oldPath = currentPath.splice(_indexFromValidation, currentPath.length - _indexFromValidation);
        clearMenu(oldPath); // add last id to path

        currentPath.push(id);
      }

      var dpMenuID = document.getElementById('dp-menu-' + id);

      if (!!dpMenuID) {
        dpMenuID.classList.add('active');
      } // if is single node


      if (hasDropDown) {
        var dpMenuContainer = document.getElementById(id);

        if (!!dpMenuContainer) {
          dpMenuContainer.classList.add('active');
        }
      }
    }
  }
}


function closeDesktopSubNav(id) {
  document
    .getElementById('account-menu-' + desktopShopOther(id))
    .classList.remove('active')
  document
    .getElementById('dropdown-item-marked-' + desktopShopOther(id))
    .classList.remove('active')
  document.getElementById('dropdown-item-marked-' + id).classList.add('active')
  document.getElementById('account-menu-' + id).classList.remove('active')
}

function desktopShopOther(id) {
  if (id === 'shop-coffee') return 'shop-hw'
  return 'shop-coffee'
}

function toggleFilters() {
  shouldSleep = closeOverlays('open-filters')
  time = 0
  body = document.getElementsByTagName('body')[0]
  if (shouldSleep) {
    time = 500
  }
  setTimeout(function () {
    if (!body.classList.contains('open-filters')) {
      body.classList.add('open-filters')
    } else {
      body.classList.remove('open-filters')
    }
  }, time)
}

function closeOverlays(toggler) {
  var hasOpenOverlays = false
  body = document.getElementsByTagName('body')[0]
  Array.prototype.forEach.call(body.classList, function (className) {
    if (className.startsWith('open-') && className !== toggler) {
      body.classList.remove(className)
      hasOpenOverlays = true
    }
  })
  return hasOpenOverlays
}

// FLIPPING CARDS HELPER
function flipIt(flipCard) {
  const el = document.getElementById(flipCard)
  const flipped = el.classList.contains('flip')
  flipped ? el.classList.remove('flip') : el.classList.add('flip')
}
