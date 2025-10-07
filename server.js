const path = require('path');
const fs = require('fs/promises');
const express = require('express');
const cors = require('cors');
const { v4: uuid } = require('uuid');

const app = express();
const PORT = process.env.PORT || 4000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'resumes.json');

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname));

const readResumes = async () => {
  try {
    const buffer = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(buffer);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed;
    }
    return {};
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {};
    }
    throw error;
  }
};

const writeResumes = async (data) => {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
};

const normalizePersonal = (personal = {}) => ({
  fullName: typeof personal.fullName === 'string' ? personal.fullName.trim() : '',
  jobTitle: typeof personal.jobTitle === 'string' ? personal.jobTitle.trim() : '',
  email: typeof personal.email === 'string' ? personal.email.trim() : '',
  phone: typeof personal.phone === 'string' ? personal.phone.trim() : '',
  location: typeof personal.location === 'string' ? personal.location.trim() : '',
  website: typeof personal.website === 'string' ? personal.website.trim() : '',
  summary: typeof personal.summary === 'string' ? personal.summary.trim() : '',
});

const normalizeArrayOfObjects = (value, template) => {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && typeof item === 'object')
    .map((item) => ({ ...template(), ...item }));
};

const normalizeExperiences = (experiences) =>
  normalizeArrayOfObjects(experiences, () => ({
    title: '',
    company: '',
    location: '',
    start: '',
    end: '',
    description: '',
  }));

const normalizeEducations = (educations) =>
  normalizeArrayOfObjects(educations, () => ({
    program: '',
    school: '',
    year: '',
    details: '',
  }));

const normalizeSkills = (skills) => {
  if (!Array.isArray(skills)) return [];
  return skills
    .map((skill) => (typeof skill === 'string' ? skill.trim() : ''))
    .filter(Boolean);
};

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/resumes', async (req, res, next) => {
  try {
    const payload = req.body || {};
    const resume = {
      personal: normalizePersonal(payload.personal),
      experiences: normalizeExperiences(payload.experiences),
      educations: normalizeEducations(payload.educations),
      skills: normalizeSkills(payload.skills),
      savedAt: new Date().toISOString(),
    };

    const resumes = await readResumes();
    const id = uuid();
    resumes[id] = resume;
    await writeResumes(resumes);

    res.status(201).json({ id });
  } catch (error) {
    next(error);
  }
});

app.get('/api/resumes', async (_req, res, next) => {
  try {
    const resumes = await readResumes();
    const list = Object.entries(resumes).map(([id, resume]) => ({
      id,
      savedAt: resume.savedAt,
      fullName: resume.personal?.fullName || '',
      jobTitle: resume.personal?.jobTitle || '',
    }));
    res.json(list);
  } catch (error) {
    next(error);
  }
});

app.get('/api/resumes/:id', async (req, res, next) => {
  try {
    const resumes = await readResumes();
    const resume = resumes[req.params.id];
    if (!resume) {
      return res.status(404).json({ message: 'Draft not found' });
    }
    res.json(resume);
  } catch (error) {
    next(error);
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Unexpected server error' });
});

app.listen(PORT, () => {
  console.log(`Resume backend listening on http://localhost:${PORT}`);
});
