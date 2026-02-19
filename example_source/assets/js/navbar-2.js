  async function desktopShowLevel(parent_tag, self_tag, parent_id, self_id) {
    //Hide currently shown levels
    if (self_tag === 'd2')
      await hideAllLevelsDesktop(parent_id)
    else await hideSubLevelsDesktop(parent_id, parent_tag, self_tag)

    const parent = document.getElementById('dp-' + parent_tag + '-' + parent_id + '-' + self_id)
    parent.classList.add("active")
    showSubLevel(parent_id, self_id, self_tag)
  }
  /**********************
  *   Shared NAV Logic  *
  ***********************/
   async function removeActives(id, identifier) {
    const actives = document.querySelectorAll(`[id^=dp-${identifier}-${id}]`)
    actives.forEach(element => {
      element.classList.remove("active")
    })
    return;
  }

   async function showSubLevel(id, subid, identifier = 'sb') {
    const sub_level = document.getElementById(identifier + '-' + id + '-' + subid)
    sub_level.classList.remove("d-none")
  }

  /**********************
  *   Desktop NAV       *
  ***********************/

   async function hideAllLevelsDesktop(parent_id) {
    await removeActives(parent_id, 'd2')
    await removeActives(parent_id, 'd3')
    const lvl_2 = document.querySelectorAll(`[id^=d2-${parent_id}]`)
    lvl_2.forEach(element => {
      element.classList.add("d-none")
    })
    const lvl_3 = document.querySelectorAll(`[id^=d3-${parent_id}]`)
    lvl_3.forEach(element => {
      element.classList.add("d-none")
    })
    const lvl_4 = document.querySelectorAll(`[id^=d4-${parent_id}]`)
    lvl_4.forEach(element => {
      element.classList.add("d-none")
    })
    return;
  }

   async function hideSubLevelsDesktop(parent_id, parent_tag, self_tag) {
    await removeActives(parent_id, parent_tag)
    const brothers = document.querySelectorAll(`[id^=${self_tag}-${parent_id}]`)
    brothers.forEach(element => {
      element.classList.add("d-none")
    })
    return;
  }


  /**********************
  *   Tablet NAV        *
  ***********************/

   function openTabletNav() {
    var element = document.getElementById('tablet-navbar')
    if (element) {
      if (element.classList.contains('active')) {
        element.classList.remove('active')
      } else {
        element.classList.add('active')
      }
    }
  }

   async function tabletShowLevelMain(parent_tag, self_tag, parent_id) {
    //Hide currently shown levels
    await hideLevelsTablet(true, true, true)

    const parent = document.getElementById('dp-' + parent_tag + '-' + parent_id)
    parent.classList.add("active")

    tabletShowLevelAux(parent_id, self_tag)

    // change tiles
    const tiles = document.getElementById('tablet-tiles-' + parent_id)
    tiles?.classList.remove("d-none")
  }

   async function tabletShowLevelAux(self_id, self_tag) {
    const sub_level = document.getElementById(self_tag + '-' + self_id)
    sub_level.classList.remove("d-none")
  }

   async function tabletShowLevel(parent_tag, self_tag, parent_id, self_id) {
    if (self_tag === 't3')
      await hideLevelsTablet(false, true, true)
    else
      await hideLevelsTablet(false, false, true)

    const parent = document.getElementById('dp-' + parent_tag + '-' + parent_id + '-' + self_id)
    parent.classList.add("active")
    showSubLevel(parent_id, self_id, self_tag)

    /*
    TODO re-add if neeed
    const tiles = document.getElementById('tablet-tiles-'+ parent_id)
    tiles?.classList.remove("d-none")
    */
  }
   async function hideLevelsTablet(t1_flag, t2_flag, t3_flag) {

      if (t1_flag) {
        await removeActives('', 't1')
        const lvl_2 = document.querySelectorAll(`[id^=t2-]`)
        lvl_2.forEach(element => {
          element.classList.add("d-none")
        })
      }
    if (t2_flag) {
      await removeActives('', 't2')
      const lvl_3 = document.querySelectorAll(`[id^=t3-]`)
      lvl_3.forEach(element => {
        element.classList.add("d-none")
      })
    }
    if (t3_flag) {
      await removeActives('', 't3')
      const lvl_4 = document.querySelectorAll(`[id^=t4-]`)
      lvl_4.forEach(element => {
        element.classList.add("d-none")
      })
    }
    const tiles = document.querySelectorAll(`[id^=tablet-tiles-]`)
    tiles.forEach(element => {
      element.classList.add("d-none")
    })
    return;
  }

   async function hideSubLevelsTablet(parent_id, parent_tag, self_tag) {
    await removeActives(parent_id, parent_tag)
    const brothers = document.querySelectorAll(`[id^=${self_tag}-${parent_id}]`)
    brothers.forEach(element => {
      element.classList.add("d-none")
    })
    return;
  }

  /**********************
  *   Mobile NAV        *
  ***********************/

   function openMobileNav() {
    toggleNav()
  }
   function mobileHideAll(){

    const main = document.getElementById('main-mobile-nav')
    main.classList.add("d-none")

    const lvl_2 = document.querySelectorAll(`[id^=m2-]`)
    lvl_2.forEach(element => {
      element.classList.add("d-none")
    })
    const lvl_3 = document.querySelectorAll(`[id^=m3-]`)
    lvl_3.forEach(element => {
      element.classList.add("d-none")
    })
    const lvl_4 = document.querySelectorAll(`[id^=m4-]`)
    lvl_4.forEach(element => {
      element.classList.add("d-none")
    })
    return;
  }
   async function mobileShowLevel(parent_tag,self_tag,parent_id){
    //hide all
    await mobileHideAll()
    //show correct
    const self_element = document.getElementById(self_tag + '-' + parent_id)
    self_element.classList.remove("d-none")
  }
   function goBackMobileMain(parent_tag,self_tag,parent_id){

    const self_element = document.getElementById(self_tag  + '-' + parent_id)
    self_element.classList.add("d-none")
    const parent_element = document.getElementById(parent_tag)
    parent_element.classList.remove("d-none")
  }

   function goBackMobile(parent_tag,self_tag,parent_id,self_id){

    const self_element = document.getElementById(self_tag  + '-' + parent_id + '-' +self_id)
    self_element.classList.add("d-none")

    const parent_element = document.getElementById(parent_tag + '-' + parent_id)
    parent_element.classList.remove("d-none")
  }
   function goBackMobile4(parent_tag,self_tag,parent_id,self_id,extra_id){
    const self_element = document.getElementById(self_tag  + '-' + parent_id + '-' +self_id +'-'+ extra_id)
    self_element.classList.add("d-none")

    const parent_element = document.getElementById(parent_tag + '-' + parent_id+ '-' + self_id)
    parent_element.classList.remove("d-none")
  }
