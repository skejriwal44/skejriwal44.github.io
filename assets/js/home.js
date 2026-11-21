// Scrollable panels on the homepage: fade hint while more content is below,
// and a toggle to expand a panel to its full height.
document.addEventListener('DOMContentLoaded', function () {
  var panels = document.querySelectorAll('.scroll-panel');

  Array.prototype.forEach.call(panels, function (panel) {
    var count = panel.querySelectorAll(':scope > li, tr').length;
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'panel-toggle';
    button.setAttribute('aria-expanded', 'false');
    panel.insertAdjacentElement('afterend', button);

    // A list that only just overflows is shown in full rather than clipped.
    if (panel.scrollHeight < panel.clientHeight * 1.75) {
      panel.classList.add('expanded');
      button.remove();
      return;
    }

    function update() {
      var expanded = panel.classList.contains('expanded');
      var overflowing = panel.scrollHeight - panel.clientHeight > 8;
      panel.classList.toggle('can-scroll', overflowing);
      panel.classList.toggle('at-start', panel.scrollTop <= 4);
      panel.classList.toggle('at-end', panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 8);
      button.hidden = !expanded && !overflowing;
      button.textContent = expanded ? 'Collapse' : 'Show all ' + count;
    }

    button.addEventListener('click', function () {
      var expanded = panel.classList.toggle('expanded');
      button.setAttribute('aria-expanded', String(expanded));
      if (!expanded) {
        panel.scrollTop = 0;
        panel.closest('section, .publications').scrollIntoView({ block: 'start' });
      }
      update();
    });

    panel.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    panel.addEventListener('click', function () { setTimeout(update, 250); });
    update();
    window.addEventListener('load', update);
  });

  // Abstract toggles are links without an href; make them keyboard-operable.
  Array.prototype.forEach.call(document.querySelectorAll('a.abstract'), function (link) {
    link.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        link.click();
      }
    });
  });
});
