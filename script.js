(() => {
  'use strict';
  const nav = document.querySelector('.profile-nav');
  const toast = document.querySelector('#toast');
  const dialog = document.querySelector('#research-dialog');
  let toastTimer;
  let returnFocus;
  function announce(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('visible');
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 2800);
  }
  const sections = [...document.querySelectorAll('main > section[id]')].filter(section => nav.querySelector(`a[href="#${section.id}"]`));
  function updateActiveLink() {
    const position = window.scrollY + 130;
    let active = sections[0];
    for (const section of sections) if (section.offsetTop <= position) active = section;
    if (document.documentElement.scrollHeight > window.innerHeight + 6 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 6) active = sections[sections.length - 1];
    nav.querySelectorAll('a').forEach(link => {
      const current = link.hash === `#${active.id}`;
      link.classList.toggle('active', current);
      if (current) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  window.addEventListener('resize', updateActiveLink, { passive: true });
  updateActiveLink();
  const research = {
    '4dsynth': {
      kicker:'EDITABLE 4D ENVIRONMENTS · ICRA 2027 UNDER REVIEW',
      title:'4DSynth: Controllable Procedural World Synthesis',
      content:`<img class="dialog-image" src="assets/4dsynth.png" alt="4DSynth overview with scene, actor and camera control"><p class="figure-note">System overview from the 4DSynth paper.</p><div class="detail-copy"><h3>A shared geometric state, from scene to simulation.</h3><p>4DSynth turns text, a layout, or a single image into editable 3D scenes with time-varying actors and cameras. The scene representation connects procedural generation, actor trajectories, camera planning, and physics-ready export.</p><p>The central idea is to plan on the finished scene geometry, so later components use the same spatial state and measured actor dimensions.</p><div class="paper-links"><a href="https://arxiv.org/abs/2608.26947" target="_blank" rel="noopener">Read the paper ↗</a><a href="https://qzephyr.github.io/4DSynth/" target="_blank" rel="noopener">Project & demonstrations ↗</a><a href="https://github.com/QZepHyr/4DSynth" target="_blank" rel="noopener">Code ↗</a></div></div>`
    },
    hai: {
      kicker:'VIDEO UNDERSTANDING · ACM MULTIMEDIA 2024',
      title:'HAI: Hidden Intention Localization in Pre-abnormal Analysis',
      content:`<img class="dialog-image" src="assets/hai.png" alt="The HAI dataset and Temporal Intention Localization task"><p class="figure-note">Dataset and task overview from Predicting the Unseen (ACM MM 2024).</p><div class="detail-copy"><h3>Localizing the cues that precede an event.</h3><p>HAI organizes observable pre-abnormal behavior into fine-grained cues and supports Temporal Intention Localization over untrimmed videos. The task studies how cues accumulate across time, alongside conventional action boundaries.</p><div class="paper-links"><a href="https://doi.org/10.1145/3664647.3681113" target="_blank" rel="noopener">Read the paper ↗</a><a href="https://github.com/Zzz99999/Hidden_Abnormal_Intention" target="_blank" rel="noopener">Dataset & annotations ↗</a></div></div>`
    }
  };
  const citations = {
    '4dsynth': `@misc{qi2026_4dsynth,\n  title={4DSynth: Controllable Procedural World Synthesis for Dynamic Embodied Simulation},\n  author={Qi, Zehao and Luo, Haochen and Bian, Jia-Wang and Ma, Zeyu and Sun, Shuyang},\n  year={2026},\n  eprint={2608.26947},\n  archivePrefix={arXiv},\n  primaryClass={cs.RO},\n  url={https://arxiv.org/abs/2608.26947}\n}`,
    hai: `@inproceedings{qi2024predicting,\n  title={Predicting the Unseen: A Novel Dataset for Hidden Intention Localization in Pre-abnormal Analysis},\n  author={Qi, Zehao and Zhang, Ruixu and Hu, Xinyi and Liu, Wenxuan and Wang, Zheng},\n  booktitle={Proceedings of the 32nd ACM International Conference on Multimedia},\n  year={2024},\n  doi={10.1145/3664647.3681113}\n}`
  };
  function openDialog(kicker, title) {
    returnFocus = document.activeElement;
    document.querySelector('#dialog-kicker').textContent = kicker;
    document.querySelector('#dialog-title').textContent = title;
    document.body.classList.add('dialog-open');
    dialog.showModal();
    dialog.scrollTop = 0;
  }
  document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
    const project = research[button.dataset.project];
    document.querySelector('#dialog-content').innerHTML = project.content;
    openDialog(project.kicker, project.title);
  }));
  document.querySelectorAll('[data-citation]').forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.citation;
    const content = document.querySelector('#dialog-content');
    content.replaceChildren();
    const pre = document.createElement('pre');
    pre.className = 'citation-text'; pre.textContent = citations[key];
    const copy = document.createElement('button');
    copy.type = 'button'; copy.className = 'copy-citation'; copy.textContent = 'Copy BibTeX';
    copy.addEventListener('click', () => copyText(citations[key], 'BibTeX copied.', pre));
    content.append(pre, copy);
    openDialog('CITATION', key === '4dsynth' ? '4DSynth' : 'Predicting the Unseen');
  }));
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); if (returnFocus) returnFocus.focus({preventScroll:true}); });
  async function copyText(text, success, fallbackElement) {
    try { await navigator.clipboard.writeText(text); announce(success); }
    catch {
      if (fallbackElement) { const range = document.createRange(); range.selectNodeContents(fallbackElement); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); }
      announce('Please select and copy the text.');
    }
  }
})();
