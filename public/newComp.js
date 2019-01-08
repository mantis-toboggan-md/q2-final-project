document.addEventListener('DOMContentLoaded', function() {

  let privateComp = document.querySelector('#privateBtn')
  let privateOpts = document.querySelector('#privateOpts')
  let publicComp = document.querySelector('#publicBtn')

  const showOptions = ()=>{
    privateOpts.style.display = 'block'
  }

  const hideOptions = ()=>{
    privateOpts.style.display = 'none'
  }

  privateComp.addEventListener('click', showOptions)
  publicComp.addEventListener('click', hideOptions)
})
