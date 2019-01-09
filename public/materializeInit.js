document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems);
  var el = document.querySelector('.tabs')
  var instance = M.Tabs.init(el);

});
