(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const content = window.SITE_CONTENT || {};
  const node = (tag, text) => {
    const result = document.createElement(tag);
    result.textContent = text;
    return result;
  };

  // Keep visible insertion notices until real copy is supplied. Never interpret HTML.
  document.querySelectorAll('[data-copy]').forEach(target => {
    const value = content[target.dataset.copy];
    if (typeof value !== 'string' || !value.trim()) return;
    target.replaceChildren(...value.split(/\n\s*\n/).filter(text => text.trim()).map(text => node('p', text.trim())));
  });
  const references = Array.isArray(content.references) ? content.references.filter(ref => typeof ref.formattedASA === 'string' && ref.formattedASA.trim()) : [];
  if (references.length) {
    const list = document.createElement('ol');
    references.forEach(ref => {
      const item = node('li', ref.formattedASA);
      if (/^https:\/\//i.test(ref.doiOrUrl || '')) {
        const link = node('a', 'Source / DOI');
        link.href = ref.doiOrUrl;
        item.append(document.createTextNode(' '), link);
      }
      list.append(item);
    });
    $('reference-list').replaceChildren(list);
  }

  const form = $('profile-form');
  const choices = [...document.querySelectorAll('[name="profile-choice"]')];
  const reveal = $('profile-reveal');
  const trigger = $('reveal-profile');
  form.hidden = false;
  choices.forEach(choice => choice.addEventListener('change', () => {
    $('profile-error').hidden = true;
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    const selected = choices.find(choice => choice.checked);
    if (!selected) {
      $('profile-error').hidden = false;
      choices[0].focus();
      return;
    }
    $('profile-error').hidden = true;
    $('activity-status').textContent = '';
    $('profile-selection').textContent = `You chose: Profile ${selected.value}.`;
    $('profile-title').textContent = 'Same Person, Different Profile';
    reveal.hidden = false;
    $('profile-grid').classList.add('revealed');
    $('profile-choices').disabled = true;
    trigger.disabled = true;
    trigger.setAttribute('aria-expanded', 'true');
    // Focus announces the reveal heading without repeating the full debrief as a live region.
    $('profile-reveal-heading').focus();
  });
  $('reset-profile').addEventListener('click', () => {
    choices.forEach(choice => { choice.checked = false; });
    $('profile-choices').disabled = false;
    trigger.disabled = false;
    trigger.setAttribute('aria-expanded', 'false');
    reveal.hidden = true;
    $('profile-error').hidden = true;
    $('profile-selection').textContent = '';
    $('profile-title').textContent = 'Different profiles. First impressions.';
    $('profile-grid').classList.remove('revealed');
    $('activity-status').textContent = 'Activity reset. No profile is selected.';
    choices[0].focus();
  });

  const load = $('load-video');
  load.hidden = false;
  load.addEventListener('click', () => {
    if ($('iframe-slot').children.length) return;
    const frame = document.createElement('iframe');
    frame.src = 'https://www.youtube-nocookie.com/embed/m9PiPlRuy6E';
    frame.title = 'Inside OKCupid: The math of online dating — Christian Rudder, TED-Ed';
    frame.allow = 'encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    $('iframe-slot').replaceChildren(frame);
    $('video-player').hidden = false;
    load.setAttribute('aria-expanded', 'true');
    load.disabled = true;
    $('player-heading').focus();
  });
  $('close-video').addEventListener('click', () => {
    $('iframe-slot').replaceChildren();
    $('video-player').hidden = true;
    load.disabled = false;
    load.setAttribute('aria-expanded', 'false');
    load.focus();
  });
})();
