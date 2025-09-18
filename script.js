document.addEventListener('DOMContentLoaded', () => {
  const state = {
    personal: {
      fullName: '',
      jobTitle: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      summary: '',
    },
    experiences: [],
    educations: [],
    skills: [],
  };

  const previewTargets = {
    fullName: document.querySelector('[data-preview="fullName"]'),
    jobTitle: document.querySelector('[data-preview="jobTitle"]'),
    email: document.querySelector('[data-preview="email"]'),
    phone: document.querySelector('[data-preview="phone"]'),
    location: document.querySelector('[data-preview="location"]'),
    website: document.querySelector('[data-preview="website"]'),
    summary: document.querySelector('[data-preview="summary"]'),
  };

  const resumeForm = document.getElementById('resume-form');
  const experiencesContainer = document.getElementById('experience-fields');
  const educationContainer = document.getElementById('education-fields');
  const skillTagsContainer = document.getElementById('skill-tags');
  const previewExperience = document.getElementById('preview-experience');
  const previewEducation = document.getElementById('preview-education');
  const previewSkills = document.getElementById('preview-skills');
  const experienceEmpty = document.getElementById('experience-empty');
  const educationEmpty = document.getElementById('education-empty');
  const skillsEmpty = document.getElementById('skills-empty');
  const skillInput = document.getElementById('skill-input');
  const downloadBtn = document.getElementById('download-btn');

  const placeholders = {

    fullName: 'John doe',
    jobTitle: 'Professional Title',
    email: 'you@example.com',
    phone: '+91',
    
    location: 'City, Country',
    website: 'portfolio.website',
    summary:
      'Write a short introduction about yourself, highlighting your top strengths and goals.',
  };

  const cleanText = (value) => (typeof value === 'string' ? value.trim() : '');

  const createExperienceTemplate = () => ({
    title: '',
    company: '',
    location: '',
    start: '',
    end: '',
    description: '',
  });

  const createEducationTemplate = () => ({
    program: '',
    school: '',
    year: '',
    details: '',
  });

  const hasDetails = (record) =>
    Object.values(record)
      .map((value) => (typeof value === 'string' ? value.trim() : ''))
      .some(Boolean);

  const formatMonth = (value) => {
    if (!value || typeof value !== 'string') return '';
    const [year, month] = value.split('-');
    if (!year || !month) return value;
    const monthIndex = Number(month) - 1;
    if (Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) return value;
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${monthNames[monthIndex]} ${year}`;
  };

  const formatDuration = (start, end) => {
    const startText = formatMonth(start);
    const endText = formatMonth(end);
    if (startText && endText) return `${startText} – ${endText}`;
    if (startText) return `${startText} – Present`;
    if (endText) return `Until ${endText}`;
    return '';
  };

  const parseLines = (value) =>
    typeof value === 'string'
      ? value
          .split(/\n+/)
          .map((line) => line.trim())
          .filter(Boolean)
      : [];

  const textOrPlaceholder = (value, placeholder) =>
    typeof value === 'string' && value.trim() ? value.trim() : placeholder;

  const buildInputGroup = (labelText, options = {}) => {
    const { type = 'text', value = '', placeholder = '', rows = 3, onInput } = options;
    const wrapper = document.createElement('label');
    wrapper.className = 'input-group';

    const label = document.createElement('span');
    label.textContent = labelText;

    let control;
    if (type === 'textarea') {
      control = document.createElement('textarea');
      control.rows = rows;
    } else {
      control = document.createElement('input');
      control.type = type;
    }

    if (placeholder) control.placeholder = placeholder;
    control.value = value || '';
    control.addEventListener('input', (event) => {
      onInput?.(event.target.value);
    });

    wrapper.append(label, control);
    return { wrapper, control };
  };

  const updatePreview = () => {
    Object.entries(previewTargets).forEach(([key, element]) => {
      if (!element) return;
      const content = key === 'summary' ? state.personal.summary : state.personal[key];
      element.textContent = textOrPlaceholder(content, placeholders[key]);
    });

    previewExperience.innerHTML = '';
    const filledExperiences = state.experiences.filter((experience) => hasDetails(experience));
    if (filledExperiences.length === 0) {
      experienceEmpty?.classList.remove('hidden');
    } else {
      experienceEmpty?.classList.add('hidden');
      filledExperiences.forEach((experience) => {
        const item = document.createElement('article');
        item.className = 'timeline-item';

        const header = document.createElement('div');
        header.className = 'timeline-header';

        const title = document.createElement('h4');
        title.className = 'timeline-title';
        title.textContent = cleanText(experience.title) || 'Role';
        header.appendChild(title);

        const duration = formatDuration(experience.start, experience.end);
        if (duration) {
          const durationEl = document.createElement('p');
          durationEl.className = 'timeline-duration';
          durationEl.textContent = duration;
          header.appendChild(durationEl);
        }

        item.appendChild(header);

        const metaParts = [];
        const company = cleanText(experience.company);
        const location = cleanText(experience.location);
        if (company) metaParts.push(company);
        if (location) metaParts.push(location);
        if (metaParts.length) {
          const meta = document.createElement('p');
          meta.className = 'timeline-meta';
          meta.textContent = metaParts.join(' • ');
          item.appendChild(meta);
        }

        const highlights = parseLines(experience.description);
        if (highlights.length) {
          const list = document.createElement('ul');
          list.className = 'timeline-highlights';
          highlights.forEach((highlight) => {
            const listItem = document.createElement('li');
            listItem.textContent = highlight;
            list.appendChild(listItem);
          });
          item.appendChild(list);
        }

        previewExperience.appendChild(item);
      });
    }

    previewEducation.innerHTML = '';
    const filledEducations = state.educations.filter((education) => hasDetails(education));
    if (filledEducations.length === 0) {
      educationEmpty?.classList.remove('hidden');
    } else {
      educationEmpty?.classList.add('hidden');
      filledEducations.forEach((education) => {
        const card = document.createElement('div');
        card.className = 'education-item';

        const title = document.createElement('h4');
        title.className = 'education-title';
        title.textContent = cleanText(education.program) || 'Program';
        card.appendChild(title);

        const metaParts = [];
        const school = cleanText(education.school);
        const years = cleanText(education.year);
        if (school) metaParts.push(school);
        if (years) metaParts.push(years);
        if (metaParts.length) {
          const meta = document.createElement('p');
          meta.className = 'education-meta';
          meta.textContent = metaParts.join(' • ');
          card.appendChild(meta);
        }

        const notesLines = parseLines(education.details);
        if (notesLines.length) {
          const notes = document.createElement('p');
          notes.className = 'education-notes';
          notesLines.forEach((segment, index) => {
            notes.append(segment);
            if (index < notesLines.length - 1) {
              notes.appendChild(document.createElement('br'));
            }
          });
          card.appendChild(notes);
        }

        previewEducation.appendChild(card);
      });
    }

    previewSkills.innerHTML = '';
    if (state.skills.length === 0) {
      skillsEmpty?.classList.remove('hidden');
    } else {
      skillsEmpty?.classList.add('hidden');
      state.skills.forEach((skill) => {
        const pill = document.createElement('span');
        pill.textContent = skill;
        previewSkills.appendChild(pill);
      });
    }
  };

  const renderExperienceFields = () => {
    experiencesContainer.innerHTML = '';
    if (state.experiences.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'form-empty';
      empty.textContent = 'Click “Add Role” to include your professional experience.';
      experiencesContainer.appendChild(empty);
      return;
    }

    state.experiences.forEach((experience, index) => {
      const card = document.createElement('div');
      card.className = 'field-card';

      const header = document.createElement('div');
      header.className = 'field-card-header';
      const heading = document.createElement('h3');
      heading.textContent = cleanText(experience.title) || `Role ${index + 1}`;
      header.appendChild(heading);

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'icon-button';
      removeBtn.textContent = 'Remove role';
      removeBtn.addEventListener('click', () => {
        state.experiences.splice(index, 1);
        renderExperienceFields();
        updatePreview();
      });
      header.appendChild(removeBtn);
      card.appendChild(header);

      const grid = document.createElement('div');
      grid.className = 'card-grid';

      const titleGroup = buildInputGroup('Job Title', {
        value: experience.title,
        placeholder: 'Product Designer',
        onInput: (value) => {
          state.experiences[index].title = value;
          heading.textContent = cleanText(value) || `Role ${index + 1}`;
          updatePreview();
        },
      });
      grid.appendChild(titleGroup.wrapper);

      const companyGroup = buildInputGroup('Company', {
        value: experience.company,

        placeholder: 'Company',

        onInput: (value) => {
          state.experiences[index].company = value;
          updatePreview();
        },
      });
      grid.appendChild(companyGroup.wrapper);

      const locationGroup = buildInputGroup('Location', {
        value: experience.location,
        placeholder: 'Remote / City',
        onInput: (value) => {
          state.experiences[index].location = value;
          updatePreview();
        },
      });
      grid.appendChild(locationGroup.wrapper);

      const startGroup = buildInputGroup('Start', {
        type: 'month',
        value: experience.start,
        onInput: (value) => {
          state.experiences[index].start = value;
          updatePreview();
        },
      });
      grid.appendChild(startGroup.wrapper);

      const endGroup = buildInputGroup('End', {
        type: 'month',
        value: experience.end,
        onInput: (value) => {
          state.experiences[index].end = value;
          updatePreview();
        },
      });
      grid.appendChild(endGroup.wrapper);

      card.appendChild(grid);

      const descriptionGroup = buildInputGroup('Highlights', {
        type: 'textarea',
        rows: 4,
        value: experience.description,
        placeholder: 'Share your biggest wins. Use new lines to add separate highlights.',
        onInput: (value) => {
          state.experiences[index].description = value;
          updatePreview();
        },
      });
      card.appendChild(descriptionGroup.wrapper);

      experiencesContainer.appendChild(card);
    });
  };

  const renderEducationFields = () => {
    educationContainer.innerHTML = '';
    if (state.educations.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'form-empty';
      empty.textContent = 'Add a program to feature your academic milestones.';
      educationContainer.appendChild(empty);
      return;
    }

    state.educations.forEach((education, index) => {
      const card = document.createElement('div');
      card.className = 'field-card';

      const header = document.createElement('div');
      header.className = 'field-card-header';
      const heading = document.createElement('h3');
      heading.textContent = cleanText(education.program) || `Program ${index + 1}`;
      header.appendChild(heading);

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'icon-button';
      removeBtn.textContent = 'Remove program';
      removeBtn.addEventListener('click', () => {
        state.educations.splice(index, 1);
        renderEducationFields();
        updatePreview();
      });
      header.appendChild(removeBtn);
      card.appendChild(header);

      const grid = document.createElement('div');
      grid.className = 'card-grid';

      const programGroup = buildInputGroup('Program', {
        value: education.program,
        placeholder: 'B.S. in Computer Science',
        onInput: (value) => {
          state.educations[index].program = value;
          heading.textContent = cleanText(value) || `Program ${index + 1}`;
          updatePreview();
        },
      });
      grid.appendChild(programGroup.wrapper);

      const schoolGroup = buildInputGroup('Institution', {
        value: education.school,
        placeholder: 'University of Somewhere',
        onInput: (value) => {
          state.educations[index].school = value;
          updatePreview();
        },
      });
      grid.appendChild(schoolGroup.wrapper);

      const yearGroup = buildInputGroup('Years', {
        value: education.year,
        placeholder: '2019 – 2023',
        onInput: (value) => {
          state.educations[index].year = value;
          updatePreview();
        },
      });
      grid.appendChild(yearGroup.wrapper);

      card.appendChild(grid);

      const detailsGroup = buildInputGroup('Highlights', {
        type: 'textarea',
        rows: 3,
        value: education.details,
        placeholder: 'List noteworthy courses, honors, or extracurriculars.',
        onInput: (value) => {
          state.educations[index].details = value;
          updatePreview();
        },
      });
      card.appendChild(detailsGroup.wrapper);

      educationContainer.appendChild(card);
    });
  };

  const renderSkillTags = () => {
    skillTagsContainer.innerHTML = '';
    if (state.skills.length === 0) {
      const hint = document.createElement('p');
      hint.className = 'form-empty';
      hint.textContent = 'Add your top abilities to curate a focused skill set.';
      skillTagsContainer.appendChild(hint);
      return;
    }

    state.skills.forEach((skill, index) => {
      const tag = document.createElement('div');
      tag.className = 'skill-tag';

      const label = document.createElement('span');
      label.textContent = skill;
      tag.appendChild(label);

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.setAttribute('aria-label', `Remove ${skill}`);
      removeBtn.textContent = '×';
      removeBtn.addEventListener('click', () => {
        state.skills.splice(index, 1);
        renderSkillTags();
        updatePreview();
      });

      tag.appendChild(removeBtn);
      skillTagsContainer.appendChild(tag);
    });
  };

  const addSkill = () => {
    const value = skillInput.value.trim();
    if (!value) return;
    const exists = state.skills.some((skill) => skill.toLowerCase() === value.toLowerCase());
    if (exists) {
      skillInput.value = '';
      return;
    }
    state.skills.push(value);
    skillInput.value = '';
    renderSkillTags();
    updatePreview();
  };

  document.querySelectorAll('[data-section="personal"]').forEach((input) => {
    const field = input.dataset.field;
    input.addEventListener('input', (event) => {
      state.personal[field] = event.target.value;
      updatePreview();
    });
  });

  resumeForm?.addEventListener('submit', (event) => event.preventDefault());

  document.getElementById('add-experience')?.addEventListener('click', () => {
    state.experiences.push(createExperienceTemplate());
    renderExperienceFields();
  });

  document.getElementById('add-education')?.addEventListener('click', () => {
    state.educations.push(createEducationTemplate());
    renderEducationFields();
  });

  document.getElementById('add-skill')?.addEventListener('click', addSkill);

  skillInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addSkill();
    }
  });

  downloadBtn?.addEventListener('click', async () => {
    if (!window.html2canvas || !window.jspdf) {
      console.warn('PDF libraries are not ready yet.');
      return;
    }

    const preview = document.getElementById('preview-card');
    if (!preview) return;

    const originalText = downloadBtn.textContent;
    downloadBtn.disabled = true;
    downloadBtn.textContent = 'Preparing…';

    try {
      const canvas = await window.html2canvas(preview, {
        scale: 2,
        backgroundColor: '#ffffff',
      });
      const image = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'pt', 'a4');

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pageWidth / canvas.width, (pageHeight - 80) / canvas.height);
      const imgWidth = canvas.width * ratio;
      const imgHeight = canvas.height * ratio;
      const x = (pageWidth - imgWidth) / 2;
      const y = 40;

      pdf.addImage(image, 'PNG', x, y, imgWidth, imgHeight);
      const filename = `${textOrPlaceholder(state.personal.fullName, 'resume')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error('Failed to create PDF', error);
    } finally {
      downloadBtn.disabled = false;
      downloadBtn.textContent = originalText;
    }
  });

  state.experiences.push(createExperienceTemplate());
  state.educations.push(createEducationTemplate());
  renderExperienceFields();
  renderEducationFields();
  renderSkillTags();
  updatePreview();
});
